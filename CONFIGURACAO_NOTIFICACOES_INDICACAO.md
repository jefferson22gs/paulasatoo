# Configuração: Notificações Push e Programa de Indicação

Este documento explica como configurar as novas funcionalidades de **Notificações Push/WhatsApp** e **Programa de Indicação**.

---

## 1. Configuração do Banco de Dados (Supabase)

### Executar o Script SQL

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo do arquivo `supabase-notifications-referral.sql`

Este script criará as seguintes tabelas:

| Tabela | Descrição |
|--------|-----------|
| `push_subscribers` | Assinantes de notificações push (PWA) |
| `promotions` | Promoções criadas pelo admin |
| `notification_history` | Histórico de notificações enviadas |
| `referral_program` | Configurações do programa de indicação |
| `referrals` | Códigos de indicação gerados |
| `referral_usage` | Registro de uso dos códigos |
| `whatsapp_subscribers` | Assinantes de promoções via WhatsApp |

---

## 2. Configuração de Push Notifications (VAPID Keys)

### Gerar Chaves VAPID

Para enviar notificações push, você precisa de chaves VAPID. Execute:

```bash
npx web-push generate-vapid-keys
```

Você receberá algo como:

```
Public Key: BNbxGY..........
Private Key: 3KztB...........
```

### Salvar no Supabase

No SQL Editor do Supabase:

```sql
UPDATE settings SET value = 'SUA_CHAVE_PUBLICA_AQUI' WHERE key = 'vapid_public_key';
UPDATE settings SET value = 'SUA_CHAVE_PRIVADA_AQUI' WHERE key = 'vapid_private_key';
```

### Backend para Envio (Opcional)

Para enviar notificações push reais, você precisa de um backend. Exemplo com Node.js:

```javascript
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:contato@drapaulasatoo.com.br',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Enviar notificação
webpush.sendNotification(subscription, JSON.stringify({
  title: 'Promoção!',
  body: '30% de desconto hoje!',
  icon: '/icons/icon-192.png',
  data: { url: '/' }
}));
```

---

## 3. Configuração de Notificações WhatsApp

### Opção A: Evolution API (Recomendado)

Se você já tem a Evolution API configurada:

```sql
UPDATE settings SET value = 'http://seu-servidor:8080/message/sendText/SuaInstancia' WHERE key = 'whatsapp_api_url';
UPDATE settings SET value = 'seu-api-key' WHERE key = 'whatsapp_api_token';
```

### Opção B: Twilio WhatsApp

Configure com Twilio Business API:

```sql
UPDATE settings SET value = 'https://api.twilio.com/2010-04-01/Accounts/XXX/Messages.json' WHERE key = 'whatsapp_api_url';
UPDATE settings SET value = 'Basic base64(AccountSid:AuthToken)' WHERE key = 'whatsapp_api_token';
```

---

## 4. Usando o Painel Admin

### Acessar o Admin

1. Vá para `/admin/login`
2. Faça login com suas credenciais Supabase

### Notificações (Nova Funcionalidade)

Acesse **Admin > Notificações**:

- Ver quantidade de assinantes PWA e WhatsApp
- Criar novas promoções
- Enviar para PWA, WhatsApp ou ambos
- Ver histórico de envios
- Reenviar promoções

### Programa de Indicação (Nova Funcionalidade)

Acesse **Admin > Indicações**:

- Ativar/desativar o programa
- Configurar percentual de desconto do **indicador** (quem indica)
- Configurar percentual de desconto do **indicado** (quem é indicado) 
- Definir validade dos códigos (em dias)
- Definir valor mínimo de compra para usar o desconto
- Definir desconto máximo em reais
- Ver todos os códigos gerados
- Ver quem usou cada código
- Aplicar desconto do indicador manualmente

---

## 5. Como Funciona para o Cliente

### Notificações Push

1. Cliente acessa o site
2. Após 10 segundos, aparece um prompt pedindo permissão
3. Cliente aceita e é registrado automaticamente
4. Quando o admin cria uma promoção, o cliente recebe no celular/computador

### Programa de Indicação

1. Cliente clica em "Gerar Meu Código" na seção "Indique e Ganhe"
2. Preenche nome, telefone e email (opcional)
3. Recebe um código único (ex: `ABC12345`)
4. Compartilha com amigas
5. Amiga usa o código e ganha desconto
6. Quando a amiga faz o procedimento, o indicador ganha desconto também

---

## 6. Fluxo de Indicação Detalhado

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   INDICADOR     │     │    INDICADO     │     │     ADMIN       │
│   (Cliente A)   │     │   (Cliente B)   │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ 1. Gera código        │                       │
         │    (ABC12345)         │                       │
         │                       │                       │
         │ 2. Compartilha ───────▶                       │
         │                       │                       │
         │                       │ 3. Usa código         │
         │                       │    (ganha 15% desc)   │
         │                       │                       │
         │                       │ 4. Agenda             │
         │                       │    procedimento       │
         │                       │                       │
         │                       │                       │ 5. Marca como
         │                       │                       │    "Concluído"
         │                       │                       │
         │                       │                       │ 6. Aplica desconto
         │                       │◀──────────────────────│    do indicador
         │                       │                       │
         │ 7. Indicador usa      │                       │
         │    desconto (10%)     │                       │
         │                       │                       │
```

---

## 7. Troubleshooting

### Push Notifications não funcionam

1. Verifique se o site está em HTTPS (obrigatório para PWA)
2. Verifique se as chaves VAPID estão configuradas
3. Verifique o console do navegador para erros
4. Alguns navegadores bloqueiam por padrão (Firefox, Safari iOS)

### WhatsApp não envia

1. Verifique se a API está configurada corretamente
2. Verifique se o token está válido
3. Teste a API manualmente com curl/Postman

### Código de indicação não funciona

1. Verifique se o código não expirou
2. Verifique se o programa está ativo
3. Verifique se o código existe no banco

---

## 8. Personalizações

### Alterar textos da seção de indicação

Edite o arquivo `src/components/ReferralSection.jsx`

### Alterar aparência do prompt de notificação

Edite o arquivo `src/components/PushNotificationPrompt.jsx`

### Alterar ícone das notificações

Substitua os arquivos em `public/icons/`

---

## Suporte

Para dúvidas ou problemas, entre em contato.
