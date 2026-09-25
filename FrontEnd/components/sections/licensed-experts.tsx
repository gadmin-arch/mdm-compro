import { CheckCircle2, Users } from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { lines, str } from "@/lib/sections"

export const DEFAULT_LICENSED_EXPERTS = [
  "AK3 Listrik (Ahli K3 Listrik Kemnaker)",
  "AK3 Umum (Ahli K3 Umum)",
  "AK3 Kebakaran (Kelas A, B, C, D)",
  "Teknisi Kompetensi Tegangan Menengah ESDM",
  "Licensed Mechanical & Termination Specialists",
]

export function LicensedExpertsSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: Certified Engineering Team\nID: Tim Insinyur Bersertifikasi")
  const title = str(props, "title", "EN: Competent & Licensed Workforce\nID: Tenaga Kerja Kompeten & Berlisensi")
  const description = str(
    props,
    "description",
    "EN: All field operations and site assessments are led by licensed engineering specialists certified by the Ministry of Manpower, Ministry of Energy and Mineral Resources (ESDM), and global automation principals.\nID: Seluruh operasional lapangan dan asesmen teknis dipimpin oleh tenaga ahli bersertifikasi dari Kementerian Ketenagakerjaan, Kementerian ESDM, dan prinsipal otomasi global.",
  )

  const rawExperts = lines(props, "experts")
  // also check licensedExperts for compatibility
  const altExperts = lines(props, "licensedExperts")
  const experts = rawExperts.length > 0 ? rawExperts : altExperts.length > 0 ? altExperts : DEFAULT_LICENSED_EXPERTS

  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className={container()}>
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-xs">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    <BilingualText text={eyebrow} />
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    <BilingualText text={title} />
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <BilingualText text={description} />
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {experts.map((expert, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-border/80 bg-secondary/40 px-3.5 py-2.5 text-xs font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <BilingualText text={expert} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
