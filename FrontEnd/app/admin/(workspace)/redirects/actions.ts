"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  AdminApiError,
  adminFetch,
  type AdminRedirect,
  type RedirectPayload,
} from "@/lib/admin-api"
import { slugify, toIsoDateTime } from "@/lib/admin-content"
import type { SaveResult } from "@/lib/save-result"

function payloadFromForm(formData: FormData): RedirectPayload {
  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? "")),
    destination: String(formData.get("destination") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    redirectType: Number(formData.get("redirectType")) === 301 ? 301 : 302,
    isActive: formData.get("isActive") === "on",
    expiresAt: toIsoDateTime(formData.get("expiresAt")),
  }
}

export async function saveRedirectAction(formData: FormData): Promise<SaveResult | void> {
  const id = String(formData.get("id") ?? "")
  const version = Number(formData.get("version") ?? 0)
  const payload = payloadFromForm(formData)

  const path = id ? `/redirects/${id}` : "/redirects"
  const result = await adminFetch<AdminRedirect>(
    path,
    {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(id ? { ...payload, version } : payload),
    },
    "/admin/redirects",
  )
    .then((saved) => ({ ok: true as const, saved }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    if (result.error.code === "version_conflict") {
      if (!id) return { error: "duplicate" } // create → slug collision
      // Stale version and slug collision share a 409; the server's current
      // version tells them apart.
      const current = await adminFetch<AdminRedirect>(`/redirects/${id}`, {}, "/admin/redirects")
        .catch(() => null)
      if (current && current.version !== version) {
        return { error: "conflict", serverVersion: current.version }
      }
      return { error: "duplicate" }
    }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  revalidatePath("/admin/redirects")
  redirect(`/admin/redirects?saved=1`)
}

export async function archiveRedirectAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const version = String(formData.get("version") ?? "")
  await adminFetch(`/redirects/${id}?version=${encodeURIComponent(version)}`, { method: "DELETE" }, "/admin/redirects")
    .catch(() => null)
  revalidatePath("/admin/redirects")
  redirect("/admin/redirects?archived=1")
}

export async function duplicateRedirectAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const copy = await adminFetch<AdminRedirect>(`/redirects/${id}/duplicate`, { method: "POST" }, "/admin/redirects")
    .catch(() => null)
  revalidatePath("/admin/redirects")
  if (copy) {
    redirect(`/admin/redirects/${copy.id}?duplicated=1`)
  }
  redirect("/admin/redirects?error=duplicate_failed")
}

export async function bulkDeleteRedirectsAction(formData: FormData) {
  let ids: string[] = []
  try {
    const parsed = JSON.parse(String(formData.get("ids") ?? "[]")) as unknown
    if (Array.isArray(parsed)) ids = parsed.filter((v): v is string => typeof v === "string")
  } catch {
    redirect("/admin/redirects?error=bulk_failed")
  }
  if (ids.length === 0) redirect("/admin/redirects")

  const result = await adminFetch<{ archived: number }>(
    "/redirects/bulk-delete",
    { method: "POST", body: JSON.stringify({ ids }) },
    "/admin/redirects",
  ).catch(() => null)

  revalidatePath("/admin/redirects")
  redirect(result ? `/admin/redirects?bulkArchived=${result.archived}` : "/admin/redirects?error=bulk_failed")
}
