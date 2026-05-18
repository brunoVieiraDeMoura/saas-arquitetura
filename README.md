# Arquitetura Organizada

SaaS multi-tenant de portfólio para escritórios de arquitetura. Cada cliente tem seu próprio site publicado em subdomínio ou domínio customizado, gerenciado por um painel administrativo completo.

## Stack

- **Next.js 16** (App Router, Server Components)
- **Supabase** — banco de dados PostgreSQL, autenticação e storage de arquivos
- **Stripe** — assinaturas recorrentes, cobrança mensal e anual, portal do cliente
- **Vercel** — deploy e gerenciamento de domínios customizados
- **TypeScript 5**, **Tailwind CSS**, **Tiptap**

## Planos

| Recurso | Starter | Pro | Agency |
|---|---|---|---|
| Categorias | 2 | Ilimitadas | Ilimitadas |
| Projetos | 6 | Ilimitados | Ilimitados |
| Fotos por projeto | 2 | 6 | Ilimitadas |
| Temas por seção | — | ✓ | ✓ |
| Domínio customizado | — | ✓ | ✓ |
| Analytics | — | — | ✓ |
| Membros na conta | 1 | 1 | até 3 |
| Suporte WhatsApp | — | — | ✓ |
| Chamada privada de onboarding | — | — | ✓ |
| Preço mensal | Grátis | R$130/mês | R$250/mês |
| Preço anual | — | R$99/mês (−24%) | R$170/mês (−32%) |

## Funcionalidades

### Identidade Visual
- Logo em texto com dois níveis (nome principal + sub-nome)
- Logo em imagem (upload PNG/SVG)
- Seleção de fonte tipográfica com preview em tempo real
- Cores primária e secundária do site

### Temas (Pro/Agency)
- Variantes de layout por seção: Hero, Projetos, CTA, Depoimentos, FAQ, Contato
- Cada seção tem opções numeradas (1, 2, 3) com preview visual
- Persistido por tenant em `settings`

### Categorias
- Criação, edição e reordenação de categorias de portfólio
- Slug gerado automaticamente a partir do nome
- Limite por plano: 2 (Starter) ou ilimitadas (Pro/Agency)

### Projetos
- Editor de texto rico (Tiptap) para descrição
- Imagem principal + galeria de fotos
- Marcação de destaque para exibição na home
- Meta descrição para SEO
- Limite de fotos por plano: 2 (Starter) | 6 (Pro) | ilimitadas (Agency)

### Depoimentos
- Cadastro com nome, cargo/empresa e texto
- Foto via link — fallback com iniciais
- Exibidos em cards na home do site

### FAQs
- Lista de perguntas e respostas
- Reordenação por drag-and-drop
- Primeira pergunta expandida por padrão no site

### Contato
- Número WhatsApp com botão flutuante ativo em todas as páginas
- Mensagem padrão pré-preenchida no WhatsApp
- Instagram (`@username`) com ícone no menu e rodapé
- Formulário de contato via Gmail SMTP (Senha de App)

### Configurações
- Nome do escritório, slug (URL do site)
- Domínio customizado próprio (Pro/Agency) — integração Vercel API, SSL automático

### Analytics (Agency)
- Rastreamento de visitas por página sem cookies de terceiros
- Gráfico de área com visitas dos últimos 7 e 30 dias
- Ranking dos 5 projetos mais visitados
- Deduplicação via `AbortController` (sem double-count no React StrictMode)

### Equipe (Agency)
- Geração de link de convite com validade de 10 dias
- Até 3 usuários por conta
- Remoção imediata de membros

## Sistema de Pagamentos (Stripe)

### Checkout
- Planos Pro e Agency com opção mensal ou anual
- Sessão criada em `/api/billing/checkout` via `stripe.checkout.sessions.create`
- `metadata` inclui `tenantId` e `plan` para ativação no webhook
- Reutiliza `stripe_customer_id` se o tenant já foi cliente

### Webhook
Endpoint: `/api/billing/webhook`

Eventos tratados:

| Evento | Ação |
|---|---|
| `checkout.session.completed` | Ativa plano, salva `stripe_subscription_id` e `stripe_customer_id` |
| `customer.subscription.updated` | Atualiza plano conforme novo `price_id` |
| `customer.subscription.deleted` | Rebaixa para `starter`, limpa subscription |

