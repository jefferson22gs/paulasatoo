-- =============================================
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. TABELA DE CONFIGURAÇÕES
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO settings (key, value) VALUES
    ('clinic_name', 'Dra. Paula Satoo - Estética Avançada'),
    ('address', 'Rua Almirante Tamandaré, 54'),
    ('city', 'Indaiatuba - SP'),
    ('postal_code', '13334-100'),
    ('phone', '(19) 99003-7678'),
    ('whatsapp', '5519990037678'),
    ('email', 'contato@drapaulasatoo.com.br'),
    ('instagram', '@dra.paulasatoo'),
    ('hours_weekday', '09:00 - 20:00'),
    ('hours_saturday', '09:00 - 14:00'),
    ('hours_sunday', 'Fechado')
ON CONFLICT (key) DO NOTHING;

-- 2. TABELA DE SERVIÇOS/PREÇOS
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(100) NOT NULL,
    price_note VARCHAR(255),
    duration VARCHAR(50),
    category VARCHAR(50) DEFAULT 'facial',
    is_popular BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir serviços de exemplo
INSERT INTO services (name, description, price, price_note, duration, category, is_popular, "order") VALUES
    ('Harmonização Facial', 'Procedimento completo para equilíbrio das proporções faciais', 'R$ 2.500,00', 'A partir de', '2h', 'facial', true, 1),
    ('Preenchimento Labial', 'Aumento e definição dos lábios com ácido hialurônico', 'R$ 1.200,00', 'Por sessão', '45min', 'facial', true, 2),
    ('Toxina Botulínica', 'Tratamento para rugas e linhas de expressão', 'R$ 1.500,00', 'Por região', '30min', 'facial', true, 3),
    ('Bioestimuladores', 'Estímulo da produção natural de colágeno', 'R$ 2.000,00', 'Por sessão', '1h', 'facial', false, 4),
    ('Skinbooster', 'Hidratação profunda e rejuvenescimento da pele', 'R$ 800,00', 'Por sessão', '45min', 'facial', false, 5),
    ('Microagulhamento', 'Estímulo de colágeno com microagulhas', 'R$ 500,00', 'Por sessão', '1h', 'facial', false, 6)
ON CONFLICT DO NOTHING;

-- 3. TABELA DE AGENDAMENTOS
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    treatment VARCHAR(255) NOT NULL,
    preferred_time VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE GALERIA
CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT,
    category VARCHAR(50) DEFAULT 'before_after',
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE HORÁRIOS
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(day_of_week)
);

-- Inserir horários padrão
INSERT INTO schedules (day_of_week, start_time, end_time, is_available) VALUES
    (0, '09:00', '14:00', false),  -- Domingo
    (1, '09:00', '20:00', true),   -- Segunda
    (2, '09:00', '20:00', true),   -- Terça
    (3, '09:00', '20:00', true),   -- Quarta
    (4, '09:00', '20:00', true),   -- Quinta
    (5, '09:00', '20:00', true),   -- Sexta
    (6, '09:00', '14:00', true)    -- Sábado
ON CONFLICT (day_of_week) DO NOTHING;

-- =============================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Allow public read on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read on schedules" ON schedules FOR SELECT USING (true);

-- Políticas para escrita apenas autenticado
CREATE POLICY "Allow authenticated insert on settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on settings" ON settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on settings" ON settings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on services" ON services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on services" ON services FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow public insert on appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on appointments" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on appointments" ON appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on appointments" ON appointments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on gallery" ON gallery FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on gallery" ON gallery FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on schedules" ON schedules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on schedules" ON schedules FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on schedules" ON schedules FOR DELETE TO authenticated USING (true);

-- =============================================
-- CRIAR BUCKET DE STORAGE PARA IMAGENS
-- =============================================
-- Vá em Storage > New Bucket e crie um bucket chamado "gallery"
-- Depois configure as políticas:
-- - Acesso público para leitura
-- - Acesso autenticado para upload/delete
