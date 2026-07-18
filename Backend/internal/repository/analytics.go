package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

// AnalyticsRepository serves the reporting queries. Session-level metrics
// (uniques, bounce, duration, dimensions) read the compact analytics_sessions
// table; page/event/vital metrics read the hourly rollups — never the raw
// event firehose.
type AnalyticsRepository struct {
	pool *pgxpool.Pool
}

func NewAnalyticsRepository(pool *pgxpool.Pool) AnalyticsRepository {
	return AnalyticsRepository{pool: pool}
}

// sessionWhere builds the WHERE clause for analytics_sessions queries.
// The page filter matches sessions that landed on that page.
func sessionWhere(f model.AnalyticsFilters) (string, []any) {
	clauses := []string{"started_at >= $1", "started_at < $2"}
	args := []any{f.From, f.To}
	add := func(column, value string) {
		if value == "" {
			return
		}
		args = append(args, value)
		clauses = append(clauses, fmt.Sprintf("%s = $%d", column, len(args)))
	}
	add("device", f.Device)
	add("country", f.Country)
	add("source", f.Source)
	add("first_path", f.Path)
	return strings.Join(clauses, " AND "), args
}

func (r AnalyticsRepository) Overview(ctx context.Context, f model.AnalyticsFilters) (model.AnalyticsOverview, error) {
	where, args := sessionWhere(f)
	var o model.AnalyticsOverview
	err := r.pool.QueryRow(ctx, `
		SELECT COUNT(*),
		       COUNT(DISTINCT visitor_id),
		       COALESCE(SUM(pageviews), 0),
		       COUNT(*) FILTER (WHERE is_new_visitor),
		       COALESCE(AVG(EXTRACT(EPOCH FROM (last_seen_at - started_at))), 0),
		       COALESCE(AVG(CASE WHEN pageviews <= 1 THEN 100.0 ELSE 0.0 END), 0)
		FROM analytics_sessions
		WHERE `+where, args...,
	).Scan(&o.Sessions, &o.UniqueVisitors, &o.PageViews, &o.NewVisitors, &o.AvgSessionSec, &o.BounceRate)
	if err != nil {
		return model.AnalyticsOverview{}, err
	}
	o.Visitors = o.UniqueVisitors
	o.ReturningVisits = o.Sessions - o.NewVisitors
	if o.ReturningVisits < 0 {
		o.ReturningVisits = 0
	}
	return o, nil
}

var validIntervals = map[string]bool{"hour": true, "day": true, "week": true, "month": true, "year": true}

