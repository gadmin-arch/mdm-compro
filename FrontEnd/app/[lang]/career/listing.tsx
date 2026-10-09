import type { Metadata } from "next"
import { CareerBenefits } from "@/components/career-benefits"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { BilingualText } from "@/components/cms/content-language"
import { getPage, resolveSectionData } from "@/lib/cms"
import type { Locale } from "@/lib/i18n"
import type { ListingQuery } from "@/lib/listing-query"
import { ListingView } from "@/components/cms/listing-view"
import { loadCareerListing } from "@/lib/listing-data"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

export async function careerMetadata(lang: Locale): Promise<Metadata> {
  const page = await getPage("career")
  return buildLocalizedMetadata({
    lang,
    path: "/career",
    title: page?.seo?.title || { id: "Karir & Peluang Kerja", en: "Careers & Opportunities" },
    description: page?.seo?.description || {
      id: "Bergabunglah bersama tim insinyur dan profesional PT Multi Daya Mitra dalam proyek kelistrikan dan otomasi industri terdepan di Indonesia.",
      en: "Join PT Multi Daya Mitra. Open roles in electrical engineering, automation, project management, and operations across Indonesia.",
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

export async function CareerListing({ lang, query }: Props) {
  const listingBlock = (
    <>
      <CareerBenefits />
      <ListingView listing="career" lang={lang} query={query} data={await loadCareerListing(query)} />
    </>
  )

  // When the CMS "career" page has builder sections, they control everything
  // around the openings list. Otherwise keep the built-in layout.
  const cmsPage = await getPage("career")
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
        eyebrow={<BilingualText text="EN: Career\nID: Karir" />}
        title={<BilingualText text="EN: Build your engineering career on real, large-scale projects.\nID: Bangun karir rekayasa teknik Anda dalam proyek-proyek industri nyata." />}
        description={<BilingualText text="EN: Join a team that designs, installs, and maintains the electrical and automation systems behind Indonesia's most demanding industries.\nID: Bergabunglah bersama tim yang merancang, memasang, dan memelihara sistem kelistrikan dan otomasi industri paling menantang di Indonesia." />}
        breadcrumbs={[
          { label: <BilingualText text="EN: Home\nID: Beranda" />, href: "/" },
          { label: <BilingualText text="EN: Career\nID: Karir" /> },
        ]}
      />
      {listingBlock}
      <CtaBanner
        title="EN: Don't see the right role?\nID: Tidak menemukan posisi yang sesuai?"
        description="EN: We're always interested in meeting talented engineers and operators. Send us your CV and we'll keep you in mind.\nID: Kami selalu tertarik untuk bertemu dengan para insinyur dan tenaga profesional berbakat. Kirimkan CV Anda dan kami akan menghubungi Anda saat ada posisi yang relevan."
        primaryHref="mailto:hr@multidayamitra.co.id"
        primaryLabel="EN: Send Your CV\nID: Kirimkan CV Anda"
      />
    </>
  )
}
