import Image from "next/image"
import { Download } from "lucide-react"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { ContentList } from "@/components/cms/content-list"
import type { ContentNode } from "@/lib/cms"
import { container } from "@/lib/layout"

// The product detail body, lifted out of app/(site)/products/[...path]/page.tsx so
// the public page and the admin draft preview render from ONE definition.
// Purely presentational: no fetching, no notFound() — caller supplies the item.
export function ProductDetailView({
  product,
  subProducts = [],
  unoptimizedImage = false,
}: {
  product: ContentNode
  subProducts?: ContentNode[]
  unoptimizedImage?: boolean
}) {
  const specs = Object.entries(product.specs ?? {})

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
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary shadow-xs">
              <Image
                src={product.imageUrl || "/uploads/products-rittal.jpg"}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                unoptimized={unoptimizedImage}
              />
            </div>
            {specs.length > 0 && (
              <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-card shadow-xs">
                {specs.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 p-4 text-sm">
                    <dt className="font-medium text-muted-foreground">{key}</dt>
                    <dd className="text-foreground font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {product.datasheetUrl && (
              <Button asChild className="mt-6 w-full" variant="outline">
                <a href={product.datasheetUrl} rel="noreferrer" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
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

      {subProducts.length > 0 && (
        <section className="border-b border-border/60 bg-secondary/20 py-16">
          <div className={container()}>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">Sub-Products</span>
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {product.title} Solutions
              </h2>
            </div>
            
            <div className="mt-8">
              <ContentList items={subProducts} basePath="/products" empty="No sub-products found." />
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Need product specifications or quotation?"
        description="Contact our sales and engineering team with your project specifications and requirements."
        primaryHref="/contact"
        primaryLabel="Request Quotation"
        secondaryHref={`https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20am%20interested%20in%20product%20pricing%20and%20specifications%20for:%20${encodeURIComponent(product.title)}`}
        secondaryLabel="WhatsApp Sales"
      />
    </>
  )
}
