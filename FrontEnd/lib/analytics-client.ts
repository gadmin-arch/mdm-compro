// Client-side helpers for the first-party analytics tracker. Everything here
// is anonymous: random ids in storage, no PII, no fingerprinting.

export type TrackerEvent = {
  type: "pageview" | "pageleave" | "event" | "vital" | "error"
  name?: string
  path: string
  referrer?: string
  value?: number
  scrollPct?: number
  ts: number
}

export type TrackerIdentity = {
  visitorId: string
  sessionId: string
  newVisitor: boolean
}

const VISITOR_KEY = "mdm_vid"
const SESSION_KEY = "mdm_sid"
const LAST_VIEW_KEY = "mdm_lastview"
const SESSION_GAP_MS = 30 * 60 * 1000 // 30 minutes of inactivity = new session
const REFRESH_DEDUPE_MS = 15 * 1000

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

// identity reads (or mints) the anonymous visitor + session ids. Safe to call
// often — it also refreshes the session's last-activity timestamp.
export function identity(): TrackerIdentity {
  let newVisitor = false
  let visitorId = ""
  try {
    visitorId = localStorage.getItem(VISITOR_KEY) ?? ""
    if (!visitorId) {
      visitorId = randomId()
      localStorage.setItem(VISITOR_KEY, visitorId)
      newVisitor = true
    }
  } catch {
    visitorId = "no-storage"
  }

  let sessionId = ""
  const now = Date.now()
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { id?: string; t?: number }
      if (parsed.id && parsed.t && now - parsed.t < SESSION_GAP_MS) {
        sessionId = parsed.id
      }
    }
    if (!sessionId) sessionId = randomId()
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, t: now }))
  } catch {
    sessionId = "no-storage"
  }
  return { visitorId, sessionId, newVisitor }
}

// isDuplicateView suppresses the extra pageview a quick refresh produces.
export function isDuplicateView(path: string): boolean {
  try {
    const raw = sessionStorage.getItem(LAST_VIEW_KEY)
    const now = Date.now()
    sessionStorage.setItem(LAST_VIEW_KEY, JSON.stringify({ p: path, t: now }))
    if (!raw) return false
    const parsed = JSON.parse(raw) as { p?: string; t?: number }
    return parsed.p === path && typeof parsed.t === "number" && now - parsed.t < REFRESH_DEDUPE_MS
  } catch {
    return false
  }
}

export function hasDoNotTrack(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string }
  return (
    nav.doNotTrack === "1" ||
    nav.msDoNotTrack === "1" ||
    (typeof window !== "undefined" && (window as Window & { doNotTrack?: string }).doNotTrack === "1") ||
    nav.globalPrivacyControl === true
  )
}

export function hasAdminCookie(): boolean {
  try {
    return document.cookie.split(";").some((part) => part.trim().startsWith("cms_admin_token="))
  } catch {
    return false
  }
}

type UAData = { brands?: { brand: string; version: string }[]; mobile?: boolean; platform?: string }

// describeClient derives coarse device/browser/OS labels — enough for the
// dashboard, nothing that could identify a person.
export function describeClient() {
  const ua = navigator.userAgent
  const uaData = (navigator as Navigator & { userAgentData?: UAData }).userAgentData

  let browser = "Other"
  const brand = uaData?.brands?.find((b) => !/not.?a.?brand|chromium/i.test(b.brand))?.brand
  if (brand) {
    browser = brand.replace("Google ", "").replace("Microsoft ", "")
  } else if (/edg\//i.test(ua)) browser = "Edge"
  else if (/opr\//i.test(ua)) browser = "Opera"
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet"
  else if (/firefox\//i.test(ua)) browser = "Firefox"
  else if (/chrome\//i.test(ua)) browser = "Chrome"
  else if (/safari\//i.test(ua)) browser = "Safari"

  let os = "Other"
  const platform = uaData?.platform ?? ""
  if (/windows/i.test(platform) || /windows/i.test(ua)) os = "Windows"
  else if (/android/i.test(platform) || /android/i.test(ua)) os = "Android"
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"
  else if (/mac/i.test(platform) || /mac os/i.test(ua)) os = "macOS"
  else if (/linux|cros/i.test(platform) || /linux|cros/i.test(ua)) os = /cros/i.test(ua) ? "ChromeOS" : "Linux"

  let device: "desktop" | "mobile" | "tablet" = "desktop"
  const isTablet = /ipad/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))
  const isMobile = uaData?.mobile === true || /mobi|iphone|ipod/i.test(ua)
  if (isTablet) device = "tablet"
  else if (isMobile) device = "mobile"

  const screenSize =
    typeof window !== "undefined" && window.screen
      ? `${window.screen.width}x${window.screen.height}`
      : ""

  return {
    device,
    browser,
    os,
    screen: screenSize,
    language: navigator.language || "",
  }
}

const DOWNLOAD_EXTENSIONS = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|csv|dwg)([?#]|$)/i

// classifyClick decides whether a click deserves an event, and which one.
export function classifyClick(target: EventTarget | null): { name: string; label: string } | null {
  if (!(target instanceof Element)) return null

  const tagged = target.closest<HTMLElement>("[data-analytics-event]")
  if (tagged) {
    const name = tagged.getAttribute("data-analytics-event") || "button_click"
    const label =
      tagged.getAttribute("data-analytics-label") || tagged.textContent?.trim().slice(0, 60) || ""
    return { name, label }
  }

  const anchor = target.closest<HTMLAnchorElement>("a[href]")
  if (!anchor) return null
  const href = anchor.getAttribute("href") ?? ""
  if (DOWNLOAD_EXTENSIONS.test(href)) {
    return { name: "download_file", label: href.split("/").pop()?.slice(0, 60) ?? href }
  }
  try {
    const url = new URL(anchor.href, window.location.href)
    if (url.origin !== window.location.origin && (url.protocol === "http:" || url.protocol === "https:")) {
      return { name: "external_link_click", label: url.hostname }
    }
  } catch {
    return null
  }
  return null
}
