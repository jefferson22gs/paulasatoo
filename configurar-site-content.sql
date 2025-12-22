-- =============================================
-- TABELA DE CONTEÚDO DO SITE
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela para armazenar conteúdo editável do site
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow public read on site_content" 
ON site_content FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on site_content" 
ON site_content FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on site_content" 
ON site_content FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on site_content" 
ON site_content FOR DELETE TO authenticated USING (true);

-- Inserir conteúdo padrão
INSERT INTO site_content (key, value) VALUES
    -- Hero Section
    ('hero_badge', 'Estética Avançada'),
    ('hero_title', 'Dra. Paula Satoo'),
    ('hero_subtitle', 'Realce sua beleza natural com procedimentos estéticos personalizados e resultados que transformam'),
    ('hero_cta_primary', 'Agendar Avaliação'),
    ('hero_cta_secondary', 'Conhecer Tratamentos'),
    
    -- About Section
    ('about_badge', 'SOBRE'),
    ('about_title', 'Dra. Paula Satoo'),
    ('about_paragraph_1', 'Farmacêutica Esteta apaixonada pela ciência da beleza e do cuidado. Com formação especializada em harmonização facial e procedimentos estéticos avançados, minha missão é realçar a beleza natural de cada paciente.'),
    ('about_paragraph_2', 'Acredito que a estética vai além da aparência — é sobre como você se sente. Por isso, cada procedimento é personalizado, respeitando suas características únicas e desejos.'),
    ('about_experience_years', '8'),
    ('about_experience_label', 'Anos de Experiência'),
    ('about_procedures_count', '2000'),
    ('about_procedures_label', 'Procedimentos'),
    ('about_satisfaction_percent', '98'),
    ('about_satisfaction_label', 'Satisfação'),
    
    -- Services Section
    ('services_badge', 'TRATAMENTOS'),
    ('services_title', 'Procedimentos Estéticos'),
    ('services_subtitle', 'Conheça os tratamentos que vão realçar sua beleza natural'),
    
    -- Results Section
    ('results_badge', 'RESULTADOS'),
    ('results_title', 'Transformações Reais'),
    ('results_subtitle', 'Veja os resultados dos nossos procedimentos'),
    
    -- Testimonials Section
    ('testimonials_badge', 'DEPOIMENTOS'),
    ('testimonials_title', 'O Que Dizem Nossos Clientes'),
    ('testimonials_subtitle', 'Experiências reais de transformação e satisfação'),
    
    -- FAQ Section
    ('faq_badge', 'DÚVIDAS'),
    ('faq_title', 'Perguntas Frequentes'),
    ('faq_subtitle', 'Tire suas dúvidas sobre os procedimentos'),
    
    -- Footer
    ('footer_brand', 'Dra. Paula Satoo'),
    ('footer_tagline', 'Estética Avançada'),
    ('footer_description', 'Farmacêutica Esteta especializada em harmonização facial e procedimentos estéticos que realçam sua beleza natural.'),
    ('footer_copyright', 'Dra. Paula Satoo - Estética Avançada. Todos os direitos reservados.')
ON CONFLICT (key) DO NOTHING;
