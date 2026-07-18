import type { Metadata } from "next"
import { Capabilities } from "@/components/capabilities"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { Services } from "@/components/services"
import { getPage, getServices, resolveSectionData, type ContentNode } from "@/lib/cms"
import { sectionsFromContent } from "@/lib/sections"

// The service hierarchy is maintained in the CMS and must not be baked from
// fallback data when the production image is built without the API available.
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("services")
  return {
    title: page?.seo?.title || "Services — PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Electrical services, industrial automation, and fire alarm system solutions delivered by certified engineers across Indonesia.",
    alternates: page?.seo?.canonical ? { canonical: page.seo.canonical } : undefined,
    robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function ServicesPage() {
  const allServicesTree = await getServices()
  const primaryServiceSlugs = ["electrical-services", "fire-alarm", "industrial-automation"]
  const primaryServices = primaryServiceSlugs
    .map((slug) => allServicesTree.find((service) => service.slug === slug))
    .filter((service): service is ContentNode => Boolean(service))

  const cmsPage = await getPage("services")
  const sections = cmsPage?.status === "published" ? sectionsFromContent(cmsPage.content) : []
  if (sections.length > 0) {
    const data = await resolveSectionData(sections)
    return <SectionRenderer sections={sections} data={data} />
  }

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Three core services. One trusted engineering partner."
        description="From greenfield installation to long-term operation and maintenance, we deliver high-quality solutions tailored to each plant and facility."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <Services services={primaryServices} />
      <Capabilities />
      <CtaBanner
        title="Have a specific scope in mind?"
        description="Share your facility details and we'll respond with engineering scope, timeline, and a tailored quotation."
        primaryHref="/contact"
        primaryLabel="Request a Quote"
        secondaryHref="/products"
        secondaryLabel="See Products"
      />
    </>
  )
}
