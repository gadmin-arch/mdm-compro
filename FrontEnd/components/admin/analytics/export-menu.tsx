"use client"

import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

// Export the current view. CSV/XLSX stream from the API through the
// authenticated proxy; PDF uses the browser's print-to-PDF on the dashboard's
// print layout (charts and tables included, chrome hidden).
export function ExportMenu({ query }: { query: string }) {
  const base = `/api/admin/analytics/export?${query}`
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Button asChild size="sm" variant="outline">
        <a href={`${base}&format=csv&report=summary`} download>
          <Download className="h-4 w-4" />
          CSV
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={`${base}&format=csv&report=pages`} download>
          <FileText className="h-4 w-4" />
          Pages CSV
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={`${base}&format=xlsx`} download>
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </a>
      </Button>
      <Button size="sm" variant="outline" type="button" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        PDF
      </Button>
    </div>
  )
}
