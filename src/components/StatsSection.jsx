import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Users, Sparkles, Award, Heart } from 'lucide-react';

const CounterItem = ({ icon: Icon, end, suffix = '', label, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(easeOutQuart * (end - startValue) + startValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Icon className="w-8 h-8 text-gold" />
            </div>
            <div className="font-serif text-4xl lg:text-5xl font-bold text-charcoal dark:text-white mb-2">
                {count.toLocaleString()}{suffix}
            </div>
            <p className="text-charcoal/60 dark:text-white/60">{label}</p>
        </motion.div>
    );
};

const StatsSection = () => {
    const stats = [
        { icon: Users, end: 500, suffix: '+', label: 'Pacientes Atendidas' },
        { icon: Sparkles, end: 1200, suffix: '+', label: 'Procedimentos Realizados' },
        { icon: Award, end: 5, suffix: '', label: 'Anos de Experiência' },
        { icon: Heart, end: 98, suffix: '%', label: 'Satisfação' },
    ];

    return (
        <section className="py-16 lg:py-24 bg-sage dark:bg-sage-600 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
                        Números que <span className="text-gold-300">Inspiram Confiança</span>
                    </h2>
                </AnimatedSection>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <CounterItem
                            key={index}
                            icon={stat.icon}
                            end={stat.end}
                            suffix={stat.suffix}
                            label={stat.label}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
