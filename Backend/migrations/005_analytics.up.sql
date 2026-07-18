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
