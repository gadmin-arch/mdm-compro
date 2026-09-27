"use client"

import { extractBilingualText, filterBilingualText } from "@/lib/bilingual"
import { useContentLanguage } from "@/components/cms/content-language"
import { cn } from "@/lib/utils"

/**
 * Renders a visual badge indicating bilingual completeness (ID & EN),
 * or alerting admins when either Indonesian or English is missing.
 */
export function BilingualStatusBadge({ title }: { title: string | undefined | null }) {
  const { isIndonesian } = useContentLanguage()

  if (!title) {
    return (
      <span
        title={isIndonesian ? "Peringatan: Judul belum diisi sama sekali" : "Warning: Title is empty"}
        className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
      >
        ⚠️ {isIndonesian ? "Kosong" : "Empty"}
      </span>
    )
  }

  const { id, en } = extractBilingualText(title)
  const hasId = Boolean(id.trim())
  const hasEn = Boolean(en.trim())

  if (hasId && hasEn) {
    return (
      <span
        title={
          isIndonesian
            ? "Lengkap: Dwi-bahasa (Bahasa Indonesia & English) terisi"
            : "Complete: Bilingual (Indonesian & English) provided"
        }
        className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
      >
        ✓ ID + EN
      </span>
    )
  }

  if (!hasId && hasEn) {
    return (
      <span
        title={
          isIndonesian
            ? "Peringatan: Versi Bahasa Indonesia belum diisi (pengunjung ID akan melihat versi English)"
            : "Warning: Indonesian version missing (ID visitors will see English fallback)"
        }
        className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
      >
        ⚠️ {isIndonesian ? "ID Kosong" : "ID Missing"}
      </span>
    )
  }

  if (hasId && !hasEn) {
    return (
      <span
        title={
          isIndonesian
            ? "Peringatan: Versi English belum diisi (pengunjung EN akan melihat versi Bahasa Indonesia)"
            : "Warning: English version missing (EN visitors will see Indonesian fallback)"
        }
        className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
      >
        ⚠️ {isIndonesian ? "EN Kosong" : "EN Missing"}
      </span>
    )
  }

  return (
    <span
      title={isIndonesian ? "Peringatan: Judul belum diisi" : "Warning: Title is empty"}
      className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
    >
      ⚠️ {isIndonesian ? "Kosong" : "Empty"}
    </span>
  )
}

/**
 * Formats a raw database title for clean display in admin tables,
 * showing the title according to the active admin language (ID / EN).
 */
export function CleanAdminTitle({
  title,
  className,
}: {
  title: string | undefined | null
  className?: string
}) {
  const { lang, isIndonesian } = useContentLanguage()
  if (!title) {
    return (
      <span className={cn("text-muted-foreground italic", className)}>
        {isIndonesian ? "Tanpa Judul" : "Untitled"}
      </span>
    )
  }
  const primary = filterBilingualText(title, lang)
  const fallback = filterBilingualText(title, lang === "id" ? "en" : "id")
  return (
    <span className={cn("font-medium text-foreground", className)}>
      {primary || fallback || title}
    </span>
  )
}

/**
 * Formats raw bilingual text (e.g. metadata, excerpt, category, description)
 * cleanly according to the active admin language (ID / EN).
 */
export function CleanAdminText({
  text,
  className,
  fallback = "-",
}: {
  text: string | undefined | null
  className?: string
  fallback?: string
}) {
  const { lang } = useContentLanguage()
  if (!text) return <span className={className}>{fallback}</span>
  const primary = filterBilingualText(text, lang)
  const fallbackText = filterBilingualText(text, lang === "id" ? "en" : "id")
  return <span className={className}>{primary || fallbackText || text}</span>
}

