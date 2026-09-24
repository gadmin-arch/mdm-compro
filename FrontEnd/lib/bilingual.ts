export type ContentLanguage = "id" | "en"

export type ContentBlock = {
  type?: string
  text?: string
  items?: string[]
  html?: string
  data?: {
    text?: string
    items?: string[]
    level?: number
  }
}

export type BilingualEnvelope = {
  bilingual: boolean
  id?: { blocks?: ContentBlock[] } | string | Record<string, unknown>
  en?: { blocks?: ContentBlock[] } | string | Record<string, unknown>
  blocks?: ContentBlock[]
}

export function isBilingualEnvelope(value: unknown): value is BilingualEnvelope {
  return Boolean(
    value &&
      typeof value === "object" &&
      ("id" in value || "en" in value) &&
      !("type" in value)
  )
}

/**
 * Filters plain text strings that may have bilingual patterns:
 * e.g. "EN: Title in English ID: Judul Bahasa Indonesia"
 * or "Title in English / Judul Bahasa Indonesia"
 */
export function filterBilingualText(text: string | undefined | null, lang: ContentLanguage): string {
  if (!text || typeof text !== "string") return ""

  // 1. Explicit markers: EN: ... ID: ... or [EN] ... [ID] ...
  const enMatch = text.match(/(?:^|\b)(?:EN\s*:|\[EN\]|English\s*:)\s*([\s\S]*?)(?=(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)|$)/i)
  const idMatch = text.match(/(?:^|\b)(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*([\s\S]*?)(?=(?:EN\s*:|\[EN\]|English\s*:)|$)/i)

  if (enMatch && idMatch) {
    return (lang === "id" ? idMatch[1] : enMatch[1]).trim()
  }

  // 2. Dual titles separated by " / " or " | "
  const slashParts = text.split(/\s+[\/|]\s+/)
  if (slashParts.length === 2 && slashParts[0].length > 3 && slashParts[1].length > 3) {
    // English first, Indonesian second by standard convention
    return (lang === "id" ? slashParts[1] : slashParts[0]).trim()
  }

  return text
}

/**
 * Filters rich text HTML containing bilingual markers (EN: / ID:) or
 * consecutive paired headings (e.g. <h2>English</h2><h2>Indonesian</h2>).
 * Returns clean HTML corresponding to the requested language.
 */
export function filterBilingualHtml(html: string | undefined | null, lang: ContentLanguage): string {
  if (!html || typeof html !== "string") return ""

  // 0. If plain text without HTML tags is passed, split paragraphs into <p> tags
  let processedHtml = html
  if (!/<(?:p|h[1-6]|div|ul|ol|blockquote|li|br)[^>]*>/i.test(processedHtml)) {
    processedHtml = processedHtml
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("\n")
  }

  // 1. Process inline <p> that contains both EN and ID separated by <br>
  processedHtml = processedHtml.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, content) => {
    const hasEn = /(?:^|<br\s*\/?>)\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:EN\s*:|\[EN\]|English\s*:)/i.test(content)
    const hasId = /(?:^|<br\s*\/?>)\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i.test(content)

    if (hasEn && hasId) {
      const parts = content.split(/<br\s*\/?>/i)
      const kept: string[] = []
      for (const part of parts) {
        const raw = part.replace(/<[^>]+>/g, "").trim()
        const isEn = /^(?:EN\s*:|\[EN\]|English\s*:)/i.test(raw)
        const isId = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i.test(raw)

        if ((lang === "en" && isEn) || (lang === "id" && isId)) {
          const cleaned = part.replace(
            /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:(?:EN|ID)\s*:|\[(?:EN|ID)\]|(?:English|Indonesian|Bahasa)\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
            ""
          )
          kept.push(cleaned)
        } else if (!isEn && !isId) {
          kept.push(part)
        }
      }
      return kept.length > 0 ? `<p${attrs}>${kept.join("<br>")}</p>` : ""
    }
    return match
  })

  // 2. Process list items with language markers (<li>EN: ...</li><li>ID: ...</li>)
  processedHtml = processedHtml.replace(/<li([^>]*)>([\s\S]*?)<\/li>/gi, (match, attrs, content) => {
    const raw = content.replace(/<[^>]+>/g, "").trim()
    const isEn = /^(?:EN\s*:|\[EN\]|English\s*:)/i.test(raw)
    const isId = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i.test(raw)

    if (isEn || isId) {
      if ((lang === "en" && isEn) || (lang === "id" && isId)) {
        const cleaned = content.replace(
          /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:(?:EN|ID)\s*:|\[(?:EN|ID)\]|(?:English|Indonesian|Bahasa)\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
          ""
        )
        return `<li${attrs}>${cleaned}</li>`
      }
      return "" // Drop opposite language
    }
    return match
  })

  // Clean empty <ul> and <ol> if any
  processedHtml = processedHtml.replace(/<(ul|ol)[^>]*>\s*<\/\1>/gi, "")

  // 3. Extract top-level elements: h1-h6, p, blockquote, ul, ol, div, etc.
  const blockRegex = /(<(h[1-6]|p|blockquote|ul|ol|div|table|figure)[^>]*>[\s\S]*?<\/\2>)/gi
  type ParsedBlock = { tag: string; html: string; rawText: string; blockLang: ContentLanguage | null; cleanedHtml: string }
  const blocks: ParsedBlock[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = blockRegex.exec(processedHtml)) !== null) {
    if (match.index > lastIndex) {
      const interstitial = processedHtml.slice(lastIndex, match.index).trim()
      if (interstitial) {
        blocks.push({ tag: "raw", html: interstitial, rawText: interstitial, blockLang: null, cleanedHtml: interstitial })
      }
    }
    const fullTag = match[1]
    const tag = match[2].toLowerCase()
    const rawText = fullTag.replace(/<[^>]+>/g, "").trim()
    blocks.push({ tag, html: fullTag, rawText, blockLang: null, cleanedHtml: fullTag })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < processedHtml.length) {
    const trailing = processedHtml.slice(lastIndex).trim()
    if (trailing) {
      blocks.push({ tag: "raw", html: trailing, rawText: trailing, blockLang: null, cleanedHtml: trailing })
    }
  }

  const enMarkerRegex = /^(?:EN\s*:|\[EN\]|English\s*:)/i
  const idMarkerRegex = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i

  for (const b of blocks) {
    if (enMarkerRegex.test(b.rawText)) {
      b.blockLang = "en"
      b.cleanedHtml = b.cleanedHtml.replace(
        /(<(?:p|h[1-6]|blockquote)[^>]*>)\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:EN\s*:|\[EN\]|English\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
        "$1"
      )
    } else if (idMarkerRegex.test(b.rawText)) {
      b.blockLang = "id"
      b.cleanedHtml = b.cleanedHtml.replace(
        /(<(?:p|h[1-6]|blockquote)[^>]*>)\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
        "$1"
      )
    }
  }

  // 4. Detect paired consecutive headings (e.g. <h2>English</h2><h2>Indonesian</h2>)
  for (let i = 0; i < blocks.length - 1; i++) {
    const cur = blocks[i]
    const next = blocks[i + 1]

    if (
      cur.tag.startsWith("h") &&
      cur.tag === next.tag &&
      !cur.blockLang &&
      !next.blockLang
    ) {
      cur.blockLang = "en"
      next.blockLang = "id"
      i++ // Skip next
    }
  }

  const hasAnyLangBlocks = blocks.some((b) => b.blockLang !== null)
  if (!hasAnyLangBlocks) {
    return processedHtml
  }

  return blocks
    .filter((b) => b.blockLang === null || b.blockLang === lang)
    .map((b) => b.cleanedHtml)
    .join("\n")
}

