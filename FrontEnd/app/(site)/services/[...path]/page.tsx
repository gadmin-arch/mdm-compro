import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { ContentList } from "@/components/cms/content-list"
import { findNodeInTree, flattenContent, getService, getServices } from "@/lib/cms"
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

export default async function ServiceDetailPage({ params }: Props) {
  const path = (await params).path.join("/")
  const allServices = await getServices()
  const treeNode = findNodeInTree(allServices, path)
  const service = treeNode ?? (await getService(path))
  if (!service) notFound()

  const subServices = treeNode?.children ?? service.children ?? []

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
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary shadow-xs">
              <Image
                src={service.imageUrl || "/uploads/hero-project.jpg"}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <RichText content={service.content} />
          </div>
        </div>
      </section>

      {subServices.length > 0 && (
        <section className="border-b border-border/60 bg-secondary/20 py-16">
          <div className={container()}>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">Sub-Services</span>
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {service.title} Services
              </h2>
            </div>
            
            <div className="mt-8">
              <ContentList items={subServices} basePath="/services" empty="No sub-services found." />
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Discuss this service with our engineers"
        description="Share your project scope and our team will respond with a tailored approach and quotation."
        primaryHref="/contact"
        primaryLabel="Request a Quote"
        secondaryHref={`https://wa.me/6282140074122?text=Halo%20PT%20Multi%20Daya%20Mitra,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
        secondaryLabel="WhatsApp Hotline"
      />
    </>
  )
}
