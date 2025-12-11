import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Maria Clara S.',
            treatment: 'Harmonização Facial',
            image: '/images/dra.paulasatoo-20251210-0031.jpg',
            rating: 5,
            text: 'Resultado incrível e super natural! A Dra. Paula tem mãos de fada e entendeu exatamente o que eu queria. Me sinto mais confiante e bonita.',
        },
        {
            id: 2,
            name: 'Juliana M.',
            treatment: 'Preenchimento Labial',
            image: '/images/dra.paulasatoo-20251210-0032.jpg',
            rating: 5,
            text: 'Sempre tive medo de procedimentos estéticos, mas a Dra. Paula me deixou super tranquila. O resultado ficou lindo e natural, exatamente como eu sonhava!',
        },
        {
            id: 3,
            name: 'Fernanda R.',
            treatment: 'Bioestimuladores',
            image: '/images/dra.paulasatoo-20251210-0033.jpg',
            rating: 5,
            text: 'Fiz bioestimuladores e estou amando o resultado! Minha pele está muito mais firme e com viço. Atendimento impecável do início ao fim.',
        },
        {
            id: 4,
            name: 'Carolina T.',
            treatment: 'Skinbooster',
            image: '/images/dra.paulasatoo-20251210-0034.jpg',
            rating: 5,
            text: 'A hidratação profunda do Skinbooster transformou minha pele. Nunca esteve tão bonita! Recomendo demais a Dra. Paula.',
        },
    ];

    const nextSlide = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-play
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <section className="py-20 lg:py-32 bg-sage/10 dark:bg-charcoal/90 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Depoimentos
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mt-4 mb-6">
                        O Que Dizem Nossas <span className="text-gold">Pacientes</span>
                    </h2>
                </AnimatedSection>

                <div className="relative max-w-4xl mx-auto">
                    {/* Testimonial Card */}
                    <div className="relative min-h-[400px] flex items-center">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="bg-white dark:bg-charcoal/50 rounded-3xl shadow-card p-8 lg:p-12 w-full">
                                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                                        {/* Image */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gold/30">
                                                <img
                                                    src={testimonials[activeIndex].image}
                                                    alt={testimonials[activeIndex].name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold rounded-full 
                                    flex items-center justify-center shadow-lg">
                                                <Quote className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 text-center lg:text-left">
                                            {/* Stars */}
                                            <div className="flex justify-center lg:justify-start gap-1 mb-4">
                                                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                                                ))}
                                            </div>

                                            {/* Quote */}
                                            <blockquote className="text-lg lg:text-xl text-charcoal/80 dark:text-white/80 
                                           italic leading-relaxed mb-6">
                                                "{testimonials[activeIndex].text}"
                                            </blockquote>

                                            {/* Author */}
                                            <div>
                                                <p className="font-serif text-xl font-semibold text-charcoal dark:text-white">
                                                    {testimonials[activeIndex].name}
                                                </p>
                                                <p className="text-gold text-sm">
                                                    {testimonials[activeIndex].treatment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full bg-white dark:bg-charcoal/50 shadow-soft 
                       flex items-center justify-center hover:bg-sage/20 transition-colors"
                            aria-label="Depoimento anterior"
                        >
                            <ChevronLeft className="w-6 h-6 text-charcoal dark:text-white" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => { setDirection(index > activeIndex ? 1 : -1); setActiveIndex(index); }}
                                    className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                            ? 'w-8 bg-gold'
                                            : 'bg-charcoal/20 dark:bg-white/20 hover:bg-charcoal/40'
                                        }`}
                                    aria-label={`Ir para depoimento ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full bg-white dark:bg-charcoal/50 shadow-soft 
                       flex items-center justify-center hover:bg-sage/20 transition-colors"
                            aria-label="Próximo depoimento"
                        >
                            <ChevronRight className="w-6 h-6 text-charcoal dark:text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
