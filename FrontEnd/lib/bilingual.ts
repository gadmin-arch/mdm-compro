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
    const part0IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(slashParts[0])
    const part1IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(slashParts[1])
    if (part0IsId && !part1IsId) {
      return (lang === "id" ? slashParts[0] : slashParts[1]).trim()
    }
    // English first, Indonesian second by standard convention
    return (lang === "id" ? slashParts[1] : slashParts[0]).trim()
  }

  // 3. Dual lines separated by newline (\r?\n)
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 2 && lines[0].length > 3 && lines[1].length > 3) {
    const line0IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(lines[0])
    const line1IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(lines[1])
    if (line0IsId && !line1IsId) {
      return (lang === "id" ? lines[0] : lines[1]).trim()
    }
    // English first, Indonesian second by standard convention
    return (lang === "id" ? lines[1] : lines[0]).trim()
  }

  return text
}

/**
 * Extracts distinct Indonesian and English strings from a single text field:
 * - Explicit markers: EN: ... \nID: ...
 * - Dual lines / slashes
 * - Language heuristic fallback if unmarked
 */
export function extractBilingualText(raw: string | undefined | null): { id: string; en: string } {
  if (!raw || typeof raw !== "string") return { id: "", en: "" }
  const trimmed = raw.trim()
  if (!trimmed) return { id: "", en: "" }

  const idText = filterBilingualText(trimmed, "id")
  const enText = filterBilingualText(trimmed, "en")

  if (idText !== enText) {
    return { id: idText, en: enText }
  }

  // If both are identical (single language text without bilingual delimiters),
  // check if it's distinctly Indonesian or English:
  const isId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(trimmed)
  const isEn = /\b(and|the|for|with|in|on|at|by|to|from|about|of|as|services?|products?|news|careers?|assembly|testing|reliable|facilities|distribution|plant|systems?)\b/i.test(trimmed)

  if (isId && !isEn) {
    return { id: trimmed, en: "" }
  }
  if (isEn && !isId) {
    return { id: "", en: trimmed }
  }

  // Ambiguous or single short phrase: prefill both so user can edit either
  return { id: trimmed, en: trimmed }
}

/**
 * Combines distinct English and Indonesian strings into a single text representation
 * that backward-compatibly preserves both languages in a single column:
 * "EN: <English>\nID: <Indonesian>"
 */
export function combineBilingualText(values: { en?: string | null; id?: string | null }): string {
  const en = (values.en ?? "").trim()
  const id = (values.id ?? "").trim()

  if (en && id) {
    if (en === id) return en
    return `EN: ${en}\nID: ${id}`
  }
  return id || en || ""
}

/**
 * Synchronizes hyperlinks present in English content into corresponding Indonesian anchor text
 * if the Indonesian content is missing the hyperlink.
 */
export function syncBilingualLinks(idText: string | undefined | null, enText: string | undefined | null): string {
  if (!idText || typeof idText !== "string") return ""
  if (!enText || typeof enText !== "string") return idText

  // Normalize markdown links in enText: [text](url) -> <a href="url">text</a>
  const normalizedEn = enText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  let result = idText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, anchor, href) => {
    const cleanHref = href.replace(/^https?:\/\/(?:www\.)?multidayamitra\.co\.id/i, "")
    return `<a href="${cleanHref}">${anchor}</a>`
  })

  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(normalizedEn)) !== null) {
    const href = match[1].replace(/^https?:\/\/(?:www\.)?multidayamitra\.co\.id/i, "")
    if (!href) continue

    // If idText already has a link to this href, skip
    if (result.includes(href)) continue

    // Matching Indonesian patterns based on service/product href
    if (href.includes("mv-lv-cable-installation-termination")) {
      const idPattern = /(instalasi\s+(?:dan|&)\s+terminasi\s+kabel\s+MV\s*(?:&|dan)\s*LV)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("substation-mv-switchgear-installation")) {
      const idPattern = /(gardu\s+induk(?:\s+(?:dan|&)\s+mv\s+switchgear)?)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("lv-distribution-panels-assembly")) {
      const idPattern = /(perakitan\s+panel\s+LV|panel\s+distribusi\s+LV)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("fire-alarm-system-installation")) {
      const idPattern = /(sistem\s+fire\s+alarm|instalasi\s+fire\s+alarm)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("transformer-oil-treatment-dga")) {
      const idPattern = /(treatment\s+oli\s+trafo|purifikasi\s+oli\s+trafo|uji\s+DGA)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("mv-cubicle-acb-maintenance")) {
      const idPattern = /(maintenance\s+cubicle\s+MV|pemeliharaan\s+cubicle\s+MV|maintenance\s+ACB)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("partial-discharge-ultrasound-testing")) {
      const idPattern = /(pengujian\s+partial\s+discharge|partial\s+discharge|ultrasound\s+testing)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("thermography-infrared-inspection")) {
      const idPattern = /(inspeksi\s+termografi|termografi\s+infrared|thermal\s+imaging)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("electrical-turnaround-shutdown-services")) {
      const idPattern = /(turnaround|shutdown\s+listrik\s+pabrik)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
  }

  return result
}

