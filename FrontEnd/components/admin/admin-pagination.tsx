import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type AdminPaginationProps = {
  basePath: string
  page: number
  totalPages: number
  total: number
  // Active filters to preserve in the page links (empty values are dropped).
  query?: Record<string, string>
}

export function AdminPagination({ basePath, page, totalPages, total, query = {} }: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const href = (target: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value)
    }
    if (target > 1) params.set("page", String(target))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {total} item{total === 1 ? "" : "s"}
      </p>
      <div className="flex items-center gap-2">
        <PageButton disabled={page <= 1} href={href(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </PageButton>
        <PageButton disabled={page >= totalPages} href={href(page + 1)}>
          Next
          <ChevronRight className="h-4 w-4" />
        </PageButton>
      </div>
    </div>
  )
}

function PageButton({
  disabled,
  href,
  children,
}: {
  disabled: boolean
  href: string
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <Button size="sm" variant="outline" disabled>
        {children}
      </Button>
    )
  }
  return (
    <Button asChild size="sm" variant="outline">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
