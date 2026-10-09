import { CheckCircle2, Users } from "lucide-react"
import { container } from "@/lib/layout"
import { LICENSED_EXPERTS } from "@/lib/page-bilingual"
import { prop } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText, resolveTextList } from "@/lib/localized"

export function LicensedExpertsSection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const eyebrow = resolveText(prop(props, "eyebrow", "EN: Certified Engineering Team\nID: Tim Insinyur Bersertifikasi"), lang)
  const title = resolveText(prop(props, "title", "EN: Competent & Licensed Workforce\nID: Tenaga Kerja Kompeten & Berlisensi"), lang)
  const description = resolveText(prop(props, "description", "EN: All field operations and site assessments are led by licensed engineering specialists certified by the Ministry of Manpower, Ministry of Energy and Mineral Resources (ESDM), and global automation principals.\nID: Seluruh operasional lapangan dan asesmen teknis dipimpin oleh tenaga ahli bersertifikasi dari Kementerian Ketenagakerjaan, Kementerian ESDM, dan prinsipal otomasi global."), lang)

  // `licensedExperts` is the legacy about-page field name.
  const experts = resolveTextList(
    prop(props, "experts", prop(props, "licensedExperts", LICENSED_EXPERTS)),
    lang,
  )

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
                    {eyebrow}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {title}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {description}
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
                      {expert}
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
