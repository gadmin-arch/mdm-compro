import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { AdminApiError, adminFetch, type AdminPagesResponse } from "@/lib/admin-api"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { PagesTable } from "@/components/admin/pages-table"
import { ResourceToolbar } from "@/components/admin/resource-toolbar"

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; deleted?: string; error?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const status = query.status?.trim() ?? ""
  const pageNum = Math.max(1, Number(query.page) || 1)
  let pages: AdminPagesResponse | null = null
  let apiError = false

  try {
    const params = new URLSearchParams({ perPage: "20", page: String(pageNum) })
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
    <>
      <AdminPageHeader
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
      />
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

      <ResourceToolbar action="/admin/pages" q={q} status={status} />

      <PagesTable pages={pages?.data ?? []} />
      {pages && (
        <AdminPagination
          basePath="/admin/pages"
          page={pages.pagination.page}
          totalPages={pages.pagination.totalPages}
          total={pages.pagination.total}
          query={{ q, status }}
        />
      )}
    </>
  )
}