func (r AnalyticsRepository) TimeSeries(ctx context.Context, f model.AnalyticsFilters, interval string) ([]model.AnalyticsTimePoint, error) {
	if !validIntervals[interval] {
		interval = "day"
	}
	where, args := sessionWhere(f)
	// date_trunc's unit cannot be a bind parameter; interval is whitelisted above.
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT date_trunc('%s', started_at) AS bucket,
		       COALESCE(SUM(pageviews), 0), COUNT(*), COUNT(DISTINCT visitor_id)
		FROM analytics_sessions
		WHERE %s
		GROUP BY 1 ORDER BY 1
	`, interval, where), args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var points []model.AnalyticsTimePoint
	for rows.Next() {
		var p model.AnalyticsTimePoint
		if err := rows.Scan(&p.Bucket, &p.Views, &p.Sessions, &p.Visitors); err != nil {
			return nil, err
		}
		points = append(points, p)
	}
	return points, rows.Err()
}

var breakdownDims = map[string]string{
	"source": "source", "device": "device", "browser": "browser", "os": "os",
	"screen": "screen", "country": "country", "city": "city", "language": "language",
}

func (r AnalyticsRepository) Breakdown(ctx context.Context, f model.AnalyticsFilters, dim string) ([]model.AnalyticsBreakdownRow, error) {
	column, ok := breakdownDims[dim]
	if !ok {
		return nil, fmt.Errorf("unknown breakdown dimension %q", dim)
	}
	where, args := sessionWhere(f)
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT COALESCE(NULLIF(%s, ''), 'unknown'), COUNT(*)
		FROM analytics_sessions
		WHERE %s
		GROUP BY 1 ORDER BY 2 DESC LIMIT 20
	`, column, where), args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.AnalyticsBreakdownRow
	for rows.Next() {
		var row model.AnalyticsBreakdownRow
		if err := rows.Scan(&row.Value, &row.Sessions); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

// Pages reads the hourly page rollups. Dimension filters do not apply here
// (rollups are not segmented); the optional path filter does.
func (r AnalyticsRepository) Pages(ctx context.Context, f model.AnalyticsFilters, limit int) ([]model.AnalyticsPageRow, error) {
	args := []any{f.From, f.To}
	pathClause := ""
	if f.Path != "" {
		args = append(args, f.Path)
		pathClause = " AND path = $3"
	}
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT path, SUM(views), SUM(unique_views),
		       COALESCE(SUM(total_time_ms) / NULLIF(SUM(time_samples), 0) / 1000.0, 0),
		       COALESCE(SUM(scroll_sum)::float / NULLIF(SUM(scroll_samples), 0), 0)
		FROM analytics_page_stats
		WHERE bucket >= $1 AND bucket < $2%s
		GROUP BY path
		HAVING SUM(views) > 0
		ORDER BY 2 DESC
		LIMIT %d
	`, pathClause, limit), args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.AnalyticsPageRow
	for rows.Next() {
		var row model.AnalyticsPageRow
		if err := rows.Scan(&row.Path, &row.Views, &row.UniqueViews, &row.AvgTimeSec, &row.AvgScroll); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

// EntryExit counts sessions per landing (column=first_path) or exit
// (column=last_path) page.
func (r AnalyticsRepository) EntryExit(ctx context.Context, f model.AnalyticsFilters, column string, limit int) ([]model.AnalyticsEntryExitRow, error) {
	if column != "first_path" && column != "last_path" {
		return nil, fmt.Errorf("invalid entry/exit column")
	}
	where, args := sessionWhere(f)
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT %s, COUNT(*)
		FROM analytics_sessions
		WHERE %s AND %s <> ''
		GROUP BY 1 ORDER BY 2 DESC LIMIT %d
	`, column, where, column, limit), args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.AnalyticsEntryExitRow
	for rows.Next() {
		var row model.AnalyticsEntryExitRow
		if err := rows.Scan(&row.Path, &row.Sessions); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

func (r AnalyticsRepository) Events(ctx context.Context, f model.AnalyticsFilters, limit int) ([]model.AnalyticsEventRow, error) {
	args := []any{f.From, f.To}
	pathClause := ""
	if f.Path != "" {
		args = append(args, f.Path)
		pathClause = " AND path = $3"
	}
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT event_name, SUM(count)
		FROM analytics_event_stats
		WHERE bucket >= $1 AND bucket < $2%s
		GROUP BY event_name ORDER BY 2 DESC LIMIT %d
	`, pathClause, limit), args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.AnalyticsEventRow
	for rows.Next() {
		var row model.AnalyticsEventRow
		if err := rows.Scan(&row.Name, &row.Count); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

func (r AnalyticsRepository) Vitals(ctx context.Context, f model.AnalyticsFilters) ([]model.AnalyticsVitalRow, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT metric,
		       COALESCE(SUM(sum_value) / NULLIF(SUM(samples), 0), 0),
		       COALESCE(MAX(max_value), 0),
		       COALESCE(SUM(samples), 0)
		FROM analytics_vital_stats
		WHERE bucket >= $1 AND bucket < $2
		GROUP BY metric ORDER BY metric
	`, f.From, f.To)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.AnalyticsVitalRow
	for rows.Next() {
		var row model.AnalyticsVitalRow
		if err := rows.Scan(&row.Metric, &row.Avg, &row.Max, &row.Samples); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

// SlowPages ranks pages by average full load time (the "load" vital).
func (r AnalyticsRepository) SlowPages(ctx context.Context, f model.AnalyticsFilters, limit int) ([]model.AnalyticsSlowPageRow, error) {
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT path, SUM(sum_value) / NULLIF(SUM(samples), 0) AS avg_ms, SUM(samples)
		FROM analytics_vital_stats
		WHERE bucket >= $1 AND bucket < $2 AND metric = 'load' AND path <> ''
		GROUP BY path
		HAVING SUM(samples) >= 3
		ORDER BY avg_ms DESC NULLS LAST
		LIMIT %d
	`, limit), f.From, f.To)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.AnalyticsSlowPageRow
	for rows.Next() {
		var row model.AnalyticsSlowPageRow
		if err := rows.Scan(&row.Path, &row.AvgMs, &row.Samples); err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

// APIStats sums the server-side request counters (plus client error count).
func (r AnalyticsRepository) APIStats(ctx context.Context, f model.AnalyticsFilters) (model.AnalyticsAPIStats, int, error) {
	var stats model.AnalyticsAPIStats
	var clientErrors int
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(api_requests), 0), COALESCE(SUM(api_errors), 0),
		       COALESCE(SUM(api_total_ms) / NULLIF(SUM(api_requests), 0), 0),
		       COALESCE(SUM(errors), 0)
		FROM analytics_site_stats
		WHERE bucket >= $1 AND bucket < $2
	`, f.From, f.To).Scan(&stats.Requests, &stats.Errors, &stats.AvgMs, &clientErrors)
	return stats, clientErrors, err
}

func (r AnalyticsRepository) AdminActivity(ctx context.Context, f model.AnalyticsFilters) (model.AnalyticsAdminActivity, error) {
	var activity model.AnalyticsAdminActivity
	err := r.pool.QueryRow(ctx, `
		SELECT COUNT(*) FILTER (WHERE action = 'auth.login_success'),
		       COUNT(*) FILTER (WHERE action IN ('auth.login_failed', 'auth.login_locked')),
		       COUNT(*) FILTER (WHERE action = 'created' AND entity_type <> 'auth'),
		       COUNT(*) FILTER (WHERE action = 'updated' AND entity_type <> 'auth')
		FROM audit_logs
		WHERE deleted_at IS NULL AND created_at >= $1 AND created_at < $2
	`, f.From, f.To).Scan(&activity.Logins, &activity.FailedLogins, &activity.ContentCreated, &activity.ContentUpdated)
	if err != nil {
		return activity, err
	}

	err = r.pool.QueryRow(ctx, `
		SELECT (SELECT COUNT(*) FROM pages    WHERE deleted_at IS NULL AND published_at >= $1 AND published_at < $2)
		     + (SELECT COUNT(*) FROM news     WHERE deleted_at IS NULL AND published_at >= $1 AND published_at < $2)
		     + (SELECT COUNT(*) FROM careers  WHERE deleted_at IS NULL AND published_at >= $1 AND published_at < $2)
		     + (SELECT COUNT(*) FROM services WHERE deleted_at IS NULL AND published_at >= $1 AND published_at < $2)
		     + (SELECT COUNT(*) FROM products WHERE deleted_at IS NULL AND published_at >= $1 AND published_at < $2)
	`, f.From, f.To).Scan(&activity.ContentPublished)
	if err != nil {
		return activity, err
	}

	rows, err := r.pool.Query(ctx, `
		SELECT a.id::text, a.action, a.entity_type, COALESCE(a.entity_id::text, ''),
		       COALESCE(a.after->>'label', ''), COALESCE(u.name, ''), a.created_at
		FROM audit_logs a
		LEFT JOIN users u ON u.id = a.actor_id
		WHERE a.deleted_at IS NULL AND a.created_at >= $1 AND a.created_at < $2
		ORDER BY a.created_at DESC
		LIMIT 15
	`, f.From, f.To)
	if err != nil {
		return activity, err
	}
	defer rows.Close()
	for rows.Next() {
		var item model.ActivityEntry
		if err := rows.Scan(&item.ID, &item.Action, &item.EntityType, &item.EntityID, &item.Label, &item.ActorName, &item.CreatedAt); err != nil {
			return activity, err
		}
		activity.RecentAudit = append(activity.RecentAudit, item)
	}
	return activity, rows.Err()
}

// PathOptions lists recently-seen paths for the dashboard's page filter.
func (r AnalyticsRepository) PathOptions(ctx context.Context, since time.Time) ([]string, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT path FROM analytics_page_stats
		WHERE bucket >= $1
		GROUP BY path ORDER BY SUM(views) DESC LIMIT 100
	`, since)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []string
	for rows.Next() {
		var p string
		if err := rows.Scan(&p); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

// CountryOptions lists countries seen in the range for the filter dropdown.
func (r AnalyticsRepository) CountryOptions(ctx context.Context, since time.Time) ([]string, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT country FROM analytics_sessions
		WHERE started_at >= $1 AND country <> ''
		GROUP BY country ORDER BY COUNT(*) DESC LIMIT 50
	`, since)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []string
	for rows.Next() {
		var c string
		if err := rows.Scan(&c); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}
