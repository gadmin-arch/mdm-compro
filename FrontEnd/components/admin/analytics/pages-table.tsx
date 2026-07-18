import type { AnalyticsPageRow } from "@/lib/admin-api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fmtDuration, fmtNumber, fmtPct } from "@/components/admin/analytics/format"

// Content analytics per page. Engagement is a 0–100 blend of dwell time
// (40%), scroll depth (30%), and continuing to another page (30%).
export function PagesTable({ pages }: { pages: AnalyticsPageRow[] }) {
  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Content Analytics</h2>
        <p className="text-xs text-muted-foreground">Top {pages.length} pages</p>
      </div>
      {pages.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No page data in this range yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Page</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Unique</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
                <TableHead className="text-right">Scroll</TableHead>
                <TableHead className="text-right">Exit Rate</TableHead>
                <TableHead className="w-40">Engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.path}>
                  <TableCell className="max-w-[280px] truncate font-medium" title={page.path}>
                    {page.path}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{fmtNumber(page.views)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtNumber(page.uniqueViews)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtDuration(page.avgTimeSec)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtPct(page.avgScroll)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtPct(page.exitRate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2" title={`Engagement score ${page.engagement.toFixed(1)} / 100`}>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
                          style={{ width: `${Math.min(100, page.engagement)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                        {Math.round(page.engagement)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}
