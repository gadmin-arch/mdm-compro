import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { ContentList } from "@/components/cms/content-list"
import { flattenContent, getService, getServices } from "@/lib/cms"
import { container } from "@/lib/layout"

type Props = {
  params: Promise<{ path: string[] }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const services = await getServices()
  return flattenContent(services).map((item) => ({ path: item.fullPath.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).path.join("/")
  const service = await getService(path)
  if (!service) return {}
  return {
    title: service.seo?.title ?? `${service.title} — PT Multi Daya Mitra`,
    description: service.seo?.description ?? service.summary,
  }
}

export default async function ServiceDetailPage({ params, searchParams }: Props) {
  const path = (await params).path.join("/")
  const service = await getService(path)
  if (!service) notFound()

  // Fetch children if this service acts as a category
  const query = await searchParams
  const page = parseInt(query.page || "1", 10)
  const childServices = await getServices({ category: service.slug, page, limit: 6 })
  
  // Filter out the current service itself, only keep its true children
  const actualChildren = childServices.data.filter(s => s.id !== service.id)

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.summary ?? "Engineering service detail from PT Multi Daya Mitra."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className={container("grid gap-10 py-20 lg:grid-cols-12")}>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
              <Image src={service.imageUrl || "/placeholder.jpg"} alt={service.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <RichText content={service.content} />
          </div>
        </div>
      </section>

      {actualChildren.length > 0 && (
        <section className="border-b border-border/60 bg-background">
          <div className={container("py-16")}>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Sub-Services
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {service.title} Services
              </h2>
            </div>
            
            <div className="mt-8">
              <ContentList items={actualChildren} basePath="/services" empty="No sub-services found." />
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Discuss this service with our engineers"
        description="Share your project scope and our team will respond with a tailored approach."
        primaryHref="/contact"
        primaryLabel="Request a Quote"
      />
    </>
  )
}
