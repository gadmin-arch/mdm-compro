import Link from "next/link"
import { Fragment, type ReactNode } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Per-page heading rendered inside the workspace layout: breadcrumbs, eyebrow,
// title, and the page's primary actions. The surrounding chrome (sidebar, top
// bar, bottom nav) belongs to the layout so it survives navigation.
export function AdminPageHeader({
  eyebrow,
  title,
  actions,
  breadcrumbs,
}: {
  eyebrow: string
  title: string
  actions?: ReactNode
  // Trail shown above the title on detail/new pages; last item = current page.
  breadcrumbs?: Array<{ label: string; href?: string }>
}) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="pb-4">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </>
  )
}
