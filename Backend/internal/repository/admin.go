package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminRepository struct {
	pool *pgxpool.Pool
}

func NewAdminRepository(pool *pgxpool.Pool) AdminRepository {
	return AdminRepository{pool: pool}
}

// Content tables that support soft delete and a publish status.
var contentTables = []string{"pages", "services", "products", "news", "careers"}

func (r AdminRepository) DashboardCounts(ctx context.Context) (map[string]int, error) {
	// Table names are controlled by the static allow-lists, not request
	// input. All counts run as one round-trip instead of a query per table.
	tables := []string{"users", "pages", "services", "products", "news", "careers", "media", "contacts"}
	keys := make([]string, 0, len(tables)+1)
	selects := make([]string, 0, len(tables)+1)
	for _, table := range tables {
		keys = append(keys, table)
		selects = append(selects, `(SELECT COUNT(*) FROM `+table+` WHERE deleted_at IS NULL)`)
	}

	// Archived (soft-deleted) content across every content table.
	archived := make([]string, len(contentTables))
	for i, table := range contentTables {
		archived[i] = `(SELECT COUNT(*) FROM ` + table + ` WHERE deleted_at IS NOT NULL)`
	}
	keys = append(keys, "archive")
	selects = append(selects, `(SELECT `+strings.Join(archived, " + ")+`)`)

	totals := make([]int, len(keys))
	dest := make([]any, len(keys))
	for i := range totals {
		dest[i] = &totals[i]
	}
	if err := r.pool.QueryRow(ctx, `SELECT `+strings.Join(selects, ", ")).Scan(dest...); err != nil {
		return nil, err
	}

	counts := make(map[string]int, len(keys))
	for i, key := range keys {
		counts[key] = totals[i]
	}
	return counts, nil
}

// DashboardStatusCounts returns per-status record counts for each content
// module, e.g. {"pages": {"published": 4, "draft": 2}}.
func (r AdminRepository) DashboardStatusCounts(ctx context.Context) (map[string]map[string]int, error) {
	parts := make([]string, len(contentTables))
	for i, table := range contentTables {
		parts[i] = `SELECT '` + table + `' AS module, status, COUNT(*) FROM ` + table + ` WHERE deleted_at IS NULL GROUP BY status`
	}
	rows, err := r.pool.Query(ctx, strings.Join(parts, " UNION ALL "))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	statuses := make(map[string]map[string]int, len(contentTables))
	for rows.Next() {
		var module, status string
		var total int
		if err := rows.Scan(&module, &status, &total); err != nil {
			return nil, err
		}
		if statuses[module] == nil {
			statuses[module] = map[string]int{}
		}
		statuses[module][status] = total
	}
	return statuses, rows.Err()
}

// RecordActivity appends a content mutation to the audit log. The label is
// a human-readable identifier (usually the record title) kept in `after` so
// the activity feed can name what changed.
func (r AdminRepository) RecordActivity(ctx context.Context, actorID, action, entityType, entityID, label string) error {
	return r.RecordActivityDiff(ctx, actorID, action, entityType, entityID, nil, map[string]string{"label": label})
}

