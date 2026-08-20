import type { Metadata } from "next"
import { Capabilities } from "@/components/capabilities"
import { ContentList } from "@/components/cms/content-list"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Pagination } from "@/components/cms/pagination"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { FilterControls } from "@/components/filter-controls"
import { Services } from "@/components/services"
import { getPage, getServices, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { container } from "@/lib/layout"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("services")
  return {
    title: page?.seo?.title || "Services & Solutions — PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Integrated electrical construction, maintenance, automation, testing & commissioning, and mechanical services by certified engineers across Indonesia.",
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

  // Paginated, filtered catalog of every service.
  const response = await getServices({ search, category, sort, page, limit: 9 })
  const services = response.data

  const listingBlock = (
    <section id="catalog" className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="rounded-md bg-primary/10 px-2.5 py-1">Service Catalog</span>
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {category
              ? `Services in ${categories.find((c) => c.value === category)?.label ?? category}`
              : "Explore All Engineering & Maintenance Services"}
          </h2>
        </div>
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
        eyebrow="Our Business Units"
        title="Integrated Electrical, Automation & Mechanical Services"
        description="From turnkey substation construction and automation integration to predictive maintenance, testing & commissioning, and mechanical supplies across Indonesia."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <Services services={allServicesTree} />
      {listingBlock}
      <Capabilities />
      <CtaBanner
        title="Need an engineering assessment or service quotation?"
        description="Share your plant or facility requirements and our engineering team will respond with scope, timeline, and execution plan."
        primaryHref="/contact"
        primaryLabel="Consult with Engineers"
        secondaryHref="https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20would%20like%20to%20inquire%20about%20your%20engineering%20and%20maintenance%20services."
        secondaryLabel="WhatsApp Hotline"
      />
    </>
  )
}
