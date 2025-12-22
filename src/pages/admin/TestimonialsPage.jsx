import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Plus, Edit2, Trash2, Save, X, Star, Eye, EyeOff,
    CheckCircle, AlertCircle, RefreshCw, Upload, GripVertical, User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', role: '', content: '', rating: 5, image_url: '', is_active: true
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order', { ascending: true });
            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar depoimentos' });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({ name: '', role: '', content: '', rating: 5, image_url: '', is_active: true });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.content) {
            setMessage({ type: 'error', text: 'Nome e depoimento são obrigatórios' });
            return;
        }
        setSaving(true);
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('testimonials')
                    .update({ ...formData, updated_at: new Date().toISOString() })
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert({ ...formData, display_order: testimonials.length });
                if (error) throw error;
            }
            setMessage({ type: 'success', text: 'Salvo com sucesso!' });
            setShowModal(false);
            loadData();
        } catch (error) {
            setMessage({ type: 'error', text: `Erro: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (id, currentState) => {
        try {
            await supabase.from('testimonials').update({ is_active: !currentState }).eq('id', id);
            loadData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar' });
        }
    };

    const deleteItem = async (id) => {
        if (!confirm('Excluir este depoimento?')) return;
        try {
            await supabase.from('testimonials').delete().eq('id', id);
            loadData();
            setMessage({ type: 'success', text: 'Excluído!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir' });
        }
    };

    const renderStars = (rating, editable = false, onChange = null) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => editable && onChange && onChange(star)}
                    className={`${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                >
                    <Star
                        className={`w-5 h-5 ${star <= rating ? 'fill-gold text-gold' : 'text-gray-300'}`}
                    />
                </button>
            ))}
        </div>
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-sage" />
                        Depoimentos
                    </h1>
                    <p className="text-charcoal/60 mt-1">Gerencie os depoimentos exibidos no site</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-600 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Novo Depoimento
                </button>
            </div>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto"><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4">
                {testimonials.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        className={`bg-white rounded-2xl shadow-sm border p-6 ${item.is_active ? 'border-gray-100' : 'border-red-200 opacity-60'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-sage" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-charcoal">{item.name}</h3>
                                    {item.role && <span className="text-sm text-charcoal/50">• {item.role}</span>}
                                    {renderStars(item.rating)}
                                </div>
                                <p className="text-charcoal/70 italic">"{item.content}"</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleActive(item.id, item.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => openModal(item)} className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteItem(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {testimonials.length === 0 && (
                    <div className="text-center py-12 text-charcoal/50">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Nenhum depoimento cadastrado</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-semibold text-charcoal mb-6">
                                {editingItem ? 'Editar Depoimento' : 'Novo Depoimento'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Nome *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Profissão/Cargo</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Depoimento *</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">Avaliação</label>
                                    {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">URL da Foto (opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
                                    />
                                    <span className="text-charcoal">Exibir no site</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-charcoal/70 hover:bg-gray-100 rounded-xl">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-sage text-white rounded-xl hover:bg-sage-600 disabled:opacity-50"
                                >
                                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Salvar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TestimonialsPage;
