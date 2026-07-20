import type { Metadata } from "next"
import { CareerBenefits } from "@/components/career-benefits"
import { CareerOpenings } from "@/components/career-openings"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { FilterControls } from "@/components/filter-controls"
import { Pagination } from "@/components/cms/pagination"
import { getCareers, getPage, employmentTypeLabel, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { container } from "@/lib/layout"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("career")
  return {
    title: page?.seo?.title || "Career — PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Join PT Multi Daya Mitra. Open roles in electrical engineering, automation, project management, and operations across Indonesia.",
    alternates: page?.seo?.canonical ? { canonical: page.seo.canonical } : undefined,
    robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

type Props = {
  searchParams: Promise<{
    search?: string
    location?: string
    department?: string
    type?: string
    sort?: string
    page?: string
  }>
}

export default async function CareerPage({ searchParams }: Props) {
  const query = await searchParams
  const search = query.search || ""
  const location = query.location || ""
  const department = query.department || ""
  const type = query.type || ""
  const sort = query.sort || ""
  const page = parseInt(query.page || "1", 10)

  // Fetch all careers once to build dropdown filter options dynamically
  const allCareers = await getCareers({ limit: 100 })
  const uniqueDepartments = Array.from(new Set(allCareers.data.map((j) => j.department))).filter(Boolean)
  const uniqueLocations = Array.from(new Set(allCareers.data.map((j) => j.location))).filter(Boolean)
  const uniqueTypes = Array.from(new Set(allCareers.data.map((j) => j.employmentType))).filter(Boolean)

  const departments = uniqueDepartments.map((d) => ({ label: d, value: d }))
  const locations = uniqueLocations.map((l) => ({ label: l, value: l }))
  const employmentTypes = uniqueTypes.map((t) => ({ label: employmentTypeLabel(t), value: t }))

  // Fetch paginated, filtered careers
  const response = await getCareers({
    search,
    location,
    department,
    type,
    sort,
    page,
    limit: 10,
  })

  // The benefits grid + automatic openings list always render — CMS sections
  // wrap around them at the `listing` marker, they can never remove them.
  const listingBlock = (
    <>
      <CareerBenefits />
      <div className={container("pt-12 bg-secondary/40")}>
        <FilterControls
          moduleType="careers"
          departments={departments}
          locations={locations}
          employmentTypes={employmentTypes}
        />
      </div>
      <CareerOpenings jobs={response.data} />
      <div className={container("pb-20 bg-secondary/40")}>
        <Pagination page={response.pagination.page} totalPages={response.pagination.totalPages} />
      </div>
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
        <SectionRenderer sections={before} data={data} />
        {listingBlock}
        <SectionRenderer sections={after} data={data} />
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Career"
        title="Build your engineering career on real, large-scale projects."
        description="Join a team that designs, installs, and maintains the electrical and automation systems behind Indonesia's most demanding industries."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]}
      />
      {listingBlock}
      <CtaBanner
        title="Don't see the right role?"
        description="We're always interested in meeting talented engineers and operators. Send us your CV and we'll keep you in mind."
        primaryHref="mailto:hr@multidayamitra.co.id"
        primaryLabel="Send Your CV"
      />
    </>
  )
}
