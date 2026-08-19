import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { NewsList } from "@/components/news-list"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { FilterControls } from "@/components/filter-controls"
import { getNews, getPage, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { container } from "@/lib/layout"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("news")
  return {
    title: page?.seo?.title || "News & Insights — PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Latest project milestones, company updates, and engineering insights from PT Multi Daya Mitra.",
    alternates: page?.seo?.canonical ? { canonical: page.seo.canonical } : undefined,
    robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
  }
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
        .map((item) => {
          const cat = item.category!.trim()
          const val = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
          return [
            val,
            {
              label: cat,
              value: val,
            },
          ]
        }),
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

  // The automatic news feed always renders — CMS sections wrap around it at
  // the `listing` marker, they can never remove it.
  const listingBlock = (
    <>
      <div className={container("pt-12 bg-background animate-fade-in")}>
        <FilterControls
          moduleType="news"
          categories={categories}
          years={years}
        />
      </div>
      <NewsList 
        key={`${search}-${category}-${sort}-${featured ? "1" : "0"}-${publishedDate}-${page}`}
        initialNews={news} 
        searchParams={{ search, category, sort, featured, publishedDate }} 
      />
    </>
  )

  // When the CMS "news" page has builder sections, they control everything
  // around the feed. Otherwise keep the built-in layout.
  const cmsPage = await getPage("news")
  const sections = cmsPage?.status === "published" ? sectionsFromContent(cmsPage.content) : []
  if (sections.length > 0) {
    const { before, after } = splitSectionsAtListing(sections)
    const data = await resolveSectionData(sections)
    return (
      <>
        <SectionRenderer sections={before} data={data} />
        {listingBlock}
        <SectionRenderer sections={after} data={data} />
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="News & Insights"
        title="Project milestones, company updates, and field-tested insights."
        description="Stay current on what our engineers are delivering across power, oil & gas, manufacturing, and infrastructure projects."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
      />
      {listingBlock}
      <CtaBanner
        title="Have a project worth talking about?"
        description="We work with industrial owners, EPC partners, and infrastructure operators across Indonesia. Let's talk about your next milestone."
        primaryHref="/contact"
        primaryLabel="Contact Us"
      />
    </>
  )
}
