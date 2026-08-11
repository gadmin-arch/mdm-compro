"use server"

import { revalidatePath } from "next/cache"
import { AdminApiError, adminFetch, type AdminContactInquiry } from "@/lib/admin-api"
import type { SaveResult } from "@/lib/save-result"

// Moves an inquiry along the workflow. Returns an error descriptor instead of
// redirecting so the list can show a toast without losing the current filters.
export async function updateContactStatusAction(formData: FormData): Promise<SaveResult | void> {
  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "")
  const version = Number(formData.get("version") ?? 0)
  if (!id || !status) return { error: "save_failed" }

  try {
    await adminFetch<AdminContactInquiry>(
      `/contacts/${id}/status`,
      { method: "PUT", body: JSON.stringify({ status, version }) },
      "/admin/contacts",
    )
  } catch (error) {
    if (!(error instanceof AdminApiError)) throw error
    if (error.code === "version_conflict") return { error: "conflict" }
    if (error.status === 403) return { error: "forbidden" }
    if (error.code === "validation_error") return { error: "validation", fields: error.fields }
    return { error: "save_failed" }
  }

  revalidatePath("/admin/contacts")
  revalidatePath("/admin")
}