// RecordActivityDiff writes an audit row with minimal before/after snapshots
// (label + status) so the trail shows what a mutation changed, not just that
// it happened.
func (r AdminRepository) RecordActivityDiff(ctx context.Context, actorID, action, entityType, entityID string, before, after map[string]string) error {
	var actor any
	if actorID != "" {
		actor = actorID
	}
	var entity any
	if entityID != "" {
		entity = entityID
	}
	var beforeJSON any
	if len(before) > 0 {
		encoded, err := json.Marshal(before)
		if err != nil {
			return err
		}
		beforeJSON = encoded
	}
	var afterJSON any
	if len(after) > 0 {
		encoded, err := json.Marshal(after)
		if err != nil {
			return err
		}
		afterJSON = encoded
	}
	_, err := r.pool.Exec(ctx, `
		INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, before, after)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, uuid.NewString(), actor, action, entityType, entity, beforeJSON, afterJSON)
	return err
}

func (r AdminRepository) RecentActivity(ctx context.Context, limit int) ([]model.ActivityEntry, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT a.id::text, a.action, a.entity_type, COALESCE(a.entity_id::text, ''),
		       COALESCE(a.after->>'label', ''), COALESCE(u.name, ''), a.created_at
		FROM audit_logs a
		LEFT JOIN users u ON u.id = a.actor_id
		WHERE a.deleted_at IS NULL AND a.entity_type <> 'auth'
		ORDER BY a.created_at DESC
		LIMIT $1
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []model.ActivityEntry
	for rows.Next() {
		var item model.ActivityEntry
		if err := rows.Scan(&item.ID, &item.Action, &item.EntityType, &item.EntityID, &item.Label, &item.ActorName, &item.CreatedAt); err != nil {
			return nil, err
		}
		entries = append(entries, item)
	}
	return entries, rows.Err()
}

func (r AdminRepository) CreateMedia(ctx context.Context, media model.MediaUpload) (model.MediaUpload, error) {
	if media.ID == "" {
		media.ID = uuid.NewString()
	}
	err := r.pool.QueryRow(ctx, `
		INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, status)
		VALUES ($1, $2, $3, $4, $5, $6, 'ready')
		RETURNING id::text, file_name, object_key, url, mime_type, size_bytes
	`, media.ID, media.FileName, media.ObjectKey, media.URL, media.MimeType, media.SizeBytes).Scan(
		&media.ID,
		&media.FileName,
		&media.ObjectKey,
		&media.URL,
		&media.MimeType,
		&media.SizeBytes,
	)
	return media, err
}

func (r AdminRepository) ListMedia(ctx context.Context, page, perPage int, search string) (model.ListResponse[model.MediaUpload], error) {
	page, perPage, offset := normalizePagination(page, perPage)
	rows, err := r.pool.Query(ctx, `
		SELECT id::text, file_name, object_key, url, mime_type, size_bytes, created_at, COUNT(*) OVER()
		FROM media
		WHERE deleted_at IS NULL
		  AND ($3 = '' OR file_name ILIKE '%' || $3 || '%')
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`, perPage, offset, search)
	if err != nil {
		return model.ListResponse[model.MediaUpload]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.MediaUpload
	for rows.Next() {
		var item model.MediaUpload
		if err := rows.Scan(&item.ID, &item.FileName, &item.ObjectKey, &item.URL, &item.MimeType, &item.SizeBytes, &item.CreatedAt, &total); err != nil {
			return model.ListResponse[model.MediaUpload]{}, err
		}
		data = append(data, item)
	}

	return model.ListResponse[model.MediaUpload]{
		Data: data,
		Pagination: model.Pagination{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages(total, perPage),
		},
	}, rows.Err()
}

// DeleteMedia removes the media row and returns it so the caller can delete
// the stored object as well.
func (r AdminRepository) DeleteMedia(ctx context.Context, id string) (model.MediaUpload, error) {
	row := r.pool.QueryRow(ctx, `
		DELETE FROM media WHERE id = $1
		RETURNING id::text, file_name, object_key, url, mime_type, size_bytes
	`, id)
	var media model.MediaUpload
	if err := row.Scan(&media.ID, &media.FileName, &media.ObjectKey, &media.URL, &media.MimeType, &media.SizeBytes); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.MediaUpload{}, ErrNotFound
		}
		return model.MediaUpload{}, err
	}
	return media, nil
}

// PageContacts lists inquiries for the contacts screen: newest first, with
// optional status and free-text filtering.
func (r AdminRepository) PageContacts(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.ContactInquiry], error) {
	page, perPage, offset := normalizePagination(page, perPage)
	rows, err := r.pool.Query(ctx, `
		SELECT id::text, name, email, COALESCE(phone, ''), COALESCE(company, ''), subject, message,
		       status, created_at, version, COUNT(*) OVER()
		FROM contacts
		WHERE deleted_at IS NULL
		  AND ($3 = '' OR status = $3)
		  AND ($4 = '' OR name ILIKE '%' || $4 || '%' OR email ILIKE '%' || $4 || '%'
		       OR subject ILIKE '%' || $4 || '%' OR COALESCE(company, '') ILIKE '%' || $4 || '%')
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`, perPage, offset, status, search)
	if err != nil {
		return model.ListResponse[model.ContactInquiry]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.ContactInquiry
	for rows.Next() {
		var item model.ContactInquiry
		if err := rows.Scan(&item.ID, &item.Name, &item.Email, &item.Phone, &item.Company,
			&item.Subject, &item.Message, &item.Status, &item.CreatedAt, &item.Version, &total); err != nil {
			return model.ListResponse[model.ContactInquiry]{}, err
		}
		data = append(data, item)
	}
	if err := rows.Err(); err != nil {
		return model.ListResponse[model.ContactInquiry]{}, err
	}

	return model.ListResponse[model.ContactInquiry]{
		Data:       data,
		Pagination: model.Pagination{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages(total, perPage),
		},
	}, nil
}

// UpdateContactStatus moves an inquiry along the workflow, recording who did
// it. Optimistic locking mirrors the content tables.
func (r AdminRepository) UpdateContactStatus(ctx context.Context, id, status, actorID string, version int) (model.ContactInquiry, error) {
	var actor any
	if actorID != "" {
		actor = actorID
	}
	row := r.pool.QueryRow(ctx, `
		UPDATE contacts
		SET status = $2, updated_at = now(), updated_by = $3, version = version + 1
		WHERE id = $1 AND deleted_at IS NULL AND version = $4
		RETURNING id::text, name, email, COALESCE(phone, ''), COALESCE(company, ''), subject, message,
		          status, created_at, version
	`, id, status, actor, version)

	var item model.ContactInquiry
	if err := row.Scan(&item.ID, &item.Name, &item.Email, &item.Phone, &item.Company,
		&item.Subject, &item.Message, &item.Status, &item.CreatedAt, &item.Version); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// Either the row is gone or someone else changed it first.
			var exists bool
			if probe := r.pool.QueryRow(ctx, `SELECT true FROM contacts WHERE id = $1 AND deleted_at IS NULL`, id).Scan(&exists); probe != nil {
				return model.ContactInquiry{}, ErrNotFound
			}
			return model.ContactInquiry{}, ErrConflict
		}
		return model.ContactInquiry{}, err
	}
	return item, nil
}

func (r AdminRepository) ListContacts(ctx context.Context, limit int) ([]model.ContactInquiry, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id::text, name, email, COALESCE(phone, ''), COALESCE(company, ''), subject, message, status, created_at
		FROM contacts
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var contacts []model.ContactInquiry
	for rows.Next() {
		var item model.ContactInquiry
		if err := rows.Scan(&item.ID, &item.Name, &item.Email, &item.Phone, &item.Company, &item.Subject, &item.Message, &item.Status, &item.CreatedAt); err != nil {
			return nil, err
		}
		contacts = append(contacts, item)
	}
	return contacts, rows.Err()
}

func (r AdminRepository) ListPages(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.Page], error) {
	page, perPage, offset := normalizePagination(page, perPage)
	// List consumers (admin table, navigation page options) never read the
	// page body, so skip shipping content — section-built pages can carry
	// tens of KB each. PageByID still returns the full document.
	rows, err := r.pool.Query(ctx, `
		SELECT p.id::text, p.page_key, p.title, '{}'::jsonb AS content,
		       CASE WHEN p.deleted_at IS NOT NULL THEN 'archived' ELSE p.status END AS status,
		       p.published_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       p.version, COUNT(*) OVER()
		FROM pages p
		LEFT JOIN seo_meta s ON s.entity_type = 'page' AND s.entity_id = p.id AND s.deleted_at IS NULL
		WHERE (
		  CASE
		    WHEN $3 = 'archived' THEN (p.status = 'archived' OR p.deleted_at IS NOT NULL)
		    ELSE p.deleted_at IS NULL AND ($3 = '' OR p.status = $3)
		  END
		)
		  AND ($4 = '' OR p.title ILIKE '%' || $4 || '%' OR p.page_key ILIKE '%' || $4 || '%')
		ORDER BY p.updated_at DESC, p.title ASC
		LIMIT $1 OFFSET $2
	`, perPage, offset, status, search)
	if err != nil {
		return model.ListResponse[model.Page]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.Page
	for rows.Next() {
		item, rowTotal, err := scanAdminPage(rows)
		if err != nil {
			return model.ListResponse[model.Page]{}, err
		}
		total = rowTotal
		data = append(data, item)
	}

	return model.ListResponse[model.Page]{
		Data: data,
		Pagination: model.Pagination{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages(total, perPage),
		},
	}, rows.Err()
}

func (r AdminRepository) CreatePage(ctx context.Context, input model.PageCreateInput) (model.Page, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.Page{}, err
	}
	defer tx.Rollback(ctx)

	id := uuid.NewString()
	_, err = tx.Exec(ctx, `
		INSERT INTO pages (id, page_key, title, content, status, published_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, id, input.Key, input.Title, input.Content, input.Status, input.PublishedAt)
	if err != nil {
		if isUniqueViolation(err) {
			return model.Page{}, ErrConflict
		}
		return model.Page{}, err
	}
	if err := upsertPageSEO(ctx, tx, id, input.SEO); err != nil {
		return model.Page{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.Page{}, err
	}
	return r.PageByID(ctx, id)
}

func (r AdminRepository) PageByID(ctx context.Context, id string) (model.Page, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT p.id::text, p.page_key, p.title, p.content, p.status, p.published_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       p.version, 1
		FROM pages p
		LEFT JOIN seo_meta s ON s.entity_type = 'page' AND s.entity_id = p.id AND s.deleted_at IS NULL
		WHERE p.id = $1 AND p.deleted_at IS NULL
	`, id)
	item, _, err := scanAdminPage(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Page{}, ErrNotFound
	}
	return item, err
}

func (r AdminRepository) UpdatePage(ctx context.Context, id string, input model.PageInput) (model.Page, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.Page{}, err
	}
	defer tx.Rollback(ctx)

	row := tx.QueryRow(ctx, `
		UPDATE pages
		SET page_key = $2,
		    title = $3,
		    content = $4,
		    status = $5,
		    published_at = $6,
		    updated_at = now(),
		    version = version + 1
		WHERE id = $1 AND version = $7 AND deleted_at IS NULL
		RETURNING id::text, page_key, title, content, status, published_at,
		          ''::text, ''::text, ''::text, false, version, 1
	`, id, input.Key, input.Title, input.Content, input.Status, input.PublishedAt, input.Version)

	item, _, err := scanAdminPage(row)
	if errors.Is(err, pgx.ErrNoRows) {
		exists, lookupErr := r.pageExists(ctx, id)
		if lookupErr != nil {
			return model.Page{}, lookupErr
		}
		if exists {
			return model.Page{}, ErrConflict
		}
		return model.Page{}, ErrNotFound
	}
	if err != nil {
		if isUniqueViolation(err) {
			return model.Page{}, ErrConflict
		}
		return model.Page{}, err
	}
	if err := upsertPageSEO(ctx, tx, item.ID, input.SEO); err != nil {
		return model.Page{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.Page{}, err
	}
	return r.PageByID(ctx, item.ID)
}

func (r AdminRepository) DeletePage(ctx context.Context, id string, version int) error {
	result, err := r.pool.Exec(ctx, `
		UPDATE pages
		SET deleted_at = now(), updated_at = now(), version = version + 1
		WHERE id = $1 AND version = $2 AND deleted_at IS NULL
	`, id, version)
	if err != nil {
		return err
	}
	if result.RowsAffected() > 0 {
		return nil
	}
	exists, err := r.pageExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return ErrConflict
	}
	return ErrNotFound
}

func (r AdminRepository) ListContent(ctx context.Context, table string, page, perPage int, search, status string) (model.ListResponse[model.ContentNode], error) {
	cfg, ok := contentConfig(table)
	if !ok {
		return model.ListResponse[model.ContentNode]{}, errors.New("invalid content table")
	}

	page, perPage, offset := normalizePagination(page, perPage)
	query := `
		SELECT c.id::text, c.parent_id::text, c.slug, c.full_path, c.title, COALESCE(c.summary, ''), c.content,
		       COALESCE(c.image_url, ''), c.gallery,
		       CASE WHEN c.deleted_at IS NOT NULL THEN 'archived' ELSE c.status END AS status,
		       c.published_at, c.sort_order, c.depth,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       c.version`
	if cfg.hasProductFields {
		query += `, COALESCE(c.datasheet_url, ''), c.specs`
	} else {
		query += `, ''::text, '{}'::jsonb`
	}
	query += `, COUNT(*) OVER()
		FROM ` + cfg.table + ` c
		LEFT JOIN seo_meta s ON s.entity_type = $1 AND s.entity_id = c.id AND s.deleted_at IS NULL
		WHERE (
		  CASE
		    WHEN $4 = 'archived' THEN (c.status = 'archived' OR c.deleted_at IS NOT NULL)
		    ELSE c.deleted_at IS NULL AND ($4 = '' OR c.status = $4)
		  END
		)
		  AND ($5 = '' OR c.title ILIKE '%' || $5 || '%' OR c.slug ILIKE '%' || $5 || '%' OR c.full_path ILIKE '%' || $5 || '%')
		ORDER BY c.sort_order ASC, c.updated_at DESC, c.title ASC
		LIMIT $2 OFFSET $3`

	rows, err := r.pool.Query(ctx, query, cfg.entityType, perPage, offset, status, search)
	if err != nil {
		return model.ListResponse[model.ContentNode]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.ContentNode
	for rows.Next() {
		item, rowTotal, err := scanAdminContent(rows)
		if err != nil {
			return model.ListResponse[model.ContentNode]{}, err
		}
		total = rowTotal
		data = append(data, item)
	}

	return model.ListResponse[model.ContentNode]{
		Data: data,
		Pagination: model.Pagination{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages(total, perPage),
		},
	}, rows.Err()
}

func (r AdminRepository) ContentByID(ctx context.Context, table, id string) (model.ContentNode, error) {
	cfg, ok := contentConfig(table)
	if !ok {
		return model.ContentNode{}, errors.New("invalid content table")
	}
	query := `
		SELECT c.id::text, c.parent_id::text, c.slug, c.full_path, c.title, COALESCE(c.summary, ''), c.content,
		       COALESCE(c.image_url, ''), c.gallery, c.status, c.published_at, c.sort_order, c.depth,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       c.version`
	if cfg.hasProductFields {
		query += `, COALESCE(c.datasheet_url, ''), c.specs`
	} else {
		query += `, ''::text, '{}'::jsonb`
	}
	query += `, 1
		FROM ` + cfg.table + ` c
		LEFT JOIN seo_meta s ON s.entity_type = $1 AND s.entity_id = c.id AND s.deleted_at IS NULL
		WHERE c.id = $2 AND c.deleted_at IS NULL`

	item, _, err := scanAdminContent(r.pool.QueryRow(ctx, query, cfg.entityType, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return model.ContentNode{}, ErrNotFound
	}
	return item, err
}

func (r AdminRepository) CreateContent(ctx context.Context, table string, input model.ContentNodeInput) (model.ContentNode, error) {
	cfg, ok := contentConfig(table)
	if !ok {
		return model.ContentNode{}, errors.New("invalid content table")
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.ContentNode{}, err
	}
	defer tx.Rollback(ctx)

	fullPath, depth, err := r.contentPath(ctx, tx, cfg.table, input.ParentID, input.Slug)
	if err != nil {
		return model.ContentNode{}, err
	}
	id := uuid.NewString()
	gallery := input.Gallery
	if gallery == nil {
		gallery = []model.MediaAsset{}
	}
	specs := input.Specs
	if specs == nil {
		specs = map[string]string{}
	}

	if cfg.hasProductFields {
		_, err = tx.Exec(ctx, `
			INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, datasheet_url, image_url, gallery, status, published_at, sort_order, depth)
			VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), $7, $8, NULLIF($9, ''), NULLIF($10, ''), $11, $12, $13, $14, $15)
		`, id, nullableString(input.ParentID), input.Slug, fullPath, input.Title, input.Summary, input.Content, specs, input.DatasheetURL, input.ImageURL, gallery, input.Status, input.PublishedAt, input.SortOrder, depth)
	} else {
		_, err = tx.Exec(ctx, `
			INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth)
			VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), $7, NULLIF($8, ''), $9, $10, $11, $12, $13)
		`, id, nullableString(input.ParentID), input.Slug, fullPath, input.Title, input.Summary, input.Content, input.ImageURL, gallery, input.Status, input.PublishedAt, input.SortOrder, depth)
	}
	if err != nil {
		if isUniqueViolation(err) {
			return model.ContentNode{}, ErrConflict
		}
		return model.ContentNode{}, err
	}
	if err := upsertSEO(ctx, tx, cfg.entityType, id, input.SEO); err != nil {
		return model.ContentNode{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.ContentNode{}, err
	}
	return r.ContentByID(ctx, cfg.table, id)
}

func (r AdminRepository) UpdateContent(ctx context.Context, table, id string, input model.ContentNodeInput) (model.ContentNode, error) {
	cfg, ok := contentConfig(table)
	if !ok {
		return model.ContentNode{}, errors.New("invalid content table")
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.ContentNode{}, err
	}
	defer tx.Rollback(ctx)

	var oldPath string
	var oldDepth int
	err = tx.QueryRow(ctx, `SELECT full_path, depth FROM `+cfg.table+` WHERE id = $1 AND deleted_at IS NULL`, id).Scan(&oldPath, &oldDepth)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.ContentNode{}, ErrNotFound
	}
	if err != nil {
		return model.ContentNode{}, err
	}
	if input.ParentID != nil {
		parentID := strings.TrimSpace(*input.ParentID)
		if parentID == id {
			return model.ContentNode{}, ErrConflict
		}
		var parentPath string
		if err := tx.QueryRow(ctx, `SELECT full_path FROM `+cfg.table+` WHERE id = $1 AND deleted_at IS NULL`, parentID).Scan(&parentPath); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return model.ContentNode{}, ErrNotFound
			}
			return model.ContentNode{}, err
		}
		if parentPath == oldPath || strings.HasPrefix(parentPath, oldPath+"/") {
			return model.ContentNode{}, ErrConflict
		}
	}

	fullPath, depth, err := r.contentPath(ctx, tx, cfg.table, input.ParentID, input.Slug)
	if err != nil {
		return model.ContentNode{}, err
	}
	gallery := input.Gallery
	if gallery == nil {
		gallery = []model.MediaAsset{}
	}
	specs := input.Specs
	if specs == nil {
		specs = map[string]string{}
	}

	var row pgx.Row
	if cfg.hasProductFields {
		row = tx.QueryRow(ctx, `
			UPDATE products
			SET parent_id = $2, slug = $3, full_path = $4, title = $5, summary = NULLIF($6, ''),
			    content = $7, specs = $8, datasheet_url = NULLIF($9, ''), image_url = NULLIF($10, ''),
			    gallery = $11, status = $12, published_at = $13, sort_order = $14, depth = $15,
			    updated_at = now(), version = version + 1
			WHERE id = $1 AND version = $16 AND deleted_at IS NULL
			RETURNING id::text, parent_id::text, slug, full_path, title, COALESCE(summary, ''), content,
			          COALESCE(image_url, ''), gallery, status, published_at, sort_order, depth,
			          ''::text, ''::text, ''::text, false, version, COALESCE(datasheet_url, ''), specs, 1
		`, id, nullableString(input.ParentID), input.Slug, fullPath, input.Title, input.Summary, input.Content, specs, input.DatasheetURL, input.ImageURL, gallery, input.Status, input.PublishedAt, input.SortOrder, depth, input.Version)
	} else {
		row = tx.QueryRow(ctx, `
			UPDATE services
			SET parent_id = $2, slug = $3, full_path = $4, title = $5, summary = NULLIF($6, ''),
			    content = $7, image_url = NULLIF($8, ''), gallery = $9, status = $10,
			    published_at = $11, sort_order = $12, depth = $13,
			    updated_at = now(), version = version + 1
			WHERE id = $1 AND version = $14 AND deleted_at IS NULL
			RETURNING id::text, parent_id::text, slug, full_path, title, COALESCE(summary, ''), content,
			          COALESCE(image_url, ''), gallery, status, published_at, sort_order, depth,
			          ''::text, ''::text, ''::text, false, version, ''::text, '{}'::jsonb, 1
		`, id, nullableString(input.ParentID), input.Slug, fullPath, input.Title, input.Summary, input.Content, input.ImageURL, gallery, input.Status, input.PublishedAt, input.SortOrder, depth, input.Version)
	}

	item, _, err := scanAdminContent(row)
	if errors.Is(err, pgx.ErrNoRows) {
		exists, lookupErr := r.contentExists(ctx, cfg.table, id)
		if lookupErr != nil {
			return model.ContentNode{}, lookupErr
		}
		if exists {
			return model.ContentNode{}, ErrConflict
		}
		return model.ContentNode{}, ErrNotFound
	}
	if err != nil {
		if isUniqueViolation(err) {
			return model.ContentNode{}, ErrConflict
		}
		return model.ContentNode{}, err
	}
	if err := upsertSEO(ctx, tx, cfg.entityType, item.ID, input.SEO); err != nil {
		return model.ContentNode{}, err
	}
	if oldPath != fullPath || oldDepth != depth {
		if _, err := tx.Exec(ctx, `
			UPDATE `+cfg.table+`
			SET full_path = $2 || substring(full_path from $3),
			    depth = depth + $4,
			    updated_at = now()
			WHERE deleted_at IS NULL AND full_path LIKE $1 || '/%'
		`, oldPath, fullPath, len(oldPath)+1, depth-oldDepth); err != nil {
			return model.ContentNode{}, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return model.ContentNode{}, err
	}
	return r.ContentByID(ctx, cfg.table, item.ID)
}

func (r AdminRepository) DeleteContent(ctx context.Context, table, id string, version int) error {
	cfg, ok := contentConfig(table)
	if !ok {
		return errors.New("invalid content table")
	}
	result, err := r.pool.Exec(ctx, `
		UPDATE `+cfg.table+`
		SET deleted_at = now(), updated_at = now(), version = version + 1
		WHERE id = $1 AND version = $2 AND deleted_at IS NULL
	`, id, version)
	if err != nil {
		return err
	}
	if result.RowsAffected() > 0 {
		return nil
	}
	exists, err := r.contentExists(ctx, cfg.table, id)
	if err != nil {
		return err
	}
	if exists {
		return ErrConflict
	}
	return ErrNotFound
}

func (r AdminRepository) ListNews(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.NewsItem], error) {
	page, perPage, offset := normalizePagination(page, perPage)
	rows, err := r.pool.Query(ctx, `
		SELECT n.id::text, n.slug, n.title, COALESCE(n.excerpt, ''), n.body, COALESCE(c.name, ''), COALESCE(n.featured_image_url, ''),
		       n.featured,
		       CASE WHEN n.deleted_at IS NOT NULL THEN 'archived' ELSE n.status END AS status,
		       n.published_at, n.scheduled_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       n.version, COUNT(*) OVER()
		FROM news n
		LEFT JOIN news_categories c ON c.id = n.category_id AND c.deleted_at IS NULL
		LEFT JOIN seo_meta s ON s.entity_type = 'news' AND s.entity_id = n.id AND s.deleted_at IS NULL
		WHERE (
		  CASE
		    WHEN $3 = 'archived' THEN (n.status = 'archived' OR n.deleted_at IS NOT NULL)
		    ELSE n.deleted_at IS NULL AND ($3 = '' OR n.status = $3)
		  END
		)
		  AND ($4 = '' OR n.title ILIKE '%' || $4 || '%' OR n.slug ILIKE '%' || $4 || '%' OR n.excerpt ILIKE '%' || $4 || '%')
		ORDER BY n.updated_at DESC, n.published_at DESC NULLS LAST, n.title ASC
		LIMIT $1 OFFSET $2
	`, perPage, offset, status, search)
	if err != nil {
		return model.ListResponse[model.NewsItem]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.NewsItem
	for rows.Next() {
		item, rowTotal, err := scanNews(rows)
		if err != nil {
			return model.ListResponse[model.NewsItem]{}, err
		}
		total = rowTotal
		data = append(data, item)
	}
	return model.ListResponse[model.NewsItem]{
		Data: data,
		Pagination: model.Pagination{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages(total, perPage),
		},
	}, rows.Err()
}

func (r AdminRepository) NewsByID(ctx context.Context, id string) (model.NewsItem, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT n.id::text, n.slug, n.title, COALESCE(n.excerpt, ''), n.body, COALESCE(c.name, ''), COALESCE(n.featured_image_url, ''),
		       n.featured, n.status, n.published_at, n.scheduled_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       n.version, 1
		FROM news n
		LEFT JOIN news_categories c ON c.id = n.category_id AND c.deleted_at IS NULL
		LEFT JOIN seo_meta s ON s.entity_type = 'news' AND s.entity_id = n.id AND s.deleted_at IS NULL
		WHERE n.id = $1 AND n.deleted_at IS NULL
	`, id)
	item, _, err := scanNews(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.NewsItem{}, ErrNotFound
	}
	return item, err
}

