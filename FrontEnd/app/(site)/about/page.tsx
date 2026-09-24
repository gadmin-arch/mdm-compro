import type { Metadata } from "next"
import { About } from "@/components/about"
import { Capabilities } from "@/components/capabilities"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { WhyUs } from "@/components/why-us"
import { getPage, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent } from "@/lib/sections"
import { BilingualText } from "@/components/cms/content-language"
import { buildBilingualMetadata } from "@/lib/bilingual"

export const metadata: Metadata = buildBilingualMetadata({
  title: "Tentang Kami\nAbout PT Multi Daya Mitra",
  description:
    "Profil PT Multi Daya Mitra — Didirikan tahun 2012 oleh insinyur berpengalaman, kami adalah kontraktor rekayasa elektrik, otomasi industri (PLC/SCADA), dan proteksi kebakaran terpercaya di Indonesia.\nFounded in 2012 by seasoned engineers, PT Multi Daya Mitra delivers integrated electrical, industrial automation (PLC/SCADA), and fire protection engineering across Indonesia.",
  canonicalPath: "/about",
})

export default async function AboutPage() {
  const page = await getPage("about")
  const sections = page?.status === "published" ? sectionsFromContent(page.content) : []

  if (sections.length > 0) {
    const data = await resolveSectionData(sections)
    return <SectionRenderer sections={sections} data={data} />
  }

  return (
    <>
      <PageHero
        eyebrow={<BilingualText text="EN: About Us\nID: Tentang Kami" />}
        title={<BilingualText text="EN: A team built for your most demanding electrical projects.\nID: Tim ahli berpengalaman untuk proyek kelistrikan paling menantang." />}
        description={<BilingualText text="EN: Founded in 2012 by seasoned engineers, PT Multi Daya Mitra has grown into one of East Java's largest electrical service partners — delivering across Indonesia and selected overseas assignments.\nID: Didirikan sejak tahun 2012 oleh para insinyur berpengalaman, PT Multi Daya Mitra telah berkembang menjadi salah satu mitra layanan elektrikal terdepan di Jawa Timur — melayani seluruh Indonesia dan proyek mancanegara." />}
        breadcrumbs={[
          { label: <BilingualText text="EN: Home\nID: Beranda" />, href: "/" },
          { label: <BilingualText text="EN: About\nID: Tentang Kami" /> },
        ]}
      />
      <About page={page} />
      <WhyUs />
      <Capabilities />
      <CtaBanner
        title="EN: Want to know more about our work?\nID: Ingin tahu lebih banyak tentang proyek kami?"
        description="EN: Get in touch with our team to discuss your project, request company credentials, or schedule a site assessment.\nID: Hubungi tim kami untuk mendiskusikan kebutuhan proyek Anda, meminta profil perusahaan, atau menjadwalkan survei teknis."
        primaryHref="/contact"
        primaryLabel="EN: Contact Us\nID: Hubungi Kami"
      />
    </>
  )
}
