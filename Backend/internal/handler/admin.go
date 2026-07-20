package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/auth"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/service"
)

type AdminHandler struct {
	service service.AdminService
}

func NewAdminHandler(service service.AdminService) AdminHandler {
	return AdminHandler{service: service}
}

func (h AdminHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	counts, statuses, err := h.service.Dashboard(r.Context())
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"counts": counts, "statuses": statuses})
}

func (h AdminHandler) Activity(w http.ResponseWriter, r *http.Request) {
	entries, err := h.service.RecentActivity(r.Context())
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"data": entries})
}

// audit records a content mutation for the dashboard activity feed. It is
// best-effort: a failed insert never blocks the response the user waited for.
func (h AdminHandler) audit(r *http.Request, action, entityType, entityID, label string) {
	actorID := ""
	if claims := auth.ClaimsFromContext(r.Context()); claims != nil {
		actorID = claims.UserID
	}
	_ = h.service.RecordActivity(r.Context(), actorID, action, entityType, entityID, label)
}

// auditDiff is audit with before/after snapshots for update/archive actions.
func (h AdminHandler) auditDiff(r *http.Request, action, entityType, entityID string, before, after map[string]string) {
	actorID := ""
	if claims := auth.ClaimsFromContext(r.Context()); claims != nil {
		actorID = claims.UserID
	}
	_ = h.service.RecordActivityDiff(r.Context(), actorID, action, entityType, entityID, before, after)
}

// snapshot is the minimal audited state of a record: what it was called and
// which publish status it had.
func snapshot(title, status string) map[string]string {
	return map[string]string{"label": title, "status": status}
}

// contentEntity maps a chi module param ("services") to an entity type
// ("service") for audit rows.
func contentEntity(module string) string {
	return strings.TrimSuffix(module, "s")
}

func (h AdminHandler) Contacts(w http.ResponseWriter, r *http.Request) {
	contacts, err := h.service.RecentContacts(r.Context())
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"data": contacts})
}

func (h AdminHandler) Pages(w http.ResponseWriter, r *http.Request) {
	pages, err := h.service.Pages(
		r.Context(),
		intQuery(r, "page", 1),
		intQuery(r, "perPage", 25),
		r.URL.Query().Get("q"),
		r.URL.Query().Get("status"),
	)
	respondAdmin(w, pages, err)
}

func (h AdminHandler) CreatePage(w http.ResponseWriter, r *http.Request) {
	var input model.PageCreateInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}

	page, err := h.service.CreatePage(r.Context(), input)
	if err != nil {
		respondAdmin(w, page, err)
		return
	}
	h.audit(r, "created", "page", page.ID, page.Title)
	JSON(w, http.StatusCreated, page)
}

func (h AdminHandler) Page(w http.ResponseWriter, r *http.Request) {
	page, err := h.service.Page(r.Context(), chi.URLParam(r, "id"))
	respondAdmin(w, page, err)
}

func (h AdminHandler) UpdatePage(w http.ResponseWriter, r *http.Request) {
	var input model.PageInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}

	// Best-effort pre-read so the audit row can show what changed.
	existing, _ := h.service.Page(r.Context(), chi.URLParam(r, "id"))
	page, err := h.service.UpdatePage(r.Context(), chi.URLParam(r, "id"), input)
	if err == nil {
		h.auditDiff(r, "updated", "page", page.ID, snapshot(existing.Title, existing.Status), snapshot(page.Title, page.Status))
	}
	respondAdmin(w, page, err)
}

func (h AdminHandler) DeletePage(w http.ResponseWriter, r *http.Request) {
	existing, _ := h.service.Page(r.Context(), chi.URLParam(r, "id"))
	err := h.service.DeletePage(r.Context(), chi.URLParam(r, "id"), intQuery(r, "version", 0))
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	h.auditDiff(r, "archived", "page", chi.URLParam(r, "id"), snapshot(existing.Title, existing.Status), snapshot(existing.Title, "archived"))
	JSON(w, http.StatusNoContent, nil)
}

func (h AdminHandler) Content(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Content(
		r.Context(),
		chi.URLParam(r, "module"),
		intQuery(r, "page", 1),
		intQuery(r, "perPage", 25),
		r.URL.Query().Get("q"),
		r.URL.Query().Get("status"),
	)
	respondAdmin(w, data, err)
}

