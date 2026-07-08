package server

import (
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/handler"
)

// rateLimiter is a fixed-window per-IP request counter. It is in-memory by
// design: the API runs as a single process, and the durable per-account
// lockout lives in the auth_throttle table.
type rateLimiter struct {
	mu      sync.Mutex
	limit   int
	window  time.Duration
	buckets map[string]*rateBucket
	swept   time.Time
}

type rateBucket struct {
	count   int
	resetAt time.Time
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{
		limit:   limit,
		window:  window,
		buckets: make(map[string]*rateBucket),
		swept:   time.Now(),
	}
}

func (l *rateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if retryAfter, limited := l.take(clientIP(r)); limited {
			w.Header().Set("Retry-After", strconv.Itoa(int(retryAfter/time.Second)+1))
			handler.Error(w, http.StatusTooManyRequests, "rate_limited", "Too many requests. Slow down and try again.")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (l *rateLimiter) take(key string) (time.Duration, bool) {
	now := time.Now()
	l.mu.Lock()
	defer l.mu.Unlock()

	if now.Sub(l.swept) > 10*l.window {
		for bucketKey, bucket := range l.buckets {
			if bucket.resetAt.Before(now) {
				delete(l.buckets, bucketKey)
			}
		}
		l.swept = now
	}

	bucket, ok := l.buckets[key]
	if !ok || bucket.resetAt.Before(now) {
		l.buckets[key] = &rateBucket{count: 1, resetAt: now.Add(l.window)}
		return 0, false
	}
	bucket.count++
	if bucket.count > l.limit {
		return time.Until(bucket.resetAt), true
	}
	return 0, false
}

func clientIP(r *http.Request) string {
	// middleware.RealIP has already rewritten RemoteAddr from proxy headers.
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}

// secureHeaders sets baseline security headers on every API response and
// keeps authenticated payloads out of shared caches.
func secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		headers := w.Header()
		headers.Set("X-Content-Type-Options", "nosniff")
		headers.Set("X-Frame-Options", "DENY")
		headers.Set("Referrer-Policy", "no-referrer")
		next.ServeHTTP(w, r)
	})
}
