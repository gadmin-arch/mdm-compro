import { AdminShell } from "@/components/admin-shell"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { ResourceToolbar, resourceMessage } from "@/components/admin/resource-toolbar"
import { AdminResourceTable } from "@/components/admin/resource-table"
import { AdminApiError, adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import { deleteContentItemAction } from "../content-actions"

export default async function AdminProductsPage({
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

  let response: AdminContentResponse | null = null
  let apiError = false
  try {
    response = await adminFetch<AdminContentResponse>(`/products?${params}`, {}, "/admin/products")
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  return (
    <AdminShell active="products" eyebrow="Catalog" title="Products">
      <Message text={resourceMessage(query)} />
      {apiError && <Message destructive text="Products could not be loaded from the admin API." />}
      <ResourceToolbar addHref="/admin/products/new" addLabel="Add Product" q={q} status={status} />
      <AdminResourceTable
        basePath="/admin/products"
        deleteAction={deleteContentItemAction}
        empty="No products found."
        publicBasePath="/products"
        resource="products"
        rows={(response?.data ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          path: item.fullPath,
          status: item.status,
          version: item.version,
          meta: item.summary,
        }))}
      />
      {response && (
        <AdminPagination
          basePath="/admin/products"
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
