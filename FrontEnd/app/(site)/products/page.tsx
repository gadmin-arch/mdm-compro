import type { Metadata } from "next"
import { ContentList } from "@/components/cms/content-list"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { FilterControls } from "@/components/filter-controls"
import { Pagination } from "@/components/cms/pagination"
import { getPage, getProducts, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { container } from "@/lib/layout"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("products")
  return {
    title: page?.seo?.title || "Products — PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Testing equipment, protection relay, instrumentation, and industrial electrical products from PT Multi Daya Mitra.",
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

export default async function ProductsPage({ searchParams }: Props) {
  const query = await searchParams
  const search = query.search || ""
  const category = query.category || ""
  const sort = query.sort || ""
  const page = parseInt(query.page || "1", 10)

  // Fetch all categories dynamically from tree roots
  const allProductsTree = await getProducts()
  const categories = allProductsTree.map((item) => ({
    label: item.title,
    value: item.slug,
  }))

  // Fetch paginated, filtered products
  const response = await getProducts({
    search,
    category,
    sort,
    page,
    limit: 9,
  })

  const products = response.data

  // The automatic catalog block always renders — CMS sections wrap around it
  // at the `listing` marker, they can never remove it.
  const listingBlock = (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-12")}>
        <FilterControls
          moduleType="products"
          categories={categories}
        />

        <div className="mt-8">
          <ContentList
            items={products}
            basePath="/products"
            empty="No products matched your search or filters."
          />
        </div>

        <Pagination page={response.pagination.page} totalPages={response.pagination.totalPages} />
      </div>
    </section>
  )

  // When the CMS "products" page has builder sections, they control
  // everything around the catalog block. Otherwise keep the built-in layout.
  const cmsPage = await getPage("products")
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
        eyebrow="Products"
        title="Industrial products for testing, protection, and instrumentation."
        description="Explore CMS-managed product categories, datasheets, specifications, galleries, and product details."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      {listingBlock}
      <CtaBanner
        title="Need a specific product or datasheet?"
        description="Tell us what you are sourcing and our team will respond with availability, specifications, and support options."
        primaryHref="/contact"
        primaryLabel="Ask Our Team"
        secondaryHref="/services"
        secondaryLabel="View Services"
      />
    </>
  )
}
