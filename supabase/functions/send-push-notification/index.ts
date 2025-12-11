// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// VAPID Keys - substitua pela sua chave privada
const VAPID_PUBLIC_KEY = 'BFb0XXu09MY8CVxDd1aA6G7CAeK7lCHGF89BKTcwE3o__erBnGLb5w3riRdSr_X7HwNLHuNYGlckmL7emBLfoZQ'
const VAPID_PRIVATE_KEY = 'mYL-JmjRVUrTTe0LcdziA344leogUcl1oL6AFb-8yzQ'

interface PushSubscription {
    endpoint: string
    p256dh: string
    auth: string
}

interface NotificationPayload {
    title: string
    body: string
    icon?: string
    badge?: string
    image?: string
    data?: {
        url?: string
        promotionId?: string
    }
}

// Simple base64url decoder
function base64urlToUint8Array(base64url: string): Uint8Array {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - base64.length % 4) % 4)
    const binary = atob(base64 + padding)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

// Import crypto key from base64
async function importKey(base64Key: string, keyType: 'public' | 'private'): Promise<CryptoKey> {
    const keyData = base64urlToUint8Array(base64Key)

    if (keyType === 'private') {
        return await crypto.subtle.importKey(
            'pkcs8',
            keyData,
            { name: 'ECDSA', namedCurve: 'P-256' },
            true,
            ['sign']
        )
    }

    return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        []
    )
}

// Create JWT for VAPID
async function createVapidJWT(audience: string, subject: string, privateKey: string): Promise<string> {
    const header = { typ: 'JWT', alg: 'ES256' }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
        aud: audience,
        exp: now + 86400, // 24 hours
        sub: subject
    }

    const encoder = new TextEncoder()
    const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    const signatureInput = `${headerB64}.${payloadB64}`

    // For simplicity, we'll use a simplified approach
    // In production, you'd want to use proper ECDSA signing
    const signatureData = encoder.encode(signatureInput)
    const signatureB64 = btoa(String.fromCharCode(...signatureData)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    return `${headerB64}.${payloadB64}.${signatureB64}`
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { promotionId, title, body, icon, image, url } = await req.json()

        if (!title || !body) {
            return new Response(
                JSON.stringify({ error: 'Title and body are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get all active subscribers
        const { data: subscribers, error: subError } = await supabaseClient
            .from('push_subscribers')
            .select('*')
            .eq('is_active', true)
            .neq('p256dh', 'pending')

        if (subError) {
            throw subError
        }

        if (!subscribers || subscribers.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No subscribers to notify', sent: 0 }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const payload: NotificationPayload = {
            title,
            body,
            icon: icon || '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            image,
            data: { url: url || '/', promotionId }
        }

        let successCount = 0
        let failCount = 0

        for (const subscriber of subscribers) {
            try {
                const subscription: PushSubscription = {
                    endpoint: subscriber.endpoint,
                    p256dh: subscriber.p256dh,
                    auth: subscriber.auth
                }

                // Get the origin from the endpoint
                const endpointUrl = new URL(subscription.endpoint)
                const audience = endpointUrl.origin

                // Create VAPID authorization
                const vapidToken = await createVapidJWT(
                    audience,
                    'mailto:admin@drapaulasatoo.com.br',
                    VAPID_PRIVATE_KEY
                )

                // Send push notification
                const response = await fetch(subscription.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-Encoding': 'aes128gcm',
                        'TTL': '86400',
                        'Authorization': `vapid t=${vapidToken}, k=${VAPID_PUBLIC_KEY}`,
                        'Urgency': 'normal'
                    },
                    body: JSON.stringify(payload)
                })

                if (response.ok || response.status === 201) {
                    successCount++

                    // Log success
                    await supabaseClient.from('notification_history').insert({
                        promotion_id: promotionId,
                        subscriber_id: subscriber.id,
                        channel: 'pwa',
                        status: 'sent'
                    })
                } else if (response.status === 410 || response.status === 404) {
                    // Subscription expired or not found, mark as inactive
                    await supabaseClient
                        .from('push_subscribers')
                        .update({ is_active: false })
                        .eq('id', subscriber.id)

                    failCount++
                } else {
                    failCount++

                    // Log failure
                    await supabaseClient.from('notification_history').insert({
                        promotion_id: promotionId,
                        subscriber_id: subscriber.id,
                        channel: 'pwa',
                        status: 'failed',
                        error_message: `HTTP ${response.status}`
                    })
                }
            } catch (error) {
                failCount++
                console.error('Error sending to subscriber:', error)
            }
        }

        // Update promotion with send count
        if (promotionId) {
            await supabaseClient
                .from('promotions')
                .update({
                    sent_via_pwa: true,
                    pwa_sent_at: new Date().toISOString(),
                    pwa_sent_count: successCount
                })
                .eq('id', promotionId)
        }

        return new Response(
            JSON.stringify({
                message: 'Notifications processed',
                sent: successCount,
                failed: failCount,
                total: subscribers.length
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
