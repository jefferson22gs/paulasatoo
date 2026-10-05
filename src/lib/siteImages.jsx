import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, hasBackend } from './supabase';

// Mapeamento de todas as imagens editáveis do site.
// storagePath com sufixo "-v2": arquivos antigos do Storage (service-N.jpg, about.jpg)
// tinham fotos desatualizadas; novos uploads pelo Admin usam estes caminhos.
const service = (n, title, file) => ({
    storagePath: `service-${n}-v2.jpg`,
    defaultPath: `/images/tratamentos/${file}`,
    name: `Serviço ${n} - ${title}`,
    description: `Foto do cartão "${title}"`,
    section: 'services'
});

const result = (n, title, file) => ({
    storagePath: `result-${n}.jpg`,
    defaultPath: `/images/resultados/${file}`,
    name: `Resultado ${n} - ${title}`,
    description: 'Foto da galeria de resultados',
    section: 'results'
});

const IMAGE_CONFIG = {
    // HERO - Imagem principal
    hero: {
        storagePath: 'hero.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0005.jpg',
        name: 'Imagem Principal (Hero)',
        description: 'Imagem de destaque no topo do site',
        section: 'hero'
    },
    // ABOUT - Seção Sobre mim
    about: {
        storagePath: 'about-v2.jpg',
        defaultPath: '/images/dra-paula-satoo-retrato.jpg',
        name: 'Foto da Dra. Paula',
        description: 'Retrato usado na seção "Sobre mim"',
        section: 'about'
    },
    // SERVICES - mesma ordem dos cartões em ServicesSection
    'service-1': service(1, 'Harmonização Facial', 'harmonizacao-facial.jpg'),
    'service-2': service(2, 'Preenchimento Labial', 'preenchimento-labial.jpg'),
    'service-3': service(3, 'Bioestimuladores', 'bioestimulador.jpg'),
    'service-4': service(4, 'Toxina Botulínica', 'toxina-botulinica.jpg'),
    // Sem foto nova de Skinbooster: mantém o caminho antigo do Storage e usa a arte
    // "Skinbooster" já existente no projeto como padrão
    'service-5': {
        ...service(5, 'Skinbooster', ''),
        storagePath: 'service-5.jpg',
        defaultPath: '/images/dra.paulasatoo-20251210-0012.jpg'
    },
    'service-6': service(6, 'Microagulhamento', 'microagulhamento.jpg'),
    'service-7': service(7, 'Limpeza de Pele', 'limpeza-de-pele.jpg'),
    'service-8': service(8, 'Corporal / Massagem', 'massagem.jpg'),
    // RESULTADOS - galeria com 4 itens
    'result-1': result(1, 'Limpeza de Pele', 'limpeza-de-pele.jpg'),
    'result-2': result(2, 'Lábios (vista frontal)', 'labios-frontal.jpg'),
    'result-3': result(3, 'Toxina Botulínica', 'toxina-botulinica.jpg'),
    'result-4': result(4, 'Preenchimento Labial', 'preenchimento-labial.jpg')
};

// Exportar configuração para uso na página admin
export const getImageConfig = () => IMAGE_CONFIG;

const defaultImages = Object.fromEntries(
    Object.entries(IMAGE_CONFIG).map(([id, config]) => [id, config.defaultPath])
);

// Context para compartilhar as URLs das imagens
const SiteImagesContext = createContext({});

// Provider que carrega as imagens uma vez
export const SiteImagesProvider = ({ children }) => {
    // Começa com as imagens padrão para não exibir fotos antigas enquanto carrega
    const [images, setImages] = useState(defaultImages);
    const [loading, setLoading] = useState(hasBackend);

    useEffect(() => {
        if (!hasBackend) return;
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            // Verifica todas em paralelo; usa o Storage só quando o arquivo existe
            const entries = await Promise.all(Object.entries(IMAGE_CONFIG).map(async ([id, config]) => {
                const { data } = supabase.storage
                    .from('site-images')
                    .getPublicUrl(config.storagePath);
                try {
                    const response = await fetch(data.publicUrl, { method: 'HEAD' });
                    if (response.ok) return [id, data.publicUrl + '?v=' + Date.now()];
                } catch {
                    // Storage indisponível: usa a imagem padrão
                }
                return [id, config.defaultPath];
            }));
            const imageUrls = Object.fromEntries(entries);

            setImages(imageUrls);
        } catch (error) {
            console.error('Error loading site images:', error);
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
