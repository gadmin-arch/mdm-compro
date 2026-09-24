"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { formatDate, type NewsItem } from "@/lib/cms"
import {
  BilingualText,
  useContentLanguage,
} from "@/components/cms/content-language"

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
  const { isIndonesian } = useContentLanguage()

  return (
    <>
      <PageHero
        eyebrow={
          news.category ? (
            <BilingualText text={news.category} />
          ) : isIndonesian ? (
            "Berita"
          ) : (
            "News"
          )
        }
        title={<BilingualText text={news.title} />}
        description={
          news.excerpt ? (
            <BilingualText text={news.excerpt} />
          ) : isIndonesian ? (
            "Pembaruan informasi dan wawasan teknis dari PT Multi Daya Mitra."
          ) : (
            "Company update and technical insights from PT Multi Daya Mitra."
          )
        }
        breadcrumbs={[
          { label: isIndonesian ? "Beranda" : "Home", href: "/" },
          { label: isIndonesian ? "Berita" : "News", href: "/news" },
          { label: <BilingualText text={news.title} /> },
        ]}
      />
      <article className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-border/50 pb-6">
            {news.category && (
              <Badge variant="outline">
                <BilingualText text={news.category} />
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">{formatDate(news.publishedAt)}</span>
          </div>
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-secondary shadow-xs">
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
        title={
          isIndonesian
            ? "Punya proyek elektrikal atau otomasi yang ingin didiskusikan?"
            : "Have a project worth discussing?"
        }
        description={
          isIndonesian
            ? "Konsultasikan kebutuhan teknis kelistrikan, sistem tegangan menengah/rendah, dan otomasi industri bersama engineer kami."
            : "Talk with our engineers about electrical, automation, and fire system needs."
        }
        primaryHref="/contact"
        primaryLabel={isIndonesian ? "Hubungi Kami" : "Contact Us"}
        secondaryHref={`https://wa.me/628118303250?text=Halo%20PT%20Multi%20Daya%20Mitra,%20saya%20tertarik%20dengan%20artikel:%20${encodeURIComponent(news.title)}`}
        secondaryLabel="WhatsApp Hotline"
      />
    </>
  )
}
