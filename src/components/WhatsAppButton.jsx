import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    const handleClick = () => {
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os tratamentos.');
        window.open(`https://wa.me/5519990037678?text=${message}`, '_blank');
    };

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring' }}
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center justify-center w-16 h-16 
                 bg-green-500 text-white rounded-full shadow-lg 
                 hover:bg-green-600 transition-colors group"
            aria-label="Contato via WhatsApp"
        >
            {/* Pulse animation ring */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />

            <MessageCircle className="w-7 h-7 relative z-10" />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-4 py-2 bg-charcoal text-white text-sm 
                       rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 
                       transition-opacity duration-300 pointer-events-none">
                Fale conosco!
            </span>
        </motion.button>
    );
};

export default WhatsAppButton;
