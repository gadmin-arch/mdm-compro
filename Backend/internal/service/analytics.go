package service

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
)

// reportCacheTTL keeps dashboard queries off the database while an admin has
// the page open; aggregates are at most a minute behind anyway.
const reportCacheTTL = 60 * time.Second

type analyticsCacheEntry struct {
	value   any
	expires time.Time
}

type AnalyticsService struct {
	repo repository.AnalyticsRepository

	mu    sync.Mutex
	cache map[string]analyticsCacheEntry
}

func NewAnalyticsService(repo repository.AnalyticsRepository) *AnalyticsService {
	return &AnalyticsService{repo: repo, cache: make(map[string]analyticsCacheEntry)}
}

// AnalyticsDashboard is the single payload backing the admin dashboard: one
// request, one cache entry.
type AnalyticsDashboard struct {
	Overview     model.AnalyticsOverview                  `json:"overview"`
	Previous     model.AnalyticsOverview                  `json:"previous"`
	TimeSeries   []model.AnalyticsTimePoint               `json:"timeSeries"`
	Interval     string                                   `json:"interval"`
	Breakdowns   map[string][]model.AnalyticsBreakdownRow `json:"breakdowns"`
	Pages        []model.AnalyticsPageRow                 `json:"pages"`
	EntryPages   []model.AnalyticsEntryExitRow            `json:"entryPages"`
	ExitPages    []model.AnalyticsEntryExitRow            `json:"exitPages"`
	Events       []model.AnalyticsEventRow                `json:"events"`
	Vitals       []model.AnalyticsVitalRow                `json:"vitals"`
	SlowPages    []model.AnalyticsSlowPageRow             `json:"slowPages"`
	API          model.AnalyticsAPIStats                  `json:"api"`
	ClientErrors int                                      `json:"clientErrors"`
	From         time.Time                                `json:"from"`
	To           time.Time                                `json:"to"`
}

func (s *AnalyticsService) cached(key string, load func() (any, error)) (any, error) {
	s.mu.Lock()
	entry, ok := s.cache[key]
	s.mu.Unlock()
	if ok && time.Now().Before(entry.expires) {
		return entry.value, nil
	}
	value, err := load()
	if err != nil {
		return nil, err
	}
	s.mu.Lock()
	// Opportunistic pruning keeps the map from growing with one-off keys.
	if len(s.cache) > 256 {
		for k, v := range s.cache {
			if time.Now().After(v.expires) {
				delete(s.cache, k)
			}
		}
	}
	s.cache[key] = analyticsCacheEntry{value: value, expires: time.Now().Add(reportCacheTTL)}
	s.mu.Unlock()
	return value, nil
}

func filterKey(f model.AnalyticsFilters, extra string) string {
	return fmt.Sprintf("%d|%d|%s|%s|%s|%s|%s", f.From.Unix(), f.To.Unix(), f.Device, f.Country, f.Path, f.Source, extra)
}

func (s *AnalyticsService) Dashboard(ctx context.Context, f model.AnalyticsFilters, interval string) (AnalyticsDashboard, error) {
	value, err := s.cached(filterKey(f, "dash|"+interval), func() (any, error) {
		return s.buildDashboard(ctx, f, interval)
	})
	if err != nil {
		return AnalyticsDashboard{}, err
	}
	return value.(AnalyticsDashboard), nil
}

