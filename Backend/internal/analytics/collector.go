// Package analytics implements the write side of first-party analytics: a
// non-blocking in-memory ingest buffer, batched Postgres writes, in-memory
// realtime state, an hourly rollup worker, and a retention job. HTTP handlers
// only ever Enqueue — they never touch the database.
package analytics

import (
	"context"
	"encoding/json"
	"log/slog"
	"sort"
	"sync"
	"sync/atomic"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	bufferSize      = 8192            // events held in memory before dropping
	flushBatch      = 500             // max events per DB write
	flushInterval   = 2 * time.Second // max latency before a partial batch is written
	rollupInterval  = time.Minute
	rollupChunk     = 50_000 // raw rows folded per rollup transaction
	retentionEvery  = 6 * time.Hour
	configTTL       = 30 * time.Second
	realtimeWindow  = 5 * time.Minute
	liveEventBuffer = 50
	sessionsMaxAge  = 400 * 24 * time.Hour
)

type cachedConfig struct {
	cfg       model.AnalyticsConfig
	fetchedAt time.Time
}

type realtimeSession struct {
	lastSeen time.Time
	path     string
}

// Collector owns the ingest pipeline. One instance per process.
type Collector struct {
	pool   *pgxpool.Pool
	logger *slog.Logger

	events  chan model.AnalyticsEvent
	dropped atomic.Int64

	cfg atomic.Value // cachedConfig

	mu         sync.Mutex
	active     map[string]realtimeSession
	live       []model.AnalyticsLiveEvent
	liveCursor int

	wg     sync.WaitGroup
	cancel context.CancelFunc
}

func New(pool *pgxpool.Pool, logger *slog.Logger) *Collector {
	c := &Collector{
		pool:   pool,
		logger: logger,
		events: make(chan model.AnalyticsEvent, bufferSize),
		active: make(map[string]realtimeSession),
		live:   make([]model.AnalyticsLiveEvent, 0, liveEventBuffer),
	}
	c.cfg.Store(cachedConfig{cfg: model.DefaultAnalyticsConfig()})
	return c
}

// Start launches the background workers. Call Stop to flush and halt.
func (c *Collector) Start(parent context.Context) {
	ctx, cancel := context.WithCancel(parent)
	c.cancel = cancel

	c.wg.Add(1)
	go c.writeLoop(ctx)

	c.wg.Add(1)
	go c.maintenanceLoop(ctx)
}

// Stop signals the workers and waits for the final flush.
func (c *Collector) Stop() {
	if c.cancel != nil {
		c.cancel()
	}
	c.wg.Wait()
}

// Enqueue hands events to the pipeline without ever blocking the caller.
// When the buffer is full the events are dropped and counted.
func (c *Collector) Enqueue(events []model.AnalyticsEvent) {
	for _, event := range events {
		select {
		case c.events <- event:
		default:
			if c.dropped.Add(1)%1000 == 1 {
				c.logger.Warn("analytics buffer full; dropping events", "dropped", c.dropped.Load())
			}
			return
		}
	}
	c.observe(events)
}

// TrackAPI records one API request measurement (fed by middleware).
func (c *Collector) TrackAPI(route string, status int, duration time.Duration) {
	event := model.AnalyticsEvent{
		OccurredAt: time.Now().UTC(),
		EventType:  "api",
		EventName:  Clamp(route, 120),
		Path:       Clamp(route, 120),
		Value:      float64(duration.Milliseconds()),
		Status:     int16(status),
	}
	select {
	case c.events <- event:
	default:
		c.dropped.Add(1)
	}
}

// Config returns the analytics feature flags, cached briefly so the hot
// collect path does not hit the settings table per request.
func (c *Collector) Config(ctx context.Context) model.AnalyticsConfig {
	cached := c.cfg.Load().(cachedConfig)
	if time.Since(cached.fetchedAt) < configTTL {
		return cached.cfg
	}
	var raw []byte
	err := c.pool.QueryRow(ctx, `SELECT value FROM settings WHERE key = $1 AND deleted_at IS NULL`, model.AnalyticsSettingKey).Scan(&raw)
	cfg := model.DefaultAnalyticsConfig()
	if err == nil {
		cfg = model.ParseAnalyticsConfig(json.RawMessage(raw))
	}
	c.cfg.Store(cachedConfig{cfg: cfg, fetchedAt: time.Now()})
	return cfg
}

