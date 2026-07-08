"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { AdminApiError, adminFetch } from "@/lib/admin-api"

export async function restoreItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const type = String(formData.get("type") ?? "")
  
  if (!id || !type) {
    redirect("/admin/archive?error=missing_id")
  }

  const result = await adminFetch<null>(
    `/archive/${type}/${id}/restore`,
    { method: "POST" },
    "/admin/archive",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    const errorCode = result.error.code === "version_conflict" ? "conflict" : "restore_failed"
    redirect(`/admin/archive?error=${errorCode}`)
  }

  // Revalidate pages to refresh lists
  updateTag("cms")
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/archive")
  revalidatePath("/admin/pages")
  revalidatePath("/admin/services")
  revalidatePath("/admin/products")
  revalidatePath("/admin/news")
  revalidatePath("/admin/careers")
  
  redirect("/admin/archive?restored=1")
}

export async function hardDeleteItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const type = String(formData.get("type") ?? "")

  if (!id || !type) {
    redirect("/admin/archive?error=missing_id")
  }

  const result = await adminFetch<null>(
    `/archive/${type}/${id}`,
    { method: "DELETE" },
    "/admin/archive",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    redirect(`/admin/archive?error=delete_failed`)
  }

  revalidatePath("/admin/archive")
  redirect("/admin/archive?deleted=1")
}