/**
 * Filters rich text HTML containing bilingual markers (EN: / ID:) or
 * consecutive paired headings (e.g. <h2>English</h2><h2>Indonesian</h2>).
 * Returns clean HTML corresponding to the requested language.
 */
export function filterBilingualHtml(html: string | undefined | null, lang: ContentLanguage): string {
  if (!html || typeof html !== "string") return ""

  // Normalize markdown links: [text](url) -> <a href="url">text</a>
  let processedHtml = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, anchor, href) => {
    const cleanHref = href.replace(/^https?:\/\/(?:www\.)?multidayamitra\.co\.id/i, "")
    return `<a href="${cleanHref}">${anchor}</a>`
  })

  // 0. If plain text without HTML tags is passed, split paragraphs into <p> tags
  if (!/<(?:p|h[1-6]|div|ul|ol|blockquote|li|br)[^>]*>/i.test(processedHtml)) {
    processedHtml = processedHtml
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("\n")
  }

  // 1. Process inline <p> that contains both EN and ID or dual language lines
  processedHtml = processedHtml.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match: string, attrs: string, content: string) => {
    const parts = content.split(/<br\s*\/?>|\r?\n/i).map((p: string) => p.trim()).filter(Boolean)
    if (parts.length <= 1) return match

    const enMarkerRegex = /^(?:EN\s*:|\[EN\]|English\s*:)/i
    const idMarkerRegex = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i

    // Tag each line with its detected language
    type TaggedLine = { raw: string; part: string; cleaned: string; lineLang: ContentLanguage | null }
    const tagged: TaggedLine[] = parts.map((part: string) => {
      const raw = part.replace(/<[^>]+>/g, "").trim()
      let lineLang: ContentLanguage | null = null
      let cleaned = part

      if (enMarkerRegex.test(raw)) {
        lineLang = "en"
        cleaned = part.replace(
          /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:EN\s*:|\[EN\]|English\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
          ""
        )
      } else if (idMarkerRegex.test(raw)) {
        lineLang = "id"
        cleaned = part.replace(
          /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
          ""
        )
      }

      return { raw, part, cleaned, lineLang }
    })

    // Detect pairs among unmarked lines (e.g. English title followed by Indonesian title)
    for (let i = 0; i < tagged.length - 1; i++) {
      if (tagged[i].lineLang === null && tagged[i + 1].lineLang === null) {
        tagged[i].lineLang = "en"
        tagged[i + 1].lineLang = "id"
        i++
      }
    }

    // Sync links between EN and ID lines if present
    for (let i = 0; i < tagged.length - 1; i++) {
      if (tagged[i].lineLang === "en" && tagged[i + 1].lineLang === "id") {
        tagged[i + 1].cleaned = syncBilingualLinks(tagged[i + 1].cleaned, tagged[i].cleaned)
      } else if (tagged[i].lineLang === "id" && tagged[i + 1].lineLang === "en") {
        tagged[i].cleaned = syncBilingualLinks(tagged[i].cleaned, tagged[i + 1].cleaned)
      }
    }

    const hasAnyLang = tagged.some((t: TaggedLine) => t.lineLang !== null)
    if (!hasAnyLang) return match

    const kept = tagged
      .filter((t: TaggedLine) => t.lineLang === null || t.lineLang === lang)
      .map((t: TaggedLine) => t.cleaned)

    if (kept.length === 0) return ""

    // If kept has a title line (< 120 chars) and body line, separate cleanly into <h2> and <p>
    if (kept.length === 2 && kept[0].length < 120 && !kept[0].endsWith(".")) {
      return `<h2>${kept[0]}</h2><p${attrs}>${kept[1]}</p>`
    }

    return `<p${attrs}>${kept.join("<br>")}</p>`
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
  // or paired short title paragraphs (e.g. <p>English Title</p><p>Judul Indonesia</p>)
  for (let i = 0; i < blocks.length - 1; i++) {
    const cur = blocks[i]
    const next = blocks[i + 1]

    const isHeading = cur.tag.startsWith("h") && cur.tag === next.tag
    const isShortParagraphPair =
      cur.tag === "p" &&
      next.tag === "p" &&
      cur.rawText.length > 3 &&
      cur.rawText.length < 120 &&
      next.rawText.length > 3 &&
      next.rawText.length < 120 &&
      !cur.rawText.endsWith(".") &&
      !next.rawText.endsWith(".")

    if ((isHeading || isShortParagraphPair) && !cur.blockLang && !next.blockLang) {
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

    // A. Check if the block has multiline text that contains dual language lines
    if (text.includes("\n")) {
      const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      if (rawLines.length > 1) {
        type TaggedLine = { raw: string; cleaned: string; lineLang: ContentLanguage | null }
        const taggedLines: TaggedLine[] = rawLines.map((l) => {
          let lineLang: ContentLanguage | null = null
          let cleaned = l
          if (enMarkerRegex.test(l)) {
            lineLang = "en"
            cleaned = l.replace(enMarkerRegex, "").trim()
          } else if (idMarkerRegex.test(l)) {
            lineLang = "id"
            cleaned = l.replace(idMarkerRegex, "").trim()
          }
          return { raw: l, cleaned, lineLang }
        })

        for (let i = 0; i < taggedLines.length - 1; i++) {
          if (taggedLines[i].lineLang === null && taggedLines[i + 1].lineLang === null) {
            taggedLines[i].lineLang = "en"
            taggedLines[i + 1].lineLang = "id"
            i++
          }
        }

        // Sync links between EN and ID lines if present
        for (let i = 0; i < taggedLines.length - 1; i++) {
          if (taggedLines[i].lineLang === "en" && taggedLines[i + 1].lineLang === "id") {
            taggedLines[i + 1].cleaned = syncBilingualLinks(taggedLines[i + 1].cleaned, taggedLines[i].cleaned)
          } else if (taggedLines[i].lineLang === "id" && taggedLines[i + 1].lineLang === "en") {
            taggedLines[i].cleaned = syncBilingualLinks(taggedLines[i].cleaned, taggedLines[i + 1].cleaned)
          }
        }

        const hasLangLines = taggedLines.some((t) => t.lineLang !== null)
        if (hasLangLines) {
          const kept = taggedLines
            .filter((t) => t.lineLang === null || t.lineLang === lang)
            .map((t) => t.cleaned)
          cleanedText = kept.join("\n")
        }
      }
    } else {
      if (enMarkerRegex.test(text)) {
        blockLang = "en"
        cleanedText = text.replace(enMarkerRegex, "").trim()
      } else if (idMarkerRegex.test(text)) {
        blockLang = "id"
        cleanedText = text.replace(idMarkerRegex, "").trim()
      }
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

  // Detect consecutive paired headings or paired short paragraph titles
  for (let i = 0; i < tagged.length - 1; i++) {
    const cur = tagged[i]
    const next = tagged[i + 1]
    const curType = cur.original.type ?? "paragraph"
    const nextType = next.original.type ?? "paragraph"

    const isHeading = (curType === "heading" || curType === "header") && curType === nextType
    const curText = cur.cleanedBlock.text ?? ""
    const nextText = next.cleanedBlock.text ?? ""
    const isShortParagraphPair =
      (curType === "paragraph" || !curType) &&
      (nextType === "paragraph" || !nextType) &&
      curText.length > 3 &&
      curText.length < 120 &&
      nextText.length > 3 &&
      nextText.length < 120 &&
      !curText.endsWith(".") &&
      !nextText.endsWith(".")

    if ((isHeading || isShortParagraphPair) && !cur.blockLang && !next.blockLang) {
      cur.blockLang = "en"
      next.blockLang = "id"
      i++
      continue
    }

    // Sync links between adjacent EN and ID blocks
    if (cur.blockLang === "en" && next.blockLang === "id") {
      const curContent = cur.cleanedBlock.html || cur.cleanedBlock.text || ""
      const nextContent = next.cleanedBlock.html || next.cleanedBlock.text || ""
      const synced = syncBilingualLinks(nextContent, curContent)
      if (synced !== nextContent) {
        if (next.cleanedBlock.html) {
          next.cleanedBlock.html = synced
        } else {
          next.cleanedBlock.text = synced
          if (next.cleanedBlock.data) next.cleanedBlock.data.text = synced
        }
      }
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
      return { id: syncBilingualLinks(idHtml, enHtml), en: enHtml }
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

  return { id: syncBilingualLinks(idHtml, enHtml), en: enHtml }
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
