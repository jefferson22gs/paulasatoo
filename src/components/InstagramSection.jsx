import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Instagram, ExternalLink } from 'lucide-react';
import { useSiteImages } from '../lib/siteImages.jsx';
import { useSiteSettings } from '../lib/siteSettings.jsx';

// Galeria com exatamente 4 resultados (imagens editáveis em Admin > Imagens > Resultados)
const RESULTS = [
    { id: 'result-1', caption: 'Limpeza de Pele', alt: 'Etapas de limpeza de pele com aplicação de máscaras faciais' },
    { id: 'result-2', caption: 'Lábios', alt: 'Paciente em vista frontal após procedimento nos lábios' },
    { id: 'result-3', caption: 'Toxina Botulínica', alt: 'Montagem com regiões da testa e dos olhos antes e depois de toxina botulínica' },
    { id: 'result-4', caption: 'Preenchimento Labial', alt: 'Comparação dos lábios antes e depois de preenchimento labial' },
];

const InstagramSection = () => {
    const { images } = useSiteImages();
    const { settings } = useSiteSettings();
    const handle = (settings.instagram || '@dra.paulasatoo').replace('@', '');

    return (
        <section id="resultados" className="py-20 lg:py-32 bg-sage/10">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Acompanhe nosso trabalho
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mt-4 mb-6">
                        <span className="text-gold">Resultados</span>
                    </h2>
                    <p className="text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                        Registros de procedimentos realizados. Cada resultado é individual e depende da avaliação de cada paciente.
                    </p>
                </AnimatedSection>

                {/* 2 por linha no celular/tablet, 4 no desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
                    {RESULTS.map((item, index) => (
                        <motion.figure
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className="bg-white rounded-xl overflow-hidden shadow-soft"
                        >
                            <div className="aspect-[4/5] bg-charcoal/5">
                                <img
                                    src={images[item.id]}
                                    alt={item.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <figcaption className="px-3 py-3 text-center text-sm font-medium text-charcoal">
                                {item.caption}
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>

                {/* CTA */}
                <AnimatedSection delay={0.3} className="text-center mt-12">
                    <a
                        href={`https://instagram.com/${handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r
                     from-purple-600 via-pink-500 to-orange-400 text-white font-medium
                     rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        <Instagram className="w-5 h-5" />
                        Siga no Instagram
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <p className="mt-4 text-charcoal/60 text-sm">
                        @{handle}
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default InstagramSection;
