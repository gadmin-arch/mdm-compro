import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { formatDate, type NewsItem } from "@/lib/cms"

// The article body, lifted out of app/(site)/news/[slug]/page.tsx so the public
// page and the admin draft preview render from ONE definition. Purely
// presentational: no fetching, no notFound() — the caller supplies the item.
export function NewsArticleView({
  news,
  unoptimizedImage = false,
}: {
  news: NewsItem
  // Drafts can point at an image URL that next/image's remotePatterns would
  // reject; the preview opts out of optimisation rather than failing to render.
  unoptimizedImage?: boolean
}) {
  return (
    <>
      <PageHero
        eyebrow={news.category ?? "News"}
        title={news.title}
        description={news.excerpt ?? "Company update from PT Multi Daya Mitra."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: news.title }]}
      />
      <article className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {news.category && <Badge variant="outline">{news.category}</Badge>}
            <span className="text-sm text-muted-foreground">{formatDate(news.publishedAt)}</span>
          </div>
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-secondary">
            <Image
              src={news.featuredImageUrl || "/placeholder.jpg"}
              alt={news.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              unoptimized={unoptimizedImage}
            />
          </div>
          <RichText content={news.body} />
        </div>
      </article>
      <CtaBanner
        title="Have a project worth discussing?"
        description="Talk with our engineers about electrical, automation, and fire system needs."
        primaryHref="/contact"
        primaryLabel="Contact Us"
      />
    </>
  )
}
