import Link from "next/link"
import { Download, Plus, Search } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { BarList } from "@/components/admin/analytics/breakdown-list"
import { RedirectsTable } from "@/components/admin/redirects/redirects-table"
import { RecentScansList, ScanTrendChart, TopLinksList } from "@/components/admin/redirects/scan-widgets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AdminApiError,
  adminFetch,
  type AdminRedirectsResponse,
  type RedirectDashboardResponse,
} from "@/lib/admin-api"

const selectClass =
  "h-9 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

export default async function AdminRedirectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; saved?: string; archived?: string; bulkArchived?: string; error?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const status = query.status?.trim() ?? ""
  const pageNum = Math.max(1, Number(query.page) || 1)
  const params = new URLSearchParams({ perPage: "20", page: String(pageNum) })
  if (q) params.set("q", q)
  if (status) params.set("status", status)

  let response: AdminRedirectsResponse | null = null
  let dashboard: RedirectDashboardResponse | null = null
  let apiError = false
  try {
    ;[response, dashboard] = await Promise.all([
      adminFetch<AdminRedirectsResponse>(`/redirects?${params}`, {}, "/admin/redirects"),
      adminFetch<RedirectDashboardResponse>("/redirects/dashboard", {}, "/admin/redirects"),
    ])
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  const message = query.saved
    ? "Short link saved."
    : query.archived
      ? "Short link archived."
      : query.bulkArchived
        ? `${query.bulkArchived} short links archived.`
        : query.error
          ? "The operation failed. Please try again."
          : ""

  return (
    <>
      <AdminPageHeader
      eyebrow="Marketing"
      title="Short Links & QR"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <a href="/api/admin/redirects/export" download>
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/redirects/new">
              <Plus className="h-4 w-4" />
              New Short Link
            </Link>
          </Button>
        </div>
      }
      />
      {message && (
        <p
          className={`mt-6 rounded-md border px-3 py-2 text-sm ${
            query.error
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border bg-background text-foreground"
          }`}
        >
          {message}
        </p>
      )}
      {apiError && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Short links could not be loaded from the admin API.
        </p>
      )}

      {dashboard && (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <ScanTrendChart trend={dashboard.trend ?? []} />
          <TopLinksList top={dashboard.top ?? []} />
          <RecentScansList scans={dashboard.recent ?? []} />
          <BarList
            title="Geographic Distribution"
            rows={(dashboard.geo ?? []).map((row) => ({ label: row.value, count: row.sessions }))}
            unit="scans"
            empty="No location data yet (needs a geo-aware proxy in production)."
          />
        </div>
      )}

      <form method="GET" action="/admin/redirects" className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="w-64 pl-9" name="q" defaultValue={q} placeholder="Search name, slug, destination..." />
        </div>
        <select className={selectClass} name="status" defaultValue={status}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
        <Button type="submit" size="sm" variant="outline">
          Filter
        </Button>
      </form>

      <RedirectsTable redirects={response?.data ?? []} />

      {response && (
        <AdminPagination
          basePath="/admin/redirects"
          page={response.pagination.page}
          totalPages={response.pagination.totalPages}
          total={response.pagination.total}
          query={{ q, status }}
        />
      )}
    </>
  )
}
