"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import { adminRefreshLocation } from "@/lib/admin-auth"

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

// Mirrors validator.StrongPassword on the backend so users get a specific
// message instead of a generic validation_error.
function isStrongPassword(value: string) {
  return value.length >= 10 && /[a-zA-Z]/.test(value) && /\d/.test(value)
}

export async function revokeDeviceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (id) {
    await adminFetch(`/profile/devices/${id}`, { method: "DELETE" }, "/admin/settings").catch(() => null)
  }
  revalidatePath("/admin/settings")
  redirect("/admin/settings?saved=device_revoked")
}

export async function revokeAllDevicesAction() {
  await adminFetch("/profile/devices/revoke-all", { method: "POST" }, "/admin/settings").catch(() => null)
  // The trust cookie on this browser is now dead weight; drop it too.
  const cookieStore = await cookies()
  cookieStore.delete("cms_trusted_device")
  revalidatePath("/admin/settings")
  redirect("/admin/settings?saved=devices_revoked")
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") ?? "")
  const newPassword = String(formData.get("newPassword") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (newPassword !== confirmPassword) {
    redirect("/admin/settings?error=password_mismatch")
  }
  if (!isStrongPassword(newPassword)) {
    redirect("/admin/settings?error=weak_password")
  }

  const payload = {
    currentPassword,
    newPassword,
  }

  // The backend answers 401 invalid_current_password when the current
  // password is wrong — that is a form error, not an expired session, so
  // opt out of adminFetch's automatic 401 redirect and sort it out here.
  const result = await adminFetch<unknown>("/profile/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  }, "/admin/settings", { redirectOn401: false })
    .then(() => null)
    .catch((error) => {
      if (error instanceof AdminApiError) {
        if (error.status === 401 && error.code !== "invalid_current_password") {
          redirect(adminRefreshLocation("/admin/settings"))
        }
        if (error.code === "validation_error") return "weak_password"
        return error.code ?? "request_failed"
      }
      throw error
    })

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