func (r AdminRepository) CreateNews(ctx context.Context, input model.NewsInput) (model.NewsItem, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.NewsItem{}, err
	}
	defer tx.Rollback(ctx)

	categoryID, err := r.newsCategoryID(ctx, tx, input.Category)
	if err != nil {
		return model.NewsItem{}, err
	}
	id := uuid.NewString()
	_, err = tx.Exec(ctx, `
		INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at, scheduled_at)
		VALUES ($1, $2, $3, $4, NULLIF($5, ''), $6, NULLIF($7, ''), $8, $9, $10, $11)
	`, id, categoryID, input.Slug, input.Title, input.Excerpt, input.Body, input.FeaturedImageURL, input.Featured, input.Status, input.PublishedAt, input.ScheduledAt)
	if err != nil {
		if isUniqueViolation(err) {
			return model.NewsItem{}, ErrConflict
		}
		return model.NewsItem{}, err
	}
	if err := upsertSEO(ctx, tx, "news", id, input.SEO); err != nil {
		return model.NewsItem{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.NewsItem{}, err
	}
	return r.NewsByID(ctx, id)
}

func (r AdminRepository) UpdateNews(ctx context.Context, id string, input model.NewsInput) (model.NewsItem, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.NewsItem{}, err
	}
	defer tx.Rollback(ctx)

	categoryID, err := r.newsCategoryID(ctx, tx, input.Category)
	if err != nil {
		return model.NewsItem{}, err
	}
	row := tx.QueryRow(ctx, `
		UPDATE news
		SET category_id = $2, slug = $3, title = $4, excerpt = NULLIF($5, ''), body = $6,
		    featured_image_url = NULLIF($7, ''), featured = $8, status = $9, published_at = $10,
		    scheduled_at = $11, updated_at = now(), version = version + 1
		WHERE id = $1 AND version = $12 AND deleted_at IS NULL
		RETURNING id::text, slug, title, COALESCE(excerpt, ''), body, ''::text, COALESCE(featured_image_url, ''),
		          featured, status, published_at, scheduled_at, ''::text, ''::text, ''::text, false, version, 1
	`, id, categoryID, input.Slug, input.Title, input.Excerpt, input.Body, input.FeaturedImageURL, input.Featured, input.Status, input.PublishedAt, input.ScheduledAt, input.Version)

	item, _, err := scanNews(row)
	if errors.Is(err, pgx.ErrNoRows) {
		exists, lookupErr := r.newsExists(ctx, id)
		if lookupErr != nil {
			return model.NewsItem{}, lookupErr
		}
		if exists {
			return model.NewsItem{}, ErrConflict
		}
		return model.NewsItem{}, ErrNotFound
	}
	if err != nil {
		if isUniqueViolation(err) {
			return model.NewsItem{}, ErrConflict
		}
		return model.NewsItem{}, err
	}
	if err := upsertSEO(ctx, tx, "news", item.ID, input.SEO); err != nil {
		return model.NewsItem{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.NewsItem{}, err
	}
	return r.NewsByID(ctx, item.ID)
}