func (h AdminHandler) CreateContent(w http.ResponseWriter, r *http.Request) {
	var input model.ContentNodeInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	data, err := h.service.CreateContent(r.Context(), chi.URLParam(r, "module"), input)
	if err != nil {
		respondAdmin(w, data, err)
		return
	}
	h.audit(r, "created", contentEntity(chi.URLParam(r, "module")), data.ID, data.Title)
	JSON(w, http.StatusCreated, data)
}

func (h AdminHandler) ContentItem(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.ContentItem(r.Context(), chi.URLParam(r, "module"), chi.URLParam(r, "id"))
	respondAdmin(w, data, err)
}

func (h AdminHandler) UpdateContent(w http.ResponseWriter, r *http.Request) {
	var input model.ContentNodeInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	existing, _ := h.service.ContentItem(r.Context(), chi.URLParam(r, "module"), chi.URLParam(r, "id"))
	data, err := h.service.UpdateContent(r.Context(), chi.URLParam(r, "module"), chi.URLParam(r, "id"), input)
	if err == nil {
		h.auditDiff(r, "updated", contentEntity(chi.URLParam(r, "module")), data.ID, snapshot(existing.Title, existing.Status), snapshot(data.Title, data.Status))
	}
	respondAdmin(w, data, err)
}

func (h AdminHandler) DeleteContent(w http.ResponseWriter, r *http.Request) {
	existing, _ := h.service.ContentItem(r.Context(), chi.URLParam(r, "module"), chi.URLParam(r, "id"))
	err := h.service.DeleteContent(r.Context(), chi.URLParam(r, "module"), chi.URLParam(r, "id"), intQuery(r, "version", 0))
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	h.auditDiff(r, "archived", contentEntity(chi.URLParam(r, "module")), chi.URLParam(r, "id"), snapshot(existing.Title, existing.Status), snapshot(existing.Title, "archived"))
	JSON(w, http.StatusNoContent, nil)
}

func (h AdminHandler) News(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.News(
		r.Context(),
		intQuery(r, "page", 1),
		intQuery(r, "perPage", 25),
		r.URL.Query().Get("q"),
		r.URL.Query().Get("status"),
	)
	respondAdmin(w, data, err)
}

func (h AdminHandler) CreateNews(w http.ResponseWriter, r *http.Request) {
	var input model.NewsInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	data, err := h.service.CreateNews(r.Context(), input)
	if err != nil {
		respondAdmin(w, data, err)
		return
	}
	h.audit(r, "created", "news", data.ID, data.Title)
	JSON(w, http.StatusCreated, data)
}

func (h AdminHandler) NewsItem(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.NewsItem(r.Context(), chi.URLParam(r, "id"))
	respondAdmin(w, data, err)
}

func (h AdminHandler) UpdateNews(w http.ResponseWriter, r *http.Request) {
	var input model.NewsInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	existing, _ := h.service.NewsItem(r.Context(), chi.URLParam(r, "id"))
	data, err := h.service.UpdateNews(r.Context(), chi.URLParam(r, "id"), input)
	if err == nil {
		h.auditDiff(r, "updated", "news", data.ID, snapshot(existing.Title, existing.Status), snapshot(data.Title, data.Status))
	}
	respondAdmin(w, data, err)
}

func (h AdminHandler) DeleteNews(w http.ResponseWriter, r *http.Request) {
	existing, _ := h.service.NewsItem(r.Context(), chi.URLParam(r, "id"))
	err := h.service.DeleteNews(r.Context(), chi.URLParam(r, "id"), intQuery(r, "version", 0))
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	h.auditDiff(r, "archived", "news", chi.URLParam(r, "id"), snapshot(existing.Title, existing.Status), snapshot(existing.Title, "archived"))
	JSON(w, http.StatusNoContent, nil)
}

func (h AdminHandler) Careers(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Careers(
		r.Context(),
		intQuery(r, "page", 1),
		intQuery(r, "perPage", 25),
		r.URL.Query().Get("q"),
		r.URL.Query().Get("status"),
	)
	respondAdmin(w, data, err)
}

func (h AdminHandler) CreateCareer(w http.ResponseWriter, r *http.Request) {
	var input model.CareerInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	data, err := h.service.CreateCareer(r.Context(), input)
	if err != nil {
		respondAdmin(w, data, err)
		return
	}
	h.audit(r, "created", "career", data.ID, data.Title)
	JSON(w, http.StatusCreated, data)
}

