"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import type { MenuItem } from "@/lib/cms"

export async function saveNavigationAction(formData: FormData) {
  const version = Number(formData.get("version") ?? 0)
  let items: MenuItem[]
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]")) as MenuItem[]
  } catch {
    redirect("/admin/navigation?error=invalid")
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
    const errorCode =
      result.error.code === "version_conflict"
        ? "conflict"
        : result.error.code === "validation_error"
          ? "invalid"
          : "save_failed"
    redirect(`/admin/navigation?error=${errorCode}`)
  }

  // The menu renders in the shared site header, so purge all public pages.
  updateTag("cms")
  revalidatePath("/", "layout")
  revalidatePath("/admin/navigation")
  redirect("/admin/navigation?saved=1")
}
