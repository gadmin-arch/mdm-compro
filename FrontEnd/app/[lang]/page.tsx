import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { Hero } from "@/components/hero"
import { Industries } from "@/components/industries"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { Services } from "@/components/services"
import { WhyUs } from "@/components/why-us"
import { getPage, getServices, resolveSectionData } from "@/lib/cms"
import { toLocale } from "@/lib/i18n"
import { sectionsFromContent } from "@/lib/sections"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string }>
}

// CMS-managed SEO for the home page; falls back to the root layout defaults.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLocale((await params).lang)
  const page = await getPage("home")
  if (!page?.seo?.title && !page?.seo?.description) return {}
  return buildLocalizedMetadata({
    lang,
    path: "/",
    title: page.seo.title,
    description: page.seo.description,
    canonical: page.seo.canonical,
    noIndex: page.seo.noIndex,
  })
}

export default async function HomePage({ params }: Props) {
  const lang = toLocale((await params).lang)
  // A published "home" page built with the section builder replaces the
  // static composition below.
  const page = await getPage("home")
  const sections = page?.status === "published" ? sectionsFromContent(page.content) : []

  if (sections.length > 0) {
    const data = await resolveSectionData(sections)
    return <SectionRenderer sections={sections} data={data} lang={lang} />
  }

  const services = await getServices()

  return (
    <>
      <Hero lang={lang} />
      <Services services={services} lang={lang} />
      <WhyUs lang={lang} />
      <Industries lang={lang} />
      <CtaBanner
        title="EN: Ready to power your next project?\nID: Siap mewujudkan keandalan sistem kelistrikan proyek Anda?"
        description="EN: Tell us about your facility — our engineers will respond with a tailored scope, approach, and quote.\nID: Ceritakan kebutuhan fasilitas Anda — tim insinyur kami siap memberikan ruang lingkup, pendekatan teknis, serta estimasi biaya yang disesuaikan."
        primaryHref="/contact"
        primaryLabel="EN: Get in Touch\nID: Hubungi Kami"
        secondaryHref="/services"
        secondaryLabel="EN: View Services\nID: Lihat Layanan"
      />
    </>
  )
}