func (r AdminRepository) DeleteNews(ctx context.Context, id string, version int) error {
	result, err := r.pool.Exec(ctx, `
		UPDATE news
		SET deleted_at = now(), updated_at = now(), version = version + 1
		WHERE id = $1 AND version = $2 AND deleted_at IS NULL
	`, id, version)
	if err != nil {
		return err
	}
	if result.RowsAffected() > 0 {
		return nil
	}
	exists, err := r.newsExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return ErrConflict
	}
	return ErrNotFound
}

func (r AdminRepository) ListCareers(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.Career], error) {
	page, perPage, offset := normalizePagination(page, perPage)
	rows, err := r.pool.Query(ctx, `
		SELECT id::text, slug, title, COALESCE(summary, ''), description, department, location, employment_type, COALESCE(apply_url, ''),
		       deadline,
		       CASE WHEN deleted_at IS NOT NULL THEN 'archived' ELSE status END AS status,
		       published_at, version, COUNT(*) OVER()
		FROM careers
		WHERE (
		  CASE
		    WHEN $3 = 'archived' THEN (status = 'archived' OR deleted_at IS NOT NULL)
		    ELSE deleted_at IS NULL AND ($3 = '' OR status = $3)
		  END
		)
		  AND ($4 = '' OR title ILIKE '%' || $4 || '%' OR slug ILIKE '%' || $4 || '%' OR summary ILIKE '%' || $4 || '%' OR department ILIKE '%' || $4 || '%')
		ORDER BY updated_at DESC, published_at DESC NULLS LAST, title ASC
		LIMIT $1 OFFSET $2
	`, perPage, offset, status, search)
	if err != nil {
		return model.ListResponse[model.Career]{}, err
	}
	defer rows.Close()

	var total int
	var data []model.Career
	for rows.Next() {
		item, rowTotal, err := scanCareer(rows)
		if err != nil {
			return model.ListResponse[model.Career]{}, err
		}
		total = rowTotal
		data = append(data, item)
	}
	return model.ListResponse[model.Career]{
		Data: data,
		Pagination: model.Pagination{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages(total, perPage),
		},
	}, rows.Err()
}

