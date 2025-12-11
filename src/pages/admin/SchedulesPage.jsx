import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Save,
    CheckCircle,
    AlertCircle,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { getSchedules, updateSchedule, supabase } from '../../lib/supabase';

const SchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const daysOfWeek = [
        { value: 0, label: 'Domingo' },
        { value: 1, label: 'Segunda-feira' },
        { value: 2, label: 'Terça-feira' },
        { value: 3, label: 'Quarta-feira' },
        { value: 4, label: 'Quinta-feira' },
        { value: 5, label: 'Sexta-feira' },
        { value: 6, label: 'Sábado' }
    ];

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            const data = await getSchedules();

            // If no schedules exist, create default ones
            if (data.length === 0) {
                await createDefaultSchedules();
                const newData = await getSchedules();
                setSchedules(newData);
            } else {
                setSchedules(data);
            }
        } catch (error) {
            console.error('Error loading schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const createDefaultSchedules = async () => {
        const defaults = [
            { day_of_week: 0, start_time: '09:00', end_time: '14:00', is_available: false },
            { day_of_week: 1, start_time: '09:00', end_time: '20:00', is_available: true },
            { day_of_week: 2, start_time: '09:00', end_time: '20:00', is_available: true },
            { day_of_week: 3, start_time: '09:00', end_time: '20:00', is_available: true },
            { day_of_week: 4, start_time: '09:00', end_time: '20:00', is_available: true },
            { day_of_week: 5, start_time: '09:00', end_time: '20:00', is_available: true },
            { day_of_week: 6, start_time: '09:00', end_time: '14:00', is_available: true }
        ];

        for (const schedule of defaults) {
            await supabase.from('schedules').insert(schedule);
        }
    };

    const handleChange = (dayOfWeek, field, value) => {
        setSchedules(prev => prev.map(s =>
            s.day_of_week === dayOfWeek ? { ...s, [field]: value } : s
        ));
    };

    const handleToggle = (dayOfWeek) => {
        const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
        if (schedule) {
            handleChange(dayOfWeek, 'is_available', !schedule.is_available);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            for (const schedule of schedules) {
                await updateSchedule(schedule.id, {
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    is_available: schedule.is_available
                });
            }
            setMessage({ type: 'success', text: 'Horários salvos com sucesso!' });
        } catch (error) {
            console.error('Error saving schedules:', error);
            setMessage({ type: 'error', text: 'Erro ao salvar horários. Tente novamente.' });
        } finally {
            setSaving(false);
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
        <div className="space-y-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Horários</h1>
                    <p className="text-charcoal/60 mt-1">Configure os horários de atendimento</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                   font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Salvar
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {message.text}
                </motion.div>
            )}

            {/* Schedule List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {daysOfWeek.map((day, index) => {
                    const schedule = schedules.find(s => s.day_of_week === day.value);
                    if (!schedule) return null;

                    return (
                        <div
                            key={day.value}
                            className={`p-6 ${index < daysOfWeek.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <button
                                        onClick={() => handleToggle(day.value)}
                                        className="flex-shrink-0"
                                    >
                                        {schedule.is_available ? (
                                            <ToggleRight className="w-10 h-10 text-sage" />
                                        ) : (
                                            <ToggleLeft className="w-10 h-10 text-gray-300" />
                                        )}
                                    </button>

                                    <div className="flex-1">
                                        <h3 className={`font-medium ${schedule.is_available ? 'text-charcoal' : 'text-charcoal/40'}`}>
                                            {day.label}
                                        </h3>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 ${!schedule.is_available && 'opacity-40'}`}>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                                        <input
                                            type="time"
                                            value={schedule.start_time}
                                            onChange={(e) => handleChange(day.value, 'start_time', e.target.value)}
                                            disabled={!schedule.is_available}
                                            className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm
                               focus:border-sage focus:ring-0 outline-none transition-colors
                               disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <span className="text-charcoal/40">até</span>
                                    <input
                                        type="time"
                                        value={schedule.end_time}
                                        onChange={(e) => handleChange(day.value, 'end_time', e.target.value)}
                                        disabled={!schedule.is_available}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                             focus:border-sage focus:ring-0 outline-none transition-colors
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info */}
            <div className="p-4 bg-sage/10 rounded-xl">
                <p className="text-sm text-charcoal/70">
                    <strong>Dica:</strong> Esses horários serão usados para exibir a disponibilidade
                    no site. Clientes poderão solicitar agendamentos dentro desses horários.
                </p>
            </div>
        </div>
    );
};

export default SchedulesPage;
