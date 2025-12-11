import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Check, Share2, PlusSquare, MoreVertical } from 'lucide-react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [deviceType, setDeviceType] = useState('desktop'); // 'ios', 'android', 'desktop'

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Detect device type
        const userAgent = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setDeviceType('ios');
        } else if (/android/.test(userAgent)) {
            setDeviceType('android');
        } else {
            setDeviceType('desktop');
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowModal(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Native install prompt available
            setIsInstalling(true);
            try {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    setIsInstalled(true);
                    setShowModal(false);
                }
            } catch (error) {
                console.error('Install prompt error:', error);
            } finally {
                setIsInstalling(false);
                setDeferredPrompt(null);
            }
        } else {
            // Show manual installation instructions
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Don't render if already installed
    if (isInstalled) return null;

    const getInstructions = () => {
        switch (deviceType) {
            case 'ios':
                return {
                    title: 'Instalar no iPhone/iPad',
                    steps: [
                        { icon: <Share2 className="w-5 h-5" />, text: 'Toque no botão Compartilhar na barra do Safari' },
                        { icon: <PlusSquare className="w-5 h-5" />, text: 'Role para baixo e toque em "Adicionar à Tela de Início"' },
                        { icon: <Check className="w-5 h-5" />, text: 'Toque em "Adicionar" para confirmar' }
                    ]
                };
            case 'android':
                return {
                    title: 'Instalar no Android',
                    steps: [
                        { icon: <MoreVertical className="w-5 h-5" />, text: 'Toque no menu (⋮) do navegador' },
                        { icon: <PlusSquare className="w-5 h-5" />, text: 'Toque em "Adicionar à tela inicial" ou "Instalar app"' },
                        { icon: <Check className="w-5 h-5" />, text: 'Confirme a instalação' }
                    ]
                };
            default:
                return {
                    title: 'Instalar no Computador',
                    steps: [
                        { icon: <Download className="w-5 h-5" />, text: 'Clique no ícone de instalação na barra de endereços' },
                        { icon: <PlusSquare className="w-5 h-5" />, text: 'Ou acesse o menu do navegador e clique "Instalar"' },
                        { icon: <Check className="w-5 h-5" />, text: 'Confirme clicando em "Instalar"' }
                    ]
                };
        }
    };

    const instructions = getInstructions();

    return (
        <>
            {/* Floating Install Button - Always visible */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="fixed bottom-36 lg:bottom-44 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-sage to-sage-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-label="Instalar App"
            >
                {isInstalling ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Download className="w-5 h-5" />
                    </motion.div>
                ) : (
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                )}
                <span className="hidden sm:inline font-medium text-sm">
                    {isInstalling ? 'Instalando...' : 'Instalar App'}
                </span>
            </motion.button>

            {/* Installation Instructions Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
                        >
                            <div className="bg-white dark:bg-charcoal-light rounded-3xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="relative bg-gradient-to-br from-sage to-sage-dark p-6 text-white">
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                        aria-label="Fechar"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                            <Smartphone className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{instructions.title}</h3>
                                            <p className="text-white/80 text-sm mt-1">
                                                Acesso rápido ao app da Dra. Paula Satoo
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="p-6 space-y-4">
                                    <p className="text-charcoal-light dark:text-cream/70 text-sm mb-4">
                                        Siga os passos abaixo para instalar nosso app:
                                    </p>

                                    {instructions.steps.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 p-4 bg-cream dark:bg-charcoal rounded-xl"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-sage/20 dark:bg-sage/30 flex items-center justify-center text-sage flex-shrink-0">
                                                {step.icon}
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs font-semibold text-sage uppercase tracking-wide">
                                                    Passo {index + 1}
                                                </span>
                                                <p className="text-charcoal dark:text-cream text-sm mt-1">
                                                    {step.text}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Benefits */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-rose-gold/10 to-sage/10 dark:from-rose-gold/20 dark:to-sage/20 rounded-xl">
                                        <h4 className="font-semibold text-charcoal dark:text-cream text-sm mb-2">
                                            ✨ Benefícios do App:
                                        </h4>
                                        <ul className="text-sm text-charcoal-light dark:text-cream/70 space-y-1">
                                            <li>• Acesso rápido sem abrir o navegador</li>
                                            <li>• Funciona mesmo offline</li>
                                            <li>• Experiência de app nativo</li>
                                            <li>• Ocupa pouco espaço no dispositivo</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-6">
                                    <button
                                        onClick={closeModal}
                                        className="w-full py-3 bg-gradient-to-r from-sage to-sage-dark text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Entendi!
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {isInstalled && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-xl shadow-lg"
                    >
                        <Check className="w-5 h-5" />
                        <span className="font-medium">App instalado com sucesso!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default InstallPWA;
