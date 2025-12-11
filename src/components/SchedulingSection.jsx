import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { getSchedules, getServices, createAppointment, getSettings } from '../lib/supabase';
import {
    User,
    Sparkles,
    Clock,
    Send,
    Check,
    ChevronRight,
    MessageCircle,
    Phone
} from 'lucide-react';

const SchedulingSection = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        treatment: '',
        preferredTime: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [treatments, setTreatments] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [whatsappNumber, setWhatsappNumber] = useState('5519990037678');

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load schedules from admin
            const schedules = await getSchedules();
            if (schedules.length > 0) {
                const availableSlots = schedules
                    .filter(s => s.is_available)
                    .map(s => {
                        const dayName = daysOfWeek[s.day_of_week];
                        const startHour = s.start_time?.slice(0, 5) || '09:00';
                        const endHour = s.end_time?.slice(0, 5) || '18:00';
                        return `${dayName} (${startHour} - ${endHour})`;
                    });

                // Group into time periods
                const morningSlot = 'Manhã (9h - 12h)';
                const afternoonSlot = 'Tarde (14h - 18h)';
                const eveningSlot = 'Noite (18h - 20h)';

                setTimeSlots([morningSlot, afternoonSlot, eveningSlot, 'Qualquer horário']);
            } else {
                // Fallback to default slots
                setTimeSlots([
                    'Manhã (9h - 12h)',
                    'Tarde (14h - 18h)',
                    'Noite (18h - 20h)',
                    'Qualquer horário',
                ]);
            }

            // Load services/treatments from admin
            const services = await getServices();
            if (services.length > 0) {
                setTreatments(services.map(s => s.name));
            } else {
                // Fallback to default treatments
                setTreatments([
                    'Harmonização Facial',
                    'Preenchimento Labial',
                    'Bioestimuladores',
                    'Toxina Botulínica',
                    'Skinbooster',
                    'Microagulhamento',
                    'Hidragloss',
                    'Corporal',
                    'Outros',
                ]);
            }

            // Load settings for WhatsApp number
            const settings = await getSettings();
            if (settings.whatsapp) {
                setWhatsappNumber(settings.whatsapp);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Use fallback values
            setTreatments([
                'Harmonização Facial',
                'Preenchimento Labial',
                'Bioestimuladores',
                'Toxina Botulínica',
                'Skinbooster',
                'Microagulhamento',
                'Hidragloss',
                'Corporal',
                'Outros',
            ]);
            setTimeSlots([
                'Manhã (9h - 12h)',
                'Tarde (14h - 18h)',
                'Noite (18h - 20h)',
                'Qualquer horário',
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            // Save appointment to Supabase
            await createAppointment({
                name: formData.name,
                phone: formData.phone,
                treatment: formData.treatment,
                preferred_time: formData.preferredTime,
                status: 'pending'
            });
        } catch (error) {
            console.error('Error saving appointment:', error);
            // Continue anyway to send WhatsApp
        }

        // Build WhatsApp message
        const message = `Olá! Gostaria de agendar uma avaliação.

*Nome:* ${formData.name}
*Telefone:* ${formData.phone}
*Procedimento de Interesse:* ${formData.treatment}
*Melhor Horário:* ${formData.preferredTime}

Aguardo retorno. Obrigada!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        setSubmitting(false);
        setSubmitted(true);

        // Reset after 5 seconds
        setTimeout(() => {
            setStep(1);
            setFormData({ name: '', phone: '', treatment: '', preferredTime: '' });
            setSubmitted(false);
        }, 5000);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const isStepComplete = (stepNumber) => {
        switch (stepNumber) {
            case 1: return formData.name.length >= 2 && formData.phone.length >= 10;
            case 2: return formData.treatment !== '';
            case 3: return formData.preferredTime !== '';
            default: return false;
        }
    };

    if (submitted) {
        return (
            <section id="agendamento" className="py-20 lg:py-32 bg-cream relative overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center bg-white rounded-3xl shadow-card p-12"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">
                            Solicitação Enviada!
                        </h3>
                        <p className="text-charcoal/70">
                            Sua solicitação foi registrada com sucesso.
                            Em breve entraremos em contato para confirmar seu agendamento.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="agendamento" className="py-20 lg:py-32 bg-cream relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-sage/5 -skew-x-12 origin-top-right" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Side - Info */}
                    <AnimatedSection direction="left">
                        <span className="text-gold font-medium tracking-widest uppercase text-sm">
                            Agendamento
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mt-4 mb-6 leading-tight">
                            Agende sua{' '}
                            <span className="text-gold">Avaliação</span>
                        </h2>
                        <p className="text-charcoal/70 leading-relaxed mb-8">
                            Preencha o formulário ao lado com suas informações e
                            enviaremos uma mensagem formatada diretamente para nosso WhatsApp.
                            Nossa equipe entrará em contato para confirmar seu horário.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4">
                            {[
                                'Avaliação personalizada e sem compromisso',
                                'Primeira consulta com análise detalhada',
                                'Ambiente acolhedor e discreto',
                                'Atendimento humanizado e acolhedor',
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-gold" />
                                    </div>
                                    <span className="text-charcoal/80">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Direct WhatsApp */}
                        <div className="mt-8 p-6 bg-sage/10 rounded-2xl">
                            <p className="text-charcoal/70 text-sm mb-3">
                                Prefere falar diretamente conosco?
                            </p>
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sage-500 font-medium hover:text-gold transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                (19) 99003-7678
                            </a>
                        </div>
                    </AnimatedSection>

                    {/* Right Side - Form */}
                    <AnimatedSection direction="right" delay={0.2}>
                        <div className="bg-white rounded-3xl shadow-card p-8 lg:p-10">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full"
                                    />
                                </div>
                            ) : (
                                <>
                                    {/* Progress Steps */}
                                    <div className="flex items-center justify-between mb-8">
                                        {[1, 2, 3].map((stepNumber) => (
                                            <div key={stepNumber} className="flex items-center">
                                                <button
                                                    onClick={() => step > stepNumber && setStep(stepNumber)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all
                        ${step === stepNumber
                                                            ? 'bg-gold text-white'
                                                            : step > stepNumber
                                                                ? 'bg-sage text-white cursor-pointer hover:bg-sage-500'
                                                                : 'bg-gray-100 text-charcoal/50'
                                                        }`}
                                                >
                                                    {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
                                                </button>
                                                {stepNumber < 3 && (
                                                    <div className={`w-16 sm:w-24 h-1 mx-2 rounded transition-colors ${step > stepNumber ? 'bg-sage' : 'bg-gray-100'
                                                        }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form Steps */}
                                    <AnimatePresence mode="wait">
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                variants={stepVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="flex items-center gap-3 text-charcoal mb-4">
                                                    <User className="w-5 h-5 text-gold" />
                                                    <h3 className="font-serif text-xl font-semibold">Seus dados</h3>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Digite seu nome completo"
                                                    className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl 
                               focus:border-gold focus:ring-0 outline-none transition-colors
                               text-charcoal placeholder:text-charcoal/40"
                                                />
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="(19) 99999-9999"
                                                        className="w-full pl-12 pr-6 py-4 border-2 border-gray-100 rounded-xl 
                                   focus:border-gold focus:ring-0 outline-none transition-colors
                                   text-charcoal placeholder:text-charcoal/40"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setStep(2)}
                                                    disabled={!isStepComplete(1)}
                                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Continuar
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                variants={stepVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center gap-3 text-charcoal mb-4">
                                                    <Sparkles className="w-5 h-5 text-gold" />
                                                    <h3 className="font-serif text-xl font-semibold">
                                                        Qual procedimento te interessa?
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {treatments.map((treatment) => (
                                                        <button
                                                            key={treatment}
                                                            onClick={() => setFormData({ ...formData, treatment })}
                                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2
                            ${formData.treatment === treatment
                                                                    ? 'border-gold bg-gold/10 text-gold'
                                                                    : 'border-gray-100 text-charcoal/70 hover:border-sage/50'
                                                                }`}
                                                        >
                                                            {treatment}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setStep(3)}
                                                    disabled={!isStepComplete(2)}
                                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                                >
                                                    Continuar
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                variants={stepVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ duration: 0.3 }}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center gap-3 text-charcoal mb-4">
                                                    <Clock className="w-5 h-5 text-gold" />
                                                    <h3 className="font-serif text-xl font-semibold">
                                                        Qual o melhor horário?
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {timeSlots.map((time) => (
                                                        <button
                                                            key={time}
                                                            onClick={() => setFormData({ ...formData, preferredTime: time })}
                                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2
                            ${formData.preferredTime === time
                                                                    ? 'border-gold bg-gold/10 text-gold'
                                                                    : 'border-gray-100 text-charcoal/70 hover:border-sage/50'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Summary */}
                                                <div className="mt-6 p-4 bg-sage/10 rounded-xl space-y-2">
                                                    <p className="text-sm text-charcoal/70">Resumo do agendamento:</p>
                                                    <p className="text-charcoal font-medium">{formData.name}</p>
                                                    <p className="text-sm text-charcoal/70">
                                                        {formData.phone} • {formData.treatment} • {formData.preferredTime}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={!isStepComplete(3) || submitting}
                                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                                >
                                                    {submitting ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        />
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5" />
                                                            Enviar via WhatsApp
                                                        </>
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default SchedulingSection;
