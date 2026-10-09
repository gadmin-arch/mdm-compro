package server

import (
	"fmt"
	"net/http"
)

// publicCache stamps public GET responses with a shared-cache TTL so browsers
// and proxies can reuse public content. Handlers needing a different policy
// (media's immutable, redirect resolve's no-store, analytics config's own
// max-age) overwrite the header themselves. Error responses go out with
// no-store instead: Vercel's CDN caches proxied responses that say they are
// cacheable, and a 404 or 500 must not be served from there for minutes.
func publicCache(seconds int) func(http.Handler) http.Handler {
	value := fmt.Sprintf("public, max-age=%d", seconds)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet && seconds > 0 {
				w.Header().Set("Cache-Control", value)
				w = &noStoreOnError{ResponseWriter: w}
			}
			next.ServeHTTP(w, r)
		})
	}
}

// noStoreOnError switches Cache-Control to no-store when the handler answers
// with an error status.
type noStoreOnError struct {
	http.ResponseWriter
	wroteHeader bool
}

func (w *noStoreOnError) WriteHeader(status int) {
	if !w.wroteHeader {
		w.wroteHeader = true
		if status >= http.StatusBadRequest {
			w.Header().Set("Cache-Control", "no-store")
		}
	}
	w.ResponseWriter.WriteHeader(status)
}

func (w *noStoreOnError) Write(b []byte) (int, error) {
	w.wroteHeader = true
	return w.ResponseWriter.Write(b)
}

// Unwrap lets http.ResponseController reach the underlying writer.
func (w *noStoreOnError) Unwrap() http.ResponseWriter {
	return w.ResponseWriter
}
