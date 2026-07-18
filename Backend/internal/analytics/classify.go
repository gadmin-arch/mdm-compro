package analytics

import (
	"net/url"
	"regexp"
	"strings"
)

// botPattern catches the crawlers and tooling that dominate junk traffic.
// Unknown bots that spoof a real browser UA slip through — acceptable for
// first-party analytics.
var botPattern = regexp.MustCompile(`(?i)bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|scanner|curl|wget|python-requests|python/|scrapy|httpclient|okhttp|java/|go-http-client|node-fetch|axios|facebookexternalhit|whatsapp|telegrambot|preview|prerender|phantom|selenium|playwright|puppeteer`)

// IsBot reports whether a user agent looks automated. Empty UAs count as bots.
func IsBot(userAgent string) bool {
	ua := strings.TrimSpace(userAgent)
	if ua == "" {
		return true
	}
	return botPattern.MatchString(ua)
}

var searchHosts = []string{
	"google.", "bing.com", "duckduckgo.com", "yahoo.", "yandex.", "baidu.com", "ecosia.org", "brave.com", "startpage.com",
}

var socialHosts = []string{
	"facebook.com", "fb.com", "instagram.com", "twitter.com", "x.com", "t.co", "linkedin.com", "lnkd.in",
	"youtube.com", "youtu.be", "tiktok.com", "whatsapp.com", "wa.me", "t.me", "telegram.", "pinterest.", "threads.net",
}

// ClassifySource buckets a visit into direct/organic/referral/social from its
// referrer. ownHosts are this site's hostnames (internal navigation = direct).
func ClassifySource(referrer string, ownHosts []string) string {
	ref := strings.TrimSpace(referrer)
	if ref == "" {
		return "direct"
	}
	parsed, err := url.Parse(ref)
	if err != nil || parsed.Host == "" {
		return "direct"
	}
	host := strings.ToLower(strings.TrimPrefix(parsed.Hostname(), "www."))
	for _, own := range ownHosts {
		if own != "" && host == own {
			return "direct"
		}
	}
	for _, s := range searchHosts {
		if strings.Contains(host, s) {
			return "organic"
		}
	}
	for _, s := range socialHosts {
		if strings.Contains(host, s) {
			return "social"
		}
	}
	return "referral"
}

var validDevices = map[string]bool{"desktop": true, "mobile": true, "tablet": true}

// SanitizeDevice whitelists the device class the client reported.
func SanitizeDevice(value string) string {
	v := strings.ToLower(strings.TrimSpace(value))
	if validDevices[v] {
		return v
	}
	return "desktop"
}

// Clamp trims free-text dimensions so a hostile client cannot bloat rows.
func Clamp(value string, max int) string {
	value = strings.TrimSpace(value)
	if len(value) > max {
		return value[:max]
	}
	return value
}

var validEventTypes = map[string]bool{
	"pageview": true, "pageleave": true, "event": true, "vital": true, "error": true,
}

// ValidEventType whitelists client-supplied event types ("api" is server-only).
func ValidEventType(value string) bool {
	return validEventTypes[value]
}

// ParseUserAgent derives coarse browser/OS/device labels server-side (used
// for redirect scans, which have no JS tracker to self-report).
func ParseUserAgent(userAgent string) (browser, os, device string) {
	ua := strings.ToLower(userAgent)

	browser = "Other"
	switch {
	case strings.Contains(ua, "edg/"):
		browser = "Edge"
	case strings.Contains(ua, "opr/"), strings.Contains(ua, "opera"):
		browser = "Opera"
	case strings.Contains(ua, "samsungbrowser"):
		browser = "Samsung Internet"
	case strings.Contains(ua, "firefox/"):
		browser = "Firefox"
	case strings.Contains(ua, "crios/"), strings.Contains(ua, "chrome/"):
		browser = "Chrome"
	case strings.Contains(ua, "safari/"):
		browser = "Safari"
	}

	os = "Other"
	switch {
	case strings.Contains(ua, "windows"):
		os = "Windows"
	case strings.Contains(ua, "android"):
		os = "Android"
	case strings.Contains(ua, "iphone"), strings.Contains(ua, "ipad"), strings.Contains(ua, "ipod"):
		os = "iOS"
	case strings.Contains(ua, "mac os"):
		os = "macOS"
	case strings.Contains(ua, "cros"):
		os = "ChromeOS"
	case strings.Contains(ua, "linux"):
		os = "Linux"
	}

	device = "desktop"
	isTablet := strings.Contains(ua, "ipad") || (strings.Contains(ua, "android") && !strings.Contains(ua, "mobile"))
	if isTablet {
		device = "tablet"
	} else if strings.Contains(ua, "mobi") || strings.Contains(ua, "iphone") || strings.Contains(ua, "ipod") {
		device = "mobile"
	}
	return browser, os, device
}

// NormalizePath keeps only the path portion and bounds its length.
func NormalizePath(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return "/"
	}
	if parsed, err := url.Parse(value); err == nil && parsed.Path != "" {
		value = parsed.Path
	}
	if !strings.HasPrefix(value, "/") {
		value = "/" + value
	}
	return Clamp(value, 200)
}
