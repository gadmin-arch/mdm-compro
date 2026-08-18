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
('00000000-0000-0000-0000-000000000401', 'about', 'About PT Multi Daya Mitra', '{"overview":"Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.","vision":"To become a global electrical, automation, and fire alarm services company.","mission":"Build mutual partnerships and deliver every engagement with professional excellence.","values":["Safety","Reliability","Professionalism","Partnership"],"leadership":[],"timeline":[],"certifications":["ISO 9001:2015"]}', 'published', now()),
('00000000-0000-0000-0000-000000000402', 'contact', 'Contact PT Multi Daya Mitra', '{"offices":[{"name":"Head Office","address":"East Java, Indonesia","mapEmbedUrl":""}],"email":"info@multidayamitra.co.id","phone":"+62"}', 'published', now())
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
-- Seed system pages so every public landing route (/, /services, /products,
-- /news, /career) has an editable CMS page. Keys must equal the public route
-- segment ('career', not 'careers') so the explicit routes shadow [pageKey].
-- Content is left empty: the landing routes keep their built-in layout until
-- an admin fills in sections via the editor presets.
-- ON CONFLICT DO NOTHING also covers pages_key_active_uniq, so a manually
-- created row with the same key (e.g. an existing 'home' page) is preserved.
INSERT INTO pages (id, page_key, title, content, status, published_at) VALUES
('00000000-0000-0000-0000-000000000403', 'home', 'Home', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000404', 'services', 'Services', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000405', 'products', 'Products', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000406', 'news', 'News & Insights', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000407', 'career', 'Careers', '{}', 'published', now())
ON CONFLICT DO NOTHING;
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
    'footerDescription', 'Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.',
    'socials', jsonb_build_array(
        jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/',        'label', 'Facebook'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/',       'label', 'Instagram'),
        jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/6282140074122',                      'label', 'WhatsApp Sales'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628118303250',                      'label', 'WhatsApp Technical Support')
    ),
    'salesEmail',   'sales@multidayamitra.co.id',
    'salesPhone',   '+62 821-4007-4122',
    'whatsappPhone','+62 821-4007-4122',
    'hotlinePhone', '+62 821-4007-4122'
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
            'name',        'Head Office (Surabaya)',
            'address',     'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
            'phone',       '+62 31 592 1256',
            'fax',         '+62 31 591 7845',
            'email',       'info@multidayamitra.co.id',
            'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
        ),
        jsonb_build_object(
            'name',        'Engineering Office & Workshop',
            'address',     'Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia',
            'phone',       '+62 821-4007-4122',
            'email',       'sales@multidayamitra.co.id',
            'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
        )
    ),
    'email',       'info@multidayamitra.co.id',
    'phone',       '+62 31 592 1256',
    'fax',         '+62 31 591 7845',
    'salesEmail',  'sales@multidayamitra.co.id',
    'salesPhone',  '+62 821-4007-4122',
    'whatsappPhone','+62 821-4007-4122',
    'hotlinePhone','+62 821-4007-4122'
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000402';

-- ============================================================================
-- 3. ABOUT PAGE — Enriched company profile
-- ============================================================================
UPDATE pages
SET content = jsonb_build_object(
    'overview', 'PT Multi Daya Mitra was established in 2012 as a multidisciplinary engineering company specializing in electrical systems, industrial automation, fire alarm solutions, and mechanical works. With over 14 years of business experience, 400+ clients across multi-segments, and a dedicated team of over 200 engineers and professionals, we deliver reliable, safe, and integrated engineering solutions across Indonesia and international assignments.',
    'vision',  'Global Electrical, Automation and Fire Alarm Services Company.',
    'mission', 'Mutual Partnership and Professionalism in delivering every engineering engagement.',
    'tagline', 'Always Make an IMPACT - Powering Solution, Creating Impact',
    'established', '2012',
    'values',  jsonb_build_array('Integrity & Innovation', 'Mastery & Intelligent Problem-Solving', 'Professional & Trusted Partnership', 'Agile & Adaptable Execution', 'Commitment to Safety & Customer First', 'Total Engineering Solutions'),
    'leadership', '[]'::jsonb,
    'timeline', '[]'::jsonb,
    'certifications', jsonb_build_array('ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'Ecovadis Silver', 'Avetta Member', 'SBUJTL & IUJPTL ESDM', 'SMK3 Kemenaker'),
    'culture', 'The company culture in a professional manner brings the company to move fast in achieving every step of its vision.',
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

-- ============================================================================
-- 018_products_and_partners_hierarchy.up.sql
-- Products & Strategic Partnerships (Rittal, Schneider, 5 Core Categories)
-- ============================================================================
BEGIN;

DELETE FROM products WHERE id IS NOT NULL;

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
),
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
),
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

