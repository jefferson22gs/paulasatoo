import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

// Context para compartilhar dados dinâmicos
const DynamicDataContext = createContext({});

// Provider que carrega dados do banco
export const DynamicDataProvider = ({ children }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            // Carregar depoimentos ativos
            const { data: testimonialsData } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (testimonialsData) setTestimonials(testimonialsData);

            // Carregar FAQs ativos
            const { data: faqsData } = await supabase
                .from('faqs')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (faqsData) setFaqs(faqsData);

            // Carregar vídeos ativos
            const { data: videosData } = await supabase
                .from('videos')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (videosData) setVideos(videosData);

        } catch (error) {
            console.error('Error loading dynamic data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para recarregar dados (útil para atualizações em tempo real)
    const refresh = () => {
        loadAllData();
    };

    return (
        <DynamicDataContext.Provider value={{
            testimonials,
            faqs,
            videos,
            loading,
            refresh
        }}>
            {children}
        </DynamicDataContext.Provider>
    );
};

// Hook para usar os dados
export const useDynamicData = () => {
    const context = useContext(DynamicDataContext);
    return context;
};

export default DynamicDataContext;
