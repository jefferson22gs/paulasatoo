-- =============================================
-- TABELAS ADICIONAIS PARA ADMIN COMPLETO
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. TABELA DE DEPOIMENTOS
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE FAQ
CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Geral',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE POSTS DO INSTAGRAM
CREATE TABLE IF NOT EXISTS instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    post_url TEXT,
    caption TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE VIDEOS
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    youtube_url TEXT,
    thumbnail_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE CORES/TEMA
CREATE TABLE IF NOT EXISTS site_theme (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    primary_color VARCHAR(20) DEFAULT '#7C9A82',
    secondary_color VARCHAR(20) DEFAULT '#C4A35A',
    accent_color VARCHAR(20) DEFAULT '#4A3728',
    background_color VARCHAR(20) DEFAULT '#FAF8F5',
    dark_mode_enabled BOOLEAN DEFAULT TRUE,
    font_family VARCHAR(100) DEFAULT 'Playfair Display',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE SEO
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_title VARCHAR(255) DEFAULT 'Dra. Paula Satoo - Estética Avançada em Indaiatuba',
    meta_description TEXT DEFAULT 'Harmonização facial e procedimentos estéticos personalizados. Realce sua beleza natural com a Dra. Paula Satoo em Indaiatuba.',
    meta_keywords TEXT DEFAULT 'estética, harmonização facial, botox, preenchimento labial, Indaiatuba',
    og_image TEXT,
    favicon_url TEXT,
    google_analytics_id VARCHAR(50),
    facebook_pixel_id VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_theme ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para testimonials
CREATE POLICY "Allow public read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated full access on testimonials" ON testimonials FOR ALL TO authenticated USING (true);

-- Políticas para faqs
CREATE POLICY "Allow public read active faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated full access on faqs" ON faqs FOR ALL TO authenticated USING (true);

-- Políticas para instagram_posts
CREATE POLICY "Allow public read active instagram_posts" ON instagram_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated full access on instagram_posts" ON instagram_posts FOR ALL TO authenticated USING (true);

-- Políticas para videos
CREATE POLICY "Allow public read active videos" ON videos FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated full access on videos" ON videos FOR ALL TO authenticated USING (true);

-- Políticas para site_theme
CREATE POLICY "Allow public read site_theme" ON site_theme FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on site_theme" ON site_theme FOR ALL TO authenticated USING (true);

-- Políticas para seo_settings
CREATE POLICY "Allow public read seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on seo_settings" ON seo_settings FOR ALL TO authenticated USING (true);

-- Inserir dados padrão
INSERT INTO site_theme (primary_color, secondary_color) VALUES ('#7C9A82', '#C4A35A') ON CONFLICT DO NOTHING;
INSERT INTO seo_settings (page_title) VALUES ('Dra. Paula Satoo - Estética Avançada') ON CONFLICT DO NOTHING;

-- Depoimentos de exemplo
INSERT INTO testimonials (name, role, content, rating, display_order) VALUES
('Maria Silva', 'Empresária', 'Experiência incrível! A Dra. Paula é extremamente profissional e cuidadosa. O resultado ficou natural e harmonioso.', 5, 1),
('Ana Costa', 'Arquiteta', 'Adorei o atendimento personalizado. Ela realmente entende o que cada pessoa precisa.', 5, 2),
('Fernanda Lima', 'Advogada', 'Resultados surpreendentes! Recomendo para todas as minhas amigas.', 5, 3)
ON CONFLICT DO NOTHING;

-- FAQs de exemplo
INSERT INTO faqs (question, answer, category, display_order) VALUES
('Os procedimentos são dolorosos?', 'Utilizamos anestesia tópica e técnicas que minimizam o desconforto. A maioria dos pacientes relata apenas uma leve pressão durante o procedimento.', 'Procedimentos', 1),
('Quanto tempo dura o resultado?', 'Depende do procedimento. O Botox dura de 4 a 6 meses, preenchimentos de 12 a 18 meses, e bioestimuladores podem durar até 2 anos.', 'Resultados', 2),
('Preciso de repouso após o procedimento?', 'Na maioria dos casos, você pode retornar às atividades normais imediatamente. Recomendamos apenas evitar atividade física intensa por 24-48 horas.', 'Cuidados', 3),
('Como agendar uma avaliação?', 'Você pode agendar pelo WhatsApp ou pelo formulário de contato do site. A avaliação é personalizada e sem compromisso.', 'Agendamento', 4)
ON CONFLICT DO NOTHING;
