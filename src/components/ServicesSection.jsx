import AnimatedSection from './AnimatedSection';
import ServiceCard from './ServiceCard';
import {
    Sparkles,
    Heart,
    Zap,
    Droplets,
    Syringe,
    CircleDot,
    Flower2,
    Users
} from 'lucide-react';
import { useSiteImages } from '../lib/siteImages.jsx';

const ServicesSection = () => {
    const { images } = useSiteImages();

    const services = [
        {
            icon: Sparkles,
            title: 'Harmonização Facial',
            description: 'Técnicas avançadas para realçar seus traços naturais, sem exageros. Equilíbrio e proporção para uma beleza autêntica.',
            image: images['service-1'] || '/images/dra.paulasatoo-20251210-0010.jpg',
            tags: ['Natural', 'Personalizado'],
        },
        {
            icon: Heart,
            title: 'Preenchimento Labial',
            description: 'Lábios mais definidos e harmoniosos. Do sutil ao marcante, respeitando suas características únicas.',
            image: images['service-2'] || '/images/dra.paulasatoo-20251210-0015.jpg',
            tags: ['Volume', 'Contorno', 'Hidratação'],
        },
        {
            icon: Zap,
            title: 'Bioestimuladores',
            description: 'A evolução da sua pele. Tratamento com Elleva para estímulo natural do colágeno e rejuvenescimento profundo.',
            image: images['service-3'] || '/images/dra.paulasatoo-20251210-0020.jpg',
            tags: ['Elleva', 'Colágeno'],
        },
        {
            icon: Syringe,
            title: 'Toxina Botulínica',
            description: 'Suavize linhas de expressão com naturalidade. Tratamento preventivo e corretivo para uma pele mais jovem.',
            image: images['service-4'] || '/images/dra.paulasatoo-20251210-0025.jpg',
            tags: ['Botox', 'Prevenção'],
        },
        {
            icon: Droplets,
            title: 'Skinbooster',
            description: 'Devolve viço e hidratação à sua pele. Tratamento intensivo para uma pele mais luminosa e saudável.',
            image: images['service-5'] || '/images/dra.paulasatoo-20251210-0035.jpg',
            tags: ['Hidratação', 'Viço'],
        },
        {
            icon: CircleDot,
            title: 'Microagulhamento',
            description: 'Renovação celular para tratamento de cicatrizes, manchas e rejuvenescimento facial completo.',
            image: images['service-6'] || '/images/dra.paulasatoo-20251210-0012.jpg',
            tags: ['Cicatrizes', 'Manchas'],
        },
        {
            icon: Flower2,
            title: 'Hidragloss',
            description: 'Tratamento exclusivo de hidratação labial. Lábios mais macios, hidratados e com brilho natural.',
            image: images['service-7'] || '/images/dra.paulasatoo-20251210-0017.jpg',
            tags: ['Hidratação', 'Brilho'],
        },
        {
            icon: Users,
            title: 'Corporal',
            description: 'Massagem Detox e Drenagem Linfática especializada, incluindo atendimento para gestantes.',
            image: images['service-8'] || '/images/dra.paulasatoo-20251210-0028.jpg',
            tags: ['Detox', 'Gestantes'],
        },
    ];

    return (
        <section id="tratamentos" className="py-20 lg:py-32 bg-sage/10">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <AnimatedSection className="text-center mb-16">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Nossos Serviços
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mt-4 mb-6">
                        Tratamentos <span className="text-gold">Exclusivos</span>
                    </h2>
                    <p className="text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                        Procedimentos realizados com as melhores técnicas e produtos do mercado,
                        sempre focando em resultados naturais e na sua satisfação.
                    </p>
                </AnimatedSection>

                {/* Services Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>

                {/* CTA */}
                <AnimatedSection delay={0.4} className="text-center mt-12">
                    <p className="text-charcoal/70 mb-6">
                        Cada tratamento é personalizado para suas necessidades específicas.
                    </p>
                    <a
                        href="#agendamento"
                        className="btn-primary"
                    >
                        <Sparkles className="w-5 h-5" />
                        Agende sua Avaliação
                    </a>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default ServicesSection;