// Realtime reports the in-memory live picture (last 5 minutes).
func (c *Collector) Realtime() model.AnalyticsRealtime {
	c.mu.Lock()
	defer c.mu.Unlock()

	cutoff := time.Now().Add(-realtimeWindow)
	pages := map[string]int{}
	activeCount := 0
	for id, session := range c.active {
		if session.lastSeen.Before(cutoff) {
			delete(c.active, id)
			continue
		}
		activeCount++
		pages[session.path]++
	}

	pageRows := make([]model.AnalyticsEntryExitRow, 0, len(pages))
	for path, count := range pages {
		pageRows = append(pageRows, model.AnalyticsEntryExitRow{Path: path, Sessions: count})
	}
	sort.Slice(pageRows, func(i, j int) bool { return pageRows[i].Sessions > pageRows[j].Sessions })
	if len(pageRows) > 10 {
		pageRows = pageRows[:10]
	}

	// Ring buffer → newest first.
	events := make([]model.AnalyticsLiveEvent, 0, len(c.live))
	for i := 0; i < len(c.live); i++ {
		idx := (c.liveCursor - 1 - i + len(c.live)*2) % len(c.live)
		if idx < len(c.live) {
			events = append(events, c.live[idx])
		}
	}
	if len(events) > 20 {
		events = events[:20]
	}

	return model.AnalyticsRealtime{ActiveVisitors: activeCount, Pages: pageRows, Events: events}
}

// observe feeds the realtime state; called after a successful enqueue.
func (c *Collector) observe(events []model.AnalyticsEvent) {
	c.mu.Lock()
	defer c.mu.Unlock()
	for _, event := range events {
		if event.SessionID != "" && (event.EventType == "pageview" || event.EventType == "event") {
			c.active[event.SessionID] = realtimeSession{lastSeen: event.OccurredAt, path: event.Path}
		}
		if event.EventType == "pageview" || event.EventType == "event" {
			live := model.AnalyticsLiveEvent{
				At: event.OccurredAt, Type: event.EventType, Name: event.EventName,
				Path: event.Path, Country: event.Country, Device: event.Device,
			}
			if len(c.live) < liveEventBuffer {
				c.live = append(c.live, live)
				c.liveCursor = len(c.live) % liveEventBuffer
			} else {
				c.live[c.liveCursor] = live
				c.liveCursor = (c.liveCursor + 1) % liveEventBuffer
			}
		}
	}
}

// --- write path ---

func (c *Collector) writeLoop(ctx context.Context) {
	defer c.wg.Done()
	ticker := time.NewTicker(flushInterval)
	defer ticker.Stop()

	batch := make([]model.AnalyticsEvent, 0, flushBatch)
	flush := func() {
		if len(batch) == 0 {
			return
		}
		c.writeBatch(batch)
		batch = batch[:0]
	}

	for {
		select {
		case event := <-c.events:
			batch = append(batch, event)
			if len(batch) >= flushBatch {
				flush()
			}
		case <-ticker.C:
			flush()
		case <-ctx.Done():
			// Drain whatever is buffered, then final flush.
			for {
				select {
				case event := <-c.events:
					batch = append(batch, event)
					if len(batch) >= flushBatch {
						flush()
					}
				default:
					flush()
					return
				}
			}
		}
	}
}

