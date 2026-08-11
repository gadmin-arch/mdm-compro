package server

import (
	"context"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/analytics"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/auth"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/config"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/handler"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/mailer"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/service"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/storage"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewRouter(cfg config.Config, logger *slog.Logger, pool *pgxpool.Pool, collector *analytics.Collector) http.Handler {
	publicRepo := repository.NewPublicRepository(pool)
	authRepo := repository.NewAuthRepository(pool)
	adminRepo := repository.NewAdminRepository(pool)
	mediaStore, err := storage.New(cfg)
	if err != nil {
		logger.Warn("media storage init failed", "error", err, "driver", cfg.StorageDriver)
	}

	mail := mailer.New(logger, cfg)
	publicHandler := handler.NewPublicHandler(service.NewPublicService(publicRepo, mail, logger))
	authService := service.NewAuthService(cfg, authRepo, mail)
	authHandler := handler.NewAuthHandler(authService)
	adminHandler := handler.NewAdminHandler(service.NewAdminService(adminRepo))
	mediaHandler := handler.NewMediaHandler(adminRepo, mediaStore)
	analyticsHandler := handler.NewAnalyticsHandler(collector, service.NewAnalyticsService(repository.NewAnalyticsRepository(pool)), cfg.SiteURL)
	redirectHandler := handler.NewRedirectHandler(service.NewRedirectService(repository.NewRedirectRepository(pool), collector), cfg.SiteURL)
	tokenManager := authService.TokenManager()

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(requestLog(logger))
	r.Use(middleware.Recoverer)
	r.Use(middleware.CleanPath)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(secureHeaders)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.FrontendOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()
		if err := publicRepo.Health(ctx); err != nil {
			logger.Warn("health check failed", "error", err)
			handler.Error(w, http.StatusServiceUnavailable, "unhealthy", "Database is not reachable.")
			return
		}
		handler.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	// Per-IP request budgets for the endpoints an attacker would hammer;
	// the durable per-account lockout lives in the auth service.
	loginLimit := newRateLimiter(10, 5*time.Minute)
	codeLimit := newRateLimiter(10, 15*time.Minute)
	sendLimit := newRateLimiter(5, 15*time.Minute)
	refreshLimit := newRateLimiter(60, 5*time.Minute)
	contactLimit := newRateLimiter(5, 10*time.Minute)
	collectLimit := newRateLimiter(120, time.Minute)

	r.Route("/api/v1", func(r chi.Router) {
		r.Use(apiTiming(collector))
		r.Route("/auth", func(r chi.Router) {
			r.With(loginLimit.Middleware).Post("/login", authHandler.Login)
			r.With(codeLimit.Middleware).Post("/verify-otp", authHandler.VerifyOTP)
			r.With(sendLimit.Middleware).Post("/resend-otp", authHandler.ResendOTP)
			r.With(refreshLimit.Middleware).Post("/refresh", authHandler.Refresh)
			r.Post("/logout", authHandler.Logout)
			r.With(sendLimit.Middleware).Post("/forgot-password", authHandler.RequestPasswordReset)
			r.With(codeLimit.Middleware).Post("/reset-password", authHandler.ResetPassword)
			r.With(codeLimit.Middleware).Post("/verify-invite", authHandler.VerifyInvitation)
		})

		r.Route("/public", func(r chi.Router) {
			r.Use(publicCache(cfg.PublicCacheSeconds))
			r.Get("/navigation", publicHandler.Navigation)
			r.Get("/settings", publicHandler.Settings)
			r.Get("/pages", publicHandler.Pages)
			r.Get("/pages/{key}", publicHandler.Page)
			r.Get("/services", publicHandler.Services)
			r.Get("/services/*", publicHandler.Service)
			r.Get("/products", publicHandler.Products)
			r.Get("/products/*", publicHandler.Product)
			r.Get("/news", publicHandler.News)
			r.Get("/news/{slug}", publicHandler.NewsItem)
			r.Get("/careers", publicHandler.Careers)
			r.Get("/careers/{slug}", publicHandler.Career)
			r.Get("/search", publicHandler.Search)
			r.Get("/media/*", mediaHandler.Serve)
			r.With(contactLimit.Middleware).Post("/contacts", publicHandler.Contact)
			r.With(collectLimit.Middleware).Post("/analytics/collect", analyticsHandler.Collect)
			r.Get("/analytics/config", analyticsHandler.Config)
			r.Get("/redirects/resolve", redirectHandler.Resolve)
		})

		r.Route("/admin", func(r chi.Router) {
			r.Use(requireAuth(tokenManager, authRepo))
			r.Use(requireWrite)
			r.Get("/dashboard", adminHandler.Dashboard)
			r.Get("/activity", adminHandler.Activity)
			r.Get("/navigation", adminHandler.Navigation)
			r.Put("/navigation", adminHandler.UpdateNavigation)
			r.Get("/users", authHandler.Users)
			r.Post("/users", authHandler.InviteUser)
			r.Put("/users/{id}/role", authHandler.UpdateUserRole)
			r.Delete("/users/{id}", authHandler.DeleteUser)
			r.Get("/profile", authHandler.Profile)
			r.Put("/profile", authHandler.UpdateProfile)
			r.Put("/profile/password", authHandler.ChangePassword)
			r.Get("/profile/devices", authHandler.TrustedDevices)
			r.Delete("/profile/devices/{id}", authHandler.RevokeTrustedDevice)
			r.Post("/profile/devices/revoke-all", authHandler.RevokeAllTrustedDevices)
			r.Get("/profile/login-history", authHandler.LoginHistory)
			r.Get("/contacts", adminHandler.Contacts)
			r.Put("/contacts/{id}/status", adminHandler.UpdateContactStatus)
			r.Get("/archive", adminHandler.ArchivedItems)
			r.Post("/archive/{type}/{id}/restore", adminHandler.RestoreItem)
			r.Delete("/archive/{type}/{id}", adminHandler.HardDeleteItem)
			r.Post("/media/upload", mediaHandler.Upload)
			r.Get("/media", mediaHandler.List)
			r.Delete("/media/{id}", mediaHandler.Delete)
			r.Get("/settings", adminHandler.Settings)
			r.Get("/settings/{key}", adminHandler.Setting)
			r.Put("/settings/{key}", adminHandler.UpdateSetting)
			r.Get("/analytics/dashboard", analyticsHandler.Dashboard)
			r.Get("/analytics/realtime", analyticsHandler.Realtime)
			r.Get("/analytics/admin-activity", analyticsHandler.AdminActivity)
			r.Get("/analytics/options", analyticsHandler.FilterOptions)
			r.Get("/analytics/export", analyticsHandler.Export)
			r.Get("/redirects", redirectHandler.List)
			r.Post("/redirects", redirectHandler.Create)
			r.Get("/redirects/dashboard", redirectHandler.Dashboard)
			r.Get("/redirects/export", redirectHandler.Export)
			r.Post("/redirects/bulk-delete", redirectHandler.BulkDelete)
			r.Get("/redirects/{id}", redirectHandler.Get)
			r.Put("/redirects/{id}", redirectHandler.Update)
			r.Delete("/redirects/{id}", redirectHandler.Delete)
			r.Post("/redirects/{id}/duplicate", redirectHandler.Duplicate)
			r.Get("/redirects/{id}/stats", redirectHandler.Stats)
			r.Get("/redirects/{id}/qr", redirectHandler.QR)
			r.Get("/pages", adminHandler.Pages)
			r.Post("/pages", adminHandler.CreatePage)
			r.Get("/pages/{id}", adminHandler.Page)
			r.Put("/pages/{id}", adminHandler.UpdatePage)
			r.Delete("/pages/{id}", adminHandler.DeletePage)
			r.Get("/news", adminHandler.News)
			r.Post("/news", adminHandler.CreateNews)
			r.Get("/news/{id}", adminHandler.NewsItem)
			r.Put("/news/{id}", adminHandler.UpdateNews)
			r.Delete("/news/{id}", adminHandler.DeleteNews)
			r.Get("/careers", adminHandler.Careers)
			r.Post("/careers", adminHandler.CreateCareer)
			r.Get("/careers/{id}", adminHandler.Career)
			r.Put("/careers/{id}", adminHandler.UpdateCareer)
			r.Delete("/careers/{id}", adminHandler.DeleteCareer)
			r.Get("/{module:services|products}", adminHandler.Content)
			r.Post("/{module:services|products}", adminHandler.CreateContent)
			r.Get("/{module:services|products}/{id}", adminHandler.ContentItem)
			r.Put("/{module:services|products}/{id}", adminHandler.UpdateContent)
			r.Delete("/{module:services|products}/{id}", adminHandler.DeleteContent)
			for _, module := range []string{"roles", "permissions", "seo-meta"} {
				r.Get("/"+module, adminHandler.ModuleContract)
				r.Post("/"+module, adminHandler.ModuleContract)
				r.Put("/"+module+"/{id}", adminHandler.ModuleContract)
				r.Delete("/"+module+"/{id}", adminHandler.ModuleContract)
			}
		})
	})

	return r
}

