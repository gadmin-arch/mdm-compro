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
