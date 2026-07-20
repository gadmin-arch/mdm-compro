package server

import (
	"fmt"
	"net/http"
)

// publicCache stamps public GET responses with a shared-cache TTL so browsers
// and proxies can reuse public content. Handlers needing a different policy
// (media's immutable, redirect resolve's no-store, analytics config's own
// max-age) overwrite the header themselves.
func publicCache(seconds int) func(http.Handler) http.Handler {
	value := fmt.Sprintf("public, max-age=%d", seconds)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet && seconds > 0 {
				w.Header().Set("Cache-Control", value)
			}
			next.ServeHTTP(w, r)
		})
	}
}
