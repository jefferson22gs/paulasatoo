import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Calendar, TrendingUp, Users, DollarSign, Gift,
    Download, RefreshCw, Filter, ChevronDown
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ReportsPage = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');
    const [stats, setStats] = useState({
        totalAppointments: 0,
        confirmedAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0,
        totalReferrals: 0,
        usedReferrals: 0,
        topServices: [],
        appointmentsByDay: [],
        appointmentsByStatus: []
    });

    useEffect(() => { loadData(); }, [dateRange]);

    const getDateFilter = () => {
        const now = new Date();
        switch (dateRange) {
            case 'week':
                return new Date(now.setDate(now.getDate() - 7)).toISOString();
            case 'month':
                return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
            case 'year':
                return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
            default:
                return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const dateFilter = getDateFilter();

            // Appointments stats
            const { data: appointments } = await supabase
                .from('appointments')
                .select('*')
                .gte('created_at', dateFilter);

            const confirmed = appointments?.filter(a => a.status === 'confirmed').length || 0;
            const pending = appointments?.filter(a => a.status === 'pending').length || 0;
            const cancelled = appointments?.filter(a => a.status === 'cancelled').length || 0;

            // Count services
            const serviceCount = {};
            appointments?.forEach(a => {
                if (a.service) {
                    serviceCount[a.service] = (serviceCount[a.service] || 0) + 1;
                }
            });
            const topServices = Object.entries(serviceCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            // Referrals stats
            const { data: referrals } = await supabase
                .from('referrals')
                .select('*')
                .gte('created_at', dateFilter);

            const { data: referralUsage } = await supabase
                .from('referral_usage')
                .select('*')
                .gte('created_at', dateFilter);

            // Appointments by day (last 7 days)
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const count = appointments?.filter(a =>
                    a.created_at.startsWith(dateStr)
                ).length || 0;
                last7Days.push({
                    date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
                    count
                });
            }

            setStats({
                totalAppointments: appointments?.length || 0,
                confirmedAppointments: confirmed,
                pendingAppointments: pending,
                cancelledAppointments: cancelled,
                totalReferrals: referrals?.length || 0,
                usedReferrals: referralUsage?.length || 0,
                topServices,
                appointmentsByDay: last7Days,
                appointmentsByStatus: [
                    { status: 'Confirmados', count: confirmed, color: 'bg-green-500' },
                    { status: 'Pendentes', count: pending, color: 'bg-yellow-500' },
                    { status: 'Cancelados', count: cancelled, color: 'bg-red-500' }
                ]
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportData = () => {
        const data = {
            periodo: dateRange,
            gerado_em: new Date().toISOString(),
            estatisticas: stats
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'sage' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-charcoal/60">{title}</p>
                    <p className="text-3xl font-bold text-charcoal mt-1">{value}</p>
                    {subtitle && <p className="text-sm text-charcoal/50 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${color}`} />
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal flex items-center gap-3">
                        <BarChart3 className="w-7 h-7 text-sage" />
                        Relatórios
                    </h1>
                    <p className="text-charcoal/60 mt-1">Estatísticas e métricas do seu negócio</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-xl focus:border-sage outline-none"
                        >
                            <option value="week">Últimos 7 dias</option>
                            <option value="month">Último mês</option>
                            <option value="year">Último ano</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 pointer-events-none" />
                    </div>
                    <button
                        onClick={exportData}
                        className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-600"
                    >
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Calendar}
                    title="Total de Agendamentos"
                    value={stats.totalAppointments}
                />
                <StatCard
                    icon={TrendingUp}
                    title="Confirmados"
                    value={stats.confirmedAppointments}
                    subtitle={`${stats.totalAppointments > 0 ? Math.round((stats.confirmedAppointments / stats.totalAppointments) * 100) : 0}% do total`}
                />
                <StatCard
                    icon={Gift}
                    title="Códigos de Indicação"
                    value={stats.totalReferrals}
                    subtitle={`${stats.usedReferrals} utilizados`}
                />
                <StatCard
                    icon={Users}
                    title="Taxa de Conversão"
                    value={`${stats.totalReferrals > 0 ? Math.round((stats.usedReferrals / stats.totalReferrals) * 100) : 0}%`}
                    subtitle="Indicações → Agendamentos"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Appointments by Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-charcoal mb-4">Status dos Agendamentos</h3>
                    <div className="space-y-4">
                        {stats.appointmentsByStatus.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-charcoal">{item.status}</span>
                                    <span className="text-charcoal/60">{item.count}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all`}
                                        style={{ width: `${stats.totalAppointments > 0 ? (item.count / stats.totalAppointments) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Services */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-charcoal mb-4">Serviços Mais Procurados</h3>
                    {stats.topServices.length > 0 ? (
                        <div className="space-y-3">
                            {stats.topServices.map((service, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-sage/10 text-sage text-xs flex items-center justify-center font-medium">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1 text-charcoal">{service.name}</span>
                                    <span className="text-charcoal/60 text-sm">{service.count} agendamentos</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-charcoal/50 text-center py-8">Nenhum dado disponível</p>
                    )}
                </div>

                {/* Appointments by Day */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <h3 className="font-semibold text-charcoal mb-4">Agendamentos - Últimos 7 dias</h3>
                    <div className="flex items-end justify-between gap-2 h-40">
                        {stats.appointmentsByDay.map((day, i) => {
                            const maxCount = Math.max(...stats.appointmentsByDay.map(d => d.count), 1);
                            const height = (day.count / maxCount) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center justify-end h-32">
                                        <span className="text-xs text-charcoal/60 mb-1">{day.count}</span>
                                        <div
                                            className="w-full max-w-[40px] bg-sage rounded-t-lg transition-all"
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-charcoal/50 capitalize">{day.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
