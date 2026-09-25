import { FileCheck2 } from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { lines, str } from "@/lib/sections"

const DEFAULT_CERTIFICATIONS = [
  { title: "ISO 9001:2015", desc: "EN: Quality Management System (KAN Accredited)\nID: Sistem Manajemen Mutu (Terakreditasi KAN)", badge: "Quality" },
  { title: "ISO 14001:2015", desc: "EN: Environmental Management System\nID: Sistem Manajemen Lingkungan", badge: "Environment" },
  { title: "ISO 45001:2018", desc: "EN: Occupational Health & Safety (KAN Accredited)\nID: Sistem Manajemen Keselamatan & Kesehatan Kerja (KAN)", badge: "Safety" },
  { title: "Ecovadis Silver", desc: "EN: Top 15% Global Sustainability Rating (Nov 2024)\nID: Peringkat Keberlanjutan Global 15% Terbaik (Nov 2024)", badge: "ESG" },
  { title: "Avetta Member", desc: "EN: Global Contractor Safety & Compliance Network\nID: Jaringan Kepatuhan & Keselamatan Kontraktor Global", badge: "Compliance" },
  { title: "SBUJTL & IUJPTL ESDM", desc: "EN: Official Electrical Power Support Services License (ESDM)\nID: Izin Usaha Jasa Penunjang Tenaga Listrik Resmi ESDM", badge: "License" },
  { title: "Kompetensi Level 6 ESDM", desc: "EN: Certified Medium-Voltage Technical Competency (ESDM)\nID: Sertifikat Kompetensi Teknis Tegangan Menengah Level 6 ESDM", badge: "Technical" },
  { title: "SMK3 Kemenaker", desc: "EN: National Occupational Safety & Health Management System\nID: Sistem Manajemen Keselamatan dan Kesehatan Kerja Nasional", badge: "HSE" },
  { title: "NFPA Member", desc: "EN: National Fire Protection Association Member\nID: Anggota National Fire Protection Association Global", badge: "Fire System" },
  { title: "D&B Rating", desc: "EN: Dun & Bradstreet Verified Corporate Credential\nID: Kredensial Korporasi Terverifikasi Dun & Bradstreet", badge: "Corporate" },
]

export function CertificationsSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: Trust & Credentials\nID: Legalitas & Kredensial")
  const title = str(
    props,
    "title",
    "EN: Legal Compliance, ISO Certifications & Official Credentials\nID: Kepatuhan Hukum, Sertifikasi ISO & Kredensial Resmi",
  )
  const description = str(
    props,
    "description",
    "EN: Documented compliance, safety accreditations, and official licensing supporting industrial vendor qualification and tender audits.\nID: Kepatuhan terdokumentasi, akreditasi keselamatan, dan perizinan resmi untuk kualifikasi vendor industri serta audit tender.",
  )

  let items = DEFAULT_CERTIFICATIONS
  if (Array.isArray(props.items) && props.items.length > 0) {
    items = props.items.map((item, idx) => {
      const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {}
      const fallback = DEFAULT_CERTIFICATIONS[idx % DEFAULT_CERTIFICATIONS.length]
      return {
        title: String(obj.title || fallback?.title || ""),
        desc: String(obj.desc || fallback?.desc || ""),
        badge: String(obj.badge || fallback?.badge || "Certified"),
      }
    })
  } else {
    const rawLines = lines(props, "certifications")
    if (rawLines.length > 0) {
      items = rawLines.map((line, idx) => {
        const matched = DEFAULT_CERTIFICATIONS.find(
          (c) => c.title.toLowerCase() === line.toLowerCase() || line.toLowerCase().includes(c.title.toLowerCase()),
        )
        if (matched) {
          return {
            ...matched,
            title: line.includes("(") ? line.split("(")[0].trim() : matched.title,
          }
        }
        const fallback = DEFAULT_CERTIFICATIONS[idx % DEFAULT_CERTIFICATIONS.length]
        return {
          title: line,
          desc: fallback?.desc || line,
          badge: fallback?.badge || "Certified",
        }
      })
    }
  }

  return (
    <section className="border-b border-border/60 bg-secondary/20 py-20">
      <div className={container()}>
        <div className="text-center max-w-2xl mx-auto">
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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((cert, idx) => (
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
                  <BilingualText text={cert.desc} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
