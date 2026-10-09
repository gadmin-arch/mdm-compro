import { DefaultSectionIcon, sectionIcons } from "@/components/cms/section-icons"
import { items, sectionDefsByType } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"
import { container } from "@/lib/layout"

export type WhyUsProps = {
  props?: Record<string, unknown>
  lang: Locale
}

const defaults = sectionDefsByType.features.defaults

export function WhyUs({ props = {}, lang }: WhyUsProps) {
  const merged = { ...defaults, ...props }
  const eyebrow = resolveText(merged.eyebrow, lang)
  const title = resolveText(merged.title, lang)
  const description = resolveText(merged.description, lang)
  const list = items(merged, "items")
    .map((item) => ({ icon: String(item.icon ?? ""), title: resolveText(item.title, lang), body: resolveText(item.body, lang) }))
    .filter((item) => item.title || item.body)

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
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
            {description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {list.map((item, index) => {
              const Icon = sectionIcons[item.icon ?? ""] ?? DefaultSectionIcon
              return (
                <li key={`${item.title}-${index}`} className="rounded-xl border border-border bg-card p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/30 text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
