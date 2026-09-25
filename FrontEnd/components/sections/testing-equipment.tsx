import { Activity } from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { lines, str } from "@/lib/sections"

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

export function TestingEquipmentSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: Equipment Fleet\nID: Armada Peralatan")
  const title = str(
    props,
    "title",
    "EN: Advanced Testing Fleet & Calibrated Instrumentation\nID: Armada Pengujian Mutakhir & Instrumentasi Terkalibrasi",
  )
  const description = str(
    props,
    "description",
    "EN: We invest in calibrated, international-grade diagnostic equipment to ensure accurate measurements, rigorous commissioning, and maximum operational safety.\nID: Kami berinvestasi pada peralatan diagnostik terkalibrasi berstandar internasional demi memastikan keakuratan pengukuran, commissioning ketat, dan keselamatan operasi optimal.",
  )

  let items = DEFAULT_TESTING_FLEET
  if (Array.isArray(props.items) && props.items.length > 0) {
    items = props.items.map((item, idx) => {
      const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {}
      const fallback = DEFAULT_TESTING_FLEET[idx % DEFAULT_TESTING_FLEET.length]
      return {
        name: String(obj.name || fallback?.name || ""),
        category: String(obj.category || fallback?.category || ""),
        desc: String(obj.desc || fallback?.desc || ""),
      }
    })
  } else {
    const rawLines = lines(props, "testingTools")
    if (rawLines.length > 0) {
      items = rawLines.map((line, idx) => {
        const matched = DEFAULT_TESTING_FLEET.find((t) => t.name.toLowerCase() === line.toLowerCase())
        if (matched) return matched
        const fallback = DEFAULT_TESTING_FLEET[idx % DEFAULT_TESTING_FLEET.length]
        return {
          name: line,
          category: fallback?.category || "EN: Diagnostic Tool\nID: Peralatan Diagnostik",
          desc: fallback?.desc || line,
        }
      })
    }
  }

  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className={container()}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">
                  <BilingualText text={eyebrow} />
                </span>
              </p>
            )}
            {title && (
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                <BilingualText text={title} />
              </h2>
            )}
            {description && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                <BilingualText text={description} />
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((tool, idx) => (
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
                    <BilingualText text={tool.category} />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">{tool.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  <BilingualText text={tool.desc} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
