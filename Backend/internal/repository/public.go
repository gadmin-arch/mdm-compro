package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"strings"

	"github.com/google/uuid"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrConflict = errors.New("conflict")
	ErrNotFound = errors.New("not found")
)

type PublicRepository struct {
	pool *pgxpool.Pool
}

func NewPublicRepository(pool *pgxpool.Pool) PublicRepository {
	return PublicRepository{pool: pool}
}

func likePattern(value string) string {
	replacer := strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)
	return "%" + replacer.Replace(strings.TrimSpace(value)) + "%"
}

func (r PublicRepository) Health(ctx context.Context) error {
	return r.pool.Ping(ctx)
}

func (r PublicRepository) Navigation(ctx context.Context) (model.Navigation, error) {
	services, err := r.ListContentTree(ctx, "services")
	if err != nil {
		return model.Navigation{}, err
	}
	products, err := r.ListContentTree(ctx, "products")
	if err != nil {
		return model.Navigation{}, err
	}
	return model.Navigation{Services: services, Products: products}, nil
}

func (r PublicRepository) SettingValue(ctx context.Context, key string) (json.RawMessage, error) {
	var value []byte
	err := r.pool.QueryRow(ctx, `
		SELECT value
		FROM settings
		WHERE key = $1 AND deleted_at IS NULL
	`, key).Scan(&value)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return json.RawMessage(value), nil
}

