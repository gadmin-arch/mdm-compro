import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { NewsList } from "@/components/news-list"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { FilterControls } from "@/components/filter-controls"
import { BilingualText } from "@/components/cms/content-language"
import { getNews, getPage, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { container } from "@/lib/layout"

import { buildBilingualMetadata } from "@/lib/bilingual"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("news")
  return buildBilingualMetadata({
    title: page?.seo?.title || "Berita & Wawasan Industri\nNews & Engineering Insights",
    description:
      page?.seo?.description ||
      "Pembaruan proyek, tonggak pencapaian perusahaan, dan wawasan teknis kelistrikan dari PT Multi Daya Mitra.\nLatest project milestones, company updates, and engineering insights from PT Multi Daya Mitra.",
    canonicalPath: page?.seo?.canonical || "/news",
    noIndex: page?.seo?.noIndex,
  })
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
        eyebrow={<BilingualText text="EN: News & Insights\nID: Berita & Wawasan" />}
        title={<BilingualText text="EN: Project milestones, company updates, and field-tested insights.\nID: Pencapaian proyek, kabar perusahaan, dan wawasan teknis industri." />}
        description={<BilingualText text="EN: Stay current on what our engineers are delivering across power, oil & gas, manufacturing, and infrastructure projects.\nID: Pantau kontribusi teknisi kami dalam menyukseskan proyek kelistrikan, migas, manufaktur, dan infrastruktur." />}
        breadcrumbs={[
          { label: <BilingualText text="EN: Home\nID: Beranda" />, href: "/" },
          { label: <BilingualText text="EN: News\nID: Berita" /> },
        ]}
      />
      {listingBlock}
      <CtaBanner
        title="EN: Have a project worth talking about?\nID: Punya proyek yang ingin didiskusikan?"
        description="EN: We work with industrial owners, EPC partners, and infrastructure operators across Indonesia. Let's talk about your next milestone.\nID: Kami bekerja sama dengan pemilik industri, mitra EPC, dan operator infrastruktur di seluruh Indonesia. Mari diskusikan target pencapaian Anda berikutnya."
        primaryHref="/contact"
        primaryLabel="EN: Contact Us\nID: Hubungi Kami"
      />
    </>
  )
}
