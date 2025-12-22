import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, getSettings } from './supabase';

// Context para compartilhar as configurações do site
const SiteSettingsContext = createContext({});

// Provider que carrega as configurações uma vez
export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        // Valores padrão
        business_name: 'Dra. Paula Satoo',
        tagline: 'Estética Avançada',
        phone: '(19) 99003-7678',
        whatsapp: '5519990037678',
        email: 'contato@drapaulasatoo.com.br',
        address: 'Rua Almirante Tamandaré, 54',
        neighborhood: 'Cidade Nova II',
        city: 'Indaiatuba',
        state: 'SP',
        hours_weekdays: 'Seg - Sex: 9h às 20h',
        hours_saturday: 'Sábado: 9h às 14h',
        instagram: '@dra.paulasatoo'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            if (data) {
                setSettings(prev => ({
                    ...prev,
                    ...data
                }));
            }
        } catch (error) {
            console.error('Error loading site settings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para refresh manual das configurações
    const refreshSettings = () => {
        setLoading(true);
        loadSettings();
    };

    // Formatar endereço completo
    const getFullAddress = () => {
        return `${settings.address}, ${settings.neighborhood}, ${settings.city} - ${settings.state}`;
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings, getFullAddress }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

// Hook para usar as configurações em qualquer componente
export const useSiteSettings = () => {
    const context = useContext(SiteSettingsContext);
    return context;
};

export default SiteSettingsContext;
