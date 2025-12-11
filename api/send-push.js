import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Configuração VAPID
const VAPID_PUBLIC_KEY = 'BFb0XXu09MY8CVxDd1aA6G7CAeK7lCHGF89BKTcwE3o__erBnGLb5w3riRdSr_X7HwNLHuNYGlckmL7emBLfoZQ';
const VAPID_PRIVATE_KEY = 'mYL-JmjRVUrTTe0LcdziA344leogUcl1oL6AFb-8yzQ';

webpush.setVapidDetails(
    'mailto:admin@drapaulasatoo.com.br',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { promotionId, title, body, icon, image, url } = req.body;

        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }

        // Criar cliente Supabase
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Buscar assinantes ativos
        const { data: subscribers, error: subError } = await supabase
            .from('push_subscribers')
            .select('*')
            .eq('is_active', true)
            .neq('p256dh', 'pending');

        if (subError) {
            console.error('Error fetching subscribers:', subError);
            return res.status(500).json({ error: 'Error fetching subscribers' });
        }

        if (!subscribers || subscribers.length === 0) {
            return res.status(200).json({ message: 'No subscribers to notify', sent: 0 });
        }

        const payload = JSON.stringify({
            title,
            body,
            icon: icon || '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            image,
            data: { url: url || '/', promotionId }
        });

        let successCount = 0;
        let failCount = 0;

        for (const subscriber of subscribers) {
            try {
                const pushSubscription = {
                    endpoint: subscriber.endpoint,
                    keys: {
                        p256dh: subscriber.p256dh,
                        auth: subscriber.auth
                    }
                };

                await webpush.sendNotification(pushSubscription, payload);
                successCount++;

                // Registrar sucesso
                await supabase.from('notification_history').insert({
                    promotion_id: promotionId,
                    subscriber_id: subscriber.id,
                    channel: 'pwa',
                    status: 'sent'
                });

            } catch (error) {
                console.error('Error sending to subscriber:', error);
                failCount++;

                // Se o erro for 410 (Gone) ou 404, o subscriber não existe mais
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await supabase
                        .from('push_subscribers')
                        .update({ is_active: false })
                        .eq('id', subscriber.id);
                }

                // Registrar falha
                await supabase.from('notification_history').insert({
                    promotion_id: promotionId,
                    subscriber_id: subscriber.id,
                    channel: 'pwa',
                    status: 'failed',
                    error_message: error.message || 'Unknown error'
                });
            }
        }

        // Atualizar promoção com contagem de envios
        if (promotionId) {
            await supabase
                .from('promotions')
                .update({
                    sent_via_pwa: true,
                    pwa_sent_at: new Date().toISOString(),
                    pwa_sent_count: successCount
                })
                .eq('id', promotionId);
        }

        return res.status(200).json({
            message: 'Notifications processed',
            sent: successCount,
            failed: failCount,
            total: subscribers.length
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
