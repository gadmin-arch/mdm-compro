import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sectionDefsByType, str, records } from "@/lib/sections"
import { container } from "@/lib/layout"

export type HeroProps = {
  props?: Record<string, unknown>
}

// Defaults live in the section catalog so the builder and the static
// homepage fallback always show the same copy.
const defaults = sectionDefsByType.hero.defaults

export function Hero({ props = {} }: HeroProps) {
  const merged = { ...defaults, ...props }
  const eyebrow = str(merged, "eyebrow")
  const title = str(merged, "title")
  const highlight = str(merged, "highlight")
  const description = str(merged, "description")
  const primaryLabel = str(merged, "primaryLabel")
  const primaryHref = str(merged, "primaryHref", "/contact")
  const secondaryLabel = str(merged, "secondaryLabel")
  const secondaryHref = str(merged, "secondaryHref", "/services")
  const imageUrl = str(merged, "imageUrl", "/placeholder.jpg")
  const imageAlt = str(merged, "imageAlt")
  const cardEyebrow = str(merged, "cardEyebrow")
  const cardTitle = str(merged, "cardTitle")
  const stats = records(merged, "stats").filter((stat) => stat.value || stat.label)

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,oklch(0.92_0.01_250)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.92_0.01_250)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className={container("grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24")}>
        <div className="lg:col-span-7">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium tracking-wide text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {eyebrow}
            </span>
          )}

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            <HighlightedTitle title={title} highlight={highlight} />
          </h1>

          {description && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryLabel && (
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
            {secondaryLabel && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            )}
          </div>

          {stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8 sm:gap-10">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
            <Image
              src={imageUrl || "/placeholder.jpg"}
              alt={imageAlt}
              fill sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"
            />
          </div>

          {(cardEyebrow || cardTitle) && (
            <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
              {cardEyebrow && (
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {cardEyebrow}
                </p>
              )}
              {cardTitle && (
                <p className="mt-1 font-display text-base font-semibold leading-snug text-foreground">
                  {cardTitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
  if (!highlight) return <>{title}</>
  const index = title.toLowerCase().indexOf(highlight.toLowerCase())
  if (index < 0) return <>{title}</>

  const before = title.slice(0, index)
  const match = title.slice(index, index + highlight.length)
  const after = title.slice(index + highlight.length)

  return (
    <>
      {before}
      <span className="relative whitespace-nowrap">
        <span className="relative z-10">{match}</span>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent/60" />
      </span>
      {after}
    </>
  )
}
