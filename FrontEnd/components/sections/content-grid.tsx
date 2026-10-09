import Image from "next/image"
import { LocalizedLink as Link } from "@/components/cms/localized-link"
import { ArrowRight } from "lucide-react"
import type { ContentNode, NewsItem } from "@/lib/cms"
import { formatDate } from "@/lib/cms-shared"
import { num, prop, str } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"
import type { SectionData } from "@/components/cms/section-renderer"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"

export function ContentGridSection({
  props,
  data,
  lang,
}: {
  props: Record<string, unknown>
  data: SectionData
  lang: Locale
}) {
  const source = str(props, "source", "services")
  const eyebrow = resolveText(prop(props, "eyebrow"), lang)
  const title = resolveText(prop(props, "title"), lang)
  const description = resolveText(prop(props, "description"), lang)
  const limit = num(props, "limit", 6)

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        {(eyebrow || title || description) && (
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
            {description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          {source === "news" ? (
            <NewsCards items={data.news.slice(0, limit)} lang={lang} />
          ) : (
            <NodeCards
              items={(source === "products" ? data.products : data.services).slice(0, limit)}
              basePath={source === "products" ? "/products" : "/services"}
              lang={lang}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function NodeCards({ items, basePath, lang }: { items: ContentNode[]; basePath: string; lang: Locale }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        <BilingualText text="EN: Content will be published soon.\nID: Konten akan segera dipublikasikan." />
      </p>
    )
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`${basePath}/${item.fullPath}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/9] bg-secondary">
              <Image
                src={item.imageUrl || "/placeholder.jpg"}
                alt={resolveText(item.title, lang)}
                fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                <BilingualText text={item.title} />
              </h3>
              {item.summary && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  <BilingualText text={item.summary} />
                </p>
              )}
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-foreground">
                <BilingualText text="EN: Learn more\nID: Pelajari selengkapnya" />
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function NewsCards({ items, lang }: { items: NewsItem[]; lang: Locale }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        <BilingualText text="EN: News will be published soon.\nID: Berita akan segera dipublikasikan." />
      </p>
    )
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/news/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/9] bg-secondary">
              <Image
                src={item.featuredImageUrl || "/placeholder.jpg"}
                alt={resolveText(item.title, lang)}
                fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs text-muted-foreground">
                {item.category && <BilingualText text={item.category} />}
                {item.category && item.publishedAt ? " · " : ""}
                {item.publishedAt ? formatDate(item.publishedAt) : ""}
              </p>
              <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground">
                <BilingualText text={item.title} />
              </h3>
              {item.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  <BilingualText text={item.excerpt} />
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
