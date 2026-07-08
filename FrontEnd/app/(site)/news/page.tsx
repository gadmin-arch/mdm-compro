import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { NewsList } from "@/components/news-list"
import { PageHero } from "@/components/page-hero"
import { FilterControls } from "@/components/filter-controls"
import { Pagination } from "@/components/cms/pagination"
import { getNews } from "@/lib/cms"

export const metadata: Metadata = {
  title: "News & Insights — PT Multi Daya Mitra",
  description:
    "Latest project milestones, company updates, and engineering insights from PT Multi Daya Mitra.",
}

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    page?: string
    featured?: string
    publishedDate?: string
  }>
}

export default async function NewsPage({ searchParams }: Props) {
  const query = await searchParams
  const search = query.search || ""
  const category = query.category || ""
  const sort = query.sort || ""
  const page = parseInt(query.page || "1", 10)
  const featured = query.featured === "true" ? true : undefined
  const publishedDate = query.publishedDate || ""

  const allNews = await getNews({ page: 1, limit: 100 })
  const categories = Array.from(
    new Map(
      allNews.data
        .filter((item) => item.category?.trim())
        .map((item) => [
          item.category!.trim().toLowerCase().replace(/\s+/g, "-"),
          {
            label: item.category!.trim(),
            value: item.category!.trim().toLowerCase().replace(/\s+/g, "-"),
          },
        ]),
    ).values(),
  )

  const years = Array.from(
    new Set(
      allNews.data
        .map((item) => item.publishedAt?.slice(0, 4))
        .filter((year): year is string => Boolean(year)),
    ),
  )
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({ label: year, value: year }))

  const news = await getNews({
    search,
    category,
    sort,
    page,
    limit: 9,
    featured,
    publishedDate,
  })

  return (
    <>
      <PageHero
        eyebrow="News & Insights"
        title="Project milestones, company updates, and field-tested insights."
        description="Stay current on what our engineers are delivering across power, oil & gas, manufacturing, and infrastructure projects."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 bg-background animate-fade-in">
        <FilterControls
          moduleType="news"
          categories={categories}
          years={years}
        />
      </div>
      <NewsList news={news} />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 bg-background">
        <Pagination page={news.pagination.page} totalPages={news.pagination.totalPages} />
      </div>
      <CtaBanner
        title="Have a project worth talking about?"
        description="We work with industrial owners, EPC partners, and infrastructure operators across Indonesia. Let's talk about your next milestone."
        primaryHref="/contact"
        primaryLabel="Contact Us"
      />
    </>
  )
}