func (r AdminRepository) CareerByID(ctx context.Context, id string) (model.Career, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT id::text, slug, title, COALESCE(summary, ''), description, department, location, employment_type, COALESCE(apply_url, ''),
		       deadline, status, published_at, version, 1
		FROM careers
		WHERE id = $1 AND deleted_at IS NULL
	`, id)
	item, _, err := scanCareer(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Career{}, ErrNotFound
	}
	return item, err
}

func (r AdminRepository) CreateCareer(ctx context.Context, input model.CareerInput) (model.Career, error) {
	id := uuid.NewString()
	_, err := r.pool.Exec(ctx, `
		INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at)
		VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6, $7, $8, NULLIF($9, ''), $10, $11, $12)
	`, id, input.Slug, input.Title, input.Summary, input.Description, input.Department, input.Location, input.EmploymentType, input.ApplyURL, input.Deadline, input.Status, input.PublishedAt)
	if err != nil {
		if isUniqueViolation(err) {
			return model.Career{}, ErrConflict
		}
		return model.Career{}, err
	}
	return r.CareerByID(ctx, id)
}

func (r AdminRepository) UpdateCareer(ctx context.Context, id string, input model.CareerInput) (model.Career, error) {
	row := r.pool.QueryRow(ctx, `
		UPDATE careers
		SET slug = $2, title = $3, summary = NULLIF($4, ''), description = $5, department = $6,
		    location = $7, employment_type = $8, apply_url = NULLIF($9, ''), deadline = $10,
		    status = $11, published_at = $12, updated_at = now(), version = version + 1
		WHERE id = $1 AND version = $13 AND deleted_at IS NULL
		RETURNING id::text, slug, title, COALESCE(summary, ''), description, department, location, employment_type, COALESCE(apply_url, ''),
		          deadline, status, published_at, version, 1
	`, id, input.Slug, input.Title, input.Summary, input.Description, input.Department, input.Location, input.EmploymentType, input.ApplyURL, input.Deadline, input.Status, input.PublishedAt, input.Version)
	item, _, err := scanCareer(row)
	if errors.Is(err, pgx.ErrNoRows) {
		exists, lookupErr := r.careerExists(ctx, id)
		if lookupErr != nil {
			return model.Career{}, lookupErr
		}
		if exists {
			return model.Career{}, ErrConflict
		}
		return model.Career{}, ErrNotFound
	}
	if err != nil {
		if isUniqueViolation(err) {
			return model.Career{}, ErrConflict
		}
		return model.Career{}, err
	}
	return item, nil
}

func (r AdminRepository) DeleteCareer(ctx context.Context, id string, version int) error {
	result, err := r.pool.Exec(ctx, `
		UPDATE careers
		SET deleted_at = now(), updated_at = now(), version = version + 1
		WHERE id = $1 AND version = $2 AND deleted_at IS NULL
	`, id, version)
	if err != nil {
		return err
	}
	if result.RowsAffected() > 0 {
		return nil
	}
	exists, err := r.careerExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return ErrConflict
	}
	return ErrNotFound
}

func (r AdminRepository) pageExists(ctx context.Context, id string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM pages WHERE id = $1 AND deleted_at IS NULL)`, id).Scan(&exists)
	return exists, err
}

