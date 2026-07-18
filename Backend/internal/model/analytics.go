package model

import (
	"encoding/json"
	"time"
)

// AnalyticsSettingKey stores the analytics feature flags in the settings table.
const AnalyticsSettingKey = "analytics"

// AnalyticsConfig are the feature flags controlling collection.
type AnalyticsConfig struct {
	Enabled       bool `json:"enabled"`
	IgnoreAdmins  bool `json:"ignoreAdmins"`
	RespectDNT    bool `json:"respectDnt"`
	TrackVitals   bool `json:"trackVitals"`
	TrackEvents   bool `json:"trackEvents"`
	RetentionDays int  `json:"retentionDays"`
}

// DefaultAnalyticsConfig mirrors the seed row in migration 005.
func DefaultAnalyticsConfig() AnalyticsConfig {
	return AnalyticsConfig{
		Enabled:       true,
		IgnoreAdmins:  true,
		RespectDNT:    true,
		TrackVitals:   true,
		TrackEvents:   true,
		RetentionDays: 90,
	}
}

// ParseAnalyticsConfig reads the settings value, falling back to defaults for
// missing fields so partially-edited settings stay safe.
func ParseAnalyticsConfig(raw json.RawMessage) AnalyticsConfig {
	cfg := DefaultAnalyticsConfig()
	if len(raw) > 0 {
		_ = json.Unmarshal(raw, &cfg)
	}
	if cfg.RetentionDays < 7 {
		cfg.RetentionDays = 7
	}
	return cfg
}

// AnalyticsEvent is one raw collected event (a row in analytics_events).
type AnalyticsEvent struct {
	OccurredAt time.Time
	EventType  string // pageview | pageleave | event | vital | api | error
	EventName  string
	VisitorID  string
	SessionID  string
	Path       string
	Referrer   string
	Source     string
	Device     string
	Browser    string
	OS         string
	Screen     string
	Country    string
	City       string
	Language   string
	Value      float64
	ScrollPct  int16
	Status     int16
	NewVisitor bool // session bookkeeping only; not stored on the event row
}

// CollectPayload is the wire format the browser tracker sends.
type CollectPayload struct {
	VisitorID  string         `json:"visitorId"`
	SessionID  string         `json:"sessionId"`
	NewVisitor bool           `json:"newVisitor"`
	Device     string         `json:"device"`
	Browser    string         `json:"browser"`
	OS         string         `json:"os"`
	Screen     string         `json:"screen"`
	Language   string         `json:"language"`
	Events     []CollectEvent `json:"events"`
}

type CollectEvent struct {
	Type      string  `json:"type"` // pageview | pageleave | event | vital | error
	Name      string  `json:"name"`
	Path      string  `json:"path"`
	Referrer  string  `json:"referrer"`
	Value     float64 `json:"value"`
	ScrollPct int     `json:"scrollPct"`
	TS        int64   `json:"ts"` // epoch ms (client clock; clamped server-side)
}

// --- reporting DTOs ---

type AnalyticsOverview struct {
	Visitors        int     `json:"visitors"`
	UniqueVisitors  int     `json:"uniqueVisitors"`
	Sessions        int     `json:"sessions"`
	PageViews       int     `json:"pageViews"`
	NewVisitors     int     `json:"newVisitors"`
	ReturningVisits int     `json:"returningVisitors"`
	AvgSessionSec   float64 `json:"avgSessionSec"`
	BounceRate      float64 `json:"bounceRate"` // 0..100
}

type AnalyticsTimePoint struct {
	Bucket   time.Time `json:"bucket"`
	Views    int       `json:"views"`
	Sessions int       `json:"sessions"`
	Visitors int       `json:"visitors"`
}

type AnalyticsBreakdownRow struct {
	Value    string `json:"value"`
	Sessions int    `json:"sessions"`
}

type AnalyticsPageRow struct {
	Path        string  `json:"path"`
	Views       int     `json:"views"`
	UniqueViews int     `json:"uniqueViews"`
	AvgTimeSec  float64 `json:"avgTimeSec"`
	AvgScroll   float64 `json:"avgScroll"`
	Entries     int     `json:"entries"`
	Exits       int     `json:"exits"`
	ExitRate    float64 `json:"exitRate"`   // 0..100
	Engagement  float64 `json:"engagement"` // 0..100
}

type AnalyticsEntryExitRow struct {
	Path     string `json:"path"`
	Sessions int    `json:"sessions"`
}

type AnalyticsEventRow struct {
	Name  string `json:"name"`
	Path  string `json:"path"`
	Count int    `json:"count"`
}

type AnalyticsVitalRow struct {
	Metric  string  `json:"metric"`
	Avg     float64 `json:"avg"`
	Max     float64 `json:"max"`
	Samples int     `json:"samples"`
	Rating  string  `json:"rating"` // good | needs-improvement | poor
}

type AnalyticsSlowPageRow struct {
	Path    string  `json:"path"`
	AvgMs   float64 `json:"avgMs"`
	Samples int     `json:"samples"`
}

type AnalyticsAPIStats struct {
	Requests int     `json:"requests"`
	Errors   int     `json:"errors"`
	AvgMs    float64 `json:"avgMs"`
}

type AnalyticsRealtime struct {
	ActiveVisitors int                     `json:"activeVisitors"`
	Pages          []AnalyticsEntryExitRow `json:"pages"`
	Events         []AnalyticsLiveEvent    `json:"events"`
}

type AnalyticsLiveEvent struct {
	At      time.Time `json:"at"`
	Type    string    `json:"type"`
	Name    string    `json:"name"`
	Path    string    `json:"path"`
	Country string    `json:"country"`
	Device  string    `json:"device"`
}

type AnalyticsAdminActivity struct {
	Logins           int             `json:"logins"`
	FailedLogins     int             `json:"failedLogins"`
	ContentCreated   int             `json:"contentCreated"`
	ContentUpdated   int             `json:"contentUpdated"`
	ContentPublished int             `json:"contentPublished"`
	RecentAudit      []ActivityEntry `json:"recentAudit"`
}

// AnalyticsFilters narrow every report query.
type AnalyticsFilters struct {
	From    time.Time
	To      time.Time
	Device  string
	Country string
	Path    string
	Source  string
}
