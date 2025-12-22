import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

// Mapeamento de IDs para caminhos no Storage e imagens padrão
const IMAGE_CONFIG = {
    hero: {
        storagePath: 'hero.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0005.jpg'
    },
    about: {
        storagePath: 'about.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0030.jpg'
    },
    'before-after-1': {
        storagePath: 'before-after-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0002.jpg'
    },
    'before-after-2': {
        storagePath: 'before-after-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0003.jpg'
    },
    'before-after-3': {
        storagePath: 'before-after-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0004.jpg'
    },
    'clinic-1': {
        storagePath: 'clinic-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0006.jpg'
    },
    'clinic-2': {
        storagePath: 'clinic-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0007.jpg'
    },
    'procedure-1': {
        storagePath: 'procedure-1.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0008.jpg'
    },
    'procedure-2': {
        storagePath: 'procedure-2.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0009.jpg'
    },
    'procedure-3': {
        storagePath: 'procedure-3.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0010.jpg'
    }
};

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
        <SiteImagesContext.Provider value={{ images, loading, refreshImages }}>
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
