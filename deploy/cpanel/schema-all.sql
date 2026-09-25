-- ==========================================
-- Migration: 001_init.up.sql
-- ==========================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    code text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX roles_code_active_uniq ON roles (code) WHERE deleted_at IS NULL;

CREATE TABLE permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

CREATE UNIQUE INDEX permissions_code_active_uniq ON permissions (code) WHERE deleted_at IS NULL;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX users_email_active_uniq ON users (lower(email)) WHERE deleted_at IS NULL;

CREATE TABLE user_roles (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE refresh_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX refresh_tokens_hash_uniq ON refresh_tokens (token_hash);
CREATE INDEX refresh_tokens_user_idx ON refresh_tokens (user_id, expires_at DESC);

CREATE TABLE pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key text NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX pages_key_active_uniq ON pages (page_key) WHERE deleted_at IS NULL;
CREATE INDEX pages_public_idx ON pages (page_key, status, published_at) WHERE deleted_at IS NULL;

CREATE TABLE media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name text NOT NULL,
    object_key text NOT NULL,
    url text NOT NULL,
    mime_type text NOT NULL,
    size_bytes bigint NOT NULL CHECK (size_bytes >= 0),
    alt_text text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'failed', 'archived')),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX media_object_key_active_uniq ON media (object_key) WHERE deleted_at IS NULL;

CREATE TABLE services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid REFERENCES services(id),
    slug text NOT NULL,
    full_path text NOT NULL,
    title text NOT NULL,
    summary text,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    image_url text,
    gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at timestamptz,
    sort_order integer NOT NULL DEFAULT 0,
    depth integer NOT NULL DEFAULT 0 CHECK (depth >= 0 AND depth <= 4),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1,
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE UNIQUE INDEX services_full_path_active_uniq ON services (full_path) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX services_parent_slug_active_uniq ON services (COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug) WHERE deleted_at IS NULL;
CREATE INDEX services_public_idx ON services (status, published_at, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid REFERENCES products(id),
    slug text NOT NULL,
    full_path text NOT NULL,
    title text NOT NULL,
    summary text,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    specs jsonb NOT NULL DEFAULT '{}'::jsonb,
    datasheet_url text,
    image_url text,
    gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at timestamptz,
    sort_order integer NOT NULL DEFAULT 0,
    depth integer NOT NULL DEFAULT 0 CHECK (depth >= 0 AND depth <= 4),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1,
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE UNIQUE INDEX products_full_path_active_uniq ON products (full_path) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX products_parent_slug_active_uniq ON products (COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug) WHERE deleted_at IS NULL;
CREATE INDEX products_public_idx ON products (status, published_at, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE news_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    version integer NOT NULL DEFAULT 1,
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE UNIQUE INDEX news_categories_slug_active_uniq ON news_categories (slug) WHERE deleted_at IS NULL;

CREATE TABLE news (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES news_categories(id),
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    body jsonb NOT NULL DEFAULT '{}'::jsonb,
    featured_image_url text,
    featured boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at timestamptz,
    scheduled_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1,
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE UNIQUE INDEX news_slug_active_uniq ON news (slug) WHERE deleted_at IS NULL;
CREATE INDEX news_public_idx ON news (status, published_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    version integer NOT NULL DEFAULT 1,
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE UNIQUE INDEX tags_slug_active_uniq ON tags (slug) WHERE deleted_at IS NULL;

CREATE TABLE news_tags (
    news_id uuid NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (news_id, tag_id)
);

CREATE TABLE careers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL,
    title text NOT NULL,
    summary text,
    description jsonb NOT NULL DEFAULT '{}'::jsonb,
    department text NOT NULL,
    location text NOT NULL,
    employment_type text NOT NULL CHECK (employment_type IN ('full_time', 'contract', 'internship', 'part_time')),
    apply_url text,
    deadline timestamptz,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1,
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE UNIQUE INDEX careers_slug_active_uniq ON careers (slug) WHERE deleted_at IS NULL;
CREATE INDEX careers_public_idx ON careers (status, published_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE seo_meta (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    title text,
    description text,
    canonical_url text,
    og_image_url text,
    no_index boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX seo_meta_entity_active_uniq ON seo_meta (entity_type, entity_id) WHERE deleted_at IS NULL;

CREATE TABLE contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    subject text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'spam')),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE INDEX contacts_status_idx ON contacts (status, created_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL,
    value jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX settings_key_active_uniq ON settings (key) WHERE deleted_at IS NULL;

CREATE TABLE audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid REFERENCES users(id),
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    before jsonb,
    after jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
);

INSERT INTO permissions (id, code, description) VALUES
('00000000-0000-0000-0000-000000000101', 'admin:*', 'Full CMS access'),
('00000000-0000-0000-0000-000000000102', 'content:read', 'Read CMS content'),
('00000000-0000-0000-0000-000000000103', 'content:write', 'Create and update CMS content'),
('00000000-0000-0000-0000-000000000104', 'media:write', 'Upload and manage media'),
('00000000-0000-0000-0000-000000000105', 'contacts:read', 'Read contact inquiries')
ON CONFLICT DO NOTHING;

INSERT INTO roles (id, name, code, description) VALUES
('00000000-0000-0000-0000-000000000201', 'Owner', 'owner', 'Primary system owner'),
('00000000-0000-0000-0000-000000000202', 'User', 'user', 'CMS content user'),
('00000000-0000-0000-0000-000000000203', 'Admin', 'admin', 'CMS administrator')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000201'::uuid, id FROM permissions
ON CONFLICT DO NOTHING;

INSERT INTO users (id, email, name, password_hash, is_active) VALUES
('00000000-0000-0000-0000-000000000301', 'irfanzuhdiabdillah@gmail.com', 'Irfan Zuhdi Abdillah', '$2a$10$QuADomiPOK424E29lVWBoOqqZFCnhldgqu0QPrXv8aPLz/8l0b9Su', true)
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id) VALUES
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201')
ON CONFLICT DO NOTHING;

INSERT INTO pages (id, page_key, title, content, status, published_at) VALUES
('00000000-0000-0000-0000-000000000401', 'about', 'EN: About PT Multi Daya Mitra' || E'\n' || 'ID: Tentang PT Multi Daya Mitra', '{"overview":"Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.","vision":"To become a global electrical, automation, and fire alarm services company.","mission":"Build mutual partnerships and deliver every engagement with professional excellence.","values":["Safety","Reliability","Professionalism","Partnership"],"leadership":[],"timeline":[],"certifications":["ISO 9001:2015"]}', 'published', now()),
('00000000-0000-0000-0000-000000000402', 'contact', 'EN: Contact PT Multi Daya Mitra' || E'\n' || 'ID: Hubungi PT Multi Daya Mitra', '{"offices":[{"name":"Head Office","address":"East Java, Indonesia","mapEmbedUrl":""}],"email":"info@multidayamitra.co.id","phone":"+62"}', 'published', now())
ON CONFLICT DO NOTHING;

INSERT INTO services (id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000501', 'electrical-engineering', 'electrical-engineering', 'Electrical Engineering', 'End-to-end electrical engineering, installation, testing, and commissioning.', '{"blocks":[{"type":"paragraph","text":"Complete electrical lifecycle support for industrial and infrastructure facilities."}]}', '/placeholder.jpg', 'published', now(), 1, 0),
('00000000-0000-0000-0000-000000000502', 'automation', 'automation', 'Automation', 'PLC, HMI, SCADA, monitoring, and control system integration.', '{"blocks":[{"type":"paragraph","text":"Engineering, programming, and integration of monitoring and control systems."}]}', '/placeholder.jpg', 'published', now(), 2, 0),
('00000000-0000-0000-0000-000000000503', 'maintenance', 'maintenance', 'Maintenance', 'Predictive, preventive, and operational maintenance services.', '{"blocks":[{"type":"paragraph","text":"Long-term reliability programs for critical electrical systems."}]}', '/placeholder.jpg', 'published', now(), 3, 0)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000601', 'testing-equipment', 'testing-equipment', 'Testing Equipment', 'Electrical testing equipment and commissioning tools.', '{"blocks":[{"type":"paragraph","text":"Reliable test equipment for industrial electrical projects."}]}', '{"category":"Testing"}', '/placeholder.jpg', 'published', now(), 1, 0),
('00000000-0000-0000-0000-000000000602', 'protection-relay', 'protection-relay', 'Protection Relay', 'Protection relay devices and related engineering support.', '{"blocks":[{"type":"paragraph","text":"Protection relay products for medium-voltage systems."}]}', '{"category":"Protection"}', '/placeholder.jpg', 'published', now(), 2, 0),
('00000000-0000-0000-0000-000000000603', 'instrumentation', 'instrumentation', 'Instrumentation', 'Instrumentation devices for monitoring and control.', '{"blocks":[{"type":"paragraph","text":"Instrumentation products for industrial automation."}]}', '{"category":"Instrumentation"}', '/placeholder.jpg', 'published', now(), 3, 0)
ON CONFLICT DO NOTHING;

INSERT INTO news_categories (id, name, slug) VALUES
('00000000-0000-0000-0000-000000000701', 'Company', 'company'),
('00000000-0000-0000-0000-000000000702', 'Project', 'project'),
('00000000-0000-0000-0000-000000000703', 'Insight', 'insight')
ON CONFLICT DO NOTHING;

INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000701', 'energy-monitoring-system-launch', 'Launching our Energy Monitoring System for ESG-ready facilities', 'A turnkey solution helps plants track real-time consumption and produce ESG-grade reports.', '{"blocks":[{"type":"paragraph","text":"Our Energy Monitoring System helps facilities understand usage patterns and reduce waste."}]}', '/placeholder.jpg', true, 'published', now()),
('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000702', '20mw-substation-commissioning-east-java', 'Successful commissioning of a 20 MW substation in East Java', 'Our team completed end-to-end testing and commissioning for an industrial client.', '{"blocks":[{"type":"paragraph","text":"The commissioning scope covered protection coordination, testing, and energization support."}]}', '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000901', 'senior-electrical-engineer', 'Senior Electrical Engineer', 'Lead medium-voltage system design, protection coordination, and commissioning.', '{"blocks":[{"type":"paragraph","text":"Lead electrical design and commissioning work for industrial clients."}]}', 'Engineering', 'Surabaya, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now()),
('00000000-0000-0000-0000-000000000902', 'automation-engineer-plc-scada', 'Automation Engineer (PLC & SCADA)', 'Design, program, and integrate PLC, HMI, and SCADA systems.', '{"blocks":[{"type":"paragraph","text":"Build reliable automation systems for power, oil and gas, and manufacturing clients."}]}', 'Engineering', 'Surabaya, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;


-- ==========================================
-- Migration: 002_user_access.up.sql
-- ==========================================

CREATE TABLE IF NOT EXISTS auth_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose text NOT NULL CHECK (purpose IN ('invite', 'password_reset')),
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_codes_user_purpose_idx
    ON auth_codes (user_id, purpose, expires_at DESC);

INSERT INTO permissions (id, code, description) VALUES
('00000000-0000-0000-0000-000000000106', 'users:manage', 'Invite, update, and remove CMS users')
ON CONFLICT DO NOTHING;

UPDATE roles
SET name = 'Owner', code = 'owner', description = 'Primary system owner'
WHERE code = 'super_admin';

UPDATE roles
SET name = 'User', code = 'user', description = 'CMS content user'
WHERE code = 'editor';

INSERT INTO roles (id, name, code, description) VALUES
('00000000-0000-0000-0000-000000000203', 'Admin', 'admin', 'CMS administrator')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000201'::uuid, id FROM permissions
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000203'::uuid, id
FROM permissions
WHERE code IN ('content:read', 'content:write', 'media:write', 'contacts:read', 'users:manage')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000202'::uuid, id
FROM permissions
WHERE code IN ('content:read', 'content:write', 'media:write')
ON CONFLICT DO NOTHING;

UPDATE users
SET email = 'irfanzuhdiabdillah@gmail.com',
    name = 'Irfan Zuhdi Abdillah',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000301';


-- ==========================================
-- Migration: 003_security.up.sql
-- ==========================================

-- Persistent failed-attempt tracking for login and verification codes.
-- Keys look like "login:<email>", "code:invite:<email>", "send:password_reset:<email>".
CREATE TABLE IF NOT EXISTS auth_throttle (
    key text PRIMARY KEY,
    attempts integer NOT NULL DEFAULT 0,
    window_start timestamptz NOT NULL DEFAULT now(),
    locked_until timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_throttle_updated_idx ON auth_throttle (updated_at);


-- ==========================================
-- Migration: 004_seed_system_pages.up.sql
-- ==========================================

-- Seed system pages so every public landing route (/, /services, /products,
-- /news, /career) has an editable CMS page. Keys must equal the public route
-- segment ('career', not 'careers') so the explicit routes shadow [pageKey].
-- Content is left empty: the landing routes keep their built-in layout until
-- an admin fills in sections via the editor presets.
-- ON CONFLICT DO NOTHING also covers pages_key_active_uniq, so a manually
-- created row with the same key (e.g. an existing 'home' page) is preserved.
INSERT INTO pages (id, page_key, title, content, status, published_at) VALUES
('00000000-0000-0000-0000-000000000403', 'home', 'EN: Home' || E'\n' || 'ID: Beranda', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000404', 'services', 'EN: Services' || E'\n' || 'ID: Layanan', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000405', 'products', 'EN: Products' || E'\n' || 'ID: Produk', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000406', 'news', 'EN: News & Insights' || E'\n' || 'ID: Berita & Wawasan', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000407', 'career', 'EN: Careers' || E'\n' || 'ID: Karir', '{}', 'published', now())
ON CONFLICT DO NOTHING;


-- ==========================================
-- Migration: 005_analytics.up.sql
-- ==========================================

-- First-party, privacy-friendly analytics.
--
-- Design: the API buffers incoming events in memory and batch-inserts them
-- here (analytics_events = raw firehose, pruned by a retention job). A rollup
-- worker folds raw rows into compact hourly aggregates that reporting reads,
-- so dashboards never scan the firehose. analytics_sessions keeps one row per
-- visit for unique/bounce/duration/dimension queries — small and indexed.

CREATE TABLE analytics_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    event_type text NOT NULL,                 -- pageview | pageleave | event | vital | api | error
    event_name text NOT NULL DEFAULT '',      -- button_click, cta_click, LCP, route pattern, ...
    visitor_id text NOT NULL DEFAULT '',
    session_id text NOT NULL DEFAULT '',
    path text NOT NULL DEFAULT '',
    referrer text NOT NULL DEFAULT '',
    source text NOT NULL DEFAULT '',          -- direct | organic | referral | social
    device text NOT NULL DEFAULT '',          -- desktop | mobile | tablet
    browser text NOT NULL DEFAULT '',
    os text NOT NULL DEFAULT '',
    screen text NOT NULL DEFAULT '',
    country text NOT NULL DEFAULT '',
    city text NOT NULL DEFAULT '',
    language text NOT NULL DEFAULT '',
    value double precision NOT NULL DEFAULT 0, -- ms on page / vital value / api duration ms
    scroll_pct smallint NOT NULL DEFAULT 0,
    status smallint NOT NULL DEFAULT 0,        -- http status for event_type='api'
    meta jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX analytics_events_time_idx ON analytics_events (occurred_at DESC);
CREATE INDEX analytics_events_type_time_idx ON analytics_events (event_type, occurred_at DESC);
CREATE INDEX analytics_events_path_time_idx ON analytics_events (path, occurred_at DESC)
    WHERE event_type IN ('pageview', 'pageleave');

-- One row per visit; upserted in the same ingest batch as events.
CREATE TABLE analytics_sessions (
    session_id text PRIMARY KEY,
    visitor_id text NOT NULL,
    started_at timestamptz NOT NULL,
    last_seen_at timestamptz NOT NULL,
    first_path text NOT NULL DEFAULT '',      -- landing page
    last_path text NOT NULL DEFAULT '',       -- exit page (so far)
    pageviews integer NOT NULL DEFAULT 0,
    events integer NOT NULL DEFAULT 0,
    is_new_visitor boolean NOT NULL DEFAULT false,
    source text NOT NULL DEFAULT '',
    device text NOT NULL DEFAULT '',
    browser text NOT NULL DEFAULT '',
    os text NOT NULL DEFAULT '',
    screen text NOT NULL DEFAULT '',
    country text NOT NULL DEFAULT '',
    city text NOT NULL DEFAULT '',
    language text NOT NULL DEFAULT ''
);

CREATE INDEX analytics_sessions_started_idx ON analytics_sessions (started_at DESC);
CREATE INDEX analytics_sessions_visitor_idx ON analytics_sessions (visitor_id, started_at DESC);

-- Hourly rollups (kept forever; raw events are pruned).
CREATE TABLE analytics_site_stats (
    bucket timestamptz PRIMARY KEY,           -- date_trunc('hour', occurred_at)
    views integer NOT NULL DEFAULT 0,
    custom_events integer NOT NULL DEFAULT 0,
    errors integer NOT NULL DEFAULT 0,
    api_requests integer NOT NULL DEFAULT 0,
    api_errors integer NOT NULL DEFAULT 0,
    api_total_ms double precision NOT NULL DEFAULT 0
);

CREATE TABLE analytics_page_stats (
    bucket timestamptz NOT NULL,
    path text NOT NULL,
    views integer NOT NULL DEFAULT 0,
    unique_views integer NOT NULL DEFAULT 0,  -- distinct sessions within the hour
    total_time_ms double precision NOT NULL DEFAULT 0,
    time_samples integer NOT NULL DEFAULT 0,
    scroll_sum integer NOT NULL DEFAULT 0,
    scroll_samples integer NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, path)
);
CREATE INDEX analytics_page_stats_path_idx ON analytics_page_stats (path, bucket DESC);

CREATE TABLE analytics_event_stats (
    bucket timestamptz NOT NULL,
    event_name text NOT NULL,
    path text NOT NULL DEFAULT '',
    count integer NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, event_name, path)
);

CREATE TABLE analytics_vital_stats (
    bucket timestamptz NOT NULL,
    metric text NOT NULL,                     -- LCP | CLS | INP | FCP | TTFB | load
    path text NOT NULL DEFAULT '',
    sum_value double precision NOT NULL DEFAULT 0,
    max_value double precision NOT NULL DEFAULT 0,
    samples integer NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, metric, path)
);

-- Rollup checkpoint: everything with id <= last_event_id is aggregated.
CREATE TABLE analytics_rollup_state (
    id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    last_event_id bigint NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO analytics_rollup_state (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Feature flags, editable from the admin (settings key "analytics").
INSERT INTO settings (id, key, value)
VALUES (
    '00000000-0000-0000-0000-000000000601',
    'analytics',
    '{"enabled": true, "ignoreAdmins": true, "respectDnt": true, "trackVitals": true, "trackEvents": true, "retentionDays": 90}'
)
ON CONFLICT DO NOTHING;


-- ==========================================
-- Migration: 006_two_factor.up.sql
-- ==========================================

-- Email OTP two-factor login + trusted devices.
--
-- login_challenges: one row per password-verified sign-in awaiting its email
-- code. Codes are stored hashed; attempts/resends are counted per challenge.
-- trusted_devices: opaque tokens (hashed) that let a browser skip the OTP
-- step for a configurable number of days, bound to a device fingerprint.

CREATE TABLE IF NOT EXISTS login_challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    resend_count integer NOT NULL DEFAULT 0,
    last_sent_at timestamptz NOT NULL DEFAULT now(),
    consumed_at timestamptz,
    ip text NOT NULL DEFAULT '',
    user_agent text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_challenges_user_idx ON login_challenges (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS login_challenges_expiry_idx ON login_challenges (expires_at);

CREATE TABLE IF NOT EXISTS trusted_devices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text NOT NULL,
    fingerprint_hash text NOT NULL DEFAULT '',
    label text NOT NULL DEFAULT '',
    ip text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS trusted_devices_token_uniq ON trusted_devices (token_hash);
CREATE INDEX IF NOT EXISTS trusted_devices_user_idx ON trusted_devices (user_id, created_at DESC);

-- Security feature flags + email templates (settings key "security"),
-- editable from the admin. Placeholders: {{name}} {{code}} {{minutes}}
-- {{device}} {{ip}} {{time}} {{site}}.
INSERT INTO settings (id, key, value)
VALUES (
    '00000000-0000-0000-0000-000000000602',
    'security',
    '{"twoFactorEnabled": true, "otpLength": 6, "otpExpiryMinutes": 5, "trustDays": 30, "resendCooldownSec": 60, "maxOtpAttempts": 5, "maxResends": 3, "otpSubject": "", "otpBody": "", "newDeviceSubject": "", "newDeviceBody": ""}'
)
ON CONFLICT DO NOTHING;


-- ==========================================
-- Migration: 007_redirects.up.sql
-- ==========================================

-- Branded short links (company.com/{slug}) with QR codes and scan analytics.
--
-- Scans ride the existing analytics firehose (analytics_events rows with
-- event_type='redirect', event_name=slug) and are folded hourly into
-- redirect_stats so totals survive raw-event retention.

CREATE TABLE IF NOT EXISTS redirects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    destination text NOT NULL,
    description text NOT NULL DEFAULT '',
    redirect_type smallint NOT NULL DEFAULT 302 CHECK (redirect_type IN (301, 302)),
    is_active boolean NOT NULL DEFAULT true,
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS redirects_slug_active_uniq ON redirects (slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS redirects_updated_idx ON redirects (updated_at DESC);

CREATE TABLE IF NOT EXISTS redirect_stats (
    bucket timestamptz NOT NULL,
    slug text NOT NULL,
    scans integer NOT NULL DEFAULT 0,
    uniques integer NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, slug)
);
CREATE INDEX IF NOT EXISTS redirect_stats_slug_idx ON redirect_stats (slug, bucket DESC);

-- Fast per-slug detail queries on the raw firehose (history, breakdowns).
CREATE INDEX IF NOT EXISTS analytics_events_redirect_idx
    ON analytics_events (event_name, occurred_at DESC)
    WHERE event_type = 'redirect';


-- ==========================================
-- Migration: 008_enrich_content.up.sql
-- ==========================================

-- 008_enrich_content.up.sql
-- Enriches CMS content using verified data from multidayamitra.co.id.
-- Safe to re-run: uses UPDATE ... WHERE id for existing rows and
-- INSERT ... ON CONFLICT DO NOTHING for new rows.

BEGIN;

-- ============================================================================
-- 1. SITE SETTINGS — Add social media & WhatsApp contacts
-- ============================================================================
UPDATE settings
SET value = jsonb_build_object(
    'email',    'info@multidayamitra.co.id',
    'phone',    '+62 31 592 1256',
    'fax',      '+62 31 591 7845',
    'address',  'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
    'tagline',  'Electrical · Automation · Fire System',
    'footerDescription', 'Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013.',
    'socials', jsonb_build_array(
        jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/',        'label', 'Facebook'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/',       'label', 'Instagram'),
        jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628113461666',                      'label', 'WhatsApp Sales'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628118303250',                      'label', 'WhatsApp Technical Support')
    ),
    'salesEmail',   'sales@multidayamitra.co.id',
    'salesPhone',   '+62 81332415692',
    'hotlinePhone', '+62 8118303250'
),
    updated_at = now()
WHERE key = 'site';

-- ============================================================================
-- 2. CONTACT PAGE — Complete office & contact data
-- ============================================================================
UPDATE pages
SET content = jsonb_build_object(
    'offices', jsonb_build_array(
        jsonb_build_object(
            'name',        'Head Office',
            'address',     'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
            'phone',       '+62 31 592 1256',
            'fax',         '+62 31 591 7845',
            'email',       'info@multidayamitra.co.id',
            'mapEmbedUrl', ''
        ),
        jsonb_build_object(
            'name',        'Project & Engineering Office',
            'address',     'Ruko Jati Kepuh Indah F-26, Sidoarjo 61271, East Java, Indonesia',
            'mapEmbedUrl', ''
        ),
        jsonb_build_object(
            'name',        'Workshop',
            'address',     'Ruko Jati Kepuh Indah E-21, Sidoarjo 61271, East Java, Indonesia',
            'mapEmbedUrl', ''
        )
    ),
    'email',       'info@multidayamitra.co.id',
    'phone',       '+62 31 592 1256',
    'fax',         '+62 31 591 7845',
    'salesEmail',  'sales@multidayamitra.co.id',
    'salesPhone',  '+62 81332415692',
    'hotlinePhone','+62 8118303250'
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000402';

-- ============================================================================
-- 3. ABOUT PAGE — Enriched company profile
-- ============================================================================
UPDATE pages
SET content = jsonb_build_object(
    'overview', 'PT Multi Daya Mitra was established in 2013 as a multidisciplinary engineering company specializing in electrical systems, industrial automation, and fire alarm solutions. Founded by professionals with extensive industry experience, the company serves clients across power generation, oil and gas, petrochemicals, manufacturing, food and beverage, pharmaceuticals, cement, infrastructure, and commercial building sectors. From its base in East Java, PT Multi Daya Mitra has grown into one of the region''s leading electrical services partners, delivering projects throughout Indonesia and undertaking select international engagements.',
    'vision',  'To become a global electrical, automation, and fire alarm services company.',
    'mission', 'To build mutual partnerships and deliver every engagement with professional excellence.',
    'values',  jsonb_build_array('Safety', 'Reliability', 'Professionalism', 'Partnership', 'Quality'),
    'leadership', '[]'::jsonb,
    'timeline', '[]'::jsonb,
    'certifications', jsonb_build_array('ISO 9001:2015'),
    'culture', 'A culture of professional discipline drives the company forward at every step toward its vision. PT Multi Daya Mitra has earned ISO 9001:2015 certification for its quality management system, reflecting the team''s commitment to consistent, high-standard delivery.',
    'industries', jsonb_build_array(
        'Industrial Plants', 'Buildings', 'Petrochemical', 'Oil & Gas',
        'Power Plants', 'Infrastructure', 'Food & Beverage', 'Manufacturing',
        'Cement', 'Pharmaceuticals', 'Natural Gas', 'Agro-Industry'
    )
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000401';

-- ============================================================================
-- 4. SERVICES — Update 3 existing
-- ============================================================================

-- 4a. Electrical Engineering
UPDATE services
SET summary = 'Comprehensive electrical engineering services including panel assembly, installation, testing and commissioning, construction, and engineering design for industrial and infrastructure facilities.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides end-to-end electrical engineering services for industrial, commercial, and infrastructure projects. Our licensed engineering team handles everything from initial design through construction, testing, commissioning, and ongoing support."},
    {"type": "heading", "level": 2, "text": "Core Services"},
    {"type": "list", "items": [
      "Panel Build & Assembly — LVMDP, MCC, VFD/VSD panels, capacitor banks, ATS/AMF, generator control panels",
      "Installation & Construction — Licensed for electrical and mechanical construction up to medium voltage",
      "Testing & Commissioning — Secondary injection testing (3-phase and 6-phase), relay protection testing, circuit breaker analysis, contact resistance measurement",
      "Engineering Design — Protection coordination studies, power system analysis, lightning protection design (IEEE 998, NFPA 780, IEC 62305)"
    ]},
    {"type": "heading", "level": 2, "text": "Engineering Solutions"},
    {"type": "list", "items": [
      "Lightning Protection System — Detail design and assessment based on IEEE Std. 998, NFPA 780, API 545, IEC-EN 62305, and SNI standards",
      "Power Monitoring System — Energy management system implementation aligned with ISO 50001 for real-time monitoring, logging, and consumption transparency",
      "Active Harmonic Filter — Parallel-connected active harmonic filters for non-linear loads, installed at LV main distribution panels"
    ]},
    {"type": "heading", "level": 2, "text": "Relay Protection Testing"},
    {"type": "paragraph", "text": "Our relay testing capability covers major brands including ABB (REF, REM, REC, REX, SPAJ), Schneider (SEPAM, MICOM, VAMP), Siemens (SIPROTEC, Reyrolle), GE Multilin, Toshiba, and analog protection relays. We test across ANSI codes 87, 50, 51, 32, 27, 59, 60, 64, 67, 78, 81, and 25."}
  ]
}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000501';

-- 4b. Automation
UPDATE services
SET summary = 'Industrial automation services including PLC and DCS programming, HMI/SCADA design, remote monitoring systems, database connectivity, and plant information management.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "Our automation team delivers complete control system solutions from design through commissioning and long-term support. We integrate PLC, DCS, HMI, and SCADA platforms to create reliable, maintainable automation architectures for process and discrete manufacturing environments."},
    {"type": "heading", "level": 2, "text": "Engineering Services"},
    {"type": "list", "items": [
      "HMI & SCADA design and development",
      "Remote monitoring and control system integration",
      "Database connectivity and reporting solutions",
      "Plant Information Management System (PIMS) implementation",
      "Switchgear automation systems",
      "PLC & DCS programming and commissioning"
    ]},
    {"type": "heading", "level": 2, "text": "Platforms & Protocols"},
    {"type": "paragraph", "text": "We work with major automation platforms including Siemens, Schneider Electric, GE, Mitsubishi, Omron, and Delta. Our systems support Modbus/Modbus TCP, BACnet/IP, OPC, DDE, and IEC 61850 communication protocols."}
  ]
}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000502';

-- 4c. Maintenance
UPDATE services
SET summary = 'Predictive, preventive, and contract-based maintenance services for medium and low voltage switchgear, transformers, and industrial electrical systems.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides comprehensive maintenance programs designed to maximize equipment reliability, extend asset life, and minimize unplanned downtime. Our services cover medium and low voltage switchgear, power transformers, protection systems, and critical electrical infrastructure."},
    {"type": "heading", "level": 2, "text": "Predictive Maintenance"},
    {"type": "paragraph", "text": "Condition-based maintenance using advanced diagnostic tools to identify developing faults before they cause failures. Key techniques include partial discharge analysis, infrared thermography, and power quality analysis."},
    {"type": "heading", "level": 2, "text": "Preventive Maintenance"},
    {"type": "paragraph", "text": "Scheduled shutdown maintenance for MV/LV switchgear and transformers. Our programs focus on safety compliance, maximizing continuity and availability, managing aging asset performance, and optimizing capital and operating expenditure."},
    {"type": "heading", "level": 2, "text": "Maintenance Contracts"},
    {"type": "paragraph", "text": "Service-level agreement contracts that include regular checklists and site visits, call-out service, emergency response, scheduled predictive and preventive maintenance, replacement parts, minor repairs, and MTBF/MTTR performance reporting."}
  ]
}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000503';

-- 4d. NEW: Fire Alarm Systems
INSERT INTO services (id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000504', 'fire-alarm', 'fire-alarm', 'Fire Alarm Systems',
 'Design, installation, testing, commissioning, and maintenance of conventional and addressable fire alarm systems.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides full-cycle fire alarm services, from initial system design to installation, testing, commissioning, and ongoing maintenance contracts. Our certified team works with leading fire detection technologies to protect industrial, commercial, and infrastructure facilities."},
    {"type": "heading", "level": 2, "text": "Services"},
    {"type": "list", "items": [
      "Fire alarm system design and engineering",
      "Installation of conventional and addressable systems",
      "Testing & commissioning with full documentation",
      "Preventive maintenance and repair contracts",
      "System improvement and centralized monitoring integration"
    ]},
    {"type": "paragraph", "text": "All fire alarm work is carried out by certified technicians in compliance with applicable Indonesian and international fire safety standards."}
  ]
}'::jsonb,
 '/placeholder.jpg', 'published', now(), 4, 0)
ON CONFLICT DO NOTHING;

-- 4e. NEW: Testing & Measurement
INSERT INTO services (id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000505', 'testing-measurement', 'testing-measurement', 'Testing & Measurement',
 'Specialized electrical testing and measurement services using professional-grade instruments for power systems diagnostics.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Our testing and measurement division operates a comprehensive inventory of professional-grade instruments for diagnosing, verifying, and certifying electrical systems. These tools support both our project delivery and standalone testing engagements."},
    {"type": "heading", "level": 2, "text": "Equipment Inventory"},
    {"type": "list", "items": [
      "Secondary Injection Tester — Megger Sverker 900, Kingsine K3166i (3-phase and 6-phase)",
      "Partial Discharge Analyzer — Megger PD Scan (TEV, acoustic, HFCT sensors)",
      "Micro Ohm Meter — Megger DLRO10, MOM 200A",
      "Battery & Load Bank Tester — Torkel",
      "Power Quality Analyzer — Fluke 435 II",
      "Thermal Imager — Infrared thermography for predictive diagnostics",
      "Geo Earth Ground Tester — Fluke 1623",
      "Circuit Breaker Analyzer — Timing, motion, and dynamic characteristics analysis",
      "Relay Test Set — Megger TRAX 280, Vebko",
      "Micrologic Test Kit (FFTK) — Schneider ACB Micrologic testing"
    ]}
  ]
}'::jsonb,
 '/placeholder.jpg', 'published', now(), 5, 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. PRODUCTS — Update 3 existing
-- ============================================================================

-- 5a. Testing Equipment
UPDATE products
SET summary = 'Professional-grade electrical testing and commissioning instruments from Megger, Fluke, Kingsine, and other leading manufacturers.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "We supply and support a comprehensive range of electrical testing equipment for relay protection testing, insulation diagnostics, power quality analysis, and commissioning verification. Our product portfolio covers instruments from industry-leading manufacturers."},
    {"type": "heading", "level": 2, "text": "Product Range"},
    {"type": "list", "items": [
      "Megger Sverker 900 — Secondary injection tester for protection relay verification",
      "Kingsine K3166i — 6-phase relay test system with IEC 61850 support",
      "Megger TRAX 280 — Multi-function relay test set for commissioning",
      "Fluke 435 II — Three-phase power quality and energy analyzer",
      "Megger PD Scan — Partial discharge analyzer with TEV, acoustic, and HFCT sensors",
      "Megger DLRO10 / MOM 200A — Micro-ohm meters for contact resistance measurement",
      "Fluke 1623 — Geo earth ground tester",
      "Torkel — Battery and load bank test system",
      "Infrared thermal imaging cameras for predictive maintenance"
    ]}
  ]
}'::jsonb,
    specs = '{"category": "Testing", "brands": "Megger, Fluke, Kingsine, Vebko"}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000601';

-- 5b. Protection Relay
UPDATE products
SET summary = 'Protection relay devices and testing services covering ABB, Schneider, Siemens, GE Multilin, and Toshiba platforms for medium-voltage power systems.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "We provide protection relay products, testing, and engineering support for medium-voltage power distribution systems. Our team has hands-on experience with all major relay platforms and can perform secondary injection testing, configuration, and coordination studies."},
    {"type": "heading", "level": 2, "text": "Supported Relay Platforms"},
    {"type": "list", "items": [
      "ABB — REF, REM, REC, REX, SPAJ series",
      "Schneider Electric — SEPAM, MICOM, VAMP series",
      "Siemens — SIPROTEC, Reyrolle series",
      "GE Multilin — Digital protection relays",
      "Toshiba — Protection and control relays",
      "Analog/electromechanical relay protection"
    ]},
    {"type": "heading", "level": 2, "text": "Testing Capabilities"},
    {"type": "paragraph", "text": "6 current outputs, 6 voltage outputs, low-ampere output capability, and IEC 61850 communication testing. ANSI protection functions tested include 87 (differential), 50/51 (overcurrent), 32 (directional power), 27/59 (under/overvoltage), 60 (voltage balance), 64 (ground fault), 67 (directional overcurrent), 78 (out of step), 81 (frequency), and 25 (synch check)."}
  ]
}'::jsonb,
    specs = '{"category": "Protection", "brands": "ABB, Schneider, Siemens, GE Multilin, Toshiba", "ansiCodes": "25, 27, 32, 50, 51, 59, 60, 64, 67, 78, 81, 87"}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000602';

-- 5c. Instrumentation
UPDATE products
SET summary = 'Industrial instrumentation products including power quality analyzers, partial discharge scanners, thermal imaging, and contact resistance measurement devices.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "Our instrumentation product line covers diagnostic and monitoring devices for industrial electrical systems. These instruments support predictive maintenance programs, commissioning verification, and ongoing power quality management."},
    {"type": "heading", "level": 2, "text": "Key Products"},
    {"type": "list", "items": [
      "Power Quality Analyzer — Real-time logging and reporting of voltage, frequency, waveform quality, dips/sags, swells, flicker, spikes, harmonics, and total harmonic distortion (THD)",
      "Partial Discharge Analyzer — Online predictive maintenance for MV switchgear, bus bars, bushings, cables, transformers, and outdoor HV components using TEV, acoustic contact, HFCT, and parabolic acoustic sensors",
      "Infrared Thermal Imager — Identifies abnormal thermal patterns caused by loose connections, overloaded circuits, deteriorated insulation, or three-phase imbalances",
      "Contact Resistance Meter — Precision low-ohm measurement for circuit breaker contacts, busbar connections, cable terminations, and busduct installations",
      "Circuit Breaker Analyzer — Open/close timing, motion analysis, dynamic bounce characteristics, and coil current waveform recording"
    ]}
  ]
}'::jsonb,
    specs = '{"category": "Instrumentation", "applications": "Predictive Maintenance, Commissioning, Power Quality"}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000603';

-- 5d. NEW: SCADA – xArrow
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000604', 'scada-xarrow', 'scada-xarrow', 'SCADA – xArrow',
 'Versatile SCADA platform with distributed data acquisition, redundant database support, and native PLC connectivity for industrial monitoring and control.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "xArrow is a full-featured SCADA platform designed for industrial monitoring and control applications. It provides real-time data acquisition, alarm management, historical trending, and a powerful graphical interface — all within a scalable client/server architecture."},
    {"type": "heading", "level": 2, "text": "System Architecture"},
    {"type": "list", "items": [
      "Client/server architecture with distributed data acquisition",
      "Real-time multi-tasking kernel",
      "Redundant database support — SQL Server, Oracle, MySQL, PostgreSQL, Access",
      "OPC Client connectivity and project-level encryption"
    ]},
    {"type": "heading", "level": 2, "text": "Data Acquisition"},
    {"type": "list", "items": [
      "Native drivers for Siemens, GE, Schneider, Mitsubishi, Omron, Delta PLCs",
      "Modbus RTU/TCP, BACnet/IP, DDE, and OPC protocol support"
    ]},
    {"type": "heading", "level": 2, "text": "Key Features"},
    {"type": "list", "items": [
      "WYSIWYG development without compilation",
      "Real-time database with hash-based algorithms",
      "5 analog and 3 digital alarm types with voice alerts and audit trails",
      "Historical data archive with graphical trending",
      "Built-in HTTP server for web-based access",
      "CFR Part 11 compliance support",
      "I/O server, database, and network redundancy"
    ]}
  ]
}'::jsonb,
 '{"category": "Automation", "type": "SCADA", "protocols": "Modbus, BACnet/IP, OPC, DDE"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 4, 0)
ON CONFLICT DO NOTHING;

-- 5e. NEW: Electrical Panel Assembly
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000605', 'electrical-panels', 'electrical-panels', 'Electrical Panel Assembly',
 'Custom-engineered low and medium voltage electrical panels including LVMDP, MCC, VFD/VSD, ATS/AMF, capacitor banks, and generator control panels.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We design and assemble electrical panels to international standards for industrial, commercial, and infrastructure applications. Each panel is engineered to site-specific requirements and undergoes comprehensive factory acceptance testing before delivery."},
    {"type": "heading", "level": 2, "text": "Low Voltage Panels"},
    {"type": "list", "items": [
      "Low Voltage Main Distribution Panel (LVMDP)",
      "Motor Control Center (MCC)",
      "Motor Starter — Direct On Line, Star-Delta, Soft Starter",
      "Variable Frequency Drive (VFD) / Variable Speed Drive (VSD) panels",
      "Capacitor Bank panels",
      "Automatic Transfer Switch (ATS) and Automatic Main Failure (AMF)",
      "Automatic Load Shedding panels",
      "Generator Control Panel — Synchronous or load sharing configurations",
      "Switchgear Automation System panels"
    ]},
    {"type": "heading", "level": 2, "text": "Medium Voltage Equipment"},
    {"type": "list", "items": [
      "Medium Voltage Distribution Panel — supply, installation, testing & commissioning",
      "Schneider SM6 metalclad switchgear — LBS (IM), CB (DM1-A) with OCR/DGR 50/51 and 67 relay protection",
      "Active Harmonic Filter, Anti-Flicker/Sag devices, and Load Bank equipment"
    ]}
  ]
}'::jsonb,
 '{"category": "Electrical", "voltageClass": "Low Voltage, Medium Voltage", "brands": "Schneider Electric"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 5, 0)
ON CONFLICT DO NOTHING;

-- 5f. NEW: Bosch Fire Alarm System
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000606', 'bosch-fire-alarm', 'bosch-fire-alarm', 'Bosch Fire Alarm System',
 'Bosch Security fire detection solutions including AVENAR addressable panels, conventional panels, automatic detectors, manual call points, and video-based fire detection.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "As a Bosch Security partner, we supply and install comprehensive fire alarm systems for industrial, commercial, and critical infrastructure applications. The Bosch product portfolio covers everything from compact conventional panels to fully addressable networked systems."},
    {"type": "heading", "level": 2, "text": "Product Range"},
    {"type": "list", "items": [
      "AVENAR Panel — Addressable fire detection system with modular setup for scalable installations",
      "Conventional Fire Panel — Compact, cost-efficient solution for small to medium applications",
      "Automatic Fire Detectors — Optical smoke, heat, multi-criteria, and specialty detectors",
      "Manual Call Points — Addressable and conventional models",
      "Interface Modules — Integration with technical alarms and extinguishing systems",
      "Notification Appliances — Audible sirens and visible beacon notifications",
      "Video-based Fire Detection — AI-powered smoke and flame identification",
      "Accessories — Detector testers, test gases, and removal tools"
    ]}
  ]
}'::jsonb,
 '{"category": "Fire Alarm", "brand": "Bosch Security", "types": "Addressable, Conventional"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 6, 0)
ON CONFLICT DO NOTHING;

-- 5g. NEW: Rittal Enclosure Systems
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000607', 'rittal-enclosures', 'rittal-enclosures', 'Rittal Enclosure Systems',
 'Authorized Rittal distributor for industrial enclosures, climate control solutions, and system accessories.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "As an authorized Rittal distributor, we provide a complete range of industrial enclosure solutions, climate control equipment, and system accessories for power distribution, automation, and IT infrastructure applications."},
    {"type": "heading", "level": 2, "text": "Enclosures"},
    {"type": "list", "items": [
      "Small enclosures and wall-mounted boxes",
      "IT rack systems",
      "Stainless steel and hygienic design enclosures",
      "Outdoor-rated enclosures",
      "Support arm systems"
    ]},
    {"type": "heading", "level": 2, "text": "Climate Control"},
    {"type": "list", "items": [
      "Fans and filter fans",
      "Air-to-air and air-to-water heat exchangers",
      "Cooling units for enclosures",
      "IT cooling solutions",
      "Enclosure heaters"
    ]},
    {"type": "heading", "level": 2, "text": "Accessories"},
    {"type": "list", "items": [
      "Base and plinth systems",
      "Cable routing and management",
      "HMI mounting solutions",
      "Earthing and grounding components",
      "Interior lighting"
    ]}
  ]
}'::jsonb,
 '{"category": "Enclosures", "brand": "Rittal", "role": "Authorized Distributor"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 7, 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. NEWS — Update 2 existing + add 4 new
-- ============================================================================

-- 6a. Energy Monitoring System (existing)
UPDATE news
SET body = '{
  "blocks": [
    {"type": "paragraph", "text": "Smart Energy Monitoring Systems are transforming how manufacturing facilities track, analyze, and optimize their energy consumption. By turning raw energy data into measurable business impact, these systems help plants reduce costs, improve operational efficiency, and support sustainability objectives."},
    {"type": "heading", "level": 2, "text": "Why Energy Monitoring Matters"},
    {"type": "paragraph", "text": "As ESG (Environmental, Social, and Governance) reporting becomes a standard expectation for industrial operations, having accurate, real-time energy data is no longer optional. Our Energy Monitoring System provides the foundation for transparent energy reporting, consumption benchmarking, and actionable efficiency improvements."},
    {"type": "heading", "level": 2, "text": "Key Benefits"},
    {"type": "list", "items": [
      "Real-time visibility into energy consumption across all facility zones",
      "Automated data logging and trend analysis for ESG-grade reporting",
      "Identification of waste patterns and peak demand optimization opportunities",
      "Support for ISO 50001 energy management system compliance",
      "Integration with existing SCADA and building management systems"
    ]},
    {"type": "paragraph", "text": "PT Multi Daya Mitra delivers turnkey energy monitoring solutions — from metering hardware installation through SCADA integration, dashboard configuration, and ongoing support — tailored to each facility''s operational requirements."}
  ]
}'::jsonb,
    excerpt = 'Smart energy monitoring systems help manufacturing facilities track real-time consumption, reduce costs, and produce ESG-grade sustainability reports.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000801';

-- 6b. Substation Commissioning (existing)
UPDATE news
SET body = '{
  "blocks": [
    {"type": "paragraph", "text": "Preventive maintenance of medium voltage (MV) switchgear is essential for ensuring the reliability, safety, and longevity of electrical distribution assets. Regular maintenance programs identify developing issues before they escalate into costly failures or safety incidents."},
    {"type": "heading", "level": 2, "text": "Maintenance Scope"},
    {"type": "paragraph", "text": "A comprehensive substation maintenance program covers visual inspection, cleaning, mechanical operation testing, insulation resistance measurement, contact resistance verification, protection relay testing, and thermal imaging. Each activity is documented and benchmarked against manufacturer specifications and industry standards."},
    {"type": "heading", "level": 2, "text": "Our Approach"},
    {"type": "list", "items": [
      "End-to-end protection coordination review and verification",
      "Secondary injection testing of all protection relays",
      "Circuit breaker timing and motion analysis",
      "Partial discharge scanning for early fault detection",
      "Complete test documentation and energization support"
    ]},
    {"type": "paragraph", "text": "Our commissioning team has successfully delivered testing and energization support for industrial substations across East Java, covering both greenfield installations and aging asset refurbishment projects."}
  ]
}'::jsonb,
    excerpt = 'Preventive maintenance of MV switchgear ensures reliability, safety, and asset longevity through systematic testing, inspection, and protection coordination.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000802';

-- 6c. NEW: Transformer Testing and Maintenance
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000703', 'transformer-testing-maintenance',
 'Transformer Testing and Maintenance: Protecting Your Most Valuable Network Assets',
 'Power transformers are among the most expensive components in any electrical network. Routine health assessments help detect incipient faults and extend asset service life.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Power transformers represent one of the largest capital investments in any electrical distribution network. Because replacement costs are substantial and lead times are long, a proactive testing and maintenance program is critical for maximizing transformer service life and preventing catastrophic failures."},
    {"type": "heading", "level": 2, "text": "Why Transformer Testing Is Important"},
    {"type": "paragraph", "text": "Transformers operate under continuous electrical, thermal, and mechanical stress. Over time, insulation degrades, oil quality deteriorates, and mechanical components wear. Without regular diagnostic testing, developing faults can go undetected until they cause unplanned outages or irreversible damage."},
    {"type": "heading", "level": 2, "text": "Common Diagnostic Tests"},
    {"type": "list", "items": [
      "Insulation resistance and polarization index measurement",
      "Transformer turns ratio (TTR) verification",
      "Winding resistance measurement",
      "Dissolved gas analysis (DGA) of insulating oil",
      "Power factor / dissipation factor testing",
      "Sweep frequency response analysis (SFRA)",
      "Thermal imaging for hotspot detection"
    ]},
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides comprehensive transformer health assessment services using calibrated, professional-grade instruments. Our reports include condition ratings, trend analysis, and prioritized maintenance recommendations."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- 6d. NEW: Effects of Harmonic Distortion
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000703', 'effects-of-harmonic-distortion',
 'Effects of Harmonic Distortion on Electrical Systems',
 'Harmonic distortion in power systems causes current and voltage waveform degradation, leading to overheating, equipment malfunction, and reduced power quality.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Harmonic distortion occurs when non-linear loads — such as variable frequency drives, UPS systems, LED lighting, and power electronics — introduce current and voltage waveform distortions into the electrical network. These harmonics can cause a range of operational and equipment problems if left unmanaged."},
    {"type": "heading", "level": 2, "text": "Common Effects of Harmonics"},
    {"type": "list", "items": [
      "Overheating of transformers, cables, and motors due to increased RMS current",
      "Nuisance tripping of circuit breakers and protection relays",
      "Premature failure of capacitor banks from harmonic resonance",
      "Interference with sensitive electronic equipment and communication systems",
      "Increased neutral conductor loading in three-phase systems",
      "Reduced power factor and higher utility penalty charges"
    ]},
    {"type": "heading", "level": 2, "text": "Mitigation Solutions"},
    {"type": "paragraph", "text": "PT Multi Daya Mitra offers harmonic measurement, analysis, and mitigation services. Solutions include active harmonic filters (AHF) installed in parallel with main distribution panels, passive harmonic filters, and system design modifications to minimize harmonic generation at the source."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- 6e. NEW: Partial Discharge Analyzer
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000703', 'partial-discharge-analyzer',
 'Partial Discharge Analyzer for Predictive Maintenance of MV/HV Equipment',
 'Online partial discharge analysis enables early detection of insulation defects in medium and high voltage switchgear, transformers, and cable systems without service interruption.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Partial discharge (PD) is a localized electrical breakdown within the insulation system of medium and high voltage equipment. Left undetected, partial discharge activity progressively damages insulation until a complete flashover or failure occurs. PD scanning provides an early warning system for developing insulation faults."},
    {"type": "heading", "level": 2, "text": "What We Can Detect"},
    {"type": "list", "items": [
      "Insulation defects in MV switchgear and bus bars",
      "Degradation in cable terminations and bushings",
      "Developing faults in power transformers",
      "Surface tracking on outdoor HV components",
      "Void discharges within solid insulation systems"
    ]},
    {"type": "heading", "level": 2, "text": "Sensing Technologies"},
    {"type": "paragraph", "text": "Our PD analysis combines multiple sensing techniques for comprehensive coverage: Transient Earth Voltage (TEV) sensors for metalclad switchgear, acoustic contact sensors for transformers and bushings, High Frequency Current Transformer (HFCT) sensors for cable systems, and parabolic acoustic receivers for outdoor equipment. This multi-sensor approach ensures no developing fault goes undetected."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- 6f. NEW: Centralized Fire Alarm Monitoring
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000703', 'centralized-fire-alarm-monitoring',
 'Centralized Fire Alarm Monitoring Systems for Multi-Building Facilities',
 'Centralized fire alarm monitoring integrates multiple fire detection panels into a single command center for faster response, regulatory compliance, and operational efficiency.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "For facilities with multiple buildings, production zones, or campus-wide operations, managing individual fire alarm panels in isolation creates response delays and oversight gaps. Centralized fire alarm monitoring systems integrate all detection zones into a unified command interface, enabling faster incident response and streamlined compliance documentation."},
    {"type": "heading", "level": 2, "text": "Key Benefits"},
    {"type": "list", "items": [
      "Single command center visibility across all buildings and zones",
      "Faster alarm acknowledgment and emergency response coordination",
      "Automated event logging for regulatory compliance and audit trails",
      "Integration with building management and access control systems",
      "Remote monitoring capability for 24/7 surveillance"
    ]},
    {"type": "heading", "level": 2, "text": "Implementation"},
    {"type": "paragraph", "text": "PT Multi Daya Mitra designs and implements centralized fire alarm monitoring solutions using Bosch Security and other leading platforms. Our scope covers system architecture design, network infrastructure, panel integration, operator workstation configuration, and comprehensive training for facility management teams."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. CAREERS — Update 2 existing + add 4 new
-- ============================================================================

-- 7a. Senior Electrical Engineer (existing)
UPDATE careers
SET description = '{
  "blocks": [
    {"type": "paragraph", "text": "We are looking for a Senior Electrical Engineer to lead medium-voltage system design, protection coordination, and commissioning activities for industrial and infrastructure clients across Indonesia."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Lead electrical design and engineering for MV/LV power distribution projects",
      "Perform protection coordination studies and relay setting calculations",
      "Supervise testing and commissioning of switchgear, transformers, and protection systems",
      "Prepare technical documentation, single-line diagrams, and project reports",
      "Coordinate with project managers, clients, and subcontractors on site"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Bachelor''s degree in Electrical Engineering or related field",
      "Minimum 5 years of experience in electrical power systems",
      "Strong knowledge of protection relay testing (ABB, Schneider, Siemens)",
      "Experience with medium-voltage switchgear commissioning",
      "Familiarity with relevant standards (IEC, IEEE, SNI)",
      "Willing to travel to project sites across Indonesia"
    ]}
  ]
}'::jsonb,
    summary = 'Lead medium-voltage system design, protection coordination studies, and commissioning for industrial and infrastructure projects.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000901';

-- 7b. Automation Engineer (existing)
UPDATE careers
SET description = '{
  "blocks": [
    {"type": "paragraph", "text": "We are hiring an Automation Engineer to design, program, and commission PLC, HMI, and SCADA systems for power, oil and gas, manufacturing, and industrial process clients."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Design and develop HMI/SCADA applications for plant monitoring and control",
      "Program and configure PLC and DCS control systems",
      "Integrate communication protocols (Modbus, OPC, BACnet, IEC 61850)",
      "Perform factory acceptance testing (FAT) and site acceptance testing (SAT)",
      "Commission automation systems and provide operator training",
      "Develop technical documentation and system operation manuals"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Bachelor''s degree in Electrical, Instrumentation, or Control Engineering",
      "Minimum 3 years of experience in industrial automation",
      "Proficiency with at least one major PLC platform (Siemens, Schneider, Mitsubishi, Omron)",
      "Experience with SCADA software development and database connectivity",
      "Understanding of industrial communication protocols and networking",
      "Willing to travel for commissioning and project support"
    ]}
  ]
}'::jsonb,
    summary = 'Design, program, and commission PLC, HMI, and SCADA systems for industrial process control applications.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000902';

-- 7c. NEW: Electrical Team Leader
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000903', 'electrical-team-leader', 'Electrical Team Leader',
 'Supervise electrical maintenance and project execution teams at industrial client sites.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are seeking an experienced Electrical Team Leader to supervise field teams during electrical maintenance, testing, and commissioning activities at client sites."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Lead and coordinate electrical field technician teams",
      "Supervise maintenance, testing, and commissioning activities on site",
      "Ensure compliance with safety procedures and work permits",
      "Prepare daily work reports and progress updates",
      "Coordinate with project managers and client representatives"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Diploma or Bachelor''s degree in Electrical Engineering",
      "Minimum 3 years of supervisory experience in electrical field work",
      "Hands-on experience with MV/LV switchgear and transformer maintenance",
      "Strong understanding of workplace safety and hazard identification",
      "Willing to be stationed at project sites in Gresik, Malang, or other locations"
    ]}
  ]
}'::jsonb,
 'Engineering', 'Gresik, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- 7d. NEW: Electrical Operator
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000904', 'electrical-operator', 'Electrical Operator',
 'Perform routine electrical operation and maintenance tasks at industrial facilities.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are looking for Electrical Operators to perform daily electrical operation, monitoring, and basic maintenance tasks at client industrial facilities."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Operate and monitor electrical distribution systems",
      "Perform routine inspections and basic maintenance of MV/LV equipment",
      "Record operational data and report abnormalities",
      "Assist commissioning and testing teams during project activities",
      "Follow safety procedures and emergency response protocols"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Vocational diploma (D3) in Electrical Engineering or equivalent",
      "Minimum 1 year of experience in electrical operations",
      "Basic knowledge of MV/LV switchgear operation",
      "Ability to work in shift-based schedules",
      "Willing to be assigned to project sites in Surabaya, Bali, or other locations"
    ]}
  ]
}'::jsonb,
 'Operations', 'Surabaya, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- 7e. NEW: Fire Alarm Technician
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000905', 'fire-alarm-technician', 'Fire Alarm Technician',
 'Install, test, and maintain conventional and addressable fire alarm systems.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are hiring Fire Alarm Technicians to support our growing fire protection services division. The role involves installation, testing, commissioning, and maintenance of fire alarm systems at client sites."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Install fire alarm panels, detectors, manual call points, and notification devices",
      "Perform system testing, loop verification, and commissioning",
      "Execute preventive maintenance and troubleshooting of fire alarm systems",
      "Prepare technical reports and maintenance records",
      "Coordinate with clients on maintenance schedules and emergency repairs"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Vocational diploma (D3) in Electrical Engineering or related field",
      "Minimum 1 year of experience with fire alarm system installation or maintenance",
      "Familiarity with Bosch or equivalent fire detection platforms",
      "Fire safety certification is a plus",
      "Willing to be assigned to project sites across East Java"
    ]}
  ]
}'::jsonb,
 'Engineering', 'Gresik, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- 7f. NEW: Site Manager
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000906', 'site-manager', 'Site Manager',
 'Manage project execution, client coordination, and team supervision at industrial project sites.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are seeking a Site Manager to oversee electrical and automation project execution at client sites. The role requires strong leadership, technical knowledge, and the ability to manage multiple work fronts simultaneously."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Manage overall project execution at client sites",
      "Coordinate project teams, subcontractors, and client representatives",
      "Monitor project schedule, budget, and quality milestones",
      "Ensure compliance with safety, health, and environmental regulations",
      "Prepare progress reports and participate in project review meetings"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Bachelor''s degree in Electrical Engineering or related field",
      "Minimum 5 years of experience in project management or site supervision",
      "Strong knowledge of electrical installation and commissioning processes",
      "Experience managing teams of 10+ technicians and engineers",
      "Excellent communication and stakeholder management skills",
      "Willing to be stationed at project sites in Gresik or other locations"
    ]}
  ]
}'::jsonb,
 'Project Management', 'Gresik, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. SEO METADATA — All records
-- ============================================================================

-- Pages
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('page', '00000000-0000-0000-0000-000000000401', 'About PT Multi Daya Mitra | Electrical, Automation & Fire Alarm Services', 'PT Multi Daya Mitra is an Indonesian engineering company established in 2013, specializing in electrical systems, industrial automation, and fire alarm solutions for power, oil & gas, manufacturing, and infrastructure sectors.'),
('page', '00000000-0000-0000-0000-000000000402', 'Contact PT Multi Daya Mitra | Offices in Surabaya & Sidoarjo', 'Contact PT Multi Daya Mitra for electrical engineering, automation, and fire alarm services. Head office in Surabaya, project office and workshop in Sidoarjo, East Java.'),
('page', '00000000-0000-0000-0000-000000000403', 'PT Multi Daya Mitra | Electrical · Automation · Fire System', 'Indonesian electrical, industrial automation, and fire alarm services company delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013.'),
('page', '00000000-0000-0000-0000-000000000404', 'Our Services | PT Multi Daya Mitra', 'Electrical engineering, industrial automation, fire alarm, testing & measurement, and maintenance services for industrial and infrastructure projects across Indonesia.'),
('page', '00000000-0000-0000-0000-000000000405', 'Our Products | PT Multi Daya Mitra', 'Testing equipment, protection relays, instrumentation, SCADA systems, electrical panels, fire alarm systems, and Rittal enclosures from PT Multi Daya Mitra.'),
('page', '00000000-0000-0000-0000-000000000406', 'News & Insights | PT Multi Daya Mitra', 'Industry insights, project updates, and technical articles from PT Multi Daya Mitra on electrical engineering, automation, and fire protection.'),
('page', '00000000-0000-0000-0000-000000000407', 'Careers at PT Multi Daya Mitra | Join Our Engineering Team', 'Explore career opportunities at PT Multi Daya Mitra. We are hiring electrical engineers, automation engineers, technicians, and project managers across East Java.')
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('service', '00000000-0000-0000-0000-000000000501', 'Electrical Engineering Services | PT Multi Daya Mitra', 'Comprehensive electrical engineering including panel assembly, installation, testing & commissioning, construction, and engineering design for industrial and infrastructure facilities.'),
('service', '00000000-0000-0000-0000-000000000502', 'Industrial Automation Services | PLC, SCADA, HMI | PT Multi Daya Mitra', 'Industrial automation services including PLC/DCS programming, HMI/SCADA design, remote monitoring, database integration, and plant information management systems.'),
('service', '00000000-0000-0000-0000-000000000503', 'Electrical Maintenance Services | Predictive & Preventive | PT Multi Daya Mitra', 'Predictive, preventive, and contract-based maintenance for MV/LV switchgear, transformers, and industrial electrical systems with SLA-backed performance reporting.'),
('service', '00000000-0000-0000-0000-000000000504', 'Fire Alarm System Services | Design, Install & Maintain | PT Multi Daya Mitra', 'Full-cycle fire alarm services: design, installation, testing, commissioning, and maintenance contracts for conventional and addressable fire detection systems.'),
('service', '00000000-0000-0000-0000-000000000505', 'Testing & Measurement Services | PT Multi Daya Mitra', 'Specialized electrical testing and measurement services using professional-grade instruments from Megger, Fluke, and Kingsine for power system diagnostics.')
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('product', '00000000-0000-0000-0000-000000000601', 'Testing Equipment | Megger, Fluke, Kingsine | PT Multi Daya Mitra', 'Professional-grade electrical testing instruments including relay test sets, power quality analyzers, partial discharge scanners, and insulation testers from leading manufacturers.'),
('product', '00000000-0000-0000-0000-000000000602', 'Protection Relay Products & Testing | PT Multi Daya Mitra', 'Protection relay devices and testing services for ABB, Schneider, Siemens, GE Multilin, and Toshiba platforms in medium-voltage power distribution systems.'),
('product', '00000000-0000-0000-0000-000000000603', 'Industrial Instrumentation | Power Quality & Diagnostics | PT Multi Daya Mitra', 'Industrial instrumentation including power quality analyzers, partial discharge scanners, thermal imagers, and contact resistance meters for predictive maintenance.'),
('product', '00000000-0000-0000-0000-000000000604', 'SCADA xArrow Platform | Industrial Monitoring & Control | PT Multi Daya Mitra', 'xArrow SCADA platform with distributed data acquisition, native PLC connectivity, redundant databases, and real-time alarm management for industrial process control.'),
('product', '00000000-0000-0000-0000-000000000605', 'Electrical Panel Assembly | LVMDP, MCC, VFD, ATS | PT Multi Daya Mitra', 'Custom-engineered LV and MV electrical panels including LVMDP, motor control centers, VFD/VSD panels, ATS/AMF, and Schneider SM6 medium-voltage switchgear.'),
('product', '00000000-0000-0000-0000-000000000606', 'Bosch Fire Alarm System | AVENAR, Detectors, Panels | PT Multi Daya Mitra', 'Bosch Security fire detection solutions including AVENAR addressable panels, conventional panels, optical/heat detectors, manual call points, and video-based fire detection.'),
('product', '00000000-0000-0000-0000-000000000607', 'Rittal Enclosures & Climate Control | Authorized Distributor | PT Multi Daya Mitra', 'Authorized Rittal distributor offering industrial enclosures, climate control solutions, IT rack systems, and accessories for power distribution and automation.')
ON CONFLICT DO NOTHING;

-- News
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('news', '00000000-0000-0000-0000-000000000801', 'Energy Monitoring System for ESG Reporting | PT Multi Daya Mitra', 'Smart energy monitoring systems that help manufacturing facilities track real-time consumption, reduce costs, and produce ESG-grade sustainability reports.'),
('news', '00000000-0000-0000-0000-000000000802', 'Substation Testing & Commissioning | PT Multi Daya Mitra', 'Preventive maintenance of MV switchgear ensures reliability, safety, and asset longevity through systematic testing, inspection, and protection coordination.'),
('news', '00000000-0000-0000-0000-000000000803', 'Transformer Testing & Maintenance Guide | PT Multi Daya Mitra', 'Comprehensive guide to power transformer health assessments including insulation testing, dissolved gas analysis, and frequency response diagnostics.'),
('news', '00000000-0000-0000-0000-000000000804', 'Effects of Harmonic Distortion on Electrical Systems | PT Multi Daya Mitra', 'Understanding how harmonic distortion from non-linear loads affects transformers, cables, and power quality — and practical mitigation solutions.'),
('news', '00000000-0000-0000-0000-000000000805', 'Partial Discharge Analysis for MV/HV Equipment | PT Multi Daya Mitra', 'Online partial discharge analysis enables early insulation fault detection in medium and high voltage switchgear, transformers, and cable systems.'),
('news', '00000000-0000-0000-0000-000000000806', 'Centralized Fire Alarm Monitoring Systems | PT Multi Daya Mitra', 'How centralized fire alarm monitoring integrates multiple detection zones for faster response, regulatory compliance, and operational efficiency.')
ON CONFLICT DO NOTHING;

-- Careers
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('career', '00000000-0000-0000-0000-000000000901', 'Senior Electrical Engineer Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as a Senior Electrical Engineer. Lead MV system design, protection coordination, and commissioning for industrial clients in Surabaya.'),
('career', '00000000-0000-0000-0000-000000000902', 'Automation Engineer (PLC & SCADA) Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as an Automation Engineer. Design, program, and commission PLC, HMI, and SCADA systems for industrial process control.'),
('career', '00000000-0000-0000-0000-000000000903', 'Electrical Team Leader Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as an Electrical Team Leader. Supervise field teams during maintenance, testing, and commissioning activities in Gresik.'),
('career', '00000000-0000-0000-0000-000000000904', 'Electrical Operator Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as an Electrical Operator. Perform daily electrical operation and monitoring at industrial facilities in Surabaya.'),
('career', '00000000-0000-0000-0000-000000000905', 'Fire Alarm Technician Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as a Fire Alarm Technician. Install, test, and maintain fire alarm systems at industrial sites across East Java.'),
('career', '00000000-0000-0000-0000-000000000906', 'Site Manager Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as a Site Manager. Manage electrical and automation project execution at industrial client sites in Gresik.')
ON CONFLICT DO NOTHING;

COMMIT;


-- ==========================================
-- Migration: 009_category_hierarchy.up.sql
-- ==========================================

-- 009_category_hierarchy.up.sql
-- Creates hierarchical parent categories for Services and Products
-- and updates existing records to be children of these parents.

BEGIN;

-- 1. Create Parent Services
INSERT INTO services (id, slug, full_path, title, summary, status, sort_order, depth)
VALUES
    (gen_random_uuid(), 'electrical-services', 'electrical-services', 'Electrical Services', 'Complete electrical lifecycle support for industrial and infrastructure facilities.', 'published', 1, 0),
    (gen_random_uuid(), 'industrial-automation', 'industrial-automation', 'Industrial Automation', 'Advanced control systems, PLC, HMI, and SCADA engineering.', 'published', 2, 0),
    (gen_random_uuid(), 'tools-testing-measurement', 'tools-testing-measurement', 'Tools for Testing & Measurement', 'Precision equipment and tools for electrical testing and condition monitoring.', 'published', 3, 0),
    (gen_random_uuid(), 'fire-alarm-services', 'fire-alarm-services', 'Fire Alarm', 'Comprehensive fire detection and alarm system engineering.', 'published', 4, 0)
ON CONFLICT DO NOTHING;

-- Map existing services to their new parents
UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'electrical-services'),
    depth = 1,
    full_path = 'electrical-services/' || slug
WHERE slug IN ('electrical-engineering', 'maintenance');

UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'industrial-automation'),
    depth = 1,
    full_path = 'industrial-automation/' || slug
WHERE slug IN ('automation');

UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'tools-testing-measurement'),
    depth = 1,
    full_path = 'tools-testing-measurement/' || slug
WHERE slug IN ('testing-measurement');

UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'fire-alarm-services'),
    depth = 1,
    full_path = 'fire-alarm-services/' || slug
WHERE slug IN ('fire-alarm');

-- 2. Create Parent Products
INSERT INTO products (id, slug, full_path, title, summary, status, sort_order, depth)
VALUES
    (gen_random_uuid(), 'automation-products', 'automation-products', 'Automation', 'Industrial automation software and hardware.', 'published', 1, 0),
    (gen_random_uuid(), 'electrical-equipment', 'electrical-equipment', 'Electrical Equipment', 'High-quality electrical panels, relays, and testing equipment.', 'published', 2, 0),
    (gen_random_uuid(), 'fire-alarm-systems', 'fire-alarm-systems', 'Fire Alarm System', 'Reliable fire detection and alarm systems.', 'published', 3, 0),
    (gen_random_uuid(), 'rittal-products', 'rittal-products', 'Rittal', 'Premium enclosures and climate control solutions by Rittal.', 'published', 4, 0)
ON CONFLICT DO NOTHING;

-- Map existing products to their new parents
UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'automation-products'),
    depth = 1,
    full_path = 'automation-products/' || slug
WHERE slug IN ('scada-xarrow', 'instrumentation');

UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'electrical-equipment'),
    depth = 1,
    full_path = 'electrical-equipment/' || slug
WHERE slug IN ('testing-equipment', 'protection-relay', 'electrical-panels');

UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'fire-alarm-systems'),
    depth = 1,
    full_path = 'fire-alarm-systems/' || slug
WHERE slug IN ('bosch-fire-alarm');

UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'rittal-products'),
    depth = 1,
    full_path = 'rittal-products/' || slug
WHERE slug IN ('rittal-enclosures');

-- 3. Fix Dates and Image URLs
-- Using images downloaded from scraper
UPDATE news SET published_at = '2020-04-18T00:00:00Z', featured_image_url = '/uploads/c38f8d75-6d71-4a31-836c-e9af3d6db596.jpg' WHERE slug = 'energy-monitoring-system-launch';
UPDATE news SET published_at = '2020-06-25T00:00:00Z', featured_image_url = '/uploads/PMS-Network_001.jpg' WHERE slug = '20mw-substation-commissioning-east-java';
UPDATE news SET published_at = '2020-08-10T00:00:00Z', featured_image_url = '/uploads/PM-Partial-Discharge-Analyzer-1.jpg' WHERE slug = 'testing-maintenance-substation';
UPDATE news SET published_at = '2020-08-10T00:00:00Z', featured_image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'transformer-testing-maintenance';

UPDATE careers SET published_at = '2023-01-15T00:00:00Z' WHERE slug = 'senior-electrical-engineer';
UPDATE careers SET published_at = '2023-02-10T00:00:00Z' WHERE slug = 'automation-engineer-plc-scada';
UPDATE careers SET published_at = '2023-03-05T00:00:00Z' WHERE slug = 'testing-commissioning-technician';
UPDATE careers SET published_at = '2023-04-20T00:00:00Z' WHERE slug = 'fire-alarm-system-designer';

UPDATE services SET image_url = '/uploads/IMG_1003-e1585984946182.jpg' WHERE slug = 'electrical-engineering';
UPDATE services SET image_url = '/uploads/Centralized-Mointoring.jpg' WHERE slug = 'automation';
UPDATE services SET image_url = '/uploads/Installation-Cable.jpg' WHERE slug = 'maintenance';
UPDATE services SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'fire-alarm';
UPDATE services SET image_url = '/uploads/PM-Partial-Discharge-Analyzer-1.jpg' WHERE slug = 'testing-measurement';
UPDATE services SET image_url = '/uploads/IMG_1003-e1585984946182.jpg' WHERE slug = 'electrical-services';
UPDATE services SET image_url = '/uploads/Centralized-Mointoring.jpg' WHERE slug = 'industrial-automation';
UPDATE services SET image_url = '/uploads/PM-Partial-Discharge-Analyzer-1.jpg' WHERE slug = 'tools-testing-measurement';
UPDATE services SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'fire-alarm-services';

UPDATE products SET image_url = '/uploads/Relay-Protection-Study.jpg' WHERE slug = 'protection-relay';
UPDATE products SET image_url = '/uploads/M2.jpeg' WHERE slug = 'scada-xarrow';

COMMIT;


-- ==========================================
-- Migration: 010_sync_data.up.sql
-- ==========================================

BEGIN;

-- 1. Fix Career Deadlines
-- Since the current year is 2026, setting the deadline to 2025 ensures they appear closed.
UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-01-15T00:00:00Z'
WHERE slug = 'electrical-team-leader';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-01-15T00:00:00Z'
WHERE slug = 'electrical-operator';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-02-10T00:00:00Z'
WHERE slug = 'automation-engineer-plc-scada';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-03-05T00:00:00Z'
WHERE slug = 'fire-alarm-technician';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-03-15T00:00:00Z'
WHERE slug = 'site-manager';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-01-15T00:00:00Z'
WHERE slug = 'senior-electrical-engineer';

-- 2. Fix News Dates
UPDATE news 
SET published_at = '2020-05-12T00:00:00Z' 
WHERE slug = 'effects-of-harmonic-distortion';

UPDATE news 
SET published_at = '2020-07-08T00:00:00Z' 
WHERE slug = 'partial-discharge-analyzer';

UPDATE news 
SET published_at = '2020-09-15T00:00:00Z' 
WHERE slug = 'centralized-fire-alarm-monitoring';

-- 3. Synchronize Services Details
UPDATE services
SET summary = 'Comprehensive electrical design, installation, and commissioning for industrial facilities.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "PT Multi Daya Mitra provides complete electrical engineering services covering MV/LV distribution systems, protection relay coordination, and power quality analysis. We handle greenfield installations and brownfield upgrades."}}, {"type": "list", "data": {"style": "unordered", "items": ["MV & LV Switchgear Installation", "Transformer Testing & Commissioning", "Power Quality Analysis", "Protection Relay Calibration"]}}]}'
WHERE slug = 'electrical-engineering';

UPDATE services
SET summary = 'Advanced PLC, HMI, and SCADA control system development and integration.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We deliver robust industrial automation solutions designed to optimize plant operations, improve reliability, and minimize downtime. Our engineers are certified in multiple platforms including Schneider Electric, Siemens, and Allen Bradley."}}, {"type": "list", "data": {"style": "unordered", "items": ["PLC & RTU Programming", "SCADA / HMI Development", "Industrial Network Integration", "Drive & Motor Control Center"]}}]}'
WHERE slug = 'automation';

UPDATE services
SET summary = 'Preventive and corrective maintenance programs for critical electrical assets.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Our maintenance services ensure maximum uptime for your critical infrastructure. We provide routine inspections, corrective actions, and condition-based monitoring to prevent catastrophic failures."}}, {"type": "list", "data": {"style": "unordered", "items": ["Thermography Inspections", "Switchgear Cleaning & Torquing", "Transformer Oil Purification", "Battery Bank Testing"]}}]}'
WHERE slug = 'maintenance';

UPDATE services
SET summary = 'Design, supply, and maintenance of addressable and conventional fire alarm systems.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Protect your assets with our comprehensive fire alarm services. We offer everything from conceptual design to installation and statutory maintenance of fire detection systems in industrial and commercial environments."}}, {"type": "list", "data": {"style": "unordered", "items": ["System Design & Engineering", "Installation & Commissioning", "Integration with HVAC & Access Control", "Routine Maintenance & Certification"]}}]}'
WHERE slug = 'fire-alarm';

UPDATE services
SET summary = 'Advanced diagnostic tools and measurement services for electrical assets.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We utilize state-of-the-art testing equipment to provide precise measurements and diagnostics. Our condition monitoring services help identify potential faults before they escalate into costly outages."}}, {"type": "list", "data": {"style": "unordered", "items": ["Partial Discharge (PD) Measurement", "Contact Resistance Testing", "Insulation Resistance & HI-POT", "Earth Resistance Measurement"]}}]}'
WHERE slug = 'testing-measurement';

-- 4. Synchronize Products Details
UPDATE products
SET summary = 'Precision testing instruments for electrical substations and industrial networks.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We supply a wide range of electrical testing equipment from global leading manufacturers. Our portfolio includes specialized tools for relay testing, transformer diagnostics, and power quality analysis."}}]}'
WHERE slug = 'testing-equipment';

UPDATE products
SET summary = 'Reliable digital protection relays for MV and LV electrical distribution.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Our selection of protection relays ensures the safety and stability of your electrical network. We offer products suitable for feeder, motor, transformer, and generator protection applications."}}]}'
WHERE slug = 'protection-relay';

UPDATE products
SET summary = 'Process instrumentation for measuring pressure, temperature, flow, and level.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "High-accuracy field instruments designed for harsh industrial environments. Our products provide reliable data acquisition for your control systems."}}]}'
WHERE slug = 'instrumentation';

UPDATE products
SET summary = 'xArrow SCADA software for intuitive and scalable industrial monitoring.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "xArrow is a powerful SCADA platform offering seamless integration with various PLCs and RTUs. It provides real-time data visualization, alarming, and historical reporting to empower operational decisions."}}]}'
WHERE slug = 'scada-xarrow';

UPDATE products
SET summary = 'Custom-built LV switchboards, motor control centers (MCC), and control panels.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We manufacture and assemble fully type-tested electrical panels according to IEC standards. Each panel is custom-engineered to meet specific project requirements with uncompromising quality."}}]}'
WHERE slug = 'electrical-panels';

UPDATE products
SET summary = 'Bosch intelligent fire detection and voice evacuation systems.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "As an authorized provider of Bosch Security Systems, we supply cutting-edge addressable fire alarm panels, detectors, and public address solutions for comprehensive life safety."}}]}'
WHERE slug = 'bosch-fire-alarm';

UPDATE products
SET summary = 'Rittal industrial enclosures and climate control solutions.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Protect your sensitive control equipment with Rittal’s premium enclosures. We supply standard and customized Rittal cabinets complete with thermal management solutions for any industrial setting."}}]}'
WHERE slug = 'rittal-enclosures';

COMMIT;


-- ==========================================
-- Migration: 011_seed_source_media.up.sql
-- ==========================================

-- 011_seed_source_media.up.sql
-- Local copies of selected public assets from multidayamitra.co.id.
-- The files live in FrontEnd/public/uploads so seeded records do not depend on
-- the source site's hotlink policy.

BEGIN;

INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, alt_text, status, metadata) VALUES
('00000000-0000-0000-0000-000000000951', 'hero-project.jpg', 'seed/multidayamitra/hero-project.jpg', '/uploads/hero-project.jpg', 'image/jpeg', 114297, 'PT Multi Daya Mitra project team at an industrial site', 'ready', '{"source":"https://multidayamitra.co.id/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000952', 'automation-project.jpg', 'seed/multidayamitra/automation-project.jpg', '/uploads/automation-project.jpg', 'image/jpeg', 77279, 'Industrial automation project', 'ready', '{"source":"https://multidayamitra.co.id/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000953', 'M2.jpeg', 'seed/multidayamitra/M2.jpeg', '/uploads/M2.jpeg', 'image/jpeg', 43859, 'Industrial automation solution', 'ready', '{"source":"https://multidayamitra.co.id/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000954', 'PM-Fire-Alarm-1.jpg', 'seed/multidayamitra/PM-Fire-Alarm-1.jpg', '/uploads/PM-Fire-Alarm-1.jpg', 'image/jpeg', 93201, 'Fire alarm system', 'ready', '{"source":"https://multidayamitra.co.id/services/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000955', 'PM-Partial-Discharge-Analyzer-1.jpg', 'seed/multidayamitra/PM-Partial-Discharge-Analyzer-1.jpg', '/uploads/PM-Partial-Discharge-Analyzer-1.jpg', 'image/jpeg', 39934, 'Partial discharge analyzer', 'ready', '{"source":"https://multidayamitra.co.id/services/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000956', 'PMS-Network_001.jpg', 'seed/multidayamitra/PMS-Network_001.jpg', '/uploads/PMS-Network_001.jpg', 'image/jpeg', 46770, 'Power monitoring system network', 'ready', '{"source":"https://multidayamitra.co.id/services/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000957', 'Rittal.png', 'seed/multidayamitra/Rittal.png', '/uploads/Rittal.png', 'image/png', 2412, 'Rittal enclosure systems', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000958', 'Schneider-Electric.png', 'seed/multidayamitra/Schneider-Electric.png', '/uploads/Schneider-Electric.png', 'image/png', 37320, 'Schneider Electric electrical equipment', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000959', 'xarrow.jpg', 'seed/multidayamitra/xarrow.jpg', '/uploads/xarrow.jpg', 'image/jpeg', 5638, 'xArrow SCADA software', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000960', 'BOSCH.png', 'seed/multidayamitra/BOSCH.png', '/uploads/BOSCH.png', 'image/png', 10835, 'Bosch fire alarm systems', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb)
ON CONFLICT DO NOTHING;

UPDATE services
SET image_url = CASE slug
  WHEN 'electrical-services' THEN '/uploads/hero-project.jpg'
  WHEN 'electrical-engineering' THEN '/uploads/hero-project.jpg'
  WHEN 'industrial-automation' THEN '/uploads/automation-project.jpg'
  WHEN 'automation' THEN '/uploads/automation-project.jpg'
  WHEN 'maintenance' THEN '/uploads/PMS-Network_001.jpg'
  WHEN 'tools-testing-measurement' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'testing-measurement' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'fire-alarm-services' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  WHEN 'fire-alarm' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  ELSE image_url
END,
gallery = CASE slug
  WHEN 'electrical-services' THEN '[{"url":"/uploads/hero-project.jpg","altText":"PT Multi Daya Mitra project team","mimeType":"image/jpeg"}]'::jsonb
  WHEN 'industrial-automation' THEN '[{"url":"/uploads/automation-project.jpg","altText":"Industrial automation project","mimeType":"image/jpeg"}]'::jsonb
  WHEN 'tools-testing-measurement' THEN '[{"url":"/uploads/PM-Partial-Discharge-Analyzer-1.jpg","altText":"Partial discharge analyzer","mimeType":"image/jpeg"}]'::jsonb
  WHEN 'fire-alarm-services' THEN '[{"url":"/uploads/PM-Fire-Alarm-1.jpg","altText":"Fire alarm system","mimeType":"image/jpeg"}]'::jsonb
  ELSE gallery
END,
updated_at = now()
WHERE slug IN ('electrical-services', 'electrical-engineering', 'industrial-automation', 'automation', 'maintenance', 'tools-testing-measurement', 'testing-measurement', 'fire-alarm-services', 'fire-alarm');

UPDATE products
SET image_url = CASE slug
  WHEN 'automation-products' THEN '/uploads/M2.jpeg'
  WHEN 'scada-xarrow' THEN '/uploads/xarrow.jpg'
  WHEN 'instrumentation' THEN '/uploads/PMS-Network_001.jpg'
  WHEN 'electrical-equipment' THEN '/uploads/Schneider-Electric.png'
  WHEN 'testing-equipment' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'protection-relay' THEN '/uploads/Schneider-Electric.png'
  WHEN 'electrical-panels' THEN '/uploads/Schneider-Electric.png'
  WHEN 'fire-alarm-systems' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  WHEN 'bosch-fire-alarm' THEN '/uploads/BOSCH.png'
  WHEN 'rittal-products' THEN '/uploads/Rittal.png'
  WHEN 'rittal-enclosures' THEN '/uploads/Rittal.png'
  ELSE image_url
END,
updated_at = now()
WHERE slug IN ('automation-products', 'scada-xarrow', 'instrumentation', 'electrical-equipment', 'testing-equipment', 'protection-relay', 'electrical-panels', 'fire-alarm-systems', 'bosch-fire-alarm', 'rittal-products', 'rittal-enclosures');

UPDATE news
SET featured_image_url = CASE slug
  WHEN 'energy-monitoring-system-launch' THEN '/uploads/PMS-Network_001.jpg'
  WHEN '20mw-substation-commissioning-east-java' THEN '/uploads/hero-project.jpg'
  WHEN 'transformer-testing-maintenance' THEN '/uploads/hero-project.jpg'
  WHEN 'effects-of-harmonic-distortion' THEN '/uploads/PMS-Network_001.jpg'
  WHEN 'partial-discharge-analyzer' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'centralized-fire-alarm-monitoring' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  ELSE featured_image_url
END,
updated_at = now()
WHERE slug IN ('energy-monitoring-system-launch', '20mw-substation-commissioning-east-java', 'transformer-testing-maintenance', 'effects-of-harmonic-distortion', 'partial-discharge-analyzer', 'centralized-fire-alarm-monitoring');

COMMIT;


-- ==========================================
-- Migration: 012_complete_source_catalog.up.sql
-- ==========================================

-- 012_complete_source_catalog.up.sql
-- Complete the visible service/product hierarchy from multidayamitra.co.id
-- and use a distinct local source image wherever the source page provides one.

BEGIN;

INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, alt_text, status, metadata) VALUES
('00000000-0000-0000-0000-000000001201', 'electrical-services.jpg', 'seed/multidayamitra/electrical-services.jpg', '/uploads/mdm/electrical-services.jpg', 'image/jpeg', 130884, 'Dry transformer maintenance', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/"}'),
('00000000-0000-0000-0000-000000001202', 'testing-measurement.jpg', 'seed/multidayamitra/testing-measurement.jpg', '/uploads/mdm/testing-measurement.jpg', 'image/jpeg', 8651, 'Partial discharge analyzer', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/"}'),
('00000000-0000-0000-0000-000000001203', 'secondary-injector.jpg', 'seed/multidayamitra/secondary-injector.jpg', '/uploads/mdm/secondary-injector.jpg', 'image/jpeg', 86075, 'Secondary injection testing', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/secondary-injector-3-and-6-phase-current-voltage/"}'),
('00000000-0000-0000-0000-000000001204', 'partial-discharge.jpg', 'seed/multidayamitra/partial-discharge.jpg', '/uploads/mdm/partial-discharge.jpg', 'image/jpeg', 172754, 'Partial discharge scan', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/partial-discharge-analyzer-pd-scan/"}'),
('00000000-0000-0000-0000-000000001205', 'contact-resistance.jpg', 'seed/multidayamitra/contact-resistance.jpg', '/uploads/mdm/contact-resistance.jpg', 'image/jpeg', 13129, 'Contact resistance measurement', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/contact-resistance-low-ohm-measurement/"}'),
('00000000-0000-0000-0000-000000001206', 'micrologic-test.jpg', 'seed/multidayamitra/micrologic-test.jpg', '/uploads/mdm/micrologic-test.jpg', 'image/jpeg', 62213, 'Schneider Micrologic test kit', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/micrologic-test-kit-fftk-schneider/"}'),
('00000000-0000-0000-0000-000000001207', 'power-quality.jpg', 'seed/multidayamitra/power-quality.jpg', '/uploads/mdm/power-quality.jpg', 'image/jpeg', 72136, 'Power quality analyzer', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/power-quality-analyzer/"}'),
('00000000-0000-0000-0000-000000001208', 'circuit-breaker.jpg', 'seed/multidayamitra/circuit-breaker.jpg', '/uploads/mdm/circuit-breaker.jpg', 'image/jpeg', 80783, 'Circuit breaker analyzer', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/circuit-breaker-analyzer/"}'),
('00000000-0000-0000-0000-000000001209', 'infrared-thermograph.jpg', 'seed/multidayamitra/infrared-thermograph.jpg', '/uploads/mdm/infrared-thermograph.jpg', 'image/jpeg', 55194, 'Infrared thermography inspection', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/infrared-thermal-imaging-thermograph/"}'),
('00000000-0000-0000-0000-000000001210', 'maintenance.jpg', 'seed/multidayamitra/maintenance.jpg', '/uploads/mdm/maintenance.jpg', 'image/jpeg', 11740, 'Electrical inspection and troubleshooting', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/"}'),
('00000000-0000-0000-0000-000000001211', 'predictive-maintenance.jpg', 'seed/multidayamitra/predictive-maintenance.jpg', '/uploads/mdm/predictive-maintenance.jpg', 'image/jpeg', 60728, 'Predictive maintenance partial discharge scan', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/predictive-maintenance/"}'),
('00000000-0000-0000-0000-000000001212', 'preventive-maintenance.jpg', 'seed/multidayamitra/preventive-maintenance.jpg', '/uploads/mdm/preventive-maintenance.jpg', 'image/jpeg', 78327, 'Circuit breaker preventive maintenance', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/preventive-maintenance/"}'),
('00000000-0000-0000-0000-000000001213', 'maintenance-contract.jpg', 'seed/multidayamitra/maintenance-contract.jpg', '/uploads/mdm/maintenance-contract.jpg', 'image/jpeg', 60619, 'Variable speed drive maintenance', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/maintenance-contract/"}'),
('00000000-0000-0000-0000-000000001214', 'construction-installation.jpg', 'seed/multidayamitra/construction-installation.jpg', '/uploads/mdm/construction-installation.jpg', 'image/jpeg', 90184, 'Medium-voltage cable installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/construction-installation/"}'),
('00000000-0000-0000-0000-000000001215', 'lightning-protection.png', 'seed/multidayamitra/lightning-protection.png', '/uploads/mdm/lightning-protection.png', 'image/png', 51809, 'Lightning protection level diagram', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/engineering-solution/lightning-protection-system/"}'),
('00000000-0000-0000-0000-000000001216', 'power-monitoring.jpg', 'seed/multidayamitra/power-monitoring.jpg', '/uploads/mdm/power-monitoring.jpg', 'image/jpeg', 62551, 'Power monitoring system trend', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/engineering-solution/power-monitoring-system/"}'),
('00000000-0000-0000-0000-000000001217', 'active-harmonic-filter.jpg', 'seed/multidayamitra/active-harmonic-filter.jpg', '/uploads/mdm/active-harmonic-filter.jpg', 'image/jpeg', 52527, 'Active harmonic filter installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/engineering-solution/active-harmonic-filter/"}'),
('00000000-0000-0000-0000-000000001218', 'industrial-automation.jpg', 'seed/multidayamitra/industrial-automation.jpg', '/uploads/mdm/industrial-automation.jpg', 'image/jpeg', 76584, 'Industrial automation monitoring network', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/industrial-automation/"}'),
('00000000-0000-0000-0000-000000001219', 'testing-tools.jpg', 'seed/multidayamitra/testing-tools.jpg', '/uploads/mdm/testing-tools.jpg', 'image/jpeg', 26856, 'TRAX 280 electrical test set', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/tools/"}'),
('00000000-0000-0000-0000-000000001220', 'fire-alarm.jpg', 'seed/multidayamitra/fire-alarm.jpg', '/uploads/mdm/fire-alarm.jpg', 'image/jpeg', 4446, 'Fire alarm installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/fire-alarm/"}'),
('00000000-0000-0000-0000-000000001221', 'medium-voltage-equipment.jpg', 'seed/multidayamitra/medium-voltage-equipment.jpg', '/uploads/mdm/medium-voltage-equipment.jpg', 'image/jpeg', 44605, 'Medium voltage switchgear', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/products/electrical-equipment/medium-voltage-equipment/"}')
ON CONFLICT DO NOTHING;

-- Align the pre-existing category records with the site's actual hierarchy.
UPDATE services
SET summary = 'Electrical study, engineering, installation, commissioning, maintenance, and energy-management support for industrial distribution systems.',
    content = '{"blocks":[{"type":"heading","text":"Electrical Study and Engineering"},{"type":"list","items":["Electrical distribution system design and engineering","Power quality and protection studies using supporting tools and software","System quality audits","Start-up, commissioning, and training","Energy-efficiency and power-monitoring solutions","Centralized electrical distribution monitoring","Expansion and upgrading"]}]}'::jsonb,
    image_url = '/uploads/mdm/electrical-services.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'electrical-services';

UPDATE services
SET parent_id = (SELECT id FROM services WHERE slug = 'electrical-services'),
    full_path = 'electrical-services/testing-measurement', depth = 1,
    title = 'Testing & Measurement',
    summary = 'Electrical testing and measurement using specialized professional instruments.',
    content = '{"blocks":[{"type":"paragraph","text":"Professional equipment and field services for relay testing, partial discharge scanning, contact-resistance measurement, power-quality analysis, circuit-breaker analysis, and infrared thermography."},{"type":"list","items":["Secondary injection testing","Partial discharge analysis","Contact resistance measurement","Micrologic protection testing","Power quality analysis","Circuit breaker analysis","Infrared thermal imaging"]}]}'::jsonb,
    image_url = '/uploads/mdm/testing-measurement.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'testing-measurement';

UPDATE services
SET summary = 'Predictive, preventive, and contract maintenance for industrial electrical assets.',
    content = '{"blocks":[{"type":"paragraph","text":"Maintenance programs combine routine checks, condition-based diagnostics, planned shutdown work, and service-level agreement support to protect electrical assets and reduce unplanned downtime."},{"type":"list","items":["Predictive maintenance","Preventive maintenance","Maintenance contracts"]}]}'::jsonb,
    image_url = '/uploads/mdm/maintenance.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'maintenance';

UPDATE services
SET title = 'Industrial Automation',
    summary = 'Engineering, implementation, and application of industrial monitoring and control systems.',
    content = '{"blocks":[{"type":"heading","text":"Engineering Services"},{"type":"list","items":["HMI, SCADA, remote monitoring, and reporting design","Programmable Logic Controller and Distribution Control Systems","Data acquisition","Remote monitoring and controlling","Web client and database connection","Plant Information Management System","Switchgear automation systems"]}]}'::jsonb,
    image_url = '/uploads/mdm/industrial-automation.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'industrial-automation';

UPDATE services
SET slug = 'tools', full_path = 'tools', title = 'Tools for Testing & Measurement',
    summary = 'Professional test instruments available for electrical testing and measurement.',
    content = '{"blocks":[{"type":"paragraph","text":"Specialized electrical testing equipment supporting commissioning, condition monitoring, and diagnostic work."},{"type":"list","items":["TRAX 280 test set","Power quality analyzer","Full Function Test Kit (FFTK)"]}]}'::jsonb,
    image_url = '/uploads/mdm/testing-tools.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'tools-testing-measurement';

UPDATE services
SET parent_id = NULL, full_path = 'fire-alarm', depth = 0, title = 'Fire Alarm',
    summary = 'Fire-alarm design, installation, testing, commissioning, maintenance, and centralization.',
    content = '{"blocks":[{"type":"paragraph","text":"PT Multi Daya Mitra delivers fire-alarm implementation with certified personnel and support for system design through ongoing maintenance."},{"type":"list","items":["Design","Installation","Testing and commissioning","Preventive and repair maintenance contracts","Improvement and centralization"]}]}'::jsonb,
    image_url = '/uploads/mdm/fire-alarm.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'fire-alarm';

UPDATE services SET status = 'archived', updated_at = now() WHERE slug IN ('fire-alarm-services', 'automation');

-- Child services visible in the source navigation.
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000001301', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'secondary-injector-3-and-6-phase-current-voltage', 'electrical-services/testing-measurement/secondary-injector-3-and-6-phase-current-voltage', 'Secondary Injector 3 and 6 Phase (Current & Voltage)', 'Secondary-injection testing for relay protection, metering, generator control, and electrical parameter devices.', '{"blocks":[{"type":"paragraph","text":"Secondary injection testing supports relay-protection, metering, and generator-control verification across ABB, Schneider, Siemens, GE Multilin, Toshiba, and analogue relay platforms."},{"type":"list","items":["Six current outputs and six voltage outputs","Low-ampere output and IEC 61850 communication testing","ANSI functions including 87, 50, 51, 32, 27, 59, 60, 64, 67, and 78"]}]}'::jsonb, '/uploads/mdm/secondary-injector.jpg', 'published', now(), 1, 2),
('00000000-0000-0000-0000-000000001302', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'partial-discharge-analyzer-pd-scan', 'electrical-services/testing-measurement/partial-discharge-analyzer-pd-scan', 'Partial Discharge Analyzer (PD Scan)', 'Portable partial-discharge scanning for early fault detection in medium- and high-voltage equipment.', '{"blocks":[{"type":"paragraph","text":"PD Scan identifies partial-discharge signals before defects become costly failures, helping operators prioritize corrective action."},{"type":"list","items":["MV switchgear, bus bars, and bushings","MV cable pre-screening using HFCT sensors","Transformer and outdoor equipment inspection","TEV, acoustic contact, flexible acoustic, and parabolic receiver methods"]}]}'::jsonb, '/uploads/mdm/partial-discharge.jpg', 'published', now(), 2, 2),
('00000000-0000-0000-0000-000000001303', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'contact-resistance-low-ohm-measurement', 'electrical-services/testing-measurement/contact-resistance-low-ohm-measurement', 'Contact Resistance (Low Ohm) Measurement', 'Low-ohm measurement for circuit-breaker contacts, busbar connections, cable terminations, and busducts.', '{"blocks":[{"type":"list","items":["Circuit breaker or switch contacts","Busbar connections","Cable terminations","Busduct installations"]}]}'::jsonb, '/uploads/mdm/contact-resistance.jpg', 'published', now(), 3, 2),
('00000000-0000-0000-0000-000000001304', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'micrologic-test-kit-fftk-schneider', 'electrical-services/testing-measurement/micrologic-test-kit-fftk-schneider', 'Micrologic Test Kit (FFTK) Schneider', 'Testing of Schneider low-voltage circuit-breaker Micrologic protection and measurement units.', '{"blocks":[{"type":"paragraph","text":"The Full Function Test Kit verifies mechanical and electrical operation of Schneider ACB Micrologic control units."},{"type":"list","items":["LI, LSI, LSIG, and LSIV protection levels","Ammeter, energy, power, and harmonics measurement types","Control-unit setting display and protection-function tests"]}]}'::jsonb, '/uploads/mdm/micrologic-test.jpg', 'published', now(), 4, 2),
('00000000-0000-0000-0000-000000001305', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'power-quality-analyzer', 'electrical-services/testing-measurement/power-quality-analyzer', 'Power Quality Analyzer', 'Analysis of voltage, frequency, waveform, continuity, transients, and harmonics in electrical distribution systems.', '{"blocks":[{"type":"paragraph","text":"Power-quality measurement evaluates whether supply conditions and connected loads remain compatible and reliable."},{"type":"list","items":["Continuity of service","Voltage magnitude variation","Transient voltage and current events","AC waveform harmonic content"]}]}'::jsonb, '/uploads/mdm/power-quality.jpg', 'published', now(), 5, 2),
('00000000-0000-0000-0000-000000001306', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'circuit-breaker-analyzer', 'electrical-services/testing-measurement/circuit-breaker-analyzer', 'Circuit Breaker Analyzer', 'Circuit-breaker timing, motion, dynamic characteristic, and coil-current analysis.', '{"blocks":[{"type":"list","items":["Open and close timing measurement","Motion measurement","Dynamic characteristics and bouncing analysis","Opening and closing coil-current waveform diagrams"]}]}'::jsonb, '/uploads/mdm/circuit-breaker.jpg', 'published', now(), 6, 2),
('00000000-0000-0000-0000-000000001307', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'infrared-thermal-imaging-thermograph', 'electrical-services/testing-measurement/infrared-thermal-imaging-thermograph', 'Infrared Thermal Imaging (Thermograph)', 'Infrared surveys that identify abnormal heat patterns before they become equipment failures or fire risks.', '{"blocks":[{"type":"paragraph","text":"Infrared cameras visualize thermal signatures so developing electrical and mechanical issues can be found during planned inspections."},{"type":"list","items":["Loose electrical connections","Overloaded circuits or phases","Deteriorated or damaged insulation","Three-phase imbalance"]}]}'::jsonb, '/uploads/mdm/infrared-thermograph.jpg', 'published', now(), 7, 2),
('00000000-0000-0000-0000-000000001308', (SELECT id FROM services WHERE slug = 'maintenance'), 'predictive-maintenance', 'electrical-services/maintenance/predictive-maintenance', 'Predictive Maintenance', 'Condition-based maintenance using online or periodic equipment monitoring.', '{"blocks":[{"type":"paragraph","text":"Predictive-maintenance technologies monitor in-service equipment continuously or at intervals so work can be performed before performance declines."}]}'::jsonb, '/uploads/mdm/predictive-maintenance.jpg', 'published', now(), 1, 2),
('00000000-0000-0000-0000-000000001309', (SELECT id FROM services WHERE slug = 'maintenance'), 'preventive-maintenance', 'electrical-services/maintenance/preventive-maintenance', 'Preventive Maintenance', 'Scheduled shutdown maintenance that supports safety, uptime, and asset longevity.', '{"blocks":[{"type":"paragraph","text":"Preventive maintenance uses field checks and predictive findings to plan effective shutdown work for electrical distribution equipment."},{"type":"list","items":["Increased safety for people, equipment, and goods","Availability and service-continuity enhancement","Aging-asset performance and CapEx optimization","Operational-cost and OpEx optimization"]}]}'::jsonb, '/uploads/mdm/preventive-maintenance.jpg', 'published', now(), 2, 2),
('00000000-0000-0000-0000-000000001310', (SELECT id FROM services WHERE slug = 'maintenance'), 'maintenance-contract', 'electrical-services/maintenance/maintenance-contract', 'Maintenance Contract', 'Electrical maintenance contracts based on an agreed service level.', '{"blocks":[{"type":"list","items":["Regular checklist or visit","Call-out and emergency service","Regular predictive and preventive maintenance","Equipment operation","Replacement spare parts and minor repair","MTBF and MTTR reporting"]}]}'::jsonb, '/uploads/mdm/maintenance-contract.jpg', 'published', now(), 3, 2),
('00000000-0000-0000-0000-000000001311', (SELECT id FROM services WHERE slug = 'electrical-services'), 'construction-installation', 'electrical-services/construction-installation', 'Construction & Installation', 'Licensed electrical and mechanical construction and installation through medium-voltage equipment.', '{"blocks":[{"type":"paragraph","text":"Experienced site managers and project engineers support safe, efficient, and professional project execution, including medium-voltage electrical installation."}]}'::jsonb, '/uploads/mdm/construction-installation.jpg', 'published', now(), 3, 1),
('00000000-0000-0000-0000-000000001312', (SELECT id FROM services WHERE slug = 'electrical-services'), 'engineering-solution', 'electrical-services/engineering-solution', 'Engineering Solution', 'Specialist electrical engineering solutions for plant reliability and power quality.', '{"blocks":[{"type":"list","items":["Lightning protection system","Power monitoring system","Active harmonic filter"]}]}'::jsonb, NULL, 'published', now(), 4, 1),
('00000000-0000-0000-0000-000000001313', (SELECT id FROM services WHERE slug = 'engineering-solution'), 'lightning-protection-system', 'electrical-services/engineering-solution/lightning-protection-system', 'Lightning Protection System', 'Detailed lightning-protection design and assessment for industrial plants.', '{"blocks":[{"type":"paragraph","text":"Design and assessment are prepared against applicable national and international requirements."},{"type":"list","items":["IEEE Std. 998","NFPA 780","API 545","IEC/EN 62305","Indonesian Ministry of Manpower Regulation PER.02/MEN/1989","SNI 03-7014.1-2004"]}]}'::jsonb, '/uploads/mdm/lightning-protection.png', 'published', now(), 1, 2),
('00000000-0000-0000-0000-000000001314', (SELECT id FROM services WHERE slug = 'engineering-solution'), 'power-monitoring-system', 'electrical-services/engineering-solution/power-monitoring-system', 'Power Monitoring System', 'Energy-management monitoring for continuous improvement in accordance with ISO 50001.', '{"blocks":[{"type":"list","items":["Real-time monitoring","Precise time-stamped logging","Transparent energy-consumption data capture","Optimization measures","Energy and cost reduction"]}]}'::jsonb, '/uploads/mdm/power-monitoring.jpg', 'published', now(), 2, 2),
('00000000-0000-0000-0000-000000001315', (SELECT id FROM services WHERE slug = 'engineering-solution'), 'active-harmonic-filter', 'electrical-services/engineering-solution/active-harmonic-filter', 'Active Harmonic Filter', 'Harmonic-mitigation solution for installations with variable and non-linear loads.', '{"blocks":[{"type":"paragraph","text":"Active Harmonic Filters mitigate harmonic currents and voltage disturbance, helping protect equipment, improve power quality, and reduce energy cost."},{"type":"paragraph","text":"They are suited to large installations with numerous variable-speed drives and can also support power-factor correction."}]}'::jsonb, '/uploads/mdm/active-harmonic-filter.jpg', 'published', now(), 3, 2)
ON CONFLICT DO NOTHING;

-- Product catalog entries and details from the current source navigation.
UPDATE products
SET title = 'Automation', summary = 'Industrial automation software and control-system products.',
    content = '{"blocks":[{"type":"paragraph","text":"Automation solutions for industrial monitoring, control, and digital transformation."},{"type":"list","items":["SCADA – xArrow","EcoStruxure Automation Expert"]}]}'::jsonb,
    image_url = '/uploads/M2.jpeg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'automation-products';

UPDATE products
SET title = 'SCADA – xArrow',
    summary = 'SCADA platform with distributed acquisition, alarm processing, historical data, and multi-platform support.',
    content = '{"blocks":[{"type":"paragraph","text":"xArrow supports Windows XP/2003/Vista/7/8/10, remains compatible with earlier versions, and can be expanded with protocol drivers, script commands, and widgets."},{"type":"list","items":["Alarm processing and preservation","Client/server mode with distributed data acquisition","Real-time and multi-tasking kernel","Redundant acquisition and historical-data processing","Historical database support for Oracle, SQL Server, MySQL, Access, and PostgreSQL","OPC Client and popular communication protocols"]}]}'::jsonb,
    specs = '{"category":"Automation","product":"SCADA – xArrow"}'::jsonb,
    image_url = '/uploads/xarrow.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'scada-xarrow';

UPDATE products
SET title = 'Electrical Equipment', summary = 'Electrical distribution panels, motor-control equipment, and medium-voltage solutions.',
    content = '{"blocks":[{"type":"paragraph","text":"Electrical equipment is supplied and assembled to international electrical standards with attention to design and safety."},{"type":"list","items":["Low-voltage distribution panel","Capacitor bank","Motor control center","Motor starters and VFD/VSD panels","ATS, AMF, and automatic load shedding","Generator control panels","Switchgear automation","Medium-voltage distribution panels","Active harmonic filters and load banks"]}]}'::jsonb,
    image_url = NULL, gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'electrical-equipment';

UPDATE products
SET title = 'Fire Alarm System', summary = 'Fire-detection products for industrial and commercial applications.',
    content = '{"blocks":[{"type":"list","items":["Bosch Security fire-detection solutions"]}]}'::jsonb,
    image_url = NULL, gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'fire-alarm-systems';

UPDATE products
SET title = 'Rittal – The System.', summary = 'Authorized Rittal enclosure, climate-control, and accessory solutions.',
    content = '{"blocks":[{"type":"paragraph","text":"Genuine Rittal enclosure solutions backed by technical expertise, project support, local service, system integration, and consistent quality."},{"type":"list","items":["Enclosures","Climate control","Accessories"]}]}'::jsonb,
    specs = '{"brand":"Rittal","role":"Authorized Distributor"}'::jsonb,
    image_url = '/uploads/Rittal.png', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'rittal-products';

UPDATE products
SET title = 'Bosch Security', summary = 'Bosch fire-detection solutions for addressable and conventional applications.',
    content = '{"blocks":[{"type":"paragraph","text":"Bosch provides modular addressable systems and cost-efficient conventional fire technology for different application sizes."},{"type":"list","items":["Optical, heat, multi-criteria, and specialty detectors","Addressable and conventional technology","Technical alarm and extinguishing-system integration","Audible and visible notification appliances","Video-based smoke and flame detection","Detector test and removal accessories"]}]}'::jsonb,
    specs = '{"brand":"Bosch Security","category":"Fire Alarm"}'::jsonb,
    image_url = '/uploads/BOSCH.png', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'bosch-fire-alarm';

-- These older editorial entries do not have a corresponding source product page;
-- leave their image blank rather than show an unrelated repeated asset.
UPDATE products SET image_url = NULL, gallery = '[]'::jsonb, updated_at = now()
WHERE slug IN ('instrumentation', 'testing-equipment', 'protection-relay', 'electrical-panels', 'rittal-enclosures');

INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, gallery, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000001401', (SELECT id FROM products WHERE slug = 'automation-products'), 'ecostruxure-automation-expert', 'automation-products/ecostruxure-automation-expert', 'EcoStruxure™ Automation Expert', 'Plant-automation software for digital control systems in discrete, hybrid, and continuous industrial processes.', '{"blocks":[{"type":"paragraph","text":"EcoStruxure Automation Expert is an integrated automation solution designed to improve flexibility, efficiency, and scalability."}]}'::jsonb, '{"brand":"Schneider Electric","category":"Automation"}'::jsonb, NULL, '[]'::jsonb, 'published', now(), 2, 1),
('00000000-0000-0000-0000-000000001402', (SELECT id FROM products WHERE slug = 'electrical-equipment'), 'electrical-distribution-equipment', 'electrical-equipment/electrical-distribution-equipment', 'Electrical Distribution Equipment', 'Electrical distribution equipment supplied and assembled to international standards.', '{"blocks":[{"type":"list","items":["Medium-voltage distribution panel","Low-voltage distribution panel","Capacitor bank","Motor control center","Motor starters including VFD/VSD","ATS and AMF","Synchronous panel","Switchgear automation","Load-sharing panel","PV/solar panel","Power transformer, CT, and VT","Neutral grounding resistor","Active and passive harmonic filter"]}]}'::jsonb, '{"category":"Electrical Distribution"}'::jsonb, NULL, '[]'::jsonb, 'published', now(), 1, 1),
('00000000-0000-0000-0000-000000001403', (SELECT id FROM products WHERE slug = 'electrical-equipment'), 'medium-voltage-equipment', 'electrical-equipment/medium-voltage-equipment', 'Medium Voltage Equipment', 'Medium-voltage electrical distribution equipment.', '{"blocks":[{"type":"paragraph","text":"Medium-voltage equipment for electrical distribution applications."}]}'::jsonb, '{"category":"Medium Voltage"}'::jsonb, '/uploads/mdm/medium-voltage-equipment.jpg', '[]'::jsonb, 'published', now(), 2, 1)
ON CONFLICT DO NOTHING;

-- Keep existing news records aligned with their current source articles. Where the
-- original article has no featured image, an empty value is more accurate than a repeated image.
UPDATE news
SET title = 'Energy Monitoring System for Sustainability & ESG Reporting',
    excerpt = 'Smart energy monitoring that improves efficiency, reduces cost, and supports sustainability and ESG reporting.',
    body = '{"blocks":[{"type":"heading","text":"Turning Energy Data into Measurable Business Impact"},{"type":"paragraph","text":"PT Multi Daya Mitra implemented a Smart Energy Monitoring System integrated with an industrial-grade SCADA platform to give production lines, utilities, and distribution systems real-time energy intelligence."},{"type":"list","items":["120+ electrical and utility measurement points in one dashboard","Energy transparency for machines, HVAC, compressors, and distribution","Visibility of energy losses and peak-demand drivers","Automated management, audit, and sustainability reporting","Scope 2 carbon-emission insight"]}]}'::jsonb,
    featured_image_url = '/uploads/M2.jpeg', updated_at = now()
WHERE slug = 'energy-monitoring-system-launch';

UPDATE news
SET title = 'Preventive Maintenance of Medium Voltage (MV) Switchgear',
    excerpt = 'Preventive maintenance improves MV switchgear reliability, safety, and operational life.',
    body = '{"blocks":[{"type":"heading","text":"Ensuring Reliability, Safety, and Asset Longevity"},{"type":"paragraph","text":"MV switchgear protects equipment and continuity of supply. Preventive maintenance detects potential issues early and supports optimal performance."},{"type":"list","items":["Improved system reliability","Enhanced safety for personnel and assets","Extended equipment lifespan through early fault detection"]}]}'::jsonb,
    featured_image_url = '/uploads/hero-project.jpg', updated_at = now()
WHERE slug = '20mw-substation-commissioning-east-java';

UPDATE news
SET title = 'Transformer Testing and Maintenance',
    excerpt = 'Transformer health assessments including winding-resistance testing and routine field diagnostics.',
    body = '{"blocks":[{"type":"heading","text":"Power Transformer Health Assessments"},{"type":"paragraph","text":"Winding-resistance testing supports manufacturing quality assurance, type testing, regular field maintenance, and detection of connection or tap-changer issues."}]}'::jsonb,
    featured_image_url = '/uploads/automation-project.jpg', updated_at = now()
WHERE slug = 'transformer-testing-maintenance';

UPDATE news
SET title = 'Effects of Harmonics – Resonance',
    excerpt = 'How harmonic currents and voltage distortion affect electrical distribution systems.',
    body = '{"blocks":[{"type":"heading","text":"Definition of Harmonic"},{"type":"paragraph","text":"Harmonics distort current and voltage away from sinusoidal waveforms. They are created by non-linear loads and can affect distribution-system performance."}]}'::jsonb,
    featured_image_url = NULL, updated_at = now()
WHERE slug = 'effects-of-harmonic-distortion';

UPDATE news
SET title = 'Partial Discharge Analyzer',
    excerpt = 'PD Scan for predictive maintenance of MV switchgear, transformers, and medium-voltage cable.',
    body = '{"blocks":[{"type":"paragraph","text":"Partial Discharge Analyzer or PD Scan supports online predictive maintenance of medium-voltage switchgear, transformers, and medium-voltage cable."}]}'::jsonb,
    featured_image_url = NULL, updated_at = now()
WHERE slug = 'partial-discharge-analyzer';

COMMIT;


-- ==========================================
-- Migration: 013_source_product_image.up.sql
-- ==========================================

-- 013_source_product_image.up.sql
-- Source image for the Electrical Equipment catalog landing page.

BEGIN;

INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, alt_text, status, metadata)
VALUES ('00000000-0000-0000-0000-000000001222', 'electrical-equipment.jpg', 'seed/multidayamitra/electrical-equipment.jpg', '/uploads/mdm/electrical-equipment.jpg', 'image/jpeg', 76886, 'Electrical equipment installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/products/electrical-equipment/"}')
ON CONFLICT DO NOTHING;

UPDATE products
SET image_url = '/uploads/mdm/electrical-equipment.jpg', updated_at = now()
WHERE slug = 'electrical-equipment';

COMMIT;


-- ==========================================
-- Migration: 014_source_navigation_hierarchy.up.sql
-- ==========================================

-- 014_source_navigation_hierarchy.up.sql
-- Keep public navigation aligned with the hierarchy visible on multidayamitra.co.id.
-- Legacy editorial records are archived (not deleted) when they have no matching
-- menu page in the source site.

BEGIN;

UPDATE services
SET sort_order = CASE slug
  WHEN 'electrical-services' THEN 1
  WHEN 'industrial-automation' THEN 2
  WHEN 'tools' THEN 3
  WHEN 'fire-alarm' THEN 4
  WHEN 'testing-measurement' THEN 1
  WHEN 'maintenance' THEN 2
  WHEN 'construction-installation' THEN 3
  WHEN 'engineering-solution' THEN 4
  WHEN 'secondary-injector-3-and-6-phase-current-voltage' THEN 1
  WHEN 'partial-discharge-analyzer-pd-scan' THEN 2
  WHEN 'contact-resistance-low-ohm-measurement' THEN 3
  WHEN 'micrologic-test-kit-fftk-schneider' THEN 4
  WHEN 'power-quality-analyzer' THEN 5
  WHEN 'circuit-breaker-analyzer' THEN 6
  WHEN 'infrared-thermal-imaging-thermograph' THEN 7
  WHEN 'predictive-maintenance' THEN 1
  WHEN 'preventive-maintenance' THEN 2
  WHEN 'maintenance-contract' THEN 3
  WHEN 'lightning-protection-system' THEN 1
  WHEN 'power-monitoring-system' THEN 2
  WHEN 'active-harmonic-filter' THEN 3
  ELSE sort_order
END,
updated_at = now();

UPDATE services
SET status = 'archived', updated_at = now()
WHERE slug = 'electrical-engineering';

UPDATE products
SET sort_order = CASE slug
  WHEN 'automation-products' THEN 1
  WHEN 'electrical-equipment' THEN 2
  WHEN 'fire-alarm-systems' THEN 3
  WHEN 'rittal-products' THEN 4
  WHEN 'scada-xarrow' THEN 1
  WHEN 'ecostruxure-automation-expert' THEN 2
  WHEN 'electrical-distribution-equipment' THEN 1
  WHEN 'medium-voltage-equipment' THEN 2
  WHEN 'bosch-fire-alarm' THEN 1
  ELSE sort_order
END,
updated_at = now();

UPDATE products
SET status = 'archived', updated_at = now()
WHERE slug IN ('instrumentation', 'testing-equipment', 'protection-relay', 'electrical-panels', 'rittal-enclosures');

COMMIT;


-- ==========================================
-- Migration: 015_repair_engineering_solution_tree.up.sql
-- ==========================================

-- 015_repair_engineering_solution_tree.up.sql
-- The engineering-solution row and its children are inserted in one statement
-- by migration 012, so attach the children after that parent exists.

BEGIN;

UPDATE services
SET parent_id = (SELECT id FROM services WHERE slug = 'engineering-solution'),
    depth = 2,
    updated_at = now()
WHERE slug IN ('lightning-protection-system', 'power-monitoring-system', 'active-harmonic-filter');

COMMIT;


-- ==========================================
-- Migration: 016_search_trgm.up.sql
-- ==========================================

-- Trigram indexes so the leading-wildcard ILIKE search filters
-- (title/summary/excerpt) can use an index instead of sequential scans.
-- Guarded: managed/shared Postgres may deny CREATE EXTENSION — in that case
-- the migration still succeeds and search simply stays unindexed.
DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'pg_trgm extension not available (insufficient privilege); skipping trigram indexes';
    END;
END
$$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        CREATE INDEX IF NOT EXISTS services_title_trgm_idx ON services USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS services_summary_trgm_idx ON services USING gin (summary gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON products USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS products_summary_trgm_idx ON products USING gin (summary gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS news_title_trgm_idx ON news USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS news_excerpt_trgm_idx ON news USING gin (excerpt gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS careers_title_trgm_idx ON careers USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS pages_title_trgm_idx ON pages USING gin (title gin_trgm_ops);
    END IF;
END
$$;

-- Scope note: the content::text / specs::text / body::text casts in search
-- queries are intentionally left unindexed — expression GIN indexes on full
-- JSON casts are large and churn on every edit; title/summary/excerpt cover
-- the common search paths.


-- ==========================================
-- Migration: 017_update_sales_and_trust_2026.up.sql
-- ==========================================

-- 017_update_sales_and_trust_2026.up.sql
-- Updates sales phone to +62 821-4007-4122, company founding date to 2012,
-- and enriches trust & compliance data (ISO, SMK3, HSE, Tenaga Ahli, Testing Tools).

BEGIN;

-- 1. Update Site Settings
UPDATE settings
SET value = jsonb_build_object(
    'email', 'info@multidayamitra.co.id',
    'phone', '+62 31 592 1256',
    'fax', '+62 31 591 7845',
    'address', 'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
    'tagline', 'Electrical · Automation · Fire System',
    'footerDescription', 'Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.',
    'socials', jsonb_build_array(
        jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/', 'label', 'Facebook'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/', 'label', 'Instagram'),
        jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/6282140074122', 'label', 'WhatsApp Sales')
    ),
    'salesEmail', 'sales@multidayamitra.co.id',
    'salesPhone', '+62 821-4007-4122',
    'whatsappPhone', '+62 821-4007-4122',
    'hotlinePhone', '+62 821-4007-4122'
),
    updated_at = now()
WHERE key = 'site';

-- 2. Update Contact Page
UPDATE pages
SET content = jsonb_build_object(
    'offices', jsonb_build_array(
        jsonb_build_object(
            'name', 'Head Office (Surabaya)',
            'address', 'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
            'phone', '+62 31 592 1256',
            'fax', '+62 31 591 7845',
            'email', 'info@multidayamitra.co.id',
            'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
        ),
        jsonb_build_object(
            'name', 'Engineering Office & Workshop',
            'address', 'Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia',
            'phone', '+62 821-4007-4122',
            'email', 'info@multidayamitra.co.id',
            'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
        )
    ),
    'email', 'info@multidayamitra.co.id',
    'phone', '+62 31 592 1256',
    'fax', '+62 31 591 7845',
    'salesEmail', 'sales@multidayamitra.co.id',
    'salesPhone', '+62 821-4007-4122',
    'whatsappPhone', '+62 821-4007-4122',
    'hotlinePhone', '+62 821-4007-4122'
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000402';

-- 3. Update About Page
UPDATE pages
SET content = jsonb_build_object(
    'overview', 'PT Multi Daya Mitra was established in 2012 as a multidisciplinary engineering company specializing in electrical systems, industrial automation, fire alarm solutions, and mechanical works. With over 14 years of business experience, 400+ clients across multi-segments, and a dedicated team of over 200 engineers and professionals, we deliver reliable, safe, and integrated engineering solutions across Indonesia and international assignments.',
    'vision', 'Global Electrical, Automation and Fire Alarm Services Company.',
    'mission', 'Mutual Partnership and Professionalism in delivering every engineering engagement.',
    'tagline', 'Always Make an IMPACT - Powering Solution, Creating Impact',
    'culture', 'The company culture in a professional manner brings the company to move fast in achieving every step of its vision.',
    'established', '2012',
    'experienceYears', '14+',
    'clientCount', '400+',
    'teamCount', '200+',
    'hseSlogan', 'Saya Pilih Selamat - Aman Sehat Setiap Saat (Think Safe, Work Safe, Go Home Safe)',
    'hsePillars', jsonb_build_array(
        jsonb_build_object('title', 'Protect Every Person', 'desc', 'Keselamatan dimulai dari diri sendiri'),
        jsonb_build_object('title', 'Care For Each Other', 'desc', 'Peduli hari ini, melindungi masa depan'),
        jsonb_build_object('title', 'Commit To Excellence', 'desc', 'Kerja aman adalah kerja profesional'),
        jsonb_build_object('title', 'Sustain For The Future', 'desc', 'Keselamatan adalah investasi keberlanjutan')
    ),
    'impactValues', jsonb_build_array(
        jsonb_build_object('letter', 'I', 'title', 'Integrity & Innovation', 'desc', 'Building trust through honesty, responsibility, and advancing through modern technology.'),
        jsonb_build_object('letter', 'M', 'title', 'Mastery & Intelligent Problem-Solving', 'desc', 'Deep technical mastery, analytical thinking, precision engineering without assumptions.'),
        jsonb_build_object('letter', 'P', 'title', 'Professional & Trusted Partnership', 'desc', 'Discipline, consistency, and long-term strategic engineering partnership.'),
        jsonb_build_object('letter', 'A', 'title', 'Agile & Adaptable Execution', 'desc', 'Swift response to evolving project conditions and technological changes.'),
        jsonb_build_object('letter', 'C', 'title', 'Commitment to Safety & Customer First', 'desc', 'Safety is non-negotiable, operational continuity, asset reliability.'),
        jsonb_build_object('letter', 'T', 'title', 'Total Engineering Solutions', 'desc', 'End-to-end solutions from design & installation to testing, commissioning & lifecycle maintenance.')
    ),
    'certifications', jsonb_build_array(
        'ISO 9001:2015 (Quality Management System - KAN)',
        'ISO 14001:2015 (Environmental Management System)',
        'ISO 45001:2018 (Occupational Health & Safety - KAN)',
        'Ecovadis Silver (Top 15% Sustainability Rating)',
        'Avetta Member',
        'SBUJTL & IUJPTL ESDM (Izin Usaha Ketenagalistrikan)',
        'Sertifikat Kompetensi Level 6 Tegangan Menengah ESDM',
        'SMK3 Kemenaker',
        'NFPA Member (National Fire Protection Association)',
        'D&B Rating (Dun & Bradstreet)'
    ),
    'licensedExperts', jsonb_build_array(
        'AK3 Listrik (Ahli K3 Listrik Kemnaker)',
        'AK3 Umum (Ahli K3 Umum)',
        'AK3 Kebakaran (Kelas A, B, C, D)',
        'Teknisi Kompetensi Tegangan Menengah ESDM',
        'Licensed Mechanical & Termination Specialists'
    ),
    'testingTools', jsonb_build_array(
        'Partial Discharge Analyzer & Scanner',
        'Omicron Relay & CT/VT Analyzer',
        'Megger Insulation & Earth Tester',
        'Fluke Power Quality Analyzer',
        'Transformer Oil Treatment, BDV & DGA',
        'Breaker Analyzer & Contact Resistance Tester',
        'Secondary Injection Test Sets & Load Bank'
    ),
    'partnerships', jsonb_build_array(
        'Schneider Electric (Authorized Partner)',
        'Rittal (Authorized Partner)',
        'xArrow (Authorized Partner)',
        'Bosch (Authorized Partner)',
        'ABB', 'Siemens', 'Fluke', 'Megger', 'FLIR', 'Danfoss', 'Omron'
    )
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000401';

COMMIT;


-- ==========================================
-- Migration: 018_products_and_partners_hierarchy.up.sql
-- ==========================================

-- 018_products_and_partners_hierarchy.up.sql
-- Synchronize Products & Partners hierarchy with official 2026 Company Profile:
-- 1. Rittal Authorized Distributor (Enclosures, Climate Control & Cooling, Power Distribution)
-- 2. Schneider Electric System Integrator (Industrial Automation, Power & Energy Monitoring, Electrical Distribution Integration, Engineering & Commissioning)
-- 3. Product Categories (Electrical Distribution, Automation & Control, Enclosure & Climate Control, Power Quality, Fire Alarm Products)
-- 4. Brand Experience ecosystem data

BEGIN;

-- Clean existing products to rebuild clean, standardized hierarchy
DELETE FROM products WHERE id IS NOT NULL;

-- Root Categories (Depth 0)
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000701',
    'rittal-distributor',
    'rittal-distributor',
    'Rittal Authorized Distributor',
    'Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, and power distribution systems.',
    '{"blocks":[{"type":"paragraph","data":{"text":"PT Multi Daya Mitra is the official Authorized Distributor for Rittal in Indonesia. We provide genuine Rittal enclosure systems, climate control units, and low-voltage power distribution equipment with certified engineering support, stock availability, and manufacturer warranty."}}]}',
    '{"partnerType":"Authorized Distributor","brand":"Rittal","origin":"Germany","warranty":"Official Manufacturer Warranty"}',
    '/uploads/products-rittal.jpg',
    'published',
    now(),
    1,
    0
),
(
    '00000000-0000-0000-0000-000000000702',
    'schneider-integrator',
    'schneider-integrator',
    'Schneider Electric System Integrator',
    'Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.',
    '{"blocks":[{"type":"paragraph","data":{"text":"As a certified Schneider Electric System Integrator, PT Multi Daya Mitra delivers integrated automation, power monitoring (PME), and electrical distribution architectures. We combine world-class hardware with custom engineering, programming, FAT/SAT, and plant commissioning."}}]}',
    '{"partnerType":"Certified System Integrator","brand":"Schneider Electric","origin":"France / Global","ecosystem":"EcoStruxure Partner"}',
    '/uploads/automation-project.jpg',
    'published',
    now(),
    2,
    0
),
(
    '00000000-0000-0000-0000-000000000703',
    'electrical-distribution',
    'electrical-distribution',
    'Electrical Distribution',
    'Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive electrical distribution solutions for industrial plants, power stations, and commercial infrastructure. Covering MV/LV switchgear, distribution transformers, motor control centers, and protection relays."}}]}',
    '{"category":"Electrical Distribution","voltageLevels":"MV up to 36kV, LV up to 1000V"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    3,
    0
),
(
    '00000000-0000-0000-0000-000000000704',
    'automation-control',
    'automation-control',
    'Automation & Control',
    'Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.',
    '{"blocks":[{"type":"paragraph","data":{"text":"State-of-the-art automation and control solutions designed to optimize production throughput, energy efficiency, and operational safety. From individual machine control to plant-wide centralized SCADA."}}]}',
    '{"category":"Automation & Control","platforms":"EcoStruxure, xArrow, Siemens, Rockwell"}',
    '/uploads/M2.jpeg',
    'published',
    now(),
    4,
    0
),
(
    '00000000-0000-0000-0000-000000000705',
    'enclosure-climate-control',
    'enclosure-climate-control',
    'Enclosure & Climate Control',
    'Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Heavy-duty industrial enclosure and climate control products engineered to protect sensitive electrical and automation equipment against heat, dust, corrosive chemicals, and outdoor elements."}}]}',
    '{"category":"Enclosure & Climate Control","protection":"IP55 - IP66 / NEMA 4X"}',
    '/uploads/products-rittal.jpg',
    'published',
    now(),
    5,
    0
),
(
    '00000000-0000-0000-0000-000000000706',
    'power-quality',
    'power-quality',
    'Power Quality',
    'Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Advanced power quality management products that eliminate harmonics, correct power factor to near-unity, suppress voltage fluctuations, and prevent costly equipment tripping."}}]}',
    '{"category":"Power Quality","mitigation":"THDi < 3%, Stepless Cos Phi 1.0"}',
    '/uploads/news-1.jpg',
    'published',
    now(),
    6,
    0
),
(
    '00000000-0000-0000-0000-000000000707',
    'fire-alarm-products',
    'fire-alarm-products',
    'Fire Alarm Products',
    'Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified fire detection and suppression products designed for industrial facilities, power plants, control rooms, and commercial high-rises in accordance with NFPA standards."}}]}',
    '{"category":"Fire Alarm Products","standards":"NFPA 72, NFPA 2001, EN54, UL/FM"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    7,
    0
);

-- Child Products (Depth 1) - Under Rittal Authorized Distributor
INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000711',
    '00000000-0000-0000-0000-000000000701',
    'enclosures',
    'rittal-distributor/enclosures',
    'Rittal Enclosure Systems (VX25, AX, KX)',
    'Modular baying enclosure systems (VX25), compact enclosures (AX), small enclosures (KX), and outdoor IT racks.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Rittal enclosure systems provide unmatched modularity, IP66 protection, and mechanical strength. Suitable for control panels, switchgear, automation assemblies, and outdoor cabinets in industrial environments."}}]}',
    '{"Series":"VX25, AX, KX, CS Toptec","Protection Rating":"IP55 / IP66 / NEMA 4X","Material":"Sheet steel / Stainless steel AISI 304 & 316L","Approvals":"IEC 62208, UL 508A, DNV-GL"}',
    '/uploads/products-rittal.jpg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000712',
    '00000000-0000-0000-0000-000000000701',
    'climate-control-cooling',
    'rittal-distributor/climate-control-cooling',
    'Rittal Climate Control & Cooling (Blue e+)',
    'Energy-efficient Blue e+ cooling units, industrial chillers, and air-to-water heat exchangers providing up to 75% energy savings.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Rittal Blue e+ cooling technology utilizes hybrid heat pipe and inverter-driven compressor systems, significantly reducing carbon footprint and energy consumption while ensuring stable temperatures for sensitive electronics."}}]}',
    '{"Technology":"Hybrid Heat Pipe + Inverter Compressor","Energy Saving":"Up to 75% vs standard cooling","Cooling Output":"300 W to 6000 W","Connectivity":"IoT Interface / Modbus / SNMP"}',
    '/uploads/automation-project.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000713',
    '00000000-0000-0000-0000-000000000701',
    'power-distribution',
    'rittal-distributor/power-distribution',
    'Rittal Power Distribution (Ri4Power & RiLine)',
    'Type-tested low-voltage switchgear system up to 6300A with modular RiLine compact busbar power distribution.',
    '{"blocks":[{"type":"paragraph","data":{"text":"The Ri4Power modular power distribution system allows type-tested assembly according to IEC 61439-1/-2 up to 6300A, featuring Form 1 to Form 4b internal separation and compact RiLine busbar technology."}}]}',
    '{"System":"Ri4Power & RiLine60","Rated Current":"Up to 6300 A","Form of Separation":"Form 1 to 4b","Standard":"IEC 61439-1/-2, IEC 60947"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    3,
    1
);

-- Child Products (Depth 1) - Under Schneider Electric System Integrator
INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000721',
    '00000000-0000-0000-0000-000000000702',
    'industrial-automation',
    'schneider-integrator/industrial-automation',
    'Schneider Industrial Automation (Modicon & EcoStruxure)',
    'Next-generation universal automation, Modicon M221/M241/M251/M580 PLCs, Altivar VSD drives, and Magelis HMI.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Complete industrial automation integration using Schneider Electric EcoStruxure™ architecture, Modicon PLCs, and Altivar variable speed drives for precise motion, pump, fan, and manufacturing process control."}}]}',
    '{"PLC Family":"Modicon M221, M241, M251, M580 ePAC","Drives":"Altivar Process ATV600 / ATV900 / ATV320","Software":"EcoStruxure Control Expert, Machine Expert","Protocols":"Modbus TCP, Ethernet/IP, Profinet, OPC UA"}',
    '/uploads/M2.jpeg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000722',
    '00000000-0000-0000-0000-000000000702',
    'power-energy-monitoring',
    'schneider-integrator/power-energy-monitoring',
    'Power & Energy Monitoring (PME & PowerLogic)',
    'Real-time power monitoring with EcoStruxure Power Monitoring Expert (PME) and PowerLogic PM5000/PM8000 smart power meters.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Turnkey energy management and electrical network monitoring. Delivers real-time telemetry, power quality event capture, energy baseline auditing, and automated ESG carbon accounting reports."}}]}',
    '{"Software Platform":"EcoStruxure Power Monitoring Expert (PME)","Hardware":"PowerLogic PM5000, PM8000, ION9000","Capabilities":"Harmonics, Sag/Swell, Transient Logging, ESG Reporting","Compliance":"ISO 50001, IEC 61000-4-30 Class A"}',
    '/uploads/news-1.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000723',
    '00000000-0000-0000-0000-000000000702',
    'electrical-distribution-integration',
    'schneider-integrator/electrical-distribution-integration',
    'Electrical Distribution Integration (MasterPact & Prisma)',
    'Integrated low and medium voltage electrical distribution with MasterPact MTZ/NT/NW ACBs, Compact NSX, and Prisma switchboards.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Engineered switchboard solutions combining Schneider Electric Prisma iPM structures with smart MasterPact MTZ circuit breakers featuring embedded Class 1 power metering and remote diagnostics."}}]}',
    '{"Air Circuit Breakers":"MasterPact MTZ1 / MTZ2 / MTZ3 (up to 6300A)","MCCB":"Compact NSX & NSXm with MicroLogic","Switchboard System":"Prisma iPM / PrismaSeT G & P","Intelligence":"Embedded Power Metering & Health Analytics"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    3,
    1
),
(
    '00000000-0000-0000-0000-000000000724',
    '00000000-0000-0000-0000-000000000702',
    'engineering-commissioning',
    'schneider-integrator/engineering-commissioning',
    'Schneider Engineering, FAT/SAT & Commissioning Support',
    'Full lifecycle engineering support from CAD panel schematics and PLC logic to Factory Acceptance Testing (FAT) and site commissioning.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified engineering teams provide end-to-end support including electrical design, control panel fabrication, software engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), and 24/7 service contracts."}}]}',
    '{"Services":"Panel Design, PLC/SCADA Programming, FAT & SAT, On-Site Testing","Testing Gear":"Secondary Injection Sets, Omicron Relay Test, Cable Analyzers","Response":"24/7 Emergency Support SLA Available"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    4,
    1
);

-- Child Products (Depth 1) - Under Core Categories
INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000731',
    '00000000-0000-0000-0000-000000000703',
    'medium-voltage-substation',
    'electrical-distribution/medium-voltage-substation',
    'Medium Voltage Substation & Transformers',
    'MV Metal-Clad Switchgear up to 24kV/36kV, Oil-Immersed & Cast Resin Dry-Type Transformers, and Vacuum Circuit Breakers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Turnkey medium voltage substation equipment engineered for utility substations, heavy industrial plants, and captive power plants."}}]}',
    '{"Voltage Level":"Up to 36 kV","Transformer Capacity":"Up to 20 MVA","Insulation":"Oil-Immersed / Cast Resin Dry Type","Standard":"IEC 62271-200, SPLN"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000732',
    '00000000-0000-0000-0000-000000000703',
    'low-voltage-distribution-panels',
    'electrical-distribution/low-voltage-distribution-panels',
    'Low Voltage Panels (MDP, SDP, ATS & Sync)',
    'Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), ATS/AMF Generator Sync Panels, and Motor Control Centers (MCC).',
    '{"blocks":[{"type":"paragraph","data":{"text":"Custom assembled low voltage distribution boards built with premium copper busbars, type-tested enclosures, and intelligent circuit breakers for seamless power routing."}}]}',
    '{"Rated Voltage":"380V / 400V / 690V","Busbar Rating":"Up to 6300A (99.9% Cu-ETP)","Enclosure IP":"IP42 to IP65","Operation":"Manual / Auto Sync ATS"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000741',
    '00000000-0000-0000-0000-000000000704',
    'scada-xarrow-telemetry',
    'automation-control/scada-xarrow-telemetry',
    'SCADA Systems & Process Monitoring (xArrow)',
    'High-performance SCADA software, real-time telemetry, alarm management, historical trending, and industrial IoT dashboards.',
    '{"blocks":[{"type":"paragraph","data":{"text":"xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, and receive instant alert dispatches."}}]}',
    '{"Software":"xArrow SCADA Industrial Edition","Tags":"Unlimited I/O Tag Packages","Protocols":"OPC UA, Modbus TCP/RTU, MQTT, REST API","Architecture":"Client-Server / Web-Based"}',
    '/uploads/M2.jpeg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000742',
    '00000000-0000-0000-0000-000000000704',
    'vsd-inverter-panels',
    'automation-control/vsd-inverter-panels',
    'Variable Speed Drive (VSD) & Inverter Panels',
    'Custom engineered VSD and soft starter panels for pumps, compressors, blowers, extruders, and conveying machinery.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Enclosed drive panels engineered with proper thermal dissipation, line reactors, harmonic mitigation, and bypass contactors for reliable speed and torque regulation."}}]}',
    '{"Power Range":"0.75 kW to 1200 kW","Control Modes":"V/f, Vector Control, Torque Control","Brands":"Schneider, Danfoss, ABB, Siemens","Enclosure":"Rittal Industrial IP55"}',
    '/uploads/automation-project.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000751',
    '00000000-0000-0000-0000-000000000706',
    'active-harmonic-filters',
    'power-quality/active-harmonic-filters',
    'Active Harmonic Filters (AHF) & SVG',
    'Dynamic active harmonic compensation up to the 50th harmonic order with stepless reactive power factor correction.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Active Harmonic Filters dynamically inject counter-phase currents to cancel harmonic distortions generated by non-linear loads such as VFDs, rectifiers, and UPS systems."}}]}',
    '{"Harmonic Range":"2nd to 50th Order","Target THDi":"< 3% at rated capacity","Response Time":"< 5 milliseconds","Modular Capacity":"50A to 600A modular"}',
    '/uploads/news-1.jpg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000761',
    '00000000-0000-0000-0000-000000000707',
    'addressable-fire-alarm-systems',
    'fire-alarm-products/addressable-fire-alarm-systems',
    'Addressable Fire Alarm Panels & Detectors',
    'Intelligent addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and suppression triggers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Fully addressable fire detection networks providing precise point-by-point device identification, automatic sensitivity drift compensation, and BMS system integration."}}]}',
    '{"Standards":"NFPA 72, EN54, UL Listed, FM Approved","Capacity":"1 to 8 Loops (up to 2000+ points)","Detectors":"Optical Smoke, Thermal, Multi-Criteria, Flame"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    1,
    1
);

COMMIT;


-- ==========================================
-- Migration: 019_services_and_solutions_2026.up.sql
-- ==========================================

-- 019_services_and_solutions_2026.up.sql
-- Synchronize Services hierarchy with official 2026 Company Profile:
-- 1. Electrical Construction & Installation
-- 2. Electrical Maintenance & Servicing
-- 3. Automation Solutions & Services
-- 4. Inspection, Testing & Commissioning
-- 5. Mechanical Services & Supplies

BEGIN;

-- Clean existing services to rebuild clean, standardized hierarchy
DELETE FROM services WHERE id IS NOT NULL;

-- Root Services (Depth 0)
INSERT INTO services (id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000801',
    'electrical-construction-installation',
    'electrical-construction-installation',
    'Electrical Construction & Installation',
    'Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.',
    '{"blocks":[{"type":"paragraph","data":{"text":"End-to-end electrical construction and installation services for manufacturing plants, substations, and industrial infrastructure. Our certified engineers deliver precision panel assembly, busbar erection, MV/LV cabling, and transformer installation adhering to SPLN and IEC standards."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    1,
    0
),
(
    '00000000-0000-0000-0000-000000000802',
    'electrical-maintenance-service',
    'electrical-maintenance-service',
    'Electrical Maintenance & Servicing',
    'Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Proactive lifecycle maintenance programs designed to prevent unexpected plant downtime. Scope includes transformer oil treatment (BDV & DGA), MV cubicle servicing, ACB trip testing, contact resistance, and thermal imaging diagnostics."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    2,
    0
),
(
    '00000000-0000-0000-0000-000000000803',
    'automation-solutions-services',
    'automation-solutions-services',
    'Automation Solutions & Services',
    'Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Turnkey industrial automation engineering combining PLC programming, SCADA telemetry, centralized process monitoring, Building Automation Systems (BAS), and ISO 50001 energy management architectures."}}]}',
    '/uploads/M2.jpeg',
    '[]',
    'published',
    now(),
    3,
    0
),
(
    '00000000-0000-0000-0000-000000000804',
    'inspection-testing-commissioning',
    'inspection-testing-commissioning',
    'Inspection, Testing & Commissioning',
    'Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Advanced testing and commissioning backed by calibrated Omicron, Megger, and Fluke test sets. We conduct Power System Studies, Arc Flash analysis, Partial Discharge scanning, relay injection testing, and formal FAT/SAT."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    4,
    0
),
(
    '00000000-0000-0000-0000-000000000805',
    'mechanical-services-supplies',
    'mechanical-services-supplies',
    'Mechanical Services & General Supplies',
    'Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Total mechanical engineering support covering conveyor systems, magnetic separators, gearbox & mixer overhauls, boiler HTO maintenance, pneumatic supplies, motor winding insulation recoating, and rotor dynamic balancing."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    5,
    0
);

-- Child Services (Depth 1) - Under Electrical Construction & Installation
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000811',
    '00000000-0000-0000-0000-000000000801',
    'substation-mv-switchgear-installation',
    'electrical-construction-installation/substation-mv-switchgear-installation',
    'Substation & MV Switchgear Installation',
    'Medium voltage metal-clad switchgear, power transformers, oil containment, and civil-electrical integration up to 36kV.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Complete engineering, procurement, and construction for medium voltage substations, including vacuum circuit breakers, protection panels, and transformer placement."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000812',
    '00000000-0000-0000-0000-000000000801',
    'lv-distribution-panels-assembly',
    'electrical-construction-installation/lv-distribution-panels-assembly',
    'LV Panels Assembly (MDP, SDP, ATS & Sync)',
    'Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).',
    '{"blocks":[{"type":"paragraph","data":{"text":"Custom panel design and fabrication using high-purity copper busbars, type-tested enclosure structures, and intelligent circuit breakers."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000813',
    '00000000-0000-0000-0000-000000000801',
    'mv-lv-cable-installation-termination',
    'electrical-construction-installation/mv-lv-cable-installation-termination',
    'MV & LV Cable Installation & Termination',
    'Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified cable jointing and termination specialists using 3M and Raychem kits, followed by VLF / DC Hi-Pot and sheath integrity testing."}}]}',
    '/uploads/products-rittal.jpg',
    '[]',
    'published',
    now(),
    3,
    1
),
(
    '00000000-0000-0000-0000-000000000814',
    '00000000-0000-0000-0000-000000000801',
    'fire-alarm-system-installation',
    'electrical-construction-installation/fire-alarm-system-installation',
    'Fire Alarm System Engineering & Installation',
    'Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Complete fire safety engineering compliant with NFPA 72 & NFPA 2001 standards, including smoke control, audible/visual alarms, and BMS integration."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    4,
    1
);

-- Child Services (Depth 1) - Under Electrical Maintenance & Servicing
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000821',
    '00000000-0000-0000-0000-000000000802',
    'transformer-oil-treatment-dga',
    'electrical-maintenance-service/transformer-oil-treatment-dga',
    'Transformer Oil Treatment, BDV & DGA',
    'On-site oil purification, vacuum degassing, breakdown voltage (BDV) dielectric testing, and Dissolved Gas Analysis (DGA).',
    '{"blocks":[{"type":"paragraph","data":{"text":"High-vacuum oil filtration and regeneration restoring insulation properties, removing moisture, gas, and particulate contamination to extend transformer life."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000822',
    '00000000-0000-0000-0000-000000000802',
    'mv-cubicle-acb-maintenance',
    'electrical-maintenance-service/mv-cubicle-acb-maintenance',
    'MV Cubicle & ACB Maintenance (Trip Testing)',
    'Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Systematic overhaul including contact alignment, lubrication, vacuum bottle integrity tests, breaker timing analysis, and secondary injection testing on Micrologic and digital trip units."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000823',
    '00000000-0000-0000-0000-000000000802',
    'thermography-predictive-maintenance',
    'electrical-maintenance-service/thermography-predictive-maintenance',
    'Infrared Thermography & Predictive Maintenance',
    'Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, overloaded phases, and deteriorating contacts under full load.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified Level II thermographers inspect live electrical distribution boards to detect thermal anomalies before insulation breakdown or catastrophic flashovers occur."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    3,
    1
),
(
    '00000000-0000-0000-0000-000000000824',
    '00000000-0000-0000-0000-000000000802',
    'annual-maintenance-contracts',
    'electrical-maintenance-service/annual-maintenance-contracts',
    'Annual Maintenance Contracts (AMC) & 24/7 SLA',
    'Customized long-term service level agreements providing scheduled plant shutdowns, emergency call-outs, and spare parts management.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive maintenance contracts tailored to manufacturing plants and critical facilities, guaranteeing rapid SLA response times and dedicated engineering support."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    4,
    1
);

-- Child Services (Depth 1) - Under Automation Solutions & Services
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000831',
    '00000000-0000-0000-0000-000000000803',
    'scada-hmi-process-monitoring',
    'automation-solutions-services/scada-hmi-process-monitoring',
    'SCADA Systems, HMI & Centralized Telemetry',
    'Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.',
    '{"blocks":[{"type":"paragraph","data":{"text":"End-to-end SCADA development using xArrow, EcoStruxure, Wonderware, and WinCC platforms for real-time visualization and supervisory control of manufacturing plants."}}]}',
    '/uploads/M2.jpeg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000832',
    '00000000-0000-0000-0000-000000000803',
    'energy-management-iso50001',
    'automation-solutions-services/energy-management-iso50001',
    'Energy Management Systems (EMS & ISO 50001)',
    'Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Power Monitoring Expert (PME) implementation delivering actionable energy insights, cost-center allocation, harmonic tracking, and automated ISO 50001 reporting."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000833',
    '00000000-0000-0000-0000-000000000803',
    'plc-vsd-system-integration',
    'automation-solutions-services/plc-vsd-system-integration',
    'PLC Programming & Variable Speed Drive (VSD) Integration',
    'Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive automation integration covering Modicon, Siemens S7, and Allen-Bradley PLCs paired with variable speed drives for pumps, fans, conveyors, and extruders."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    3,
    1
);

-- Child Services (Depth 1) - Under Inspection, Testing & Commissioning
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000841',
    '00000000-0000-0000-0000-000000000804',
    'power-quality-analysis-study',
    'inspection-testing-commissioning/power-quality-analysis-study',
    'Power Quality Analysis & Harmonics Study',
    'Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, transient detection, and mitigation design.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Detailed electrical audits using Fluke 435-II Class A analyzers to measure IEEE 519 compliance, identify resonance risks, and engineer Active Harmonic Filter solutions."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000842',
    '00000000-0000-0000-0000-000000000804',
    'partial-discharge-pd-scan',
    'inspection-testing-commissioning/partial-discharge-pd-scan',
    'Partial Discharge (PD) Scan & Insulation Diagnostics',
    'Non-invasive TEV (Transient Earth Voltage), acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Early detection of electrical insulation breakdown in MV switchgear, cables, and transformers without requiring system shutdown."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000843',
    '00000000-0000-0000-0000-000000000804',
    'relay-protection-testing-commissioning',
    'inspection-testing-commissioning/relay-protection-testing-commissioning',
    'Protection Relay Testing (Secondary Injection)',
    '3-phase & 6-phase secondary injection testing using Omicron CMC 356/256 sets for overcurrent, earth fault, differential, and distance relays.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive protection coordination verification, timing curves check, and scheme testing compliant with IEC 60255 and IEEE standards."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    3,
    1
);

-- Child Services (Depth 1) - Under Mechanical Services & Supplies
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000851',
    '00000000-0000-0000-0000-000000000805',
    'industrial-mechanical-supplies-services',
    'mechanical-services-supplies/industrial-mechanical-supplies-services',
    'Conveyor Systems, Magnetic Separators & Industrial Supplies',
    'Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, vacuum lifters, and pneumatic parts.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Industrial mechanical equipment supplies and maintenance services ensuring seamless plant material handling and operational throughput."}}]}',
    '/uploads/products-rittal.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000852',
    '00000000-0000-0000-0000-000000000805',
    'motor-generator-servicing-overhaul',
    'mechanical-services-supplies/motor-generator-servicing-overhaul',
    'Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)',
    'Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive motor and generator maintenance including visual inspection, vibration baseline, winding recoating, and dynamic rotor balancing."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
);

COMMIT;


-- ==========================================
-- Migration: 020_rich_product_and_service_descriptions.up.sql
-- ==========================================

-- 020_rich_product_and_service_descriptions.up.sql
-- Rich technical content, official specifications, and high-res image paths for Products & Services

-- 1. UPDATE RITTAL PRODUCTS
UPDATE products SET
  image_url = '/uploads/products-rittal-enclosures.jpg',
  summary = 'Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.',
  specs = '{
    "Series": "VX25, AX, KX, CS Toptec, IT Network Racks",
    "Frame Pitch": "25 mm DIN standard symmetrical grid",
    "Protection Rating": "IP55 / IP66 / NEMA 4X / NEMA 12",
    "Material & Finish": "Sheet steel dipcoat-primed RAL 7035 / Stainless steel AISI 304 & 316L",
    "Certifications": "IEC 62208, UL 508A, DNV-GL, CE, RoHS",
    "Target Applications": "LV Switchboards, MCC Panels, Automation Control, IT Server Racks"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "VX25 Large Baying Enclosure Systems"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "AX Compact Enclosures & KX Small Enclosures"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'enclosures';

UPDATE products SET
  image_url = '/uploads/products-rittal-cooling.jpg',
  summary = 'Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.',
  specs = '{
    "Cooling Capacity": "300 W to 5,500 W (Blue e+ & Blue e+ S)",
    "Energy Savings": "Up to 75% via patented hybrid heat pipe technology",
    "Refrigerant": "Eco-friendly R-513A / R-134a (GWP compliant)",
    "Operating Temp": "-20°C to +60°C ambient",
    "IoT Protocols": "Modbus TCP, SNMP, OPC-UA, Profinet, Ethernet/IP",
    "Mounting Options": "Wall-mounted, roof-mounted, partial or full internal"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Rittal Blue e+ cooling units represent a revolutionary leap in industrial enclosure climate control. Utilizing patented hybrid technology that pairs an active inverter-driven vapor compression circuit with a passive heat pipe, Blue e+ achieves an average of 75% energy reduction compared to conventional cooling units."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Speed-Regulated Hybrid Cooling Technology"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Inverter-driven DC compressors and EC fans dynamically adapt cooling output to match exact thermal loads. This guarantees a steady internal temperature and prevents thermal shock on sensitive PLC, VSD, and microprocessor electronics."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Smart IoT & Industry 4.0 Integration"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Equipped with multi-lingual touch display, NFC wireless diagnostics, and IoT interface for continuous remote condition monitoring, automated fault alerts, and predictive filter mat maintenance."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'climate-control-cooling';

UPDATE products SET
  image_url = '/uploads/products-rittal-power.jpg',
  summary = 'Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.',
  specs = '{
    "Rated Current (In)": "Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)",
    "Short-Circuit Rating (Icw)": "Up to 120 kA (1s withstand)",
    "Internal Separation": "Form 1, Form 2b, Form 3b, Form 4a, Form 4b",
    "Busbar Centers": "60 mm & 185 mm drill-free mounting systems",
    "Standards": "IEC 61439-1, IEC 61439-2, DIN EN 61439"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Ri4Power Modular LV Switchgear"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "RiLine Drill-Free Busbar System"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'power-distribution';

-- 2. UPDATE SCHNEIDER PRODUCTS
UPDATE products SET
  image_url = '/uploads/products-schneider-automation.jpg',
  summary = 'Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.',
  specs = '{
    "PLC Families": "Modicon M580 ePAC, Modicon M340, Modicon M241/M251",
    "Cybersecurity": "Achilles Level 2 & ISA/IEC 62443 certified embedded security",
    "Architecture": "Schneider EcoStruxure Plant & Machine Expert",
    "Communication": "Ethernet/IP, Modbus TCP, Profinet, CANopen, OPC-UA",
    "High Availability": "Hot-standby redundant CPU architectures (M580)"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "As a certified Schneider Electric System Integrator, PT Multi Daya Mitra designs and commissions high-reliability industrial automation architectures utilizing Modicon M340 PAC and Modicon M580 Ethernet Programmable Automation Controllers (ePAC)."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Modicon M580 ePAC & Hot-Standby Redundancy"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Native Ethernet backbone integration directly on the backplane delivers high-speed deterministic control, seamless fieldbus communication, and zero-downtime hot-standby redundancy for critical continuous manufacturing processes."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "EcoStruxure Software & Machine Integration"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Comprehensive engineering using EcoStruxure Control Expert (formerly Unity Pro), Magelis / Harmony HMI panels, and remote telemetry units (RTU) for water, power, chemical, and F&B processing."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'industrial-automation';

UPDATE products SET
  image_url = '/uploads/products-schneider-pme.jpg',
  summary = 'Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.',
  specs = '{
    "Platform": "EcoStruxure Power Monitoring Expert (PME) / Power Operation (PO)",
    "Power Meters": "PowerLogic PM8000, PM5000 series, ION9000, ION7400",
    "Compliance": "IEC 61000-4-30 Class A precision power quality compliance",
    "Analytics": "Harmonic analysis, voltage sag/swell capture, EN 50160 compliance",
    "Reporting": "Automated energy billing, cost allocation, carbon footprint tracking"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "EcoStruxure Power Monitoring Expert (PME) is an enterprise-grade power management software that collects data from smart power meters, circuit breakers, and protection relays across your electrical network to optimize energy efficiency and power reliability."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Power Quality Disturbance Analysis"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Captures microsecond transients, voltage sags, swells, and harmonic distorsions (THD up to 63rd harmonic) using high-precision PowerLogic ION9000 and PM8000 meters to prevent premature equipment failure."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Energy Accounting & Baseline Tracking"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Automated WAGES (Water, Air, Gas, Electricity, Steam) monitoring, sub-billing, ISO 50001 energy compliance dashboards, and automated ESG carbon emissions reporting."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'power-energy-monitoring';

UPDATE products SET
  image_url = '/uploads/products-schneider-distribution.jpg',
  summary = 'MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.',
  specs = '{
    "Circuit Breakers": "MasterPact MTZ (up to 6300A), Compact NSX/NSXm (16-630A)",
    "Trip Units": "MicroLogic X with integrated Class 1 active energy measurement",
    "Enclosure System": "Schneider PrismaSeT G & P type-tested modular switchboards",
    "Connectivity": "Embedded Bluetooth, NFC, Ethernet Modbus TCP communications",
    "Standards": "IEC 60947-2, IEC 61439-1/-2, UL 489"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "MasterPact MTZ with MicroLogic X Control Units"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Prisma Type-Tested Switchboard Architecture"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'electrical-distribution-integration';

UPDATE products SET
  image_url = '/uploads/products-schneider-commissioning.jpg',
  summary = 'Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.',
  specs = '{
    "Testing Fleet": "Omicron CMC 356, Megger S1-568, Fluke 1777, FLIR E76",
    "Scope": "FAT & SAT verification, relay parameterization, breaker trip testing",
    "Certification": "Certified Schneider System Integrator & ESDM Level 6 accredited",
    "Standards": "IEEE 1584 Arc Flash, IEC 60255 Protection Relays, NETA Acceptance"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Our certified engineering team provides comprehensive engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), protection relay parameterization, and energized commissioning support for Schneider Electric automation and power distribution systems."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Protection Relay Parameterization & Primary Injection"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Configuration and testing of Schneider Sepam, Easergy P3, and Easergy P5 protection relays using calibrated Omicron secondary injection test sets to guarantee discrimination and fast arc clearing times."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Energization & SAT Site Handover"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Rigorous pre-commissioning checks, insulation resistance, contact resistance (Ductor), functional interlock verification, and full handover documentation with client operations training."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'engineering-commissioning';

-- 3. UPDATE PRODUCT CATEGORIES & PARTNERS ROOT
UPDATE products SET image_url = '/uploads/brand-rittal.jpg' WHERE slug = 'rittal-distributor';
UPDATE products SET image_url = '/uploads/brand-schneider.jpg' WHERE slug = 'schneider-integrator';
UPDATE products SET image_url = '/uploads/mdm/circuit-breaker.jpg' WHERE slug = 'electrical-distribution';
UPDATE products SET image_url = '/uploads/products-schneider-automation.jpg' WHERE slug = 'automation-control';
UPDATE products SET image_url = '/uploads/products-rittal-enclosures.jpg' WHERE slug = 'enclosure-climate-control';
UPDATE products SET image_url = '/uploads/mdm/power-quality.jpg' WHERE slug = 'power-quality';
UPDATE products SET image_url = '/uploads/brand-bosch.png' WHERE slug = 'fire-alarm-products';
UPDATE products SET image_url = '/uploads/mdm/active-harmonic-filter.jpg' WHERE slug = 'active-harmonic-filters';
UPDATE products SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'addressable-fire-alarm-systems';
UPDATE products SET image_url = '/uploads/mdm/circuit-breaker.jpg' WHERE slug = 'low-voltage-distribution-panels';
UPDATE products SET image_url = '/uploads/mdm/medium-voltage-equipment.jpg' WHERE slug = 'medium-voltage-substation';
UPDATE products SET image_url = '/uploads/xarrow.jpg' WHERE slug = 'scada-xarrow-telemetry';
UPDATE products SET image_url = '/uploads/products-schneider-distribution.jpg' WHERE slug = 'vsd-inverter-panels';

-- 4. UPDATE SERVICES WITH AUTHENTIC MDM PHOTOS
UPDATE services SET
  image_url = '/uploads/mdm/construction-installation.jpg'
WHERE slug = 'electrical-construction-installation';

UPDATE services SET
  image_url = '/uploads/mdm/medium-voltage-equipment.jpg'
WHERE slug = 'substation-mv-switchgear-installation';

UPDATE services SET
  image_url = '/uploads/mdm/circuit-breaker.jpg'
WHERE slug = 'lv-distribution-panels-assembly';

UPDATE services SET
  image_url = '/uploads/mdm/electrical-equipment.jpg'
WHERE slug = 'mv-lv-cable-installation-termination';

UPDATE services SET
  image_url = '/uploads/PM-Fire-Alarm-1.jpg'
WHERE slug = 'fire-alarm-system-installation';

UPDATE services SET
  image_url = '/uploads/mdm/maintenance-contract.jpg'
WHERE slug = 'electrical-maintenance-service';

UPDATE services SET
  image_url = '/uploads/mdm/micrologic-test.jpg'
WHERE slug = 'transformer-oil-treatment-dga';

UPDATE services SET
  image_url = '/uploads/mdm/preventive-maintenance.jpg'
WHERE slug = 'mv-cubicle-acb-maintenance';

UPDATE services SET
  image_url = '/uploads/mdm/infrared-thermograph.jpg'
WHERE slug = 'thermography-predictive-maintenance';

UPDATE services SET
  image_url = '/uploads/mdm/maintenance-contract.jpg'
WHERE slug = 'annual-maintenance-contracts';

UPDATE services SET
  image_url = '/uploads/mdm/industrial-automation.jpg'
WHERE slug = 'automation-solutions-services';

UPDATE services SET
  image_url = '/uploads/xarrow.jpg'
WHERE slug = 'scada-hmi-process-monitoring';

UPDATE services SET
  image_url = '/uploads/PMS-Network_001.jpg'
WHERE slug = 'energy-management-iso50001';

UPDATE services SET
  image_url = '/uploads/products-schneider-automation.jpg'
WHERE slug = 'plc-vsd-system-integration';

UPDATE services SET
  image_url = '/uploads/mdm/testing-measurement.jpg'
WHERE slug = 'inspection-testing-commissioning';

UPDATE services SET
  image_url = '/uploads/mdm/power-quality.jpg'
WHERE slug = 'power-quality-analysis-study';

UPDATE services SET
  image_url = '/uploads/mdm/partial-discharge.jpg'
WHERE slug = 'partial-discharge-pd-scan';

UPDATE services SET
  image_url = '/uploads/mdm/secondary-injector.jpg'
WHERE slug = 'relay-protection-testing-commissioning';

UPDATE services SET
  image_url = '/uploads/mdm/electrical-services.jpg'
WHERE slug = 'mechanical-services-supplies';

UPDATE services SET
  image_url = '/uploads/mdm/construction-installation.jpg'
WHERE slug = 'industrial-mechanical-supplies-services';

UPDATE services SET
  image_url = '/uploads/mdm/electrical-services.jpg'
WHERE slug = 'motor-generator-servicing-overhaul';


-- ==========================================
-- Migration: 021_bilingual_cable_termination_content.up.sql
-- ==========================================

-- 021_bilingual_cable_termination_content.up.sql
-- Update MV & LV Cable Installation & Termination with rich bilingual content (ID & EN)

UPDATE services
SET content = '{
  "bilingual": true,
  "id": {
    "blocks": [
      {
        "type": "heading",
        "data": {
          "level": 3,
          "text": "Distribusi Listrik yang Andal untuk Fasilitas Industri"
        }
      },
      {
        "type": "html",
        "html": "<p>Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses <a href=\"/services/electrical-construction-installation/mv-lv-cable-installation-termination\">instalasi dan terminasi kabel MV & LV</a> yang tepat. Instalasi, routing, terminasi, dan pengujian yang dilakukan secara akurat sangat penting untuk menjaga keselamatan, keandalan, dan performa sistem dalam jangka panjang.</p>"
      }
    ]
  },
  "en": {
    "blocks": [
      {
        "type": "heading",
        "data": {
          "level": 3,
          "text": "Reliable Power Distribution for Industrial Facilities"
        }
      },
      {
        "type": "html",
        "html": "<p>Reliable electrical distribution depends not only on cable quality and equipment, but also on proper <a href=\"/services/electrical-construction-installation/mv-lv-cable-installation-termination\">MV & LV cable installation and termination.</a> Accurate installation, routing, termination, and testing are essential to maintain electrical safety, system reliability, and long-term performance.</p>"
      }
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "data": {
        "text": "Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses instalasi dan terminasi kabel MV & LV yang tepat."
      }
    }
  ]
}'::jsonb
WHERE slug = 'mv-lv-cable-installation-termination';


-- ==========================================
-- Migration: 021_update_sales_phone_811.up.sql
-- ==========================================

-- Updates sales and WhatsApp phone to +62 811-8303-250

UPDATE site_settings
SET
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          COALESCE(content, '{}'::jsonb),
          '{socials}',
          jsonb_build_array(
            jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/',        'label', 'Facebook'),
            jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/',       'label', 'Instagram'),
            jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
            jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628118303250',                      'label', 'WhatsApp Sales')
          )
        ),
        '{salesPhone}', '"+62 811-8303-250"'::jsonb
      ),
      '{whatsappPhone}', '"+62 811-8303-250"'::jsonb
    ),
    '{hotlinePhone}', '"+62 811-8303-250"'::jsonb
  ),
  updated_at = NOW()
WHERE key = 'site';

UPDATE pages
SET
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          COALESCE(content, '{}'::jsonb),
          '{offices}',
          jsonb_build_array(
            jsonb_build_object(
              'name', 'Head Office (Surabaya)',
              'address', 'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
              'phone', '+62 31 592 1256',
              'fax', '+62 31 591 7845',
              'email', 'info@multidayamitra.co.id',
              'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
            ),
            jsonb_build_object(
              'name', 'Engineering Office & Workshop',
              'address', 'Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia',
              'phone', '+62 811-8303-250',
              'email', 'sales@multidayamitra.co.id',
              'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
            )
          )
        ),
        '{salesPhone}', '"+62 811-8303-250"'::jsonb
      ),
      '{whatsappPhone}', '"+62 811-8303-250"'::jsonb
    ),
    '{hotlinePhone}', '"+62 811-8303-250"'::jsonb
  ),
  updated_at = NOW()
WHERE slug = 'contact';


-- ==========================================
-- Migration: 022_bilingual_services_products_seed.up.sql
-- ==========================================

-- 022_bilingual_services_products_seed.up.sql
-- Synchronize Services & Products titles and summaries with bilingual format (EN: ...\nID: ...)

BEGIN;

-- 1. UPDATE SERVICES
UPDATE services SET
  title = E'EN: Electrical Construction & Installation\nID: Konstruksi & Instalasi Elektrikal',
  summary = E'EN: Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.\nID: Solusi terintegrasi instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, pemasangan trafo, dan terminasi kabel.'
WHERE slug = 'electrical-construction-installation';

UPDATE services SET
  title = E'EN: Substation & Transformer Installation\nID: Instalasi Gardu Induk & Transformator Daya',
  summary = E'EN: Turnkey construction of medium voltage (up to 36kV) outdoor/indoor substations, transformer placement, oil filtration, and busduct installation.\nID: Konstruksi gardu induk outdoor/indoor tegangan menengah (hingga 36kV), penempatan trafo, filtrasi minyak, dan instalasi busduct.'
WHERE slug = 'substation-transformer-installation' OR slug = 'substation-mv-switchgear-installation';

UPDATE services SET
  title = E'EN: MV & LV Switchboard Panel Assembly\nID: Perakitan Panel Switchboard MV & LV',
  summary = E'EN: Fabrication and integration of Medium Voltage cubicles, Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), and MCC.\nID: Fabrikasi dan integrasi kubikel tegangan menengah, Panel Distribusi Utama (MDP), Sub-Distribusi (SDP), dan Motor Control Center (MCC).'
WHERE slug = 'mv-lv-switchboard-assembly' OR slug = 'lv-distribution-panels-assembly';

UPDATE services SET
  title = E'EN: MV & LV Cable Installation & Termination\nID: Instalasi & Terminasi Kabel MV & LV',
  summary = E'EN: Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.\nID: Penarikan kabel tersertifikasi, pemasangan tray, terminasi heat/cold shrink, dan pengujian isolasi Hi-Pot.'
WHERE slug = 'cable-pulling-termination' OR slug = 'mv-lv-cable-installation-termination';

UPDATE services SET
  title = E'EN: Grounding & Lightning Protection System\nID: Sistem Pembumian & Proteksi Petir',
  summary = E'EN: Deep well grounding installation, exothermic CAD welding, copper tape routing, and early streamer emission (ESE) lightning protection.\nID: Instalasi pembumian deep well, pengelasan eksotermik CAD, penarikan pita tembaga, dan penangkal petir elektrostatis (ESE).'
WHERE slug = 'grounding-lightning-protection';

UPDATE services SET
  title = E'EN: Busduct & Canalis Trunking Installation\nID: Instalasi Busduct & Trunking Canalis',
  summary = E'EN: High-amperage sandwich busduct feeder erection, tap-off unit installation, and torque-checked jointing for industrial plants.\nID: Pemasangan busduct sandwich ampere tinggi, unit tap-off, dan penyambungan terverifikasi torsi untuk pabrik industri.'
WHERE slug = 'busduct-canalis-installation';

UPDATE services SET
  title = E'EN: Electrical Maintenance & Servicing\nID: Pemeliharaan & Perawatan Sistem Kelistrikan',
  summary = E'EN: Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.\nID: Layanan pemeliharaan preventif, prediktif, dan korektif komprehensif untuk trafo, kubikel MV, papan distribusi, dan circuit breaker.'
WHERE slug = 'electrical-maintenance-service';

UPDATE services SET
  title = E'EN: Transformer Maintenance & Oil Purification\nID: Pemeliharaan Trafo & Pemurnian Minyak',
  summary = E'EN: On-site transformer oil purification, vacuum dehydration, BDV breakdown testing, DGA gas analysis, and silica gel replacement.\nID: Pemurnian minyak trafo on-site, dehidrasi vakum, pengujian tegangan tembus (BDV), analisis gas DGA, dan penggantian silika gel.'
WHERE slug = 'transformer-maintenance-purification' OR slug = 'transformer-oil-treatment-dga';

UPDATE services SET
  title = E'EN: MV Cubicle & Switchgear Servicing\nID: Servis Kubikel & Switchgear Tegangan Menengah',
  summary = E'EN: Mechanism lubrication, contact resistance (Ductor), vacuum bottle integrity, and secondary protection relay testing.\nID: Pelumasan mekanisme, uji resistansi kontak (Ductor), integritas botol vakum, dan pengujian relay proteksi sekunder.'
WHERE slug = 'mv-cubicle-switchgear-servicing' OR slug = 'mv-cubicle-acb-maintenance';

UPDATE services SET
  title = E'EN: Annual Plant Shutdown Maintenance\nID: Pemeliharaan Berkala Shutdown Pabrik Tahunan',
  summary = E'EN: Total electrical system overhaul during planned facility shutdowns: busbar torque checks, insulation resistance, and contact cleaning.\nID: Overhaul total sistem kelistrikan saat shutdown pabrik: pemeriksaan torsi busbar, resistansi isolasi, dan pembersihan kontak.'
WHERE slug = 'annual-shutdown-maintenance' OR slug = 'annual-maintenance-contracts';

UPDATE services SET
  title = E'EN: Low Voltage Switchboard Maintenance\nID: Pemeliharaan Papan Hubung Tegangan Rendah',
  summary = E'EN: ACB/MCCB servicing, cradle mechanism testing, thermal scanning, and digital trip unit secondary injection calibration.\nID: Servis ACB/MCCB, pengujian mekanisme cradle, pemindaian termal, dan kalibrasi injeksi sekunder trip unit digital.'
WHERE slug = 'low-voltage-switchboard-maintenance';

UPDATE services SET
  title = E'EN: Industrial UPS & Battery Bank Maintenance\nID: Pemeliharaan UPS Industri & Bank Baterai',
  summary = E'EN: Impedance testing, conductance measurement, cell equalization, and autonomy discharge runtime testing for critical power UPS.\nID: Uji impedansi baterai, pengukuran konduktansi, ekualisasi sel, dan pengujian runtime debit untuk sistem UPS kritis.'
WHERE slug = 'ups-battery-bank-maintenance';

UPDATE services SET
  title = E'EN: Automation Solutions & Services\nID: Solusi & Layanan Otomasi Industri',
  summary = E'EN: Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.\nID: Otomasi industri, sistem SCADA (xArrow & EcoStruxure), pemrograman PLC, Pemantauan Energi (PME), dan optimasi proses manufaktur.'
WHERE slug = 'automation-solutions-services';

UPDATE services SET
  title = E'EN: SCADA & Industrial Process Automation\nID: SCADA & Otomasi Proses Industri',
  summary = E'EN: High-performance HMI/SCADA design, telemetry, alarm management, historical trending, and batch control integration.\nID: Desain HMI/SCADA performa tinggi, telemetri, manajemen alarm terpusat, tren historis, dan integrasi kontrol batch.'
WHERE slug = 'scada-process-automation' OR slug = 'scada-hmi-process-monitoring';

UPDATE services SET
  title = E'EN: PLC & Distributed Control Systems (DCS)\nID: Pemrograman PLC & Sistem Kontrol Terdistribusi (DCS)',
  summary = E'EN: Architecture design, logic programming, and commissioning for Schneider Modicon, Siemens S7, Rockwell, and Omron.\nID: Desain arsitektur, pemrograman logika kontrol, dan komisioning untuk Schneider Modicon, Siemens S7, Rockwell, dan Omron.'
WHERE slug = 'plc-dcs-programming' OR slug = 'plc-vsd-system-integration';

UPDATE services SET
  title = E'EN: Power Management System (Schneider PME)\nID: Sistem Manajemen Daya Listrik (Schneider PME)',
  summary = E'EN: Real-time energy baseline tracking, power quality event capture, peak demand shaving, and ISO 50001 compliance dashboards.\nID: Pemantauan baseline energi real-time, perekaman event kualitas daya, pemangkasan beban puncak, dan dashboard kepatuhan ISO 50001.'
WHERE slug = 'power-management-system-pme' OR slug = 'energy-management-iso50001';

UPDATE services SET
  title = E'EN: Building Automation & HVAC Control (BAS)\nID: Otomasi Gedung & Kontrol HVAC (BAS)',
  summary = E'EN: Centralized HVAC chiller plant optimization, AHU VAV control, lighting automation, and Modbus/BACnet integration.\nID: Optimasi sistem pendingin chiller HVAC, kontrol AHU VAV, otomasi tata cahaya, dan integrasi protokol Modbus/BACnet.'
WHERE slug = 'building-automation-system-bas';

UPDATE services SET
  title = E'EN: Variable Speed Drive (VFD) Solutions\nID: Solusi Inverter & Variable Speed Drive (VFD)',
  summary = E'EN: Energy-saving variable torque pump/fan control, harmonic mitigation, dynamic braking, and drive panel engineering.\nID: Penghematan energi motor pompa/fan, mitigasi harmonisa, pengereman dinamis, dan perakitan panel inverter VFD.'
WHERE slug = 'variable-speed-drive-vfd-solutions';

UPDATE services SET
  title = E'EN: Inspection, Testing & Commissioning\nID: Inspeksi, Pengujian & Commissioning',
  summary = E'EN: Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.\nID: Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.'
WHERE slug = 'inspection-testing-commissioning';

UPDATE services SET
  title = E'EN: Relay Protection Calibration & Coordination\nID: Kalibrasi Relay Proteksi & Studi Koordinasi',
  summary = E'EN: Secondary injection testing (Omicron CMC), relay tripping curves, overcurrent, earth fault, differential, and distance protection.\nID: Pengujian injeksi sekunder (Omicron CMC), kurva trip relay proteksi arus lebih, gangguan tanah, diferensial, dan jarak.'
WHERE slug = 'relay-protection-calibration' OR slug = 'relay-protection-testing-commissioning';

UPDATE services SET
  title = E'EN: Transformer Oil BDV & DGA Laboratory Testing\nID: Uji Laboratorium BDV & DGA Minyak Trafo',
  summary = E'EN: Dielectric breakdown voltage testing (IEC 60156), Karl Fischer moisture analysis, and Dissolved Gas Analysis (DGA).\nID: Uji tegangan tembus dielektrik (IEC 60156), kadar air Karl Fischer, dan Dissolved Gas Analysis (DGA).'
WHERE slug = 'transformer-oil-bdv-dga-testing';

UPDATE services SET
  title = E'EN: Infrared Thermography Electrical Audit\nID: Audit Termografi Inframerah Sistem Elektrikal',
  summary = E'EN: Calibrated FLIR thermal imaging to locate high-resistance contact joints, loose terminal bolts, and unbalanced line loading.\nID: Pemindaian termal FLIR terkalibrasi untuk mendeteksi kontak beresistansi tinggi, baut longgar, dan ketidakseimbangan beban fasa.'
WHERE slug = 'infrared-thermography-inspection' OR slug = 'thermography-predictive-maintenance';

UPDATE services SET
  title = E'EN: Hi-Pot & Insulation Resistance Diagnostics\nID: Uji Hi-Pot & Diagnostik Resistansi Isolasi',
  summary = E'EN: VLF 0.1Hz AC / DC High-Potential testing up to 80kV, polarization index (PI), and dielectric absorption ratio (DAR).\nID: Pengujian High-Potential VLF 0.1Hz AC / DC hingga 80kV, indeks polarisasi (PI), dan rasio serapan dielektrik (DAR).'
WHERE slug = 'hi-pot-insulation-resistance-test';

UPDATE services SET
  title = E'EN: Breaker Timing & Contact Resistance (Ductor)\nID: Waktu Buka-Tutup Breaker & Resistansi Kontak',
  summary = E'EN: Micro-ohm contact resistance measurement, breaker opening/closing speed, pole synchronization, and auxiliary contact check.\nID: Pengukuran resistansi kontak mikro-ohm, kecepatan buka/tutup kontak breaker, sinkronisasi fasa, dan kontak bantu.'
WHERE slug = 'breaker-timing-contact-resistance';

UPDATE services SET
  title = E'EN: Mechanical Services & Supplies\nID: Layanan Mekanikal & Pengadaan Industri',
  summary = E'EN: Industrial piping, chiller plant installation, pump overhaul, dynamic balancing, and air handling equipment.\nID: Pemipaan industri, instalasi chiller, overhaul pompa, balancing dinamis, dan perlengkapan penanganan udara pabrik.'
WHERE slug = 'mechanical-services-supplies';

UPDATE services SET
  title = E'EN: Chiller Plant & HVAC Mechanical Piping\nID: Sistem Chiller Pabrik & Pemipaan Mekanikal HVAC',
  summary = E'EN: Chilled water headers, condenser loops, pump skids, balancing valves, and polyurethane insulation cladding.\nID: Header air dingin, loop kondensor, skid pompa, katup penyeimbang, dan insulasi poliuretan berkualitas tinggi.'
WHERE slug = 'chiller-hvac-mechanical-piping';

UPDATE services SET
  title = E'EN: Industrial Pump & Valve Overhaul\nID: Overhaul Pompa & Katup Industri',
  summary = E'EN: Impeller balancing, mechanical seal replacement, laser shaft alignment, and hydro-static pressure testing.\nID: Balancing impeller, penggantian mechanical seal, penyelarasan poros laser presisi, dan uji tekanan hidrostatis.'
WHERE slug = 'pump-valve-overhaul-alignment';

UPDATE services SET
  title = E'EN: Compressed Air Ring Main Installation\nID: Instalasi Jaringan Pemipaan Udara Bertekanan',
  summary = E'EN: Aluminum / stainless steel compressed air distribution loops, receiver tank placement, air dryers, and filtration manifolds.\nID: Distribusi udara bertekanan aluminium / stainless steel, tangki penampung, pengering udara, dan manifold filtrasi.'
WHERE slug = 'air-compressor-piping-installation';

UPDATE services SET
  title = E'EN: Fire Protection Sprinkler & Hydrant System\nID: Sistem Sprinkler Proteksi Kebakaran & Hidran',
  summary = E'EN: Fire pump room installation (NFPA 20), wet pipe sprinkler grids, outdoor pillar hydrants, and Siamese connections.\nID: Instalasi ruang pompa pemadam (NFPA 20), jaringan sprinkler pipa basah, hidran pilar outdoor, dan sambungan Siamese.'
WHERE slug = 'fire-protection-sprinkler-hydrant' OR slug = 'fire-alarm-system-installation';

UPDATE services SET
  title = E'EN: Industrial Ventilation & Exhaust Ductwork\nID: Ventilasi Industri & Saluran Pembuangan Udara',
  summary = E'EN: Centrifugal exhaust blowers, spiral galvanized ducting, kitchen hood hoods, and hazardous fume extraction.\nID: Blower pembuangan sentrifugal, ducting spiral galvanis, hood industri, dan ekstraksi asap berbahaya.'
WHERE slug = 'exhaust-ventilation-ductwork';

-- 2. UPDATE PRODUCTS
UPDATE products SET
  title = E'EN: Rittal Authorized Distributor\nID: Distributor Resmi Rittal',
  summary = E'EN: Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, power distribution, and IT infrastructure systems.\nID: Distributor resmi untuk sistem enclosure industri Rittal, climate control & pendingin, distribusi daya, dan infrastruktur IT.'
WHERE slug = 'rittal-distributor';

UPDATE products SET
  title = E'EN: Rittal Enclosure Systems (VX25, AX, KX)\nID: Sistem Enclosure Rittal (VX25, AX, KX)',
  summary = E'EN: Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.\nID: Sistem enclosure besar baying resmi Rittal (VX25), enclosure kompak (AX), kotak terminal kecil (KX), dan rak server IT outdoor.'
WHERE slug = 'enclosures';

UPDATE products SET
  title = E'EN: Rittal Climate Control & Cooling (Blue e+)\nID: Sistem Pendingin & Climate Control Rittal (Blue e+)',
  summary = E'EN: Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.\nID: Unit pendingin hibrida inovatif, thermoelectric cooler, dan penukar panas air-ke-udara hemat energi hingga 75% dengan pemantauan IoT digital.'
WHERE slug = 'climate-control-cooling';

UPDATE products SET
  title = E'EN: Rittal Power Distribution (Ri4Power & RiLine)\nID: Sistem Distribusi Daya Rittal (Ri4Power & RiLine)',
  summary = E'EN: Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.\nID: Sistem distribusi daya busbar dan switchgear tegangan rendah type-tested hingga 6300A sesuai standar IEC 61439-1/-2.'
WHERE slug = 'power-distribution';

UPDATE products SET
  title = E'EN: Schneider Electric System Integrator\nID: System Integrator Resmi Schneider Electric',
  summary = E'EN: Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.\nID: System Integrator dan Solutions Partner bersertifikat penyedia otomasi industri, pemantauan energi, dan distribusi elektrikal.'
WHERE slug = 'schneider-integrator';

UPDATE products SET
  title = E'EN: Schneider Industrial Automation (Modicon & EcoStruxure)\nID: Otomasi Industri Schneider (Modicon & EcoStruxure)',
  summary = E'EN: Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.\nID: Sistem otomasi PLC/PAC lengkap beranggotakan Schneider Modicon M340, M580 ePAC, Magelis HMI, dan arsitektur EcoStruxure Plant.'
WHERE slug = 'industrial-automation';

UPDATE products SET
  title = E'EN: Power & Energy Monitoring (PME & PowerLogic)\nID: Pemantauan Daya & Energi (PME & PowerLogic)',
  summary = E'EN: Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.\nID: Power meter digital Schneider PowerLogic, ION meter, dan perangkat lunak EcoStruxure Power Monitoring Expert (PME).'
WHERE slug = 'power-energy-monitoring';

UPDATE products SET
  title = E'EN: Electrical Distribution Integration (MasterPact & Prisma)\nID: Integrasi Distribusi Elektrikal (MasterPact & Prisma)',
  summary = E'EN: MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.\nID: Circuit breaker udara MasterPact MTZ/NW, breaker cetak Compact NSX, dan integrasi switchboard type-tested Prisma.'
WHERE slug = 'electrical-distribution-integration';

UPDATE products SET
  title = E'EN: Schneider Engineering, FAT/SAT & Commissioning Support\nID: Rekayasa Schneider, Dukungan FAT/SAT & Commissioning',
  summary = E'EN: Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.\nID: Factory acceptance testing (FAT), site acceptance testing (SAT), koordinasi proteksi relay, dan commissioning bertegangan.'
WHERE slug = 'engineering-commissioning';

UPDATE products SET
  title = E'EN: Electrical Distribution\nID: Peralatan Distribusi Listrik',
  summary = E'EN: Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.\nID: Peralatan distribusi kelistrikan tegangan menengah & rendah, panel switchboard, transformator, dan sistem proteksi daya.'
WHERE slug = 'electrical-distribution';

UPDATE products SET
  title = E'EN: Automation & Control\nID: Kontrol & Otomasi Industri',
  summary = E'EN: Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.\nID: Otomasi industri, sistem PLC, visualisasi proses SCADA/HMI, dan penggerak motor (inverter/VSD).'
WHERE slug = 'automation-control';

UPDATE products SET
  title = E'EN: Enclosure & Climate Control\nID: Enclosure & Manajemen Suhu Industri',
  summary = E'EN: Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.\nID: Enclosure industri, rak server, climate control, dan sistem pendingin untuk lingkungan manufaktur yang menuntut ketahanan tinggi.'
WHERE slug = 'enclosure-climate-control';

UPDATE products SET
  title = E'EN: Power Quality\nID: Solusi Kualitas Daya Listrik',
  summary = E'EN: Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.\nID: Filter harmonisa aktif, perbaikan faktor daya, kapasitor bank, dan penganalisis kualitas daya.'
WHERE slug = 'power-quality';

COMMIT;


-- ==========================================
-- Migration: 023_bilingual_news_seed.up.sql
-- ==========================================

-- 023_bilingual_news_seed.up.sql
-- Synchronize News titles, categories, excerpts, and bodies with complete 100% matching bilingual translations (ID & EN)

BEGIN;

-- 1. Synchronize News Categories to Bilingual
UPDATE news_categories SET name = E'EN: Product & Technology\nID: Produk & Teknologi' WHERE slug = 'product-technology' OR slug = 'products' OR name ILIKE '%Product%';
UPDATE news_categories SET name = E'EN: Engineering Services\nID: Layanan Teknik Kelistrikan' WHERE slug = 'service' OR slug = 'services' OR name ILIKE '%Service%';
UPDATE news_categories SET name = E'EN: Company News\nID: Berita Perusahaan' WHERE slug = 'company' OR slug = 'company-news' OR name ILIKE '%Company%';
UPDATE news_categories SET name = E'EN: Engineering Insights\nID: Wawasan Teknik & Analisis' WHERE slug = 'insight' OR slug = 'insights' OR name ILIKE '%Insight%';
UPDATE news_categories SET name = E'EN: Industrial Projects\nID: Proyek Industri' WHERE slug = 'project' OR slug = 'projects' OR name ILIKE '%Project%';

-- 2. Synchronize All 10 News Articles to 100% Matching Bilingual Content

-- ARTICLE: mv-lv-cable-installation-termination
UPDATE news SET
  title = E'EN: MV & LV Electrical Cabling for Reliable Industrial Power Distribution
ID: Kabel Listrik MV & LV untuk Distribusi Daya Industri yang Andal',
  excerpt = E'EN: Reliable MV & LV cable installation, termination, jointing, testing, and commissioning services to support safe and efficient power distribution in industrial facilities.
ID: Layanan instalasi, terminasi, jointing, pengujian, dan commissioning kabel MV & LV yang andal untuk mendukung distribusi daya yang aman dan efisien di fasilitas industri.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Distribusi Listrik yang Andal untuk Fasilitas Industri</h2>\n<p>Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses <strong>instalasi dan terminasi kabel MV &amp; LV</strong> yang tepat. Instalasi, routing, terminasi, dan pengujian yang dilakukan secara akurat sangat penting untuk menjaga keselamatan, keandalan, dan performa sistem dalam jangka panjang.</p>\n<h2>Apa Itu Instalasi &amp; Terminasi Kabel MV &amp; LV?</h2>\n<p>Instalasi kabel MV (Medium Voltage) dan LV (Low Voltage) mencakup proses penarikan, routing, pengamanan, dan penyambungan kabel pada fasilitas industri. Terminasi kabel menghubungkan ujung kabel dengan peralatan seperti <strong>transformer, switchgear, dan distribution panel</strong>.</p>\n<p>Terminasi yang tepat membantu menjaga kontinuitas listrik dan integritas isolasi, sekaligus mengurangi risiko overheating, kegagalan koneksi, dan gangguan kelistrikan.</p>\n<h2>Layanan Instalasi Kabel MV &amp; LV</h2>\n<ul>\n  <li><p><strong>Instalasi Kabel MV &amp; LV</strong> — Pemasangan, routing, dressing, dan pengamanan kabel sesuai kebutuhan proyek.</p></li>\n  <li><p><strong>Cable Termination</strong> — Pemasangan termination kit (heat shrink / cold shrink) dan koneksi ke transformer, switchgear, dan distribution panel.</p></li>\n  <li><p><strong>Cable Jointing</strong> — Penyambungan kabel dengan memperhatikan kontinuitas listrik dan integritas isolasi.</p></li>\n  <li><p><strong>Cable Testing</strong> — Pengujian kondisi isolasi kabel, uji Hi-Pot, dan pengujian kualitas instalasi sebelum energizing.</p></li>\n  <li><p><strong>Testing &amp; Commissioning</strong> — Verifikasi sistem menyeluruh untuk memastikan kesiapan operasi yang aman dan andal.</p></li>\n</ul>\n<h2>Mendukung Keandalan Sistem Kelistrikan Industri</h2>\n<p>Instalasi dan terminasi kabel yang tepat merupakan bagian penting dalam mendukung distribusi listrik yang aman dan andal. PT Multi Daya Mitra mengintegrasikan kemampuan <strong>engineering, instalasi, testing, dan commissioning</strong> untuk mendukung proyek kelistrikan mulai dari persiapan instalasi hingga energizing sistem.</p>\n<h3>Membutuhkan Dukungan Instalasi Kabel MV &amp; LV?</h3>\n<p>Konsultasikan kebutuhan instalasi kelistrikan Anda bersama tim engineering MDM untuk mendapatkan solusi instalasi kabel yang andal dan sesuai kebutuhan fasilitas industri.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Reliable Electrical Distribution for Industrial Facilities</h2>\n<p>The reliability of an electrical distribution system depends not only on the quality of cables and equipment, but also on proper <strong>MV &amp; LV cable installation and termination</strong>. Accurate installation, routing, termination, and testing are essential to maintain electrical safety, system reliability, and long-term performance.</p>\n<h2>What Is MV &amp; LV Cable Installation &amp; Termination?</h2>\n<p>Medium Voltage (MV) and Low Voltage (LV) cable installation covers cable pulling, tray erection, routing, dressing, and securing across industrial facilities. Cable termination connects cable ends to electrical equipment such as <strong>power transformers, switchgear, and distribution panels</strong>.</p>\n<p>Proper termination helps maintain electrical continuity and insulation integrity while reducing the risk of overheating, connection failure, and electrical faults.</p>\n<h2>Our MV &amp; LV Cabling Services</h2>\n<ul>\n  <li><p><strong>MV &amp; LV Cable Installation</strong> — Cable laying, tray erection, routing, dressing, and securing according to project technical requirements.</p></li>\n  <li><p><strong>Cable Termination</strong> — Installation of certified heat-shrink and cold-shrink termination kits and connections to transformers, switchgear, and panels.</p></li>\n  <li><p><strong>Cable Jointing</strong> — High-integrity cable joints maintaining conductor electrical continuity and insulation strength.</p></li>\n  <li><p><strong>Cable Testing</strong> — Insulation resistance measurement, VLF / DC Hi-Pot testing, and outer sheath integrity verification prior to energization.</p></li>\n  <li><p><strong>Testing &amp; Commissioning</strong> — End-to-end system verification to ensure safe and reliable energization.</p></li>\n</ul>\n<h2>Supporting Reliable Industrial Electrical Systems</h2>\n<p>Proper cable installation and termination are essential to support safe and reliable power distribution. PT Multi Daya Mitra combines <strong>engineering, installation, testing, and commissioning</strong> capabilities to support industrial electrical projects from preparation through system energization.</p>\n<h3>Need MV &amp; LV Cable Installation Support?</h3>\n<p>Discuss your electrical installation requirements with the MDM engineering team to develop a reliable and properly executed cable installation solution.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Distribusi Listrik yang Andal untuk Fasilitas Industri</h2>\n<p>Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses <strong>instalasi dan terminasi kabel MV &amp; LV</strong> yang tepat. Instalasi, routing, terminasi, dan pengujian yang dilakukan secara akurat sangat penting untuk menjaga keselamatan, keandalan, dan performa sistem dalam jangka panjang.</p>\n<h2>Apa Itu Instalasi &amp; Terminasi Kabel MV &amp; LV?</h2>\n<p>Instalasi kabel MV (Medium Voltage) dan LV (Low Voltage) mencakup proses penarikan, routing, pengamanan, dan penyambungan kabel pada fasilitas industri. Terminasi kabel menghubungkan ujung kabel dengan peralatan seperti <strong>transformer, switchgear, dan distribution panel</strong>.</p>\n<p>Terminasi yang tepat membantu menjaga kontinuitas listrik dan integritas isolasi, sekaligus mengurangi risiko overheating, kegagalan koneksi, dan gangguan kelistrikan.</p>\n<h2>Layanan Instalasi Kabel MV &amp; LV</h2>\n<ul>\n  <li><p><strong>Instalasi Kabel MV &amp; LV</strong> — Pemasangan, routing, dressing, dan pengamanan kabel sesuai kebutuhan proyek.</p></li>\n  <li><p><strong>Cable Termination</strong> — Pemasangan termination kit (heat shrink / cold shrink) dan koneksi ke transformer, switchgear, dan distribution panel.</p></li>\n  <li><p><strong>Cable Jointing</strong> — Penyambungan kabel dengan memperhatikan kontinuitas listrik dan integritas isolasi.</p></li>\n  <li><p><strong>Cable Testing</strong> — Pengujian kondisi isolasi kabel, uji Hi-Pot, dan pengujian kualitas instalasi sebelum energizing.</p></li>\n  <li><p><strong>Testing &amp; Commissioning</strong> — Verifikasi sistem menyeluruh untuk memastikan kesiapan operasi yang aman dan andal.</p></li>\n</ul>\n<h2>Mendukung Keandalan Sistem Kelistrikan Industri</h2>\n<p>Instalasi dan terminasi kabel yang tepat merupakan bagian penting dalam mendukung distribusi listrik yang aman dan andal. PT Multi Daya Mitra mengintegrasikan kemampuan <strong>engineering, instalasi, testing, dan commissioning</strong> untuk mendukung proyek kelistrikan mulai dari persiapan instalasi hingga energizing sistem.</p>\n<h3>Membutuhkan Dukungan Instalasi Kabel MV &amp; LV?</h3>\n<p>Konsultasikan kebutuhan instalasi kelistrikan Anda bersama tim engineering MDM untuk mendapatkan solusi instalasi kabel yang andal dan sesuai kebutuhan fasilitas industri.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'mv-lv-cable-installation-termination';

-- ARTICLE: rittal-authorized-distributor-indonesia
UPDATE news SET
  title = E'EN: PT Multi Daya Mitra: Official Rittal Authorized Distributor in Indonesia
ID: PT Multi Daya Mitra: Distributor Resmi Rittal di Indonesia',
  excerpt = E'EN: Multidaya Mitra is the Official Rittal Authorized Distributor in Indonesia, offering industrial enclosures, climate control & cooling, and power distribution systems.
ID: Multidaya Mitra adalah Distributor Resmi Rittal di Indonesia, menyediakan enclosure industri, climate control & sistem pendingin, serta sistem distribusi daya.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Solusi Lengkap untuk Kebutuhan Panel Industri Anda</h2>\n<p>Membangun sistem elektrikal dan panel industri yang andal membutuhkan lebih dari sekadar satu komponen. Diperlukan <strong>enclosure yang kokoh</strong> untuk melindungi peralatan listrik, <strong>sistem pendingin (climate control)</strong> yang menjaga temperatur operasional tetap stabil, serta <strong>sistem distribusi daya</strong> yang aman dan efisien. Ketiga elemen ini saling terhubung erat — kegagalan pada salah satunya dapat mengorbankan keandalan seluruh sistem dan memicu downtime produksi yang merugikan.</p>\n<p><strong>PT Multi Daya Mitra</strong> adalah <a href=\"/products/rittal-distributor\"><strong>Distributor Resmi Rittal (Authorized Distributor)</strong></a> di Indonesia, yang menyediakan solusi terpadu untuk ketiga kebutuhan tersebut melalui satu mitra terpercaya dan berpengalaman.</p>\n<h3>Mengapa Memilih Distributor Resmi?</h3>\n<p>Bekerja sama dengan reseller tidak resmi membawa risiko nyata — produk tiruan, ketidaksesuaian spesifikasi teknis, serta ketiadaan dukungan teknis purnajual saat terjadi kendala. Sebagai Distributor Resmi, PT Multi Daya Mitra menjamin setiap produk Rittal yang disuplai:</p>\n<ul>\n  <li><p>Terjamin 100% orisinal dan baru</p></li>\n  <li><p>Didukung oleh tim engineering berpengalaman yang memahami spesifikasi dan aplikasi produk</p></li>\n  <li><p>Ketersediaan stok siap kirim (ready stock) dan pengiriman lebih cepat</p></li>\n  <li><p>Harga kompetitif langsung dari jalur distribusi resmi</p></li>\n  <li><p>Cakupan garansi resmi dan layanan purnajual yang jelas</p></li>\n</ul>\n<h3>Portofolio Produk Rittal yang Kami Distribusikan</h3>\n<p><strong>1. Enclosure Industri (Industrial Enclosures)</strong></p>\n<p>Rittal menyediakan ragam <a href=\"/products/rittal-distributor/enclosures\">enclosure industri</a> — mulai dari tipe wall-mounted, free-standing, hingga sistem modular untuk aplikasi panel skala besar. Setiap enclosure dirancang dengan tingkat proteksi tinggi (IP rating) untuk melindungi komponen listrik dari debu, kelembapan, dan zat korosif, sehingga sangat ideal untuk lingkungan industri berat.</p>\n<p>Keunggulan utamanya meliputi konstruksi kokoh tahan lama, fleksibilitas ukuran dan modularitas, proteksi IP tinggi, serta kompatibilitas penuh dengan aksesoris Rittal lainnya.</p>\n<p><strong>2. Climate Control &amp; Sistem Pendingin</strong></p>\n<p>Temperatur operasional yang tidak terkontrol merupakan salah satu penyebab utama kerusakan dini komponen elektronik di dalam panel. Untuk itu, <a href=\"/products/rittal-distributor/climate-control-cooling\"><strong>Rittal menyediakan solusi climate control</strong></a> — meliputi unit pendingin (cooling unit), chiller, dan sistem ventilasi — yang dirancang untuk menjaga suhu panel dan ruang server tetap stabil bahkan dalam kondisi beban kerja tinggi.</p>\n<p><strong>3. Sistem Distribusi Daya (Power Distribution Systems)</strong></p>\n<p>Melalui sistem <a href=\"/products/rittal-distributor/power-distribution\"><strong>Ri4Power</strong></a> — switchgear tegangan rendah yang memenuhi standar internasional <strong>IEC 61439</strong> — dan <strong>RiLine</strong>, sistem busbar berdaya efisiensi tinggi, Rittal menghadirkan distribusi listrik yang aman, andal, dan mudah dikembangkan di masa depan.</p>\n<h3>Mulai Proyek Anda Bersama Distributor Resmi Rittal</h3>\n<p>Hubungi tim PT Multi Daya Mitra hari ini untuk konsultasi kebutuhan enclosure, climate control, dan sistem distribusi daya Rittal dengan penawaran terbaik langsung dari distributor resmi di Indonesia.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>A Complete Solution for Your Industrial Panel Needs</h2>\n<p>Building a reliable <a href=\"/products/rittal-distributor\">industrial electrical</a> and panel system requires more than a single component. It takes a <strong>rugged enclosure</strong> to protect electrical equipment, a <strong>cooling system</strong> that keeps operating temperatures stable, and a <strong>power distribution system</strong> that is both safe and efficient. These three elements are closely interconnected — a failure in any one of them can compromise the reliability of the entire system, and even lead to costly production downtime.</p>\n<p><strong>PT Multi Daya Mitra</strong> is the <a href=\"/products/rittal-distributor\"><strong>Official Rittal Authorized Distributor</strong></a> in Indonesia, providing a complete solution for all three needs through a single, trusted, and experienced partner.</p>\n<h3>Why Choose an Authorized Distributor?</h3>\n<p>Working with an unauthorized reseller carries real risks — counterfeit products, mismatched specifications, and little to no technical support when it is needed most. As an Authorized Distributor, PT Multi Daya Mitra ensures that every Rittal product supplied is:</p>\n<ul>\n  <li><p>Guaranteed 100% genuine</p></li>\n  <li><p>Backed by an experienced technical team that understands product specifications and applications</p></li>\n  <li><p>Available with ready stock and faster delivery</p></li>\n  <li><p>Offered at competitive pricing through the official distribution channel</p></li>\n  <li><p>Covered by clear warranty terms and after-sales service</p></li>\n</ul>\n<h3>Rittal Product Portfolio We Distribute</h3>\n<p><strong>1. Industrial Enclosures</strong></p>\n<p>Rittal offers a wide range of <a href=\"/products/rittal-distributor/enclosures\">industrial enclosures</a> — from wall-mounted and free-standing types to modular systems built for large-scale panel applications. Each enclosure is engineered with high protection ratings (IP ratings) to shield electrical components from dust, moisture, and other environmental hazards, making them suitable for demanding industrial field conditions.</p>\n<p><strong>2. Climate Control &amp; Cooling</strong></p>\n<p>Uncontrolled operating temperature is one of the leading causes of premature electrical component failure inside a panel. To address this, <a href=\"/products/rittal-distributor/climate-control-cooling\"><strong>Rittal provides climate control solutions</strong></a> — including cooling units, chillers, and ventilation systems — engineered to keep panel and server room temperatures stable under high-load conditions.</p>\n<p><strong>3. Power Distribution Systems</strong></p>\n<p>Through the <a href=\"/products/rittal-distributor/power-distribution\"><strong>Ri4Power</strong></a> system — a low-voltage switchgear solution designed to meet the international <strong>IEC 61439</strong> standard — and <strong>RiLine</strong>, a high-efficiency busbar system, Rittal delivers power distribution solutions that are safe, reliable, and scalable.</p>\n<h3>Start Your Project with a Rittal Authorized Distributor</h3>\n<p>Whether you need industrial enclosures, climate control systems, power distribution systems, or all three combined in a single project, PT Multi Daya Mitra is ready to be your technical partner.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Solusi Lengkap untuk Kebutuhan Panel Industri Anda</h2>\n<p>Membangun sistem elektrikal dan panel industri yang andal membutuhkan lebih dari sekadar satu komponen. Diperlukan <strong>enclosure yang kokoh</strong> untuk melindungi peralatan listrik, <strong>sistem pendingin (climate control)</strong> yang menjaga temperatur operasional tetap stabil, serta <strong>sistem distribusi daya</strong> yang aman dan efisien. Ketiga elemen ini saling terhubung erat — kegagalan pada salah satunya dapat mengorbankan keandalan seluruh sistem dan memicu downtime produksi yang merugikan.</p>\n<p><strong>PT Multi Daya Mitra</strong> adalah <a href=\"/products/rittal-distributor\"><strong>Distributor Resmi Rittal (Authorized Distributor)</strong></a> di Indonesia, yang menyediakan solusi terpadu untuk ketiga kebutuhan tersebut melalui satu mitra terpercaya dan berpengalaman.</p>\n<h3>Mengapa Memilih Distributor Resmi?</h3>\n<p>Bekerja sama dengan reseller tidak resmi membawa risiko nyata — produk tiruan, ketidaksesuaian spesifikasi teknis, serta ketiadaan dukungan teknis purnajual saat terjadi kendala. Sebagai Distributor Resmi, PT Multi Daya Mitra menjamin setiap produk Rittal yang disuplai:</p>\n<ul>\n  <li><p>Terjamin 100% orisinal dan baru</p></li>\n  <li><p>Didukung oleh tim engineering berpengalaman yang memahami spesifikasi dan aplikasi produk</p></li>\n  <li><p>Ketersediaan stok siap kirim (ready stock) dan pengiriman lebih cepat</p></li>\n  <li><p>Harga kompetitif langsung dari jalur distribusi resmi</p></li>\n  <li><p>Cakupan garansi resmi dan layanan purnajual yang jelas</p></li>\n</ul>\n<h3>Portofolio Produk Rittal yang Kami Distribusikan</h3>\n<p><strong>1. Enclosure Industri (Industrial Enclosures)</strong></p>\n<p>Rittal menyediakan ragam <a href=\"/products/rittal-distributor/enclosures\">enclosure industri</a> — mulai dari tipe wall-mounted, free-standing, hingga sistem modular untuk aplikasi panel skala besar. Setiap enclosure dirancang dengan tingkat proteksi tinggi (IP rating) untuk melindungi komponen listrik dari debu, kelembapan, dan zat korosif, sehingga sangat ideal untuk lingkungan industri berat.</p>\n<p>Keunggulan utamanya meliputi konstruksi kokoh tahan lama, fleksibilitas ukuran dan modularitas, proteksi IP tinggi, serta kompatibilitas penuh dengan aksesoris Rittal lainnya.</p>\n<p><strong>2. Climate Control &amp; Sistem Pendingin</strong></p>\n<p>Temperatur operasional yang tidak terkontrol merupakan salah satu penyebab utama kerusakan dini komponen elektronik di dalam panel. Untuk itu, <a href=\"/products/rittal-distributor/climate-control-cooling\"><strong>Rittal menyediakan solusi climate control</strong></a> — meliputi unit pendingin (cooling unit), chiller, dan sistem ventilasi — yang dirancang untuk menjaga suhu panel dan ruang server tetap stabil bahkan dalam kondisi beban kerja tinggi.</p>\n<p><strong>3. Sistem Distribusi Daya (Power Distribution Systems)</strong></p>\n<p>Melalui sistem <a href=\"/products/rittal-distributor/power-distribution\"><strong>Ri4Power</strong></a> — switchgear tegangan rendah yang memenuhi standar internasional <strong>IEC 61439</strong> — dan <strong>RiLine</strong>, sistem busbar berdaya efisiensi tinggi, Rittal menghadirkan distribusi listrik yang aman, andal, dan mudah dikembangkan di masa depan.</p>\n<h3>Mulai Proyek Anda Bersama Distributor Resmi Rittal</h3>\n<p>Hubungi tim PT Multi Daya Mitra hari ini untuk konsultasi kebutuhan enclosure, climate control, dan sistem distribusi daya Rittal dengan penawaran terbaik langsung dari distributor resmi di Indonesia.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'rittal-authorized-distributor-indonesia';

-- ARTICLE: industrial-enclosure-climate-control
UPDATE news SET
  title = E'EN: Protecting Industrial Equipment with the Right Enclosure & Climate Control
ID: Melindungi Peralatan Industri dengan Enclosure & Kontrol Iklim yang Tepat',
  excerpt = E'EN: Electrical and automation equipment in industrial settings faces constant exposure to dust, heat, and humidity. Discover how industrial enclosures and climate control systems help protect your equipment and maintain operational reliability in demanding manufacturing environments.
ID: Peralatan elektrikal dan otomasi di lingkungan industri terus terpapar debu, panas, dan kelembapan. Temukan bagaimana enclosure industri dan sistem kontrol iklim melindungi peralatan Anda serta menjaga keandalan operasional di fasilitas manufaktur.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Melindungi Peralatan Industri dengan Enclosure &amp; Kontrol Iklim yang Tepat</h2>\n<p>Di lingkungan industri, peralatan listrik dan sistem otomasi harus beroperasi dalam kondisi lingkungan yang menantang — paparan debu, suhu tinggi, kelembapan, dan fluktuasi cuaca. Tanpa perlindungan yang memadai, kondisi ini dapat menurunkan performa peralatan dan memperpendek masa pakai operasionalnya. Di sinilah <a href=\"/products/enclosure-climate-control\"><strong>enclosure industri</strong></a> dan <strong>sistem climate control</strong> memegang peranan krusial: menjaga peralatan tetap terlindungi dan beroperasi pada kondisi optimal.</p>\n<h3>Apa Itu Enclosure Industri &amp; Climate Control?</h3>\n<p><strong>Enclosure industri</strong> berfungsi sebagai pelindung fisik bagi komponen kritis seperti panel listrik, sistem PLC, inverter, dan perangkat kontrol dari ancaman fisik maupun lingkungan sekitar. Sementara itu, <strong>climate control</strong> bertugas mengatur sirkulasi, temperatur, dan kelembapan di dalam enclosure agar peralatan elektronik tidak mengalami panas berlebih (overheating).</p>\n<h3>Mengapa Climate Control Begitu Penting?</h3>\n<p>Suhu yang terlalu tinggi di dalam boks panel dapat mempercepat degradasi komponen elektronik, sedangkan debu dan uap air meningkatkan risiko korosi serta korsleting listrik. Dengan sistem pendingin panel yang tepat, keandalan peralatan (equipment reliability) dapat terjaga secara maksimal dan risiko <strong>downtime produksi</strong> dapat ditekan secara signifikan.</p>\n<p>Setiap area produksi memiliki karakteristik lingkungan yang berbeda. Pemilihan jenis enclosure dan unit pendingin harus disesuaikan dengan kapasitas termal komponen, tingkat proteksi IP, serta kondisi spesifik pabrik Anda.</p>\n<p><strong>PT Multi Daya Mitra (MDM)</strong> menyediakan solusi lengkap enclosure industri, rak server, climate control, dan sistem pendingin panel berkualitas tinggi. Konsultasikan kebutuhan proteksi panel industri Anda bersama tim engineering MDM.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Protecting Industrial Equipment with the Right Enclosure &amp; Climate Control</h2>\n<p>In industrial environments, electrical and automation equipment must operate under demanding conditions — dust, high heat, humidity, and fluctuating temperatures. Without adequate protection, these conditions can degrade equipment performance and shorten its operational lifespan. This is where <a href=\"/products/enclosure-climate-control\"><strong>industrial enclosures</strong></a> and <strong>climate control</strong> play a critical role: keeping equipment protected and running at its best.</p>\n<h3>What Are Industrial Enclosures &amp; Climate Control?</h3>\n<p>An <strong>industrial enclosure</strong> serves as a physical safeguard for critical components such as electrical distribution panels, PLC automation systems, and variable frequency drives, protecting them from environmental hazards. Climate control, meanwhile, regulates the temperature and humidity inside the enclosure so equipment continues operating under suitable conditions.</p>\n<h3>Why Is Climate Control Important?</h3>\n<p>Excessively high temperatures inside an enclosure accelerate the degradation of electronic components, while dust and humidity increase the risk of short circuits and corrosion. With the right cooling and climate control systems in place, internal conditions remain controlled — helping maintain <strong>equipment reliability</strong> and reduce the risk of costly production downtime.</p>\n<p>Every production area has its own environmental characteristics. Choosing the right enclosure and cooling system must be tailored to the thermal load, protection level (IP rating), and specific operational requirements of each facility.</p>\n<p><strong>PT Multi Daya Mitra (MDM)</strong> provides industrial enclosure, server rack, climate control, and cooling system solutions designed to support equipment protection and reliability in industrial settings.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Melindungi Peralatan Industri dengan Enclosure &amp; Kontrol Iklim yang Tepat</h2>\n<p>Di lingkungan industri, peralatan listrik dan sistem otomasi harus beroperasi dalam kondisi lingkungan yang menantang — paparan debu, suhu tinggi, kelembapan, dan fluktuasi cuaca. Tanpa perlindungan yang memadai, kondisi ini dapat menurunkan performa peralatan dan memperpendek masa pakai operasionalnya. Di sinilah <a href=\"/products/enclosure-climate-control\"><strong>enclosure industri</strong></a> dan <strong>sistem climate control</strong> memegang peranan krusial: menjaga peralatan tetap terlindungi dan beroperasi pada kondisi optimal.</p>\n<h3>Apa Itu Enclosure Industri &amp; Climate Control?</h3>\n<p><strong>Enclosure industri</strong> berfungsi sebagai pelindung fisik bagi komponen kritis seperti panel listrik, sistem PLC, inverter, dan perangkat kontrol dari ancaman fisik maupun lingkungan sekitar. Sementara itu, <strong>climate control</strong> bertugas mengatur sirkulasi, temperatur, dan kelembapan di dalam enclosure agar peralatan elektronik tidak mengalami panas berlebih (overheating).</p>\n<h3>Mengapa Climate Control Begitu Penting?</h3>\n<p>Suhu yang terlalu tinggi di dalam boks panel dapat mempercepat degradasi komponen elektronik, sedangkan debu dan uap air meningkatkan risiko korosi serta korsleting listrik. Dengan sistem pendingin panel yang tepat, keandalan peralatan (equipment reliability) dapat terjaga secara maksimal dan risiko <strong>downtime produksi</strong> dapat ditekan secara signifikan.</p>\n<p>Setiap area produksi memiliki karakteristik lingkungan yang berbeda. Pemilihan jenis enclosure dan unit pendingin harus disesuaikan dengan kapasitas termal komponen, tingkat proteksi IP, serta kondisi spesifik pabrik Anda.</p>\n<p><strong>PT Multi Daya Mitra (MDM)</strong> menyediakan solusi lengkap enclosure industri, rak server, climate control, dan sistem pendingin panel berkualitas tinggi. Konsultasikan kebutuhan proteksi panel industri Anda bersama tim engineering MDM.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'industrial-enclosure-climate-control';

-- ARTICLE: industrial-automation-control-solutions
UPDATE news SET
  title = E'EN: Automation & Control Solutions for Industrial Applications
ID: Solusi Otomasi & Kontrol untuk Aplikasi Industri',
  excerpt = E'EN: PT Multi Daya Mitra provides Industrial Automation & Control solutions including PLC systems, SCADA/HMI, process visualization, and motor drives to support more efficient, integrated, and reliable industrial processes.
ID: PT Multi Daya Mitra menyediakan solusi Otomasi & Kontrol Industri meliputi PLC, SCADA/HMI, visualisasi proses, dan motor drive untuk mendukung proses industri yang lebih efisien, terintegrasi, dan andal.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Automation &amp; Control untuk Meningkatkan Efisiensi Industri</h2>\n<p>Bagi <strong>perusahaan manufaktur, plant industri, engineering, dan fasilitas produksi</strong>, menjaga proses tetap akurat, stabil, dan efisien merupakan bagian penting dari operasional. <strong>Automation &amp; Control</strong> membantu industri mengontrol proses, memantau peralatan, dan meningkatkan keandalan sistem.</p>\n<h2>Apa Itu Automation &amp; Control?</h2>\n<p><a href=\"/products/automation-control\">Automation &amp; Control</a> merupakan sistem untuk <strong>mengotomatisasi, mengontrol, dan memantau proses industri</strong>. Dengan sistem yang tepat, operator dapat mengelola proses secara lebih terukur dan mengurangi ketergantungan pada pekerjaan manual.</p>\n<h2>Solusi Automation &amp; Control</h2>\n<p>PT Multi Daya Mitra menyediakan solusi yang mencakup:</p>\n<p><strong>1. Sistem PLC (Programmable Logic Controller)</strong><br>Mengontrol mesin dan proses secara otomatis sesuai parameter operasional pabrik.</p>\n<p><strong>2. SCADA &amp; HMI</strong><br>Memudahkan monitoring mesin, parameter proses, dan alarm secara real-time dari ruang kontrol.</p>\n<p><strong>3. Visualisasi Proses</strong><br>Menyajikan kondisi proses dalam tampilan visual yang mudah dipantau operator.</p>\n<p><strong>4. Motor Drives (Inverter / VFD)</strong><br>Mengatur kecepatan dan performa motor sesuai kebutuhan proses produksi guna menghemat energi.</p>\n<h2>Manfaat untuk Industri</h2>\n<ul>\n  <li><p>Meningkatkan efisiensi dan kapasitas operasional</p></li>\n  <li><p>Mengurangi risiko human error</p></li>\n  <li><p>Mempercepat monitoring dan respons alarm proses</p></li>\n  <li><p>Meningkatkan keandalan peralatan operasional</p></li>\n  <li><p>Mendukung pengambilan keputusan berbasis data historis</p></li>\n</ul>\n<h2>Konsultasikan Kebutuhan Anda</h2>\n<p>Memiliki kebutuhan <strong>PLC, SCADA/HMI, motor drives, atau sistem otomasi industri</strong>?</p>\n<p><strong>Konsultasikan kebutuhan Automation &amp; Control Anda bersama PT Multi Daya Mitra</strong> untuk mendapatkan solusi yang sesuai dengan kondisi dan kebutuhan operasional.</p>\n<p><strong>PT Multi Daya Mitra — Optimize Control. Improve Efficiency. Build Reliability.</strong></p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Automation &amp; Control Solutions to Boost Industrial Efficiency</h2>\n<p>For <strong>manufacturing plants, process industries, engineering facilities, and production lines</strong>, maintaining accurate, stable, and efficient operations is essential. <strong>Automation &amp; Control systems</strong> empower industrial facilities to regulate processes, monitor equipment status, and elevate overall system reliability.</p>\n<h2>What Is Industrial Automation &amp; Control?</h2>\n<p><a href=\"/products/automation-control\">Automation &amp; Control</a> refers to integrated systems designed to <strong>automate, control, and supervise industrial machinery and processes</strong>. With the right platform in place, operators can manage production with precision, minimize human error, and reduce dependency on manual intervention.</p>\n<h2>Comprehensive Automation &amp; Control Solutions</h2>\n<p>PT Multi Daya Mitra delivers turnkey solutions covering:</p>\n<p><strong>1. PLC Systems (Programmable Logic Controllers)</strong><br>Automating machinery and process workflows precisely according to operational parameters.</p>\n<p><strong>2. SCADA &amp; HMI Systems</strong><br>Enabling real-time monitoring of machine performance, process variables, and alarms across the plant floor.</p>\n<p><strong>3. Process Visualization</strong><br>Delivering intuitive visual dashboards for clear operator oversight and swift fault response.</p>\n<p><strong>4. Variable Frequency Drives (VFD) &amp; Motor Starters</strong><br>Regulating motor speeds and performance to optimize energy efficiency and mechanical reliability.</p>\n<h2>Key Industrial Benefits</h2>\n<ul>\n  <li><p>Increased operational throughput and energy efficiency</p></li>\n  <li><p>Substantial reduction in human error and unplanned downtime</p></li>\n  <li><p>Faster, centralized process telemetry and alarm management</p></li>\n  <li><p>Longer equipment operating lifespan</p></li>\n  <li><p>Data-driven operational decision making and analytics</p></li>\n</ul>\n<h2>Consult Your Industrial Automation Needs</h2>\n<p>Looking to upgrade your <strong>PLC architecture, SCADA/HMI interface, motor drives, or plant-wide automation</strong>?</p>\n<p><strong>Partner with PT Multi Daya Mitra</strong> to engineer a tailored automation solution aligned with your specific operational and production requirements.</p>\n<p><strong>PT Multi Daya Mitra — Optimize Control. Improve Efficiency. Build Reliability.</strong></p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Automation &amp; Control untuk Meningkatkan Efisiensi Industri</h2>\n<p>Bagi <strong>perusahaan manufaktur, plant industri, engineering, dan fasilitas produksi</strong>, menjaga proses tetap akurat, stabil, dan efisien merupakan bagian penting dari operasional. <strong>Automation &amp; Control</strong> membantu industri mengontrol proses, memantau peralatan, dan meningkatkan keandalan sistem.</p>\n<h2>Apa Itu Automation &amp; Control?</h2>\n<p><a href=\"/products/automation-control\">Automation &amp; Control</a> merupakan sistem untuk <strong>mengotomatisasi, mengontrol, dan memantau proses industri</strong>. Dengan sistem yang tepat, operator dapat mengelola proses secara lebih terukur dan mengurangi ketergantungan pada pekerjaan manual.</p>\n<h2>Solusi Automation &amp; Control</h2>\n<p>PT Multi Daya Mitra menyediakan solusi yang mencakup:</p>\n<p><strong>1. Sistem PLC (Programmable Logic Controller)</strong><br>Mengontrol mesin dan proses secara otomatis sesuai parameter operasional pabrik.</p>\n<p><strong>2. SCADA &amp; HMI</strong><br>Memudahkan monitoring mesin, parameter proses, dan alarm secara real-time dari ruang kontrol.</p>\n<p><strong>3. Visualisasi Proses</strong><br>Menyajikan kondisi proses dalam tampilan visual yang mudah dipantau operator.</p>\n<p><strong>4. Motor Drives (Inverter / VFD)</strong><br>Mengatur kecepatan dan performa motor sesuai kebutuhan proses produksi guna menghemat energi.</p>\n<h2>Manfaat untuk Industri</h2>\n<ul>\n  <li><p>Meningkatkan efisiensi dan kapasitas operasional</p></li>\n  <li><p>Mengurangi risiko human error</p></li>\n  <li><p>Mempercepat monitoring dan respons alarm proses</p></li>\n  <li><p>Meningkatkan keandalan peralatan operasional</p></li>\n  <li><p>Mendukung pengambilan keputusan berbasis data historis</p></li>\n</ul>\n<h2>Konsultasikan Kebutuhan Anda</h2>\n<p>Memiliki kebutuhan <strong>PLC, SCADA/HMI, motor drives, atau sistem otomasi industri</strong>?</p>\n<p><strong>Konsultasikan kebutuhan Automation &amp; Control Anda bersama PT Multi Daya Mitra</strong> untuk mendapatkan solusi yang sesuai dengan kondisi dan kebutuhan operasional.</p>\n<p><strong>PT Multi Daya Mitra — Optimize Control. Improve Efficiency. Build Reliability.</strong></p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'industrial-automation-control-solutions';

-- ARTICLE: reliable-power-distribution-substation-mv-switchgear
UPDATE news SET
  title = E'EN: Building Reliable Power Distribution with Substation & MV Switchgear
ID: Membangun Distribusi Daya Andal dengan Gardu Induk & Switchgear Tegangan Menengah',
  excerpt = E'EN: Substation and MV switchgear systems play a critical role in delivering safe, reliable, and efficient power distribution for industrial and infrastructure applications.
ID: Sistem gardu induk dan switchgear tegangan menengah (MV) memegang peran krusial dalam menyalurkan distribusi daya yang aman, andal, dan efisien untuk aplikasi industri dan infrastruktur.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Membangun Instalasi Gardu Induk &amp; Switchgear MV Andal hingga 36 kV</h2>\n<p>Distribusi daya listrik yang andal adalah pondasi utama bagi fasilitas industri dan infrastruktur yang mengandalkan pasokan listrik kontinu tanpa henti. <a href=\"/services/electrical-construction-installation/substation-mv-switchgear-installation\"><strong>Gardu induk (substation) dan switchgear tegangan menengah (MV)</strong></a> memegang peran vital dalam mengelola, melindungi, mentransformasikan, dan mendistribusikan energi listrik secara aman.</p>\n<p>Sistem yang dirancang dengan baik memastikan pasokan daya tersalurkan secara efisien sekaligus meminimalkan risiko kegagalan peralatan, korsleting listrik, dan downtime tak terencana.</p>\n<h2>Peran Gardu Induk &amp; Switchgear MV</h2>\n<p><strong>Gardu induk</strong> berfungsi sebagai titik sentral untuk menurunkan atau menaikkan tegangan dan mendistribusikan daya sesuai kebutuhan pabrik. Gardu induk mengintegrasikan komponen utama seperti transformator daya, switchgear, sistem proteksi relay, dan sistem pembumian (grounding).</p>\n<p>Sementara itu, <strong>switchgear MV</strong> menyediakan fungsi switching, isolasi, dan proteksi untuk jaringan tegangan menengah. Switchgear bertipe metal-clad umum digunakan di industri karena menawarkan keamanan tinggi dan pengoperasian yang terlindung.</p>\n<p>Sistem ini dapat dirancang untuk level tegangan menengah <strong>hingga 36 kV</strong> sesuai dengan kebutuhan konfigurasi kelistrikan fasilitas Anda.</p>\n<h2>Komponen Kunci Sistem</h2>\n<ul>\n  <li><p><strong>MV Metal-Clad Switchgear</strong> — Untuk switching, isolasi aman, dan proteksi arus gangguan.</p></li>\n  <li><p><strong>Transformator Daya (Power Transformer)</strong> — Untuk transformasi tegangan dan penyaluran daya utama.</p></li>\n  <li><p><strong>Sistem Proteksi &amp; Kontrol</strong> — Relay proteksi numerik untuk monitoring dan pemutusan arus gangguan seketika.</p></li>\n  <li><p><strong>Sistem Grounding</strong> — Menjamin keselamatan operator dan pelepasan arus gangguan ke tanah.</p></li>\n  <li><p><strong>Bak Penampung Minyak (Oil Containment)</strong> — Mencegah risiko kebocoran oli trafo ke lingkungan.</p></li>\n</ul>\n<h2>Instalasi &amp; Integrasi Terpadu</h2>\n<p>Keberhasilan proyek membutuhkan koordinasi matang antara <strong>pekerjaan teknik sipil, mekanikal, dan elektrikal</strong>. Pondasi trafo, parit kabel (trench), grounding grid, penarikan kabel, serta penempatan switchgear harus terintegrasi dengan sempurna.</p>\n<p>Tahapan pengerjaan mencakup <strong>perencanaan teknik (engineering), persiapan lokasi, perakitan peralatan, penarikan &amp; terminasi kabel, inspeksi teknis, hingga pengujian dan commissioning</strong>.</p>\n<h2>Keselamatan, Kualitas &amp; Keandalan</h2>\n<p>Instalasi tegangan menengah menuntut kepatuhan ketat terhadap standar keselamatan kerja dan standar teknis (IEC/IEEE/SNI). PT Multi Daya Mitra memastikan seluruh tahapan mulai dari instalasi fisik, terminasi kabel, uji proteksi relay, hingga energizing terlaksana dengan standar mutu tertinggi.</p>\n<p>Kontak Kami:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Building Reliable Substation &amp; MV Switchgear Installation up to 36 kV</h2>\n<p>Reliable power distribution is essential for industrial facilities and infrastructure that depend on a stable and continuous electrical supply. <a href=\"/services/electrical-construction-installation/substation-mv-switchgear-installation\"><strong>Substations and Medium Voltage (MV) switchgear</strong></a> play a key role in managing, protecting, transforming, and distributing electrical power safely.</p>\n<p>A well-designed system ensures that electrical power can be delivered efficiently while minimizing the risk of equipment failure, electrical faults, and unplanned downtime.</p>\n<h2>The Role of Substation &amp; MV Switchgear</h2>\n<p>A <strong>substation</strong> serves as a critical point for transforming and distributing electrical energy according to the requirements of a facility. It integrates key equipment such as power transformers, switchgear, protection systems, and grounding systems.</p>\n<p>Meanwhile, <strong>MV switchgear</strong> provides switching, isolation, and protection for medium voltage networks. Metal-clad switchgear is commonly applied where reliable protection and controlled operation are required.</p>\n<p>For specific applications, these systems can be engineered for medium voltage levels <strong>up to 36 kV</strong>, depending on project requirements and system configuration.</p>\n<h2>Key Components</h2>\n<ul>\n  <li><p><strong>MV Metal-Clad Switchgear</strong> – for switching, isolation, and protection.</p></li>\n  <li><p><strong>Power Transformer</strong> – for voltage transformation and power distribution.</p></li>\n  <li><p><strong>Protection &amp; Control System</strong> – for monitoring and fault protection.</p></li>\n  <li><p><strong>Grounding System</strong> – supporting electrical safety and fault-current management.</p></li>\n  <li><p><strong>Oil Containment</strong> – helping control potential oil spills from oil-filled transformers.</p></li>\n</ul>\n<h2>Installation &amp; Integration</h2>\n<p>Successful installation requires coordination between <strong>engineering, civil, and electrical works</strong>. Equipment foundations, cable trenches, grounding infrastructure, cable routing, and equipment positioning must be properly coordinated with the electrical installation.</p>\n<p>The typical process includes <strong>engineering and planning, site preparation, equipment installation, electrical connection, inspection, testing, and commissioning</strong>.</p>\n<h2>Safety, Quality &amp; Reliability</h2>\n<p>Medium voltage installations require strict attention to <strong>safety, quality, and technical compliance</strong>. Proper equipment installation, cable termination, grounding, protection testing, and pre-energization inspection are essential before the system is placed into operation.</p>\n<p>Contact Us:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Membangun Instalasi Gardu Induk &amp; Switchgear MV Andal hingga 36 kV</h2>\n<p>Distribusi daya listrik yang andal adalah pondasi utama bagi fasilitas industri dan infrastruktur yang mengandalkan pasokan listrik kontinu tanpa henti. <a href=\"/services/electrical-construction-installation/substation-mv-switchgear-installation\"><strong>Gardu induk (substation) dan switchgear tegangan menengah (MV)</strong></a> memegang peran vital dalam mengelola, melindungi, mentransformasikan, dan mendistribusikan energi listrik secara aman.</p>\n<p>Sistem yang dirancang dengan baik memastikan pasokan daya tersalurkan secara efisien sekaligus meminimalkan risiko kegagalan peralatan, korsleting listrik, dan downtime tak terencana.</p>\n<h2>Peran Gardu Induk &amp; Switchgear MV</h2>\n<p><strong>Gardu induk</strong> berfungsi sebagai titik sentral untuk menurunkan atau menaikkan tegangan dan mendistribusikan daya sesuai kebutuhan pabrik. Gardu induk mengintegrasikan komponen utama seperti transformator daya, switchgear, sistem proteksi relay, dan sistem pembumian (grounding).</p>\n<p>Sementara itu, <strong>switchgear MV</strong> menyediakan fungsi switching, isolasi, dan proteksi untuk jaringan tegangan menengah. Switchgear bertipe metal-clad umum digunakan di industri karena menawarkan keamanan tinggi dan pengoperasian yang terlindung.</p>\n<p>Sistem ini dapat dirancang untuk level tegangan menengah <strong>hingga 36 kV</strong> sesuai dengan kebutuhan konfigurasi kelistrikan fasilitas Anda.</p>\n<h2>Komponen Kunci Sistem</h2>\n<ul>\n  <li><p><strong>MV Metal-Clad Switchgear</strong> — Untuk switching, isolasi aman, dan proteksi arus gangguan.</p></li>\n  <li><p><strong>Transformator Daya (Power Transformer)</strong> — Untuk transformasi tegangan dan penyaluran daya utama.</p></li>\n  <li><p><strong>Sistem Proteksi &amp; Kontrol</strong> — Relay proteksi numerik untuk monitoring dan pemutusan arus gangguan seketika.</p></li>\n  <li><p><strong>Sistem Grounding</strong> — Menjamin keselamatan operator dan pelepasan arus gangguan ke tanah.</p></li>\n  <li><p><strong>Bak Penampung Minyak (Oil Containment)</strong> — Mencegah risiko kebocoran oli trafo ke lingkungan.</p></li>\n</ul>\n<h2>Instalasi &amp; Integrasi Terpadu</h2>\n<p>Keberhasilan proyek membutuhkan koordinasi matang antara <strong>pekerjaan teknik sipil, mekanikal, dan elektrikal</strong>. Pondasi trafo, parit kabel (trench), grounding grid, penarikan kabel, serta penempatan switchgear harus terintegrasi dengan sempurna.</p>\n<p>Tahapan pengerjaan mencakup <strong>perencanaan teknik (engineering), persiapan lokasi, perakitan peralatan, penarikan &amp; terminasi kabel, inspeksi teknis, hingga pengujian dan commissioning</strong>.</p>\n<h2>Keselamatan, Kualitas &amp; Keandalan</h2>\n<p>Instalasi tegangan menengah menuntut kepatuhan ketat terhadap standar keselamatan kerja dan standar teknis (IEC/IEEE/SNI). PT Multi Daya Mitra memastikan seluruh tahapan mulai dari instalasi fisik, terminasi kabel, uji proteksi relay, hingga energizing terlaksana dengan standar mutu tertinggi.</p>\n<p>Kontak Kami:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'reliable-power-distribution-substation-mv-switchgear';

-- ARTICLE: mechanical-services-general-supplies
UPDATE news SET
  title = E'EN: Mechanical Services & General Supplies | MDM
ID: Layanan Mekanikal & Suplai Umum | MDM',
  excerpt = E'EN: Comprehensive mechanical solutions for industry, from maintenance and conveyor systems to magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing for reliable and efficient plant operations.
ID: Solusi kebutuhan mekanikal industri, mulai dari pemeliharaan, sistem konveyor, magnetic separator, pintu berkecepatan tinggi, vacuum lifter, hingga servis motor dan generator untuk operasional yang andal dan efisien.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Mechanical Services &amp; General Supplies</h2>\n<p>Dalam dunia industri, <strong>keandalan mesin dan equipment</strong> sangat penting untuk menjaga proses operasional tetap berjalan. Kerusakan pada satu equipment dapat menyebabkan downtime, menghambat produksi, dan meningkatkan biaya operasional.</p>\n<p><strong>Mechanical Services &amp; General Supplies</strong> menyediakan solusi untuk mendukung kebutuhan <strong>maintenance, servicing, equipment, dan general supplies</strong> di lingkungan industri. Layanan mencakup berbagai kebutuhan mekanikal, mulai dari perawatan equipment hingga penyediaan peralatan pendukung.</p>\n<h2>Industrial Mechanical Maintenance</h2>\n<p>Perawatan mekanikal secara rutin membantu menjaga equipment tetap bekerja dengan baik dan mengurangi risiko kerusakan mendadak.</p>\n<p>Layanan <strong>industrial mechanical maintenance</strong> meliputi:</p>\n<ul>\n  <li><p>Pemeriksaan kondisi equipment</p></li>\n  <li><p>Preventive maintenance</p></li>\n  <li><p>Troubleshooting</p></li>\n  <li><p>Perbaikan dan penggantian komponen</p></li>\n  <li><p>Pemeriksaan performa equipment</p></li>\n</ul>\n<h2>Conveyor Systems</h2>\n<p><strong>Conveyor systems</strong> digunakan untuk memindahkan material dari satu area ke area lainnya dalam proses produksi maupun material handling. Solusi conveyor mencakup instalasi, inspeksi, pemeliharaan rutin, dan penggantian komponen.</p>\n<h2>Magnetic Separators</h2>\n<p>Dalam proses produksi, material logam yang tercampur dengan bahan produksi dapat memengaruhi kualitas produk dan merusak mesin. <strong>Magnetic separators</strong> digunakan untuk memisahkan kontaminasi logam dari material secara efektif.</p>\n<h2>High-Speed Doors</h2>\n<p>Pada fasilitas industri dan gudang, <strong>high-speed doors</strong> membantu mempercepat proses keluar-masuk barang sekaligus menahan debu dan menjaga stabilitas suhu ruangan.</p>\n<h2>Vacuum Lifters</h2>\n<p>Pemindahan material berat membutuhkan peralatan yang aman dan ergonomis. <strong>Vacuum lifters</strong> membantu mengangkat dan memindahkan muatan secara efisien tanpa membebani fisik pekerja.</p>\n<h2>Motor &amp; Generator Servicing</h2>\n<p>Motor dan generator merupakan penggerak utama kegiatan industri. Layanan kami mencakup inspeksi, servicing, balancing, perbaikan belitan (rewinding), dan penggantian bearing berkala.</p>\n<h2>General Industrial Supplies</h2>\n<p>Kami menyediakan berbagai <strong>material, spare part, dan komponen pendukung industri</strong> untuk kelancaran pemeliharaan fasilitas Anda secara praktis dan terintegrasi.</p>\n<h3>Peralatan Andal. Operasi Lebih Lancar. Kinerja Lebih Baik.</h3>\n<p><strong>Butuh dukungan layanan mekanikal atau suplai peralatan industri? Hubungi kami untuk konsultasi.</strong></p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Mechanical Services &amp; General Supplies</h2>\n<p>In modern manufacturing, <strong>equipment and machinery reliability</strong> is critical to maintaining smooth production. Failure of a single mechanical component can trigger plant downtime, disrupt supply chains, and increase operational costs.</p>\n<p><strong>Mechanical Services &amp; General Supplies</strong> by PT Multi Daya Mitra delivers complete solutions for <strong>maintenance, servicing, material handling equipment, and general industrial supplies</strong> to ensure peak plant availability.</p>\n<h2>Industrial Mechanical Maintenance</h2>\n<p>Routine mechanical maintenance keeps industrial equipment running in peak condition and mitigates the risk of catastrophic breakdowns.</p>\n<p>Our <strong>industrial mechanical maintenance services</strong> include:</p>\n<ul>\n  <li><p>Comprehensive equipment condition assessments</p></li>\n  <li><p>Preventive maintenance programs</p></li>\n  <li><p>Mechanical troubleshooting and diagnostics</p></li>\n  <li><p>Precision component repair and replacement</p></li>\n  <li><p>Operating performance and vibration inspection</p></li>\n</ul>\n<h2>Conveyor Systems</h2>\n<p><strong>Conveyor systems</strong> are the backbone of bulk material handling and production workflows. Our turnkey conveyor services cover design, installation, belt replacement, roller maintenance, drive servicing, and safety alignment.</p>\n<h2>Magnetic Separators</h2>\n<p>Protecting product purity and machinery from tramp metal contamination is vital in food, pharmaceutical, chemical, and mineral plants. We supply and service high-gradient <strong>magnetic separators</strong> that isolate ferrous impurities effectively.</p>\n<h2>High-Speed Industrial Doors</h2>\n<p>Fast-acting <strong>high-speed doors</strong> minimize cycle times between production halls, warehouses, and cleanrooms while preventing dust, air leakage, and temperature disruption.</p>\n<h2>Vacuum Lifters</h2>\n<p>Ergonomic <strong>vacuum lifting systems</strong> facilitate safe, rapid handling of heavy bags, cartons, glass, and metal sheets, significantly reducing worker fatigue and improving handling efficiency.</p>\n<h2>Motor &amp; Generator Servicing</h2>\n<p>Industrial motors and generators demand systematic servicing. We provide on-site inspection, dynamic balancing, stator rewinding, bearing replacement, and insulation resistance verification to uphold operating continuity.</p>\n<h2>General Industrial Supplies</h2>\n<p>Beyond engineering services, we provide a broad range of <strong>industrial spare parts, fasteners, bearings, pneumatic fittings, and consumable supplies</strong> through our streamlined procurement channel.</p>\n<h2>Supporting Reliable Industrial Operations</h2>\n<p>PT Multi Daya Mitra helps facilities maintain equipment uptime through the combined strength of <strong>mechanical engineering, dedicated servicing, material handling automation, and dependable supply chains</strong>.</p>\n<h3>Reliable Equipment. Smoother Operation. Better Performance.</h3>\n<p><strong>Need mechanical engineering services or industrial equipment supply? Let us discuss your requirements.</strong></p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Mechanical Services &amp; General Supplies</h2>\n<p>Dalam dunia industri, <strong>keandalan mesin dan equipment</strong> sangat penting untuk menjaga proses operasional tetap berjalan. Kerusakan pada satu equipment dapat menyebabkan downtime, menghambat produksi, dan meningkatkan biaya operasional.</p>\n<p><strong>Mechanical Services &amp; General Supplies</strong> menyediakan solusi untuk mendukung kebutuhan <strong>maintenance, servicing, equipment, dan general supplies</strong> di lingkungan industri. Layanan mencakup berbagai kebutuhan mekanikal, mulai dari perawatan equipment hingga penyediaan peralatan pendukung.</p>\n<h2>Industrial Mechanical Maintenance</h2>\n<p>Perawatan mekanikal secara rutin membantu menjaga equipment tetap bekerja dengan baik dan mengurangi risiko kerusakan mendadak.</p>\n<p>Layanan <strong>industrial mechanical maintenance</strong> meliputi:</p>\n<ul>\n  <li><p>Pemeriksaan kondisi equipment</p></li>\n  <li><p>Preventive maintenance</p></li>\n  <li><p>Troubleshooting</p></li>\n  <li><p>Perbaikan dan penggantian komponen</p></li>\n  <li><p>Pemeriksaan performa equipment</p></li>\n</ul>\n<h2>Conveyor Systems</h2>\n<p><strong>Conveyor systems</strong> digunakan untuk memindahkan material dari satu area ke area lainnya dalam proses produksi maupun material handling. Solusi conveyor mencakup instalasi, inspeksi, pemeliharaan rutin, dan penggantian komponen.</p>\n<h2>Magnetic Separators</h2>\n<p>Dalam proses produksi, material logam yang tercampur dengan bahan produksi dapat memengaruhi kualitas produk dan merusak mesin. <strong>Magnetic separators</strong> digunakan untuk memisahkan kontaminasi logam dari material secara efektif.</p>\n<h2>High-Speed Doors</h2>\n<p>Pada fasilitas industri dan gudang, <strong>high-speed doors</strong> membantu mempercepat proses keluar-masuk barang sekaligus menahan debu dan menjaga stabilitas suhu ruangan.</p>\n<h2>Vacuum Lifters</h2>\n<p>Pemindahan material berat membutuhkan peralatan yang aman dan ergonomis. <strong>Vacuum lifters</strong> membantu mengangkat dan memindahkan muatan secara efisien tanpa membebani fisik pekerja.</p>\n<h2>Motor &amp; Generator Servicing</h2>\n<p>Motor dan generator merupakan penggerak utama kegiatan industri. Layanan kami mencakup inspeksi, servicing, balancing, perbaikan belitan (rewinding), dan penggantian bearing berkala.</p>\n<h2>General Industrial Supplies</h2>\n<p>Kami menyediakan berbagai <strong>material, spare part, dan komponen pendukung industri</strong> untuk kelancaran pemeliharaan fasilitas Anda secara praktis dan terintegrasi.</p>\n<h3>Peralatan Andal. Operasi Lebih Lancar. Kinerja Lebih Baik.</h3>\n<p><strong>Butuh dukungan layanan mekanikal atau suplai peralatan industri? Hubungi kami untuk konsultasi.</strong></p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'mechanical-services-general-supplies';

-- ARTICLE: scada-systems-hmi-centralized-telemetry
UPDATE news SET
  title = E'EN: SCADA Systems, HMI, Centralized Telemetry, Industrial Monitoring, System Integration
ID: Sistem SCADA, HMI, Telemetri Terpusat, Monitoring Industri & Integrasi Sistem',
  excerpt = E'EN: SCADA, HMI, and Centralized Telemetry help industrial operations monitor equipment in real time, manage centralized data, and boost operational efficiency and reliability.
ID: SCADA, HMI, dan telemetri terpusat membantu industri melakukan monitoring peralatan secara real-time, mengelola data terpusat, serta meningkatkan efisiensi dan keandalan operasional.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Apa Itu SCADA, HMI &amp; Centralized Telemetry?</h2>\n<p>Dalam operasional industri, monitoring kondisi equipment secara cepat dan akurat sangat penting. <a href=\"/services/automation-solutions-services\"><strong>SCADA, HMI, dan Centralized Telemetry</strong></a> membantu perusahaan mengelola informasi tersebut dalam satu sistem yang lebih terintegrasi.</p>\n<h3>SCADA Systems</h3>\n<p><strong>SCADA (Supervisory Control and Data Acquisition)</strong> berfungsi mengumpulkan dan memantau data dari berbagai equipment secara real-time, seperti pressure, temperature, flow, status mesin, dan alarm.</p>\n<h3>HMI</h3>\n<p><strong>HMI (Human Machine Interface)</strong> merupakan tampilan yang membantu operator melihat kondisi equipment dan berinteraksi dengan sistem secara lebih mudah melalui dashboard visual.</p>\n<h3>Centralized Telemetry</h3>\n<p><strong>Centralized Telemetry</strong> memungkinkan data dari berbagai equipment atau lokasi dikirim dan dipantau melalui satu pusat monitoring.</p>\n<h2>Manfaat Utama</h2>\n<ul>\n  <li><p><strong>Real-Time Monitoring</strong> — kondisi equipment dapat dipantau dengan cepat.</p></li>\n  <li><p><strong>Early Detection</strong> — membantu mengetahui kondisi abnormal lebih awal.</p></li>\n  <li><p><strong>Centralized Data</strong> — data dari berbagai lokasi dapat dikelola dalam satu sistem.</p></li>\n  <li><p><strong>Maintenance Support</strong> — membantu monitoring kondisi dan performa equipment.</p></li>\n  <li><p><strong>Better Decision Making</strong> — menyediakan data sebagai dasar evaluasi dan pengambilan keputusan.</p></li>\n  <li><p><strong>Operational Efficiency</strong> — membuat proses monitoring lebih efektif dan terkoordinasi.</p></li>\n</ul>\n<h2>Bagaimana Sistem Bekerja?</h2>\n<p><strong>Equipment → Sensor → PLC/Controller → Communication Network → SCADA → HMI/Dashboard</strong></p>\n<p>Data dari equipment dikumpulkan, diproses, kemudian ditampilkan dalam bentuk informasi yang mudah dipahami oleh operator maupun management.</p>\n<h2>MDM Supporting Industrial Solutions</h2>\n<p><strong>PT Multi Daya Mitra (MDM)</strong> mendukung kebutuhan <strong>engineering, system integration, dan industrial monitoring</strong> dengan solusi yang disesuaikan dengan kebutuhan operasional.</p>\n<p><strong>Accuracy • Reliability • Efficiency • Documentation</strong></p>\n<h3>Butuh Solusi Monitoring Industri?</h3>\n<p>Diskusikan kebutuhan SCADA, HMI, Centralized Telemetry, dan System Integration bersama tim kami.</p>\n<p><strong>MDM — Engineering Solutions for Better Industrial Performance.</strong></p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>What Are SCADA, HMI &amp; Centralized Telemetry?</h2>\n<p>In modern industrial operations, rapid and precise equipment monitoring is essential to productivity and safety. <a href=\"/services/automation-solutions-services\"><strong>SCADA, HMI, and Centralized Telemetry</strong></a> provide manufacturing and utility companies with an integrated platform to monitor, control, and analyze plant operations in real time.</p>\n<h3>SCADA Systems</h3>\n<p><strong>SCADA (Supervisory Control and Data Acquisition)</strong> collects and visualizes operational telemetry across distributed equipment in real time — including pressures, temperatures, flow rates, motor statuses, and alarms.</p>\n<h3>HMI (Human-Machine Interface)</h3>\n<p><strong>HMI</strong> interfaces provide operators with intuitive touchscreens and graphical dashboards to control machinery, observe setpoints, and interact with the automation system easily on the factory floor.</p>\n<h3>Centralized Telemetry</h3>\n<p><strong>Centralized Telemetry</strong> networks multiple production facilities, pump stations, or utility zones into a unified centralized control center via industrial communication protocols (Modbus, Profinet, IEC 60870-5-104, OPC-UA).</p>\n<h2>Key Industrial Benefits</h2>\n<ul>\n  <li><p><strong>Real-Time Monitoring</strong> — Immediate visibility into plant machinery status and production metrics.</p></li>\n  <li><p><strong>Early Anomaly Detection</strong> — Automated alarms flag parameter deviations before failures escalate.</p></li>\n  <li><p><strong>Centralized Data Repository</strong> — Historical trends, production logs, and compliance audits stored securely in one platform.</p></li>\n  <li><p><strong>Predictive Maintenance Support</strong> — Real-time performance tracking guides proactive maintenance scheduling.</p></li>\n  <li><p><strong>Better Decision Making</strong> — Transparent data dashboards empower plant managers and engineers with actionable insights.</p></li>\n  <li><p><strong>Operational Efficiency</strong> — Streamlined workflows reduce manual data collection and enhance workforce productivity.</p></li>\n</ul>\n<h2>How Does the Architecture Work?</h2>\n<p><strong>Equipment → Sensors &amp; Transmitters → PLC/RTU Controller → Industrial Communication Network → SCADA Server → HMI &amp; Management Dashboard</strong></p>\n<p>Field data is acquired, securely transmitted, processed, and displayed in intuitive graphical formats accessible to operators and executives alike.</p>\n<h2>MDM Supporting Industrial Solutions</h2>\n<p><strong>PT Multi Daya Mitra (MDM)</strong> delivers end-to-end <strong>engineering design, system integration, PLC programming, SCADA development, and industrial telemetry</strong> tailored to your unique facility requirements.</p>\n<p><strong>Accuracy • Reliability • Efficiency • Documentation</strong></p>\n<h3>Looking for an Industrial Monitoring Solution?</h3>\n<p>Discuss your SCADA, HMI, Telemetry, and System Integration goals with our engineering experts.</p>\n<p><strong>MDM — Engineering Solutions for Better Industrial Performance.</strong></p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Apa Itu SCADA, HMI &amp; Centralized Telemetry?</h2>\n<p>Dalam operasional industri, monitoring kondisi equipment secara cepat dan akurat sangat penting. <a href=\"/services/automation-solutions-services\"><strong>SCADA, HMI, dan Centralized Telemetry</strong></a> membantu perusahaan mengelola informasi tersebut dalam satu sistem yang lebih terintegrasi.</p>\n<h3>SCADA Systems</h3>\n<p><strong>SCADA (Supervisory Control and Data Acquisition)</strong> berfungsi mengumpulkan dan memantau data dari berbagai equipment secara real-time, seperti pressure, temperature, flow, status mesin, dan alarm.</p>\n<h3>HMI</h3>\n<p><strong>HMI (Human Machine Interface)</strong> merupakan tampilan yang membantu operator melihat kondisi equipment dan berinteraksi dengan sistem secara lebih mudah melalui dashboard visual.</p>\n<h3>Centralized Telemetry</h3>\n<p><strong>Centralized Telemetry</strong> memungkinkan data dari berbagai equipment atau lokasi dikirim dan dipantau melalui satu pusat monitoring.</p>\n<h2>Manfaat Utama</h2>\n<ul>\n  <li><p><strong>Real-Time Monitoring</strong> — kondisi equipment dapat dipantau dengan cepat.</p></li>\n  <li><p><strong>Early Detection</strong> — membantu mengetahui kondisi abnormal lebih awal.</p></li>\n  <li><p><strong>Centralized Data</strong> — data dari berbagai lokasi dapat dikelola dalam satu sistem.</p></li>\n  <li><p><strong>Maintenance Support</strong> — membantu monitoring kondisi dan performa equipment.</p></li>\n  <li><p><strong>Better Decision Making</strong> — menyediakan data sebagai dasar evaluasi dan pengambilan keputusan.</p></li>\n  <li><p><strong>Operational Efficiency</strong> — membuat proses monitoring lebih efektif dan terkoordinasi.</p></li>\n</ul>\n<h2>Bagaimana Sistem Bekerja?</h2>\n<p><strong>Equipment → Sensor → PLC/Controller → Communication Network → SCADA → HMI/Dashboard</strong></p>\n<p>Data dari equipment dikumpulkan, diproses, kemudian ditampilkan dalam bentuk informasi yang mudah dipahami oleh operator maupun management.</p>\n<h2>MDM Supporting Industrial Solutions</h2>\n<p><strong>PT Multi Daya Mitra (MDM)</strong> mendukung kebutuhan <strong>engineering, system integration, dan industrial monitoring</strong> dengan solusi yang disesuaikan dengan kebutuhan operasional.</p>\n<p><strong>Accuracy • Reliability • Efficiency • Documentation</strong></p>\n<h3>Butuh Solusi Monitoring Industri?</h3>\n<p>Diskusikan kebutuhan SCADA, HMI, Centralized Telemetry, dan System Integration bersama tim kami.</p>\n<p><strong>MDM — Engineering Solutions for Better Industrial Performance.</strong></p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'scada-systems-hmi-centralized-telemetry';

-- ARTICLE: centralized-fire-alarm-monitoring
UPDATE news SET
  title = E'EN: Centralized Fire Alarm Monitoring Systems for Multi-Building Facilities
ID: Sistem Monitoring Fire Alarm Terpusat untuk Fasilitas Multi-Gedung',
  excerpt = E'EN: Centralized fire alarm monitoring integrates multiple fire detection panels into a single command center for faster response, regulatory compliance, and operational efficiency.
ID: Monitoring fire alarm terpusat mengintegrasikan banyak panel deteksi kebakaran ke dalam satu pusat komando untuk respons darurat lebih cepat, kepatuhan regulasi, dan efisiensi operasional.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Sistem Monitoring Fire Alarm Terpusat untuk Fasilitas Multi-Gedung</h2>\n<p>Bagi fasilitas dengan banyak gedung, area produksi terpisah, atau kompleks pergudangan yang luas, mengelola panel fire alarm secara terisolasi dapat menimbulkan keterlambatan respons darurat dan celah pengawasan keselamatan. <strong>Sistem monitoring fire alarm terpusat</strong> mengintegrasikan seluruh zona deteksi dan panel kontrol ke dalam satu antarmuka komando terpadu, memungkinkan respons insiden yang lebih cepat dan dokumentasi kepatuhan regulasi yang lebih akurat.</p>\n<h2>Manfaat Utama</h2>\n<ul>\n  <li><p><strong>Pusat Komando Tunggal (Single Command Center)</strong> — Visibilitas menyeluruh atas status kebakaran di seluruh gedung dan zona produksi dalam satu layar.</p></li>\n  <li><p><strong>Respons Darurat Lebih Cepat</strong> — Notifikasi alarm instan dan koordinasi tanggap darurat yang terkoordinasi secara otomatis.</p></li>\n  <li><p><strong>Pencatatan Event Otomatis</strong> — Dokumentasi riwayat alarm dan uji sistem secara otomatis untuk memenuhi audit kepatuhan regulasi keselamatan kerja.</p></li>\n  <li><p><strong>Integrasi Sistem Gedung</strong> — Terkoneksi dengan Building Automation System (BAS), HVAC, elevator, dan sistem access control untuk evakuasi aman.</p></li>\n  <li><p><strong>Kapabilitas Monitoring Jarak Jauh</strong> — Pemantauan operasional 24/7 melalui jaringan pusat kontrol keamanan.</p></li>\n</ul>\n<h2>Implementasi &amp; Layanan MDM</h2>\n<p><strong>PT Multi Daya Mitra</strong> merancang dan mengimplementasikan solusi monitoring fire alarm terpusat menggunakan platform terkemuka (seperti Bosch Security, Honeywell, dan Notifier). Cakupan layanan kami meliputi perancangan arsitektur jaringan, integrasi panel deteksi konvensional &amp; addressable, konfigurasi workstation operator, hingga pelatihan komprehensif bagi tim keselamatan fasilitas Anda.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Centralized Fire Alarm Monitoring Systems for Multi-Building Facilities</h2>\n<p>For facilities with multiple buildings, production zones, or campus-wide operations, managing individual fire alarm panels in isolation creates response delays and oversight gaps. <strong>Centralized fire alarm monitoring systems</strong> integrate all detection zones into a unified command interface, enabling faster incident response and streamlined compliance documentation.</p>\n<h2>Key Benefits</h2>\n<ul>\n  <li><p><strong>Single Command Center Visibility</strong> — Comprehensive real-time status across all buildings, zones, and suppression panels.</p></li>\n  <li><p><strong>Faster Alarm Acknowledgment &amp; Dispatch</strong> — Instant automated notifications for immediate emergency response coordination.</p></li>\n  <li><p><strong>Automated Event Logging</strong> — Complete audit trails and event records compliant with life-safety regulations.</p></li>\n  <li><p><strong>Integration with Building Management Systems</strong> — Seamless interlock with HVAC ventilation, elevators, and access control for safe evacuation.</p></li>\n  <li><p><strong>Remote Monitoring Capability</strong> — 24/7 centralized surveillance accessible across security control rooms.</p></li>\n</ul>\n<h2>Implementation &amp; Engineering Scope</h2>\n<p><strong>PT Multi Daya Mitra</strong> designs and implements centralized fire alarm monitoring solutions using leading addressable and networkable platforms (including Bosch Security, Honeywell, and Notifier). Our scope covers system architecture engineering, network infrastructure, panel integration, workstation graphic software configuration, and comprehensive operator training.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Sistem Monitoring Fire Alarm Terpusat untuk Fasilitas Multi-Gedung</h2>\n<p>Bagi fasilitas dengan banyak gedung, area produksi terpisah, atau kompleks pergudangan yang luas, mengelola panel fire alarm secara terisolasi dapat menimbulkan keterlambatan respons darurat dan celah pengawasan keselamatan. <strong>Sistem monitoring fire alarm terpusat</strong> mengintegrasikan seluruh zona deteksi dan panel kontrol ke dalam satu antarmuka komando terpadu, memungkinkan respons insiden yang lebih cepat dan dokumentasi kepatuhan regulasi yang lebih akurat.</p>\n<h2>Manfaat Utama</h2>\n<ul>\n  <li><p><strong>Pusat Komando Tunggal (Single Command Center)</strong> — Visibilitas menyeluruh atas status kebakaran di seluruh gedung dan zona produksi dalam satu layar.</p></li>\n  <li><p><strong>Respons Darurat Lebih Cepat</strong> — Notifikasi alarm instan dan koordinasi tanggap darurat yang terkoordinasi secara otomatis.</p></li>\n  <li><p><strong>Pencatatan Event Otomatis</strong> — Dokumentasi riwayat alarm dan uji sistem secara otomatis untuk memenuhi audit kepatuhan regulasi keselamatan kerja.</p></li>\n  <li><p><strong>Integrasi Sistem Gedung</strong> — Terkoneksi dengan Building Automation System (BAS), HVAC, elevator, dan sistem access control untuk evakuasi aman.</p></li>\n  <li><p><strong>Kapabilitas Monitoring Jarak Jauh</strong> — Pemantauan operasional 24/7 melalui jaringan pusat kontrol keamanan.</p></li>\n</ul>\n<h2>Implementasi &amp; Layanan MDM</h2>\n<p><strong>PT Multi Daya Mitra</strong> merancang dan mengimplementasikan solusi monitoring fire alarm terpusat menggunakan platform terkemuka (seperti Bosch Security, Honeywell, dan Notifier). Cakupan layanan kami meliputi perancangan arsitektur jaringan, integrasi panel deteksi konvensional &amp; addressable, konfigurasi workstation operator, hingga pelatihan komprehensif bagi tim keselamatan fasilitas Anda.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'centralized-fire-alarm-monitoring';

-- ARTICLE: transformer-testing-maintenance
UPDATE news SET
  title = E'EN: Transformer Testing and Maintenance: Protecting Your Most Valuable Network Assets
ID: Pengujian dan Pemeliharaan Transformator: Melindungi Aset Vital Jaringan Listrik',
  excerpt = E'EN: Power transformers represent critical investments in electrical networks. Routine health assessments detect incipient faults and extend asset service life.
ID: Transformator daya merupakan investasi vital dalam jaringan listrik. Penilaian kesehatan rutin mendeteksi anomali sejak dini dan memperpanjang usia pakai aset.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Pengujian dan Pemeliharaan Transformator: Melindungi Aset Vital Jaringan Listrik</h2>\n<p>Transformator daya merupakan salah satu investasi modal terbesar dalam jaringan distribusi listrik industri. Biaya penggantian trafo sangat besar dan masa inden pengadaan unit baru dapat memakan waktu berbulan-bulan. Oleh karena itu, program pengujian diagnostik dan pemeliharaan proaktif sangat krusial untuk memperpanjang usia pakai transformator serta mencegah kegagalan fatal yang melumpuhkan pabrik.</p>\n<h3>Mengapa Pengujian Diagnostik Trafo Sangat Penting?</h3>\n<p>Transformator beroperasi di bawah tekanan termal, elektrikal, dan mekanikal secara berkelanjutan. Seiring berjalannya waktu, minyak trafo dapat teroksidasi, kertas isolasi belitan mengalami penuaan, dan baut pengikat busbar dapat mengalami pengenduran. Tanpa pengujian rutin, potensi kerusakan tersembunyi dapat berkembang tanpa disadari hingga menyebabkan ledakan trafo atau padam listrik total.</p>\n<h3>Pengujian Diagnostik Utama</h3>\n<ul>\n  <li><p><strong>Uji Resistansi Belitan (Winding Resistance)</strong> — Memeriksa kontinuitas belitan, mendeteksi kelonggaran sambungan internal, dan memeriksa kontak On-Load Tap Changer (OLTC).</p></li>\n  <li><p><strong>Uji Tahanan Isolasi &amp; Polarization Index (Megger / PI)</strong> — Mengukur tingkat kebersihan dan kelembapan sistem isolasi belitan primer dan sekunder.</p></li>\n  <li><p><strong>Uji Rasio Transformasi (TTR Test)</strong> — Mengonfirmasi perbandingan lilitan, mendeteksi lilitan hubung singkat, serta memverifikasi tap changer di seluruh posisi.</p></li>\n  <li><p><strong>Dissolved Gas Analysis (DGA)</strong> — Menganalisis kandungan gas terlarut dalam minyak trafo untuk mendeteksi gejala overheating, corona, dan arcing sejak dini.</p></li>\n  <li><p><strong>Uji Tegangan Tembus Minyak (BDV Test)</strong> — Memastikan kekuatan dielektrik minyak isolasi terhadap tegangan tinggi.</p></li>\n  <li><p><strong>Sweep Frequency Response Analysis (SFRA)</strong> — Mendeteksi pergeseran fisik atau deformasi mekanis pada inti dan belitan akibat gaya hubung singkat.</p></li>\n</ul>\n<h3>Layanan Pemeliharaan Trafo oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra melayani pengujian trafo on-site, purifikasi dan filtrasi minyak trafo (vacuum dehydration), penggantian gasket, serta pemeliharaan menyeluruh dengan instrumen uji presisi terkalibrasi. Tim engineer kami menyajikan laporan kesehatan trafo lengkap disertai rekomendasi tindakan teknis terukur.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Transformer Testing and Maintenance: Protecting Your Most Valuable Network Assets</h2>\n<p>Power transformers represent one of the largest capital investments in any electrical distribution network. Because replacement costs are substantial and lead times can exceed a year, a proactive diagnostic testing and maintenance program is critical for maximizing transformer longevity and preventing catastrophic power failures.</p>\n<h3>Why Is Transformer Diagnostic Testing Critical?</h3>\n<p>Transformers operate under continuous electrical, thermal, and mechanical stresses. Over years of service, oil insulation breaks down, winding insulation paper deteriorates, and mechanical clamps may loosen. Without routine diagnostic testing, incipient faults can progress undetected until a catastrophic flashover or unplanned plant blackout occurs.</p>\n<h3>Key Diagnostic Tests</h3>\n<ul>\n  <li><p><strong>Winding Resistance Testing</strong> — Verifies internal connection integrity, detects loose joints, and checks tap-changer contact resistance.</p></li>\n  <li><p><strong>Insulation Resistance &amp; Polarization Index (PI)</strong> — Assesses the condition and dryness of primary and secondary winding insulation.</p></li>\n  <li><p><strong>Transformer Turns Ratio (TTR)</strong> — Identifies shorted turns, open circuits, and confirms correct phase displacement across all tap positions.</p></li>\n  <li><p><strong>Dissolved Gas Analysis (DGA)</strong> — Analyzes gases dissolved in transformer oil to identify overheating, arcing, and partial discharge early.</p></li>\n  <li><p><strong>Oil Breakdown Voltage (BDV) &amp; Moisture Testing</strong> — Checks dielectric withstand strength and water content in insulating oil.</p></li>\n  <li><p><strong>Sweep Frequency Response Analysis (SFRA)</strong> — Detects mechanical winding deformation and core displacement following transport or short-circuit events.</p></li>\n</ul>\n<h3>PT Multi Daya Mitra Transformer Services</h3>\n<p>PT Multi Daya Mitra provides comprehensive on-site transformer testing, oil purification (vacuum dehydration and degasification), gasket replacement, and preventive maintenance using calibrated high-precision instruments. Our engineers deliver actionable condition assessment reports with prioritized recommendations.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Pengujian dan Pemeliharaan Transformator: Melindungi Aset Vital Jaringan Listrik</h2>\n<p>Transformator daya merupakan salah satu investasi modal terbesar dalam jaringan distribusi listrik industri. Biaya penggantian trafo sangat besar dan masa inden pengadaan unit baru dapat memakan waktu berbulan-bulan. Oleh karena itu, program pengujian diagnostik dan pemeliharaan proaktif sangat krusial untuk memperpanjang usia pakai transformator serta mencegah kegagalan fatal yang melumpuhkan pabrik.</p>\n<h3>Mengapa Pengujian Diagnostik Trafo Sangat Penting?</h3>\n<p>Transformator beroperasi di bawah tekanan termal, elektrikal, dan mekanikal secara berkelanjutan. Seiring berjalannya waktu, minyak trafo dapat teroksidasi, kertas isolasi belitan mengalami penuaan, dan baut pengikat busbar dapat mengalami pengenduran. Tanpa pengujian rutin, potensi kerusakan tersembunyi dapat berkembang tanpa disadari hingga menyebabkan ledakan trafo atau padam listrik total.</p>\n<h3>Pengujian Diagnostik Utama</h3>\n<ul>\n  <li><p><strong>Uji Resistansi Belitan (Winding Resistance)</strong> — Memeriksa kontinuitas belitan, mendeteksi kelonggaran sambungan internal, dan memeriksa kontak On-Load Tap Changer (OLTC).</p></li>\n  <li><p><strong>Uji Tahanan Isolasi &amp; Polarization Index (Megger / PI)</strong> — Mengukur tingkat kebersihan dan kelembapan sistem isolasi belitan primer dan sekunder.</p></li>\n  <li><p><strong>Uji Rasio Transformasi (TTR Test)</strong> — Mengonfirmasi perbandingan lilitan, mendeteksi lilitan hubung singkat, serta memverifikasi tap changer di seluruh posisi.</p></li>\n  <li><p><strong>Dissolved Gas Analysis (DGA)</strong> — Menganalisis kandungan gas terlarut dalam minyak trafo untuk mendeteksi gejala overheating, corona, dan arcing sejak dini.</p></li>\n  <li><p><strong>Uji Tegangan Tembus Minyak (BDV Test)</strong> — Memastikan kekuatan dielektrik minyak isolasi terhadap tegangan tinggi.</p></li>\n  <li><p><strong>Sweep Frequency Response Analysis (SFRA)</strong> — Mendeteksi pergeseran fisik atau deformasi mekanis pada inti dan belitan akibat gaya hubung singkat.</p></li>\n</ul>\n<h3>Layanan Pemeliharaan Trafo oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra melayani pengujian trafo on-site, purifikasi dan filtrasi minyak trafo (vacuum dehydration), penggantian gasket, serta pemeliharaan menyeluruh dengan instrumen uji presisi terkalibrasi. Tim engineer kami menyajikan laporan kesehatan trafo lengkap disertai rekomendasi tindakan teknis terukur.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'transformer-testing-maintenance';

-- ARTICLE: partial-discharge-analyzer
UPDATE news SET
  title = E'EN: Partial Discharge Analyzer for Predictive Maintenance of MV/HV Equipment
ID: Alat Analisis Partial Discharge untuk Pemeliharaan Prediktif Peralatan MV/HV',
  excerpt = E'EN: Online partial discharge analysis enables early detection of insulation defects in medium and high voltage switchgear, transformers, and cable systems without service interruption.
ID: Analisis partial discharge (PD Scan) secara online mendeteksi kerusakan isolasi pada switchgear, transformator, dan kabel tegangan menengah tanpa memutus aliran listrik.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Alat Analisis Partial Discharge untuk Pemeliharaan Prediktif Peralatan MV/HV</h2>\n<p>Partial Discharge (peluahan parsial) adalah fenomena loncatan listrik terlokalisasi yang terjadi di dalam atau pada permukaan bahan isolasi tegangan menengah hingga tinggi. Jika tidak terdeteksi, aktivitas partial discharge akan terus mengikis dan merusak material dielektrik hingga terjadi kegagalan isolasi total (flashover) yang memicu ledakan dan pemadaman pabrik. Pengujian PD Scan online menghadirkan sistem deteksi dini paling efektif untuk mencegah kerusakan fatal tersebut.</p>\n<h3>Apa Saja yang Dapat Dideteksi oleh Uji Partial Discharge?</h3>\n<p>Pengujian PD non-intrusif dapat dilakukan secara online saat peralatan sedang beroperasi penuh tanpa perlu memadamkan aliran listrik:</p>\n<ul>\n  <li><p><strong>Kubikel MV Switchgear &amp; Busbar</strong> — Rongga udara (void) di dalam resin isolator, retakan isolasi, dan kontaminasi permukaan busbar.</p></li>\n  <li><p><strong>Terminasi &amp; Jointing Kabel Tegangan Menengah</strong> — Kegagalan stress control, kelembapan yang masuk, atau ketidaksempurnaan pemasangan termination kit.</p></li>\n  <li><p><strong>Transformator Daya</strong> — Degradasi isolasi internal belitan, pemburukan kondisi bushing, serta peluahan di dalam tangki oli.</p></li>\n  <li><p><strong>Gardu Induk Outdoor</strong> — Gejala korona dan surface tracking pada pemutus (disconnector), isolator keramik, dan arrester.</p></li>\n</ul>\n<h3>Teknologi Sensor Deteksi Multi-Metode</h3>\n<p>Metode diagnostik kami mengombinasikan beragam sensor terkalibrasi untuk cakupan analisis komprehensif:</p>\n<ul>\n  <li><p><strong>Sensor Transient Earth Voltage (TEV)</strong> — Menangkap denyut elektromagnetik frekuensi tinggi pada dinding logam kubikel switchgear.</p></li>\n  <li><p><strong>Sensor Kontak Akustik (Acoustic Contact)</strong> — Menangkap gelombang ultrasonik yang dihasilkan dari pelepasan muatan listrik di dalam tangki trafo dan terminasi kabel.</p></li>\n  <li><p><strong>High Frequency Current Transformer (HFCT)</strong> — Diklem pada kabel grounding untuk mendeteksi pulsa arus frekuensi tinggi akibat partial discharge.</p></li>\n  <li><p><strong>Parabolic Airborne Ultrasonic Dish</strong> — Menemukan titik persis korona dan peluahan di area gardu terbuka dari jarak aman.</p></li>\n</ul>\n<h3>Konsultasikan Pemeliharaan Prediktif Bersama PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra melayani jasa inspeksi Partial Discharge online dan audit kondisi kesehatan aset kelistrikan industri di seluruh Indonesia, membantu Anda menjadwalkan perbaikan terencana sebelum terjadi pemadaman darurat.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Partial Discharge Analyzer for Predictive Maintenance of MV/HV Equipment</h2>\n<p>Partial Discharge (PD) is a localized electrical breakdown that does not completely bridge the space between conductors within an insulation system. If left unaddressed, partial discharge activity progressively erodes dielectric materials until a catastrophic flashover or complete insulation failure occurs. Online PD scanning provides an indispensable early-warning capability for electrical assets.</p>\n<h3>What Can Partial Discharge Testing Detect?</h3>\n<p>Modern non-intrusive partial discharge testing identifies insulation vulnerabilities while equipment remains fully energized under normal operational load:</p>\n<ul>\n  <li><p><strong>MV Switchgear &amp; Busbars</strong> — Internal voids, tracking across cast-resin insulators, and surface contamination.</p></li>\n  <li><p><strong>Cable Terminations &amp; Joints</strong> — Inadequate stress control, moisture ingress, or workmanship defects in MV/HV cable kits.</p></li>\n  <li><p><strong>Power Transformers</strong> — Internal insulation degradation, bushing deterioration, and discharge activity inside oil barriers.</p></li>\n  <li><p><strong>Outdoor HV Substations</strong> — Corona and surface discharge on disconnectors, insulators, and surge arresters.</p></li>\n</ul>\n<h3>Multi-Sensor Detection Technologies</h3>\n<p>Our PD diagnostic methodology incorporates multiple complementary sensor types for comprehensive asset coverage:</p>\n<ul>\n  <li><p><strong>Transient Earth Voltage (TEV) Sensors</strong> — Detects electromagnetic pulses induced on the outer metal cladding of switchgear cabinets.</p></li>\n  <li><p><strong>Acoustic Contact Sensors</strong> — Measures high-frequency acoustic waves emitted by discharge events inside transformers and cable terminations.</p></li>\n  <li><p><strong>High Frequency Current Transformers (HFCT)</strong> — Clamped around cable earth sheaths to detect discharge pulses traveling to ground.</p></li>\n  <li><p><strong>Airborne Ultrasonic Receivers</strong> — Pinpoints surface discharge and corona in open-terminal substations.</p></li>\n</ul>\n<h3>Partner with PT Multi Daya Mitra for Predictive Electrical Asset Health</h3>\n<p>PT Multi Daya Mitra conducts professional on-site PD testing and baseline condition profiling, empowering asset managers to schedule targeted repairs before unplanned catastrophic failures occur.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Alat Analisis Partial Discharge untuk Pemeliharaan Prediktif Peralatan MV/HV</h2>\n<p>Partial Discharge (peluahan parsial) adalah fenomena loncatan listrik terlokalisasi yang terjadi di dalam atau pada permukaan bahan isolasi tegangan menengah hingga tinggi. Jika tidak terdeteksi, aktivitas partial discharge akan terus mengikis dan merusak material dielektrik hingga terjadi kegagalan isolasi total (flashover) yang memicu ledakan dan pemadaman pabrik. Pengujian PD Scan online menghadirkan sistem deteksi dini paling efektif untuk mencegah kerusakan fatal tersebut.</p>\n<h3>Apa Saja yang Dapat Dideteksi oleh Uji Partial Discharge?</h3>\n<p>Pengujian PD non-intrusif dapat dilakukan secara online saat peralatan sedang beroperasi penuh tanpa perlu memadamkan aliran listrik:</p>\n<ul>\n  <li><p><strong>Kubikel MV Switchgear &amp; Busbar</strong> — Rongga udara (void) di dalam resin isolator, retakan isolasi, dan kontaminasi permukaan busbar.</p></li>\n  <li><p><strong>Terminasi &amp; Jointing Kabel Tegangan Menengah</strong> — Kegagalan stress control, kelembapan yang masuk, atau ketidaksempurnaan pemasangan termination kit.</p></li>\n  <li><p><strong>Transformator Daya</strong> — Degradasi isolasi internal belitan, pemburukan kondisi bushing, serta peluahan di dalam tangki oli.</p></li>\n  <li><p><strong>Gardu Induk Outdoor</strong> — Gejala korona dan surface tracking pada pemutus (disconnector), isolator keramik, dan arrester.</p></li>\n</ul>\n<h3>Teknologi Sensor Deteksi Multi-Metode</h3>\n<p>Metode diagnostik kami mengombinasikan beragam sensor terkalibrasi untuk cakupan analisis komprehensif:</p>\n<ul>\n  <li><p><strong>Sensor Transient Earth Voltage (TEV)</strong> — Menangkap denyut elektromagnetik frekuensi tinggi pada dinding logam kubikel switchgear.</p></li>\n  <li><p><strong>Sensor Kontak Akustik (Acoustic Contact)</strong> — Menangkap gelombang ultrasonik yang dihasilkan dari pelepasan muatan listrik di dalam tangki trafo dan terminasi kabel.</p></li>\n  <li><p><strong>High Frequency Current Transformer (HFCT)</strong> — Diklem pada kabel grounding untuk mendeteksi pulsa arus frekuensi tinggi akibat partial discharge.</p></li>\n  <li><p><strong>Parabolic Airborne Ultrasonic Dish</strong> — Menemukan titik persis korona dan peluahan di area gardu terbuka dari jarak aman.</p></li>\n</ul>\n<h3>Konsultasikan Pemeliharaan Prediktif Bersama PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra melayani jasa inspeksi Partial Discharge online dan audit kondisi kesehatan aset kelistrikan industri di seluruh Indonesia, membantu Anda menjadwalkan perbaikan terencana sebelum terjadi pemadaman darurat.</p>\n<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'partial-discharge-analyzer';

COMMIT;


-- ==========================================
-- Migration: 024_bilingual_careers_seed.up.sql
-- ==========================================

-- 024_bilingual_careers_seed.up.sql
-- Synchronize Careers titles, departments, locations, summaries, and descriptions with complete 100% matching bilingual translations (ID & EN)

BEGIN;


-- CAREER: safety-officer-gresik
UPDATE careers SET
  title = E'EN: Safety Officer (HSE)
ID: Safety Officer (K3)',
  department = E'EN: Project Execution - HSE Team
ID: Eksekusi Proyek - Tim K3',
  location = E'EN: Gresik, East Java
ID: Gresik, Jawa Timur',
  summary = E'EN: Ensure all on-site contractor and manpower activities strictly adhere to Occupational Health, Safety, and Environment (HSE) standards established by company policy and statutory regulations.
ID: Memastikan seluruh aktivitas pekerjaan yang dilakukan tenaga kerja di lapangan berjalan sesuai dengan standar Keselamatan dan Kesehatan Kerja (K3) yang ditetapkan oleh perusahaan dan regulasi ketenagakerjaan.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Lulusan Sarjana (S1/D4) jurusan Kesehatan Masyarakat (peminatan K3), Teknik Industri, Keselamatan &amp; Kesehatan Kerja, atau bidang teknik terkait. Fresh graduate dipersilakan melamar.</p></li>\n  <li><p>Memiliki sertifikasi Ahli K3 Umum dari Kemnaker RI yang masih berlaku.</p></li>\n  <li><p>Berpengalaman magang atau bekerja di proyek industri manufaktur, kelistrikan, atau konstruksi sipil/elektrikal.</p></li>\n  <li><p>Memahami Job Safety Analysis (JSA), Hazard Identification Risk Assessment &amp; Determining Control (HIRADC), dan Permit to Work (PTW).</p></li>\n  <li><p>Mampu berkomunikasi secara tegas, adaptif, solutif, serta memiliki inisiatif tinggi dalam pencegahan insiden kerja.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Melakukan pengawasan, inspeksi keselamatan harian, dan patroli K3 di area kerja proyek guna memastikan kepatuhan APD dan SOP.</p></li>\n  <li><p>Memimpin pelaksanaan Safety Induction bagi pekerja baru dan memandu Tool Box Meeting (TBM) harian sebelum pekerjaan dimulai.</p></li>\n  <li><p>Menyusun dan melengkapi administrasi dokumen HSE, laporan harian/mingguan K3, serta audit keselamatan kerja.</p></li>\n  <li><p>Melakukan investigasi insiden, pelaporan near-miss, serta memastikan tindakan korektif dan preventif (CAPA) dijalankan dengan efektif.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Bachelor''s Degree (S1/D4) in Public Health (Occupational Health &amp; Safety), Industrial Engineering, Environmental Safety, or relevant technical engineering. Fresh graduates are welcome to apply.</p></li>\n  <li><p>Holds a valid General OHS Expert (Ahli K3 Umum) certification issued by the Ministry of Manpower (Kemnaker RI).</p></li>\n  <li><p>Prior internship or working experience in industrial manufacturing, electrical construction, or infrastructure projects.</p></li>\n  <li><p>Proficient in Job Safety Analysis (JSA), HIRADC, and Permit to Work (PTW) procedures.</p></li>\n  <li><p>Strong verbal communication, proactive leadership, decisiveness, and risk prevention mindset.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Conduct daily on-site safety inspections, hazard observations, and PPE compliance audits across project zones.</p></li>\n  <li><p>Lead safety inductions for newly onboarded technicians and conduct daily pre-job Tool Box Meetings (TBM).</p></li>\n  <li><p>Maintain HSE documentation, daily/weekly safety logs, accident registers, and regulatory compliance records.</p></li>\n  <li><p>Investigate incidents and near-misses, formulate root-cause analyses, and implement corrective and preventive action plans (CAPA).</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Lulusan Sarjana (S1/D4) jurusan Kesehatan Masyarakat (peminatan K3), Teknik Industri, Keselamatan &amp; Kesehatan Kerja, atau bidang teknik terkait. Fresh graduate dipersilakan melamar.</p></li>\n  <li><p>Memiliki sertifikasi Ahli K3 Umum dari Kemnaker RI yang masih berlaku.</p></li>\n  <li><p>Berpengalaman magang atau bekerja di proyek industri manufaktur, kelistrikan, atau konstruksi sipil/elektrikal.</p></li>\n  <li><p>Memahami Job Safety Analysis (JSA), Hazard Identification Risk Assessment &amp; Determining Control (HIRADC), dan Permit to Work (PTW).</p></li>\n  <li><p>Mampu berkomunikasi secara tegas, adaptif, solutif, serta memiliki inisiatif tinggi dalam pencegahan insiden kerja.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Melakukan pengawasan, inspeksi keselamatan harian, dan patroli K3 di area kerja proyek guna memastikan kepatuhan APD dan SOP.</p></li>\n  <li><p>Memimpin pelaksanaan Safety Induction bagi pekerja baru dan memandu Tool Box Meeting (TBM) harian sebelum pekerjaan dimulai.</p></li>\n  <li><p>Menyusun dan melengkapi administrasi dokumen HSE, laporan harian/mingguan K3, serta audit keselamatan kerja.</p></li>\n  <li><p>Melakukan investigasi insiden, pelaporan near-miss, serta memastikan tindakan korektif dan preventif (CAPA) dijalankan dengan efektif.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'safety-officer-gresik';

-- CAREER: project-support-admin
UPDATE careers SET
  title = E'EN: Project Support Admin (Internship)
ID: Project Support Admin (Magang)',
  department = E'EN: Project Administration
ID: Administrasi Proyek',
  location = E'EN: Gresik, East Java
ID: Gresik, Jawa Timur',
  summary = E'EN: Assist in managing and tracking project documentation from initiation through administrative project handover under the supervision of the project administration team.
ID: Membantu pengelolaan dan monitoring administrasi proyek, mulai dari rekapitulasi data, pengarsipan dokumen teknis, hingga penyusunan Berita Acara Serah Terima (BAST).',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Mahasiswa tingkat akhir atau lulusan Diploma / Sarjana jurusan Teknik Elektro, Teknik Industri, Manajemen Bisnis, atau Administrasi Perkantoran. Terbuka untuk fresh graduate.</p></li>\n  <li><p>Diutamakan memiliki pengalaman organisasi atau magang di bidang administrasi operasional / proyek.</p></li>\n  <li><p>Memahami alur dasar manajemen proyek teknik dan siklus administrasi pengadaan.</p></li>\n  <li><p>Terampil mengoperasikan Microsoft Office (khususnya Excel dan Word) serta Google Workspace.</p></li>\n  <li><p>Memiliki kemampuan komunikasi yang baik, inisiatif tinggi, teliti, dan terstruktur dalam bekerja.</p></li>\n  <li><p>Bersedia menjalani program magang selama 3 hingga 6 bulan di lokasi proyek Gresik.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Mengumpulkan, merapikan, dan memverifikasi data operasional untuk penyusunan laporan kemajuan pekerjaan proyek.</p></li>\n  <li><p>Melakukan monitoring dan pengarsipan dokumen Berita Acara Serah Terima (BAST) dan kelengkapan penagihan proyek.</p></li>\n  <li><p>Membantu koordinasi pengadaan material lapangan dan pencatatan surat masuk-keluar proyek.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Final-year student or recent graduate with a Diploma or Bachelor''s degree in Electrical Engineering, Industrial Engineering, Business Administration, or Office Administration.</p></li>\n  <li><p>Prior organizational or internship experience in project/operational administration is advantageous.</p></li>\n  <li><p>Familiarity with basic project management lifecycle and documentation procedures.</p></li>\n  <li><p>Proficient in Microsoft Office (especially Excel and Word) and Google Workspace tools.</p></li>\n  <li><p>Strong attention to detail, proactive mindset, and systematic work organization.</p></li>\n  <li><p>Available for a 3 to 6-month internship on-site in Gresik.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Gather, verify, and organize operational field data for project progress milestone reporting.</p></li>\n  <li><p>Track and maintain project handover certificates (BAST) and billing administrative archives.</p></li>\n  <li><p>Assist in coordinating field material purchase requests and project correspondence filing.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Mahasiswa tingkat akhir atau lulusan Diploma / Sarjana jurusan Teknik Elektro, Teknik Industri, Manajemen Bisnis, atau Administrasi Perkantoran. Terbuka untuk fresh graduate.</p></li>\n  <li><p>Diutamakan memiliki pengalaman organisasi atau magang di bidang administrasi operasional / proyek.</p></li>\n  <li><p>Memahami alur dasar manajemen proyek teknik dan siklus administrasi pengadaan.</p></li>\n  <li><p>Terampil mengoperasikan Microsoft Office (khususnya Excel dan Word) serta Google Workspace.</p></li>\n  <li><p>Memiliki kemampuan komunikasi yang baik, inisiatif tinggi, teliti, dan terstruktur dalam bekerja.</p></li>\n  <li><p>Bersedia menjalani program magang selama 3 hingga 6 bulan di lokasi proyek Gresik.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Mengumpulkan, merapikan, dan memverifikasi data operasional untuk penyusunan laporan kemajuan pekerjaan proyek.</p></li>\n  <li><p>Melakukan monitoring dan pengarsipan dokumen Berita Acara Serah Terima (BAST) dan kelengkapan penagihan proyek.</p></li>\n  <li><p>Membantu koordinasi pengadaan material lapangan dan pencatatan surat masuk-keluar proyek.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'project-support-admin';

-- CAREER: arsiparis
UPDATE careers SET
  title = E'EN: Records & Document Controller (Archivist)
ID: Arsiparis & Tata Kelola Dokumen',
  department = E'EN: Business Support & Development
ID: Business Support & Development',
  location = E'EN: Surabaya, East Java
ID: Surabaya, Jawa Timur',
  summary = E'EN: Organize, catalog, and digitize corporate archives to ensure confidential records are safely preserved, neatly indexed, and readily retrievable.
ID: Mengelola, merapikan, dan mendigitalisasi arsip dokumen perusahaan agar tersimpan aman, sistematis, dan mudah diakses saat dibutuhkan.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Minimal siswa SMK jurusan Administrasi Perkantoran / Kearsipan, atau mahasiswa (Diploma / Sarjana) semester akhir di bidang terkait.</p></li>\n  <li><p>Memiliki pengetahuan tentang sistem kearsipan fisik dan tata kelola dokumen digital (electronic filing system).</p></li>\n  <li><p>Mampu bekerja secara teliti, rapi, terstruktur, serta menjaga kerahasiaan data perusahaan.</p></li>\n  <li><p>Familiar menggunakan scanner, Google Drive, dan Microsoft Excel untuk inventarisasi dokumen.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Menginventarisasi, menata, dan mengarsipkan dokumen keuangan, faktur pembayaran, dan berkas pengadaan barang/jasa.</p></li>\n  <li><p>Melakukan digitalisasi (scanning &amp; indexing) berkas legalitas, data SDM, dan kontrak kerja sama perusahaan.</p></li>\n  <li><p>Mencatat dan mengontrol alur surat masuk dan keluar di Departemen Business Support &amp; Development.</p></li>\n  <li><p>Memastikan sistem peminjaman dan pengembalian dokumen arsip berjalan tertib dan terdokumentasi.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Vocational High School (SMK) graduate or final-year student (Diploma/Bachelor''s) majoring in Archival Science, Office Administration, or Information Management.</p></li>\n  <li><p>Foundational knowledge of physical indexing systems and digital document management.</p></li>\n  <li><p>High meticulousness, neat organizational habits, and strict adherence to corporate confidentiality.</p></li>\n  <li><p>Familiar with document scanning, cloud file repositories (Google Drive), and spreadsheet inventory indexing.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Catalog, index, and securely store financial records, vendor invoices, and procurement files.</p></li>\n  <li><p>Digitize, OCR-scan, and classify corporate agreements, HR dossiers, and compliance filings.</p></li>\n  <li><p>Log incoming and outgoing corporate correspondence for the Business Support &amp; Development department.</p></li>\n  <li><p>Maintain document checkout logs and facilitate quick retrieval for internal stakeholders and auditors.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Minimal siswa SMK jurusan Administrasi Perkantoran / Kearsipan, atau mahasiswa (Diploma / Sarjana) semester akhir di bidang terkait.</p></li>\n  <li><p>Memiliki pengetahuan tentang sistem kearsipan fisik dan tata kelola dokumen digital (electronic filing system).</p></li>\n  <li><p>Mampu bekerja secara teliti, rapi, terstruktur, serta menjaga kerahasiaan data perusahaan.</p></li>\n  <li><p>Familiar menggunakan scanner, Google Drive, dan Microsoft Excel untuk inventarisasi dokumen.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Menginventarisasi, menata, dan mengarsipkan dokumen keuangan, faktur pembayaran, dan berkas pengadaan barang/jasa.</p></li>\n  <li><p>Melakukan digitalisasi (scanning &amp; indexing) berkas legalitas, data SDM, dan kontrak kerja sama perusahaan.</p></li>\n  <li><p>Mencatat dan mengontrol alur surat masuk dan keluar di Departemen Business Support &amp; Development.</p></li>\n  <li><p>Memastikan sistem peminjaman dan pengembalian dokumen arsip berjalan tertib dan terdokumentasi.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'arsiparis';

-- CAREER: it-intern
UPDATE careers SET
  title = E'EN: IT Web Developer Intern
ID: IT Web Developer (Magang)',
  department = E'EN: Business Support & Development
ID: Business Support & Development',
  location = E'EN: Surabaya, East Java
ID: Surabaya, Jawa Timur',
  summary = E'EN: Support end-to-end internal web application development and maintenance, spanning front-end UI, back-end APIs, and database management.
ID: Mendukung pelaksanaan pengembangan aplikasi berbasis web secara menyeluruh, mulai dari front-end, back-end API, hingga pengelolaan database.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Mahasiswa Sarjana (S1) semester akhir atau lulusan baru jurusan Teknik Informatika, Sistem Informasi, Ilmu Komputer, atau bidang terkait.</p></li>\n  <li><p>Memahami konsep pengembangan web modern (HTML, CSS/Tailwind, JavaScript/TypeScript, RESTful API).</p></li>\n  <li><p>Familiar dengan framework front-end (React/Next.js/Vue) dan bahasa back-end (Node.js/Go/PHP) serta relational database (PostgreSQL/MySQL).</p></li>\n  <li><p>Memiliki portofolio atau pengalaman proyek pengembangan aplikasi web yang dapat ditunjukkan.</p></li>\n  <li><p>Mampu menggunakan Git untuk version control dan kolaborasi tim.</p></li>\n  <li><p>Memiliki kemampuan problem-solving, kemauan belajar tinggi, dan bersedia magang selama 3 - 6 bulan.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Membantu perancangan antarmuka pengguna (UI/UX) dan pengembangan fitur aplikasi internal perusahaan.</p></li>\n  <li><p>Membangun dan mengintegrasikan RESTful API untuk menghubungkan antarmuka web dengan database.</p></li>\n  <li><p>Melakukan pengujian fitur, debugging bug, dan troubleshooting isu teknis pada aplikasi.</p></li>\n  <li><p>Mengelola skema database dan alur branching repository menggunakan Git.</p></li>\n  <li><p>Menyusun dokumentasi teknis dan panduan penggunaan sistem untuk pengguna internal.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Final-year undergraduate student or fresh graduate majoring in Computer Science, Informatics, Information Systems, or related software engineering fields.</p></li>\n  <li><p>Solid grasp of modern web fundamentals (HTML, CSS/Tailwind, JavaScript/TypeScript, RESTful architecture).</p></li>\n  <li><p>Familiar with modern frontend frameworks (React/Next.js/Vue), backend technologies (Node.js/Go/PHP), and relational databases (PostgreSQL/MySQL).</p></li>\n  <li><p>Showcaseable portfolio or past project repository demonstrating web development competence.</p></li>\n  <li><p>Proficient in version control workflows using Git.</p></li>\n  <li><p>Strong problem-solving capability, eager to learn new tech stacks, and committed to a 3 to 6-month internship.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Assist in developing responsive frontend interfaces and implementing new features for internal enterprise tools.</p></li>\n  <li><p>Develop and integrate REST API endpoints linking frontend clients with backend databases.</p></li>\n  <li><p>Perform unit testing, code debugging, and issue reproduction for continuous stability.</p></li>\n  <li><p>Support database schema maintenance, migrations, and Git branch management.</p></li>\n  <li><p>Author technical documentation, API specifications, and end-user system manuals.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Mahasiswa Sarjana (S1) semester akhir atau lulusan baru jurusan Teknik Informatika, Sistem Informasi, Ilmu Komputer, atau bidang terkait.</p></li>\n  <li><p>Memahami konsep pengembangan web modern (HTML, CSS/Tailwind, JavaScript/TypeScript, RESTful API).</p></li>\n  <li><p>Familiar dengan framework front-end (React/Next.js/Vue) dan bahasa back-end (Node.js/Go/PHP) serta relational database (PostgreSQL/MySQL).</p></li>\n  <li><p>Memiliki portofolio atau pengalaman proyek pengembangan aplikasi web yang dapat ditunjukkan.</p></li>\n  <li><p>Mampu menggunakan Git untuk version control dan kolaborasi tim.</p></li>\n  <li><p>Memiliki kemampuan problem-solving, kemauan belajar tinggi, dan bersedia magang selama 3 - 6 bulan.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Membantu perancangan antarmuka pengguna (UI/UX) dan pengembangan fitur aplikasi internal perusahaan.</p></li>\n  <li><p>Membangun dan mengintegrasikan RESTful API untuk menghubungkan antarmuka web dengan database.</p></li>\n  <li><p>Melakukan pengujian fitur, debugging bug, dan troubleshooting isu teknis pada aplikasi.</p></li>\n  <li><p>Mengelola skema database dan alur branching repository menggunakan Git.</p></li>\n  <li><p>Menyusun dokumentasi teknis dan panduan penggunaan sistem untuk pengguna internal.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'it-intern';

-- CAREER: project-admin-gresik
UPDATE careers SET
  title = E'EN: Project Administrator
ID: Project Administrator',
  department = E'EN: Project Administration
ID: Administrasi Proyek',
  location = E'EN: Gresik, East Java
ID: Gresik, Jawa Timur',
  summary = E'EN: Manage, monitor, and audit turnkey project administration from site mobilization through final contractual closure and project sign-off.
ID: Mengelola dan memonitor administrasi proyek, mulai dari awal hingga proyek dinyatakan selesai secara administratif.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Pendidikan Diploma atau Sarjana (D3/S1) bidang Teknik Elektro, Teknik Industri, Automasi, atau Manajemen Bisnis / Administrasi.</p></li>\n  <li><p>Diutamakan memiliki pengalaman kerja 1–2 tahun sebagai Project Admin di proyek kontraktor elektrikal, mekanikal, atau konstruksi.</p></li>\n  <li><p>Memahami siklus administrasi proyek: Purchase Order (PO), Work Order (SPK), Berita Acara (BAST), dan penagihan progress (invoicing).</p></li>\n  <li><p>Sangat mahir mengoperasikan Microsoft Excel (VLOOKUP, Pivot, fungsi data), Word, dan Google Workspace.</p></li>\n  <li><p>Memiliki kemampuan komunikasi profesional, teliti, disiplin tenggat waktu, dan terbiasa bekerja secara terstruktur.</p></li>\n  <li><p>Bersedia ditempatkan di lokasi proyek di wilayah Gresik dan sekitarnya.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Menyiapkan, merekap, dan mengontrol kelengkapan dokumen administrasi penagihan dan laporan pekerjaan berkala.</p></li>\n  <li><p>Memantau dan memperbarui progress Berita Acara Serah Terima (BAST) dan persetujuan pengawas proyek.</p></li>\n  <li><p>Berkoordinasi dengan Project Manager dan tim purchasing terkait pengadaan material serta surat jalan lapangan.</p></li>\n  <li><p>Memastikan pencatatan jam kerja manpower, timesheet teknisi, dan biaya operasional proyek tercatat rapi.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Diploma or Bachelor''s Degree (D3/S1) in Electrical Engineering, Industrial Engineering, Automation, or Business/Office Administration.</p></li>\n  <li><p>1-2 years of proven experience as a Project Administrator in electrical contracting, MEP, or industrial construction.</p></li>\n  <li><p>Comprehensive understanding of project cycles: Purchase Orders (PO), Work Orders (SPK), Milestones, and Progress Billing.</p></li>\n  <li><p>Advanced proficiency in Microsoft Excel (formulas, data modeling, pivot tables) and Google Workspace.</p></li>\n  <li><p>Excellent cross-departmental communication skills, detail-oriented execution, and deadline management.</p></li>\n  <li><p>Willing to be stationed on-site at project facilities in Gresik and surrounding areas.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Compile, verify, and monitor project invoicing dossiers, milestone accomplishment reports, and client endorsements.</p></li>\n  <li><p>Manage and track issuance of Project Handover Certificates (BAST) with client engineering representatives.</p></li>\n  <li><p>Coordinate closely with Project Managers and procurement teams for on-site material dispatch and logistics documentation.</p></li>\n  <li><p>Administer site manpower timesheets, equipment logs, and field petty cash reconciliations.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Pendidikan Diploma atau Sarjana (D3/S1) bidang Teknik Elektro, Teknik Industri, Automasi, atau Manajemen Bisnis / Administrasi.</p></li>\n  <li><p>Diutamakan memiliki pengalaman kerja 1–2 tahun sebagai Project Admin di proyek kontraktor elektrikal, mekanikal, atau konstruksi.</p></li>\n  <li><p>Memahami siklus administrasi proyek: Purchase Order (PO), Work Order (SPK), Berita Acara (BAST), dan penagihan progress (invoicing).</p></li>\n  <li><p>Sangat mahir mengoperasikan Microsoft Excel (VLOOKUP, Pivot, fungsi data), Word, dan Google Workspace.</p></li>\n  <li><p>Memiliki kemampuan komunikasi profesional, teliti, disiplin tenggat waktu, dan terbiasa bekerja secara terstruktur.</p></li>\n  <li><p>Bersedia ditempatkan di lokasi proyek di wilayah Gresik dan sekitarnya.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Menyiapkan, merekap, dan mengontrol kelengkapan dokumen administrasi penagihan dan laporan pekerjaan berkala.</p></li>\n  <li><p>Memantau dan memperbarui progress Berita Acara Serah Terima (BAST) dan persetujuan pengawas proyek.</p></li>\n  <li><p>Berkoordinasi dengan Project Manager dan tim purchasing terkait pengadaan material serta surat jalan lapangan.</p></li>\n  <li><p>Memastikan pencatatan jam kerja manpower, timesheet teknisi, dan biaya operasional proyek tercatat rapi.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'project-admin-gresik';

-- CAREER: electrical-operator-surabaya
UPDATE careers SET
  title = E'EN: Electrical Operations & Maintenance Technician
ID: Operator Kelistrikan & Pemeliharaan',
  department = E'EN: Project Execution - Operations & Maintenance
ID: Eksekusi Proyek - Operasi & Pemeliharaan',
  location = E'EN: Surabaya, East Java
ID: Surabaya, Jawa Timur',
  summary = E'EN: Ensure continuous availability and reliability of industrial electrical systems through operation, daily inspection, and routine preventive servicing of panels, switchgear, and transformers.
ID: Menjamin ketersediaan dan keandalan sistem kelistrikan melalui pengoperasian, inspeksi, dan pemeliharaan rutin peralatan elektrikal, dengan tetap mengutamakan aspek keselamatan kerja dan efisiensi pekerjaan.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Minimal lulusan SMK Jurusan Teknik Ketenagalistrikan / Teknik Elektro atau Diploma (D3) Teknik Listrik.</p></li>\n  <li><p>Berpengalaman minimal 1 tahun di bidang instalasi kelistrikan industri, panel tegangan rendah/menengah, atau teknisi maintenance pabrik.</p></li>\n  <li><p>Diutamakan memiliki sertifikasi kompetensi kelistrikan (K3 Listrik Kemnaker atau sertifikat kompetensi BNSP).</p></li>\n  <li><p>Mampu membaca single line diagram (SLD), wiring diagram, dan menggunakan instrumen ukur (Multimeter, Megger, Clamp Meter).</p></li>\n  <li><p>Bersedia bekerja secara shift dan siap bekerja di area ketinggian dengan mematuhi SOP keselamatan kerja.</p></li>\n  <li><p>Berdomisili di wilayah Surabaya, Sidoarjo, Gresik, atau sekitarnya.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Melaksanakan pengoperasian, pengecekan berkala, dan pencatatan parameter kelistrikan pada panel MDP, SDP, dan kubikel MV.</p></li>\n  <li><p>Melakukan tindakan pemeliharaan preventif, pembersihan busbar, uji resistansi isolasi, dan pengetatan sambungan baut.</p></li>\n  <li><p>Melakukan penanganan pertama (troubleshooting) saat terjadi gangguan trip atau anomali parameter daya.</p></li>\n  <li><p>Membuat pelaporan logbook harian, dokumentasi kondisi visual peralatan, dan penggunaan spare part secara sistematis.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Vocational High School (SMK) graduate in Electrical Power Engineering or Diploma (D3) in Electrical Engineering.</p></li>\n  <li><p>Minimum 1 year hands-on experience in industrial electrical maintenance, switchgear operation, or industrial panel servicing.</p></li>\n  <li><p>Certification in Electrical Safety (K3 Listrik) or BNSP electrical competency certification is strongly preferred.</p></li>\n  <li><p>Proficient in reading Single Line Diagrams (SLD), schematic drawings, and operating electrical test tools (Megger, Multimeter, Clamp Meter).</p></li>\n  <li><p>Willing to work on rotational shifts and comfortable working at heights following rigorous safety procedures.</p></li>\n  <li><p>Residing in Surabaya, Sidoarjo, Gresik, or surrounding areas.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Execute routine operation, periodic logging, and visual inspection of Main Distribution Panels (MDP), Sub-Panels, and MV cubicles.</p></li>\n  <li><p>Perform preventive maintenance routines including busbar torqueing, contact cleaning, and insulation resistance checks.</p></li>\n  <li><p>Carry out first-line troubleshooting and fault clearing upon breaker tripping or power parameter anomalies.</p></li>\n  <li><p>Submit standardized daily logbook entries, incident documentation, and consumable usage reports.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Minimal lulusan SMK Jurusan Teknik Ketenagalistrikan / Teknik Elektro atau Diploma (D3) Teknik Listrik.</p></li>\n  <li><p>Berpengalaman minimal 1 tahun di bidang instalasi kelistrikan industri, panel tegangan rendah/menengah, atau teknisi maintenance pabrik.</p></li>\n  <li><p>Diutamakan memiliki sertifikasi kompetensi kelistrikan (K3 Listrik Kemnaker atau sertifikat kompetensi BNSP).</p></li>\n  <li><p>Mampu membaca single line diagram (SLD), wiring diagram, dan menggunakan instrumen ukur (Multimeter, Megger, Clamp Meter).</p></li>\n  <li><p>Bersedia bekerja secara shift dan siap bekerja di area ketinggian dengan mematuhi SOP keselamatan kerja.</p></li>\n  <li><p>Berdomisili di wilayah Surabaya, Sidoarjo, Gresik, atau sekitarnya.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Melaksanakan pengoperasian, pengecekan berkala, dan pencatatan parameter kelistrikan pada panel MDP, SDP, dan kubikel MV.</p></li>\n  <li><p>Melakukan tindakan pemeliharaan preventif, pembersihan busbar, uji resistansi isolasi, dan pengetatan sambungan baut.</p></li>\n  <li><p>Melakukan penanganan pertama (troubleshooting) saat terjadi gangguan trip atau anomali parameter daya.</p></li>\n  <li><p>Membuat pelaporan logbook harian, dokumentasi kondisi visual peralatan, dan penggunaan spare part secara sistematis.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'electrical-operator-surabaya';

-- CAREER: retail-sales-engineer
UPDATE careers SET
  title = E'EN: Retail & System Integrator Sales Engineer
ID: Sales Engineer - Segmen Retail & Integrator',
  department = E'EN: Sales and Marketing
ID: Sales & Marketing',
  location = E'EN: Sidoarjo, East Java
ID: Sidoarjo, Jawa Timur',
  summary = E'EN: Drive revenue growth for electrical components, enclosures, and automation products by aggressively expanding customer accounts across Retailers, Contractors, and System Integrators.
ID: Meningkatkan penjualan produk elektrikal melalui pemasaran aktif dan perluasan customer base di segmen Retail and Integrator, dengan pelaporan kinerja yang terukur serta dukungan penuh terhadap kegiatan Sales and Marketing perusahaan.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Pendidikan minimal D3 atau S1 jurusan Teknik Elektro, Teknik Industri, Pemasaran, atau bidang terkait. Terbuka untuk fresh graduate berjiwa sales.</p></li>\n  <li><p>Diutamakan memiliki pengalaman 1–2 tahun di bidang penjualan produk komponen listrik, panel, atau otomasi industri.</p></li>\n  <li><p>Memiliki kemampuan komunikasi persuasif, negosiasi, presentasi teknis, dan orientasi kuat pada pencapaian target penjualan.</p></li>\n  <li><p>Memiliki SIM A atau SIM C aktif dan bersedia melakukan kunjungan rutin ke calon pelanggan di Jawa Timur.</p></li>\n  <li><p>Mampu menyusun proposal penawaran harga, laporan kunjungan sales, dan follow-up prospek secara terstruktur.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Memasarkan portofolio produk kelistrikan resmi perusahaan (Rittal, Schneider Electric, dan aksesoris panel industri).</p></li>\n  <li><p>Mengidentifikasi dan mengakuisisi pelanggan baru dari segmen toko retail elektrikal, panel builder, kontraktor, dan integrator.</p></li>\n  <li><p>Menyusun rencana kunjungan harian, presentasi produk, dan konsultasi teknis kebutuhan pelanggan.</p></li>\n  <li><p>Membuat penawaran harga kompetitif, memantau PO pelanggan, dan berkoordinasi dengan tim logistik untuk kelancaran pengiriman.</p></li>\n  <li><p>Menyusun laporan pipeline penjualan mingguan dan bulanan berbasis KPI kepada manajemen.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Diploma or Bachelor''s Degree (D3/S1) in Electrical Engineering, Industrial Engineering, Business Marketing, or related disciplines. Fresh graduates with high sales drive are welcome.</p></li>\n  <li><p>Prior 1-2 years experience selling industrial electrical products, enclosures, switchgear components, or automation parts is preferred.</p></li>\n  <li><p>Persuasive negotiation skills, confident technical presentation delivery, and relentless target orientation.</p></li>\n  <li><p>Holds a valid driver''s license (SIM A / SIM C) and willing to travel for routine client visits throughout East Java.</p></li>\n  <li><p>Proficient in commercial quotation preparation, CRM pipeline updates, and sales correspondence.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Promote and sell official authorized electrical products (Rittal enclosures &amp; climate control, Schneider Electric, and switchboard components).</p></li>\n  <li><p>Prospect, qualify, and onboard new commercial accounts among electrical retailers, panel builders, contractors, and system integrators.</p></li>\n  <li><p>Conduct product demonstrations, evaluate customer technical specifications, and propose optimal engineering equipment packages.</p></li>\n  <li><p>Prepare commercial price quotations, follow through purchase orders, and coordinate delivery fulfillment with logistics teams.</p></li>\n  <li><p>Submit weekly sales visit logs, pipeline forecasts, and KPI performance reports to sales management.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Pendidikan minimal D3 atau S1 jurusan Teknik Elektro, Teknik Industri, Pemasaran, atau bidang terkait. Terbuka untuk fresh graduate berjiwa sales.</p></li>\n  <li><p>Diutamakan memiliki pengalaman 1–2 tahun di bidang penjualan produk komponen listrik, panel, atau otomasi industri.</p></li>\n  <li><p>Memiliki kemampuan komunikasi persuasif, negosiasi, presentasi teknis, dan orientasi kuat pada pencapaian target penjualan.</p></li>\n  <li><p>Memiliki SIM A atau SIM C aktif dan bersedia melakukan kunjungan rutin ke calon pelanggan di Jawa Timur.</p></li>\n  <li><p>Mampu menyusun proposal penawaran harga, laporan kunjungan sales, dan follow-up prospek secara terstruktur.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Memasarkan portofolio produk kelistrikan resmi perusahaan (Rittal, Schneider Electric, dan aksesoris panel industri).</p></li>\n  <li><p>Mengidentifikasi dan mengakuisisi pelanggan baru dari segmen toko retail elektrikal, panel builder, kontraktor, dan integrator.</p></li>\n  <li><p>Menyusun rencana kunjungan harian, presentasi produk, dan konsultasi teknis kebutuhan pelanggan.</p></li>\n  <li><p>Membuat penawaran harga kompetitif, memantau PO pelanggan, dan berkoordinasi dengan tim logistik untuk kelancaran pengiriman.</p></li>\n  <li><p>Menyusun laporan pipeline penjualan mingguan dan bulanan berbasis KPI kepada manajemen.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'retail-sales-engineer';

-- CAREER: junior-estimator
UPDATE careers SET
  title = E'EN: Junior Electrical Estimator
ID: Junior Estimator Kelistrikan',
  department = E'EN: Engineering
ID: Engineering',
  location = E'EN: Sidoarjo, East Java
ID: Sidoarjo, Jawa Timur',
  summary = E'EN: Prepare accurate quantity take-offs, unit price analyses, and Bill of Quantities (BOQ) cost estimates for turnkey electrical contracting and substation projects.
ID: Menyediakan estimasi biaya yang akurat untuk proyek kontraktor listrik guna optimasi layanan yang berkualitas tinggi dengan proses efektif dan efisien.',
  description = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Pendidikan minimal D3 atau S1 jurusan Teknik Elektro, Teknik Tenaga Listrik, Teknik Industri, atau Manajemen Rekayasa Konstruksi. Fresh graduate dipersilakan mendaftar.</p></li>\n  <li><p>Memahami perhitungan Bill of Quantity (BOQ), Rencana Anggaran Biaya (RAB), dan penentuan harga pokok material elektrikal (kabel, trafo, switchgear, panel MDP).</p></li>\n  <li><p>Mampu membaca dan menganalisis gambar teknik single line diagram (SLD), layout parit kabel, dan spesifikasi dokumen tender teknis.</p></li>\n  <li><p>Mahir mengoperasikan Microsoft Excel tingkat lanjut (rumus kalkulasi, pivot table, dan analisis biaya) serta software teknik.</p></li>\n  <li><p>Memiliki daya analisa kritis, teliti terhadap detail angka, proaktif, dan terbiasa bekerja dengan tenggat waktu tender yang ketat.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Mempelajari dokumen spesifikasi teknis dan gambar tender (RKS) untuk menyusun daftar kebutuhan material dan jasa.</p></li>\n  <li><p>Melakukan quantity take-off material elektrikal (panjang kabel, terminasi, tray, panel, instrumentasi, dan pembumian).</p></li>\n  <li><p>Meminta penawaran harga ke vendor/distributor rekanan dan menganalisis perbandingan harga terbaik untuk penawaran kompetitif.</p></li>\n  <li><p>Menyusun dokumen penawaran harga teknis-komersial (RAB/BOQ) serta berkoordinasi dengan tim Engineering dan Project Manager.</p></li>\n  <li><p>Membuat Purchase Request (PR) proyek setelah tender disetujui guna memastikan kesesuaian anggaran eksekusi.</p></li>\n</ol>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Qualifications</h2>\n<ul>\n  <li><p>Diploma or Bachelor''s Degree (D3/S1) in Electrical Engineering, Power Systems, Industrial Engineering, or Construction Engineering. Fresh graduates are welcome.</p></li>\n  <li><p>Solid grasp of Bill of Quantities (BOQ), Cost Estimation (RAB), and price estimation for industrial electrical gear (cables, transformers, switchgear, switchboards).</p></li>\n  <li><p>Proficient in interpreting Single Line Diagrams (SLD), cable routing layouts, and client technical tender specifications.</p></li>\n  <li><p>Advanced Microsoft Excel capability (complex calculation formulas, cost model sheets, data analysis) and CAD/PDF viewers.</p></li>\n  <li><p>High mathematical aptitude, keen eye for details, proactive initiative, and ability to thrive under strict bidding deadlines.</p></li>\n</ul>\n<h2>Job Description</h2>\n<ol>\n  <li><p>Review engineering specifications, tender blueprints, and scope of work to compile comprehensive material and labor bills.</p></li>\n  <li><p>Perform precise quantity take-offs for all electrical works (cabling, tray erection, terminations, switchboards, grounding grids).</p></li>\n  <li><p>Source competitive vendor quotes, perform commercial vendor comparisons, and negotiate project-specific pricing.</p></li>\n  <li><p>Formulate detailed technical and commercial bid estimates in close coordination with Engineering Leads and Project Managers.</p></li>\n  <li><p>Draft Purchase Requests (PR) upon contract award to ensure alignment between estimated budgets and procurement execution.</p></li>\n</ol>"}]},"blocks":[{"type":"html","html":"<h2>Kualifikasi</h2>\n<ul>\n  <li><p>Pendidikan minimal D3 atau S1 jurusan Teknik Elektro, Teknik Tenaga Listrik, Teknik Industri, atau Manajemen Rekayasa Konstruksi. Fresh graduate dipersilakan mendaftar.</p></li>\n  <li><p>Memahami perhitungan Bill of Quantity (BOQ), Rencana Anggaran Biaya (RAB), dan penentuan harga pokok material elektrikal (kabel, trafo, switchgear, panel MDP).</p></li>\n  <li><p>Mampu membaca dan menganalisis gambar teknik single line diagram (SLD), layout parit kabel, dan spesifikasi dokumen tender teknis.</p></li>\n  <li><p>Mahir mengoperasikan Microsoft Excel tingkat lanjut (rumus kalkulasi, pivot table, dan analisis biaya) serta software teknik.</p></li>\n  <li><p>Memiliki daya analisa kritis, teliti terhadap detail angka, proaktif, dan terbiasa bekerja dengan tenggat waktu tender yang ketat.</p></li>\n</ul>\n<h2>Deskripsi Pekerjaan</h2>\n<ol>\n  <li><p>Mempelajari dokumen spesifikasi teknis dan gambar tender (RKS) untuk menyusun daftar kebutuhan material dan jasa.</p></li>\n  <li><p>Melakukan quantity take-off material elektrikal (panjang kabel, terminasi, tray, panel, instrumentasi, dan pembumian).</p></li>\n  <li><p>Meminta penawaran harga ke vendor/distributor rekanan dan menganalisis perbandingan harga terbaik untuk penawaran kompetitif.</p></li>\n  <li><p>Menyusun dokumen penawaran harga teknis-komersial (RAB/BOQ) serta berkoordinasi dengan tim Engineering dan Project Manager.</p></li>\n  <li><p>Membuat Purchase Request (PR) proyek setelah tender disetujui guna memastikan kesesuaian anggaran eksekusi.</p></li>\n</ol>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'junior-estimator';

COMMIT;


-- ==========================================
-- Migration: 025_bilingual_products_seed.up.sql
-- ==========================================

-- 025_bilingual_products_seed.up.sql
-- Synchronize all 20 Products titles, summaries, contents, and specifications with complete 100% matching bilingual translations (ID & EN)

BEGIN;


-- PRODUCT: rittal-distributor (slug: rittal-distributor)
UPDATE products SET
  title = E'EN: Rittal Authorized Distributor
ID: Distributor Resmi Rittal',
  summary = E'EN: Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, and power distribution systems.
ID: Distributor Resmi untuk sistem enclosure industri Rittal, sistem pendingin & climate control, serta distribusi daya tegangan rendah.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Distributor Resmi Rittal di Indonesia</h3>\n<p>PT Multi Daya Mitra adalah Distributor Resmi untuk Rittal di Indonesia. Kami menyediakan sistem enclosure industri Rittal yang asli, unit pendingin climate control, serta peralatan distribusi daya tegangan rendah dengan dukungan rekayasa teknik tersertifikasi, ketersediaan stok, dan garansi resmi pabrikan.</p>\n<p>Melalui kemitraan langsung dengan Rittal Jerman, kami mendukung pabrik industri, perakit panel switchboard, dan insinyur otomasi dengan perhitungan dimensi teknis komprehensif, asistensi desain 3D CAD, serta pengiriman komponen cepat dari fasilitas gudang stok kami.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Rittal Authorized Distribution in Indonesia</h3>\n<p>PT Multi Daya Mitra is the official Authorized Distributor for Rittal in Indonesia. We provide genuine Rittal enclosure systems, climate control units, and low-voltage power distribution equipment with certified engineering support, stock availability, and official manufacturer warranty.</p>\n<p>Through our direct partnership with Rittal Germany, we support industrial plants, switchboard builders, and automation engineers with comprehensive technical sizing, 3D CAD design assistance, and rapid component delivery from our ready-stock warehouse facilities.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Rittal Authorized Distribution in Indonesia</h3>\n<p>PT Multi Daya Mitra is the official Authorized Distributor for Rittal in Indonesia. We provide genuine Rittal enclosure systems, climate control units, and low-voltage power distribution equipment with certified engineering support, stock availability, and official manufacturer warranty.</p>\n<p>Through our direct partnership with Rittal Germany, we support industrial plants, switchboard builders, and automation engineers with comprehensive technical sizing, 3D CAD design assistance, and rapid component delivery from our ready-stock warehouse facilities.</p>\nID: <h3>Distributor Resmi Rittal di Indonesia</h3>\n<p>PT Multi Daya Mitra adalah Distributor Resmi untuk Rittal di Indonesia. Kami menyediakan sistem enclosure industri Rittal yang asli, unit pendingin climate control, serta peralatan distribusi daya tegangan rendah dengan dukungan rekayasa teknik tersertifikasi, ketersediaan stok, dan garansi resmi pabrikan.</p>\n<p>Melalui kemitraan langsung dengan Rittal Jerman, kami mendukung pabrik industri, perakit panel switchboard, dan insinyur otomasi dengan perhitungan dimensi teknis komprehensif, asistensi desain 3D CAD, serta pengiriman komponen cepat dari fasilitas gudang stok kami.</p>"}]}'::jsonb,
  specs = '{"EN: Brand\nID: Merek":"Rittal","EN: Origin\nID: Asal Negara":"EN: Germany\nID: Jerman","EN: Partnership\nID: Kemitraan":"EN: Authorized Distributor\nID: Distributor Resmi","EN: Warranty\nID: Garansi":"EN: Official Manufacturer Warranty\nID: Garansi Resmi Pabrikan"}'::jsonb,
  updated_at = now()
WHERE full_path = 'rittal-distributor' OR slug = 'rittal-distributor';

-- PRODUCT: schneider-integrator (slug: schneider-integrator)
UPDATE products SET
  title = E'EN: Schneider Electric System Integrator
ID: System Integrator Resmi Schneider Electric',
  summary = E'EN: Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.
ID: System Integrator & Solutions Partner tersertifikasi penyedia otomasi industri, pemantauan energi, dan distribusi elektrikal terpadu.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>System Integrator Schneider Electric Tersertifikasi</h3>\n<p>Sebagai System Integrator Schneider Electric tersertifikasi, PT Multi Daya Mitra menghadirkan arsitektur otomatisasi terintegrasi, pemantauan daya (PME), dan distribusi elektrikal. Kami memadukan perangkat keras kelas dunia dengan rekayasa teknik kustom, pemrograman PLC/SCADA, pengujian FAT/SAT, dan komisioning pabrik secara menyeluruh.</p>\n<p>Insinyur tersertifikasi kami memastikan setiap instalasi mematuhi panduan kualitas internasional Schneider Electric, memaksimalkan ketersediaan fasilitas pabrik, meminimalkan pemborosan energi, dan memenuhi kriteria keamanan siber industri yang ketat.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Schneider Electric System Integrator</h3>\n<p>As a certified Schneider Electric System Integrator, PT Multi Daya Mitra delivers integrated automation, power monitoring (PME), and electrical distribution architectures. We combine world-class hardware with custom engineering, PLC/SCADA programming, FAT/SAT testing, and plant commissioning.</p>\n<p>Our certified engineers ensure that every installation adheres to Schneider Electric international quality guidelines, maximizing plant availability, reducing energy waste, and meeting stringent industrial cybersecurity criteria.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Schneider Electric System Integrator</h3>\n<p>As a certified Schneider Electric System Integrator, PT Multi Daya Mitra delivers integrated automation, power monitoring (PME), and electrical distribution architectures. We combine world-class hardware with custom engineering, PLC/SCADA programming, FAT/SAT testing, and plant commissioning.</p>\n<p>Our certified engineers ensure that every installation adheres to Schneider Electric international quality guidelines, maximizing plant availability, reducing energy waste, and meeting stringent industrial cybersecurity criteria.</p>\nID: <h3>System Integrator Schneider Electric Tersertifikasi</h3>\n<p>Sebagai System Integrator Schneider Electric tersertifikasi, PT Multi Daya Mitra menghadirkan arsitektur otomatisasi terintegrasi, pemantauan daya (PME), dan distribusi elektrikal. Kami memadukan perangkat keras kelas dunia dengan rekayasa teknik kustom, pemrograman PLC/SCADA, pengujian FAT/SAT, dan komisioning pabrik secara menyeluruh.</p>\n<p>Insinyur tersertifikasi kami memastikan setiap instalasi mematuhi panduan kualitas internasional Schneider Electric, memaksimalkan ketersediaan fasilitas pabrik, meminimalkan pemborosan energi, dan memenuhi kriteria keamanan siber industri yang ketat.</p>"}]}'::jsonb,
  specs = '{"EN: Brand\nID: Merek":"Schneider Electric","EN: Partnership\nID: Kemitraan":"Certified System Integrator","EN: Ecosystem\nID: Ekosistem":"EcoStruxure Partner","EN: Origin\nID: Asal Negara":"France / Global"}'::jsonb,
  updated_at = now()
WHERE full_path = 'schneider-integrator' OR slug = 'schneider-integrator';

-- PRODUCT: electrical-distribution (slug: electrical-distribution)
UPDATE products SET
  title = E'EN: Electrical Distribution
ID: Distribusi Kelistrikan',
  summary = E'EN: Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.
ID: Peralatan distribusi kelistrikan tegangan menengah & rendah, panel switchboard, transformator, dan sistem proteksi daya.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Solusi Distribusi Kelistrikan Lengkap</h3>\n<p>Solusi distribusi kelistrikan komprehensif untuk fasilitas industri, pembangkit listrik, dan infrastruktur komersial. Mencakup switchgear TM/TR, transformator distribusi, motor control center (MCC), dan relai proteksi digital.</p>\n<p>Mulai dari gardu induk penyulang PLN hingga panel sub-distribusi akhir, solusi kami menghadirkan keandalan pasokan listrik tanpa henti, keselamatan operator, dan selektivitas proteksi optimal saat terjadi beban lebih maupun hubung singkat.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Complete Electrical Distribution Solutions</h3>\n<p>Comprehensive electrical distribution solutions for industrial plants, power stations, and commercial infrastructure. Covering MV/LV switchgear, distribution transformers, motor control centers (MCC), and digital protection relays.</p>\n<p>From primary utility grid incoming substations down to final sub-distribution panels, our solutions deliver uninterrupted power reliability, operator safety, and complete selectivity under short-circuit conditions.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Complete Electrical Distribution Solutions</h3>\n<p>Comprehensive electrical distribution solutions for industrial plants, power stations, and commercial infrastructure. Covering MV/LV switchgear, distribution transformers, motor control centers (MCC), and digital protection relays.</p>\n<p>From primary utility grid incoming substations down to final sub-distribution panels, our solutions deliver uninterrupted power reliability, operator safety, and complete selectivity under short-circuit conditions.</p>\nID: <h3>Solusi Distribusi Kelistrikan Lengkap</h3>\n<p>Solusi distribusi kelistrikan komprehensif untuk fasilitas industri, pembangkit listrik, dan infrastruktur komersial. Mencakup switchgear TM/TR, transformator distribusi, motor control center (MCC), dan relai proteksi digital.</p>\n<p>Mulai dari gardu induk penyulang PLN hingga panel sub-distribusi akhir, solusi kami menghadirkan keandalan pasokan listrik tanpa henti, keselamatan operator, dan selektivitas proteksi optimal saat terjadi beban lebih maupun hubung singkat.</p>"}]}'::jsonb,
  specs = '{"EN: Category\nID: Kategori":"EN: Electrical Distribution\nID: Distribusi Kelistrikan","EN: Voltage Levels\nID: Tingkat Tegangan":"EN: MV up to 36kV, LV up to 1000V\nID: TM hingga 36kV, TR hingga 1000V"}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-distribution' OR slug = 'electrical-distribution';

-- PRODUCT: automation-control (slug: automation-control)
UPDATE products SET
  title = E'EN: Automation & Control
ID: Otomasi & Kontrol Industri',
  summary = E'EN: Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.
ID: Otomasi industri, sistem PLC, visualisasi proses SCADA / HMI, dan penggerak motor (inverter/VSD).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Otomasi Industri & Sistem Kontrol Terpusat</h3>\n<p>Solusi otomatisasi dan sistem kontrol mutakhir yang dirancang untuk mengoptimalkan kapasitas produksi, efisiensi energi, dan keselamatan operasional. Mulai dari kontrol mesin individual hingga SCADA dan telemetri terpusat di seluruh area pabrik.</p>\n<p>Kami memprogram dan mengomisioning pengendali logika terprogram (PLC), antarmuka manusia-mesin (HMI), unit telemetri jarak jauh (RTU), dan inverter penggerak frekuensi variabel (VFD) untuk industri manufaktur, kimia, pengolahan air, dan pembangkit listrik.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Industrial Automation & Centralized Control</h3>\n<p>State-of-the-art automation and control solutions designed to optimize production throughput, energy efficiency, and operational safety. From individual machine control to plant-wide centralized SCADA and telemetry.</p>\n<p>We program and commission programmable logic controllers (PLCs), human-machine interfaces (HMIs), telemetry units (RTUs), and variable frequency drives (VFDs) for demanding industries including manufacturing, chemical processing, water utilities, and power generation.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial Automation & Centralized Control</h3>\n<p>State-of-the-art automation and control solutions designed to optimize production throughput, energy efficiency, and operational safety. From individual machine control to plant-wide centralized SCADA and telemetry.</p>\n<p>We program and commission programmable logic controllers (PLCs), human-machine interfaces (HMIs), telemetry units (RTUs), and variable frequency drives (VFDs) for demanding industries including manufacturing, chemical processing, water utilities, and power generation.</p>\nID: <h3>Otomasi Industri & Sistem Kontrol Terpusat</h3>\n<p>Solusi otomatisasi dan sistem kontrol mutakhir yang dirancang untuk mengoptimalkan kapasitas produksi, efisiensi energi, dan keselamatan operasional. Mulai dari kontrol mesin individual hingga SCADA dan telemetri terpusat di seluruh area pabrik.</p>\n<p>Kami memprogram dan mengomisioning pengendali logika terprogram (PLC), antarmuka manusia-mesin (HMI), unit telemetri jarak jauh (RTU), dan inverter penggerak frekuensi variabel (VFD) untuk industri manufaktur, kimia, pengolahan air, dan pembangkit listrik.</p>"}]}'::jsonb,
  specs = '{"EN: Category\nID: Kategori":"EN: Automation & Control\nID: Otomasi & Kontrol","EN: Platforms\nID: Platform":"Schneider EcoStruxure, xArrow SCADA, Siemens, Rockwell"}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-control' OR slug = 'automation-control';

-- PRODUCT: enclosure-climate-control (slug: enclosure-climate-control)
UPDATE products SET
  title = E'EN: Enclosure & Climate Control
ID: Enclosure & Manajemen Suhu Industri',
  summary = E'EN: Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.
ID: Enclosure industri, rak server, kontrol iklim (climate control), dan sistem pendingin untuk lingkungan operasional ekstrem.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Enclosure Industri & Proteksi Suhu</h3>\n<p>Produk box panel (enclosure) industri tugas berat dan pengatur suhu yang dirancang untuk melindungi peralatan elektrikal dan otomasi sensitif dari panas, debu, zat kimia korosif, dan cuaca ekstrem.</p>\n<p>Memadukan enclosure Rittal berkelas dunia dengan unit pendingin presisi, filter fan, dan termostat pintar berbasis IoT, solusi kami mencegah penurunan kinerja komponen, trip akibat suhu berlebih, serta downtime produksi yang merugikan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Industrial Enclosures & Climate Protection</h3>\n<p>Heavy-duty industrial enclosure and climate control products engineered to protect sensitive electrical and automation equipment against heat, dust, corrosive chemicals, and outdoor elements.</p>\n<p>Combining world-leading Rittal enclosures with precision cooling units, filter fans, and smart IoT thermostats, our solutions prevent component degradation, thermal tripping, and costly unscheduled downtime.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial Enclosures & Climate Protection</h3>\n<p>Heavy-duty industrial enclosure and climate control products engineered to protect sensitive electrical and automation equipment against heat, dust, corrosive chemicals, and outdoor elements.</p>\n<p>Combining world-leading Rittal enclosures with precision cooling units, filter fans, and smart IoT thermostats, our solutions prevent component degradation, thermal tripping, and costly unscheduled downtime.</p>\nID: <h3>Enclosure Industri & Proteksi Suhu</h3>\n<p>Produk box panel (enclosure) industri tugas berat dan pengatur suhu yang dirancang untuk melindungi peralatan elektrikal dan otomasi sensitif dari panas, debu, zat kimia korosif, dan cuaca ekstrem.</p>\n<p>Memadukan enclosure Rittal berkelas dunia dengan unit pendingin presisi, filter fan, dan termostat pintar berbasis IoT, solusi kami mencegah penurunan kinerja komponen, trip akibat suhu berlebih, serta downtime produksi yang merugikan.</p>"}]}'::jsonb,
  specs = '{"EN: Category\nID: Kategori":"EN: Enclosure & Climate Control\nID: Enclosure & Kontrol Iklim","EN: Protection Rating\nID: Tingkat Proteksi":"IP55 - IP66 / NEMA 4X"}'::jsonb,
  updated_at = now()
WHERE full_path = 'enclosure-climate-control' OR slug = 'enclosure-climate-control';

-- PRODUCT: power-quality (slug: power-quality)
UPDATE products SET
  title = E'EN: Power Quality
ID: Kualitas Daya Listrik',
  summary = E'EN: Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.
ID: Filter harmonisa aktif (AHF), kompensasi faktor daya, kapasitor bank, dan penganalisis kualitas daya listrik.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Manajemen Kualitas Daya Mutakhir</h3>\n<p>Produk manajemen kualitas daya canggih yang meredam distorsi harmonisa, memperbaiki faktor daya hingga mendekati 1.0, meredam fluktuasi tegangan, serta mencegah trip peralatan dan downtime yang merugikan.</p>\n<p>Kami merancang Active Harmonic Filter (AHF), Static Var Generator (SVG), dan kapasitor bank otomatis cerdas guna melindungi transformator industri, kabel transmisi, dan peralatan elektronik sensitif dari dampak buruk beban non-linear.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Advanced Power Quality Management</h3>\n<p>Advanced power quality management products that eliminate harmonics, correct power factor to near-unity, suppress voltage fluctuations, and prevent costly equipment tripping and downtime.</p>\n<p>We engineer Active Harmonic Filters (AHF), Static Var Generators (SVG), and intelligent capacitor banks to protect industrial transformers, cabling, and delicate electronics from the harmful effects of non-linear loads.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Advanced Power Quality Management</h3>\n<p>Advanced power quality management products that eliminate harmonics, correct power factor to near-unity, suppress voltage fluctuations, and prevent costly equipment tripping and downtime.</p>\n<p>We engineer Active Harmonic Filters (AHF), Static Var Generators (SVG), and intelligent capacitor banks to protect industrial transformers, cabling, and delicate electronics from the harmful effects of non-linear loads.</p>\nID: <h3>Manajemen Kualitas Daya Mutakhir</h3>\n<p>Produk manajemen kualitas daya canggih yang meredam distorsi harmonisa, memperbaiki faktor daya hingga mendekati 1.0, meredam fluktuasi tegangan, serta mencegah trip peralatan dan downtime yang merugikan.</p>\n<p>Kami merancang Active Harmonic Filter (AHF), Static Var Generator (SVG), dan kapasitor bank otomatis cerdas guna melindungi transformator industri, kabel transmisi, dan peralatan elektronik sensitif dari dampak buruk beban non-linear.</p>"}]}'::jsonb,
  specs = '{"EN: Category\nID: Kategori":"EN: Power Quality Solutions\nID: Solusi Kualitas Daya","EN: Mitigation\nID: Mitigasi":"THDi < 3%, Stepless Cos Phi 1.0"}'::jsonb,
  updated_at = now()
WHERE full_path = 'power-quality' OR slug = 'power-quality';

-- PRODUCT: fire-alarm-products (slug: fire-alarm-products)
UPDATE products SET
  title = E'EN: Fire Alarm Products
ID: Produk Alarm Kebakaran',
  summary = E'EN: Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions.
ID: Panel fire alarm addressable industri, sensor detektor cerdas, perangkat notifikasi, dan solusi pemadam kebakaran terintegrasi.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Alarm & Pemadam Kebakaran Industri Bersertifikat</h3>\n<p>Produk deteksi dan proteksi kebakaran tersertifikasi yang dirancang khusus untuk fasilitas industri, pembangkit listrik, ruang kontrol (control room), dan gedung komersial bertingkat sesuai standar NFPA dan EN54.</p>\n<p>Kami menyediakan panel addressable modular, sensor optik dan detektor panas multi-kriteria, sensor api (flame sensor), manual call point, serta sistem pemadam gas clean-agent terintegrasi guna melindungi aset dan infrastruktur bernilai tinggi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Industrial Fire Alarm & Suppression</h3>\n<p>Certified fire detection and suppression products designed for industrial facilities, power plants, control rooms, and commercial high-rises in accordance with NFPA and EN54 standards.</p>\n<p>We supply modular addressable panels, multi-sensor optical and heat detectors, flame sensors, manual call points, and integrated clean-agent gas extinguishing systems engineered to safeguard high-value infrastructure.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Industrial Fire Alarm & Suppression</h3>\n<p>Certified fire detection and suppression products designed for industrial facilities, power plants, control rooms, and commercial high-rises in accordance with NFPA and EN54 standards.</p>\n<p>We supply modular addressable panels, multi-sensor optical and heat detectors, flame sensors, manual call points, and integrated clean-agent gas extinguishing systems engineered to safeguard high-value infrastructure.</p>\nID: <h3>Sistem Alarm & Pemadam Kebakaran Industri Bersertifikat</h3>\n<p>Produk deteksi dan proteksi kebakaran tersertifikasi yang dirancang khusus untuk fasilitas industri, pembangkit listrik, ruang kontrol (control room), dan gedung komersial bertingkat sesuai standar NFPA dan EN54.</p>\n<p>Kami menyediakan panel addressable modular, sensor optik dan detektor panas multi-kriteria, sensor api (flame sensor), manual call point, serta sistem pemadam gas clean-agent terintegrasi guna melindungi aset dan infrastruktur bernilai tinggi.</p>"}]}'::jsonb,
  specs = '{"EN: Category\nID: Kategori":"EN: Fire Alarm & Suppression\nID: Fire Alarm & Proteksi Kebakaran","EN: Standards\nID: Standar":"NFPA 72, NFPA 2001, EN54, UL/FM"}'::jsonb,
  updated_at = now()
WHERE full_path = 'fire-alarm-products' OR slug = 'fire-alarm-products';

-- PRODUCT: rittal-distributor/enclosures (slug: enclosures)
UPDATE products SET
  title = E'EN: Rittal Enclosure Systems (VX25, AX, KX)
ID: Sistem Enclosure Rittal (VX25, AX, KX)',
  summary = E'EN: Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.
ID: Sistem enclosure besar baying resmi Rittal (VX25), enclosure kompak (AX), kotak terminal kecil (KX), dan rak server IT outdoor.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Arsitektur Enclosure Modular Rittal</h3>\n<p>Sistem enclosure modular Rittal adalah standar emas global untuk switchgear tegangan rendah, motor control center (MCC), kabinet kontrol otomasi industri, dan infrastruktur rak server IT. Dirancang dengan pola kisi simetris 25 mm DIN, rangka VX25 meniadakan kebutuhan pengeboran dan memungkinkan instalasi interior yang cepat dan bebas perkakas di dua level pemasangan.</p>\n<h3>Sistem Enclosure Baying Besar VX25</h3>\n<p>Seri unggulan VX25 menyediakan kapabilitas penggabungan (baying) di keempat sisi, ruang dalam yang maksimal, serta kapasitas beban kokoh hingga 15.000 N. Sangat kompatibel dengan pemotongan laser otomatis dan rekayasa digital twin melalui perangkat lunak Eplan.</p>\n<h3>Enclosure Kompak AX & Enclosure Kecil KX</h3>\n<p>Seri AX mengadopsi logika sistem VX25 ke dalam enclosure kompak dinding dengan arah buka pintu yang dapat dibalik tanpa perkakas serta rel pemosisian terintegrasi. Kotak terminal KX dilengkapi kunci cam mini 180° lepas-cepat untuk distribusi sensor lapangan dan bus hemat ruang.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Rittal Modular Enclosure Architecture</h3>\n<p>Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels.</p>\n<h3>VX25 Large Baying Enclosure Systems</h3>\n<p>The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software.</p>\n<h3>AX Compact Enclosures & KX Small Enclosures</h3>\n<p>The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Rittal Modular Enclosure Architecture</h3>\n<p>Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels.</p>\n<h3>VX25 Large Baying Enclosure Systems</h3>\n<p>The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software.</p>\n<h3>AX Compact Enclosures & KX Small Enclosures</h3>\n<p>The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution.</p>\nID: <h3>Arsitektur Enclosure Modular Rittal</h3>\n<p>Sistem enclosure modular Rittal adalah standar emas global untuk switchgear tegangan rendah, motor control center (MCC), kabinet kontrol otomasi industri, dan infrastruktur rak server IT. Dirancang dengan pola kisi simetris 25 mm DIN, rangka VX25 meniadakan kebutuhan pengeboran dan memungkinkan instalasi interior yang cepat dan bebas perkakas di dua level pemasangan.</p>\n<h3>Sistem Enclosure Baying Besar VX25</h3>\n<p>Seri unggulan VX25 menyediakan kapabilitas penggabungan (baying) di keempat sisi, ruang dalam yang maksimal, serta kapasitas beban kokoh hingga 15.000 N. Sangat kompatibel dengan pemotongan laser otomatis dan rekayasa digital twin melalui perangkat lunak Eplan.</p>\n<h3>Enclosure Kompak AX & Enclosure Kecil KX</h3>\n<p>Seri AX mengadopsi logika sistem VX25 ke dalam enclosure kompak dinding dengan arah buka pintu yang dapat dibalik tanpa perkakas serta rel pemosisian terintegrasi. Kotak terminal KX dilengkapi kunci cam mini 180° lepas-cepat untuk distribusi sensor lapangan dan bus hemat ruang.</p>"}]}'::jsonb,
  specs = '{"EN: Series\nID: Seri Produk":"VX25, AX, KX, CS Toptec, IT Network Racks","EN: Frame Pitch\nID: Pola Kisi Rangka":"25 mm DIN standard symmetrical grid","EN: Protection Rating\nID: Tingkat Proteksi":"IP55 / IP66 / NEMA 4X / NEMA 12","EN: Material & Finish\nID: Material & Lapisan":"Sheet steel RAL 7035 / Stainless steel AISI 304 & 316L","EN: Certifications\nID: Sertifikasi":"IEC 62208, UL 508A, DNV-GL, CE, RoHS","EN: Target Applications\nID: Aplikasi Utama":"LV Switchboards, MCC Panels, Automation Control, IT Server Racks"}'::jsonb,
  updated_at = now()
WHERE full_path = 'rittal-distributor/enclosures' OR slug = 'enclosures';

-- PRODUCT: rittal-distributor/climate-control-cooling (slug: climate-control-cooling)
UPDATE products SET
  title = E'EN: Rittal Climate Control & Cooling (Blue e+)
ID: Sistem Pendingin & Climate Control Rittal (Blue e+)',
  summary = E'EN: Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.
ID: Unit pendingin hibrida inovatif, thermoelectric cooler, dan penukar panas air-ke-udara hemat energi hingga 75% dengan pemantauan IoT digital.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Teknologi Pendingin Industri Generasi Terbaru</h3>\n<p>Unit pendingin Rittal Blue e+ menghadirkan lompatan revolusioner dalam pengendalian suhu enclosure industri. Memanfaatkan teknologi hibrida berpaten yang memadukan sirkuit kompresi uap aktif berbasis inverter dengan pipa panas (heat pipe) pasif, Blue e+ mampu menghemat konsumsi energi rata-rata hingga 75% dibanding unit pendingin konvensional.</p>\n<h3>Teknologi Pendingin Hibrida dengan Pengatur Kecepatan</h3>\n<p>Kompresor DC dan kipas EC yang diatur oleh inverter menyesuaikan daya pendinginan secara dinamis sesuai beban panas aktual. Hal ini menjamin suhu internal yang sangat stabil dan mencegah lonjakan panas mendadak pada komponen sensitif seperti PLC, VSD, dan mikroprosesor.</p>\n<h3>Integrasi Cerdas IoT & Industri 4.0</h3>\n<p>Dilengkapi layar sentuh multibahasa, diagnostik nirkabel NFC, dan antarmuka IoT untuk pemantauan kondisi jarak jauh secara terus-menerus, peringatan gangguan otomatis, serta pemeliharaan prediktif filter mat.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Next-Generation Industrial Cooling Technology</h3>\n<p>Rittal Blue e+ cooling units represent a revolutionary leap in industrial enclosure climate control. Utilizing patented hybrid technology that pairs an active inverter-driven vapor compression circuit with a passive heat pipe, Blue e+ achieves an average of 75% energy reduction compared to conventional cooling units.</p>\n<h3>Speed-Regulated Hybrid Cooling Technology</h3>\n<p>Inverter-driven DC compressors and EC fans dynamically adapt cooling output to match exact thermal loads. This guarantees a steady internal temperature and prevents thermal shock on sensitive PLC, VSD, and microprocessor electronics.</p>\n<h3>Smart IoT & Industry 4.0 Integration</h3>\n<p>Equipped with multi-lingual touch display, NFC wireless diagnostics, and IoT interface for continuous remote condition monitoring, automated fault alerts, and predictive filter mat maintenance.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Next-Generation Industrial Cooling Technology</h3>\n<p>Rittal Blue e+ cooling units represent a revolutionary leap in industrial enclosure climate control. Utilizing patented hybrid technology that pairs an active inverter-driven vapor compression circuit with a passive heat pipe, Blue e+ achieves an average of 75% energy reduction compared to conventional cooling units.</p>\n<h3>Speed-Regulated Hybrid Cooling Technology</h3>\n<p>Inverter-driven DC compressors and EC fans dynamically adapt cooling output to match exact thermal loads. This guarantees a steady internal temperature and prevents thermal shock on sensitive PLC, VSD, and microprocessor electronics.</p>\n<h3>Smart IoT & Industry 4.0 Integration</h3>\n<p>Equipped with multi-lingual touch display, NFC wireless diagnostics, and IoT interface for continuous remote condition monitoring, automated fault alerts, and predictive filter mat maintenance.</p>\nID: <h3>Teknologi Pendingin Industri Generasi Terbaru</h3>\n<p>Unit pendingin Rittal Blue e+ menghadirkan lompatan revolusioner dalam pengendalian suhu enclosure industri. Memanfaatkan teknologi hibrida berpaten yang memadukan sirkuit kompresi uap aktif berbasis inverter dengan pipa panas (heat pipe) pasif, Blue e+ mampu menghemat konsumsi energi rata-rata hingga 75% dibanding unit pendingin konvensional.</p>\n<h3>Teknologi Pendingin Hibrida dengan Pengatur Kecepatan</h3>\n<p>Kompresor DC dan kipas EC yang diatur oleh inverter menyesuaikan daya pendinginan secara dinamis sesuai beban panas aktual. Hal ini menjamin suhu internal yang sangat stabil dan mencegah lonjakan panas mendadak pada komponen sensitif seperti PLC, VSD, dan mikroprosesor.</p>\n<h3>Integrasi Cerdas IoT & Industri 4.0</h3>\n<p>Dilengkapi layar sentuh multibahasa, diagnostik nirkabel NFC, dan antarmuka IoT untuk pemantauan kondisi jarak jauh secara terus-menerus, peringatan gangguan otomatis, serta pemeliharaan prediktif filter mat.</p>"}]}'::jsonb,
  specs = '{"EN: Cooling Capacity\nID: Kapasitas Pendingin":"300 W to 5,500 W (Blue e+ & Blue e+ S)","EN: Energy Savings\nID: Penghematan Energi":"EN: Up to 75% via patented hybrid heat pipe technology\nID: Hingga 75% melalui teknologi pipa panas hibrida berpaten","EN: Refrigerant\nID: Refrigeran":"Eco-friendly R-513A / R-134a (GWP compliant)","EN: IoT Protocols\nID: Protokol IoT":"Modbus TCP, SNMP, OPC-UA, Profinet, Ethernet/IP","EN: Operating Temp\nID: Rentang Suhu Kerja":"-20°C to +60°C ambient","EN: Mounting Options\nID: Opsi Pemasangan":"Wall-mounted, roof-mounted, partial or full internal"}'::jsonb,
  updated_at = now()
WHERE full_path = 'rittal-distributor/climate-control-cooling' OR slug = 'climate-control-cooling';

-- PRODUCT: rittal-distributor/power-distribution (slug: power-distribution)
UPDATE products SET
  title = E'EN: Rittal Power Distribution (Ri4Power & RiLine)
ID: Sistem Distribusi Daya Rittal (Ri4Power & RiLine)',
  summary = E'EN: Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.
ID: Sistem distribusi daya busbar dan switchgear tegangan rendah teruji tipe (type-tested) hingga 6300A sesuai standar IEC 61439-1/-2.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Distribusi Daya Teruji Tipe</h3>\n<p>Platform distribusi daya modular Rittal Ri4Power dan RiLine memungkinkan panel builder dan system integrator merakit switchgear tegangan rendah bersertifikasi type-tested penuh hingga 6300A dengan pemisahan internal Form 1 hingga Form 4b sesuai standar IEC 61439-1/-2.</p>\n<h3>Switchgear Tegangan Rendah Modular Ri4Power</h3>\n<p>Dirancang khusus untuk kabinet VX25, mendukung Air Circuit Breaker (ACB) dan Moulded Case Circuit Breaker (MCCB) kelas atas dengan pemegang busbar tembaga teroptimasi, penahanan busur api (arc fault), dan bagian terminasi kabel standar.</p>\n<h3>Sistem Busbar Bebas Pengeboran RiLine</h3>\n<p>Sistem busbar jarak antar pusat 60 mm dan 185 mm yang cepat dipasang tanpa perlu pengeboran hingga 2100A, dilengkapi penutup sentuh aman (touch-safe), adaptor komponen sistem klik, dan sakelar pemutus sekring NH untuk perakitan yang aman dan rapi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Tested Power Distribution Systems</h3>\n<p>Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2.</p>\n<h3>Ri4Power Modular LV Switchgear</h3>\n<p>Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections.</p>\n<h3>RiLine Drill-Free Busbar System</h3>\n<p>Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Tested Power Distribution Systems</h3>\n<p>Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2.</p>\n<h3>Ri4Power Modular LV Switchgear</h3>\n<p>Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections.</p>\n<h3>RiLine Drill-Free Busbar System</h3>\n<p>Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly.</p>\nID: <h3>Sistem Distribusi Daya Teruji Tipe</h3>\n<p>Platform distribusi daya modular Rittal Ri4Power dan RiLine memungkinkan panel builder dan system integrator merakit switchgear tegangan rendah bersertifikasi type-tested penuh hingga 6300A dengan pemisahan internal Form 1 hingga Form 4b sesuai standar IEC 61439-1/-2.</p>\n<h3>Switchgear Tegangan Rendah Modular Ri4Power</h3>\n<p>Dirancang khusus untuk kabinet VX25, mendukung Air Circuit Breaker (ACB) dan Moulded Case Circuit Breaker (MCCB) kelas atas dengan pemegang busbar tembaga teroptimasi, penahanan busur api (arc fault), dan bagian terminasi kabel standar.</p>\n<h3>Sistem Busbar Bebas Pengeboran RiLine</h3>\n<p>Sistem busbar jarak antar pusat 60 mm dan 185 mm yang cepat dipasang tanpa perlu pengeboran hingga 2100A, dilengkapi penutup sentuh aman (touch-safe), adaptor komponen sistem klik, dan sakelar pemutus sekring NH untuk perakitan yang aman dan rapi.</p>"}]}'::jsonb,
  specs = '{"EN: Rated Current (In)\nID: Arus Pengenal (In)":"Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)","EN: Short-Circuit Rating (Icw)\nID: Ketahanan Hubung Singkat":"Up to 120 kA (1s withstand)","EN: Internal Separation\nID: Pemisahan Internal":"Form 1, Form 2b, Form 3b, Form 4a, Form 4b","EN: Busbar Centers\nID: Jarak Pusat Busbar":"60 mm & 185 mm drill-free mounting systems","EN: Standards\nID: Standar":"IEC 61439-1, IEC 61439-2, DIN EN 61439"}'::jsonb,
  updated_at = now()
WHERE full_path = 'rittal-distributor/power-distribution' OR slug = 'power-distribution';

-- PRODUCT: schneider-integrator/industrial-automation (slug: industrial-automation)
UPDATE products SET
  title = E'EN: Schneider Industrial Automation (Modicon & EcoStruxure)
ID: Otomasi Industri Schneider (Modicon & EcoStruxure)',
  summary = E'EN: Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.
ID: Sistem otomasi PLC/PAC lengkap beranggotakan Schneider Modicon M340, M580 ePAC, Magelis HMI, dan arsitektur EcoStruxure Plant.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Otomasi Industri & Sistem Kontrol Schneider</h3>\n<p>Sebagai System Integrator Schneider Electric tersertifikasi, PT Multi Daya Mitra merancang arsitektur otomasi komprehensif yang ditenagai oleh pengendali PLC/PAC Modicon dan platform EcoStruxure™. Mulai dari otomasi mesin tunggal hingga sistem kontrol terdistribusi (DCS) seluruh pabrik, kami memberikan keandalan maksimal, visibilitas proses, dan operasional dengan keamanan siber tinggi.</p>\n<h3>Modicon M580 ePAC & Redundansi Hot-Standby</h3>\n<p>Dengan Ethernet bawaan langsung pada backplane, Modicon M580 menghadirkan kecepatan pemrosesan dan transparansi data tanpa tanding. Kami mengonfigurasi sistem Hot-Standby CPU ganda (redundant) untuk mencegah terhentinya operasional pabrik pada aplikasi yang sangat penting.</p>\n<h3>EcoStruxure Control Expert & Keselamatan Mesin</h3>\n<p>Kami memanfaatkan EcoStruxure Control Expert untuk standardisasi rekayasa terpadu mencakup logika proses, motion, safety, dan jaringan komunikasi, yang memenuhi standar keselamatan mesin SIL 3 / PLe.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Schneider Industrial Automation & Control</h3>\n<p>As a certified Schneider Electric System Integrator, PT Multi Daya Mitra engineers comprehensive automation architectures powered by Modicon PLC/PAC controllers and the EcoStruxure™ platform. From machine automation to plant-wide distributed control systems (DCS), we deliver maximum reliability, process visibility, and cybersecure operation.</p>\n<h3>Modicon M580 ePAC & Hot-Standby High Availability</h3>\n<p>Featuring native Ethernet embedded directly into the backplane, Modicon M580 delivers unmatched processing speed and transparency. We configure redundant Hot-Standby CPU configurations to prevent unscheduled plant shutdowns in mission-critical applications.</p>\n<h3>EcoStruxure Control Expert & Machine Safety</h3>\n<p>We leverage EcoStruxure Control Expert for unified engineering across logic, motion, safety, and communication networks, complying with SIL 3 / PLe machinery safety requirements.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Schneider Industrial Automation & Control</h3>\n<p>As a certified Schneider Electric System Integrator, PT Multi Daya Mitra engineers comprehensive automation architectures powered by Modicon PLC/PAC controllers and the EcoStruxure™ platform. From machine automation to plant-wide distributed control systems (DCS), we deliver maximum reliability, process visibility, and cybersecure operation.</p>\n<h3>Modicon M580 ePAC & Hot-Standby High Availability</h3>\n<p>Featuring native Ethernet embedded directly into the backplane, Modicon M580 delivers unmatched processing speed and transparency. We configure redundant Hot-Standby CPU configurations to prevent unscheduled plant shutdowns in mission-critical applications.</p>\n<h3>EcoStruxure Control Expert & Machine Safety</h3>\n<p>We leverage EcoStruxure Control Expert for unified engineering across logic, motion, safety, and communication networks, complying with SIL 3 / PLe machinery safety requirements.</p>\nID: <h3>Otomasi Industri & Sistem Kontrol Schneider</h3>\n<p>Sebagai System Integrator Schneider Electric tersertifikasi, PT Multi Daya Mitra merancang arsitektur otomasi komprehensif yang ditenagai oleh pengendali PLC/PAC Modicon dan platform EcoStruxure™. Mulai dari otomasi mesin tunggal hingga sistem kontrol terdistribusi (DCS) seluruh pabrik, kami memberikan keandalan maksimal, visibilitas proses, dan operasional dengan keamanan siber tinggi.</p>\n<h3>Modicon M580 ePAC & Redundansi Hot-Standby</h3>\n<p>Dengan Ethernet bawaan langsung pada backplane, Modicon M580 menghadirkan kecepatan pemrosesan dan transparansi data tanpa tanding. Kami mengonfigurasi sistem Hot-Standby CPU ganda (redundant) untuk mencegah terhentinya operasional pabrik pada aplikasi yang sangat penting.</p>\n<h3>EcoStruxure Control Expert & Keselamatan Mesin</h3>\n<p>Kami memanfaatkan EcoStruxure Control Expert untuk standardisasi rekayasa terpadu mencakup logika proses, motion, safety, dan jaringan komunikasi, yang memenuhi standar keselamatan mesin SIL 3 / PLe.</p>"}]}'::jsonb,
  specs = '{"EN: PLC Families\nID: Lini PLC":"Modicon M580 ePAC, Modicon M340, Modicon M241/M251","EN: High Availability\nID: Ketersediaan Tinggi":"EN: Hot-standby redundant CPU architectures (M580)\nID: Arsitektur CPU redundan Hot-Standby (M580)","EN: Cybersecurity\nID: Keamanan Siber":"Achilles Level 2 & ISA/IEC 62443 certified embedded security","EN: Software\nID: Perangkat Lunak":"EcoStruxure Control Expert (formerly Unity Pro)","EN: Communication\nID: Komunikasi":"Ethernet/IP, Modbus TCP, Profinet, CANopen, OPC-UA","EN: Architecture\nID: Arsitektur":"Schneider EcoStruxure Plant & Machine Expert"}'::jsonb,
  updated_at = now()
WHERE full_path = 'schneider-integrator/industrial-automation' OR slug = 'industrial-automation';

-- PRODUCT: schneider-integrator/power-energy-monitoring (slug: power-energy-monitoring)
UPDATE products SET
  title = E'EN: Power & Energy Monitoring (PME & PowerLogic)
ID: Pemantauan Daya & Energi (PME & PowerLogic)',
  summary = E'EN: Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.
ID: Power meter digital Schneider PowerLogic, ION meter, dan perangkat lunak EcoStruxure Power Monitoring Expert (PME).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>EcoStruxure Power Monitoring Expert (PME)</h3>\n<p>PT Multi Daya Mitra mengimplementasikan Schneider Electric EcoStruxure Power Monitoring Expert (PME), sistem manajemen energi khusus yang dirancang untuk membantu fasilitas industri padat energi memaksimalkan waktu operasional dan efisiensi konsumsi daya. PME mengumpulkan, menganalisis, dan memvisualisasikan data jaringan listrik di seluruh fasilitas Anda.</p>\n<h3>Meteran Presisi Tinggi PowerLogic & ION</h3>\n<p>Kami memasang power meter PowerLogic seri PM8000, PM5000, dan ION9000 dengan akurasi kelas revenue 0.1S dan sertifikasi IEC 61000-4-30 Kelas A. Menangkap fluktuasi tegangan mikrodetik (sag/swell), transien, serta polusi harmonisa sebelum memicu trip atau kerusakan peralatan.</p>\n<h3>Laporan Keberlanjutan ESG & Alokasi Biaya Energi Otomatis</h3>\n<p>Mengubah data konsumsi listrik mentah menjadi laporan emisi karbon otomatis (Scope 2), penagihan sub-biaya departemen, dan tolok ukur efisiensi energi yang selaras dengan standar ISO 50001.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>EcoStruxure Power Monitoring Expert (PME)</h3>\n<p>PT Multi Daya Mitra implements Schneider Electric EcoStruxure Power Monitoring Expert (PME), a purpose-built energy management system designed to help energy-intensive facilities maximize uptime and optimize operational efficiency. PME collects, analyzes, and visualizes power network data across your entire facility.</p>\n<h3>PowerLogic & ION High-Precision Metering</h3>\n<p>We deploy PowerLogic PM8000, PM5000 series, and ION9000 revenue-grade meters with Class 0.1S accuracy and IEC 61000-4-30 Class A compliance. Capture microsecond voltage sags, swells, transients, and harmonic pollution before they trigger equipment failures.</p>\n<h3>Automated ESG Sustainability & Energy Cost Allocation</h3>\n<p>Transform raw electrical consumption data into automated carbon emission (Scope 2) reports, sub-billing invoices, and energy efficiency benchmarking aligned with ISO 50001 standards.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>EcoStruxure Power Monitoring Expert (PME)</h3>\n<p>PT Multi Daya Mitra implements Schneider Electric EcoStruxure Power Monitoring Expert (PME), a purpose-built energy management system designed to help energy-intensive facilities maximize uptime and optimize operational efficiency. PME collects, analyzes, and visualizes power network data across your entire facility.</p>\n<h3>PowerLogic & ION High-Precision Metering</h3>\n<p>We deploy PowerLogic PM8000, PM5000 series, and ION9000 revenue-grade meters with Class 0.1S accuracy and IEC 61000-4-30 Class A compliance. Capture microsecond voltage sags, swells, transients, and harmonic pollution before they trigger equipment failures.</p>\n<h3>Automated ESG Sustainability & Energy Cost Allocation</h3>\n<p>Transform raw electrical consumption data into automated carbon emission (Scope 2) reports, sub-billing invoices, and energy efficiency benchmarking aligned with ISO 50001 standards.</p>\nID: <h3>EcoStruxure Power Monitoring Expert (PME)</h3>\n<p>PT Multi Daya Mitra mengimplementasikan Schneider Electric EcoStruxure Power Monitoring Expert (PME), sistem manajemen energi khusus yang dirancang untuk membantu fasilitas industri padat energi memaksimalkan waktu operasional dan efisiensi konsumsi daya. PME mengumpulkan, menganalisis, dan memvisualisasikan data jaringan listrik di seluruh fasilitas Anda.</p>\n<h3>Meteran Presisi Tinggi PowerLogic & ION</h3>\n<p>Kami memasang power meter PowerLogic seri PM8000, PM5000, dan ION9000 dengan akurasi kelas revenue 0.1S dan sertifikasi IEC 61000-4-30 Kelas A. Menangkap fluktuasi tegangan mikrodetik (sag/swell), transien, serta polusi harmonisa sebelum memicu trip atau kerusakan peralatan.</p>\n<h3>Laporan Keberlanjutan ESG & Alokasi Biaya Energi Otomatis</h3>\n<p>Mengubah data konsumsi listrik mentah menjadi laporan emisi karbon otomatis (Scope 2), penagihan sub-biaya departemen, dan tolok ukur efisiensi energi yang selaras dengan standar ISO 50001.</p>"}]}'::jsonb,
  specs = '{"EN: Platform\nID: Platform Perangkat Lunak":"EcoStruxure Power Monitoring Expert (PME) / Power Operation (PO)","EN: Power Meters\nID: Meteran Listrik Digital":"PowerLogic PM8000, PM5000 series, ION9000, ION7400","EN: Compliance\nID: Kepatuhan Standar":"IEC 61000-4-30 Class A precision power quality compliance","EN: Analytics\nID: Analitik & Pemantauan":"EN: Harmonic analysis, voltage sag/swell capture, EN 50160 compliance\nID: Analisis harmonisa, tangkapan sag/swell tegangan, kepatuhan EN 50160","EN: Reporting\nID: Laporan Otomatis":"EN: Automated energy billing, cost allocation, carbon footprint tracking\nID: Penagihan energi otomatis, alokasi biaya, pelacakan jejak karbon ESG"}'::jsonb,
  updated_at = now()
WHERE full_path = 'schneider-integrator/power-energy-monitoring' OR slug = 'power-energy-monitoring';

-- PRODUCT: schneider-integrator/electrical-distribution-integration (slug: electrical-distribution-integration)
UPDATE products SET
  title = E'EN: Electrical Distribution Integration (MasterPact & Prisma)
ID: Integrasi Distribusi Elektrikal (MasterPact & Prisma)',
  summary = E'EN: MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.
ID: Circuit breaker udara MasterPact MTZ/NW, pemutus sirkuit cetak Compact NSX, dan integrasi switchboard type-tested Prisma.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Integrasi Distribusi Daya Tegangan Rendah</h3>\n<p>PT Multi Daya Mitra mengintegrasikan pemutus sirkuit udara (ACB) Schneider Electric MasterPact MTZ dan pemutus sirkuit cetak (MCCB) Compact NSX ke dalam sistem switchboard modular Prisma, menghadirkan distribusi tenaga listrik mutakhir dengan konektivitas digital terpadu.</p>\n<h3>MasterPact MTZ dengan Unit Kontrol MicroLogic X</h3>\n<p>Dilengkapi pengukuran daya & energi Kelas 1 terintegrasi, diagnostik nirkabel ponsel pintar seketika melalui Bluetooth/NFC, dan komunikasi dual-Ethernet untuk koneksi langsung ke sistem SCADA/PME tanpa memerlukan transduser eksternal.</p>\n<h3>Arsitektur Switchboard Teruji Tipe Prisma</h3>\n<p>Arsitektur modular tersertifikasi IEC 61439 yang menjamin keselamatan maksimal terhadap bahaya percikan busur api (arc fault), pelepasan panas termal teroptimasi, dan kemudahan ekspansi kapasitas di masa depan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Integrated Low Voltage Power Distribution</h3>\n<p>PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity.</p>\n<h3>MasterPact MTZ with MicroLogic X Control Units</h3>\n<p>Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers.</p>\n<h3>Prisma Type-Tested Switchboard Architecture</h3>\n<p>IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Integrated Low Voltage Power Distribution</h3>\n<p>PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity.</p>\n<h3>MasterPact MTZ with MicroLogic X Control Units</h3>\n<p>Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers.</p>\n<h3>Prisma Type-Tested Switchboard Architecture</h3>\n<p>IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion.</p>\nID: <h3>Integrasi Distribusi Daya Tegangan Rendah</h3>\n<p>PT Multi Daya Mitra mengintegrasikan pemutus sirkuit udara (ACB) Schneider Electric MasterPact MTZ dan pemutus sirkuit cetak (MCCB) Compact NSX ke dalam sistem switchboard modular Prisma, menghadirkan distribusi tenaga listrik mutakhir dengan konektivitas digital terpadu.</p>\n<h3>MasterPact MTZ dengan Unit Kontrol MicroLogic X</h3>\n<p>Dilengkapi pengukuran daya & energi Kelas 1 terintegrasi, diagnostik nirkabel ponsel pintar seketika melalui Bluetooth/NFC, dan komunikasi dual-Ethernet untuk koneksi langsung ke sistem SCADA/PME tanpa memerlukan transduser eksternal.</p>\n<h3>Arsitektur Switchboard Teruji Tipe Prisma</h3>\n<p>Arsitektur modular tersertifikasi IEC 61439 yang menjamin keselamatan maksimal terhadap bahaya percikan busur api (arc fault), pelepasan panas termal teroptimasi, dan kemudahan ekspansi kapasitas di masa depan.</p>"}]}'::jsonb,
  specs = '{"EN: Circuit Breakers\nID: Pemutus Sirkuit":"MasterPact MTZ (up to 6300A), Compact NSX/NSXm (16-630A)","EN: Trip Units\nID: Unit Trip Kontrol":"MicroLogic X with integrated Class 1 active energy measurement","EN: Enclosure System\nID: Sistem Enclosure":"Schneider PrismaSeT G & P type-tested modular switchboards","EN: Connectivity\nID: Konektivitas":"Embedded Bluetooth, NFC, Ethernet Modbus TCP communications","EN: Standards\nID: Standar":"IEC 60947-2, IEC 61439-1/-2, UL 489"}'::jsonb,
  updated_at = now()
WHERE full_path = 'schneider-integrator/electrical-distribution-integration' OR slug = 'electrical-distribution-integration';

-- PRODUCT: schneider-integrator/engineering-commissioning (slug: engineering-commissioning)
UPDATE products SET
  title = E'EN: Schneider Engineering, FAT/SAT & Commissioning Support
ID: Rekayasa Schneider, Dukungan FAT/SAT & Komisioning',
  summary = E'EN: Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.
ID: Factory acceptance testing (FAT), site acceptance testing (SAT), koordinasi proteksi relay, dan komisioning bertegangan.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rekayasa Teknik Menyeluruh & Komisioning Lapangan</h3>\n<p>Tim insinyur tersertifikasi kami menyediakan layanan rekayasa teknik komprehensif, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), parameterisasi relai proteksi, dan dukungan komisioning bertegangan untuk sistem otomasi serta distribusi daya Schneider Electric.</p>\n<h3>Parameterisasi Relai Proteksi & Injeksi Sekunder/Primer</h3>\n<p>Konfigurasi dan pengujian relai proteksi Schneider Sepam, Easergy P3, dan Easergy P5 menggunakan alat uji injeksi sekunder Omicron terkalibrasi untuk menjamin koordinasi diskriminasi proteksi yang akurat dan respons pemutusan arc yang cepat.</p>\n<h3>Proses Energize & Serah Terima Proyek SAT</h3>\n<p>Pemeriksaan pra-komisioning menyeluruh mencakup uji tahanan isolasi, tahanan kontak (Ductor), verifikasi interlock mekanik/listrik, serta dokumentasi serah terima lengkap disertai pelatihan operasional bagi teknisi klien.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Comprehensive Engineering & On-Site Commissioning</h3>\n<p>Our certified engineering team provides comprehensive engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), protection relay parameterization, and energized commissioning support for Schneider Electric automation and power distribution systems.</p>\n<h3>Protection Relay Parameterization & Primary Injection</h3>\n<p>Configuration and testing of Schneider Sepam, Easergy P3, and Easergy P5 protection relays using calibrated Omicron secondary injection test sets to guarantee discrimination and fast arc clearing times.</p>\n<h3>Energization & SAT Site Handover</h3>\n<p>Rigorous pre-commissioning checks, insulation resistance, contact resistance (Ductor), functional interlock verification, and full handover documentation with client operations training.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Comprehensive Engineering & On-Site Commissioning</h3>\n<p>Our certified engineering team provides comprehensive engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), protection relay parameterization, and energized commissioning support for Schneider Electric automation and power distribution systems.</p>\n<h3>Protection Relay Parameterization & Primary Injection</h3>\n<p>Configuration and testing of Schneider Sepam, Easergy P3, and Easergy P5 protection relays using calibrated Omicron secondary injection test sets to guarantee discrimination and fast arc clearing times.</p>\n<h3>Energization & SAT Site Handover</h3>\n<p>Rigorous pre-commissioning checks, insulation resistance, contact resistance (Ductor), functional interlock verification, and full handover documentation with client operations training.</p>\nID: <h3>Rekayasa Teknik Menyeluruh & Komisioning Lapangan</h3>\n<p>Tim insinyur tersertifikasi kami menyediakan layanan rekayasa teknik komprehensif, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), parameterisasi relai proteksi, dan dukungan komisioning bertegangan untuk sistem otomasi serta distribusi daya Schneider Electric.</p>\n<h3>Parameterisasi Relai Proteksi & Injeksi Sekunder/Primer</h3>\n<p>Konfigurasi dan pengujian relai proteksi Schneider Sepam, Easergy P3, dan Easergy P5 menggunakan alat uji injeksi sekunder Omicron terkalibrasi untuk menjamin koordinasi diskriminasi proteksi yang akurat dan respons pemutusan arc yang cepat.</p>\n<h3>Proses Energize & Serah Terima Proyek SAT</h3>\n<p>Pemeriksaan pra-komisioning menyeluruh mencakup uji tahanan isolasi, tahanan kontak (Ductor), verifikasi interlock mekanik/listrik, serta dokumentasi serah terima lengkap disertai pelatihan operasional bagi teknisi klien.</p>"}]}'::jsonb,
  specs = '{"EN: Certification\nID: Sertifikasi":"EN: Certified Schneider System Integrator & ESDM Level 6 accredited\nID: System Integrator Schneider Tersertifikasi & Terakreditasi ESDM Level 6","EN: Testing Fleet\nID: Armada Alat Uji":"Omicron CMC 356, Megger S1-568, Fluke 1777, FLIR E76","EN: Scope\nID: Cakupan Layanan":"EN: FAT & SAT verification, relay parameterization, breaker trip testing\nID: Verifikasi FAT & SAT, parameterisasi relay, pengujian trip breaker","EN: Standards\nID: Standar":"IEEE 1584 Arc Flash, IEC 60255 Protection Relays, NETA Acceptance"}'::jsonb,
  updated_at = now()
WHERE full_path = 'schneider-integrator/engineering-commissioning' OR slug = 'engineering-commissioning';

-- PRODUCT: electrical-distribution/medium-voltage-substation (slug: medium-voltage-substation)
UPDATE products SET
  title = E'EN: Medium Voltage Substation & Transformers
ID: Gardu Induk Tegangan Menengah & Transformator',
  summary = E'EN: MV Metal-Clad Switchgear up to 24kV/36kV, Oil-Immersed & Cast Resin Dry-Type Transformers, and Vacuum Circuit Breakers.
ID: Switchgear Metal-Clad TM hingga 24kV/36kV, Transformator Tipe Minyak & Dry-Type Cast Resin, serta Vacuum Circuit Breaker.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Infrastruktur Gardu Induk Tegangan Menengah</h3>\n<p>Peralatan gardu induk tegangan menengah siap pakai (turnkey) yang dirancang untuk gardu distribusi PLN/utilitas, pabrik industri berat, dan pembangkit listrik internal (captive power) hingga 36 kV. Dibuat kokoh untuk menahan beban hubung singkat tinggi dan kondisi lingkungan yang menantang.</p>\n<h3>Switchgear Metal-Clad TM & Ring Main Unit (RMU)</h3>\n<p>Dilengkapi Vacuum Circuit Breaker (VCB) berkinerja tinggi atau pemutus berinsulasi gas SF6, relai proteksi digital, dan sensor deteksi arc flash sesuai standar IEC 62271-200 dan SPLN.</p>\n<h3>Transformator Distribusi Tipe Minyak & Dry-Type Cast Resin</h3>\n<p>Transformator daya dan distribusi berkapasitas hingga 20 MVA, mengadopsi inti magnetik rugi-daya rendah (low-loss), insulasi resin tahan api untuk keselamatan dalam ruangan, atau tangki minyak kedap udara (hermetically sealed) untuk ketahanan luar ruangan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Medium Voltage Substation Infrastructure</h3>\n<p>Turnkey medium voltage substation equipment engineered for utility substations, heavy industrial plants, and captive power plants up to 36 kV. Built to withstand high short-circuit levels and demanding environmental conditions.</p>\n<h3>MV Metal-Clad Switchgear & Ring Main Units (RMU)</h3>\n<p>Supplied with high-performance Vacuum Circuit Breakers (VCB) or SF6 gas-insulated breakers, digital protection relays, and arc flash detection sensors in strict compliance with IEC 62271-200 and SPLN standards.</p>\n<h3>Oil-Immersed & Dry-Type Transformers</h3>\n<p>Distribution and power transformers up to 20 MVA capacity, featuring low-loss magnetic cores, cast resin flame-retardant insulation for indoor safety, or hermetically sealed oil tanks for outdoor industrial durability.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Medium Voltage Substation Infrastructure</h3>\n<p>Turnkey medium voltage substation equipment engineered for utility substations, heavy industrial plants, and captive power plants up to 36 kV. Built to withstand high short-circuit levels and demanding environmental conditions.</p>\n<h3>MV Metal-Clad Switchgear & Ring Main Units (RMU)</h3>\n<p>Supplied with high-performance Vacuum Circuit Breakers (VCB) or SF6 gas-insulated breakers, digital protection relays, and arc flash detection sensors in strict compliance with IEC 62271-200 and SPLN standards.</p>\n<h3>Oil-Immersed & Dry-Type Transformers</h3>\n<p>Distribution and power transformers up to 20 MVA capacity, featuring low-loss magnetic cores, cast resin flame-retardant insulation for indoor safety, or hermetically sealed oil tanks for outdoor industrial durability.</p>\nID: <h3>Infrastruktur Gardu Induk Tegangan Menengah</h3>\n<p>Peralatan gardu induk tegangan menengah siap pakai (turnkey) yang dirancang untuk gardu distribusi PLN/utilitas, pabrik industri berat, dan pembangkit listrik internal (captive power) hingga 36 kV. Dibuat kokoh untuk menahan beban hubung singkat tinggi dan kondisi lingkungan yang menantang.</p>\n<h3>Switchgear Metal-Clad TM & Ring Main Unit (RMU)</h3>\n<p>Dilengkapi Vacuum Circuit Breaker (VCB) berkinerja tinggi atau pemutus berinsulasi gas SF6, relai proteksi digital, dan sensor deteksi arc flash sesuai standar IEC 62271-200 dan SPLN.</p>\n<h3>Transformator Distribusi Tipe Minyak & Dry-Type Cast Resin</h3>\n<p>Transformator daya dan distribusi berkapasitas hingga 20 MVA, mengadopsi inti magnetik rugi-daya rendah (low-loss), insulasi resin tahan api untuk keselamatan dalam ruangan, atau tangki minyak kedap udara (hermetically sealed) untuk ketahanan luar ruangan.</p>"}]}'::jsonb,
  specs = '{"EN: Voltage Level\nID: Tingkat Tegangan":"EN: Up to 36 kV\nID: Hingga 36 kV","EN: Transformer Capacity\nID: Kapasitas Transformator":"EN: Up to 20 MVA\nID: Hingga 20 MVA","EN: Insulation\nID: Jenis Insulasi":"EN: Oil-Immersed / Cast Resin Dry Type\nID: Tipe Minyak / Cast Resin Dry Type","EN: Standards\nID: Standar Acuan":"IEC 62271-200, SPLN, IEEE C37"}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-distribution/medium-voltage-substation' OR slug = 'medium-voltage-substation';

-- PRODUCT: electrical-distribution/low-voltage-distribution-panels (slug: low-voltage-distribution-panels)
UPDATE products SET
  title = E'EN: Low Voltage Panels (MDP, SDP, ATS & Sync)
ID: Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)',
  summary = E'EN: Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), ATS/AMF Generator Sync Panels, and Motor Control Centers (MCC).
ID: Panel Distribusi Utama (MDP), Sub-Distribusi (SDP), Panel Sinkronisasi Genset ATS/AMF, dan Motor Control Center (MCC).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Panel Distribusi Daya Tegangan Rendah Kustom</h3>\n<p>Panel distribusi tegangan rendah yang dirakit khusus menggunakan busbar tembaga murni 99,9% Cu-ETP, boks panel berstandar type-tested, dan circuit breaker cerdas untuk penyaluran tenaga listrik tanpa hambatan serta tingkat keamanan operasional tinggi hingga 6300A.</p>\n<h3>Main Distribution Panel (MDP) & Sub-Distribution Panel (SDP)</h3>\n<p>Dilengkapi proteksi ACB/MCCB, power meter digital, perangkat proteksi petir/surge (SPD), serta pemisahan modular hingga Form 4b untuk melindungi teknisi dan mempermudah pemeliharaan berkala.</p>\n<h3>Automatic Transfer Switch (ATS) & Sinkronisasi Genset</h3>\n<p>Dirancang dengan kontroler Automatic Mains Failure (AMF) dan motorized changeover switch untuk transisi suplai daya mulus antara listrik PLN dan genset darurat tanpa lonjakan atau pemadaman berkepanjangan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Custom Low Voltage Distribution Switchboards</h3>\n<p>Custom assembled low voltage distribution boards built with premium 99.9% Cu-ETP copper busbars, type-tested enclosures, and intelligent circuit breakers for seamless power routing and high operational safety up to 6300A.</p>\n<h3>Main Distribution Panels (MDP) & Sub-Panels (SDP)</h3>\n<p>Equipped with ACB/MCCB protection, digital metering, surge protective devices (SPD), and modular segregation up to Form 4b to safeguard personnel and simplify ongoing maintenance.</p>\n<h3>Automatic Transfer Switch (ATS) & Generator Synchronization</h3>\n<p>Engineered with automatic mains failure (AMF) controllers and motorized changeover switches for seamless power transition between grid power and emergency generators without voltage drops.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Custom Low Voltage Distribution Switchboards</h3>\n<p>Custom assembled low voltage distribution boards built with premium 99.9% Cu-ETP copper busbars, type-tested enclosures, and intelligent circuit breakers for seamless power routing and high operational safety up to 6300A.</p>\n<h3>Main Distribution Panels (MDP) & Sub-Panels (SDP)</h3>\n<p>Equipped with ACB/MCCB protection, digital metering, surge protective devices (SPD), and modular segregation up to Form 4b to safeguard personnel and simplify ongoing maintenance.</p>\n<h3>Automatic Transfer Switch (ATS) & Generator Synchronization</h3>\n<p>Engineered with automatic mains failure (AMF) controllers and motorized changeover switches for seamless power transition between grid power and emergency generators without voltage drops.</p>\nID: <h3>Panel Distribusi Daya Tegangan Rendah Kustom</h3>\n<p>Panel distribusi tegangan rendah yang dirakit khusus menggunakan busbar tembaga murni 99,9% Cu-ETP, boks panel berstandar type-tested, dan circuit breaker cerdas untuk penyaluran tenaga listrik tanpa hambatan serta tingkat keamanan operasional tinggi hingga 6300A.</p>\n<h3>Main Distribution Panel (MDP) & Sub-Distribution Panel (SDP)</h3>\n<p>Dilengkapi proteksi ACB/MCCB, power meter digital, perangkat proteksi petir/surge (SPD), serta pemisahan modular hingga Form 4b untuk melindungi teknisi dan mempermudah pemeliharaan berkala.</p>\n<h3>Automatic Transfer Switch (ATS) & Sinkronisasi Genset</h3>\n<p>Dirancang dengan kontroler Automatic Mains Failure (AMF) dan motorized changeover switch untuk transisi suplai daya mulus antara listrik PLN dan genset darurat tanpa lonjakan atau pemadaman berkepanjangan.</p>"}]}'::jsonb,
  specs = '{"EN: Busbar Rating\nID: Kapasitas Busbar":"Up to 6300A (99.9% Cu-ETP)","EN: Rated Voltage\nID: Tegangan Pengenal":"380V / 400V / 690V","EN: Operation\nID: Mode Operasi":"EN: Manual / Auto Sync ATS\nID: Manual / Auto Sync ATS","EN: Enclosure Protection\nID: Proteksi Enclosure":"IP42 to IP65"}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-distribution/low-voltage-distribution-panels' OR slug = 'low-voltage-distribution-panels';

-- PRODUCT: automation-control/scada-xarrow-telemetry (slug: scada-xarrow-telemetry)
UPDATE products SET
  title = E'EN: SCADA Systems & Process Monitoring (xArrow)
ID: Sistem SCADA & Pemantauan Proses (xArrow)',
  summary = E'EN: High-performance SCADA software, real-time telemetry, alarm management, historical trending, and industrial IoT dashboards.
ID: Perangkat lunak SCADA berkinerja tinggi, telemetri real-time, manajemen alarm, grafik tren historis, dan dashboard IoT industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Supervisi Proses Industri Terpusat</h3>\n<p>Solusi SCADA xArrow dan pemantauan proses terpusat memungkinkan manajer pabrik memvisualisasikan status mesin, mencatat metrik produksi, merekam alarm kritis, serta menerima notifikasi insiden langsung di komputer maupun perangkat seluler.</p>\n<h3>Telemetri Berkecepatan Tinggi & Dukungan Multi-Protokol</h3>\n<p>Dukungan komunikasi langsung untuk protokol standar industri termasuk OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, dan REST API, menjembatani otomasi lantai pabrik dengan sistem ERP manajemen.</p>\n<h3>Grafik Tren Historis & Audit Kepatuhan Regulasi</h3>\n<p>Pencatatan data berbasis SQL berkecepatan tinggi, visual animasi interaktif, laporan rekap kerja otomatis, dan jejak audit (audit trail) antipemalsuan sesuai regulasi ketat industri makanan, farmasi, dan manufaktur.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Centralized Industrial Process Supervision</h3>\n<p>xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, log critical alarms, and receive instant alert dispatches across desktop and mobile devices.</p>\n<h3>High Performance Telemetry & Multi-Protocol Driver Support</h3>\n<p>Native communication support for industry-standard protocols including OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, and REST APIs, bridging shop-floor automation with enterprise ERP systems.</p>\n<h3>Historical Trending & Compliance Auditing</h3>\n<p>High-speed SQL data logging, interactive animated graphics, automated shift reports, and tamper-evident audit trails designed to meet stringent food, pharmaceutical, and manufacturing regulations.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Centralized Industrial Process Supervision</h3>\n<p>xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, log critical alarms, and receive instant alert dispatches across desktop and mobile devices.</p>\n<h3>High Performance Telemetry & Multi-Protocol Driver Support</h3>\n<p>Native communication support for industry-standard protocols including OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, and REST APIs, bridging shop-floor automation with enterprise ERP systems.</p>\n<h3>Historical Trending & Compliance Auditing</h3>\n<p>High-speed SQL data logging, interactive animated graphics, automated shift reports, and tamper-evident audit trails designed to meet stringent food, pharmaceutical, and manufacturing regulations.</p>\nID: <h3>Supervisi Proses Industri Terpusat</h3>\n<p>Solusi SCADA xArrow dan pemantauan proses terpusat memungkinkan manajer pabrik memvisualisasikan status mesin, mencatat metrik produksi, merekam alarm kritis, serta menerima notifikasi insiden langsung di komputer maupun perangkat seluler.</p>\n<h3>Telemetri Berkecepatan Tinggi & Dukungan Multi-Protokol</h3>\n<p>Dukungan komunikasi langsung untuk protokol standar industri termasuk OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, dan REST API, menjembatani otomasi lantai pabrik dengan sistem ERP manajemen.</p>\n<h3>Grafik Tren Historis & Audit Kepatuhan Regulasi</h3>\n<p>Pencatatan data berbasis SQL berkecepatan tinggi, visual animasi interaktif, laporan rekap kerja otomatis, dan jejak audit (audit trail) antipemalsuan sesuai regulasi ketat industri makanan, farmasi, dan manufaktur.</p>"}]}'::jsonb,
  specs = '{"EN: Software\nID: Perangkat Lunak":"xArrow SCADA Industrial Edition","EN: Architecture\nID: Arsitektur":"Client-Server / Web-Based / Cloud-Ready","EN: Protocols\nID: Protokol Komunikasi":"OPC UA, Modbus TCP/RTU, MQTT, REST API","EN: Tags Capacity\nID: Kapasitas Tag":"Unlimited I/O Tag Packages"}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-control/scada-xarrow-telemetry' OR slug = 'scada-xarrow-telemetry';

-- PRODUCT: automation-control/vsd-inverter-panels (slug: vsd-inverter-panels)
UPDATE products SET
  title = E'EN: Variable Speed Drive (VSD) & Inverter Panels
ID: Panel Variable Speed Drive (VSD) & Inverter',
  summary = E'EN: Custom engineered VSD and soft starter panels for pumps, compressors, blowers, extruders, and conveying machinery.
ID: Panel VSD dan soft starter rekayasa khusus untuk pompa, kompresor, blower, mesin ekstrusi, dan konveyor industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Kontrol Motor Presisi & Efisiensi Energi</h3>\n<p>Panel drive tertutup yang dirancang dengan manajemen pelepasan panas optimal, line reactor, mitigasi harmonisa, dan kontaktor bypass untuk pengaturan kecepatan dan torsi yang andal pada motor mesin industri berat.</p>\n<h3>Integrasi Boks Panel Kustom & Proteksi Termal</h3>\n<p>Ditempatkan dalam enclosure industri Rittal berstandar proteksi IP55 dengan ventilasi paksa atau unit pendingin tertutup (closed-loop) guna menjaga komponen elektronik inverter dari debu pekat, kelembapan, dan uap kimia korosif.</p>\n<h3>Kontaktor Bypass & Otomasi Kaskade Multi-Pompa</h3>\n<p>Dilengkapi sistem kontaktor bypass otomatis, filter output dV/dt untuk jalur kabel motor jarak jauh, serta logika kendali kaskade PLC untuk pengoperasian pompa dan kompresor multi-tahap yang cerdas.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Precision Motor Control & Energy Efficiency</h3>\n<p>Enclosed drive panels engineered with proper thermal dissipation, line reactors, harmonic mitigation, and bypass contactors for reliable speed and torque regulation across heavy industrial rotating machinery.</p>\n<h3>Custom Enclosure Integration & Thermal Protection</h3>\n<p>Housed in heavy-duty IP55 Rittal industrial enclosures with forced ventilation or closed-loop cooling units to protect inverter electronics from harsh ambient dust, moisture, and chemical vapors.</p>\n<h3>Bypass & Multi-Pump Cascade Automation</h3>\n<p>Equipped with automatic line-bypass contactors, harmonic dV/dt output filters for long motor cable runs, and PLC cascade algorithms for intelligent multi-pump and compressor staging.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Precision Motor Control & Energy Efficiency</h3>\n<p>Enclosed drive panels engineered with proper thermal dissipation, line reactors, harmonic mitigation, and bypass contactors for reliable speed and torque regulation across heavy industrial rotating machinery.</p>\n<h3>Custom Enclosure Integration & Thermal Protection</h3>\n<p>Housed in heavy-duty IP55 Rittal industrial enclosures with forced ventilation or closed-loop cooling units to protect inverter electronics from harsh ambient dust, moisture, and chemical vapors.</p>\n<h3>Bypass & Multi-Pump Cascade Automation</h3>\n<p>Equipped with automatic line-bypass contactors, harmonic dV/dt output filters for long motor cable runs, and PLC cascade algorithms for intelligent multi-pump and compressor staging.</p>\nID: <h3>Kontrol Motor Presisi & Efisiensi Energi</h3>\n<p>Panel drive tertutup yang dirancang dengan manajemen pelepasan panas optimal, line reactor, mitigasi harmonisa, dan kontaktor bypass untuk pengaturan kecepatan dan torsi yang andal pada motor mesin industri berat.</p>\n<h3>Integrasi Boks Panel Kustom & Proteksi Termal</h3>\n<p>Ditempatkan dalam enclosure industri Rittal berstandar proteksi IP55 dengan ventilasi paksa atau unit pendingin tertutup (closed-loop) guna menjaga komponen elektronik inverter dari debu pekat, kelembapan, dan uap kimia korosif.</p>\n<h3>Kontaktor Bypass & Otomasi Kaskade Multi-Pompa</h3>\n<p>Dilengkapi sistem kontaktor bypass otomatis, filter output dV/dt untuk jalur kabel motor jarak jauh, serta logika kendali kaskade PLC untuk pengoperasian pompa dan kompresor multi-tahap yang cerdas.</p>"}]}'::jsonb,
  specs = '{"EN: Power Range\nID: Rentang Daya":"0.75 kW to 1200 kW","EN: Supported Brands\nID: Merek Didukung":"Schneider, Danfoss, ABB, Siemens","EN: Control Modes\nID: Mode Kontrol":"V/f, Open/Closed Vector Control, Torque Control","EN: Enclosure\nID: Enclosure":"Rittal Industrial IP55 / IP56"}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-control/vsd-inverter-panels' OR slug = 'vsd-inverter-panels';

-- PRODUCT: power-quality/active-harmonic-filters (slug: active-harmonic-filters)
UPDATE products SET
  title = E'EN: Active Harmonic Filters (AHF) & SVG
ID: Filter Harmonisa Aktif (AHF) & SVG',
  summary = E'EN: Dynamic active harmonic compensation up to the 50th harmonic order with stepless reactive power factor correction.
ID: Kompensasi harmonisa aktif dinamis hingga orde ke-50 disertai perbaikan faktor daya reaktif tanpa jeda (stepless).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Mitigasi Harmonisa Aktif & Jaringan Listrik Bersih</h3>\n<p>Active Harmonic Filter (AHF) dan Static Var Generator (SVG) secara dinamis menginjeksikan arus berfasa terbalik untuk meniadakan distorsi harmonisa yang ditimbulkan oleh beban non-linear seperti inverter VFD, rectifier, UPS, dan tanur busur listrik.</p>\n<h3>Respons Sangat Cepat di Bawah 5 Milidetik</h3>\n<p>Ditenagai prosesor sinyal digital DSP berkecepatan tinggi dan sakelar daya IGBT yang mendeteksi serta menetralkan gangguan harmonisa hingga orde ke-50 dalam tempo kurang dari 5 milidetik, menjaga Total Harmonic Distortion (THDi) selalu di bawah 3%.</p>\n<h3>Perbaikan Faktor Daya Dua Arah Tanpa Jeda (Stepless)</h3>\n<p>Menyediakan kompensasi daya reaktif induktif maupun kapasitif secara seketika dan halus tanpa jeda tangga, menghindarkan denda kVARh dari PLN serta menstabilkan tegangan jala-jala tanpa bahaya resonansi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Active Harmonic Mitigation & Clean Power Networks</h3>\n<p>Active Harmonic Filters (AHF) and Static Var Generators (SVG) dynamically inject counter-phase currents to cancel harmonic distortions generated by non-linear loads such as variable frequency drives, rectifiers, UPS, and arc furnaces.</p>\n<h3>Ultra-Fast Sub-5ms Response Time</h3>\n<p>Equipped with high-speed DSP digital signal processors and IGBT power switches that detect and neutralize harmonic disturbances up to the 50th order within less than 5 milliseconds, maintaining Total Harmonic Distortion (THDi) below 3%.</p>\n<h3>Stepless Bi-Directional Power Factor Correction</h3>\n<p>Provides instantaneous, stepless capacitive and inductive reactive power compensation, eliminating PLN low power factor penalties and stabilizing grid voltage without resonance risks.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Active Harmonic Mitigation & Clean Power Networks</h3>\n<p>Active Harmonic Filters (AHF) and Static Var Generators (SVG) dynamically inject counter-phase currents to cancel harmonic distortions generated by non-linear loads such as variable frequency drives, rectifiers, UPS, and arc furnaces.</p>\n<h3>Ultra-Fast Sub-5ms Response Time</h3>\n<p>Equipped with high-speed DSP digital signal processors and IGBT power switches that detect and neutralize harmonic disturbances up to the 50th order within less than 5 milliseconds, maintaining Total Harmonic Distortion (THDi) below 3%.</p>\n<h3>Stepless Bi-Directional Power Factor Correction</h3>\n<p>Provides instantaneous, stepless capacitive and inductive reactive power compensation, eliminating PLN low power factor penalties and stabilizing grid voltage without resonance risks.</p>\nID: <h3>Mitigasi Harmonisa Aktif & Jaringan Listrik Bersih</h3>\n<p>Active Harmonic Filter (AHF) dan Static Var Generator (SVG) secara dinamis menginjeksikan arus berfasa terbalik untuk meniadakan distorsi harmonisa yang ditimbulkan oleh beban non-linear seperti inverter VFD, rectifier, UPS, dan tanur busur listrik.</p>\n<h3>Respons Sangat Cepat di Bawah 5 Milidetik</h3>\n<p>Ditenagai prosesor sinyal digital DSP berkecepatan tinggi dan sakelar daya IGBT yang mendeteksi serta menetralkan gangguan harmonisa hingga orde ke-50 dalam tempo kurang dari 5 milidetik, menjaga Total Harmonic Distortion (THDi) selalu di bawah 3%.</p>\n<h3>Perbaikan Faktor Daya Dua Arah Tanpa Jeda (Stepless)</h3>\n<p>Menyediakan kompensasi daya reaktif induktif maupun kapasitif secara seketika dan halus tanpa jeda tangga, menghindarkan denda kVARh dari PLN serta menstabilkan tegangan jala-jala tanpa bahaya resonansi.</p>"}]}'::jsonb,
  specs = '{"EN: Harmonic Range\nID: Rentang Harmonisa":"2nd to 50th Order","EN: Modular Capacity\nID: Kapasitas Modular":"50A to 600A modular rack-mount / wall-mount","EN: Response Time\nID: Waktu Respons":"< 5 milliseconds","EN: Target THDi\nID: Target Reduksi THDi":"< 3% at rated capacity"}'::jsonb,
  updated_at = now()
WHERE full_path = 'power-quality/active-harmonic-filters' OR slug = 'active-harmonic-filters';

-- PRODUCT: fire-alarm-products/addressable-fire-alarm-systems (slug: addressable-fire-alarm-systems)
UPDATE products SET
  title = E'EN: Addressable Fire Alarm Panels & Detectors
ID: Panel Fire Alarm Addressable & Sensor Detektor',
  summary = E'EN: Intelligent addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and suppression triggers.
ID: Panel kontrol alarm kebakaran addressable cerdas, detektor asap optik & panas multi-kriteria, serta aktivator pemadam gas.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Arsitektur Keselamatan Kebakaran Addressable Cerdas</h3>\n<p>Jaringan deteksi kebakaran addressable penuh yang menyediakan identifikasi titik lokasi sensor secara presisi, kompensasi otomatis kepekaan debu, peringatan evakuasi cepat, dan integrasi mulus dengan Building Management System (BMS).</p>\n<h3>Detektor Multi-Kriteria Optik & Termal</h3>\n<p>Dilengkapi sensor optik panjang gelombang ganda dan pengukur panas termistor untuk mendeteksi tanda awal kebakaran berasap (smoldering) sekaligus mencegah alarm palsu akibat debu, uap air, atau aerosol industri.</p>\n<h3>Aktivasi Gas Pemadam Clean Agent & Sistem Notifikasi</h3>\n<p>Sirkuit aktivasi terintegrasi untuk sistem pemadam gas clean agent seperti FM-200, Novec 1230, dan gas inert yang dirancang khusus untuk ruang switchboard elektrikal, ruang baterai, dan ruang server pusat data sesuai standar NFPA 72.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Intelligent Addressable Fire Safety Architecture</h3>\n<p>Fully addressable fire detection networks providing precise point-by-point device identification, automatic sensitivity drift compensation, rapid pinpoint evacuation alerting, and building management system (BMS) integration.</p>\n<h3>Multi-Criteria Optical & Thermal Detectors</h3>\n<p>Equipped with dual-wavelength optical smoke sensing and thermistor heat measurement to detect early-stage smoldering fires while effectively eliminating false alarms from dust, steam, or industrial aerosols.</p>\n<h3>Clean Agent Gas Suppression & Notification Triggers</h3>\n<p>Integrated releasing circuits for FM-200, Novec 1230, and inert gas suppression systems engineered for mission-critical electrical switchgear rooms, battery storage, and server data centers compliant with NFPA 72.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Intelligent Addressable Fire Safety Architecture</h3>\n<p>Fully addressable fire detection networks providing precise point-by-point device identification, automatic sensitivity drift compensation, rapid pinpoint evacuation alerting, and building management system (BMS) integration.</p>\n<h3>Multi-Criteria Optical & Thermal Detectors</h3>\n<p>Equipped with dual-wavelength optical smoke sensing and thermistor heat measurement to detect early-stage smoldering fires while effectively eliminating false alarms from dust, steam, or industrial aerosols.</p>\n<h3>Clean Agent Gas Suppression & Notification Triggers</h3>\n<p>Integrated releasing circuits for FM-200, Novec 1230, and inert gas suppression systems engineered for mission-critical electrical switchgear rooms, battery storage, and server data centers compliant with NFPA 72.</p>\nID: <h3>Arsitektur Keselamatan Kebakaran Addressable Cerdas</h3>\n<p>Jaringan deteksi kebakaran addressable penuh yang menyediakan identifikasi titik lokasi sensor secara presisi, kompensasi otomatis kepekaan debu, peringatan evakuasi cepat, dan integrasi mulus dengan Building Management System (BMS).</p>\n<h3>Detektor Multi-Kriteria Optik & Termal</h3>\n<p>Dilengkapi sensor optik panjang gelombang ganda dan pengukur panas termistor untuk mendeteksi tanda awal kebakaran berasap (smoldering) sekaligus mencegah alarm palsu akibat debu, uap air, atau aerosol industri.</p>\n<h3>Aktivasi Gas Pemadam Clean Agent & Sistem Notifikasi</h3>\n<p>Sirkuit aktivasi terintegrasi untuk sistem pemadam gas clean agent seperti FM-200, Novec 1230, dan gas inert yang dirancang khusus untuk ruang switchboard elektrikal, ruang baterai, dan ruang server pusat data sesuai standar NFPA 72.</p>"}]}'::jsonb,
  specs = '{"EN: Capacity\nID: Kapasitas Titik":"1 to 8 Loops (up to 2000+ addressable points)","EN: Detectors\nID: Tipe Sensor Detektor":"Optical Smoke, Thermal, Multi-Criteria, Flame","EN: Standards\nID: Standar Keselamatan":"NFPA 72, EN54, UL Listed, FM Approved"}'::jsonb,
  updated_at = now()
WHERE full_path = 'fire-alarm-products/addressable-fire-alarm-systems' OR slug = 'addressable-fire-alarm-systems';

COMMIT;


-- ==========================================
-- Migration: 026_bilingual_services_seed.up.sql
-- ==========================================

-- 026_bilingual_services_seed.up.sql
-- Synchronize all 21 Services titles, summaries, and contents with complete 100% matching bilingual translations (ID & EN)

BEGIN;


-- SERVICE: electrical-construction-installation (slug: electrical-construction-installation)
UPDATE services SET
  title = E'EN: Electrical Construction & Installation
ID: Konstruksi & Instalasi Elektrikal',
  summary = E'EN: Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.
ID: Solusi terintegrasi instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, pemasangan trafo, dan terminasi kabel.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Konstruksi & Instalasi Elektrikal Industri Terpadu</h3>\n<p>PT Multi Daya Mitra menyediakan layanan konstruksi dan instalasi elektrikal komprehensif untuk fasilitas pabrik manufaktur, gardu induk utilitas, gedung komersial, dan infrastruktur industri. Didukung oleh insinyur berizin resmi dan teknisi lapangan tersertifikasi, kami melaksanakan proyek elektrikal turnkey dengan ketelitian tinggi, standar keselamatan kerja ketat, dan keandalan operasional jangka panjang.</p>\n<h3>Lingkup Pekerjaan Instalasi Terintegrasi</h3>\n<p>Kapabilitas kami mencakup integrasi sipil-elektrikal gardu induk, pemasangan switchgear tegangan menengah (TM), penempatan dan pengisian minyak transformator daya, perakitan panel distribusi utama tegangan rendah (TR), pemasangan trunking busduct ampere tinggi, dan jaringan kabel daya tersertifikasi. Seluruh pekerjaan mematuhi standar SPLN, PUIL 2011, dan IEC untuk menjamin keandalan sistem tanpa kompromi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>End-to-End Industrial Electrical Construction</h3>\n<p>PT Multi Daya Mitra provides comprehensive electrical construction and installation services for manufacturing plants, utility substations, commercial towers, and industrial infrastructure. Supported by licensed engineers and certified field technicians, we execute complex turnkey electrical works with uncompromising precision, safety, and operational reliability.</p>\n<h3>Integrated Installation Work Scope</h3>\n<p>Our turnkey capabilities cover substation civil-electrical integration, medium-voltage (MV) switchgear erection, power transformer positioning and oil filling, low-voltage (LV) main distribution board assembly, high-amp busduct trunking, and certified power cabling networks. All works strictly comply with SPLN, PUIL 2011, and IEC standards to guarantee long-term operational resilience.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>End-to-End Industrial Electrical Construction</h3>\n<p>PT Multi Daya Mitra provides comprehensive electrical construction and installation services for manufacturing plants, utility substations, commercial towers, and industrial infrastructure. Supported by licensed engineers and certified field technicians, we execute complex turnkey electrical works with uncompromising precision, safety, and operational reliability.</p>\n<h3>Integrated Installation Work Scope</h3>\n<p>Our turnkey capabilities cover substation civil-electrical integration, medium-voltage (MV) switchgear erection, power transformer positioning and oil filling, low-voltage (LV) main distribution board assembly, high-amp busduct trunking, and certified power cabling networks. All works strictly comply with SPLN, PUIL 2011, and IEC standards to guarantee long-term operational resilience.</p>\nID: <h3>Konstruksi & Instalasi Elektrikal Industri Terpadu</h3>\n<p>PT Multi Daya Mitra menyediakan layanan konstruksi dan instalasi elektrikal komprehensif untuk fasilitas pabrik manufaktur, gardu induk utilitas, gedung komersial, dan infrastruktur industri. Didukung oleh insinyur berizin resmi dan teknisi lapangan tersertifikasi, kami melaksanakan proyek elektrikal turnkey dengan ketelitian tinggi, standar keselamatan kerja ketat, dan keandalan operasional jangka panjang.</p>\n<h3>Lingkup Pekerjaan Instalasi Terintegrasi</h3>\n<p>Kapabilitas kami mencakup integrasi sipil-elektrikal gardu induk, pemasangan switchgear tegangan menengah (TM), penempatan dan pengisian minyak transformator daya, perakitan panel distribusi utama tegangan rendah (TR), pemasangan trunking busduct ampere tinggi, dan jaringan kabel daya tersertifikasi. Seluruh pekerjaan mematuhi standar SPLN, PUIL 2011, dan IEC untuk menjamin keandalan sistem tanpa kompromi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation' OR slug = 'electrical-construction-installation';

-- SERVICE: electrical-construction-installation/substation-mv-switchgear-installation (slug: substation-mv-switchgear-installation)
UPDATE services SET
  title = E'EN: Substation & MV Switchgear Installation
ID: Instalasi Gardu Induk & Switchgear Tegangan Menengah (MV)',
  summary = E'EN: Medium voltage metal-clad switchgear, power transformers, oil containment, and civil-electrical integration up to 36kV.
ID: Pemasangan switchgear metal-clad tegangan menengah, transformator daya, bak penampung oli, dan integrasi sipil-elektrikal hingga 36kV.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan EPC Gardu Induk Tegangan Menengah</h3>\n<p>Layanan rekayasa teknik, pengadaan, dan konstruksi (EPC) lengkap untuk gardu induk outdoor dan indoor tegangan menengah hingga 36 kV. Kami mengoordinasikan instalasi penyulang utama PLN, transformator daya penurun tegangan, dan rangkaian panel kubikel metal-clad secara terpadu.</p>\n<h3>Pemasangan Switchgear MV & Transformator Daya</h3>\n<p>Pemasangan dan perataan kubikel berinsulasi udara (AIS) maupun gas (GIS), vacuum circuit breaker (VCB), penempatan transformator di atas bak penampung oli darurat, instalasi breather silika gel, dan koneksi busduct sesuai standar IEC 62271-200 dan SPLN.</p>\n<h3>Pengujian, Interlock & Tahapan Energize</h3>\n<p>Verifikasi pra-komisioning menyeluruh mencakup rasio dan polaritas CT/PT, uji waktu pemutusan breaker, pemeriksaan interlock mekanik/listrik keselamatan, serta protokol energize bertegangan bekerja sama dengan otoritas utilitas ketenagalistrikan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Medium Voltage Substation EPC Services</h3>\n<p>Complete engineering, procurement, and construction (EPC) services for medium voltage outdoor and indoor substations up to 36 kV. We coordinate the seamless installation of primary utility incoming bays, step-down power transformers, and metal-clad switchgear assemblies.</p>\n<h3>MV Switchgear & Transformer Erection</h3>\n<p>Installation and alignment of air-insulated (AIS) and gas-insulated (GIS) switchgear, vacuum circuit breakers (VCB), transformer placement over oil-containment sumps, silica gel breathers, and busduct connections compliant with IEC 62271-200 and SPLN standards.</p>\n<h3>Testing, Interlocking & Energization</h3>\n<p>Rigorous pre-commissioning verification including CT/PT polarity and ratio testing, breaker timing analysis, mechanical safety interlock checks, and coordinated energization protocols in collaboration with regional utility authorities.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Medium Voltage Substation EPC Services</h3>\n<p>Complete engineering, procurement, and construction (EPC) services for medium voltage outdoor and indoor substations up to 36 kV. We coordinate the seamless installation of primary utility incoming bays, step-down power transformers, and metal-clad switchgear assemblies.</p>\n<h3>MV Switchgear & Transformer Erection</h3>\n<p>Installation and alignment of air-insulated (AIS) and gas-insulated (GIS) switchgear, vacuum circuit breakers (VCB), transformer placement over oil-containment sumps, silica gel breathers, and busduct connections compliant with IEC 62271-200 and SPLN standards.</p>\n<h3>Testing, Interlocking & Energization</h3>\n<p>Rigorous pre-commissioning verification including CT/PT polarity and ratio testing, breaker timing analysis, mechanical safety interlock checks, and coordinated energization protocols in collaboration with regional utility authorities.</p>\nID: <h3>Layanan EPC Gardu Induk Tegangan Menengah</h3>\n<p>Layanan rekayasa teknik, pengadaan, dan konstruksi (EPC) lengkap untuk gardu induk outdoor dan indoor tegangan menengah hingga 36 kV. Kami mengoordinasikan instalasi penyulang utama PLN, transformator daya penurun tegangan, dan rangkaian panel kubikel metal-clad secara terpadu.</p>\n<h3>Pemasangan Switchgear MV & Transformator Daya</h3>\n<p>Pemasangan dan perataan kubikel berinsulasi udara (AIS) maupun gas (GIS), vacuum circuit breaker (VCB), penempatan transformator di atas bak penampung oli darurat, instalasi breather silika gel, dan koneksi busduct sesuai standar IEC 62271-200 dan SPLN.</p>\n<h3>Pengujian, Interlock & Tahapan Energize</h3>\n<p>Verifikasi pra-komisioning menyeluruh mencakup rasio dan polaritas CT/PT, uji waktu pemutusan breaker, pemeriksaan interlock mekanik/listrik keselamatan, serta protokol energize bertegangan bekerja sama dengan otoritas utilitas ketenagalistrikan.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/substation-mv-switchgear-installation' OR slug = 'substation-mv-switchgear-installation';

-- SERVICE: electrical-construction-installation/lv-distribution-panels-assembly (slug: lv-distribution-panels-assembly)
UPDATE services SET
  title = E'EN: LV Panels Assembly (MDP, SDP, ATS & Sync)
ID: Perakitan Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)',
  summary = E'EN: Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).
ID: Panel Distribusi Utama (MDP), Panel Sub-Distribusi, panel sinkronisasi ATS/AMF, dan Motor Control Center (MCC).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Panel Distribusi Tegangan Rendah Rekayasa Khusus</h3>\n<p>Rekayasa teknik dan fabrikasi panel distribusi daya tegangan rendah untuk penyaluran tenaga listrik yang andal, sinkronisasi genset otomatis, dan kontrol motor industri hingga 6300A.</p>\n<h3>Arsitektur Distribusi Utama (MDP) & Sub-Distribusi (SDP)</h3>\n<p>Dirakit menggunakan busbar tembaga murni 99,9% Cu-ETP, struktur enclosure bersertifikasi type-tested (hingga pemisahan internal Form 4b), dan circuit breaker cerdas (MasterPact MTZ, Compact NSX) dengan modul pengukuran energi dan komunikasi data terintegrasi.</p>\n<h3>Panel ATS / AMF & Sinkronisasi Generator</h3>\n<p>Panel Automatic Transfer Switch (ATS) dan Automatic Mains Failure (AMF) yang dirancang dengan kontroler multi-genset digital, motorized changeover switch, serta logika pelepasan beban otomatis (load shedding) demi keandalan operasional fasilitas tanpa henti.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Custom Engineered Low Voltage Switchboards</h3>\n<p>Custom electrical distribution and control panel engineering for reliable power routing, automated generator synchronization, and motor control across industrial manufacturing facilities up to 6300A.</p>\n<h3>Main & Sub-Distribution Architecture</h3>\n<p>Fabricated using 99.9% Cu-ETP high-purity copper busbars, type-tested enclosure frameworks (up to Form 4b segregation), and intelligent circuit breakers (MasterPact MTZ, Compact NSX) with embedded energy metering and communication modules.</p>\n<h3>ATS / AMF Generator Synchronization</h3>\n<p>Automatic Transfer Switch (ATS) and Automatic Mains Failure (AMF) synchronization boards engineered with digital multi-generator controllers, motorized changeover switches, and automatic load-shedding algorithms for zero-interruption plant uptime.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Custom Engineered Low Voltage Switchboards</h3>\n<p>Custom electrical distribution and control panel engineering for reliable power routing, automated generator synchronization, and motor control across industrial manufacturing facilities up to 6300A.</p>\n<h3>Main & Sub-Distribution Architecture</h3>\n<p>Fabricated using 99.9% Cu-ETP high-purity copper busbars, type-tested enclosure frameworks (up to Form 4b segregation), and intelligent circuit breakers (MasterPact MTZ, Compact NSX) with embedded energy metering and communication modules.</p>\n<h3>ATS / AMF Generator Synchronization</h3>\n<p>Automatic Transfer Switch (ATS) and Automatic Mains Failure (AMF) synchronization boards engineered with digital multi-generator controllers, motorized changeover switches, and automatic load-shedding algorithms for zero-interruption plant uptime.</p>\nID: <h3>Panel Distribusi Tegangan Rendah Rekayasa Khusus</h3>\n<p>Rekayasa teknik dan fabrikasi panel distribusi daya tegangan rendah untuk penyaluran tenaga listrik yang andal, sinkronisasi genset otomatis, dan kontrol motor industri hingga 6300A.</p>\n<h3>Arsitektur Distribusi Utama (MDP) & Sub-Distribusi (SDP)</h3>\n<p>Dirakit menggunakan busbar tembaga murni 99,9% Cu-ETP, struktur enclosure bersertifikasi type-tested (hingga pemisahan internal Form 4b), dan circuit breaker cerdas (MasterPact MTZ, Compact NSX) dengan modul pengukuran energi dan komunikasi data terintegrasi.</p>\n<h3>Panel ATS / AMF & Sinkronisasi Generator</h3>\n<p>Panel Automatic Transfer Switch (ATS) dan Automatic Mains Failure (AMF) yang dirancang dengan kontroler multi-genset digital, motorized changeover switch, serta logika pelepasan beban otomatis (load shedding) demi keandalan operasional fasilitas tanpa henti.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/lv-distribution-panels-assembly' OR slug = 'lv-distribution-panels-assembly';

-- SERVICE: electrical-construction-installation/mv-lv-cable-installation-termination (slug: mv-lv-cable-installation-termination)
UPDATE services SET
  title = E'EN: MV & LV Cable Installation & Termination
ID: Instalasi & Terminasi Kabel MV & LV',
  summary = E'EN: Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.
ID: Penarikan kabel tersertifikasi, pemasangan tray, terminasi heat-shrink/cold-shrink, dan pengujian isolasi Hi-Pot.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Instalasi & Terminasi Kabel Daya Tersertifikasi</h3>\n<p>Layanan penarikan kabel TM/TR, pemasangan jalur cable tray, penyambungan (jointing), dan terminasi untuk jaringan distribusi tenaga listrik industri. Dikerjakan khusus oleh teknisi jointer bersertifikasi dengan mematuhi radius tekuk dan batas tegangan tarik standar.</p>\n<h3>Terminasi Heat-Shrink & Cold-Shrink</h3>\n<p>Pengerjaan terminasi kabel indoor/outdoor serta straight-through joint menggunakan kit berkualitas premium dari 3M dan Raychem, menjamin kerapatan kedap air, pengendalian gradien medan listrik (stress control), dan kekuatan dielektrik tinggi.</p>\n<h3>Pengujian Verifikasi Hi-Pot VLF & DC</h3>\n<p>Setiap kabel penyulang yang telah terpasang diuji ketahanan isolasinya menggunakan alat uji tegangan tinggi Very Low Frequency (VLF), uji ketahanan selubung luar (sheath test), serta verifikasi kontinuitas fasa sebelum serah terima energize.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Power Cable Installation & Jointing</h3>\n<p>Certified MV/LV cable pulling, tray routing, jointing, and termination services for industrial power distribution networks. Handled exclusively by certified jointer technicians adhering to strict bending radiuses and tension limits.</p>\n<h3>Heat-Shrink & Cold-Shrink Terminations</h3>\n<p>Execution of indoor and outdoor cable terminations and straight-through joints using premium 3M and Raychem kits, ensuring continuous moisture sealing, stress-control grading, and high dielectric strength.</p>\n<h3>VLF & DC Hi-Pot Verification Testing</h3>\n<p>Every installed feeder is subjected to Very Low Frequency (VLF) AC withstand testing, sheath integrity insulation resistance checks, and phase continuity verification before being signed off for live energization.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Power Cable Installation & Jointing</h3>\n<p>Certified MV/LV cable pulling, tray routing, jointing, and termination services for industrial power distribution networks. Handled exclusively by certified jointer technicians adhering to strict bending radiuses and tension limits.</p>\n<h3>Heat-Shrink & Cold-Shrink Terminations</h3>\n<p>Execution of indoor and outdoor cable terminations and straight-through joints using premium 3M and Raychem kits, ensuring continuous moisture sealing, stress-control grading, and high dielectric strength.</p>\n<h3>VLF & DC Hi-Pot Verification Testing</h3>\n<p>Every installed feeder is subjected to Very Low Frequency (VLF) AC withstand testing, sheath integrity insulation resistance checks, and phase continuity verification before being signed off for live energization.</p>\nID: <h3>Instalasi & Terminasi Kabel Daya Tersertifikasi</h3>\n<p>Layanan penarikan kabel TM/TR, pemasangan jalur cable tray, penyambungan (jointing), dan terminasi untuk jaringan distribusi tenaga listrik industri. Dikerjakan khusus oleh teknisi jointer bersertifikasi dengan mematuhi radius tekuk dan batas tegangan tarik standar.</p>\n<h3>Terminasi Heat-Shrink & Cold-Shrink</h3>\n<p>Pengerjaan terminasi kabel indoor/outdoor serta straight-through joint menggunakan kit berkualitas premium dari 3M dan Raychem, menjamin kerapatan kedap air, pengendalian gradien medan listrik (stress control), dan kekuatan dielektrik tinggi.</p>\n<h3>Pengujian Verifikasi Hi-Pot VLF & DC</h3>\n<p>Setiap kabel penyulang yang telah terpasang diuji ketahanan isolasinya menggunakan alat uji tegangan tinggi Very Low Frequency (VLF), uji ketahanan selubung luar (sheath test), serta verifikasi kontinuitas fasa sebelum serah terima energize.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/mv-lv-cable-installation-termination' OR slug = 'mv-lv-cable-installation-termination';

-- SERVICE: electrical-construction-installation/fire-alarm-system-installation (slug: fire-alarm-system-installation)
UPDATE services SET
  title = E'EN: Fire Alarm System Engineering & Installation
ID: Rekayasa & Instalasi Sistem Fire Alarm',
  summary = E'EN: Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.
ID: Jaringan fire alarm addressable terintegrasi, detektor multi-sensor, aspirating smoke detection, dan sistem pemadam clean agent.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>\n<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>\n<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>\n<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>\n<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>\n<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Turnkey Industrial Fire Safety Engineering</h3>\n<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>\n<h3>Addressable Detection & Smoke Aspiration</h3>\n<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>\n<h3>Clean Agent Suppression & BMS Interlock</h3>\n<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Turnkey Industrial Fire Safety Engineering</h3>\n<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>\n<h3>Addressable Detection & Smoke Aspiration</h3>\n<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>\n<h3>Clean Agent Suppression & BMS Interlock</h3>\n<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>\nID: <h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>\n<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>\n<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>\n<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>\n<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>\n<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/fire-alarm-system-installation' OR slug = 'fire-alarm-system-installation';

-- SERVICE: electrical-maintenance-service (slug: electrical-maintenance-service)
UPDATE services SET
  title = E'EN: Electrical Maintenance & Servicing
ID: Pemeliharaan & Perawatan Sistem Kelistrikan',
  summary = E'EN: Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.
ID: Layanan pemeliharaan preventif, prediktif, dan korektif komprehensif untuk trafo, kubikel MV, papan distribusi, dan circuit breaker.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Manajemen Pemeliharaan Aset Kelistrikan Proaktif</h3>\n<p>PT Multi Daya Mitra menyediakan program pemeliharaan preventif, prediktif, dan berbasis kondisi (condition-based maintenance) yang dirancang untuk mencegah terjadinya downtime mendadak, mengoptimalkan efisiensi energi, serta memperpanjang umur pakai peralatan listrik utama pabrik.</p>\n<h3>Cakupan Servis Multi-Disiplin</h3>\n<p>Tim insinyur pemeliharaan kami yang berpengalaman menginspeksi, menyervis, dan mengalibrasi transformator tipe minyak maupun kering, kubikel tegangan menengah, vacuum circuit breaker, panel distribusi tegangan rendah, kapasitor bank, serta relai proteksi dengan instrumen uji terkalibrasi internasional.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Proactive Electrical Asset Lifecycle Management</h3>\n<p>PT Multi Daya Mitra delivers comprehensive preventive, predictive, and condition-based maintenance programs designed to eliminate unscheduled outages, optimize energy efficiency, and extend the operating life of critical electrical equipment.</p>\n<h3>Multi-Discipline Servicing Scope</h3>\n<p>Our experienced service engineering teams inspect, service, and calibrate oil and dry-type transformers, medium voltage cubicles, vacuum circuit breakers, low-voltage switchboards, capacitor banks, and protection relays using industry-standard calibrated test equipment.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Proactive Electrical Asset Lifecycle Management</h3>\n<p>PT Multi Daya Mitra delivers comprehensive preventive, predictive, and condition-based maintenance programs designed to eliminate unscheduled outages, optimize energy efficiency, and extend the operating life of critical electrical equipment.</p>\n<h3>Multi-Discipline Servicing Scope</h3>\n<p>Our experienced service engineering teams inspect, service, and calibrate oil and dry-type transformers, medium voltage cubicles, vacuum circuit breakers, low-voltage switchboards, capacitor banks, and protection relays using industry-standard calibrated test equipment.</p>\nID: <h3>Manajemen Pemeliharaan Aset Kelistrikan Proaktif</h3>\n<p>PT Multi Daya Mitra menyediakan program pemeliharaan preventif, prediktif, dan berbasis kondisi (condition-based maintenance) yang dirancang untuk mencegah terjadinya downtime mendadak, mengoptimalkan efisiensi energi, serta memperpanjang umur pakai peralatan listrik utama pabrik.</p>\n<h3>Cakupan Servis Multi-Disiplin</h3>\n<p>Tim insinyur pemeliharaan kami yang berpengalaman menginspeksi, menyervis, dan mengalibrasi transformator tipe minyak maupun kering, kubikel tegangan menengah, vacuum circuit breaker, panel distribusi tegangan rendah, kapasitor bank, serta relai proteksi dengan instrumen uji terkalibrasi internasional.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service' OR slug = 'electrical-maintenance-service';

-- SERVICE: electrical-maintenance-service/transformer-oil-treatment-dga (slug: transformer-oil-treatment-dga)
UPDATE services SET
  title = E'EN: Transformer Oil Treatment, BDV & DGA
ID: Penanganan Minyak Trafo, Uji BDV & Analisis DGA',
  summary = E'EN: On-site oil purification, vacuum degassing, breakdown voltage (BDV) dielectric testing, and Dissolved Gas Analysis (DGA).
ID: Pemurnian minyak trafo on-site, degasifikasi vakum, pengujian tegangan tembus (BDV), dan Dissolved Gas Analysis (DGA).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemurnian & Dehidrasi Minyak Trafo Vakum Tinggi</h3>\n<p>Layanan filtrasi, dehidrasi vakum, dan degasifikasi minyak transformator on-site untuk menghilangkan kadar air terlarut, partikel lumpur, dan gelembung gas, memulihkan tegangan tembus minyak sesuai standar IEEE dan IEC tanpa perlu membongkar tangki.</p>\n<h3>Pengujian Tegangan Tembus (BDV) & Dielektrik</h3>\n<p>Pengujian breakdown voltage menggunakan alat uji minyak otomatis terkalibrasi untuk mengukur kekuatan dielektrik (kV), tingkat keasaman, tegangan antarmuka (IFT), dan faktor disipasi daya (tan delta).</p>\n<h3>Analisis Gas Terlarut (DGA) & Penilaian Kondisi Trafo</h3>\n<p>Pengujian laboratorium Dissolved Gas Analysis (DGA) untuk mengukur konsentrasi gas gangguan (Hidrogen, Metana, Etilen, Asetilen, Karbon Monoksida) guna mendiagnosis gejala overheating, partial discharge, atau busur api internal sebelum trafo mengalami kerusakan fatal.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Vacuum Transformer Oil Purification & Dehydration</h3>\n<p>On-site transformer oil filtration, vacuum dehydration, and degassing to remove dissolved moisture, sludge particles, and trapped gases, restoring transformer oil breakdown voltage to IEEE and IEC standards without draining the core.</p>\n<h3>Breakdown Voltage (BDV) & Dielectric Testing</h3>\n<p>Dielectric breakdown testing using calibrated automated oil testers to measure dielectric withstand strength (kV), acidity, interfacial tension (IFT), and power factor dissipation (tan delta).</p>\n<h3>Dissolved Gas Analysis (DGA) & Condition Assessment</h3>\n<p>Laboratory Dissolved Gas Analysis (DGA) identifying fault gas concentrations (Hydrogen, Methane, Ethylene, Acetylene, Carbon Monoxide) to diagnose active thermal hotspots, partial discharges, or internal arcing faults before catastrophic transformer failure.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Vacuum Transformer Oil Purification & Dehydration</h3>\n<p>On-site transformer oil filtration, vacuum dehydration, and degassing to remove dissolved moisture, sludge particles, and trapped gases, restoring transformer oil breakdown voltage to IEEE and IEC standards without draining the core.</p>\n<h3>Breakdown Voltage (BDV) & Dielectric Testing</h3>\n<p>Dielectric breakdown testing using calibrated automated oil testers to measure dielectric withstand strength (kV), acidity, interfacial tension (IFT), and power factor dissipation (tan delta).</p>\n<h3>Dissolved Gas Analysis (DGA) & Condition Assessment</h3>\n<p>Laboratory Dissolved Gas Analysis (DGA) identifying fault gas concentrations (Hydrogen, Methane, Ethylene, Acetylene, Carbon Monoxide) to diagnose active thermal hotspots, partial discharges, or internal arcing faults before catastrophic transformer failure.</p>\nID: <h3>Pemurnian & Dehidrasi Minyak Trafo Vakum Tinggi</h3>\n<p>Layanan filtrasi, dehidrasi vakum, dan degasifikasi minyak transformator on-site untuk menghilangkan kadar air terlarut, partikel lumpur, dan gelembung gas, memulihkan tegangan tembus minyak sesuai standar IEEE dan IEC tanpa perlu membongkar tangki.</p>\n<h3>Pengujian Tegangan Tembus (BDV) & Dielektrik</h3>\n<p>Pengujian breakdown voltage menggunakan alat uji minyak otomatis terkalibrasi untuk mengukur kekuatan dielektrik (kV), tingkat keasaman, tegangan antarmuka (IFT), dan faktor disipasi daya (tan delta).</p>\n<h3>Analisis Gas Terlarut (DGA) & Penilaian Kondisi Trafo</h3>\n<p>Pengujian laboratorium Dissolved Gas Analysis (DGA) untuk mengukur konsentrasi gas gangguan (Hidrogen, Metana, Etilen, Asetilen, Karbon Monoksida) guna mendiagnosis gejala overheating, partial discharge, atau busur api internal sebelum trafo mengalami kerusakan fatal.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/transformer-oil-treatment-dga' OR slug = 'transformer-oil-treatment-dga';

-- SERVICE: electrical-maintenance-service/mv-cubicle-acb-maintenance (slug: mv-cubicle-acb-maintenance)
UPDATE services SET
  title = E'EN: MV Cubicle & ACB Maintenance (Trip Testing)
ID: Pemeliharaan Kubikel MV & ACB (Pengujian Trip)',
  summary = E'EN: Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.
ID: Servis preventif switchgear tegangan menengah, uji resistansi kontak (Ductor), uji isolasi, dan injeksi sekunder ACB.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>\n<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>\n<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>\n<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>\n<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>\n<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>\n<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>\n<h3>Contact Resistance & Insulation Resistance Testing</h3>\n<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>\n<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>\n<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>\n<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>\n<h3>Contact Resistance & Insulation Resistance Testing</h3>\n<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>\n<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>\n<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>\nID: <h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>\n<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>\n<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>\n<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>\n<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>\n<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/mv-cubicle-acb-maintenance' OR slug = 'mv-cubicle-acb-maintenance';

-- SERVICE: electrical-maintenance-service/thermography-predictive-maintenance (slug: thermography-predictive-maintenance)
UPDATE services SET
  title = E'EN: Infrared Thermography & Predictive Maintenance
ID: Termografi Inframerah & Pemeliharaan Prediktif',
  summary = E'EN: Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, overloaded phases, and deteriorating contacts under full load.
ID: Pemindaian termal non-kontak FLIR untuk mendeteksi hot spot, sambungan busbar longgar, fase beban berlebih, dan degradasi kontak saat operasi penuh.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Deteksi Anomali Termal Non-Destruktif</h3>\n<p>Inspeksi termografi inframerah beresolusi tinggi yang dilakukan langsung saat sistem beroperasi bertegangan penuh menggunakan kamera termal industri FLIR terkalibrasi, mendeteksi kenaikan suhu abnormal sebelum menimbulkan kerusakan fatal atau kebakaran.</p>\n<h3>Sambungan Longgar, Ketidakseimbangan Fasa & Beban Lebih</h3>\n<p>Mendeteksi resistansi kontak tinggi akibat sambungan baut longgar, oksidasi pada sepatu kabel, ketidakseimbangan beban antar fasa, keausan kontak circuit breaker, serta kerusakan elemen kapasitor bank saat pabrik beroperasi normal.</p>\n<h3>Pelaporan Standar ISO/ASNT & Klasifikasi Tingkat Bahaya</h3>\n<p>Dikerjakan oleh termografer bersertifikasi Level II internasional, setiap laporan inspeksi menyajikan foto radiometrik termal, foto visual acuan, perhitungan selisih suhu (delta-T), serta rekomendasi tindakan perbaikan sesuai skala prioritas.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Non-Destructive Thermal Anomaly Detection</h3>\n<p>High-resolution infrared thermographic inspection conducted under live electrical operating conditions using calibrated FLIR industrial cameras, identifying thermal abnormalities before they cause equipment breakdown or fire hazards.</p>\n<h3>Loose Connections, Phase Imbalances & Overloading</h3>\n<p>Detect high-resistance electrical connections, oxidation on cable terminations, phase load imbalances, deteriorating circuit breaker contacts, and defective capacitor bank elements under normal production loads.</p>\n<h3>Standardized ISO/ASNT Reporting & Severity Classification</h3>\n<p>Delivered by certified Level II infrared thermographers, each inspection report includes thermal radiometric images, visual reference photos, delta-T temperature differential calculations, and prioritized corrective action recommendations.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Non-Destructive Thermal Anomaly Detection</h3>\n<p>High-resolution infrared thermographic inspection conducted under live electrical operating conditions using calibrated FLIR industrial cameras, identifying thermal abnormalities before they cause equipment breakdown or fire hazards.</p>\n<h3>Loose Connections, Phase Imbalances & Overloading</h3>\n<p>Detect high-resistance electrical connections, oxidation on cable terminations, phase load imbalances, deteriorating circuit breaker contacts, and defective capacitor bank elements under normal production loads.</p>\n<h3>Standardized ISO/ASNT Reporting & Severity Classification</h3>\n<p>Delivered by certified Level II infrared thermographers, each inspection report includes thermal radiometric images, visual reference photos, delta-T temperature differential calculations, and prioritized corrective action recommendations.</p>\nID: <h3>Deteksi Anomali Termal Non-Destruktif</h3>\n<p>Inspeksi termografi inframerah beresolusi tinggi yang dilakukan langsung saat sistem beroperasi bertegangan penuh menggunakan kamera termal industri FLIR terkalibrasi, mendeteksi kenaikan suhu abnormal sebelum menimbulkan kerusakan fatal atau kebakaran.</p>\n<h3>Sambungan Longgar, Ketidakseimbangan Fasa & Beban Lebih</h3>\n<p>Mendeteksi resistansi kontak tinggi akibat sambungan baut longgar, oksidasi pada sepatu kabel, ketidakseimbangan beban antar fasa, keausan kontak circuit breaker, serta kerusakan elemen kapasitor bank saat pabrik beroperasi normal.</p>\n<h3>Pelaporan Standar ISO/ASNT & Klasifikasi Tingkat Bahaya</h3>\n<p>Dikerjakan oleh termografer bersertifikasi Level II internasional, setiap laporan inspeksi menyajikan foto radiometrik termal, foto visual acuan, perhitungan selisih suhu (delta-T), serta rekomendasi tindakan perbaikan sesuai skala prioritas.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/thermography-predictive-maintenance' OR slug = 'thermography-predictive-maintenance';

-- SERVICE: electrical-maintenance-service/annual-maintenance-contracts (slug: annual-maintenance-contracts)
UPDATE services SET
  title = E'EN: Annual Maintenance Contracts (AMC) & 24/7 SLA
ID: Kontrak Pemeliharaan Tahunan (AMC) & SLA Siaga 24/7',
  summary = E'EN: Customized long-term service level agreements providing scheduled plant shutdowns, emergency call-outs, and spare parts management.
ID: Perjanjian tingkat layanan jangka panjang terpadu dengan shutdown terjadwal, respon darurat cepat, dan manajemen suku cadang.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Jaminan Ketersediaan Pabrik dengan Paket AMC Terencana</h3>\n<p>Perjanjian tingkat layanan (SLA) komprehensif yang dirancang untuk fasilitas manufaktur berkelanjutan, pusat data, dan pabrik industri berat, menyediakan servis berkala terjadwal, respons darurat cepat saat gangguan, serta perencanaan suku cadang strategis.</p>\n<h3>Eksekusi Pemeliharaan Rutin Shutdown Tahunan</h3>\n<p>Pengelolaan tim teknis terpadu saat periode shutdown tahunan pabrik, mencakup pembersihan total gardu induk, audit torsi baut busbar, pemolesan kontak, pelumasan mekanisme mekanik breaker, dan kalibrasi injeksi sekunder menyeluruh.</p>\n<h3>Dukungan Darurat 24/7 & Manajemen Suku Cadang</h3>\n<p>Hotline teknis khusus dengan waktu respons mobilisasi cepat untuk menangani insiden kelistrikan kritis, didukung penyediaan suku cadang konsinyasi untuk circuit breaker, relai proteksi, dan komponen listrik vital lainnya.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Guaranteed Plant Availability with Tailored AMC Plans</h3>\n<p>Comprehensive service level agreements (SLA) engineered for continuous process facilities, data centers, and industrial factories, providing routine scheduled servicing, rapid-response emergency breakdown callouts, and lifecycle spares planning.</p>\n<h3>Planned Annual Shutdown Execution</h3>\n<p>Complete multi-team management during scheduled annual plant turnarounds, including total substation cleaning, busbar torque auditing, contact polishing, breaker mechanism lubrication, and full secondary injection calibration.</p>\n<h3>24/7 Emergency Support & Strategic Spare Inventory</h3>\n<p>Dedicated technical hotline and rapid mobilization response for critical electrical disruptions, supported by consignment spare parts management for circuit breakers, relays, and vital electrical components.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Guaranteed Plant Availability with Tailored AMC Plans</h3>\n<p>Comprehensive service level agreements (SLA) engineered for continuous process facilities, data centers, and industrial factories, providing routine scheduled servicing, rapid-response emergency breakdown callouts, and lifecycle spares planning.</p>\n<h3>Planned Annual Shutdown Execution</h3>\n<p>Complete multi-team management during scheduled annual plant turnarounds, including total substation cleaning, busbar torque auditing, contact polishing, breaker mechanism lubrication, and full secondary injection calibration.</p>\n<h3>24/7 Emergency Support & Strategic Spare Inventory</h3>\n<p>Dedicated technical hotline and rapid mobilization response for critical electrical disruptions, supported by consignment spare parts management for circuit breakers, relays, and vital electrical components.</p>\nID: <h3>Jaminan Ketersediaan Pabrik dengan Paket AMC Terencana</h3>\n<p>Perjanjian tingkat layanan (SLA) komprehensif yang dirancang untuk fasilitas manufaktur berkelanjutan, pusat data, dan pabrik industri berat, menyediakan servis berkala terjadwal, respons darurat cepat saat gangguan, serta perencanaan suku cadang strategis.</p>\n<h3>Eksekusi Pemeliharaan Rutin Shutdown Tahunan</h3>\n<p>Pengelolaan tim teknis terpadu saat periode shutdown tahunan pabrik, mencakup pembersihan total gardu induk, audit torsi baut busbar, pemolesan kontak, pelumasan mekanisme mekanik breaker, dan kalibrasi injeksi sekunder menyeluruh.</p>\n<h3>Dukungan Darurat 24/7 & Manajemen Suku Cadang</h3>\n<p>Hotline teknis khusus dengan waktu respons mobilisasi cepat untuk menangani insiden kelistrikan kritis, didukung penyediaan suku cadang konsinyasi untuk circuit breaker, relai proteksi, dan komponen listrik vital lainnya.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/annual-maintenance-contracts' OR slug = 'annual-maintenance-contracts';

-- SERVICE: automation-solutions-services (slug: automation-solutions-services)
UPDATE services SET
  title = E'EN: Automation Solutions & Services
ID: Solusi & Layanan Otomasi Industri',
  summary = E'EN: Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.
ID: Otomasi industri, sistem SCADA (xArrow & EcoStruxure), pemrograman PLC, Pemantauan Energi (PME), dan optimasi proses manufaktur.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Otomasi Industri & Kontrol Proses Siap Pakai (Turnkey)</h3>\n<p>PT Multi Daya Mitra menghadirkan solusi otomasi terintegrasi yang menjembatani instrumentasi lapangan, arsitektur kontrol PLC, jaringan supervisi SCADA, dan pelaporan efisiensi energi korporat ke dalam satu platform terpadu yang sangat andal.</p>\n<h3>Keunggulan Integrator Sistem Tersertifikasi</h3>\n<p>Sebagai mitra solusi resmi xArrow SCADA dan System Integrator Schneider Electric tersertifikasi, kami melayani pengembangan perangkat lunak kustom, pengujian FAT/SAT, perakitan kabinet kontrol, serta komisioning lapangan di seluruh Indonesia.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Turnkey Industrial Automation & Process Control</h3>\n<p>PT Multi Daya Mitra delivers integrated automation solutions that bridge field instrumentation, PLC control architectures, supervisory SCADA networks, and enterprise energy reporting into a unified, high-reliability platform.</p>\n<h3>Certified System Integration Excellence</h3>\n<p>As authorized solutions partners for xArrow SCADA and certified Schneider Electric system integrators, we provide custom software development, FAT/SAT testing, control cabinet assembly, and on-site commissioning across Indonesia.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Turnkey Industrial Automation & Process Control</h3>\n<p>PT Multi Daya Mitra delivers integrated automation solutions that bridge field instrumentation, PLC control architectures, supervisory SCADA networks, and enterprise energy reporting into a unified, high-reliability platform.</p>\n<h3>Certified System Integration Excellence</h3>\n<p>As authorized solutions partners for xArrow SCADA and certified Schneider Electric system integrators, we provide custom software development, FAT/SAT testing, control cabinet assembly, and on-site commissioning across Indonesia.</p>\nID: <h3>Otomasi Industri & Kontrol Proses Siap Pakai (Turnkey)</h3>\n<p>PT Multi Daya Mitra menghadirkan solusi otomasi terintegrasi yang menjembatani instrumentasi lapangan, arsitektur kontrol PLC, jaringan supervisi SCADA, dan pelaporan efisiensi energi korporat ke dalam satu platform terpadu yang sangat andal.</p>\n<h3>Keunggulan Integrator Sistem Tersertifikasi</h3>\n<p>Sebagai mitra solusi resmi xArrow SCADA dan System Integrator Schneider Electric tersertifikasi, kami melayani pengembangan perangkat lunak kustom, pengujian FAT/SAT, perakitan kabinet kontrol, serta komisioning lapangan di seluruh Indonesia.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services' OR slug = 'automation-solutions-services';

-- SERVICE: automation-solutions-services/scada-hmi-process-monitoring (slug: scada-hmi-process-monitoring)
UPDATE services SET
  title = E'EN: SCADA Systems, HMI & Centralized Telemetry
ID: Sistem SCADA, HMI & Telemetri Terpusat',
  summary = E'EN: Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.
ID: Kontrol pengawasan pabrik terpusat, tampilan mimic dinamis, pencatatan alarm, tren historis, dan telemetri industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>\n<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>\n<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>\n<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>\n<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>\n<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Plant-Wide Supervisory Control & Data Acquisition</h3>\n<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>\n<h3>Multi-Protocol Telemetry & IoT Architecture</h3>\n<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>\n<h3>Alarm Management, Batch Recipes & Auditing</h3>\n<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Plant-Wide Supervisory Control & Data Acquisition</h3>\n<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>\n<h3>Multi-Protocol Telemetry & IoT Architecture</h3>\n<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>\n<h3>Alarm Management, Batch Recipes & Auditing</h3>\n<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>\nID: <h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>\n<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>\n<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>\n<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>\n<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>\n<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/scada-hmi-process-monitoring' OR slug = 'scada-hmi-process-monitoring';

-- SERVICE: automation-solutions-services/energy-management-iso50001 (slug: energy-management-iso50001)
UPDATE services SET
  title = E'EN: Energy Management Systems (EMS & ISO 50001)
ID: Sistem Manajemen Energi (EMS & ISO 50001)',
  summary = E'EN: Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.
ID: Pemantauan daya real-time, baseline energi otomatis, pelacakan beban puncak, dan pelaporan kepatuhan standar ESG.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>\n<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>\n<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>\n<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>\n<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>\n<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>\n<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>\n<h3>Sub-Billing & Departmental Cost Allocation</h3>\n<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>\n<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>\n<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>\n<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>\n<h3>Sub-Billing & Departmental Cost Allocation</h3>\n<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>\n<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>\n<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>\nID: <h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>\n<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>\n<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>\n<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>\n<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>\n<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/energy-management-iso50001' OR slug = 'energy-management-iso50001';

-- SERVICE: automation-solutions-services/plc-vsd-system-integration (slug: plc-vsd-system-integration)
UPDATE services SET
  title = E'EN: PLC Programming & Variable Speed Drive (VSD) Integration
ID: Pemrograman PLC & Integrasi Variable Speed Drive (VSD)',
  summary = E'EN: Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.
ID: Rekayasa logika PLC kustom, perakitan panel kontrol, penyetelan inverter Altivar/Danfoss/ABB, dan kontrol gerak presisi.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemrograman PLC Industri Kustom & Integrasi Sistem</h3>\n<p>Perancangan sistem kendali PLC siap pakai, pemrograman logika, perakitan panel kabinet, dan komisioning untuk platform Modicon (M580/M340/M241), Siemens S7 (1200/1500), dan Rockwell Allen-Bradley di berbagai proses industri.</p>\n<h3>Penyetelan Inverter & Variable Speed Drive (VSD)</h3>\n<p>Integrasi inverter frekuensi variabel (VFD) dan soft starter (Schneider Altivar, Danfoss, ABB) untuk pompa, fan/blower, kompresor, dan konveyor industri, menghasilkan kontrol torsi presisi dan penghematan daya listrik signifikan.</p>\n<h3>Safety PLC & Arsitektur Kendali Fail-Safe</h3>\n<p>Rekayasa sistem keselamatan mesin berstandar SIL 3 / PLe, rangkaian tombol darurat (emergency stop), tirai cahaya optik (light curtain), dan pengaman dua tangan demi perlindungan total operator dari bahaya mekanikal.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Custom Industrial PLC Programming & System Integration</h3>\n<p>Turnkey PLC control system design, programming, panel assembly, and commissioning covering Modicon (M580/M340/M241), Siemens S7 (1200/1500), and Rockwell Allen-Bradley platforms for automated industrial processes.</p>\n<h3>Variable Speed Drive (VSD) & Inverter Tuning</h3>\n<p>Integration of variable frequency drives (VFD) and soft starters (Schneider Altivar, Danfoss, ABB) for pumps, fans, compressors, and conveying machinery, delivering optimal torque control and significant energy savings.</p>\n<h3>Safety PLCs & Fail-Safe Architecture</h3>\n<p>Engineering SIL 3 / PLe compliant machine safety systems, emergency stop loops, light curtain interlocks, and two-hand safety monitoring for complete machinery risk mitigation.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Custom Industrial PLC Programming & System Integration</h3>\n<p>Turnkey PLC control system design, programming, panel assembly, and commissioning covering Modicon (M580/M340/M241), Siemens S7 (1200/1500), and Rockwell Allen-Bradley platforms for automated industrial processes.</p>\n<h3>Variable Speed Drive (VSD) & Inverter Tuning</h3>\n<p>Integration of variable frequency drives (VFD) and soft starters (Schneider Altivar, Danfoss, ABB) for pumps, fans, compressors, and conveying machinery, delivering optimal torque control and significant energy savings.</p>\n<h3>Safety PLCs & Fail-Safe Architecture</h3>\n<p>Engineering SIL 3 / PLe compliant machine safety systems, emergency stop loops, light curtain interlocks, and two-hand safety monitoring for complete machinery risk mitigation.</p>\nID: <h3>Pemrograman PLC Industri Kustom & Integrasi Sistem</h3>\n<p>Perancangan sistem kendali PLC siap pakai, pemrograman logika, perakitan panel kabinet, dan komisioning untuk platform Modicon (M580/M340/M241), Siemens S7 (1200/1500), dan Rockwell Allen-Bradley di berbagai proses industri.</p>\n<h3>Penyetelan Inverter & Variable Speed Drive (VSD)</h3>\n<p>Integrasi inverter frekuensi variabel (VFD) dan soft starter (Schneider Altivar, Danfoss, ABB) untuk pompa, fan/blower, kompresor, dan konveyor industri, menghasilkan kontrol torsi presisi dan penghematan daya listrik signifikan.</p>\n<h3>Safety PLC & Arsitektur Kendali Fail-Safe</h3>\n<p>Rekayasa sistem keselamatan mesin berstandar SIL 3 / PLe, rangkaian tombol darurat (emergency stop), tirai cahaya optik (light curtain), dan pengaman dua tangan demi perlindungan total operator dari bahaya mekanikal.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/plc-vsd-system-integration' OR slug = 'plc-vsd-system-integration';

-- SERVICE: inspection-testing-commissioning (slug: inspection-testing-commissioning)
UPDATE services SET
  title = E'EN: Inspection, Testing & Commissioning
ID: Inspeksi, Pengujian & Commissioning',
  summary = E'EN: Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.
ID: Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan Pengujian & Komisioning Tingkat Lanjut</h3>\n<p>Layanan pengujian elektrikal, inspeksi diagnostik, dan komisioning komprehensif untuk memverifikasi keselamatan, koordinasi proteksi, dan keandalan operasional sistem kelistrikan industri sebelum serah terima resmi.</p>\n<h3>Armada Alat Uji Terkalibrasi Kelas Dunia</h3>\n<p>Insinyur kami mengoperasikan unit uji relai Omicron CMC 356 terkalibrasi, penganalisis kualitas daya Fluke 435-II Kelas A, Megger insulasi tegangan tinggi, pemindai PD EA Technology, dan kamera termal FLIR untuk menghasilkan laporan teknis resmi terakreditasi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Advanced Testing & Commissioning Services</h3>\n<p>Comprehensive electrical testing, diagnostic inspection, and commissioning services to verify the safety, protection coordination, and operational integrity of industrial power systems before live handover.</p>\n<h3>World-Class Calibrated Testing Fleet</h3>\n<p>Our engineers utilize calibrated Omicron CMC 356 relay testers, Fluke 435-II Class A power analyzers, Megger insulation testers, EA Technology PD scanners, and FLIR thermal imagers to produce certified engineering test reports.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Advanced Testing & Commissioning Services</h3>\n<p>Comprehensive electrical testing, diagnostic inspection, and commissioning services to verify the safety, protection coordination, and operational integrity of industrial power systems before live handover.</p>\n<h3>World-Class Calibrated Testing Fleet</h3>\n<p>Our engineers utilize calibrated Omicron CMC 356 relay testers, Fluke 435-II Class A power analyzers, Megger insulation testers, EA Technology PD scanners, and FLIR thermal imagers to produce certified engineering test reports.</p>\nID: <h3>Layanan Pengujian & Komisioning Tingkat Lanjut</h3>\n<p>Layanan pengujian elektrikal, inspeksi diagnostik, dan komisioning komprehensif untuk memverifikasi keselamatan, koordinasi proteksi, dan keandalan operasional sistem kelistrikan industri sebelum serah terima resmi.</p>\n<h3>Armada Alat Uji Terkalibrasi Kelas Dunia</h3>\n<p>Insinyur kami mengoperasikan unit uji relai Omicron CMC 356 terkalibrasi, penganalisis kualitas daya Fluke 435-II Kelas A, Megger insulasi tegangan tinggi, pemindai PD EA Technology, dan kamera termal FLIR untuk menghasilkan laporan teknis resmi terakreditasi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning' OR slug = 'inspection-testing-commissioning';

-- SERVICE: inspection-testing-commissioning/power-quality-analysis-study (slug: power-quality-analysis-study)
UPDATE services SET
  title = E'EN: Power Quality Analysis & Harmonics Study
ID: Analisis Kualitas Daya & Studi Harmonisa',
  summary = E'EN: Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, transient detection, and mitigation design.
ID: Perekaman kualitas daya Kelas A, audit distorsi harmonisa (THD), fluktuasi tegangan, deteksi transien, dan perancangan filter mitigasi.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Audit Kualitas Daya Presisi Tinggi Standar Kelas A</h3>\n<p>Perekaman dan analisis kualitas daya listrik komprehensif sesuai standar IEC 61000-4-30 Kelas A dan IEEE 519 menggunakan penganalisis multi-kanal presisi guna mengaudit gangguan kelistrikan saat operasi pabrik berlangsung.</p>\n<h3>Analisis Distorsi Harmonisa (THD) & Risiko Resonansi</h3>\n<p>Pengukuran distorsi harmonisa tegangan total (THDv) dan arus (THDi) hingga orde ke-50, mengidentifikasi bahaya resonansi sistem, pemanasan berlebih pada kawat netral, serta kerusakan fatal pada bank kapasitor.</p>\n<h3>Tangkapan Fluktuasi Tegangan (Sag/Swell), Kedip & Transien</h3>\n<p>Perekaman bentuk gelombang kecepatan tinggi untuk menangkap lonjakan tegangan (swell), penurunan sesaat (sag), kedipan (flicker), dan transien switching yang sering menyebabkan reset mendadak pada PLC, trip inverter VSD, serta cacat produksi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Class A Precision Power Quality Auditing</h3>\n<p>Comprehensive power quality logging and analysis in accordance with IEC 61000-4-30 Class A and IEEE 519 standards using precision multi-channel analyzers to audit electrical disturbances under real operating conditions.</p>\n<h3>Harmonic Distortion (THD) & Resonance Analysis</h3>\n<p>Measurement of Total Harmonic Voltage Distortion (THDv) and Current Distortion (THDi) up to the 50th order, identifying resonance risks, overheated neutral conductors, and capacitor bank failures.</p>\n<h3>Voltage Sag, Swell, Flicker & Transient Capture</h3>\n<p>High-speed waveform capture recording sub-cycle voltage sags, swells, flicker, and switching transients that trigger sensitive PLC resets, VSD lockouts, and precision manufacturing defects.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Class A Precision Power Quality Auditing</h3>\n<p>Comprehensive power quality logging and analysis in accordance with IEC 61000-4-30 Class A and IEEE 519 standards using precision multi-channel analyzers to audit electrical disturbances under real operating conditions.</p>\n<h3>Harmonic Distortion (THD) & Resonance Analysis</h3>\n<p>Measurement of Total Harmonic Voltage Distortion (THDv) and Current Distortion (THDi) up to the 50th order, identifying resonance risks, overheated neutral conductors, and capacitor bank failures.</p>\n<h3>Voltage Sag, Swell, Flicker & Transient Capture</h3>\n<p>High-speed waveform capture recording sub-cycle voltage sags, swells, flicker, and switching transients that trigger sensitive PLC resets, VSD lockouts, and precision manufacturing defects.</p>\nID: <h3>Audit Kualitas Daya Presisi Tinggi Standar Kelas A</h3>\n<p>Perekaman dan analisis kualitas daya listrik komprehensif sesuai standar IEC 61000-4-30 Kelas A dan IEEE 519 menggunakan penganalisis multi-kanal presisi guna mengaudit gangguan kelistrikan saat operasi pabrik berlangsung.</p>\n<h3>Analisis Distorsi Harmonisa (THD) & Risiko Resonansi</h3>\n<p>Pengukuran distorsi harmonisa tegangan total (THDv) dan arus (THDi) hingga orde ke-50, mengidentifikasi bahaya resonansi sistem, pemanasan berlebih pada kawat netral, serta kerusakan fatal pada bank kapasitor.</p>\n<h3>Tangkapan Fluktuasi Tegangan (Sag/Swell), Kedip & Transien</h3>\n<p>Perekaman bentuk gelombang kecepatan tinggi untuk menangkap lonjakan tegangan (swell), penurunan sesaat (sag), kedipan (flicker), dan transien switching yang sering menyebabkan reset mendadak pada PLC, trip inverter VSD, serta cacat produksi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/power-quality-analysis-study' OR slug = 'power-quality-analysis-study';

-- SERVICE: inspection-testing-commissioning/partial-discharge-pd-scan (slug: partial-discharge-pd-scan)
UPDATE services SET
  title = E'EN: Partial Discharge (PD) Scan & Insulation Diagnostics
ID: Pemindaian Partial Discharge (PD) & Diagnostik Isolasi',
  summary = E'EN: Non-invasive TEV (Transient Earth Voltage), acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.
ID: Sensor non-invasif TEV, ultrasonik akustik, dan HFCT untuk pemindaian PD switchgear dan kabel bertegangan langsung.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Deteksi Partial Discharge Bertegangan Non-Invasif (On-Line)</h3>\n<p>Deteksi dini gejala degradasi isolasi pada aset tegangan menengah dan tinggi (switchgear, transformator, kabel daya, dan busduct) saat beroperasi tanpa memerlukan penghentian suplai listrik pabrik.</p>\n<h3>Pengukuran Multi-Sensor (TEV, Akustik & HFCT)</h3>\n<p>Pemanfaatan sensor Transient Earth Voltage (TEV) untuk mendeteksi rongga internal, sensor ultrasonik akustik untuk gejala perambatan permukaan (surface tracking), serta High-Frequency Current Transformer (HFCT) untuk kabel daya.</p>\n<h3>Rencana Tindakan Pemeliharaan Berbasis Kondisi</h3>\n<p>Analisis bentuk pulsa fase (PRPD) untuk mengklasifikasikan jenis lucutan (korona, permukaan, rongga dalam), menentukan tingkat keparahan anomali, dan menyusun rekomendasi perbaikan terencana sebelum terjadi ledakan dielektrik.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Non-Invasive On-Line Partial Discharge Detection</h3>\n<p>Early-stage detection of insulation deterioration in live medium and high-voltage assets (switchgear, transformers, cables, and busducts) without requiring plant power shutdowns.</p>\n<h3>Multi-Sensor Measurement (TEV, Acoustic & HFCT)</h3>\n<p>Simultaneous utilization of Transient Earth Voltage (TEV) sensors for internal voids, ultrasonic acoustic probes for surface tracking, and High-Frequency Current Transformers (HFCT) for cable termination PD activity.</p>\n<h3>Condition-Based Maintenance Action Plans</h3>\n<p>PD phase-resolved pulse analysis (PRPD) to classify discharge mechanisms (corona, surface, internal cavity), determine fault severity, and recommend scheduled repair before dielectric breakdown occurs.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Non-Invasive On-Line Partial Discharge Detection</h3>\n<p>Early-stage detection of insulation deterioration in live medium and high-voltage assets (switchgear, transformers, cables, and busducts) without requiring plant power shutdowns.</p>\n<h3>Multi-Sensor Measurement (TEV, Acoustic & HFCT)</h3>\n<p>Simultaneous utilization of Transient Earth Voltage (TEV) sensors for internal voids, ultrasonic acoustic probes for surface tracking, and High-Frequency Current Transformers (HFCT) for cable termination PD activity.</p>\n<h3>Condition-Based Maintenance Action Plans</h3>\n<p>PD phase-resolved pulse analysis (PRPD) to classify discharge mechanisms (corona, surface, internal cavity), determine fault severity, and recommend scheduled repair before dielectric breakdown occurs.</p>\nID: <h3>Deteksi Partial Discharge Bertegangan Non-Invasif (On-Line)</h3>\n<p>Deteksi dini gejala degradasi isolasi pada aset tegangan menengah dan tinggi (switchgear, transformator, kabel daya, dan busduct) saat beroperasi tanpa memerlukan penghentian suplai listrik pabrik.</p>\n<h3>Pengukuran Multi-Sensor (TEV, Akustik & HFCT)</h3>\n<p>Pemanfaatan sensor Transient Earth Voltage (TEV) untuk mendeteksi rongga internal, sensor ultrasonik akustik untuk gejala perambatan permukaan (surface tracking), serta High-Frequency Current Transformer (HFCT) untuk kabel daya.</p>\n<h3>Rencana Tindakan Pemeliharaan Berbasis Kondisi</h3>\n<p>Analisis bentuk pulsa fase (PRPD) untuk mengklasifikasikan jenis lucutan (korona, permukaan, rongga dalam), menentukan tingkat keparahan anomali, dan menyusun rekomendasi perbaikan terencana sebelum terjadi ledakan dielektrik.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/partial-discharge-pd-scan' OR slug = 'partial-discharge-pd-scan';

-- SERVICE: inspection-testing-commissioning/relay-protection-testing-commissioning (slug: relay-protection-testing-commissioning)
UPDATE services SET
  title = E'EN: Protection Relay Testing (Secondary Injection)
ID: Pengujian Relay Proteksi (Injeksi Sekunder)',
  summary = E'EN: 3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.
ID: Pengujian injeksi sekunder 3-fase & 6-fase menggunakan unit Omicron CMC untuk relay proteksi arus lebih, diferensial, dan jarak.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>\n<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>\n<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>\n<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>\n<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>\n<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Protection Relay Secondary Injection Testing</h3>\n<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>\n<h3>Omicron Multi-Phase Automated Injection Sets</h3>\n<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>\n<h3>Coordination & Arc-Flash Clearing Time Verification</h3>\n<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Protection Relay Secondary Injection Testing</h3>\n<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>\n<h3>Omicron Multi-Phase Automated Injection Sets</h3>\n<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>\n<h3>Coordination & Arc-Flash Clearing Time Verification</h3>\n<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>\nID: <h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>\n<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>\n<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>\n<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>\n<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>\n<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/relay-protection-testing-commissioning' OR slug = 'relay-protection-testing-commissioning';

-- SERVICE: mechanical-services-supplies (slug: mechanical-services-supplies)
UPDATE services SET
  title = E'EN: Mechanical Services & General Supplies
ID: Layanan Mekanikal & Pengadaan Industri',
  summary = E'EN: Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.
ID: Pemeliharaan mekanikal industri, sistem konveyor, separator magnetik, pintu industri berkecepatan tinggi, vacuum lifter, dan servis motor/generator.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan Mekanikal Industri & Pengadaan Khusus</h3>\n<p>PT Multi Daya Mitra menyediakan layanan pemeliharaan mekanikal komprehensif, overhaul peralatan industri, dan solusi pengadaan rekayasa guna memaksimalkan waktu operasional mesin, efisiensi penanganan material, dan keselamatan kerja pabrik.</p>\n<h3>Perawatan Peralatan & Balancing Dinamis</h3>\n<p>Cakupan kami meliputi sistem konveyor industri, separator magnetik pemisah logam, pintu otomatis berkecepatan tinggi (high-speed door), peralatan vacuum lifter, serta overhaul mesin berputar mencakup balancing dinamis rotor dan pelapisan ulang isolasi stator motor.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Industrial Mechanical Services & Specialized Supplies</h3>\n<p>PT Multi Daya Mitra provides comprehensive mechanical maintenance, equipment overhauls, and engineered supply solutions to maximize plant machinery uptime, material handling efficiency, and operational safety.</p>\n<h3>Equipment Servicing & Dynamic Balancing</h3>\n<p>Our scope covers industrial conveyor systems, magnetic separators, high-speed spiral doors, vacuum lifting devices, and rotating machinery overhaul including dynamic rotor balancing and motor stator insulation rewinding.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial Mechanical Services & Specialized Supplies</h3>\n<p>PT Multi Daya Mitra provides comprehensive mechanical maintenance, equipment overhauls, and engineered supply solutions to maximize plant machinery uptime, material handling efficiency, and operational safety.</p>\n<h3>Equipment Servicing & Dynamic Balancing</h3>\n<p>Our scope covers industrial conveyor systems, magnetic separators, high-speed spiral doors, vacuum lifting devices, and rotating machinery overhaul including dynamic rotor balancing and motor stator insulation rewinding.</p>\nID: <h3>Layanan Mekanikal Industri & Pengadaan Khusus</h3>\n<p>PT Multi Daya Mitra menyediakan layanan pemeliharaan mekanikal komprehensif, overhaul peralatan industri, dan solusi pengadaan rekayasa guna memaksimalkan waktu operasional mesin, efisiensi penanganan material, dan keselamatan kerja pabrik.</p>\n<h3>Perawatan Peralatan & Balancing Dinamis</h3>\n<p>Cakupan kami meliputi sistem konveyor industri, separator magnetik pemisah logam, pintu otomatis berkecepatan tinggi (high-speed door), peralatan vacuum lifter, serta overhaul mesin berputar mencakup balancing dinamis rotor dan pelapisan ulang isolasi stator motor.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies' OR slug = 'mechanical-services-supplies';

-- SERVICE: mechanical-services-supplies/industrial-mechanical-supplies-services (slug: industrial-mechanical-supplies-services)
UPDATE services SET
  title = E'EN: Conveyor Systems, Magnetic Separators & Industrial Supplies
ID: Sistem Konveyor, Separator Magnetik & Perlengkapan Industri',
  summary = E'EN: Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.
ID: Pengadaan, instalasi, dan servis lini konveyor, pemisah logam magnetik, sectional door, dan peralatan vacuum lifter.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>\n<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>\n<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>\n<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>\n<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>\n<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Material Handling & Mechanical Infrastructure Supplies</h3>\n<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>\n<h3>Conveyor Systems & Overband Magnetic Separators</h3>\n<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>\n<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>\n<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Material Handling & Mechanical Infrastructure Supplies</h3>\n<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>\n<h3>Conveyor Systems & Overband Magnetic Separators</h3>\n<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>\n<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>\n<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>\nID: <h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>\n<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>\n<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>\n<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>\n<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>\n<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/industrial-mechanical-supplies-services' OR slug = 'industrial-mechanical-supplies-services';

-- SERVICE: mechanical-services-supplies/motor-generator-servicing-overhaul (slug: motor-generator-servicing-overhaul)
UPDATE services SET
  title = E'EN: Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)
ID: Overhaul Motor & Generator (Pelapisan Ulang Isolasi & Balancing Dinamis)',
  summary = E'EN: Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.
ID: Servis elektromotor, motor MV, generator, pelapisan ulang isolasi kumparan, analisis vibrasi, dan rekondisi rotor.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan Overhaul Komprehensif Mesin Berputar</h3>\n<p>Pemeliharaan mekanik dan elektrikal presisi untuk motor listrik tegangan rendah dan menengah, motor industri berat, serta unit generator guna memulihkan kinerja spesifikasi awal pabrikan dan meniadakan vibrasi mekanikal.</p>\n<h3>Rewinding Kumparan Stator & Perendaman Pernis Vakum (VPI)</h3>\n<p>Rekondisi kumparan stator dan rotor, pelapisan ulang isolasi termal Kelas H, proses varnishing vakum, dan pengeringan oven untuk memulihkan ketahanan dielektrik serta mencegah kebocoran arus di lingkungan lembap industri.</p>\n<h3>Balancing Dinamis Rotor di Lapangan & Workshop</h3>\n<p>Balancing dinamis presisi standar ISO 1940 untuk poros rotor, blower impeller, dan kopling transmisi guna mengeliminasi getaran sentrifugal destruktif, memperpanjang usia bearing, dan meningkatkan keandalan motor.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Comprehensive Overhaul for Rotating Machinery</h3>\n<p>Precision mechanical and electrical maintenance for low and medium voltage electric motors, heavy industrial drives, and generator sets to restore OEM performance and eliminate mechanical vibration.</p>\n<h3>Stator Rewinding & Vacuum Pressure Impregnation (VPI)</h3>\n<p>Complete stator and rotor winding rehabilitation, class H insulation recoating, vacuum varnishing, and baking to restore dielectric strength, prevent partial discharge, and resist harsh industrial humidity.</p>\n<h3>On-Site & Workshop Dynamic Rotor Balancing</h3>\n<p>ISO 1940 standard precision dynamic balancing of rotors, fans, impellers, and couplings to eliminate destructive centrifugal vibration, reducing bearing wear and extending machine lifespan.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Comprehensive Overhaul for Rotating Machinery</h3>\n<p>Precision mechanical and electrical maintenance for low and medium voltage electric motors, heavy industrial drives, and generator sets to restore OEM performance and eliminate mechanical vibration.</p>\n<h3>Stator Rewinding & Vacuum Pressure Impregnation (VPI)</h3>\n<p>Complete stator and rotor winding rehabilitation, class H insulation recoating, vacuum varnishing, and baking to restore dielectric strength, prevent partial discharge, and resist harsh industrial humidity.</p>\n<h3>On-Site & Workshop Dynamic Rotor Balancing</h3>\n<p>ISO 1940 standard precision dynamic balancing of rotors, fans, impellers, and couplings to eliminate destructive centrifugal vibration, reducing bearing wear and extending machine lifespan.</p>\nID: <h3>Layanan Overhaul Komprehensif Mesin Berputar</h3>\n<p>Pemeliharaan mekanik dan elektrikal presisi untuk motor listrik tegangan rendah dan menengah, motor industri berat, serta unit generator guna memulihkan kinerja spesifikasi awal pabrikan dan meniadakan vibrasi mekanikal.</p>\n<h3>Rewinding Kumparan Stator & Perendaman Pernis Vakum (VPI)</h3>\n<p>Rekondisi kumparan stator dan rotor, pelapisan ulang isolasi termal Kelas H, proses varnishing vakum, dan pengeringan oven untuk memulihkan ketahanan dielektrik serta mencegah kebocoran arus di lingkungan lembap industri.</p>\n<h3>Balancing Dinamis Rotor di Lapangan & Workshop</h3>\n<p>Balancing dinamis presisi standar ISO 1940 untuk poros rotor, blower impeller, dan kopling transmisi guna mengeliminasi getaran sentrifugal destruktif, memperpanjang usia bearing, dan meningkatkan keandalan motor.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/motor-generator-servicing-overhaul' OR slug = 'motor-generator-servicing-overhaul';

COMMIT;


-- ==========================================
-- Migration: 027_bilingual_site_settings.up.sql
-- ==========================================

-- 027_bilingual_site_settings.up.sql
-- Update Site Settings with bilingual tagline and footerDescription

BEGIN;

UPDATE settings
SET value = jsonb_set(
    jsonb_set(
        COALESCE(value, '{}'::jsonb),
        '{tagline}',
        to_jsonb(E'EN: Electrical · Automation · Fire System\nID: Elektrikal · Otomasi · Sistem Fire Alarm'::text)
    ),
    '{footerDescription}',
    to_jsonb(E'EN: Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.\nID: Perusahaan layanan rekayasa elektrikal, otomasi industri, dan sistem fire alarm terkemuka di Indonesia — menghadirkan solusi andal untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur sejak 2012.'::text)
),
    updated_at = now()
WHERE key = 'site';

COMMIT;


-- ==========================================
-- Migration: 028_add_rittal_products.up.sql
-- ==========================================

-- 028_add_rittal_products.up.sql
-- Add 3 official Rittal products from rittal.com:
-- 1. Rittal IT Infrastructure & Data Center Solutions (VX IT & Micro DC)
-- 2. Rittal Outdoor Enclosure Systems (CS Toptec & CS New Basic)
-- 3. Rittal Automation Systems (Perforex MT & Secarex)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/it-infrastructure
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000771',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'it-infrastructure',
  'rittal-distributor/it-infrastructure',
  E'EN: Rittal IT Infrastructure & Data Center Solutions (VX IT & Micro DC)
ID: Infrastruktur IT & Solusi Data Center Rittal (VX IT & Micro DC)',
  E'EN: Standardized and modular IT rack systems, TX CableNet network racks, Edge Data Centers, and Smart PDU power management for scalable enterprise IT rooms.
ID: Sistem rak IT modular terstandarisasi, rak jaringan TX CableNet, Edge Data Center, dan manajemen daya Smart PDU untuk ruang IT enterprise yang andal dan terukur.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rittal VX IT: Platform Global untuk Data Center Modern</h3>\n<p>Rittal VX IT adalah platform rak paling serbaguna di dunia untuk seluruh aplikasi infrastruktur IT, mulai dari ruang server jaringan tunggal hingga pusat data berskala besar (hyperscale). Dirancang dengan modularitas tinggi dan kemudahan instalasi cepat, VX IT memungkinkan pemasangan rel 19\", panel samping, dan manajemen kabel secara snap-in tanpa bantuan perkakas, memangkas waktu perakitan hingga 50%.</p>\n<h3>Edge Data Center & Enclosure Micro Data Center</h3>\n<p>Untuk komputasi edge terdesentralisasi, pabrik pintar industri, dan kantor cabang terpencil, Micro Data Center Rittal menghadirkan infrastruktur IT lengkap dan siap pakai yang terlindungi aman di dalam enclosure berstandar proteksi IP55 / NEMA 12. Dilengkapi sistem pendingin terintegrasi Blue e+ atau LCP, deteksi kebakaran otomatis dan pemadam gas clean-agent (DET-AC III), serta kontrol akses biometrik.</p>\n<h3>Distribusi Daya Cerdas & Manajemen Termal Presisi</h3>\n<p>Dilengkapi Smart PDU Rittal cerdas dengan pengukuran konsumsi listrik tingkat outlet individual, kapabilitas reboot jarak jauh, dan penyeimbangan fase. Untuk beban panas ekstrem, unit Rittal Liquid Cooling Package (LCP) menyalurkan pendinginan air dingin berefisiensi tinggi langsung di samping rak server, mampu mengatasi beban termal hingga 55 kW per enclosure.</p>\n<h3>Pemantauan Lingkungan Waktu Nyata CMC III</h3>\n<p>Pemantauan terus-menerus terhadap suhu lingkungan, kelembaban, tekanan udara diferensial, asap, kebocoran air, dan getaran fisik melalui sistem IoT Rittal Computer Multi Control (CMC III) yang terintegrasi langsung ke platform DCIM dan manajemen jaringan berbasis SNMP/Modbus.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Rittal VX IT: The Global Platform for Modern Data Centers</h3>\n<p>The Rittal VX IT is the world''s most versatile rack platform for all IT applications, from single network closets to high-density hyperscale data centers. Engineered for ultimate modularity and speed, the VX IT enables tool-free, snap-in installation of 19\" rails, side panels, and cable management accessories, cutting deployment time by up to 50%.</p>\n<h3>Edge Data Centers & Micro Data Center Enclosures</h3>\n<p>For decentralized edge computing, industrial smart factories, and remote branch offices, Rittal Micro Data Centers provide a fully self-contained, turnkey IT infrastructure safe inside an IP55 / NEMA 12 rated enclosure. Integrated with dedicated Blue e+ or LCP cooling, automated fire detection and clean-agent suppression (DET-AC III), and biometric access control.</p>\n<h3>Intelligent Power Distribution & Precision Thermal Management</h3>\n<p>Equipped with intelligent Rittal Smart PDUs offering individual outlet-level metering, remote rebooting, and phase balancing. For extreme heat loads, Rittal Liquid Cooling Packages (LCP) deliver high-efficiency chilled water cooling directly adjacent to rack servers, handling thermal densities up to 55 kW per enclosure.</p>\n<h3>CMC III Real-Time Environmental Monitoring</h3>\n<p>Continuous monitoring of ambient temperature, humidity, differential air pressure, smoke, water leaks, and vibration via the Rittal Computer Multi Control (CMC III) IoT system, seamlessly integrated into DCIM and SNMP/Modbus network management platforms.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Rittal VX IT: The Global Platform for Modern Data Centers</h3>\n<p>The Rittal VX IT is the world''s most versatile rack platform for all IT applications, from single network closets to high-density hyperscale data centers. Engineered for ultimate modularity and speed, the VX IT enables tool-free, snap-in installation of 19\" rails, side panels, and cable management accessories, cutting deployment time by up to 50%.</p>\n<h3>Edge Data Centers & Micro Data Center Enclosures</h3>\n<p>For decentralized edge computing, industrial smart factories, and remote branch offices, Rittal Micro Data Centers provide a fully self-contained, turnkey IT infrastructure safe inside an IP55 / NEMA 12 rated enclosure. Integrated with dedicated Blue e+ or LCP cooling, automated fire detection and clean-agent suppression (DET-AC III), and biometric access control.</p>\n<h3>Intelligent Power Distribution & Precision Thermal Management</h3>\n<p>Equipped with intelligent Rittal Smart PDUs offering individual outlet-level metering, remote rebooting, and phase balancing. For extreme heat loads, Rittal Liquid Cooling Packages (LCP) deliver high-efficiency chilled water cooling directly adjacent to rack servers, handling thermal densities up to 55 kW per enclosure.</p>\n<h3>CMC III Real-Time Environmental Monitoring</h3>\n<p>Continuous monitoring of ambient temperature, humidity, differential air pressure, smoke, water leaks, and vibration via the Rittal Computer Multi Control (CMC III) IoT system, seamlessly integrated into DCIM and SNMP/Modbus network management platforms.</p>\nID: <h3>Rittal VX IT: Platform Global untuk Data Center Modern</h3>\n<p>Rittal VX IT adalah platform rak paling serbaguna di dunia untuk seluruh aplikasi infrastruktur IT, mulai dari ruang server jaringan tunggal hingga pusat data berskala besar (hyperscale). Dirancang dengan modularitas tinggi dan kemudahan instalasi cepat, VX IT memungkinkan pemasangan rel 19\", panel samping, dan manajemen kabel secara snap-in tanpa bantuan perkakas, memangkas waktu perakitan hingga 50%.</p>\n<h3>Edge Data Center & Enclosure Micro Data Center</h3>\n<p>Untuk komputasi edge terdesentralisasi, pabrik pintar industri, dan kantor cabang terpencil, Micro Data Center Rittal menghadirkan infrastruktur IT lengkap dan siap pakai yang terlindungi aman di dalam enclosure berstandar proteksi IP55 / NEMA 12. Dilengkapi sistem pendingin terintegrasi Blue e+ atau LCP, deteksi kebakaran otomatis dan pemadam gas clean-agent (DET-AC III), serta kontrol akses biometrik.</p>\n<h3>Distribusi Daya Cerdas & Manajemen Termal Presisi</h3>\n<p>Dilengkapi Smart PDU Rittal cerdas dengan pengukuran konsumsi listrik tingkat outlet individual, kapabilitas reboot jarak jauh, dan penyeimbangan fase. Untuk beban panas ekstrem, unit Rittal Liquid Cooling Package (LCP) menyalurkan pendinginan air dingin berefisiensi tinggi langsung di samping rak server, mampu mengatasi beban termal hingga 55 kW per enclosure.</p>\n<h3>Pemantauan Lingkungan Waktu Nyata CMC III</h3>\n<p>Pemantauan terus-menerus terhadap suhu lingkungan, kelembaban, tekanan udara diferensial, asap, kebocoran air, dan getaran fisik melalui sistem IoT Rittal Computer Multi Control (CMC III) yang terintegrasi langsung ke platform DCIM dan manajemen jaringan berbasis SNMP/Modbus.</p>"}]}'::jsonb,
  '{"EN: System Architecture\nID: Arsitektur Sistem":"Rittal VX IT & TX CableNet modular server & network racks","EN: Load Capacity\nID: Kapasitas Beban":"Static load up to 18,000 N (1,800 kg) / Dynamic up to 15,000 N","EN: Height & Dimensions\nID: Ketinggian & Dimensi":"15U, 24U, 42U, 47U, 52U (Width 600/800 mm, Depth 800/1000/1200 mm)","EN: Protection Rating\nID: Tingkat Proteksi":"IP20 (vented perforated doors) / IP55 (solid sheet steel doors)","EN: Cooling & Thermal\nID: Sistem Pendinginan":"LCP (Liquid Cooling Package) up to 55 kW per rack, smart cold/hot aisle containment","EN: Power & Monitoring\nID: Daya & Pemantauan":"Smart PDU (Metered/Switched/Managed) & CMC III IoT monitoring platform"}'::jsonb,
  '/uploads/products-rittal-it-infrastructure.jpg',
  'published',
  now(),
  4,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/outdoor-enclosures
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000772',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'outdoor-enclosures',
  'rittal-distributor/outdoor-enclosures',
  E'EN: Rittal Outdoor Enclosure Systems (CS Toptec & CS New Basic)
ID: Sistem Enclosure Outdoor Rittal (CS Toptec & CS New Basic)',
  E'EN: Weatherproof, double-walled aluminium outdoor enclosures designed for harsh environmental conditions, telecommunications 5G sites, rail, and smart traffic infrastructure.
ID: Enclosure outdoor aluminium dinding ganda tahan cuaca ekstrem yang dirancang untuk telekomunikasi 5G, perkeretaapian, dan infrastruktur lalu lintas cerdas.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Dirancang Khusus untuk Lingkungan Luar Ruang Ekstrem</h3>\n<p>Enclosure outdoor Rittal dirancang khusus untuk melindungi sistem daya kritis, telekomunikasi, dan kontrol otomasi dari paparan cuaca berat—termasuk radiasi panas matahari tropis yang menyengat, hujan deras, badai debu, polusi industri, dan udara berkadar garam tinggi di area pesisir. Memenuhi standar internasional IEC 61969 untuk kabinet elektronik luar ruang.</p>\n<h3>Arsitektur Dinding Ganda & Efek Cerobong Alami</h3>\n<p>Seri CS Toptec menggunakan struktur aluminium berdinding ganda (twin-wall) mutakhir yang terdiri dari rangka internal dan lapisan pelindung eksternal. Rongga udara di antara dinding memanfaatkan efek cerobong alami untuk membuang panas radiasi matahari hingga lebih dari 60% dibanding kabinet logam dinding tunggal biasa, sehingga menghemat konsumsi daya pendingin secara signifikan.</p>\n<h3>Kapabilitas Penggabungan Modular CS Toptec</h3>\n<p>Dibangun di atas pola kisi modular 25 mm khas Rittal, lemari CS Toptec mendukung penggabungan (baying) multi-kompartemen di atas pondasi beton. Desain modular ini memungkinkan pemisahan fisik yang terorganisir antara kompartemen baterai cadangan, penyearah AC/DC, distribusi fiber optik, dan perangkat transmisi gelombang mikro.</p>\n<h3>Sistem Pendingin Terintegrasi & Perlindungan Anti-Vandalisme</h3>\n<p>Dapat dipadukan dengan unit pendingin outdoor Blue e+, penukar panas (heat exchanger), dan pendingin termoelektrik Rittal. Dilengkapi sistem penguncian batang multi-titik espagnolette, engsel tersembunyi di dalam, dan proteksi anti-vandalisme bersertifikasi RC 2 / RC 3 guna mencegah pembobolan fisik tanpa izin.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Engineered for Harsh Outdoor Environments</h3>\n<p>Rittal outdoor enclosures are engineered specifically to shield mission-critical power, telecommunications, and automation controls from punishing environmental conditions—including extreme tropical sun, driving rain, dust storms, industrial smog, and coastal salt fog. Designed according to IEC 61969 standards for outdoor electronic cabinets.</p>\n<h3>Double-Walled Architecture & Natural Chimney Effect</h3>\n<p>The CS Toptec series features an advanced double-walled aluminium structure consisting of an internal frame and an external protective skin. The air gap between walls harnesses the natural chimney effect to dissipate solar radiation, preventing solar heat gain by more than 60% compared to conventional single-walled metal cabinets and dramatically lowering HVAC cooling power demands.</p>\n<h3>CS Toptec Modular Baying Capability</h3>\n<p>Built upon Rittal''s signature 25 mm modular pitch, CS Toptec enclosures support seamless multi-bay expansion on concrete plinths. The modular design enables distinct physical separation between battery banks, AC/DC rectifiers, optical fiber distribution, and microwave transmission hardware.</p>\n<h3>Integrated Climate Control & Vandalism Resistance</h3>\n<p>Compatible with Rittal outdoor Blue e+ cooling units, heat exchangers, and thermoelectric coolers. Fitted with multi-point espagnolette locking mechanisms, internal hinges, and anti-vandalism features meeting RC 2 / RC 3 security ratings to prevent unauthorized physical tampering.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Engineered for Harsh Outdoor Environments</h3>\n<p>Rittal outdoor enclosures are engineered specifically to shield mission-critical power, telecommunications, and automation controls from punishing environmental conditions—including extreme tropical sun, driving rain, dust storms, industrial smog, and coastal salt fog. Designed according to IEC 61969 standards for outdoor electronic cabinets.</p>\n<h3>Double-Walled Architecture & Natural Chimney Effect</h3>\n<p>The CS Toptec series features an advanced double-walled aluminium structure consisting of an internal frame and an external protective skin. The air gap between walls harnesses the natural chimney effect to dissipate solar radiation, preventing solar heat gain by more than 60% compared to conventional single-walled metal cabinets and dramatically lowering HVAC cooling power demands.</p>\n<h3>CS Toptec Modular Baying Capability</h3>\n<p>Built upon Rittal''s signature 25 mm modular pitch, CS Toptec enclosures support seamless multi-bay expansion on concrete plinths. The modular design enables distinct physical separation between battery banks, AC/DC rectifiers, optical fiber distribution, and microwave transmission hardware.</p>\n<h3>Integrated Climate Control & Vandalism Resistance</h3>\n<p>Compatible with Rittal outdoor Blue e+ cooling units, heat exchangers, and thermoelectric coolers. Fitted with multi-point espagnolette locking mechanisms, internal hinges, and anti-vandalism features meeting RC 2 / RC 3 security ratings to prevent unauthorized physical tampering.</p>\nID: <h3>Dirancang Khusus untuk Lingkungan Luar Ruang Ekstrem</h3>\n<p>Enclosure outdoor Rittal dirancang khusus untuk melindungi sistem daya kritis, telekomunikasi, dan kontrol otomasi dari paparan cuaca berat—termasuk radiasi panas matahari tropis yang menyengat, hujan deras, badai debu, polusi industri, dan udara berkadar garam tinggi di area pesisir. Memenuhi standar internasional IEC 61969 untuk kabinet elektronik luar ruang.</p>\n<h3>Arsitektur Dinding Ganda & Efek Cerobong Alami</h3>\n<p>Seri CS Toptec menggunakan struktur aluminium berdinding ganda (twin-wall) mutakhir yang terdiri dari rangka internal dan lapisan pelindung eksternal. Rongga udara di antara dinding memanfaatkan efek cerobong alami untuk membuang panas radiasi matahari hingga lebih dari 60% dibanding kabinet logam dinding tunggal biasa, sehingga menghemat konsumsi daya pendingin secara signifikan.</p>\n<h3>Kapabilitas Penggabungan Modular CS Toptec</h3>\n<p>Dibangun di atas pola kisi modular 25 mm khas Rittal, lemari CS Toptec mendukung penggabungan (baying) multi-kompartemen di atas pondasi beton. Desain modular ini memungkinkan pemisahan fisik yang terorganisir antara kompartemen baterai cadangan, penyearah AC/DC, distribusi fiber optik, dan perangkat transmisi gelombang mikro.</p>\n<h3>Sistem Pendingin Terintegrasi & Perlindungan Anti-Vandalisme</h3>\n<p>Dapat dipadukan dengan unit pendingin outdoor Blue e+, penukar panas (heat exchanger), dan pendingin termoelektrik Rittal. Dilengkapi sistem penguncian batang multi-titik espagnolette, engsel tersembunyi di dalam, dan proteksi anti-vandalisme bersertifikasi RC 2 / RC 3 guna mencegah pembobolan fisik tanpa izin.</p>"}]}'::jsonb,
  '{"EN: Enclosure Series\nID: Seri Enclosure":"CS Toptec (bayable modular) & CS New Basic (single-wall / twin-wall)","EN: Material & Finish\nID: Material & Lapisan":"AlMg3 corrosion-resistant aluminium alloy with pure polyester UV powder coating (RAL 7035)","EN: Protection Rating\nID: Tingkat Proteksi":"IP55 / IP66 according to IEC 60529, NEMA 3R / 4 / 4X","EN: Impact Resistance\nID: Ketahanan Benturan":"IK10 according to DIN EN 50102 / IEC 62262","EN: Thermal Insulation\nID: Isolasi Termal":"Twin-wall technology (chimney effect) reducing solar radiation heat transfer by > 60%","EN: Operating Range\nID: Suhu Operasi":"-33°C to +65°C ambient operating temperature"}'::jsonb,
  '/uploads/products-rittal-outdoor-enclosures.jpg',
  'published',
  now(),
  5,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/automation-systems
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000773',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'automation-systems',
  'rittal-distributor/automation-systems',
  E'EN: Rittal Automation Systems (Perforex MT & Secarex)
ID: Sistem Otomasi Perakitan Panel Rittal (Perforex MT & Secarex)',
  E'EN: Digital CNC machining centers, automated cutting tools, and wire processing systems designed to accelerate panel building and switchgear manufacturing by up to 85%.
ID: Pusat permesinan CNC digital, mesin pemotong otomatis, dan pemrosesan kabel terotomasi yang mempercepat perakitan panel switchgear hingga 85%.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Manufaktur Switchgear Digital & Industri Perakitan Panel 4.0</h3>\n<p>Rittal Automation Systems (RAS) menjembatani rancangan rekayasa digital dengan perakitan fisik di lantai bengkel panel. Dengan menghubungkan desain panel virtual 3D dari software Eplan secara langsung ke mesin permesinan otomatis, RAS memangkas waktu produksi secara drastis, mengurangi ketergantungan tenaga kerja manual, dan menjamin nol kesalahan perakitan ulang.</p>\n<h3>Pusat Permesinan CNC Perforex MT</h3>\n<p>Seri Perforex MT merupakan standar industri untuk permesinan otomatis pada pelat pemasangan (mounting plate), pintu samping, serta bodi enclosure kubikal yang telah dirakit penuh. Dilengkapi spindle CNC berkecepatan tinggi, pengganti perkakas otomatis (auto tool changer), dan pencekaman benda kerja bermotor, Perforex melakukan pengeboran presisi, pengetapan ulir, pemotongan lubang persegi (milling), dan pembersihan geram (deburring) dalam satu siklus otomatis terpadu.</p>\n<h3>Pusat Pemotong Otomatis Secarex & Wire Terminal</h3>\n<p>Mesin pemotong Secarex AC 15 memberikan pemotongan semi-otomatis yang cepat dan rapi tanpa geram untuk rel DIN, rel C, serta ducting kabel plastik disertai pencetakan label terintegrasi. Dipadukan dengan Rittal Wire Terminal WT, seluruh proses kabel (pemotongan panjang, pengupasan isolasi, crimping ferrule, dan pengelompokan kabel) berjalan otomatis hingga 8 kali lebih cepat dibanding metode manual.</p>\n<h3>Sinkronisasi Langsung CAD/CAM Eplan Pro Panel</h3>\n<p>Kode permesinan CNC dihasilkan langsung dari digital twin pada Eplan Pro Panel tanpa perlu pemrograman manual. Toleransi, koordinat lubang, dan diameter pengeboran ditransfer secara instan melalui jaringan Ethernet, memastikan tingkat akurasi 100% dari gambar teknik hingga panel jadi di bengkel kerja.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Digitalized Switchgear Manufacturing & Panel Building 4.0</h3>\n<p>Rittal Automation Systems (RAS) bridges the gap between digital engineering and physical shop floor fabrication. By seamlessly connecting Eplan virtual 3D panel designs with automated machinery, RAS dramatically slashes manufacturing time, lowers manual labor overhead, and guarantees zero rework in panel workshops.</p>\n<h3>Perforex MT CNC Machining Centers</h3>\n<p>The Perforex MT series is the industry benchmark for automated machining of enclosure mounting plates, side doors, and complete cubic enclosures. With high-speed CNC spindle drives, automated tool changers, and motorized workpiece clamping, Perforex performs precise drilling, thread tapping, milling of rectangular cutouts, and edge deburring in a single continuous automated cycle.</p>\n<h3>Secarex Automated Cutting & Wire Terminal Systems</h3>\n<p>The Secarex AC 15 cutting center delivers fast, burr-free semi-automatic cutting of DIN mounting rails, C-rails, and plastic cable wiring ducts with integrated label printing. Combined with the Rittal Wire Terminal WT, wire processing (cutting, stripping, crimping, and automated wire sequencing) is fully automated, producing ready-to-wire harnesses up to 8 times faster than manual methods.</p>\n<h3>Direct Eplan Pro Panel CAD/CAM Synchronization</h3>\n<p>Machine code is generated directly from the digital twin in Eplan Pro Panel with zero manual programming. Tolerances, cutout coordinates, and drilling diameters are transferred automatically over Ethernet, ensuring 100% precision from engineering drawing to finished industrial panel.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Digitalized Switchgear Manufacturing & Panel Building 4.0</h3>\n<p>Rittal Automation Systems (RAS) bridges the gap between digital engineering and physical shop floor fabrication. By seamlessly connecting Eplan virtual 3D panel designs with automated machinery, RAS dramatically slashes manufacturing time, lowers manual labor overhead, and guarantees zero rework in panel workshops.</p>\n<h3>Perforex MT CNC Machining Centers</h3>\n<p>The Perforex MT series is the industry benchmark for automated machining of enclosure mounting plates, side doors, and complete cubic enclosures. With high-speed CNC spindle drives, automated tool changers, and motorized workpiece clamping, Perforex performs precise drilling, thread tapping, milling of rectangular cutouts, and edge deburring in a single continuous automated cycle.</p>\n<h3>Secarex Automated Cutting & Wire Terminal Systems</h3>\n<p>The Secarex AC 15 cutting center delivers fast, burr-free semi-automatic cutting of DIN mounting rails, C-rails, and plastic cable wiring ducts with integrated label printing. Combined with the Rittal Wire Terminal WT, wire processing (cutting, stripping, crimping, and automated wire sequencing) is fully automated, producing ready-to-wire harnesses up to 8 times faster than manual methods.</p>\n<h3>Direct Eplan Pro Panel CAD/CAM Synchronization</h3>\n<p>Machine code is generated directly from the digital twin in Eplan Pro Panel with zero manual programming. Tolerances, cutout coordinates, and drilling diameters are transferred automatically over Ethernet, ensuring 100% precision from engineering drawing to finished industrial panel.</p>\nID: <h3>Manufaktur Switchgear Digital & Industri Perakitan Panel 4.0</h3>\n<p>Rittal Automation Systems (RAS) menjembatani rancangan rekayasa digital dengan perakitan fisik di lantai bengkel panel. Dengan menghubungkan desain panel virtual 3D dari software Eplan secara langsung ke mesin permesinan otomatis, RAS memangkas waktu produksi secara drastis, mengurangi ketergantungan tenaga kerja manual, dan menjamin nol kesalahan perakitan ulang.</p>\n<h3>Pusat Permesinan CNC Perforex MT</h3>\n<p>Seri Perforex MT merupakan standar industri untuk permesinan otomatis pada pelat pemasangan (mounting plate), pintu samping, serta bodi enclosure kubikal yang telah dirakit penuh. Dilengkapi spindle CNC berkecepatan tinggi, pengganti perkakas otomatis (auto tool changer), dan pencekaman benda kerja bermotor, Perforex melakukan pengeboran presisi, pengetapan ulir, pemotongan lubang persegi (milling), dan pembersihan geram (deburring) dalam satu siklus otomatis terpadu.</p>\n<h3>Pusat Pemotong Otomatis Secarex & Wire Terminal</h3>\n<p>Mesin pemotong Secarex AC 15 memberikan pemotongan semi-otomatis yang cepat dan rapi tanpa geram untuk rel DIN, rel C, serta ducting kabel plastik disertai pencetakan label terintegrasi. Dipadukan dengan Rittal Wire Terminal WT, seluruh proses kabel (pemotongan panjang, pengupasan isolasi, crimping ferrule, dan pengelompokan kabel) berjalan otomatis hingga 8 kali lebih cepat dibanding metode manual.</p>\n<h3>Sinkronisasi Langsung CAD/CAM Eplan Pro Panel</h3>\n<p>Kode permesinan CNC dihasilkan langsung dari digital twin pada Eplan Pro Panel tanpa perlu pemrograman manual. Toleransi, koordinat lubang, dan diameter pengeboran ditransfer secara instan melalui jaringan Ethernet, memastikan tingkat akurasi 100% dari gambar teknik hingga panel jadi di bengkel kerja.</p>"}]}'::jsonb,
  '{"EN: Machine Range\nID: Lini Mesin":"Perforex MT 107/2101/2201 CNC Milling, Secarex AC 15 Cutting Center, Wire Terminal WT","EN: Machining Capabilities\nID: Kemampuan Permesinan":"Milling, drilling, thread tapping, deburring, and laser cutting (flat parts & fully welded enclosures)","EN: Workpiece Compatibility\nID: Kompatibilitas Benda Kerja":"Sheet steel, stainless steel AISI 304/316, aluminium, copper busbars, and plastics","EN: Software Integration\nID: Integrasi Perangkat Lunak":"Direct seamless import from Eplan Pro Panel, DXF/DWG, and 3D CAD step files","EN: Productivity Gain\nID: Peningkatan Produktivitas":"Up to 85% faster enclosure panel machining with zero manual marking errors","EN: Max Clamping Area\nID: Bidang Cekam Maksimum":"Up to 3,800 mm x 2,300 mm (Perforex MT 2201)"}'::jsonb,
  '/uploads/products-rittal-automation-systems.jpg',
  'published',
  now(),
  6,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 029_optimize_indexes_and_speed.up.sql
-- ==========================================

-- 029_optimize_indexes_and_speed.up.sql
-- Add optimized B-Tree indexes for O(log n) tree traversal, parent-child lookups, and fast pagination

BEGIN;

-- 1. O(log n) tree hierarchy lookups on products & services parent_id
CREATE INDEX IF NOT EXISTS products_parent_id_idx ON products (parent_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS services_parent_id_idx ON services (parent_id) WHERE deleted_at IS NULL;

-- 2. Fast B-Tree indexes for status & sort ordering
CREATE INDEX IF NOT EXISTS products_status_sort_idx ON products (status, sort_order, published_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS services_status_sort_idx ON services (status, sort_order, published_at) WHERE deleted_at IS NULL;

-- 3. Fast B-Tree index for news and career reverse chronological queries
CREATE INDEX IF NOT EXISTS news_status_published_idx ON news (status, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS careers_status_published_idx ON careers (status, published_at DESC) WHERE deleted_at IS NULL;

COMMIT;


-- ==========================================
-- Migration: 030_add_rittal_enclosure_types.up.sql
-- ==========================================

-- 030_add_rittal_enclosure_types.up.sql
-- Add 3 specialized Rittal enclosure types from rittal.com:
-- 1. Rittal Hygienic Design (HD) Stainless Steel Enclosures
-- 2. Rittal ATEX & IECEx Hazardous Area Explosion-Proof Enclosures
-- 3. Rittal HMI Operator Enclosures & Support Arm Systems (CP 60/120/180)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/hygienic-design-enclosures
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000774',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'hygienic-design-enclosures',
  'rittal-distributor/hygienic-design-enclosures',
  E'EN: Rittal Hygienic Design (HD) Stainless Steel Enclosures
ID: Enclosure Rittal Hygienic Design (HD) Stainless Steel',
  E'EN: Extra-hygienic stainless steel enclosures engineered with 30° sloped roofs, gap-free silicone gaskets, and IP66 / IP69K ratings for food, beverage, and pharmaceutical processing.
ID: Enclosure stainless steel ultra-higienis dengan atap miring 30°, gasket silikon tanpa celah, dan proteksi IP66 / IP69K khusus untuk industri makanan, minuman, dan farmasi.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Higienitas Mutlak untuk Industri Makanan, Minuman, dan Farmasi</h3>\n<p>Enclosure Rittal Hygienic Design (HD) dirancang khusus untuk lingkungan pengolahan yang menuntut kebersihan steril tanpa risiko kontaminasi mikroba. Mengacu pada panduan ketat EHEDG (European Hygienic Engineering & Design Group), bodi panel HD dirancang tahan terhadap semprotan air bertekanan tinggi, uap panas, serta bahan kimia disinfektan berkonsentrasi tinggi.</p>\n<h3>Desain Bebas Celah & Tanpa Area Mati (Dead Space)</h3>\n<p>Berbeda dari panel industri standar, kabinet Rittal HD mengintegrasikan atap dengan kemiringan sudut 30 derajat ke arah depan. Hal ini memastikan seluruh cairan pembersih mengalir tuntas dan mencegah operator meletakkan benda asing di atas panel. Sisi tepi pintu dilipat miring 10° ke arah luar agar sisa busa dan air pencuci tidak pernah mengendap di celah paking.</p>\n<h3>Gasket Silikon Biru Bersertifikat FDA Tanpa Sambungan</h3>\n<p>Paking karet silikon solid berwarna biru kontras sesuai standar FDA 21 CFR 177.2600 memudahkan deteksi visual langsung apabila terjadi serpihan partikel. Segel paking terpasang continuous tanpa celah sambungan, sangat tahan terhadap zat pembersih klorin, dan dapat diganti secara instan saat siklus pemeliharaan sanitasi tanpa memerlukan bahan perekat kimia.</p>\n<h3>Proteksi Ekstrem IP66 dan IP69K Uap Bertekanan</h3>\n<p>Dengan sertifikasi IP69K, panel HD Rittal tahan terhadap semprotan air jet berkekuatan lebih dari 100 bar pada suhu hingga 80°C. Engsel tersembunyi di dalam panel dan pengunci hex luar stainless steel memastikan tidak ada ulir baut atau bagian bergerak terbuka di area kontak bahan makanan, memenuhi syarat penuh audit keamanan pangan internasional (HACCP, IFS, ISO 22000).</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Ultimate Hygiene for Food, Beverage, and Pharmaceutical Production</h3>\n<p>Rittal Hygienic Design (HD) enclosures are tailor-made for hygiene-critical processing environments where bacterial contamination must be completely eliminated. Designed strictly following EHEDG (European Hygienic Engineering & Design Group) principles, HD enclosures withstand regular high-pressure, high-temperature washdowns with aggressive chemical cleaning agents.</p>\n<h3>Engineered Without Gaps or Dead Spaces</h3>\n<p>Unlike standard industrial cabinets, Rittal HD enclosures feature a 30-degree forward-sloped roof that guarantees complete run-off of cleaning liquids and prohibits operators from placing objects on top. The external door edges are folded back at an angle of 10° to allow water and sanitation foam to drain completely away without leaving moisture traps or pooling zones.</p>\n<h3>FDA-Compliant Joint-Free Blue Silicone Seal</h3>\n<p>The distinctive blue all-around silicone gasket is dyed blue in accordance with FDA 21 CFR 177.2600 so that any foreign particle contamination is immediately detected visually. The seal is completely continuous without joints, resists chlorinated detergents, and can be quickly replaced during routine plant sanitation cycles without requiring adhesive removers.</p>\n<h3>IP66 and IP69K High-Pressure Washdown Protection</h3>\n<p>Certified up to IP69K, HD enclosures safely endure dynamic washdown jets exceeding 100 bar at 80°C. Internal hinges and stainless steel cam locks with external hexagonal drives ensure that no threads or internal hinge pins are exposed to the open food zone, keeping production lines 100% compliant with international food safety audits (HACCP, IFS, ISO 22000).</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Ultimate Hygiene for Food, Beverage, and Pharmaceutical Production</h3>\n<p>Rittal Hygienic Design (HD) enclosures are tailor-made for hygiene-critical processing environments where bacterial contamination must be completely eliminated. Designed strictly following EHEDG (European Hygienic Engineering & Design Group) principles, HD enclosures withstand regular high-pressure, high-temperature washdowns with aggressive chemical cleaning agents.</p>\n<h3>Engineered Without Gaps or Dead Spaces</h3>\n<p>Unlike standard industrial cabinets, Rittal HD enclosures feature a 30-degree forward-sloped roof that guarantees complete run-off of cleaning liquids and prohibits operators from placing objects on top. The external door edges are folded back at an angle of 10° to allow water and sanitation foam to drain completely away without leaving moisture traps or pooling zones.</p>\n<h3>FDA-Compliant Joint-Free Blue Silicone Seal</h3>\n<p>The distinctive blue all-around silicone gasket is dyed blue in accordance with FDA 21 CFR 177.2600 so that any foreign particle contamination is immediately detected visually. The seal is completely continuous without joints, resists chlorinated detergents, and can be quickly replaced during routine plant sanitation cycles without requiring adhesive removers.</p>\n<h3>IP66 and IP69K High-Pressure Washdown Protection</h3>\n<p>Certified up to IP69K, HD enclosures safely endure dynamic washdown jets exceeding 100 bar at 80°C. Internal hinges and stainless steel cam locks with external hexagonal drives ensure that no threads or internal hinge pins are exposed to the open food zone, keeping production lines 100% compliant with international food safety audits (HACCP, IFS, ISO 22000).</p>\nID: <h3>Higienitas Mutlak untuk Industri Makanan, Minuman, dan Farmasi</h3>\n<p>Enclosure Rittal Hygienic Design (HD) dirancang khusus untuk lingkungan pengolahan yang menuntut kebersihan steril tanpa risiko kontaminasi mikroba. Mengacu pada panduan ketat EHEDG (European Hygienic Engineering & Design Group), bodi panel HD dirancang tahan terhadap semprotan air bertekanan tinggi, uap panas, serta bahan kimia disinfektan berkonsentrasi tinggi.</p>\n<h3>Desain Bebas Celah & Tanpa Area Mati (Dead Space)</h3>\n<p>Berbeda dari panel industri standar, kabinet Rittal HD mengintegrasikan atap dengan kemiringan sudut 30 derajat ke arah depan. Hal ini memastikan seluruh cairan pembersih mengalir tuntas dan mencegah operator meletakkan benda asing di atas panel. Sisi tepi pintu dilipat miring 10° ke arah luar agar sisa busa dan air pencuci tidak pernah mengendap di celah paking.</p>\n<h3>Gasket Silikon Biru Bersertifikat FDA Tanpa Sambungan</h3>\n<p>Paking karet silikon solid berwarna biru kontras sesuai standar FDA 21 CFR 177.2600 memudahkan deteksi visual langsung apabila terjadi serpihan partikel. Segel paking terpasang continuous tanpa celah sambungan, sangat tahan terhadap zat pembersih klorin, dan dapat diganti secara instan saat siklus pemeliharaan sanitasi tanpa memerlukan bahan perekat kimia.</p>\n<h3>Proteksi Ekstrem IP66 dan IP69K Uap Bertekanan</h3>\n<p>Dengan sertifikasi IP69K, panel HD Rittal tahan terhadap semprotan air jet berkekuatan lebih dari 100 bar pada suhu hingga 80°C. Engsel tersembunyi di dalam panel dan pengunci hex luar stainless steel memastikan tidak ada ulir baut atau bagian bergerak terbuka di area kontak bahan makanan, memenuhi syarat penuh audit keamanan pangan internasional (HACCP, IFS, ISO 22000).</p>"}]}'::jsonb,
  '{"EN: Material\nID: Material":"Stainless steel AISI 304 (1.4301) / AISI 316L (1.4404), brushed grain size 400, Ra < 0.8 µm","EN: Protection Category\nID: Kategori Proteksi":"IP66 and IP69K to IEC 60529 / DIN 40050-9 (high-pressure steam washdown)","EN: Hygiene Design Standard\nID: Standar Desain Higienis":"EHEDG compliant, DGUV tested, FDA compliant blue silicone seal (FDA 21 CFR 177.2600)","EN: Roof Incline\nID: Kemiringan Atap":"Integrated 30° forward slope prevents liquid accumulation and allows quick visual cleanliness inspections","EN: Locking Mechanism\nID: Mekanisme Penguncian":"Stainless steel HD cam lock with external hex drive; internal hinges prevent microbial traps","EN: Gasket Seal\nID: Segel Gasket":"All-round joint-free blue silicone seal, easily replaceable during sanitation cycles"}'::jsonb,
  '/uploads/products-rittal-hygienic-design.jpg',
  'published',
  now(),
  7,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/atex-hazardous-area-enclosures
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000775',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'atex-hazardous-area-enclosures',
  'rittal-distributor/atex-hazardous-area-enclosures',
  E'EN: Rittal ATEX & IECEx Hazardous Area Explosion-Proof Enclosures
ID: Enclosure Rittal ATEX & IECEx Tahan Ledakan Area Berbahaya',
  E'EN: Certified explosion-proof junction boxes and control cabinets for ATEX/IECEx Zone 1, 2, 21, and 22 in offshore, chemical, and petrochemical hazardous environments.
ID: Kotak terminal dan kabinet kontrol bersertifikasi tahan ledakan standar ATEX/IECEx Zona 1, 2, 21, dan 22 untuk lingkungan industri kimia, migas, dan kilang lepas pantai.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Keamanan Teruji untuk Atmosfer Mudah Meledak</h3>\n<p>Di area industri di mana gas yang mudah terbakar, uap kimia, atau debu konduktif menciptakan bahaya ledakan tinggi, proteksi peralatan listrik menjadi keharusan mutlak. Enclosure tahan ledakan Rittal bersertifikasi ATEX dan IECEx menyediakan tingkat keamanan tinggi (Increased Safety Ex e) dan perlindungan penyalaan debu (Ex tb) untuk sektor minyak dan gas lepas pantai, kilang petrokimia, pabrik pupuk, dan industri tepung.</p>\n<h3>Sertifikasi Menyeluruh untuk Zona 1, 2, 21, dan 22</h3>\n<p>Dirancang dan diuji sesuai standar global EN/IEC 60079 series, panel Rittal Ex mengantongi sertifikat lengkap ATEX Directive 2014/34/EU serta sertifikasi internasional IECEx. Baik ditempatkan di zona gas mudah terbakar (Zona 1 & 2) maupun zona debu berbahaya (Zona 21 & 22), panel ini mengisolasi percikan listrik dan panas internal dari udara atmosfer sekitar.</p>\n<h3>Konstruksi Stainless Steel AISI 316L Kelas Marine</h3>\n<p>Untuk lingkungan kilang lepas pantai dan area pesisir yang sarat zat korosif, Rittal menyediakan panel berbahan stainless steel AISI 316L (1.4404) tahan asam. Dilengkapi lapisan brushed berkualitas tinggi dan gasket silikon tahan suhu ekstrem, panel ini tahan terhadap semprotan kabut garam pekat, uap gas hidrogen sulfida, serta paparan radiasi UV jangka panjang.</p>\n<h3>Aksesori Terintegrasi & Lubang Kabel Bersertifikat Ex</h3>\n<p>Rittal menyediakan ekosistem terpadu bersertifikat Ex mencakup pelat gland kuningan atau stainless steel, rel pemasangan internal, grounding stud tembaga/baja (M6 hingga M10), serta jendela inspeksi tahan benturan bersertifikat Ex guna mempermudah proses komisioning dan audit keselamatan operasional di lapangan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Safety in Potentially Explosive Atmospheres</h3>\n<p>Where combustible gases, vapors, or conductive dusts create an explosion hazard, electrical equipment must be housed with absolute integrity. Rittal ATEX and IECEx certified enclosures provide verified increased safety (Ex e) and dust ignition protection (Ex tb) across global oil and gas, petrochemical refineries, chemical processing plants, and grain handling facilities.</p>\n<h3>Robust Certification for Zones 1, 2, 21, and 22</h3>\n<p>Engineered and tested to the latest EN/IEC 60079 series standards, Rittal Ex enclosures carry comprehensive ATEX Directive 2014/34/EU and international IECEx approvals. Whether deployed in gas atmosphere Zone 1/2 or combustible dust atmosphere Zone 21/22, these enclosures isolate electrical sparks and internal thermal dissipation from surrounding hazardous ambient air.</p>\n<h3>Marine-Grade AISI 316L Stainless Steel Construction</h3>\n<p>For aggressive coastal and offshore marine environments, Rittal delivers enclosures manufactured from premium AISI 316L (1.4404) acid-resistant stainless steel. With electro-polished finishes and non-degrading high-temperature silicone seals, they resist high salt mist concentrations, hydrogen sulfide fumes, and ultraviolet degradation over decades of service.</p>\n<h3>Engineered System Accessories & Cable Glands</h3>\n<p>Rittal provides a complete Ex-approved ecosystem including certified brass or stainless steel cable gland plates, internal component mounting rails, external earthing studs (M6 to M10), and impact-resistant Ex inspection windows, simplifying field installation and streamlining local site certification.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Safety in Potentially Explosive Atmospheres</h3>\n<p>Where combustible gases, vapors, or conductive dusts create an explosion hazard, electrical equipment must be housed with absolute integrity. Rittal ATEX and IECEx certified enclosures provide verified increased safety (Ex e) and dust ignition protection (Ex tb) across global oil and gas, petrochemical refineries, chemical processing plants, and grain handling facilities.</p>\n<h3>Robust Certification for Zones 1, 2, 21, and 22</h3>\n<p>Engineered and tested to the latest EN/IEC 60079 series standards, Rittal Ex enclosures carry comprehensive ATEX Directive 2014/34/EU and international IECEx approvals. Whether deployed in gas atmosphere Zone 1/2 or combustible dust atmosphere Zone 21/22, these enclosures isolate electrical sparks and internal thermal dissipation from surrounding hazardous ambient air.</p>\n<h3>Marine-Grade AISI 316L Stainless Steel Construction</h3>\n<p>For aggressive coastal and offshore marine environments, Rittal delivers enclosures manufactured from premium AISI 316L (1.4404) acid-resistant stainless steel. With electro-polished finishes and non-degrading high-temperature silicone seals, they resist high salt mist concentrations, hydrogen sulfide fumes, and ultraviolet degradation over decades of service.</p>\n<h3>Engineered System Accessories & Cable Glands</h3>\n<p>Rittal provides a complete Ex-approved ecosystem including certified brass or stainless steel cable gland plates, internal component mounting rails, external earthing studs (M6 to M10), and impact-resistant Ex inspection windows, simplifying field installation and streamlining local site certification.</p>\nID: <h3>Keamanan Teruji untuk Atmosfer Mudah Meledak</h3>\n<p>Di area industri di mana gas yang mudah terbakar, uap kimia, atau debu konduktif menciptakan bahaya ledakan tinggi, proteksi peralatan listrik menjadi keharusan mutlak. Enclosure tahan ledakan Rittal bersertifikasi ATEX dan IECEx menyediakan tingkat keamanan tinggi (Increased Safety Ex e) dan perlindungan penyalaan debu (Ex tb) untuk sektor minyak dan gas lepas pantai, kilang petrokimia, pabrik pupuk, dan industri tepung.</p>\n<h3>Sertifikasi Menyeluruh untuk Zona 1, 2, 21, dan 22</h3>\n<p>Dirancang dan diuji sesuai standar global EN/IEC 60079 series, panel Rittal Ex mengantongi sertifikat lengkap ATEX Directive 2014/34/EU serta sertifikasi internasional IECEx. Baik ditempatkan di zona gas mudah terbakar (Zona 1 & 2) maupun zona debu berbahaya (Zona 21 & 22), panel ini mengisolasi percikan listrik dan panas internal dari udara atmosfer sekitar.</p>\n<h3>Konstruksi Stainless Steel AISI 316L Kelas Marine</h3>\n<p>Untuk lingkungan kilang lepas pantai dan area pesisir yang sarat zat korosif, Rittal menyediakan panel berbahan stainless steel AISI 316L (1.4404) tahan asam. Dilengkapi lapisan brushed berkualitas tinggi dan gasket silikon tahan suhu ekstrem, panel ini tahan terhadap semprotan kabut garam pekat, uap gas hidrogen sulfida, serta paparan radiasi UV jangka panjang.</p>\n<h3>Aksesori Terintegrasi & Lubang Kabel Bersertifikat Ex</h3>\n<p>Rittal menyediakan ekosistem terpadu bersertifikat Ex mencakup pelat gland kuningan atau stainless steel, rel pemasangan internal, grounding stud tembaga/baja (M6 hingga M10), serta jendela inspeksi tahan benturan bersertifikat Ex guna mempermudah proses komisioning dan audit keselamatan operasional di lapangan.</p>"}]}'::jsonb,
  '{"EN: Explosion Protection\nID: Proteksi Ledakan":"ATEX II 2 G Ex e IIC Gb / II 2 D Ex tb IIIC Db, IECEx certified to EN 60079-0/-7/-31","EN: Hazardous Zones\nID: Zona Berbahaya":"Gas: Zone 1 and Zone 2 | Dust: Zone 21 and Zone 22","EN: Protection Category\nID: Kategori Proteksi":"IP66 to IEC 60529 (Type 4X, 12 to UL 50E)","EN: Material Options\nID: Pilihan Material":"AISI 316L stainless steel (1.4404) or electrophoretic dipcoat-primed sheet steel with powder coating","EN: Operating Temperature\nID: Suhu Operasional":"-30°C to +80°C with silicone/foamed PU seals engineered for harsh climates","EN: Gland Plates & Accessories\nID: Pelat Kelenjar & Aksesori":"Integrated brass/stainless steel ATEX gland plates, earth studs, and Ex-approved viewing windows"}'::jsonb,
  '/uploads/products-rittal-atex-enclosures.jpg',
  'published',
  now(),
  8,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/hmi-consoles-support-arm-systems
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000776',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'hmi-consoles-support-arm-systems',
  'rittal-distributor/hmi-consoles-support-arm-systems',
  E'EN: Rittal HMI Operator Enclosures & Support Arm Systems (CP 60/120/180)
ID: Enclosure Operator HMI & Sistem Lengan Penyangga Rittal (CP 60/120/180)',
  E'EN: Ergonomic operator control housings (Comfort Panel, Optipanel) and modular support arm systems designed for seamless human-machine interaction on shop floors.
ID: Housing panel kontrol operator ergonomis (Comfort Panel, Optipanel) dan sistem lengan penyangga modular untuk interaksi mesin-operator optimal di lantai produksi.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Antarmuka Mesin-Operator (HMI) Ergonomis di Inti Lini Produksi</h3>\n<p>Mesin otomatisasi modern membutuhkan akses interaksi operator yang intuitif, ergonomis, dan tidak melelahkan. Panel kendali HMI dan sistem lengan penyangga modular Rittal (CP 60/120/180) memberikan sinergi sempurna antara desain estetis modern, kekuatan mekanis menopang beban berat, dan kompatibilitas fleksibel untuk monitor industri, layar sentuh, dan tombol darurat.</p>\n<h3>Housing Operator Comfort Panel & Optipanel</h3>\n<p>Housing Rittal Comfort Panel dan Optipanel diproduksi dari profil ekstrusi aluminium presisi tinggi. Dirancang khusus untuk memuat Industrial PC standar, layar sentuh (Siemens, Schneider, Beckhoff), atau tombol mekanik khusus, bodi housing memiliki pintu belakang sistem engsel cepat untuk kemudahan instalasi teknisi serta pelepasan panas internal yang sangat efisien.</p>\n<h3>Sistem Lengan Modular CP 60, CP 120, dan CP 180</h3>\n<p>Mengadopsi konsep modular serbaguna, sistem lengan penyangga Rittal menyediakan kapasitas beban sesuai kebutuhan: CP 60 untuk beban hingga 40 kg, CP 120 untuk bentang hingga 120 kg, dan CP 180 untuk stasiun kendali terberat hingga 180 kg. Engsel perantara dan bracket pemasangan dinding/lantai memungkinkan rotasi halus hingga 310° dengan pembatas sudut rotasi (rotation stop) untuk mencegah kabel terpelintir.</p>\n<h3>Jalur Kabel Luas & Proteksi Debu-Air IP65</h3>\n<p>Keunggulan utama sistem lengan Rittal terletak pada rongga kabel internal yang sangat lega. Kabel yang sudah terpasang konektor besar (seperti HDMI, Ethernet RJ45, atau kabel daya) dapat ditarik melewati siku dan sendi putar tanpa harus memotong atau membongkar pin konektor. Meskipun dapat berputar fleksibel, seluruh sistem tetap mempertahankan tingkat perlindungan IP65 terhadap debu industri dan percikan minyak pendingin mesin.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Ergonomic Human-Machine Interface at the Heart of Production</h3>\n<p>Modern automated machinery demands intuitive, accessible, and fatigue-free operator interaction. Rittal HMI command panels and modular support arm systems (CP 60/120/180) deliver the perfect synthesis of ergonomic design, heavy-duty mechanical rigidity, and customizable screen housings for industrial displays, touchscreens, and push-button controls.</p>\n<h3>Comfort Panel & Optipanel Operating Housings</h3>\n<p>Rittal Comfort Panel and Optipanel housings are crafted from high-precision extruded aluminium sections. Designed to accommodate standard industrial PCs, Siemens/Schneider/Beckhoff touch panels, or customized operating keyboards, the housings feature quick-release rear doors for effortless maintenance and optimal passive heat dissipation.</p>\n<h3>Modular CP 60, CP 120, and CP 180 Support Arm Systems</h3>\n<p>Built as a versatile modular building-block system, Rittal support arm systems offer tailored load-bearing capacities: CP 60 for loads up to 40 kg, CP 120 for spans up to 120 kg, and CP 180 for heavy command stations up to 180 kg. Rotational couplings, intermediate hinges, and wall/base mounting brackets allow up to 310° horizontal rotation with precision swivel stops to protect wiring from twisting.</p>\n<h3>Spacious Cable Routing & Complete IP65 Ingress Protection</h3>\n<p>A crucial engineering advantage of Rittal support arm systems is the oversized interior cable ducting. Pre-assembled cables with large Ethernet, HDMI, or USB-C connectors can be pulled through elbows and swivel joints without disassembly or pin desoldering. Despite flexible swivel articulation, the entire mechanical system maintains continuous IP65 protection against industrial dust and cooling emulsion splashing.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Ergonomic Human-Machine Interface at the Heart of Production</h3>\n<p>Modern automated machinery demands intuitive, accessible, and fatigue-free operator interaction. Rittal HMI command panels and modular support arm systems (CP 60/120/180) deliver the perfect synthesis of ergonomic design, heavy-duty mechanical rigidity, and customizable screen housings for industrial displays, touchscreens, and push-button controls.</p>\n<h3>Comfort Panel & Optipanel Operating Housings</h3>\n<p>Rittal Comfort Panel and Optipanel housings are crafted from high-precision extruded aluminium sections. Designed to accommodate standard industrial PCs, Siemens/Schneider/Beckhoff touch panels, or customized operating keyboards, the housings feature quick-release rear doors for effortless maintenance and optimal passive heat dissipation.</p>\n<h3>Modular CP 60, CP 120, and CP 180 Support Arm Systems</h3>\n<p>Built as a versatile modular building-block system, Rittal support arm systems offer tailored load-bearing capacities: CP 60 for loads up to 40 kg, CP 120 for spans up to 120 kg, and CP 180 for heavy command stations up to 180 kg. Rotational couplings, intermediate hinges, and wall/base mounting brackets allow up to 310° horizontal rotation with precision swivel stops to protect wiring from twisting.</p>\n<h3>Spacious Cable Routing & Complete IP65 Ingress Protection</h3>\n<p>A crucial engineering advantage of Rittal support arm systems is the oversized interior cable ducting. Pre-assembled cables with large Ethernet, HDMI, or USB-C connectors can be pulled through elbows and swivel joints without disassembly or pin desoldering. Despite flexible swivel articulation, the entire mechanical system maintains continuous IP65 protection against industrial dust and cooling emulsion splashing.</p>\nID: <h3>Antarmuka Mesin-Operator (HMI) Ergonomis di Inti Lini Produksi</h3>\n<p>Mesin otomatisasi modern membutuhkan akses interaksi operator yang intuitif, ergonomis, dan tidak melelahkan. Panel kendali HMI dan sistem lengan penyangga modular Rittal (CP 60/120/180) memberikan sinergi sempurna antara desain estetis modern, kekuatan mekanis menopang beban berat, dan kompatibilitas fleksibel untuk monitor industri, layar sentuh, dan tombol darurat.</p>\n<h3>Housing Operator Comfort Panel & Optipanel</h3>\n<p>Housing Rittal Comfort Panel dan Optipanel diproduksi dari profil ekstrusi aluminium presisi tinggi. Dirancang khusus untuk memuat Industrial PC standar, layar sentuh (Siemens, Schneider, Beckhoff), atau tombol mekanik khusus, bodi housing memiliki pintu belakang sistem engsel cepat untuk kemudahan instalasi teknisi serta pelepasan panas internal yang sangat efisien.</p>\n<h3>Sistem Lengan Modular CP 60, CP 120, dan CP 180</h3>\n<p>Mengadopsi konsep modular serbaguna, sistem lengan penyangga Rittal menyediakan kapasitas beban sesuai kebutuhan: CP 60 untuk beban hingga 40 kg, CP 120 untuk bentang hingga 120 kg, dan CP 180 untuk stasiun kendali terberat hingga 180 kg. Engsel perantara dan bracket pemasangan dinding/lantai memungkinkan rotasi halus hingga 310° dengan pembatas sudut rotasi (rotation stop) untuk mencegah kabel terpelintir.</p>\n<h3>Jalur Kabel Luas & Proteksi Debu-Air IP65</h3>\n<p>Keunggulan utama sistem lengan Rittal terletak pada rongga kabel internal yang sangat lega. Kabel yang sudah terpasang konektor besar (seperti HDMI, Ethernet RJ45, atau kabel daya) dapat ditarik melewati siku dan sendi putar tanpa harus memotong atau membongkar pin konektor. Meskipun dapat berputar fleksibel, seluruh sistem tetap mempertahankan tingkat perlindungan IP65 terhadap debu industri dan percikan minyak pendingin mesin.</p>"}]}'::jsonb,
  '{"EN: Housing Types\nID: Tipe Housing":"Comfort Panel, Optipanel, Compact Panel, and Command Panels with custom front foil cutouts","EN: Support Arm System\nID: Sistem Lengan Penyangga":"CP 60 (up to 40 kg), CP 120 (up to 120 kg), and CP 180 (heavy-duty up to 180 kg) modular aluminum profiles","EN: Rotation & Ergonomics\nID: Rotasi & Ergonomi":"Integrated swivel angles up to 310° with adjustable rotation stops and tilt adapters (±45°)","EN: Cable Management\nID: Manajemen Kabel":"Spacious internal cable routing channel with removable clip covers for pre-terminated HDMI/Ethernet connectors","EN: Protection Rating\nID: Tingkat Proteksi":"IP65 to IEC 60529 between housing and support arm connection","EN: Material & Finish\nID: Material & Lapisan":"Extruded aluminium enclosure profiles with die-cast zinc corner caps, powder-coated in RAL 7035 / RAL 7024"}'::jsonb,
  '/uploads/products-rittal-hmi-support-arm.jpg',
  'published',
  now(),
  9,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 031_add_rittal_power_distribution_types.up.sql
-- ==========================================

-- 031_add_rittal_power_distribution_types.up.sql
-- Add 3 specialized Rittal Power Distribution products from rittal.com:
-- 1. Rittal RiLine Compact Power Distribution Board (up to 125 A)
-- 2. Rittal RiLine60 Modular 60 mm Busbar Systems (up to 1600 A)
-- 3. Rittal Maxi-PLS & Flat-PLS High-Current Busbar Systems (up to 6300 A)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/riline-compact-busbar-system
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000777',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'riline-compact-busbar-system',
  'rittal-distributor/riline-compact-busbar-system',
  E'EN: Rittal RiLine Compact Power Distribution Board (up to 125 A)
ID: Papan Distribusi Busbar Rittal RiLine Compact (hingga 125 A)',
  E'EN: Ultra-compact, shock-hazard-protected busbar board system with tool-free push-in component connection, designed for compact control cabinets and decentralized sub-distribution.
ID: Sistem papan busbar ultra-kompak dengan proteksi sentuh aman IP2X dan koneksi snap-on tanpa perkakas, dirancang untuk kabinet kontrol ringkas dan sub-distribusi terdesentralisasi.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Kepadatan Daya Maksimum dalam Ruang Minimum</h3>\n<p>Rittal RiLine Compact adalah sistem papan distribusi daya busbar inovatif yang dirancang khusus untuk enclosure kompak, panel kendali mesin, dan kabinet otomatisasi terdesentralisasi. Mengalirkan arus hingga 125 A dalam dimensi fisik yang sangat ringkas, RiLine Compact menggantikan susunan sisir busbar tradisional serta perkabelan manual titik-ke-titik yang memakan tempat.</p>\n<h3>Proteksi Sentuh Aman Menyeluruh (IP2XB)</h3>\n<p>Keamanan operator terintegrasi langsung di seluruh struktur RiLine Compact. Seluruh papan tembaga terlindung rapat di balik rangka isolasi tahan api dengan kisi pitch 4,5 mm. Seluruh slot modul yang belum terpakai otomatis aman dari sentuhan jari (IP2XB), memungkinkan teknisi menambah adaptor starter motor baru dengan aman tanpa harus mematikan total suplai listrik panel.</p>\n<h3>Teknologi Push-In Sistem Klik Tanpa Pengeboran</h3>\n<p>Proses instalasi tidak memerlukan perkakas rumit. Papan dasar langsung terpasang kuat pada rel DIN standar 35 mm atau dibaut ke pelat pemasangan kabinet. Kabel daya utama terhubung melalui terminal jepit pegas (push-in clamp), sementara modul starter motor dipasang melalui adaptor komponen sistem snap-on berkabel bawaan, memangkas waktu perakitan panel hingga 50%.</p>\n<h3>Kompatibilitas Komponen Universal</h3>\n<p>RiLine Compact mendukung berbagai merek switchgear terkemuka seperti Siemens, Schneider Electric, ABB, dan Eaton. Dilengkapi adaptor khusus untuk motor circuit breaker, starter bolak-balik (reversing starter), dan MCB 1P/3P, perakit panel dapat menciptakan tata letak switchgear yang rapi, terstandarisasi, dan tahan getaran sesuai regulasi internasional IEC 61439.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Maximum Power Density in Minimal Space</h3>\n<p>The Rittal RiLine Compact is an innovative power distribution board system specifically engineered for small enclosures, machine control panels, and decentralized automation cabinets. Delivering up to 125 A current carrying capacity in an ultra-compact footprint, it replaces cumbersome traditional comb busbars and chaotic individual point-to-point wiring.</p>\n<h3>All-Round Shock-Hazard Protection (IP2XB)</h3>\n<p>Safety is built directly into the core of RiLine Compact. The entire copper board is completely enclosed in an insulated, flame-retardant chassis with a standardized 4.5 mm pitch grid. Any unused slots remain inherently touch-safe (IP2XB), allowing electrical technicians to safely snap on new motor starter adapters or change components without shutting down the entire distribution panel.</p>\n<h3>Drill-Free Snap-On Push-In Technology</h3>\n<p>Installation is completely tool-free. The base board snaps effortlessly onto standard 35 mm DIN rails or bolts onto enclosure mounting plates. Incoming power cables connect via spring-loaded push-in terminals, while outgoing motor feeders and circuit breakers mount via specialized snap-on component adapters with integrated wiring leads, slashing panel assembly time by up to 50%.</p>\n<h3>Universal Component Compatibility</h3>\n<p>RiLine Compact accommodates all major industrial switchgear brands including Siemens, Schneider Electric, ABB, and Eaton. With dedicated adapters for motor protection switches, reversing starters, and 1-pole/3-pole MCBs, panel builders achieve a clean, standardized, and vibration-resistant layout that adheres to international IEC 61439 standards.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Maximum Power Density in Minimal Space</h3>\n<p>The Rittal RiLine Compact is an innovative power distribution board system specifically engineered for small enclosures, machine control panels, and decentralized automation cabinets. Delivering up to 125 A current carrying capacity in an ultra-compact footprint, it replaces cumbersome traditional comb busbars and chaotic individual point-to-point wiring.</p>\n<h3>All-Round Shock-Hazard Protection (IP2XB)</h3>\n<p>Safety is built directly into the core of RiLine Compact. The entire copper board is completely enclosed in an insulated, flame-retardant chassis with a standardized 4.5 mm pitch grid. Any unused slots remain inherently touch-safe (IP2XB), allowing electrical technicians to safely snap on new motor starter adapters or change components without shutting down the entire distribution panel.</p>\n<h3>Drill-Free Snap-On Push-In Technology</h3>\n<p>Installation is completely tool-free. The base board snaps effortlessly onto standard 35 mm DIN rails or bolts onto enclosure mounting plates. Incoming power cables connect via spring-loaded push-in terminals, while outgoing motor feeders and circuit breakers mount via specialized snap-on component adapters with integrated wiring leads, slashing panel assembly time by up to 50%.</p>\n<h3>Universal Component Compatibility</h3>\n<p>RiLine Compact accommodates all major industrial switchgear brands including Siemens, Schneider Electric, ABB, and Eaton. With dedicated adapters for motor protection switches, reversing starters, and 1-pole/3-pole MCBs, panel builders achieve a clean, standardized, and vibration-resistant layout that adheres to international IEC 61439 standards.</p>\nID: <h3>Kepadatan Daya Maksimum dalam Ruang Minimum</h3>\n<p>Rittal RiLine Compact adalah sistem papan distribusi daya busbar inovatif yang dirancang khusus untuk enclosure kompak, panel kendali mesin, dan kabinet otomatisasi terdesentralisasi. Mengalirkan arus hingga 125 A dalam dimensi fisik yang sangat ringkas, RiLine Compact menggantikan susunan sisir busbar tradisional serta perkabelan manual titik-ke-titik yang memakan tempat.</p>\n<h3>Proteksi Sentuh Aman Menyeluruh (IP2XB)</h3>\n<p>Keamanan operator terintegrasi langsung di seluruh struktur RiLine Compact. Seluruh papan tembaga terlindung rapat di balik rangka isolasi tahan api dengan kisi pitch 4,5 mm. Seluruh slot modul yang belum terpakai otomatis aman dari sentuhan jari (IP2XB), memungkinkan teknisi menambah adaptor starter motor baru dengan aman tanpa harus mematikan total suplai listrik panel.</p>\n<h3>Teknologi Push-In Sistem Klik Tanpa Pengeboran</h3>\n<p>Proses instalasi tidak memerlukan perkakas rumit. Papan dasar langsung terpasang kuat pada rel DIN standar 35 mm atau dibaut ke pelat pemasangan kabinet. Kabel daya utama terhubung melalui terminal jepit pegas (push-in clamp), sementara modul starter motor dipasang melalui adaptor komponen sistem snap-on berkabel bawaan, memangkas waktu perakitan panel hingga 50%.</p>\n<h3>Kompatibilitas Komponen Universal</h3>\n<p>RiLine Compact mendukung berbagai merek switchgear terkemuka seperti Siemens, Schneider Electric, ABB, dan Eaton. Dilengkapi adaptor khusus untuk motor circuit breaker, starter bolak-balik (reversing starter), dan MCB 1P/3P, perakit panel dapat menciptakan tata letak switchgear yang rapi, terstandarisasi, dan tahan getaran sesuai regulasi internasional IEC 61439.</p>"}]}'::jsonb,
  '{"EN: Rated Operating Current (Ie)\nID: Arus Operasional Pengenal (Ie)":"Up to 125 A (690 V AC / 1500 V DC)","EN: Short-Circuit Withstand (Ipk)\nID: Ketahanan Hubung Singkat (Ipk)":"Up to 25 kA (surge withstand strength)","EN: Touch Protection\nID: Proteksi Sentuh Aman":"IP2XB touch-safe shrouding across all board slots to IEC 60529","EN: Mounting & Connection\nID: Pemasangan & Koneksi":"Push-in clamp connection technology, drill-free snap-on mounting onto 35 mm DIN rails or mounting plates","EN: Pitch & Widths\nID: Jarak Pitch & Lebar":"Standard 4.5 mm pitch grid (Board widths: 225 mm, 405 mm, 675 mm, 855 mm)","EN: Component Adapters\nID: Adaptor Komponen":"Adapters for motor circuit breakers, contactors, and miniature circuit breakers (MCB) from 16 A to 63 A"}'::jsonb,
  '/uploads/products-rittal-riline-compact.jpg',
  'published',
  now(),
  10,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/riline60-modular-busbar-systems
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000778',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'riline60-modular-busbar-systems',
  'rittal-distributor/riline60-modular-busbar-systems',
  E'EN: Rittal RiLine60 Modular 60 mm Busbar Systems (up to 1600 A)
ID: Sistem Busbar Modular 60 mm Rittal RiLine60 (hingga 1600 A)',
  E'EN: Standardized 60 mm and 185 mm center-to-center busbar platform featuring drill-free OM component adapters, touch-safe shrouding, and NH fuse-switch disconnectors up to 1600 A.
ID: Platform busbar standar jarak 60 mm dan 185 mm dengan adaptor komponen OM bebas bor, penutup aman sentuh, dan sakelar pemutus sekring NH hingga 1600 A.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Standar Global untuk Panel Kontrol Motor & Distribusi Industri</h3>\n<p>Sistem busbar modular Rittal RiLine60 adalah acuan industri global untuk distribusi daya tegangan rendah dan pusat kendali motor (Motor Control Center / MCC). Dengan jarak antar fase standar 60 mm, RiLine60 menghadirkan infrastruktur distribusi daya yang sangat rapi, aman, dan hemat ruang untuk kapasitas arus dari 250 A hingga 1600 A.</p>\n<h3>100% Perakitan Mekanikal & Elektrikal Tanpa Pengeboran</h3>\n<p>Pekerjaan busbar konvensional membutuhkan proses pelubangan, pengeboran, dan pengetapan ulir tembaga yang memakan waktu dan berisiko mengurangi kekuatan mekanis batang tembaga. Pada RiLine60, seluruh klem sambungan daya, percabangan kabel, dan adaptor komponen menjepit langsung ke busbar tanpa perlu melubangi tembaga sama sekali. Ini menghilangkan serpihan logam di dalam panel dan memungkinkan relokasi komponen secara fleksibel saat ekspansi sistem.</p>\n<h3>Adaptor Komponen OM & CB Terintegrasi</h3>\n<p>Adaptor komponen Rittal OM menyediakan dudukan siap pasang untuk kontaktor, motor starter, dan soft starter. Dilengkapi kabel koneksi fleksibel tahan panas bawaan dan rel pendukung yang dapat digeser, adaptor OM memangkas waktu pengkabelan hingga 60%. Untuk beban feeder yang lebih besar, adaptor CB memungkinkan pemasangan MCCB 3-kutub dan 4-kutub hingga 630 A langsung di atas sistem busbar 60 mm.</p>\n<h3>Sakelar Pemutus Sekring Terpadu Rittal NH</h3>\n<p>Mulai dari ukuran kompak Size 000 (160 A) hingga beban berat Size 3 (630 A), sakelar pemutus sekring NH Rittal memberikan kapasitas pemutusan hubung singkat yang sangat tinggi. Modul pemantauan sekring elektronik (EFM) dan sensor arus cerdas opsional dapat mentransmisikan data tegangan, arus riil, dan sudut fase melalui Modbus RTU atau IO-Link ke sistem manajemen energi IoT pabrik.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>The Global Standard for Industrial Motor Control and Power Panels</h3>\n<p>The Rittal RiLine60 modular busbar system is the worldwide industry benchmark for low-voltage power distribution and Motor Control Centers (MCC). Based on an optimized 60 mm center-to-center phase distance, RiLine60 delivers a safe, organized, and space-saving busbar infrastructure accommodating currents from 250 A up to 1600 A.</p>\n<h3>100% Drill-Free Mechanical and Electrical Assembly</h3>\n<p>Traditional busbar building requires time-consuming hole punching, drilling, and tapping that permanently weakens copper bars. With RiLine60, all power connections, conductor tap-offs, and component adapters clamp directly onto the busbars without a single drilled hole. This completely eliminates copper shavings inside the enclosure and allows effortless repositioning of components during maintenance or panel expansion.</p>\n<h3>Comprehensive OM & CB Component Adapters</h3>\n<p>Rittal OM component adapters provide ready-to-mount platforms for contactors, motor protection circuit breakers, and soft starters. Equipped with pre-wired heat-resistant connection leads and adjustable support rails, OM adapters reduce wiring labor by up to 60%. For heavier feeder circuits, CB adapters mount 3-pole and 4-pole MCCBs up to 630 A directly onto the 60 mm busbars.</p>\n<h3>Integrated RiLine NH Fuse-Switch Disconnectors</h3>\n<p>From compact Size 000 (up to 160 A) to heavy-duty Size 3 (up to 630 A), Rittal NH fuse-switch disconnectors offer high-breaking capacity short-circuit isolation. Optional integrated electronic fuse monitoring (EFM) and smart current sensor modules transmit live voltage, current, and phase angle metrics via Modbus RTU or IO-Link to centralized industrial IoT energy management systems.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>The Global Standard for Industrial Motor Control and Power Panels</h3>\n<p>The Rittal RiLine60 modular busbar system is the worldwide industry benchmark for low-voltage power distribution and Motor Control Centers (MCC). Based on an optimized 60 mm center-to-center phase distance, RiLine60 delivers a safe, organized, and space-saving busbar infrastructure accommodating currents from 250 A up to 1600 A.</p>\n<h3>100% Drill-Free Mechanical and Electrical Assembly</h3>\n<p>Traditional busbar building requires time-consuming hole punching, drilling, and tapping that permanently weakens copper bars. With RiLine60, all power connections, conductor tap-offs, and component adapters clamp directly onto the busbars without a single drilled hole. This completely eliminates copper shavings inside the enclosure and allows effortless repositioning of components during maintenance or panel expansion.</p>\n<h3>Comprehensive OM & CB Component Adapters</h3>\n<p>Rittal OM component adapters provide ready-to-mount platforms for contactors, motor protection circuit breakers, and soft starters. Equipped with pre-wired heat-resistant connection leads and adjustable support rails, OM adapters reduce wiring labor by up to 60%. For heavier feeder circuits, CB adapters mount 3-pole and 4-pole MCCBs up to 630 A directly onto the 60 mm busbars.</p>\n<h3>Integrated RiLine NH Fuse-Switch Disconnectors</h3>\n<p>From compact Size 000 (up to 160 A) to heavy-duty Size 3 (up to 630 A), Rittal NH fuse-switch disconnectors offer high-breaking capacity short-circuit isolation. Optional integrated electronic fuse monitoring (EFM) and smart current sensor modules transmit live voltage, current, and phase angle metrics via Modbus RTU or IO-Link to centralized industrial IoT energy management systems.</p>\nID: <h3>Standar Global untuk Panel Kontrol Motor & Distribusi Industri</h3>\n<p>Sistem busbar modular Rittal RiLine60 adalah acuan industri global untuk distribusi daya tegangan rendah dan pusat kendali motor (Motor Control Center / MCC). Dengan jarak antar fase standar 60 mm, RiLine60 menghadirkan infrastruktur distribusi daya yang sangat rapi, aman, dan hemat ruang untuk kapasitas arus dari 250 A hingga 1600 A.</p>\n<h3>100% Perakitan Mekanikal & Elektrikal Tanpa Pengeboran</h3>\n<p>Pekerjaan busbar konvensional membutuhkan proses pelubangan, pengeboran, dan pengetapan ulir tembaga yang memakan waktu dan berisiko mengurangi kekuatan mekanis batang tembaga. Pada RiLine60, seluruh klem sambungan daya, percabangan kabel, dan adaptor komponen menjepit langsung ke busbar tanpa perlu melubangi tembaga sama sekali. Ini menghilangkan serpihan logam di dalam panel dan memungkinkan relokasi komponen secara fleksibel saat ekspansi sistem.</p>\n<h3>Adaptor Komponen OM & CB Terintegrasi</h3>\n<p>Adaptor komponen Rittal OM menyediakan dudukan siap pasang untuk kontaktor, motor starter, dan soft starter. Dilengkapi kabel koneksi fleksibel tahan panas bawaan dan rel pendukung yang dapat digeser, adaptor OM memangkas waktu pengkabelan hingga 60%. Untuk beban feeder yang lebih besar, adaptor CB memungkinkan pemasangan MCCB 3-kutub dan 4-kutub hingga 630 A langsung di atas sistem busbar 60 mm.</p>\n<h3>Sakelar Pemutus Sekring Terpadu Rittal NH</h3>\n<p>Mulai dari ukuran kompak Size 000 (160 A) hingga beban berat Size 3 (630 A), sakelar pemutus sekring NH Rittal memberikan kapasitas pemutusan hubung singkat yang sangat tinggi. Modul pemantauan sekring elektronik (EFM) dan sensor arus cerdas opsional dapat mentransmisikan data tegangan, arus riil, dan sudut fase melalui Modbus RTU atau IO-Link ke sistem manajemen energi IoT pabrik.</p>"}]}'::jsonb,
  '{"EN: Busbar Center Distances\nID: Jarak Pusat Busbar":"60 mm system (up to 1600 A) and 185 mm system (up to 2100 A)","EN: Busbar Profiles Supported\nID: Profil Busbar Didukung":"Flat copper bars (12x5 mm up to 30x10 mm) and special Rittal PLS 800/1600 profiled copper bars","EN: Rated Short-Time Withstand (Icw)\nID: Ketahanan Arus Hubung Singkat (Icw)":"Up to 50 kA (1s withstand) to IEC 61439-1","EN: Component Adapters\nID: Adaptor Komponen":"OM adapters with tension spring clamps, CB circuit breaker adapters up to 630 A, connection adaptors up to 800 A","EN: Fuse-Switch Disconnectors\nID: Sakelar Pemutus Sekring":"RiLine NH slimline fuse-switch disconnectors size 000, 00, 1, 2, and 3 with electronic fuse monitoring","EN: Degree of Protection\nID: Derajat Proteksi":"IP2X touch protection with base trays, top cover profiles, and end covers"}'::jsonb,
  '/uploads/products-rittal-riline60.jpg',
  'published',
  now(),
  11,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/maxi-pls-flat-pls-high-current-busbars
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000779',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'maxi-pls-flat-pls-high-current-busbars',
  'rittal-distributor/maxi-pls-flat-pls-high-current-busbars',
  E'EN: Rittal Maxi-PLS & Flat-PLS High-Current Busbar Systems (up to 6300 A)
ID: Sistem Busbar Arus Tinggi Rittal Maxi-PLS & Flat-PLS (hingga 6300 A)',
  E'EN: Heavy-duty high-current main busbar platforms engineered for VX25 Ri4Power switchgear, delivering certified short-circuit withstand up to 120 kA (1s) and rated currents up to 6300 A.
ID: Platform busbar utama arus tinggi untuk switchgear VX25 Ri4Power, memberikan ketahanan hubung singkat tersertifikasi hingga 120 kA (1s) dan kapasitas arus hingga 6300 A.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Arsitektur Busbar Utama Berkinerja Tinggi untuk Industri Berat</h3>\n<p>Pada gardu induk utilitas listrik, pusat data berdaya besar, pabrik baja, dan kilang petrokimia, switchgear tegangan rendah utama harus mampu mengalirkan arus listrik masif sekaligus menahan gaya elektrodinamis ekstrem saat terjadi korsleting. Platform busbar arus tinggi Rittal Maxi-PLS dan Flat-PLS menghadirkan solusi paling andal untuk distribusi daya industri berat hingga kapasitas 6300 A.</p>\n<h3>Maxi-PLS: Profil Tembaga Berkontur Khusus dengan Alur T</h3>\n<p>Sistem Maxi-PLS (tersedia dalam tipe Maxi-PLS 45 untuk 1600/2000 A dan Maxi-PLS 60 untuk 3200/4000 A) menggunakan profil ekstrusi tembaga khusus (E-Cu) dengan alur-T memanjang pada keempat sisinya. Sambungan konduktor, busbar masukan dari Air Circuit Breaker (ACB), dan kabel feeder terpasang langsung menggunakan baut T-head berkekuatan tinggi yang meluncur di alur profil, menghasilkan tekanan kontak optimal tanpa perlu mengebor tembaga.</p>\n<h3>Flat-PLS: Sistem Busbar Pelat Datar Modular hingga 6300 A</h3>\n<p>Untuk kebutuhan daya super besar hingga 6300 A, sistem Rittal Flat-PLS menggunakan susunan batang tembaga datar paralel (hingga 4 x 120 x 10 mm per fase). Dudukan busbar berkekuatan tinggi dicetak dari polimer termoset bebas halogen yang tahan api, dirancang sanggup menahan arus gangguan hubung singkat mematikan hingga 120 kA selama 1 detik penuh serta gaya puncak dinamis (Ipk) hingga 264 kA.</p>\n<h3>Integrasi Teruji Tipe (Type-Tested) pada VX25 Ri4Power</h3>\n<p>Maxi-PLS dan Flat-PLS terintegrasi sempurna di dalam kabinet switchgear VX25 Ri4Power. Diposisikan di kompartemen atap, bagian belakang, atau zona distribusi vertikal, sistem ini mendukung pemisahan internal Form 1, Form 2b, Form 3b, Form 4a, hingga Form 4b sesuai IEC 61439-1/-2. Tersedia modul koneksi standar untuk ACB dan MCCB kelas dunia seperti ABB Emax, Schneider MasterPact, dan Siemens Sentron, menjamin kepatuhan sertifikasi type-test penuh tanpa fabrikasi manual khusus.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Performance Main Busbar Architecture for Heavy Industry</h3>\n<p>In power utility substations, data centers, steel mills, and chemical plants, main low-voltage switchgear must endure immense electrical currents and massive electrodynamic short-circuit stresses. The Rittal Maxi-PLS and Flat-PLS high-current busbar platforms deliver the ultimate solution for heavy industrial power distribution up to 6300 A.</p>\n<h3>Maxi-PLS: Specially Contoured Copper Busbar Profiles</h3>\n<p>The Maxi-PLS system (available in Maxi-PLS 45, 1600/2000 A and Maxi-PLS 60, 3200/4000 A) utilizes an engineered hollow copper extrusion featuring longitudinal T-grooves on all four sides. Conductor connections, incoming Air Circuit Breaker (ACB) busbars, and outgoing cables attach directly using high-tensile T-head bolts that slide smoothly into the profile grooves, ensuring massive contact surface pressure without requiring any bar drilling.</p>\n<h3>Flat-PLS: Modular Flat Bar Systems Up to 6300 A</h3>\n<p>For applications demanding maximum power throughput up to 6300 A, the Rittal Flat-PLS system employs parallel multi-laminated copper flat bars (up to 4 x 120 x 10 mm per phase). The reinforced busbar supports are injection molded from halogen-free, self-extinguishing thermoset plastic, capable of withstanding destructive short-circuit faults up to 120 kA for 1 full second and dynamic peak forces up to 264 kA.</p>\n<h3>Type-Tested Integration in VX25 Ri4Power</h3>\n<p>Maxi-PLS and Flat-PLS integrate seamlessly into the VX25 Ri4Power enclosure system. Positioned in the top, rear, or vertical busbar chambers, they support internal form separation Form 1, Form 2b, Form 3b, Form 4a, and Form 4b according to IEC 61439-1/-2. Standardized ACB and MCCB connection kits for ABB Emax, Schneider MasterPact, and Siemens Sentron guarantee full type-test compliance without bespoke fabrication.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Performance Main Busbar Architecture for Heavy Industry</h3>\n<p>In power utility substations, data centers, steel mills, and chemical plants, main low-voltage switchgear must endure immense electrical currents and massive electrodynamic short-circuit stresses. The Rittal Maxi-PLS and Flat-PLS high-current busbar platforms deliver the ultimate solution for heavy industrial power distribution up to 6300 A.</p>\n<h3>Maxi-PLS: Specially Contoured Copper Busbar Profiles</h3>\n<p>The Maxi-PLS system (available in Maxi-PLS 45, 1600/2000 A and Maxi-PLS 60, 3200/4000 A) utilizes an engineered hollow copper extrusion featuring longitudinal T-grooves on all four sides. Conductor connections, incoming Air Circuit Breaker (ACB) busbars, and outgoing cables attach directly using high-tensile T-head bolts that slide smoothly into the profile grooves, ensuring massive contact surface pressure without requiring any bar drilling.</p>\n<h3>Flat-PLS: Modular Flat Bar Systems Up to 6300 A</h3>\n<p>For applications demanding maximum power throughput up to 6300 A, the Rittal Flat-PLS system employs parallel multi-laminated copper flat bars (up to 4 x 120 x 10 mm per phase). The reinforced busbar supports are injection molded from halogen-free, self-extinguishing thermoset plastic, capable of withstanding destructive short-circuit faults up to 120 kA for 1 full second and dynamic peak forces up to 264 kA.</p>\n<h3>Type-Tested Integration in VX25 Ri4Power</h3>\n<p>Maxi-PLS and Flat-PLS integrate seamlessly into the VX25 Ri4Power enclosure system. Positioned in the top, rear, or vertical busbar chambers, they support internal form separation Form 1, Form 2b, Form 3b, Form 4a, and Form 4b according to IEC 61439-1/-2. Standardized ACB and MCCB connection kits for ABB Emax, Schneider MasterPact, and Siemens Sentron guarantee full type-test compliance without bespoke fabrication.</p>\nID: <h3>Arsitektur Busbar Utama Berkinerja Tinggi untuk Industri Berat</h3>\n<p>Pada gardu induk utilitas listrik, pusat data berdaya besar, pabrik baja, dan kilang petrokimia, switchgear tegangan rendah utama harus mampu mengalirkan arus listrik masif sekaligus menahan gaya elektrodinamis ekstrem saat terjadi korsleting. Platform busbar arus tinggi Rittal Maxi-PLS dan Flat-PLS menghadirkan solusi paling andal untuk distribusi daya industri berat hingga kapasitas 6300 A.</p>\n<h3>Maxi-PLS: Profil Tembaga Berkontur Khusus dengan Alur T</h3>\n<p>Sistem Maxi-PLS (tersedia dalam tipe Maxi-PLS 45 untuk 1600/2000 A dan Maxi-PLS 60 untuk 3200/4000 A) menggunakan profil ekstrusi tembaga khusus (E-Cu) dengan alur-T memanjang pada keempat sisinya. Sambungan konduktor, busbar masukan dari Air Circuit Breaker (ACB), dan kabel feeder terpasang langsung menggunakan baut T-head berkekuatan tinggi yang meluncur di alur profil, menghasilkan tekanan kontak optimal tanpa perlu mengebor tembaga.</p>\n<h3>Flat-PLS: Sistem Busbar Pelat Datar Modular hingga 6300 A</h3>\n<p>Untuk kebutuhan daya super besar hingga 6300 A, sistem Rittal Flat-PLS menggunakan susunan batang tembaga datar paralel (hingga 4 x 120 x 10 mm per fase). Dudukan busbar berkekuatan tinggi dicetak dari polimer termoset bebas halogen yang tahan api, dirancang sanggup menahan arus gangguan hubung singkat mematikan hingga 120 kA selama 1 detik penuh serta gaya puncak dinamis (Ipk) hingga 264 kA.</p>\n<h3>Integrasi Teruji Tipe (Type-Tested) pada VX25 Ri4Power</h3>\n<p>Maxi-PLS dan Flat-PLS terintegrasi sempurna di dalam kabinet switchgear VX25 Ri4Power. Diposisikan di kompartemen atap, bagian belakang, atau zona distribusi vertikal, sistem ini mendukung pemisahan internal Form 1, Form 2b, Form 3b, Form 4a, hingga Form 4b sesuai IEC 61439-1/-2. Tersedia modul koneksi standar untuk ACB dan MCCB kelas dunia seperti ABB Emax, Schneider MasterPact, dan Siemens Sentron, menjamin kepatuhan sertifikasi type-test penuh tanpa fabrikasi manual khusus.</p>"}]}'::jsonb,
  '{"EN: Rated Current (In)\nID: Arus Pengenal (In)":"Maxi-PLS: 1600 A to 4000 A | Flat-PLS: 2500 A up to 6300 A","EN: Rated Short-Time Withstand (Icw)\nID: Ketahanan Arus Hubung Singkat (Icw)":"Up to 120 kA (1 s) / Peak short-circuit withstand (Ipk) up to 264 kA","EN: Busbar Profile Engineering\nID: Rekayasa Profil Busbar":"Maxi-PLS specially contoured E-Cu profile with T-grooves; Flat-PLS up to 4x 120x10 mm laminated copper bars","EN: Switchgear Enclosure Integration\nID: Integrasi Kabinet Switchgear":"Designed for VX25 Ri4Power low-voltage switchgear assemblies (Form 1 to Form 4b to IEC 61439-1/-2)","EN: Busbar Locations\nID: Lokasi Pemasangan Busbar":"Top roof section, rear upper/lower section, or vertical distribution busbar zone","EN: Connection Technology\nID: Teknologi Sambungan":"Drill-free T-head bolts for Maxi-PLS; heavy-duty clamping claw brackets for Flat-PLS with calibrated torque indicators"}'::jsonb,
  '/uploads/products-rittal-maxi-pls.jpg',
  'published',
  now(),
  12,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 032_add_rittal_climate_control_types.up.sql
-- ==========================================

-- 032_add_rittal_climate_control_types.up.sql
-- Add 3 specialized Rittal Climate Control products from rittal.com:
-- 1. Rittal TopTherm Fan-and-Filter Units & Roof-Mounted Ventilation
-- 2. Rittal Air-to-Water Heat Exchangers & Industrial Blue e+ Chillers
-- 3. Rittal Enclosure Heaters, Thermostats & Hygrostats (Anti-Condensation)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/fan-and-filter-units
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000780',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'fan-and-filter-units',
  'rittal-distributor/fan-and-filter-units',
  E'EN: Rittal TopTherm Fan-and-Filter Units & Roof-Mounted Ventilation
ID: Unit Fan-Filter TopTherm & Ventilasi Atap Panel Rittal',
  E'EN: High-efficiency enclosure filter fans featuring diagonal fan technology, tool-free snap-in installation, and fine particulate protection up to IP55 / NEMA 12.
ID: Kipas filter enclosure berefisiensi tinggi dengan teknologi aliran diagonal, instalasi snap-in tanpa alat, dan proteksi partikel halus hingga IP55 / NEMA 12.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sirkulasi Udara Paksa Berkinerja Tinggi dengan Teknologi Kipas Diagonal</h3>\n<p>Seri fan-and-filter Rittal TopTherm merupakan standar industri global untuk ventilasi enclosure panel yang andal dan hemat biaya. Ditenagai bilah kipas impeller diagonal berteknologi tinggi, aliran udara dihembuskan secara merata menyilang ke seluruh ruang dalam kabinet, menghilangkan titik panas terlokalisasi (hot spots) di sekitar inverter dan komponen daya berdensitas tinggi.</p>\n<h3>Pemasangan Snap-In Tanpa Baut & Penggantian Filter 10 Detik</h3>\n<p>Proses pemasangan tidak membutuhkan sekrup atau perkakas khusus. Seluruh rangka unit kipas langsung terkunci rapat ke lubang cutout standar kabinet menggunakan klem jepit pegas berpaten. Perawatan rutin sangat praktis: kisi louver ergonomis dapat dibuka dengan sentuhan satu jari pada engsel fleksibel, memungkinkan inspeksi atau penggantian filter mat dalam waktu kurang dari 10 detik tanpa perlu mematikan operasional panel.</p>\n<h3>Teknologi Motor EC Hemat Energi yang Cerdas</h3>\n<p>Tersedia dengan opsi motor Electronically Commutated (EC) mutakhir, kipas Rittal TopTherm mengonsumsi daya listrik hingga 60% lebih rendah dibanding motor induksi AC konvensional. Antarmuka pengatur kecepatan internal (0-10 V atau sinyal PWM) menyesuaikan putaran kipas secara dinamis berdasarkan suhu aktual panel, meredam kebisingan suara secara drastis serta memperpanjang usia pakai bearing hingga lebih dari 70.000 jam operasional non-stop.</p>\n<h3>Proteksi Menyeluruh: Debu Halus, Semprotan Air, dan Pelindung EMC</h3>\n<p>Unit standar memiliki proteksi IP54 terhadap debu dan cipratan cairan. Dengan menambahkan filter mat halus (fine filter mat), tingkat proteksi meningkat menjadi IP55 / NEMA 12. Untuk area cuci semprot air terbuka, penutup tudung stainless steel (hose-proof hood) Rittal meningkatkan proteksi hingga IP56, sementara varian khusus EMC mencegah kebocoran interferensi elektromagnetik pada panel instrumen sensitif.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Performance Forced Air Circulation with Diagonal Fan Technology</h3>\n<p>The Rittal TopTherm fan-and-filter series sets the global gold standard for reliable, cost-effective enclosure ventilation. Engineered with advanced diagonal fan impeller technology, airflow is directed diagonally across the enclosure interior, creating uniform air distribution that completely eliminates localized heat pockets and hot spots around densely packed power electronics.</p>\n<h3>Tool-Free Snap-In Mounting & 10-Second Filter Mat Swaps</h3>\n<p>Installation requires zero screws or specialized tools. The entire fan assembly snaps securely into standardized rectangular enclosure cutouts using patented spring-loaded latching clamps. Routine maintenance is equally effortless: the ergonomic louvre grille unlatches with a light fingertip pull, swinging open on heavy-duty hinges to allow filter mat inspection or replacement in under 10 seconds without stopping production.</p>\n<h3>Intelligent Energy-Saving EC Fan Technology</h3>\n<p>Available with state-of-the-art electronically commutated (EC) motors, Rittal TopTherm fans consume up to 60% less electrical power than standard AC induction fans. Built-in speed control interfaces (0-10 V or PWM) dynamically adjust fan revolutions to match actual internal cabinet temperature, drastically reducing acoustic noise levels and extending bearing service life beyond 70,000 continuous operating hours.</p>\n<h3>Comprehensive Protection: Fine Dust, Hose-Proof, and EMC Shielding</h3>\n<p>Standard units deliver IP54 ingress protection against dust and liquid splashes. By inserting high-density fine filter mats, protection is elevated to IP55 / NEMA 12. For washdown environments, Rittal stainless steel hose-proof hoods upgrade protection to IP56, while specialized EMC versions prevent electromagnetic interference in radio-frequency sensitive switchboards.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Performance Forced Air Circulation with Diagonal Fan Technology</h3>\n<p>The Rittal TopTherm fan-and-filter series sets the global gold standard for reliable, cost-effective enclosure ventilation. Engineered with advanced diagonal fan impeller technology, airflow is directed diagonally across the enclosure interior, creating uniform air distribution that completely eliminates localized heat pockets and hot spots around densely packed power electronics.</p>\n<h3>Tool-Free Snap-In Mounting & 10-Second Filter Mat Swaps</h3>\n<p>Installation requires zero screws or specialized tools. The entire fan assembly snaps securely into standardized rectangular enclosure cutouts using patented spring-loaded latching clamps. Routine maintenance is equally effortless: the ergonomic louvre grille unlatches with a light fingertip pull, swinging open on heavy-duty hinges to allow filter mat inspection or replacement in under 10 seconds without stopping production.</p>\n<h3>Intelligent Energy-Saving EC Fan Technology</h3>\n<p>Available with state-of-the-art electronically commutated (EC) motors, Rittal TopTherm fans consume up to 60% less electrical power than standard AC induction fans. Built-in speed control interfaces (0-10 V or PWM) dynamically adjust fan revolutions to match actual internal cabinet temperature, drastically reducing acoustic noise levels and extending bearing service life beyond 70,000 continuous operating hours.</p>\n<h3>Comprehensive Protection: Fine Dust, Hose-Proof, and EMC Shielding</h3>\n<p>Standard units deliver IP54 ingress protection against dust and liquid splashes. By inserting high-density fine filter mats, protection is elevated to IP55 / NEMA 12. For washdown environments, Rittal stainless steel hose-proof hoods upgrade protection to IP56, while specialized EMC versions prevent electromagnetic interference in radio-frequency sensitive switchboards.</p>\nID: <h3>Sirkulasi Udara Paksa Berkinerja Tinggi dengan Teknologi Kipas Diagonal</h3>\n<p>Seri fan-and-filter Rittal TopTherm merupakan standar industri global untuk ventilasi enclosure panel yang andal dan hemat biaya. Ditenagai bilah kipas impeller diagonal berteknologi tinggi, aliran udara dihembuskan secara merata menyilang ke seluruh ruang dalam kabinet, menghilangkan titik panas terlokalisasi (hot spots) di sekitar inverter dan komponen daya berdensitas tinggi.</p>\n<h3>Pemasangan Snap-In Tanpa Baut & Penggantian Filter 10 Detik</h3>\n<p>Proses pemasangan tidak membutuhkan sekrup atau perkakas khusus. Seluruh rangka unit kipas langsung terkunci rapat ke lubang cutout standar kabinet menggunakan klem jepit pegas berpaten. Perawatan rutin sangat praktis: kisi louver ergonomis dapat dibuka dengan sentuhan satu jari pada engsel fleksibel, memungkinkan inspeksi atau penggantian filter mat dalam waktu kurang dari 10 detik tanpa perlu mematikan operasional panel.</p>\n<h3>Teknologi Motor EC Hemat Energi yang Cerdas</h3>\n<p>Tersedia dengan opsi motor Electronically Commutated (EC) mutakhir, kipas Rittal TopTherm mengonsumsi daya listrik hingga 60% lebih rendah dibanding motor induksi AC konvensional. Antarmuka pengatur kecepatan internal (0-10 V atau sinyal PWM) menyesuaikan putaran kipas secara dinamis berdasarkan suhu aktual panel, meredam kebisingan suara secara drastis serta memperpanjang usia pakai bearing hingga lebih dari 70.000 jam operasional non-stop.</p>\n<h3>Proteksi Menyeluruh: Debu Halus, Semprotan Air, dan Pelindung EMC</h3>\n<p>Unit standar memiliki proteksi IP54 terhadap debu dan cipratan cairan. Dengan menambahkan filter mat halus (fine filter mat), tingkat proteksi meningkat menjadi IP55 / NEMA 12. Untuk area cuci semprot air terbuka, penutup tudung stainless steel (hose-proof hood) Rittal meningkatkan proteksi hingga IP56, sementara varian khusus EMC mencegah kebocoran interferensi elektromagnetik pada panel instrumen sensitif.</p>"}]}'::jsonb,
  '{"EN: Air Throughput (Unimpeded)\nID: Laju Aliran Udara Bebas":"20 m³/h up to 900 m³/h (Diagonal fan motor technology)","EN: Protection Category\nID: Kategori Proteksi":"IP54 standard / IP55 with fine filter mat (to IEC 60529 / UL Type 12)","EN: Motor Technology\nID: Teknologi Motor Kipas":"Energy-efficient EC motor with speed regulation (0-10V / PWM) and DC/AC shaded pole motors","EN: Installation & Maintenance\nID: Pemasangan & Pemeliharaan":"Tool-free snap-in latching mechanism and hinged louvred grille for 10-second filter mat replacement","EN: Available Variants\nID: Varian Tersedia":"Standard RAL 7035, EMC shielded RF versions, Hose-proof hoods (IP56), Roof-mounted extraction fans","EN: Operating Temperatures\nID: Rentang Suhu Operasi":"-30°C to +55°C ambient temperature rating"}'::jsonb,
  '/uploads/products-rittal-fan-filter.jpg',
  'published',
  now(),
  13,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/air-to-water-heat-exchangers-chillers
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000781',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'air-to-water-heat-exchangers-chillers',
  'rittal-distributor/air-to-water-heat-exchangers-chillers',
  E'EN: Rittal Air-to-Water Heat Exchangers & Industrial Blue e+ Chillers
ID: Penukar Panas Udara-ke-Air & Chiller Industri Rittal Blue e+',
  E'EN: Closed-loop liquid cooling solutions designed for harsh ambient environments up to +70°C, extreme dust, oily atmospheres, and heavy heat loads from 300 W to 40 kW.
ID: Solusi pendinginan sirkuit tertutup berbasis cairan untuk lingkungan ekstrem hingga +70°C, debu pekat, uap oli mesin, dan beban termal tinggi 300 W hingga 40 kW.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengendalian Suhu Ekstrem untuk Lingkungan Pabrik Berat</h3>\n<p>Ketika lantai produksi pabrik terpapar debu karbon konduktif, serbuk gerinda logam, aerosol cat, atau uap kimia korosif, udara lingkungan sekitar sama sekali tidak boleh masuk ke dalam kabinet kontrol. Penukar Panas Udara-ke-Air (Air-to-Water Heat Exchanger) Rittal menghadirkan pendinginan sirkuit tertutup murni dengan membuang panas internal langsung ke sirkulasi air dingin terpusat pabrik, melindungi komponen sensitif secara total.</p>\n<h3>Operasional Andal pada Suhu Lingkungan Tinggi hingga +70°C</h3>\n<p>Berbeda dari AC pendingin refrigeran standar yang rentan mati saat suhu ruang melampaui 50°C, penukar panas air Rittal mampu beroperasi stabil pada suhu ambien ekstrem hingga +70°C. Unit ini menjadi solusi utama di pabrik peleburan baja, fasilitas manufaktur kaca, pabrik semen, pengecatan otomotif, dan area tambang terbuka.</p>\n<h3>Chiller Industri Rittal Blue e+ (1 kW hingga 40 kW)</h3>\n<p>Bagi fasilitas industri yang belum memiliki jaringan air dingin terpusat, unit Rittal Blue e+ Chiller menyediakan suplai air pendingin dengan presisi suhu ultra-tinggi hingga deviasi ±0,5 K. Ditenagai kompresor DC inverter berkecepatan dinamis dan katup ekspansi elektronik (EEV), chiller Blue e+ menyesuaikan daya pendingin secara otomatis mengikuti fluktuasi beban mesin, memangkas konsumsi listrik hingga 70% sekaligus menjaga performa spindle mesin CNC, laser pemotong, dan kabinet switchgear.</p>\n<h3>Proteksi Kebocoran Air & Kondensasi Terpadu</h3>\n<p>Seluruh unit penukar panas Rittal dilengkapi katup non-return, bak penampung kondensat dengan selang pembuangan aman, serta sensor kebocoran air optik dan elektrik terintegrasi. Apabila terjadi kondensasi berlebih atau anomali tekanan air sirkulasi, Comfort Controller cerdas akan langsung membunyikan alarm dan menutup katup solenoid air untuk memastikan keamanan elektrikal kabinet 100%.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Extreme Climate Control for Severe Industrial Environments</h3>\n<p>When industrial factory floors are contaminated with conductive carbon dust, metal shavings, paint aerosols, or chemical vapors, ambient air must never penetrate electrical enclosures. Rittal Air-to-Water Heat Exchangers deliver the ultimate closed-circuit cooling solution by dissipating internal enclosure heat directly into a plant chilled water circuit, completely isolating cabinet electronics from harsh ambient factory air.</p>\n<h3>Reliable Operation in High Temperatures Up to +70°C</h3>\n<p>Unlike standard refrigerant air conditioners that fail or trip out when ambient temperatures exceed 50°C, Rittal Air-to-Water Heat Exchangers operate reliably in extreme ambient environments up to +70°C. They are the preferred cooling choice for steel rolling mills, industrial glass manufacturing, aluminum smelters, automotive paint shops, and mining crushers.</p>\n<h3>Blue e+ Industrial Recooling Chillers (1 kW to 40 kW)</h3>\n<p>For facilities without a centralized plant cooling water network, Rittal Blue e+ chillers supply precisely temperature-controlled water down to ±0.5 K accuracy. Powered by inverter-regulated variable-speed DC compressors and electronically controlled expansion valves, Blue e+ chillers automatically adjust cooling output to match fluctuating process loads, saving up to 70% energy while protecting machine tool spindles, laser cutting optics, and switchgear suites.</p>\n<h3>Condensate & Leakage Protection with Smart Monitoring</h3>\n<p>Rittal heat exchangers incorporate integrated non-return valves, condensate collecting trays with drain hoses, and optical/electrical water leakage sensors. If unexpected piping condensation or line pressure drops occur, the intelligent Comfort Controller triggers automated alarms and isolates water solenoid valves to guarantee absolute enclosure safety.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Extreme Climate Control for Severe Industrial Environments</h3>\n<p>When industrial factory floors are contaminated with conductive carbon dust, metal shavings, paint aerosols, or chemical vapors, ambient air must never penetrate electrical enclosures. Rittal Air-to-Water Heat Exchangers deliver the ultimate closed-circuit cooling solution by dissipating internal enclosure heat directly into a plant chilled water circuit, completely isolating cabinet electronics from harsh ambient factory air.</p>\n<h3>Reliable Operation in High Temperatures Up to +70°C</h3>\n<p>Unlike standard refrigerant air conditioners that fail or trip out when ambient temperatures exceed 50°C, Rittal Air-to-Water Heat Exchangers operate reliably in extreme ambient environments up to +70°C. They are the preferred cooling choice for steel rolling mills, industrial glass manufacturing, aluminum smelters, automotive paint shops, and mining crushers.</p>\n<h3>Blue e+ Industrial Recooling Chillers (1 kW to 40 kW)</h3>\n<p>For facilities without a centralized plant cooling water network, Rittal Blue e+ chillers supply precisely temperature-controlled water down to ±0.5 K accuracy. Powered by inverter-regulated variable-speed DC compressors and electronically controlled expansion valves, Blue e+ chillers automatically adjust cooling output to match fluctuating process loads, saving up to 70% energy while protecting machine tool spindles, laser cutting optics, and switchgear suites.</p>\n<h3>Condensate & Leakage Protection with Smart Monitoring</h3>\n<p>Rittal heat exchangers incorporate integrated non-return valves, condensate collecting trays with drain hoses, and optical/electrical water leakage sensors. If unexpected piping condensation or line pressure drops occur, the intelligent Comfort Controller triggers automated alarms and isolates water solenoid valves to guarantee absolute enclosure safety.</p>\nID: <h3>Pengendalian Suhu Ekstrem untuk Lingkungan Pabrik Berat</h3>\n<p>Ketika lantai produksi pabrik terpapar debu karbon konduktif, serbuk gerinda logam, aerosol cat, atau uap kimia korosif, udara lingkungan sekitar sama sekali tidak boleh masuk ke dalam kabinet kontrol. Penukar Panas Udara-ke-Air (Air-to-Water Heat Exchanger) Rittal menghadirkan pendinginan sirkuit tertutup murni dengan membuang panas internal langsung ke sirkulasi air dingin terpusat pabrik, melindungi komponen sensitif secara total.</p>\n<h3>Operasional Andal pada Suhu Lingkungan Tinggi hingga +70°C</h3>\n<p>Berbeda dari AC pendingin refrigeran standar yang rentan mati saat suhu ruang melampaui 50°C, penukar panas air Rittal mampu beroperasi stabil pada suhu ambien ekstrem hingga +70°C. Unit ini menjadi solusi utama di pabrik peleburan baja, fasilitas manufaktur kaca, pabrik semen, pengecatan otomotif, dan area tambang terbuka.</p>\n<h3>Chiller Industri Rittal Blue e+ (1 kW hingga 40 kW)</h3>\n<p>Bagi fasilitas industri yang belum memiliki jaringan air dingin terpusat, unit Rittal Blue e+ Chiller menyediakan suplai air pendingin dengan presisi suhu ultra-tinggi hingga deviasi ±0,5 K. Ditenagai kompresor DC inverter berkecepatan dinamis dan katup ekspansi elektronik (EEV), chiller Blue e+ menyesuaikan daya pendingin secara otomatis mengikuti fluktuasi beban mesin, memangkas konsumsi listrik hingga 70% sekaligus menjaga performa spindle mesin CNC, laser pemotong, dan kabinet switchgear.</p>\n<h3>Proteksi Kebocoran Air & Kondensasi Terpadu</h3>\n<p>Seluruh unit penukar panas Rittal dilengkapi katup non-return, bak penampung kondensat dengan selang pembuangan aman, serta sensor kebocoran air optik dan elektrik terintegrasi. Apabila terjadi kondensasi berlebih atau anomali tekanan air sirkulasi, Comfort Controller cerdas akan langsung membunyikan alarm dan menutup katup solenoid air untuk memastikan keamanan elektrikal kabinet 100%.</p>"}]}'::jsonb,
  '{"EN: Cooling Capacity\nID: Kapasitas Pendinginan":"Heat Exchangers: 300 W to 10,000 W | Blue e+ Chillers: 1 kW up to 40 kW","EN: Max Ambient Temperature\nID: Suhu Lingkungan Maksimum":"Up to +70°C ambient operation without performance de-rating","EN: Water Circuit Connections\nID: Sambungan Sirkuit Air":"G 3/8\" to G 1\" stainless steel / brass quick-connect threaded fittings","EN: Enclosure Protection\nID: Proteksi Enclosure":"Maintains IP55 hermetic seal to IEC 60529 (no ambient factory air enters cabinet)","EN: Chiller Compressor & Inverter\nID: Kompresor Chiller & Inverter":"Speed-regulated DC inverter compressor and electronic expansion valve (EEV)","EN: Digital Interfaces\nID: Antarmuka Digital":"Comfort Controller with digital display, Modbus TCP, OPC-UA, and NFC diagnostics"}'::jsonb,
  '/uploads/products-rittal-heat-exchangers.jpg',
  'published',
  now(),
  14,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/enclosure-heaters-dehumidifiers
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000782',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'enclosure-heaters-dehumidifiers',
  'rittal-distributor/enclosure-heaters-dehumidifiers',
  E'EN: Rittal Enclosure Heaters, Thermostats & Hygrostats (Anti-Condensation)
ID: Pemanas Panel, Termostat & Higrostat Rittal (Anti-Kondensasi)',
  E'EN: Self-regulating PTC convection heaters, fan heaters, and precision digital hygrostats engineered to prevent destructive moisture condensation and corrosion in electrical enclosures.
ID: Pemanas konveksi PTC otomatis, pemanas fan, dan higrostat digital presisi untuk mencegah tetesan air kondensasi dan korosi fatal di dalam panel listrik.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Mencegah Kondensasi Titik Embun & Korosi Fatal pada Panel Listrik</h3>\n<p>Di daerah beriklim tropis dan pesisir dengan kelembaban udara tinggi—seperti Indonesia di mana kelembaban relatif sering melampaui 80%—perbedaan suhu antara siang dan malam hari dapat memicu terbentuknya titik embun (dew point). Butiran air mikroskopis mengembun di permukaan busbar tembaga, papan sirkuit PCB PLC, dan terminal kabel, menyebabkan korsleting fatal, penurunan resistansi isolasi, serta karat dini. Pemanas panel Rittal mengeliminasi ancaman ini dengan mempertahankan suhu kabinet selalu berada di atas titik embun.</p>\n<h3>Teknologi Pemanas Keramik PTC Otomatis</h3>\n<p>Pemanas Rittal menggunakan elemen keramik Positive Temperature Coefficient (PTC) yang terbungkus dalam heatsink aluminium ekstrusi berdesain aerodinamis. Karakteristik PTC memberikan keamanan suhu mandiri secara fisik: saat elemen memanas, hambatan listriknya otomatis meningkat sehingga konsumsi daya mengecil dengan sendirinya. Unit ini tahan bakar dan tidak pernah mengalami panas berlebih (overheat) meski tanpa sekring termal eksternal.</p>\n<h3>Pemanas Bantuan Kipas (Fan Heater) untuk Kabinet Besar</h3>\n<p>Untuk enclosure kubikal besar seperti VX25, Rittal fan heater (hingga 800 W) mengintegrasikan kipas aksial bersuara senyap yang aktif mendistribusikan udara hangat ke seluruh sudut volume kabinet. Hal ini mencegah terjadinya kantong udara dingin di bagian bawah panel dan mempercepat proses penghilangan kelembaban di sekitar kelenjar terminasi kabel masukan.</p>\n<h3>Termostat, Higrostat Presisi & Pengendalian Cerdas IoT</h3>\n<p>Menyalakan pemanas secara non-stop membuang energi dan memperpendek usia komponen. Dipadukan dengan termostat mekanis Rittal (SK 3110) atau higrostat digital elektronik (SK 3118), pemanas hanya akan menyala saat suhu internal panel turun di bawah batas aman atau kelembaban relatif melampaui 65% RH. Pada pabrik modern, pengontrol ganda ini mengirimkan sinyal status alarm ke sistem SCADA dan pemantauan IoT fasilitas.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Preventing Destructive Dew-Point Condensation in Industrial Enclosures</h3>\n<p>In tropical, coastal, and outdoor environments with high humidity—such as Indonesia where relative humidity routinely exceeds 80%—temperature fluctuations between day and night cause air moisture to reach the dew point. Microscopic water droplets condense on cold busbars, PCB circuit boards, and terminal screws, causing catastrophic short circuits, insulation breakdown, and rapid contact corrosion. Rittal enclosure heaters eliminate this threat by keeping the interior temperature safely above the dew point at all times.</p>\n<h3>Self-Regulating PTC Ceramic Heating Technology</h3>\n<p>Rittal heaters utilize Positive Temperature Coefficient (PTC) ceramic resistor elements housed in aerodynamically optimized extruded aluminum profiles. The PTC technology provides inherent physical temperature limiting: as the heater warms up, its electrical resistance naturally increases, making the unit completely burn-out proof and energy self-regulating without requiring external thermal cutoff fuses.</p>\n<h3>Fan-Assisted Heaters for Large Switchgear Cabinets</h3>\n<p>For spacious modular enclosures such as the VX25, Rittal fan heaters (up to 800 W) integrate quiet, long-life axial fans that actively distribute warm air throughout the entire cabinet volume. This prevents cold zones at the bottom of the enclosure and ensures rapid, uniform dehumidification around incoming cable termination glands.</p>\n<h3>Precision Thermostats, Hygrostats, and Smart IoT Controls</h3>\n<p>Operating heaters continuously wastes energy and shortens component lifespan. Paired with Rittal mechanical thermostats (SK 3110) or digital electronic hygrostats (SK 3118), heating units activate only when internal cabinet temperature drops below the safe threshold or relative humidity rises above 65%. For automated plants, dual controllers send fault and status signals to SCADA and plant management networks.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Preventing Destructive Dew-Point Condensation in Industrial Enclosures</h3>\n<p>In tropical, coastal, and outdoor environments with high humidity—such as Indonesia where relative humidity routinely exceeds 80%—temperature fluctuations between day and night cause air moisture to reach the dew point. Microscopic water droplets condense on cold busbars, PCB circuit boards, and terminal screws, causing catastrophic short circuits, insulation breakdown, and rapid contact corrosion. Rittal enclosure heaters eliminate this threat by keeping the interior temperature safely above the dew point at all times.</p>\n<h3>Self-Regulating PTC Ceramic Heating Technology</h3>\n<p>Rittal heaters utilize Positive Temperature Coefficient (PTC) ceramic resistor elements housed in aerodynamically optimized extruded aluminum profiles. The PTC technology provides inherent physical temperature limiting: as the heater warms up, its electrical resistance naturally increases, making the unit completely burn-out proof and energy self-regulating without requiring external thermal cutoff fuses.</p>\n<h3>Fan-Assisted Heaters for Large Switchgear Cabinets</h3>\n<p>For spacious modular enclosures such as the VX25, Rittal fan heaters (up to 800 W) integrate quiet, long-life axial fans that actively distribute warm air throughout the entire cabinet volume. This prevents cold zones at the bottom of the enclosure and ensures rapid, uniform dehumidification around incoming cable termination glands.</p>\n<h3>Precision Thermostats, Hygrostats, and Smart IoT Controls</h3>\n<p>Operating heaters continuously wastes energy and shortens component lifespan. Paired with Rittal mechanical thermostats (SK 3110) or digital electronic hygrostats (SK 3118), heating units activate only when internal cabinet temperature drops below the safe threshold or relative humidity rises above 65%. For automated plants, dual controllers send fault and status signals to SCADA and plant management networks.</p>\nID: <h3>Mencegah Kondensasi Titik Embun & Korosi Fatal pada Panel Listrik</h3>\n<p>Di daerah beriklim tropis dan pesisir dengan kelembaban udara tinggi—seperti Indonesia di mana kelembaban relatif sering melampaui 80%—perbedaan suhu antara siang dan malam hari dapat memicu terbentuknya titik embun (dew point). Butiran air mikroskopis mengembun di permukaan busbar tembaga, papan sirkuit PCB PLC, dan terminal kabel, menyebabkan korsleting fatal, penurunan resistansi isolasi, serta karat dini. Pemanas panel Rittal mengeliminasi ancaman ini dengan mempertahankan suhu kabinet selalu berada di atas titik embun.</p>\n<h3>Teknologi Pemanas Keramik PTC Otomatis</h3>\n<p>Pemanas Rittal menggunakan elemen keramik Positive Temperature Coefficient (PTC) yang terbungkus dalam heatsink aluminium ekstrusi berdesain aerodinamis. Karakteristik PTC memberikan keamanan suhu mandiri secara fisik: saat elemen memanas, hambatan listriknya otomatis meningkat sehingga konsumsi daya mengecil dengan sendirinya. Unit ini tahan bakar dan tidak pernah mengalami panas berlebih (overheat) meski tanpa sekring termal eksternal.</p>\n<h3>Pemanas Bantuan Kipas (Fan Heater) untuk Kabinet Besar</h3>\n<p>Untuk enclosure kubikal besar seperti VX25, Rittal fan heater (hingga 800 W) mengintegrasikan kipas aksial bersuara senyap yang aktif mendistribusikan udara hangat ke seluruh sudut volume kabinet. Hal ini mencegah terjadinya kantong udara dingin di bagian bawah panel dan mempercepat proses penghilangan kelembaban di sekitar kelenjar terminasi kabel masukan.</p>\n<h3>Termostat, Higrostat Presisi & Pengendalian Cerdas IoT</h3>\n<p>Menyalakan pemanas secara non-stop membuang energi dan memperpendek usia komponen. Dipadukan dengan termostat mekanis Rittal (SK 3110) atau higrostat digital elektronik (SK 3118), pemanas hanya akan menyala saat suhu internal panel turun di bawah batas aman atau kelembaban relatif melampaui 65% RH. Pada pabrik modern, pengontrol ganda ini mengirimkan sinyal status alarm ke sistem SCADA dan pemantauan IoT fasilitas.</p>"}]}'::jsonb,
  '{"EN: Heating Output\nID: Kapasitas Pemanasan":"Continuous heating from 10 W to 800 W (PTC natural convection and fan-assisted heating)","EN: Heating Technology\nID: Teknologi Elemen Pemanas":"Self-regulating Positive Temperature Coefficient (PTC) ceramic heating elements in extruded aluminum heatsinks","EN: Relative Humidity Control\nID: Pengendalian Kelembaban Relatif":"Digital/mechanical hygrostats adjustable from 40% to 90% RH with dew-point tracking","EN: Temperature Control\nID: Pengendalian Suhu":"Bimetallic snap-action thermostats (NO/NC) and dual electronic thermostat-hygrostat combos (-20°C to +80°C)","EN: Mounting & Connection\nID: Pemasangan & Koneksi":"Snap-on mounting onto 35 mm DIN rails (EN 60715) with spring-loaded push-in wiring terminals","EN: Electrical Certifications\nID: Sertifikasi Elektrikal":"VDE, UL Listed, CE, EAC, RoHS compliant with touch-safe insulated plastic casing"}'::jsonb,
  '/uploads/products-rittal-heaters.jpg',
  'published',
  now(),
  15,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 033_add_rittal_automation_systems_types.up.sql
-- ==========================================

-- 033_add_rittal_automation_systems_types.up.sql
-- Add 3 specialized Rittal Automation Systems products from rittal.com:
-- 1. Rittal Perforex LC 3D Laser Machining Centers (Enclosure Modification)
-- 2. Rittal Wire Terminal WT Fully Automated Wire Processing & Harnessing System
-- 3. Rittal Copper Workstation CW 120 (Busbar Bending, Punching & Cutting)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/perforex-lc-laser-machining-centers
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000783',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'perforex-lc-laser-machining-centers',
  'rittal-distributor/perforex-lc-laser-machining-centers',
  E'EN: Rittal Perforex LC 3D Laser Machining Centers (Enclosure Modification)
ID: Mesin Modifikasi Laser 3D Rittal Perforex LC (Panel & Kubikal)',
  E'EN: State-of-the-art 3D laser machining centers engineered for fast, burr-free, non-contact cutting of flat parts and fully assembled cubic enclosures in stainless steel, sheet steel, and aluminum.
ID: Pusat permesinan laser 3D mutakhir untuk pemotongan cepat tanpa geram (burr-free) dan tanpa kontak pada panel lembaran maupun kubikal utuh berbahan stainless steel, baja, dan aluminium.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pusat Permesinan Laser 3D Generasi Terbaru untuk Pabrikasi Panel Listrik</h3>\n<p>Pembuatan lubang (cutout) dan pengeboran manual pada panel stainless steel dan kabinet las memerlukan waktu kerja lama, keausan mata bor/punching yang cepat, serta proses gerinda (deburring) dan pengecatan ulang yang memakan biaya. Rittal Perforex LC (Laser Center) merevolusi industri panel maker dengan memanfaatkan teknologi pemotongan laser fiber berpresisi tinggi dalam ruang 3D. Mesin ini mampu memproses kubikal utuh yang telah terakit maupun lembaran pintu dan mounting plate dalam satu kali proses clamping.</p>\n<h3>Pemotongan Tanpa Kontak, Bebas Deformasi & Tanpa Keausan Alat Potong</h3>\n<p>Berbeda dengan mesin milling atau punching konvensional, laser bekerja 100% tanpa kontak fisik dengan material. Hal ini menghilangkan gaya tekan penjepit yang dapat membengkokkan lembaran pelat tipis, mencegah keausan atau patahnya pahat potong pada material keras seperti stainless steel, serta meniadakan getaran mekanis. Sinar laser fiber menghasilkan celah potong mikrometrik yang sangat tajam dan presisi, menuntaskan lubang HMI, ventilasi, dan tombol tekan dalam hitungan detik.</p>\n<h3>Pemrosesan Stainless Steel Tanpa Perubahan Warna & Cat Bebas Mengelupas</h3>\n<p>Keunggulan utama Perforex LC terletak pada pemotongan dengan gas nitrogen bertekanan tinggi. Pada pemotongan stainless steel (AISI 304 / 316), tepi potongan tetap mengkilap, bersih dari jelaga (slag), dan tidak teroksidasi, sehingga ketahanan korosi alami baja nirkarat tetap terjaga tanpa memerlukan proses pasivasi kimia tambahan. Pada panel yang telah dilapisi cat bubuk (powder coating), zona terpengaruh panas (HAZ) yang sangat sempit menjamin cat tidak melepuh atau pecah.</p>\n<h3>Alur Kerja Digital Industry 4.0 Terintegrasi EPLAN Pro Panel</h3>\n<p>Sebagai pilar digital ekosistem Rittal dan EPLAN, Perforex LC dapat mengimpor data prototipe 3D langsung dari EPLAN Pro Panel tanpa memerlukan pemrograman manual CNC di lantai pabrik. Operator cukup memindai barcode atau QR code pada surat perintah kerja (SPK); mesin secara otomatis menghitung lintasan potong tercepat, memposisikan fixture pneumatik, dan mengeksekusi pengerjaan dengan akurasi pengulangan sub-milimeter.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Next-Generation 3D Laser Enclosure Machining for Switchgear Manufacturing</h3>\n<p>Manual cutouts and drilling of stainless steel panels and welded enclosures require significant labor, heavy tooling wear, and time-consuming manual deburring and touch-up painting. The Rittal Perforex LC (Laser Center) series revolutionizes panel building by utilizing high-precision fiber laser cutting in full 3D space. It machines completely welded cubic enclosures as well as flat mounting plates and doors in a single uninterrupted clamping setup.</p>\n<h3>Contactless, Distortion-Free Machining with Zero Tool Wear</h3>\n<p>Unlike conventional mechanical milling or punching machines, the laser operates completely contactless. This eliminates clamping forces that can distort thin-walled panels, avoids tool breakage or wear on tough stainless steel alloys, and prevents vibration damage to pre-mounted components. The fiber laser delivers narrow, micrometric kerfs with extreme edge sharpness, allowing intricate cutouts, circular holes, and thread pilot holes to be completed in seconds.</p>\n<h3>Stainless Steel Processing Without Tarnishing or Paint Flaking</h3>\n<p>A crucial advantage of the Perforex LC is its optimized assist-gas cutting technology. When cutting stainless steel (AISI 304 / 316) with nitrogen assist gas, cut edges remain bright and completely free of oxidation or discoloration, preserving the corrosion resistance of the material without requiring pickling or chemical passivation. On powder-coated panels, the narrow heat-affected zone prevents blistering or flaking of the protective finish.</p>\n<h3>Seamless End-to-End Industry 4.0 Digital Workflow</h3>\n<p>As part of the Rittal and EPLAN digital ecosystem, the Perforex LC imports 3D virtual prototype data directly from EPLAN Pro Panel without requiring manual CNC programming at the machine. Operators simply scan a QR code from the work order; the machine automatically calculates optimum travel paths, positions pneumatic clamping fixtures, and executes cutouts with sub-millimeter repeatable precision.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Next-Generation 3D Laser Enclosure Machining for Switchgear Manufacturing</h3>\n<p>Manual cutouts and drilling of stainless steel panels and welded enclosures require significant labor, heavy tooling wear, and time-consuming manual deburring and touch-up painting. The Rittal Perforex LC (Laser Center) series revolutionizes panel building by utilizing high-precision fiber laser cutting in full 3D space. It machines completely welded cubic enclosures as well as flat mounting plates and doors in a single uninterrupted clamping setup.</p>\n<h3>Contactless, Distortion-Free Machining with Zero Tool Wear</h3>\n<p>Unlike conventional mechanical milling or punching machines, the laser operates completely contactless. This eliminates clamping forces that can distort thin-walled panels, avoids tool breakage or wear on tough stainless steel alloys, and prevents vibration damage to pre-mounted components. The fiber laser delivers narrow, micrometric kerfs with extreme edge sharpness, allowing intricate cutouts, circular holes, and thread pilot holes to be completed in seconds.</p>\n<h3>Stainless Steel Processing Without Tarnishing or Paint Flaking</h3>\n<p>A crucial advantage of the Perforex LC is its optimized assist-gas cutting technology. When cutting stainless steel (AISI 304 / 316) with nitrogen assist gas, cut edges remain bright and completely free of oxidation or discoloration, preserving the corrosion resistance of the material without requiring pickling or chemical passivation. On powder-coated panels, the narrow heat-affected zone prevents blistering or flaking of the protective finish.</p>\n<h3>Seamless End-to-End Industry 4.0 Digital Workflow</h3>\n<p>As part of the Rittal and EPLAN digital ecosystem, the Perforex LC imports 3D virtual prototype data directly from EPLAN Pro Panel without requiring manual CNC programming at the machine. Operators simply scan a QR code from the work order; the machine automatically calculates optimum travel paths, positions pneumatic clamping fixtures, and executes cutouts with sub-millimeter repeatable precision.</p>\nID: <h3>Pusat Permesinan Laser 3D Generasi Terbaru untuk Pabrikasi Panel Listrik</h3>\n<p>Pembuatan lubang (cutout) dan pengeboran manual pada panel stainless steel dan kabinet las memerlukan waktu kerja lama, keausan mata bor/punching yang cepat, serta proses gerinda (deburring) dan pengecatan ulang yang memakan biaya. Rittal Perforex LC (Laser Center) merevolusi industri panel maker dengan memanfaatkan teknologi pemotongan laser fiber berpresisi tinggi dalam ruang 3D. Mesin ini mampu memproses kubikal utuh yang telah terakit maupun lembaran pintu dan mounting plate dalam satu kali proses clamping.</p>\n<h3>Pemotongan Tanpa Kontak, Bebas Deformasi & Tanpa Keausan Alat Potong</h3>\n<p>Berbeda dengan mesin milling atau punching konvensional, laser bekerja 100% tanpa kontak fisik dengan material. Hal ini menghilangkan gaya tekan penjepit yang dapat membengkokkan lembaran pelat tipis, mencegah keausan atau patahnya pahat potong pada material keras seperti stainless steel, serta meniadakan getaran mekanis. Sinar laser fiber menghasilkan celah potong mikrometrik yang sangat tajam dan presisi, menuntaskan lubang HMI, ventilasi, dan tombol tekan dalam hitungan detik.</p>\n<h3>Pemrosesan Stainless Steel Tanpa Perubahan Warna & Cat Bebas Mengelupas</h3>\n<p>Keunggulan utama Perforex LC terletak pada pemotongan dengan gas nitrogen bertekanan tinggi. Pada pemotongan stainless steel (AISI 304 / 316), tepi potongan tetap mengkilap, bersih dari jelaga (slag), dan tidak teroksidasi, sehingga ketahanan korosi alami baja nirkarat tetap terjaga tanpa memerlukan proses pasivasi kimia tambahan. Pada panel yang telah dilapisi cat bubuk (powder coating), zona terpengaruh panas (HAZ) yang sangat sempit menjamin cat tidak melepuh atau pecah.</p>\n<h3>Alur Kerja Digital Industry 4.0 Terintegrasi EPLAN Pro Panel</h3>\n<p>Sebagai pilar digital ekosistem Rittal dan EPLAN, Perforex LC dapat mengimpor data prototipe 3D langsung dari EPLAN Pro Panel tanpa memerlukan pemrograman manual CNC di lantai pabrik. Operator cukup memindai barcode atau QR code pada surat perintah kerja (SPK); mesin secara otomatis menghitung lintasan potong tercepat, memposisikan fixture pneumatik, dan mengeksekusi pengerjaan dengan akurasi pengulangan sub-milimeter.</p>"}]}'::jsonb,
  '{"EN: Machining Capability\nID: Kapabilitas Permesinan":"3D contactless cutting of cubic enclosures and flat parts (doors, side panels, mounting plates)","EN: Supported Materials\nID: Material yang Didukung":"Stainless steel (1.4301 / AISI 304, AISI 316), sheet steel, aluminum, powder-coated enclosures, and plastics","EN: Workpiece Dimensions (WxHxD)\nID: Dimensi Benda Kerja (PxTxL)":"Enclosures up to 1,270 x 2,250 x 800 mm; flat parts up to 2,800 x 1,250 mm","EN: Laser Source & Quality\nID: Sumber Laser & Kualitas":"Fiber laser up to 3 kW with automatic focus control and narrow cutting kerf (<0.2 mm)","EN: Surface Finish Quality\nID: Kualitas Permukaan Hasil Potong":"100% burr-free cut edges without paint flaking, thermal deformation, or tarnishing on stainless steel","EN: CAD/CAM & Software Integration\nID: Integrasi Perangkat Lunak & CAD/CAM":"Direct native import from EPLAN Pro Panel, RiPanel Processing, standard DXF and DWG formats"}'::jsonb,
  '/uploads/products-rittal-perforex-lc.jpg',
  'published',
  now(),
  16,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/wire-terminal-automated-wire-processing
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000784',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'wire-terminal-automated-wire-processing',
  'rittal-distributor/wire-terminal-automated-wire-processing',
  E'EN: Rittal Wire Terminal WT Fully Automated Wire Processing & Harnessing System
ID: Mesin Pemroses & Pengkabelan Otomatis Rittal Wire Terminal WT',
  E'EN: Compact fully automated wire assembly machine performing wire cutting to length, stripping, crimping, and individual inkjet printing up to 8x faster than manual assembly.
ID: Mesin perakitan kawat otomatis kompak yang melakukan pemotongan presisi, pengupasan isolasi, crimping ferrule, dan pencetakan inkjet hingga 8 kali lebih cepat dibanding metode manual.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Mempercepat Pengkabelan Panel Kontrol Hingga Delapan Kali Lipat</h3>\n<p>Pengkabelan (wiring) panel kontrol secara konvensional merupakan tahapan paling memakan waktu dan tenaga kerja dalam pabrikasi switchgear, menghabiskan lebih dari 40% total jam kerja perakitan. Rittal Wire Terminal WT mengotomatiskan seluruh rangkaian persiapan kabel: mengukur panjang kawat secara presisi, memotong, mengupas kedua ujung isolasi, melakukan crimping ferrule, serta mencetak penanda alfanumerik yang jelas—menghasilkan kawat siap pasang dengan sempurna.</p>\n<h3>Opsi Tooling Modular & Pilihan Rel Kawat yang Fleksibel</h3>\n<p>Wire Terminal WT dapat memproses penampang kabel dari 0,5 mm² hingga 6,0 mm² tanpa perlu pergantian alat mekanis secara manual. Dilengkapi dengan unit dispenser kawat yang menampung hingga 36 gulungan spul atau drum dengan warna dan penampang berbeda, mesin ini secara otomatis beralih antar jenis kawat sesuai instruksi pengkabelan digital.</p>\n<h3>Pencetakan Label Inkjet Resolusi Tinggi Terintegrasi</h3>\n<p>Tinggalkan ferrule tag selongsong lepas dan proses pemasangan label heat-shrink manual yang melelahkan. Wire Terminal WT mengintegrasikan print head inkjet dua warna beresolusi tinggi (tinta putih dan hitam) yang mencetak nomor kawat, terminal asal, dan terminal tujuan langsung di atas jaket isolasi kawat. Tinta mengering seketika, tahan gesekan, serta tahan minyak pelumas industri.</p>\n<h3>Integrasi Mulus dengan EPLAN Smart Wiring</h3>\n<p>Kabel-kabel yang telah selesai diproduksi dialirkan ke dalam rak susun lift penyortir (13-track rail lift) berdasarkan urutan pemasangan di dalam kabinet atau dikelompokkan per blok komponen tujuan. Dipadukan dengan perangkat lunak EPLAN Smart Wiring, teknisi perakit di lantai produksi mendapatkan panduan visual interaktif langkah-demi-langkah melalui tablet digital, memastikan zero error wiring dan efisiensi pabrikasi optimal.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Accelerating Control Panel Enclosure Wiring by Up to Eight Times</h3>\n<p>Wiring control panels is traditionally the most labor-intensive bottleneck in electrical switchgear fabrication, accounting for over 40% of total assembly hours. The Rittal Wire Terminal WT automates the entire wire preparation sequence: measuring exact wire lengths, cutting, stripping both insulation ends, crimping wire ferrules, and printing clear alphanumeric markings—producing fully finished wires ready for direct installation.</p>\n<h3>Modular Tooling and Flexible Wire Magazine Options</h3>\n<p>The Wire Terminal WT accommodates wire cross-sections from 0.5 mm² to 6.0 mm² without mechanical retooling. Equipped with versatile wire magazines holding up to 36 spools or barrels of different wire colors and cross-sections, the machine automatically switches between conductor types on the fly according to digital wiring instructions.</p>\n<h3>Integrated High-Resolution Inkjet Wire Marking</h3>\n<p>Eliminate loose sleeve tags and tedious manual heat-shrink labeling. The Wire Terminal WT integrates two-color high-resolution inkjet print heads (white and black ink) that print wire numbers, connection endpoints, and terminal block addresses directly onto the conductor insulation. The ink cures instantly and is completely smudge-resistant and oil-resistant.</p>\n<h3>Seamless Integration with EPLAN Smart Wiring</h3>\n<p>Finished wires are deposited into 13-track sorting lift magazines according to their installation sequence in the panel or grouped by device destination. Combined with EPLAN Smart Wiring software, panel builders on the shop floor receive digital step-by-step visual guidance on mobile tablets, ensuring zero wiring errors, effortless wire routing, and maximum production velocity.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Accelerating Control Panel Enclosure Wiring by Up to Eight Times</h3>\n<p>Wiring control panels is traditionally the most labor-intensive bottleneck in electrical switchgear fabrication, accounting for over 40% of total assembly hours. The Rittal Wire Terminal WT automates the entire wire preparation sequence: measuring exact wire lengths, cutting, stripping both insulation ends, crimping wire ferrules, and printing clear alphanumeric markings—producing fully finished wires ready for direct installation.</p>\n<h3>Modular Tooling and Flexible Wire Magazine Options</h3>\n<p>The Wire Terminal WT accommodates wire cross-sections from 0.5 mm² to 6.0 mm² without mechanical retooling. Equipped with versatile wire magazines holding up to 36 spools or barrels of different wire colors and cross-sections, the machine automatically switches between conductor types on the fly according to digital wiring instructions.</p>\n<h3>Integrated High-Resolution Inkjet Wire Marking</h3>\n<p>Eliminate loose sleeve tags and tedious manual heat-shrink labeling. The Wire Terminal WT integrates two-color high-resolution inkjet print heads (white and black ink) that print wire numbers, connection endpoints, and terminal block addresses directly onto the conductor insulation. The ink cures instantly and is completely smudge-resistant and oil-resistant.</p>\n<h3>Seamless Integration with EPLAN Smart Wiring</h3>\n<p>Finished wires are deposited into 13-track sorting lift magazines according to their installation sequence in the panel or grouped by device destination. Combined with EPLAN Smart Wiring software, panel builders on the shop floor receive digital step-by-step visual guidance on mobile tablets, ensuring zero wiring errors, effortless wire routing, and maximum production velocity.</p>\nID: <h3>Mempercepat Pengkabelan Panel Kontrol Hingga Delapan Kali Lipat</h3>\n<p>Pengkabelan (wiring) panel kontrol secara konvensional merupakan tahapan paling memakan waktu dan tenaga kerja dalam pabrikasi switchgear, menghabiskan lebih dari 40% total jam kerja perakitan. Rittal Wire Terminal WT mengotomatiskan seluruh rangkaian persiapan kabel: mengukur panjang kawat secara presisi, memotong, mengupas kedua ujung isolasi, melakukan crimping ferrule, serta mencetak penanda alfanumerik yang jelas—menghasilkan kawat siap pasang dengan sempurna.</p>\n<h3>Opsi Tooling Modular & Pilihan Rel Kawat yang Fleksibel</h3>\n<p>Wire Terminal WT dapat memproses penampang kabel dari 0,5 mm² hingga 6,0 mm² tanpa perlu pergantian alat mekanis secara manual. Dilengkapi dengan unit dispenser kawat yang menampung hingga 36 gulungan spul atau drum dengan warna dan penampang berbeda, mesin ini secara otomatis beralih antar jenis kawat sesuai instruksi pengkabelan digital.</p>\n<h3>Pencetakan Label Inkjet Resolusi Tinggi Terintegrasi</h3>\n<p>Tinggalkan ferrule tag selongsong lepas dan proses pemasangan label heat-shrink manual yang melelahkan. Wire Terminal WT mengintegrasikan print head inkjet dua warna beresolusi tinggi (tinta putih dan hitam) yang mencetak nomor kawat, terminal asal, dan terminal tujuan langsung di atas jaket isolasi kawat. Tinta mengering seketika, tahan gesekan, serta tahan minyak pelumas industri.</p>\n<h3>Integrasi Mulus dengan EPLAN Smart Wiring</h3>\n<p>Kabel-kabel yang telah selesai diproduksi dialirkan ke dalam rak susun lift penyortir (13-track rail lift) berdasarkan urutan pemasangan di dalam kabinet atau dikelompokkan per blok komponen tujuan. Dipadukan dengan perangkat lunak EPLAN Smart Wiring, teknisi perakit di lantai produksi mendapatkan panduan visual interaktif langkah-demi-langkah melalui tablet digital, memastikan zero error wiring dan efisiensi pabrikasi optimal.</p>"}]}'::jsonb,
  '{"EN: Processing Capability\nID: Kapabilitas Pemrosesan":"Automated wire feeding, cutting to length, stripping, ultrasonic/ferrule crimping, and dual inkjet printing","EN: Wire Cross-Sections\nID: Penampang Kawat yang Didukung":"0.5 mm² to 6.0 mm² (AWG 20 to AWG 10) single-core flexible conductors","EN: Wire Processing Speed\nID: Kecepatan Pemrosesan Kawat":"Up to 8x faster than manual wiring; produces up to 36 different wire types sequentially","EN: Wire Sorting & Storage\nID: Sistem Penyortiran & Rak Penampung":"13-track rail lift storage magazines sorting finished wires by order, destination, or wiring sequence","EN: Identification & Marking\nID: Identifikasi & Penandaan":"White and black thermo-inkjet wire printing on insulation with source/target and terminal designation","EN: Software & CAE Integration\nID: Integrasi Perangkat Lunak & CAE":"Direct digital connectivity with EPLAN Smart Wiring, EPLAN Pro Panel, and CSV/XML wire lists"}'::jsonb,
  '/uploads/products-rittal-wire-terminal.jpg',
  'published',
  now(),
  17,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/copper-workstation-busbar-machining
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000785',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'copper-workstation-busbar-machining',
  'rittal-distributor/copper-workstation-busbar-machining',
  E'EN: Rittal Copper Workstation CW 120 (Busbar Bending, Punching & Cutting)
ID: Meja Kerja Pemrosesan Busbar Tembaga Rittal Copper Workstation CW 120',
  E'EN: Ergonomic, electro-hydraulic mobile workstation for precision bending, punching, and cutting of solid copper and aluminum busbars up to 120 x 12 mm.
ID: Meja kerja elektro-hidrolik ergonomis dan mobile untuk pembengkokan presisi, pelubangan hidrolik, dan pemotongan busbar tembaga serta aluminium padat hingga ukuran 120 x 12 mm.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Fabrikasi Busbar Tembaga Profesional untuk Panel Distribusi Tenaga Listrik</h3>\n<p>Pabrikasi busbar tembaga khusus untuk switchboard tegangan rendah dan panel distribusi daya menuntut gaya hidrolik besar, presisi dimensi tanpa kompromi, serta keselamatan operator yang terjamin. Rittal Copper Workstation CW 120 mengintegrasikan fungsi pemotongan, pelubangan bulat/oval hidrolik, dan pembengkokan presisi dalam satu workstation mobile industri kompak yang dirancang khusus bagi perakit panel listrik profesional.</p>\n<h3>Tiga Fungsi Sekaligus: Potong, Punching & Tekuk dalam Satu Meja Kerja</h3>\n<p>Hilangkan pemborosan waktu dan ruang akibat memindahkan batang tembaga berat di antara mesin-mesin terpisah. CW 120 memiliki tiga stasiun kerja yang ditenagai oleh unit daya elektro-hidrolik bertekanan tinggi 700 bar. Operator dapat memotong batang tembaga padat dengan hasil bersih tanpa serpihan gram berbahaya, melubangi lubang baut bulat atau lonjong, serta menekuk busbar hingga lebar 120 mm dan ketebalan 12 mm.</p>\n<h3>Pengukuran Sudut Digital Presisi & Kompensasi Springback Otomatis</h3>\n<p>Mendapatkan sudut tekukan yang akurat pada busbar tembaga tebal sering terkendala oleh elastisitas kelenturan material (springback). Stasiun tekuk CW 120 dilengkapi sensor sudut elektronik digital. Operator cukup memasukkan target sudut pada layar digital; sistem kontrol hidrolik secara otomatis mengimbangi efek pegas material sehingga setiap tekukan berulang memiliki sudut yang persis identik tanpa coba-coba manual.</p>\n<h3>Penunjuk Laser Optik Presisi & Ergonomi Kerja Tingkat Tinggi</h3>\n<p>Untuk memastikan lubang baut sejajar sempurna dengan terminal komponen pemutus sirkuit, stasiun pelubangan dilengkapi proyektor laser garis silang presisi tinggi. Meja rol penyangga samping yang dapat dipanjangkan menopang batang busbar panjang dengan aman dan ergonomis, sementara laci penampung terintegrasi mengumpulkan limbah slug punch tembaga secara rapi dan bersih.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Professional Solid Copper Busbar Fabrication for Power Distribution Enclosures</h3>\n<p>Fabricating custom copper busbar systems for low-voltage switchboards and power distribution panels requires tremendous hydraulic force, uncompromising dimensional accuracy, and strict operator safety. The Rittal Copper Workstation CW 120 combines cutting, round/slotted hole punching, and precision bending into a compact, mobile industrial workstation designed specifically for panel builders and switchgear manufacturers.</p>\n<h3>Triple Functionality: Cutting, Punching, and Bending in One Station</h3>\n<p>Eliminate clutter and time wasted moving heavy copper stock between separate stationary machines. The CW 120 features three dedicated machining stations powered by a high-pressure 700-bar electro-hydraulic power pack. Operators can cut solid copper bars cleanly without chips or waste, punch clean round or oblong bolt holes, and bend sharp 90-degree offsets on bars up to 120 mm wide and 12 mm thick.</p>\n<h3>Digital Precision Angle Measurement and Springback Compensation</h3>\n<p>Achieving exact angles in heavy copper bars is challenging due to varying material temper and elasticity. The CW 120 bending station incorporates a digital electronic angle sensor. Once the target angle is entered on the digital display, the machine compensates for natural material springback automatically, guaranteeing identical, repeatable bends on batch production runs without manual guesswork.</p>\n<h3>Integrated Optical Laser Centering and Safe Ergonomics</h3>\n<p>To ensure perfect hole alignment with switchgear connection terminals, the punching station is equipped with a high-visibility optical line laser that projects crosshairs precisely onto the punching center mark. Extendable lateral roller conveyors support long, heavy busbars with minimal operator strain, while integrated pull-out drawers capture metal punch slugs and offcuts cleanly.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Professional Solid Copper Busbar Fabrication for Power Distribution Enclosures</h3>\n<p>Fabricating custom copper busbar systems for low-voltage switchboards and power distribution panels requires tremendous hydraulic force, uncompromising dimensional accuracy, and strict operator safety. The Rittal Copper Workstation CW 120 combines cutting, round/slotted hole punching, and precision bending into a compact, mobile industrial workstation designed specifically for panel builders and switchgear manufacturers.</p>\n<h3>Triple Functionality: Cutting, Punching, and Bending in One Station</h3>\n<p>Eliminate clutter and time wasted moving heavy copper stock between separate stationary machines. The CW 120 features three dedicated machining stations powered by a high-pressure 700-bar electro-hydraulic power pack. Operators can cut solid copper bars cleanly without chips or waste, punch clean round or oblong bolt holes, and bend sharp 90-degree offsets on bars up to 120 mm wide and 12 mm thick.</p>\n<h3>Digital Precision Angle Measurement and Springback Compensation</h3>\n<p>Achieving exact angles in heavy copper bars is challenging due to varying material temper and elasticity. The CW 120 bending station incorporates a digital electronic angle sensor. Once the target angle is entered on the digital display, the machine compensates for natural material springback automatically, guaranteeing identical, repeatable bends on batch production runs without manual guesswork.</p>\n<h3>Integrated Optical Laser Centering and Safe Ergonomics</h3>\n<p>To ensure perfect hole alignment with switchgear connection terminals, the punching station is equipped with a high-visibility optical line laser that projects crosshairs precisely onto the punching center mark. Extendable lateral roller conveyors support long, heavy busbars with minimal operator strain, while integrated pull-out drawers capture metal punch slugs and offcuts cleanly.</p>\nID: <h3>Fabrikasi Busbar Tembaga Profesional untuk Panel Distribusi Tenaga Listrik</h3>\n<p>Pabrikasi busbar tembaga khusus untuk switchboard tegangan rendah dan panel distribusi daya menuntut gaya hidrolik besar, presisi dimensi tanpa kompromi, serta keselamatan operator yang terjamin. Rittal Copper Workstation CW 120 mengintegrasikan fungsi pemotongan, pelubangan bulat/oval hidrolik, dan pembengkokan presisi dalam satu workstation mobile industri kompak yang dirancang khusus bagi perakit panel listrik profesional.</p>\n<h3>Tiga Fungsi Sekaligus: Potong, Punching & Tekuk dalam Satu Meja Kerja</h3>\n<p>Hilangkan pemborosan waktu dan ruang akibat memindahkan batang tembaga berat di antara mesin-mesin terpisah. CW 120 memiliki tiga stasiun kerja yang ditenagai oleh unit daya elektro-hidrolik bertekanan tinggi 700 bar. Operator dapat memotong batang tembaga padat dengan hasil bersih tanpa serpihan gram berbahaya, melubangi lubang baut bulat atau lonjong, serta menekuk busbar hingga lebar 120 mm dan ketebalan 12 mm.</p>\n<h3>Pengukuran Sudut Digital Presisi & Kompensasi Springback Otomatis</h3>\n<p>Mendapatkan sudut tekukan yang akurat pada busbar tembaga tebal sering terkendala oleh elastisitas kelenturan material (springback). Stasiun tekuk CW 120 dilengkapi sensor sudut elektronik digital. Operator cukup memasukkan target sudut pada layar digital; sistem kontrol hidrolik secara otomatis mengimbangi efek pegas material sehingga setiap tekukan berulang memiliki sudut yang persis identik tanpa coba-coba manual.</p>\n<h3>Penunjuk Laser Optik Presisi & Ergonomi Kerja Tingkat Tinggi</h3>\n<p>Untuk memastikan lubang baut sejajar sempurna dengan terminal komponen pemutus sirkuit, stasiun pelubangan dilengkapi proyektor laser garis silang presisi tinggi. Meja rol penyangga samping yang dapat dipanjangkan menopang batang busbar panjang dengan aman dan ergonomis, sementara laci penampung terintegrasi mengumpulkan limbah slug punch tembaga secara rapi dan bersih.</p>"}]}'::jsonb,
  '{"EN: Machining Operations\nID: Operasi Permesinan":"Precision cutting, hydraulic hole punching, and angle bending on a single ergonomic station","EN: Max. Busbar Dimensions\nID: Dimensi Maksimum Busbar":"Up to 120 mm width and 12 mm thickness (copper Cu and aluminum Al busbars)","EN: Punching Capabilities\nID: Kapabilitas Pelubangan (Punching)":"Round punches Ø 6.6 mm to Ø 21.5 mm, slotted hole punches up to 21 x 18 mm with laser centering pointer","EN: Bending Accuracy & Features\nID: Akurasi & Fitur Pembengkokan":"Bending angle 0° to 90° with digital electronic angle measurement and automatic springback compensation","EN: Hydraulic Drive System\nID: Sistem Penggerak Hidrolik":"Integrated 230 V / 400 V electro-hydraulic power pack generating up to 700 bar operating pressure","EN: Mobility & Ergonomics\nID: Mobilitas & Ergonomi":"Heavy-duty industrial casters with swivel brakes, pull-out side roller supports, and built-in waste collection drawers"}'::jsonb,
  '/uploads/products-rittal-copper-workstation.jpg',
  'published',
  now(),
  18,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 034_add_rittal_it_infrastructure_types.up.sql
-- ==========================================

-- 034_add_rittal_it_infrastructure_types.up.sql
-- Add 3 specialized Rittal IT Infrastructure products from rittal.com:
-- 1. Rittal TX CableNet Network Racks (Waterfall Cable Management)
-- 2. Rittal Intelligent IT PDU (Metered, Switched & Managed Power Distribution)
-- 3. Rittal Liquid Cooling Packages (LCP CW & DX High-Density IT Cooling)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/tx-cablenet-network-racks
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000786',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'tx-cablenet-network-racks',
  'rittal-distributor/tx-cablenet-network-racks',
  E'EN: Rittal TX CableNet Network Racks (Waterfall Cable Management)
ID: Rak Jaringan & Server Rittal TX CableNet (Manajemen Kabel Waterfall)',
  E'EN: Purpose-built IT network and server rack with patented ''waterfall'' roof cable routing, safeguarding fiber-optic and copper bending radii with rapid tool-free interior installation.
ID: Rak jaringan dan server IT dengan konsep perutean kabel atap ''waterfall'' berpaten, menjaga radius lekukan kabel fiber optik dan tembaga dengan instalasi interior cepat tanpa perkakas.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Infrastruktur Jaringan Tingkat Tinggi dengan Manajemen Kabel ''Waterfall'' Berpaten</h3>\n<p>Pengelolaan kabel tembaga dan serat optik berdensitas tinggi di pusat data dan ruang telekomunikasi merupakan salah satu tantangan paling kritis dalam operasional jaringan modern. Tekukan tajam atau tarikan kabel yang berlebih melanggar batas minimum bending radius kabel Cat 6A/7 dan fiber optik, memicu pelemahan sinyal (attenuation) serta packet loss. Rittal TX CableNet mengatasi masalah ini melalui konsep atap inovatif: profil lengkung plastik ''waterfall'' memandu kabel masuk dari atas kabinet ke dalam rak secara mulus, menjaga radius kelengkungan alami kabel secara otomatis tanpa perlu penataan manual yang rumit.</p>\n<h3>Pemasangan Cepat dengan Sistem Snap-In Tanpa Perkakas</h3>\n<p>Kecepatan implementasi sangat krusial dalam pembangunan jaringan enterprise. TX CableNet dikirim dalam kondisi siap rakit dan dirancang untuk commissioning instan. Rel dudukan 19\" (482,6 mm) dapat digeser kedalamannya secara fleksibel dan dilengkapi penanda unit U yang jelas. Pengunci pelepas cepat (quick-release fasteners) memungkinkan panel samping, pintu, dan pengatur kabel dilepas maupun dipasang kembali dalam hitungan detik tanpa obeng atau perkakas khusus.</p>\n<h3>Aliran Udara Optimal untuk Switch Aktif & Patch Panel Densitas Tinggi</h3>\n<p>Tersedia dengan opsi pintu kaca tempered berpemandangan jernih untuk ruang server kantor yang senyap, atau pintu pelat baja berlubang (perforasi 78%) untuk sakelar jaringan (switches) dan patch panel berdensitas tinggi. Konfigurasi pintu berlubang memaksimalkan ventilasi konveksi udara bebas, mendinginkan router core dan perangkat storage SAN tanpa terbentuknya kantong panas (hot spots).</p>\n<h3>Kompatibilitas Penuh dengan Smart PDU Rittal & Sensor CMC III</h3>\n<p>TX CableNet terintegrasi sempurna dengan ekosistem perangkat IT Rittal lainnya. Smart PDU Rittal dapat dipasang langsung pada ruang ''Zero-U'' di sepanjang tiang vertikal rak, membebaskan seluruh ruang 19\" horizontal untuk peralatan server dan switch. Sensor pemantau lingkungan CMC III, nampan kabel, dan strip sikat debu terkunci rapat pada lubang sistem bawaan pabrik tanpa perlu pengeboran tambahan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Next-Level Network Infrastructure with Patented ''Waterfall'' Cable Management</h3>\n<p>Managing high-density copper and fiber-optic cabling in data centers and telecom rooms is one of the most critical challenges in modern network engineering. Kinking, excessive tension, or sharp bends violate the minimum bending radius of Cat 6A/7 cables and multi-strand optical fibers, degrading transmission signal bandwidth and causing packet loss. The Rittal TX CableNet solves this with an innovative roof concept: curved plastic ''waterfall'' profiles direct incoming cables from above into the rack interior smoothly, preserving the required bending radius automatically without requiring manual dressing.</p>\n<h3>Fast-Track Deployment with Zero-Tool Snap-In Interior Installation</h3>\n<p>Time is of the essence when deploying enterprise networks. The TX CableNet is delivered pre-assembled and engineered for rapid out-of-the-box commissioning. The 19\" (482.6 mm) mounting angles are continuously adjustable in depth and feature standard U-height markings. Quick-release fasteners allow side panels, doors, and cable fingers to be removed and repositioned in seconds without requiring screwdrivers or specialized tools.</p>\n<h3>Optimized Airflow for Active Switches & Dense Patch Panels</h3>\n<p>Available with either a modern glazed safety glass front door for low-noise office closets or a 78% perforated vented steel door for high-density network switches and patch panels. The vented door configuration maximizes natural convection and fan-assisted airflow, eliminating localized hot spots around high-throughput core routers and enterprise SAN directors.</p>\n<h3>Full Compatibility with Rittal PDU, CMC III & System Accessories</h3>\n<p>The TX CableNet integrates seamlessly into the complete Rittal IT ecosystem. Intelligent Rittal PDUs mount directly in the zero-U space along the vertical frame, leaving all 19\" horizontal rack units available for IT servers and switches. CMC III environmental sensors, cable trays, and brush strips snap into pre-punched system punchings without requiring field drilling.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Next-Level Network Infrastructure with Patented ''Waterfall'' Cable Management</h3>\n<p>Managing high-density copper and fiber-optic cabling in data centers and telecom rooms is one of the most critical challenges in modern network engineering. Kinking, excessive tension, or sharp bends violate the minimum bending radius of Cat 6A/7 cables and multi-strand optical fibers, degrading transmission signal bandwidth and causing packet loss. The Rittal TX CableNet solves this with an innovative roof concept: curved plastic ''waterfall'' profiles direct incoming cables from above into the rack interior smoothly, preserving the required bending radius automatically without requiring manual dressing.</p>\n<h3>Fast-Track Deployment with Zero-Tool Snap-In Interior Installation</h3>\n<p>Time is of the essence when deploying enterprise networks. The TX CableNet is delivered pre-assembled and engineered for rapid out-of-the-box commissioning. The 19\" (482.6 mm) mounting angles are continuously adjustable in depth and feature standard U-height markings. Quick-release fasteners allow side panels, doors, and cable fingers to be removed and repositioned in seconds without requiring screwdrivers or specialized tools.</p>\n<h3>Optimized Airflow for Active Switches & Dense Patch Panels</h3>\n<p>Available with either a modern glazed safety glass front door for low-noise office closets or a 78% perforated vented steel door for high-density network switches and patch panels. The vented door configuration maximizes natural convection and fan-assisted airflow, eliminating localized hot spots around high-throughput core routers and enterprise SAN directors.</p>\n<h3>Full Compatibility with Rittal PDU, CMC III & System Accessories</h3>\n<p>The TX CableNet integrates seamlessly into the complete Rittal IT ecosystem. Intelligent Rittal PDUs mount directly in the zero-U space along the vertical frame, leaving all 19\" horizontal rack units available for IT servers and switches. CMC III environmental sensors, cable trays, and brush strips snap into pre-punched system punchings without requiring field drilling.</p>\nID: <h3>Infrastruktur Jaringan Tingkat Tinggi dengan Manajemen Kabel ''Waterfall'' Berpaten</h3>\n<p>Pengelolaan kabel tembaga dan serat optik berdensitas tinggi di pusat data dan ruang telekomunikasi merupakan salah satu tantangan paling kritis dalam operasional jaringan modern. Tekukan tajam atau tarikan kabel yang berlebih melanggar batas minimum bending radius kabel Cat 6A/7 dan fiber optik, memicu pelemahan sinyal (attenuation) serta packet loss. Rittal TX CableNet mengatasi masalah ini melalui konsep atap inovatif: profil lengkung plastik ''waterfall'' memandu kabel masuk dari atas kabinet ke dalam rak secara mulus, menjaga radius kelengkungan alami kabel secara otomatis tanpa perlu penataan manual yang rumit.</p>\n<h3>Pemasangan Cepat dengan Sistem Snap-In Tanpa Perkakas</h3>\n<p>Kecepatan implementasi sangat krusial dalam pembangunan jaringan enterprise. TX CableNet dikirim dalam kondisi siap rakit dan dirancang untuk commissioning instan. Rel dudukan 19\" (482,6 mm) dapat digeser kedalamannya secara fleksibel dan dilengkapi penanda unit U yang jelas. Pengunci pelepas cepat (quick-release fasteners) memungkinkan panel samping, pintu, dan pengatur kabel dilepas maupun dipasang kembali dalam hitungan detik tanpa obeng atau perkakas khusus.</p>\n<h3>Aliran Udara Optimal untuk Switch Aktif & Patch Panel Densitas Tinggi</h3>\n<p>Tersedia dengan opsi pintu kaca tempered berpemandangan jernih untuk ruang server kantor yang senyap, atau pintu pelat baja berlubang (perforasi 78%) untuk sakelar jaringan (switches) dan patch panel berdensitas tinggi. Konfigurasi pintu berlubang memaksimalkan ventilasi konveksi udara bebas, mendinginkan router core dan perangkat storage SAN tanpa terbentuknya kantong panas (hot spots).</p>\n<h3>Kompatibilitas Penuh dengan Smart PDU Rittal & Sensor CMC III</h3>\n<p>TX CableNet terintegrasi sempurna dengan ekosistem perangkat IT Rittal lainnya. Smart PDU Rittal dapat dipasang langsung pada ruang ''Zero-U'' di sepanjang tiang vertikal rak, membebaskan seluruh ruang 19\" horizontal untuk peralatan server dan switch. Sensor pemantau lingkungan CMC III, nampan kabel, dan strip sikat debu terkunci rapat pada lubang sistem bawaan pabrik tanpa perlu pengeboran tambahan.</p>"}]}'::jsonb,
  '{"EN: System Architecture\nID: Arsitektur Sistem":"Welded torsion-free steel frame with dynamic ''waterfall'' cable routing over the roof plate","EN: Load Capacity\nID: Kapasitas Beban":"Static load capacity up to 15,000 N (1,500 kg); dynamic load up to 10,000 N","EN: Dimensions & Form Factors\nID: Dimensi & Pilihan Ukuran":"Heights: 24U, 42U, 47U | Widths: 600 mm & 800 mm | Depths: 800 mm & 1,000 mm","EN: Door Configurations\nID: Konfigurasi Pintu":"Glazed front door with 3 mm toughened safety glass or 78% vented perforated sheet steel door for airflow","EN: Cable Routing Concept\nID: Konsep Manajemen Kabel":"Moulded plastic waterfall arches ensure compliance with minimum cable bending radius (copper & fiber)","EN: Standards & Protection\nID: Standar & Kategori Proteksi":"IP20 to IEC 60529, EIA-310-E, DIN EN 61587-1, RoHs and UL 2416 compliant"}'::jsonb,
  '/uploads/products-rittal-tx-cablenet.jpg',
  'published',
  now(),
  19,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/intelligent-it-pdu-power-distribution
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000787',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'intelligent-it-pdu-power-distribution',
  'rittal-distributor/intelligent-it-pdu-power-distribution',
  E'EN: Rittal Intelligent IT PDU (Metered, Switched & Managed Power Distribution)
ID: Unit Distribusi Daya Cerdas Rittal IT PDU (Metered, Switched & Managed)',
  E'EN: Intelligent zero-U rack power distribution units featuring billing-grade energy metering (EN 62053-21 Class 1), individual outlet remote switching, integrated Type B RCM, and CMC III IoT sensors.
ID: Unit distribusi daya cerdas untuk rak server zero-U dengan pengukuran energi kelas billing (EN 62053-21 Kelas 1), remote switching per-outlet, proteksi RCM Tipe B, dan konektivitas IoT CMC III.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Manajemen Daya Cerdas untuk Kabinet Server & Pusat Data Misi Kritis</h3>\n<p>Pada fasilitas cloud modern, ruang server enterprise, dan titik komputasi edge, penyaluran listrik biasa sudah tidak lagi mencukupi. Operator membutuhkan visibilitas mendalam atas konsumsi daya per rak, kemampuan kendali jarak jauh untuk me-reboot server yang hang, serta peringatan dini otomatis sebelum beban lebih memicu pemadaman tak terduga. Rittal Intelligent PDU menghadirkan distribusi daya andal dalam lima varian fungsional: Basic, Metered, Metered Plus, Switched, dan Managed.</p>\n<h3>Pemasangan Zero-U Tanpa Perkakas pada Rak VX IT & TX CableNet</h3>\n<p>Ruang rak server sangat berharga. Rittal PDU dirancang dengan profil aluminium ekstrusi ramping khusus untuk pemasangan klip snap-in tanpa perkakas di ruang ''Zero-U'' (antara tiang rel 19\" dan dinding samping kabinet). Hal ini membuat seluruh unit 42U atau 47U tetap bebas sepenuhnya untuk server, storage SAN, dan sakelar jaringan, sekaligus memudahkan akses penataan kabel daya tanpa menghalangi aliran udara dingin.</p>\n<h3>Soket Pengunci Paten IEC Lock & Pengukuran Energi Berstandar Billing</h3>\n<p>Kabel power yang terlepas secara tidak sengaja saat teknisi melakukan perawatan rutin adalah penyebab umum server down. Rittal PDU mengintegrasikan mekanisme pengunci universal berpaten untuk colokan standar IEC C13 dan C19—mengunci kabel daya secara mekanis tanpa memerlukan kabel khusus berharga mahal. Untuk fasilitas colocation dan penagihan biaya listrik per departemen, tipe Metered Plus dan Managed dilengkapi pengukuran energi akurasi tinggi Kelas 1 (±1%) sesuai standar EN 62053-21 (kWh, kW, tegangan, arus, power factor, dan THD).</p>\n<h3>Proteksi Arus Sisa RCM Tipe B & Konektivitas Sensor Lingkungan</h3>\n<p>Menghilangkan kebutuhan relay kebocoran arus eksternal yang memakan biaya, Rittal PDU mengintegrasikan Residual Current Monitoring (RCM Tipe B) sensitif AC/DC yang mampu mendeteksi arus bocor DC halus dari power supply switching server. Selain itu, setiap PDU dilengkapi port CAN-bus yang dapat langsung dihubungkan ke delapan sensor pintar CMC III (suhu, kelembaban, kebocoran air, dan kontrol kunci pintu elektronik), menjadikan PDU sebagai gateway pemantau fisik rak terpadu.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Intelligent Power Management for Mission-Critical Data Center Enclosures</h3>\n<p>In modern cloud facilities, enterprise server rooms, and edge computing nodes, raw power delivery is no longer sufficient. Operators require granular visibility into rack energy consumption, remote control capabilities to reboot locked servers, and automated alerts before circuit overloads cause unplanned outages. The Rittal Intelligent PDU portfolio provides scalable, high-reliability power distribution across five functional variants: Basic, Metered, Metered Plus, Switched, and Managed.</p>\n<h3>Tool-Free Zero-U Mounting in Rittal VX IT and TX CableNet Racks</h3>\n<p>Rack space is valuable. Rittal PDUs feature a slender extruded aluminum profile engineered specifically for tool-free, clip-in mounting into the zero-U space between the 19\" rail and the side panel of Rittal enclosures. This leaves all 42U or 47U rack units completely free for servers, storage arrays, and network switches, while providing immediate, unhindered access to individual power cords.</p>\n<h3>Patented IEC Lock Sockets & Billing-Grade Energy Measurement</h3>\n<p>Accidental cord disconnection during routine maintenance is a primary cause of downtime. Rittal PDUs integrate a patented universal locking mechanism for standard IEC C13 and C19 plugs—locking cables securely without requiring proprietary cords. For colocation and internal chargebacks, Metered Plus and Managed models feature Class 1 (±1%) billing-grade revenue metering per outlet according to EN 62053-21, measuring voltage, current, active/apparent power, power factor, and harmonic distortion.</p>\n<h3>Integrated Type B RCM and Advanced Environmental Sensor Integration</h3>\n<p>To eliminate costly external earth leakage relays, Rittal PDUs integrate an AC/DC sensitive Residual Current Monitor (RCM Type B) that detects smooth DC leakage currents often generated by server power supplies. Furthermore, each PDU incorporates a dedicated CAN-bus port that directly connects up to eight CMC III plug-and-play sensors (temperature, humidity, water leak, and electronic door locks), transforming the PDU into a centralized rack management gateway.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Intelligent Power Management for Mission-Critical Data Center Enclosures</h3>\n<p>In modern cloud facilities, enterprise server rooms, and edge computing nodes, raw power delivery is no longer sufficient. Operators require granular visibility into rack energy consumption, remote control capabilities to reboot locked servers, and automated alerts before circuit overloads cause unplanned outages. The Rittal Intelligent PDU portfolio provides scalable, high-reliability power distribution across five functional variants: Basic, Metered, Metered Plus, Switched, and Managed.</p>\n<h3>Tool-Free Zero-U Mounting in Rittal VX IT and TX CableNet Racks</h3>\n<p>Rack space is valuable. Rittal PDUs feature a slender extruded aluminum profile engineered specifically for tool-free, clip-in mounting into the zero-U space between the 19\" rail and the side panel of Rittal enclosures. This leaves all 42U or 47U rack units completely free for servers, storage arrays, and network switches, while providing immediate, unhindered access to individual power cords.</p>\n<h3>Patented IEC Lock Sockets & Billing-Grade Energy Measurement</h3>\n<p>Accidental cord disconnection during routine maintenance is a primary cause of downtime. Rittal PDUs integrate a patented universal locking mechanism for standard IEC C13 and C19 plugs—locking cables securely without requiring proprietary cords. For colocation and internal chargebacks, Metered Plus and Managed models feature Class 1 (±1%) billing-grade revenue metering per outlet according to EN 62053-21, measuring voltage, current, active/apparent power, power factor, and harmonic distortion.</p>\n<h3>Integrated Type B RCM and Advanced Environmental Sensor Integration</h3>\n<p>To eliminate costly external earth leakage relays, Rittal PDUs integrate an AC/DC sensitive Residual Current Monitor (RCM Type B) that detects smooth DC leakage currents often generated by server power supplies. Furthermore, each PDU incorporates a dedicated CAN-bus port that directly connects up to eight CMC III plug-and-play sensors (temperature, humidity, water leak, and electronic door locks), transforming the PDU into a centralized rack management gateway.</p>\nID: <h3>Manajemen Daya Cerdas untuk Kabinet Server & Pusat Data Misi Kritis</h3>\n<p>Pada fasilitas cloud modern, ruang server enterprise, dan titik komputasi edge, penyaluran listrik biasa sudah tidak lagi mencukupi. Operator membutuhkan visibilitas mendalam atas konsumsi daya per rak, kemampuan kendali jarak jauh untuk me-reboot server yang hang, serta peringatan dini otomatis sebelum beban lebih memicu pemadaman tak terduga. Rittal Intelligent PDU menghadirkan distribusi daya andal dalam lima varian fungsional: Basic, Metered, Metered Plus, Switched, dan Managed.</p>\n<h3>Pemasangan Zero-U Tanpa Perkakas pada Rak VX IT & TX CableNet</h3>\n<p>Ruang rak server sangat berharga. Rittal PDU dirancang dengan profil aluminium ekstrusi ramping khusus untuk pemasangan klip snap-in tanpa perkakas di ruang ''Zero-U'' (antara tiang rel 19\" dan dinding samping kabinet). Hal ini membuat seluruh unit 42U atau 47U tetap bebas sepenuhnya untuk server, storage SAN, dan sakelar jaringan, sekaligus memudahkan akses penataan kabel daya tanpa menghalangi aliran udara dingin.</p>\n<h3>Soket Pengunci Paten IEC Lock & Pengukuran Energi Berstandar Billing</h3>\n<p>Kabel power yang terlepas secara tidak sengaja saat teknisi melakukan perawatan rutin adalah penyebab umum server down. Rittal PDU mengintegrasikan mekanisme pengunci universal berpaten untuk colokan standar IEC C13 dan C19—mengunci kabel daya secara mekanis tanpa memerlukan kabel khusus berharga mahal. Untuk fasilitas colocation dan penagihan biaya listrik per departemen, tipe Metered Plus dan Managed dilengkapi pengukuran energi akurasi tinggi Kelas 1 (±1%) sesuai standar EN 62053-21 (kWh, kW, tegangan, arus, power factor, dan THD).</p>\n<h3>Proteksi Arus Sisa RCM Tipe B & Konektivitas Sensor Lingkungan</h3>\n<p>Menghilangkan kebutuhan relay kebocoran arus eksternal yang memakan biaya, Rittal PDU mengintegrasikan Residual Current Monitoring (RCM Tipe B) sensitif AC/DC yang mampu mendeteksi arus bocor DC halus dari power supply switching server. Selain itu, setiap PDU dilengkapi port CAN-bus yang dapat langsung dihubungkan ke delapan sensor pintar CMC III (suhu, kelembaban, kebocoran air, dan kontrol kunci pintu elektronik), menjadikan PDU sebagai gateway pemantau fisik rak terpadu.</p>"}]}'::jsonb,
  '{"EN: PDU Variant Portfolio\nID: Varian Portofolio PDU":"Basic, Metered (phase-infeed), Metered Plus (per-outlet), Switched (remote toggle), Managed (metered + switched)","EN: Form Factor & Mounting\nID: Faktor Bentuk & Pemasangan":"Slim aluminum profile for tool-free vertical zero-U mounting in VX IT and TX CableNet server racks","EN: Socket Configurations\nID: Konfigurasi Soket Outlet":"Combinations of IEC 60320 C13 (10 A) and C19 (16 A) with patented dual mechanical locking mechanism","EN: Metering & Accuracy\nID: Pengukuran & Akurasi Energi":"Billing-grade measurement accuracy Class 1 (±1%) compliant with EN 62053-21 (kWh, kW, V, A, PF, THD)","EN: Safety & Residual Current\nID: Fitur Keamanan & Arus Sisa":"Integrated AC/DC sensitive Residual Current Monitoring (RCM Type B) and Type 3 surge arresters","EN: Network & IoT Protocols\nID: Protokol Jaringan & IoT":"Gigabit Ethernet, SNMPv1/v2c/v3, Modbus TCP, OPC-UA, IPv6, RESTful API, and CAN-bus sensor connectivity"}'::jsonb,
  '/uploads/products-rittal-intelligent-pdu.jpg',
  'published',
  now(),
  20,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/lcp-liquid-cooling-packages
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000788',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'lcp-liquid-cooling-packages',
  'rittal-distributor/lcp-liquid-cooling-packages',
  E'EN: Rittal Liquid Cooling Packages (LCP CW & DX High-Density IT Cooling)
ID: Unit Pendingin Cair Rittal Liquid Cooling Package (LCP CW & DX High-Density)',
  E'EN: High-density rack- and row-based liquid cooling systems delivering up to 55 kW cooling output per server rack using chilled water (CW) or direct expansion (DX) with zero room heat footprint.
ID: Sistem pendingin cair berdensitas tinggi berbasis rak dan deret (row-based) berdaya hingga 55 kW per rak server menggunakan air dingin (CW) atau refrigeran (DX) tanpa jejak panas ke ruangan.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pendinginan Cair Berdensitas Tinggi untuk AI, HPC & Rak Server Kritis</h3>\n<p>Kluster komputasi densitas tinggi, server Artificial Intelligence (AI) bertenaga GPU, serta blade server modern menghasilkan panas termal ekstrem melebihi 20 kW hingga 55 kW per rak—jauh melampaui kemampuan fisik AC presisi perimeter (CRAC) konvensional dengan lantai raised floor. Rittal Liquid Cooling Package (LCP) menghadirkan solusi pendinginan terarah langsung di samping rak server, menangkap 100% beban panas sebelum sempat menyebar ke udara ruangan pusat data.</p>\n<h3>Pilihan LCP Rack vs. LCP Inline: Fleksibel untuk Segala Arsitektur Data Center</h3>\n<p>Rittal menghadirkan dua konfigurasi arsitektur pendinginan utama:\n<b>LCP Rack:</b> Membentuk sirkulasi tertutup (closed-loop) kedap udara dengan satu atau dua rak server VX IT di sebelahnya. Udara panas buangan server ditarik langsung ke penukar panas LCP, didinginkan, lalu dihembuskan kembali ke bagian depan server pada suhu presisi, menghasilkan proteksi kabinet IP55 tanpa kebocoran suara bising ke ruangan.\n<b>LCP Inline:</b> Dipasang sejajar dalam deretan rak server (row-based), mengalirkan udara dingin ke dalam lorong dingin tertutup (cold aisle containment) dan menghisap udara dari lorong panas (hot aisle), memaksimalkan efisiensi energi PUE untuk ruang data center modern.</p>\n<h3>Varian Air Dingin (CW) & Refrigeran Ekspansi Langsung (DX)</h3>\n<p>Untuk fasilitas pusat data besar yang memiliki jaringan pipa chiller air dingin, tipe LCP CW menggunakan penukar panas air/udara berefisiensi tinggi dengan katup proporsional bermotor, menghasilkan rasio efisiensi PUE (Power Usage Effectiveness) istimewa di bawah 1,15. Untuk fasilitas edge data center atau pabrik yang tidak memiliki instalasi chiller air, LCP DX mengintegrasikan kompresor inverter berkecepatan dinamis yang terkoneksi ke kondensor luar ruangan, secara otomatis memodulasi daya pendingin dari 20% hingga 100% mengikuti beban kerja komputasi server seketika.</p>\n<h3>Kipas EC Redundan Hot-Swappable & Proteksi Kebocoran Berlapis</h3>\n<p>Keandalan non-stop dijamin oleh susunan kipas motor EC (Electronically Commutated) berkonfigurasi redundan N+1. Apabila terjadi kendala pada salah satu modul kipas, teknisi dapat menggantinya secara langsung (hot-swappable) dalam hitungan detik tanpa alat dan tanpa mematikan server IT. Sensor kebocoran air optik dan konduktif di sepanjang bak kondensat terhubung ke katup pemutus darurat otomatis dan mengirimkan notifikasi instan ke sistem BMS gedung melalui protokol SNMP, Modbus, atau BACnet.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Density Liquid Cooling for AI, HPC, and Mission-Critical Server Racks</h3>\n<p>High-density compute clusters, GPU accelerated artificial intelligence servers, and blade enclosures generate thermal dissipation exceeding 20 kW to 55 kW per rack—well beyond the physical cooling limits of traditional raised-floor perimeter CRAC units. The Rittal Liquid Cooling Package (LCP) family provides targeted, localized thermal management directly at the server level, capturing 100% of heat dissipation before it enters the data center room.</p>\n<h3>LCP Rack vs. LCP Inline: Tailored for Every Data Center Architecture</h3>\n<p>Rittal offers two distinct architectural configurations:\n<b>LCP Rack:</b> Creates a completely sealed, airtight closed-loop cooling circuit with one or two bayed VX IT server racks. Hot exhaust air from servers is drawn directly into the heat exchanger, cooled, and blown back across the front of the servers at the exact setpoint temperature, achieving IP55 enclosure protection and zero room noise.\n<b>LCP Inline:</b> Installed directly within a row of bayed server cabinets, expelling cooled air into a contained cold aisle and drawing hot air from a contained hot aisle, maximizing energy efficiency for open-row data center suites.</p>\n<h3>Chilled Water (CW) and Direct Expansion (DX) Options</h3>\n<p>For large enterprise facilities with central chilled water plants, LCP CW utilizes water/air heat exchangers controlled by motorized proportional 2-way regulating valves, achieving exceptional PUE (Power Usage Effectiveness) ratings under 1.15. For edge data centers or distributed installations without chilled water loops, LCP DX integrates an inverter-controlled variable-speed brushless compressor with an external air-cooled condenser, dynamically modulating cooling capacity from 20% to 100% to match instantaneous IT server loads.</p>\n<h3>Hot-Swappable Redundant EC Fans and Multi-Layer Leak Protection</h3>\n<p>Continuous uptime is guaranteed through an array of redundant, high-efficiency EC (Electronically Commutated) axial fans in an N+1 configuration. In the rare event of a fan issue, individual fan modules can be replaced hot-swappable in seconds without tools while the IT servers remain fully operational. Multiple leak-detection sensors along the condensate tray and piping connect directly to the automated shutoff valve and alert the facility BMS via SNMP, Modbus, or BACnet.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Density Liquid Cooling for AI, HPC, and Mission-Critical Server Racks</h3>\n<p>High-density compute clusters, GPU accelerated artificial intelligence servers, and blade enclosures generate thermal dissipation exceeding 20 kW to 55 kW per rack—well beyond the physical cooling limits of traditional raised-floor perimeter CRAC units. The Rittal Liquid Cooling Package (LCP) family provides targeted, localized thermal management directly at the server level, capturing 100% of heat dissipation before it enters the data center room.</p>\n<h3>LCP Rack vs. LCP Inline: Tailored for Every Data Center Architecture</h3>\n<p>Rittal offers two distinct architectural configurations:\n<b>LCP Rack:</b> Creates a completely sealed, airtight closed-loop cooling circuit with one or two bayed VX IT server racks. Hot exhaust air from servers is drawn directly into the heat exchanger, cooled, and blown back across the front of the servers at the exact setpoint temperature, achieving IP55 enclosure protection and zero room noise.\n<b>LCP Inline:</b> Installed directly within a row of bayed server cabinets, expelling cooled air into a contained cold aisle and drawing hot air from a contained hot aisle, maximizing energy efficiency for open-row data center suites.</p>\n<h3>Chilled Water (CW) and Direct Expansion (DX) Options</h3>\n<p>For large enterprise facilities with central chilled water plants, LCP CW utilizes water/air heat exchangers controlled by motorized proportional 2-way regulating valves, achieving exceptional PUE (Power Usage Effectiveness) ratings under 1.15. For edge data centers or distributed installations without chilled water loops, LCP DX integrates an inverter-controlled variable-speed brushless compressor with an external air-cooled condenser, dynamically modulating cooling capacity from 20% to 100% to match instantaneous IT server loads.</p>\n<h3>Hot-Swappable Redundant EC Fans and Multi-Layer Leak Protection</h3>\n<p>Continuous uptime is guaranteed through an array of redundant, high-efficiency EC (Electronically Commutated) axial fans in an N+1 configuration. In the rare event of a fan issue, individual fan modules can be replaced hot-swappable in seconds without tools while the IT servers remain fully operational. Multiple leak-detection sensors along the condensate tray and piping connect directly to the automated shutoff valve and alert the facility BMS via SNMP, Modbus, or BACnet.</p>\nID: <h3>Pendinginan Cair Berdensitas Tinggi untuk AI, HPC & Rak Server Kritis</h3>\n<p>Kluster komputasi densitas tinggi, server Artificial Intelligence (AI) bertenaga GPU, serta blade server modern menghasilkan panas termal ekstrem melebihi 20 kW hingga 55 kW per rak—jauh melampaui kemampuan fisik AC presisi perimeter (CRAC) konvensional dengan lantai raised floor. Rittal Liquid Cooling Package (LCP) menghadirkan solusi pendinginan terarah langsung di samping rak server, menangkap 100% beban panas sebelum sempat menyebar ke udara ruangan pusat data.</p>\n<h3>Pilihan LCP Rack vs. LCP Inline: Fleksibel untuk Segala Arsitektur Data Center</h3>\n<p>Rittal menghadirkan dua konfigurasi arsitektur pendinginan utama:\n<b>LCP Rack:</b> Membentuk sirkulasi tertutup (closed-loop) kedap udara dengan satu atau dua rak server VX IT di sebelahnya. Udara panas buangan server ditarik langsung ke penukar panas LCP, didinginkan, lalu dihembuskan kembali ke bagian depan server pada suhu presisi, menghasilkan proteksi kabinet IP55 tanpa kebocoran suara bising ke ruangan.\n<b>LCP Inline:</b> Dipasang sejajar dalam deretan rak server (row-based), mengalirkan udara dingin ke dalam lorong dingin tertutup (cold aisle containment) dan menghisap udara dari lorong panas (hot aisle), memaksimalkan efisiensi energi PUE untuk ruang data center modern.</p>\n<h3>Varian Air Dingin (CW) & Refrigeran Ekspansi Langsung (DX)</h3>\n<p>Untuk fasilitas pusat data besar yang memiliki jaringan pipa chiller air dingin, tipe LCP CW menggunakan penukar panas air/udara berefisiensi tinggi dengan katup proporsional bermotor, menghasilkan rasio efisiensi PUE (Power Usage Effectiveness) istimewa di bawah 1,15. Untuk fasilitas edge data center atau pabrik yang tidak memiliki instalasi chiller air, LCP DX mengintegrasikan kompresor inverter berkecepatan dinamis yang terkoneksi ke kondensor luar ruangan, secara otomatis memodulasi daya pendingin dari 20% hingga 100% mengikuti beban kerja komputasi server seketika.</p>\n<h3>Kipas EC Redundan Hot-Swappable & Proteksi Kebocoran Berlapis</h3>\n<p>Keandalan non-stop dijamin oleh susunan kipas motor EC (Electronically Commutated) berkonfigurasi redundan N+1. Apabila terjadi kendala pada salah satu modul kipas, teknisi dapat menggantinya secara langsung (hot-swappable) dalam hitungan detik tanpa alat dan tanpa mematikan server IT. Sensor kebocoran air optik dan konduktif di sepanjang bak kondensat terhubung ke katup pemutus darurat otomatis dan mengirimkan notifikasi instan ke sistem BMS gedung melalui protokol SNMP, Modbus, atau BACnet.</p>"}]}'::jsonb,
  '{"EN: Cooling Output\nID: Kapasitas Pendinginan":"From 12 kW up to 55 kW per rack (LCP Rack CW/DX, LCP Inline CW/DX, and LCP Rear Door CW)","EN: Cooling Media & Technology\nID: Media Pendingin & Teknologi":"Chilled water (CW) closed circuit or direct expansion refrigerant (DX) with inverter-driven scroll compressor","EN: Airflow Configuration\nID: Konfigurasi Aliran Udara":"Closed-loop rack cooling (LCP Rack) or open hot/cold aisle containment row cooling (LCP Inline)","EN: Fan Architecture\nID: Arsitektur Kipas":"Redundant EC fans with N+1 hot-swappable replacement during live IT operations","EN: Temperature Regulation\nID: Regulasi Suhu":"Continuous server intake temperature monitoring with stepless 0-10 V EC fan & motorized water valve control","EN: Monitoring & Safety\nID: Pemantauan & Keamanan":"Integrated optical/conductive water leak detection, condensate drip tray with float switch, SNMP/Modbus/BACnet"}'::jsonb,
  '/uploads/products-rittal-lcp-cooling.jpg',
  'published',
  now(),
  21,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 035_add_rittal_accessories_types.up.sql
-- ==========================================

-- 035_add_rittal_accessories_types.up.sql
-- Add 3 specialized Rittal System Accessories products from rittal.com:
-- 1. Rittal LED System Lights (SZ 2500 Enclosure Illumination)
-- 2. Rittal Base/Plinth System VX (Modular Enclosure Foundation)
-- 3. Rittal Modular Cable Entry Systems & Gland Plates (IP66 Ingress Protection)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/led-system-lights
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000789',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'led-system-lights',
  'rittal-distributor/led-system-lights',
  E'EN: Rittal LED System Lights (SZ 2500 Enclosure Illumination)
ID: Lampu Panel LED Rittal System Light (Penerangan Kabinet Seri SZ 2500)',
  E'EN: Innovative enclosure LED system lights engineered with optical Fresnel lenses for targeted cabinet illumination (400 to 1200 lm), universal rotating connectors, motion sensors, and magnetic mounting.
ID: Lampu LED sistem enclosure inovatif dengan lensa optik Fresnel untuk penerangan panel terarah (400 hingga 1200 lm), konektor putar universal, sensor gerak terintegrasi, dan opsi pemasangan magnetik.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Penerangan Presisi Panel Listrik dengan Lensa Optik Fresnel Canggih</h3>\n<p>Lampu tabung neon konvensional atau strip LED biasa menyebarkan cahaya baur yang menyilaukan mata teknisi, sementara area dalam kabinet—terutama blok terminal bawah dan kelenjar kabel—tetap berada dalam kegelapan. Lampu Rittal LED System Light seri SZ 2500 memecahkan kendala ini melalui rekayasa optik modern: lensa Fresnel terintegrasi memfokuskan dan membiaskan seluruh berkas cahaya ke arah bawah dan sudut terdalam enclosure, menerangi seluruh baris komponen DIN-rail dan ducting kabel secara merata tanpa efek silau.</p>\n<h3>Pemasangan Snap-In Cepat Tanpa Alat & Opsi Klem Magnetik</h3>\n<p>Pemasangan lampu kabinet kini tidak memerlukan bor atau perkakas tangan. Rittal LED System Light dapat langsung dikunci (snap-in) pada pola lubang 25 mm rangka VX25 maupun rel AX. Untuk kebutuhan retrofit atau inspeksi darurat di lapangan, kit braket magnetik berkekuatan tinggi memungkinkan lampu ditempelkan secara instan di mana pun pada pelat baja panel dan dipindahkan posisinya dengan sangat fleksibel.</p>\n<h3>Sensor Gerak Inframerah (PIR) & Sakelar Pintu Otomatis</h3>\n<p>Efisiensi energi dan kenyamanan kerja teknisi menjadi prioritas utama. Dilengkapi opsi sensor gerak Passive Infrared (PIR) bersudut deteksi 90°, lampu akan otomatis menyala begitu teknisi mendekat atau membuka kabinet, dan padam secara otomatis setelah durasi waktu yang dapat disesuaikan. Tersedia pula kabel plug-and-play untuk koneksi langsung ke sakelar saklar pintu (door-operated switch SZ 4315), memastikan lampu hanya menyala saat pintu kabinet dibuka.</p>\n<h3>Konektor Putar 90° & Pengkabelan Seri Daisy-Chain Cepat</h3>\n<p>Dilengkapi konektor input daya yang dapat diputar 90°, jalur kabel dapat ditata rapi mengikuti profil rangka kabinet dari arah mana pun. Pada rangkaian kubikal gabungan (bayed enclosure suite), kabel koneksi tembus Rittal memungkinkan hingga 15 unit lampu LED dihubungkan secara seri (daisy-chain) hanya dari satu sumber listrik utama, memangkas waktu instalasi kabel hingga 60%.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Targeted Enclosure Illumination with Innovative Fresnel Optical Lenses</h3>\n<p>Standard fluorescent tubes and generic strip lights disperse diffuse light outward into the operator''s eyes while leaving the depths of the electrical enclosure—especially lower terminal blocks and cable gland plates—in deep shadow. The Rittal LED System Light SZ 2500 series resolves this through advanced optical engineering: an integrated Fresnel lens focuses and redirects the luminous flux downward and deep into the cabinet interior, illuminating all component rows and wiring ducts uniformly without dazzling the maintenance technician.</p>\n<h3>Rapid Tool-Free Clip-In and Magnetic Mounting</h3>\n<p>Installing enclosure lighting has never been faster. Rittal LED system lights can be snapped directly into the 25 mm hole pattern of the VX25 frame profile or AX mounting rails with a simple tool-free clip. For retrofits or field servicing, optional heavy-duty magnetic mounting kits allow the luminaire to be affixed securely to any bare steel or powder-coated surface instantly and repositioned whenever needed.</p>\n<h3>Integrated Motion Detector and Door Position Switches</h3>\n<p>Energy efficiency and operator convenience are paramount. Available with an integrated passive infrared (PIR) motion detector boasting a 90° detection cone, the light automatically switches on as soon as an engineer approaches or opens the door, and switches off after an adjustable dwell time. Alternatively, plug-and-play connection cables connect directly to Rittal door-operated position switches (SZ 4315), ensuring lighting activates strictly when the cabinet door swings open.</p>\n<h3>Rotatable Connectors and Effortless Daisy-Chaining</h3>\n<p>Equipped with a 90° rotatable power inlet connector, cables can be routed discreetly along the enclosure frame in any direction. When baying multiple enclosures together, Rittal through-wiring cables allow up to 15 LED lights to be daisy-chained from a single main infeed power source, drastically cutting installation time and material costs.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Targeted Enclosure Illumination with Innovative Fresnel Optical Lenses</h3>\n<p>Standard fluorescent tubes and generic strip lights disperse diffuse light outward into the operator''s eyes while leaving the depths of the electrical enclosure—especially lower terminal blocks and cable gland plates—in deep shadow. The Rittal LED System Light SZ 2500 series resolves this through advanced optical engineering: an integrated Fresnel lens focuses and redirects the luminous flux downward and deep into the cabinet interior, illuminating all component rows and wiring ducts uniformly without dazzling the maintenance technician.</p>\n<h3>Rapid Tool-Free Clip-In and Magnetic Mounting</h3>\n<p>Installing enclosure lighting has never been faster. Rittal LED system lights can be snapped directly into the 25 mm hole pattern of the VX25 frame profile or AX mounting rails with a simple tool-free clip. For retrofits or field servicing, optional heavy-duty magnetic mounting kits allow the luminaire to be affixed securely to any bare steel or powder-coated surface instantly and repositioned whenever needed.</p>\n<h3>Integrated Motion Detector and Door Position Switches</h3>\n<p>Energy efficiency and operator convenience are paramount. Available with an integrated passive infrared (PIR) motion detector boasting a 90° detection cone, the light automatically switches on as soon as an engineer approaches or opens the door, and switches off after an adjustable dwell time. Alternatively, plug-and-play connection cables connect directly to Rittal door-operated position switches (SZ 4315), ensuring lighting activates strictly when the cabinet door swings open.</p>\n<h3>Rotatable Connectors and Effortless Daisy-Chaining</h3>\n<p>Equipped with a 90° rotatable power inlet connector, cables can be routed discreetly along the enclosure frame in any direction. When baying multiple enclosures together, Rittal through-wiring cables allow up to 15 LED lights to be daisy-chained from a single main infeed power source, drastically cutting installation time and material costs.</p>\nID: <h3>Penerangan Presisi Panel Listrik dengan Lensa Optik Fresnel Canggih</h3>\n<p>Lampu tabung neon konvensional atau strip LED biasa menyebarkan cahaya baur yang menyilaukan mata teknisi, sementara area dalam kabinet—terutama blok terminal bawah dan kelenjar kabel—tetap berada dalam kegelapan. Lampu Rittal LED System Light seri SZ 2500 memecahkan kendala ini melalui rekayasa optik modern: lensa Fresnel terintegrasi memfokuskan dan membiaskan seluruh berkas cahaya ke arah bawah dan sudut terdalam enclosure, menerangi seluruh baris komponen DIN-rail dan ducting kabel secara merata tanpa efek silau.</p>\n<h3>Pemasangan Snap-In Cepat Tanpa Alat & Opsi Klem Magnetik</h3>\n<p>Pemasangan lampu kabinet kini tidak memerlukan bor atau perkakas tangan. Rittal LED System Light dapat langsung dikunci (snap-in) pada pola lubang 25 mm rangka VX25 maupun rel AX. Untuk kebutuhan retrofit atau inspeksi darurat di lapangan, kit braket magnetik berkekuatan tinggi memungkinkan lampu ditempelkan secara instan di mana pun pada pelat baja panel dan dipindahkan posisinya dengan sangat fleksibel.</p>\n<h3>Sensor Gerak Inframerah (PIR) & Sakelar Pintu Otomatis</h3>\n<p>Efisiensi energi dan kenyamanan kerja teknisi menjadi prioritas utama. Dilengkapi opsi sensor gerak Passive Infrared (PIR) bersudut deteksi 90°, lampu akan otomatis menyala begitu teknisi mendekat atau membuka kabinet, dan padam secara otomatis setelah durasi waktu yang dapat disesuaikan. Tersedia pula kabel plug-and-play untuk koneksi langsung ke sakelar saklar pintu (door-operated switch SZ 4315), memastikan lampu hanya menyala saat pintu kabinet dibuka.</p>\n<h3>Konektor Putar 90° & Pengkabelan Seri Daisy-Chain Cepat</h3>\n<p>Dilengkapi konektor input daya yang dapat diputar 90°, jalur kabel dapat ditata rapi mengikuti profil rangka kabinet dari arah mana pun. Pada rangkaian kubikal gabungan (bayed enclosure suite), kabel koneksi tembus Rittal memungkinkan hingga 15 unit lampu LED dihubungkan secara seri (daisy-chain) hanya dari satu sumber listrik utama, memangkas waktu instalasi kabel hingga 60%.</p>"}]}'::jsonb,
  '{"EN: Luminous Flux\nID: Fluks Cahaya":"400 lm, 600 lm, 900 lm, up to 1,200 lm (high-efficacy daylight white 4000 K)","EN: Optical Light Distribution\nID: Distribusi Cahaya Optik":"Fresnel optical lens directing 100% of light onto the mounting plate and bottom enclosure area","EN: Operating Voltage\nID: Tegangan Operasi":"Wide-range 100 V – 240 V AC (50/60 Hz) or extra-low voltage 24 V DC","EN: Switching & Automation\nID: Metode Pengaktifan & Otomasi":"Integrated 90° PIR motion detector, door-operated switch, or continuous on/off push button","EN: Mounting Flexibility\nID: Fleksibilitas Pemasangan":"Direct clip-in onto 25 mm system pitch, magnetic clamp attachment, or screw-fastened onto frame","EN: Wiring & Daisy-Chaining\nID: Pengkabelan & Seri":"90° rotatable plug-in connection; supports through-wiring of up to 15 lights in a bayed suite"}'::jsonb,
  '/uploads/products-rittal-led-system-lights.jpg',
  'published',
  now(),
  22,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/base-plinth-system-vx
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000790',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'base-plinth-system-vx',
  'rittal-distributor/base-plinth-system-vx',
  E'EN: Rittal Base/Plinth System VX (Modular Enclosure Foundation)
ID: Sistem Plinth / Pondasi Modular Rittal Base/Plinth System VX',
  E'EN: Heavy-duty modular base/plinth system for VX25, VX SE, and TS enclosures providing enhanced mechanical stability, tool-free snap-in trim panels, and integrated cable routing space.
ID: Sistem pondasi plinth modular beban berat untuk panel VX25, VX SE, dan TS yang memberikan stabilitas mekanis tinggi, panel penutup snap-in tanpa baut, dan ruang tata kabel terintegrasi.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pondasi Modular Kokoh untuk Switchgear Industri & Distribusi Daya</h3>\n<p>Keandalan panel listrik bermula dari pondasi bawah yang kokoh. Rittal Base/Plinth System VX mengintegrasikan seluruh fungsi dudukan kabinet ke dalam sistem pondasi modular beban berat. Dirancang khusus untuk kubikal gandeng VX25, kabinet monobloc VX SE, serta panel kompak AX, sistem ini meninggikan panel dari kelembaban dan kotoran lantai, menyediakan ruang leluasa untuk terminasi kabel masukan, serta memperkuat kekakuan mekanis saat transportasi dan gempa bumi.</p>\n<h3>Transportasi Forklift Langsung Tanpa Palet Kayu</h3>\n<p>Mobilisasi kubikal panel switchgear berbobot ribuan kilogram menuntut keselamatan tingkat tinggi. Bagian sudut (corner piece) Base/Plinth VX dirancang sangat kokoh dari baja cetak presisi yang mampu menopang beban statis maupun dinamis penuh kabinet (hingga 15.000 N). Garpu forklift dapat langsung masuk mengangkat kabinet dari kolong plinth secara seimbang, mengeliminasi ketergantungan pada palet kayu dan mempermudah penataan di lantai pabrik.</p>\n<h3>Panel Penutup Snap-In Tanpa Baut dengan Opsi Strip Sikat Kabel</h3>\n<p>Menutup bagian bawah panel tidak lagi memerlukan proses pengencangan baut yang memakan waktu. Lembaran trim panel samping dan depan-belakang terkunci rapat ke sudut plinth menggunakan kait pegas berpaten (snap-in) dan dapat dibuka kembali dalam hitungan detik saat penarikan kabel. Untuk ruangan IT dan kontrol, tersedia varian panel berpori ventilasi serta panel dengan strip sikat debu (brush strip) untuk jalur masuk kabel fleksibel tanpa merusak jaket isolasi.</p>\n<h3>Klem Kabel Internal & Penggabungan Multi-Kubikal Simetris</h3>\n<p>Bagian dalam Base/Plinth VX mewarisi pola lubang modular 25 mm yang identik dengan rangka utama VX25. Rel klem kabel profil C, klem penahan tarikan kabel (strain relief), dan plat grounding EMC dapat dipasang langsung di dalam ruang kolong plinth. Saat menggabungkan beberapa kubikal (baying), braket penyambung internal mengunci seluruh rangkaian pondasi secara presisi tanpa celah eksternal yang membahayakan operasional.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>The Modular Foundation for Modern Industrial and Power Distribution Switchgear</h3>\n<p>A reliable electrical switchboard starts from the ground up. The Rittal Base/Plinth System VX combines all functions of an enclosure base into a highly modular, heavy-duty foundation. Engineered specifically for VX25 baying enclosures, VX SE standalone cabinets, and AX compact panels, the system elevates the enclosure above floor contaminants, creates valuable routing space for incoming field cables, and reinforces mechanical rigidity during transport and seismic events.</p>\n<h3>Forklift Transport Without Wooden Pallets</h3>\n<p>Switchgear manufacturing logistics require moving heavy panels safely. The rugged corner pieces of the VX base/plinth are engineered to handle the full static and dynamic weight of fully equipped enclosures (up to 15,000 N). Forklift trucks can lift and maneuver the entire cabinet suite directly under the corner pieces, eliminating the need for wooden shipping pallets and simplifying shop-floor transport.</p>\n<h3>Tool-Free Snap-In Trim Panels with Integrated Brush Strips</h3>\n<p>Closing the base plinth no longer requires tedious screw fastening. Trim panels snap firmly into place between the corner pieces using patented locking latches and can be detached in seconds for cable pulling or maintenance access. For automated data center and switchboard rooms, trim panels with integrated brush strips or ventilation louvres provide seamless bottom cable ingress while preventing vermin and large debris from entering.</p>\n<h3>Internal Cable Clamping and Baying Symmetry</h3>\n<p>The interior of the Base/Plinth System VX features standardized 25 mm system punchings identical to the main VX25 enclosure frame. Standard punched sections, C-profile cable clamp rails, and EMC grounding brackets mount directly inside the plinth space. When baying multiple enclosures together, internal plinth baying brackets bridge the suites securely without creating external gaps or tripping hazards.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>The Modular Foundation for Modern Industrial and Power Distribution Switchgear</h3>\n<p>A reliable electrical switchboard starts from the ground up. The Rittal Base/Plinth System VX combines all functions of an enclosure base into a highly modular, heavy-duty foundation. Engineered specifically for VX25 baying enclosures, VX SE standalone cabinets, and AX compact panels, the system elevates the enclosure above floor contaminants, creates valuable routing space for incoming field cables, and reinforces mechanical rigidity during transport and seismic events.</p>\n<h3>Forklift Transport Without Wooden Pallets</h3>\n<p>Switchgear manufacturing logistics require moving heavy panels safely. The rugged corner pieces of the VX base/plinth are engineered to handle the full static and dynamic weight of fully equipped enclosures (up to 15,000 N). Forklift trucks can lift and maneuver the entire cabinet suite directly under the corner pieces, eliminating the need for wooden shipping pallets and simplifying shop-floor transport.</p>\n<h3>Tool-Free Snap-In Trim Panels with Integrated Brush Strips</h3>\n<p>Closing the base plinth no longer requires tedious screw fastening. Trim panels snap firmly into place between the corner pieces using patented locking latches and can be detached in seconds for cable pulling or maintenance access. For automated data center and switchboard rooms, trim panels with integrated brush strips or ventilation louvres provide seamless bottom cable ingress while preventing vermin and large debris from entering.</p>\n<h3>Internal Cable Clamping and Baying Symmetry</h3>\n<p>The interior of the Base/Plinth System VX features standardized 25 mm system punchings identical to the main VX25 enclosure frame. Standard punched sections, C-profile cable clamp rails, and EMC grounding brackets mount directly inside the plinth space. When baying multiple enclosures together, internal plinth baying brackets bridge the suites securely without creating external gaps or tripping hazards.</p>\nID: <h3>Pondasi Modular Kokoh untuk Switchgear Industri & Distribusi Daya</h3>\n<p>Keandalan panel listrik bermula dari pondasi bawah yang kokoh. Rittal Base/Plinth System VX mengintegrasikan seluruh fungsi dudukan kabinet ke dalam sistem pondasi modular beban berat. Dirancang khusus untuk kubikal gandeng VX25, kabinet monobloc VX SE, serta panel kompak AX, sistem ini meninggikan panel dari kelembaban dan kotoran lantai, menyediakan ruang leluasa untuk terminasi kabel masukan, serta memperkuat kekakuan mekanis saat transportasi dan gempa bumi.</p>\n<h3>Transportasi Forklift Langsung Tanpa Palet Kayu</h3>\n<p>Mobilisasi kubikal panel switchgear berbobot ribuan kilogram menuntut keselamatan tingkat tinggi. Bagian sudut (corner piece) Base/Plinth VX dirancang sangat kokoh dari baja cetak presisi yang mampu menopang beban statis maupun dinamis penuh kabinet (hingga 15.000 N). Garpu forklift dapat langsung masuk mengangkat kabinet dari kolong plinth secara seimbang, mengeliminasi ketergantungan pada palet kayu dan mempermudah penataan di lantai pabrik.</p>\n<h3>Panel Penutup Snap-In Tanpa Baut dengan Opsi Strip Sikat Kabel</h3>\n<p>Menutup bagian bawah panel tidak lagi memerlukan proses pengencangan baut yang memakan waktu. Lembaran trim panel samping dan depan-belakang terkunci rapat ke sudut plinth menggunakan kait pegas berpaten (snap-in) dan dapat dibuka kembali dalam hitungan detik saat penarikan kabel. Untuk ruangan IT dan kontrol, tersedia varian panel berpori ventilasi serta panel dengan strip sikat debu (brush strip) untuk jalur masuk kabel fleksibel tanpa merusak jaket isolasi.</p>\n<h3>Klem Kabel Internal & Penggabungan Multi-Kubikal Simetris</h3>\n<p>Bagian dalam Base/Plinth VX mewarisi pola lubang modular 25 mm yang identik dengan rangka utama VX25. Rel klem kabel profil C, klem penahan tarikan kabel (strain relief), dan plat grounding EMC dapat dipasang langsung di dalam ruang kolong plinth. Saat menggabungkan beberapa kubikal (baying), braket penyambung internal mengunci seluruh rangkaian pondasi secara presisi tanpa celah eksternal yang membahayakan operasional.</p>"}]}'::jsonb,
  '{"EN: Material & Finish\nID: Material & Lapisan Akhir":"Sheet steel RAL 7022 (umbra grey) or high-grade stainless steel 1.4301 (AISI 304) with brushed finish","EN: System Heights\nID: Ketinggian Sistem":"100 mm and 200 mm modular heights (stackable for custom elevation up to 400 mm)","EN: Corner Piece Architecture\nID: Arsitektur Sudut Plinth":"Heavy-duty cast corner pieces capable of supporting full cabinet load during forklift transport","EN: Trim Panel Variants\nID: Varian Panel Penutup":"Solid sheet steel, vented trim panels with filter mats, and panels with brush strips for cable entry","EN: Cable Management Integration\nID: Integrasi Tata Kabel":"C-rails and cable clamp rails mount directly inside the base without requiring drilling","EN: Baying & Seismic Security\nID: Penggabungan & Ketahanan Gempa":"Integrated baying brackets for multi-bay suites; tested for seismic zones 1 to 4 to Telcordia GR-63-CORE"}'::jsonb,
  '/uploads/products-rittal-base-plinth-system.jpg',
  'published',
  now(),
  23,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/cable-entry-systems-gland-plates
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000791',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'cable-entry-systems-gland-plates',
  'rittal-distributor/cable-entry-systems-gland-plates',
  E'EN: Rittal Modular Cable Entry Systems & Gland Plates (IP66 Ingress Protection)
ID: Sistem Masukan Kabel Modular & Pelat Gland Rittal (Proteksi IP66)',
  E'EN: Modular cable entry plates and split gland systems providing high-density cable insertion with pre-assembled connectors, mechanical strain relief, and IP66 / NEMA 4X hermetic sealing.
ID: Pelat masukan kabel modular dan sistem gland split untuk pemasangan kabel berdensitas tinggi dengan konektor terpasang, peredam tarikan mekanis, dan penyegelan rapat berstandar IP66 / NEMA 4X.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemasangan Kabel Densitas Tinggi untuk Kabel Jadi & Lingkungan Industri Ekstrem</h3>\n<p>Mesin otomasi modern banyak memanfaatkan kabel jadi (pre-assembled cables) yang telah terpasang konektor industri cetakan pabrik, seperti colokan Ethernet RJ45, konektor optik LC, dan konektor multipole D-Sub. Cable gland konvensional memaksa teknisi memotong kepala konektor, memasukkan kawat telanjang, lalu menyolder ulang pin di lapangan—metode yang memakan waktu, rawan salah pin, dan membatalkan garansi pabrikan kabel. Sistem masukan kabel modular Rittal mengeliminasi masalah ini sepenuhnya melalui arsitektur rangka belah (split frame) dan grommet penyegel elastomer elastis.</p>\n<h3>Rangka Belah (Split Frame): Lewatkan Kabel Berkonektor Tanpa Memotong</h3>\n<p>Pelat masukan kabel Rittal memungkinkan kabel yang sudah terpasang konektor besar dilewatkan menembus dinding panel tanpa perlu mencopot soket konektornya. Grommet karet elastomer berbelah dipasangkan memeluk kabel, lalu diselipkan ke dalam alur rangka split. Saat kedua sisi rangka dibaut rapat, tekanan merata mengunci grommet secara presisi, menghasilkan proteksi kedap air dan kedap debu berstandar IP66 / NEMA 4X.</p>\n<h3>Efisiensi Ruang Maksimal & Peredam Tarikan Mekanis (Strain Relief)</h3>\n<p>Bila cable gland konvensional membutuhkan jarak antar lubang yang boros ruang di pelat panel, sistem masukan kabel densitas tinggi Rittal mampu memuat hingga 32 kabel dalam satu lubang cutout seukuran konektor industri 24-pin. Profil rusuk penjepit internal memberikan peredam tarikan mekanis (strain relief) sesuai standar DIN EN 62444, melindungi kawat dari getaran mesin maupun tarikan tak disengaja di lapangan.</p>\n<h3>Pelat Flange Modular untuk Panel AX, KX, dan Rangka VX25</h3>\n<p>Rittal menyediakan ragam pelat gland untuk setiap tipe panel: pelat gland dua bagian dengan busa penjepit elastis untuk panel kompak AX, pelat plastik membran tembus tanpa perkakas, serta pelat stainless steel higienis untuk pabrik pengolahan makanan tahan semprotan air kimia. Seluruh sistem tetap menjaga kompatibilitas elektromagnetik (EMC) panel saat dipadukan dengan kit anyaman grounding Rittal.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Density Cable Entry for Pre-Assembled Cables and Harsh Industrial Environments</h3>\n<p>Modern automated machinery relies heavily on prefabricated cables equipped with molded industrial connectors, Ethernet RJ45 plugs, optical LC connectors, and D-Sub interfaces. Traditional cable glands force technicians to cut off connectors, feed bare wires through, and re-solder pins in the field—a practice that is slow, error-prone, and voids manufacturer warranties. Rittal modular cable entry systems eliminate this issue completely by utilizing split frame architecture and flexible elastomer sealing grommets.</p>\n<h3>Split Gland Frames: Insert Pre-Terminated Cables in Seconds</h3>\n<p>Rittal split cable entry plates allow pre-assembled cables with large terminal plugs to be passed through standardized enclosure cutouts without detaching the connectors. Flexible, slotted elastomeric grommets are snapped over the cables and slotted firmly into the matching grooves of the split frame. Once bolted together, the frame compresses the grommets uniformly, achieving an airtight, watertight IP66 / NEMA 4X seal.</p>\n<h3>Extreme Space Efficiency and Integrated Strain Relief</h3>\n<p>Where conventional cable glands require wide spacing that consumes an entire enclosure wall, Rittal high-density cable entry plates pack up to 32 cables into a compact opening standardly sized for 24-pin multi-pole connectors. Built-in contoured cable holding ribs provide mechanical strain relief conforming to DIN EN 62444, preventing external pulling or vibration forces from dislodging internal electrical terminals.</p>\n<h3>Modular Flange Plates for AX, KX, and VX Enclosure Openings</h3>\n<p>Rittal offers specialized gland plate options for every cabinet tier: two-part gland plates with elastic foam clamp strips for AX compact panels, modular plastic gland plates with knockout membranes for tool-free piercing, and heavy-gauge stainless steel plates for hygienic food processing washdowns. All modules maintain enclosure electromagnetic compatibility (EMC) when paired with Rittal grounding braid kits.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Density Cable Entry for Pre-Assembled Cables and Harsh Industrial Environments</h3>\n<p>Modern automated machinery relies heavily on prefabricated cables equipped with molded industrial connectors, Ethernet RJ45 plugs, optical LC connectors, and D-Sub interfaces. Traditional cable glands force technicians to cut off connectors, feed bare wires through, and re-solder pins in the field—a practice that is slow, error-prone, and voids manufacturer warranties. Rittal modular cable entry systems eliminate this issue completely by utilizing split frame architecture and flexible elastomer sealing grommets.</p>\n<h3>Split Gland Frames: Insert Pre-Terminated Cables in Seconds</h3>\n<p>Rittal split cable entry plates allow pre-assembled cables with large terminal plugs to be passed through standardized enclosure cutouts without detaching the connectors. Flexible, slotted elastomeric grommets are snapped over the cables and slotted firmly into the matching grooves of the split frame. Once bolted together, the frame compresses the grommets uniformly, achieving an airtight, watertight IP66 / NEMA 4X seal.</p>\n<h3>Extreme Space Efficiency and Integrated Strain Relief</h3>\n<p>Where conventional cable glands require wide spacing that consumes an entire enclosure wall, Rittal high-density cable entry plates pack up to 32 cables into a compact opening standardly sized for 24-pin multi-pole connectors. Built-in contoured cable holding ribs provide mechanical strain relief conforming to DIN EN 62444, preventing external pulling or vibration forces from dislodging internal electrical terminals.</p>\n<h3>Modular Flange Plates for AX, KX, and VX Enclosure Openings</h3>\n<p>Rittal offers specialized gland plate options for every cabinet tier: two-part gland plates with elastic foam clamp strips for AX compact panels, modular plastic gland plates with knockout membranes for tool-free piercing, and heavy-gauge stainless steel plates for hygienic food processing washdowns. All modules maintain enclosure electromagnetic compatibility (EMC) when paired with Rittal grounding braid kits.</p>\nID: <h3>Pemasangan Kabel Densitas Tinggi untuk Kabel Jadi & Lingkungan Industri Ekstrem</h3>\n<p>Mesin otomasi modern banyak memanfaatkan kabel jadi (pre-assembled cables) yang telah terpasang konektor industri cetakan pabrik, seperti colokan Ethernet RJ45, konektor optik LC, dan konektor multipole D-Sub. Cable gland konvensional memaksa teknisi memotong kepala konektor, memasukkan kawat telanjang, lalu menyolder ulang pin di lapangan—metode yang memakan waktu, rawan salah pin, dan membatalkan garansi pabrikan kabel. Sistem masukan kabel modular Rittal mengeliminasi masalah ini sepenuhnya melalui arsitektur rangka belah (split frame) dan grommet penyegel elastomer elastis.</p>\n<h3>Rangka Belah (Split Frame): Lewatkan Kabel Berkonektor Tanpa Memotong</h3>\n<p>Pelat masukan kabel Rittal memungkinkan kabel yang sudah terpasang konektor besar dilewatkan menembus dinding panel tanpa perlu mencopot soket konektornya. Grommet karet elastomer berbelah dipasangkan memeluk kabel, lalu diselipkan ke dalam alur rangka split. Saat kedua sisi rangka dibaut rapat, tekanan merata mengunci grommet secara presisi, menghasilkan proteksi kedap air dan kedap debu berstandar IP66 / NEMA 4X.</p>\n<h3>Efisiensi Ruang Maksimal & Peredam Tarikan Mekanis (Strain Relief)</h3>\n<p>Bila cable gland konvensional membutuhkan jarak antar lubang yang boros ruang di pelat panel, sistem masukan kabel densitas tinggi Rittal mampu memuat hingga 32 kabel dalam satu lubang cutout seukuran konektor industri 24-pin. Profil rusuk penjepit internal memberikan peredam tarikan mekanis (strain relief) sesuai standar DIN EN 62444, melindungi kawat dari getaran mesin maupun tarikan tak disengaja di lapangan.</p>\n<h3>Pelat Flange Modular untuk Panel AX, KX, dan Rangka VX25</h3>\n<p>Rittal menyediakan ragam pelat gland untuk setiap tipe panel: pelat gland dua bagian dengan busa penjepit elastis untuk panel kompak AX, pelat plastik membran tembus tanpa perkakas, serta pelat stainless steel higienis untuk pabrik pengolahan makanan tahan semprotan air kimia. Seluruh sistem tetap menjaga kompatibilitas elektromagnetik (EMC) panel saat dipadukan dengan kit anyaman grounding Rittal.</p>"}]}'::jsonb,
  '{"EN: Ingress Protection\nID: Kategori Proteksi Ingress":"Up to IP66 / IP68 and NEMA 4X / NEMA 12 compliant to IEC 60529","EN: Cable Insertion Concept\nID: Konsep Pemasangan Kabel":"Split modular frame system allowing pre-terminated cables (with RJ45, USB, industrial multi-pole plugs) without voiding warranty","EN: Sealing Grommet Range\nID: Rentang Grommet Penyegel":"Elastomer slit sealing inserts for cable diameters from Ø 2 mm to Ø 35 mm (single and multi-hole)","EN: Strain Relief\nID: Peredam Tarikan Mekanis (Strain Relief)":"Integrated mechanical cable clamping to DIN EN 62444 with vibration-proof grip","EN: Material & Temperature\nID: Material & Suhu Operasi":"Halogen-free polyamide (PA6) and stainless steel gland plates rated from -40°C to +100°C (UL 94-V0)","EN: Compatibility\nID: Kompatibilitas Panel":"Direct fit into standard cutouts for 16-pin / 24-pin industrial connectors, AX gland plates, and VX base openings"}'::jsonb,
  '/uploads/products-rittal-cable-entry-plates.jpg',
  'published',
  now(),
  24,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;


-- ==========================================
-- Migration: 036_bilingual_remaining_news.up.sql
-- ==========================================

-- 036_bilingual_remaining_news.up.sql
-- Synchronize remaining 3 news articles (switchgear, harmonics, energy monitoring) with complete 100% matching bilingual translations (ID & EN)

BEGIN;

-- ARTICLE: 20mw-substation-commissioning-east-java
UPDATE news SET
  title = E'EN: Preventive Maintenance of Medium Voltage (MV) Switchgear\nID: Pemeliharaan Preventif Switchgear Tegangan Menengah (MV)',
  excerpt = E'EN: Comprehensive preventive maintenance and diagnostic testing for Medium Voltage (MV) switchgear to ensure operational safety, minimize downtime, and extend electrical asset longevity.\nID: Pemeliharaan preventif komprehensif dan pengujian diagnostik untuk switchgear tegangan menengah (MV) guna menjamin keselamatan operasional, meminimalkan downtime, dan memperpanjang usia pakai aset kelistrikan.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Menjamin Keandalan, Keselamatan, dan Usia Pakai Aset Kelistrikan</h2>\n<p>Switchgear tegangan menengah (Medium Voltage / MV Switchgear) merupakan tulang punggung distribusi daya fasilitas industri, yang berfungsi melakukan switching, isolasi, dan proteksi jaringan listrik baik saat kondisi normal maupun saat terjadi gangguan arus hubung singkat. Seiring waktu, faktor lingkungan seperti debu, kelembapan, ekspansi termal, dan keausan mekanis dapat menurunkan kualitas isolasi dan kontak listrik. Program <strong>pemeliharaan preventif (preventive maintenance) terstruktur</strong> mampu mendeteksi potensi kerusakan sebelum berkembang menjadi ledakan busur api (arc-flash) atau pemadaman total pabrik.</p>\n<h3>Tujuan Utama Pemeliharaan Preventif Switchgear MV</h3>\n<ul>\n  <li><p><strong>Keandalan Sistem Distribusi:</strong> Mencegah trip mendadak dan menjaga pasokan listrik kontinu untuk lini produksi dan utilitas penting.</p></li>\n  <li><p><strong>Keselamatan Personel &amp; Fasilitas:</strong> Mereduksi bahaya arc-flash, percikan api internal, dan risiko ledakan kubikel.</p></li>\n  <li><p><strong>Memperpanjang Usia Pakai Peralatan:</strong> Mencegah degradasi dini pada vacuum interrupter, kompartemen SF6, isolator busbar, dan mekanisme pegas penggerak.</p></li>\n  <li><p><strong>Kepatuhan Regulasi &amp; Standar:</strong> Memenuhi standar internasional IEC 62271, IEEE, PUIL/SNI, serta audit kelayakan asuransi industri.</p></li>\n</ul>\n<h3>Ruang Lingkup Inspeksi &amp; Pengujian Diagnostik</h3>\n<p>Prosedur pemeliharaan switchgear MV oleh tim ahli kami mencakup seluruh komponen vital:</p>\n<ol>\n  <li><p><strong>Inspeksi Visual &amp; Pembersihan Mekanikal:</strong> Pembersihan kompartemen kubikel dari debu dan partikel konduktif, pemeriksaan interlock pintu, pelumasan mekanisme racking, dan verifikasi shutter otomatis.</p></li>\n  <li><p><strong>Uji Resistansi Kontak (Micro-Ohm / Ductor Test):</strong> Mengukur tahanan kontak utama pada pole circuit breaker (VCB/SF6) dan kluster tulip kontak untuk mencegah titik panas (hot-spot).</p></li>\n  <li><p><strong>Uji Tahanan Isolasi (Megger) &amp; Uji Tegangan Tinggi (Hi-Pot):</strong> Memeriksa kekuatan dielektrik isolasi busbar, trafo arus (CT), dan trafo tegangan (PT) antar-fasa dan fasa-ke-ground.</p></li>\n  <li><p><strong>Analisis Waktu Kerja Breaker (Timing Test):</strong> Mengukur waktu buka (opening time), waktu tutup (closing time), dan sinkronisasi tiga fasa sesuai spesifikasi pabrikan.</p></li>\n  <li><p><strong>Uji Injeksi Sekunder Relay Proteksi:</strong> Menguji keandalan dan waktu kerja relay proteksi arus lebih (50/51), gangguan tanah (50N/51N), dan tegangan kurang (27) untuk memastikan koordinasi proteksi bekerja tepat.</p></li>\n  <li><p><strong>Inspeksi Termografi Inframerah:</strong> Pemindaian termal pada sambungan busbar dan terminasi kabel saat berbeban guna mendeteksi panas abnormal sebelum shutdown terencana.</p></li>\n</ol>\n<h3>Layanan Pemeliharaan Switchgear oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra didukung oleh tim engineer berpengalaman dan instrumen uji presisi terkalibrasi (Omicron, Megger, Fluke) siap menangani pemeliharaan switchgear MV saat shutdown atau turnaround period secara tepat waktu dan aman.</p>\n<p>Konsultasikan jadwal pemeliharaan switchgear fasilitas Anda:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Ensuring Reliability, Safety, and Asset Longevity</h2>\n<p>Medium Voltage (MV) switchgear forms the backbone of industrial power distribution networks, responsible for switching, isolating, and protecting electrical circuits under both normal and fault conditions. Over time, environmental factors such as dust, humidity, thermal expansion, and mechanical wear degrade insulation and contact surfaces. A structured <strong>preventive maintenance program</strong> detects incipient anomalies before they escalate into catastrophic flashovers or unplanned plant blackouts.</p>\n<h3>Key Objectives of MV Switchgear Preventive Maintenance</h3>\n<ul>\n  <li><p><strong>System Reliability:</strong> Minimize sudden trip events and maintain uninterrupted power supply to continuous industrial processes.</p></li>\n  <li><p><strong>Personnel and Asset Safety:</strong> Mitigate arc-flash hazards, internal arcing risks, and catastrophic explosive failures.</p></li>\n  <li><p><strong>Extended Asset Lifespan:</strong> Prevent premature degradation of vacuum interrupters, SF6 compartments, busbar insulation, and operating mechanisms.</p></li>\n  <li><p><strong>Compliance &amp; Documentation:</strong> Adhere to IEC 62271, IEEE standards, and insurance regulatory safety requirements.</p></li>\n</ul>\n<h3>Core Inspection and Diagnostic Scope</h3>\n<p>Our comprehensive MV switchgear maintenance procedure covers every critical component:</p>\n<ol>\n  <li><p><strong>Visual Inspection &amp; Mechanical Servicing:</strong> Cleaning cubicle compartments, checking door interlocks, inspecting racking mechanisms, and lubricating moving mechanical linkages.</p></li>\n  <li><p><strong>Contact Resistance (Ductor / Micro-Ohm) Testing:</strong> Measuring main circuit contact resistance across vacuum / SF6 circuit breaker poles and tulip finger clusters to eliminate hot-spot risks.</p></li>\n  <li><p><strong>Insulation Resistance (Megger) &amp; Hi-Pot Testing:</strong> Verifying dielectric integrity of busbars, post insulators, current transformers (CT), and potential transformers (PT) phase-to-phase and phase-to-earth.</p></li>\n  <li><p><strong>Circuit Breaker Timing &amp; Motion Analysis:</strong> Measuring opening, closing, and trip-free operational times to ensure strict synchronization within manufacturer tolerances.</p></li>\n  <li><p><strong>Protection Relay Secondary Injection Testing:</strong> Calibrating overcurrent (50/51), earth-fault (50N/51N), undervoltage (27), and directional relays to confirm protection coordination integrity.</p></li>\n  <li><p><strong>Infrared Thermography Inspection:</strong> Scanning busbar joints, terminations, and breaker connections under load to detect abnormal thermal signatures prior to planned shutdown.</p></li>\n</ol>\n<h3>Partner with PT Multi Daya Mitra for Switchgear Maintenance</h3>\n<p>PT Multi Daya Mitra provides certified electrical testing engineers equipped with calibrated testing equipment (Omicron, Megger, Fluke) to execute turnkey preventive maintenance during planned shutdowns or turnaround periods. We provide detailed condition assessment reports with actionable recommendations.</p>\n<p>Contact our engineering specialists:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Menjamin Keandalan, Keselamatan, dan Usia Pakai Aset Kelistrikan</h2>\n<p>Switchgear tegangan menengah (Medium Voltage / MV Switchgear) merupakan tulang punggung distribusi daya fasilitas industri, yang berfungsi melakukan switching, isolasi, dan proteksi jaringan listrik baik saat kondisi normal maupun saat terjadi gangguan arus hubung singkat. Seiring waktu, faktor lingkungan seperti debu, kelembapan, ekspansi termal, dan keausan mekanis dapat menurunkan kualitas isolasi dan kontak listrik. Program <strong>pemeliharaan preventif (preventive maintenance) terstruktur</strong> mampu mendeteksi potensi kerusakan sebelum berkembang menjadi ledakan busur api (arc-flash) atau pemadaman total pabrik.</p>\n<h3>Tujuan Utama Pemeliharaan Preventif Switchgear MV</h3>\n<ul>\n  <li><p><strong>Keandalan Sistem Distribusi:</strong> Mencegah trip mendadak dan menjaga pasokan listrik kontinu untuk lini produksi dan utilitas penting.</p></li>\n  <li><p><strong>Keselamatan Personel &amp; Fasilitas:</strong> Mereduksi bahaya arc-flash, percikan api internal, dan risiko ledakan kubikel.</p></li>\n  <li><p><strong>Memperpanjang Usia Pakai Peralatan:</strong> Mencegah degradasi dini pada vacuum interrupter, kompartemen SF6, isolator busbar, dan mekanisme pegas penggerak.</p></li>\n  <li><p><strong>Kepatuhan Regulasi &amp; Standar:</strong> Memenuhi standar internasional IEC 62271, IEEE, PUIL/SNI, serta audit kelayakan asuransi industri.</p></li>\n</ul>\n<h3>Ruang Lingkup Inspeksi &amp; Pengujian Diagnostik</h3>\n<p>Prosedur pemeliharaan switchgear MV oleh tim ahli kami mencakup seluruh komponen vital:</p>\n<ol>\n  <li><p><strong>Inspeksi Visual &amp; Pembersihan Mekanikal:</strong> Pembersihan kompartemen kubikel dari debu dan partikel konduktif, pemeriksaan interlock pintu, pelumasan mekanisme racking, dan verifikasi shutter otomatis.</p></li>\n  <li><p><strong>Uji Resistansi Kontak (Micro-Ohm / Ductor Test):</strong> Mengukur tahanan kontak utama pada pole circuit breaker (VCB/SF6) dan kluster tulip kontak untuk mencegah titik panas (hot-spot).</p></li>\n  <li><p><strong>Uji Tahanan Isolasi (Megger) &amp; Uji Tegangan Tinggi (Hi-Pot):</strong> Memeriksa kekuatan dielektrik isolasi busbar, trafo arus (CT), dan trafo tegangan (PT) antar-fasa dan fasa-ke-ground.</p></li>\n  <li><p><strong>Analisis Waktu Kerja Breaker (Timing Test):</strong> Mengukur waktu buka (opening time), waktu tutup (closing time), dan sinkronisasi tiga fasa sesuai spesifikasi pabrikan.</p></li>\n  <li><p><strong>Uji Injeksi Sekunder Relay Proteksi:</strong> Menguji keandalan dan waktu kerja relay proteksi arus lebih (50/51), gangguan tanah (50N/51N), dan tegangan kurang (27) untuk memastikan koordinasi proteksi bekerja tepat.</p></li>\n  <li><p><strong>Inspeksi Termografi Inframerah:</strong> Pemindaian termal pada sambungan busbar dan terminasi kabel saat berbeban guna mendeteksi panas abnormal sebelum shutdown terencana.</p></li>\n</ol>\n<h3>Layanan Pemeliharaan Switchgear oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra didukung oleh tim engineer berpengalaman dan instrumen uji presisi terkalibrasi (Omicron, Megger, Fluke) siap menangani pemeliharaan switchgear MV saat shutdown atau turnaround period secara tepat waktu dan aman.</p>\n<p>Konsultasikan jadwal pemeliharaan switchgear fasilitas Anda:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = '20mw-substation-commissioning-east-java';

-- ARTICLE: effects-of-harmonic-distortion
UPDATE news SET
  title = E'EN: Effects of Harmonics – Resonance in Industrial Electrical Systems\nID: Pengaruh Harmonisa – Resonansi pada Sistem Distribusi Listrik Industri',
  excerpt = E'EN: Understanding how harmonic currents, voltage distortion, and electrical resonance impact industrial power distribution, leading to transformer overheating, capacitor failure, and equipment malfunction.\nID: Memahami bagaimana arus harmonisa, distorsi tegangan, dan resonansi kelistrikan memengaruhi sistem distribusi daya industri, memicu panas berlebih pada transformator, kerusakan kapasitor, dan malfungsi peralatan.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Definisi dan Asal Muasal Harmonisa pada Distribusi Listrik</h2>\n<p>Dalam fasilitas industri modern, penggunaan perangkat elektronika daya telah mengubah karakteristik beban kelistrikan secara mendasar. Berbeda dengan beban linier konvensional yang menyerap arus sinusoidal murni sebanding dengan tegangan, peralatan modern merupakan <strong>beban non-linier</strong>. Beban ini menyerap arus dalam bentuk pulsa-pulsa tajam, yang menginjeksikan arus harmonisa dan mendistorsi gelombang sinusoidal fundamental 50 Hz pada jaringan distribusi listrik pabrik.</p>\n<h3>Sumber Utama Distorsi Harmonisa</h3>\n<p>Harmonisa terutama dihasilkan oleh peralatan industri berbasis konverter daya, seperti:</p>\n<ul>\n  <li><p><strong>Variable Speed Drive (VSD / Inverter Motor):</strong> Rangkaian rectifier 6-pulsa dan 12-pulsa pengatur putaran motor.</p></li>\n  <li><p><strong>Uninterruptible Power Supply (UPS):</strong> Rangkaian penyearah dan sistem pengisian baterai berkapasitas besar.</p></li>\n  <li><p><strong>Mesin Las Busur Listrik (Welder) &amp; Arc Furnace:</strong> Beban dinamis berfluktuasi tinggi yang menghasilkan spektrum harmonisa luas.</p></li>\n  <li><p><strong>Switching Power Supply (SMPS) &amp; Pencahayaan LED Industri:</strong> Menyumbang harmonisa orde ke-3, ke-5, dan ke-7 secara signifikan.</p></li>\n</ul>\n<h3>Fenomena Resonansi Harmonisa</h3>\n<p>Dampak paling berbahaya dari distorsi harmonisa adalah timbulnya <strong>resonansi kelistrikan</strong>. Resonansi terjadi ketika reaktansi induktif dari transformator daya berinteraksi sama besar dengan reaktansi kapasitif dari Bank Kapasitor (Power Factor Correction / PFC) pada frekuensi harmonisa tertentu:</p>\n<ul>\n  <li><p><strong>Resonansi Paralel:</strong> Terbentuk dari kombinasi induktansi transformator dan bank kapasitor. Arus harmonisa pada frekuensi resonansi ini akan diamplifikasi berkali-kali lipat, memicu lonjakan tegangan harmonisa tinggi (THD-V ekstrem) di busbar panel.</p></li>\n  <li><p><strong>Resonansi Seri:</strong> Menciptakan jalur impedansi sangat rendah menuju ground pada frekuensi tertentu, menarik arus harmonisa sangat besar melewati bank kapasitor hingga sekring putus atau modul kapasitor meledak.</p></li>\n</ul>\n<h3>Dampak Buruk pada Peralatan Pabrik</h3>\n<p>Bila total harmonic distortion melebihi ambang batas standar IEEE 519 atau regulasi PLN, berbagai dampak kerugian akan dialami:</p>\n<ol>\n  <li><p><strong>Overheating Transformator:</strong> Kerugian arus eddy dan kerugian stray load meningkat drastis, menyebabkan trafo cepat panas dan kapasitas daya efektifnya menurun (derating).</p></li>\n  <li><p><strong>Kerusakan Kapasitor Bank:</strong> Tegangan berlebih dan arus harmonisa tinggi menyebabkan kapasitor menggelembung (bulging), rusak isolasi dielektriknya, hingga memicu bahaya kebakaran.</p></li>\n  <li><p><strong>Malfungsi Relay &amp; PLC (Nuisance Tripping):</strong> Gelombang yang terdistorsi mengganggu deteksi zero-crossing pada perangkat elektronik sensitif, memicu trip palsu.</p></li>\n  <li><p><strong>Overload Penghantar Netral:</strong> Harmonisa urutan ke-3 (triplen harmonics) saling menjumlahkan diri pada kabel netral, membuat arus kabel netral melampaui kapasitas fasa.</p></li>\n</ol>\n<h3>Solusi Mitigasi Harmonisa oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra menyediakan solusi menyeluruh untuk audit dan mitigasi harmonisa di fasilitas industri:</p>\n<ul>\n  <li><p><strong>Audit Kualitas Daya (Power Quality Audit):</strong> Pengukuran dan perekaman komprehensif THD-V, THD-I, dan spektrum orde harmonisa hingga orde ke-50 menggunakan power quality analyzer terkalibrasi.</p></li>\n  <li><p><strong>Detuned Reactor pada Kapasitor:</strong> Pemasangan reaktor harmonisa (detuned reactor 7% atau 14%) secara seri dengan kapasitor untuk menggeser titik resonansi jauh di bawah orde harmonisa utama.</p></li>\n  <li><p><strong>Active Harmonic Filter (AHF):</strong> Instalasi filter aktif berbasis IGBT cerdas yang menginjeksikan arus balik secara real-time guna menekan THD-I di bawah 5%.</p></li>\n</ul>\n<p>Lindungi sistem kelistrikan pabrik Anda dari risiko resonansi harmonisa. Hubungi tim engineering kami:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Definition and Origin of Harmonics in Electrical Distribution</h2>\n<p>In modern industrial facilities, the widespread adoption of power electronic devices has fundamentally changed the nature of electrical loads. While traditional loads are linear (drawing sinusoidal current proportional to applied voltage), modern equipment utilizes <strong>non-linear loads</strong>. These non-linear loads draw current in abrupt pulses, injecting harmonic currents that distort the fundamental 50 Hz sinusoidal waveform across the power distribution network.</p>\n<h3>Common Sources of Harmonic Distortion</h3>\n<p>Harmonics are primarily generated by non-linear electronic equipment, including:</p>\n<ul>\n  <li><p><strong>Variable Speed Drives (VSD / VFD) and Inverters:</strong> 6-pulse and 12-pulse rectifiers driving induction motors.</p></li>\n  <li><p><strong>Uninterruptible Power Supplies (UPS):</strong> Double-conversion rectifier and battery-charging stages.</p></li>\n  <li><p><strong>Arc Furnaces &amp; Welding Equipment:</strong> Erratic arc dynamics creating broadband harmonic spectrums.</p></li>\n  <li><p><strong>Switching Power Supplies (SMPS) &amp; Industrial LED Lighting:</strong> Generating significant 3rd, 5th, and 7th harmonic orders.</p></li>\n</ul>\n<h3>The Phenomenon of Electrical Resonance</h3>\n<p>One of the most dangerous side effects of harmonic currents is <strong>harmonic resonance</strong>, which occurs when the inductive reactance of power transformers equals the capacitive reactance of Power Factor Correction (PFC) capacitor banks at a particular harmonic frequency:</p>\n<ul>\n  <li><p><strong>Parallel Resonance:</strong> Occurs when the transformer inductance and capacitor bank form a parallel resonant circuit. Harmonic currents matching this resonant frequency are magnified multiple times, generating extreme voltage distortion (THD-V) across switchgear and panels.</p></li>\n  <li><p><strong>Series Resonance:</strong> Occurs when the supply inductance and capacitor bank form a low-impedance path to ground, causing excessive harmonic currents to flow into the capacitor units, leading to blown fuses or ruptured casings.</p></li>\n</ul>\n<h3>Consequences on Industrial Equipment</h3>\n<p>If harmonic distortion exceeds recommended IEEE 519 standards, industrial operations face severe risks:</p>\n<ol>\n  <li><p><strong>Transformer Overheating:</strong> Increased eddy current and stray load losses dramatically elevate winding temperatures, demanding derating or causing insulation failure.</p></li>\n  <li><p><strong>Capacitor Bank Destruction:</strong> Overvoltage stress and excessive harmonic currents lead to capacitor bulging, dielectric breakdown, and fire hazards.</p></li>\n  <li><p><strong>Nuisance Tripping:</strong> Protection relays, circuit breakers, and sensitive PLC controllers malfunction due to zero-crossing distortion.</p></li>\n  <li><p><strong>Neutral Conductor Overloading:</strong> Triplen harmonics (3rd, 9th, 15th) accumulate in neutral conductors, causing neutral current to exceed phase current.</p></li>\n</ol>\n<h3>Harmonic Mitigation Solutions by PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra provides comprehensive power quality engineering services to diagnose and eliminate harmonic problems:</p>\n<ul>\n  <li><p><strong>Power Quality Audit:</strong> On-site measurement and class-A logging of THD-V, THD-I, and individual harmonic spectrums up to the 50th order.</p></li>\n  <li><p><strong>Detuned Filter Reactors:</strong> Installing detuned harmonic reactors (7%, 14%) in series with capacitor banks to shift resonance frequencies below the dominant harmonic orders.</p></li>\n  <li><p><strong>Active Harmonic Filters (AHF):</strong> Deploying dynamic IGBT-based active filters that inject canceling harmonic currents in real time, reducing THD-I below 5%.</p></li>\n</ul>\n<p>Protect your industrial network against harmonic resonance. Consult our power quality team:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Definisi dan Asal Muasal Harmonisa pada Distribusi Listrik</h2>\n<p>Dalam fasilitas industri modern, penggunaan perangkat elektronika daya telah mengubah karakteristik beban kelistrikan secara mendasar. Berbeda dengan beban linier konvensional yang menyerap arus sinusoidal murni sebanding dengan tegangan, peralatan modern merupakan <strong>beban non-linier</strong>. Beban ini menyerap arus dalam bentuk pulsa-pulsa tajam, yang menginjeksikan arus harmonisa dan mendistorsi gelombang sinusoidal fundamental 50 Hz pada jaringan distribusi listrik pabrik.</p>\n<h3>Sumber Utama Distorsi Harmonisa</h3>\n<p>Harmonisa terutama dihasilkan oleh peralatan industri berbasis konverter daya, seperti:</p>\n<ul>\n  <li><p><strong>Variable Speed Drive (VSD / Inverter Motor):</strong> Rangkaian rectifier 6-pulsa dan 12-pulsa pengatur putaran motor.</p></li>\n  <li><p><strong>Uninterruptible Power Supply (UPS):</strong> Rangkaian penyearah dan sistem pengisian baterai berkapasitas besar.</p></li>\n  <li><p><strong>Mesin Las Busur Listrik (Welder) &amp; Arc Furnace:</strong> Beban dinamis berfluktuasi tinggi yang menghasilkan spektrum harmonisa luas.</p></li>\n  <li><p><strong>Switching Power Supply (SMPS) &amp; Pencahayaan LED Industri:</strong> Menyumbang harmonisa orde ke-3, ke-5, dan ke-7 secara signifikan.</p></li>\n</ul>\n<h3>Fenomena Resonansi Harmonisa</h3>\n<p>Dampak paling berbahaya dari distorsi harmonisa adalah timbulnya <strong>resonansi kelistrikan</strong>. Resonansi terjadi ketika reaktansi induktif dari transformator daya berinteraksi sama besar dengan reaktansi kapasitif dari Bank Kapasitor (Power Factor Correction / PFC) pada frekuensi harmonisa tertentu:</p>\n<ul>\n  <li><p><strong>Resonansi Paralel:</strong> Terbentuk dari kombinasi induktansi transformator dan bank kapasitor. Arus harmonisa pada frekuensi resonansi ini akan diamplifikasi berkali-kali lipat, memicu lonjakan tegangan harmonisa tinggi (THD-V ekstrem) di busbar panel.</p></li>\n  <li><p><strong>Resonansi Seri:</strong> Menciptakan jalur impedansi sangat rendah menuju ground pada frekuensi tertentu, menarik arus harmonisa sangat besar melewati bank kapasitor hingga sekring putus atau modul kapasitor meledak.</p></li>\n</ul>\n<h3>Dampak Buruk pada Peralatan Pabrik</h3>\n<p>Bila total harmonic distortion melebihi ambang batas standar IEEE 519 atau regulasi PLN, berbagai dampak kerugian akan dialami:</p>\n<ol>\n  <li><p><strong>Overheating Transformator:</strong> Kerugian arus eddy dan kerugian stray load meningkat drastis, menyebabkan trafo cepat panas dan kapasitas daya efektifnya menurun (derating).</p></li>\n  <li><p><strong>Kerusakan Kapasitor Bank:</strong> Tegangan berlebih dan arus harmonisa tinggi menyebabkan kapasitor menggelembung (bulging), rusak isolasi dielektriknya, hingga memicu bahaya kebakaran.</p></li>\n  <li><p><strong>Malfungsi Relay &amp; PLC (Nuisance Tripping):</strong> Gelombang yang terdistorsi mengganggu deteksi zero-crossing pada perangkat elektronik sensitif, memicu trip palsu.</p></li>\n  <li><p><strong>Overload Penghantar Netral:</strong> Harmonisa urutan ke-3 (triplen harmonics) saling menjumlahkan diri pada kabel netral, membuat arus kabel netral melampaui kapasitas fasa.</p></li>\n</ol>\n<h3>Solusi Mitigasi Harmonisa oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra menyediakan solusi menyeluruh untuk audit dan mitigasi harmonisa di fasilitas industri:</p>\n<ul>\n  <li><p><strong>Audit Kualitas Daya (Power Quality Audit):</strong> Pengukuran dan perekaman komprehensif THD-V, THD-I, dan spektrum orde harmonisa hingga orde ke-50 menggunakan power quality analyzer terkalibrasi.</p></li>\n  <li><p><strong>Detuned Reactor pada Kapasitor:</strong> Pemasangan reaktor harmonisa (detuned reactor 7% atau 14%) secara seri dengan kapasitor untuk menggeser titik resonansi jauh di bawah orde harmonisa utama.</p></li>\n  <li><p><strong>Active Harmonic Filter (AHF):</strong> Instalasi filter aktif berbasis IGBT cerdas yang menginjeksikan arus balik secara real-time guna menekan THD-I di bawah 5%.</p></li>\n</ul>\n<p>Lindungi sistem kelistrikan pabrik Anda dari risiko resonansi harmonisa. Hubungi tim engineering kami:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'effects-of-harmonic-distortion';

-- ARTICLE: energy-monitoring-system-launch
UPDATE news SET
  title = E'EN: Energy Monitoring System for Sustainability & ESG Reporting\nID: Sistem Monitoring Energi Cerdas untuk Keberlanjutan & Pelaporan ESG',
  excerpt = E'EN: PT Multi Daya Mitra deploys smart energy monitoring systems integrated with industrial IoT and SCADA, enabling real-time energy intelligence, cost reduction, and automated ESG carbon-emission reporting.\nID: PT Multi Daya Mitra menghadirkan sistem monitoring energi cerdas terintegrasi IoT dan SCADA industri untuk pemantauan konsumsi daya real-time, efisiensi biaya operasional, dan pelaporan emisi karbon ESG otomatis.',
  body = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h2>Mengubah Data Energi Menjadi Dampak Bisnis yang Terukur</h2>\n<p>Di tengah tuntutan efisiensi operasional dan target dekarbonisasi industri global, manajemen energi telah bergeser dari sekadar tugas utilitas rutin menjadi prioritas strategis perusahaan. PT Multi Daya Mitra menghadirkan <strong>Sistem Monitoring Energi Cerdas (Smart Energy Monitoring System - SEMS)</strong> berstandar industri yang terintegrasi dengan platform SCADA dan IoT, mengubah pembacaan parameter kelistrikan menjadi wawasan analitik mendalam bagi manajemen pabrik, tim engineering, dan divisi pelaporan ESG.</p>\n<h3>Arsitektur Sistem Monitoring Energi Terintegrasi</h3>\n<p>Solusi kami menghubungkan aset kelistrikan fisik ke antarmuka visualisasi terpusat melalui empat lapisan arsitektur andal:</p>\n<ol>\n  <li><p><strong>Lapisan Pengukuran (Measurement Layer):</strong> Pemasangan digital power meter berpresisi tinggi (Class 0.2S / 0.5S) pada Main Distribution Panel (MDP), Sub-Distribution Panel (SDP), trafo distribusi, sistem chiller, dan Motor Control Center (MCC).</p></li>\n  <li><p><strong>Konektivitas Edge &amp; Telemetri:</strong> Gateway IoT industri yang mengumpulkan data secara kontinu melalui protokol Modbus RTU/TCP, BACnet, dan OPC-UA menggunakan jaringan kabel optik atau nirkabel yang aman.</p></li>\n  <li><p><strong>Mesin Analitik &amp; Komputasi:</strong> Pengolahan otomatis parameter tegangan, arus, daya aktif (kW), daya semu (kVA), faktor daya (cos phi), konsumsi kWh, beban puncak, dan distorsi harmonisa (THD).</p></li>\n  <li><p><strong>Dashboard Visualisasi &amp; Laporan ESG:</strong> Tampilan SCADA visual on-premise maupun cloud yang menyajikan grafik tren real-time, perbandingan konsumsi antar-shift, serta ekspor laporan kepatuhan otomatis.</p></li>\n</ol>\n<h3>Fitur Unggulan Sistem</h3>\n<ul>\n  <li><p><strong>120+ Titik Pengukuran Terpadu:</strong> Monitoring menyeluruh pemakaian listrik, air, gas, dan udara bertekanan (compressed air) dalam satu antarmuka tunggal.</p></li>\n  <li><p><strong>Sub-Metering per Lini Produksi:</strong> Alokasi biaya energi yang presisi per mesin atau per batch produksi untuk mendeteksi pemborosan saat mesin dalam kondisi stand-by.</p></li>\n  <li><p><strong>Manajemen Beban Puncak (Peak Demand):</strong> Notifikasi peringatan dini sebelum batas daya kontrak (kVA) terlampaui guna menghindari denda kelebihan beban dari PLN.</p></li>\n  <li><p><strong>Kalkulasi Emisi Karbon Scope 2 Otomatis:</strong> Konversi langsung konsumsi listrik (kWh) menjadi metrik emisi gas rumah kaca (tCO₂e) sesuai standar GHG Protocol untuk kebutuhan audit ESG dan sertifikasi ISO 50001.</p></li>\n  <li><p><strong>Deteksi Dini Gangguan Listrik:</strong> Alarm instan untuk ketidakseimbangan fasa (phase unbalance), penurunan faktor daya di bawah 0.85, serta indikasi distorsi tegangan.</p></li>\n</ul>\n<h3>Efisiensi Nyata untuk Fasilitas Industri</h3>\n<p>Pabrik dan gedung komersial yang mengadopsi sistem monitoring energi kami mencatatkan <strong>penghematan biaya listrik rata-rata 8% hingga 15%</strong> pada tahun pertama implementasi, sekaligus menghemat ratusan jam kerja staf teknis dalam pengumpulan data manual.</p>\n<h3>Layanan Turnkey oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra melayani implementasi end-to-end: mulai dari audit kelayakan, suplai power meter, retrofit panel, pemrograman gateway dan SCADA, hingga pelatihan komprehensif bagi operator dan tim manajemen fasilitas Anda.</p>\n<p>Konsultasikan kebutuhan smart energy monitoring bersama kami:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"en":{"blocks":[{"type":"html","html":"<h2>Turning Energy Data into Measurable Business Impact</h2>\n<p>As modern manufacturing industries advance toward net-zero targets and cost optimization, energy management has transitioned from a routine facility task into a strategic operational priority. PT Multi Daya Mitra deploys industrial-grade <strong>Smart Energy Monitoring Systems (SEMS)</strong> integrated with SCADA and IoT platforms, transforming raw power measurements into actionable intelligence for plant managers, utility supervisors, and corporate sustainability executives.</p>\n<h3>Core Architecture of the Smart Energy Monitoring Platform</h3>\n<p>Our solution links physical electrical assets to an intuitive centralized visualization platform through four robust architectural layers:</p>\n<ol>\n  <li><p><strong>Measurement Layer:</strong> High-precision digital power meters (Class 0.2S / 0.5S) installed across Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), transformer secondaries, chillers, and critical motor control centers (MCC).</p></li>\n  <li><p><strong>Edge Connectivity &amp; Telemetry:</strong> Industrial IoT gateways acquiring data via Modbus RTU/TCP, BACnet, and OPC-UA over secure Ethernet, fiber-optic, and wireless telemetry networks.</p></li>\n  <li><p><strong>Analytics &amp; Processing Engine:</strong> Automated aggregation of voltage, current, active power (kW), apparent power (kVA), power factor (PF), peak demand, and total harmonic distortion (THD).</p></li>\n  <li><p><strong>Visualization &amp; ESG Reporting Dashboard:</strong> Cloud or on-premise SCADA dashboards offering customizable KPI widgets, automated alerts, and exportable regulatory reporting modules.</p></li>\n</ol>\n<h3>Key Features &amp; Capabilities</h3>\n<ul>\n  <li><p><strong>120+ Electrical &amp; Utility Measurement Points:</strong> Unified dashboard tracking power, water, steam, and compressed air across distributed facilities.</p></li>\n  <li><p><strong>Sub-Metering Granularity:</strong> Departmental, machine-level, and production-line cost allocation to identify inefficient production cycles and idle equipment losses.</p></li>\n  <li><p><strong>Peak Demand Management:</strong> Automated threshold alerts preventing costly maximum demand penalties from utility providers (PLN kVA limits).</p></li>\n  <li><p><strong>Automated Scope 2 Carbon Emission Tracking:</strong> Real-time conversion of kWh consumption into GHG Protocol compliant CO₂ equivalent (tCO₂e) metrics for ESG corporate sustainability audits.</p></li>\n  <li><p><strong>Predictive Anomaly Detection:</strong> Early warning notifications for phase imbalance, power factor drops below 0.85, and voltage sag/swell occurrences.</p></li>\n</ul>\n<h3>Measurable ROI for Industrial Operations</h3>\n<p>Facilities implementing our Smart Energy Monitoring System typically experience <strong>8% to 15% reductions in overall electrical utility expenditure</strong> within the first year by eliminating baseline leakage, optimizing chiller schedules, and avoiding utility penalty tariffs. Furthermore, automated reporting saves hundreds of engineering hours during annual ISO 50001 and ESG compliance audits.</p>\n<h3>End-to-End Implementation by PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra provides complete turnkey engineering — including energy auditing, meter sizing, panel retrofit, gateway installation, software commissioning, and staff training. Connect with our engineering experts to modernize your plant''s energy intelligence.</p>\n<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]},"blocks":[{"type":"html","html":"<h2>Mengubah Data Energi Menjadi Dampak Bisnis yang Terukur</h2>\n<p>Di tengah tuntutan efisiensi operasional dan target dekarbonisasi industri global, manajemen energi telah bergeser dari sekadar tugas utilitas rutin menjadi prioritas strategis perusahaan. PT Multi Daya Mitra menghadirkan <strong>Sistem Monitoring Energi Cerdas (Smart Energy Monitoring System - SEMS)</strong> berstandar industri yang terintegrasi dengan platform SCADA dan IoT, mengubah pembacaan parameter kelistrikan menjadi wawasan analitik mendalam bagi manajemen pabrik, tim engineering, dan divisi pelaporan ESG.</p>\n<h3>Arsitektur Sistem Monitoring Energi Terintegrasi</h3>\n<p>Solusi kami menghubungkan aset kelistrikan fisik ke antarmuka visualisasi terpusat melalui empat lapisan arsitektur andal:</p>\n<ol>\n  <li><p><strong>Lapisan Pengukuran (Measurement Layer):</strong> Pemasangan digital power meter berpresisi tinggi (Class 0.2S / 0.5S) pada Main Distribution Panel (MDP), Sub-Distribution Panel (SDP), trafo distribusi, sistem chiller, dan Motor Control Center (MCC).</p></li>\n  <li><p><strong>Konektivitas Edge &amp; Telemetri:</strong> Gateway IoT industri yang mengumpulkan data secara kontinu melalui protokol Modbus RTU/TCP, BACnet, dan OPC-UA menggunakan jaringan kabel optik atau nirkabel yang aman.</p></li>\n  <li><p><strong>Mesin Analitik &amp; Komputasi:</strong> Pengolahan otomatis parameter tegangan, arus, daya aktif (kW), daya semu (kVA), faktor daya (cos phi), konsumsi kWh, beban puncak, dan distorsi harmonisa (THD).</p></li>\n  <li><p><strong>Dashboard Visualisasi &amp; Laporan ESG:</strong> Tampilan SCADA visual on-premise maupun cloud yang menyajikan grafik tren real-time, perbandingan konsumsi antar-shift, serta ekspor laporan kepatuhan otomatis.</p></li>\n</ol>\n<h3>Fitur Unggulan Sistem</h3>\n<ul>\n  <li><p><strong>120+ Titik Pengukuran Terpadu:</strong> Monitoring menyeluruh pemakaian listrik, air, gas, dan udara bertekanan (compressed air) dalam satu antarmuka tunggal.</p></li>\n  <li><p><strong>Sub-Metering per Lini Produksi:</strong> Alokasi biaya energi yang presisi per mesin atau per batch produksi untuk mendeteksi pemborosan saat mesin dalam kondisi stand-by.</p></li>\n  <li><p><strong>Manajemen Beban Puncak (Peak Demand):</strong> Notifikasi peringatan dini sebelum batas daya kontrak (kVA) terlampaui guna menghindari denda kelebihan beban dari PLN.</p></li>\n  <li><p><strong>Kalkulasi Emisi Karbon Scope 2 Otomatis:</strong> Konversi langsung konsumsi listrik (kWh) menjadi metrik emisi gas rumah kaca (tCO₂e) sesuai standar GHG Protocol untuk kebutuhan audit ESG dan sertifikasi ISO 50001.</p></li>\n  <li><p><strong>Deteksi Dini Gangguan Listrik:</strong> Alarm instan untuk ketidakseimbangan fasa (phase unbalance), penurunan faktor daya di bawah 0.85, serta indikasi distorsi tegangan.</p></li>\n</ul>\n<h3>Efisiensi Nyata untuk Fasilitas Industri</h3>\n<p>Pabrik dan gedung komersial yang mengadopsi sistem monitoring energi kami mencatatkan <strong>penghematan biaya listrik rata-rata 8% hingga 15%</strong> pada tahun pertama implementasi, sekaligus menghemat ratusan jam kerja staf teknis dalam pengumpulan data manual.</p>\n<h3>Layanan Turnkey oleh PT Multi Daya Mitra</h3>\n<p>PT Multi Daya Mitra melayani implementasi end-to-end: mulai dari audit kelayakan, suplai power meter, retrofit panel, pemrograman gateway dan SCADA, hingga pelatihan komprehensif bagi operator dan tim manajemen fasilitas Anda.</p>\n<p>Konsultasikan kebutuhan smart energy monitoring bersama kami:<br>📱 +62 821-4007-4122<br>📧 <a href=\"mailto:info@multidayamitra.co.id\">info@multidayamitra.co.id</a></p>"}]}'::jsonb,
  updated_at = now()
WHERE slug = 'energy-monitoring-system-launch';

COMMIT;




-- ==========================================
-- Migration: 037_bilingual_products_and_services_fix.up.sql
-- ==========================================

-- 037_bilingual_products_and_services_fix.up.sql
-- Synchronize bilingual content (ID & EN) for legacy products and services that displayed ⚠️ ID Kosong in Admin CMS

BEGIN;

-- ==========================================
-- PRODUCTS FIX (4 TARGET PRODUCTS)
-- ==========================================

-- PRODUCT: rittal-distributor/enclosures (slug: enclosures)
UPDATE products SET
  title = E'EN: Rittal Enclosure Systems (VX25, AX, KX)
ID: Sistem Enclosure Rittal (VX25, AX, KX)',
  summary = E'EN: Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.
ID: Sistem enclosure besar baying resmi Rittal (VX25), enclosure kompak (AX), kotak terminal kecil (KX), dan rak server IT outdoor.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Arsitektur Enclosure Modular Rittal</h3>\n<p>Sistem enclosure modular Rittal adalah standar emas global untuk switchgear tegangan rendah, motor control center (MCC), kabinet kontrol otomasi industri, dan infrastruktur rak server IT. Dirancang dengan pola kisi simetris 25 mm DIN, rangka VX25 meniadakan kebutuhan pengeboran dan memungkinkan instalasi interior yang cepat dan bebas perkakas di dua level pemasangan.</p>\n<h3>Sistem Enclosure Baying Besar VX25</h3>\n<p>Seri unggulan VX25 menyediakan kapabilitas penggabungan (baying) di keempat sisi, ruang dalam yang maksimal, serta kapasitas beban kokoh hingga 15.000 N. Sangat kompatibel dengan pemotongan laser otomatis dan rekayasa digital twin melalui perangkat lunak Eplan.</p>\n<h3>Enclosure Kompak AX & Enclosure Kecil KX</h3>\n<p>Seri AX mengadopsi logika sistem VX25 ke dalam enclosure kompak dinding dengan arah buka pintu yang dapat dibalik tanpa perkakas serta rel pemosisian terintegrasi. Kotak terminal KX dilengkapi kunci cam mini 180° lepas-cepat untuk distribusi sensor lapangan dan bus hemat ruang.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Rittal Modular Enclosure Architecture</h3>\n<p>Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels.</p>\n<h3>VX25 Large Baying Enclosure Systems</h3>\n<p>The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software.</p>\n<h3>AX Compact Enclosures & KX Small Enclosures</h3>\n<p>The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Rittal Modular Enclosure Architecture</h3>\n<p>Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels.</p>\n<h3>VX25 Large Baying Enclosure Systems</h3>\n<p>The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software.</p>\n<h3>AX Compact Enclosures & KX Small Enclosures</h3>\n<p>The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution.</p>\nID: <h3>Arsitektur Enclosure Modular Rittal</h3>\n<p>Sistem enclosure modular Rittal adalah standar emas global untuk switchgear tegangan rendah, motor control center (MCC), kabinet kontrol otomasi industri, dan infrastruktur rak server IT. Dirancang dengan pola kisi simetris 25 mm DIN, rangka VX25 meniadakan kebutuhan pengeboran dan memungkinkan instalasi interior yang cepat dan bebas perkakas di dua level pemasangan.</p>\n<h3>Sistem Enclosure Baying Besar VX25</h3>\n<p>Seri unggulan VX25 menyediakan kapabilitas penggabungan (baying) di keempat sisi, ruang dalam yang maksimal, serta kapasitas beban kokoh hingga 15.000 N. Sangat kompatibel dengan pemotongan laser otomatis dan rekayasa digital twin melalui perangkat lunak Eplan.</p>\n<h3>Enclosure Kompak AX & Enclosure Kecil KX</h3>\n<p>Seri AX mengadopsi logika sistem VX25 ke dalam enclosure kompak dinding dengan arah buka pintu yang dapat dibalik tanpa perkakas serta rel pemosisian terintegrasi. Kotak terminal KX dilengkapi kunci cam mini 180° lepas-cepat untuk distribusi sensor lapangan dan bus hemat ruang.</p>"}]}'::jsonb,
  specs = '{"EN: Series\nID: Seri Produk":"VX25, AX, KX, CS Toptec, IT Network Racks","EN: Frame Pitch\nID: Pola Kisi Rangka":"25 mm DIN standard symmetrical grid","EN: Protection Rating\nID: Tingkat Proteksi":"IP55 / IP66 / NEMA 4X / NEMA 12","EN: Material & Finish\nID: Material & Lapisan":"Sheet steel RAL 7035 / Stainless steel AISI 304 & 316L","EN: Certifications\nID: Sertifikasi":"IEC 62208, UL 508A, DNV-GL, CE, RoHS","EN: Target Applications\nID: Aplikasi Utama":"LV Switchboards, MCC Panels, Automation Control, IT Server Racks"}'::jsonb,
  updated_at = now()
WHERE full_path = 'rittal-distributor/enclosures' OR slug = 'enclosures' OR title = 'Rittal Enclosure Systems (VX25, AX, KX)';

-- PRODUCT: rittal-distributor/power-distribution (slug: power-distribution)
UPDATE products SET
  title = E'EN: Rittal Power Distribution (Ri4Power & RiLine)
ID: Sistem Distribusi Daya Rittal (Ri4Power & RiLine)',
  summary = E'EN: Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.
ID: Sistem distribusi daya busbar dan switchgear tegangan rendah teruji tipe (type-tested) hingga 6300A sesuai standar IEC 61439-1/-2.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Distribusi Daya Teruji Tipe</h3>\n<p>Platform distribusi daya modular Rittal Ri4Power dan RiLine memungkinkan panel builder dan system integrator merakit switchgear tegangan rendah bersertifikasi type-tested penuh hingga 6300A dengan pemisahan internal Form 1 hingga Form 4b sesuai standar IEC 61439-1/-2.</p>\n<h3>Switchgear Tegangan Rendah Modular Ri4Power</h3>\n<p>Dirancang khusus untuk kabinet VX25, mendukung Air Circuit Breaker (ACB) dan Moulded Case Circuit Breaker (MCCB) kelas atas dengan pemegang busbar tembaga teroptimasi, penahanan busur api (arc fault), dan bagian terminasi kabel standar.</p>\n<h3>Sistem Busbar Bebas Pengeboran RiLine</h3>\n<p>Sistem busbar jarak antar pusat 60 mm dan 185 mm yang cepat dipasang tanpa perlu pengeboran hingga 2100A, dilengkapi penutup sentuh aman (touch-safe), adaptor komponen sistem klik, dan sakelar pemutus sekring NH untuk perakitan yang aman dan rapi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Tested Power Distribution Systems</h3>\n<p>Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2.</p>\n<h3>Ri4Power Modular LV Switchgear</h3>\n<p>Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections.</p>\n<h3>RiLine Drill-Free Busbar System</h3>\n<p>Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Tested Power Distribution Systems</h3>\n<p>Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2.</p>\n<h3>Ri4Power Modular LV Switchgear</h3>\n<p>Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections.</p>\n<h3>RiLine Drill-Free Busbar System</h3>\n<p>Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly.</p>\nID: <h3>Sistem Distribusi Daya Teruji Tipe</h3>\n<p>Platform distribusi daya modular Rittal Ri4Power dan RiLine memungkinkan panel builder dan system integrator merakit switchgear tegangan rendah bersertifikasi type-tested penuh hingga 6300A dengan pemisahan internal Form 1 hingga Form 4b sesuai standar IEC 61439-1/-2.</p>\n<h3>Switchgear Tegangan Rendah Modular Ri4Power</h3>\n<p>Dirancang khusus untuk kabinet VX25, mendukung Air Circuit Breaker (ACB) dan Moulded Case Circuit Breaker (MCCB) kelas atas dengan pemegang busbar tembaga teroptimasi, penahanan busur api (arc fault), dan bagian terminasi kabel standar.</p>\n<h3>Sistem Busbar Bebas Pengeboran RiLine</h3>\n<p>Sistem busbar jarak antar pusat 60 mm dan 185 mm yang cepat dipasang tanpa perlu pengeboran hingga 2100A, dilengkapi penutup sentuh aman (touch-safe), adaptor komponen sistem klik, dan sakelar pemutus sekring NH untuk perakitan yang aman dan rapi.</p>"}]}'::jsonb,
  specs = '{"EN: Rated Current (In)\nID: Arus Pengenal (In)":"Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)","EN: Short-Circuit Rating (Icw)\nID: Ketahanan Hubung Singkat":"Up to 120 kA (1s withstand)","EN: Internal Separation\nID: Pemisahan Internal":"Form 1, Form 2b, Form 3b, Form 4a, Form 4b","EN: Busbar Centers\nID: Jarak Pusat Busbar":"60 mm & 185 mm drill-free mounting systems","EN: Standards\nID: Standar":"IEC 61439-1, IEC 61439-2, DIN EN 61439"}'::jsonb,
  updated_at = now()
WHERE full_path = 'rittal-distributor/power-distribution' OR slug = 'power-distribution' OR title = 'Rittal Power Distribution (Ri4Power & RiLine)';

-- PRODUCT: schneider-integrator/electrical-distribution-integration (slug: electrical-distribution-integration)
UPDATE products SET
  title = E'EN: Electrical Distribution Integration (MasterPact & Prisma)
ID: Integrasi Distribusi Elektrikal (MasterPact & Prisma)',
  summary = E'EN: MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.
ID: Circuit breaker udara MasterPact MTZ/NW, pemutus sirkuit cetak Compact NSX, dan integrasi switchboard type-tested Prisma.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Integrasi Distribusi Daya Tegangan Rendah</h3>\n<p>PT Multi Daya Mitra mengintegrasikan pemutus sirkuit udara (ACB) Schneider Electric MasterPact MTZ dan pemutus sirkuit cetak (MCCB) Compact NSX ke dalam sistem switchboard modular Prisma, menghadirkan distribusi tenaga listrik mutakhir dengan konektivitas digital terpadu.</p>\n<h3>MasterPact MTZ dengan Unit Kontrol MicroLogic X</h3>\n<p>Dilengkapi pengukuran daya & energi Kelas 1 terintegrasi, diagnostik nirkabel ponsel pintar seketika melalui Bluetooth/NFC, dan komunikasi dual-Ethernet untuk koneksi langsung ke sistem SCADA/PME tanpa memerlukan transduser eksternal.</p>\n<h3>Arsitektur Switchboard Teruji Tipe Prisma</h3>\n<p>Arsitektur modular tersertifikasi IEC 61439 yang menjamin keselamatan maksimal terhadap bahaya percikan busur api (arc fault), pelepasan panas termal teroptimasi, dan kemudahan ekspansi kapasitas di masa depan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Integrated Low Voltage Power Distribution</h3>\n<p>PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity.</p>\n<h3>MasterPact MTZ with MicroLogic X Control Units</h3>\n<p>Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers.</p>\n<h3>Prisma Type-Tested Switchboard Architecture</h3>\n<p>IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Integrated Low Voltage Power Distribution</h3>\n<p>PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity.</p>\n<h3>MasterPact MTZ with MicroLogic X Control Units</h3>\n<p>Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers.</p>\n<h3>Prisma Type-Tested Switchboard Architecture</h3>\n<p>IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion.</p>\nID: <h3>Integrasi Distribusi Daya Tegangan Rendah</h3>\n<p>PT Multi Daya Mitra mengintegrasikan pemutus sirkuit udara (ACB) Schneider Electric MasterPact MTZ dan pemutus sirkuit cetak (MCCB) Compact NSX ke dalam sistem switchboard modular Prisma, menghadirkan distribusi tenaga listrik mutakhir dengan konektivitas digital terpadu.</p>\n<h3>MasterPact MTZ dengan Unit Kontrol MicroLogic X</h3>\n<p>Dilengkapi pengukuran daya & energi Kelas 1 terintegrasi, diagnostik nirkabel ponsel pintar seketika melalui Bluetooth/NFC, dan komunikasi dual-Ethernet untuk koneksi langsung ke sistem SCADA/PME tanpa memerlukan transduser eksternal.</p>\n<h3>Arsitektur Switchboard Teruji Tipe Prisma</h3>\n<p>Arsitektur modular tersertifikasi IEC 61439 yang menjamin keselamatan maksimal terhadap bahaya percikan busur api (arc fault), pelepasan panas termal teroptimasi, dan kemudahan ekspansi kapasitas di masa depan.</p>"}]}'::jsonb,
  specs = '{"EN: Circuit Breakers\nID: Pemutus Sirkuit":"MasterPact MTZ (up to 6300A), Compact NSX/NSXm (16-630A)","EN: Trip Units\nID: Unit Trip Kontrol":"MicroLogic X with integrated Class 1 active energy measurement","EN: Enclosure System\nID: Sistem Enclosure":"Schneider PrismaSeT G & P type-tested modular switchboards","EN: Connectivity\nID: Konektivitas":"Embedded Bluetooth, NFC, Ethernet Modbus TCP communications","EN: Standards\nID: Standar":"IEC 60947-2, IEC 61439-1/-2, UL 489"}'::jsonb,
  updated_at = now()
WHERE full_path = 'schneider-integrator/electrical-distribution-integration' OR slug = 'electrical-distribution-integration' OR title = 'Electrical Distribution Integration (MasterPact & Prisma)';

-- PRODUCT: automation-control/scada-xarrow-telemetry (slug: scada-xarrow-telemetry)
UPDATE products SET
  title = E'EN: SCADA Systems & Process Monitoring (xArrow)
ID: Sistem SCADA & Pemantauan Proses (xArrow)',
  summary = E'EN: High-performance SCADA software, real-time telemetry, alarm management, historical trending, and industrial IoT dashboards.
ID: Perangkat lunak SCADA berkinerja tinggi, telemetri real-time, manajemen alarm, grafik tren historis, dan dashboard IoT industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Supervisi Proses Industri Terpusat</h3>\n<p>Solusi SCADA xArrow dan pemantauan proses terpusat memungkinkan manajer pabrik memvisualisasikan status mesin, mencatat metrik produksi, merekam alarm kritis, serta menerima notifikasi insiden langsung di komputer maupun perangkat seluler.</p>\n<h3>Telemetri Berkecepatan Tinggi & Dukungan Multi-Protokol</h3>\n<p>Dukungan komunikasi langsung untuk protokol standar industri termasuk OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, dan REST API, menjembatani otomasi lantai pabrik dengan sistem ERP manajemen.</p>\n<h3>Grafik Tren Historis & Audit Kepatuhan Regulasi</h3>\n<p>Pencatatan data berbasis SQL berkecepatan tinggi, visual animasi interaktif, laporan rekap kerja otomatis, dan jejak audit (audit trail) antipemalsuan sesuai regulasi ketat industri makanan, farmasi, dan manufaktur.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Centralized Industrial Process Supervision</h3>\n<p>xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, log critical alarms, and receive instant alert dispatches across desktop and mobile devices.</p>\n<h3>High Performance Telemetry & Multi-Protocol Driver Support</h3>\n<p>Native communication support for industry-standard protocols including OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, and REST APIs, bridging shop-floor automation with enterprise ERP systems.</p>\n<h3>Historical Trending & Compliance Auditing</h3>\n<p>High-speed SQL data logging, interactive animated graphics, automated shift reports, and tamper-evident audit trails designed to meet stringent food, pharmaceutical, and manufacturing regulations.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Centralized Industrial Process Supervision</h3>\n<p>xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, log critical alarms, and receive instant alert dispatches across desktop and mobile devices.</p>\n<h3>High Performance Telemetry & Multi-Protocol Driver Support</h3>\n<p>Native communication support for industry-standard protocols including OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, and REST APIs, bridging shop-floor automation with enterprise ERP systems.</p>\n<h3>Historical Trending & Compliance Auditing</h3>\n<p>High-speed SQL data logging, interactive animated graphics, automated shift reports, and tamper-evident audit trails designed to meet stringent food, pharmaceutical, and manufacturing regulations.</p>\nID: <h3>Supervisi Proses Industri Terpusat</h3>\n<p>Solusi SCADA xArrow dan pemantauan proses terpusat memungkinkan manajer pabrik memvisualisasikan status mesin, mencatat metrik produksi, merekam alarm kritis, serta menerima notifikasi insiden langsung di komputer maupun perangkat seluler.</p>\n<h3>Telemetri Berkecepatan Tinggi & Dukungan Multi-Protokol</h3>\n<p>Dukungan komunikasi langsung untuk protokol standar industri termasuk OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, dan REST API, menjembatani otomasi lantai pabrik dengan sistem ERP manajemen.</p>\n<h3>Grafik Tren Historis & Audit Kepatuhan Regulasi</h3>\n<p>Pencatatan data berbasis SQL berkecepatan tinggi, visual animasi interaktif, laporan rekap kerja otomatis, dan jejak audit (audit trail) antipemalsuan sesuai regulasi ketat industri makanan, farmasi, dan manufaktur.</p>"}]}'::jsonb,
  specs = '{"EN: Software\nID: Perangkat Lunak":"xArrow SCADA Industrial Edition","EN: Architecture\nID: Arsitektur":"Client-Server / Web-Based / Cloud-Ready","EN: Protocols\nID: Protokol Komunikasi":"OPC UA, Modbus TCP/RTU, MQTT, REST API","EN: Tags Capacity\nID: Kapasitas Tag":"Unlimited I/O Tag Packages"}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-control/scada-xarrow-telemetry' OR slug = 'scada-xarrow-telemetry' OR title = 'SCADA Systems & Process Monitoring (xArrow)';

-- ==========================================
-- SERVICES FIX (6 TARGET SERVICES)
-- ==========================================

-- SERVICE: electrical-construction-installation/fire-alarm-system-installation (slug: fire-alarm-system-installation)
UPDATE services SET
  title = E'EN: Fire Alarm System Engineering & Installation
ID: Rekayasa & Instalasi Sistem Fire Alarm',
  summary = E'EN: Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.
ID: Jaringan fire alarm addressable terintegrasi, detektor multi-sensor, aspirating smoke detection, dan sistem pemadam clean agent.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>\n<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>\n<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>\n<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>\n<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>\n<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Turnkey Industrial Fire Safety Engineering</h3>\n<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>\n<h3>Addressable Detection & Smoke Aspiration</h3>\n<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>\n<h3>Clean Agent Suppression & BMS Interlock</h3>\n<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Turnkey Industrial Fire Safety Engineering</h3>\n<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>\n<h3>Addressable Detection & Smoke Aspiration</h3>\n<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>\n<h3>Clean Agent Suppression & BMS Interlock</h3>\n<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>\nID: <h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>\n<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>\n<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>\n<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>\n<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>\n<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/fire-alarm-system-installation' OR slug = 'fire-alarm-system-installation' OR title = 'Fire Alarm System Engineering & Installation';

-- SERVICE: electrical-maintenance-service/mv-cubicle-acb-maintenance (slug: mv-cubicle-acb-maintenance)
UPDATE services SET
  title = E'EN: MV Cubicle & ACB Maintenance (Trip Testing)
ID: Pemeliharaan Kubikel MV & ACB (Pengujian Trip)',
  summary = E'EN: Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.
ID: Servis preventif switchgear tegangan menengah, uji resistansi kontak (Ductor), uji isolasi, dan injeksi sekunder ACB.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>\n<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>\n<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>\n<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>\n<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>\n<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>\n<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>\n<h3>Contact Resistance & Insulation Resistance Testing</h3>\n<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>\n<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>\n<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>\n<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>\n<h3>Contact Resistance & Insulation Resistance Testing</h3>\n<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>\n<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>\n<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>\nID: <h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>\n<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>\n<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>\n<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>\n<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>\n<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/mv-cubicle-acb-maintenance' OR slug = 'mv-cubicle-acb-maintenance' OR title = 'MV Cubicle & ACB Maintenance (Trip Testing)';

-- SERVICE: automation-solutions-services/scada-hmi-process-monitoring (slug: scada-hmi-process-monitoring)
UPDATE services SET
  title = E'EN: SCADA Systems, HMI & Centralized Telemetry
ID: Sistem SCADA, HMI & Telemetri Terpusat',
  summary = E'EN: Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.
ID: Kontrol pengawasan pabrik terpusat, tampilan mimic dinamis, pencatatan alarm, tren historis, dan telemetri industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>\n<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>\n<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>\n<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>\n<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>\n<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Plant-Wide Supervisory Control & Data Acquisition</h3>\n<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>\n<h3>Multi-Protocol Telemetry & IoT Architecture</h3>\n<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>\n<h3>Alarm Management, Batch Recipes & Auditing</h3>\n<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Plant-Wide Supervisory Control & Data Acquisition</h3>\n<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>\n<h3>Multi-Protocol Telemetry & IoT Architecture</h3>\n<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>\n<h3>Alarm Management, Batch Recipes & Auditing</h3>\n<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>\nID: <h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>\n<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>\n<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>\n<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>\n<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>\n<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/scada-hmi-process-monitoring' OR slug = 'scada-hmi-process-monitoring' OR title = 'SCADA Systems, HMI & Centralized Telemetry';

-- SERVICE: automation-solutions-services/energy-management-iso50001 (slug: energy-management-iso50001)
UPDATE services SET
  title = E'EN: Energy Management Systems (EMS & ISO 50001)
ID: Sistem Manajemen Energi (EMS & ISO 50001)',
  summary = E'EN: Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.
ID: Pemantauan daya real-time, baseline energi otomatis, pelacakan beban puncak, dan pelaporan kepatuhan standar ESG.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>\n<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>\n<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>\n<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>\n<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>\n<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>\n<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>\n<h3>Sub-Billing & Departmental Cost Allocation</h3>\n<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>\n<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>\n<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>\n<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>\n<h3>Sub-Billing & Departmental Cost Allocation</h3>\n<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>\n<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>\n<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>\nID: <h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>\n<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>\n<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>\n<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>\n<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>\n<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/energy-management-iso50001' OR slug = 'energy-management-iso50001' OR title = 'Energy Management Systems (EMS & ISO 50001)';

-- SERVICE: inspection-testing-commissioning/relay-protection-testing-commissioning (slug: relay-protection-testing-commissioning)
UPDATE services SET
  title = E'EN: Protection Relay Testing (Secondary Injection)
ID: Pengujian Relay Proteksi (Injeksi Sekunder)',
  summary = E'EN: 3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.
ID: Pengujian injeksi sekunder 3-fase & 6-fase menggunakan unit Omicron CMC untuk relay proteksi arus lebih, diferensial, dan jarak.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>\n<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>\n<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>\n<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>\n<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>\n<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Protection Relay Secondary Injection Testing</h3>\n<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>\n<h3>Omicron Multi-Phase Automated Injection Sets</h3>\n<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>\n<h3>Coordination & Arc-Flash Clearing Time Verification</h3>\n<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Protection Relay Secondary Injection Testing</h3>\n<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>\n<h3>Omicron Multi-Phase Automated Injection Sets</h3>\n<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>\n<h3>Coordination & Arc-Flash Clearing Time Verification</h3>\n<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>\nID: <h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>\n<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>\n<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>\n<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>\n<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>\n<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/relay-protection-testing-commissioning' OR slug = 'relay-protection-testing-commissioning' OR title = 'Protection Relay Testing (Secondary Injection)';

-- SERVICE: mechanical-services-supplies/industrial-mechanical-supplies-services (slug: industrial-mechanical-supplies-services)
UPDATE services SET
  title = E'EN: Conveyor Systems, Magnetic Separators & Industrial Supplies
ID: Sistem Konveyor, Separator Magnetik & Perlengkapan Industri',
  summary = E'EN: Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.
ID: Pengadaan, instalasi, dan servis lini konveyor, pemisah logam magnetik, sectional door, dan peralatan vacuum lifter.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>\n<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>\n<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>\n<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>\n<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>\n<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Material Handling & Mechanical Infrastructure Supplies</h3>\n<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>\n<h3>Conveyor Systems & Overband Magnetic Separators</h3>\n<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>\n<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>\n<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Material Handling & Mechanical Infrastructure Supplies</h3>\n<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>\n<h3>Conveyor Systems & Overband Magnetic Separators</h3>\n<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>\n<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>\n<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>\nID: <h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>\n<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>\n<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>\n<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>\n<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>\n<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/industrial-mechanical-supplies-services' OR slug = 'industrial-mechanical-supplies-services' OR title = 'Conveyor Systems, Magnetic Separators & Industrial Supplies';

-- ==========================================
-- Migration: 038_bilingual_pages_fix.up.sql
-- ==========================================

-- Synchronize system pages in table pages with proper bilingual ID and EN titles
UPDATE pages
SET title = 'EN: About PT Multi Daya Mitra' || E'\n' || 'ID: Tentang PT Multi Daya Mitra',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'about' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Contact PT Multi Daya Mitra' || E'\n' || 'ID: Hubungi PT Multi Daya Mitra',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'contact' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Home' || E'\n' || 'ID: Beranda',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'home' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Services' || E'\n' || 'ID: Layanan',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'services' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Products' || E'\n' || 'ID: Produk',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'products' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: News & Insights' || E'\n' || 'ID: Berita & Wawasan',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'news' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Careers' || E'\n' || 'ID: Karir',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'career' AND deleted_at IS NULL;

COMMIT;


-- ============================================================================
-- Migration: 039_bilingual_services_fix.up.sql
-- ============================================================================
-- 039_bilingual_services_fix.up.sql
-- Synchronize all services (modern 21 services + legacy services + historical slugs)
-- with 100% complete matching bilingual translations (ID & EN), titles, summaries, and contents.

BEGIN;

-- SERVICE: electrical-construction-installation (slug: electrical-construction-installation)
UPDATE services SET
  title = E'EN: Electrical Construction & Installation\nID: Konstruksi & Instalasi Elektrikal',
  summary = E'EN: Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.\nID: Solusi terintegrasi instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, pemasangan trafo, dan terminasi kabel.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Konstruksi & Instalasi Elektrikal Industri Terpadu</h3>\n<p>PT Multi Daya Mitra menyediakan layanan konstruksi dan instalasi elektrikal komprehensif untuk fasilitas pabrik manufaktur, gardu induk utilitas, gedung komersial, dan infrastruktur industri. Didukung oleh insinyur berizin resmi dan teknisi lapangan tersertifikasi, kami melaksanakan proyek elektrikal turnkey dengan ketelitian tinggi, standar keselamatan kerja ketat, dan keandalan operasional jangka panjang.</p>\n<h3>Lingkup Pekerjaan Instalasi Terintegrasi</h3>\n<p>Kapabilitas kami mencakup integrasi sipil-elektrikal gardu induk, pemasangan switchgear tegangan menengah (TM), penempatan dan pengisian minyak transformator daya, perakitan panel distribusi utama tegangan rendah (TR), pemasangan trunking busduct ampere tinggi, dan jaringan kabel daya tersertifikasi. Seluruh pekerjaan mematuhi standar SPLN, PUIL 2011, dan IEC untuk menjamin keandalan sistem tanpa kompromi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>End-to-End Industrial Electrical Construction</h3>\n<p>PT Multi Daya Mitra provides comprehensive electrical construction and installation services for manufacturing plants, utility substations, commercial towers, and industrial infrastructure. Supported by licensed engineers and certified field technicians, we execute complex turnkey electrical works with uncompromising precision, safety, and operational reliability.</p>\n<h3>Integrated Installation Work Scope</h3>\n<p>Our turnkey capabilities cover substation civil-electrical integration, medium-voltage (MV) switchgear erection, power transformer positioning and oil filling, low-voltage (LV) main distribution board assembly, high-amp busduct trunking, and certified power cabling networks. All works strictly comply with SPLN, PUIL 2011, and IEC standards to guarantee long-term operational resilience.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>End-to-End Industrial Electrical Construction</h3>\n<p>PT Multi Daya Mitra provides comprehensive electrical construction and installation services for manufacturing plants, utility substations, commercial towers, and industrial infrastructure. Supported by licensed engineers and certified field technicians, we execute complex turnkey electrical works with uncompromising precision, safety, and operational reliability.</p>\n<h3>Integrated Installation Work Scope</h3>\n<p>Our turnkey capabilities cover substation civil-electrical integration, medium-voltage (MV) switchgear erection, power transformer positioning and oil filling, low-voltage (LV) main distribution board assembly, high-amp busduct trunking, and certified power cabling networks. All works strictly comply with SPLN, PUIL 2011, and IEC standards to guarantee long-term operational resilience.</p>\nID: <h3>Konstruksi & Instalasi Elektrikal Industri Terpadu</h3>\n<p>PT Multi Daya Mitra menyediakan layanan konstruksi dan instalasi elektrikal komprehensif untuk fasilitas pabrik manufaktur, gardu induk utilitas, gedung komersial, dan infrastruktur industri. Didukung oleh insinyur berizin resmi dan teknisi lapangan tersertifikasi, kami melaksanakan proyek elektrikal turnkey dengan ketelitian tinggi, standar keselamatan kerja ketat, dan keandalan operasional jangka panjang.</p>\n<h3>Lingkup Pekerjaan Instalasi Terintegrasi</h3>\n<p>Kapabilitas kami mencakup integrasi sipil-elektrikal gardu induk, pemasangan switchgear tegangan menengah (TM), penempatan dan pengisian minyak transformator daya, perakitan panel distribusi utama tegangan rendah (TR), pemasangan trunking busduct ampere tinggi, dan jaringan kabel daya tersertifikasi. Seluruh pekerjaan mematuhi standar SPLN, PUIL 2011, dan IEC untuk menjamin keandalan sistem tanpa kompromi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation' OR slug = 'electrical-construction-installation' OR title = 'Electrical Construction & Installation' OR title = 'Konstruksi & Instalasi Elektrikal';

-- SERVICE: electrical-construction-installation/substation-mv-switchgear-installation (slug: substation-mv-switchgear-installation)
UPDATE services SET
  title = E'EN: Substation & MV Switchgear Installation\nID: Instalasi Gardu Induk & Switchgear Tegangan Menengah (MV)',
  summary = E'EN: Medium voltage metal-clad switchgear, power transformers, oil containment, and civil-electrical integration up to 36kV.\nID: Pemasangan switchgear metal-clad tegangan menengah, transformator daya, bak penampung oli, dan integrasi sipil-elektrikal hingga 36kV.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan EPC Gardu Induk Tegangan Menengah</h3>\n<p>Layanan rekayasa teknik, pengadaan, dan konstruksi (EPC) lengkap untuk gardu induk outdoor dan indoor tegangan menengah hingga 36 kV. Kami mengoordinasikan instalasi penyulang utama PLN, transformator daya penurun tegangan, dan rangkaian panel kubikel metal-clad secara terpadu.</p>\n<h3>Pemasangan Switchgear MV & Transformator Daya</h3>\n<p>Pemasangan dan perataan kubikel berinsulasi udara (AIS) maupun gas (GIS), vacuum circuit breaker (VCB), penempatan transformator di atas bak penampung oli darurat, instalasi breather silika gel, dan koneksi busduct sesuai standar IEC 62271-200 dan SPLN.</p>\n<h3>Pengujian, Interlock & Tahapan Energize</h3>\n<p>Verifikasi pra-komisioning menyeluruh mencakup rasio dan polaritas CT/PT, uji waktu pemutusan breaker, pemeriksaan interlock mekanik/listrik keselamatan, serta protokol energize bertegangan bekerja sama dengan otoritas utilitas ketenagalistrikan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Medium Voltage Substation EPC Services</h3>\n<p>Complete engineering, procurement, and construction (EPC) services for medium voltage outdoor and indoor substations up to 36 kV. We coordinate the seamless installation of primary utility incoming bays, step-down power transformers, and metal-clad switchgear assemblies.</p>\n<h3>MV Switchgear & Transformer Erection</h3>\n<p>Installation and alignment of air-insulated (AIS) and gas-insulated (GIS) switchgear, vacuum circuit breakers (VCB), transformer placement over oil-containment sumps, silica gel breathers, and busduct connections compliant with IEC 62271-200 and SPLN standards.</p>\n<h3>Testing, Interlocking & Energization</h3>\n<p>Rigorous pre-commissioning verification including CT/PT polarity and ratio testing, breaker timing analysis, mechanical safety interlock checks, and coordinated energization protocols in collaboration with regional utility authorities.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Medium Voltage Substation EPC Services</h3>\n<p>Complete engineering, procurement, and construction (EPC) services for medium voltage outdoor and indoor substations up to 36 kV. We coordinate the seamless installation of primary utility incoming bays, step-down power transformers, and metal-clad switchgear assemblies.</p>\n<h3>MV Switchgear & Transformer Erection</h3>\n<p>Installation and alignment of air-insulated (AIS) and gas-insulated (GIS) switchgear, vacuum circuit breakers (VCB), transformer placement over oil-containment sumps, silica gel breathers, and busduct connections compliant with IEC 62271-200 and SPLN standards.</p>\n<h3>Testing, Interlocking & Energization</h3>\n<p>Rigorous pre-commissioning verification including CT/PT polarity and ratio testing, breaker timing analysis, mechanical safety interlock checks, and coordinated energization protocols in collaboration with regional utility authorities.</p>\nID: <h3>Layanan EPC Gardu Induk Tegangan Menengah</h3>\n<p>Layanan rekayasa teknik, pengadaan, dan konstruksi (EPC) lengkap untuk gardu induk outdoor dan indoor tegangan menengah hingga 36 kV. Kami mengoordinasikan instalasi penyulang utama PLN, transformator daya penurun tegangan, dan rangkaian panel kubikel metal-clad secara terpadu.</p>\n<h3>Pemasangan Switchgear MV & Transformator Daya</h3>\n<p>Pemasangan dan perataan kubikel berinsulasi udara (AIS) maupun gas (GIS), vacuum circuit breaker (VCB), penempatan transformator di atas bak penampung oli darurat, instalasi breather silika gel, dan koneksi busduct sesuai standar IEC 62271-200 dan SPLN.</p>\n<h3>Pengujian, Interlock & Tahapan Energize</h3>\n<p>Verifikasi pra-komisioning menyeluruh mencakup rasio dan polaritas CT/PT, uji waktu pemutusan breaker, pemeriksaan interlock mekanik/listrik keselamatan, serta protokol energize bertegangan bekerja sama dengan otoritas utilitas ketenagalistrikan.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/substation-mv-switchgear-installation' OR slug = 'substation-mv-switchgear-installation' OR title = 'Substation & MV Switchgear Installation' OR title = 'Instalasi Gardu Induk & Switchgear Tegangan Menengah (MV)';

-- SERVICE: electrical-construction-installation/lv-distribution-panels-assembly (slug: lv-distribution-panels-assembly)
UPDATE services SET
  title = E'EN: LV Panels Assembly (MDP, SDP, ATS & Sync)\nID: Perakitan Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)',
  summary = E'EN: Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).\nID: Panel Distribusi Utama (MDP), Panel Sub-Distribusi, panel sinkronisasi ATS/AMF, dan Motor Control Center (MCC).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Panel Distribusi Tegangan Rendah Rekayasa Khusus</h3>\n<p>Rekayasa teknik dan fabrikasi panel distribusi daya tegangan rendah untuk penyaluran tenaga listrik yang andal, sinkronisasi genset otomatis, dan kontrol motor industri hingga 6300A.</p>\n<h3>Arsitektur Distribusi Utama (MDP) & Sub-Distribusi (SDP)</h3>\n<p>Dirakit menggunakan busbar tembaga murni 99,9% Cu-ETP, struktur enclosure bersertifikasi type-tested (hingga pemisahan internal Form 4b), dan circuit breaker cerdas (MasterPact MTZ, Compact NSX) dengan modul pengukuran energi dan komunikasi data terintegrasi.</p>\n<h3>Panel ATS / AMF & Sinkronisasi Generator</h3>\n<p>Panel Automatic Transfer Switch (ATS) dan Automatic Mains Failure (AMF) yang dirancang dengan kontroler multi-genset digital, motorized changeover switch, serta logika pelepasan beban otomatis (load shedding) demi keandalan operasional fasilitas tanpa henti.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Custom Engineered Low Voltage Switchboards</h3>\n<p>Custom electrical distribution and control panel engineering for reliable power routing, automated generator synchronization, and motor control across industrial manufacturing facilities up to 6300A.</p>\n<h3>Main & Sub-Distribution Architecture</h3>\n<p>Fabricated using 99.9% Cu-ETP high-purity copper busbars, type-tested enclosure frameworks (up to Form 4b segregation), and intelligent circuit breakers (MasterPact MTZ, Compact NSX) with embedded energy metering and communication modules.</p>\n<h3>ATS / AMF Generator Synchronization</h3>\n<p>Automatic Transfer Switch (ATS) and Automatic Mains Failure (AMF) synchronization boards engineered with digital multi-generator controllers, motorized changeover switches, and automatic load-shedding algorithms for zero-interruption plant uptime.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Custom Engineered Low Voltage Switchboards</h3>\n<p>Custom electrical distribution and control panel engineering for reliable power routing, automated generator synchronization, and motor control across industrial manufacturing facilities up to 6300A.</p>\n<h3>Main & Sub-Distribution Architecture</h3>\n<p>Fabricated using 99.9% Cu-ETP high-purity copper busbars, type-tested enclosure frameworks (up to Form 4b segregation), and intelligent circuit breakers (MasterPact MTZ, Compact NSX) with embedded energy metering and communication modules.</p>\n<h3>ATS / AMF Generator Synchronization</h3>\n<p>Automatic Transfer Switch (ATS) and Automatic Mains Failure (AMF) synchronization boards engineered with digital multi-generator controllers, motorized changeover switches, and automatic load-shedding algorithms for zero-interruption plant uptime.</p>\nID: <h3>Panel Distribusi Tegangan Rendah Rekayasa Khusus</h3>\n<p>Rekayasa teknik dan fabrikasi panel distribusi daya tegangan rendah untuk penyaluran tenaga listrik yang andal, sinkronisasi genset otomatis, dan kontrol motor industri hingga 6300A.</p>\n<h3>Arsitektur Distribusi Utama (MDP) & Sub-Distribusi (SDP)</h3>\n<p>Dirakit menggunakan busbar tembaga murni 99,9% Cu-ETP, struktur enclosure bersertifikasi type-tested (hingga pemisahan internal Form 4b), dan circuit breaker cerdas (MasterPact MTZ, Compact NSX) dengan modul pengukuran energi dan komunikasi data terintegrasi.</p>\n<h3>Panel ATS / AMF & Sinkronisasi Generator</h3>\n<p>Panel Automatic Transfer Switch (ATS) dan Automatic Mains Failure (AMF) yang dirancang dengan kontroler multi-genset digital, motorized changeover switch, serta logika pelepasan beban otomatis (load shedding) demi keandalan operasional fasilitas tanpa henti.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/lv-distribution-panels-assembly' OR slug = 'lv-distribution-panels-assembly' OR title = 'LV Panels Assembly (MDP, SDP, ATS & Sync)' OR title = 'Perakitan Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)';

-- SERVICE: electrical-construction-installation/mv-lv-cable-installation-termination (slug: mv-lv-cable-installation-termination)
UPDATE services SET
  title = E'EN: MV & LV Cable Installation & Termination\nID: Instalasi & Terminasi Kabel MV & LV',
  summary = E'EN: Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.\nID: Penarikan kabel tersertifikasi, pemasangan tray, terminasi heat-shrink/cold-shrink, dan pengujian isolasi Hi-Pot.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Instalasi & Terminasi Kabel Daya Tersertifikasi</h3>\n<p>Layanan penarikan kabel TM/TR, pemasangan jalur cable tray, penyambungan (jointing), dan terminasi untuk jaringan distribusi tenaga listrik industri. Dikerjakan khusus oleh teknisi jointer bersertifikasi dengan mematuhi radius tekuk dan batas tegangan tarik standar.</p>\n<h3>Terminasi Heat-Shrink & Cold-Shrink</h3>\n<p>Pengerjaan terminasi kabel indoor/outdoor serta straight-through joint menggunakan kit berkualitas premium dari 3M dan Raychem, menjamin kerapatan kedap air, pengendalian gradien medan listrik (stress control), dan kekuatan dielektrik tinggi.</p>\n<h3>Pengujian Verifikasi Hi-Pot VLF & DC</h3>\n<p>Setiap kabel penyulang yang telah terpasang diuji ketahanan isolasinya menggunakan alat uji tegangan tinggi Very Low Frequency (VLF), uji ketahanan selubung luar (sheath test), serta verifikasi kontinuitas fasa sebelum serah terima energize.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Power Cable Installation & Jointing</h3>\n<p>Certified MV/LV cable pulling, tray routing, jointing, and termination services for industrial power distribution networks. Handled exclusively by certified jointer technicians adhering to strict bending radiuses and tension limits.</p>\n<h3>Heat-Shrink & Cold-Shrink Terminations</h3>\n<p>Execution of indoor and outdoor cable terminations and straight-through joints using premium 3M and Raychem kits, ensuring continuous moisture sealing, stress-control grading, and high dielectric strength.</p>\n<h3>VLF & DC Hi-Pot Verification Testing</h3>\n<p>Every installed feeder is subjected to Very Low Frequency (VLF) AC withstand testing, sheath integrity insulation resistance checks, and phase continuity verification before being signed off for live energization.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Power Cable Installation & Jointing</h3>\n<p>Certified MV/LV cable pulling, tray routing, jointing, and termination services for industrial power distribution networks. Handled exclusively by certified jointer technicians adhering to strict bending radiuses and tension limits.</p>\n<h3>Heat-Shrink & Cold-Shrink Terminations</h3>\n<p>Execution of indoor and outdoor cable terminations and straight-through joints using premium 3M and Raychem kits, ensuring continuous moisture sealing, stress-control grading, and high dielectric strength.</p>\n<h3>VLF & DC Hi-Pot Verification Testing</h3>\n<p>Every installed feeder is subjected to Very Low Frequency (VLF) AC withstand testing, sheath integrity insulation resistance checks, and phase continuity verification before being signed off for live energization.</p>\nID: <h3>Instalasi & Terminasi Kabel Daya Tersertifikasi</h3>\n<p>Layanan penarikan kabel TM/TR, pemasangan jalur cable tray, penyambungan (jointing), dan terminasi untuk jaringan distribusi tenaga listrik industri. Dikerjakan khusus oleh teknisi jointer bersertifikasi dengan mematuhi radius tekuk dan batas tegangan tarik standar.</p>\n<h3>Terminasi Heat-Shrink & Cold-Shrink</h3>\n<p>Pengerjaan terminasi kabel indoor/outdoor serta straight-through joint menggunakan kit berkualitas premium dari 3M dan Raychem, menjamin kerapatan kedap air, pengendalian gradien medan listrik (stress control), dan kekuatan dielektrik tinggi.</p>\n<h3>Pengujian Verifikasi Hi-Pot VLF & DC</h3>\n<p>Setiap kabel penyulang yang telah terpasang diuji ketahanan isolasinya menggunakan alat uji tegangan tinggi Very Low Frequency (VLF), uji ketahanan selubung luar (sheath test), serta verifikasi kontinuitas fasa sebelum serah terima energize.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/mv-lv-cable-installation-termination' OR slug = 'mv-lv-cable-installation-termination' OR title = 'MV & LV Cable Installation & Termination' OR title = 'Instalasi & Terminasi Kabel MV & LV';

-- SERVICE: electrical-construction-installation/fire-alarm-system-installation (slug: fire-alarm-system-installation)
UPDATE services SET
  title = E'EN: Fire Alarm System Engineering & Installation\nID: Rekayasa & Instalasi Sistem Fire Alarm',
  summary = E'EN: Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.\nID: Jaringan fire alarm addressable terintegrasi, detektor multi-sensor, aspirating smoke detection, dan sistem pemadam clean agent.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>\n<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>\n<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>\n<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>\n<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>\n<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Turnkey Industrial Fire Safety Engineering</h3>\n<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>\n<h3>Addressable Detection & Smoke Aspiration</h3>\n<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>\n<h3>Clean Agent Suppression & BMS Interlock</h3>\n<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Turnkey Industrial Fire Safety Engineering</h3>\n<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>\n<h3>Addressable Detection & Smoke Aspiration</h3>\n<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>\n<h3>Clean Agent Suppression & BMS Interlock</h3>\n<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>\nID: <h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>\n<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>\n<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>\n<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>\n<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>\n<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/fire-alarm-system-installation' OR slug = 'fire-alarm-system-installation' OR title = 'Fire Alarm System Engineering & Installation' OR title = 'Rekayasa & Instalasi Sistem Fire Alarm';

-- SERVICE: electrical-maintenance-service (slug: electrical-maintenance-service)
UPDATE services SET
  title = E'EN: Electrical Maintenance & Servicing\nID: Pemeliharaan & Perawatan Sistem Kelistrikan',
  summary = E'EN: Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.\nID: Layanan pemeliharaan preventif, prediktif, dan korektif komprehensif untuk trafo, kubikel MV, papan distribusi, dan circuit breaker.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Manajemen Pemeliharaan Aset Kelistrikan Proaktif</h3>\n<p>PT Multi Daya Mitra menyediakan program pemeliharaan preventif, prediktif, dan berbasis kondisi (condition-based maintenance) yang dirancang untuk mencegah terjadinya downtime mendadak, mengoptimalkan efisiensi energi, serta memperpanjang umur pakai peralatan listrik utama pabrik.</p>\n<h3>Cakupan Servis Multi-Disiplin</h3>\n<p>Tim insinyur pemeliharaan kami yang berpengalaman menginspeksi, menyervis, dan mengalibrasi transformator tipe minyak maupun kering, kubikel tegangan menengah, vacuum circuit breaker, panel distribusi tegangan rendah, kapasitor bank, serta relai proteksi dengan instrumen uji terkalibrasi internasional.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Proactive Electrical Asset Lifecycle Management</h3>\n<p>PT Multi Daya Mitra delivers comprehensive preventive, predictive, and condition-based maintenance programs designed to eliminate unscheduled outages, optimize energy efficiency, and extend the operating life of critical electrical equipment.</p>\n<h3>Multi-Discipline Servicing Scope</h3>\n<p>Our experienced service engineering teams inspect, service, and calibrate oil and dry-type transformers, medium voltage cubicles, vacuum circuit breakers, low-voltage switchboards, capacitor banks, and protection relays using industry-standard calibrated test equipment.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Proactive Electrical Asset Lifecycle Management</h3>\n<p>PT Multi Daya Mitra delivers comprehensive preventive, predictive, and condition-based maintenance programs designed to eliminate unscheduled outages, optimize energy efficiency, and extend the operating life of critical electrical equipment.</p>\n<h3>Multi-Discipline Servicing Scope</h3>\n<p>Our experienced service engineering teams inspect, service, and calibrate oil and dry-type transformers, medium voltage cubicles, vacuum circuit breakers, low-voltage switchboards, capacitor banks, and protection relays using industry-standard calibrated test equipment.</p>\nID: <h3>Manajemen Pemeliharaan Aset Kelistrikan Proaktif</h3>\n<p>PT Multi Daya Mitra menyediakan program pemeliharaan preventif, prediktif, dan berbasis kondisi (condition-based maintenance) yang dirancang untuk mencegah terjadinya downtime mendadak, mengoptimalkan efisiensi energi, serta memperpanjang umur pakai peralatan listrik utama pabrik.</p>\n<h3>Cakupan Servis Multi-Disiplin</h3>\n<p>Tim insinyur pemeliharaan kami yang berpengalaman menginspeksi, menyervis, dan mengalibrasi transformator tipe minyak maupun kering, kubikel tegangan menengah, vacuum circuit breaker, panel distribusi tegangan rendah, kapasitor bank, serta relai proteksi dengan instrumen uji terkalibrasi internasional.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service' OR slug = 'electrical-maintenance-service' OR title = 'Electrical Maintenance & Servicing' OR title = 'Pemeliharaan & Perawatan Sistem Kelistrikan';

-- SERVICE: electrical-maintenance-service/transformer-oil-treatment-dga (slug: transformer-oil-treatment-dga)
UPDATE services SET
  title = E'EN: Transformer Oil Treatment, BDV & DGA\nID: Penanganan Minyak Trafo, Uji BDV & Analisis DGA',
  summary = E'EN: On-site oil purification, vacuum degassing, breakdown voltage (BDV) dielectric testing, and Dissolved Gas Analysis (DGA).\nID: Pemurnian minyak trafo on-site, degasifikasi vakum, pengujian tegangan tembus (BDV), dan Dissolved Gas Analysis (DGA).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemurnian & Dehidrasi Minyak Trafo Vakum Tinggi</h3>\n<p>Layanan filtrasi, dehidrasi vakum, dan degasifikasi minyak transformator on-site untuk menghilangkan kadar air terlarut, partikel lumpur, dan gelembung gas, memulihkan tegangan tembus minyak sesuai standar IEEE dan IEC tanpa perlu membongkar tangki.</p>\n<h3>Pengujian Tegangan Tembus (BDV) & Dielektrik</h3>\n<p>Pengujian breakdown voltage menggunakan alat uji minyak otomatis terkalibrasi untuk mengukur kekuatan dielektrik (kV), tingkat keasaman, tegangan antarmuka (IFT), dan faktor disipasi daya (tan delta).</p>\n<h3>Analisis Gas Terlarut (DGA) & Penilaian Kondisi Trafo</h3>\n<p>Pengujian laboratorium Dissolved Gas Analysis (DGA) untuk mengukur konsentrasi gas gangguan (Hidrogen, Metana, Etilen, Asetilen, Karbon Monoksida) guna mendiagnosis gejala overheating, partial discharge, atau busur api internal sebelum trafo mengalami kerusakan fatal.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Vacuum Transformer Oil Purification & Dehydration</h3>\n<p>On-site transformer oil filtration, vacuum dehydration, and degassing to remove dissolved moisture, sludge particles, and trapped gases, restoring transformer oil breakdown voltage to IEEE and IEC standards without draining the core.</p>\n<h3>Breakdown Voltage (BDV) & Dielectric Testing</h3>\n<p>Dielectric breakdown testing using calibrated automated oil testers to measure dielectric withstand strength (kV), acidity, interfacial tension (IFT), and power factor dissipation (tan delta).</p>\n<h3>Dissolved Gas Analysis (DGA) & Condition Assessment</h3>\n<p>Laboratory Dissolved Gas Analysis (DGA) identifying fault gas concentrations (Hydrogen, Methane, Ethylene, Acetylene, Carbon Monoxide) to diagnose active thermal hotspots, partial discharges, or internal arcing faults before catastrophic transformer failure.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Vacuum Transformer Oil Purification & Dehydration</h3>\n<p>On-site transformer oil filtration, vacuum dehydration, and degassing to remove dissolved moisture, sludge particles, and trapped gases, restoring transformer oil breakdown voltage to IEEE and IEC standards without draining the core.</p>\n<h3>Breakdown Voltage (BDV) & Dielectric Testing</h3>\n<p>Dielectric breakdown testing using calibrated automated oil testers to measure dielectric withstand strength (kV), acidity, interfacial tension (IFT), and power factor dissipation (tan delta).</p>\n<h3>Dissolved Gas Analysis (DGA) & Condition Assessment</h3>\n<p>Laboratory Dissolved Gas Analysis (DGA) identifying fault gas concentrations (Hydrogen, Methane, Ethylene, Acetylene, Carbon Monoxide) to diagnose active thermal hotspots, partial discharges, or internal arcing faults before catastrophic transformer failure.</p>\nID: <h3>Pemurnian & Dehidrasi Minyak Trafo Vakum Tinggi</h3>\n<p>Layanan filtrasi, dehidrasi vakum, dan degasifikasi minyak transformator on-site untuk menghilangkan kadar air terlarut, partikel lumpur, dan gelembung gas, memulihkan tegangan tembus minyak sesuai standar IEEE dan IEC tanpa perlu membongkar tangki.</p>\n<h3>Pengujian Tegangan Tembus (BDV) & Dielektrik</h3>\n<p>Pengujian breakdown voltage menggunakan alat uji minyak otomatis terkalibrasi untuk mengukur kekuatan dielektrik (kV), tingkat keasaman, tegangan antarmuka (IFT), dan faktor disipasi daya (tan delta).</p>\n<h3>Analisis Gas Terlarut (DGA) & Penilaian Kondisi Trafo</h3>\n<p>Pengujian laboratorium Dissolved Gas Analysis (DGA) untuk mengukur konsentrasi gas gangguan (Hidrogen, Metana, Etilen, Asetilen, Karbon Monoksida) guna mendiagnosis gejala overheating, partial discharge, atau busur api internal sebelum trafo mengalami kerusakan fatal.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/transformer-oil-treatment-dga' OR slug = 'transformer-oil-treatment-dga' OR title = 'Transformer Oil Treatment, BDV & DGA' OR title = 'Penanganan Minyak Trafo, Uji BDV & Analisis DGA';

-- SERVICE: electrical-maintenance-service/mv-cubicle-acb-maintenance (slug: mv-cubicle-acb-maintenance)
UPDATE services SET
  title = E'EN: MV Cubicle & ACB Maintenance (Trip Testing)\nID: Pemeliharaan Kubikel MV & ACB (Pengujian Trip)',
  summary = E'EN: Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.\nID: Servis preventif switchgear tegangan menengah, uji resistansi kontak (Ductor), uji isolasi, dan injeksi sekunder ACB.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>\n<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>\n<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>\n<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>\n<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>\n<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>\n<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>\n<h3>Contact Resistance & Insulation Resistance Testing</h3>\n<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>\n<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>\n<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>\n<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>\n<h3>Contact Resistance & Insulation Resistance Testing</h3>\n<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>\n<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>\n<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>\nID: <h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>\n<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>\n<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>\n<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>\n<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>\n<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/mv-cubicle-acb-maintenance' OR slug = 'mv-cubicle-acb-maintenance' OR title = 'MV Cubicle & ACB Maintenance (Trip Testing)' OR title = 'Pemeliharaan Kubikel MV & ACB (Pengujian Trip)';

-- SERVICE: electrical-maintenance-service/thermography-predictive-maintenance (slug: thermography-predictive-maintenance)
UPDATE services SET
  title = E'EN: Infrared Thermography & Predictive Maintenance\nID: Termografi Inframerah & Pemeliharaan Prediktif',
  summary = E'EN: Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, overloaded phases, and deteriorating contacts under full load.\nID: Pemindaian termal non-kontak FLIR untuk mendeteksi hot spot, sambungan busbar longgar, fase beban berlebih, dan degradasi kontak saat operasi penuh.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Deteksi Anomali Termal Non-Destruktif</h3>\n<p>Inspeksi termografi inframerah beresolusi tinggi yang dilakukan langsung saat sistem beroperasi bertegangan penuh menggunakan kamera termal industri FLIR terkalibrasi, mendeteksi kenaikan suhu abnormal sebelum menimbulkan kerusakan fatal atau kebakaran.</p>\n<h3>Sambungan Longgar, Ketidakseimbangan Fasa & Beban Lebih</h3>\n<p>Mendeteksi resistansi kontak tinggi akibat sambungan baut longgar, oksidasi pada sepatu kabel, ketidakseimbangan beban antar fasa, keausan kontak circuit breaker, serta kerusakan elemen kapasitor bank saat pabrik beroperasi normal.</p>\n<h3>Pelaporan Standar ISO/ASNT & Klasifikasi Tingkat Bahaya</h3>\n<p>Dikerjakan oleh termografer bersertifikasi Level II internasional, setiap laporan inspeksi menyajikan foto radiometrik termal, foto visual acuan, perhitungan selisih suhu (delta-T), serta rekomendasi tindakan perbaikan sesuai skala prioritas.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Non-Destructive Thermal Anomaly Detection</h3>\n<p>High-resolution infrared thermographic inspection conducted under live electrical operating conditions using calibrated FLIR industrial cameras, identifying thermal abnormalities before they cause equipment breakdown or fire hazards.</p>\n<h3>Loose Connections, Phase Imbalances & Overloading</h3>\n<p>Detect high-resistance electrical connections, oxidation on cable terminations, phase load imbalances, deteriorating circuit breaker contacts, and defective capacitor bank elements under normal production loads.</p>\n<h3>Standardized ISO/ASNT Reporting & Severity Classification</h3>\n<p>Delivered by certified Level II infrared thermographers, each inspection report includes thermal radiometric images, visual reference photos, delta-T temperature differential calculations, and prioritized corrective action recommendations.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Non-Destructive Thermal Anomaly Detection</h3>\n<p>High-resolution infrared thermographic inspection conducted under live electrical operating conditions using calibrated FLIR industrial cameras, identifying thermal abnormalities before they cause equipment breakdown or fire hazards.</p>\n<h3>Loose Connections, Phase Imbalances & Overloading</h3>\n<p>Detect high-resistance electrical connections, oxidation on cable terminations, phase load imbalances, deteriorating circuit breaker contacts, and defective capacitor bank elements under normal production loads.</p>\n<h3>Standardized ISO/ASNT Reporting & Severity Classification</h3>\n<p>Delivered by certified Level II infrared thermographers, each inspection report includes thermal radiometric images, visual reference photos, delta-T temperature differential calculations, and prioritized corrective action recommendations.</p>\nID: <h3>Deteksi Anomali Termal Non-Destruktif</h3>\n<p>Inspeksi termografi inframerah beresolusi tinggi yang dilakukan langsung saat sistem beroperasi bertegangan penuh menggunakan kamera termal industri FLIR terkalibrasi, mendeteksi kenaikan suhu abnormal sebelum menimbulkan kerusakan fatal atau kebakaran.</p>\n<h3>Sambungan Longgar, Ketidakseimbangan Fasa & Beban Lebih</h3>\n<p>Mendeteksi resistansi kontak tinggi akibat sambungan baut longgar, oksidasi pada sepatu kabel, ketidakseimbangan beban antar fasa, keausan kontak circuit breaker, serta kerusakan elemen kapasitor bank saat pabrik beroperasi normal.</p>\n<h3>Pelaporan Standar ISO/ASNT & Klasifikasi Tingkat Bahaya</h3>\n<p>Dikerjakan oleh termografer bersertifikasi Level II internasional, setiap laporan inspeksi menyajikan foto radiometrik termal, foto visual acuan, perhitungan selisih suhu (delta-T), serta rekomendasi tindakan perbaikan sesuai skala prioritas.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/thermography-predictive-maintenance' OR slug = 'thermography-predictive-maintenance' OR title = 'Infrared Thermography & Predictive Maintenance' OR title = 'Termografi Inframerah & Pemeliharaan Prediktif';

-- SERVICE: electrical-maintenance-service/annual-maintenance-contracts (slug: annual-maintenance-contracts)
UPDATE services SET
  title = E'EN: Annual Maintenance Contracts (AMC) & 24/7 SLA\nID: Kontrak Pemeliharaan Tahunan (AMC) & SLA Siaga 24/7',
  summary = E'EN: Customized long-term service level agreements providing scheduled plant shutdowns, emergency call-outs, and spare parts management.\nID: Perjanjian tingkat layanan jangka panjang terpadu dengan shutdown terjadwal, respon darurat cepat, dan manajemen suku cadang.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Jaminan Ketersediaan Pabrik dengan Paket AMC Terencana</h3>\n<p>Perjanjian tingkat layanan (SLA) komprehensif yang dirancang untuk fasilitas manufaktur berkelanjutan, pusat data, dan pabrik industri berat, menyediakan servis berkala terjadwal, respons darurat cepat saat gangguan, serta perencanaan suku cadang strategis.</p>\n<h3>Eksekusi Pemeliharaan Rutin Shutdown Tahunan</h3>\n<p>Pengelolaan tim teknis terpadu saat periode shutdown tahunan pabrik, mencakup pembersihan total gardu induk, audit torsi baut busbar, pemolesan kontak, pelumasan mekanisme mekanik breaker, dan kalibrasi injeksi sekunder menyeluruh.</p>\n<h3>Dukungan Darurat 24/7 & Manajemen Suku Cadang</h3>\n<p>Hotline teknis khusus dengan waktu respons mobilisasi cepat untuk menangani insiden kelistrikan kritis, didukung penyediaan suku cadang konsinyasi untuk circuit breaker, relai proteksi, dan komponen listrik vital lainnya.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Guaranteed Plant Availability with Tailored AMC Plans</h3>\n<p>Comprehensive service level agreements (SLA) engineered for continuous process facilities, data centers, and industrial factories, providing routine scheduled servicing, rapid-response emergency breakdown callouts, and lifecycle spares planning.</p>\n<h3>Planned Annual Shutdown Execution</h3>\n<p>Complete multi-team management during scheduled annual plant turnarounds, including total substation cleaning, busbar torque auditing, contact polishing, breaker mechanism lubrication, and full secondary injection calibration.</p>\n<h3>24/7 Emergency Support & Strategic Spare Inventory</h3>\n<p>Dedicated technical hotline and rapid mobilization response for critical electrical disruptions, supported by consignment spare parts management for circuit breakers, relays, and vital electrical components.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Guaranteed Plant Availability with Tailored AMC Plans</h3>\n<p>Comprehensive service level agreements (SLA) engineered for continuous process facilities, data centers, and industrial factories, providing routine scheduled servicing, rapid-response emergency breakdown callouts, and lifecycle spares planning.</p>\n<h3>Planned Annual Shutdown Execution</h3>\n<p>Complete multi-team management during scheduled annual plant turnarounds, including total substation cleaning, busbar torque auditing, contact polishing, breaker mechanism lubrication, and full secondary injection calibration.</p>\n<h3>24/7 Emergency Support & Strategic Spare Inventory</h3>\n<p>Dedicated technical hotline and rapid mobilization response for critical electrical disruptions, supported by consignment spare parts management for circuit breakers, relays, and vital electrical components.</p>\nID: <h3>Jaminan Ketersediaan Pabrik dengan Paket AMC Terencana</h3>\n<p>Perjanjian tingkat layanan (SLA) komprehensif yang dirancang untuk fasilitas manufaktur berkelanjutan, pusat data, dan pabrik industri berat, menyediakan servis berkala terjadwal, respons darurat cepat saat gangguan, serta perencanaan suku cadang strategis.</p>\n<h3>Eksekusi Pemeliharaan Rutin Shutdown Tahunan</h3>\n<p>Pengelolaan tim teknis terpadu saat periode shutdown tahunan pabrik, mencakup pembersihan total gardu induk, audit torsi baut busbar, pemolesan kontak, pelumasan mekanisme mekanik breaker, dan kalibrasi injeksi sekunder menyeluruh.</p>\n<h3>Dukungan Darurat 24/7 & Manajemen Suku Cadang</h3>\n<p>Hotline teknis khusus dengan waktu respons mobilisasi cepat untuk menangani insiden kelistrikan kritis, didukung penyediaan suku cadang konsinyasi untuk circuit breaker, relai proteksi, dan komponen listrik vital lainnya.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/annual-maintenance-contracts' OR slug = 'annual-maintenance-contracts' OR title = 'Annual Maintenance Contracts (AMC) & 24/7 SLA' OR title = 'Kontrak Pemeliharaan Tahunan (AMC) & SLA Siaga 24/7';

-- SERVICE: automation-solutions-services (slug: automation-solutions-services)
UPDATE services SET
  title = E'EN: Automation Solutions & Services\nID: Solusi & Layanan Otomasi Industri',
  summary = E'EN: Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.\nID: Otomasi industri, sistem SCADA (xArrow & EcoStruxure), pemrograman PLC, Pemantauan Energi (PME), dan optimasi proses manufaktur.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Otomasi Industri & Kontrol Proses Siap Pakai (Turnkey)</h3>\n<p>PT Multi Daya Mitra menghadirkan solusi otomasi terintegrasi yang menjembatani instrumentasi lapangan, arsitektur kontrol PLC, jaringan supervisi SCADA, dan pelaporan efisiensi energi korporat ke dalam satu platform terpadu yang sangat andal.</p>\n<h3>Keunggulan Integrator Sistem Tersertifikasi</h3>\n<p>Sebagai mitra solusi resmi xArrow SCADA dan System Integrator Schneider Electric tersertifikasi, kami melayani pengembangan perangkat lunak kustom, pengujian FAT/SAT, perakitan kabinet kontrol, serta komisioning lapangan di seluruh Indonesia.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Turnkey Industrial Automation & Process Control</h3>\n<p>PT Multi Daya Mitra delivers integrated automation solutions that bridge field instrumentation, PLC control architectures, supervisory SCADA networks, and enterprise energy reporting into a unified, high-reliability platform.</p>\n<h3>Certified System Integration Excellence</h3>\n<p>As authorized solutions partners for xArrow SCADA and certified Schneider Electric system integrators, we provide custom software development, FAT/SAT testing, control cabinet assembly, and on-site commissioning across Indonesia.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Turnkey Industrial Automation & Process Control</h3>\n<p>PT Multi Daya Mitra delivers integrated automation solutions that bridge field instrumentation, PLC control architectures, supervisory SCADA networks, and enterprise energy reporting into a unified, high-reliability platform.</p>\n<h3>Certified System Integration Excellence</h3>\n<p>As authorized solutions partners for xArrow SCADA and certified Schneider Electric system integrators, we provide custom software development, FAT/SAT testing, control cabinet assembly, and on-site commissioning across Indonesia.</p>\nID: <h3>Otomasi Industri & Kontrol Proses Siap Pakai (Turnkey)</h3>\n<p>PT Multi Daya Mitra menghadirkan solusi otomasi terintegrasi yang menjembatani instrumentasi lapangan, arsitektur kontrol PLC, jaringan supervisi SCADA, dan pelaporan efisiensi energi korporat ke dalam satu platform terpadu yang sangat andal.</p>\n<h3>Keunggulan Integrator Sistem Tersertifikasi</h3>\n<p>Sebagai mitra solusi resmi xArrow SCADA dan System Integrator Schneider Electric tersertifikasi, kami melayani pengembangan perangkat lunak kustom, pengujian FAT/SAT, perakitan kabinet kontrol, serta komisioning lapangan di seluruh Indonesia.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services' OR slug = 'automation-solutions-services' OR title = 'Automation Solutions & Services' OR title = 'Solusi & Layanan Otomasi Industri';

-- SERVICE: automation-solutions-services/scada-hmi-process-monitoring (slug: scada-hmi-process-monitoring)
UPDATE services SET
  title = E'EN: SCADA Systems, HMI & Centralized Telemetry\nID: Sistem SCADA, HMI & Telemetri Terpusat',
  summary = E'EN: Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.\nID: Kontrol pengawasan pabrik terpusat, tampilan mimic dinamis, pencatatan alarm, tren historis, dan telemetri industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>\n<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>\n<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>\n<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>\n<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>\n<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Plant-Wide Supervisory Control & Data Acquisition</h3>\n<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>\n<h3>Multi-Protocol Telemetry & IoT Architecture</h3>\n<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>\n<h3>Alarm Management, Batch Recipes & Auditing</h3>\n<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Plant-Wide Supervisory Control & Data Acquisition</h3>\n<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>\n<h3>Multi-Protocol Telemetry & IoT Architecture</h3>\n<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>\n<h3>Alarm Management, Batch Recipes & Auditing</h3>\n<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>\nID: <h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>\n<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>\n<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>\n<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>\n<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>\n<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/scada-hmi-process-monitoring' OR slug = 'scada-hmi-process-monitoring' OR title = 'SCADA Systems, HMI & Centralized Telemetry' OR title = 'Sistem SCADA, HMI & Telemetri Terpusat';

-- SERVICE: automation-solutions-services/energy-management-iso50001 (slug: energy-management-iso50001)
UPDATE services SET
  title = E'EN: Energy Management Systems (EMS & ISO 50001)\nID: Sistem Manajemen Energi (EMS & ISO 50001)',
  summary = E'EN: Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.\nID: Pemantauan daya real-time, baseline energi otomatis, pelacakan beban puncak, dan pelaporan kepatuhan standar ESG.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>\n<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>\n<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>\n<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>\n<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>\n<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>\n<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>\n<h3>Sub-Billing & Departmental Cost Allocation</h3>\n<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>\n<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>\n<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>\n<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>\n<h3>Sub-Billing & Departmental Cost Allocation</h3>\n<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>\n<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>\n<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>\nID: <h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>\n<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>\n<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>\n<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>\n<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>\n<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/energy-management-iso50001' OR slug = 'energy-management-iso50001' OR title = 'Energy Management Systems (EMS & ISO 50001)' OR title = 'Sistem Manajemen Energi (EMS & ISO 50001)';

-- SERVICE: automation-solutions-services/plc-vsd-system-integration (slug: plc-vsd-system-integration)
UPDATE services SET
  title = E'EN: PLC Programming & Variable Speed Drive (VSD) Integration\nID: Pemrograman PLC & Integrasi Variable Speed Drive (VSD)',
  summary = E'EN: Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.\nID: Rekayasa logika PLC kustom, perakitan panel kontrol, penyetelan inverter Altivar/Danfoss/ABB, dan kontrol gerak presisi.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemrograman PLC Industri Kustom & Integrasi Sistem</h3>\n<p>Perancangan sistem kendali PLC siap pakai, pemrograman logika, perakitan panel kabinet, dan komisioning untuk platform Modicon (M580/M340/M241), Siemens S7 (1200/1500), dan Rockwell Allen-Bradley di berbagai proses industri.</p>\n<h3>Penyetelan Inverter & Variable Speed Drive (VSD)</h3>\n<p>Integrasi inverter frekuensi variabel (VFD) dan soft starter (Schneider Altivar, Danfoss, ABB) untuk pompa, fan/blower, kompresor, dan konveyor industri, menghasilkan kontrol torsi presisi dan penghematan daya listrik signifikan.</p>\n<h3>Safety PLC & Arsitektur Kendali Fail-Safe</h3>\n<p>Rekayasa sistem keselamatan mesin berstandar SIL 3 / PLe, rangkaian tombol darurat (emergency stop), tirai cahaya optik (light curtain), dan pengaman dua tangan demi perlindungan total operator dari bahaya mekanikal.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Custom Industrial PLC Programming & System Integration</h3>\n<p>Turnkey PLC control system design, programming, panel assembly, and commissioning covering Modicon (M580/M340/M241), Siemens S7 (1200/1500), and Rockwell Allen-Bradley platforms for automated industrial processes.</p>\n<h3>Variable Speed Drive (VSD) & Inverter Tuning</h3>\n<p>Integration of variable frequency drives (VFD) and soft starters (Schneider Altivar, Danfoss, ABB) for pumps, fans, compressors, and conveying machinery, delivering optimal torque control and significant energy savings.</p>\n<h3>Safety PLCs & Fail-Safe Architecture</h3>\n<p>Engineering SIL 3 / PLe compliant machine safety systems, emergency stop loops, light curtain interlocks, and two-hand safety monitoring for complete machinery risk mitigation.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Custom Industrial PLC Programming & System Integration</h3>\n<p>Turnkey PLC control system design, programming, panel assembly, and commissioning covering Modicon (M580/M340/M241), Siemens S7 (1200/1500), and Rockwell Allen-Bradley platforms for automated industrial processes.</p>\n<h3>Variable Speed Drive (VSD) & Inverter Tuning</h3>\n<p>Integration of variable frequency drives (VFD) and soft starters (Schneider Altivar, Danfoss, ABB) for pumps, fans, compressors, and conveying machinery, delivering optimal torque control and significant energy savings.</p>\n<h3>Safety PLCs & Fail-Safe Architecture</h3>\n<p>Engineering SIL 3 / PLe compliant machine safety systems, emergency stop loops, light curtain interlocks, and two-hand safety monitoring for complete machinery risk mitigation.</p>\nID: <h3>Pemrograman PLC Industri Kustom & Integrasi Sistem</h3>\n<p>Perancangan sistem kendali PLC siap pakai, pemrograman logika, perakitan panel kabinet, dan komisioning untuk platform Modicon (M580/M340/M241), Siemens S7 (1200/1500), dan Rockwell Allen-Bradley di berbagai proses industri.</p>\n<h3>Penyetelan Inverter & Variable Speed Drive (VSD)</h3>\n<p>Integrasi inverter frekuensi variabel (VFD) dan soft starter (Schneider Altivar, Danfoss, ABB) untuk pompa, fan/blower, kompresor, dan konveyor industri, menghasilkan kontrol torsi presisi dan penghematan daya listrik signifikan.</p>\n<h3>Safety PLC & Arsitektur Kendali Fail-Safe</h3>\n<p>Rekayasa sistem keselamatan mesin berstandar SIL 3 / PLe, rangkaian tombol darurat (emergency stop), tirai cahaya optik (light curtain), dan pengaman dua tangan demi perlindungan total operator dari bahaya mekanikal.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/plc-vsd-system-integration' OR slug = 'plc-vsd-system-integration' OR title = 'PLC Programming & Variable Speed Drive (VSD) Integration' OR title = 'Pemrograman PLC & Integrasi Variable Speed Drive (VSD)';

-- SERVICE: inspection-testing-commissioning (slug: inspection-testing-commissioning)
UPDATE services SET
  title = E'EN: Inspection, Testing & Commissioning\nID: Inspeksi, Pengujian & Commissioning',
  summary = E'EN: Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.\nID: Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan Pengujian & Komisioning Tingkat Lanjut</h3>\n<p>Layanan pengujian elektrikal, inspeksi diagnostik, dan komisioning komprehensif untuk memverifikasi keselamatan, koordinasi proteksi, dan keandalan operasional sistem kelistrikan industri sebelum serah terima resmi.</p>\n<h3>Armada Alat Uji Terkalibrasi Kelas Dunia</h3>\n<p>Insinyur kami mengoperasikan unit uji relai Omicron CMC 356 terkalibrasi, penganalisis kualitas daya Fluke 435-II Kelas A, Megger insulasi tegangan tinggi, pemindai PD EA Technology, dan kamera termal FLIR untuk menghasilkan laporan teknis resmi terakreditasi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Advanced Testing & Commissioning Services</h3>\n<p>Comprehensive electrical testing, diagnostic inspection, and commissioning services to verify the safety, protection coordination, and operational integrity of industrial power systems before live handover.</p>\n<h3>World-Class Calibrated Testing Fleet</h3>\n<p>Our engineers utilize calibrated Omicron CMC 356 relay testers, Fluke 435-II Class A power analyzers, Megger insulation testers, EA Technology PD scanners, and FLIR thermal imagers to produce certified engineering test reports.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Advanced Testing & Commissioning Services</h3>\n<p>Comprehensive electrical testing, diagnostic inspection, and commissioning services to verify the safety, protection coordination, and operational integrity of industrial power systems before live handover.</p>\n<h3>World-Class Calibrated Testing Fleet</h3>\n<p>Our engineers utilize calibrated Omicron CMC 356 relay testers, Fluke 435-II Class A power analyzers, Megger insulation testers, EA Technology PD scanners, and FLIR thermal imagers to produce certified engineering test reports.</p>\nID: <h3>Layanan Pengujian & Komisioning Tingkat Lanjut</h3>\n<p>Layanan pengujian elektrikal, inspeksi diagnostik, dan komisioning komprehensif untuk memverifikasi keselamatan, koordinasi proteksi, dan keandalan operasional sistem kelistrikan industri sebelum serah terima resmi.</p>\n<h3>Armada Alat Uji Terkalibrasi Kelas Dunia</h3>\n<p>Insinyur kami mengoperasikan unit uji relai Omicron CMC 356 terkalibrasi, penganalisis kualitas daya Fluke 435-II Kelas A, Megger insulasi tegangan tinggi, pemindai PD EA Technology, dan kamera termal FLIR untuk menghasilkan laporan teknis resmi terakreditasi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning' OR slug = 'inspection-testing-commissioning' OR title = 'Inspection, Testing & Commissioning' OR title = 'Inspeksi, Pengujian & Commissioning';

-- SERVICE: inspection-testing-commissioning/power-quality-analysis-study (slug: power-quality-analysis-study)
UPDATE services SET
  title = E'EN: Power Quality Analysis & Harmonics Study\nID: Analisis Kualitas Daya & Studi Harmonisa',
  summary = E'EN: Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, transient detection, and mitigation design.\nID: Perekaman kualitas daya Kelas A, audit distorsi harmonisa (THD), fluktuasi tegangan, deteksi transien, dan perancangan filter mitigasi.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Audit Kualitas Daya Presisi Tinggi Standar Kelas A</h3>\n<p>Perekaman dan analisis kualitas daya listrik komprehensif sesuai standar IEC 61000-4-30 Kelas A dan IEEE 519 menggunakan penganalisis multi-kanal presisi guna mengaudit gangguan kelistrikan saat operasi pabrik berlangsung.</p>\n<h3>Analisis Distorsi Harmonisa (THD) & Risiko Resonansi</h3>\n<p>Pengukuran distorsi harmonisa tegangan total (THDv) dan arus (THDi) hingga orde ke-50, mengidentifikasi bahaya resonansi sistem, pemanasan berlebih pada kawat netral, serta kerusakan fatal pada bank kapasitor.</p>\n<h3>Tangkapan Fluktuasi Tegangan (Sag/Swell), Kedip & Transien</h3>\n<p>Perekaman bentuk gelombang kecepatan tinggi untuk menangkap lonjakan tegangan (swell), penurunan sesaat (sag), kedipan (flicker), dan transien switching yang sering menyebabkan reset mendadak pada PLC, trip inverter VSD, serta cacat produksi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Class A Precision Power Quality Auditing</h3>\n<p>Comprehensive power quality logging and analysis in accordance with IEC 61000-4-30 Class A and IEEE 519 standards using precision multi-channel analyzers to audit electrical disturbances under real operating conditions.</p>\n<h3>Harmonic Distortion (THD) & Resonance Analysis</h3>\n<p>Measurement of Total Harmonic Voltage Distortion (THDv) and Current Distortion (THDi) up to the 50th order, identifying resonance risks, overheated neutral conductors, and capacitor bank failures.</p>\n<h3>Voltage Sag, Swell, Flicker & Transient Capture</h3>\n<p>High-speed waveform capture recording sub-cycle voltage sags, swells, flicker, and switching transients that trigger sensitive PLC resets, VSD lockouts, and precision manufacturing defects.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Class A Precision Power Quality Auditing</h3>\n<p>Comprehensive power quality logging and analysis in accordance with IEC 61000-4-30 Class A and IEEE 519 standards using precision multi-channel analyzers to audit electrical disturbances under real operating conditions.</p>\n<h3>Harmonic Distortion (THD) & Resonance Analysis</h3>\n<p>Measurement of Total Harmonic Voltage Distortion (THDv) and Current Distortion (THDi) up to the 50th order, identifying resonance risks, overheated neutral conductors, and capacitor bank failures.</p>\n<h3>Voltage Sag, Swell, Flicker & Transient Capture</h3>\n<p>High-speed waveform capture recording sub-cycle voltage sags, swells, flicker, and switching transients that trigger sensitive PLC resets, VSD lockouts, and precision manufacturing defects.</p>\nID: <h3>Audit Kualitas Daya Presisi Tinggi Standar Kelas A</h3>\n<p>Perekaman dan analisis kualitas daya listrik komprehensif sesuai standar IEC 61000-4-30 Kelas A dan IEEE 519 menggunakan penganalisis multi-kanal presisi guna mengaudit gangguan kelistrikan saat operasi pabrik berlangsung.</p>\n<h3>Analisis Distorsi Harmonisa (THD) & Risiko Resonansi</h3>\n<p>Pengukuran distorsi harmonisa tegangan total (THDv) dan arus (THDi) hingga orde ke-50, mengidentifikasi bahaya resonansi sistem, pemanasan berlebih pada kawat netral, serta kerusakan fatal pada bank kapasitor.</p>\n<h3>Tangkapan Fluktuasi Tegangan (Sag/Swell), Kedip & Transien</h3>\n<p>Perekaman bentuk gelombang kecepatan tinggi untuk menangkap lonjakan tegangan (swell), penurunan sesaat (sag), kedipan (flicker), dan transien switching yang sering menyebabkan reset mendadak pada PLC, trip inverter VSD, serta cacat produksi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/power-quality-analysis-study' OR slug = 'power-quality-analysis-study' OR title = 'Power Quality Analysis & Harmonics Study' OR title = 'Analisis Kualitas Daya & Studi Harmonisa';

-- SERVICE: inspection-testing-commissioning/partial-discharge-pd-scan (slug: partial-discharge-pd-scan)
UPDATE services SET
  title = E'EN: Partial Discharge (PD) Scan & Insulation Diagnostics\nID: Pemindaian Partial Discharge (PD) & Diagnostik Isolasi',
  summary = E'EN: Non-invasive TEV (Transient Earth Voltage), acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.\nID: Sensor non-invasif TEV, ultrasonik akustik, dan HFCT untuk pemindaian PD switchgear dan kabel bertegangan langsung.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Deteksi Partial Discharge Bertegangan Non-Invasif (On-Line)</h3>\n<p>Deteksi dini gejala degradasi isolasi pada aset tegangan menengah dan tinggi (switchgear, transformator, kabel daya, dan busduct) saat beroperasi tanpa memerlukan penghentian suplai listrik pabrik.</p>\n<h3>Pengukuran Multi-Sensor (TEV, Akustik & HFCT)</h3>\n<p>Pemanfaatan sensor Transient Earth Voltage (TEV) untuk mendeteksi rongga internal, sensor ultrasonik akustik untuk gejala perambatan permukaan (surface tracking), serta High-Frequency Current Transformer (HFCT) untuk kabel daya.</p>\n<h3>Rencana Tindakan Pemeliharaan Berbasis Kondisi</h3>\n<p>Analisis bentuk pulsa fase (PRPD) untuk mengklasifikasikan jenis lucutan (korona, permukaan, rongga dalam), menentukan tingkat keparahan anomali, dan menyusun rekomendasi perbaikan terencana sebelum terjadi ledakan dielektrik.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Non-Invasive On-Line Partial Discharge Detection</h3>\n<p>Early-stage detection of insulation deterioration in live medium and high-voltage assets (switchgear, transformers, cables, and busducts) without requiring plant power shutdowns.</p>\n<h3>Multi-Sensor Measurement (TEV, Acoustic & HFCT)</h3>\n<p>Simultaneous utilization of Transient Earth Voltage (TEV) sensors for internal voids, ultrasonic acoustic probes for surface tracking, and High-Frequency Current Transformers (HFCT) for cable termination PD activity.</p>\n<h3>Condition-Based Maintenance Action Plans</h3>\n<p>PD phase-resolved pulse analysis (PRPD) to classify discharge mechanisms (corona, surface, internal cavity), determine fault severity, and recommend scheduled repair before dielectric breakdown occurs.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Non-Invasive On-Line Partial Discharge Detection</h3>\n<p>Early-stage detection of insulation deterioration in live medium and high-voltage assets (switchgear, transformers, cables, and busducts) without requiring plant power shutdowns.</p>\n<h3>Multi-Sensor Measurement (TEV, Acoustic & HFCT)</h3>\n<p>Simultaneous utilization of Transient Earth Voltage (TEV) sensors for internal voids, ultrasonic acoustic probes for surface tracking, and High-Frequency Current Transformers (HFCT) for cable termination PD activity.</p>\n<h3>Condition-Based Maintenance Action Plans</h3>\n<p>PD phase-resolved pulse analysis (PRPD) to classify discharge mechanisms (corona, surface, internal cavity), determine fault severity, and recommend scheduled repair before dielectric breakdown occurs.</p>\nID: <h3>Deteksi Partial Discharge Bertegangan Non-Invasif (On-Line)</h3>\n<p>Deteksi dini gejala degradasi isolasi pada aset tegangan menengah dan tinggi (switchgear, transformator, kabel daya, dan busduct) saat beroperasi tanpa memerlukan penghentian suplai listrik pabrik.</p>\n<h3>Pengukuran Multi-Sensor (TEV, Akustik & HFCT)</h3>\n<p>Pemanfaatan sensor Transient Earth Voltage (TEV) untuk mendeteksi rongga internal, sensor ultrasonik akustik untuk gejala perambatan permukaan (surface tracking), serta High-Frequency Current Transformer (HFCT) untuk kabel daya.</p>\n<h3>Rencana Tindakan Pemeliharaan Berbasis Kondisi</h3>\n<p>Analisis bentuk pulsa fase (PRPD) untuk mengklasifikasikan jenis lucutan (korona, permukaan, rongga dalam), menentukan tingkat keparahan anomali, dan menyusun rekomendasi perbaikan terencana sebelum terjadi ledakan dielektrik.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/partial-discharge-pd-scan' OR slug = 'partial-discharge-pd-scan' OR title = 'Partial Discharge (PD) Scan & Insulation Diagnostics' OR title = 'Pemindaian Partial Discharge (PD) & Diagnostik Isolasi';

-- SERVICE: inspection-testing-commissioning/relay-protection-testing-commissioning (slug: relay-protection-testing-commissioning)
UPDATE services SET
  title = E'EN: Protection Relay Testing (Secondary Injection)\nID: Pengujian Relay Proteksi (Injeksi Sekunder)',
  summary = E'EN: 3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.\nID: Pengujian injeksi sekunder 3-fase & 6-fase menggunakan unit Omicron CMC untuk relay proteksi arus lebih, diferensial, dan jarak.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>\n<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>\n<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>\n<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>\n<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>\n<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Certified Protection Relay Secondary Injection Testing</h3>\n<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>\n<h3>Omicron Multi-Phase Automated Injection Sets</h3>\n<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>\n<h3>Coordination & Arc-Flash Clearing Time Verification</h3>\n<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Certified Protection Relay Secondary Injection Testing</h3>\n<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>\n<h3>Omicron Multi-Phase Automated Injection Sets</h3>\n<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>\n<h3>Coordination & Arc-Flash Clearing Time Verification</h3>\n<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>\nID: <h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>\n<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>\n<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>\n<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>\n<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>\n<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/relay-protection-testing-commissioning' OR slug = 'relay-protection-testing-commissioning' OR title = 'Protection Relay Testing (Secondary Injection)' OR title = 'Pengujian Relay Proteksi (Injeksi Sekunder)';

-- SERVICE: mechanical-services-supplies (slug: mechanical-services-supplies)
UPDATE services SET
  title = E'EN: Mechanical Services & General Supplies\nID: Layanan Mekanikal & Pengadaan Industri',
  summary = E'EN: Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.\nID: Pemeliharaan mekanikal industri, sistem konveyor, separator magnetik, pintu industri berkecepatan tinggi, vacuum lifter, dan servis motor/generator.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan Mekanikal Industri & Pengadaan Khusus</h3>\n<p>PT Multi Daya Mitra menyediakan layanan pemeliharaan mekanikal komprehensif, overhaul peralatan industri, dan solusi pengadaan rekayasa guna memaksimalkan waktu operasional mesin, efisiensi penanganan material, dan keselamatan kerja pabrik.</p>\n<h3>Perawatan Peralatan & Balancing Dinamis</h3>\n<p>Cakupan kami meliputi sistem konveyor industri, separator magnetik pemisah logam, pintu otomatis berkecepatan tinggi (high-speed door), peralatan vacuum lifter, serta overhaul mesin berputar mencakup balancing dinamis rotor dan pelapisan ulang isolasi stator motor.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Industrial Mechanical Services & Specialized Supplies</h3>\n<p>PT Multi Daya Mitra provides comprehensive mechanical maintenance, equipment overhauls, and engineered supply solutions to maximize plant machinery uptime, material handling efficiency, and operational safety.</p>\n<h3>Equipment Servicing & Dynamic Balancing</h3>\n<p>Our scope covers industrial conveyor systems, magnetic separators, high-speed spiral doors, vacuum lifting devices, and rotating machinery overhaul including dynamic rotor balancing and motor stator insulation rewinding.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial Mechanical Services & Specialized Supplies</h3>\n<p>PT Multi Daya Mitra provides comprehensive mechanical maintenance, equipment overhauls, and engineered supply solutions to maximize plant machinery uptime, material handling efficiency, and operational safety.</p>\n<h3>Equipment Servicing & Dynamic Balancing</h3>\n<p>Our scope covers industrial conveyor systems, magnetic separators, high-speed spiral doors, vacuum lifting devices, and rotating machinery overhaul including dynamic rotor balancing and motor stator insulation rewinding.</p>\nID: <h3>Layanan Mekanikal Industri & Pengadaan Khusus</h3>\n<p>PT Multi Daya Mitra menyediakan layanan pemeliharaan mekanikal komprehensif, overhaul peralatan industri, dan solusi pengadaan rekayasa guna memaksimalkan waktu operasional mesin, efisiensi penanganan material, dan keselamatan kerja pabrik.</p>\n<h3>Perawatan Peralatan & Balancing Dinamis</h3>\n<p>Cakupan kami meliputi sistem konveyor industri, separator magnetik pemisah logam, pintu otomatis berkecepatan tinggi (high-speed door), peralatan vacuum lifter, serta overhaul mesin berputar mencakup balancing dinamis rotor dan pelapisan ulang isolasi stator motor.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies' OR slug = 'mechanical-services-supplies' OR title = 'Mechanical Services & General Supplies' OR title = 'Layanan Mekanikal & Pengadaan Industri';

-- SERVICE: mechanical-services-supplies/industrial-mechanical-supplies-services (slug: industrial-mechanical-supplies-services)
UPDATE services SET
  title = E'EN: Conveyor Systems, Magnetic Separators & Industrial Supplies\nID: Sistem Konveyor, Separator Magnetik & Perlengkapan Industri',
  summary = E'EN: Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.\nID: Pengadaan, instalasi, dan servis lini konveyor, pemisah logam magnetik, sectional door, dan peralatan vacuum lifter.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>\n<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>\n<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>\n<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>\n<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>\n<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Material Handling & Mechanical Infrastructure Supplies</h3>\n<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>\n<h3>Conveyor Systems & Overband Magnetic Separators</h3>\n<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>\n<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>\n<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Material Handling & Mechanical Infrastructure Supplies</h3>\n<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>\n<h3>Conveyor Systems & Overband Magnetic Separators</h3>\n<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>\n<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>\n<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>\nID: <h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>\n<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>\n<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>\n<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>\n<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>\n<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/industrial-mechanical-supplies-services' OR slug = 'industrial-mechanical-supplies-services' OR title = 'Conveyor Systems, Magnetic Separators & Industrial Supplies' OR title = 'Sistem Konveyor, Separator Magnetik & Perlengkapan Industri';

-- SERVICE: mechanical-services-supplies/motor-generator-servicing-overhaul (slug: motor-generator-servicing-overhaul)
UPDATE services SET
  title = E'EN: Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)\nID: Overhaul Motor & Generator (Pelapisan Ulang Isolasi & Balancing Dinamis)',
  summary = E'EN: Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.\nID: Servis elektromotor, motor MV, generator, pelapisan ulang isolasi kumparan, analisis vibrasi, dan rekondisi rotor.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Layanan Overhaul Komprehensif Mesin Berputar</h3>\n<p>Pemeliharaan mekanik dan elektrikal presisi untuk motor listrik tegangan rendah dan menengah, motor industri berat, serta unit generator guna memulihkan kinerja spesifikasi awal pabrikan dan meniadakan vibrasi mekanikal.</p>\n<h3>Rewinding Kumparan Stator & Perendaman Pernis Vakum (VPI)</h3>\n<p>Rekondisi kumparan stator dan rotor, pelapisan ulang isolasi termal Kelas H, proses varnishing vakum, dan pengeringan oven untuk memulihkan ketahanan dielektrik serta mencegah kebocoran arus di lingkungan lembap industri.</p>\n<h3>Balancing Dinamis Rotor di Lapangan & Workshop</h3>\n<p>Balancing dinamis presisi standar ISO 1940 untuk poros rotor, blower impeller, dan kopling transmisi guna mengeliminasi getaran sentrifugal destruktif, memperpanjang usia bearing, dan meningkatkan keandalan motor.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Comprehensive Overhaul for Rotating Machinery</h3>\n<p>Precision mechanical and electrical maintenance for low and medium voltage electric motors, heavy industrial drives, and generator sets to restore OEM performance and eliminate mechanical vibration.</p>\n<h3>Stator Rewinding & Vacuum Pressure Impregnation (VPI)</h3>\n<p>Complete stator and rotor winding rehabilitation, class H insulation recoating, vacuum varnishing, and baking to restore dielectric strength, prevent partial discharge, and resist harsh industrial humidity.</p>\n<h3>On-Site & Workshop Dynamic Rotor Balancing</h3>\n<p>ISO 1940 standard precision dynamic balancing of rotors, fans, impellers, and couplings to eliminate destructive centrifugal vibration, reducing bearing wear and extending machine lifespan.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Comprehensive Overhaul for Rotating Machinery</h3>\n<p>Precision mechanical and electrical maintenance for low and medium voltage electric motors, heavy industrial drives, and generator sets to restore OEM performance and eliminate mechanical vibration.</p>\n<h3>Stator Rewinding & Vacuum Pressure Impregnation (VPI)</h3>\n<p>Complete stator and rotor winding rehabilitation, class H insulation recoating, vacuum varnishing, and baking to restore dielectric strength, prevent partial discharge, and resist harsh industrial humidity.</p>\n<h3>On-Site & Workshop Dynamic Rotor Balancing</h3>\n<p>ISO 1940 standard precision dynamic balancing of rotors, fans, impellers, and couplings to eliminate destructive centrifugal vibration, reducing bearing wear and extending machine lifespan.</p>\nID: <h3>Layanan Overhaul Komprehensif Mesin Berputar</h3>\n<p>Pemeliharaan mekanik dan elektrikal presisi untuk motor listrik tegangan rendah dan menengah, motor industri berat, serta unit generator guna memulihkan kinerja spesifikasi awal pabrikan dan meniadakan vibrasi mekanikal.</p>\n<h3>Rewinding Kumparan Stator & Perendaman Pernis Vakum (VPI)</h3>\n<p>Rekondisi kumparan stator dan rotor, pelapisan ulang isolasi termal Kelas H, proses varnishing vakum, dan pengeringan oven untuk memulihkan ketahanan dielektrik serta mencegah kebocoran arus di lingkungan lembap industri.</p>\n<h3>Balancing Dinamis Rotor di Lapangan & Workshop</h3>\n<p>Balancing dinamis presisi standar ISO 1940 untuk poros rotor, blower impeller, dan kopling transmisi guna mengeliminasi getaran sentrifugal destruktif, memperpanjang usia bearing, dan meningkatkan keandalan motor.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/motor-generator-servicing-overhaul' OR slug = 'motor-generator-servicing-overhaul' OR title = 'Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)' OR title = 'Overhaul Motor & Generator (Pelapisan Ulang Isolasi & Balancing Dinamis)';

-- SERVICE: grounding-lightning-protection (slug: grounding-lightning-protection)
UPDATE services SET
  title = E'EN: Grounding & Lightning Protection System\nID: Sistem Pembumian & Proteksi Petir',
  summary = E'EN: Deep well grounding installation, exothermic CAD welding, copper tape routing, and early streamer emission (ESE) lightning protection.\nID: Instalasi pembumian deep well, pengelasan eksotermik CAD, penarikan pita tembaga, dan penangkal petir elektrostatis (ESE).',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rekayasa Proteksi Petir & Pembumian Industri</h3>\n<p>Rekayasa teknik dan instalasi tersertifikasi untuk jaringan pembumian (grounding) dan sistem penangkal petir eksternal sesuai standar PUIL 2011, SNI 03-7015, dan NFPA 780 demi melindungi aset industri vital serta keselamatan personil.</p>\n<h3>Pembumian Deep Well & Pengelasan Eksotermik CAD</h3>\n<p>Pengeboran deep well dengan batang tembaga murni, bahan peningkat konduktivitas tanah (Bentonite / semen konduktif), serta penyambungan molekuler exothermic CAD weld guna mencapai nilai tahanan tanah di bawah 1 Ohm.</p>\n<h3>Penangkal Petir Elektrostatis (ESE) & Sangkar Faraday</h3>\n<p>Pemasangan penangkal petir elektrostatis ESE beradius proteksi luas, konduktor penyalur petir non-induktif, penghitung sambaran petir (strike counter), dan arrester proteksi surja (SPD) pada panel listrik.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Industrial Grounding & Lightning Safety Engineering</h3>\n<p>Comprehensive engineering and certified installation of grounding earthing networks and external lightning protection systems adhering to PUIL 2011, SNI 03-7015, and NFPA 780 standards to safeguard critical industrial facilities and personnel.</p>\n<h3>Deep Well Grounding & CAD Exothermic Welding</h3>\n<p>Deep drilled copper grounding rods, low-resistance soil enhancement materials (Bentonite / conductive cement), and molecular exothermic CAD welding joints achieving system resistance below 1 Ohm.</p>\n<h3>Early Streamer Emission (ESE) & Faraday Cage Protection</h3>\n<p>Turnkey erection of electrostatic ESE air terminals, non-inductive down-conductors, lightning surge strike counters, and surge protective devices (SPD) across distribution switchboards.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial Grounding & Lightning Safety Engineering</h3>\n<p>Comprehensive engineering and certified installation of grounding earthing networks and external lightning protection systems adhering to PUIL 2011, SNI 03-7015, and NFPA 780 standards to safeguard critical industrial facilities and personnel.</p>\n<h3>Deep Well Grounding & CAD Exothermic Welding</h3>\n<p>Deep drilled copper grounding rods, low-resistance soil enhancement materials (Bentonite / conductive cement), and molecular exothermic CAD welding joints achieving system resistance below 1 Ohm.</p>\n<h3>Early Streamer Emission (ESE) & Faraday Cage Protection</h3>\n<p>Turnkey erection of electrostatic ESE air terminals, non-inductive down-conductors, lightning surge strike counters, and surge protective devices (SPD) across distribution switchboards.</p>\nID: <h3>Rekayasa Proteksi Petir & Pembumian Industri</h3>\n<p>Rekayasa teknik dan instalasi tersertifikasi untuk jaringan pembumian (grounding) dan sistem penangkal petir eksternal sesuai standar PUIL 2011, SNI 03-7015, dan NFPA 780 demi melindungi aset industri vital serta keselamatan personil.</p>\n<h3>Pembumian Deep Well & Pengelasan Eksotermik CAD</h3>\n<p>Pengeboran deep well dengan batang tembaga murni, bahan peningkat konduktivitas tanah (Bentonite / semen konduktif), serta penyambungan molekuler exothermic CAD weld guna mencapai nilai tahanan tanah di bawah 1 Ohm.</p>\n<h3>Penangkal Petir Elektrostatis (ESE) & Sangkar Faraday</h3>\n<p>Pemasangan penangkal petir elektrostatis ESE beradius proteksi luas, konduktor penyalur petir non-induktif, penghitung sambaran petir (strike counter), dan arrester proteksi surja (SPD) pada panel listrik.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/grounding-lightning-protection' OR slug = 'grounding-lightning-protection' OR title = 'Grounding & Lightning Protection System' OR title = 'Sistem Pembumian & Proteksi Petir';

-- SERVICE: busduct-canalis-installation (slug: busduct-canalis-installation)
UPDATE services SET
  title = E'EN: Busduct & Canalis Trunking Installation\nID: Instalasi Busduct & Trunking Canalis',
  summary = E'EN: High-amperage sandwich busduct feeder erection, tap-off unit installation, and torque-checked jointing for industrial plants.\nID: Pemasangan busduct sandwich ampere tinggi, unit tap-off, dan penyambungan terverifikasi torsi untuk pabrik industri.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Busduct Distribusi Tenaga Listrik Kapasitas Tinggi</h3>\n<p>Instalasi presisi, penggantungan (hanger), dan komisioning sistem busduct sandwich tembaga dan aluminium dari 630A hingga 6300A, menghadirkan penyaluran energi hemat ruang dan berdaya hantar tinggi untuk fasilitas bertingkat dan lantai pabrik.</p>\n<h3>Penyambungan Terkontrol Torsi & Fire Barrier</h3>\n<p>Pemasangan baut sambungan berindikator torsi ganda (torque shear bolts), pelat kontak berlapis perak, sekat penahan api (fire barrier) pada penetrasi dinding/lantai, serta sambungan ekspansi fleksibel.</p>\n<h3>Unit Tap-Off & Pengujian Komisioning</h3>\n<p>Pemasangan unit tap-off plug-in berproteksi MCCB, verifikasi urutan fasa, pengukuran resistansi sambungan mikro-ohm, serta uji ketahanan isolasi tegangan tinggi.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>High-Capacity Industrial Power Busduct Systems</h3>\n<p>Precision installation, suspension, and commissioning of compact sandwich copper and aluminum busduct systems from 630A up to 6300A, providing high-efficiency, space-saving power distribution across multi-story buildings and factory floors.</p>\n<h3>Torque-Controlled Jointing & Fire Barriers</h3>\n<p>Installation of double-headed torque indicator bolts, joint packs with silver-plated contact surfaces, integrated fire-stop barriers at floor/wall penetrations, and flexible expansion joints.</p>\n<h3>Tap-Off Units & Commissioning Testing</h3>\n<p>Mounting of plug-in tap-off units with MCCB protection, phase sequence verification, micro-ohm joint resistance measurement, and high-voltage insulation resistance testing.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>High-Capacity Industrial Power Busduct Systems</h3>\n<p>Precision installation, suspension, and commissioning of compact sandwich copper and aluminum busduct systems from 630A up to 6300A, providing high-efficiency, space-saving power distribution across multi-story buildings and factory floors.</p>\n<h3>Torque-Controlled Jointing & Fire Barriers</h3>\n<p>Installation of double-headed torque indicator bolts, joint packs with silver-plated contact surfaces, integrated fire-stop barriers at floor/wall penetrations, and flexible expansion joints.</p>\n<h3>Tap-Off Units & Commissioning Testing</h3>\n<p>Mounting of plug-in tap-off units with MCCB protection, phase sequence verification, micro-ohm joint resistance measurement, and high-voltage insulation resistance testing.</p>\nID: <h3>Sistem Busduct Distribusi Tenaga Listrik Kapasitas Tinggi</h3>\n<p>Instalasi presisi, penggantungan (hanger), dan komisioning sistem busduct sandwich tembaga dan aluminium dari 630A hingga 6300A, menghadirkan penyaluran energi hemat ruang dan berdaya hantar tinggi untuk fasilitas bertingkat dan lantai pabrik.</p>\n<h3>Penyambungan Terkontrol Torsi & Fire Barrier</h3>\n<p>Pemasangan baut sambungan berindikator torsi ganda (torque shear bolts), pelat kontak berlapis perak, sekat penahan api (fire barrier) pada penetrasi dinding/lantai, serta sambungan ekspansi fleksibel.</p>\n<h3>Unit Tap-Off & Pengujian Komisioning</h3>\n<p>Pemasangan unit tap-off plug-in berproteksi MCCB, verifikasi urutan fasa, pengukuran resistansi sambungan mikro-ohm, serta uji ketahanan isolasi tegangan tinggi.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/busduct-canalis-installation' OR slug = 'busduct-canalis-installation' OR title = 'Busduct & Canalis Trunking Installation' OR title = 'Instalasi Busduct & Trunking Canalis';

-- SERVICE: low-voltage-switchboard-maintenance (slug: low-voltage-switchboard-maintenance)
UPDATE services SET
  title = E'EN: Low Voltage Switchboard Maintenance\nID: Pemeliharaan Papan Hubung Tegangan Rendah',
  summary = E'EN: ACB/MCCB servicing, cradle mechanism testing, thermal scanning, and digital trip unit secondary injection calibration.\nID: Servis ACB/MCCB, pengujian mekanisme cradle, pemindaian termal, dan kalibrasi injeksi sekunder trip unit digital.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Overhaul & Pemeliharaan Panel Distribusi Tegangan Rendah</h3>\n<p>Servis preventif rutin dan rekondisi mekanikal untuk Panel Distribusi Utama (LVMDP), Sub-Distribusi (SDP), dan Motor Control Center (MCC) hingga 1000V.</p>\n<h3>Diagnostik Circuit Breaker & Injeksi Sekunder</h3>\n<p>Kalibrasi trip unit digital / MicroLogic dengan alat uji injeksi sekunder, inspeksi keausan kontak utama, pelumasan mekanisme draw-out cradle, dan uji dielektrik.</p>\n<h3>Pemeriksaan Torsi Busbar & Pembersihan Kompartemen</h3>\n<p>Pengencangan torsi baut busbar panel, verifikasi termografi inframerah, pembersihan isolator pencegah tracking arus bocor, serta pengujian relai bantu.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Low Voltage Switchboard Overhaul & Servicing</h3>\n<p>Routine preventive servicing and mechanical reconditioning of Main Distribution Panels (MDP), Sub-Distribution Boards, and Motor Control Centers (MCC) up to 1000V.</p>\n<h3>Circuit Breaker Diagnostics & Secondary Injection</h3>\n<p>MicroLogic / digital trip unit calibration via secondary injection, contact wear inspection, cradle racking mechanism lubrication, and dielectric tests.</p>\n<h3>Busbar Joint Retorquing & De-dusting</h3>\n<p>Complete panel busbar retorquing, infrared thermographic verification, anti-tracking insulation barrier cleaning, and auxiliary relay testing.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Low Voltage Switchboard Overhaul & Servicing</h3>\n<p>Routine preventive servicing and mechanical reconditioning of Main Distribution Panels (MDP), Sub-Distribution Boards, and Motor Control Centers (MCC) up to 1000V.</p>\n<h3>Circuit Breaker Diagnostics & Secondary Injection</h3>\n<p>MicroLogic / digital trip unit calibration via secondary injection, contact wear inspection, cradle racking mechanism lubrication, and dielectric tests.</p>\n<h3>Busbar Joint Retorquing & De-dusting</h3>\n<p>Complete panel busbar retorquing, infrared thermographic verification, anti-tracking insulation barrier cleaning, and auxiliary relay testing.</p>\nID: <h3>Overhaul & Pemeliharaan Panel Distribusi Tegangan Rendah</h3>\n<p>Servis preventif rutin dan rekondisi mekanikal untuk Panel Distribusi Utama (LVMDP), Sub-Distribusi (SDP), dan Motor Control Center (MCC) hingga 1000V.</p>\n<h3>Diagnostik Circuit Breaker & Injeksi Sekunder</h3>\n<p>Kalibrasi trip unit digital / MicroLogic dengan alat uji injeksi sekunder, inspeksi keausan kontak utama, pelumasan mekanisme draw-out cradle, dan uji dielektrik.</p>\n<h3>Pemeriksaan Torsi Busbar & Pembersihan Kompartemen</h3>\n<p>Pengencangan torsi baut busbar panel, verifikasi termografi inframerah, pembersihan isolator pencegah tracking arus bocor, serta pengujian relai bantu.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/low-voltage-switchboard-maintenance' OR slug = 'low-voltage-switchboard-maintenance' OR title = 'Low Voltage Switchboard Maintenance' OR title = 'Pemeliharaan Papan Hubung Tegangan Rendah';

-- SERVICE: ups-battery-bank-maintenance (slug: ups-battery-bank-maintenance)
UPDATE services SET
  title = E'EN: Industrial UPS & Battery Bank Maintenance\nID: Pemeliharaan UPS Industri & Bank Baterai',
  summary = E'EN: Impedance testing, conductance measurement, cell equalization, and autonomy discharge runtime testing for critical power UPS.\nID: Uji impedansi baterai, pengukuran konduktansi, ekualisasi sel, dan pengujian runtime debit untuk sistem UPS kritis.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Pemeliharaan Sistem UPS Industri & Bank Baterai</h3>\n<p>Pengujian siklus hidup, servis preventif berkala, dan verifikasi kapasitas runtime untuk unit Uninterruptible Power Supply (UPS) industri dan bank baterai VRLA / Ni-Cd guna menjamin kontinuitas daya kritis.</p>\n<h3>Pengujian Impedansi & Konduktansi Sel Baterai</h3>\n<p>Pengukuran resistansi internal dan konduktansi tiap sel baterai menggunakan battery analyzer Fluke terkalibrasi untuk mendeteksi sel yang mulai rusak sebelum merusak seluruh rangkaian.</p>\n<h3>Uji Pelepasan Beban Penuh & Pencegahan Thermal Runaway</h3>\n<p>Uji pelepasan beban terkontrol menggunakan dummy load, penyeimbangan muatan sel (equalization), pengukuran riak tegangan DC bus, dan verifikasi kompensasi suhu pengisian daya.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Industrial UPS Systems & Battery Bank Maintenance</h3>\n<p>Lifecycle testing, preventive servicing, and runtime capacity verification for industrial Uninterruptible Power Supply (UPS) units and VRLA / Ni-Cd battery banks ensuring mission-critical continuity.</p>\n<h3>Cell Impedance & Conductance Testing</h3>\n<p>Internal cell resistance and conductance measurements using calibrated Fluke battery analyzers to detect deteriorating cells before bank-wide failure.</p>\n<h3>Full-Load Discharge & Thermal Runaway Prevention</h3>\n<p>Controlled dummy-load discharge testing, cell equalization charge balancing, DC bus ripple voltage measurement, and temperature-compensated charging checks.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial UPS Systems & Battery Bank Maintenance</h3>\n<p>Lifecycle testing, preventive servicing, and runtime capacity verification for industrial Uninterruptible Power Supply (UPS) units and VRLA / Ni-Cd battery banks ensuring mission-critical continuity.</p>\n<h3>Cell Impedance & Conductance Testing</h3>\n<p>Internal cell resistance and conductance measurements using calibrated Fluke battery analyzers to detect deteriorating cells before bank-wide failure.</p>\n<h3>Full-Load Discharge & Thermal Runaway Prevention</h3>\n<p>Controlled dummy-load discharge testing, cell equalization charge balancing, DC bus ripple voltage measurement, and temperature-compensated charging checks.</p>\nID: <h3>Pemeliharaan Sistem UPS Industri & Bank Baterai</h3>\n<p>Pengujian siklus hidup, servis preventif berkala, dan verifikasi kapasitas runtime untuk unit Uninterruptible Power Supply (UPS) industri dan bank baterai VRLA / Ni-Cd guna menjamin kontinuitas daya kritis.</p>\n<h3>Pengujian Impedansi & Konduktansi Sel Baterai</h3>\n<p>Pengukuran resistansi internal dan konduktansi tiap sel baterai menggunakan battery analyzer Fluke terkalibrasi untuk mendeteksi sel yang mulai rusak sebelum merusak seluruh rangkaian.</p>\n<h3>Uji Pelepasan Beban Penuh & Pencegahan Thermal Runaway</h3>\n<p>Uji pelepasan beban terkontrol menggunakan dummy load, penyeimbangan muatan sel (equalization), pengukuran riak tegangan DC bus, dan verifikasi kompensasi suhu pengisian daya.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/ups-battery-bank-maintenance' OR slug = 'ups-battery-bank-maintenance' OR title = 'Industrial UPS & Battery Bank Maintenance' OR title = 'Pemeliharaan UPS Industri & Bank Baterai';

-- SERVICE: building-automation-system-bas (slug: building-automation-system-bas)
UPDATE services SET
  title = E'EN: Building Automation & HVAC Control (BAS)\nID: Otomasi Gedung & Kontrol HVAC (BAS)',
  summary = E'EN: Centralized HVAC chiller plant optimization, AHU VAV control, lighting automation, and Modbus/BACnet integration.\nID: Optimasi sistem pendingin chiller HVAC, kontrol AHU VAV, otomasi tata cahaya, dan integrasi protokol Modbus/BACnet.',
  content = '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Sistem Otomasi Gedung Pintar (BAS / BMS)</h3>\n<p>Rekayasa Sistem Manajemen Gedung (BMS) terpadu untuk mengoptimalkan kinerja HVAC, sistem chiller sentral, tata cahaya cerdas, dan kualitas udara ruangan pada gedung komersial serta cleanroom industri.</p>\n<h3>Optimasi Sentral Chiller & Kontrol AHU VAV</h3>\n<p>Algoritma otomatis delta-T staging untuk chiller air, sekuensial pompa aliran primer variabel, kontrol VFD kipas cooling tower dinamis, serta ventilasi kebutuhan udara berbasis sensor CO2.</p>\n<h3>Integrasi Protokol Terbuka BACnet & Modbus</h3>\n<p>Perangkat lunak supervisi terpadu yang menghubungkan kontroler lapangan multi-vendor, power meter digital, antarmuka alarm kebakaran, dan pemantauan lift ke satu dasbor komando terpusat.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Intelligent Building Automation Systems (BAS / BMS)</h3>\n<p>Integrated Building Management Systems engineering optimizing HVAC, central chiller plants, lighting, and indoor air quality across commercial buildings and industrial cleanrooms.</p>\n<h3>Chiller Plant Optimization & VAV AHU Controls</h3>\n<p>Automated delta-T staging algorithms for water chillers, variable primary flow pump sequencing, dynamic cooling tower fan VFD control, and CO2-demand ventilation.</p>\n<h3>BACnet / Modbus Open Protocol Integration</h3>\n<p>Unified supervisory software connecting multi-vendor field controllers, smart energy meters, fire alarm interfaces, and elevator status into a centralized command dashboard.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Intelligent Building Automation Systems (BAS / BMS)</h3>\n<p>Integrated Building Management Systems engineering optimizing HVAC, central chiller plants, lighting, and indoor air quality across commercial buildings and industrial cleanrooms.</p>\n<h3>Chiller Plant Optimization & VAV AHU Controls</h3>\n<p>Automated delta-T staging algorithms for water chillers, variable primary flow pump sequencing, dynamic cooling tower fan VFD control, and CO2-demand ventilation.</p>\n<h3>BACnet / Modbus Open Protocol Integration</h3>\n<p>Unified supervisory software connecting multi-vendor field controllers, smart energy meters, fire alarm interfaces, and elevator status into a centralized command dashboard.</p>\nID: <h3>Sistem Otomasi Gedung Pintar (BAS / BMS)</h3>\n<p>Rekayasa Sistem Manajemen Gedung (BMS) terpadu untuk mengoptimalkan kinerja HVAC, sistem chiller sentral, tata cahaya cerdas, dan kualitas udara ruangan pada gedung komersial serta cleanroom industri.</p>\n<h3>Optimasi Sentral Chiller & Kontrol AHU VAV</h3>\n<p>Algoritma otomatis delta-T staging untuk chiller air, sekuensial pompa aliran primer variabel, kontrol VFD kipas cooling tower dinamis, serta ventilasi kebutuhan udara berbasis sensor CO2.</p>\n<h3>Integrasi Protokol Terbuka BACnet & Modbus</h3>\n<p>Perangkat lunak supervisi terpadu yang menghubungkan kontroler lapangan multi-vendor, power meter digital, antarmuka alarm kebakaran, dan pemantauan lift ke satu dasbor komando terpusat.</p>"}]}'::jsonb,
  updated_at = now()
WHERE full_path = 'automation-solutions-services/building-automation-system-bas' OR slug = 'building-automation-system-bas' OR title = 'Building Automation & HVAC Control (BAS)' OR title = 'Otomasi Gedung & Kontrol HVAC (BAS)';

-- LEGACY SERVICE: electrical-engineering
UPDATE services SET
  title = E'EN: Electrical Engineering & Contracting\nID: Rekayasa Teknik & Kontraktor Elektrikal',
  summary = E'EN: End-to-end industrial electrical engineering, turnkey substation installation, switchgear, and testing.\nID: Rekayasa elektrikal industri menyeluruh, instalasi gardu induk turnkey, switchgear, dan pengujian.',
  updated_at = now()
WHERE full_path = 'electrical-engineering' OR slug = 'electrical-engineering';

-- LEGACY SERVICE: automation
UPDATE services SET
  title = E'EN: Industrial Automation & Control Systems\nID: Otomasi Industri & Sistem Kendali',
  summary = E'EN: PLC, HMI, SCADA programming, variable speed drives, and centralized process telemetry.\nID: Pemrograman PLC, HMI, SCADA, variable speed drive, dan telemetri proses terpusat.',
  updated_at = now()
WHERE full_path = 'automation' OR slug = 'automation';

-- LEGACY SERVICE: maintenance
UPDATE services SET
  title = E'EN: Industrial Electrical Maintenance & Overhaul\nID: Pemeliharaan & Overhaul Elektrikal Industri',
  summary = E'EN: Predictive diagnostics, transformer oil treatment, switchboard overhaul, and annual shutdown service.\nID: Diagnostik prediktif, pemurnian minyak trafo, overhaul panel distribusi, dan servis shutdown tahunan.',
  updated_at = now()
WHERE full_path = 'maintenance' OR slug = 'maintenance';

-- LEGACY SERVICE: fire-alarm
UPDATE services SET
  title = E'EN: Fire Alarm System Engineering & Installation\nID: Rekayasa & Instalasi Sistem Fire Alarm',
  summary = E'EN: Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.\nID: Jaringan fire alarm addressable terintegrasi, detektor multi-sensor, aspirating smoke detection, dan sistem pemadam clean agent.',
  updated_at = now()
WHERE full_path = 'fire-alarm' OR slug = 'fire-alarm';

-- LEGACY SERVICE: testing-measurement
UPDATE services SET
  title = E'EN: Inspection, Testing & Commissioning Services\nID: Layanan Inspeksi, Pengujian & Komisioning',
  summary = E'EN: Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.\nID: Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.',
  updated_at = now()
WHERE full_path = 'testing-measurement' OR slug = 'testing-measurement';

-- LEGACY SERVICE: secondary-injector-3-and-6-phase-current-voltage
UPDATE services SET
  title = E'EN: Protection Relay Testing (Secondary Injection 3 & 6 Phase)\nID: Pengujian Relay Proteksi (Injeksi Sekunder 3 & 6 Fasa)',
  summary = E'EN: Secondary injection testing for protection relays, metering, and generator control with calibrated Omicron CMC sets.\nID: Uji injeksi sekunder relay proteksi, metering, dan kontrol generator dengan unit terkalibrasi Omicron CMC.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/secondary-injector-3-and-6-phase-current-voltage' OR slug = 'secondary-injector-3-and-6-phase-current-voltage';

-- LEGACY SERVICE: partial-discharge-analyzer-pd-scan
UPDATE services SET
  title = E'EN: Partial Discharge (PD) Scan & Insulation Diagnostics\nID: Pemindaian Partial Discharge (PD) & Diagnostik Isolasi',
  summary = E'EN: Non-invasive TEV, ultrasonic, and HFCT sensor scanning for early fault detection in live MV/HV switchgear and cables.\nID: Pemindaian sensor non-invasif TEV, ultrasonik, dan HFCT untuk deteksi dini isolasi pada switchgear dan kabel tegangan menengah.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/partial-discharge-analyzer-pd-scan' OR slug = 'partial-discharge-analyzer-pd-scan';

-- LEGACY SERVICE: contact-resistance-low-ohm-measurement
UPDATE services SET
  title = E'EN: Contact Resistance & Low-Ohm Ductor Testing\nID: Pengujian Resistansi Kontak & Ductor Mikro-Ohm',
  summary = E'EN: Precision micro-ohm contact resistance testing for breaker poles, busbar joints, and cable lugs.\nID: Pengukuran resistansi kontak mikro-ohm presisi untuk kontak pemutus, sambungan busbar, dan sepatu kabel.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/contact-resistance-low-ohm-measurement' OR slug = 'contact-resistance-low-ohm-measurement';

-- LEGACY SERVICE: micrologic-test-kit-fftk-schneider
UPDATE services SET
  title = E'EN: Schneider Micrologic Full Function Testing (FFTK)\nID: Pengujian Micrologic Schneider Full Function Test Kit (FFTK)',
  summary = E'EN: Automated verification of Schneider MasterPact ACB electronic trip units and energy metering.\nID: Verifikasi otomatis unit trip elektronik ACB Schneider MasterPact dan pengukuran energi.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/micrologic-test-kit-fftk-schneider' OR slug = 'micrologic-test-kit-fftk-schneider';

-- LEGACY SERVICE: power-quality-analyzer
UPDATE services SET
  title = E'EN: Power Quality Analysis & Harmonics Study\nID: Analisis Kualitas Daya & Studi Harmonisa',
  summary = E'EN: Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, and mitigation.\nID: Perekaman kualitas daya Kelas A, audit distorsi harmonisa (THD), fluktuasi tegangan, dan mitigasi.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/power-quality-analyzer' OR slug = 'power-quality-analyzer';

-- LEGACY SERVICE: circuit-breaker-analyzer
UPDATE services SET
  title = E'EN: Circuit Breaker Motion & Timing Analysis\nID: Analisis Waktu & Karakteristik Dinamis Circuit Breaker',
  summary = E'EN: Timing, motion, contact bounce, and coil current analysis for MV/LV circuit breakers.\nID: Analisis waktu buka-tutup, bouncing kontak, dan profil arus koil pada breaker tegangan menengah & rendah.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/circuit-breaker-analyzer' OR slug = 'circuit-breaker-analyzer';

-- LEGACY SERVICE: infrared-thermal-imaging-thermograph
UPDATE services SET
  title = E'EN: Infrared Thermography & Predictive Maintenance\nID: Termografi Inframerah & Pemeliharaan Prediktif',
  summary = E'EN: High-resolution thermal scanning to detect loose busbar joints, overloaded phases, and hot spots under full load.\nID: Pemindaian termal resolusi tinggi mendeteksi sambungan longgar, fase beban lebih, dan anomali panas.',
  updated_at = now()
WHERE full_path = 'electrical-services/testing-measurement/infrared-thermal-imaging-thermograph' OR slug = 'infrared-thermal-imaging-thermograph';

-- LEGACY SERVICE: predictive-maintenance
UPDATE services SET
  title = E'EN: Predictive & Condition-Based Electrical Maintenance\nID: Pemeliharaan Listrik Prediktif & Berbasis Kondisi',
  summary = E'EN: Condition-based diagnostic monitoring using on-line sensors, thermography, and partial discharge tracking.\nID: Pemantauan diagnostik berbasis kondisi menggunakan sensor online, termografi, dan pelacakan partial discharge.',
  updated_at = now()
WHERE full_path = 'electrical-services/maintenance/predictive-maintenance' OR slug = 'predictive-maintenance';

-- LEGACY SERVICE: preventive-maintenance
UPDATE services SET
  title = E'EN: Preventive Shutdown Maintenance & Servicing\nID: Pemeliharaan Preventif & Servis Shutdown Berkala',
  summary = E'EN: Scheduled shutdown servicing for MV/LV switchboards, transformers, and protection systems.\nID: Servis shutdown berkala untuk panel distribusi MV/LV, transformator, dan sistem proteksi.',
  updated_at = now()
WHERE full_path = 'electrical-services/maintenance/preventive-maintenance' OR slug = 'preventive-maintenance';

-- LEGACY SERVICE: maintenance-contract
UPDATE services SET
  title = E'EN: Annual Maintenance Contracts (AMC) & 24/7 SLA\nID: Kontrak Pemeliharaan Tahunan (AMC) & SLA Siaga 24/7',
  summary = E'EN: Comprehensive maintenance contracts with scheduled checklists, emergency call-outs, and guaranteed response times.\nID: Kontrak pemeliharaan komprehensif dengan checklist berkala, tanggap darurat, dan jaminan waktu respons.',
  updated_at = now()
WHERE full_path = 'electrical-services/maintenance/maintenance-contract' OR slug = 'maintenance-contract';

-- LEGACY SERVICE: construction-installation
UPDATE services SET
  title = E'EN: Electrical Construction & Installation\nID: Konstruksi & Instalasi Elektrikal',
  summary = E'EN: Turnkey medium & low voltage substation installation, switchgear, distribution panels, and cabling.\nID: Instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, dan pengkabelan.',
  updated_at = now()
WHERE full_path = 'electrical-services/construction-installation' OR slug = 'construction-installation';

-- LEGACY SERVICE: engineering-solution
UPDATE services SET
  title = E'EN: Electrical Engineering Solutions & Power Quality\nID: Solusi Rekayasa Elektrikal & Kualitas Daya',
  summary = E'EN: Turnkey engineering solutions including lightning protection, power monitoring, and active harmonic filtering.\nID: Solusi rekayasa siap pakai mencakup proteksi petir, pemantauan daya, dan filter harmonisa aktif.',
  updated_at = now()
WHERE full_path = 'electrical-services/engineering-solution' OR slug = 'engineering-solution';

-- LEGACY SERVICE: lightning-protection-system
UPDATE services SET
  title = E'EN: Grounding & Lightning Protection System\nID: Sistem Pembumian & Proteksi Petir',
  summary = E'EN: Deep well grounding installation, CAD exothermic welding, and early streamer emission (ESE) lightning protection.\nID: Instalasi pembumian deep well, pengelasan eksotermik CAD, dan penangkal petir elektrostatis (ESE).',
  updated_at = now()
WHERE full_path = 'electrical-services/engineering-solution/lightning-protection-system' OR slug = 'lightning-protection-system';

-- LEGACY SERVICE: power-monitoring-system
UPDATE services SET
  title = E'EN: Energy Management Systems (EMS & ISO 50001)\nID: Sistem Manajemen Energi (EMS & ISO 50001)',
  summary = E'EN: Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG compliance reporting.\nID: Pemantauan daya real-time, baseline energi otomatis, pelacakan beban puncak, dan pelaporan ESG.',
  updated_at = now()
WHERE full_path = 'electrical-services/engineering-solution/power-monitoring-system' OR slug = 'power-monitoring-system';

-- LEGACY SERVICE: active-harmonic-filter
UPDATE services SET
  title = E'EN: Active Harmonic Filters (AHF) & Power Factor Correction\nID: Filter Harmonisa Aktif (AHF) & Perbaikan Faktor Daya',
  summary = E'EN: Dynamic harmonic mitigation up to the 50th order and instantaneous power factor correction for industrial loads.\nID: Mitigasi harmonisa dinamis hingga orde ke-50 dan perbaikan faktor daya instan untuk beban industri.',
  updated_at = now()
WHERE full_path = 'electrical-services/engineering-solution/active-harmonic-filter' OR slug = 'active-harmonic-filter';

-- ==========================================
-- Migration: 040_bilingual_page_content_about.up.sql
-- ==========================================

UPDATE pages
SET content = jsonb_build_object(
      'overview', 'EN: Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.' || E'\n' || 'ID: Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.',
      'vision', 'EN: Global Electrical, Automation and Fire Alarm Services Company.' || E'\n' || 'ID: Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.',
      'mission', 'EN: Mutual Partnership and Professionalism in delivering every engineering engagement.' || E'\n' || 'ID: Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.',
      'tagline', 'EN: Always Make an IMPACT - Powering Solution, Creating Impact' || E'\n' || 'ID: Always Make an IMPACT - Solusi Kelistrikan Andal, Menciptakan Dampak Nyata',
      'culture', 'EN: The company culture in a professional manner brings the company to move fast in achieving every step of its vision.' || E'\n' || 'ID: Budaya perusahaan yang menjunjung tinggi profesionalisme mendorong gerak cepat perusahaan dalam mewujudkan setiap langkah visinya.',
      'established', '2012',
      'experienceYears', '14+',
      'clientCount', '400+',
      'teamCount', '200+',
      'values', jsonb_build_array(
        'EN: Integrity & Innovation' || E'\n' || 'ID: Integritas & Inovasi',
        'EN: Mastery & Intelligent Problem-Solving' || E'\n' || 'ID: Keahlian Teknis & Solusi Cerdas',
        'EN: Professional & Trusted Partnership' || E'\n' || 'ID: Kemitraan Profesional & Terpercaya',
        'EN: Agile & Adaptable Execution' || E'\n' || 'ID: Eksekusi Tangkas & Adaptif',
        'EN: Commitment to Safety & Customer First' || E'\n' || 'ID: Komitmen Keselamatan (K3) & Utamakan Pelanggan',
        'EN: Total Engineering Solutions' || E'\n' || 'ID: Solusi Rekayasa Teknik Menyeluruh'
      ),
      'impactValues', jsonb_build_array(
        jsonb_build_object(
          'letter', 'I',
          'title', 'EN: Integrity & Innovation' || E'\n' || 'ID: Integritas & Inovasi',
          'desc', 'EN: Building trust through honesty and responsibility while advancing with modern, up-to-date technologies.' || E'\n' || 'ID: Membangun kepercayaan melalui kejujuran dan tanggung jawab seraya terus berinovasi dengan teknologi termutakhir.'
        ),
        jsonb_build_object(
          'letter', 'M',
          'title', 'EN: Mastery & Intelligent Problem-Solving' || E'\n' || 'ID: Keahlian Teknis & Solusi Cerdas',
          'desc', 'EN: Deep technical mastery in electrical and automation systems with structured precision engineering — not assumptions.' || E'\n' || 'ID: Penguasaan teknis mendalam di bidang sistem kelistrikan dan otomasi melalui rekayasa presisi yang terstruktur — bukan asumsi.'
        ),
        jsonb_build_object(
          'letter', 'P',
          'title', 'EN: Professional & Trusted Partnership' || E'\n' || 'ID: Kemitraan Profesional & Terpercaya',
          'desc', 'EN: Discipline, consistency, and high execution standards that position us as a strategic long-term partner.' || E'\n' || 'ID: Disiplin, konsistensi, dan standar eksekusi tinggi yang menempatkan kami sebagai mitra strategis jangka panjang.'
        ),
        jsonb_build_object(
          'letter', 'A',
          'title', 'EN: Agile & Adaptable Execution' || E'\n' || 'ID: Eksekusi Tangkas & Adaptif',
          'desc', 'EN: Swift, resilient response to evolving site dynamics, operational challenges, and technological demands.' || E'\n' || 'ID: Tanggap dan tangguh dalam merespons dinamika lapangan yang berkembang, tantangan operasional, dan tuntutan teknologi.'
        ),
        jsonb_build_object(
          'letter', 'C',
          'title', 'EN: Commitment to Safety & Customer First' || E'\n' || 'ID: Komitmen Keselamatan (K3) & Utamakan Pelanggan',
          'desc', 'EN: Safety is non-negotiable. Prioritizing operational continuity, asset reliability, and zero-accident culture.' || E'\n' || 'ID: Keselamatan tidak dapat ditawar. Memprioritaskan kontinuitas operasional, keandalan aset, dan budaya nihil kecelakaan kerja.'
        ),
        jsonb_build_object(
          'letter', 'T',
          'title', 'EN: Total Engineering Solutions' || E'\n' || 'ID: Solusi Rekayasa Teknik Menyeluruh',
          'desc', 'EN: End-to-end coverage from design, assembly, and installation to testing, commissioning, and lifecycle maintenance.' || E'\n' || 'ID: Cakupan menyeluruh dari perancangan, perakitan, dan instalasi hingga pengujian, commissioning, serta pemeliharaan siklus hidup aset.'
        )
      ),
      'certifications', jsonb_build_array(
        'ISO 9001:2015 (Quality Management - KAN)',
        'ISO 14001:2015 (Environmental Management)',
        'ISO 45001:2018 (Occupational Health & Safety - KAN)',
        'Ecovadis Silver (Top 15% Global Sustainability)',
        'Avetta Member',
        'SBUJTL & IUJPTL ESDM',
        'Sertifikat Kompetensi Level 6 Tegangan Menengah ESDM',
        'SMK3 Kemenaker',
        'NFPA Member',
        'D&B Rating'
      )
    ),
    version = version + 1,
    updated_at = now()
WHERE page_key = 'about' AND deleted_at IS NULL;

COMMIT;

