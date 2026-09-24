"use client"

import React, { createContext, useContext, useEffect, useState, useTransition, type ReactNode } from "react"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export type ContentLanguage = "id" | "en"

type ContentLanguageContextType = {
  lang: ContentLanguage
  setLang: (lang: ContentLanguage) => void
  isIndonesian: boolean
}

const STORAGE_KEY = "mdm_content_lang"
const COOKIE_KEY = "mdm_content_lang"

const ContentLanguageContext = createContext<ContentLanguageContextType>({
  lang: "id",
  setLang: () => {},
  isIndonesian: true,
})

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`
}

function detectInitialLanguage(initialLang?: ContentLanguage): ContentLanguage {
  if (initialLang) return initialLang

  if (typeof window === "undefined") return "id"

  // 1. URL parameter check (?lang=id or ?lang=en) — highest priority (e.g. from Google Search)
  try {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get("lang")?.toLowerCase()
    if (urlLang === "id" || urlLang === "en") {
      return urlLang
    }
  } catch {
    // ignore
  }

  // 2. LocalStorage user preference
  try {
    const stored = localStorage.getItem(STORAGE_KEY)?.toLowerCase()
    if (stored === "id" || stored === "en") {
      return stored
    }
  } catch {
    // ignore
  }

  // 3. Cookie preference
  const cookieLang = getCookie(COOKIE_KEY)?.toLowerCase()
  if (cookieLang === "id" || cookieLang === "en") {
    return cookieLang
  }

  // 4. Browser / OS language detection
  try {
    const navLangs = navigator.languages || [navigator.language]
    for (const l of navLangs) {
      if (l && l.toLowerCase().startsWith("id")) {
        return "id"
      }
    }
  } catch {
    // ignore
  }

  // Default fallback: Indonesian (as requested for ID market by default)
  return "id"
}

export function ContentLanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode
  initialLang?: ContentLanguage
}) {
  const [lang, setLangState] = useState<ContentLanguage>(() => detectInitialLanguage(initialLang))
  const [, startTransition] = useTransition()

  // Sync on mount if URL parameter was present or changed
  useEffect(() => {
    const detected = detectInitialLanguage()
    if (detected !== lang) {
      setLangState(detected)
    }
  }, [])

  const setLang = (newLang: ContentLanguage) => {
    startTransition(() => {
      setLangState(newLang)
    })

    try {
      localStorage.setItem(STORAGE_KEY, newLang)
      setCookie(COOKIE_KEY, newLang)

      // Update URL search param without re-fetching or jumping page
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.set("lang", newLang)
        window.history.replaceState(window.history.state, "", url.toString())
      }
    } catch {
      // ignore
    }
  }

  return (
    <ContentLanguageContext.Provider
      value={{
        lang,
        setLang,
        isIndonesian: lang === "id",
      }}
    >
      {children}
    </ContentLanguageContext.Provider>
  )
}

export function useContentLanguage(): ContentLanguageContextType {
  return useContext(ContentLanguageContext)
}

export function ContentLanguageToggle({
  className,
  size = "default",
}: {
  className?: string
  size?: "sm" | "default"
}) {
  const { lang, setLang } = useContentLanguage()

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/95 p-1 shadow-2xs backdrop-blur-xs transition-colors",
        size === "sm" ? "text-xs" : "text-xs sm:text-sm",
        className
      )}
      role="group"
      aria-label="Content Language Selector / Pemilih Bahasa Konten"
    >
      <div className="flex items-center pl-2 pr-1 text-muted-foreground/80">
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={() => setLang("id")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          lang === "id"
            ? "bg-primary text-primary-foreground shadow-2xs"
            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
        )}
        aria-pressed={lang === "id"}
      >
        <span aria-hidden="true">🇮🇩</span>
        <span>Bahasa ID</span>
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          lang === "en"
            ? "bg-primary text-primary-foreground shadow-2xs"
            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
        )}
        aria-pressed={lang === "en"}
      >
        <span aria-hidden="true">🇬🇧</span>
        <span>English</span>
      </button>
    </div>
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

  // 1. Process inline <p> that contains both EN and ID separated by <br>
  let processedHtml = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, content) => {
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
 * Component to render bilingual text with automatic language detection
 */
export function BilingualText({
  text,
  as: Component = "span",
  className,
}: {
  text?: string | null
  as?: React.ElementType
  className?: string
}) {
  const { lang } = useContentLanguage()
  const content = filterBilingualText(text, lang)
  if (!content) return null
  return <Component className={className}>{content}</Component>
}
