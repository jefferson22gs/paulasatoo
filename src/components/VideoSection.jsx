import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Instagram } from 'lucide-react';
import { useDynamicData } from '../lib/dynamicData.jsx';
import { useSiteSettings } from '../lib/siteSettings.jsx';
import { getInstagramEmbedUrl } from '../lib/instagram';


const VideoSection = () => {
    const { videos: dynamicVideos } = useDynamicData();
    const { settings } = useSiteSettings();
    const handle = (settings.instagram || '@dra.paulasatoo').replace('@', '');

    // Somente os vídeos do Instagram cadastrados e ativos no Admin (máx. 2 fixados)
    const videos = dynamicVideos
        .map(v => ({ ...v, embedUrl: getInstagramEmbedUrl(v.youtube_url) }))
        .filter(v => v.embedUrl)
        .slice(0, 2);

    // Sem links cadastrados: a seção fica oculta em vez de mostrar vídeos antigos
    if (videos.length === 0) return null;

    return (
        <section id="videos" className="py-20 lg:py-32 bg-cream dark:bg-charcoal/95">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Conteúdo
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mt-4 mb-6">
                        Vídeos do <span className="text-gold">Instagram</span>
                    </h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <iframe
                                src={video.embedUrl}
                                title={video.title}
                                loading="lazy"
                                allowFullScreen
                                className="w-full max-w-[400px] h-[640px] rounded-2xl bg-white shadow-card border-0"
                            />
                            <a
                                href={video.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 text-sm font-medium text-charcoal/80 dark:text-white/80 hover:text-gold transition-colors"
                            >
                                {video.title} — abrir no Instagram
                            </a>
                        </motion.div>
                    ))}
                </div>

                <AnimatedSection delay={0.3} className="text-center mt-12">
                    <a
                        href={`https://instagram.com/${handle}`}
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
