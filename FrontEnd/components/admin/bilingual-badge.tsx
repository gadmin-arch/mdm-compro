"use client"

import { extractBilingualText, filterBilingualText } from "@/lib/bilingual"

/**
 * Renders a visual badge indicating bilingual completeness (ID & EN),
 * or alerting admins when either Indonesian or English is missing.
 */
export function BilingualStatusBadge({ title }: { title: string | undefined | null }) {
  if (!title) {
    return (
      <span
        title="Peringatan: Judul belum diisi sama sekali"
        className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
      >
        ⚠️ Kosong
      </span>
    )
  }

  const { id, en } = extractBilingualText(title)
  const hasId = Boolean(id.trim())
  const hasEn = Boolean(en.trim())

  if (hasId && hasEn) {
    return (
      <span
        title="Lengkap: Dwi-bahasa (Bahasa Indonesia & English) terisi"
        className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
      >
        ✓ ID + EN
      </span>
    )
  }

  if (!hasId && hasEn) {
    return (
      <span
        title="Peringatan: Versi Bahasa Indonesia belum diisi (pengunjung ID akan melihat versi English)"
        className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
      >
        ⚠️ ID Kosong
      </span>
    )
  }

  if (hasId && !hasEn) {
    return (
      <span
        title="Peringatan: Versi English belum diisi (pengunjung EN akan melihat versi Bahasa Indonesia)"
        className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
      >
        ⚠️ EN Kosong
      </span>
    )
  }

  return (
    <span
      title="Peringatan: Judul belum diisi"
      className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
    >
      ⚠️ Kosong
    </span>
  )
}

/**
 * Formats a raw database title for clean display in admin tables,
 * showing the primary title cleanly without raw "EN: ...\nID: ..." tags.
 */
export function CleanAdminTitle({ title }: { title: string | undefined | null }) {
  if (!title) return <span className="text-muted-foreground italic">Untitled</span>
  const displayTitle = filterBilingualText(title, "id") || filterBilingualText(title, "en") || title
  return <span className="font-medium text-foreground">{displayTitle}</span>
}