func (r PublicRepository) PageByKey(ctx context.Context, key string) (model.Page, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT p.id::text, p.page_key, p.title, p.content, p.status, p.published_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       p.version
		FROM pages p
		LEFT JOIN seo_meta s ON s.entity_type = 'page' AND s.entity_id = p.id AND s.deleted_at IS NULL
		WHERE p.page_key = $1 AND p.deleted_at IS NULL AND p.status = 'published'
		  AND (p.published_at IS NULL OR p.published_at <= now())
	`, key)

	var page model.Page
	var content []byte
	var publishedAt sql.NullTime
	if err := row.Scan(&page.ID, &page.Key, &page.Title, &content, &page.Status, &publishedAt, &page.SEO.Title, &page.SEO.Description, &page.SEO.Canonical, &page.SEO.NoIndex, &page.Version); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Page{}, ErrNotFound
		}
		return model.Page{}, err
	}
	if publishedAt.Valid {
		page.PublishedAt = &publishedAt.Time
	}
	page.Content = json.RawMessage(content)
	return page, nil
}

func (r PublicRepository) ListContentTree(ctx context.Context, table string) ([]model.ContentNode, error) {
	items, err := r.listContent(ctx, table, "")
	if err != nil {
		return nil, err
	}
	return buildTree(items), nil
}

func (r PublicRepository) ListProducts(ctx context.Context, page, perPage int, search, category, sort string) (model.ListResponse[model.ContentNode], error) {
	page, perPage, offset := normalizePagination(page, perPage)

	query := `
		SELECT c.id::text, c.parent_id::text, c.slug, c.full_path, c.title, c.summary, c.content,
		       COALESCE(c.image_url, ''), c.gallery, c.status, c.published_at, c.sort_order, c.depth,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       COALESCE(c.datasheet_url, ''), c.specs, c.version, COUNT(*) OVER()
		FROM products c
		LEFT JOIN seo_meta s ON s.entity_type = 'product' AND s.entity_id = c.id AND s.deleted_at IS NULL
		WHERE c.deleted_at IS NULL AND c.status = 'published'
		  AND (c.published_at IS NULL OR c.published_at <= now())
	`

	args := []any{}
	argCount := 0

	if search != "" {
		argCount++
		query += fmt.Sprintf(" AND (c.title ILIKE $%d ESCAPE '\\' OR c.summary ILIKE $%d ESCAPE '\\' OR c.content::text ILIKE $%d ESCAPE '\\' OR c.specs::text ILIKE $%d ESCAPE '\\')", argCount, argCount, argCount, argCount)
		args = append(args, likePattern(search))
	}

	if category != "" {
		argCount++
		query += fmt.Sprintf(` AND (
			c.specs->>'category' ILIKE $%d OR 
			c.parent_id IN (SELECT id FROM products WHERE slug ILIKE $%d OR full_path ILIKE $%d) OR
			c.slug ILIKE $%d
		)`, argCount, argCount, argCount, argCount)
		args = append(args, category)
	}

	var orderClause string
	switch sort {
	case "oldest":
		orderClause = "c.published_at ASC NULLS LAST, c.created_at ASC"
	case "alpha_asc":
		orderClause = "c.title ASC"
	case "alpha_desc":
		orderClause = "c.title DESC"
	case "featured":
		orderClause = "(c.specs->>'featured')::boolean DESC NULLS LAST, c.published_at DESC NULLS LAST, c.created_at DESC"
	default: // "newest"
		orderClause = "c.published_at DESC NULLS LAST, c.created_at DESC"
	}
	query += " ORDER BY " + orderClause

	argCount++
	query += fmt.Sprintf(" LIMIT $%d", argCount)
	args = append(args, perPage)

	argCount++
	query += fmt.Sprintf(" OFFSET $%d", argCount)
	args = append(args, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return model.ListResponse[model.ContentNode]{}, err
	}
	defer rows.Close()

	var total int
	data := []model.ContentNode{}
	for rows.Next() {
		var item model.ContentNode
		var parentID sql.NullString
		var content, galleryBytes, specsBytes []byte
		var publishedAt sql.NullTime
		var rowTotal int
		if err := rows.Scan(
			&item.ID, &parentID, &item.Slug, &item.FullPath, &item.Title, &item.Summary, &content,
			&item.ImageURL, &galleryBytes, &item.Status, &publishedAt, &item.SortOrder, &item.Depth,
			&item.SEO.Title, &item.SEO.Description, &item.SEO.Canonical, &item.SEO.NoIndex,
			&item.DatasheetURL, &specsBytes, &item.Version, &rowTotal,
		); err != nil {
			return model.ListResponse[model.ContentNode]{}, err
		}
		if parentID.Valid {
			item.ParentID = &parentID.String
		}
		if publishedAt.Valid {
			item.PublishedAt = &publishedAt.Time
		}
		item.Content = json.RawMessage(content)
		_ = json.Unmarshal(galleryBytes, &item.Gallery)
		_ = json.Unmarshal(specsBytes, &item.Specs)
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

func (r PublicRepository) ListServices(ctx context.Context, page, perPage int, search, category, sort string) (model.ListResponse[model.ContentNode], error) {
	page, perPage, offset := normalizePagination(page, perPage)

	query := `
		SELECT c.id::text, c.parent_id::text, c.slug, c.full_path, c.title, c.summary, c.content,
		       COALESCE(c.image_url, ''), c.gallery, c.status, c.published_at, c.sort_order, c.depth,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       ''::text, '{}'::jsonb, c.version, COUNT(*) OVER()
		FROM services c
		LEFT JOIN seo_meta s ON s.entity_type = 'service' AND s.entity_id = c.id AND s.deleted_at IS NULL
		WHERE c.deleted_at IS NULL AND c.status = 'published'
		  AND (c.published_at IS NULL OR c.published_at <= now())
	`

	args := []any{}
	argCount := 0

	if search != "" {
		argCount++
		query += fmt.Sprintf(" AND (c.title ILIKE $%d ESCAPE '\\' OR c.summary ILIKE $%d ESCAPE '\\' OR c.content::text ILIKE $%d ESCAPE '\\')", argCount, argCount, argCount)
		args = append(args, likePattern(search))
	}

	if category != "" {
		argCount++
		query += fmt.Sprintf(` AND (
			c.parent_id IN (SELECT id FROM services WHERE slug ILIKE $%d OR full_path ILIKE $%d) OR
			c.slug ILIKE $%d
		)`, argCount, argCount, argCount)
		args = append(args, category)
	}

	var orderClause string
	switch sort {
	case "oldest":
		orderClause = "c.published_at ASC NULLS LAST, c.created_at ASC"
	case "alpha_asc":
		orderClause = "c.title ASC"
	case "alpha_desc":
		orderClause = "c.title DESC"
	default: // "newest"
		orderClause = "c.published_at DESC NULLS LAST, c.created_at DESC"
	}
	query += " ORDER BY " + orderClause

	argCount++
	query += fmt.Sprintf(" LIMIT $%d", argCount)
	args = append(args, perPage)

	argCount++
	query += fmt.Sprintf(" OFFSET $%d", argCount)
	args = append(args, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return model.ListResponse[model.ContentNode]{}, err
	}
	defer rows.Close()

	var total int
	data := []model.ContentNode{}
	for rows.Next() {
		var item model.ContentNode
		var parentID sql.NullString
		var content, galleryBytes, specsBytes []byte
		var publishedAt sql.NullTime
		var rowTotal int
		var dummyDatasheet string
		if err := rows.Scan(
			&item.ID, &parentID, &item.Slug, &item.FullPath, &item.Title, &item.Summary, &content,
			&item.ImageURL, &galleryBytes, &item.Status, &publishedAt, &item.SortOrder, &item.Depth,
			&item.SEO.Title, &item.SEO.Description, &item.SEO.Canonical, &item.SEO.NoIndex,
			&dummyDatasheet, &specsBytes, &item.Version, &rowTotal,
		); err != nil {
			return model.ListResponse[model.ContentNode]{}, err
		}
		if parentID.Valid {
			item.ParentID = &parentID.String
		}
		if publishedAt.Valid {
			item.PublishedAt = &publishedAt.Time
		}
		item.Content = json.RawMessage(content)
		_ = json.Unmarshal(galleryBytes, &item.Gallery)
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

func (r PublicRepository) ContentByPath(ctx context.Context, table, fullPath string) (model.ContentNode, error) {
	items, err := r.listContent(ctx, table, strings.Trim(fullPath, "/"))
	if err != nil {
		return model.ContentNode{}, err
	}
	if len(items) == 0 {
		return model.ContentNode{}, ErrNotFound
	}
	return items[0], nil
}

func (r PublicRepository) listContent(ctx context.Context, table, fullPath string) ([]model.ContentNode, error) {
	if table != "services" && table != "products" {
		return nil, errors.New("invalid content table")
	}
	query := `
		SELECT c.id::text, c.parent_id::text, c.slug, c.full_path, c.title, c.summary, c.content,
		       COALESCE(c.image_url, ''), c.gallery, c.status, c.published_at, c.sort_order, c.depth,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false)`
	if table == "products" {
		query += `, COALESCE(c.datasheet_url, ''), c.specs`
	} else {
		query += `, ''::text, '{}'::jsonb`
	}
	query += ` FROM ` + table + ` c
		LEFT JOIN seo_meta s ON s.entity_type = $1 AND s.entity_id = c.id AND s.deleted_at IS NULL
		WHERE c.deleted_at IS NULL AND c.status = 'published'
		  AND (c.published_at IS NULL OR c.published_at <= now())`
	args := []any{strings.TrimSuffix(table, "s")}
	if fullPath != "" {
		query += ` AND c.full_path = $2`
		args = append(args, fullPath)
	}
	query += ` ORDER BY c.depth ASC, c.sort_order ASC, c.title ASC`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []model.ContentNode
	for rows.Next() {
		var item model.ContentNode
		var parentID sql.NullString
		var content, galleryBytes, specsBytes []byte
		var publishedAt sql.NullTime
		if err := rows.Scan(&item.ID, &parentID, &item.Slug, &item.FullPath, &item.Title, &item.Summary, &content, &item.ImageURL, &galleryBytes, &item.Status, &publishedAt, &item.SortOrder, &item.Depth, &item.SEO.Title, &item.SEO.Description, &item.SEO.Canonical, &item.SEO.NoIndex, &item.DatasheetURL, &specsBytes); err != nil {
			return nil, err
		}
		if parentID.Valid {
			item.ParentID = &parentID.String
		}
		if publishedAt.Valid {
			item.PublishedAt = &publishedAt.Time
		}
		item.Content = json.RawMessage(content)
		_ = json.Unmarshal(galleryBytes, &item.Gallery)
		_ = json.Unmarshal(specsBytes, &item.Specs)
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r PublicRepository) ListNews(ctx context.Context, page, perPage int, search, category, featured, publishedDate, sort string) (model.ListResponse[model.NewsItem], error) {
	page, perPage, offset := normalizePagination(page, perPage)

	query := `
		SELECT n.id::text, n.slug, n.title, n.excerpt, n.body, COALESCE(c.name, ''), COALESCE(n.featured_image_url, ''),
		       n.featured, n.status, n.published_at, n.scheduled_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       n.version, COUNT(*) OVER()
		FROM news n
		LEFT JOIN news_categories c ON c.id = n.category_id
		LEFT JOIN seo_meta s ON s.entity_type = 'news' AND s.entity_id = n.id AND s.deleted_at IS NULL
		WHERE n.deleted_at IS NULL AND n.status = 'published'
		  AND (n.published_at IS NULL OR n.published_at <= now())
	`

	args := []any{}
	argCount := 0

	if search != "" {
		argCount++
		query += fmt.Sprintf(` AND (
			n.title ILIKE $%d ESCAPE '\' OR 
			n.excerpt ILIKE $%d ESCAPE '\' OR 
			n.body::text ILIKE $%d ESCAPE '\' OR
			EXISTS (
				SELECT 1 FROM news_tags nt 
				JOIN tags t ON t.id = nt.tag_id 
				WHERE nt.news_id = n.id AND (t.name ILIKE $%d ESCAPE '\' OR t.slug ILIKE $%d ESCAPE '\')
			)
		)`, argCount, argCount, argCount, argCount, argCount)
		args = append(args, likePattern(search))
	}

	if category != "" {
		argCount++
		query += fmt.Sprintf(" AND c.id IS NOT NULL AND (c.slug = $%d OR c.name ILIKE $%d)", argCount, argCount)
		args = append(args, category)
	}

	if featured != "" {
		argCount++
		query += fmt.Sprintf(" AND n.featured = $%d::boolean", argCount)
		args = append(args, featured == "true")
	}

	if publishedDate != "" {
		argCount++
		query += fmt.Sprintf(" AND to_char(n.published_at, 'YYYY-MM-DD') LIKE $%d || '%%'", argCount)
		args = append(args, publishedDate)
	}

	var orderClause string
	switch sort {
	case "oldest":
		orderClause = "n.published_at ASC NULLS LAST, n.created_at ASC"
	case "alpha_asc":
		orderClause = "n.title ASC"
	case "alpha_desc":
		orderClause = "n.title DESC"
	case "featured":
		orderClause = "n.featured DESC, n.published_at DESC NULLS LAST, n.created_at DESC"
	default: // "newest"
		orderClause = "n.published_at DESC NULLS LAST, n.created_at DESC"
	}
	query += " ORDER BY " + orderClause

	argCount++
	query += fmt.Sprintf(" LIMIT $%d", argCount)
	args = append(args, perPage)

	argCount++
	query += fmt.Sprintf(" OFFSET $%d", argCount)
	args = append(args, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return model.ListResponse[model.NewsItem]{}, err
	}
	defer rows.Close()

	var total int
	data := []model.NewsItem{}
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

func (r PublicRepository) NewsBySlug(ctx context.Context, slug string) (model.NewsItem, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT n.id::text, n.slug, n.title, n.excerpt, n.body, COALESCE(c.name, ''), COALESCE(n.featured_image_url, ''),
		       n.featured, n.status, n.published_at, n.scheduled_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       n.version, 1
		FROM news n
		LEFT JOIN news_categories c ON c.id = n.category_id
		LEFT JOIN seo_meta s ON s.entity_type = 'news' AND s.entity_id = n.id AND s.deleted_at IS NULL
		WHERE n.slug = $1 AND n.deleted_at IS NULL AND n.status = 'published'
		  AND (n.published_at IS NULL OR n.published_at <= now())
	`, slug)
	item, _, err := scanNews(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.NewsItem{}, ErrNotFound
	}
	return item, err
}

