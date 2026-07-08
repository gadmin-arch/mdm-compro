"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AdminApiError, adminFetch } from "@/lib/admin-api"

export async function updateProfileAction(formData: FormData) {
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  }

  const result = await adminFetch<unknown>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  }, "/admin/settings").then(() => null).catch(toCode)

  if (result) {
    redirect(`/admin/settings?error=${result}`)
  }

  revalidatePath("/admin/settings")
  redirect("/admin/settings?saved=1")
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (newPassword !== confirmPassword) {
    redirect("/admin/settings?error=password_mismatch")
  }

  const payload = {
    currentPassword,
    newPassword,
  }

  const result = await adminFetch<unknown>("/profile/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  }, "/admin/settings").then(() => null).catch(toCode)

  if (result) {
    redirect(`/admin/settings?error=${result}`)
  }

  // Clear session cookies to force re-login with new password
  const cookieStore = await cookies()
  cookieStore.delete("cms_admin_token")
  cookieStore.delete("cms_refresh_token")

  redirect("/admin/login?reset=1")
}

function toCode(error: unknown) {
  if (error instanceof AdminApiError) return error.code ?? "request_failed"
  return "request_failed"
}
