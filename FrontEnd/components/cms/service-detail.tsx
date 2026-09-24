"use client"

import Image from "next/image"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { ContentList } from "@/components/cms/content-list"
import type { ContentNode } from "@/lib/cms"
import { container } from "@/lib/layout"
import {
  BilingualText,
  ContentLanguageToggle,
  useContentLanguage,
} from "@/components/cms/content-language"

// The service detail body, lifted out of app/(site)/services/[...path]/page.tsx so
// the public page and the admin draft preview render from ONE definition.
// Purely presentational: no fetching, no notFound() — caller supplies the item.
export function ServiceDetailView({
  service,
  subServices = [],
  unoptimizedImage = false,
}: {
  service: ContentNode
  subServices?: ContentNode[]
  unoptimizedImage?: boolean
}) {
  const { isIndonesian } = useContentLanguage()

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={<BilingualText text={service.title} />}
        description={
          service.summary ? (
            <BilingualText text={service.summary} />
          ) : isIndonesian ? (
            "Detail layanan rekayasa elektrik dan otomasi dari PT Multi Daya Mitra."
          ) : (
            "Engineering service detail from PT Multi Daya Mitra."
          )
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className={container("grid gap-10 py-16 lg:grid-cols-12")}>
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary shadow-xs">
                <Image
                  src={service.imageUrl || "/uploads/hero-project.jpg"}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized={unoptimizedImage}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isIndonesian ? "Bahasa Konten" : "Content Language"}
              </span>
              <ContentLanguageToggle size="sm" />
            </div>
            <RichText content={service.content} />
          </div>
        </div>
      </section>

      {subServices.length > 0 && (
        <section className="border-b border-border/60 bg-secondary/20 py-16">
          <div className={container()}>
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">
                  {isIndonesian ? "Sub-Layanan Terkait" : "Sub-Services"}
                </span>
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {service.title} {isIndonesian ? "Layanan" : "Services"}
              </h2>
            </div>

            <div className="mt-8">
              <ContentList items={subServices} basePath="/services" empty="No sub-services found." />
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title={
          isIndonesian
            ? "Konsultasikan Kebutuhan Layanan Ini Bersama Engineer Kami"
            : "Discuss this service with our engineers"
        }
        description={
          isIndonesian
            ? "Sampaikan lingkup proyek kelistrikan atau otomasi industri Anda untuk penawaran teknis dan komersial terbaik."
            : "Share your project scope and our team will respond with a tailored approach and quotation."
        }
        primaryHref="/contact"
        primaryLabel={isIndonesian ? "Minta Penawaran" : "Request a Quote"}
        secondaryHref={`https://wa.me/628118303250?text=Halo%20PT%20Multi%20Daya%20Mitra,%20saya%20tertarik%20dengan%20layanan:%20${encodeURIComponent(service.title)}`}
        secondaryLabel="WhatsApp Hotline"
      />
    </>
  )
}
