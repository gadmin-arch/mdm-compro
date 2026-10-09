import { DefaultSectionIcon, sectionIcons } from "@/components/cms/section-icons"
import { items, sectionDefsByType } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"
import { container } from "@/lib/layout"

export type CapabilitiesProps = {
  props?: Record<string, unknown>
  lang: Locale
}

const defaults = sectionDefsByType.capabilities.defaults

export function Capabilities({ props = {}, lang }: CapabilitiesProps) {
  const merged = { ...defaults, ...props }
  const eyebrow = resolveText(merged.eyebrow, lang)
  const title = resolveText(merged.title, lang)
  const description = resolveText(merged.description, lang)
  const list = items(merged, "items")
    .map((item) => ({ icon: String(item.icon ?? ""), label: resolveText(item.label, lang) }))
    .filter((item) => item.label)

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
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
          {description && (
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {list.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((cap, index) => {
              const Icon = sectionIcons[cap.icon ?? ""] ?? DefaultSectionIcon
              return (
                <li
                  key={`${cap.label}-${index}`}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:border-accent/60 hover:bg-accent/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-accent/30">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium leading-tight text-foreground">
                    {cap.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
