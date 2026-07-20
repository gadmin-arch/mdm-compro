import Image from "next/image"
import { DefaultSectionIcon, sectionIcons } from "@/components/cms/section-icons"
import { sectionDefsByType, str, records } from "@/lib/sections"
import { container } from "@/lib/layout"

export type IndustriesProps = {
  props?: Record<string, unknown>
}

const defaults = sectionDefsByType.industries.defaults

export function Industries({ props = {} }: IndustriesProps) {
  const merged = { ...defaults, ...props }
  const eyebrow = str(merged, "eyebrow")
  const title = str(merged, "title")
  const description = str(merged, "description")
  const imageUrl = str(merged, "imageUrl", "/placeholder.jpg")
  const items = records(merged, "items").filter((item) => item.label)

  return (
    <section className="relative border-b border-border/60 bg-primary text-primary-foreground">
      <div className="absolute inset-0 -z-0 opacity-15">
        <Image src={imageUrl || "/placeholder.jpg"} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/95 to-primary" />
      </div>

      <div className={container("relative py-20")}>
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          )}
          {title && (
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">{description}</p>
          )}
        </div>

        {items.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((industry, index) => {
              const Icon = sectionIcons[industry.icon ?? ""] ?? DefaultSectionIcon
              return (
                <li
                  key={`${industry.label}-${index}`}
                  className="flex flex-col items-start gap-3 bg-primary p-5 transition-colors hover:bg-primary-foreground/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/20 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium leading-tight">{industry.label}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
