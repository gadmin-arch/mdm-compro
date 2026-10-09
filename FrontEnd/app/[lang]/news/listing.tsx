import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { BilingualText } from "@/components/cms/content-language"
import { getPage, resolveSectionData } from "@/lib/cms"
import type { Locale } from "@/lib/i18n"
import type { ListingQuery } from "@/lib/listing-query"
import { ListingView } from "@/components/cms/listing-view"
import { loadNewsListing } from "@/lib/listing-data"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

export async function newsMetadata(lang: Locale): Promise<Metadata> {
  const page = await getPage("news")
  return buildLocalizedMetadata({
    lang,
    path: "/news",
    title: page?.seo?.title || { id: "Berita & Wawasan Industri", en: "News & Engineering Insights" },
    description: page?.seo?.description || {
      id: "Pembaruan proyek, tonggak pencapaian perusahaan, dan wawasan teknis kelistrikan dari PT Multi Daya Mitra.",
      en: "Latest project milestones, company updates, and engineering insights from PT Multi Daya Mitra.",
    },
    canonical: page?.seo?.canonical,
    noIndex: page?.seo?.noIndex,
  })
}

type Props = {
  lang: Locale
  // The URL's filters and page; empty for the prerendered listing.
  query: ListingQuery
}

export async function NewsListing({ lang, query }: Props) {
  const listingBlock = <ListingView listing="news" lang={lang} query={query} data={await loadNewsListing(query)} />

  // When the CMS "news" page has builder sections, they control everything
  // around the feed. Otherwise keep the built-in layout.
  const cmsPage = await getPage("news")
  const sections = cmsPage?.status === "published" ? sectionsFromContent(cmsPage.content) : []
  if (sections.length > 0) {
    const { before, after } = splitSectionsAtListing(sections)
    const data = await resolveSectionData(sections)
    return (
      <>
        <SectionRenderer sections={before} data={data} lang={lang} />
        {listingBlock}
        <SectionRenderer sections={after} data={data} lang={lang} />
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
