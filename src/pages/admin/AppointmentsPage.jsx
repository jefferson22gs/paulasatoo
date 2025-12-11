import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Phone,
    Filter,
    Search,
    MessageCircle,
    Send
} from 'lucide-react';
import { getAppointments, updateAppointment, getSettings } from '../../lib/supabase';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [settings, setSettings] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [appointmentsData, settingsData] = await Promise.all([
                getAppointments(),
                getSettings()
            ]);
            setAppointments(appointmentsData);

            // getSettings já retorna um objeto { key: value }
            setSettings(settingsData || {});
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status, appointment = null) => {
        try {
            await updateAppointment(id, { status });

            // Se confirmou e tem appointment com telefone, abre WhatsApp
            if (status === 'confirmed' && appointment?.phone) {
                openWhatsAppConfirmation(appointment);
            }

            loadData();
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const openWhatsApp = (appointment) => {
        const message = encodeURIComponent(
            `Olá ${appointment.name}! Aqui é da Dra. Paula Satoo. Recebemos sua solicitação de agendamento para ${appointment.treatment}. Gostaria de confirmar o horário?`
        );
        window.open(`https://wa.me/55${appointment.phone?.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    const openWhatsAppConfirmation = async (appointment) => {
        // Buscar configurações atualizadas antes de enviar
        let currentAddress = settings.address;

        try {
            const freshSettings = await getSettings();
            currentAddress = freshSettings?.address || settings.address || 'Endereço a confirmar';
        } catch (error) {
            console.error('Error fetching settings:', error);
            currentAddress = settings.address || 'Endereço a confirmar';
        }

        // Dados do agendamento específico
        const firstName = appointment.name?.split(' ')[0] || 'Cliente';
        const treatment = appointment.treatment || 'seu procedimento';
        const preferredTime = appointment.preferred_time || 'A confirmar';

        const message = encodeURIComponent(
            `✨ Olá ${firstName}! ✨

É com muita alegria que confirmamos seu agendamento na *Dra. Paula Satoo*! 💕

📋 *Detalhes do Agendamento:*
• Procedimento: ${treatment}
• Período: ${preferredTime}

🏠 *Nosso endereço:*
${currentAddress}

📝 *Algumas dicas para o dia:*
• Chegue com 10 minutos de antecedência
• Traga um documento com foto
• Evite usar maquiagem na área do procedimento

Estamos muito felizes em receber você! Se tiver alguma dúvida, é só nos chamar. 😊

Com carinho,
*Equipe Dra. Paula Satoo* 💫`
        );

        window.open(`https://wa.me/55${appointment.phone?.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    const filteredAppointments = appointments.filter(a => {
        const matchesFilter = filter === 'all' || a.status === filter;
        const matchesSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.treatment?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        <CheckCircle className="w-4 h-4" /> Confirmado
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                        <XCircle className="w-4 h-4" /> Cancelado
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
                        <Clock className="w-4 h-4" /> Pendente
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Agendamentos</h1>
                <p className="text-charcoal/60 mt-1">Gerencie as solicitações de agendamento</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou procedimento..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                     focus:border-sage focus:ring-0 outline-none transition-colors bg-white"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { value: 'all', label: 'Todos' },
                        { value: 'pending', label: 'Pendentes' },
                        { value: 'confirmed', label: 'Confirmados' },
                        { value: 'cancelled', label: 'Cancelados' }
                    ].map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === option.value
                                ? 'bg-sage text-white'
                                : 'bg-white border border-gray-200 text-charcoal/70 hover:border-sage/50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
                    <p className="text-charcoal/60">
                        {searchTerm || filter !== 'all'
                            ? 'Nenhum agendamento encontrado com os filtros aplicados'
                            : 'Nenhum agendamento recebido ainda'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                        <motion.div
                            key={appointment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-sage/30 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                                            <User className="w-5 h-5 text-sage" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-charcoal">{appointment.name}</h3>
                                            <p className="text-sm text-charcoal/60">{appointment.treatment}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-charcoal/60">
                                        {appointment.phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {appointment.phone}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {appointment.preferred_time}
                                        </span>
                                        <span>
                                            {new Date(appointment.created_at).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {getStatusBadge(appointment.status)}

                                    <div className="flex items-center gap-2">
                                        {appointment.phone && (
                                            <button
                                                onClick={() => openWhatsApp(appointment)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Enviar WhatsApp"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                            </button>
                                        )}

                                        {appointment.status !== 'confirmed' && (
                                            <button
                                                onClick={() => handleStatusChange(appointment.id, 'confirmed', appointment)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Confirmar e enviar WhatsApp"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                        )}

                                        {appointment.status === 'confirmed' && appointment.phone && (
                                            <button
                                                onClick={() => openWhatsAppConfirmation(appointment)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Reenviar confirmação por WhatsApp"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        )}

                                        {appointment.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Cancelar"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;
