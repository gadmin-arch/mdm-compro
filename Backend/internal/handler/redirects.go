package handler

import (
	"encoding/csv"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/auth"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/qr"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/service"
)

type RedirectHandler struct {
	service *service.RedirectService
	siteURL string
}

func NewRedirectHandler(svc *service.RedirectService, siteURL string) RedirectHandler {
	return RedirectHandler{service: svc, siteURL: strings.TrimRight(siteURL, "/")}
}

func (h RedirectHandler) shortURL(slug string) string {
	return h.siteURL + "/" + slug
}

// Resolve is the hot path behind company.com/{slug}: the frontend middleware
// calls it with the visitor's forwarded headers, gets the target, and issues
// the actual 301/302. The scan is enqueued asynchronously — the response
// never waits for analytics.
func (h RedirectHandler) Resolve(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	target, err := h.service.Resolve(r.Context(), slug)
	if errors.Is(err, repository.ErrNotFound) {
		w.Header().Set("Cache-Control", "no-store")
		JSON(w, http.StatusNotFound, map[string]any{"found": false})
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}

	meta := service.ScanMeta{
		IP:        firstForwarded(r),
		UserAgent: r.UserAgent(),
		Referrer:  r.Header.Get("Referer"),
		Language:  primaryLanguage(r.Header.Get("Accept-Language")),
		Country:   geoHeader(r, "CF-IPCountry", "X-Vercel-IP-Country", "X-Country-Code"),
		City:      geoHeader(r, "CF-IPCity", "X-Vercel-IP-City", "X-City"),
	}
	h.service.RecordScan(target.Slug, meta)

	w.Header().Set("Cache-Control", "no-store")
	JSON(w, http.StatusOK, map[string]any{
		"found":        true,
		"destination":  target.Destination,
		"redirectType": target.RedirectType,
	})
}

func firstForwarded(r *http.Request) string {
	if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
		return strings.TrimSpace(strings.Split(forwarded, ",")[0])
	}
	return r.RemoteAddr
}

func primaryLanguage(header string) string {
	if header == "" {
		return ""
	}
	first := strings.Split(header, ",")[0]
	return strings.TrimSpace(strings.Split(first, ";")[0])
}

// --- admin CRUD ---

func (h RedirectHandler) List(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.List(
		r.Context(),
		intQuery(r, "page", 1),
		intQuery(r, "perPage", 25),
		r.URL.Query().Get("q"),
		r.URL.Query().Get("status"),
	)
	respondAdmin(w, data, err)
}

func (h RedirectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var input model.RedirectInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	data, err := h.service.Create(r.Context(), input, actorID(r))
	if err != nil {
		respondAdmin(w, data, err)
		return
	}
	JSON(w, http.StatusCreated, data)
}

func (h RedirectHandler) Get(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.ByID(r.Context(), chi.URLParam(r, "id"))
	respondAdmin(w, data, err)
}

func (h RedirectHandler) Update(w http.ResponseWriter, r *http.Request) {
	var input model.RedirectInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	data, err := h.service.Update(r.Context(), chi.URLParam(r, "id"), input, actorID(r))
	respondAdmin(w, data, err)
}

func (h RedirectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	err := h.service.Archive(r.Context(), chi.URLParam(r, "id"), intQuery(r, "version", 0))
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	JSON(w, http.StatusNoContent, nil)
}

func (h RedirectHandler) Duplicate(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Duplicate(r.Context(), chi.URLParam(r, "id"), actorID(r))
	if err != nil {
		respondAdmin(w, data, err)
		return
	}
	JSON(w, http.StatusCreated, data)
}

func (h RedirectHandler) BulkDelete(w http.ResponseWriter, r *http.Request) {
	var input struct {
		IDs []string `json:"ids"`
	}
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	count, err := h.service.BulkArchive(r.Context(), input.IDs)
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	JSON(w, http.StatusOK, map[string]int{"archived": count})
}

func (h RedirectHandler) Export(w http.ResponseWriter, r *http.Request) {
	redirects, err := h.service.ExportAll(r.Context())
	if err != nil {
		HandleError(w, err)
		return
	}
	w.Header().Set("Content-Type", "text/csv; charset=utf-8")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="short-links-%s.csv"`, time.Now().UTC().Format("20060102")))
	writer := csv.NewWriter(w)
	defer writer.Flush()
	_ = writer.Write([]string{"name", "slug", "short_url", "destination", "type", "active", "expires_at", "total_scans", "created_at"})
	for _, item := range redirects {
		expires := ""
		if item.ExpiresAt != nil {
			expires = item.ExpiresAt.Format(time.RFC3339)
		}
		_ = writer.Write([]string{
			item.Name, item.Slug, h.shortURL(item.Slug), item.Destination,
			strconv.Itoa(item.RedirectType), strconv.FormatBool(item.IsActive),
			expires, strconv.Itoa(item.TotalScans), item.CreatedAt.Format(time.RFC3339),
		})
	}
}

func (h RedirectHandler) Stats(w http.ResponseWriter, r *http.Request) {
	filters := parseAnalyticsFilters(r)
	redirect, stats, err := h.service.ScanStats(r.Context(), chi.URLParam(r, "id"), filters.From, filters.To)
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"redirect": redirect, "stats": stats, "shortUrl": h.shortURL(redirect.Slug)})
}

func (h RedirectHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	filters := parseAnalyticsFilters(r)
	dash, err := h.service.Dashboard(r.Context(), filters.From, filters.To)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, dash)
}

// QR renders the code for a redirect's short URL.
// Query: format=png|svg|pdf, size=256|512|1024|2048|4096,
// bg=white|transparent, logo=1|0, download=1|0.
func (h RedirectHandler) QR(w http.ResponseWriter, r *http.Request) {
	redirect, err := h.service.ByID(r.Context(), chi.URLParam(r, "id"))
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	query := r.URL.Query()
	opts := qr.Options{
		Format:      query.Get("format"),
		Size:        intQuery(r, "size", 1024),
		Transparent: query.Get("bg") == "transparent",
		Logo:        query.Get("logo") != "0",
	}
	data, contentType, ext, err := qr.Generate(h.shortURL(redirect.Slug), opts)
	if err != nil {
		HandleError(w, err)
		return
	}
	w.Header().Set("Content-Type", contentType)
	disposition := "inline"
	if query.Get("download") == "1" {
		disposition = "attachment"
	}
	w.Header().Set("Content-Disposition", fmt.Sprintf(`%s; filename="qr-%s-%d.%s"`, disposition, redirect.Slug, qr.Normalize(opts).Size, ext))
	w.Header().Set("Cache-Control", "private, max-age=300")
	_, _ = w.Write(data)
}

func actorID(r *http.Request) string {
	if claims := auth.ClaimsFromContext(r.Context()); claims != nil {
		return claims.UserID
	}
	return ""
}
