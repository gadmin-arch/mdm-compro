import { FileCheck2 } from "lucide-react"
import { container } from "@/lib/layout"
import { DEFAULT_CERTIFICATIONS, items, prop } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText, resolveTextList } from "@/lib/localized"

export function CertificationsSection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const eyebrow = resolveText(prop(props, "eyebrow", "EN: Trust & Credentials\nID: Legalitas & Kredensial"), lang)
  const title = resolveText(prop(props, "title", "EN: Legal Compliance, ISO Certifications & Official Credentials\nID: Kepatuhan Hukum, Sertifikasi ISO & Kredensial Resmi"), lang)
  const description = resolveText(prop(props, "description", "EN: Documented compliance, safety accreditations, and official licensing supporting industrial vendor qualification and tender audits.\nID: Kepatuhan terdokumentasi, akreditasi keselamatan, dan perizinan resmi untuk kualifikasi vendor industri serta audit tender."), lang)

  // Structured items win; the older one-name-per-line field is the fallback.
  // A page that set either field keeps exactly what it set, even if empty.
  const listed = items(props, "items", [])
  const named = resolveTextList(prop(props, "certifications", []), lang)
  const hasOwnList = "items" in props || "certifications" in props
  const certs =
    listed.length > 0
      ? listed.map((cert) => ({
          title: resolveText(cert.title, lang),
          desc: resolveText(cert.desc, lang),
          badge: resolveText(cert.badge, lang),
        }))
      : named.length > 0
        ? named.map((line) => {
            const text = line.toLowerCase()
            const matched = DEFAULT_CERTIFICATIONS.find((c) =>
              [c.title.id, c.title.en].some((title) => text === title.toLowerCase() || text.includes(title.toLowerCase())),
            )
            return {
              title: matched && line.includes("(") ? line.split("(")[0].trim() : line,
              desc: matched ? resolveText(matched.desc, lang) : "",
              badge: matched ? resolveText(matched.badge, lang) : "",
            }
          })
        : hasOwnList
          ? []
          : DEFAULT_CERTIFICATIONS.map((cert) => ({
              title: resolveText(cert.title, lang),
              desc: resolveText(cert.desc, lang),
              badge: resolveText(cert.badge, lang),
            }))

  return (
    <section className="border-b border-border/60 bg-secondary/20 py-20">
      <div className={container()}>
        <div className="text-center max-w-2xl mx-auto">
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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {certs.map((cert, idx) => (
            <div
              key={`${cert.title}-${idx}`}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <FileCheck2 className="h-5 w-5 text-primary" />
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {cert.badge}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-sm font-bold text-foreground">{cert.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {cert.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
