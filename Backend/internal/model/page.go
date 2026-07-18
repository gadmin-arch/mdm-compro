package model

// SystemPageKeys are page keys the public site routes to directly. These rows
// are seeded by migrations and must always exist, so their keys cannot change
// and the pages cannot be archived.
var SystemPageKeys = map[string]bool{
	"home":     true,
	"about":    true,
	"contact":  true,
	"services": true,
	"products": true,
	"news":     true,
	"career":   true,
}

// IsSystemPageKey reports whether key belongs to a protected system page.
func IsSystemPageKey(key string) bool {
	return SystemPageKeys[key]
}
