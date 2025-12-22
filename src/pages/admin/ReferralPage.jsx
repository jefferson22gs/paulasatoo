import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gift,
    Users,
    Percent,
    Settings,
    Save,
    Copy,
    CheckCircle,
    AlertCircle,
    Clock,
    DollarSign,
    UserPlus,
    X,
    ChevronDown,
    ChevronUp,
    Trash2,
    Search,
    Calendar,
    Shield,
    ShieldCheck,
    ShieldX,
    ShieldAlert,
    Phone,
    User,
    Hash
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ReferralPage = () => {
    const [program, setProgram] = useState({
        is_active: true,
        referrer_discount_percentage: 10,
        referred_discount_percentage: 15,
        min_purchase_value: 0,
        max_discount_value: null,
        expiry_days: 30,
        terms_conditions: ''
    });

    const [referrals, setReferrals] = useState([]);
    const [referralUsage, setReferralUsage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedReferral, setExpandedReferral] = useState(null);
    const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'codes', 'validator'

    // Validator state
    const [validatorCode, setValidatorCode] = useState('');
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load program settings
            const { data: programData, error: programError } = await supabase
                .from('referral_program')
                .select('*')
                .limit(1)
                .single();

            if (programError && programError.code !== 'PGRST116') {
                throw programError;
            }

            if (programData) {
                setProgram(programData);
            }

            // Load referrals
            const { data: referralsData, error: referralsError } = await supabase
                .from('referrals')
                .select('*')
                .order('created_at', { ascending: false });

            if (referralsError) throw referralsError;
            setReferrals(referralsData || []);

            // Load referral usage
            const { data: usageData, error: usageError } = await supabase
                .from('referral_usage')
                .select('*, referral:referrals(*)')
                .order('created_at', { ascending: false });

            if (usageError) throw usageError;
            setReferralUsage(usageData || []);

        } catch (error) {
            console.error('Error loading data:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar dados' });
        } finally {
            setLoading(false);
        }
    };

    const handleProgramChange = (field, value) => {
        setProgram(prev => ({ ...prev, [field]: value }));
    };

    const saveProgram = async () => {
        setSaving(true);
        try {
            // Verificar se já existe um registro
            const { data: existingData, error: checkError } = await supabase
                .from('referral_program')
                .select('id')
                .limit(1)
                .single();

            let error;

            if (existingData && existingData.id) {
                // Atualizar registro existente
                const { error: updateError } = await supabase
                    .from('referral_program')
                    .update({
                        is_active: program.is_active,
                        referrer_discount_percentage: program.referrer_discount_percentage,
                        referred_discount_percentage: program.referred_discount_percentage,
                        min_purchase_value: program.min_purchase_value,
                        max_discount_value: program.max_discount_value,
                        expiry_days: program.expiry_days,
                        terms_conditions: program.terms_conditions,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingData.id);
                error = updateError;
            } else {
                // Inserir novo registro
                const { error: insertError } = await supabase
                    .from('referral_program')
                    .insert({
                        is_active: program.is_active,
                        referrer_discount_percentage: program.referrer_discount_percentage,
                        referred_discount_percentage: program.referred_discount_percentage,
                        min_purchase_value: program.min_purchase_value,
                        max_discount_value: program.max_discount_value,
                        expiry_days: program.expiry_days,
                        terms_conditions: program.terms_conditions,
                        updated_at: new Date().toISOString()
                    });
                error = insertError;
            }

            if (error) throw error;

            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
            loadData(); // Recarregar dados
        } catch (error) {
            console.error('Error saving program:', error);
            setMessage({ type: 'error', text: `Erro ao salvar: ${error.message || 'Verifique as políticas RLS no Supabase'}` });
        } finally {
            setSaving(false);
        }
    };

    const copyReferralCode = (code) => {
        navigator.clipboard.writeText(code);
        setMessage({ type: 'success', text: 'Código copiado!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    };

    const deleteReferral = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta indicação?')) return;

        try {
            const { error } = await supabase
                .from('referrals')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Indicação excluída' });
            loadData();
        } catch (error) {
            console.error('Error deleting referral:', error);
            setMessage({ type: 'error', text: 'Erro ao excluir' });
        }
    };

    const applyReferrerDiscount = async (usage) => {
        try {
            const { error } = await supabase
                .from('referral_usage')
                .update({
                    referrer_discount_applied: true,
                    referrer_discount_used_at: new Date().toISOString()
                })
                .eq('id', usage.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Desconto do indicador aplicado!' });
            loadData();
        } catch (error) {
            console.error('Error applying discount:', error);
            setMessage({ type: 'error', text: 'Erro ao aplicar desconto' });
        }
    };

    // Validator function - Anti-fraud
    const validateCode = async () => {
        if (!validatorCode.trim()) {
            setMessage({ type: 'error', text: 'Digite um código para validar' });
            return;
        }

        setValidating(true);
        setValidationResult(null);

        try {
            const codeToCheck = validatorCode.trim().toUpperCase();

            // Search for the code in database
            const { data: referral, error } = await supabase
                .from('referrals')
                .select('*')
                .eq('referral_code', codeToCheck)
                .single();

            if (error || !referral) {
                setValidationResult({
                    status: 'not_found',
                    message: 'Código não encontrado no sistema',
                    icon: ShieldX,
                    color: 'red'
                });
                return;
            }

            // Check if expired
            const expiresAt = new Date(referral.expires_at);
            const now = new Date();
            const isExpired = expiresAt < now;

            // Get usage data for this referral
            const { data: usages } = await supabase
                .from('referral_usage')
                .select('*')
                .eq('referral_id', referral.id);

            // Calculate days until expiry
            const daysUntilExpiry = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

            // Determine validation status
            let validationStatus;
            if (isExpired) {
                validationStatus = {
                    status: 'expired',
                    message: 'Código expirado',
                    icon: ShieldAlert,
                    color: 'yellow'
                };
            } else if (referral.status === 'used') {
                validationStatus = {
                    status: 'used',
                    message: 'Código já utilizado',
                    icon: ShieldAlert,
                    color: 'yellow'
                };
            } else {
                validationStatus = {
                    status: 'valid',
                    message: 'Código válido!',
                    icon: ShieldCheck,
                    color: 'green'
                };
            }

            setValidationResult({
                ...validationStatus,
                referral,
                usages: usages || [],
                isExpired,
                daysUntilExpiry,
                discountReferrer: program.referrer_discount_percentage,
                discountReferred: program.referred_discount_percentage
            });

        } catch (error) {
            console.error('Error validating code:', error);
            setValidationResult({
                status: 'error',
                message: 'Erro ao validar código',
                icon: ShieldX,
                color: 'red'
            });
        } finally {
            setValidating(false);
        }
    };

    const markCodeAsUsed = async (referralId) => {
        try {
            await supabase
                .from('referrals')
                .update({ status: 'used' })
                .eq('id', referralId);

            setMessage({ type: 'success', text: 'Código marcado como usado!' });
            setValidationResult(null);
            setValidatorCode('');
            loadData();
        } catch (error) {
            console.error('Error marking as used:', error);
            setMessage({ type: 'error', text: 'Erro ao atualizar código' });
        }
    };

    const reactivateCode = async (referralId) => {
        try {
            // Extend expiry by program expiry days from now
            const newExpiryDate = new Date();
            newExpiryDate.setDate(newExpiryDate.getDate() + program.expiry_days);

            await supabase
                .from('referrals')
                .update({
                    status: 'active',
                    expires_at: newExpiryDate.toISOString()
                })
                .eq('id', referralId);

            setMessage({ type: 'success', text: 'Código reativado com sucesso!' });
            setValidationResult(null);
            setValidatorCode('');
            loadData();
        } catch (error) {
            console.error('Error reactivating code:', error);
            setMessage({ type: 'error', text: 'Erro ao reativar código' });
        }
    };

    const filteredReferrals = referrals.filter(ref =>
        ref.referrer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.referrer_phone?.includes(searchTerm) ||
        ref.referral_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'used': return 'bg-blue-100 text-blue-700';
            case 'expired': return 'bg-gray-100 text-gray-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            active: 'Ativo',
            used: 'Usado',
            expired: 'Expirado',
            pending: 'Pendente',
            confirmed: 'Confirmado',
            completed: 'Concluído',
            cancelled: 'Cancelado'
        };
        return labels[status] || status;
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Programa de Indicação</h1>
                    <p className="text-charcoal/60 mt-1">Configure e valide códigos de indicação</p>
                </div>
                <button
                    onClick={saveProgram}
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
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
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
                        <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('validator')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${activeTab === 'validator'
                        ? 'text-sage border-sage'
                        : 'text-charcoal/60 border-transparent hover:text-charcoal'
                        }`}
                >
                    <Shield className="w-5 h-5" />
                    Validar Código
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${activeTab === 'settings'
                        ? 'text-sage border-sage'
                        : 'text-charcoal/60 border-transparent hover:text-charcoal'
                        }`}
                >
                    <Settings className="w-5 h-5" />
                    Configurações
                </button>
                <button
                    onClick={() => setActiveTab('codes')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${activeTab === 'codes'
                        ? 'text-sage border-sage'
                        : 'text-charcoal/60 border-transparent hover:text-charcoal'
                        }`}
                >
                    <Users className="w-5 h-5" />
                    Códigos ({referrals.length})
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {/* VALIDATOR TAB */}
                {activeTab === 'validator' && (
                    <motion.div
                        key="validator"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Validator Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-sage to-sage-dark p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                        <Shield className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Validador Anti-Fraude</h2>
                                        <p className="text-white/80">Verifique a autenticidade de códigos de indicação</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="max-w-xl mx-auto">
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Código de Indicação do Cliente
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                            <input
                                                type="text"
                                                value={validatorCode}
                                                onChange={(e) => setValidatorCode(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => e.key === 'Enter' && validateCode()}
                                                placeholder="Digite o código (ex: ABC12345)"
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl 
                                                           focus:border-sage outline-none transition-colors text-lg 
                                                           font-mono tracking-wider uppercase"
                                            />
                                        </div>
                                        <button
                                            onClick={validateCode}
                                            disabled={validating || !validatorCode.trim()}
                                            className="flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-xl 
                                                       font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50"
                                        >
                                            {validating ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                />
                                            ) : (
                                                <Search className="w-5 h-5" />
                                            )}
                                            Validar
                                        </button>
                                    </div>
                                </div>

                                {/* Validation Result */}
                                <AnimatePresence>
                                    {validationResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="mt-8 max-w-2xl mx-auto"
                                        >
                                            {/* Status Banner */}
                                            <div className={`p-6 rounded-2xl ${validationResult.color === 'green' ? 'bg-green-50 border-2 border-green-200' :
                                                validationResult.color === 'yellow' ? 'bg-yellow-50 border-2 border-yellow-200' :
                                                    'bg-red-50 border-2 border-red-200'
                                                }`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${validationResult.color === 'green' ? 'bg-green-100' :
                                                        validationResult.color === 'yellow' ? 'bg-yellow-100' :
                                                            'bg-red-100'
                                                        }`}>
                                                        <validationResult.icon className={`w-8 h-8 ${validationResult.color === 'green' ? 'text-green-600' :
                                                            validationResult.color === 'yellow' ? 'text-yellow-600' :
                                                                'text-red-600'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-xl font-bold ${validationResult.color === 'green' ? 'text-green-700' :
                                                            validationResult.color === 'yellow' ? 'text-yellow-700' :
                                                                'text-red-700'
                                                            }`}>
                                                            {validationResult.message}
                                                        </h3>
                                                        <p className="text-charcoal/60 font-mono text-lg">
                                                            {validatorCode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Card */}
                                            {validationResult.referral && (
                                                <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                                    <div className="p-6 border-b border-gray-100">
                                                        <h4 className="font-semibold text-charcoal flex items-center gap-2">
                                                            <User className="w-5 h-5 text-sage" />
                                                            Informações do Indicador
                                                        </h4>
                                                    </div>
                                                    <div className="p-6 grid sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">Nome</p>
                                                            <p className="font-medium text-charcoal">{validationResult.referral.referrer_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">Telefone</p>
                                                            <p className="font-medium text-charcoal flex items-center gap-2">
                                                                <Phone className="w-4 h-4 text-charcoal/40" />
                                                                {validationResult.referral.referrer_phone}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">Criado em</p>
                                                            <p className="font-medium text-charcoal flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-charcoal/40" />
                                                                {new Date(validationResult.referral.created_at).toLocaleDateString('pt-BR', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">Expira em</p>
                                                            <p className={`font-medium flex items-center gap-2 ${validationResult.isExpired ? 'text-red-600' :
                                                                validationResult.daysUntilExpiry <= 7 ? 'text-yellow-600' :
                                                                    'text-green-600'
                                                                }`}>
                                                                <Clock className="w-4 h-4" />
                                                                {validationResult.isExpired
                                                                    ? 'Expirado'
                                                                    : `${validationResult.daysUntilExpiry} dias restantes`}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">Desconto Indicador</p>
                                                            <p className="font-bold text-sage text-lg">{validationResult.discountReferrer}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">Desconto Indicado</p>
                                                            <p className="font-bold text-rose-gold text-lg">{validationResult.discountReferred}%</p>
                                                        </div>
                                                    </div>

                                                    {/* Usage History */}
                                                    {validationResult.usages && validationResult.usages.length > 0 && (
                                                        <div className="border-t border-gray-100 p-6">
                                                            <h4 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                                                                <UserPlus className="w-5 h-5 text-sage" />
                                                                Pessoas que usaram este código ({validationResult.usages.length})
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {validationResult.usages.map(usage => (
                                                                    <div key={usage.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                                                        <div>
                                                                            <p className="font-medium text-charcoal">{usage.referred_name}</p>
                                                                            <p className="text-sm text-charcoal/60">{usage.referred_phone}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(usage.status)}`}>
                                                                                {getStatusLabel(usage.status)}
                                                                            </span>
                                                                            <span className="text-xs text-charcoal/50">
                                                                                {new Date(usage.created_at).toLocaleDateString('pt-BR')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="border-t border-gray-100 p-6 flex flex-wrap gap-3">
                                                        {validationResult.status === 'valid' && (
                                                            <button
                                                                onClick={() => markCodeAsUsed(validationResult.referral.id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 
                                                                           rounded-lg font-medium hover:bg-blue-100 transition-colors"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Marcar como Usado
                                                            </button>
                                                        )}
                                                        {(validationResult.status === 'expired' || validationResult.status === 'used') && (
                                                            <button
                                                                onClick={() => reactivateCode(validationResult.referral.id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 
                                                                           rounded-lg font-medium hover:bg-green-100 transition-colors"
                                                            >
                                                                <ShieldCheck className="w-4 h-4" />
                                                                Reativar Código
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setValidationResult(null);
                                                                setValidatorCode('');
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-charcoal/70 
                                                                       rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Limpar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <Gift className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-charcoal">{referrals.length}</p>
                                        <p className="text-sm text-charcoal/60">Total Gerados</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-charcoal">
                                            {referrals.filter(r => r.status === 'active' && new Date(r.expires_at) > new Date()).length}
                                        </p>
                                        <p className="text-sm text-charcoal/60">Códigos Válidos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <UserPlus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-charcoal">{referralUsage.length}</p>
                                        <p className="text-sm text-charcoal/60">Códigos Usados</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                                        <ShieldX className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-charcoal">
                                            {referrals.filter(r => new Date(r.expires_at) < new Date()).length}
                                        </p>
                                        <p className="text-sm text-charcoal/60">Expirados</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-charcoal mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-sage" />
                                Configurações do Programa
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Active Toggle */}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="flex items-center gap-4 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={program.is_active}
                                                onChange={(e) => handleProgramChange('is_active', e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-14 h-8 rounded-full transition-colors ${program.is_active ? 'bg-sage' : 'bg-gray-300'}`}>
                                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${program.is_active ? 'translate-x-6' : ''}`} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Programa Ativo</span>
                                            <p className="text-sm text-charcoal/60">Habilita ou desabilita o programa de indicação</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Referrer Discount */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Desconto do Indicador (%)
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            value={program.referrer_discount_percentage}
                                            onChange={(e) => handleProgramChange('referrer_discount_percentage', parseFloat(e.target.value) || 0)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-charcoal/50 mt-1">Desconto para quem indica</p>
                                </div>

                                {/* Referred Discount */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Desconto do Indicado (%)
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            value={program.referred_discount_percentage}
                                            onChange={(e) => handleProgramChange('referred_discount_percentage', parseFloat(e.target.value) || 0)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-charcoal/50 mt-1">Desconto para quem é indicado</p>
                                </div>

                                {/* Expiry Days */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Validade do Código (dias)
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={program.expiry_days}
                                            onChange={(e) => handleProgramChange('expiry_days', parseInt(e.target.value) || 30)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Min Purchase Value */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Valor Mínimo de Compra (R$)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={program.min_purchase_value || ''}
                                            onChange={(e) => handleProgramChange('min_purchase_value', parseFloat(e.target.value) || 0)}
                                            placeholder="0,00"
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Max Discount Value */}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Desconto Máximo (R$)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={program.max_discount_value || ''}
                                            onChange={(e) => handleProgramChange('max_discount_value', parseFloat(e.target.value) || null)}
                                            placeholder="Sem limite"
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-charcoal/50 mt-1">Deixe vazio para sem limite</p>
                                </div>

                                {/* Terms */}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Termos e Condições
                                    </label>
                                    <textarea
                                        value={program.terms_conditions || ''}
                                        onChange={(e) => handleProgramChange('terms_conditions', e.target.value)}
                                        rows={3}
                                        placeholder="Descreva as regras do programa..."
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                   focus:border-sage focus:ring-0 outline-none transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CODES TAB */}
                {activeTab === 'codes' && (
                    <motion.div
                        key="codes"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold text-charcoal flex items-center gap-2">
                                    <Users className="w-5 h-5 text-sage" />
                                    Todos os Códigos de Indicação
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                                                   focus:border-sage focus:ring-0 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {filteredReferrals.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-charcoal/60">Nenhuma indicação encontrada</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredReferrals.map((referral) => {
                                        const usages = referralUsage.filter(u => u.referral_id === referral.id);
                                        const isExpired = new Date(referral.expires_at) < new Date();

                                        return (
                                            <div key={referral.id} className="p-6">
                                                <div
                                                    className="flex items-start justify-between cursor-pointer"
                                                    onClick={() => setExpandedReferral(expandedReferral === referral.id ? null : referral.id)}
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <code className="px-3 py-1 bg-sage/10 text-sage font-mono font-bold rounded-lg">
                                                                    {referral.referral_code}
                                                                </code>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        copyReferralCode(referral.referral_code);
                                                                    }}
                                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                >
                                                                    <Copy className="w-4 h-4 text-charcoal/40" />
                                                                </button>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isExpired ? 'expired' : referral.status)}`}>
                                                                {getStatusLabel(isExpired ? 'expired' : referral.status)}
                                                            </span>
                                                        </div>
                                                        <p className="font-medium text-charcoal">{referral.referrer_name}</p>
                                                        <p className="text-sm text-charcoal/60">{referral.referrer_phone}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-charcoal/50">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(referral.created_at).toLocaleDateString('pt-BR')}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Expira: {new Date(referral.expires_at).toLocaleDateString('pt-BR')}
                                                            </span>
                                                            {usages.length > 0 && (
                                                                <span className="flex items-center gap-1 text-green-600">
                                                                    <UserPlus className="w-3 h-3" />
                                                                    {usages.length} uso(s)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {expandedReferral === referral.id ? (
                                                            <ChevronUp className="w-5 h-5 text-charcoal/40" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-charcoal/40" />
                                                        )}
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {expandedReferral === referral.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="mt-4 pt-4 border-t border-gray-100"
                                                        >
                                                            {usages.length > 0 && (
                                                                <div className="mb-4">
                                                                    <h4 className="text-sm font-medium text-charcoal mb-2">Indicados:</h4>
                                                                    <div className="space-y-2">
                                                                        {usages.map(usage => (
                                                                            <div key={usage.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                                                                <div>
                                                                                    <p className="text-sm font-medium">{usage.referred_name}</p>
                                                                                    <p className="text-xs text-charcoal/60">{usage.referred_phone}</p>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(usage.status)}`}>
                                                                                        {getStatusLabel(usage.status)}
                                                                                    </span>
                                                                                    {usage.status === 'completed' && !usage.referrer_discount_applied && (
                                                                                        <button
                                                                                            onClick={() => applyReferrerDiscount(usage)}
                                                                                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                                                                                        >
                                                                                            Aplicar Desconto Indicador
                                                                                        </button>
                                                                                    )}
                                                                                    {usage.referrer_discount_applied && (
                                                                                        <span className="text-xs text-green-600">✓ Desc. aplicado</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setValidatorCode(referral.referral_code);
                                                                        setActiveTab('validator');
                                                                        validateCode();
                                                                    }}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage 
                                                                               rounded-lg text-sm font-medium hover:bg-sage/20 transition-colors"
                                                                >
                                                                    <Shield className="w-4 h-4" />
                                                                    Validar
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteReferral(referral.id)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 
                                                                               rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReferralPage;
