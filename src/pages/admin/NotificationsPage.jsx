import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Send,
    MessageSquare,
    Smartphone,
    Users,
    Plus,
    Trash2,
    Eye,
    Calendar,
    Percent,
    Link,
    ImageIcon,
    CheckCircle,
    AlertCircle,
    X,
    RefreshCw,
    Clock,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NotificationsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [subscribers, setSubscribers] = useState({ pwa: [], whatsapp: [] });
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [expandedPromotion, setExpandedPromotion] = useState(null);

    const [newPromotion, setNewPromotion] = useState({
        title: '',
        message: '',
        image_url: '',
        link_url: '',
        discount_percentage: '',
        valid_until: '',
        send_pwa: true,
        send_whatsapp: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load promotions
            const { data: promos, error: promosError } = await supabase
                .from('promotions')
                .select('*')
                .order('created_at', { ascending: false });

            if (promosError) throw promosError;
            setPromotions(promos || []);

            // Load PWA subscribers
            const { data: pwaSubscribers, error: pwaError } = await supabase
                .from('push_subscribers')
                .select('*')
                .eq('is_active', true);

            if (pwaError) console.error('Error loading PWA subscribers:', pwaError);

            // Load WhatsApp subscribers
            const { data: whatsappSubscribers, error: waError } = await supabase
                .from('whatsapp_subscribers')
                .select('*')
                .eq('is_active', true);

            if (waError) console.error('Error loading WhatsApp subscribers:', waError);

            setSubscribers({
                pwa: pwaSubscribers || [],
                whatsapp: whatsappSubscribers || []
            });
        } catch (error) {
            console.error('Error loading data:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar dados' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setNewPromotion(prev => ({ ...prev, [field]: value }));
    };

    const handleCreatePromotion = async () => {
        if (!newPromotion.title || !newPromotion.message) {
            setMessage({ type: 'error', text: 'Título e mensagem são obrigatórios' });
            return;
        }

        setSending(true);
        try {
            // Create promotion
            const { data: promotion, error } = await supabase
                .from('promotions')
                .insert({
                    title: newPromotion.title,
                    message: newPromotion.message,
                    image_url: newPromotion.image_url || null,
                    link_url: newPromotion.link_url || null,
                    discount_percentage: newPromotion.discount_percentage ? parseInt(newPromotion.discount_percentage) : null,
                    valid_until: newPromotion.valid_until || null,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;

            // Send notifications
            let pwaSuccess = 0;
            let whatsappSuccess = 0;

            if (newPromotion.send_pwa && subscribers.pwa.length > 0) {
                pwaSuccess = await sendPushNotifications(promotion);
            }

            if (newPromotion.send_whatsapp && subscribers.whatsapp.length > 0) {
                whatsappSuccess = await sendWhatsAppNotifications(promotion);
            }

            // Update promotion with send counts
            await supabase
                .from('promotions')
                .update({
                    sent_via_pwa: newPromotion.send_pwa,
                    sent_via_whatsapp: newPromotion.send_whatsapp,
                    pwa_sent_at: newPromotion.send_pwa ? new Date().toISOString() : null,
                    whatsapp_sent_at: newPromotion.send_whatsapp ? new Date().toISOString() : null,
                    pwa_sent_count: pwaSuccess,
                    whatsapp_sent_count: whatsappSuccess
                })
                .eq('id', promotion.id);

            setMessage({
                type: 'success',
                text: `Promoção criada! PWA: ${pwaSuccess} enviados, WhatsApp: ${whatsappSuccess} enviados`
            });

            // Reset form and reload
            setNewPromotion({
                title: '',
                message: '',
                image_url: '',
                link_url: '',
                discount_percentage: '',
                valid_until: '',
                send_pwa: true,
                send_whatsapp: false
            });
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error creating promotion:', error);
            setMessage({ type: 'error', text: 'Erro ao criar promoção' });
        } finally {
            setSending(false);
        }
    };

    const sendPushNotifications = async (promotion) => {
        let successCount = 0;

        for (const subscriber of subscribers.pwa) {
            try {
                // In a real implementation, this would call your backend API
                // that uses web-push library to send notifications
                const payload = {
                    title: promotion.title,
                    body: promotion.message,
                    icon: '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                    image: promotion.image_url,
                    data: {
                        url: promotion.link_url || '/',
                        promotionId: promotion.id
                    }
                };

                // Log the notification (simulated send)
                await supabase.from('notification_history').insert({
                    promotion_id: promotion.id,
                    subscriber_id: subscriber.id,
                    channel: 'pwa',
                    status: 'sent',
                    sent_at: new Date().toISOString()
                });

                successCount++;
            } catch (error) {
                console.error('Error sending push to subscriber:', error);
                await supabase.from('notification_history').insert({
                    promotion_id: promotion.id,
                    subscriber_id: subscriber.id,
                    channel: 'pwa',
                    status: 'failed',
                    error_message: error.message
                });
            }
        }

        return successCount;
    };

    const sendWhatsAppNotifications = async (promotion) => {
        let successCount = 0;

        for (const subscriber of subscribers.whatsapp) {
            try {
                // Get WhatsApp API settings
                const { data: settings } = await supabase
                    .from('settings')
                    .select('*')
                    .in('key', ['whatsapp_api_url', 'whatsapp_api_token', 'whatsapp']);

                const settingsMap = settings?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}) || {};

                if (settingsMap.whatsapp_api_url && settingsMap.whatsapp_api_token) {
                    // Call your WhatsApp API
                    const response = await fetch(settingsMap.whatsapp_api_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${settingsMap.whatsapp_api_token}`
                        },
                        body: JSON.stringify({
                            phone: subscriber.phone,
                            message: `🎉 *${promotion.title}*\n\n${promotion.message}${promotion.discount_percentage ? `\n\n💰 *${promotion.discount_percentage}% de desconto!*` : ''}${promotion.valid_until ? `\n\n⏰ Válido até: ${new Date(promotion.valid_until).toLocaleDateString('pt-BR')}` : ''}${promotion.link_url ? `\n\n🔗 Saiba mais: ${promotion.link_url}` : ''}`
                        })
                    });

                    if (response.ok) {
                        successCount++;
                    }
                }

                // Log to history
                await supabase.from('notification_history').insert({
                    promotion_id: promotion.id,
                    channel: 'whatsapp',
                    phone: subscriber.phone,
                    status: 'sent',
                    sent_at: new Date().toISOString()
                });

            } catch (error) {
                console.error('Error sending WhatsApp to subscriber:', error);
                await supabase.from('notification_history').insert({
                    promotion_id: promotion.id,
                    channel: 'whatsapp',
                    phone: subscriber.phone,
                    status: 'failed',
                    error_message: error.message
                });
            }
        }

        return successCount;
    };

    const resendPromotion = async (promotion, channel) => {
        setSending(true);
        try {
            let successCount = 0;

            if (channel === 'pwa') {
                successCount = await sendPushNotifications(promotion);
                await supabase
                    .from('promotions')
                    .update({
                        sent_via_pwa: true,
                        pwa_sent_at: new Date().toISOString(),
                        pwa_sent_count: promotion.pwa_sent_count + successCount
                    })
                    .eq('id', promotion.id);
            } else {
                successCount = await sendWhatsAppNotifications(promotion);
                await supabase
                    .from('promotions')
                    .update({
                        sent_via_whatsapp: true,
                        whatsapp_sent_at: new Date().toISOString(),
                        whatsapp_sent_count: promotion.whatsapp_sent_count + successCount
                    })
                    .eq('id', promotion.id);
            }

            setMessage({
                type: 'success',
                text: `${successCount} notificações enviadas via ${channel.toUpperCase()}`
            });
            loadData();
        } catch (error) {
            console.error('Error resending:', error);
            setMessage({ type: 'error', text: 'Erro ao reenviar notificações' });
        } finally {
            setSending(false);
        }
    };

    const deletePromotion = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;

        try {
            const { error } = await supabase
                .from('promotions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Promoção excluída com sucesso' });
            loadData();
        } catch (error) {
            console.error('Error deleting promotion:', error);
            setMessage({ type: 'error', text: 'Erro ao excluir promoção' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Notificações & Promoções</h1>
                    <p className="text-charcoal/60 mt-1">Envie promoções para clientes via PWA e WhatsApp</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage to-sage-dark 
                               text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Nova Promoção
                </button>
            </div>

            {/* Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">{subscribers.pwa.length}</p>
                            <p className="text-sm text-charcoal/60">Assinantes PWA</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">{subscribers.whatsapp.length}</p>
                            <p className="text-sm text-charcoal/60">Assinantes WhatsApp</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">{promotions.length}</p>
                            <p className="text-sm text-charcoal/60">Promoções Criadas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-charcoal">
                                {subscribers.pwa.length + subscribers.whatsapp.length}
                            </p>
                            <p className="text-sm text-charcoal/60">Total de Alcance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Promotions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                        <Bell className="w-5 h-5 text-sage" />
                        Histórico de Promoções
                    </h2>
                </div>

                {promotions.length === 0 ? (
                    <div className="p-12 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-charcoal/60">Nenhuma promoção criada ainda</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 text-sage font-medium hover:underline"
                        >
                            Criar primeira promoção
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {promotions.map((promo) => (
                            <div key={promo.id} className="p-6">
                                <div
                                    className="flex items-start justify-between cursor-pointer"
                                    onClick={() => setExpandedPromotion(expandedPromotion === promo.id ? null : promo.id)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-charcoal">{promo.title}</h3>
                                            {promo.discount_percentage && (
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                    {promo.discount_percentage}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-charcoal/60 line-clamp-2">{promo.message}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-charcoal/50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(promo.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                            {promo.sent_via_pwa && (
                                                <span className="flex items-center gap-1 text-blue-600">
                                                    <Smartphone className="w-3 h-3" />
                                                    PWA: {promo.pwa_sent_count}
                                                </span>
                                            )}
                                            {promo.sent_via_whatsapp && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <MessageSquare className="w-3 h-3" />
                                                    WhatsApp: {promo.whatsapp_sent_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {expandedPromotion === promo.id ? (
                                            <ChevronUp className="w-5 h-5 text-charcoal/40" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-charcoal/40" />
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedPromotion === promo.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 pt-4 border-t border-gray-100"
                                        >
                                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                                {promo.image_url && (
                                                    <div className="flex items-center gap-2 text-sm text-charcoal/60">
                                                        <ImageIcon className="w-4 h-4" />
                                                        <a href={promo.image_url} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline truncate">
                                                            Ver imagem
                                                        </a>
                                                    </div>
                                                )}
                                                {promo.link_url && (
                                                    <div className="flex items-center gap-2 text-sm text-charcoal/60">
                                                        <Link className="w-4 h-4" />
                                                        <a href={promo.link_url} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline truncate">
                                                            {promo.link_url}
                                                        </a>
                                                    </div>
                                                )}
                                                {promo.valid_until && (
                                                    <div className="flex items-center gap-2 text-sm text-charcoal/60">
                                                        <Clock className="w-4 h-4" />
                                                        Válido até: {new Date(promo.valid_until).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => resendPromotion(promo, 'pwa')}
                                                    disabled={sending || subscribers.pwa.length === 0}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
                                                               rounded-lg text-sm font-medium hover:bg-blue-100 
                                                               transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    Reenviar PWA ({subscribers.pwa.length})
                                                </button>
                                                <button
                                                    onClick={() => resendPromotion(promo, 'whatsapp')}
                                                    disabled={sending || subscribers.whatsapp.length === 0}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 
                                                               rounded-lg text-sm font-medium hover:bg-green-100 
                                                               transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    Reenviar WhatsApp ({subscribers.whatsapp.length})
                                                </button>
                                                <button
                                                    onClick={() => deletePromotion(promo.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 
                                                               rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Excluir
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Promotion Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-4 px-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                                    <h2 className="text-xl font-bold text-charcoal">Nova Promoção</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                            Título da Promoção *
                                        </label>
                                        <input
                                            type="text"
                                            value={newPromotion.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Ex: Super Promoção de Fim de Ano!"
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                   focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                            Mensagem *
                                        </label>
                                        <textarea
                                            value={newPromotion.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            placeholder="Descreva sua promoção..."
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                   focus:border-sage focus:ring-0 outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Discount and Valid Until */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                                <Percent className="w-4 h-4 inline mr-1" />
                                                Desconto (%)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={newPromotion.discount_percentage}
                                                onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
                                                placeholder="Ex: 20"
                                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                Válido até
                                            </label>
                                            <input
                                                type="date"
                                                value={newPromotion.valid_until}
                                                onChange={(e) => handleInputChange('valid_until', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Image and Link */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                                <ImageIcon className="w-4 h-4 inline mr-1" />
                                                URL da Imagem
                                            </label>
                                            <input
                                                type="url"
                                                value={newPromotion.image_url}
                                                onChange={(e) => handleInputChange('image_url', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                                <Link className="w-4 h-4 inline mr-1" />
                                                Link de Destino
                                            </label>
                                            <input
                                                type="url"
                                                value={newPromotion.link_url}
                                                onChange={(e) => handleInputChange('link_url', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Send Channels */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal/70 mb-3">
                                            Canais de Envio
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newPromotion.send_pwa}
                                                    onChange={(e) => handleInputChange('send_pwa', e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="w-5 h-5 text-blue-500" />
                                                    <span>PWA Push ({subscribers.pwa.length})</span>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newPromotion.send_whatsapp}
                                                    onChange={(e) => handleInputChange('send_whatsapp', e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="w-5 h-5 text-green-500" />
                                                    <span>WhatsApp ({subscribers.whatsapp.length})</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 text-charcoal/70 hover:bg-gray-100 rounded-xl 
                                               font-medium transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreatePromotion}
                                        disabled={sending || !newPromotion.title || !newPromotion.message}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage to-sage-dark 
                                               text-white rounded-xl font-semibold hover:opacity-90 transition-all 
                                               disabled:opacity-50"
                                    >
                                        {sending ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                        {sending ? 'Enviando...' : 'Criar e Enviar'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationsPage;
