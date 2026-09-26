import type { ReactNode } from "react"
import { LocalizedLink as Link } from "@/components/cms/localized-link"
import { ChevronRight } from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"

type Crumb = { label: ReactNode; href?: string }

interface PageHeroProps {
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: Crumb[]
}

export function PageHero({ eyebrow, title, description, breadcrumbs }: PageHeroProps) {
  const renderVal = (val: ReactNode) => {
    if (typeof val === "string") {
      return <BilingualText text={val} />
    }
    return val
  }

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 [background-image:linear-gradient(to_right,oklch(1_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 -z-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />

      <div className={container("relative py-16 sm:py-20 lg:py-24")}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-xs text-primary-foreground/70">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-primary-foreground/40" />}
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="transition-colors hover:text-primary-foreground">
                      {renderVal(crumb.label)}
                    </Link>
                  ) : (
                    <span className={isLast ? "font-medium text-primary-foreground" : ""}>
                      {renderVal(crumb.label)}
                    </span>
                  )}
                </span>
              )
            })}
          </nav>
        )}

        <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {renderVal(eyebrow)}
        </span>

        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
          {renderVal(title)}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            {renderVal(description)}
          </p>
        )}
      </div>
    </section>
  )
}