-- ============================================================================
-- 019_services_and_solutions_2026.up.sql
-- 5 Core Business Units (Electrical Construction, Maintenance, Automation, Testing, Mechanical)
-- ============================================================================
BEGIN;

DELETE FROM services WHERE id IS NOT NULL;

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
),
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
),
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
),
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
),
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

-- 020_rich_product_and_service_descriptions.up.sql
UPDATE products SET
  image_url = '/uploads/products-rittal-enclosures.jpg',
  summary = 'Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.',
  specs = '{"Series":"VX25, AX, KX, CS Toptec, IT Network Racks","Frame Pitch":"25 mm DIN standard symmetrical grid","Protection Rating":"IP55 / IP66 / NEMA 4X / NEMA 12","Material & Finish":"Sheet steel dipcoat-primed RAL 7035 / Stainless steel AISI 304 & 316L","Certifications":"IEC 62208, UL 508A, DNV-GL, CE, RoHS","Target Applications":"LV Switchboards, MCC Panels, Automation Control, IT Server Racks"}'::jsonb
WHERE slug = 'enclosures';

UPDATE products SET
  image_url = '/uploads/products-rittal-cooling.jpg',
  summary = 'Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.',
  specs = '{"Cooling Capacity":"300 W to 5,500 W (Blue e+ & Blue e+ S)","Energy Savings":"Up to 75% via patented hybrid heat pipe technology","Refrigerant":"Eco-friendly R-513A / R-134a (GWP compliant)","Operating Temp":"-20°C to +60°C ambient","IoT Protocols":"Modbus TCP, SNMP, OPC-UA, Profinet, Ethernet/IP","Mounting Options":"Wall-mounted, roof-mounted, partial or full internal"}'::jsonb
WHERE slug = 'climate-control-cooling';

UPDATE products SET
  image_url = '/uploads/products-rittal-power.jpg',
  summary = 'Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.',
  specs = '{"Rated Current (In)":"Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)","Short-Circuit Rating (Icw)":"Up to 120 kA (1s withstand)","Internal Separation":"Form 1, Form 2b, Form 3b, Form 4a, Form 4b","Busbar Centers":"60 mm & 185 mm drill-free mounting systems","Standards":"IEC 61439-1, IEC 61439-2, DIN EN 61439"}'::jsonb
WHERE slug = 'power-distribution';