func (r AdminRepository) contentExists(ctx context.Context, table, id string) (bool, error) {
	cfg, ok := contentConfig(table)
	if !ok {
		return false, errors.New("invalid content table")
	}
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM `+cfg.table+` WHERE id = $1 AND deleted_at IS NULL)`, id).Scan(&exists)
	return exists, err
}

func (r AdminRepository) newsExists(ctx context.Context, id string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM news WHERE id = $1 AND deleted_at IS NULL)`, id).Scan(&exists)
	return exists, err
}

func (r AdminRepository) careerExists(ctx context.Context, id string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM careers WHERE id = $1 AND deleted_at IS NULL)`, id).Scan(&exists)
	return exists, err
}

func (r AdminRepository) contentPath(ctx context.Context, tx pgx.Tx, table string, parentID *string, slug string) (string, int, error) {
	if parentID == nil || strings.TrimSpace(*parentID) == "" {
		return slug, 0, nil
	}

	var parentPath string
	var parentDepth int
	err := tx.QueryRow(ctx, `SELECT full_path, depth FROM `+table+` WHERE id = $1 AND deleted_at IS NULL`, strings.TrimSpace(*parentID)).Scan(&parentPath, &parentDepth)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", 0, ErrNotFound
	}
	if err != nil {
		return "", 0, err
	}
	return strings.Trim(parentPath, "/") + "/" + slug, parentDepth + 1, nil
}

func (r AdminRepository) newsCategoryID(ctx context.Context, tx pgx.Tx, name string) (*string, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return nil, nil
	}
	slug := slugifyText(name)
	if slug == "" {
		return nil, nil
	}
	id := uuid.NewString()
	err := tx.QueryRow(ctx, `
		INSERT INTO news_categories (id, name, slug)
		VALUES ($1, $2, $3)
		ON CONFLICT (slug) WHERE deleted_at IS NULL
		DO UPDATE SET name = EXCLUDED.name, updated_at = now()
		RETURNING id::text
	`, id, name, slug).Scan(&id)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

func scanAdminPage(row rowScanner) (model.Page, int, error) {
	var page model.Page
	var content []byte
	var publishedAt sql.NullTime
	var total int
	err := row.Scan(
		&page.ID,
		&page.Key,
		&page.Title,
		&content,
		&page.Status,
		&publishedAt,
		&page.SEO.Title,
		&page.SEO.Description,
		&page.SEO.Canonical,
		&page.SEO.NoIndex,
		&page.Version,
		&total,
	)
	if err != nil {
		return model.Page{}, 0, err
	}
	if publishedAt.Valid {
		page.PublishedAt = &publishedAt.Time
	}
	if len(content) == 0 || !json.Valid(content) {
		page.Content = json.RawMessage(`{}`)
	} else {
		page.Content = json.RawMessage(content)
	}
	return page, total, nil
}

func scanAdminContent(row rowScanner) (model.ContentNode, int, error) {
	var item model.ContentNode
	var parentID sql.NullString
	var content, galleryBytes, specsBytes []byte
	var publishedAt sql.NullTime
	var total int
	err := row.Scan(
		&item.ID,
		&parentID,
		&item.Slug,
		&item.FullPath,
		&item.Title,
		&item.Summary,
		&content,
		&item.ImageURL,
		&galleryBytes,
		&item.Status,
		&publishedAt,
		&item.SortOrder,
		&item.Depth,
		&item.SEO.Title,
		&item.SEO.Description,
		&item.SEO.Canonical,
		&item.SEO.NoIndex,
		&item.Version,
		&item.DatasheetURL,
		&specsBytes,
		&total,
	)
	if err != nil {
		return model.ContentNode{}, 0, err
	}
	if parentID.Valid {
		item.ParentID = &parentID.String
	}
	if publishedAt.Valid {
		item.PublishedAt = &publishedAt.Time
	}
	if len(content) == 0 || !json.Valid(content) {
		item.Content = json.RawMessage(`{"blocks":[]}`)
	} else {
		item.Content = json.RawMessage(content)
	}
	_ = json.Unmarshal(galleryBytes, &item.Gallery)
	_ = json.Unmarshal(specsBytes, &item.Specs)
	if item.Gallery == nil {
		item.Gallery = []model.MediaAsset{}
	}
	if item.Specs == nil {
		item.Specs = map[string]string{}
	}
	return item, total, nil
}

func upsertPageSEO(ctx context.Context, tx pgx.Tx, pageID string, seo model.SEO) error {
	return upsertSEO(ctx, tx, "page", pageID, seo)
}

func upsertSEO(ctx context.Context, tx pgx.Tx, entityType, entityID string, seo model.SEO) error {
	_, err := tx.Exec(ctx, `
		INSERT INTO seo_meta (entity_type, entity_id, title, description, canonical_url, no_index)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (entity_type, entity_id) WHERE deleted_at IS NULL
		DO UPDATE SET
			title = EXCLUDED.title,
			description = EXCLUDED.description,
			canonical_url = EXCLUDED.canonical_url,
			no_index = EXCLUDED.no_index,
			updated_at = now()
	`, entityType, entityID, seo.Title, seo.Description, seo.Canonical, seo.NoIndex)
	return err
}

type adminContentConfig struct {
	table            string
	entityType       string
	hasProductFields bool
}

func contentConfig(table string) (adminContentConfig, bool) {
	switch table {
	case "services":
		return adminContentConfig{table: "services", entityType: "service"}, true
	case "products":
		return adminContentConfig{table: "products", entityType: "product", hasProductFields: true}, true
	default:
		return adminContentConfig{}, false
	}
}

func nullableString(value *string) any {
	if value == nil || strings.TrimSpace(*value) == "" {
		return nil
	}
	return strings.TrimSpace(*value)
}

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}

func slugifyText(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	var builder strings.Builder
	lastHyphen := false
	for _, r := range value {
		isAlnum := (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9')
		if isAlnum {
			builder.WriteRune(r)
			lastHyphen = false
			continue
		}
		if builder.Len() > 0 && !lastHyphen {
			builder.WriteByte('-')
			lastHyphen = true
		}
	}
	return strings.Trim(builder.String(), "-")
}

func (r AdminRepository) ListSettings(ctx context.Context) ([]model.Setting, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id::text, key, value, version, updated_at
		FROM settings
		WHERE deleted_at IS NULL
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var settings []model.Setting
	for rows.Next() {
		var s model.Setting
		var valueBytes []byte
		if err := rows.Scan(&s.ID, &s.Key, &valueBytes, &s.Version, &s.UpdatedAt); err != nil {
			return nil, err
		}
		s.Value = json.RawMessage(valueBytes)
		settings = append(settings, s)
	}
	return settings, rows.Err()
}

func (r AdminRepository) SettingByKey(ctx context.Context, key string) (model.Setting, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT id::text, key, value, version, updated_at
		FROM settings
		WHERE key = $1 AND deleted_at IS NULL
	`, key)

	var setting model.Setting
	var valueBytes []byte
	if err := row.Scan(&setting.ID, &setting.Key, &valueBytes, &setting.Version, &setting.UpdatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Setting{}, ErrNotFound
		}
		return model.Setting{}, err
	}
	setting.Value = json.RawMessage(valueBytes)
	return setting, nil
}

