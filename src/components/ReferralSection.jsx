import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gift,
    Users,
    Percent,
    Copy,
    Check,
    Share2,
    X,
    Sparkles,
    ArrowRight,
    Heart,
    Phone,
    User,
    Mail,
    CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const ReferralSection = () => {
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState('create'); // 'create', 'success', 'use'
    const [copied, setCopied] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [referrerForm, setReferrerForm] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const [referredForm, setReferredForm] = useState({
        code: '',
        name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        loadProgram();
    }, []);

    const loadProgram = async () => {
        try {
            const { data, error } = await supabase
                .from('referral_program')
                .select('*')
                .eq('is_active', true)
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading program:', error);
            }

            setProgram(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReferral = async () => {
        if (!referrerForm.name || !referrerForm.phone) {
            setError('Preencha seu nome e telefone');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const { data, error } = await supabase
                .from('referrals')
                .insert({
                    referrer_name: referrerForm.name,
                    referrer_phone: referrerForm.phone,
                    referrer_email: referrerForm.email || null
                })
                .select()
                .single();

            if (error) throw error;

            setGeneratedCode(data);
            setStep('success');
        } catch (error) {
            console.error('Error creating referral:', error);
            setError('Erro ao gerar código. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUseReferral = async () => {
        if (!referredForm.code || !referredForm.name || !referredForm.phone) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Find the referral code
            const { data: referral, error: findError } = await supabase
                .from('referrals')
                .select('*')
                .eq('referral_code', referredForm.code.toUpperCase())
                .eq('status', 'active')
                .single();

            if (findError || !referral) {
                setError('Código inválido ou expirado');
                setSubmitting(false);
                return;
            }

            // Check if expired
            if (new Date(referral.expires_at) < new Date()) {
                setError('Este código já expirou');
                setSubmitting(false);
                return;
            }

            // Register usage
            const discountAmount = program?.referred_discount_percentage || 0;

            const { error: usageError } = await supabase
                .from('referral_usage')
                .insert({
                    referral_id: referral.id,
                    referred_name: referredForm.name,
                    referred_phone: referredForm.phone,
                    referred_email: referredForm.email || null,
                    discount_applied: discountAmount,
                    status: 'pending'
                });

            if (usageError) throw usageError;

            // Update referral status if needed
            await supabase
                .from('referrals')
                .update({ status: 'used' })
                .eq('id', referral.id);

            setGeneratedCode({ ...referral, discount: discountAmount });
            setStep('success');
        } catch (error) {
            console.error('Error using referral:', error);
            setError('Erro ao usar código. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const copyCode = () => {
        if (generatedCode?.referral_code) {
            navigator.clipboard.writeText(generatedCode.referral_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareCode = async () => {
        if (generatedCode?.referral_code) {
            const shareData = {
                title: 'Indicação Especial - Dra. Paula Satoo',
                text: `Use meu código ${generatedCode.referral_code} e ganhe ${program?.referred_discount_percentage}% de desconto na Dra. Paula Satoo!`,
                url: window.location.origin
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    copyCode();
                }
            } catch (error) {
                console.error('Error sharing:', error);
                copyCode();
            }
        }
    };

    const openModal = (initialStep = 'create') => {
        setStep(initialStep);
        setShowModal(true);
        setError('');
        setGeneratedCode(null);
        setReferrerForm({ name: '', phone: '', email: '' });
        setReferredForm({ code: '', name: '', phone: '', email: '' });
    };

    if (loading || !program?.is_active) {
        return null;
    }

    return (
        <>
            {/* Referral Section */}
            <section className="py-20 lg:py-28 bg-gradient-to-br from-sage/5 via-rose-gold/5 to-sage/5 dark:from-charcoal dark:via-charcoal-light dark:to-charcoal relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -left-1/2 w-full h-full"
                    >
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full"
                    >
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-gold/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sage/20 to-rose-gold/20 
                                       rounded-full mb-8"
                        >
                            <Gift className="w-4 h-4 text-sage" />
                            <span className="text-sm font-medium text-sage dark:text-sage">
                                Programa Exclusivo
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-charcoal dark:text-cream mb-6"
                        >
                            Indique e <span className="text-sage">Ganhe</span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-charcoal/70 dark:text-cream/70 mb-12 max-w-2xl mx-auto"
                        >
                            Indique amigas e ganhe descontos exclusivos! Quanto mais você indica, mais benefícios você recebe.
                        </motion.p>

                        {/* Benefits Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 dark:bg-charcoal-light/80 backdrop-blur-sm p-8 rounded-3xl 
                                           shadow-xl border border-sage/10"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sage to-sage-dark 
                                               flex items-center justify-center text-white shadow-lg">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-charcoal dark:text-cream mb-2">
                                    Você ganha
                                </h3>
                                <p className="text-4xl font-bold text-sage mb-2">
                                    {program.referrer_discount_percentage}%
                                </p>
                                <p className="text-charcoal/60 dark:text-cream/60">
                                    de desconto no seu próximo procedimento
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/80 dark:bg-charcoal-light/80 backdrop-blur-sm p-8 rounded-3xl 
                                           shadow-xl border border-rose-gold/10"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-gold to-rose-gold/80 
                                               flex items-center justify-center text-white shadow-lg">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-charcoal dark:text-cream mb-2">
                                    Sua amiga ganha
                                </h3>
                                <p className="text-4xl font-bold text-rose-gold mb-2">
                                    {program.referred_discount_percentage}%
                                </p>
                                <p className="text-charcoal/60 dark:text-cream/60">
                                    de desconto no primeiro procedimento
                                </p>
                            </motion.div>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button
                                onClick={() => openModal('create')}
                                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sage to-sage-dark 
                                           text-white rounded-full font-semibold shadow-xl hover:shadow-2xl 
                                           transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <Gift className="w-5 h-5" />
                                Gerar Meu Código
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => openModal('use')}
                                className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-charcoal-light 
                                           text-charcoal dark:text-cream rounded-full font-semibold shadow-lg 
                                           hover:shadow-xl transition-all duration-300 border-2 border-sage/20 
                                           hover:border-sage/40"
                            >
                                <Sparkles className="w-5 h-5 text-sage" />
                                Usar Código de Indicação
                            </button>
                        </motion.div>

                        {/* Terms */}
                        {program.terms_conditions && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="text-sm text-charcoal/50 dark:text-cream/50 mt-8 max-w-xl mx-auto"
                            >
                                * {program.terms_conditions}
                            </motion.p>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-50"
                        >
                            <div className="bg-white dark:bg-charcoal-light rounded-3xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-sage to-sage-dark p-6 text-white">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                            <Gift className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {step === 'success' ? 'Parabéns!' : step === 'use' ? 'Usar Indicação' : 'Indique e Ganhe'}
                                            </h3>
                                            <p className="text-white/80 text-sm">
                                                {step === 'success'
                                                    ? 'Seu código está pronto!'
                                                    : step === 'use'
                                                        ? 'Use seu código de desconto'
                                                        : 'Gere seu código exclusivo'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {step === 'success' && generatedCode ? (
                                        <div className="text-center">
                                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 
                                                           flex items-center justify-center">
                                                <CheckCircle className="w-10 h-10 text-green-500" />
                                            </div>

                                            <h4 className="text-lg font-semibold text-charcoal dark:text-cream mb-2">
                                                Seu código de indicação:
                                            </h4>

                                            <div className="flex items-center justify-center gap-2 mb-6">
                                                <code className="px-6 py-3 bg-sage/10 text-sage font-mono text-2xl font-bold rounded-xl">
                                                    {generatedCode.referral_code}
                                                </code>
                                                <button
                                                    onClick={copyCode}
                                                    className="p-3 bg-sage/10 hover:bg-sage/20 rounded-xl transition-colors"
                                                >
                                                    {copied ? (
                                                        <Check className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-5 h-5 text-sage" />
                                                    )}
                                                </button>
                                            </div>

                                            <p className="text-charcoal/60 dark:text-cream/60 mb-6">
                                                Compartilhe este código com suas amigas! Quando elas usarem,
                                                você ganha <strong>{program.referrer_discount_percentage}%</strong> de desconto
                                                e elas ganham <strong>{program.referred_discount_percentage}%</strong>!
                                            </p>

                                            <button
                                                onClick={shareCode}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 
                                                           bg-gradient-to-r from-sage to-sage-dark text-white 
                                                           rounded-full font-semibold hover:opacity-90 transition-opacity"
                                            >
                                                <Share2 className="w-5 h-5" />
                                                Compartilhar Código
                                            </button>
                                        </div>
                                    ) : step === 'use' ? (
                                        <div className="space-y-4">
                                            {error && (
                                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
                                                               rounded-xl text-sm flex items-center gap-2">
                                                    <X className="w-4 h-4" />
                                                    {error}
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    Código de Indicação *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={referredForm.code}
                                                    onChange={(e) => setReferredForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                                    placeholder="Ex: ABC12345"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent font-mono text-lg 
                                                               uppercase tracking-wider"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    <User className="w-4 h-4 inline mr-1" />
                                                    Seu Nome *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={referredForm.name}
                                                    onChange={(e) => setReferredForm(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Seu nome completo"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    <Phone className="w-4 h-4 inline mr-1" />
                                                    WhatsApp *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={referredForm.phone}
                                                    onChange={(e) => setReferredForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="(19) 99999-9999"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    <Mail className="w-4 h-4 inline mr-1" />
                                                    Email (opcional)
                                                </label>
                                                <input
                                                    type="email"
                                                    value={referredForm.email}
                                                    onChange={(e) => setReferredForm(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="seu@email.com"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent"
                                                />
                                            </div>

                                            <div className="p-4 bg-sage/10 dark:bg-sage/20 rounded-xl">
                                                <p className="text-sm text-charcoal/70 dark:text-cream/70">
                                                    <Percent className="w-4 h-4 inline mr-1 text-sage" />
                                                    Ao usar um código válido, você ganha{' '}
                                                    <strong className="text-sage">{program.referred_discount_percentage}% de desconto</strong>{' '}
                                                    no seu primeiro procedimento!
                                                </p>
                                            </div>

                                            <button
                                                onClick={handleUseReferral}
                                                disabled={submitting}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 
                                                           bg-gradient-to-r from-sage to-sage-dark text-white 
                                                           rounded-full font-semibold hover:opacity-90 transition-opacity
                                                           disabled:opacity-50"
                                            >
                                                {submitting ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                ) : (
                                                    <Sparkles className="w-5 h-5" />
                                                )}
                                                {submitting ? 'Validando...' : 'Usar Código'}
                                            </button>

                                            <button
                                                onClick={() => setStep('create')}
                                                className="w-full text-center text-sm text-sage hover:underline"
                                            >
                                                Quero gerar meu próprio código
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {error && (
                                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
                                                               rounded-xl text-sm flex items-center gap-2">
                                                    <X className="w-4 h-4" />
                                                    {error}
                                                </div>
                                            )}

                                            <p className="text-charcoal/60 dark:text-cream/60 text-sm">
                                                Preencha seus dados para gerar seu código exclusivo de indicação:
                                            </p>

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    <User className="w-4 h-4 inline mr-1" />
                                                    Seu Nome *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={referrerForm.name}
                                                    onChange={(e) => setReferrerForm(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Seu nome completo"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    <Phone className="w-4 h-4 inline mr-1" />
                                                    WhatsApp *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={referrerForm.phone}
                                                    onChange={(e) => setReferrerForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="(19) 99999-9999"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-charcoal/70 dark:text-cream/70 mb-2">
                                                    <Mail className="w-4 h-4 inline mr-1" />
                                                    Email (opcional)
                                                </label>
                                                <input
                                                    type="email"
                                                    value={referrerForm.email}
                                                    onChange={(e) => setReferrerForm(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="seu@email.com"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 dark:border-charcoal rounded-xl 
                                                               focus:border-sage outline-none bg-transparent"
                                                />
                                            </div>

                                            <button
                                                onClick={handleCreateReferral}
                                                disabled={submitting}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 
                                                           bg-gradient-to-r from-sage to-sage-dark text-white 
                                                           rounded-full font-semibold hover:opacity-90 transition-opacity
                                                           disabled:opacity-50"
                                            >
                                                {submitting ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                ) : (
                                                    <Gift className="w-5 h-5" />
                                                )}
                                                {submitting ? 'Gerando...' : 'Gerar Meu Código'}
                                            </button>

                                            <button
                                                onClick={() => setStep('use')}
                                                className="w-full text-center text-sm text-sage hover:underline"
                                            >
                                                Já tenho um código de indicação
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default ReferralSection;
