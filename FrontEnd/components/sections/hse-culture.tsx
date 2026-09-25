import {
  Award,
  CheckCircle2,
  HardHat,
  Scale,
  Shield,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { lines, str } from "@/lib/sections"

const HSE_ICONS: Record<string, LucideIcon> = {
  "hard-hat": HardHat,
  shield: Shield,
  award: Award,
  scale: Scale,
}

const DEFAULT_HSE_PILLARS = [
  {
    title: "EN: PROTECT Every Person\nID: LINDUNGI Setiap Insan",
    subtitle: "EN: Safety begins with individual awareness\nID: Keselamatan berawal dari kesadaran individu",
    desc: "EN: Comprehensive safety briefings, mandatory PPE compliance, and risk assessments before any field task begins.\nID: Briefing keselamatan komprehensif, kepatuhan APD wajib, dan asesmen risiko sebelum pekerjaan lapangan dimulai.",
    icon: "hard-hat",
  },
  {
    title: "EN: CARE For Each Other\nID: PEDULI Terhadap Sesama",
    subtitle: "EN: Caring today, protecting the future\nID: Peduli hari ini, menjaga masa depan",
    desc: "EN: Proactive mutual oversight among team members on high-voltage and critical manufacturing sites.\nID: Pengawasan aktif antar anggota tim di lokasi proyek tegangan tinggi dan lingkungan manufaktur kritis.",
    icon: "shield",
  },
  {
    title: "EN: COMMIT To Excellence\nID: KOMITMEN Menuju Keunggulan",
    subtitle: "EN: Safe execution defines professionalism\nID: Eksekusi aman adalah cerminan profesionalisme",
    desc: "EN: Adherence to national and international safety regulations without compromising quality or timeline.\nID: Kepatuhan penuh terhadap regulasi keselamatan nasional dan internasional tanpa mengurangi mutu atau jadwal kerja.",
    icon: "award",
  },
  {
    title: "EN: SUSTAIN For The Future\nID: KEBERLANJUTAN untuk Masa Depan",
    subtitle: "EN: Safety is an investment in sustainability\nID: Keselamatan adalah investasi masa depan",
    desc: "EN: Continuous safety training, incident prevention reporting, and sustainable environmental practices.\nID: Pelatihan K3 berkelanjutan, pelaporan pencegahan insiden, dan penerapan tata kelola lingkungan yang ramah alam.",
    icon: "scale",
  },
]

const DEFAULT_HIGHLIGHTS = [
  "EN: Zero Accident Policy across all site engagements\nID: Kebijakan Nihil Kecelakaan (Zero Accident) di setiap lokasi proyek",
  "EN: SMK3 Kemenaker & ISO 45001:2018 Certified\nID: Bersertifikasi SMK3 Kemenaker & ISO 45001:2018",
  "EN: Avetta Contractor Safety Network Verified\nID: Terverifikasi dalam Jaringan Keselamatan Kontraktor Avetta",
]

export function HseCultureSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: HSE & Safety Commitment\nID: Komitmen K3 & Keselamatan Kerja")
  const title = str(props, "title", "EN: &ldquo;I Choose Safety&rdquo;\nID: &ldquo;Saya Pilih Selamat&rdquo;")
  const subtitle = str(
    props,
    "subtitle",
    "EN: Safe & Healthy at All Times · Think Safe, Work Safe, Go Home Safe\nID: Selamat & Sehat Setiap Saat · Pikirkan Selamat, Bekerja Selamat, Pulang Selamat",
  )
  const description = str(
    props,
    "description",
    "EN: Safety is non-negotiable. At PT Multi Daya Mitra, every engineer, technician, and subcontractor is empowered with stop-work authority whenever safety conditions are compromised.\nID: Keselamatan tidak dapat ditawar. Di PT Multi Daya Mitra, setiap insinyur, teknisi, dan subkontraktor memiliki otoritas untuk menghentikan pekerjaan (stop-work authority) jika kondisi keselamatan kerja terkompromi.",
  )

  const rawHighlights = lines(props, "highlights")
  const highlights = rawHighlights.length > 0 ? rawHighlights : DEFAULT_HIGHLIGHTS

  const rawPillars = Array.isArray(props.pillars) && props.pillars.length > 0 ? props.pillars : DEFAULT_HSE_PILLARS
  const pillars = rawPillars.map((p, idx) => {
    const fallback = DEFAULT_HSE_PILLARS[idx] || DEFAULT_HSE_PILLARS[0]
    const obj = typeof p === "object" && p !== null ? (p as Record<string, unknown>) : {}
    const iconName = String(obj.icon || fallback.icon || "shield")
    const Icon = HSE_ICONS[iconName] || Shield
    return {
      title: String(obj.title || fallback.title || ""),
      subtitle: String(obj.subtitle || fallback.subtitle || ""),
      desc: String(obj.desc || fallback.desc || ""),
      Icon,
    }
  })

  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className={container()}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20 p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <BilingualText text={eyebrow} />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                <BilingualText text={title} />
              </h3>
              <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <BilingualText text={subtitle} />
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <BilingualText text={description} />
              </p>

              <div className="mt-6 space-y-2.5 border-t border-border/60 pt-5">
                {highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      <BilingualText text={h} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {pillars.map((p) => {
                const Icon = p.Icon
                return (
                  <div key={p.title} className="rounded-xl border border-border bg-card p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="font-display text-sm font-semibold text-foreground">
                          <BilingualText text={p.title} />
                        </h4>
                        <p className="text-xs text-muted-foreground italic">
                          <BilingualText text={p.subtitle} />
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      <BilingualText text={p.desc} />
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
