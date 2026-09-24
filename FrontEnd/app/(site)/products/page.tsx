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
import { BilingualText } from "@/components/cms/content-language"
import { BrandLogo } from "@/components/brand-logos"
import { BrandMarquee } from "@/components/brand-marquee"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("products")
  return {
    title:
      page?.seo?.title ||
      "Distributor Resmi Rittal Indonesia & Produk Elektrik Otomasi | PT Multi Daya Mitra",
    description:
      page?.seo?.description ||
      "Distributor Resmi Rittal Indonesia (Enclosures & Cooling Unit), xArrow SCADA, Schneider Electric, Bosch, Asenware, Hooseki, dan komponen sistem elektrik industri.",
    alternates: page?.seo?.canonical
      ? { canonical: page.seo.canonical }
      : { canonical: "https://multidayamitra.co.id/products" },
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
    title: "EN: Enclosures\nID: Box Panel & Enclosure",
    desc: "EN: VX25 modular baying systems, AX compact enclosures, KX small boxes, CS Toptec outdoor cabinets, and server IT racks.\nID: Sistem baying modular VX25, compact enclosure AX, small box KX, lemari outdoor CS Toptec, dan rak server IT.",
    icon: Boxes,
  },
  {
    title: "EN: Climate Control & Cooling\nID: Sistem Pendingin & Kontrol Iklim",
    desc: "EN: Energy-saving Blue e+ hybrid cooling units (up to 75% energy savings), industrial chillers, filter fans, and heat exchangers.\nID: Unit pendingin hibrida hemat energi Blue e+ (hemat listrik hingga 75%), chiller industri, filter fan, dan heat exchanger.",
    icon: ThermometerSnowflake,
  },
  {
    title: "EN: Power Distribution\nID: Distribusi Tenaga Listrik",
    desc: "EN: Type-tested Ri4Power low-voltage switchgear systems up to 6300A and modular RiLine compact busbars.\nID: Sistem switchgear tegangan rendah teruji Ri4Power hingga 6300A dan busbar modular kompak RiLine.",
    icon: Power,
  },
]

const schneiderPillars = [
  {
    title: "EN: Industrial Automation\nID: Otomasi Industri",
    desc: "EN: EcoStruxure™ universal automation, Modicon M221/M241/M251/M580 PLCs, Altivar VSD drives, and Magelis HMI.\nID: Otomasi universal EcoStruxure™, PLC Modicon M221/M241/M251/M580, inverter Altivar VSD, dan HMI Magelis.",
    icon: Cpu,
  },
  {
    title: "EN: Power & Energy Monitoring\nID: Pemantauan Daya & Energi",
    desc: "EN: EcoStruxure Power Monitoring Expert (PME), PowerLogic PM5000/PM8000 meters, power quality analytics, and ESG reports.\nID: EcoStruxure Power Monitoring Expert (PME), meteran PowerLogic PM5000/PM8000, analitik kualitas daya, dan laporan ESG.",
    icon: Activity,
  },
  {
    title: "EN: Electrical Distribution Integration\nID: Integrasi Distribusi Elektrikal",
    desc: "EN: MasterPact MTZ/NT/NW ACBs, Compact NSX MCCBs, Acti9 MCBs, Prisma iPM switchboards, and TeSys motor starters.\nID: ACB MasterPact MTZ/NT/NW, MCCB Compact NSX, MCB Acti9, panel hubung Prisma iPM, dan starter motor TeSys.",
    icon: Zap,
  },
  {
    title: "EN: Engineering & Commissioning\nID: Rekayasa Teknik & Komisioning",
    desc: "EN: Turnkey panel build, PLC/SCADA programming, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), and 24/7 support.\nID: Perakitan panel terpadu, pemrograman PLC/SCADA, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), dan dukungan 24/7.",
    icon: Wrench,
  },
]

