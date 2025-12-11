import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { Check, Calculator, Send, Sparkles } from 'lucide-react';

const ProcedureCalculator = () => {
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [showSummary, setShowSummary] = useState(false);

    const procedures = [
        {
            id: 'harmonizacao',
            name: 'Harmonização Facial Completa',
            description: 'Tratamento completo para equilíbrio facial',
            priceRange: 'A partir de R$ 2.500'
        },
        {
            id: 'preenchimento',
            name: 'Preenchimento Labial',
            description: 'Volume e definição para os lábios',
            priceRange: 'A partir de R$ 1.200'
        },
        {
            id: 'bioestimulador',
            name: 'Bioestimuladores',
            description: 'Estímulo natural do colágeno',
            priceRange: 'A partir de R$ 1.800'
        },
        {
            id: 'botox',
            name: 'Toxina Botulínica',
            description: 'Suavização de linhas de expressão',
            priceRange: 'A partir de R$ 1.000'
        },
        {
            id: 'skinbooster',
            name: 'Skinbooster',
            description: 'Hidratação profunda da pele',
            priceRange: 'A partir de R$ 800'
        },
        {
            id: 'microagulhamento',
            name: 'Microagulhamento',
            description: 'Renovação e rejuvenescimento',
            priceRange: 'A partir de R$ 400'
        },
        {
            id: 'hidragloss',
            name: 'Hidragloss',
            description: 'Hidratação labial intensiva',
            priceRange: 'A partir de R$ 600'
        },
        {
            id: 'drenagem',
            name: 'Drenagem Linfática',
            description: 'Tratamento corporal relaxante',
            priceRange: 'A partir de R$ 150'
        },
    ];

    const toggleProcedure = (id) => {
        setSelectedProcedures(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
        setShowSummary(false);
    };

    const handleSubmit = () => {
        if (selectedProcedures.length === 0) return;

        const selected = procedures.filter(p => selectedProcedures.includes(p.id));
        const procedureNames = selected.map(p => p.name).join(', ');

        const message = `Olá! Tenho interesse nos seguintes procedimentos:

${procedureNames}

Gostaria de agendar uma avaliação para saber mais sobre valores e indicações.`;

        window.open(`https://wa.me/5519990037678?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <section className="py-20 lg:py-32 bg-sage/5 dark:bg-charcoal/90">
            <div className="container mx-auto px-4 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-4">
                        <Calculator className="w-4 h-4 text-gold" />
                        <span className="text-gold text-sm font-medium">Simulador</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal dark:text-white mb-4">
                        Monte Seu <span className="text-gold">Tratamento</span>
                    </h2>
                    <p className="text-charcoal/70 dark:text-white/70 max-w-2xl mx-auto">
                        Selecione os procedimentos de seu interesse e receba um orçamento personalizado.
                    </p>
                </AnimatedSection>

                <div className="max-w-4xl mx-auto">
                    {/* Procedure Grid */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {procedures.map((procedure, index) => (
                            <motion.button
                                key={procedure.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => toggleProcedure(procedure.id)}
                                className={`relative p-6 rounded-xl text-left transition-all duration-300 group
                          ${selectedProcedures.includes(procedure.id)
                                        ? 'bg-gold/20 border-2 border-gold'
                                        : 'bg-white dark:bg-charcoal/50 border-2 border-transparent hover:border-sage/30'
                                    } shadow-soft`}
                            >
                                {/* Checkbox */}
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 
                              flex items-center justify-center transition-all
                              ${selectedProcedures.includes(procedure.id)
                                        ? 'bg-gold border-gold'
                                        : 'border-charcoal/20 dark:border-white/20'
                                    }`}>
                                    {selectedProcedures.includes(procedure.id) && (
                                        <Check className="w-4 h-4 text-white" />
                                    )}
                                </div>

                                <h3 className="font-serif text-lg font-semibold text-charcoal dark:text-white mb-1 pr-8">
                                    {procedure.name}
                                </h3>
                                <p className="text-charcoal/60 dark:text-white/60 text-sm mb-2">
                                    {procedure.description}
                                </p>
                                <p className="text-gold font-medium text-sm">
                                    {procedure.priceRange}
                                </p>
                            </motion.button>
                        ))}
                    </div>

                    {/* Summary & CTA */}
                    <AnimatePresence>
                        {selectedProcedures.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-white dark:bg-charcoal/50 rounded-2xl p-6 shadow-card"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-charcoal/60 dark:text-white/60 text-sm">
                                            Procedimentos selecionados:
                                        </p>
                                        <p className="font-serif text-xl font-semibold text-charcoal dark:text-white">
                                            {selectedProcedures.length} {selectedProcedures.length === 1 ? 'procedimento' : 'procedimentos'}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedProcedures.map(id => {
                                                const proc = procedures.find(p => p.id === id);
                                                return (
                                                    <span key={id} className="px-2 py-1 bg-sage/10 dark:bg-white/10 
                                                   rounded-full text-xs text-charcoal dark:text-white">
                                                        {proc?.name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="btn-primary whitespace-nowrap"
                                    >
                                        <Send className="w-5 h-5" />
                                        Solicitar Orçamento
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State */}
                    {selectedProcedures.length === 0 && (
                        <div className="text-center py-8">
                            <Sparkles className="w-12 h-12 text-charcoal/20 dark:text-white/20 mx-auto mb-4" />
                            <p className="text-charcoal/50 dark:text-white/50">
                                Selecione os procedimentos acima para montar seu tratamento
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProcedureCalculator;
