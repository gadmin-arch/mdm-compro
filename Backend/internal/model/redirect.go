package model

import "time"

// ReservedRedirectSlugs are path segments the frontend routes to; a short
// link on one of these would shadow (or be shadowed by) a real page.
var ReservedRedirectSlugs = map[string]bool{
	"admin": true, "api": true, "_next": true,
	"home": true, "about": true, "contact": true, "services": true, "products": true,
	"industries": true, "news": true, "career": true, "careers": true, "search": true,
	"login": true, "assets": true, "media": true, "static": true,
	"favicon.ico": true, "robots.txt": true, "sitemap.xml": true,
}

type Redirect struct {
	ID           string     `json:"id"`
	Name         string     `json:"name"`
	Slug         string     `json:"slug"`
	Destination  string     `json:"destination"`
	Description  string     `json:"description"`
	RedirectType int        `json:"redirectType"` // 301 | 302
	IsActive     bool       `json:"isActive"`
	ExpiresAt    *time.Time `json:"expiresAt,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
	Version      int        `json:"version"`
	TotalScans   int        `json:"totalScans"` // lifetime, from redirect_stats
}

type RedirectInput struct {
	Name         string     `json:"name"`
	Slug         string     `json:"slug"`
	Destination  string     `json:"destination"`
	Description  string     `json:"description"`
	RedirectType int        `json:"redirectType"`
	IsActive     bool       `json:"isActive"`
	ExpiresAt    *time.Time `json:"expiresAt"`
	Version      int        `json:"version"`
}

// RedirectTarget is the resolved hot-path answer, cached in memory.
type RedirectTarget struct {
	Slug         string     `json:"slug"`
	Destination  string     `json:"destination"`
	RedirectType int        `json:"redirectType"`
	ExpiresAt    *time.Time `json:"-"`
}

// --- scan analytics DTOs ---

type RedirectScanStats struct {
	TotalScans  int                     `json:"totalScans"`
	UniqueScans int                     `json:"uniqueScans"`
	Trend       []RedirectTrendPoint    `json:"trend"`
	Countries   []AnalyticsBreakdownRow `json:"countries"`
	Devices     []AnalyticsBreakdownRow `json:"devices"`
	Browsers    []AnalyticsBreakdownRow `json:"browsers"`
	OS          []AnalyticsBreakdownRow `json:"os"`
	Referrers   []AnalyticsBreakdownRow `json:"referrers"`
	Recent      []RedirectScan          `json:"recent"`
}

type RedirectTrendPoint struct {
	Bucket  time.Time `json:"bucket"`
	Scans   int       `json:"scans"`
	Uniques int       `json:"uniques"`
}

type RedirectScan struct {
	At       time.Time `json:"at"`
	Country  string    `json:"country"`
	Device   string    `json:"device"`
	Browser  string    `json:"browser"`
	OS       string    `json:"os"`
	Referrer string    `json:"referrer"`
}

type RedirectDashboard struct {
	Top    []RedirectTopRow        `json:"top"`
	Trend  []RedirectTrendPoint    `json:"trend"`
	Recent []RedirectRecentScan    `json:"recent"`
	Geo    []AnalyticsBreakdownRow `json:"geo"`
}

type RedirectTopRow struct {
	Slug   string `json:"slug"`
	Name   string `json:"name"`
	Scans  int    `json:"scans"`
	Active bool   `json:"active"`
}

type RedirectRecentScan struct {
	RedirectScan
	Slug string `json:"slug"`
}
