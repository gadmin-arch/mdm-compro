import { filterBilingualHtml, filterBilingualText, htmlFromBlocksHelper, splitLegacyMarkers } from "@/lib/bilingual"
import {
  isLocalizedText,
  localizedStatus,
  parseMarkedText,
  pickLocalized,
  type Locale,
  type LocalizedText,
} from "@/lib/i18n"

// Bridges stored values to display text. LocalizedText objects (the current
// format) are picked directly. Strings are older content and keep going
// through filterBilingualText, which reads the canonical "EN: …\nID: …" form
// strictly and only falls back to the old heuristics for unmarked text.
export function resolveText(value: unknown, lang: Locale): string {
  if (value == null) return ""
  if (typeof value === "string") return filterBilingualText(value, lang)
  if (typeof value === "number") return String(value)
  if (isLocalizedText(value)) return pickLocalized(value, lang)
  return ""
}

// Like resolveText, but strings are only split on explicit EN:/ID: markers —
// no " | ", two-line or dictionary guessing. Used for metadata, where titles
// such as "About PT Multi Daya Mitra | Electrical …" must stay whole.
export function resolveTextStrict(value: unknown, lang: Locale): string {
  if (typeof value !== "string") return resolveText(value, lang)
  const parsed = parseMarkedText(value) ?? splitLegacyMarkers(value)
  return (parsed ? pickLocalized(parsed, lang) : "") || value.trim()
}

// One display string per entry, empty entries dropped. Accepts the current
// LocalizedText[] shape as well as older string arrays and newline lists.
export function resolveTextList(value: unknown, lang: Locale): string[] {
  const entries = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split("\n")
      : []
  return entries.map((entry) => resolveText(entry, lang).trim()).filter(Boolean)
}

// Rich text: a LocalizedText holds one HTML document per language and is
// returned untouched; legacy HTML strings still need the marker filter.
export function resolveHtml(value: unknown, lang: Locale): { html: string; legacy: boolean } {
  if (isLocalizedText(value)) return { html: pickLocalized(value, lang), legacy: false }
  if (typeof value === "string") return { html: value, legacy: true }
  return { html: "", legacy: false }
}

// Reads any stored value into editable { id, en } without guessing: objects
// pass through, marked strings split at their markers, and unmarked strings
// are Indonesian with English left empty for the editor to fill in.
export function toLocalizedText(value: unknown): Required<LocalizedText> {
  if (value == null) return { id: "", en: "" }
  if (isLocalizedText(value)) return { id: value.id ?? "", en: value.en ?? "" }
  if (typeof value === "number") return { id: String(value), en: "" }
  if (typeof value !== "string") return { id: "", en: "" }
  const parsed = parseMarkedText(value) ?? splitLegacyMarkers(value) ?? { id: value.trim() }
  return { id: parsed.id ?? "", en: parsed.en ?? "" }
}

export function toLocalizedList(value: unknown): Required<LocalizedText>[] {
  const entries = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split("\n").filter((line) => line.trim())
      : []
  return entries.map(toLocalizedText)
}

const HTML_MARKER_LINE = /(?:^|\n)[ \t]*(?:EN[ \t]*:|ID[ \t]*:|\[EN\]|\[ID\])/i

// Rich text for the editor. Only HTML that carries explicit EN:/ID: markers
// is split; anything else is treated as the Indonesian version as a whole.
export function toLocalizedHtml(value: unknown): Required<LocalizedText> {
  if (isLocalizedText(value)) return { id: value.id ?? "", en: value.en ?? "" }
  if (typeof value !== "string" || !value.trim()) return { id: "", en: "" }
  const plain = value.replace(/<[^>]+>/g, "\n")
  if (!HTML_MARKER_LINE.test(plain)) return { id: value, en: "" }
  return { id: filterBilingualHtml(value, "id"), en: filterBilingualHtml(value, "en") }
}

// Body content (news, products, services, careers) for the editors.
// Per-language envelopes — { id, en } holding HTML strings or block documents
// — map directly; a single legacy document splits only on explicit markers.
export function contentToLocalizedHtml(raw: unknown): Required<LocalizedText> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const value = raw as Record<string, unknown>
    if (("id" in value || "en" in value) && !("type" in value)) {
      const id = htmlOf(value.id)
      const en = htmlOf(value.en)
      if (id.trim() || en.trim()) return { id, en }
    }
  }
  return toLocalizedHtml(htmlOf(raw))
}

function htmlOf(value: unknown): string {
  return typeof value === "string" ? value : htmlFromBlocksHelper(value)
}

export function hasText(value: unknown): boolean {
  if (value == null) return false
  if (typeof value === "string") return value.trim().length > 0
  if (isLocalizedText(value)) {
    const status = localizedStatus(value)
    return status.id || status.en
  }
  return false
}

// Short inline copy that lives in code (labels, buttons) rather than the CMS.
export function t(lang: Locale, copy: { id: string; en: string }): string {
  return copy[lang]
}
