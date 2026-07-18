package handler

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/analytics"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/service"
	"github.com/xuri/excelize/v2"
)

const (
	maxCollectBody   = 64 << 10 // 64KB per beacon
	maxEventsPerHit  = 50
	clockSkewAllowed = 10 * time.Minute
)

type AnalyticsHandler struct {
	collector *analytics.Collector
	service   *service.AnalyticsService
	ownHosts  []string
}

func NewAnalyticsHandler(collector *analytics.Collector, svc *service.AnalyticsService, siteURL string) AnalyticsHandler {
	hosts := []string{}
	if parsed, err := url.Parse(siteURL); err == nil && parsed.Hostname() != "" {
		hosts = append(hosts, strings.TrimPrefix(strings.ToLower(parsed.Hostname()), "www."))
	}
	return AnalyticsHandler{collector: collector, service: svc, ownHosts: hosts}
}

// Collect ingests a batch of events from the browser tracker. It answers 202
// before any database work happens — the collector buffers asynchronously.
func (h AnalyticsHandler) Collect(w http.ResponseWriter, r *http.Request) {
	cfg := h.collector.Config(r.Context())
	if !cfg.Enabled {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if analytics.IsBot(r.UserAgent()) {
		w.WriteHeader(http.StatusAccepted)
		return
	}
	// Defense in depth: the tracker already skips admins, but a logged-in
	// admin browsing the public site still carries the session cookie.
	if cfg.IgnoreAdmins {
		if cookie, err := r.Cookie("cms_admin_token"); err == nil && cookie.Value != "" {
			w.WriteHeader(http.StatusAccepted)
			return
		}
	}
	if cfg.RespectDNT && (r.Header.Get("DNT") == "1" || r.Header.Get("Sec-GPC") == "1") {
		w.WriteHeader(http.StatusAccepted)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxCollectBody)
	var payload model.CollectPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Body must be valid JSON.")
		return
	}
	if payload.VisitorID == "" || payload.SessionID == "" || len(payload.Events) == 0 {
		w.WriteHeader(http.StatusAccepted)
		return
	}
	if len(payload.Events) > maxEventsPerHit {
		payload.Events = payload.Events[:maxEventsPerHit]
	}

	now := time.Now().UTC()
	country := geoHeader(r, "CF-IPCountry", "X-Vercel-IP-Country", "X-Country-Code")
	city := geoHeader(r, "CF-IPCity", "X-Vercel-IP-City", "X-City")
	ownHosts := append([]string{strings.TrimPrefix(strings.ToLower(hostOnly(r.Host)), "www.")}, h.ownHosts...)

	events := make([]model.AnalyticsEvent, 0, len(payload.Events))
	for _, raw := range payload.Events {
		if !analytics.ValidEventType(raw.Type) {
			continue
		}
		if raw.Type == "vital" && !cfg.TrackVitals {
			continue
		}
		if raw.Type == "event" && !cfg.TrackEvents {
			continue
		}
		occurred := now
		if raw.TS > 0 {
			ts := time.UnixMilli(raw.TS).UTC()
			if diff := now.Sub(ts); diff > -clockSkewAllowed && diff < clockSkewAllowed {
				occurred = ts
			}
		}
		scroll := raw.ScrollPct
		if scroll < 0 {
			scroll = 0
		}
		if scroll > 100 {
			scroll = 100
		}
		events = append(events, model.AnalyticsEvent{
			OccurredAt: occurred,
			EventType:  raw.Type,
			EventName:  analytics.Clamp(raw.Name, 80),
			VisitorID:  analytics.Clamp(payload.VisitorID, 64),
			SessionID:  analytics.Clamp(payload.SessionID, 64),
			Path:       analytics.NormalizePath(raw.Path),
			Referrer:   analytics.Clamp(raw.Referrer, 200),
			Source:     analytics.ClassifySource(raw.Referrer, ownHosts),
			Device:     analytics.SanitizeDevice(payload.Device),
			Browser:    analytics.Clamp(payload.Browser, 40),
			OS:         analytics.Clamp(payload.OS, 40),
			Screen:     analytics.Clamp(payload.Screen, 20),
			Country:    analytics.Clamp(country, 40),
			City:       analytics.Clamp(city, 60),
			Language:   analytics.Clamp(payload.Language, 12),
			Value:      raw.Value,
			ScrollPct:  int16(scroll),
			NewVisitor: payload.NewVisitor,
		})
	}
	h.collector.Enqueue(events)
	w.WriteHeader(http.StatusAccepted)
}

// Config tells the tracker whether (and what) to collect.
func (h AnalyticsHandler) Config(w http.ResponseWriter, r *http.Request) {
	cfg := h.collector.Config(r.Context())
	w.Header().Set("Cache-Control", "public, max-age=60")
	JSON(w, http.StatusOK, cfg)
}

