import { prop, str } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"

const aspectClasses: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
}

export function EmbedSection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const title = resolveText(prop(props, "title"), lang)
  const url = str(props, "url")
  const caption = resolveText(prop(props, "caption"), lang)
  const aspect = aspectClasses[str(props, "aspect", "16/9")] ?? "aspect-video"
  if (!url) return null

  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {title && (
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
        )}
        <figure>
          <div className={`relative overflow-hidden rounded-xl border border-border bg-secondary ${aspect}`}>
            <iframe
              src={url}
              title={title || "Embedded content"}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}
