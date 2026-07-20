import { str, records } from "@/lib/sections"
import { container } from "@/lib/layout"

export function StatsSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow")
  const title = str(props, "title")
  const items = records(props, "items").filter((item) => item.value)
  if (items.length === 0) return null

  return (
    <section className="border-b border-border/60 bg-secondary/40">
      <div className={container("py-16")}>
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}
        <dl
          className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
        >
          {items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="border-l-2 border-accent pl-4">
              <dd className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                {item.value}
              </dd>
              <dt className="mt-1 text-sm text-muted-foreground">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