func geoHeader(r *http.Request, names ...string) string {
	for _, name := range names {
		if value := strings.TrimSpace(r.Header.Get(name)); value != "" && !strings.EqualFold(value, "xx") {
			return value
		}
	}
	return ""
}

func hostOnly(host string) string {
	if i := strings.LastIndex(host, ":"); i > 0 {
		return host[:i]
	}
	return host
}

// --- admin reporting ---

func parseAnalyticsFilters(r *http.Request) model.AnalyticsFilters {
	query := r.URL.Query()
	parseDay := func(value string, fallback time.Time) time.Time {
		if t, err := time.Parse("2006-01-02", value); err == nil {
			return t.UTC()
		}
		if t, err := time.Parse(time.RFC3339, value); err == nil {
			return t.UTC()
		}
		return fallback
	}
	now := time.Now().UTC()
	from := parseDay(query.Get("from"), now.AddDate(0, 0, -29).Truncate(24*time.Hour))
	// "to" is inclusive as a date: extend to the end of that day.
	to := parseDay(query.Get("to"), now.Truncate(24*time.Hour)).Add(24 * time.Hour)
	if !to.After(from) {
		to = from.Add(24 * time.Hour)
	}
	path := strings.TrimSpace(query.Get("page"))
	if path != "" {
		path = analytics.NormalizePath(path)
	}
	return model.AnalyticsFilters{
		From:    from,
		To:      to,
		Device:  analytics.Clamp(query.Get("device"), 20),
		Country: analytics.Clamp(query.Get("country"), 40),
		Path:    path,
		Source:  analytics.Clamp(query.Get("source"), 20),
	}
}

func (h AnalyticsHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	filters := parseAnalyticsFilters(r)
	interval := r.URL.Query().Get("interval")
	dash, err := h.service.Dashboard(r.Context(), filters, interval)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, dash)
}

func (h AnalyticsHandler) Realtime(w http.ResponseWriter, r *http.Request) {
	JSON(w, http.StatusOK, h.collector.Realtime())
}

func (h AnalyticsHandler) AdminActivity(w http.ResponseWriter, r *http.Request) {
	activity, err := h.service.AdminActivity(r.Context(), parseAnalyticsFilters(r))
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, activity)
}

func (h AnalyticsHandler) FilterOptions(w http.ResponseWriter, r *http.Request) {
	options, err := h.service.FilterOptions(r.Context())
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, options)
}

// Export streams the current dashboard as CSV (one report) or XLSX (workbook
// with every report as a sheet). PDF is produced client-side via the print
// view — no server dependency needed.
func (h AnalyticsHandler) Export(w http.ResponseWriter, r *http.Request) {
	filters := parseAnalyticsFilters(r)
	dash, err := h.service.Dashboard(r.Context(), filters, r.URL.Query().Get("interval"))
	if err != nil {
		HandleError(w, err)
		return
	}
	stamp := fmt.Sprintf("%s_%s", filters.From.Format("20060102"), filters.To.Add(-24*time.Hour).Format("20060102"))

	switch r.URL.Query().Get("format") {
	case "xlsx":
		h.exportXLSX(w, dash, stamp)
	default:
		h.exportCSV(w, r.URL.Query().Get("report"), dash, stamp)
	}
}

