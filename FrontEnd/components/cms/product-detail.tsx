"use client"

import Image from "next/image"
import { Download } from "lucide-react"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { ContentList } from "@/components/cms/content-list"
import type { ContentNode } from "@/lib/cms"
import { container } from "@/lib/layout"
import {
  BilingualText,
  useContentLanguage,
} from "@/components/cms/content-language"
import { getBilingualText } from "@/lib/bilingual"

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
  const { isIndonesian } = useContentLanguage()
  const specs = Object.entries(product.specs ?? {})

  return (
    <>
      <PageHero
        eyebrow={isIndonesian ? "Produk" : "Product"}
        title={<BilingualText text={product.title} />}
        description={
          product.summary ? (
            <BilingualText text={product.summary} />
          ) : isIndonesian ? (
            "Detail spesifikasi produk rekayasa elektrik dan otomasi dari PT Multi Daya Mitra."
          ) : (
            "Product detail from PT Multi Daya Mitra."
          )
        }
        breadcrumbs={[
          { label: isIndonesian ? "Beranda" : "Home", href: "/" },
          { label: isIndonesian ? "Produk" : "Products", href: "/products" },
          { label: <BilingualText text={product.title} /> },
        ]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className={container("grid gap-10 py-16 lg:grid-cols-12")}>
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary shadow-xs">
                <Image
                  src={product.imageUrl || "/uploads/products-rittal.jpg"}
                  alt={getBilingualText(product.title, isIndonesian ? "id" : "en")}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized={unoptimizedImage}
                />
              </div>
              {specs.length > 0 && (
                <dl className="divide-y divide-border rounded-xl border border-border bg-card shadow-xs">
                  {specs.map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-4 p-4 text-sm">
                      <dt className="font-medium text-muted-foreground">
                        <BilingualText text={key} />
                      </dt>
                      <dd className="font-medium text-foreground">
                        <BilingualText text={String(value)} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {product.datasheetUrl && (
                <Button asChild className="w-full" variant="outline">
                  <a href={product.datasheetUrl} rel="noreferrer" target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Download Datasheet
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <RichText content={product.content} />
          </div>
        </div>
      </section>

      {subProducts.length > 0 && (
        <section className="border-b border-border/60 bg-secondary/20 py-16">
          <div className={container()}>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">
                  {isIndonesian ? "Kategori Terkait" : "Sub-Products"}
                </span>
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                <BilingualText text={product.title} /> {isIndonesian ? "Varian & Tipe" : "Products"}
              </h2>
            </div>

            <div className="mt-8">
              <ContentList items={subProducts} basePath="/products" empty="No sub-products found." />
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title={
          isIndonesian
            ? "Tertarik dengan Produk Resmi Ini?"
            : "Interested in this product?"
        }
        description={
          isIndonesian
            ? "Hubungi sales engineer kami untuk ketersediaan stok, spesifikasi teknis khusus, dan penawaran harga resmi."
            : "Contact our technical sales team for pricing, availability, and engineering integration support."
        }
        primaryHref="/contact"
        primaryLabel={isIndonesian ? "Minta Penawaran" : "Request a Quote"}
        secondaryHref={`https://wa.me/628118303250?text=Halo%20PT%20Multi%20Daya%20Mitra,%20saya%20tertarik%20dengan%20produk:%20${encodeURIComponent(getBilingualText(product.title, isIndonesian ? "id" : "en"))}`}
        secondaryLabel="WhatsApp Hotline"
      />
    </>
  )
}
