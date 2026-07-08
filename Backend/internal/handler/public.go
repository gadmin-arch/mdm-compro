package handler

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/service"
)

type PublicHandler struct {
	service service.PublicService
}

func NewPublicHandler(service service.PublicService) PublicHandler {
	return PublicHandler{service: service}
}

func (h PublicHandler) Navigation(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Navigation(r.Context())
	respond(w, data, err)
}

func (h PublicHandler) Page(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Page(r.Context(), chi.URLParam(r, "key"))
	respond(w, data, err)
}

func (h PublicHandler) Services(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")
	page := intQuery(r, "page", 1)
	limit := intQuery(r, "limit", 10)
	if limit == 10 {
		if perPageVal := r.URL.Query().Get("perPage"); perPageVal != "" {
			if parsed, err := strconv.Atoi(perPageVal); err == nil {
				limit = parsed
			}
		}
	}

	if search == "" && category == "" && sort == "" && r.URL.Query().Get("page") == "" && r.URL.Query().Get("limit") == "" && r.URL.Query().Get("perPage") == "" {
		data, err := h.service.ServicesTree(r.Context())
		respond(w, data, err)
		return
	}

	data, err := h.service.Services(r.Context(), page, limit, search, category, sort)
	respond(w, data, err)
}

func (h PublicHandler) Service(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Service(r.Context(), pathParam(r))
	respond(w, data, err)
}

func (h PublicHandler) Products(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")
	page := intQuery(r, "page", 1)
	limit := intQuery(r, "limit", 10)
	if limit == 10 {
		if perPageVal := r.URL.Query().Get("perPage"); perPageVal != "" {
			if parsed, err := strconv.Atoi(perPageVal); err == nil {
				limit = parsed
			}
		}
	}

	if search == "" && category == "" && sort == "" && r.URL.Query().Get("page") == "" && r.URL.Query().Get("limit") == "" && r.URL.Query().Get("perPage") == "" {
		data, err := h.service.ProductsTree(r.Context())
		respond(w, data, err)
		return
	}

	data, err := h.service.Products(r.Context(), page, limit, search, category, sort)
	respond(w, data, err)
}

func (h PublicHandler) Product(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Product(r.Context(), pathParam(r))
	respond(w, data, err)
}

func (h PublicHandler) News(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	category := r.URL.Query().Get("category")
	featured := r.URL.Query().Get("featured")
	publishedDate := r.URL.Query().Get("publishedDate")
	if publishedDate == "" {
		publishedDate = r.URL.Query().Get("published_date")
	}
	sort := r.URL.Query().Get("sort")
	page := intQuery(r, "page", 1)
	limit := intQuery(r, "limit", 10)
	if limit == 10 {
		if perPageVal := r.URL.Query().Get("perPage"); perPageVal != "" {
			if parsed, err := strconv.Atoi(perPageVal); err == nil {
				limit = parsed
			}
		}
	}

	data, err := h.service.News(r.Context(), page, limit, search, category, featured, publishedDate, sort)
	respond(w, data, err)
}

func (h PublicHandler) NewsItem(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.NewsItem(r.Context(), chi.URLParam(r, "slug"))
	respond(w, data, err)
}

func (h PublicHandler) Careers(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	location := r.URL.Query().Get("location")
	department := r.URL.Query().Get("department")
	empType := r.URL.Query().Get("type")
	if empType == "" {
		empType = r.URL.Query().Get("employment_type")
	}
	sort := r.URL.Query().Get("sort")
	page := intQuery(r, "page", 1)
	limit := intQuery(r, "limit", 10)
	if limit == 10 {
		if perPageVal := r.URL.Query().Get("perPage"); perPageVal != "" {
			if parsed, err := strconv.Atoi(perPageVal); err == nil {
				limit = parsed
			}
		}
	}

	data, err := h.service.Careers(r.Context(), page, limit, search, location, department, empType, sort)
	respond(w, data, err)
}

func (h PublicHandler) Career(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Career(r.Context(), chi.URLParam(r, "slug"))
	respond(w, data, err)
}

func (h PublicHandler) Pages(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")
	page := intQuery(r, "page", 1)
	limit := intQuery(r, "limit", 10)
	if limit == 10 {
		if perPageVal := r.URL.Query().Get("perPage"); perPageVal != "" {
			if parsed, err := strconv.Atoi(perPageVal); err == nil {
				limit = parsed
			}
		}
	}

	data, err := h.service.Pages(r.Context(), page, limit, search, category, sort)
	respond(w, data, err)
}

func (h PublicHandler) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	if q == "" {
		q = r.URL.Query().Get("search")
	}
	data, err := h.service.Search(r.Context(), q)
	respond(w, data, err)
}

func (h PublicHandler) Contact(w http.ResponseWriter, r *http.Request) {
	var input model.ContactInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	data, err := h.service.CreateContact(r.Context(), input)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusCreated, data)
}

func respond(w http.ResponseWriter, data any, err error) {
	if errors.Is(err, repository.ErrNotFound) {
		Error(w, http.StatusNotFound, "not_found", "Resource was not found.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, data)
}

func intQuery(r *http.Request, key string, fallback int) int {
	value, err := strconv.Atoi(r.URL.Query().Get(key))
	if err != nil {
		return fallback
	}
	return value
}

func pathParam(r *http.Request) string {
	if value := chi.URLParam(r, "*"); value != "" {
		return strings.Trim(value, "/")
	}
	return strings.Trim(chi.URLParam(r, "path"), "/")
}
