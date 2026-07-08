import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminApiError, adminFetch, type AdminPagesResponse } from "@/lib/admin-api"
import { PagesTable } from "@/components/admin/pages-table"

const statusOptions = ["", "draft", "published", "scheduled", "archived"]

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string; error?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const status = query.status?.trim() ?? ""
  let pages: AdminPagesResponse | null = null
  let apiError = false

  try {
    const params = new URLSearchParams({ perPage: "50" })
    if (q) params.set("q", q)
    if (status) params.set("status", status)
    pages = await adminFetch<AdminPagesResponse>(`/pages?${params}`, {}, "/admin/pages")
  } catch (error) {
    if (error instanceof AdminApiError) {
      apiError = true
    } else {
      throw error
    }
  }

  const message = query.deleted
    ? "Page archived."
    : query.error === "conflict"
      ? "This page changed elsewhere. Reload before trying again."
      : query.error === "duplicate_failed"
        ? "Page could not be duplicated."
        : query.error === "delete_failed"
          ? "Page could not be archived."
          : query.error
            ? "Pages request failed."
            : ""

  return (
    <AdminShell
      active="pages"
      eyebrow="CMS Pages"
      title="Pages"
      actions={
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      }
    >
      {message && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          {message}
        </p>
      )}

      {apiError && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Pages could not be loaded from the admin API.
        </p>
      )}

      <form className="mt-8 flex flex-col gap-3 rounded-lg border border-border bg-background p-4 md:flex-row md:items-end" method="get">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground" htmlFor="q">
            Search
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" defaultValue={q} id="q" name="q" placeholder="Title or slug" />
          </div>
        </div>
        <div className="md:w-48">
          <label className="text-sm font-medium text-foreground" htmlFor="status">
            Status
          </label>
          <AutoSubmitSelect
            className="mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={status}
            id="status"
            name="status"
            options={statusOptions.map((option) => ({ value: option, label: option || "all" }))}
          />
        </div>
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
          Filter
        </Button>
      </form>

      <PagesTable pages={pages?.data ?? []} />
    </AdminShell>
  )
}
