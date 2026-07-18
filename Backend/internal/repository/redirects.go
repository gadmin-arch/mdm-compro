package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RedirectRepository struct {
	pool *pgxpool.Pool
}

func NewRedirectRepository(pool *pgxpool.Pool) RedirectRepository {
	return RedirectRepository{pool: pool}
}

const redirectColumns = `
	r.id::text, r.name, r.slug, r.destination, r.description, r.redirect_type,
	r.is_active, r.expires_at, r.created_at, r.updated_at, r.version,
	COALESCE((SELECT SUM(s.scans) FROM redirect_stats s WHERE s.slug = r.slug), 0)::int`

func scanRedirect(row pgx.Row) (model.Redirect, error) {
	var r model.Redirect
	err := row.Scan(
		&r.ID, &r.Name, &r.Slug, &r.Destination, &r.Description, &r.RedirectType,
		&r.IsActive, &r.ExpiresAt, &r.CreatedAt, &r.UpdatedAt, &r.Version, &r.TotalScans,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Redirect{}, ErrNotFound
	}
	return r, err
}

// List filters: status = "" | active | inactive | expired.
func (r RedirectRepository) List(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.Redirect], error) {
	page, perPage, offset := normalizePagination(page, perPage)
	statusClause := ""
	switch status {
	case "active":
		statusClause = " AND r.is_active AND (r.expires_at IS NULL OR r.expires_at > now())"
	case "inactive":
		statusClause = " AND NOT r.is_active"
	case "expired":
		statusClause = " AND r.expires_at IS NOT NULL AND r.expires_at <= now()"
	}
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT %s, COUNT(*) OVER()
		FROM redirects r
		WHERE r.deleted_at IS NULL
		  AND ($3 = '' OR r.name ILIKE '%%' || $3 || '%%' OR r.slug ILIKE '%%' || $3 || '%%' OR r.destination ILIKE '%%' || $3 || '%%')
		  %s
		ORDER BY r.updated_at DESC
		LIMIT $1 OFFSET $2
	`, redirectColumns, statusClause), perPage, offset, strings.TrimSpace(search))
	if err != nil {
		return model.ListResponse[model.Redirect]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.Redirect
	for rows.Next() {
		var item model.Redirect
		if err := rows.Scan(
			&item.ID, &item.Name, &item.Slug, &item.Destination, &item.Description, &item.RedirectType,
			&item.IsActive, &item.ExpiresAt, &item.CreatedAt, &item.UpdatedAt, &item.Version, &item.TotalScans,
			&total,
		); err != nil {
			return model.ListResponse[model.Redirect]{}, err
		}
		data = append(data, item)
	}
	return model.ListResponse[model.Redirect]{
		Data: data,
		Pagination: model.Pagination{
			Page: page, PerPage: perPage, Total: total, TotalPages: totalPages(total, perPage),
		},
	}, rows.Err()
}

func (r RedirectRepository) ByID(ctx context.Context, id string) (model.Redirect, error) {
	return scanRedirect(r.pool.QueryRow(ctx, fmt.Sprintf(`
		SELECT %s FROM redirects r WHERE r.id = $1 AND r.deleted_at IS NULL
	`, redirectColumns), id))
}

// ResolveSlug returns the live target for the hot path: active, unexpired.
func (r RedirectRepository) ResolveSlug(ctx context.Context, slug string) (model.RedirectTarget, error) {
	var target model.RedirectTarget
	err := r.pool.QueryRow(ctx, `
		SELECT slug, destination, redirect_type, expires_at
		FROM redirects
		WHERE slug = $1 AND deleted_at IS NULL AND is_active
		  AND (expires_at IS NULL OR expires_at > now())
	`, slug).Scan(&target.Slug, &target.Destination, &target.RedirectType, &target.ExpiresAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.RedirectTarget{}, ErrNotFound
	}
	return target, err
}

// SlugUsedByPage guards against short links shadowing CMS pages.
func (r RedirectRepository) SlugUsedByPage(ctx context.Context, slug string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS (SELECT 1 FROM pages WHERE page_key = $1 AND deleted_at IS NULL)
	`, slug).Scan(&exists)
	return exists, err
}

func (r RedirectRepository) Create(ctx context.Context, input model.RedirectInput, userID string) (model.Redirect, error) {
	id := uuid.NewString()
	var actor any
	if userID != "" {
		actor = userID
	}
	_, err := r.pool.Exec(ctx, `
		INSERT INTO redirects (id, name, slug, destination, description, redirect_type, is_active, expires_at, created_by, updated_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
	`, id, input.Name, input.Slug, input.Destination, input.Description, input.RedirectType, input.IsActive, input.ExpiresAt, actor)
	if err != nil {
		if isUniqueViolation(err) {
			return model.Redirect{}, ErrConflict
		}
		return model.Redirect{}, err
	}
	return r.ByID(ctx, id)
}