/**
 * Filters an array of CMS blocks (e.g. EditorJS / TipTap JSON blocks)
 */
export function filterBilingualBlocks(
  blocks: ContentBlock[] | undefined | null,
  lang: ContentLanguage
): ContentBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) return []

  const enMarkerRegex = /^(?:EN\s*:|\[EN\]|English\s*:)/i
  const idMarkerRegex = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i

  const tagged = blocks.map((block) => {
    const text = block.text ?? block.data?.text ?? ""
    let blockLang: ContentLanguage | null = null
    let cleanedText = text

    if (enMarkerRegex.test(text)) {
      blockLang = "en"
      cleanedText = text.replace(enMarkerRegex, "").trim()
    } else if (idMarkerRegex.test(text)) {
      blockLang = "id"
      cleanedText = text.replace(idMarkerRegex, "").trim()
    }

    let cleanedItems = block.items ?? block.data?.items
    if (Array.isArray(cleanedItems)) {
      cleanedItems = cleanedItems
        .filter((item) => {
          const isEn = enMarkerRegex.test(item)
          const isId = idMarkerRegex.test(item)
          if (!isEn && !isId) return true
          return (lang === "en" && isEn) || (lang === "id" && isId)
        })
        .map((item) => item.replace(enMarkerRegex, "").replace(idMarkerRegex, "").trim())
    }

    const cleanedHtml = block.html ? filterBilingualHtml(block.html, lang) : undefined

    return {
      original: block,
      blockLang,
      cleanedBlock: {
        ...block,
        text: cleanedText,
        html: cleanedHtml,
        items: cleanedItems,
        ...(block.data ? { data: { ...block.data, text: cleanedText, items: cleanedItems } } : {}),
      },
    }
  })

  // Detect consecutive paired headings
  for (let i = 0; i < tagged.length - 1; i++) {
    const cur = tagged[i]
    const next = tagged[i + 1]
    const curType = cur.original.type
    const nextType = next.original.type

    if (
      (curType === "heading" || curType === "header") &&
      curType === nextType &&
      !cur.blockLang &&
      !next.blockLang
    ) {
      cur.blockLang = "en"
      next.blockLang = "id"
      i++
    }
  }

  const hasAnyLang = tagged.some((b) => b.blockLang !== null)
  if (!hasAnyLang) {
    return tagged.map((t) => t.cleanedBlock)
  }

  return tagged.filter((b) => b.blockLang === null || b.blockLang === lang).map((b) => b.cleanedBlock)
}