const productCategories = [
  {
    title: "EN: Electrical Distribution\nID: Distribusi Kelistrikan",
    slug: "electrical-distribution",
    desc: "EN: Medium & Low Voltage switchgear, transformers, MDP/SDP distribution panels, ATS/AMF sync, and busbars.\nID: Switchgear tegangan menengah & rendah, transformator, panel distribusi MDP/SDP, sinkronisasi ATS/AMF, dan busbar.",
    icon: Zap,
    count: "MV & LV Systems",
  },
  {
    title: "EN: Automation & Control\nID: Otomasi & Kontrol",
    slug: "automation-control",
    desc: "EN: Industrial PLC systems, SCADA (xArrow), variable speed drive (VSD) panels, and centralized process telemetry.\nID: Sistem PLC industri, SCADA (xArrow), panel variable speed drive (VSD), dan telemetri proses terpusat.",
    icon: Cpu,
    count: "PLCs & Inverters",
  },
  {
    title: "EN: Enclosure & Climate Control\nID: Enclosure & Kontrol Iklim",
    slug: "enclosure-climate-control",
    desc: "EN: Heavy-duty IP55/IP66 industrial enclosures, Blue e+ cooling systems, server racks, and outdoor cabinets.\nID: Enclosure industri tangguh IP55/IP66, sistem pendingin Blue e+, rak server, dan lemari outdoor.",
    icon: Layers,
    count: "IP66 & Blue e+",
  },
  {
    title: "EN: Power Quality\nID: Kualitas Daya Listrik",
    slug: "power-quality",
    desc: "EN: Active Harmonic Filters (AHF), Static Var Generators (SVG), capacitor banks, and power quality analyzers.\nID: Active Harmonic Filter (AHF), Static Var Generator (SVG), bank kapasitor, dan penganalisis kualitas daya.",
    icon: Activity,
    count: "THDi < 3% / SVG",
  },
  {
    title: "EN: Fire Alarm Products\nID: Produk Alarm Kebakaran",
    slug: "fire-alarm-products",
    desc: "EN: Addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and clean agent gas suppression.\nID: Panel kontrol alarm kebakaran addressable, detektor asap optik & panas multi-kriteria, dan sistem pemadam gas clean agent.",
    icon: Flame,
    count: "NFPA & Addressable",
  },
]

