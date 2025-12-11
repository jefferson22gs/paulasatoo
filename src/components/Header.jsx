import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar } from 'lucide-react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Início', href: '#inicio' },
        { name: 'Sobre', href: '#sobre' },
        { name: 'Tratamentos', href: '#tratamentos' },
        { name: 'Resultados', href: '#resultados' },
        { name: 'Contato', href: '#contato' },
    ];

    const handleScheduleClick = () => {
        // Scroll suave até a seção de agendamento
        const agendamentoSection = document.getElementById('agendamento');
        if (agendamentoSection) {
            agendamentoSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Fechar menu mobile se estiver aberto
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-soft py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="#inicio" className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className={`font-serif text-2xl font-semibold tracking-wide transition-colors ${isScrolled ? 'text-gold' : 'text-white'
                                    }`}>
                                    PS
                                </span>
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className={`font-serif text-lg font-medium transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'
                                    }`}>
                                    Dra. Paula Satoo
                                </span>
                                <span className={`text-xs tracking-widest uppercase transition-colors ${isScrolled ? 'text-charcoal/60' : 'text-white/80'
                                    }`}>
                                    Estética Avançada
                                </span>
                            </div>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`font-medium transition-colors fancy-underline ${isScrolled
                                        ? 'text-charcoal hover:text-gold'
                                        : 'text-white/90 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden lg:block">
                            <button
                                onClick={handleScheduleClick}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-gold text-gold 
                         font-medium rounded-lg transition-all duration-300 
                         hover:bg-gold hover:text-white"
                            >
                                <Calendar className="w-4 h-4" />
                                Agendar Avaliação
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'
                                }`}
                            aria-label="Abrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-cream z-50 lg:hidden shadow-2xl"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-6 border-b border-sage/10">
                                    <span className="font-serif text-xl text-gold">Menu</span>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 text-charcoal hover:text-gold transition-colors"
                                        aria-label="Fechar menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <nav className="flex-1 p-6">
                                    <ul className="space-y-4">
                                        {navLinks.map((link, index) => (
                                            <motion.li
                                                key={link.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <a
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block py-3 text-lg font-medium text-charcoal hover:text-gold transition-colors"
                                                >
                                                    {link.name}
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </nav>
                                <div className="p-6 border-t border-sage/10">
                                    <button
                                        onClick={handleScheduleClick}
                                        className="w-full btn-primary"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Agendar Avaliação
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
