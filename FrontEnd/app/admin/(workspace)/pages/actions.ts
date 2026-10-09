"use server"

import { revalidatePath, revalidateTag, updateTag, refresh } from "next/cache"
import { redirect } from "next/navigation"
import {
  AdminApiError,
  adminFetch,
  type PageCreatePayload,
  type PageUpdatePayload,
} from "@/lib/admin-api"
import type { PageContent } from "@/lib/cms"
import type { SaveResult } from "@/lib/save-result"
import { serializeLocalizedText } from "@/lib/i18n"
import { toLocalizedText } from "@/lib/localized"
import { notifySearchEngines } from "@/lib/seo-indexing"

function pagePayload(formData: FormData): PageCreatePayload {
  const contentText = String(formData.get("content") ?? '{"blocks":[]}')
  let content: unknown
  try {
    content = JSON.parse(contentText)
  } catch {
    throw new Error("invalid_json")
  }

  // Stored as "EN: …\nID: …" with both markers; a missing language stays
  // empty instead of being filled in by guesswork.
  const title = serializeLocalizedText({
    id: String(formData.get("title_id") ?? ""),
    en: String(formData.get("title_en") ?? ""),
  })

  const publishedAtValue = String(formData.get("publishedAt") ?? "")
  return {
    key: String(formData.get("key") ?? ""),
    title,
    content,
    status: String(formData.get("status") ?? "draft"),
    publishedAt: publishedAtValue || null,
    seo: {
      // Serialized "EN: …\nID: …" pairs; form posts turn line breaks into CRLF.
      title: String(formData.get("seoTitle") ?? "").replace(/\r\n?/g, "\n"),
      description: String(formData.get("seoDescription") ?? "").replace(/\r\n?/g, "\n"),
      canonical: String(formData.get("seoCanonical") ?? ""),
      noIndex: formData.get("seoNoIndex") === "on",
    },
  }
}

function revalidatePagePaths(...keys: string[]) {
  // Purge every CMS fetch (pages, navigation, grids) so edits show up
  // immediately instead of waiting out the time-based revalidate window.
  try {
    revalidateTag("cms", { expire: 0 })
  } catch {
    // ignore
  }
  try {
    updateTag("cms")
  } catch {
    // ignore
  }
  try {
    refresh()
  } catch {
    // ignore
  }
  // Every public page lives under app/[lang] (/about and /en/about are the
  // same route), so revalidating that layout covers both languages.
  revalidatePath("/[lang]", "layout")
  for (const key of keys) {
    if (key) {
      notifySearchEngines(key === "home" ? "/" : `/${key}`)
    }
  }
  revalidatePath("/admin", "layout")
  revalidatePath("/admin/pages", "page")
  revalidatePath("/sitemap.xml")
}

export async function createPageAction(formData: FormData): Promise<SaveResult | void> {
  let payload: PageCreatePayload
  try {
    payload = pagePayload(formData)
  } catch {
    return { error: "validation" }
  }

  const result = await adminFetch<PageContent>(
    "/pages",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "/admin/pages/new",
  )
    .then((page) => ({ ok: true as const, page }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      return {
        ok: false as const,
        error: new AdminApiError(
          503,
          error instanceof Error ? error.message : "The admin API is temporarily unreachable.",
          "network_error",
        ),
      }
    })

  if (!result.ok) {
    // On create, a conflict can only mean the key is already taken.
    if (result.error.code === "version_conflict") return { error: "duplicate" }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  revalidatePagePaths(result.page.key)
  redirect(`/admin/pages/${result.page.id}?created=1`)
}

export async function updatePageAction(formData: FormData): Promise<SaveResult | void> {
  const id = String(formData.get("id") ?? "")
  const version = Number(formData.get("version") ?? 0)
  const oldKey = String(formData.get("oldKey") ?? "")

  if (!id) {
    return { error: "save_failed" }
  }

  let payloadBase: PageCreatePayload
  try {
    payloadBase = pagePayload(formData)
  } catch {
    return { error: "validation" }
  }

  const payload: PageUpdatePayload = {
    ...payloadBase,
    version,
  }

  const result = await adminFetch(
    `/pages/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    `/admin/pages/${id}`,
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      return {
        ok: false as const,
        error: new AdminApiError(
          503,
          error instanceof Error ? error.message : "The admin API is temporarily unreachable.",
          "network_error",
        ),
      }
    })

  if (!result.ok) {
    if (result.error.code === "version_conflict") {
      // Stale version and duplicate key both surface as version_conflict —
      // compare against the stored version to tell them apart.
      const current = await adminFetch<PageContent>(`/pages/${id}`, {}, `/admin/pages/${id}`)
        .catch(() => null)
      if (current && current.version !== version) {
        return { error: "conflict", serverVersion: current.version }
      }
      return { error: "duplicate" }
    }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  revalidatePagePaths(oldKey, payload.key)
  revalidatePath(`/admin/pages/${id}`)
  redirect(`/admin/pages/${id}?saved=1`)
}

export async function duplicatePageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) {
    redirect("/admin/pages?error=missing_id")
  }

  const source = await adminFetch<PageContent>(`/pages/${id}`, {}, "/admin/pages")
  const key = uniqueCopyKey(source.key)
  const result = await adminFetch<PageContent>(
    "/pages",
    {
      method: "POST",
      body: JSON.stringify({
        key,
        title: copyTitle(source.title),
        content: source.content,
        status: "draft",
        publishedAt: null,
        seo: source.seo ?? {},
      } satisfies PageCreatePayload),
    },
    "/admin/pages",
  )
    .then((page) => ({ ok: true as const, page }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    redirect("/admin/pages?error=duplicate_failed")
  }

  revalidatePagePaths(result.page.key)
  redirect(`/admin/pages/${result.page.id}?created=1`)
}

export async function deletePageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const version = Number(formData.get("version") ?? 0)
  const key = String(formData.get("key") ?? "")
  if (!id || version < 1) {
    redirect("/admin/pages?error=missing_id")
  }

  const result = await adminFetch<null>(
    `/pages/${id}?version=${version}`,
    { method: "DELETE" },
    "/admin/pages",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    const errorCode = result.error.code === "version_conflict" ? "conflict" : "delete_failed"
    redirect(`/admin/pages?error=${errorCode}`)
  }

  revalidatePagePaths(key)
  redirect("/admin/pages?deleted=1")
}

function uniqueCopyKey(key: string) {
  return `${key.replace(/-copy(?:-[a-z0-9]+)?$/, "")}-copy-${Date.now().toString(36)}`
}

// "Copy" is appended to each language of the duplicated page's title.
function copyTitle(title: string) {
  const value = toLocalizedText(title)
  return serializeLocalizedText({
    id: value.id ? `${value.id} (Salinan)` : "",
    en: value.en ? `${value.en} (Copy)` : "",
  })
}
