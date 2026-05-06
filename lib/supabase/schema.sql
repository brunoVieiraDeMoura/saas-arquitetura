-- ============================================================
-- Arquitetura Organizada SaaS — Schema Supabase (Multi-tenant)
-- ============================================================

-- Tenants (estúdios cadastrados no SaaS)
CREATE TABLE IF NOT EXISTS tenants (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   TEXT UNIQUE NOT NULL,
  name                   TEXT NOT NULL,
  plan                   TEXT NOT NULL DEFAULT 'starter',
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  custom_domain          TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles: liga auth.users ao tenant
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper: retorna tenant_id do usuário autenticado
CREATE OR REPLACE FUNCTION get_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Trigger: auto-seta tenant_id em INSERTs sem tenant_id
CREATE OR REPLACE FUNCTION set_tenant_id_fn()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id = get_tenant_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Tabelas de conteúdo ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES categories(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL,
  date             DATE NOT NULL,
  main_image       TEXT NOT NULL,
  gallery          TEXT[] DEFAULT '{}',
  content          JSONB,
  is_featured      BOOLEAN DEFAULT FALSE,
  meta_description TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  author     TEXT NOT NULL,
  role       TEXT,
  content    TEXT NOT NULL,
  avatar     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key        TEXT NOT NULL,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, key)
);

-- ── Triggers ─────────────────────────────────────────────────────────────────

CREATE TRIGGER trg_categories_tenant BEFORE INSERT ON categories
  FOR EACH ROW EXECUTE FUNCTION set_tenant_id_fn();

CREATE TRIGGER trg_projects_tenant BEFORE INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION set_tenant_id_fn();

CREATE TRIGGER trg_testimonials_tenant BEFORE INSERT ON testimonials
  FOR EACH ROW EXECUTE FUNCTION set_tenant_id_fn();

CREATE TRIGGER trg_faqs_tenant BEFORE INSERT ON faqs
  FOR EACH ROW EXECUTE FUNCTION set_tenant_id_fn();

CREATE TRIGGER trg_settings_tenant BEFORE INSERT ON settings
  FOR EACH ROW EXECUTE FUNCTION set_tenant_id_fn();

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE tenants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;

-- Tenants: leitura pública (resolução de slug nos sites públicos)
CREATE POLICY "public read tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "owner manage tenant" ON tenants FOR ALL USING (id = get_tenant_id());

-- Profiles
CREATE POLICY "user read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "user manage own profile" ON profiles FOR ALL USING (id = auth.uid());

-- Conteúdo: leitura pública, escrita somente pelo tenant dono
CREATE POLICY "public read categories"    ON categories    FOR SELECT USING (true);
CREATE POLICY "tenant write categories"   ON categories    FOR ALL    USING (tenant_id = get_tenant_id()) WITH CHECK (tenant_id = get_tenant_id());

CREATE POLICY "public read projects"      ON projects      FOR SELECT USING (true);
CREATE POLICY "tenant write projects"     ON projects      FOR ALL    USING (tenant_id = get_tenant_id()) WITH CHECK (tenant_id = get_tenant_id());

CREATE POLICY "public read testimonials"  ON testimonials  FOR SELECT USING (true);
CREATE POLICY "tenant write testimonials" ON testimonials  FOR ALL    USING (tenant_id = get_tenant_id()) WITH CHECK (tenant_id = get_tenant_id());

CREATE POLICY "public read faqs"          ON faqs          FOR SELECT USING (true);
CREATE POLICY "tenant write faqs"         ON faqs          FOR ALL    USING (tenant_id = get_tenant_id()) WITH CHECK (tenant_id = get_tenant_id());

CREATE POLICY "public read settings"      ON settings      FOR SELECT USING (true);
CREATE POLICY "tenant write settings"     ON settings      FOR ALL    USING (tenant_id = get_tenant_id()) WITH CHECK (tenant_id = get_tenant_id());

-- ── Storage Buckets ───────────────────────────────────────────────────────────
-- Criar no painel Supabase > Storage (todos públicos):
--   projects | categories | logo