func (h AdminHandler) Career(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Career(r.Context(), chi.URLParam(r, "id"))
	respondAdmin(w, data, err)
}

func (h AdminHandler) UpdateCareer(w http.ResponseWriter, r *http.Request) {
	var input model.CareerInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	existing, _ := h.service.Career(r.Context(), chi.URLParam(r, "id"))
	data, err := h.service.UpdateCareer(r.Context(), chi.URLParam(r, "id"), input)
	if err == nil {
		h.auditDiff(r, "updated", "career", data.ID, snapshot(existing.Title, existing.Status), snapshot(data.Title, data.Status))
	}
	respondAdmin(w, data, err)
}

func (h AdminHandler) DeleteCareer(w http.ResponseWriter, r *http.Request) {
	existing, _ := h.service.Career(r.Context(), chi.URLParam(r, "id"))
	err := h.service.DeleteCareer(r.Context(), chi.URLParam(r, "id"), intQuery(r, "version", 0))
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	h.auditDiff(r, "archived", "career", chi.URLParam(r, "id"), snapshot(existing.Title, existing.Status), snapshot(existing.Title, "archived"))
	JSON(w, http.StatusNoContent, nil)
}

func (h AdminHandler) Navigation(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Navigation(r.Context())
	respondAdmin(w, data, err)
}

func (h AdminHandler) UpdateNavigation(w http.ResponseWriter, r *http.Request) {
	var input model.NavigationMenu
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}

	userID := ""
	if claims := auth.ClaimsFromContext(r.Context()); claims != nil {
		userID = claims.UserID
	}
	data, err := h.service.SaveNavigation(r.Context(), input, userID)
	if err == nil {
		h.audit(r, "updated", "navigation", "", "Site menu")
	}
	respondAdmin(w, data, err)
}

func (h AdminHandler) Settings(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.ListSettings(r.Context())
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"data": data})
}

func (h AdminHandler) Setting(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Setting(r.Context(), chi.URLParam(r, "key"))
	respondAdmin(w, data, err)
}

func (h AdminHandler) UpdateSetting(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Value   json.RawMessage `json:"value"`
		Version int             `json:"version"`
	}
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}

	userID := ""
	if claims := auth.ClaimsFromContext(r.Context()); claims != nil {
		userID = claims.UserID
	}
	key := chi.URLParam(r, "key")
	data, err := h.service.SaveSetting(r.Context(), key, input.Value, input.Version, userID)
	if err == nil {
		h.audit(r, "updated", "setting", key, "Site settings")
	}
	respondAdmin(w, data, err)
}

func (h AdminHandler) ModuleContract(w http.ResponseWriter, r *http.Request) {
	JSON(w, http.StatusNotImplemented, map[string]any{
		"error":   "contract_defined",
		"message": "This module route is reserved by the OpenAPI contract and ready for CRUD implementation.",
	})
}

func respondAdmin(w http.ResponseWriter, data any, err error) {
	if errors.Is(err, repository.ErrNotFound) {
		Error(w, http.StatusNotFound, "not_found", "Resource was not found.")
		return
	}
	if errors.Is(err, repository.ErrConflict) {
		Error(w, http.StatusConflict, "version_conflict", "The record was changed by another request. Reload and try again.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, data)
}

func (h AdminHandler) ArchivedItems(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("q")
	items, err := h.service.ArchivedItems(r.Context(), search)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"data": items})
}

func (h AdminHandler) RestoreItem(w http.ResponseWriter, r *http.Request) {
	itemType := chi.URLParam(r, "type")
	id := chi.URLParam(r, "id")
	err := h.service.RestoreItem(r.Context(), itemType, id)
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	h.audit(r, "restored", itemType, id, "")
	JSON(w, http.StatusOK, map[string]string{"status": "restored"})
}

func (h AdminHandler) HardDeleteItem(w http.ResponseWriter, r *http.Request) {
	itemType := chi.URLParam(r, "type")
	id := chi.URLParam(r, "id")
	err := h.service.HardDeleteItem(r.Context(), itemType, id)
	if err != nil {
		respondAdmin(w, nil, err)
		return
	}
	h.audit(r, "deleted", itemType, id, "")
	JSON(w, http.StatusNoContent, nil)
}