func (r RedirectRepository) Update(ctx context.Context, id string, input model.RedirectInput, userID string) (model.Redirect, error) {
	var actor any
	if userID != "" {
		actor = userID
	}
	tag, err := r.pool.Exec(ctx, `
		UPDATE redirects
		SET name = $2, slug = $3, destination = $4, description = $5, redirect_type = $6,
		    is_active = $7, expires_at = $8, updated_by = $9, updated_at = now(), version = version + 1
		WHERE id = $1 AND deleted_at IS NULL AND version = $10
	`, id, input.Name, input.Slug, input.Destination, input.Description, input.RedirectType,
		input.IsActive, input.ExpiresAt, actor, input.Version)
	if err != nil {
		if isUniqueViolation(err) {
			return model.Redirect{}, ErrConflict
		}
		return model.Redirect{}, err
	}
	if tag.RowsAffected() == 0 {
		// Either gone or a stale version; distinguish for the save-flow UI.
		if _, err := r.ByID(ctx, id); err != nil {
			return model.Redirect{}, err
		}
		return model.Redirect{}, ErrConflict
	}
	return r.ByID(ctx, id)
}

// Archive soft-deletes (restorable by hand in SQL; slug becomes reusable).
func (r RedirectRepository) Archive(ctx context.Context, id string, version int) (string, error) {
	var slug string
	err := r.pool.QueryRow(ctx, `
		UPDATE redirects SET deleted_at = now(), updated_at = now(), version = version + 1
		WHERE id = $1 AND deleted_at IS NULL AND version = $2
		RETURNING slug
	`, id, version).Scan(&slug)
	if errors.Is(err, pgx.ErrNoRows) {
		if _, byIDErr := r.ByID(ctx, id); byIDErr != nil {
			return "", byIDErr
		}
		return "", ErrConflict
	}
	return slug, err
}

// BulkArchive soft-deletes many at once (no version check — explicit bulk
// action from the list view). Returns the affected slugs for cache purging.
func (r RedirectRepository) BulkArchive(ctx context.Context, ids []string) ([]string, error) {
	rows, err := r.pool.Query(ctx, `
		UPDATE redirects SET deleted_at = now(), updated_at = now(), version = version + 1
		WHERE id = ANY($1) AND deleted_at IS NULL
		RETURNING slug
	`, ids)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var slugs []string
	for rows.Next() {
		var slug string
		if err := rows.Scan(&slug); err != nil {
			return nil, err
		}
		slugs = append(slugs, slug)
	}
	return slugs, rows.Err()
}

// ExportAll streams every live redirect (for CSV export).
func (r RedirectRepository) ExportAll(ctx context.Context) ([]model.Redirect, error) {
	rows, err := r.pool.Query(ctx, fmt.Sprintf(`
		SELECT %s FROM redirects r WHERE r.deleted_at IS NULL ORDER BY r.slug
	`, redirectColumns))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []model.Redirect
	for rows.Next() {
		var item model.Redirect
		if err := rows.Scan(
			&item.ID, &item.Name, &item.Slug, &item.Destination, &item.Description, &item.RedirectType,
			&item.IsActive, &item.ExpiresAt, &item.CreatedAt, &item.UpdatedAt, &item.Version, &item.TotalScans,
		); err != nil {
			return nil, err
		}
		out = append(out, item)
	}
	return out, rows.Err()
}

// --- scan analytics ---

