-- =============================================
-- CONFIGURAR BUCKET PARA IMAGENS DO SITE
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar o bucket 'site-images' (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Política para leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "Imagens públicas para leitura" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-images');

-- 3. Política para upload (somente usuários autenticados)
CREATE POLICY "Upload para usuários autenticados" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'site-images');

-- 4. Política para atualização (somente usuários autenticados)
CREATE POLICY "Atualização para usuários autenticados" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'site-images');

-- 5. Política para exclusão (somente usuários autenticados)
CREATE POLICY "Exclusão para usuários autenticados" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'site-images');

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'site-images';
