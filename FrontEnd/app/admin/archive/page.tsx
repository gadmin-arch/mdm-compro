import { Search } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminApiError, adminFetch, type AdminArchiveResponse } from "@/lib/admin-api"
import { ArchiveTable } from "./archive-table"

export default async function AdminArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string; restored?: string; deleted?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  let archived: AdminArchiveResponse | null = null
  let apiError = false

  try {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    archived = await adminFetch<AdminArchiveResponse>(`/archive?${params}`, {}, "/admin/archive")
  } catch (error) {
    if (error instanceof AdminApiError) {
      apiError = true
    } else {
      throw error
    }
  }

  const message = query.restored
    ? "Item successfully restored."
    : query.deleted
      ? "Item permanently deleted."
      : query.error === "conflict"
        ? "Could not restore item because its slug/key conflicts with an active item."
        : query.error === "restore_failed"
          ? "Failed to restore item."
          : query.error === "delete_failed"
            ? "Failed to permanently delete item (it may still have active child dependencies)."
            : query.error
              ? "Archive request failed."
              : ""

  return (
    <AdminShell
      active="archive"
      eyebrow="Arsip"
      title="Archive Folder"
    >
      {message && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          {message}
        </p>
      )}

      {apiError && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Archived items could not be loaded from the admin API.
        </p>
      )}

      <form className="mt-8 flex flex-col gap-3 rounded-lg border border-border bg-background p-4 md:flex-row md:items-end" method="get">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground" htmlFor="q">
            Search Archive
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" defaultValue={q} id="q" name="q" placeholder="Search by title..." />
          </div>
        </div>
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>

      <ArchiveTable items={archived?.data ?? []} />
    </AdminShell>
  )
}
