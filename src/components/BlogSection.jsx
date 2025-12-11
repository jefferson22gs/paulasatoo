import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BlogSection = () => {
    const posts = [
        {
            id: 1,
            title: 'Cuidados essenciais com a pele no verão',
            excerpt: 'Descubra como proteger e hidratar sua pele durante os dias mais quentes do ano.',
            image: '/images/dra.paulasatoo-20251210-0036.jpg',
            category: 'Skincare',
            date: '10 Dez 2024',
            readTime: '5 min',
        },
        {
            id: 2,
            title: 'Harmonização Facial: o que você precisa saber',
            excerpt: 'Tudo sobre o procedimento que realça sua beleza natural de forma equilibrada.',
            image: '/images/dra.paulasatoo-20251210-0037.jpg',
            category: 'Procedimentos',
            date: '05 Dez 2024',
            readTime: '7 min',
        },
        {
            id: 3,
            title: 'Bioestimuladores: a revolução do rejuvenescimento',
            excerpt: 'Entenda como os bioestimuladores de colágeno podem transformar sua pele.',
            image: '/images/dra.paulasatoo-20251210-0038.jpg',
            category: 'Tratamentos',
            date: '28 Nov 2024',
            readTime: '6 min',
        },
    ];

    return (
        <section className="py-20 lg:py-32 bg-cream dark:bg-charcoal/95">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <span className="text-gold font-medium tracking-widest uppercase text-sm">
                            Blog
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mt-4">
                            Dicas & <span className="text-gold">Novidades</span>
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-gold font-medium hover:gap-3 transition-all"
                    >
                        Ver todos os posts
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white dark:bg-charcoal/50 rounded-2xl overflow-hidden shadow-soft 
                       hover:shadow-card transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-gold text-white text-xs font-medium rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Meta */}
                                <div className="flex items-center gap-4 text-sm text-charcoal/50 dark:text-white/50 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-serif text-xl font-semibold text-charcoal dark:text-white mb-2 
                             group-hover:text-gold transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-charcoal/70 dark:text-white/70 text-sm line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>

                                {/* Read More */}
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 text-gold font-medium text-sm 
                           hover:gap-3 transition-all"
                                >
                                    Ler mais
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
