import type { Metadata } from "next"
import { Capabilities } from "@/components/capabilities"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { Services } from "@/components/services"
import { BilingualText } from "@/components/cms/content-language"
import { getPage, getServices, resolveSectionData } from "@/lib/cms"
import type { Locale } from "@/lib/i18n"
import type { ListingQuery } from "@/lib/listing-query"
import { ListingView } from "@/components/cms/listing-view"
import { loadServicesListing } from "@/lib/listing-data"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

export async function servicesMetadata(lang: Locale): Promise<Metadata> {
  const page = await getPage("services")
  return buildLocalizedMetadata({
    lang,
    path: "/services",
    title: page?.seo?.title || {
      id: "Layanan Rekayasa Elektrik, Otomasi & Pemeliharaan Listrik",
      en: "Electrical Engineering, Automation & Maintenance Services",
    },
    description: page?.seo?.description || {
      id: "Solusi instalasi gardu kubikel 20kV, perakitan panel MV/LV, sistem otomasi PLC/SCADA, testing commissioning, dan preventive maintenance industri di Indonesia.",
      en: "Comprehensive electrical contracting, 20kV substation installation, LV/MV panel assembly, SCADA automation, and industrial maintenance services.",
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

export async function ServicesListing({ lang, query }: Props) {
  const allServicesTree = await getServices()
  const listingBlock = <ListingView listing="services" lang={lang} query={query} data={await loadServicesListing(query)} />

  const cmsPage = await getPage("services")
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
        eyebrow={<BilingualText text="EN: Our Business Units\nID: Unit Bisnis & Layanan" />}
        title={<BilingualText text="EN: Integrated Electrical, Automation & Mechanical Services\nID: Layanan Terintegrasi Elektrikal, Otomasi & Mekanikal" />}
        description={<BilingualText text="EN: From turnkey substation construction and automation integration to predictive maintenance, testing & commissioning, and mechanical supplies across Indonesia.\nID: Dari konstruksi gardu induk dan integrasi otomasi hingga pemeliharaan prediktif, testing & commissioning, serta pasokan mekanikal di seluruh Indonesia." />}
        breadcrumbs={[
          { label: <BilingualText text="EN: Home\nID: Beranda" />, href: "/" },
          { label: <BilingualText text="EN: Services\nID: Layanan" /> },
        ]}
      />
      <Services services={allServicesTree} lang={lang} />
      {listingBlock}
      <Capabilities lang={lang} />
      <CtaBanner
        title="EN: Need an engineering assessment or service quotation?\nID: Butuh asesmen teknis atau penawaran layanan?"
        description="EN: Share your plant or facility requirements and our engineering team will respond with scope, timeline, and execution plan.\nID: Sampaikan kebutuhan fasilitas pabrik Anda dan tim insinyur kami akan merespons dengan ruang lingkup, jadwal pelaksanaan, serta estimasi biaya yang komprehensif."
        primaryHref="/contact"
        primaryLabel="EN: Consult with Engineers\nID: Konsultasi dengan Insinyur"
        secondaryHref="https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20would%20like%20to%20inquire%20about%20your%20engineering%20and%20maintenance%20services."
        secondaryLabel="EN: WhatsApp Hotline\nID: Hotline WhatsApp"
      />
    </>
  )
}
