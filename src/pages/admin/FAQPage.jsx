import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle, Plus, Edit2, Trash2, Save, X, Eye, EyeOff,
    CheckCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [formData, setFormData] = useState({
        question: '', answer: '', category: 'Geral', is_active: true
    });

    const categories = ['Geral', 'Procedimentos', 'Resultados', 'Cuidados', 'Agendamento', 'Pagamento'];

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('display_order', { ascending: true });
            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar FAQs' });
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
            setFormData({ question: '', answer: '', category: 'Geral', is_active: true });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.question || !formData.answer) {
            setMessage({ type: 'error', text: 'Pergunta e resposta são obrigatórias' });
            return;
        }
        setSaving(true);
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('faqs')
                    .update({ ...formData, updated_at: new Date().toISOString() })
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('faqs')
                    .insert({ ...formData, display_order: faqs.length });
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
            await supabase.from('faqs').update({ is_active: !currentState }).eq('id', id);
            loadData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar' });
        }
    };

    const deleteItem = async (id) => {
        if (!confirm('Excluir esta pergunta?')) return;
        try {
            await supabase.from('faqs').delete().eq('id', id);
            loadData();
            setMessage({ type: 'success', text: 'Excluído!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir' });
        }
    };

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
                        <HelpCircle className="w-7 h-7 text-sage" />
                        Perguntas Frequentes
                    </h1>
                    <p className="text-charcoal/60 mt-1">Gerencie as FAQs exibidas no site</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-600 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Nova Pergunta
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

            <div className="space-y-3">
                {faqs.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${item.is_active ? 'border-gray-100' : 'border-red-200 opacity-60'}`}
                    >
                        <div
                            className="p-4 flex items-center gap-4 cursor-pointer"
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                            <span className="px-2 py-1 text-xs rounded-full bg-sage/10 text-sage font-medium">
                                {item.category}
                            </span>
                            <h3 className="font-medium text-charcoal flex-1">{item.question}</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); toggleActive(item.id, item.is_active); }}
                                    className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); openModal(item); }} className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {expandedId === item.id ? <ChevronUp className="w-5 h-5 text-charcoal/50" /> : <ChevronDown className="w-5 h-5 text-charcoal/50" />}
                            </div>
                        </div>
                        <AnimatePresence>
                            {expandedId === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-100"
                                >
                                    <p className="p-4 text-charcoal/70 bg-gray-50">{item.answer}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
                {faqs.length === 0 && (
                    <div className="text-center py-12 text-charcoal/50">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Nenhuma pergunta cadastrada</p>
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
                                {editingItem ? 'Editar Pergunta' : 'Nova Pergunta'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Categoria</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Pergunta *</label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Resposta *</label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none resize-none"
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

export default FAQPage;
