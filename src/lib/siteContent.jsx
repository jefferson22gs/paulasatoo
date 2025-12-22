import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

// Context para compartilhar o conteúdo do site
const SiteContentContext = createContext({});

// Provider que carrega o conteúdo uma vez
export const SiteContentProvider = ({ children }) => {
    const [content, setContent] = useState({
        // Valores padrão
        hero_badge: 'Estética Avançada',
        hero_title: 'Dra. Paula Satoo',
        hero_subtitle: 'Realce sua beleza natural com procedimentos estéticos personalizados e resultados que transformam',
        hero_cta_primary: 'Agendar Avaliação',
        hero_cta_secondary: 'Conhecer Tratamentos',
        about_badge: 'SOBRE',
        about_title: 'Dra. Paula Satoo',
        about_paragraph_1: 'Farmacêutica Esteta apaixonada pela ciência da beleza e do cuidado.',
        about_paragraph_2: 'Acredito que a estética vai além da aparência.',
        about_experience_years: '8',
        about_experience_label: 'Anos de Experiência',
        about_procedures_count: '2000',
        about_procedures_label: 'Procedimentos',
        about_satisfaction_percent: '98',
        about_satisfaction_label: 'Satisfação',
        services_badge: 'TRATAMENTOS',
        services_title: 'Procedimentos Estéticos',
        services_subtitle: 'Conheça os tratamentos que vão realçar sua beleza natural',
        results_badge: 'RESULTADOS',
        results_title: 'Transformações Reais',
        results_subtitle: 'Veja os resultados dos nossos procedimentos',
        testimonials_badge: 'DEPOIMENTOS',
        testimonials_title: 'O Que Dizem Nossos Clientes',
        testimonials_subtitle: 'Experiências reais de transformação e satisfação',
        faq_badge: 'DÚVIDAS',
        faq_title: 'Perguntas Frequentes',
        faq_subtitle: 'Tire suas dúvidas sobre os procedimentos',
        footer_brand: 'Dra. Paula Satoo',
        footer_tagline: 'Estética Avançada',
        footer_description: 'Farmacêutica Esteta especializada em harmonização facial e procedimentos estéticos.',
        footer_copyright: 'Dra. Paula Satoo - Estética Avançada. Todos os direitos reservados.'
    });
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                setContent(prev => ({ ...prev, ...contentObj }));
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
