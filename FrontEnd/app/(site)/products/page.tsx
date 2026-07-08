import type { Metadata } from "next"
import { ContentList } from "@/components/cms/content-list"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { FilterControls } from "@/components/filter-controls"
import { Pagination } from "@/components/cms/pagination"
import { getProducts } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Products — PT Multi Daya Mitra",
  description:
    "Testing equipment, protection relay, instrumentation, and industrial electrical products from PT Multi Daya Mitra.",
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

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Industrial products for testing, protection, and instrumentation."
        description="Explore CMS-managed product categories, datasheets, specifications, galleries, and product details."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