func (h AnalyticsHandler) exportCSV(w http.ResponseWriter, report string, dash service.AnalyticsDashboard, stamp string) {
	if report == "" {
		report = "summary"
	}
	w.Header().Set("Content-Type", "text/csv; charset=utf-8")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="analytics-%s-%s.csv"`, report, stamp))
	writer := csv.NewWriter(w)
	defer writer.Flush()

	switch report {
	case "timeseries":
		_ = writer.Write([]string{"bucket", "views", "sessions", "visitors"})
		for _, p := range dash.TimeSeries {
			_ = writer.Write([]string{p.Bucket.Format(time.RFC3339), strconv.Itoa(p.Views), strconv.Itoa(p.Sessions), strconv.Itoa(p.Visitors)})
		}
	case "pages":
		_ = writer.Write([]string{"path", "views", "unique_views", "avg_time_sec", "avg_scroll_pct", "entries", "exits", "exit_rate_pct", "engagement"})
		for _, p := range dash.Pages {
			_ = writer.Write([]string{p.Path, strconv.Itoa(p.Views), strconv.Itoa(p.UniqueViews),
				fmt.Sprintf("%.1f", p.AvgTimeSec), fmt.Sprintf("%.1f", p.AvgScroll),
				strconv.Itoa(p.Entries), strconv.Itoa(p.Exits), fmt.Sprintf("%.1f", p.ExitRate), fmt.Sprintf("%.1f", p.Engagement)})
		}
	case "events":
		_ = writer.Write([]string{"event", "count"})
		for _, e := range dash.Events {
			_ = writer.Write([]string{e.Name, strconv.Itoa(e.Count)})
		}
	case "breakdowns":
		_ = writer.Write([]string{"dimension", "value", "sessions"})
		for dim, rows := range dash.Breakdowns {
			for _, row := range rows {
				_ = writer.Write([]string{dim, row.Value, strconv.Itoa(row.Sessions)})
			}
		}
	default: // summary
		_ = writer.Write([]string{"metric", "value"})
		o := dash.Overview
		_ = writer.Write([]string{"unique_visitors", strconv.Itoa(o.UniqueVisitors)})
		_ = writer.Write([]string{"sessions", strconv.Itoa(o.Sessions)})
		_ = writer.Write([]string{"page_views", strconv.Itoa(o.PageViews)})
		_ = writer.Write([]string{"new_visitors", strconv.Itoa(o.NewVisitors)})
		_ = writer.Write([]string{"returning_visitors", strconv.Itoa(o.ReturningVisits)})
		_ = writer.Write([]string{"avg_session_sec", fmt.Sprintf("%.1f", o.AvgSessionSec)})
		_ = writer.Write([]string{"bounce_rate_pct", fmt.Sprintf("%.1f", o.BounceRate)})
		_ = writer.Write([]string{"api_requests", strconv.Itoa(dash.API.Requests)})
		_ = writer.Write([]string{"api_errors", strconv.Itoa(dash.API.Errors)})
		_ = writer.Write([]string{"api_avg_ms", fmt.Sprintf("%.1f", dash.API.AvgMs)})
		_ = writer.Write([]string{"client_errors", strconv.Itoa(dash.ClientErrors)})
	}
}

func (h AnalyticsHandler) exportXLSX(w http.ResponseWriter, dash service.AnalyticsDashboard, stamp string) {
	file := excelize.NewFile()
	defer file.Close()

	writeSheet := func(name string, header []string, rows [][]any) {
		index, _ := file.NewSheet(name)
		_ = index
		for col, title := range header {
			cell, _ := excelize.CoordinatesToCellName(col+1, 1)
			_ = file.SetCellValue(name, cell, title)
		}
		for i, row := range rows {
			for col, value := range row {
				cell, _ := excelize.CoordinatesToCellName(col+1, i+2)
				_ = file.SetCellValue(name, cell, value)
			}
		}
	}

	o := dash.Overview
	writeSheet("Overview", []string{"Metric", "Value"}, [][]any{
		{"Unique Visitors", o.UniqueVisitors}, {"Sessions", o.Sessions}, {"Page Views", o.PageViews},
		{"New Visitors", o.NewVisitors}, {"Returning Visitors", o.ReturningVisits},
		{"Avg Session (sec)", o.AvgSessionSec}, {"Bounce Rate (%)", o.BounceRate},
		{"API Requests", dash.API.Requests}, {"API Errors", dash.API.Errors},
		{"API Avg (ms)", dash.API.AvgMs}, {"Client Errors", dash.ClientErrors},
	})

	tsRows := make([][]any, 0, len(dash.TimeSeries))
	for _, p := range dash.TimeSeries {
		tsRows = append(tsRows, []any{p.Bucket.Format("2006-01-02 15:04"), p.Views, p.Sessions, p.Visitors})
	}
	writeSheet("Traffic", []string{"Bucket", "Views", "Sessions", "Visitors"}, tsRows)

	pageRows := make([][]any, 0, len(dash.Pages))
	for _, p := range dash.Pages {
		pageRows = append(pageRows, []any{p.Path, p.Views, p.UniqueViews, p.AvgTimeSec, p.AvgScroll, p.Entries, p.Exits, p.ExitRate, p.Engagement})
	}
	writeSheet("Pages", []string{"Path", "Views", "Unique", "Avg Time (s)", "Avg Scroll (%)", "Entries", "Exits", "Exit Rate (%)", "Engagement"}, pageRows)

	for _, dim := range []string{"source", "device", "browser", "os", "country", "language"} {
		rows := make([][]any, 0)
		for _, row := range dash.Breakdowns[dim] {
			rows = append(rows, []any{row.Value, row.Sessions})
		}
		writeSheet(strings.Title(dim), []string{"Value", "Sessions"}, rows) //nolint:staticcheck // dimension names are ASCII
	}

	eventRows := make([][]any, 0, len(dash.Events))
	for _, e := range dash.Events {
		eventRows = append(eventRows, []any{e.Name, e.Count})
	}
	writeSheet("Events", []string{"Event", "Count"}, eventRows)

	vitalRows := make([][]any, 0, len(dash.Vitals))
	for _, v := range dash.Vitals {
		vitalRows = append(vitalRows, []any{v.Metric, v.Avg, v.Max, v.Samples, v.Rating})
	}
	writeSheet("Web Vitals", []string{"Metric", "Avg", "Max", "Samples", "Rating"}, vitalRows)

	file.DeleteSheet("Sheet1")
	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="analytics-%s.xlsx"`, stamp))
	_ = file.Write(w)
}
