package server

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/auth"
)

func runRequireRoleAccess(t *testing.T, method, path, role string) *httptest.ResponseRecorder {
	t.Helper()
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	req := httptest.NewRequest(method, path, nil)
	if role != "" {
		req = req.WithContext(auth.ContextWithClaims(req.Context(), &auth.Claims{UserID: "u1", Role: role}))
	}
	rec := httptest.NewRecorder()
	requireRoleAccess(next).ServeHTTP(rec, req)
	return rec
}

func TestRequireRoleAccessMatrix(t *testing.T) {
	cases := []struct {
		name   string
		method string
		path   string
		role   string
		want   int
	}{
		{"user can read news", http.MethodGet, "/api/v1/admin/news", "user", http.StatusOK},
		{"user can create news", http.MethodPost, "/api/v1/admin/news", "user", http.StatusOK},
		{"user can update news", http.MethodPut, "/api/v1/admin/news/1", "user", http.StatusOK},
		{"user can delete news", http.MethodDelete, "/api/v1/admin/news/1", "user", http.StatusOK},

		{"user can read careers", http.MethodGet, "/api/v1/admin/careers", "user", http.StatusOK},
		{"user can create careers", http.MethodPost, "/api/v1/admin/careers", "user", http.StatusOK},
		{"user can update careers", http.MethodPut, "/api/v1/admin/careers/1", "user", http.StatusOK},
		{"user can delete careers", http.MethodDelete, "/api/v1/admin/careers/1", "user", http.StatusOK},

		{"user can read products", http.MethodGet, "/api/v1/admin/products", "user", http.StatusOK},
		{"user can create products", http.MethodPost, "/api/v1/admin/products", "user", http.StatusOK},
		{"user can update products", http.MethodPut, "/api/v1/admin/products/1", "user", http.StatusOK},
		{"user can delete products", http.MethodDelete, "/api/v1/admin/products/1", "user", http.StatusOK},

		{"user can read services", http.MethodGet, "/api/v1/admin/services", "user", http.StatusOK},
		{"user can create services", http.MethodPost, "/api/v1/admin/services", "user", http.StatusOK},
		{"user can update services", http.MethodPut, "/api/v1/admin/services/1", "user", http.StatusOK},
		{"user can delete services", http.MethodDelete, "/api/v1/admin/services/1", "user", http.StatusOK},

		{"user can upload media", http.MethodPost, "/api/v1/admin/media/upload", "user", http.StatusOK},
		{"user can delete media", http.MethodDelete, "/api/v1/admin/media/1", "user", http.StatusOK},

		{"user keeps profile update", http.MethodPut, "/api/v1/admin/profile", "user", http.StatusOK},
		{"user keeps password change", http.MethodPut, "/api/v1/admin/profile/password", "user", http.StatusOK},
		{"user keeps device revoke", http.MethodDelete, "/api/v1/admin/profile/devices/1", "user", http.StatusOK},
		{"user keeps revoke-all", http.MethodPost, "/api/v1/admin/profile/devices/revoke-all", "user", http.StatusOK},

		{"user can read pages", http.MethodGet, "/api/v1/admin/pages", "user", http.StatusOK},
		{"user cannot create pages", http.MethodPost, "/api/v1/admin/pages", "user", http.StatusForbidden},
		{"user cannot update pages", http.MethodPut, "/api/v1/admin/pages/1", "user", http.StatusForbidden},
		{"user cannot delete pages", http.MethodDelete, "/api/v1/admin/pages/1", "user", http.StatusForbidden},

		{"user cannot manage users", http.MethodGet, "/api/v1/admin/users", "user", http.StatusForbidden},
		{"user cannot create users", http.MethodPost, "/api/v1/admin/users", "user", http.StatusForbidden},
		{"user cannot access redirects", http.MethodGet, "/api/v1/admin/redirects", "user", http.StatusForbidden},
		{"user cannot access site settings", http.MethodGet, "/api/v1/admin/settings", "user", http.StatusForbidden},
		{"user cannot access archive", http.MethodGet, "/api/v1/admin/archive", "user", http.StatusForbidden},
		{"user cannot access contacts", http.MethodGet, "/api/v1/admin/contacts", "user", http.StatusForbidden},
		{"user cannot access analytics", http.MethodGet, "/api/v1/admin/analytics/dashboard", "user", http.StatusForbidden},

		{"admin can do everything", http.MethodPost, "/api/v1/admin/users", "admin", http.StatusOK},
		{"owner can do everything", http.MethodDelete, "/api/v1/admin/pages/1", "owner", http.StatusOK},
		{"missing claims blocked", http.MethodPost, "/api/v1/admin/pages", "", http.StatusUnauthorized},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			rec := runRequireRoleAccess(t, tc.method, tc.path, tc.role)
			if rec.Code != tc.want {
				t.Errorf("%s %s as %q: got %d, want %d", tc.method, tc.path, tc.role, rec.Code, tc.want)
			}
		})
	}
}

func TestPublicCacheHeader(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	handler := publicCache(300)(next)

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/v1/public/services", nil))
	if got := rec.Header().Get("Cache-Control"); got != "public, max-age=300" {
		t.Errorf("GET Cache-Control = %q", got)
	}

	rec = httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/v1/public/contacts", nil))
	if got := rec.Header().Get("Cache-Control"); got != "" {
		t.Errorf("POST must not get a cache header, got %q", got)
	}
}

func TestPublicCacheHandlerOverrideWins(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusOK)
	})
	rec := httptest.NewRecorder()
	publicCache(300)(next).ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/v1/public/redirects/resolve", nil))
	if got := rec.Header().Get("Cache-Control"); got != "no-store" {
		t.Errorf("handler override must win, got %q", got)
	}
}

func TestSecureHeaders(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	rec := httptest.NewRecorder()
	secureHeaders(next).ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/", nil))
	for header, want := range map[string]string{
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options":        "DENY",
		"Referrer-Policy":        "no-referrer",
	} {
		if got := rec.Header().Get(header); got != want {
			t.Errorf("%s = %q, want %q", header, got, want)
		}
	}
}
