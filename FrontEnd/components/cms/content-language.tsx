"use client"

import React, { createContext, useContext, useEffect, useState, useTransition, type ReactNode } from "react"
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

export type { ContentBlock, ContentLanguage, BilingualEnvelope }
export { filterBilingualBlocks, filterBilingualHtml, filterBilingualText, extractBilingualHtml, isBilingualEnvelope }

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

  // 1. Subpath URL prefix check (/en or /en/...) — highest priority for SEO & direct links
  try {
    const pathname = window.location.pathname.toLowerCase()
    if (pathname === "/en" || pathname.startsWith("/en/")) {
      return "en"
    }
  } catch {
    // ignore
  }

  // 2. URL parameter check (?lang=id or ?lang=en)
  try {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get("lang")?.toLowerCase()
    if (urlLang === "id" || urlLang === "en") {
      return urlLang
    }
  } catch {
    // ignore
  }

  // 3. LocalStorage user preference
  try {
    const stored = localStorage.getItem(STORAGE_KEY)?.toLowerCase()
    if (stored === "id" || stored === "en") {
      return stored
    }
  } catch {
    // ignore
  }

  // 4. Cookie preference
  const cookieLang = getCookie(COOKIE_KEY)?.toLowerCase()
  if (cookieLang === "id" || cookieLang === "en") {
    return cookieLang
  }

  // 5. Browser / OS language detection
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

  // Sync if URL parameter or pathname changed
  useEffect(() => {
    const handleSync = () => {
      const detected = detectInitialLanguage()
      setLangState((current) => (current !== detected ? detected : current))
    }

    handleSync()

    window.addEventListener("popstate", handleSync)
    window.addEventListener("storage", handleSync)
    return () => {
      window.removeEventListener("popstate", handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  const setLang = (newLang: ContentLanguage) => {
    startTransition(() => {
      setLangState(newLang)
    })

    try {
      localStorage.setItem(STORAGE_KEY, newLang)
      setCookie(COOKIE_KEY, newLang)

      // Update URL subpath (/en/...) cleanly without reload
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        const currentPath = url.pathname

        // Do not alter /admin paths
        if (!currentPath.startsWith("/admin")) {
          if (newLang === "en") {
            if (!currentPath.startsWith("/en")) {
              url.pathname = currentPath === "/" ? "/en" : `/en${currentPath}`
            }
          } else {
            if (currentPath === "/en") {
              url.pathname = "/"
            } else if (currentPath.startsWith("/en/")) {
              url.pathname = currentPath.slice(3)
            }
          }
          url.searchParams.delete("lang")
          window.history.replaceState(window.history.state, "", url.toString())
        } else {
          url.searchParams.set("lang", newLang)
          window.history.replaceState(window.history.state, "", url.toString())
        }
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
      >
        EN
      </button>
    </div>
  )
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

export { LocalizedLink, localizeHref, useLocalizedHref } from "./localized-link"