func (c *Collector) writeBatch(events []model.AnalyticsEvent) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	rows := make([][]any, 0, len(events))
	for _, e := range events {
		rows = append(rows, []any{
			e.OccurredAt, e.EventType, e.EventName, e.VisitorID, e.SessionID, e.Path, e.Referrer,
			e.Source, e.Device, e.Browser, e.OS, e.Screen, e.Country, e.City, e.Language,
			e.Value, e.ScrollPct, e.Status,
		})
	}
	_, err := c.pool.CopyFrom(ctx, pgx.Identifier{"analytics_events"}, []string{
		"occurred_at", "event_type", "event_name", "visitor_id", "session_id", "path", "referrer",
		"source", "device", "browser", "os", "screen", "country", "city", "language",
		"value", "scroll_pct", "status",
	}, pgx.CopyFromRows(rows))
	if err != nil {
		c.logger.Error("analytics event insert failed", "error", err, "events", len(events))
		return
	}

	c.upsertSessions(ctx, events)
}

type sessionDelta struct {
	visitorID  string
	first      time.Time
	last       time.Time
	firstPath  string
	lastPath   string
	pageviews  int
	events     int
	newVisitor bool
	src        model.AnalyticsEvent
}

func (c *Collector) upsertSessions(ctx context.Context, events []model.AnalyticsEvent) {
	deltas := map[string]*sessionDelta{}
	order := []string{}
	for _, e := range events {
		if e.SessionID == "" || (e.EventType != "pageview" && e.EventType != "event" && e.EventType != "pageleave") {
			continue
		}
		delta, ok := deltas[e.SessionID]
		if !ok {
			delta = &sessionDelta{visitorID: e.VisitorID, first: e.OccurredAt, last: e.OccurredAt, src: e}
			deltas[e.SessionID] = delta
			order = append(order, e.SessionID)
		}
		if e.OccurredAt.Before(delta.first) {
			delta.first = e.OccurredAt
		}
		if e.OccurredAt.After(delta.last) {
			delta.last = e.OccurredAt
		}
		if e.NewVisitor {
			delta.newVisitor = true
		}
		switch e.EventType {
		case "pageview":
			if delta.firstPath == "" {
				delta.firstPath = e.Path
			}
			delta.lastPath = e.Path
			delta.pageviews++
		case "event":
			delta.events++
		}
	}
	if len(deltas) == 0 {
		return
	}

	batch := &pgx.Batch{}
	for _, id := range order {
		d := deltas[id]
		batch.Queue(`
			INSERT INTO analytics_sessions (
				session_id, visitor_id, started_at, last_seen_at, first_path, last_path,
				pageviews, events, is_new_visitor, source, device, browser, os, screen, country, city, language
			) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
			ON CONFLICT (session_id) DO UPDATE SET
				started_at   = LEAST(analytics_sessions.started_at, EXCLUDED.started_at),
				last_seen_at = GREATEST(analytics_sessions.last_seen_at, EXCLUDED.last_seen_at),
				first_path   = CASE WHEN analytics_sessions.first_path = '' THEN EXCLUDED.first_path ELSE analytics_sessions.first_path END,
				last_path    = CASE WHEN EXCLUDED.last_path <> '' THEN EXCLUDED.last_path ELSE analytics_sessions.last_path END,
				pageviews    = analytics_sessions.pageviews + EXCLUDED.pageviews,
				events       = analytics_sessions.events + EXCLUDED.events,
				is_new_visitor = analytics_sessions.is_new_visitor OR EXCLUDED.is_new_visitor
		`, id, d.visitorID, d.first, d.last, d.firstPath, d.lastPath,
			d.pageviews, d.events, d.newVisitor, d.src.Source, d.src.Device, d.src.Browser,
			d.src.OS, d.src.Screen, d.src.Country, d.src.City, d.src.Language)
	}
	if err := c.pool.SendBatch(ctx, batch).Close(); err != nil {
		c.logger.Error("analytics session upsert failed", "error", err)
	}
}

// --- rollups & retention ---

