import type { Metadata } from "next"
import { About } from "@/components/about"
import { Capabilities } from "@/components/capabilities"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { WhyUs } from "@/components/why-us"
import { getPage, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent } from "@/lib/sections"

export const metadata: Metadata = {
  title: "Tentang Kami | Kontraktor Listrik & Otomasi Industri — PT Multi Daya Mitra",
  description:
    "Profil PT Multi Daya Mitra — Didirikan tahun 2012 oleh insinyur berpengalaman, kami adalah kontraktor rekayasa elektrik, otomasi industri (PLC/SCADA), dan proteksi kebakaran terpercaya di Indonesia.",
  alternates: {
    canonical: "https://multidayamitra.co.id/about",
  },
}

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
        eyebrow="About Us"
        title="A team built for your most demanding electrical projects."
        description="Founded in 2012 by seasoned engineers, PT Multi Daya Mitra has grown into one of East Java's largest electrical service partners — delivering across Indonesia and selected overseas assignments."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <About page={page} />
      <WhyUs />
      <Capabilities />
      <CtaBanner
        title="Want to know more about our work?"
        description="Get in touch with our team to discuss your project, request company credentials, or schedule a site assessment."
        primaryHref="/contact"
        primaryLabel="Contact Us"
      />
    </>
  )
}
