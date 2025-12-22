import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Palette, Save, CheckCircle, AlertCircle, X, RefreshCw,
    Globe, Eye, Code, Sun, Moon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SEOThemePage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('seo');

    const [seo, setSeo] = useState({
        page_title: 'Dra. Paula Satoo - Estética Avançada em Indaiatuba',
        meta_description: 'Harmonização facial e procedimentos estéticos personalizados.',
        meta_keywords: 'estética, harmonização facial, botox, Indaiatuba',
        og_image: '',
        google_analytics_id: '',
        facebook_pixel_id: ''
    });

    const [theme, setTheme] = useState({
        primary_color: '#7C9A82',
        secondary_color: '#C4A35A',
        accent_color: '#4A3728',
        background_color: '#FAF8F5',
        dark_mode_enabled: true,
        font_family: 'Playfair Display'
    });

    const fonts = [
        'Playfair Display',
        'Inter',
        'Roboto',
        'Outfit',
        'Poppins',
        'Montserrat',
        'Lora',
        'Merriweather'
    ];

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load SEO
            const { data: seoData } = await supabase.from('seo_settings').select('*').limit(1).single();
            if (seoData) setSeo(seoData);

            // Load Theme
            const { data: themeData } = await supabase.from('site_theme').select('*').limit(1).single();
            if (themeData) setTheme(themeData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSEO = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase.from('seo_settings').select('id').limit(1).single();

            if (existing) {
                await supabase.from('seo_settings')
                    .update({ ...seo, updated_at: new Date().toISOString() })
                    .eq('id', existing.id);
            } else {
                await supabase.from('seo_settings').insert(seo);
            }
            setMessage({ type: 'success', text: 'SEO salvo com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: `Erro: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    const saveTheme = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase.from('site_theme').select('id').limit(1).single();

            if (existing) {
                await supabase.from('site_theme')
                    .update({ ...theme, updated_at: new Date().toISOString() })
                    .eq('id', existing.id);
            } else {
                await supabase.from('site_theme').insert(theme);
            }
            setMessage({ type: 'success', text: 'Tema salvo com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: `Erro: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-charcoal flex items-center gap-3">
                    <Globe className="w-7 h-7 text-sage" />
                    SEO & Tema do Site
                </h1>
                <p className="text-charcoal/60 mt-1">Configure SEO e personalize as cores do site</p>
            </div>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto"><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('seo')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 -mb-px transition-colors ${activeTab === 'seo' ? 'text-sage border-sage' : 'text-charcoal/60 border-transparent'
                        }`}
                >
                    <Search className="w-5 h-5" /> SEO
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 -mb-px transition-colors ${activeTab === 'theme' ? 'text-sage border-sage' : 'text-charcoal/60 border-transparent'
                        }`}
                >
                    <Palette className="w-5 h-5" /> Tema & Cores
                </button>
            </div>

            {/* SEO Tab */}
            {activeTab === 'seo' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h2 className="text-lg font-semibold text-charcoal mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5 text-sage" />
                        Configurações de SEO
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-2">Título da Página</label>
                            <input
                                type="text"
                                value={seo.page_title}
                                onChange={(e) => setSeo({ ...seo, page_title: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                placeholder="Título que aparece na aba do navegador"
                            />
                            <p className="text-xs text-charcoal/50 mt-1">{seo.page_title?.length || 0}/60 caracteres recomendados</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-2">Meta Descrição</label>
                            <textarea
                                value={seo.meta_description}
                                onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-sage outline-none resize-none"
                                placeholder="Descrição que aparece no Google"
                            />
                            <p className="text-xs text-charcoal/50 mt-1">{seo.meta_description?.length || 0}/160 caracteres recomendados</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-2">Palavras-chave</label>
                            <input
                                type="text"
                                value={seo.meta_keywords}
                                onChange={(e) => setSeo({ ...seo, meta_keywords: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                placeholder="estética, harmonização, botox (separadas por vírgula)"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                    <Code className="w-4 h-4 inline mr-1" />
                                    Google Analytics ID
                                </label>
                                <input
                                    type="text"
                                    value={seo.google_analytics_id}
                                    onChange={(e) => setSeo({ ...seo, google_analytics_id: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    placeholder="G-XXXXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal/70 mb-2">
                                    <Code className="w-4 h-4 inline mr-1" />
                                    Facebook Pixel ID
                                </label>
                                <input
                                    type="text"
                                    value={seo.facebook_pixel_id}
                                    onChange={(e) => setSeo({ ...seo, facebook_pixel_id: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                                    placeholder="XXXXXXXXXXXXXXXX"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-charcoal/50 mb-2">Prévia no Google:</p>
                            <div className="bg-white p-3 rounded-lg border">
                                <p className="text-blue-700 text-lg hover:underline cursor-pointer">{seo.page_title || 'Título da página'}</p>
                                <p className="text-green-700 text-sm">drapaulasatoo.com.br</p>
                                <p className="text-sm text-charcoal/70">{seo.meta_description || 'Descrição da página...'}</p>
                            </div>
                        </div>

                        <button
                            onClick={saveSEO}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl hover:bg-sage-600 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Salvar SEO
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h2 className="text-lg font-semibold text-charcoal mb-6 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-sage" />
                        Cores e Tema
                    </h2>

                    <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal/70 mb-2">Cor Primária</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={theme.primary_color}
                                        onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-100"
                                    />
                                    <input
                                        type="text"
                                        value={theme.primary_color}
                                        onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                                        className="flex-1 px-3 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal/70 mb-2">Cor Secundária</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={theme.secondary_color}
                                        onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-100"
                                    />
                                    <input
                                        type="text"
                                        value={theme.secondary_color}
                                        onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                                        className="flex-1 px-3 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal/70 mb-2">Cor de Destaque</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={theme.accent_color}
                                        onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-100"
                                    />
                                    <input
                                        type="text"
                                        value={theme.accent_color}
                                        onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                                        className="flex-1 px-3 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal/70 mb-2">Fundo</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={theme.background_color}
                                        onChange={(e) => setTheme({ ...theme, background_color: e.target.value })}
                                        className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-100"
                                    />
                                    <input
                                        type="text"
                                        value={theme.background_color}
                                        onChange={(e) => setTheme({ ...theme, background_color: e.target.value })}
                                        className="flex-1 px-3 py-2 border-2 border-gray-100 rounded-xl focus:border-sage outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-2">Fonte Principal</label>
                            <select
                                value={theme.font_family}
                                onChange={(e) => setTheme({ ...theme, font_family: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-sage outline-none"
                            >
                                {fonts.map((font) => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={theme.dark_mode_enabled}
                                        onChange={(e) => setTheme({ ...theme, dark_mode_enabled: e.target.checked })}
                                        className="sr-only"
                                    />
                                    <div className={`w-14 h-8 rounded-full transition-colors ${theme.dark_mode_enabled ? 'bg-sage' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform flex items-center justify-center ${theme.dark_mode_enabled ? 'translate-x-6' : ''}`}>
                                            {theme.dark_mode_enabled ? <Moon className="w-3 h-3 text-sage" /> : <Sun className="w-3 h-3 text-gray-400" />}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-charcoal">Modo Escuro</span>
                                    <p className="text-sm text-charcoal/60">Permitir que usuários alternem para modo escuro</p>
                                </div>
                            </label>
                        </div>

                        {/* Preview */}
                        <div className="rounded-xl overflow-hidden border">
                            <div className="p-3 bg-gray-100 text-xs text-charcoal/50">Prévia das cores:</div>
                            <div className="p-6" style={{ backgroundColor: theme.background_color }}>
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: theme.primary_color }}></div>
                                    <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: theme.secondary_color }}></div>
                                    <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: theme.accent_color }}></div>
                                </div>
                                <p className="mt-4" style={{ fontFamily: theme.font_family, color: theme.accent_color }}>
                                    Texto de exemplo com a fonte {theme.font_family}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={saveTheme}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl hover:bg-sage-600 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Salvar Tema
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SEOThemePage;
