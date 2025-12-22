-- =============================================
-- SCRIPT DE NOTIFICAÇÕES E PROGRAMA DE INDICAÇÃO
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. TABELA DE ASSINANTES DE PUSH NOTIFICATIONS
CREATE TABLE IF NOT EXISTS push_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    phone VARCHAR(50),
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    device_type VARCHAR(50) DEFAULT 'unknown',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_notification_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE PROMOÇÕES/NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    link_url TEXT,
    discount_percentage INTEGER,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    sent_via_pwa BOOLEAN DEFAULT FALSE,
    sent_via_whatsapp BOOLEAN DEFAULT FALSE,
    pwa_sent_at TIMESTAMP WITH TIME ZONE,
    whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
    pwa_sent_count INTEGER DEFAULT 0,
    whatsapp_sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE HISTÓRICO DE NOTIFICAÇÕES ENVIADAS
CREATE TABLE IF NOT EXISTS notification_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES push_subscribers(id) ON DELETE SET NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('pwa', 'whatsapp')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
    phone VARCHAR(50),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DO PROGRAMA DE INDICAÇÃO
CREATE TABLE IF NOT EXISTS referral_program (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE,
    referrer_discount_percentage DECIMAL(5,2) DEFAULT 10.00,
    referred_discount_percentage DECIMAL(5,2) DEFAULT 15.00,
    min_purchase_value DECIMAL(10,2) DEFAULT 0,
    max_discount_value DECIMAL(10,2),
    expiry_days INTEGER DEFAULT 30,
    terms_conditions TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão do programa de indicação
INSERT INTO referral_program (
    is_active, 
    referrer_discount_percentage, 
    referred_discount_percentage, 
    min_purchase_value,
    expiry_days,
    terms_conditions
) VALUES (
    true, 
    10.00, 
    15.00, 
    0,
    30,
    'O desconto é válido para o primeiro agendamento do indicado. O indicador recebe o desconto após a confirmação do atendimento do indicado.'
) ON CONFLICT DO NOTHING;

-- 5. TABELA DE INDICAÇÕES
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_code VARCHAR(20) NOT NULL UNIQUE,
    referrer_name VARCHAR(255) NOT NULL,
    referrer_phone VARCHAR(50) NOT NULL,
    referrer_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 6. TABELA DE USO DE INDICAÇÕES
CREATE TABLE IF NOT EXISTS referral_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
    referred_name VARCHAR(255) NOT NULL,
    referred_phone VARCHAR(50) NOT NULL,
    referred_email VARCHAR(255),
    discount_applied DECIMAL(10,2),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    referrer_discount_applied BOOLEAN DEFAULT FALSE,
    referrer_discount_used_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE ASSINANTES WHATSAPP (para envio de promoções)
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    opt_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opt_out_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(50) DEFAULT 'site',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE push_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_subscribers ENABLE ROW LEVEL SECURITY;

-- Políticas para push_subscribers
CREATE POLICY "Allow public insert on push_subscribers" ON push_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on push_subscribers" ON push_subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on push_subscribers" ON push_subscribers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on push_subscribers" ON push_subscribers FOR DELETE TO authenticated USING (true);

-- Políticas para promotions
CREATE POLICY "Allow public read active promotions" ON promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated full access on promotions" ON promotions FOR ALL TO authenticated USING (true);

-- Políticas para notification_history
CREATE POLICY "Allow authenticated full access on notification_history" ON notification_history FOR ALL TO authenticated USING (true);

-- Políticas para referral_program
CREATE POLICY "Allow public read on referral_program" ON referral_program FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on referral_program" ON referral_program FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on referral_program" ON referral_program FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on referral_program" ON referral_program FOR DELETE TO authenticated USING (true);

-- Políticas para referrals
CREATE POLICY "Allow public insert on referrals" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update on referrals" ON referrals FOR UPDATE TO authenticated USING (true);

-- Políticas para referral_usage
CREATE POLICY "Allow public insert on referral_usage" ON referral_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on referral_usage" ON referral_usage FOR ALL TO authenticated USING (true);

-- Políticas para whatsapp_subscribers
CREATE POLICY "Allow public insert on whatsapp_subscribers" ON whatsapp_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on whatsapp_subscribers" ON whatsapp_subscribers FOR ALL TO authenticated USING (true);

-- =============================================
-- FUNÇÕES AUXILIARES
-- =============================================

-- Função para gerar código de indicação único
CREATE OR REPLACE FUNCTION generate_referral_code() 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código automaticamente
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON referrals;
CREATE TRIGGER trigger_set_referral_code
    BEFORE INSERT ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION set_referral_code();

-- Trigger para definir data de expiração
CREATE OR REPLACE FUNCTION set_referral_expiry()
RETURNS TRIGGER AS $$
DECLARE
    expiry_days INTEGER;
BEGIN
    SELECT rp.expiry_days INTO expiry_days FROM referral_program rp LIMIT 1;
    IF expiry_days IS NULL THEN
        expiry_days := 30;
    END IF;
    IF NEW.expires_at IS NULL THEN
        NEW.expires_at := NOW() + (expiry_days || ' days')::INTERVAL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_expiry ON referrals;
CREATE TRIGGER trigger_set_referral_expiry
    BEFORE INSERT ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION set_referral_expiry();

-- =============================================
-- ADICIONAR CONFIGURAÇÕES DE VAPID AO SETTINGS
-- =============================================
INSERT INTO settings (key, value) VALUES
    ('vapid_public_key', ''),
    ('vapid_private_key', ''),
    ('whatsapp_api_url', ''),
    ('whatsapp_api_token', '')
ON CONFLICT (key) DO NOTHING;
