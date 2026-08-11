// Contact workflow vocabulary. Kept out of lib/admin-api.ts because that
// module imports next/headers and can only run on the server — client
// components need these labels too.

// Mirrors the contacts_status_check constraint in the database.
export const contactStatuses = ["new", "in_progress", "resolved", "spam"] as const

export type ContactStatus = (typeof contactStatuses)[number]

export const contactStatusLabels: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  spam: "Spam",
}
