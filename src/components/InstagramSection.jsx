import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Instagram, ExternalLink } from 'lucide-react';
import { useSiteImages } from '../lib/siteImages.jsx';

const InstagramSection = () => {
    const { images } = useSiteImages();

    // Using images from the project folder as Instagram posts
    const instagramPosts = [
        { id: 1, image: images['instagram-1'] || '/images/dra.paulasatoo-20251210-0001.jpg', alt: 'Post 1' },
        { id: 2, image: images['instagram-2'] || '/images/dra.paulasatoo-20251210-0003.jpg', alt: 'Post 2' },
        { id: 3, image: images['instagram-3'] || '/images/dra.paulasatoo-20251210-0006.jpg', alt: 'Post 3' },
        { id: 4, image: images['instagram-4'] || '/images/dra.paulasatoo-20251210-0008.jpg', alt: 'Post 4' },
        { id: 5, image: images['instagram-5'] || '/images/dra.paulasatoo-20251210-0011.jpg', alt: 'Post 5' },
        { id: 6, image: images['instagram-6'] || '/images/dra.paulasatoo-20251210-0014.jpg', alt: 'Post 6' },
        { id: 7, image: images['instagram-7'] || '/images/dra.paulasatoo-20251210-0018.jpg', alt: 'Post 7' },
        { id: 8, image: images['instagram-8'] || '/images/dra.paulasatoo-20251210-0021.jpg', alt: 'Post 8' },
    ];

    return (
        <section id="resultados" className="py-20 lg:py-32 bg-sage/10">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Acompanhe nosso trabalho
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mt-4 mb-6">
                        Resultados <span className="text-gold">Reais</span>
                    </h2>
                    <p className="text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                        Confira alguns dos nossos resultados e acompanhe dicas de cuidados
                        com a pele no nosso Instagram.
                    </p>
                </AnimatedSection>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {instagramPosts.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href="https://instagram.com/dra.paulasatoo"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                            className="group relative aspect-square rounded-xl overflow-hidden shadow-soft"
                        >
                            <img
                                src={post.image}
                                alt={post.alt}
                                className="w-full h-full object-cover transition-transform duration-500 
                         group-hover:scale-110"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/80 
                            transition-all duration-300 flex items-center justify-center">
                                <Instagram
                                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 transform scale-50 group-hover:scale-100"
                                />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* CTA */}
                <AnimatedSection delay={0.3} className="text-center mt-12">
                    <a
                        href="https://instagram.com/dra.paulasatoo"
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
                        @dra.paulasatoo
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default InstagramSection;
