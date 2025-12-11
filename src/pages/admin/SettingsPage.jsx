import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    MapPin,
    Phone,
    Mail,
    Clock,
    Instagram,
    Globe,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { getSettings, updateSetting } from '../../lib/supabase';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        clinic_name: 'Dra. Paula Satoo - Estética Avançada',
        address: 'Rua Almirante Tamandaré, 54',
        city: 'Indaiatuba - SP',
        postal_code: '13334-100',
        phone: '(19) 99003-7678',
        whatsapp: '5519990037678',
        email: 'contato@drapaulasatoo.com.br',
        instagram: '@dra.paulasatoo',
        website: 'https://drapaulasatoo.com.br',
        hours_weekday: '09:00 - 20:00',
        hours_saturday: '09:00 - 14:00',
        hours_sunday: 'Fechado'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            if (Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Save each setting
            for (const [key, value] of Object.entries(settings)) {
                await updateSetting(key, value);
            }
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Erro ao salvar configurações. Tente novamente.' });
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
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Configurações</h1>
                    <p className="text-charcoal/60 mt-1">Informações da clínica</p>
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

            {/* General Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-charcoal mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sage" />
                    Informações Gerais
                </h2>
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Nome da Clínica
                        </label>
                        <input
                            type="text"
                            value={settings.clinic_name}
                            onChange={(e) => handleChange('clinic_name', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-charcoal mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sage" />
                    Endereço
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Endereço
                        </label>
                        <input
                            type="text"
                            value={settings.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Cidade - Estado
                        </label>
                        <input
                            type="text"
                            value={settings.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            CEP
                        </label>
                        <input
                            type="text"
                            value={settings.postal_code}
                            onChange={(e) => handleChange('postal_code', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-charcoal mb-6 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-sage" />
                    Contato
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Telefone
                        </label>
                        <input
                            type="text"
                            value={settings.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            WhatsApp (apenas números)
                        </label>
                        <input
                            type="text"
                            value={settings.whatsapp}
                            onChange={(e) => handleChange('whatsapp', e.target.value)}
                            placeholder="5519990037678"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                         focus:border-sage focus:ring-0 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Instagram
                        </label>
                        <div className="relative">
                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                            <input
                                type="text"
                                value={settings.instagram}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                         focus:border-sage focus:ring-0 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-charcoal mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sage" />
                    Horário de Funcionamento
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Segunda a Sexta
                        </label>
                        <input
                            type="text"
                            value={settings.hours_weekday}
                            onChange={(e) => handleChange('hours_weekday', e.target.value)}
                            placeholder="09:00 - 20:00"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Sábado
                        </label>
                        <input
                            type="text"
                            value={settings.hours_saturday}
                            onChange={(e) => handleChange('hours_saturday', e.target.value)}
                            placeholder="09:00 - 14:00"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            Domingo
                        </label>
                        <input
                            type="text"
                            value={settings.hours_sunday}
                            onChange={(e) => handleChange('hours_sunday', e.target.value)}
                            placeholder="Fechado"
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                       focus:border-sage focus:ring-0 outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
