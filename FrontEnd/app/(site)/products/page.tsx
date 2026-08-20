import Link from "next/link"
import type { Metadata } from "next"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Cpu,
  Flame,
  Layers,
  Power,
  ThermometerSnowflake,
  Wrench,
  Zap,
} from "lucide-react"
import { ContentList } from "@/components/cms/content-list"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { FilterControls } from "@/components/filter-controls"
import { Pagination } from "@/components/cms/pagination"
import { getPage, getProducts, resolveSectionData } from "@/lib/cms"
import { sectionsFromContent, splitSectionsAtListing } from "@/lib/sections"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { container } from "@/lib/layout"
import { Badge } from "@/components/ui/badge"
import { BrandLogo } from "@/components/brand-logos"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("products")
  return {
    title: page?.seo?.title || "Products & Partners — PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Official Rittal Authorized Distributor, Schneider Electric System Integrator, Electrical Distribution, Automation & Control, Enclosures, Power Quality, and Fire Alarm Products.",
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

const rittalPillars = [
  {
    title: "Enclosures",
    desc: "VX25 modular baying systems, AX compact enclosures, KX small boxes, CS Toptec outdoor cabinets, and server IT racks.",
    icon: Boxes,
  },
  {
    title: "Climate Control & Cooling",
    desc: "Energy-saving Blue e+ hybrid cooling units (up to 75% energy savings), industrial chillers, filter fans, and heat exchangers.",
    icon: ThermometerSnowflake,
  },
  {
    title: "Power Distribution",
    desc: "Type-tested Ri4Power low-voltage switchgear systems up to 6300A and modular RiLine compact busbars.",
    icon: Power,
  },
]

const schneiderPillars = [
  {
    title: "Industrial Automation",
    desc: "EcoStruxure™ universal automation, Modicon M221/M241/M251/M580 PLCs, Altivar VSD drives, and Magelis HMI.",
    icon: Cpu,
  },
  {
    title: "Power & Energy Monitoring",
    desc: "EcoStruxure Power Monitoring Expert (PME), PowerLogic PM5000/PM8000 meters, power quality analytics, and ESG reports.",
    icon: Activity,
  },
  {
    title: "Electrical Distribution Integration",
    desc: "MasterPact MTZ/NT/NW ACBs, Compact NSX MCCBs, Acti9 MCBs, Prisma iPM switchboards, and TeSys motor starters.",
    icon: Zap,
  },
  {
    title: "Engineering & Commissioning",
    desc: "Turnkey panel build, PLC/SCADA programming, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), and 24/7 support.",
    icon: Wrench,
  },
]

const productCategories = [
  {
    title: "Electrical Distribution",
    slug: "electrical-distribution",
    desc: "Medium & Low Voltage switchgear, transformers, MDP/SDP distribution panels, ATS/AMF sync, and busbars.",
    icon: Zap,
    count: "MV & LV Systems",
  },
  {
    title: "Automation & Control",
    slug: "automation-control",
    desc: "Industrial PLC systems, SCADA (xArrow), variable speed drive (VSD) panels, and centralized process telemetry.",
    icon: Cpu,
    count: "PLCs & Inverters",
  },
  {
    title: "Enclosure & Climate Control",
    slug: "enclosure-climate-control",
    desc: "Heavy-duty IP55/IP66 industrial enclosures, Blue e+ cooling systems, server racks, and outdoor cabinets.",
    icon: Layers,
    count: "IP66 & Blue e+",
  },
  {
    title: "Power Quality",
    slug: "power-quality",
    desc: "Active Harmonic Filters (AHF), Static Var Generators (SVG), capacitor banks, and power quality analyzers.",
    icon: Activity,
    count: "THDi < 3% / SVG",
  },
  {
    title: "Fire Alarm Products",
    slug: "fire-alarm-products",
    desc: "Addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and clean agent gas suppression.",
    icon: Flame,
    count: "NFPA & Addressable",
  },
]

const authorizedPartners = [
  { name: "Rittal", role: "Authorized Distributor", country: "Germany" },
  { name: "Schneider Electric", role: "Certified System Integrator", country: "France / Global" },
  { name: "xArrow", role: "Authorized SCADA Solutions Partner", country: "Global" },
  { name: "Mundung", role: "Authorized Partner", country: "Global" },
]

const brandExperience = [
  "ABB",
  "Siemens",
  "Hitachi",
  "TRAFINDO",
  "B&D Transformer",
  "Raychem",
  "3M",
  "Legrand",
  "Socomec",
  "Autonics",
  "Omron",
  "CHINT",
  "MSA",
  "Honeywell",
  "Bosch",
  "Asenware",
  "Hooseki",
  "Simplex",
  "Hikvision",
  "Advantech",
  "Pepperl+Fuchs",
  "Moxa",
  "Phoenix Contact",
  "Weidmüller",
  "Supreme",
  "KMI Wire and Cable",
  "Kabelmetal Indonesia",
  "GE",
  "Danfoss",
  "GAE",
  "LS Electric",
  "Megger",
  "Fluke",
  "FLIR",
  "Huazheng",
]

export default async function ProductsPage({ searchParams }: Props) {
  const query = await searchParams
  const search = query.search || ""
  const category = query.category || ""
  const sort = query.sort || ""
  const page = parseInt(query.page || "1", 10)

  // Fetch all root categories dynamically for the filter dropdown
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

  const isFiltered = Boolean(search || category)

  const listingBlock = (
    <section id="catalog" className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Interactive Catalog</span>
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {category
                ? `Products in ${categories.find((c) => c.value === category)?.label ?? category}`
                : "Explore All Products & Solutions"}
            </h2>
          </div>
          {isFiltered && (
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:underline self-start md:self-auto"
            >
              Reset All Filters
            </Link>
          )}
        </div>

        <FilterControls moduleType="products" categories={categories} />

        <div className="mt-8">
          <ContentList items={products} basePath="/products" empty="No products matched your search or filters." />
        </div>

        <Pagination page={response.pagination.page} totalPages={response.pagination.totalPages} />
      </div>
    </section>
  )

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
      {/* 1. Page Header */}
      <PageHero
        eyebrow="Products & Strategic Partners"
        title="Engineered electrical, automation & climate control products."
        description="Official Authorized Distributor for Rittal, Certified System Integrator for Schneider Electric, and complete product lines for electrical distribution, automation, power quality & fire systems."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      {/* 2. Strategic Partnerships Section (Rittal & Schneider Electric) */}
      <section className="border-b border-border/60 bg-secondary/25 py-20">
        <div className={container()}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Strategic Principal Partnerships</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Authorized Distribution & Certified System Integration
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              We partner directly with world-leading industrial automation and electrical manufacturing principals, providing
              genuine hardware, authorized technical support, and turnkey engineering.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Rittal Showcase Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                    Rittal <span className="text-xs font-normal text-muted-foreground">— The System.</span>
                  </span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                    Authorized Distributor
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Official distributor delivering German-engineered industrial enclosures, intelligent Blue e+ climate
                  management, and modular low-voltage power distribution systems.
                </p>

                <div className="mt-8 space-y-4">
                  {rittalPillars.map((pillar) => {
                    const Icon = pillar.icon
                    return (
                      <div key={pillar.title} className="flex items-start gap-3.5 rounded-xl border border-border bg-secondary/30 p-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-semibold text-foreground">{pillar.title}</h4>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/70 flex items-center justify-between">
                <Link
                  href="/products?category=rittal-distributor#catalog"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  View Rittal Product Line
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <span className="text-xs text-muted-foreground">Genuine Stock & Warranty</span>
              </div>
            </div>

            {/* Schneider Electric Showcase Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                    Schneider Electric
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15">
                    Certified System Integrator
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Certified partner delivering EcoStruxure™ universal automation architectures, Power Monitoring Expert (PME)
                  for ESG tracking, MasterPact MTZ circuit breakers, and complete site commissioning.
                </p>

                <div className="mt-8 space-y-4">
                  {schneiderPillars.map((pillar) => {
                    const Icon = pillar.icon
                    return (
                      <div key={pillar.title} className="flex items-start gap-3.5 rounded-xl border border-border bg-secondary/30 p-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-semibold text-foreground">{pillar.title}</h4>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/70 flex items-center justify-between">
                <Link
                  href="/products?category=schneider-integrator#catalog"
                  className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View Schneider Electric Solutions
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <span className="text-xs text-muted-foreground">FAT / SAT & 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Categories Overview Grid */}
      <section className="border-b border-border/60 bg-background py-20">
        <div className={container()}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Product Categories</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Complete Industrial Equipment Lines
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Tailored product offerings engineered to meet rigorous electrical, automation, and safety specifications.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {productCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}#catalog`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                    </div>
                    <h3 className="mt-5 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
                  </div>
                  <div className="mt-6 border-t border-border/60 pt-3">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {cat.count}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Brand Experience & Ecosystem (Page 23 of Company Profile) */}
      <section className="border-b border-border/60 bg-secondary/20 py-20">
        <div className={container()}>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Brand Experience</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Authorized Partnerships & Multi-Brand Expertise
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We integrate and service industry-leading global equipment brands, ensuring reliable compatibility across legacy
              and modern plant installations.
            </p>
          </div>

          {/* Authorized Partners Cards */}
          <div className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Authorized Partnership
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {authorizedPartners.map((p) => (
                <div
                  key={p.name}
                  className="group rounded-xl border border-primary/25 bg-card p-5 text-left shadow-xs transition-all hover:border-primary/60 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center h-12 w-full">
                      <BrandLogo
                        brand={p.name}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md shrink-0 self-start mt-1">
                      {p.country}
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-primary font-semibold leading-snug">{p.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experienced Work-With Brands */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Experienced Work With Brand
            </p>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
              {brandExperience.map((brand) => (
                <div
                  key={brand}
                  className="group flex flex-col items-center justify-center rounded-xl border border-border/80 bg-secondary/20 p-3.5 text-center transition-all hover:border-primary/50 hover:bg-card hover:shadow-xs min-h-[72px]"
                  title={brand}
                >
                  <div className="flex items-center justify-center h-9 w-full">
                    <BrandLogo
                      brand={brand}
                      className="w-auto max-w-[120px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Catalog Block (Filter + Grid + Pagination) */}
      {listingBlock}

      {/* 6. CTA Banner */}
      <CtaBanner
        title="Need a specific product quotation or datasheet?"
        description="Tell our engineering team what you are sourcing — we provide genuine hardware availability, custom assembly, and warranty support."
        primaryHref="/contact"
        primaryLabel="Request Quotation"
        secondaryHref="https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20would%20like%20to%20inquire%20about%20product%20pricing%20and%20availability."
        secondaryLabel="WhatsApp Sales Hotline"
      />
    </>
  )
}
