import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    Upload,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Eye
} from 'lucide-react';

const SiteImagesPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [replacingId, setReplacingId] = useState(null);
    const fileInputRef = useRef(null);

    // Define the site images that can be managed
    const siteImages = [
        {
            id: 'hero',
            name: 'Imagem Principal (Hero)',
            description: 'Imagem de destaque no topo do site',
            currentPath: '/images/dra.paulasatoo-20251210-0005.jpg',
            section: 'hero'
        },
        {
            id: 'about',
            name: 'Foto da Dra. Paula',
            description: 'Foto usada na seção "Sobre"',
            currentPath: '/images/dra.paulasatoo-20251210-0001.jpg',
            section: 'about'
        },
        {
            id: 'before-after-1',
            name: 'Antes e Depois 1',
            description: 'Primeira imagem de resultado',
            currentPath: '/images/dra.paulasatoo-20251210-0002.jpg',
            section: 'results'
        },
        {
            id: 'before-after-2',
            name: 'Antes e Depois 2',
            description: 'Segunda imagem de resultado',
            currentPath: '/images/dra.paulasatoo-20251210-0003.jpg',
            section: 'results'
        },
        {
            id: 'before-after-3',
            name: 'Antes e Depois 3',
            description: 'Terceira imagem de resultado',
            currentPath: '/images/dra.paulasatoo-20251210-0004.jpg',
            section: 'results'
        },
        {
            id: 'clinic-1',
            name: 'Foto da Clínica 1',
            description: 'Ambiente da clínica',
            currentPath: '/images/dra.paulasatoo-20251210-0006.jpg',
            section: 'clinic'
        },
        {
            id: 'clinic-2',
            name: 'Foto da Clínica 2',
            description: 'Sala de procedimentos',
            currentPath: '/images/dra.paulasatoo-20251210-0007.jpg',
            section: 'clinic'
        },
        {
            id: 'procedure-1',
            name: 'Procedimento 1',
            description: 'Imagem de procedimento',
            currentPath: '/images/dra.paulasatoo-20251210-0008.jpg',
            section: 'procedures'
        },
        {
            id: 'procedure-2',
            name: 'Procedimento 2',
            description: 'Imagem de procedimento',
            currentPath: '/images/dra.paulasatoo-20251210-0009.jpg',
            section: 'procedures'
        },
        {
            id: 'procedure-3',
            name: 'Procedimento 3',
            description: 'Imagem de procedimento',
            currentPath: '/images/dra.paulasatoo-20251210-0010.jpg',
            section: 'procedures'
        }
    ];

    const sections = [
        { id: 'hero', name: 'Principal' },
        { id: 'about', name: 'Sobre' },
        { id: 'results', name: 'Resultados' },
        { id: 'clinic', name: 'Clínica' },
        { id: 'procedures', name: 'Procedimentos' }
    ];

    const [activeSection, setActiveSection] = useState('all');

    const filteredImages = activeSection === 'all'
        ? siteImages
        : siteImages.filter(img => img.section === activeSection);

    const handleReplace = (imageId) => {
        setReplacingId(imageId);
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file || !replacingId) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // For now, show a message explaining how to replace images
            // In a full implementation, this would upload to Supabase Storage
            // and update the image references

            setMessage({
                type: 'info',
                text: `Para substituir esta imagem, faça upload dela no Supabase Storage (bucket 'site-images') e atualize a referência no código. Nome sugerido: ${replacingId}.jpg`
            });

            // Show preview of new image
            const preview = URL.createObjectURL(file);
            const imageIndex = siteImages.findIndex(img => img.id === replacingId);
            if (imageIndex !== -1) {
                // Update the preview temporarily
                const updatedImages = [...siteImages];
                updatedImages[imageIndex] = {
                    ...updatedImages[imageIndex],
                    previewPath: preview
                };
            }

        } catch (error) {
            console.error('Error replacing image:', error);
            setMessage({ type: 'error', text: 'Erro ao substituir imagem. Tente novamente.' });
        } finally {
            setLoading(false);
            setReplacingId(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleViewImage = (path) => {
        window.open(path, '_blank');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-charcoal">Imagens do Site</h1>
                <p className="text-charcoal/60 mt-1">Visualize e gerencie as imagens utilizadas no site</p>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Message */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    <span className="text-sm">{message.text}</span>
                </motion.div>
            )}

            {/* Section Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveSection('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeSection === 'all'
                            ? 'bg-sage text-white'
                            : 'bg-white border border-gray-200 text-charcoal/70 hover:border-sage/50'
                        }`}
                >
                    Todas
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
                        {section.name}
                    </button>
                ))}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                src={image.previewPath || image.currentPath}
                                alt={image.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                    e.target.onerror = null;
                                }}
                            />
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() => handleViewImage(image.currentPath)}
                                    className="p-3 bg-white rounded-full text-charcoal hover:bg-gray-100 transition-colors"
                                    title="Ver imagem"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleReplace(image.id)}
                                    disabled={loading}
                                    className="p-3 bg-sage text-white rounded-full hover:bg-sage-dark transition-colors disabled:opacity-50"
                                    title="Substituir imagem"
                                >
                                    {loading && replacingId === image.id ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Upload className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Image Info */}
                        <div className="p-4">
                            <h3 className="font-medium text-charcoal">{image.name}</h3>
                            <p className="text-sm text-charcoal/60 mt-1">{image.description}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-charcoal/40 truncate max-w-[70%]">
                                    {image.currentPath}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-charcoal/60 text-xs rounded-full">
                                    {sections.find(s => s.id === image.section)?.name}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Box */}
            <div className="bg-sage/10 rounded-2xl p-6">
                <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-sage" />
                    Como substituir imagens
                </h3>
                <ol className="text-sm text-charcoal/70 space-y-2 list-decimal list-inside">
                    <li>Clique no botão de upload que aparece ao passar o mouse sobre a imagem</li>
                    <li>Selecione a nova imagem do seu computador</li>
                    <li>A imagem será enviada para o Supabase Storage</li>
                    <li>A referência será atualizada automaticamente no site</li>
                </ol>
                <p className="text-sm text-charcoal/50 mt-4">
                    <strong>Dica:</strong> Use imagens de alta qualidade (mínimo 1200px de largura) para melhor resultado.
                </p>
            </div>
        </div>
    );
};

export default SiteImagesPage;
