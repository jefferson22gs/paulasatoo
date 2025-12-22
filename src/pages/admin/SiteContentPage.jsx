import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Save,
    CheckCircle,
    AlertCircle,
    X,
    Image,
    Upload,
    Trash2,
    Eye,
    Type,
    Layout,
    Star,
    Users,
    MessageSquare,
    Phone,
    Info,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SiteContentPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeSection, setActiveSection] = useState('hero');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);

    // Conteúdos de texto do site
    const [content, setContent] = useState({
        // Hero Section
        hero_badge: 'Estética Avançada',
        hero_title: 'Dra. Paula Satoo',
        hero_subtitle: 'Realce sua beleza natural com procedimentos estéticos personalizados e resultados que transformam',
        hero_cta_primary: 'Agendar Avaliação',
        hero_cta_secondary: 'Conhecer Tratamentos',

        // About Section
        about_badge: 'SOBRE',
        about_title: 'Dra. Paula Satoo',
        about_paragraph_1: 'Farmacêutica Esteta apaixonada pela ciência da beleza e do cuidado. Com formação especializada em harmonização facial e procedimentos estéticos avançados, minha missão é realçar a beleza natural de cada paciente.',
        about_paragraph_2: 'Acredito que a estética vai além da aparência — é sobre como você se sente. Por isso, cada procedimento é personalizado, respeitando suas características únicas e desejos.',
        about_experience_years: '8',
        about_experience_label: 'Anos de Experiência',
        about_procedures_count: '2000',
        about_procedures_label: 'Procedimentos',
        about_satisfaction_percent: '98',
        about_satisfaction_label: 'Satisfação',

        // Services Section
        services_badge: 'TRATAMENTOS',
        services_title: 'Procedimentos Estéticos',
        services_subtitle: 'Conheça os tratamentos que vão realçar sua beleza natural',

        // Results Section
        results_badge: 'RESULTADOS',
        results_title: 'Transformações Reais',
        results_subtitle: 'Veja os resultados dos nossos procedimentos',

        // Testimonials Section
        testimonials_badge: 'DEPOIMENTOS',
        testimonials_title: 'O Que Dizem Nossos Clientes',
        testimonials_subtitle: 'Experiências reais de transformação e satisfação',

        // FAQ Section
        faq_badge: 'DÚVIDAS',
        faq_title: 'Perguntas Frequentes',
        faq_subtitle: 'Tire suas dúvidas sobre os procedimentos',

        // Footer
        footer_brand: 'Dra. Paula Satoo',
        footer_tagline: 'Estética Avançada',
        footer_description: 'Farmacêutica Esteta especializada em harmonização facial e procedimentos estéticos que realçam sua beleza natural.',
        footer_copyright: 'Dra. Paula Satoo - Estética Avançada. Todos os direitos reservados.'
    });

    const sections = [
        { id: 'logo', name: 'Logo do Site', icon: Image },
        { id: 'hero', name: 'Seção Principal', icon: Layout },
        { id: 'about', name: 'Sobre', icon: Info },
        { id: 'services', name: 'Tratamentos', icon: Sparkles },
        { id: 'results', name: 'Resultados', icon: Star },
        { id: 'testimonials', name: 'Depoimentos', icon: MessageSquare },
        { id: 'faq', name: 'FAQ', icon: Users },
        { id: 'footer', name: 'Rodapé', icon: Phone }
    ];

    useEffect(() => {
        loadContent();
        loadLogo();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*');

            if (error && error.code !== 'PGRST116') throw error;

            if (data && data.length > 0) {
                const contentObj = {};
                data.forEach(item => {
                    contentObj[item.key] = item.value;
                });
                setContent(prev => ({ ...prev, ...contentObj }));
            }
        } catch (error) {
            console.error('Error loading content:', error);
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
                setCurrentLogo(data.publicUrl + '?t=' + Date.now());
            }
        } catch (error) {
            console.error('Error loading logo:', error);
        }
    };

    const handleContentChange = (key, value) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const saveContent = async () => {
        setSaving(true);
        try {
            // Salvar cada campo de conteúdo
            for (const [key, value] of Object.entries(content)) {
                const { error } = await supabase
                    .from('site_content')
                    .upsert({
                        key,
                        value,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'key' });

                if (error) throw error;
            }

            setMessage({ type: 'success', text: 'Conteúdo salvo com sucesso!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage({ type: 'error', text: `Erro ao salvar: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogo = async () => {
        if (!logoFile) return;

        setSaving(true);
        try {
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('site-images')
                .upload('logo/logo.png', logoFile, {
                    upsert: true,
                    contentType: logoFile.type
                });

            if (uploadError) throw uploadError;

            setMessage({ type: 'success', text: 'Logo atualizado com sucesso!' });
            setLogoFile(null);
            setLogoPreview(null);
            loadLogo();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error uploading logo:', error);
            setMessage({ type: 'error', text: `Erro ao fazer upload: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    const removeLogo = async () => {
        if (!confirm('Tem certeza que deseja remover o logo?')) return;

        setSaving(true);
        try {
            const { error } = await supabase.storage
                .from('site-images')
                .remove(['logo/logo.png']);

            if (error) throw error;

            setCurrentLogo(null);
            setMessage({ type: 'success', text: 'Logo removido!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error removing logo:', error);
            setMessage({ type: 'error', text: `Erro ao remover: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    const renderTextField = (key, label, multiline = false, rows = 3) => (
        <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-charcoal/70 mb-2">
                {label}
            </label>
            {multiline ? (
                <textarea
                    value={content[key] || ''}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    rows={rows}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                               focus:border-sage focus:ring-0 outline-none transition-colors resize-none"
                />
            ) : (
                <input
                    type="text"
                    value={content[key] || ''}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                               focus:border-sage focus:ring-0 outline-none transition-colors"
                />
            )}
        </div>
    );

    const renderLogoSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-sage/10 to-gold/10 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-sage" />
                    Logo do Site
                </h3>
                <p className="text-sm text-charcoal/60 mb-6">
                    O logo aparece no cabeçalho e rodapé do site. Recomendamos uma imagem PNG com fundo transparente.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Logo Atual */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-charcoal/70 mb-4">Logo Atual</p>
                        <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                            {currentLogo ? (
                                <img
                                    src={currentLogo}
                                    alt="Logo atual"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-charcoal/40">
                                    <Image className="w-12 h-12 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">Nenhum logo definido</p>
                                </div>
                            )}
                        </div>
                        {currentLogo && (
                            <button
                                onClick={removeLogo}
                                disabled={saving}
                                className="mt-4 w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg 
                                           hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remover Logo
                            </button>
                        )}
                    </div>

                    {/* Upload Novo Logo */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-charcoal/70 mb-4">Novo Logo</p>

                        {logoPreview ? (
                            <div className="space-y-4">
                                <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                        src={logoPreview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={uploadLogo}
                                        disabled={saving}
                                        className="flex-1 py-2 px-4 bg-sage text-white rounded-lg 
                                                   hover:bg-sage-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                        Salvar Logo
                                    </button>
                                    <button
                                        onClick={() => {
                                            setLogoFile(null);
                                            setLogoPreview(null);
                                        }}
                                        className="py-2 px-4 bg-gray-100 text-charcoal rounded-lg 
                                                   hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="aspect-video bg-gray-50 rounded-lg flex flex-col items-center 
                                              justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200">
                                <Upload className="w-8 h-8 text-charcoal/40 mb-2" />
                                <span className="text-sm text-charcoal/60">Clique para selecionar</span>
                                <span className="text-xs text-charcoal/40 mt-1">PNG, JPG até 2MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHeroSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-purple-600" />
                    Seção Principal (Hero)
                </h3>
                <p className="text-sm text-charcoal/60 mb-6">
                    Esta é a primeira seção que os visitantes veem ao acessar o site.
                </p>

                {renderTextField('hero_badge', 'Badge (texto pequeno acima do título)')}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                        Título Principal
                    </label>
                    <input
                        type="text"
                        value={content['hero_title'] || ''}
                        onChange={(e) => handleContentChange('hero_title', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl 
                                   focus:border-sage focus:ring-0 outline-none transition-colors"
                        placeholder="Transformando *beleza* em confiança"
                    />
                    <p className="text-xs text-charcoal/50 mt-1">
                        💡 Use *asteriscos* para destacar uma palavra em itálico dourado. Ex: Transformando *beleza* em confiança
                    </p>
                </div>

                {renderTextField('hero_subtitle', 'Subtítulo', true, 3)}
                <div className="grid md:grid-cols-2 gap-4">
                    {renderTextField('hero_cta_primary', 'Botão Principal')}
                    {renderTextField('hero_cta_secondary', 'Botão Secundário')}
                </div>
            </div>
        </div>
    );

    const renderAboutSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-green-600" />
                    Seção Sobre
                </h3>

                {renderTextField('about_badge', 'Badge')}
                {renderTextField('about_title', 'Título')}
                {renderTextField('about_paragraph_1', 'Parágrafo 1', true, 4)}
                {renderTextField('about_paragraph_2', 'Parágrafo 2', true, 4)}

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-xl">
                        <p className="text-xs text-charcoal/50 mb-2">Experiência</p>
                        {renderTextField('about_experience_years', 'Anos')}
                        {renderTextField('about_experience_label', 'Legenda')}
                    </div>
                    <div className="bg-white p-4 rounded-xl">
                        <p className="text-xs text-charcoal/50 mb-2">Procedimentos</p>
                        {renderTextField('about_procedures_count', 'Quantidade')}
                        {renderTextField('about_procedures_label', 'Legenda')}
                    </div>
                    <div className="bg-white p-4 rounded-xl">
                        <p className="text-xs text-charcoal/50 mb-2">Satisfação</p>
                        {renderTextField('about_satisfaction_percent', 'Porcentagem')}
                        {renderTextField('about_satisfaction_label', 'Legenda')}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderServicesSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    Seção Tratamentos
                </h3>

                {renderTextField('services_badge', 'Badge')}
                {renderTextField('services_title', 'Título')}
                {renderTextField('services_subtitle', 'Subtítulo', true, 2)}
            </div>
        </div>
    );

    const renderResultsSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Seção Resultados
                </h3>

                {renderTextField('results_badge', 'Badge')}
                {renderTextField('results_title', 'Título')}
                {renderTextField('results_subtitle', 'Subtítulo', true, 2)}
            </div>
        </div>
    );

    const renderTestimonialsSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-600" />
                    Seção Depoimentos
                </h3>

                {renderTextField('testimonials_badge', 'Badge')}
                {renderTextField('testimonials_title', 'Título')}
                {renderTextField('testimonials_subtitle', 'Subtítulo', true, 2)}
            </div>
        </div>
    );

    const renderFAQSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    Seção FAQ
                </h3>

                {renderTextField('faq_badge', 'Badge')}
                {renderTextField('faq_title', 'Título')}
                {renderTextField('faq_subtitle', 'Subtítulo', true, 2)}
            </div>
        </div>
    );

    const renderFooterSection = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-100 to-slate-100 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    Rodapé
                </h3>

                {renderTextField('footer_brand', 'Nome da Marca')}
                {renderTextField('footer_tagline', 'Tagline')}
                {renderTextField('footer_description', 'Descrição', true, 3)}
                {renderTextField('footer_copyright', 'Texto de Copyright')}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'logo': return renderLogoSection();
            case 'hero': return renderHeroSection();
            case 'about': return renderAboutSection();
            case 'services': return renderServicesSection();
            case 'results': return renderResultsSection();
            case 'testimonials': return renderTestimonialsSection();
            case 'faq': return renderFAQSection();
            case 'footer': return renderFooterSection();
            default: return renderHeroSection();
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal flex items-center gap-3">
                        <FileText className="w-7 h-7 text-sage" />
                        Conteúdo do Site
                    </h1>
                    <p className="text-charcoal/60 mt-1">
                        Edite os textos e logo que aparecem no site
                    </p>
                </div>

                <button
                    onClick={saveContent}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl 
                               font-medium hover:bg-sage-600 transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Salvar Alterações
                </button>
            </div>

            {/* Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                            }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        {message.text}
                        <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar - Section Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-4">
                        <h3 className="text-sm font-medium text-charcoal/50 uppercase tracking-wide mb-4">
                            Seções
                        </h3>
                        <nav className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${activeSection === section.id
                                            ? 'bg-sage text-white'
                                            : 'text-charcoal/70 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{section.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteContentPage;
