import { useState, useEffect, createContext, useContext } from 'react';
import { getSettings, hasBackend } from './supabase';
import { dropLegacy, LEGACY_SETTINGS, DEFAULT_ADDRESS, formatAddress } from './siteDefaults';

// Context para compartilhar as configurações do site
const SiteSettingsContext = createContext({ settings: DEFAULT_ADDRESS, address: formatAddress(DEFAULT_ADDRESS) });

// Provider que carrega as configurações uma vez
export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        // Valores padrão
        business_name: 'Dra. Paula Satoo',
        tagline: 'Estética Avançada',
        phone: '(19) 99003-7678',
        whatsapp: '5519990037678',
        email: 'contato@drapaulasatoo.com.br',
        ...DEFAULT_ADDRESS,
        hours_weekdays: 'Seg - Sex: 9h às 20h',
        hours_saturday: 'Sábado: 9h às 14h',
        instagram: '@dra.paulasatoo'
    });
    const [loading, setLoading] = useState(hasBackend);

    useEffect(() => {
        if (!hasBackend) return;
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            if (data) {
                setSettings(prev => ({
                    ...prev,
                    ...dropLegacy(data, LEGACY_SETTINGS)
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

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings, address: formatAddress(settings) }}>
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