/**
 * Extracts distinct Indonesian and English HTML from any raw content format:
 * - Dedicated envelope: { id, en }
 * - Legacy HTML with EN: and ID: tags
 * - Legacy plain text / blocks
 */
export function extractBilingualHtml(raw: unknown): { id: string; en: string } {
  if (!raw) return { id: "", en: "" }

  // 1. If raw is already an envelope with id and en
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>
    if ("id" in obj || "en" in obj) {
      const idPart = obj.id
      const enPart = obj.en
      const idHtml = typeof idPart === "string" ? idPart : htmlFromBlocksHelper(idPart)
      const enHtml = typeof enPart === "string" ? enPart : htmlFromBlocksHelper(enPart)
      return { id: idHtml, en: enHtml }
    }
  }

  // 2. If raw is legacy string or blocks
  let html = typeof raw === "string" ? raw : htmlFromBlocksHelper(raw)
  if (!html) return { id: "", en: "" }

  // Convert markdown links if any exist: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  const idHtml = filterBilingualHtml(html, "id")
  const enHtml = filterBilingualHtml(html, "en")

  if (idHtml === enHtml) {
    // If not bilingual, prefill Indonesian editor with original
    return { id: html, en: "" }
  }

  return { id: idHtml, en: enHtml }
}

function htmlFromBlocksHelper(value: unknown): string {
  if (!value || typeof value !== "object") return ""
  if ("blocks" in value && Array.isArray((value as { blocks?: unknown }).blocks)) {
    const blocks = (value as { blocks: ContentBlock[] }).blocks
    return blocks
      .map((block) => {
        if (block.type === "html") return block.html ?? ""
        if (block.type === "heading" || block.type === "header") return `<h2>${block.text ?? block.data?.text ?? ""}</h2>`
        if (block.type === "quote") return `<blockquote><p>${block.text ?? block.data?.text ?? ""}</p></blockquote>`
        if (block.type === "list") {
          const items = (block.items ?? block.data?.items ?? []).map((i) => `<li>${i}</li>`).join("")
          return items ? `<ul>${items}</ul>` : ""
        }
        const text = block.text ?? block.data?.text ?? ""
        return text ? `<p>${text}</p>` : ""
      })
      .filter(Boolean)
      .join("")
  }
  return ""
}