Verificação de assinatura via `stripe-signature` header + `STRIPE_WEBHOOK_SECRET`.

### Portal do Cliente
- Acesso em `/api/billing/portal` — redireciona para Stripe Billing Portal
- Permite cancelar, trocar método de pagamento e ver histórico

### Upgrade Pro → Agency
- Endpoint `/api/billing/upgrade` — atualiza subscription inline via `flow_data: subscription_update_confirm`
- Não exige cancelamento e nova assinatura

### Configuração no Stripe
Criar 4 preços (recorrentes):

```
Pro mensal   → STRIPE_PRICE_PRO_MONTHLY
Pro anual    → STRIPE_PRICE_PRO_ANNUAL
Agency mensal → STRIPE_PRICE_AGENCY_MONTHLY
Agency anual  → STRIPE_PRICE_AGENCY_ANNUAL
```

Registrar webhook após deploy:
```
URL: https://arquiteturaorganizada.com.br/api/billing/webhook
Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
```

## Roteamento multi-tenant

Middleware Next.js detecta subdomínio ou domínio customizado e reescreve para `app/[tenant]/`:

```
brunomoura.arquiteturaorganizada.com.br  →  /[tenant]/
meuescritorio.com.br                     →  /[tenant]/  (domínio customizado)
arquiteturaorganizada.com.br/dashboard   →  painel administrativo
```

## Estrutura de pastas

```
app/
  (auth)/                   — login, signup, onboarding, reset-password
  (marketing)/              — home, pricing, como-usar, termos, return-policy
  (app)/dashboard/          — painel admin do tenant
    billing/                — plano atual + checkout + portal
    temas/                  — variantes de layout por seção
    identidade/             — logo, fontes, cores
    categories/             — CRUD de categorias
    projects/               — CRUD de projetos
    testimonials/           — depoimentos
    faqs/                   — perguntas frequentes
    contact/                — WhatsApp, Instagram, email
    settings/               — slug, domínio customizado
    analytics/              — gráfico de visitas (Agency)
    team/                   — membros e convites (Agency)
  (superadmin)/admin/       — gestão interna
    tenants/                — lista de clientes por plano
    billing/                — contadores por plano + tabela
    stats/                  — métricas Supabase (storage, DB, auth)
  [tenant]/                 — site público do cliente
  api/
    billing/                — checkout, portal, upgrade, webhook
    upload/                 — upload para Supabase Storage
    analytics/              — rastreamento de visitas
    contact/                — envio de e-mail
    onboarding/             — setup inicial do tenant
    admin/                  — CRUD interno (categories, projects, etc.)
    cron/reset/             — reset de demo

components/
  admin/                    — BillingPanel, ProjectForm, GalleryUpload, IdentidadePanel, TemasClient, etc.
  site/                     — GalleryLightbox, WhatsAppFloat
  marketing/                — Hero, Pricing, Features, Contact, Testimonials, Navbar, Footer

lib/
  stripe.ts                 — cliente Stripe
  plans.ts                  — definição de planos, limites e preços
  supabase/                 — server, client, admin
  vercel/                   — domains API
  tenant/                   — guard (requireTenant, requireSuperAdmin)
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

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=
STRIPE_PRICE_AGENCY_MONTHLY=
STRIPE_PRICE_AGENCY_ANNUAL=

# Email (formulário de contato)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Cron / reset de demo
CRON_SECRET=

# Superadmin
SUPERADMIN_EMAILS=email@exemplo.com
```

## Setup local

```bash
npm install
cp .env.example .env.local
# preencha as variáveis no .env.local
npm run dev
```

Para testar multi-tenant local: `http://brunomoura.localhost:3000`

Para testar webhooks Stripe local:
```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

## Superadmin

Acesse `/admin` com e-mail listado em `SUPERADMIN_EMAILS`.

| Rota | Descrição |
|---|---|
| `/admin/tenants` | Lista de todos os clientes com plano e data de cadastro |
| `/admin/billing` | Contadores por plano (Starter / Pro / Agency) + tabela completa |
| `/admin/stats` | Métricas de uso e consumo do Supabase free tier (storage, DB, auth) |
