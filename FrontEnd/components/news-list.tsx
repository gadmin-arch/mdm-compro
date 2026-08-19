"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, Clock, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ListResponse, NewsItem } from "@/lib/cms"
import { fallbackNews, formatDate } from "@/lib/cms"
import { fetchNewsAction } from "@/app/(site)/news/actions"
import { container } from "@/lib/layout"

type NewsListProps = {
  initialNews?: ListResponse<NewsItem>
  searchParams?: {
    search?: string
    category?: string
    sort?: string
    featured?: boolean
    publishedDate?: string
  }
}

export function NewsList({ initialNews = fallbackNews, searchParams = {} }: NewsListProps) {
  const [extraNews, setExtraNews] = useState<NewsItem[]>([])
  const [currentPage, setCurrentPage] = useState(initialNews.pagination.page)
  const [loading, setLoading] = useState(false)

  const allItems = [...initialNews.data, ...extraNews]
  const featured = allItems.find((n) => n.featured) ?? allItems[0]
  const rest = allItems.filter((n) => n.slug !== featured?.slug)
  const hasMore = currentPage < initialNews.pagination.totalPages

  const handleLoadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const next = await fetchNewsAction({ ...searchParams, page: currentPage + 1 })
      setExtraNews((prev) => [...prev, ...next.data])
      setCurrentPage(next.pagination.page)
    } catch (error) {
      console.error("Failed to load more news:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!featured) {
    return (
      <section className="border-b border-border/60 bg-background">
        <div className={container("py-20 text-muted-foreground text-center")}>
          <p className="font-display text-lg font-semibold text-foreground mb-1">No matching articles found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search keywords.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        {/* Featured */}
        <Link
          href={`/news/${featured.slug}`}
          className="group grid gap-8 overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md lg:grid-cols-12"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary lg:col-span-7 lg:aspect-auto">
            <Image
              src={featured.featuredImageUrl || "/placeholder.jpg"}
              alt={featured.title}
              fill sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-accent/30 text-foreground hover:bg-accent/30">
                Featured
              </Badge>
              {featured.category && <Badge variant="outline">{featured.category}</Badge>}
            </div>
            <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight text-foreground text-balance sm:text-3xl">
              {featured.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {featured.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(featured.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                4 min read
              </span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Read article
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>

        {/* Grid */}
        <div className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Latest articles
            </h2>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {initialNews.pagination.total} posts
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={item.featuredImageUrl || "/placeholder.jpg"}
                    alt={item.title}
                    fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {item.category && (
                    <Badge variant="outline" className="w-fit">
                      {item.category}
                    </Badge>
                  )}
                  <h3 className="font-display text-base font-semibold leading-snug text-foreground text-pretty">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(item.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      4 min read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <Button onClick={handleLoadMore} disabled={loading} variant="outline" size="lg" className="min-w-[200px]">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
