import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'Os procedimentos são dolorosos?',
            answer: 'A maioria dos procedimentos causa apenas um leve desconforto. Utilizamos anestésicos tópicos e técnicas que minimizam qualquer incômodo. Nosso objetivo é sempre proporcionar uma experiência confortável.',
        },
        {
            question: 'Quanto tempo duram os resultados?',
            answer: 'A duração varia conforme o procedimento: Toxina Botulínica dura de 4 a 6 meses, Preenchimentos de 8 a 18 meses, e Bioestimuladores podem durar até 2 anos. Fatores como metabolismo e cuidados pós-procedimento influenciam.',
        },
        {
            question: 'Qual o tempo de recuperação?',
            answer: 'A maioria dos procedimentos tem recuperação rápida. Pode haver leve vermelhidão ou pequenos hematomas que desaparecem em poucos dias. Você pode retornar às atividades normais geralmente no mesmo dia.',
        },
        {
            question: 'É possível ter resultados naturais?',
            answer: 'Absolutamente! Nossa filosofia é o "menos é mais". Trabalhamos para realçar sua beleza natural, não transformá-la. Cada procedimento é personalizado para harmonizar com suas características únicas.',
        },
        {
            question: 'Preciso de avaliação antes do procedimento?',
            answer: 'Sim, a avaliação prévia é fundamental. Nela, analisamos suas características faciais, histórico de saúde, expectativas e definimos juntos o melhor plano de tratamento para você.',
        },
        {
            question: 'Quais cuidados devo ter após os procedimentos?',
            answer: 'Os cuidados variam por procedimento, mas geralmente incluem: evitar exposição solar intensa, não massagear a área tratada, evitar exercícios intensos nas primeiras 24h e manter boa hidratação.',
        },
        {
            question: 'Gestantes podem fazer procedimentos estéticos?',
            answer: 'Para gestantes, oferecemos tratamentos específicos e seguros como a Drenagem Linfática. Procedimentos injetáveis não são recomendados durante a gestação e amamentação.',
        },
        {
            question: 'Como funciona o agendamento?',
            answer: 'Você pode agendar sua avaliação pelo WhatsApp, telefone ou pelo formulário no site. Retornamos rapidamente para confirmar o melhor horário. A avaliação inicial é sem compromisso.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 lg:py-32 bg-cream dark:bg-charcoal/95">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <span className="text-gold font-medium tracking-widest uppercase text-sm">
                        Dúvidas Frequentes
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mt-4 mb-6">
                        Perguntas <span className="text-gold">Frequentes</span>
                    </h2>
                    <p className="text-charcoal/70 dark:text-white/70 max-w-2xl mx-auto">
                        Tire suas principais dúvidas sobre nossos procedimentos e atendimento.
                    </p>
                </AnimatedSection>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="mb-4"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className={`w-full flex items-center justify-between gap-4 p-6 rounded-xl 
                          text-left transition-all duration-300
                          ${openIndex === index
                                        ? 'bg-sage/20 dark:bg-sage/10'
                                        : 'bg-white dark:bg-charcoal/50 hover:bg-sage/10 dark:hover:bg-sage/5'
                                    } shadow-soft`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                transition-colors ${openIndex === index ? 'bg-gold' : 'bg-sage/20'}`}>
                                        <HelpCircle className={`w-5 h-5 ${openIndex === index ? 'text-white' : 'text-sage-500'}`} />
                                    </div>
                                    <span className="font-medium text-charcoal dark:text-white">
                                        {faq.question}
                                    </span>
                                </div>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-charcoal/50 dark:text-white/50 flex-shrink-0" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-2 text-charcoal/70 dark:text-white/70 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <AnimatedSection delay={0.3} className="text-center mt-12">
                    <p className="text-charcoal/70 dark:text-white/70 mb-4">
                        Ainda tem dúvidas? Fale diretamente conosco!
                    </p>
                    <a
                        href="https://wa.me/5519990037678?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20os%20procedimentos."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                    >
                        <HelpCircle className="w-5 h-5" />
                        Falar pelo WhatsApp
                    </a>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default FAQSection;
