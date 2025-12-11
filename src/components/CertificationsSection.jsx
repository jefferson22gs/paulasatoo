import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Award, Shield, BadgeCheck, GraduationCap } from 'lucide-react';

const CertificationsSection = () => {
    const certifications = [
        {
            icon: GraduationCap,
            title: 'Farmacêutica',
            description: 'Formação em Farmácia com especialização em estética',
        },
        {
            icon: Award,
            title: 'Esteta Certificada',
            description: 'Certificação em procedimentos estéticos injetáveis',
        },
        {
            icon: Shield,
            title: 'Protocolos de Segurança',
            description: 'Procedimentos seguindo os mais altos padrões de biossegurança',
        },
        {
            icon: BadgeCheck,
            title: 'Atualização Constante',
            description: 'Participação em congressos e cursos de atualização',
        },
    ];

    const brands = [
        { name: 'Elleva', description: 'Bioestimuladores' },
        { name: 'Allergan', description: 'Botox & Preenchedores' },
        { name: 'Galderma', description: 'Skinboosters' },
        { name: 'Rennova', description: 'Ácido Hialurônico' },
    ];

    return (
        <section className="py-20 lg:py-32 bg-charcoal dark:bg-charcoal/95 text-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Certifications */}
                <AnimatedSection className="text-center mb-16">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Qualificações
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4 mb-6">
                        Expertise & <span className="text-gold">Confiança</span>
                    </h2>
                </AnimatedSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 
                       transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-4 
                            group-hover:bg-gold/30 transition-colors">
                                <cert.icon className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="font-serif text-lg font-semibold mb-2">{cert.title}</h3>
                            <p className="text-white/60 text-sm">{cert.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Brands */}
                <AnimatedSection className="text-center mb-12">
                    <h3 className="font-serif text-2xl font-semibold">
                        Produtos de <span className="text-gold">Alta Qualidade</span>
                    </h3>
                    <p className="text-white/60 mt-2">
                        Trabalhamos apenas com as melhores marcas do mercado
                    </p>
                </AnimatedSection>

                <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-8 py-6 rounded-xl bg-white/5 border border-white/10 
                       hover:border-gold/30 transition-all text-center min-w-[150px]"
                        >
                            <span className="font-serif text-xl font-semibold text-gold">{brand.name}</span>
                            <p className="text-white/50 text-xs mt-1">{brand.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CertificationsSection;
