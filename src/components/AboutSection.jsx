import AnimatedSection from './AnimatedSection';
import { Award, Heart, Sparkles } from 'lucide-react';

const AboutSection = () => {
    const highlights = [
        {
            icon: Award,
            title: 'Expertise',
            description: 'Farmacêutica Esteta com formação especializada',
        },
        {
            icon: Heart,
            title: 'Cuidado',
            description: 'Atendimento humanizado e personalizado',
        },
        {
            icon: Sparkles,
            title: 'Naturalidade',
            description: 'Resultados harmônicos e naturais',
        },
    ];

    return (
        <section id="sobre" className="py-20 lg:py-32 bg-cream overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Side */}
                    <AnimatedSection direction="left" className="relative">
                        <div className="relative">
                            {/* Main Image */}
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-card">
                                <img
                                    src="/images/dra.paulasatoo-20251210-0030.jpg"
                                    alt="Dra. Paula Satoo"
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-gold rounded-2xl" />
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sage/20 rounded-2xl -z-10" />

                            {/* Stats Card */}
                            <div className="absolute -bottom-8 -right-4 lg:right-8 bg-white rounded-xl shadow-card p-6 z-20">
                                <div className="text-center">
                                    <span className="block font-serif text-3xl text-gold font-semibold">+500</span>
                                    <span className="text-sm text-charcoal/70">Pacientes atendidas</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Content Side */}
                    <AnimatedSection direction="right" delay={0.2}>
                        <div className="lg:pl-8">
                            {/* Section Label */}
                            <span className="text-gold font-medium tracking-widest uppercase text-sm">
                                Sobre
                            </span>

                            {/* Title */}
                            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mt-4 mb-6 leading-tight">
                                Dra. Paula Satoo
                            </h2>

                            {/* Description */}
                            <div className="space-y-4 text-charcoal/80 leading-relaxed">
                                <p>
                                    Farmacêutica Esteta apaixonada pela ciência da beleza e do cuidado.
                                    Com formação especializada em harmonização facial e procedimentos
                                    estéticos avançados, minha missão é realçar a beleza natural de
                                    cada paciente.
                                </p>
                                <p>
                                    Acredito que a estética vai além da aparência — é sobre como você
                                    se sente. Por isso, cada procedimento é personalizado, respeitando
                                    suas características únicas e desejos.
                                </p>
                            </div>

                            {/* Quote */}
                            <blockquote className="my-8 pl-6 border-l-4 border-gold">
                                <p className="font-serif text-xl lg:text-2xl text-charcoal italic">
                                    "Sua pele merece toques de cuidado que fazem toda a diferença."
                                </p>
                            </blockquote>

                            {/* Highlights */}
                            <div className="grid sm:grid-cols-3 gap-6 mt-8">
                                {highlights.map((item, index) => (
                                    <div key={index} className="text-center sm:text-left">
                                        <div className="inline-flex items-center justify-center w-12 h-12 
                                  bg-sage/20 rounded-xl mb-3">
                                            <item.icon className="w-6 h-6 text-sage-500" />
                                        </div>
                                        <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                                        <p className="text-sm text-charcoal/70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
