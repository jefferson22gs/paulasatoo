import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../../lib/supabase';

const DashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(a =>
        new Date(a.created_at).toDateString() === today
    );

    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

    const stats = [
        {
            title: 'Agendamentos Hoje',
            value: todayAppointments.length,
            icon: Calendar,
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Pendentes',
            value: pendingCount,
            icon: Clock,
            color: 'bg-amber-500',
            lightColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        },
        {
            title: 'Confirmados',
            value: confirmedCount,
            icon: CheckCircle,
            color: 'bg-green-500',
            lightColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Total Geral',
            value: appointments.length,
            icon: Users,
            color: 'bg-sage',
            lightColor: 'bg-sage/10',
            textColor: 'text-sage'
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" /> Confirmado
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        <XCircle className="w-3 h-3" /> Cancelado
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                        <AlertCircle className="w-3 h-3" /> Pendente
                    </span>
                );
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Dashboard</h1>
                <p className="text-charcoal/60 mt-1">Bem-vinda ao painel administrativo</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className={`w-12 h-12 ${stat.lightColor} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                        <p className="text-3xl font-bold text-charcoal">{stat.value}</p>
                        <p className="text-sm text-charcoal/60 mt-1">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-charcoal">Últimos Agendamentos</h2>
                    <Link
                        to="/admin/appointments"
                        className="text-sm text-sage hover:text-sage-dark transition-colors flex items-center gap-1"
                    >
                        Ver todos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full mx-auto"
                        />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="p-8 text-center text-charcoal/60">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Nenhum agendamento ainda</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {appointments.slice(0, 5).map((appointment) => (
                            <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-charcoal">{appointment.name}</p>
                                        <p className="text-sm text-charcoal/60">
                                            {appointment.treatment} • {appointment.preferred_time}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(appointment.status)}
                                        <p className="text-xs text-charcoal/40 mt-1">
                                            {new Date(appointment.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    to="/admin/settings"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-sage/50 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                            <TrendingUp className="w-6 h-6 text-sage" />
                        </div>
                        <div>
                            <p className="font-semibold text-charcoal">Configurações</p>
                            <p className="text-sm text-charcoal/60">Atualizar informações</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/admin/services"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-gold/50 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                            <TrendingUp className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <p className="font-semibold text-charcoal">Serviços & Preços</p>
                            <p className="text-sm text-charcoal/60">Gerenciar preços</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/admin/gallery"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-rose-gold/50 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-gold/10 rounded-xl flex items-center justify-center group-hover:bg-rose-gold/20 transition-colors">
                            <TrendingUp className="w-6 h-6 text-rose-gold" />
                        </div>
                        <div>
                            <p className="font-semibold text-charcoal">Galeria</p>
                            <p className="text-sm text-charcoal/60">Adicionar fotos</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;
