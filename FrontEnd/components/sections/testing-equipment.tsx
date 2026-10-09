import { Activity } from "lucide-react"
import { container } from "@/lib/layout"
import { items, prop } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText, resolveTextList } from "@/lib/localized"

const DEFAULT_TESTING_FLEET = [
  {
    name: "Partial Discharge Analyzer & Scanner",
    category: "EN: Predictive Diagnosis\nID: Diagnosis Prediktif",
    desc: "EN: Non-invasive insulation breakdown detection for MV/HV switchgear & cables.\nID: Deteksi degradasi isolasi non-invasif untuk switchgear & kabel tegangan menengah/tinggi.",
  },
  {
    name: "Omicron Secondary Injection & Relay Tester",
    category: "EN: Protection Testing\nID: Pengujian Proteksi",
    desc: "EN: High-precision automated protection relay calibration and CT/VT analysis.\nID: Kalibrasi otomatis presisi tinggi relay proteksi serta analisis karakteristik CT/VT.",
  },
  {
    name: "Megger & Fluke Insulation / Earth Resistance",
    category: "EN: Electrical Safety\nID: Keselamatan Elektrikal",
    desc: "EN: Up to 10kV digital insulation resistance, ground grid integrity & loop impedance testing.\nID: Pengujian resistansi isolasi digital hingga 10kV, integritas grid pentanahan & impedansi loop.",
  },
  {
    name: "Fluke 3-Phase Power Quality Analyzer",
    category: "EN: Power Analysis\nID: Analisis Kualitas Daya",
    desc: "EN: Harmonics, voltage dips/swells, transient analysis and energy audit profiling.\nID: Analisis harmonisa (THDi/THDv), fluktuasi tegangan, transien dan audit efisiensi energi.",
  },
  {
    name: "Transformer Oil BDV & DGA Treatment Unit",
    category: "EN: Substation Maintenance\nID: Pemeliharaan Gardu",
    desc: "EN: Breakdown voltage testing, dissolved gas analysis, filtering, and purification.\nID: Uji tegangan tembus oli (BDV), uji gas terlarut (DGA), filtrasi, dan pemurnian oli trafo.",
  },
  {
    name: "Circuit Breaker Dynamic Timing Analyzer",
    category: "EN: Switchgear Testing\nID: Pengujian Switchgear",
    desc: "EN: Contact resistance (micro-ohm), opening/closing velocity, and stroke measurement.\nID: Pengukuran resistansi kontak (micro-ohm), kecepatan buka/tutup kontak, dan panjang langkah breaker.",
  },
]

export function TestingEquipmentSection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const eyebrow = resolveText(prop(props, "eyebrow", "EN: Equipment Fleet\nID: Armada Peralatan"), lang)
  const title = resolveText(prop(props, "title", "EN: Advanced Testing Fleet & Calibrated Instrumentation\nID: Armada Pengujian Mutakhir & Instrumentasi Terkalibrasi"), lang)
  const description = resolveText(prop(props, "description", "EN: We invest in calibrated, international-grade diagnostic equipment to ensure accurate measurements, rigorous commissioning, and maximum operational safety.\nID: Kami berinvestasi pada peralatan diagnostik terkalibrasi berstandar internasional demi memastikan keakuratan pengukuran, commissioning ketat, dan keselamatan operasi optimal."), lang)

  // Structured items win; the older one-name-per-line field is the fallback.
  // A page that set either field keeps exactly what it set, even if empty.
  const listed = items(props, "items", [])
  const named = resolveTextList(prop(props, "testingTools", []), lang)
  const hasOwnList = "items" in props || "testingTools" in props
  const tools =
    listed.length > 0
      ? listed.map((tool) => ({
          name: resolveText(tool.name, lang),
          category: resolveText(tool.category, lang),
          desc: resolveText(tool.desc, lang),
        }))
      : named.length > 0
        ? named.map((line) => {
            const matched = DEFAULT_TESTING_FLEET.find((t) => t.name.toLowerCase() === line.toLowerCase())
            return {
              name: line,
              category: matched ? resolveText(matched.category, lang) : "",
              desc: matched ? resolveText(matched.desc, lang) : "",
            }
          })
        : hasOwnList
          ? []
          : DEFAULT_TESTING_FLEET.map((tool) => ({
              name: tool.name,
              category: resolveText(tool.category, lang),
              desc: resolveText(tool.desc, lang),
            }))

  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className={container()}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">
                  {eyebrow}
                </span>
              </p>
            )}
            {title && (
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, idx) => (
            <div
              key={`${tool.name}-${idx}`}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                    <Activity className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {tool.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">{tool.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
