package server

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// requestLog emits one structured line per request. /healthz and the analytics
// collect endpoint are skipped so probes and beacons don't flood the log.
func requestLog(logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path == "/healthz" || r.URL.Path == "/api/v1/public/analytics/collect" {
				next.ServeHTTP(w, r)
				return
			}
			start := time.Now()
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			next.ServeHTTP(ww, r)
			logger.Info("request",
				"method", r.Method,
				"path", r.URL.Path,
				"route", chi.RouteContext(r.Context()).RoutePattern(),
				"status", ww.Status(),
				"bytes", ww.BytesWritten(),
				"durationMs", time.Since(start).Milliseconds(),
				"ip", r.RemoteAddr,
				"requestId", middleware.GetReqID(r.Context()),
			)
		})
	}
}