func (c *Collector) maintenanceLoop(ctx context.Context) {
	defer c.wg.Done()
	rollupTicker := time.NewTicker(rollupInterval)
	defer rollupTicker.Stop()
	retentionTicker := time.NewTicker(retentionEvery)
	defer retentionTicker.Stop()

	// Catch up shortly after boot.
	startup := time.NewTimer(10 * time.Second)
	defer startup.Stop()

	for {
		select {
		case <-startup.C:
			c.runRollup(ctx)
			c.runRetention(ctx)
		case <-rollupTicker.C:
			c.runRollup(ctx)
		case <-retentionTicker.C:
			c.runRetention(ctx)
		case <-ctx.Done():
			// Final rollup so a clean shutdown loses nothing.
			shutdownCtx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
			c.runRollup(shutdownCtx)
			cancel()
			return
		}
	}
}

// runRollup folds raw events newer than the checkpoint into the hourly
// aggregate tables, chunk by chunk, each chunk in one transaction.
func (c *Collector) runRollup(ctx context.Context) {
	for i := 0; i < 20; i++ { // bounded catch-up per run
		processed, err := c.rollupChunk(ctx)
		if err != nil {
			c.logger.Error("analytics rollup failed", "error", err)
			return
		}
		if processed == 0 {
			return
		}
	}
}

