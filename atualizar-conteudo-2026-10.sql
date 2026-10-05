-- =============================================
-- ATUALIZAÇÃO DE CONTEÚDO — OUTUBRO/2026
-- Execute no Supabase SQL Editor (idempotente: pode rodar mais de uma vez).
-- Alinha o banco com o documento "ALTERAR SITE". Não apaga tabelas nem registros:
-- itens removidos do site são apenas desativados (is_active = false).
-- =============================================

-- 1. Textos (Seção principal e Sobre mim) — só troca os valores antigos
UPDATE site_content SET value = 'Dra. Paula Satoo', updated_at = NOW()
WHERE key = 'hero_title' AND (value ILIKE '%transformando%' OR value ILIKE '%em confian%');

INSERT INTO site_content (key, value) VALUES
    ('about_badge', 'Dra. Paula Satoo'),
    ('about_title', 'Sobre mim'),
    ('about_paragraph_1', 'Acredito que a verdadeira estética vai muito além da superfície: ela é sobre resgatar a autoestima, cuidar da saúde da pele e respeitar a individualidade de cada rosto.'),
    ('about_paragraph_2', 'Sou farmacêutica, graduada pela Universidade Presbiteriana Mackenzie, e encontrei na estética avançada a minha verdadeira vocação. Ao longo da minha trajetória, busquei unir o rigor científico da minha formação ao olhar artístico para os detalhes. Sou especialista com pós-graduação em Farmácia Estética pelo Instituto Icosmetologia, além de manter-me em constante atualização através de cursos e imersões nas técnicas mais modernas e seguras do mercado, com foco em rejuvenescimento natural, harmonização facial e tratamentos regenerativos.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 2. Endereço (CEP antigo removido por não corresponder ao novo endereço)
INSERT INTO settings (key, value) VALUES
    ('address', 'Rua Homero Paulo Lourenço Barnabé, 105 – Pq. São Lourenço'),
    ('neighborhood', ''),
    ('postal_code', '')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 3. FAQ: desativa "Quanto tempo duram os resultados?"
UPDATE faqs SET is_active = false, updated_at = NOW()
WHERE question ~* 'quanto tempo dur(a|am) o?s? ?resultados?';

-- 4. Depoimentos de exemplo (criados pelo script inicial) não são relatos reais
UPDATE testimonials SET is_active = false, updated_at = NOW()
WHERE content IN (
    'Experiência incrível! A Dra. Paula é extremamente profissional e cuidadosa. O resultado ficou natural e harmonioso.',
    'Adorei o atendimento personalizado. Ela realmente entende o que cada pessoa precisa.',
    'Resultados surpreendentes! Recomendo para todas as minhas amigas.'
);

-- 5. Tratamentos usados na lista do agendamento
UPDATE services
SET name = 'Limpeza de Pele',
    description = 'Remove impurezas profundas, células mortas e o excesso de oleosidade. Deixa a pele viçosa e saudável.'
WHERE name ILIKE 'hidragloss%';

UPDATE services
SET description = 'A evolução da sua pele. Tratamento para estímulo natural do colágeno, que melhora a textura, a firmeza e a sustentação da sua pele.'
WHERE name = 'Bioestimuladores' AND description ILIKE '%elleva%';

-- 6. Vídeos: desativa os que não são do Instagram. Depois, cadastre em
--    Admin > Vídeos os dois Reels fixados (preenchimento labial e "Botox congela?").
UPDATE videos SET is_active = false
WHERE youtube_url IS NULL OR youtube_url !~* 'instagram\.com/';

-- Conferência
SELECT key, value FROM site_content WHERE key IN ('hero_title', 'about_title');
SELECT key, value FROM settings WHERE key IN ('address', 'postal_code');
SELECT question, is_active FROM faqs ORDER BY display_order;
