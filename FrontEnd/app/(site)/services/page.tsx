import type { Metadata } from "next"
import { Capabilities } from "@/components/capabilities"
import { ContentList } from "@/components/cms/content-list"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Pagination } from "@/components/cms/pagination"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { FilterControls } from "@/components/filter-controls"
import { Services } from "@/components/services"
import { getPage, getServices, resolveSectionData, type ContentNode } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"

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

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    page?: string
  }>
}

export default async function ServicesPage({ searchParams }: Props) {
  const query = await searchParams
  const search = query.search || ""
  const category = query.category || ""
  const sort = query.sort || ""
  const page = parseInt(query.page || "1", 10)

  // Category chips come from the service tree roots.
  const allServicesTree = await getServices()
  const categories = allServicesTree.map((item) => ({ label: item.title, value: item.slug }))

  const primaryServiceSlugs = ["electrical-services", "fire-alarm", "industrial-automation"]
  const primaryServices = primaryServiceSlugs
    .map((slug) => allServicesTree.find((service) => service.slug === slug))
    .filter((service): service is ContentNode => Boolean(service))

  // Paginated, filtered catalog of every service.
  const response = await getServices({ search, category, sort, page, limit: 9 })
  const services = response.data

  // The automatic catalog block always renders — CMS sections wrap around it
  // at the `listing` marker, they can never remove it.
  const listingBlock = (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FilterControls moduleType="services" categories={categories} />
        <div className="mt-8">
          <ContentList
            items={services}
            basePath="/services"
            empty="No services matched your search or filters."
          />
        </div>
        <Pagination page={response.pagination.page} totalPages={response.pagination.totalPages} />
      </div>
    </section>
  )

  // When the CMS "services" page has builder sections, they control everything
  // around the catalog block. Otherwise keep the built-in layout.
  const cmsPage = await getPage("services")
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
        eyebrow="Our Services"
        title="Three core services. One trusted engineering partner."
        description="From greenfield installation to long-term operation and maintenance, we deliver high-quality solutions tailored to each plant and facility."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <Services services={primaryServices} />
      {listingBlock}
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