func (c *Collector) rollupChunk(ctx context.Context) (int64, error) {
	tx, err := c.pool.Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback(ctx)

	var last, max int64
	if err := tx.QueryRow(ctx, `SELECT last_event_id FROM analytics_rollup_state WHERE id = 1 FOR UPDATE`).Scan(&last); err != nil {
		return 0, err
	}
	if err := tx.QueryRow(ctx, `SELECT COALESCE(MAX(id), 0) FROM analytics_events`).Scan(&max); err != nil {
		return 0, err
	}
	if max <= last {
		return 0, nil
	}
	upper := last + rollupChunk
	if upper > max {
		upper = max
	}

	statements := []string{
		// Site-wide hourly counters.
		`INSERT INTO analytics_site_stats (bucket, views, custom_events, errors, api_requests, api_errors, api_total_ms)
		 SELECT date_trunc('hour', occurred_at),
		        COUNT(*) FILTER (WHERE event_type = 'pageview'),
		        COUNT(*) FILTER (WHERE event_type = 'event'),
		        COUNT(*) FILTER (WHERE event_type = 'error'),
		        COUNT(*) FILTER (WHERE event_type = 'api'),
		        COUNT(*) FILTER (WHERE event_type = 'api' AND status >= 500),
		        COALESCE(SUM(value) FILTER (WHERE event_type = 'api'), 0)
		 FROM analytics_events WHERE id > $1 AND id <= $2
		 GROUP BY 1
		 ON CONFLICT (bucket) DO UPDATE SET
		        views = analytics_site_stats.views + EXCLUDED.views,
		        custom_events = analytics_site_stats.custom_events + EXCLUDED.custom_events,
		        errors = analytics_site_stats.errors + EXCLUDED.errors,
		        api_requests = analytics_site_stats.api_requests + EXCLUDED.api_requests,
		        api_errors = analytics_site_stats.api_errors + EXCLUDED.api_errors,
		        api_total_ms = analytics_site_stats.api_total_ms + EXCLUDED.api_total_ms`,
		// Per-page hourly stats; time-on-page and scroll come from pageleave.
		`INSERT INTO analytics_page_stats (bucket, path, views, unique_views, total_time_ms, time_samples, scroll_sum, scroll_samples)
		 SELECT date_trunc('hour', occurred_at), path,
		        COUNT(*) FILTER (WHERE event_type = 'pageview'),
		        COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'pageview'),
		        COALESCE(SUM(value) FILTER (WHERE event_type = 'pageleave' AND value > 0), 0),
		        COUNT(*) FILTER (WHERE event_type = 'pageleave' AND value > 0),
		        COALESCE(SUM(scroll_pct) FILTER (WHERE event_type = 'pageleave' AND scroll_pct > 0), 0),
		        COUNT(*) FILTER (WHERE event_type = 'pageleave' AND scroll_pct > 0)
		 FROM analytics_events
		 WHERE id > $1 AND id <= $2 AND event_type IN ('pageview', 'pageleave') AND path <> ''
		 GROUP BY 1, 2
		 ON CONFLICT (bucket, path) DO UPDATE SET
		        views = analytics_page_stats.views + EXCLUDED.views,
		        unique_views = analytics_page_stats.unique_views + EXCLUDED.unique_views,
		        total_time_ms = analytics_page_stats.total_time_ms + EXCLUDED.total_time_ms,
		        time_samples = analytics_page_stats.time_samples + EXCLUDED.time_samples,
		        scroll_sum = analytics_page_stats.scroll_sum + EXCLUDED.scroll_sum,
		        scroll_samples = analytics_page_stats.scroll_samples + EXCLUDED.scroll_samples`,
		// Custom event counts.
		`INSERT INTO analytics_event_stats (bucket, event_name, path, count)
		 SELECT date_trunc('hour', occurred_at), event_name, path, COUNT(*)
		 FROM analytics_events
		 WHERE id > $1 AND id <= $2 AND event_type = 'event' AND event_name <> ''
		 GROUP BY 1, 2, 3
		 ON CONFLICT (bucket, event_name, path) DO UPDATE SET
		        count = analytics_event_stats.count + EXCLUDED.count`,
		// Web vitals.
		`INSERT INTO analytics_vital_stats (bucket, metric, path, sum_value, max_value, samples)
		 SELECT date_trunc('hour', occurred_at), event_name, path, SUM(value), MAX(value), COUNT(*)
		 FROM analytics_events
		 WHERE id > $1 AND id <= $2 AND event_type = 'vital' AND event_name <> ''
		 GROUP BY 1, 2, 3
		 ON CONFLICT (bucket, metric, path) DO UPDATE SET
		        sum_value = analytics_vital_stats.sum_value + EXCLUDED.sum_value,
		        max_value = GREATEST(analytics_vital_stats.max_value, EXCLUDED.max_value),
		        samples = analytics_vital_stats.samples + EXCLUDED.samples`,
		// Short-link scans (hourly uniques are per-hour approximations).
		`INSERT INTO redirect_stats (bucket, slug, scans, uniques)
		 SELECT date_trunc('hour', occurred_at), event_name, COUNT(*), COUNT(DISTINCT visitor_id)
		 FROM analytics_events
		 WHERE id > $1 AND id <= $2 AND event_type = 'redirect' AND event_name <> ''
		 GROUP BY 1, 2
		 ON CONFLICT (bucket, slug) DO UPDATE SET
		        scans = redirect_stats.scans + EXCLUDED.scans,
		        uniques = redirect_stats.uniques + EXCLUDED.uniques`,
	}
	for _, statement := range statements {
		if _, err := tx.Exec(ctx, statement, last, upper); err != nil {
			return 0, err
		}
	}
	if _, err := tx.Exec(ctx, `UPDATE analytics_rollup_state SET last_event_id = $1, updated_at = now() WHERE id = 1`, upper); err != nil {
		return 0, err
	}
	if err := tx.Commit(ctx); err != nil {
		return 0, err
	}
	return upper - last, nil
}

// runRetention prunes raw events past the configured window and stale
// sessions. Aggregates are kept forever.
func (c *Collector) runRetention(ctx context.Context) {
	cfg := c.Config(ctx)
	cutoff := time.Now().AddDate(0, 0, -cfg.RetentionDays)

	for i := 0; i < 50; i++ { // delete in bounded batches to avoid long locks
		tag, err := c.pool.Exec(ctx, `
			DELETE FROM analytics_events WHERE id IN (
				SELECT id FROM analytics_events WHERE occurred_at < $1 LIMIT 5000
			)`, cutoff)
		if err != nil {
			c.logger.Error("analytics retention failed", "error", err)
			return
		}
		if tag.RowsAffected() == 0 {
			break
		}
	}
	if _, err := c.pool.Exec(ctx, `DELETE FROM analytics_sessions WHERE last_seen_at < $1`, time.Now().Add(-sessionsMaxAge)); err != nil {
		c.logger.Error("analytics session retention failed", "error", err)
	}
}
