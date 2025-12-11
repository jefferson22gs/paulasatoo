import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Play, Instagram } from 'lucide-react';

const VideoSection = () => {
    const videos = [
        {
            id: 1,
            thumbnail: '/images/dra.paulasatoo-20251210-0002.jpg',
            title: 'Harmonização Natural',
            views: '15K',
        },
        {
            id: 2,
            thumbnail: '/images/dra.paulasatoo-20251210-0004.jpg',
            title: 'Preenchimento Labial',
            views: '12K',
        },
        {
            id: 3,
            thumbnail: '/images/dra.paulasatoo-20251210-0007.jpg',
            title: 'Bioestimuladores - Antes e Depois',
            views: '20K',
        },
        {
            id: 4,
            thumbnail: '/images/dra.paulasatoo-20251210-0009.jpg',
            title: 'Dicas de Skincare',
            views: '8K',
        },
    ];

    return (
        <section className="py-20 lg:py-32 bg-cream dark:bg-charcoal/95">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Conteúdo
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mt-4 mb-6">
                        Vídeos do <span className="text-gold">Instagram</span>
                    </h2>
                    <p className="text-charcoal/70 dark:text-white/70 max-w-2xl mx-auto">
                        Acompanhe dicas, procedimentos e bastidores no nosso Instagram.
                    </p>
                </AnimatedSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <motion.a
                            key={video.id}
                            href="https://instagram.com/dra.paulasatoo"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-card"
                        >
                            {/* Thumbnail */}
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 
                         group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm 
                           flex items-center justify-center border border-white/30
                           group-hover:bg-gold/80 transition-colors"
                                >
                                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                                </motion.div>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white font-medium text-sm line-clamp-2 mb-1">
                                    {video.title}
                                </p>
                                <p className="text-white/60 text-xs">
                                    {video.views} visualizações
                                </p>
                            </div>

                            {/* Instagram Badge */}
                            <div className="absolute top-3 right-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 
                              to-orange-400 flex items-center justify-center">
                                    <Instagram className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <AnimatedSection delay={0.3} className="text-center mt-12">
                    <a
                        href="https://instagram.com/dra.paulasatoo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r 
                     from-purple-600 via-pink-500 to-orange-400 text-white font-medium 
                     rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                    >
                        <Instagram className="w-5 h-5" />
                        Ver mais no Instagram
                    </a>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default VideoSection;
