import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, hasBackend } from './supabase';
import { dropLegacy, LEGACY_CONTENT, DEFAULT_CONTENT } from './siteDefaults';

// Context para compartilhar o conteúdo do site
const SiteContentContext = createContext({});

// Provider que carrega o conteúdo uma vez
export const SiteContentProvider = ({ children }) => {
    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(hasBackend);

    useEffect(() => {
        if (!hasBackend) return;
        loadContent();
        loadLogo();
    }, []);

    const loadContent = async () => {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*');

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading site content:', error);
                return;
            }

            if (data && data.length > 0) {
                const contentObj = {};
                data.forEach(item => {
                    contentObj[item.key] = item.value;
                });
                setContent(prev => ({ ...prev, ...dropLegacy(contentObj, LEGACY_CONTENT) }));
            }
        } catch (error) {
            console.error('Error loading site content:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadLogo = async () => {
        try {
            const { data } = supabase.storage
                .from('site-images')
                .getPublicUrl('logo/logo.png');

            // Verificar se a imagem existe
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (response.ok) {
                setLogo(data.publicUrl + '?t=' + Date.now());
            }
        } catch (error) {
            console.error('Error loading logo:', error);
        }
    };

    // Função helper para obter um valor de conteúdo
    const get = (key, fallback = '') => {
        return content[key] || fallback;
    };

    return (
        <SiteContentContext.Provider value={{ content, logo, loading, get }}>
            {children}
        </SiteContentContext.Provider>
    );
};

// Hook para usar o conteúdo em qualquer componente
export const useSiteContent = () => {
    const context = useContext(SiteContentContext);
    return context;
};

export default SiteContentContext;
