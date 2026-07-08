import type { Metadata } from "next"
import { CareerBenefits } from "@/components/career-benefits"
import { CareerOpenings } from "@/components/career-openings"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { FilterControls } from "@/components/filter-controls"
import { Pagination } from "@/components/cms/pagination"
import { getCareers, employmentTypeLabel } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Career — PT Multi Daya Mitra",
  description:
    "Join PT Multi Daya Mitra. Open roles in electrical engineering, automation, project management, and operations across Indonesia.",
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

  return (
    <>
      <PageHero
        eyebrow="Career"
        title="Build your engineering career on real, large-scale projects."
        description="Join a team that designs, installs, and maintains the electrical and automation systems behind Indonesia's most demanding industries."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]}
      />
      <CareerBenefits />
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 bg-secondary/40">
        <FilterControls
          moduleType="careers"
          departments={departments}
          locations={locations}
          employmentTypes={employmentTypes}
        />
      </div>
      <CareerOpenings jobs={response.data} />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 bg-secondary/40">
        <Pagination page={response.pagination.page} totalPages={response.pagination.totalPages} />
      </div>
      <CtaBanner
        title="Don't see the right role?"
        description="We're always interested in meeting talented engineers and operators. Send us your CV and we'll keep you in mind."
        primaryHref="mailto:hr@multidayamitra.co.id"
        primaryLabel="Send Your CV"
      />
    </>
  )
}