// SaveSettingWithVersion upserts one setting under optimistic locking:
// expectedVersion 0 means the row must not exist yet.
func (r AdminRepository) SaveSettingWithVersion(ctx context.Context, key string, value json.RawMessage, expectedVersion int, userID string) (model.Setting, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.Setting{}, err
	}
	defer tx.Rollback(ctx)

	var currentVersion int
	err = tx.QueryRow(ctx, `
		SELECT version FROM settings WHERE key = $1 AND deleted_at IS NULL FOR UPDATE
	`, key).Scan(&currentVersion)

	var row pgx.Row
	switch {
	case errors.Is(err, pgx.ErrNoRows):
		if expectedVersion != 0 {
			return model.Setting{}, ErrConflict
		}
		row = tx.QueryRow(ctx, `
			INSERT INTO settings (id, key, value, created_by, updated_by)
			VALUES ($1, $2, $3, $4, $4)
			RETURNING id::text, key, value, version, updated_at
		`, uuid.NewString(), key, []byte(value), userID)
	case err != nil:
		return model.Setting{}, err
	case currentVersion != expectedVersion:
		return model.Setting{}, ErrConflict
	default:
		row = tx.QueryRow(ctx, `
			UPDATE settings
			SET value = $2, updated_by = $3, updated_at = now(), version = version + 1
			WHERE key = $1 AND deleted_at IS NULL
			RETURNING id::text, key, value, version, updated_at
		`, key, []byte(value), userID)
	}

	var setting model.Setting
	var valueBytes []byte
	if err := row.Scan(&setting.ID, &setting.Key, &valueBytes, &setting.Version, &setting.UpdatedAt); err != nil {
		return model.Setting{}, err
	}
	setting.Value = json.RawMessage(valueBytes)
	if err := tx.Commit(ctx); err != nil {
		return model.Setting{}, err
	}
	return setting, nil
}