// apiTiming feeds request durations into the analytics collector so the
// dashboard can report API response times and error counts. Non-blocking:
// TrackAPI drops on a full buffer.
func apiTiming(collector *analytics.Collector) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			next.ServeHTTP(ww, r)
			// RoutePattern already includes the /api/v1 mount prefix.
			route := chi.RouteContext(r.Context()).RoutePattern()
			// The collect endpoint would only measure itself.
			if route == "" || strings.HasSuffix(route, "/analytics/collect") {
				return
			}
			collector.TrackAPI(r.Method+" "+route, ww.Status(), time.Since(start))
		})
	}
}

// requireWrite makes the "user" role read-only: reads pass through, but
// mutations require the owner or admin role. The /admin/profile subtree is
// exempt so every user keeps managing their own account (password, trusted
// devices). Must run after requireAuth, which refreshes the role from the DB
// on every request.
func requireWrite(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet, http.MethodHead, http.MethodOptions:
			next.ServeHTTP(w, r)
			return
		}
		if strings.HasPrefix(r.URL.Path, "/api/v1/admin/profile") {
			next.ServeHTTP(w, r)
			return
		}
		claims := auth.ClaimsFromContext(r.Context())
		if claims == nil || (claims.Role != "owner" && claims.Role != "admin") {
			handler.Error(w, http.StatusForbidden, "forbidden", "Your account has read-only access.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func requireAuth(manager auth.Manager, repo repository.AuthRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := strings.TrimSpace(r.Header.Get("Authorization"))
			tokenValue, ok := strings.CutPrefix(header, "Bearer ")
			if !ok || strings.TrimSpace(tokenValue) == "" {
				handler.Error(w, http.StatusUnauthorized, "unauthorized", "Bearer token is required.")
				return
			}
			claims, err := manager.Parse(strings.TrimSpace(tokenValue))
			if err != nil {
				handler.Error(w, http.StatusUnauthorized, "unauthorized", "Bearer token is invalid or expired.")
				return
			}
			user, err := repo.UserByID(r.Context(), claims.UserID)
			if err != nil || !user.IsActive {
				handler.Error(w, http.StatusUnauthorized, "unauthorized", "User account is inactive or no longer exists.")
				return
			}
			claims.Role = user.Role
			claims.Permissions = user.Permissions
			ctx := auth.ContextWithClaims(r.Context(), claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
