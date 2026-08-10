import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/admin-shell"
import { FlashToast } from "@/components/admin/flash-toast"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { ResourceToolbar } from "@/components/admin/resource-toolbar"
import { AdminResourceTable } from "@/components/admin/resource-table"
import { AdminApiError, adminFetch, type AdminNewsResponse } from "@/lib/admin-api"
import { deleteNewsAction } from "../content-actions"

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; deleted?: string; error?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const status = query.status?.trim() ?? ""
  const pageNum = Math.max(1, Number(query.page) || 1)
  const params = new URLSearchParams({ perPage: "20", page: String(pageNum) })
  if (q) params.set("q", q)
  if (status) params.set("status", status)

  let response: AdminNewsResponse | null = null
  let apiError = false
  try {
    response = await adminFetch<AdminNewsResponse>(`/news?${params}`, {}, "/admin/news")
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  return (
    <AdminShell
      active="news"
      eyebrow="Editorial"
      title="News"
      actions={
        <Button asChild>
          <Link href="/admin/news/new">
            <Plus className="h-4 w-4" />
            Add News
          </Link>
        </Button>
      }
    >
      <FlashToast resource="news post" />
      {apiError && <Message destructive text="News could not be loaded from the admin API." />}
      <ResourceToolbar action="/admin/news" q={q} status={status} />
      <AdminResourceTable
        basePath="/admin/news"
        deleteAction={deleteNewsAction}
        empty="No news found."
        publicBasePath="/news"
        rows={(response?.data ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          status: item.status,
          version: item.version,
          meta: item.category || item.excerpt,
        }))}
      />
      {response && (
        <AdminPagination
          basePath="/admin/news"
          page={response.pagination.page}
          totalPages={response.pagination.totalPages}
          total={response.pagination.total}
          query={{ q, status }}
        />
      )}
    </AdminShell>
  )
}

function Message({ text, destructive = false }: { text: string; destructive?: boolean }) {
  if (!text) return null
  return (
    <p className={`mt-6 rounded-md border px-3 py-2 text-sm ${destructive ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-background text-foreground"}`}>
      {text}
    </p>
  )
}