func (r AdminRepository) SaveSettings(ctx context.Context, settings map[string]json.RawMessage, userID string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for key, value := range settings {
		_, err := tx.Exec(ctx, `
			INSERT INTO settings (id, key, value, created_by, updated_by)
			VALUES ($1, $2, $3, $4, $4)
			ON CONFLICT (key) WHERE deleted_at IS NULL
			DO UPDATE SET value = $3, updated_by = $4, updated_at = now(), version = settings.version + 1
		`, uuid.NewString(), key, []byte(value), userID)
		if err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}

func (r AdminRepository) ListArchivedItems(ctx context.Context, search string) ([]model.ArchivedItem, error) {
	search = strings.TrimSpace(search)
	query := `
		SELECT id::text, title, 'page' AS type, deleted_at, version FROM pages WHERE deleted_at IS NOT NULL AND ($1 = '' OR title ILIKE '%' || $1 || '%')
		UNION ALL
		SELECT id::text, title, 'service' AS type, deleted_at, version FROM services WHERE deleted_at IS NOT NULL AND ($1 = '' OR title ILIKE '%' || $1 || '%')
		UNION ALL
		SELECT id::text, title, 'product' AS type, deleted_at, version FROM products WHERE deleted_at IS NOT NULL AND ($1 = '' OR title ILIKE '%' || $1 || '%')
		UNION ALL
		SELECT id::text, title, 'news' AS type, deleted_at, version FROM news WHERE deleted_at IS NOT NULL AND ($1 = '' OR title ILIKE '%' || $1 || '%')
		UNION ALL
		SELECT id::text, title, 'career' AS type, deleted_at, version FROM careers WHERE deleted_at IS NOT NULL AND ($1 = '' OR title ILIKE '%' || $1 || '%')
		ORDER BY deleted_at DESC
	`
	rows, err := r.pool.Query(ctx, query, search)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []model.ArchivedItem
	for rows.Next() {
		var item model.ArchivedItem
		if err := rows.Scan(&item.ID, &item.Title, &item.Type, &item.DeletedAt, &item.Version); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r AdminRepository) RestoreItem(ctx context.Context, itemType, id string) error {
	var query string
	switch itemType {
	case "page":
		query = `UPDATE pages SET deleted_at = NULL, updated_at = now(), version = version + 1 WHERE id = $1 AND deleted_at IS NOT NULL`
	case "service":
		query = `UPDATE services SET deleted_at = NULL, updated_at = now(), version = version + 1 WHERE id = $1 AND deleted_at IS NOT NULL`
	case "product":
		query = `UPDATE products SET deleted_at = NULL, updated_at = now(), version = version + 1 WHERE id = $1 AND deleted_at IS NOT NULL`
	case "news":
		query = `UPDATE news SET deleted_at = NULL, updated_at = now(), version = version + 1 WHERE id = $1 AND deleted_at IS NOT NULL`
	case "career":
		query = `UPDATE careers SET deleted_at = NULL, updated_at = now(), version = version + 1 WHERE id = $1 AND deleted_at IS NOT NULL`
	default:
		return errors.New("invalid item type")
	}

	result, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrConflict
		}
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (r AdminRepository) HardDeleteItem(ctx context.Context, itemType, id string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var deleteQuery string
	var hasSeo bool
	switch itemType {
	case "page":
		deleteQuery = `DELETE FROM pages WHERE id = $1`
		hasSeo = true
	case "service":
		deleteQuery = `DELETE FROM services WHERE id = $1`
		hasSeo = true
	case "product":
		deleteQuery = `DELETE FROM products WHERE id = $1`
		hasSeo = true
	case "news":
		deleteQuery = `DELETE FROM news WHERE id = $1`
		hasSeo = true
	case "career":
		deleteQuery = `DELETE FROM careers WHERE id = $1`
		hasSeo = false
	default:
		return errors.New("invalid item type")
	}

	if hasSeo {
		_, err = tx.Exec(ctx, `DELETE FROM seo_meta WHERE entity_type = $1 AND entity_id = $2`, itemType, id)
		if err != nil {
			return err
		}
	}

	result, err := tx.Exec(ctx, deleteQuery, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}

	return tx.Commit(ctx)
}


