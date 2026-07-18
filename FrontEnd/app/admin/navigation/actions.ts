"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import type { MenuItem } from "@/lib/cms"
import type { SaveResult } from "@/lib/save-result"

export async function saveNavigationAction(formData: FormData): Promise<SaveResult | void> {
  const version = Number(formData.get("version") ?? 0)
  let items: MenuItem[]
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]")) as MenuItem[]
  } catch {
    return { error: "validation" }
  }

  const result = await adminFetch(
    "/navigation",
    {
      method: "PUT",
      body: JSON.stringify({ items, version }),
    },
    "/admin/navigation",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    if (result.error.code === "version_conflict") {
      const current = await adminFetch<{ version?: number }>("/navigation", {}, "/admin/navigation")
        .catch(() => null)
      return { error: "conflict", serverVersion: current?.version }
    }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  // The menu renders in the shared site header, so purge all public pages.
  updateTag("cms")
  revalidatePath("/", "layout")
  revalidatePath("/admin/navigation")
  redirect("/admin/navigation?saved=1")
}