func (s *AnalyticsService) buildDashboard(ctx context.Context, f model.AnalyticsFilters, interval string) (AnalyticsDashboard, error) {
	dash := AnalyticsDashboard{Interval: interval, From: f.From, To: f.To, Breakdowns: map[string][]model.AnalyticsBreakdownRow{}}

	overview, err := s.repo.Overview(ctx, f)
	if err != nil {
		return dash, err
	}
	dash.Overview = overview

	// Same-length window immediately before the range, for trend deltas.
	previous := f
	span := f.To.Sub(f.From)
	previous.To = f.From
	previous.From = f.From.Add(-span)
	if prev, err := s.repo.Overview(ctx, previous); err == nil {
		dash.Previous = prev
	}

	if dash.TimeSeries, err = s.repo.TimeSeries(ctx, f, interval); err != nil {
		return dash, err
	}
	for _, dim := range []string{"source", "device", "browser", "os", "screen", "country", "city", "language"} {
		rows, err := s.repo.Breakdown(ctx, f, dim)
		if err != nil {
			return dash, err
		}
		dash.Breakdowns[dim] = rows
	}

	pages, err := s.repo.Pages(ctx, f, 50)
	if err != nil {
		return dash, err
	}
	if dash.EntryPages, err = s.repo.EntryExit(ctx, f, "first_path", 10); err != nil {
		return dash, err
	}
	if dash.ExitPages, err = s.repo.EntryExit(ctx, f, "last_path", 10); err != nil {
		return dash, err
	}

	// Fold exits into the page rows, then score engagement.
	exits := map[string]int{}
	for _, row := range dash.ExitPages {
		exits[row.Path] = row.Sessions
	}
	entries := map[string]int{}
	for _, row := range dash.EntryPages {
		entries[row.Path] = row.Sessions
	}
	for i := range pages {
		page := &pages[i]
		page.Exits = exits[page.Path]
		page.Entries = entries[page.Path]
		if page.Views > 0 {
			page.ExitRate = float64(page.Exits) / float64(page.Views) * 100
			if page.ExitRate > 100 {
				page.ExitRate = 100
			}
		}
		page.Engagement = engagementScore(page.AvgTimeSec, page.AvgScroll, page.ExitRate)
	}
	dash.Pages = pages

	if dash.Events, err = s.repo.Events(ctx, f, 50); err != nil {
		return dash, err
	}
	vitals, err := s.repo.Vitals(ctx, f)
	if err != nil {
		return dash, err
	}
	for i := range vitals {
		vitals[i].Rating = vitalRating(vitals[i].Metric, vitals[i].Avg)
	}
	dash.Vitals = vitals
	if dash.SlowPages, err = s.repo.SlowPages(ctx, f, 10); err != nil {
		return dash, err
	}
	if dash.API, dash.ClientErrors, err = s.repo.APIStats(ctx, f); err != nil {
		return dash, err
	}
	return dash, nil
}

func (s *AnalyticsService) AdminActivity(ctx context.Context, f model.AnalyticsFilters) (model.AnalyticsAdminActivity, error) {
	value, err := s.cached(filterKey(f, "admin"), func() (any, error) {
		return s.repo.AdminActivity(ctx, f)
	})
	if err != nil {
		return model.AnalyticsAdminActivity{}, err
	}
	return value.(model.AnalyticsAdminActivity), nil
}

type AnalyticsFilterOptions struct {
	Paths     []string `json:"paths"`
	Countries []string `json:"countries"`
}

func (s *AnalyticsService) FilterOptions(ctx context.Context) (AnalyticsFilterOptions, error) {
	value, err := s.cached("filter-options", func() (any, error) {
		since := time.Now().AddDate(0, -3, 0)
		paths, err := s.repo.PathOptions(ctx, since)
		if err != nil {
			return nil, err
		}
		countries, err := s.repo.CountryOptions(ctx, since)
		if err != nil {
			return nil, err
		}
		return AnalyticsFilterOptions{Paths: paths, Countries: countries}, nil
	})
	if err != nil {
		return AnalyticsFilterOptions{}, err
	}
	return value.(AnalyticsFilterOptions), nil
}

// engagementScore blends dwell time (40%), scroll depth (30%), and staying on
// the site (30%) into a 0–100 score. 3 minutes on page = full time credit.
func engagementScore(avgTimeSec, avgScroll, exitRate float64) float64 {
	timeScore := avgTimeSec / 180
	if timeScore > 1 {
		timeScore = 1
	}
	scrollScore := avgScroll / 100
	if scrollScore > 1 {
		scrollScore = 1
	}
	stayScore := 1 - exitRate/100
	if stayScore < 0 {
		stayScore = 0
	}
	score := timeScore*40 + scrollScore*30 + stayScore*30
	return float64(int(score*10)) / 10
}

// vitalRating applies the Core Web Vitals thresholds to the average value.
func vitalRating(metric string, avg float64) string {
	type band struct{ good, poor float64 }
	bands := map[string]band{
		"LCP":  {2500, 4000},
		"INP":  {200, 500},
		"CLS":  {0.1, 0.25},
		"FCP":  {1800, 3000},
		"TTFB": {800, 1800},
		"load": {3000, 6000},
	}
	b, ok := bands[metric]
	if !ok {
		return ""
	}
	switch {
	case avg <= b.good:
		return "good"
	case avg <= b.poor:
		return "needs-improvement"
	default:
		return "poor"
	}
}
