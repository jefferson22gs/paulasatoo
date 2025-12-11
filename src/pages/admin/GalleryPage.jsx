import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Loader,
    Link as LinkIcon,
    Edit2,
    ExternalLink
} from 'lucide-react';
import { getGalleryImages, createGalleryImage, deleteGalleryImage, uploadImage } from '../../lib/supabase';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: 'before_after',
        link_url: ''
    });
    const [editingImage, setEditingImage] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const fileInputRef = useRef(null);

    const categories = [
        { value: 'before_after', label: 'Antes e Depois' },
        { value: 'clinic', label: 'Clínica' },
        { value: 'procedures', label: 'Procedimentos' },
        { value: 'team', label: 'Equipe' }
    ];

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            const data = await getGalleryImages();
            setImages(data);
        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida.' });
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB.' });
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setShowUploadModal(true);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            // Upload image to Supabase Storage
            const imageUrl = await uploadImage(selectedFile);

            // Create gallery record
            await createGalleryImage({
                title: formData.title || 'Sem título',
                image_url: imageUrl,
                category: formData.category,
                link_url: formData.link_url || null,
                order: images.length
            });

            setMessage({ type: 'success', text: 'Imagem enviada com sucesso!' });
            loadImages();
            resetUploadModal();
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Erro ao enviar imagem. Verifique se o bucket "gallery" existe no Supabase.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

        try {
            await deleteGalleryImage(id);
            setMessage({ type: 'success', text: 'Imagem excluída com sucesso!' });
            loadImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            setMessage({ type: 'error', text: 'Erro ao excluir imagem.' });
        }
    };

    const resetUploadModal = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData({ title: '', category: 'before_after', link_url: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEditLink = (image) => {
        setEditingImage(image);
        setFormData({
            title: image.title || '',
            category: image.category || 'before_after',
            link_url: image.link_url || ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingImage) return;

        try {
            const { updateGalleryImage } = await import('../../lib/supabase');
            await updateGalleryImage(editingImage.id, {
                title: formData.title,
                category: formData.category,
                link_url: formData.link_url || null
            });
            setMessage({ type: 'success', text: 'Imagem atualizada com sucesso!' });
            loadImages();
            setShowEditModal(false);
            setEditingImage(null);
        } catch (error) {
            console.error('Error updating image:', error);
            setMessage({ type: 'error', text: 'Erro ao atualizar imagem.' });
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Galeria</h1>
                    <p className="text-charcoal/60 mt-1">Gerencie as fotos do site</p>
                </div>
                <label className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                       font-semibold hover:bg-sage-dark transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Enviar Foto
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
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

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetUploadModal}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-x-4 top-4 bottom-4 max-w-lg mx-auto bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-xl font-semibold text-charcoal">Enviar Imagem</h2>
                                <button
                                    onClick={resetUploadModal}
                                    className="p-2 text-charcoal/60 hover:text-charcoal transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-6 space-y-5 overflow-y-auto flex-1">
                                {/* Preview */}
                                {previewUrl && (
                                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Título (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Resultado - Harmonização Facial"
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

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Link (opcional)
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="url"
                                            value={formData.link_url}
                                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                            placeholder="https://instagram.com/p/..."
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                 focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-charcoal/50 mt-1">Ao clicar na foto, abrirá este link</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetUploadModal}
                                        disabled={uploading}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-charcoal rounded-xl 
                             font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 px-4 py-3 bg-sage text-white rounded-xl 
                             font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50
                             flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
                                                Enviar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Images Grid */}
            {images.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
                    <p className="text-charcoal/60 mb-4">Nenhuma imagem na galeria</p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                         font-semibold hover:bg-sage-dark transition-colors cursor-pointer">
                        <Plus className="w-5 h-5" />
                        Adicionar Primeira Imagem
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <motion.div
                            key={image.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                        >
                            <img
                                src={image.image_url}
                                alt={image.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Link indicator */}
                            {image.link_url && (
                                <div className="absolute top-2 left-2 p-1.5 bg-blue-500 text-white rounded-lg">
                                    <ExternalLink className="w-3 h-3" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                                    <p className="text-white/70 text-xs">
                                        {categories.find(c => c.value === image.category)?.label}
                                    </p>
                                    {image.link_url && (
                                        <p className="text-blue-300 text-xs truncate mt-1">
                                            🔗 {image.link_url}
                                        </p>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => handleEditLink(image)}
                                        className="p-2 bg-blue-500 text-white rounded-lg 
                                            hover:bg-blue-600 transition-colors"
                                        title="Editar link"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="p-2 bg-red-500 text-white rounded-lg 
                           hover:bg-red-600 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && editingImage && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setShowEditModal(false); setEditingImage(null); }}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-x-4 top-4 bottom-4 max-w-lg mx-auto bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-xl font-semibold text-charcoal">Editar Imagem</h2>
                                <button
                                    onClick={() => { setShowEditModal(false); setEditingImage(null); }}
                                    className="p-2 text-charcoal/60 hover:text-charcoal transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="p-6 space-y-5 overflow-y-auto flex-1">
                                {/* Preview */}
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                    <img
                                        src={editingImage.image_url}
                                        alt={editingImage.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Título da imagem"
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                             focus:border-sage focus:ring-0 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                        Link de Redirecionamento
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                                        <input
                                            type="url"
                                            value={formData.link_url}
                                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                            placeholder="https://instagram.com/p/..."
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl 
                                 focus:border-sage focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-charcoal/50 mt-1">
                                        Ao clicar na foto no site, o usuário será direcionado para este link
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowEditModal(false); setEditingImage(null); }}
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
                                        <CheckCircle className="w-5 h-5" />
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
