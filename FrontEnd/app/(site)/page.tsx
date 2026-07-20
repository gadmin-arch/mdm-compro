import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { Hero } from "@/components/hero"
import { Industries } from "@/components/industries"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { Services } from "@/components/services"
import { WhyUs } from "@/components/why-us"
import { getPage, getServices, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent } from "@/lib/sections"

// CMS-managed SEO for the home page; falls back to the root layout defaults.
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home")
  if (!page?.seo?.title && !page?.seo?.description) return {}
  return {
    title: page.seo.title || undefined,
    description: page.seo.description || undefined,
  }
}

export default async function HomePage() {
  // A published "home" page built with the section builder replaces the
  // static composition below.
  const page = await getPage("home")
  const sections = page?.status === "published" ? sectionsFromContent(page.content) : []

  if (sections.length > 0) {
    const data = await resolveSectionData(sections)
    return <SectionRenderer sections={sections} data={data} />
  }

  const services = await getServices()

  return (
    <>
      <Hero />
      <Services services={services} />
      <WhyUs />
      <Industries />
      <CtaBanner
        title="Ready to power your next project?"
        description="Tell us about your facility — our engineers will respond with a tailored scope, approach, and quote."
        primaryHref="/contact"
        primaryLabel="Get in Touch"
        secondaryHref="/services"
        secondaryLabel="View Services"
      />
    </>
  )
}
