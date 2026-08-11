"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { AdminApiError, adminFetch, adminUpload } from "@/lib/admin-api"

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "")
  let failed = !id
  if (id) {
    try {
      await adminFetch(`/media/${id}`, { method: "DELETE" }, "/admin/media")
    } catch (error) {
      if (error instanceof AdminApiError) failed = true
      else throw error
    }
  }
  if (failed) redirect("/admin/media?error=delete_failed")
  revalidatePath("/admin/media")
  redirect("/admin/media?deleted=1")
}

export async function uploadMediaAction(formData: FormData): Promise<void> {
  const file = formData.get("file")
  let failed = !(file instanceof File) || file.size === 0
  if (!failed) {
    const payload = new FormData()
    payload.set("file", file as File)
    try {
      await adminUpload(payload, "/admin/media")
    } catch (error) {
      if (error instanceof AdminApiError) failed = true
      else throw error
    }
  }
  if (failed) redirect("/admin/media?error=upload_failed")
  revalidatePath("/admin/media")
  redirect("/admin/media?uploaded=1")
}
