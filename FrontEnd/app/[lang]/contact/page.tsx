import type { Metadata } from "next"
import { Contact } from "@/components/contact"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { getPage, resolveSectionData } from "@/lib/cms"
import { toLocale } from "@/lib/i18n"
import { sectionsFromContent } from "@/lib/sections"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLocale((await params).lang)
  const page = await getPage("contact")
  return buildLocalizedMetadata({
    lang,
    path: "/contact",
    title: page?.seo?.title || { id: "Hubungi PT Multi Daya Mitra", en: "Contact PT Multi Daya Mitra" },
    description: page?.seo?.description || {
      id: "Hubungi tim insinyur PT Multi Daya Mitra untuk konsultasi teknis, penawaran harga (RFQ) instalasi listrik 20kV, otomasi industri SCADA, dan perakitan panel.",
      en: "Contact the PT Multi Daya Mitra engineering team for technical consultations, RFQ pricing, 20kV electrical installations, SCADA automation, and panel assembly.",
    },
    canonical: page?.seo?.canonical,
    noIndex: page?.seo?.noIndex,
  })
}

export default async function ContactPage({ params }: Props) {
  const lang = toLocale((await params).lang)
  const page = await getPage("contact")
  const sections = page?.status === "published" ? sectionsFromContent(page.content) : []

  if (sections.length > 0) {
    const data = await resolveSectionData(sections)
    return <SectionRenderer sections={sections} data={data} lang={lang} />
  }

  return (
    <>
      <PageHero
        eyebrow="EN: Get in Touch\nID: Hubungi Kami"
        title="EN: Plan your next electrical or automation project with us.\nID: Rencanakan proyek kelistrikan atau otomasi Anda bersama kami."
        description="EN: Tell us about your facility and the outcomes you're after — our engineers will respond with a tailored scope, approach, and quote.\nID: Sampaikan kebutuhan fasilitas Anda — tim insinyur kami siap memberikan rekomendasi teknis, lingkup kerja, dan penawaran terbaik."
        breadcrumbs={[
          { label: "EN: Home\nID: Beranda", href: "/" },
          { label: "EN: Contact\nID: Kontak" },
        ]}
      />
      <Contact props={page?.content ?? {}} lang={lang} />
    </>
  )
}
