import { notFound } from "next/navigation"
import { AdminShell } from "@/components/admin-shell"
import { BarList, breakdownRows } from "@/components/admin/analytics/breakdown-list"
import { KpiTileSimple } from "@/components/admin/redirects/kpi-tile"
import { RedirectForm } from "@/components/admin/redirects/redirect-form"
import { RecentScansList, ScanTrendChart } from "@/components/admin/redirects/scan-widgets"
import { AdminApiError, adminFetch, type RedirectStatsResponse } from "@/lib/admin-api"
import { fmtNumber } from "@/components/admin/analytics/format"
import { saveRedirectAction } from "../actions"

export default async function EditRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ duplicated?: string }>
}) {
  const { id } = await params
  const query = await searchParams

  let data: RedirectStatsResponse | null = null
  try {
    data = await adminFetch<RedirectStatsResponse>(`/redirects/${id}/stats`, {}, "/admin/redirects")
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound()
    if (!(error instanceof AdminApiError)) throw error
  }
  if (!data) {
    return (
      <AdminShell active="redirects" breadcrumbs={[{ label: "Short Links", href: "/admin/redirects" }, { label: "Edit" }]} eyebrow="Marketing" title="Short Link">
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          The short link could not be loaded from the admin API.
        </p>
      </AdminShell>
    )
  }

  const { redirect, stats } = data

  return (
    <AdminShell active="redirects" breadcrumbs={[{ label: "Short Links", href: "/admin/redirects" }, { label: "Edit" }]} eyebrow="Marketing" title={redirect.name}>
      {query.duplicated && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          Duplicated as an inactive draft — adjust the slug and activate when ready.
        </p>
      )}

      <RedirectForm action={saveRedirectAction} redirect={redirect} mode="edit" />

      <h2 className="mt-10 font-display text-lg font-semibold text-foreground">Scan Analytics (last 30 days)</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTileSimple label="Total Scans (range)" value={fmtNumber(stats.totalScans)} />
        <KpiTileSimple label="Unique Scans" value={fmtNumber(stats.uniqueScans)} />
        <KpiTileSimple label="Lifetime Scans" value={fmtNumber(redirect.totalScans)} />
        <KpiTileSimple label="Type" value={String(redirect.redirectType)} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ScanTrendChart trend={stats.trend ?? []} title="Scans per Day" />
        <RecentScansList scans={stats.recent ?? []} showSlug={false} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <BarList title="Countries" rows={breakdownRows(stats.countries)} unit="scans" />
        <BarList title="Devices" rows={breakdownRows(stats.devices)} unit="scans" />
        <BarList title="Browsers" rows={breakdownRows(stats.browsers)} unit="scans" />
        <BarList title="Operating Systems" rows={breakdownRows(stats.os)} unit="scans" />
        <BarList title="Referrers" rows={breakdownRows(stats.referrers)} unit="scans" />
      </div>
    </AdminShell>
  )
}
