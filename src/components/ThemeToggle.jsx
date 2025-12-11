import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={toggleDarkMode}
            className="fixed top-24 right-4 lg:right-6 z-40 w-12 h-12 rounded-full 
               bg-white dark:bg-charcoal shadow-soft flex items-center justify-center
               hover:shadow-card transition-all group"
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                {isDarkMode ? (
                    <Sun className="w-5 h-5 text-gold" />
                ) : (
                    <Moon className="w-5 h-5 text-sage-500" />
                )}
            </motion.div>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-charcoal dark:bg-white 
                     text-white dark:text-charcoal text-xs rounded-lg whitespace-nowrap 
                     opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isDarkMode ? 'Modo claro' : 'Modo escuro'}
            </span>
        </motion.button>
    );
};

export default ThemeToggle;