const authorizedPartners = [
  { name: "Rittal", role: "EN: Authorized Distributor\nID: Distributor Resmi", country: "Germany" },
  { name: "Schneider Electric", role: "EN: Certified System Integrator\nID: Certified System Integrator", country: "France / Global" },
  { name: "xArrow", role: "EN: Authorized SCADA Solutions Partner\nID: Mitra Solusi SCADA Resmi", country: "Global" },
  { name: "Mundung", role: "EN: Authorized Partner\nID: Mitra Resmi", country: "Global" },
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
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Interactive Catalog\nID: Katalog Interaktif" />
              </span>
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {category ? (
                <>
                  <BilingualText text="EN: Products in\nID: Produk dalam" />{" "}
                  {categories.find((c) => c.value === category)?.label ? (
                    <BilingualText text={categories.find((c) => c.value === category)?.label} />
                  ) : (
                    category
                  )}
                </>
              ) : (
                <BilingualText text="EN: Explore All Products & Solutions\nID: Jelajahi Seluruh Produk & Solusi" />
              )}
            </h2>
          </div>
          {isFiltered && (
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:underline self-start md:self-auto"
            >
              <BilingualText text="EN: Reset All Filters\nID: Reset Semua Filter" />
            </Link>
          )}
        </div>

        <FilterControls moduleType="products" categories={categories} />

        <div className="mt-8">
          <ContentList
            items={products}
            basePath="/products"
            empty="EN: No products matched your search or filters.\nID: Tidak ada produk yang cocok dengan pencarian atau filter Anda."
          />
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
        eyebrow={<BilingualText text="EN: Products & Strategic Partners\nID: Produk & Mitra Strategis" />}
        title={<BilingualText text="EN: Engineered electrical, automation & climate control products.\nID: Produk rekayasa elektrikal, otomasi & sistem kontrol iklim." />}
        description={<BilingualText text="EN: Official Authorized Distributor for Rittal, Certified System Integrator for Schneider Electric, and complete product lines for electrical distribution, automation, power quality & fire systems.\nID: Distributor Resmi Rittal, Certified System Integrator Schneider Electric, serta lini produk lengkap untuk distribusi listrik, otomasi, power quality, dan fire system." />}
        breadcrumbs={[
          { label: <BilingualText text="EN: Home\nID: Beranda" />, href: "/" },
          { label: <BilingualText text="EN: Products\nID: Produk" /> },
        ]}
      />

      {/* 2. Strategic Partnerships Section (Rittal & Schneider Electric) */}
      <section className="border-b border-border/60 bg-secondary/25 py-20">
        <div className={container()}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Strategic Principal Partnerships\nID: Kemitraan Prinsipal Strategis" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: Authorized Distribution & Certified System Integration\nID: Distributor Resmi & Integrator Sistem Tersertifikasi" />
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              <BilingualText text="EN: We partner directly with world-leading industrial automation and electrical manufacturing principals, providing genuine hardware, authorized technical support, and turnkey engineering.\nID: Kami bermitra langsung dengan prinsipal otomasi industri dan manufaktur elektrik terkemuka dunia, menyediakan perangkat keras asli, dukungan teknis resmi, dan rekayasa teknik terpadu." />
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
                    <BilingualText text="EN: Authorized Distributor\nID: Distributor Resmi" />
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <BilingualText text="EN: Official distributor delivering German-engineered industrial enclosures, intelligent Blue e+ climate management, and modular low-voltage power distribution systems.\nID: Distributor resmi yang menghadirkan box panel industri standar Jerman, pendingin pintar Blue e+, dan sistem distribusi daya tegangan rendah modular." />
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
                          <h4 className="font-display text-sm font-semibold text-foreground">
                            <BilingualText text={pillar.title} />
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            <BilingualText text={pillar.desc} />
                          </p>
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
                  <BilingualText text="EN: View Rittal Product Line\nID: Lihat Lini Produk Rittal" />
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <span className="text-xs text-muted-foreground">
                  <BilingualText text="EN: Genuine Stock & Warranty\nID: Stok Asli & Garansi Resmi" />
                </span>
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
                  <BilingualText text="EN: Certified partner delivering EcoStruxure™ universal automation architectures, Power Monitoring Expert (PME) for ESG tracking, MasterPact MTZ circuit breakers, and complete site commissioning.\nID: Mitra tersertifikasi yang menghadirkan arsitektur otomatisasi universal EcoStruxure™, Power Monitoring Expert (PME) untuk pelacakan ESG, pemutus sirkuit MasterPact MTZ, dan komisioning lokasi lengkap." />
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
                          <h4 className="font-display text-sm font-semibold text-foreground">
                            <BilingualText text={pillar.title} />
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            <BilingualText text={pillar.desc} />
                          </p>
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
                  <BilingualText text="EN: View Schneider Electric Solutions\nID: Lihat Solusi Schneider Electric" />
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <span className="text-xs text-muted-foreground">
                  <BilingualText text="EN: FAT / SAT & 24/7 Support\nID: Uji FAT / SAT & Dukungan 24/7" />
                </span>
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
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Product Categories\nID: Kategori Produk" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: Complete Industrial Equipment Lines\nID: Lini Peralatan Industri Lengkap" />
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              <BilingualText text="EN: Tailored product offerings engineered to meet rigorous electrical, automation, and safety specifications.\nID: Penawaran produk yang dirancang khusus untuk memenuhi standar ketat kelistrikan, otomatisasi, dan keselamatan kerja." />
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
                      <BilingualText text={cat.title} />
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      <BilingualText text={cat.desc} />
                    </p>
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
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Brand Experience\nID: Pengalaman Brand" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: Authorized Partnerships & Multi-Brand Expertise\nID: Kemitraan Resmi & Keahlian Multi-Brand" />
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <BilingualText text="EN: We integrate and service industry-leading global equipment brands, ensuring reliable compatibility across legacy and modern plant installations.\nID: Kami mengintegrasikan dan melayani berbagai merek peralatan global terkemuka di industri, memastikan kompatibilitas andal di berbagai instalasi pabrik konvensional maupun modern." />
            </p>
          </div>

          {/* Authorized Partners Cards */}
          <div className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
              <BilingualText text="EN: Authorized Partnership\nID: Kemitraan Resmi" />
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
                  <p className="mt-4 text-xs text-primary font-semibold leading-snug">
                    <BilingualText text={p.role} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Experienced Work-With Brands */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
              <BilingualText text="EN: Experienced Work With Brand\nID: Pengalaman Bekerja Dengan Brand" />
            </p>
            <BrandMarquee brands={brandExperience} />
          </div>
        </div>
      </section>

      {/* 5. Product Catalog Block (Filter + Grid + Pagination) */}
      {listingBlock}

      {/* 6. CTA Banner */}
      <CtaBanner
        title="EN: Need a specific product quotation or datasheet?\nID: Butuh penawaran harga produk atau lembar data teknis spesifik?"
        description="EN: Tell our engineering team what you are sourcing — we provide genuine hardware availability, custom assembly, and warranty support.\nID: Sampaikan kebutuhan pengadaan fasilitas Anda kepada tim insinyur kami — kami menyediakan ketersediaan perangkat keras asli, perakitan kustom, dan jaminan purnajual resmi."
        primaryHref="/contact"
        primaryLabel="EN: Request Quotation\nID: Minta Penawaran"
        secondaryHref="https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20would%20like%20to%20inquire%20about%20product%20pricing%20and%20availability."
        secondaryLabel="EN: WhatsApp Sales Hotline\nID: Hotline Sales WhatsApp"
      />
    </>
  )
}
