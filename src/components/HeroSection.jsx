import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { useSiteImages } from '../lib/siteImages.jsx';

const HeroSection = () => {
    const containerRef = useRef(null);
    const { images } = useSiteImages();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    // Parallax effects
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('Olá! Gostaria de agendar uma avaliação.');
        window.open(`https://wa.me/5519990037678?text=${message}`, '_blank');
    };

    // Text reveal animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.5 },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
    };

    const headlineText = 'Transformando';
    const highlightText = 'beleza';
    const endText = 'em confiança';

    return (
        <section
            ref={containerRef}
            id="inicio"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Parallax Background Image */}
            <motion.div
                className="absolute inset-0"
                style={{ y: backgroundY }}
            >
                <img
                    src={images.hero || '/images/dra.paulasatoo-20251210-0005.jpg'}
                    alt="Dra. Paula Satoo - Estética Avançada"
                    className="w-full h-[120%] object-cover"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-sage-500/80 via-sage/70 to-sage-500/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent" />
            </motion.div>

            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gold/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 container mx-auto px-4 lg:px-8 text-center"
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-4xl mx-auto"
                >
                    {/* Pre-title */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gold font-medium tracking-widest uppercase text-sm mb-6"
                    >
                        Farmacêutica Esteta em Indaiatuba
                    </motion.p>

                    {/* Animated Headline */}
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight overflow-hidden">
                        <motion.span className="inline-block" variants={containerVariants}>
                            {headlineText.split('').map((letter, i) => (
                                <motion.span key={i} variants={letterVariants} className="inline-block">
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.span>{' '}
                        <motion.span
                            className="inline-block text-gold"
                            variants={containerVariants}
                        >
                            {highlightText.split('').map((letter, i) => (
                                <motion.span key={i} variants={letterVariants} className="inline-block">
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.span>{' '}
                        <motion.span className="inline-block" variants={containerVariants}>
                            {endText.split('').map((letter, i) => (
                                <motion.span key={i} variants={letterVariants} className="inline-block">
                                    {letter === ' ' ? '\u00A0' : letter}
                                </motion.span>
                            ))}
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Harmonização Facial sem exageros e resultados naturais.
                        Realce a sua beleza com técnicas avançadas e personalizadas.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            onClick={handleWhatsAppClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 px-8 py-4 bg-gold text-white font-medium 
                       rounded-lg transition-all duration-300 hover:bg-gold-500 
                       hover:shadow-gold"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Agendar via WhatsApp
                        </motion.button>
                        <motion.a
                            href="#tratamentos"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-8 py-4 border-2 border-white/50 
                       text-white font-medium rounded-lg transition-all duration-300 
                       hover:bg-white/10 hover:border-white"
                        >
                            Conheça os Tratamentos
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <a
                        href="#sobre"
                        className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
                        aria-label="Rolar para próxima seção"
                    >
                        <span className="text-sm font-medium">Saiba mais</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </motion.div>
                    </a>
                </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
                className="absolute top-1/4 right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-1/4 left-10 w-96 h-96 bg-sage-300/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 7, repeat: Infinity }}
            />
        </section>
    );
};

export default HeroSection;
