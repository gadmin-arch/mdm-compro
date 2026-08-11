"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { AdminApiError, adminFetch, type AdminUser } from "@/lib/admin-api"

export async function inviteUserAction(formData: FormData) {
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "user"),
  }
  const result = await adminFetch<AdminUser>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  }, "/admin/users").then(() => null).catch(toCode)

  if (result) redirect(`/admin/users?error=${result}`)
  revalidatePath("/admin/users")
  redirect("/admin/users?invited=1")
}

export async function updateUserRoleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const role = String(formData.get("role") ?? "user")
  const result = await adminFetch<AdminUser>(`/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  }, "/admin/users").then(() => null).catch(toCode)

  if (result) redirect(`/admin/users?error=${result}`)
  revalidatePath("/admin/users")
  redirect("/admin/users?saved=1")
}

export async function deleteUserAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const result = await adminFetch<null>(`/users/${id}`, {
    method: "DELETE",
  }, "/admin/users").then(() => null).catch(toCode)

  if (result) redirect(`/admin/users?error=${result}`)
  revalidatePath("/admin/users")
  redirect("/admin/users?deleted=1")
}

function toCode(error: unknown) {
  if (error instanceof AdminApiError) return error.code ?? "request_failed"
  return "request_failed"
}
