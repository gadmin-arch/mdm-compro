export const adminStatusOptions = ["draft", "published", "scheduled", "archived"]

export const employmentTypeOptions = [
  { value: "full_time", label: "Full time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "part_time", label: "Part time" },
]

type TextBlock = {
  type?: string
  text?: string
  items?: string[]
  html?: string
}

export function blocksFromText(value: string) {
  const blocks = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph", text }))

  return { blocks }
}

// Rich-text editor output is stored as a single html block inside the same
// { blocks } envelope, so old plain-text content keeps rendering unchanged.
export function blocksFromHtml(html: string) {
  const trimmed = html.trim()
  const isEmpty = !trimmed || trimmed === "<p></p>"
  return { blocks: isEmpty ? [] : [{ type: "html", html: trimmed }] }
}

// Initial editor content for a record saved before the rich-text editor
// existed: legacy blocks are converted to simple HTML so they stay editable.
export function htmlFromBlocks(value: unknown): string {
  if (!isBlockContent(value)) return ""
  return value.blocks
    .map((block) => {
      if (block.type === "html") return block.html ?? ""
      if (block.type === "heading") return `<h2>${escapeHtml(block.text ?? "")}</h2>`
      if (block.type === "quote") return `<blockquote><p>${escapeHtml(block.text ?? "")}</p></blockquote>`
      if (block.type === "list") {
        const items = (block.items ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")
        return items ? `<ul>${items}</ul>` : ""
      }
      return block.text ? `<p>${escapeHtml(block.text)}</p>` : ""
    })
    .filter(Boolean)
    .join("")
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function textFromBlocks(value: unknown) {
  if (!isBlockContent(value)) return ""
  return value.blocks
    .map((block) => {
      if (block.type === "list") {
        return (block.items ?? []).join("\n")
      }
      return block.text ?? ""
    })
    .filter(Boolean)
    .join("\n\n")
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function specsFromText(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((specs, line) => {
      const [rawKey, ...rest] = line.split(":")
      const key = rawKey?.trim()
      const specValue = rest.join(":").trim()
      if (key && specValue) specs[key] = specValue
      return specs
    }, {})
}

export function specsToText(value?: Record<string, string>) {
  return Object.entries(value ?? {})
    .map(([key, specValue]) => `${key}: ${specValue}`)
    .join("\n")
}

export function toDateTimeLocal(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

export function toIsoDateTime(value: FormDataEntryValue | null) {
  const text = String(value ?? "")
  if (!text) return null
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function isBlockContent(value: unknown): value is { blocks: TextBlock[] } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "blocks" in value &&
      Array.isArray((value as { blocks?: unknown }).blocks),
  )
}
