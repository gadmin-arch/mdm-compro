import { container } from "@/lib/layout"
import { BrandLogo } from "@/components/brand-logos"
import { BrandMarquee } from "@/components/brand-marquee"
import { DEFAULT_PARTNERS, items, lines, prop } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"

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

export function BrandPartnersSection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const eyebrow = resolveText(prop(props, "eyebrow", "EN: Authorized Partnership\nID: Kemitraan Resmi Principal"), lang)
  const title = resolveText(prop(props, "title", "EN: Strategic Alliances & Multi-Brand Engineering Experience\nID: Aliansi Strategis & Pengalaman Rekayasa Berbagai Brand"), lang)
  const marqueeTitle = resolveText(prop(props, "marqueeTitle", "EN: Experienced Work With Brand\nID: Pengalaman Proyek Berbagai Brand"), lang)

  const partners = items(props, "partners", DEFAULT_PARTNERS).map((partner) => ({
    name: resolveText(partner.name, lang),
    logoUrl: String(partner.logoUrl || partner.logo || ""),
    role: resolveText(partner.role, lang),
    country: resolveText(partner.country, lang),
  }))
  const rawBrands = lines(props, "brands")
  const altBrands = lines(props, "partnerships")
  const customBrandLogos = Array.isArray(props.brandLogos)
    ? (props.brandLogos as Array<Record<string, unknown>>)
        .filter((b) => b && (b.logoUrl || b.name))
        .map((b) => (b.logoUrl ? `${String(b.name || "Brand")} | ${String(b.logoUrl)}` : String(b.name)))
    : []

  const baseBrands = rawBrands.length > 0 ? rawBrands : altBrands.length > 0 ? altBrands : DEFAULT_EXPERIENCED_BRANDS
  const brands = [...customBrandLogos, ...baseBrands]

  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className={container()}>
        {/* Authorized Partnerships */}
        <div className="rounded-2xl border border-primary/25 bg-card p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                  {title}
                </h3>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((p, pIdx) => (
              <div
                key={`${p.name}-${pIdx}`}
                className="group rounded-xl border border-border bg-secondary/20 p-4 text-center transition-all hover:border-primary/40 hover:bg-card hover:shadow-xs flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center h-12 w-full">
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="max-h-10 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <BrandLogo brand={p.name} className="transition-transform duration-300 group-hover:scale-105" />
                  )}
                </div>
                {p.name && (!p.logoUrl || !["rittal", "schneider electric", "schneider", "xarrow", "mundung"].includes(p.name.toLowerCase())) && (
                  <p className="text-xs font-semibold text-foreground mt-2 line-clamp-1">{p.name}</p>
                )}
                {p.role && (
                  <p className="text-xs font-medium text-primary mt-1">
                    {p.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experienced Work With Brand */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 lg:p-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
            {marqueeTitle}
          </h3>
          <BrandMarquee brands={brands} />
        </div>
      </div>
    </section>
  )
}
