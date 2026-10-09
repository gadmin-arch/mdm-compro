"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  type ContentBlock,
  type ContentLanguage,
  type BilingualEnvelope,
  filterBilingualBlocks,
  filterBilingualHtml,
  filterBilingualText,
  extractBilingualHtml,
  isBilingualEnvelope,
} from "@/lib/bilingual"
import { isLocale, localizePath, type LocalizedText } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"

export type { ContentBlock, ContentLanguage, BilingualEnvelope }
export { filterBilingualBlocks, filterBilingualHtml, filterBilingualText, extractBilingualHtml, isBilingualEnvelope }

type ContentLanguageContextType = {
  lang: ContentLanguage
  setLang: (lang: ContentLanguage) => void
  isIndonesian: boolean
}

const STORAGE_KEY = "mdm_content_lang"

const ContentLanguageContext = createContext<ContentLanguageContextType>({
  lang: "id",
  setLang: () => {},
  isIndonesian: true,
})

// "site": the URL decides the language — the server already rendered the
// page in it, and switching navigates to the other language's URL.
// "admin": a remembered preference that only changes previews and labels.
type Mode = "site" | "admin"

export function ContentLanguageProvider({
  children,
  initialLang,
  mode = "site",
}: {
  children: ReactNode
  initialLang?: ContentLanguage
  mode?: Mode
}) {
  const router = useRouter()
  const [adminLang, setAdminLang] = useState<ContentLanguage>(initialLang ?? "id")

  // Admin only: follow the stored preference (and changes made in other tabs).
  useEffect(() => {
    if (mode !== "admin") return
    const sync = () => {
      try {
        const fromQuery = new URLSearchParams(window.location.search).get("lang")
        const stored = fromQuery ?? localStorage.getItem(STORAGE_KEY)
        if (isLocale(stored)) setAdminLang(stored)
      } catch {
        // Storage can be unavailable (private mode); the default stays.
      }
    }
    sync()
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [mode])

  const lang: ContentLanguage = mode === "site" ? (initialLang ?? "id") : adminLang

  const setLang = useCallback(
    (next: ContentLanguage) => {
      if (mode === "site") {
        if (next === lang) return
        const { pathname, search, hash } = window.location
        router.push(localizePath(`${pathname}${search}${hash}`, next))
        return
      }
      setAdminLang(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
        const url = new URL(window.location.href)
        url.searchParams.set("lang", next)
        window.history.replaceState(window.history.state, "", url.toString())
      } catch {
        // Not persisted; the in-memory choice still applies.
      }
    },
    [lang, mode, router],
  )

  const value = useMemo(() => ({ lang, setLang, isIndonesian: lang === "id" }), [lang, setLang])

  return <ContentLanguageContext.Provider value={value}>{children}</ContentLanguageContext.Provider>
}

export function useContentLanguage(): ContentLanguageContextType {
  return useContext(ContentLanguageContext)
}

/**
 * Clean, minimalist [ ID | EN ] toggle button without flags
 */
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
        "inline-flex items-center rounded-lg border border-border/80 bg-secondary/50 p-0.5 font-medium transition-colors",
        size === "sm" ? "text-xs" : "text-xs sm:text-sm",
        className
      )}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLang("id")}
        className={cn(
          "rounded-md px-2.5 py-1 font-semibold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          lang === "id"
            ? "bg-primary text-primary-foreground shadow-2xs"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
        aria-pressed={lang === "id"}
        lang="id"
      >
        ID
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-md px-2.5 py-1 font-semibold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          lang === "en"
            ? "bg-primary text-primary-foreground shadow-2xs"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
        aria-pressed={lang === "en"}
        lang="en"
      >
        EN
      </button>
    </div>
  )
}

/**
 * Renders CMS text in the active language: LocalizedText objects or legacy
 * "EN: …\nID: …" strings.
 */
export function BilingualText({
  text,
  as: Component = "span",
  className,
}: {
  text?: string | LocalizedText | null
  as?: React.ElementType
  className?: string
}) {
  const { lang } = useContentLanguage()
  const content = resolveText(text, lang)
  if (!content) return null
  return <Component className={className}>{content}</Component>
}

export { LocalizedLink, localizeHref, useLocalizedHref, usePublicPathname } from "./localized-link"
