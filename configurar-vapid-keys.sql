-- =============================================
-- CONFIGURAR CHAVES VAPID PARA NOTIFICAÇÕES PUSH
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Atualizar as chaves VAPID na tabela settings
UPDATE settings SET value = 'BFb0XXu09MY8CVxDd1aA6G7CAeK7lCHGF89BKTcwE3o__erBnGLb5w3riRdSr_X7HwNLHuNYGlckmL7emBLfoZQ'
WHERE key = 'vapid_public_key';

UPDATE settings SET value = 'mYL-JmjRVUrTTe0LcdziA344leogUcl1oL6AFb-8yzQ'
WHERE key = 'vapid_private_key';

-- Se as chaves não existirem, inserir
INSERT INTO settings (key, value) 
VALUES ('vapid_public_key', 'BFb0XXu09MY8CVxDd1aA6G7CAeK7lCHGF89BKTcwE3o__erBnGLb5w3riRdSr_X7HwNLHuNYGlckmL7emBLfoZQ')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO settings (key, value) 
VALUES ('vapid_private_key', 'mYL-JmjRVUrTTe0LcdziA344leogUcl1oL6AFb-8yzQ')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verificar se as chaves foram salvas
SELECT * FROM settings WHERE key LIKE 'vapid%';
