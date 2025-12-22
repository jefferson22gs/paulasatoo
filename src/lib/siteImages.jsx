import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

// Mapeamento COMPLETO de todas as imagens do site
const IMAGE_CONFIG = {
    // HERO - Imagem principal
    hero: {
        storagePath: 'hero.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0005.jpg',
        name: 'Imagem Principal (Hero)',
        description: 'Imagem de destaque no topo do site',
        section: 'hero'
    },
    // ABOUT - Seção Sobre
    about: {
        storagePath: 'about.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0030.jpg',
        name: 'Foto da Dra. Paula',
        description: 'Foto usada na seção "Sobre"',
        section: 'about'
    },
    // SERVICES - Seção de Serviços
    'service-1': {
        storagePath: 'service-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0010.jpg',
        name: 'Serviço 1 - Harmonização Facial',
        description: 'Imagem do serviço de harmonização',
        section: 'services'
    },
    'service-2': {
        storagePath: 'service-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0015.jpg',
        name: 'Serviço 2 - Botox',
        description: 'Imagem do serviço de botox',
        section: 'services'
    },
    'service-3': {
        storagePath: 'service-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0020.jpg',
        name: 'Serviço 3 - Preenchimento',
        description: 'Imagem do serviço de preenchimento',
        section: 'services'
    },
    'service-4': {
        storagePath: 'service-4.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0025.jpg',
        name: 'Serviço 4 - Lábios',
        description: 'Imagem do serviço de lábios',
        section: 'services'
    },
    'service-5': {
        storagePath: 'service-5.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0035.jpg',
        name: 'Serviço 5 - Skinbooster',
        description: 'Imagem do serviço skinbooster',
        section: 'services'
    },
    'service-6': {
        storagePath: 'service-6.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0012.jpg',
        name: 'Serviço 6 - Bioestimuladores',
        description: 'Imagem de bioestimuladores',
        section: 'services'
    },
    'service-7': {
        storagePath: 'service-7.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0017.jpg',
        name: 'Serviço 7 - Fios de PDO',
        description: 'Imagem de fios de PDO',
        section: 'services'
    },
    'service-8': {
        storagePath: 'service-8.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0028.jpg',
        name: 'Serviço 8 - Microagulhamento',
        description: 'Imagem de microagulhamento',
        section: 'services'
    },
    // BEFORE/AFTER - Antes e Depois
    'before-after-1-before': {
        storagePath: 'before-after-1-before.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0022.jpg',
        name: 'Antes e Depois 1 - Antes',
        description: 'Imagem antes do procedimento 1',
        section: 'results'
    },
    'before-after-1-after': {
        storagePath: 'before-after-1-after.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0023.jpg',
        name: 'Antes e Depois 1 - Depois',
        description: 'Imagem depois do procedimento 1',
        section: 'results'
    },
    'before-after-2-before': {
        storagePath: 'before-after-2-before.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0024.jpg',
        name: 'Antes e Depois 2 - Antes',
        description: 'Imagem antes do procedimento 2',
        section: 'results'
    },
    'before-after-2-after': {
        storagePath: 'before-after-2-after.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0025.jpg',
        name: 'Antes e Depois 2 - Depois',
        description: 'Imagem depois do procedimento 2',
        section: 'results'
    },
    'before-after-3-before': {
        storagePath: 'before-after-3-before.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0026.jpg',
        name: 'Antes e Depois 3 - Antes',
        description: 'Imagem antes do procedimento 3',
        section: 'results'
    },
    'before-after-3-after': {
        storagePath: 'before-after-3-after.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0027.jpg',
        name: 'Antes e Depois 3 - Depois',
        description: 'Imagem depois do procedimento 3',
        section: 'results'
    },
    // TESTIMONIALS - Depoimentos
    'testimonial-1': {
        storagePath: 'testimonial-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0031.jpg',
        name: 'Depoimento 1',
        description: 'Foto do depoimento 1',
        section: 'testimonials'
    },
    'testimonial-2': {
        storagePath: 'testimonial-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0032.jpg',
        name: 'Depoimento 2',
        description: 'Foto do depoimento 2',
        section: 'testimonials'
    },
    'testimonial-3': {
        storagePath: 'testimonial-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0033.jpg',
        name: 'Depoimento 3',
        description: 'Foto do depoimento 3',
        section: 'testimonials'
    },
    'testimonial-4': {
        storagePath: 'testimonial-4.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0034.jpg',
        name: 'Depoimento 4',
        description: 'Foto do depoimento 4',
        section: 'testimonials'
    },
    // VIDEO SECTION - Thumbnails de vídeos
    'video-1': {
        storagePath: 'video-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0002.jpg',
        name: 'Thumbnail Vídeo 1',
        description: 'Thumbnail do vídeo 1',
        section: 'videos'
    },
    'video-2': {
        storagePath: 'video-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0004.jpg',
        name: 'Thumbnail Vídeo 2',
        description: 'Thumbnail do vídeo 2',
        section: 'videos'
    },
    'video-3': {
        storagePath: 'video-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0007.jpg',
        name: 'Thumbnail Vídeo 3',
        description: 'Thumbnail do vídeo 3',
        section: 'videos'
    },
    'video-4': {
        storagePath: 'video-4.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0009.jpg',
        name: 'Thumbnail Vídeo 4',
        description: 'Thumbnail do vídeo 4',
        section: 'videos'
    },
    // INSTAGRAM - Feed do Instagram
    'instagram-1': {
        storagePath: 'instagram-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0001.jpg',
        name: 'Instagram Post 1',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-2': {
        storagePath: 'instagram-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0003.jpg',
        name: 'Instagram Post 2',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-3': {
        storagePath: 'instagram-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0006.jpg',
        name: 'Instagram Post 3',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-4': {
        storagePath: 'instagram-4.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0008.jpg',
        name: 'Instagram Post 4',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-5': {
        storagePath: 'instagram-5.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0011.jpg',
        name: 'Instagram Post 5',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-6': {
        storagePath: 'instagram-6.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0014.jpg',
        name: 'Instagram Post 6',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-7': {
        storagePath: 'instagram-7.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0018.jpg',
        name: 'Instagram Post 7',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    'instagram-8': {
        storagePath: 'instagram-8.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0021.jpg',
        name: 'Instagram Post 8',
        description: 'Imagem do feed do Instagram',
        section: 'instagram'
    },
    // BLOG - Artigos do blog
    'blog-1': {
        storagePath: 'blog-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0036.jpg',
        name: 'Blog Post 1',
        description: 'Imagem do artigo 1 do blog',
        section: 'blog'
    },
    'blog-2': {
        storagePath: 'blog-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0037.jpg',
        name: 'Blog Post 2',
        description: 'Imagem do artigo 2 do blog',
        section: 'blog'
    },
    'blog-3': {
        storagePath: 'blog-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0038.jpg',
        name: 'Blog Post 3',
        description: 'Imagem do artigo 3 do blog',
        section: 'blog'
    }
};

// Exportar configuração para uso na página admin
export const getImageConfig = () => IMAGE_CONFIG;

// Context para compartilhar as URLs das imagens
const SiteImagesContext = createContext({});

// Provider que carrega as imagens uma vez
export const SiteImagesProvider = ({ children }) => {
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            const imageUrls = {};

            // Carregar todas as imagens do Storage
            for (const [id, config] of Object.entries(IMAGE_CONFIG)) {
                // Tentar obter URL do Storage
                const { data } = supabase.storage
                    .from('site-images')
                    .getPublicUrl(config.storagePath);

                if (data?.publicUrl) {
                    // Verificar se a imagem existe no Storage
                    try {
                        const response = await fetch(data.publicUrl, { method: 'HEAD' });
                        if (response.ok) {
                            imageUrls[id] = data.publicUrl + '?v=' + Date.now();
                        } else {
                            imageUrls[id] = config.defaultPath;
                        }
                    } catch (e) {
                        imageUrls[id] = config.defaultPath;
                    }
                } else {
                    imageUrls[id] = config.defaultPath;
                }
            }

            setImages(imageUrls);
        } catch (error) {
            console.error('Error loading site images:', error);
            // Usar imagens padrão em caso de erro
            const defaultImages = {};
            for (const [id, config] of Object.entries(IMAGE_CONFIG)) {
                defaultImages[id] = config.defaultPath;
            }
            setImages(defaultImages);
        } finally {
            setLoading(false);
        }
    };

    // Função para refresh manual das imagens
    const refreshImages = () => {
        setLoading(true);
        loadImages();
    };

    return (
        <SiteImagesContext.Provider value={{ images, loading, refreshImages, config: IMAGE_CONFIG }}>
            {children}
        </SiteImagesContext.Provider>
    );
};

// Hook para usar as imagens em qualquer componente
export const useSiteImages = () => {
    const context = useContext(SiteImagesContext);
    return context;
};

// Função para obter uma imagem específica (sem contexto, para uso alternativo)
export const getSiteImageUrl = async (imageId) => {
    const config = IMAGE_CONFIG[imageId];
    if (!config) return null;

    try {
        const { data } = supabase.storage
            .from('site-images')
            .getPublicUrl(config.storagePath);

        if (data?.publicUrl) {
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (response.ok) {
                return data.publicUrl + '?v=' + Date.now();
            }
        }
    } catch (e) {
        // Fallback
    }

    return config.defaultPath;
};

export default IMAGE_CONFIG;
