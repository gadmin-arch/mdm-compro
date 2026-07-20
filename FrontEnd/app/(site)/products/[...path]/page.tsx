import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Download } from "lucide-react"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { ContentList } from "@/components/cms/content-list"
import { flattenContent, getProduct, getProducts } from "@/lib/cms"
import { container } from "@/lib/layout"

type Props = {
  params: Promise<{ path: string[] }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return flattenContent(products).map((item) => ({ path: item.fullPath.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).path.join("/")
  const product = await getProduct(path)
  if (!product) return {}
  return {
    title: product.seo?.title ?? `${product.title} — PT Multi Daya Mitra`,
    description: product.seo?.description ?? product.summary,
  }
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const path = (await params).path.join("/")
  const product = await getProduct(path)
  if (!product) notFound()
  const specs = Object.entries(product.specs ?? {})

  const query = await searchParams
  const page = parseInt(query.page || "1", 10)
  const childProducts = await getProducts({ category: product.slug, page, limit: 6 })
  const actualChildren = childProducts.data.filter(p => p.id !== product.id)

  return (
    <>
      <PageHero
        eyebrow="Product"
        title={product.title}
        description={product.summary ?? "Product detail from PT Multi Daya Mitra."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: product.title }]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className={container("grid gap-10 py-20 lg:grid-cols-12")}>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
              <Image src={product.imageUrl || "/placeholder.jpg"} alt={product.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            {specs.length > 0 && (
              <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
                {specs.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 p-4 text-sm">
                    <dt className="font-medium text-muted-foreground">{key}</dt>
                    <dd className="text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {product.datasheetUrl && (
              <Button asChild className="mt-6 w-full" variant="outline">
                <a href={product.datasheetUrl} rel="noreferrer" target="_blank">
                  <Download className="h-4 w-4" />
                  Download Datasheet
                </a>
              </Button>
            )}
          </div>
          <div className="lg:col-span-7">
            <RichText content={product.content} />
          </div>
        </div>
      </section>

      {actualChildren.length > 0 && (
        <section className="border-b border-border/60 bg-background">
          <div className={container("py-16")}>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Sub-Products
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {product.title} Solutions
              </h2>
            </div>
            
            <div className="mt-8">
              <ContentList items={actualChildren} basePath="/products" empty="No sub-products found." />
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Need product availability or a datasheet?"
        description="Send us your requirement and our product team will respond with specifications and next steps."
        primaryHref="/contact"
        primaryLabel="Contact Sales"
      />
    </>
  )
}
