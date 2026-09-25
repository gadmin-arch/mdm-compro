import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { str } from "@/lib/sections"

const DEFAULT_MILESTONES = [
  {
    year: "2012",
    title: "EN: Establishment\nID: Pendirian Perusahaan",
    desc: "EN: Founded PT. Multi Daya Mitra, establishing a strong foundation in electrical engineering services.\nID: Mendirikan PT Multi Daya Mitra, membangun fondasi kokoh dalam penyediaan layanan rekayasa kelistrikan industri.",
  },
  {
    year: "2013",
    title: "EN: Early Market Trust\nID: Kepercayaan Pasar Awal",
    desc: "EN: Successfully delivered diverse low & medium voltage projects, building early market trust.\nID: Berhasil menyelesaikan berbagai proyek tegangan rendah & menengah, membangun kepercayaan awal para pelaku industri.",
  },
  {
    year: "2014",
    title: "EN: Automation & ISO 50001\nID: Otomasi & ISO 50001",
    desc: "EN: Expanded into automation solutions and delivered our first energy management system (ISO 50001) project.\nID: Berekspansi ke solusi otomasi industri dan menyelesaikan proyek sistem manajemen energi (ISO 50001) perdana.",
  },
  {
    year: "2016",
    title: "EN: Testing Fleet & Drive Partnerships\nID: Armada Pengujian & Kemitraan Drive",
    desc: "EN: Formed strategic partnerships with global motor drive brands and strengthened capabilities in testing, commissioning, assessment, and maintenance services.\nID: Menjalin kemitraan strategis dengan prinsipal motor drive global dan memperkuat kemampuan armada pengujian, commissioning, serta asesmen.",
  },
  {
    year: "2017",
    title: "EN: Security & BAS Systems\nID: Sistem Keamanan & BAS",
    desc: "EN: Diversified into Industrial Security Systems and Building Automation Systems (BAS).\nID: Diversifikasi portofolio ke sistem keamanan industri dan Building Automation Systems (BAS).",
  },
  {
    year: "2018",
    title: "EN: Nationwide Maintenance\nID: Pemeliharaan Berskala Nasional",
    desc: "EN: Achieved nationwide maintenance contract coverage, serving clients across Indonesia.\nID: Menjangkau kontrak pemeliharaan tahunan berskala nasional, melayani klien di berbagai wilayah kepulauan Indonesia.",
  },
  {
    year: "2019",
    title: "EN: Panel Assembly & Construction\nID: Perakitan Panel & Konstruksi",
    desc: "EN: Enhanced capabilities with panel assembly solutions & executed major construction projects.\nID: Meningkatkan fasilitas perakitan panel listrik lokal dan mengeksekusi proyek konstruksi gardu industri besar.",
  },
  {
    year: "2020",
    title: "EN: ISO Operational Excellence\nID: Keunggulan Operasional ISO",
    desc: "EN: Reinforced operational excellence by achieving ISO 9001, ISO 14001, and ISO 45001 certifications.\nID: Memperkuat standar operasional dengan meraih sertifikasi internasional ISO 9001, ISO 14001, dan ISO 45001.",
  },
  {
    year: "2021",
    title: "EN: High Voltage Portfolio\nID: Portofolio Tegangan Tinggi",
    desc: "EN: Entered the high voltage supply and services sector, expanding our technical portfolio.\nID: Memasuki sektor pasokan dan layanan tegangan tinggi, memperluas jangkauan kompetensi teknik perusahaan.",
  },
  {
    year: "2022",
    title: "EN: International Expansion & Products\nID: Ekspansi Internasional & Produk",
    desc: "EN: Expanded into international markets and launched new electrical product lines.\nID: Memperluas jangkauan ke pasar regional internasional dan meluncurkan lini produk komponen elektrikal baru.",
  },
  {
    year: "2024",
    title: "EN: Business Digitalization\nID: Digitalisasi Bisnis & Operasional",
    desc: "EN: Successfully digitalized business processes, improving efficiency and scalability.\nID: Sukses mendigitalisasi proses alur kerja bisnis, meningkatkan efisiensi operasional dan skalabilitas layanan.",
  },
  {
    year: "2026",
    title: "EN: Global Principal Alliances\nID: Aliansi Prinsipal Global",
    desc: "EN: Strengthened market position through strategic partnerships with global electrical leaders.\nID: Mengukuhkan posisi pasar melalui kemitraan strategis sebagai distributor dan integrator prinsipal kelas dunia.",
  },
]

export function MilestonesSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: Journey & Evolution\nID: Perjalanan & Perkembangan")
  const title = str(
    props,
    "title",
    "EN: 14 Years of Continuous Growth (2012 – 2026)\nID: 14 Tahun Pertumbuhan Berkelanjutan (2012 – 2026)",
  )
  const description = str(
    props,
    "description",
    "EN: Step-by-step development of technical mastery, international accreditations, and nationwide execution excellence.\nID: Perkembangan bertahap dalam keahlian teknis, akreditasi internasional, dan keunggulan eksekusi berskala nasional.",
  )

  const rawItems = Array.isArray(props.items) && props.items.length > 0 ? props.items : DEFAULT_MILESTONES
  const items = rawItems.map((item, idx) => {
    const fallback = DEFAULT_MILESTONES[idx] || DEFAULT_MILESTONES[0]
    const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {}
    return {
      year: String(obj.year || fallback.year || ""),
      title: String(obj.title || fallback.title || ""),
      desc: String(obj.desc || fallback.desc || ""),
    }
  })

  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className={container()}>
        <div className="max-w-3xl">
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
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              <BilingualText text={description} />
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <div
              key={m.year}
              className="relative rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 font-display text-xs font-bold text-primary">
                  {m.year}
                </span>
                <h4 className="mt-3 font-display text-base font-semibold text-foreground">
                  <BilingualText text={m.title} />
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  <BilingualText text={m.desc} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
