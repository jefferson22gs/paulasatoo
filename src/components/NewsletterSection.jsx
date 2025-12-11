import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);
        setIsSubmitted(true);
        setEmail('');

        // Reset after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-r from-sage-500 to-sage dark:from-sage-600 dark:to-sage-500 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
                <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white rounded-full" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedSection>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-gold-300" />
                            <span className="text-white/90 text-sm font-medium">Dicas Exclusivas</span>
                        </div>

                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
                            Receba Conteúdos <span className="text-gold-300">Exclusivos</span>
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Cadastre seu e-mail e receba dicas de skincare, novidades sobre tratamentos
                            e conteúdos exclusivos diretamente no seu inbox.
                        </p>

                        {/* Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                        >
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu melhor e-mail"
                                    required
                                    disabled={isSubmitted}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-charcoal 
                           placeholder:text-charcoal/40 outline-none focus:ring-2 
                           focus:ring-gold transition-all disabled:opacity-50"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading || isSubmitted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 
                          transition-all disabled:cursor-not-allowed ${isSubmitted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gold text-white hover:bg-gold-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : isSubmitted ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Inscrito!
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Inscrever
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <p className="text-white/50 text-sm mt-4">
                            Não enviamos spam. Cancele a inscrição quando quiser.
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
