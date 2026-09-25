import { container } from "@/lib/layout"
import { BrandLogo } from "@/components/brand-logos"
import { BrandMarquee } from "@/components/brand-marquee"
import { BilingualText } from "@/components/cms/content-language"
import { lines, str } from "@/lib/sections"

const DEFAULT_AUTHORIZED_PARTNERS = [
  { name: "Rittal", role: "EN: Authorized Distributor\nID: Distributor Resmi", country: "Germany" },
  { name: "Schneider Electric", role: "EN: Certified System Integrator\nID: Certified System Integrator", country: "France / Global" },
  { name: "xArrow", role: "EN: Authorized Solutions Partner\nID: Mitra Solusi Resmi", country: "Global" },
  { name: "Mundung", role: "EN: Authorized Partner\nID: Mitra Resmi", country: "Global" },
]

const DEFAULT_EXPERIENCED_BRANDS = [
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

export function BrandPartnersSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: Authorized Partnership\nID: Kemitraan Resmi Principal")
  const title = str(
    props,
    "title",
    "EN: Strategic Alliances & Multi-Brand Engineering Experience\nID: Aliansi Strategis & Pengalaman Rekayasa Berbagai Brand",
  )
  const marqueeTitle = str(
    props,
    "marqueeTitle",
    "EN: Experienced Work With Brand\nID: Pengalaman Proyek Berbagai Brand",
  )

  const rawPartners = Array.isArray(props.partners) && props.partners.length > 0 ? props.partners : DEFAULT_AUTHORIZED_PARTNERS
  const partners = rawPartners.map((p, idx) => {
    const fallback = DEFAULT_AUTHORIZED_PARTNERS[idx % DEFAULT_AUTHORIZED_PARTNERS.length]
    const obj = typeof p === "object" && p !== null ? (p as Record<string, unknown>) : {}
    return {
      name: String(obj.name || fallback?.name || ""),
      role: String(obj.role || fallback?.role || ""),
      country: String(obj.country || fallback?.country || ""),
    }
  })

  const rawBrands = lines(props, "brands")
  const altBrands = lines(props, "partnerships")
  const brands = rawBrands.length > 0 ? rawBrands : altBrands.length > 0 ? altBrands : DEFAULT_EXPERIENCED_BRANDS

  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className={container()}>
        {/* Authorized Partnerships */}
        <div className="rounded-2xl border border-primary/25 bg-card p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <BilingualText text={eyebrow} />
                </p>
              )}
              {title && (
                <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                  <BilingualText text={title} />
                </h3>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((p) => (
              <div
                key={p.name}
                className="group rounded-xl border border-border bg-secondary/20 p-4 text-center transition-all hover:border-primary/40 hover:bg-card hover:shadow-xs"
              >
                <div className="flex items-center justify-center h-12 w-full">
                  <BrandLogo brand={p.name} className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <p className="text-xs font-semibold text-primary mt-2">
                  <BilingualText text={p.role} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Experienced Work With Brand */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 lg:p-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
            <BilingualText text={marqueeTitle} />
          </h3>
          <BrandMarquee brands={brands} />
        </div>
      </div>
    </section>
  )
}
