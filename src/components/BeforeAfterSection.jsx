import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteImages } from '../lib/siteImages.jsx';

const BeforeAfterSection = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const { images } = useSiteImages();

    const comparisons = [
        {
            id: 1,
            title: 'Harmonização Facial',
            description: 'Resultado natural e harmonioso',
            before: images['before-after-1-before'] || '/images/dra.paulasatoo-20251210-0022.jpg',
            after: images['before-after-1-after'] || '/images/dra.paulasatoo-20251210-0023.jpg',
        },
        {
            id: 2,
            title: 'Preenchimento Labial',
            description: 'Volume e definição equilibrados',
            before: images['before-after-2-before'] || '/images/dra.paulasatoo-20251210-0024.jpg',
            after: images['before-after-2-after'] || '/images/dra.paulasatoo-20251210-0025.jpg',
        },
        {
            id: 3,
            title: 'Bioestimuladores',
            description: 'Rejuvenescimento progressivo',
            before: images['before-after-3-before'] || '/images/dra.paulasatoo-20251210-0026.jpg',
            after: images['before-after-3-after'] || '/images/dra.paulasatoo-20251210-0027.jpg',
        },
    ];

    const handleMouseMove = (e) => {
        if (!isDragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % comparisons.length);
        setSliderPosition(50);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + comparisons.length) % comparisons.length);
        setSliderPosition(50);
    };

    return (
        <section className="py-20 lg:py-32 bg-cream dark:bg-charcoal/95">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Transformações
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mt-4 mb-6">
                        Antes & <span className="text-gold">Depois</span>
                    </h2>
                    <p className="text-charcoal/70 dark:text-white/70 max-w-2xl mx-auto">
                        Arraste para comparar os resultados. Cada procedimento é único e personalizado.
                    </p>
                </AnimatedSection>

                <div className="max-w-4xl mx-auto">
                    {/* Slider Container */}
                    <motion.div
                        ref={containerRef}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card cursor-ew-resize select-none"
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onTouchMove={handleTouchMove}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* After Image (Background) */}
                        <img
                            src={comparisons[activeIndex].after}
                            alt="Depois"
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable={false}
                        />

                        {/* Before Image (Clipped) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <img
                                src={comparisons[activeIndex].before}
                                alt="Antes"
                                className="absolute inset-0 w-full h-full object-cover"
                                draggable={false}
                            />
                        </div>

                        {/* Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                                <div className="flex gap-1">
                                    <ChevronLeft className="w-4 h-4 text-charcoal" />
                                    <ChevronRight className="w-4 h-4 text-charcoal" />
                                </div>
                            </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-charcoal/80 text-white text-sm rounded-full">
                            Antes
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-white text-sm rounded-full">
                            Depois
                        </div>
                    </motion.div>

                    {/* Info & Navigation */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full bg-sage/20 dark:bg-white/10 flex items-center justify-center 
                       hover:bg-sage/30 transition-colors"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-6 h-6 text-charcoal dark:text-white" />
                        </button>

                        <div className="text-center">
                            <h3 className="font-serif text-xl font-semibold text-charcoal dark:text-white">
                                {comparisons[activeIndex].title}
                            </h3>
                            <p className="text-charcoal/60 dark:text-white/60 text-sm">
                                {comparisons[activeIndex].description}
                            </p>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full bg-sage/20 dark:bg-white/10 flex items-center justify-center 
                       hover:bg-sage/30 transition-colors"
                            aria-label="Próximo"
                        >
                            <ChevronRight className="w-6 h-6 text-charcoal dark:text-white" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {comparisons.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => { setActiveIndex(index); setSliderPosition(50); }}
                                className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                    ? 'w-8 bg-gold'
                                    : 'bg-charcoal/20 dark:bg-white/20 hover:bg-charcoal/40'
                                    }`}
                                aria-label={`Ir para comparação ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BeforeAfterSection;