UPDATE products SET image_url = '/uploads/products-rittal-enclosures.jpg' WHERE slug = 'rittal-distributor';
UPDATE products SET image_url = '/uploads/products-schneider-automation.jpg' WHERE slug = 'schneider-integrator';
UPDATE products SET image_url = '/uploads/mdm/circuit-breaker.jpg' WHERE slug = 'electrical-distribution';
UPDATE products SET image_url = '/uploads/products-schneider-automation.jpg' WHERE slug = 'automation-control';
UPDATE products SET image_url = '/uploads/products-rittal-enclosures.jpg' WHERE slug = 'enclosure-climate-control';
UPDATE products SET image_url = '/uploads/mdm/power-quality.jpg' WHERE slug = 'power-quality';
UPDATE products SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'fire-alarm-products';
UPDATE products SET image_url = '/uploads/products-schneider-automation.jpg' WHERE slug = 'industrial-automation';
UPDATE products SET image_url = '/uploads/products-schneider-pme.jpg' WHERE slug = 'power-energy-monitoring';
UPDATE products SET image_url = '/uploads/products-schneider-distribution.jpg' WHERE slug = 'electrical-distribution-integration';
UPDATE products SET image_url = '/uploads/products-schneider-commissioning.jpg' WHERE slug = 'engineering-commissioning';
UPDATE products SET image_url = '/uploads/mdm/active-harmonic-filter.jpg' WHERE slug = 'active-harmonic-filters';
UPDATE products SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'addressable-fire-alarm-systems';
UPDATE products SET image_url = '/uploads/mdm/circuit-breaker.jpg' WHERE slug = 'low-voltage-distribution-panels';
UPDATE products SET image_url = '/uploads/mdm/medium-voltage-equipment.jpg' WHERE slug = 'medium-voltage-substation';
UPDATE products SET image_url = '/uploads/xarrow.jpg' WHERE slug = 'scada-xarrow-telemetry';
UPDATE products SET image_url = '/uploads/products-schneider-distribution.jpg' WHERE slug = 'vsd-inverter-panels';

UPDATE services SET image_url = '/uploads/mdm/construction-installation.jpg' WHERE slug = 'electrical-construction-installation';
UPDATE services SET image_url = '/uploads/mdm/medium-voltage-equipment.jpg' WHERE slug = 'substation-mv-switchgear-installation';
UPDATE services SET image_url = '/uploads/mdm/circuit-breaker.jpg' WHERE slug = 'lv-distribution-panels-assembly';
UPDATE services SET image_url = '/uploads/mdm/electrical-equipment.jpg' WHERE slug = 'mv-lv-cable-installation-termination';
UPDATE services SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'fire-alarm-system-installation';
UPDATE services SET image_url = '/uploads/mdm/maintenance-contract.jpg' WHERE slug = 'electrical-maintenance-service';
UPDATE services SET image_url = '/uploads/mdm/micrologic-test.jpg' WHERE slug = 'transformer-oil-treatment-dga';
UPDATE services SET image_url = '/uploads/mdm/preventive-maintenance.jpg' WHERE slug = 'mv-cubicle-acb-maintenance';
UPDATE services SET image_url = '/uploads/mdm/infrared-thermograph.jpg' WHERE slug = 'thermography-predictive-maintenance';
UPDATE services SET image_url = '/uploads/mdm/maintenance-contract.jpg' WHERE slug = 'annual-maintenance-contracts';
UPDATE services SET image_url = '/uploads/mdm/industrial-automation.jpg' WHERE slug = 'automation-solutions-services';
UPDATE services SET image_url = '/uploads/xarrow.jpg' WHERE slug = 'scada-hmi-process-monitoring';
UPDATE services SET image_url = '/uploads/PMS-Network_001.jpg' WHERE slug = 'energy-management-iso50001';
UPDATE services SET image_url = '/uploads/products-schneider-automation.jpg' WHERE slug = 'plc-vsd-system-integration';
UPDATE services SET image_url = '/uploads/mdm/testing-measurement.jpg' WHERE slug = 'inspection-testing-commissioning';
UPDATE services SET image_url = '/uploads/mdm/power-quality.jpg' WHERE slug = 'power-quality-analysis-study';
UPDATE services SET image_url = '/uploads/mdm/partial-discharge.jpg' WHERE slug = 'partial-discharge-pd-scan';
UPDATE services SET image_url = '/uploads/mdm/secondary-injector.jpg' WHERE slug = 'relay-protection-testing-commissioning';
UPDATE services SET image_url = '/uploads/mdm/electrical-services.jpg' WHERE slug = 'mechanical-services-supplies';
UPDATE services SET image_url = '/uploads/products-rittal-cooling.jpg' WHERE slug = 'industrial-mechanical-supplies-services';
UPDATE services SET image_url = '/uploads/mdm/electrical-services.jpg' WHERE slug = 'motor-generator-servicing-overhaul';

COMMIT;
