# Arquitetura Organizada

SaaS multi-tenant de portfólio para escritórios de arquitetura. Cada cliente tem seu próprio site publicado em subdomínio ou domínio customizado, gerenciado por um painel administrativo completo.

## Stack

- **Next.js 16** (App Router, Server Components)
- **Supabase** — banco de dados PostgreSQL, autenticação e storage de arquivos
- **Mercado Pago** — assinaturas recorrentes via PreApproval
- **Vercel** — deploy e gerenciamento de domínios customizados
- **TypeScript 5**, **Tailwind CSS**, **Tiptap**

## Funcionalidades

### Identidade Visual
- Logo em texto com dois níveis (nome principal + sub-nome)
- Logo em imagem (upload PNG/SVG)
- Seleção de fonte tipográfica com preview em tempo real (modo claro e escuro)

### Categorias
- Criação, edição e reordenação de categorias de portfólio
- Slug gerado automaticamente a partir do nome
- Limite por plano: 2 categorias (Starter) ou ilimitadas (Pro/Agency)

### Projetos
- Editor de texto rico (Tiptap) para descrição do projeto
- Imagem principal + galeria de fotos por projeto
- Marcação de "destaque" para exibição na página inicial
- Meta descrição para SEO
- Limite por plano: 6 projetos totais e 2 fotos (Starter) | 6 fotos (Pro) | fotos ilimitadas (Agency)

### Depoimentos
- Cadastro de depoimentos de clientes com nome, cargo/empresa e texto
- Suporte a foto do cliente (link) — exibe iniciais como fallback
- Exibidos em cards na página inicial do site

### FAQs
- Lista de perguntas e respostas frequentes
- Reordenação por drag-and-drop
- Primeira pergunta expandida por padrão no site

### Contato
- Configuração de número WhatsApp com botão flutuante ativo em todas as páginas
- Mensagem padrão pré-preenchida no WhatsApp
- Instagram (@username) com ícone no menu e rodapé
- Formulário de contato com envio de e-mail via Gmail SMTP (Senha de App)

### Configurações
- Nome do escritório, slug (URL do site)
- Domínio customizado próprio (Pro/Agency) — integração com Vercel API, SSL automático

### Analytics (Agency)
- Rastreamento de visitas por página sem cookies de terceiros
- Gráfico de área com visitas dos últimos 7 e 30 dias
- Ranking dos 5 projetos mais visitados
- Deduplicação via `AbortController` (sem double-count no React StrictMode)

### Equipe (Agency)
- Geração de link de convite com validade de 10 dias
- Até 3 usuários por conta
- Remoção imediata de membros

### Plano & Cobrança
- Três planos: **Starter** (grátis), **Pro** (R$99/mês), **Agency** (R$167/mês)
- Checkout via Mercado Pago PreApproval
- Webhook HMAC para ativação automática de plano após pagamento
- Cancelamento de assinatura pelo próprio painel
- Reembolso via painel superadmin (`/admin/tenants`)
- Banner de confirmação ao retornar do checkout

## Roteamento multi-tenant

O middleware Next.js detecta o subdomínio (ou domínio customizado) e reescreve a requisição para `app/[tenant]/`:

```
brunomoura.arquiteturaorganizada.com.br  →  /[tenant]/
meuescritorio.com.br                     →  /[tenant]/  (domínio customizado)
arquiteturaorganizada.com.br/dashboard   →  painel administrativo
```

## Variáveis de ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_ROOT_DOMAIN=arquiteturaorganizada.com.br
NEXT_PUBLIC_SITE_URL=https://arquiteturaorganizada.com.br

# Vercel (domínios customizados)
VERCEL_TOKEN=
VERCEL_PROJECT_ID=

# Mercado Pago
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=

# Email (formulário de contato)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Cron / reset de demo
CRON_SECRET=

# Superadmin
SUPERADMIN_EMAILS=email@exemplo.com
```

## Planos

| Recurso | Starter | Pro | Agency |
|---|---|---|---|
| Categorias | 2 | Ilimitadas | Ilimitadas |
| Projetos | 6 | Ilimitados | Ilimitados |
| Fotos por projeto | 2 | 6 | Ilimitadas |
| Domínio customizado | — | ✓ | ✓ |
| Analytics | — | — | ✓ |
| Membros na conta | 1 | 1 | até 3 |
| Suporte WhatsApp | — | — | ✓ |
| Chamada privada de onboarding | — | — | ✓ |
| Preço | Grátis | R$99/mês | R$167/mês |

## Estrutura de pastas relevante

```
app/
  (auth)/           — login, signup, onboarding
  (marketing)/      — index, pricing, como-usar
  (app)/dashboard/  — painel admin do tenant
  (superadmin)/admin/ — gestão interna (tenants, billing, stats)
  [tenant]/         — site público do cliente
  api/
    billing/        — checkout, webhook, portal, refund
    upload/         — upload para Supabase Storage
    analytics/      — rastreamento de visitas
    contact/        — envio de e-mail

components/
  admin/            — BillingPanel, ProjectForm, GalleryUpload, etc.
  site/             — componentes do site público do cliente
  marketing/        — Hero, Pricing, Features, Contact, etc.

lib/
  mercadopago/      — client, plans, webhooks
  supabase/         — server, client, admin
  vercel/           — domains API
  tenant/           — guard (requireTenant, requireSuperAdmin)
```

## Setup local

```bash
npm install
cp .env.example .env.local
# preencha as variáveis no .env.local
npm run dev
```

Para testar o multi-tenant local, acesse `http://brunomoura.localhost:3000`.

## Webhook Mercado Pago

Após o deploy, registre o webhook no painel do Mercado Pago:

```
URL: https://arquiteturaorganizada.com.br/api/billing/webhook
Evento: subscription_preapproval
```

## Superadmin

Acesse `/admin` com o e-mail listado em `SUPERADMIN_EMAILS`. Disponível:
- `/admin/tenants` — lista de clientes, reembolso
- `/admin/billing` — visão geral de receita por plano
- `/admin/stats` — métricas de uso e indicador de consumo do Supabase free tier (storage, DB, auth)
# saas-arquitetura
