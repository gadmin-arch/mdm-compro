// Locale primitives shared by the public site, the admin editors and the
// section builder. Translatable content is a LocalizedText — one value per
// language — and is never guessed out of a single mixed-language string.
//
// Builder sections store LocalizedText objects as-is. Columns that are still
// plain TEXT (titles, summaries, SEO, menu labels) hold the canonical form
// written by serializeLocalizedText(): "EN: <en>\nID: <id>", always with both
// markers so the value is self-delimiting even when one side is empty.

export const LOCALES = ["id", "en"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "id"

export const LOCALE_LABELS: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
}

export function isLocale(value: unknown): value is Locale {
  return value === "id" || value === "en"
}

// Route params arrive as plain strings; anything unexpected is Indonesian.
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export type LocalizedText = { id?: string; en?: string }

// A plain object whose only keys are locales with string values. Envelopes
// like { bilingual, id: { blocks }, en: { blocks } } and section props objects
// do not qualify.
export function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length === 0) return false
  return entries.every(([key, entry]) => isLocale(key) && (typeof entry === "string" || entry == null))
}

// The requested language, falling back to the other one when it is empty.
// A missing translation shows the original text — it is never invented.
export function pickLocalized(value: LocalizedText | null | undefined, lang: Locale): string {
  if (!value) return ""
  const own = value[lang]?.trim()
  if (own) return own
  return (lang === "id" ? value.en : value.id)?.trim() ?? ""
}

export function localizedStatus(value: LocalizedText | null | undefined): { id: boolean; en: boolean } {
  return {
    id: Boolean(value?.id?.trim()),
    en: Boolean(value?.en?.trim()),
  }
}

// Literal "\n" sequences and CRLF show up in content imported from SQL seeds.
export function normalizeNewlines(value: string): string {
  return value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n")
}

const PAIR_EN_FIRST = /^EN[ \t]*:[ \t]*([\s\S]*?)\n[ \t]*ID[ \t]*:[ \t]?([\s\S]*)$/
const PAIR_ID_FIRST = /^ID[ \t]*:[ \t]*([\s\S]*?)\n[ \t]*EN[ \t]*:[ \t]?([\s\S]*)$/

// Parses the canonical two-marker form only ("EN: …\nID: …" or the reverse
// order). Returns null for anything else so callers can decide how to treat
// legacy strings.
export function parseMarkedPair(raw: string): LocalizedText | null {
  const text = normalizeNewlines(raw).trim()
  const enFirst = PAIR_EN_FIRST.exec(text)
  if (enFirst) return { en: enFirst[1].trim(), id: enFirst[2].trim() }
  const idFirst = PAIR_ID_FIRST.exec(text)
  if (idFirst) return { id: idFirst[1].trim(), en: idFirst[2].trim() }
  return null
}

const SINGLE_EN = /^(?:EN[ \t]*:|\[EN\]|English[ \t]*:)[ \t]*([\s\S]*)$/i
const SINGLE_ID = /^(?:ID[ \t]*:|\[ID\]|Indonesian[ \t]*:|Bahasa[ \t]*:)[ \t]*([\s\S]*)$/i
const ANY_MARKER = /(?:^|[\n\s|/;,])(?:EN[ \t]*:|\[EN\]|English[ \t]*:|ID[ \t]*:|\[ID\]|Indonesian[ \t]*:|Bahasa[ \t]*:)/i

// Strict reading for editors: the canonical pair, or a single leading marker
// with no other marker after it. Unmarked text is Indonesian (the default
// language) with no English yet. Returns null only for ambiguous legacy
// strings that carry several markers in a non-canonical layout.
export function parseMarkedText(raw: string): LocalizedText | null {
  const pair = parseMarkedPair(raw)
  if (pair) return pair
  const text = normalizeNewlines(raw).trim()
  if (!text) return {}
  const singleEn = SINGLE_EN.exec(text)
  if (singleEn) return ANY_MARKER.test(singleEn[1]) ? null : { en: singleEn[1].trim() }
  const singleId = SINGLE_ID.exec(text)
  if (singleId) return ANY_MARKER.test(singleId[1]) ? null : { id: singleId[1].trim() }
  if (ANY_MARKER.test(text)) return null
  return { id: text }
}

export function serializeLocalizedText(value: LocalizedText | null | undefined): string {
  const id = value?.id?.trim() ?? ""
  const en = value?.en?.trim() ?? ""
  if (!id && !en) return ""
  return `EN: ${en}\nID: ${id}`
}

const EXTERNAL_HREF = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i
const UNLOCALIZED_PREFIXES = ["/admin", "/api", "/_next", "/uploads"]

// Adds or strips the /en prefix on internal paths. Indonesian is the
// unprefixed default; external links, anchors and app internals pass through.
export function localizePath(href: string, lang: Locale): string {
  if (!href || EXTERNAL_HREF.test(href)) return href || "/"
  const clean = href.startsWith("/") ? href : `/${href}`
  if (UNLOCALIZED_PREFIXES.some((prefix) => clean === prefix || clean.startsWith(`${prefix}/`))) return clean
  const stripped = stripLocalePrefix(clean)
  if (lang === "id") return stripped
  return stripped === "/" ? "/en" : `/en${stripped}`
}

export function stripLocalePrefix(path: string): string {
  if (path === "/en" || path.startsWith("/en?") || path.startsWith("/en#")) return `/${path.slice(3)}`
  if (path.startsWith("/en/")) return path.slice(3)
  return path
}

export function localeFromPath(path: string): Locale {
  return path === "/en" || path.startsWith("/en/") || path.startsWith("/en?") ? "en" : "id"
}
