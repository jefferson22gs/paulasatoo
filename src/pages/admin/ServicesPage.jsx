import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    DollarSign,
    Sparkles,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../../lib/supabase';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        price_note: '',
        duration: '',
        category: 'facial',
        is_popular: false,
        order: 0
    });

    const categories = [
        { value: 'facial', label: 'Facial' },
        { value: 'corporal', label: 'Corporal' },
        { value: 'capilar', label: 'Capilar' },
        { value: 'outros', label: 'Outros' }
    ];

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            price_note: '',
            duration: '',
            category: 'facial',
            is_popular: false,
            order: services.length
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (service) => {
        setFormData(service);
        setEditingId(service.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (editingId) {
                await updateService(editingId, formData);
                setMessage({ type: 'success', text: 'Serviço atualizado com sucesso!' });
            } else {
                await createService(formData);
                setMessage({ type: 'success', text: 'Serviço criado com sucesso!' });
            }
            loadServices();
            resetForm();
        } catch (error) {
            console.error('Error saving service:', error);
            setMessage({ type: 'error', text: 'Erro ao salvar serviço. Tente novamente.' });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

        try {
            await deleteService(id);
            setMessage({ type: 'success', text: 'Serviço excluído com sucesso!' });
            loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            setMessage({ type: 'error', text: 'Erro ao excluir serviço.' });
        }
    };

    const formatPrice = (value) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/\D/g, '');
        // Format as currency
        const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return formatted;
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Serviços & Preços</h1>
                    <p className="text-charcoal/60 mt-1">Gerencie seus procedimentos e valores</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                   font-semibold hover:bg-sage-dark transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Serviço
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

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-x-4 top-4 bottom-4 max-w-lg mx-auto bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-xl font-semibold text-charcoal">
                                    {editingId ? 'Editar Serviço' : 'Novo Serviço'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="p-2 text-charcoal/60 hover:text-charcoal transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Nome do Serviço *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Ex: Harmonização Facial"
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                             focus:border-sage focus:ring-0 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        placeholder="Breve descrição do procedimento..."
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                             focus:border-sage focus:ring-0 outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                            Preço *
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                            <input
                                                type="text"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                                placeholder="R$ 500,00"
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                 focus:border-sage focus:ring-0 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                            Duração
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="Ex: 1h30"
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                               focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Observação de Preço
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.price_note}
                                        onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                                        placeholder="Ex: A partir de, Por sessão, etc."
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                             focus:border-sage focus:ring-0 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                             focus:border-sage focus:ring-0 outline-none transition-colors"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_popular"
                                        checked={formData.is_popular}
                                        onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
                                    />
                                    <label htmlFor="is_popular" className="text-sm text-charcoal/70">
                                        Marcar como popular (destaque)
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-charcoal rounded-xl 
                             font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-sage text-white rounded-xl 
                             font-semibold hover:bg-sage-dark transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Services List */}
            {services.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
                    <p className="text-charcoal/60 mb-4">Nenhum serviço cadastrado ainda</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                     font-semibold hover:bg-sage-dark transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Adicionar Primeiro Serviço
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-sage/30 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-charcoal">{service.name}</h3>
                                        {service.is_popular && (
                                            <span className="px-2 py-1 bg-gold/10 text-gold text-xs rounded-full font-medium">
                                                Popular
                                            </span>
                                        )}
                                        <span className="px-2 py-1 bg-gray-100 text-charcoal/60 text-xs rounded-full">
                                            {categories.find(c => c.value === service.category)?.label}
                                        </span>
                                    </div>
                                    {service.description && (
                                        <p className="text-sm text-charcoal/60 mb-3">{service.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="font-semibold text-sage">{service.price}</span>
                                        {service.price_note && (
                                            <span className="text-charcoal/50">{service.price_note}</span>
                                        )}
                                        {service.duration && (
                                            <span className="text-charcoal/50">• {service.duration}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 text-charcoal/60 hover:text-sage hover:bg-sage/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 text-charcoal/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesPage;