func (r RedirectRepository) ScanStats(ctx context.Context, slug string, from, to time.Time) (model.RedirectScanStats, error) {
	stats := model.RedirectScanStats{}

	// Totals: rollups survive raw retention, uniques come from raw (window-capped).
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(scans), 0)::int FROM redirect_stats
		WHERE slug = $1 AND bucket >= $2 AND bucket < $3
	`, slug, from, to).Scan(&stats.TotalScans)
	if err != nil {
		return stats, err
	}
	err = r.pool.QueryRow(ctx, `
		SELECT COUNT(DISTINCT visitor_id) FROM analytics_events
		WHERE event_type = 'redirect' AND event_name = $1 AND occurred_at >= $2 AND occurred_at < $3
	`, slug, from, to).Scan(&stats.UniqueScans)
	if err != nil {
		return stats, err
	}

	trendRows, err := r.pool.Query(ctx, `
		SELECT date_trunc('day', bucket), SUM(scans)::int, SUM(uniques)::int
		FROM redirect_stats
		WHERE slug = $1 AND bucket >= $2 AND bucket < $3
		GROUP BY 1 ORDER BY 1
	`, slug, from, to)
	if err != nil {
		return stats, err
	}
	defer trendRows.Close()
	for trendRows.Next() {
		var p model.RedirectTrendPoint
		if err := trendRows.Scan(&p.Bucket, &p.Scans, &p.Uniques); err != nil {
			return stats, err
		}
		stats.Trend = append(stats.Trend, p)
	}
	if err := trendRows.Err(); err != nil {
		return stats, err
	}

	breakdown := func(column string) ([]model.AnalyticsBreakdownRow, error) {
		rows, err := r.pool.Query(ctx, fmt.Sprintf(`
			SELECT COALESCE(NULLIF(%s, ''), 'unknown'), COUNT(*)::int
			FROM analytics_events
			WHERE event_type = 'redirect' AND event_name = $1 AND occurred_at >= $2 AND occurred_at < $3
			GROUP BY 1 ORDER BY 2 DESC LIMIT 10
		`, column), slug, from, to)
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
	if stats.Countries, err = breakdown("country"); err != nil {
		return stats, err
	}
	if stats.Devices, err = breakdown("device"); err != nil {
		return stats, err
	}
	if stats.Browsers, err = breakdown("browser"); err != nil {
		return stats, err
	}
	if stats.OS, err = breakdown("os"); err != nil {
		return stats, err
	}
	if stats.Referrers, err = breakdown("referrer"); err != nil {
		return stats, err
	}

	recentRows, err := r.pool.Query(ctx, `
		SELECT occurred_at, country, device, browser, os, referrer
		FROM analytics_events
		WHERE event_type = 'redirect' AND event_name = $1
		ORDER BY occurred_at DESC LIMIT 25
	`, slug)
	if err != nil {
		return stats, err
	}
	defer recentRows.Close()
	for recentRows.Next() {
		var scan model.RedirectScan
		if err := recentRows.Scan(&scan.At, &scan.Country, &scan.Device, &scan.Browser, &scan.OS, &scan.Referrer); err != nil {
			return stats, err
		}
		stats.Recent = append(stats.Recent, scan)
	}
	return stats, recentRows.Err()
}

func (r RedirectRepository) Dashboard(ctx context.Context, from, to time.Time) (model.RedirectDashboard, error) {
	dash := model.RedirectDashboard{}

	topRows, err := r.pool.Query(ctx, `
		SELECT s.slug, COALESCE(r.name, s.slug), SUM(s.scans)::int,
		       COALESCE(r.is_active AND (r.expires_at IS NULL OR r.expires_at > now()), false)
		FROM redirect_stats s
		LEFT JOIN redirects r ON r.slug = s.slug AND r.deleted_at IS NULL
		WHERE s.bucket >= $1 AND s.bucket < $2
		GROUP BY s.slug, r.name, r.is_active, r.expires_at
		ORDER BY 3 DESC LIMIT 10
	`, from, to)
	if err != nil {
		return dash, err
	}
	defer topRows.Close()
	for topRows.Next() {
		var row model.RedirectTopRow
		if err := topRows.Scan(&row.Slug, &row.Name, &row.Scans, &row.Active); err != nil {
			return dash, err
		}
		dash.Top = append(dash.Top, row)
	}
	if err := topRows.Err(); err != nil {
		return dash, err
	}

	trendRows, err := r.pool.Query(ctx, `
		SELECT date_trunc('day', bucket), SUM(scans)::int, SUM(uniques)::int
		FROM redirect_stats
		WHERE bucket >= $1 AND bucket < $2
		GROUP BY 1 ORDER BY 1
	`, from, to)
	if err != nil {
		return dash, err
	}
	defer trendRows.Close()
	for trendRows.Next() {
		var p model.RedirectTrendPoint
		if err := trendRows.Scan(&p.Bucket, &p.Scans, &p.Uniques); err != nil {
			return dash, err
		}
		dash.Trend = append(dash.Trend, p)
	}
	if err := trendRows.Err(); err != nil {
		return dash, err
	}

	recentRows, err := r.pool.Query(ctx, `
		SELECT event_name, occurred_at, country, device, browser, os, referrer
		FROM analytics_events
		WHERE event_type = 'redirect'
		ORDER BY occurred_at DESC LIMIT 20
	`)
	if err != nil {
		return dash, err
	}
	defer recentRows.Close()
	for recentRows.Next() {
		var scan model.RedirectRecentScan
		if err := recentRows.Scan(&scan.Slug, &scan.At, &scan.Country, &scan.Device, &scan.Browser, &scan.OS, &scan.Referrer); err != nil {
			return dash, err
		}
		dash.Recent = append(dash.Recent, scan)
	}
	if err := recentRows.Err(); err != nil {
		return dash, err
	}

	geoRows, err := r.pool.Query(ctx, `
		SELECT COALESCE(NULLIF(country, ''), 'unknown'), COUNT(*)::int
		FROM analytics_events
		WHERE event_type = 'redirect' AND occurred_at >= $1 AND occurred_at < $2
		GROUP BY 1 ORDER BY 2 DESC LIMIT 15
	`, from, to)
	if err != nil {
		return dash, err
	}
	defer geoRows.Close()
	for geoRows.Next() {
		var row model.AnalyticsBreakdownRow
		if err := geoRows.Scan(&row.Value, &row.Sessions); err != nil {
			return dash, err
		}
		dash.Geo = append(dash.Geo, row)
	}
	return dash, geoRows.Err()
}
