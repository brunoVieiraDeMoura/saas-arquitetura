# Arquitetura Organizada

Site de portfólio para escritórios de arquitetura, criado e configurado do zero por mim. O cliente envia fotos e informações — eu entrego o site completo em até 3 dias úteis.

**Site:** [arquiteturaorganizada.com.br](https://arquiteturaorganizada.com.br)

---

## O produto

Cada cliente recebe um site publicado em subdomínio próprio (`seu-nome.arquiteturaorganizada.com.br`), com painel de acesso para acompanhar o portfólio, analytics e solicitar manutenções.

### O que está incluso no Site Completo

- Site completo configurado do zero
- Fotos organizadas por categoria (residencial, comercial, interiores etc.)
- Descrição e SEO de cada projeto
- Link próprio (`seu-nome.arquiteturaorganizada.com.br`)
- Design responsivo (mobile, tablet, desktop)
- Depoimentos de clientes
- Botão WhatsApp integrado
- Painel de acesso para o cliente
- 3 manutenções anuais inclusas
- Entrega em até 3 dias úteis

### Manutenção Exclusiva (opcional, anual)

- Adição de projetos e fotos a qualquer momento
- Ajustes de design e conteúdo
- Suporte prioritário por WhatsApp
- Atendimento em até 24h
- Renovação anual

---

## Preços

| | Site Completo | Manutenção Exclusiva |
|---|---|---|
| Valor | R$ 2.500 | R$ 400/ano |
| Parcelamento | 6x de R$ 416,67 sem juros | 12x de R$ 33,33 sem juros |
| Pagamento | Único | Anual |
| Mensalidade | Nenhuma | — |

Pagamento via Mercado Pago:
- Site Completo → https://mpago.li/26QzuDb
- Manutenção Exclusiva → https://mpago.li/1qT42MJ

---

## Stack

- **Next.js 16** (App Router, Server Components)
- **Supabase** — banco PostgreSQL, autenticação, storage de arquivos
- **Vercel** — deploy e domínios customizados
- **TypeScript 5**, **Tailwind CSS**

---

## Estrutura de pastas

```
app/
  (auth)/                   — login, signup, onboarding, reset de senha
  (marketing)/              — home, pricing, como-usar, termos, reembolso, pagamento
  (app)/dashboard/          — painel admin do cliente
    identidade/             — logo, fontes, cores
    temas/                  — variantes de layout por seção
    categories/             — CRUD de categorias
    projects/               — CRUD de projetos (editor rico + galeria)
    testimonials/           — depoimentos
    faqs/                   — perguntas frequentes
    contact/                — WhatsApp, Instagram, email
    settings/               — slug, domínio customizado
    analytics/              — gráfico de visitas
    team/                   — membros e convites
    billing/                — plano atual
  (superadmin)/admin/       — gestão interna
    tenants/                — lista de clientes
    billing/                — contadores por plano
    stats/                  — métricas Supabase
  [tenant]/                 — site público do cliente (multi-tenant)

components/
  admin/                    — painéis e formulários do dashboard
  site/                     — GalleryLightbox, WhatsAppFloat
  marketing/                — Hero, Pricing, Features, Navbar, Footer etc.

lib/
  supabase/                 — server, client, admin
  vercel/                   — domains API
  tenant/                   — guard (requireTenant, requireSuperAdmin)
```

---

## Roteamento multi-tenant

Middleware detecta subdomínio ou domínio customizado e reescreve para `app/[tenant]/`:

```
brunomoura.arquiteturaorganizada.com.br  →  site público do cliente
arquiteturaorganizada.com.br/dashboard   →  painel administrativo
```

---

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

# Email (formulário de contato)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Cron / reset de demo
CRON_SECRET=

# Superadmin
SUPERADMIN_EMAILS=email@exemplo.com
```

---

## Setup local

```bash
npm install
cp .env.example .env.local
# preencha as variáveis no .env.local
npm run dev
```

Para testar multi-tenant local: `http://brunomoura.localhost:3000`

---

## Superadmin

Acesse `/admin` com e-mail listado em `SUPERADMIN_EMAILS`.

| Rota | Descrição |
|---|---|
| `/admin/tenants` | Lista de clientes com plano e data de cadastro |
| `/admin/billing` | Contadores por plano + tabela completa |
| `/admin/stats` | Métricas de uso do Supabase (storage, DB, auth) |
