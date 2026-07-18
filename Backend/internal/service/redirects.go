package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/analytics"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/validator"
)

// resolveCacheTTL keeps the hot path off the database. Ten seconds bounds
// how stale a just-edited redirect can be, and mutations purge eagerly.
const resolveCacheTTL = 10 * time.Second

type resolveEntry struct {
	target   model.RedirectTarget
	found    bool // negative entries shield the DB from slug-scanning floods
	cachedAt time.Time
}

// ScanMeta is the visitor context forwarded by the frontend middleware.
type ScanMeta struct {
	IP        string
	UserAgent string
	Referrer  string
	Language  string
	Country   string
	City      string
}

type RedirectService struct {
	repo      repository.RedirectRepository
	collector *analytics.Collector

	cache sync.Map // slug -> resolveEntry
}

func NewRedirectService(repo repository.RedirectRepository, collector *analytics.Collector) *RedirectService {
	return &RedirectService{repo: repo, collector: collector}
}

// Resolve answers the hot path from memory whenever possible. Expiry is
// re-checked on every hit so a cached entry can never outlive its deadline.
func (s *RedirectService) Resolve(ctx context.Context, slug string) (model.RedirectTarget, error) {
	slug = strings.ToLower(strings.TrimSpace(slug))
	if slug == "" {
		return model.RedirectTarget{}, repository.ErrNotFound
	}

	if cached, ok := s.cache.Load(slug); ok {
		entry := cached.(resolveEntry)
		if time.Since(entry.cachedAt) < resolveCacheTTL {
			if !entry.found {
				return model.RedirectTarget{}, repository.ErrNotFound
			}
			if entry.target.ExpiresAt != nil && time.Now().After(*entry.target.ExpiresAt) {
				return model.RedirectTarget{}, repository.ErrNotFound
			}
			return entry.target, nil
		}
	}

	target, err := s.repo.ResolveSlug(ctx, slug)
	if errors.Is(err, repository.ErrNotFound) {
		s.cache.Store(slug, resolveEntry{found: false, cachedAt: time.Now()})
		return model.RedirectTarget{}, err
	}
	if err != nil {
		return model.RedirectTarget{}, err
	}
	s.cache.Store(slug, resolveEntry{target: target, found: true, cachedAt: time.Now()})
	return target, nil
}

// RecordScan pushes one scan into the analytics pipeline. Non-blocking:
// Enqueue drops on a full buffer rather than ever delaying the redirect.
func (s *RedirectService) RecordScan(slug string, meta ScanMeta) {
	if analytics.IsBot(meta.UserAgent) {
		return
	}
	browser, osName, device := analytics.ParseUserAgent(meta.UserAgent)
	s.collector.Enqueue([]model.AnalyticsEvent{{
		OccurredAt: time.Now().UTC(),
		EventType:  "redirect",
		EventName:  analytics.Clamp(slug, 80),
		VisitorID:  scanVisitorHash(meta.IP, meta.UserAgent),
		Path:       "/" + analytics.Clamp(slug, 80),
		Referrer:   analytics.Clamp(meta.Referrer, 200),
		Source:     analytics.ClassifySource(meta.Referrer, nil),
		Device:     device,
		Browser:    browser,
		OS:         osName,
		Country:    analytics.Clamp(meta.Country, 40),
		City:       analytics.Clamp(meta.City, 60),
		Language:   analytics.Clamp(meta.Language, 12),
	}})
}

// scanVisitorHash gives unique-scan counting without storing the IP: the
// hash is salted with the UTC day, so it cannot be linked across days.
func scanVisitorHash(ip, userAgent string) string {
	sum := sha256.Sum256([]byte(time.Now().UTC().Format("2006-01-02") + "|" + ip + "|" + userAgent))
	return "scan-" + hex.EncodeToString(sum[:12])
}

// --- admin CRUD ---

func (s *RedirectService) List(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.Redirect], error) {
	return s.repo.List(ctx, page, perPage, search, status)
}

func (s *RedirectService) ByID(ctx context.Context, id string) (model.Redirect, error) {
	return s.repo.ByID(ctx, id)
}

func (s *RedirectService) Create(ctx context.Context, input model.RedirectInput, userID string) (model.Redirect, error) {
	input, verr := s.normalizeAndValidate(ctx, input, false)
	if verr.HasErrors() {
		return model.Redirect{}, verr
	}
	redirect, err := s.repo.Create(ctx, input, userID)
	if err == nil {
		s.cache.Delete(redirect.Slug)
	}
	return redirect, err
}

