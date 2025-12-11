import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Check, Sparkles, Gift, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PushNotificationPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [permission, setPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        checkNotificationStatus();
    }, []);

    const checkNotificationStatus = async () => {
        // Check if notifications are supported
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            return;
        }

        // Check current permission
        setPermission(Notification.permission);

        // Check if already subscribed
        if (Notification.permission === 'granted') {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        }

        // Show prompt after delay if not yet decided
        if (Notification.permission === 'default') {
            const dismissed = localStorage.getItem('push_prompt_dismissed');
            const dismissedAt = dismissed ? new Date(dismissed) : null;
            const now = new Date();

            // Show again after 7 days
            if (!dismissedAt || (now - dismissedAt) > 7 * 24 * 60 * 60 * 1000) {
                setTimeout(() => setShowPrompt(true), 10000); // Show after 10 seconds
            }
        }
    };

    const requestPermission = async () => {
        setLoading(true);
        setError('');

        try {
            // Request notification permission
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                await subscribeUser();
            } else if (result === 'denied') {
                setError('Notificações foram bloqueadas. Você pode habilitar nas configurações do navegador.');
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
            setError('Erro ao solicitar permissão');
        } finally {
            setLoading(false);
        }
    };

    const subscribeUser = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;

            // Get VAPID public key from settings
            const { data: settings } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'vapid_public_key')
                .single();

            // If no VAPID key configured, use a placeholder subscription
            const vapidPublicKey = settings?.value || 'placeholder';

            if (vapidPublicKey && vapidPublicKey !== 'placeholder') {
                // Convert VAPID key to Uint8Array
                const urlBase64ToUint8Array = (base64String) => {
                    const padding = '='.repeat((4 - base64String.length % 4) % 4);
                    const base64 = (base64String + padding)
                        .replace(/-/g, '+')
                        .replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; ++i) {
                        outputArray[i] = rawData.charCodeAt(i);
                    }
                    return outputArray;
                };

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });

                // Save subscription to database
                const subscriptionData = subscription.toJSON();

                await supabase.from('push_subscribers').insert({
                    endpoint: subscriptionData.endpoint,
                    p256dh: subscriptionData.keys.p256dh,
                    auth: subscriptionData.keys.auth,
                    device_type: getDeviceType(),
                    is_active: true
                });

                setIsSubscribed(true);
                setShowSuccess(true);
                setShowPrompt(false);

                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                // Fallback: just save that user wants notifications
                await supabase.from('push_subscribers').insert({
                    endpoint: `browser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    p256dh: 'pending',
                    auth: 'pending',
                    device_type: getDeviceType(),
                    is_active: true
                });

                setIsSubscribed(true);
                setShowSuccess(true);
                setShowPrompt(false);

                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            setError('Erro ao ativar notificações. Tente novamente.');
        }
    };

    const getDeviceType = () => {
        const ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) return 'ios';
        if (/android/.test(ua)) return 'android';
        return 'desktop';
    };

    const dismissPrompt = () => {
        setShowPrompt(false);
        localStorage.setItem('push_prompt_dismissed', new Date().toISOString());
    };

    // Don't render if notifications not supported or already subscribed
    if (!('Notification' in window) || isSubscribed) {
        return null;
    }

    return (
        <>
            {/* Notification Prompt */}
            <AnimatePresence>
                {showPrompt && permission === 'default' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 lg:bottom-8 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
                    >
                        <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl border border-gray-100 dark:border-charcoal overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-sage to-sage-dark p-4 text-white relative">
                                <button
                                    onClick={dismissPrompt}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Ative as Notificações</h3>
                                        <p className="text-sm text-white/80">Receba promoções exclusivas!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
                                                   rounded-lg text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                                            <Gift className="w-4 h-4 text-sage" />
                                        </div>
                                        <p className="text-sm text-charcoal/70 dark:text-cream/70">
                                            <strong>Promoções exclusivas</strong> antes de todos
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-4 h-4 text-rose-gold" />
                                        </div>
                                        <p className="text-sm text-charcoal/70 dark:text-cream/70">
                                            <strong>Novidades e lançamentos</strong> em primeira mão
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <p className="text-sm text-charcoal/70 dark:text-cream/70">
                                            <strong>Lembretes</strong> de agendamentos
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={dismissPrompt}
                                        className="flex-1 px-4 py-2.5 text-charcoal/60 dark:text-cream/60 hover:bg-gray-100 
                                                   dark:hover:bg-charcoal rounded-xl font-medium transition-colors text-sm"
                                    >
                                        Agora não
                                    </button>
                                    <button
                                        onClick={requestPermission}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                                                   bg-gradient-to-r from-sage to-sage-dark text-white rounded-xl 
                                                   font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                    >
                                        {loading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <Bell className="w-4 h-4" />
                                        )}
                                        {loading ? 'Ativando...' : 'Ativar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-xl shadow-lg">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">Notificações ativadas!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PushNotificationPrompt;