func (r PublicRepository) ListCareers(ctx context.Context, page, perPage int, search, location, department, empType, sort string) (model.ListResponse[model.Career], error) {
	page, perPage, offset := normalizePagination(page, perPage)

	query := `
		SELECT id::text, slug, title, summary, description, department, location, employment_type, COALESCE(apply_url, ''),
		       deadline, status, published_at, version, COUNT(*) OVER()
		FROM careers
		WHERE deleted_at IS NULL AND status = 'published'
		  AND (published_at IS NULL OR published_at <= now())
	`

	args := []any{}
	argCount := 0

	if search != "" {
		argCount++
		query += fmt.Sprintf(" AND (title ILIKE $%d ESCAPE '\\' OR summary ILIKE $%d ESCAPE '\\' OR description::text ILIKE $%d ESCAPE '\\' OR department ILIKE $%d ESCAPE '\\' OR location ILIKE $%d ESCAPE '\\')", argCount, argCount, argCount, argCount, argCount)
		args = append(args, likePattern(search))
	}

	if location != "" {
		argCount++
		query += fmt.Sprintf(" AND location ILIKE $%d", argCount)
		args = append(args, "%"+location+"%")
	}

	if department != "" {
		argCount++
		query += fmt.Sprintf(" AND department ILIKE $%d", argCount)
		args = append(args, "%"+department+"%")
	}

	if empType != "" {
		argCount++
		query += fmt.Sprintf(" AND employment_type = $%d", argCount)
		args = append(args, empType)
	}

	var orderClause string
	switch sort {
	case "oldest":
		orderClause = "published_at ASC NULLS LAST, created_at ASC"
	case "alpha_asc":
		orderClause = "title ASC"
	case "alpha_desc":
		orderClause = "title DESC"
	default: // "newest"
		orderClause = "published_at DESC NULLS LAST, created_at DESC"
	}
	query += " ORDER BY " + orderClause

	argCount++
	query += fmt.Sprintf(" LIMIT $%d", argCount)
	args = append(args, perPage)

	argCount++
	query += fmt.Sprintf(" OFFSET $%d", argCount)
	args = append(args, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return model.ListResponse[model.Career]{}, err
	}
	defer rows.Close()

	var total int
	data := []model.Career{}
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

func (r PublicRepository) ListPages(ctx context.Context, page, perPage int, search, category, sort string) (model.ListResponse[model.Page], error) {
	page, perPage, offset := normalizePagination(page, perPage)

	query := `
		SELECT p.id::text, p.page_key, p.title, p.content, p.status, p.published_at,
		       COALESCE(s.title, ''), COALESCE(s.description, ''), COALESCE(s.canonical_url, ''), COALESCE(s.no_index, false),
		       p.version, COUNT(*) OVER()
		FROM pages p
		LEFT JOIN seo_meta s ON s.entity_type = 'page' AND s.entity_id = p.id AND s.deleted_at IS NULL
		WHERE p.deleted_at IS NULL AND p.status = 'published'
		  AND (p.published_at IS NULL OR p.published_at <= now())
	`

	args := []any{}
	argCount := 0

	if search != "" {
		argCount++
		query += fmt.Sprintf(" AND (p.title ILIKE $%d ESCAPE '\\' OR p.content::text ILIKE $%d ESCAPE '\\')", argCount, argCount)
		args = append(args, likePattern(search))
	}

	if category != "" {
		argCount++
		query += fmt.Sprintf(" AND p.content->>'category' = $%d", argCount)
		args = append(args, category)
	}

	var orderClause string
	switch sort {
	case "oldest":
		orderClause = "p.published_at ASC NULLS LAST, p.created_at ASC"
	case "alpha_asc":
		orderClause = "p.title ASC"
	case "alpha_desc":
		orderClause = "p.title DESC"
	default: // "newest"
		orderClause = "p.published_at DESC NULLS LAST, p.created_at DESC"
	}
	query += " ORDER BY " + orderClause

	argCount++
	query += fmt.Sprintf(" LIMIT $%d", argCount)
	args = append(args, perPage)

	argCount++
	query += fmt.Sprintf(" OFFSET $%d", argCount)
	args = append(args, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return model.ListResponse[model.Page]{}, err
	}
	defer rows.Close()

	var total int
	data := []model.Page{}
	for rows.Next() {
		var item model.Page
		var contentBytes []byte
		var publishedAt sql.NullTime
		var rowTotal int
		if err := rows.Scan(
			&item.ID, &item.Key, &item.Title, &contentBytes, &item.Status, &publishedAt,
			&item.SEO.Title, &item.SEO.Description, &item.SEO.Canonical, &item.SEO.NoIndex,
			&item.Version, &rowTotal,
		); err != nil {
			return model.ListResponse[model.Page]{}, err
		}
		if publishedAt.Valid {
			item.PublishedAt = &publishedAt.Time
		}
		item.Content = json.RawMessage(contentBytes)
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

func (r PublicRepository) CareerBySlug(ctx context.Context, slug string) (model.Career, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT id::text, slug, title, summary, description, department, location, employment_type, COALESCE(apply_url, ''),
		       deadline, status, published_at, version, 1
		FROM careers
		WHERE slug = $1 AND deleted_at IS NULL AND status = 'published'
		  AND (published_at IS NULL OR published_at <= now())
	`, slug)
	item, _, err := scanCareer(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.Career{}, ErrNotFound
	}
	return item, err
}

func (r PublicRepository) CreateContact(ctx context.Context, input model.ContactInput) (model.ContactInquiry, error) {
	var inquiry model.ContactInquiry
	err := r.pool.QueryRow(ctx, `
		INSERT INTO contacts (id, name, email, phone, company, subject, message, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
		RETURNING id::text, name, email, COALESCE(phone, ''), COALESCE(company, ''), subject, message, status, created_at
	`, uuid.NewString(), input.Name, input.Email, input.Phone, input.Company, input.Subject, input.Message).
		Scan(&inquiry.ID, &inquiry.Name, &inquiry.Email, &inquiry.Phone, &inquiry.Company, &inquiry.Subject, &inquiry.Message, &inquiry.Status, &inquiry.CreatedAt)
	return inquiry, err
}

func buildTree(items []model.ContentNode) []model.ContentNode {
	byID := map[string]*model.ContentNode{}
	for i := range items {
		items[i].Children = []model.ContentNode{}
		byID[items[i].ID] = &items[i]
	}
	var roots []model.ContentNode
	for i := range items {
		item := &items[i]
		if item.ParentID == nil {
			roots = append(roots, *item)
			continue
		}
		if parent, ok := byID[*item.ParentID]; ok {
			parent.Children = append(parent.Children, *item)
		}
	}
	return roots
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanNews(row rowScanner) (model.NewsItem, int, error) {
	var item model.NewsItem
	var body []byte
	var publishedAt, scheduledAt sql.NullTime
	var total int
	err := row.Scan(&item.ID, &item.Slug, &item.Title, &item.Excerpt, &body, &item.Category, &item.FeaturedImageURL, &item.Featured, &item.Status, &publishedAt, &scheduledAt, &item.SEO.Title, &item.SEO.Description, &item.SEO.Canonical, &item.SEO.NoIndex, &item.Version, &total)
	if err != nil {
		return model.NewsItem{}, 0, err
	}
	if publishedAt.Valid {
		item.PublishedAt = &publishedAt.Time
	}
	if scheduledAt.Valid {
		item.ScheduledAt = &scheduledAt.Time
	}
	item.Body = json.RawMessage(body)
	return item, total, nil
}

func scanCareer(row rowScanner) (model.Career, int, error) {
	var item model.Career
	var description []byte
	var deadline, publishedAt sql.NullTime
	var total int
	err := row.Scan(&item.ID, &item.Slug, &item.Title, &item.Summary, &description, &item.Department, &item.Location, &item.EmploymentType, &item.ApplyURL, &deadline, &item.Status, &publishedAt, &item.Version, &total)
	if err != nil {
		return model.Career{}, 0, err
	}
	if deadline.Valid {
		item.Deadline = &deadline.Time
	}
	if publishedAt.Valid {
		item.PublishedAt = &publishedAt.Time
	}
	item.Description = json.RawMessage(description)
	return item, total, nil
}

func normalizePagination(page, perPage int) (int, int, int) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 10
	}
	return page, perPage, (page - 1) * perPage
}

func totalPages(total, perPage int) int {
	if total == 0 {
		return 0
	}
	return int(math.Ceil(float64(total) / float64(perPage)))
}