func (s *RedirectService) Update(ctx context.Context, id string, input model.RedirectInput, userID string) (model.Redirect, error) {
	input, verr := s.normalizeAndValidate(ctx, input, true)
	if verr.HasErrors() {
		return model.Redirect{}, verr
	}
	current, err := s.repo.ByID(ctx, id)
	if err != nil {
		return model.Redirect{}, err
	}
	redirect, err := s.repo.Update(ctx, id, input, userID)
	if err == nil {
		s.cache.Delete(current.Slug)
		s.cache.Delete(redirect.Slug)
	}
	return redirect, err
}

func (s *RedirectService) Archive(ctx context.Context, id string, version int) error {
	if version < 1 {
		return validator.New().Add("version", "A valid version is required.")
	}
	slug, err := s.repo.Archive(ctx, id, version)
	if err == nil {
		s.cache.Delete(slug)
	}
	return err
}

func (s *RedirectService) BulkArchive(ctx context.Context, ids []string) (int, error) {
	if len(ids) == 0 || len(ids) > 200 {
		return 0, validator.New().Add("ids", "Select between 1 and 200 redirects.")
	}
	slugs, err := s.repo.BulkArchive(ctx, ids)
	for _, slug := range slugs {
		s.cache.Delete(slug)
	}
	return len(slugs), err
}

// Duplicate copies a redirect as an inactive draft with a derived slug.
func (s *RedirectService) Duplicate(ctx context.Context, id, userID string) (model.Redirect, error) {
	source, err := s.repo.ByID(ctx, id)
	if err != nil {
		return model.Redirect{}, err
	}
	input := model.RedirectInput{
		Name:         source.Name + " (copy)",
		Slug:         source.Slug + "-copy",
		Destination:  source.Destination,
		Description:  source.Description,
		RedirectType: source.RedirectType,
		IsActive:     false,
		ExpiresAt:    source.ExpiresAt,
	}
	for attempt := 2; attempt <= 6; attempt++ {
		redirect, err := s.repo.Create(ctx, input, userID)
		if errors.Is(err, repository.ErrConflict) {
			input.Slug = fmt.Sprintf("%s-copy-%d", source.Slug, attempt)
			continue
		}
		return redirect, err
	}
	return model.Redirect{}, repository.ErrConflict
}

func (s *RedirectService) ExportAll(ctx context.Context) ([]model.Redirect, error) {
	return s.repo.ExportAll(ctx)
}

func (s *RedirectService) ScanStats(ctx context.Context, id string, from, to time.Time) (model.Redirect, model.RedirectScanStats, error) {
	redirect, err := s.repo.ByID(ctx, id)
	if err != nil {
		return model.Redirect{}, model.RedirectScanStats{}, err
	}
	stats, err := s.repo.ScanStats(ctx, redirect.Slug, from, to)
	return redirect, stats, err
}

func (s *RedirectService) Dashboard(ctx context.Context, from, to time.Time) (model.RedirectDashboard, error) {
	return s.repo.Dashboard(ctx, from, to)
}

func (s *RedirectService) normalizeAndValidate(ctx context.Context, input model.RedirectInput, requireVersion bool) (model.RedirectInput, validator.ValidationError) {
	input.Name = strings.TrimSpace(input.Name)
	input.Slug = strings.ToLower(strings.TrimSpace(input.Slug))
	input.Destination = strings.TrimSpace(input.Destination)
	input.Description = strings.TrimSpace(input.Description)

	v := validator.New()
	if !validator.Required(input.Name) {
		v = v.Add("name", "Name is required.")
	}
	if !validator.Slug(input.Slug) {
		v = v.Add("slug", "Slug must use lowercase letters, numbers, and hyphens.")
	} else if model.ReservedRedirectSlugs[input.Slug] || model.IsSystemPageKey(input.Slug) {
		v = v.Add("slug", "This slug is reserved by the website.")
	} else if used, err := s.repo.SlugUsedByPage(ctx, input.Slug); err == nil && used {
		v = v.Add("slug", "This slug is already used by a CMS page.")
	}
	if parsed, err := url.Parse(input.Destination); err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Host == "" {
		v = v.Add("destination", "Destination must be a full http(s) URL.")
	}
	if input.RedirectType != 301 && input.RedirectType != 302 {
		v = v.Add("redirectType", "Redirect type must be 301 or 302.")
	}
	if requireVersion && input.Version < 1 {
		v = v.Add("version", "A valid version is required.")
	}
	return input, v
}
