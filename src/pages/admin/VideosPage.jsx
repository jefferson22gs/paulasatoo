import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Plus, Edit2, Trash2, Save, X, Eye, EyeOff,
    CheckCircle, AlertCircle, RefreshCw, Star, Play, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const VideosPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '', youtube_url: '', description: '', is_active: true, is_featured: false
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('display_order', { ascending: true });
            if (error) throw error;
            setVideos(data || []);
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar vídeos' });
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const getThumbnail = (url) => {
        const videoId = getYouTubeId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({ title: '', youtube_url: '', description: '', is_active: true, is_featured: false });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.youtube_url) {
            setMessage({ type: 'error', text: 'Título e URL são obrigatórios' });
            return;
        }
        setSaving(true);
        try {
            const thumbnail = getThumbnail(formData.youtube_url);
            const dataToSave = { ...formData, thumbnail_url: thumbnail };

            if (editingItem) {
                const { error } = await supabase
                    .from('videos')
                    .update(dataToSave)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('videos')
                    .insert({ ...dataToSave, display_order: videos.length });
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
            await supabase.from('videos').update({ is_active: !currentState }).eq('id', id);
            loadData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar' });
        }
    };

    const toggleFeatured = async (id, currentState) => {
        try {
            // Se estiver ativando destaque, desativar outros
            if (!currentState) {
                await supabase.from('videos').update({ is_featured: false }).neq('id', id);
            }
            await supabase.from('videos').update({ is_featured: !currentState }).eq('id', id);
            loadData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar' });
        }
    };

    const deleteItem = async (id) => {
        if (!confirm('Excluir este vídeo?')) return;
        try {
            await supabase.from('videos').delete().eq('id', id);
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
                        <Video className="w-7 h-7 text-sage" />
                        Vídeos
                    </h1>
                    <p className="text-charcoal/60 mt-1">Gerencie os vídeos do YouTube exibidos no site</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-600 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Novo Vídeo
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${item.is_active ? 'border-gray-100' : 'border-red-200 opacity-60'}`}
                    >
                        <div className="relative aspect-video bg-gray-100">
                            {item.thumbnail_url ? (
                                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Video className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <a
                                    href={item.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <Play className="w-8 h-8 text-red-600 ml-1" />
                                </a>
                            </div>
                            {item.is_featured && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-gold text-white text-xs rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> Destaque
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                            {item.description && (
                                <p className="text-sm text-charcoal/60 line-clamp-2">{item.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-4">
                                <button onClick={() => toggleActive(item.id, item.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => toggleFeatured(item.id, item.is_featured)}
                                    className={`p-2 rounded-lg transition-colors ${item.is_featured ? 'text-gold bg-gold/10' : 'text-gray-400 bg-gray-50'}`}>
                                    <Star className={`w-4 h-4 ${item.is_featured ? 'fill-current' : ''}`} />
                                </button>
                                <button onClick={() => openModal(item)} className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteItem(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <a href={item.youtube_url} target="_blank" rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-charcoal/50 bg-gray-50 hover:bg-gray-100 ml-auto">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {videos.length === 0 && (
                    <div className="col-span-full text-center py-12 text-charcoal/50">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Nenhum vídeo cadastrado</p>
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
                                {editingItem ? 'Editar Vídeo' : 'Novo Vídeo'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Título *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">URL do YouTube *</label>
                                    <input
                                        type="text"
                                        value={formData.youtube_url}
                                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    />
                                </div>
                                {formData.youtube_url && getThumbnail(formData.youtube_url) && (
                                    <div className="rounded-xl overflow-hidden">
                                        <img src={getThumbnail(formData.youtube_url)} alt="Preview" className="w-full" />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Descrição</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none resize-none"
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
                                        />
                                        <span className="text-charcoal">Ativo</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
                                        />
                                        <span className="text-charcoal">Destaque</span>
                                    </label>
                                </div>
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

export default VideosPage;
