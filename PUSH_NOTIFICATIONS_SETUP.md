# 📱 Configuração de Notificações Push (Gratuito)

## ✅ Estrutura: GitHub + Supabase + Vercel (100% GRATUITO)

Sua estrutura permite notificações push reais sem custos adicionais!

---

## 📋 Passos para Ativar

### 1️⃣ Salvar as Chaves VAPID no Supabase

Acesse **Supabase > SQL Editor** e execute:

```sql
INSERT INTO settings (key, value) 
VALUES ('vapid_public_key', 'BFb0XXu09MY8CVxDd1aA6G7CAeK7lCHGF89BKTcwE3o__erBnGLb5w3riRdSr_X7HwNLHuNYGlckmL7emBLfoZQ')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO settings (key, value) 
VALUES ('vapid_private_key', 'mYL-JmjRVUrTTe0LcdziA344leogUcl1oL6AFb-8yzQ')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

### 2️⃣ Configurar Variáveis de Ambiente no Vercel

No Vercel Dashboard, vá em **Settings > Environment Variables** e adicione:

| Variável | Valor |
|----------|-------|
| `SUPABASE_URL` | (sua URL do Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | (sua chave service_role do Supabase) |

> ⚠️ A chave `service_role` está em: Supabase > Settings > API > service_role key

### 3️⃣ Fazer Deploy

```bash
git add .
git commit -m "feat: Adiciona API de notificações push"
git push origin main
```

O Vercel vai fazer o deploy automaticamente.

---

## 🧪 Testar

1. Acesse seu site e aceite as notificações
2. Vá em **Admin > Notificações**
3. Crie uma promoção e envie via PWA
4. A notificação vai aparecer no dispositivo! 🎉

---

## 📁 Arquivos Criados

```
paulasatoo-main/
├── api/
│   └── send-push.js          # ← API Serverless do Vercel
├── vercel.json               # ← Configuração do Vercel
└── ...
```

---

## 🔧 Como Funciona

1. **Cliente aceita notificações** → Salva subscription no Supabase
2. **Admin cria promoção** → Chama API `/api/send-push`
3. **API do Vercel** → Usa `web-push` para enviar para todos os inscritos
4. **Navegador do cliente** → Mostra a notificação!

---

## � Suas Chaves VAPID

- **Pública:** `BFb0XXu09MY8CVxDd1aA6G7CAeK7lCHGF89BKTcwE3o__erBnGLb5w3riRdSr_X7HwNLHuNYGlckmL7emBLfoZQ`
- **Privada:** `mYL-JmjRVUrTTe0LcdziA344leogUcl1oL6AFb-8yzQ`

⚠️ **NUNCA compartilhe a chave privada publicamente!**
