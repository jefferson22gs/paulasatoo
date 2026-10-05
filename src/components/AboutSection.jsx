import AnimatedSection from './AnimatedSection';
import { Award, Heart, Sparkles } from 'lucide-react';
import { useSiteImages } from '../lib/siteImages.jsx';
import { useSiteContent } from '../lib/siteContent.jsx';

const AboutSection = () => {
    const { images } = useSiteImages();
    const { content } = useSiteContent();

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
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-card max-w-md mx-auto lg:max-w-none aspect-[4/5]">
                                <img
                                    src={images.about || '/images/dra-paula-satoo-retrato.jpg'}
                                    alt="Retrato da Dra. Paula Satoo, farmacêutica esteta"
                                    loading="lazy"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-gold rounded-2xl" />
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sage/20 rounded-2xl -z-10" />

                            {/* Stats Card */}
                            <div className="absolute -bottom-8 -right-4 lg:right-8 bg-white rounded-xl shadow-card p-6 z-20">
                                <div className="text-center">
                                    <span className="block font-serif text-3xl text-gold font-semibold">+{content.about_procedures_count || '500'}</span>
                                    <span className="text-sm text-charcoal/70">{content.about_procedures_label || 'Pacientes atendidas'}</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Content Side */}
                    <AnimatedSection direction="right" delay={0.2}>
                        <div className="lg:pl-8">
                            {/* Section Label */}
                            <span className="text-gold font-medium tracking-widest uppercase text-sm">
                                {content.about_badge}
                            </span>

                            {/* Title */}
                            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mt-4 mb-6 leading-tight">
                                {content.about_title}
                            </h2>

                            {/* Description */}
                            <div className="space-y-4 text-charcoal/80 leading-relaxed">
                                {[content.about_paragraph_1, content.about_paragraph_2].filter(Boolean).map((text, i) => (
                                    <p key={i}>{text}</p>
                                ))}
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
