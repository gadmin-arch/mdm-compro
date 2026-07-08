import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ContentNode, NewsItem } from "@/lib/cms"
import { formatDate } from "@/lib/cms"
import { str, num } from "@/lib/sections"
import type { SectionData } from "@/components/cms/section-renderer"

export function ContentGridSection({
  props,
  data,
}: {
  props: Record<string, unknown>
  data: SectionData
}) {
  const source = str(props, "source", "services")
  const eyebrow = str(props, "eyebrow")
  const title = str(props, "title")
  const description = str(props, "description")
  const limit = num(props, "limit", 6)

  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="mt-10">
          {source === "news" ? (
            <NewsCards items={data.news.slice(0, limit)} />
          ) : (
            <NodeCards
              items={(source === "products" ? data.products : data.services).slice(0, limit)}
              basePath={source === "products" ? "/products" : "/services"}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function NodeCards({ items, basePath }: { items: ContentNode[]; basePath: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Content will be published soon.</p>
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
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                {item.title}
              </h3>
              {item.summary && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              )}
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-foreground">
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function NewsCards({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">News will be published soon.</p>
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
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs text-muted-foreground">
                {[item.category, formatDate(item.publishedAt)].filter(Boolean).join(" · ")}
              </p>
              <h3 className="mt-2 font-display text-base font-semibold leading-snug text-foreground">
                {item.title}
              </h3>
              {item.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
