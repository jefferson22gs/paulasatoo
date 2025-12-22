import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image as ImageIcon,
    Upload,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Eye,
    X,
    Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getImageConfig } from '../../lib/siteImages.jsx';

const SiteImagesPage = () => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageUrls, setImageUrls] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    // Obter configuração de imagens centralizada
    const IMAGE_CONFIG = getImageConfig();

    // Converter config para array para exibição
    const siteImages = Object.entries(IMAGE_CONFIG).map(([id, config]) => ({
        id,
        ...config
    }));

    const sections = [
        { id: 'hero', name: 'Principal' },
        { id: 'about', name: 'Sobre' },
        { id: 'services', name: 'Serviços' },
        { id: 'results', name: 'Resultados' },
        { id: 'testimonials', name: 'Depoimentos' },
        { id: 'videos', name: 'Vídeos' },
        { id: 'instagram', name: 'Instagram' },
        { id: 'blog', name: 'Blog' }
    ];

    const [activeSection, setActiveSection] = useState('all');

    const filteredImages = activeSection === 'all'
        ? siteImages
        : siteImages.filter(img => img.section === activeSection);

    // Carregar URLs das imagens do Supabase Storage
    useEffect(() => {
        loadImageUrls();
    }, []);

    const loadImageUrls = async () => {
        setLoading(true);
        try {
            const urls = {};

            for (const image of siteImages) {
                // Tentar obter a URL da imagem do Storage
                const { data } = supabase.storage
                    .from('site-images')
                    .getPublicUrl(image.storagePath);

                if (data?.publicUrl) {
                    // Verificar se a imagem existe fazendo uma requisição HEAD
                    try {
                        const response = await fetch(data.publicUrl, { method: 'HEAD' });
                        if (response.ok) {
                            urls[image.id] = data.publicUrl + '?t=' + Date.now();
                        }
                    } catch (e) {
                        // Imagem não existe no Storage
                    }
                }
            }

            setImageUrls(urls);
        } catch (error) {
            console.error('Error loading image URLs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReplace = (image) => {
        setSelectedImage(image);
        setPreviewUrl(null);
        setShowUploadModal(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida.' });
            return;
        }

        // Criar preview
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
    };

    const handleUpload = async () => {
        if (!selectedImage || !fileInputRef.current?.files[0]) {
            setMessage({ type: 'error', text: 'Selecione uma imagem para fazer upload.' });
            return;
        }

        const file = fileInputRef.current.files[0];
        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            // Upload para o Supabase Storage
            const { data, error } = await supabase.storage
                .from('site-images')
                .upload(selectedImage.storagePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                throw error;
            }

            // Obter URL pública
            const { data: urlData } = supabase.storage
                .from('site-images')
                .getPublicUrl(selectedImage.storagePath);

            // Atualizar URLs locais
            setImageUrls(prev => ({
                ...prev,
                [selectedImage.id]: urlData.publicUrl + '?t=' + Date.now()
            }));

            // Salvar referência no banco de dados
            await supabase.from('settings').upsert({
                key: `image_${selectedImage.id}`,
                value: urlData.publicUrl,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

            setMessage({ type: 'success', text: 'Imagem atualizada com sucesso!' });
            setShowUploadModal(false);
            setSelectedImage(null);
            setPreviewUrl(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error('Error uploading image:', error);

            if (error.message?.includes('Bucket not found')) {
                setMessage({
                    type: 'error',
                    text: 'O bucket "site-images" não existe. Crie-o no Supabase Storage primeiro.'
                });
            } else if (error.message?.includes('row-level security')) {
                setMessage({
                    type: 'error',
                    text: 'Erro de permissão. Configure as políticas de acesso no Supabase Storage.'
                });
            } else {
                setMessage({ type: 'error', text: `Erro ao fazer upload: ${error.message}` });
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFromStorage = async (image) => {
        if (!confirm(`Tem certeza que deseja remover a imagem "${image.name}" do Storage?`)) {
            return;
        }

        try {
            const { error } = await supabase.storage
                .from('site-images')
                .remove([image.storagePath]);

            if (error) throw error;

            setImageUrls(prev => {
                const newUrls = { ...prev };
                delete newUrls[image.id];
                return newUrls;
            });

            await supabase.from('settings')
                .delete()
                .eq('key', `image_${image.id}`);

            setMessage({ type: 'success', text: 'Imagem removida. A imagem padrão será usada.' });
        } catch (error) {
            console.error('Error deleting image:', error);
            setMessage({ type: 'error', text: 'Erro ao remover imagem.' });
        }
    };

    const handleViewImage = (image) => {
        const url = imageUrls[image.id] || image.defaultPath;
        window.open(url, '_blank');
    };

    const getImagePath = (image) => {
        return imageUrls[image.id] || image.defaultPath;
    };

    // Contar imagens por seção
    const sectionCounts = sections.reduce((acc, section) => {
        acc[section.id] = siteImages.filter(img => img.section === section.id).length;
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Imagens do Site</h1>
                    <p className="text-charcoal/60 mt-1">
                        {siteImages.length} imagens no total • {Object.keys(imageUrls).length} customizadas
                    </p>
                </div>
                <button
                    onClick={loadImageUrls}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage rounded-xl 
                               font-medium hover:bg-sage/20 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            {/* Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-start gap-3 ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : message.type === 'error'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm flex-1">{message.text}</span>
                        <button onClick={() => setMessage({ type: '', text: '' })}>
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveSection('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeSection === 'all'
                            ? 'bg-sage text-white'
                            : 'bg-white border border-gray-200 text-charcoal/70 hover:border-sage/50'
                        }`}
                >
                    Todas ({siteImages.length})
                </button>
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeSection === section.id
                                ? 'bg-sage text-white'
                                : 'bg-white border border-gray-200 text-charcoal/70 hover:border-sage/50'
                            }`}
                    >
                        {section.name} ({sectionCounts[section.id] || 0})
                    </button>
                ))}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
                    >
                        {/* Image Preview */}
                        <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                            <img
                                src={getImagePath(image)}
                                alt={image.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = image.defaultPath;
                                    e.target.onerror = null;
                                }}
                            />

                            {/* Badge se tem imagem customizada */}
                            {imageUrls[image.id] && (
                                <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                    Customizada
                                </div>
                            )}

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() => handleViewImage(image)}
                                    className="p-2 bg-white rounded-full text-charcoal hover:bg-gray-100 transition-colors"
                                    title="Ver imagem"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleReplace(image)}
                                    className="p-2 bg-sage text-white rounded-full hover:bg-sage-dark transition-colors"
                                    title="Substituir imagem"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                                {imageUrls[image.id] && (
                                    <button
                                        onClick={() => handleDeleteFromStorage(image)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        title="Restaurar imagem padrão"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image Info */}
                        <div className="p-3">
                            <h3 className="font-medium text-charcoal text-sm truncate">{image.name}</h3>
                            <p className="text-xs text-charcoal/60 mt-0.5 truncate">{image.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${imageUrls[image.id]
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-charcoal/50'
                                    }`}>
                                    {imageUrls[image.id] ? 'Storage' : 'Padrão'}
                                </span>
                                <span className="px-2 py-0.5 bg-sage/10 text-sage text-xs rounded-full">
                                    {sections.find(s => s.id === image.section)?.name}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && selectedImage && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUploadModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-charcoal">
                                            Substituir Imagem
                                        </h2>
                                        <p className="text-sm text-charcoal/60">{selectedImage.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Preview */}
                                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                                        <img
                                            src={previewUrl || getImagePath(selectedImage)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {previewUrl && (
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                                Nova imagem
                                            </div>
                                        )}
                                    </div>

                                    {/* File Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                            Selecionar nova imagem
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                                       focus:border-sage outline-none transition-colors
                                                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                                       file:bg-sage file:text-white file:font-medium file:cursor-pointer
                                                       hover:file:bg-sage-dark"
                                        />
                                        <p className="text-xs text-charcoal/50 mt-2">
                                            Recomendado: JPG ou PNG, mínimo 1200px de largura
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-6 py-3 text-charcoal/70 hover:bg-gray-100 rounded-xl 
                                                   font-medium transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading || !previewUrl}
                                        className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                                                   font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
                                                Salvar Imagem
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Info Box */}
            <div className="bg-sage/10 rounded-2xl p-6">
                <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-sage" />
                    Como substituir imagens
                </h3>
                <ol className="text-sm text-charcoal/70 space-y-2 list-decimal list-inside">
                    <li>Passe o mouse sobre a imagem e clique no botão de upload</li>
                    <li>Selecione a nova imagem do seu computador</li>
                    <li>Visualize o preview e clique em "Salvar Imagem"</li>
                    <li>A imagem será enviada automaticamente e aparecerá no site!</li>
                </ol>
                <p className="text-sm text-charcoal/50 mt-4">
                    <strong>Dica:</strong> Use imagens de alta qualidade (mínimo 1200px de largura) para melhor resultado.
                </p>
            </div>
        </div>
    );
};

export default SiteImagesPage;
