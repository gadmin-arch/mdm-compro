import {
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { str } from "@/lib/sections"

const IMPACT_ICONS: Record<string, LucideIcon> = {
  I: Lightbulb,
  M: Target,
  P: HeartHandshake,
  A: Sparkles,
  C: ShieldCheck,
  T: Wrench,
}

const DEFAULT_IMPACT_VALUES = [
  {
    letter: "I",
    title: "EN: Integrity & Innovation\nID: Integritas & Inovasi",
    desc: "EN: Building trust through honesty and responsibility while advancing with modern, up-to-date technologies.\nID: Membangun kepercayaan melalui kejujuran dan tanggung jawab seraya terus berinovasi dengan teknologi termutakhir.",
  },
  {
    letter: "M",
    title: "EN: Mastery & Intelligent Problem-Solving\nID: Keahlian Teknis & Solusi Cerdas",
    desc: "EN: Deep technical mastery in electrical and automation systems with structured precision engineering — not assumptions.\nID: Penguasaan teknis mendalam di bidang sistem kelistrikan dan otomasi melalui rekayasa presisi yang terstruktur — bukan asumsi.",
  },
  {
    letter: "P",
    title: "EN: Professional & Trusted Partnership\nID: Kemitraan Profesional & Terpercaya",
    desc: "EN: Discipline, consistency, and high execution standards that position us as a strategic long-term partner.\nID: Disiplin, konsistensi, dan standar eksekusi tinggi yang menempatkan kami sebagai mitra strategis jangka panjang.",
  },
  {
    letter: "A",
    title: "EN: Agile & Adaptable Execution\nID: Eksekusi Tangkas & Adaptif",
    desc: "EN: Swift, resilient response to evolving site dynamics, operational challenges, and technological demands.\nID: Tanggap dan tangguh dalam merespons dinamika lapangan yang berkembang, tantangan operasional, dan tuntutan teknologi.",
  },
  {
    letter: "C",
    title: "EN: Commitment to Safety & Customer First\nID: Komitmen Keselamatan (K3) & Utamakan Pelanggan",
    desc: "EN: Safety is non-negotiable. Prioritizing operational continuity, asset reliability, and zero-accident culture.\nID: Keselamatan tidak dapat ditawar. Memprioritaskan kontinuitas operasional, keandalan aset, dan budaya nihil kecelakaan kerja.",
  },
  {
    letter: "T",
    title: "EN: Total Engineering Solutions\nID: Solusi Rekayasa Teknik Menyeluruh",
    desc: "EN: End-to-end coverage from design, assembly, and installation to testing, commissioning, and lifecycle maintenance.\nID: Cakupan menyeluruh dari perancangan, perakitan, dan instalasi hingga pengujian, commissioning, serta pemeliharaan siklus hidup aset.",
  },
]

export function ImpactValuesSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow", "EN: Core Values\nID: Nilai Utama")
  const title = str(
    props,
    "title",
    "EN: The IMPACT Values Driving Every Project\nID: Nilai-Nilai IMPACT yang Menjadi Landasan Setiap Proyek",
  )
  const culture = str(
    props,
    "culture",
    "EN: Our culture of disciplined engineering, safety commitment, and innovation is built around six foundational principles.\nID: Budaya disiplin rekayasa teknik, komitmen keselamatan, dan inovasi kami dibangun di atas enam prinsip dasar.",
  )

  const rawItems = Array.isArray(props.items) && props.items.length > 0 ? props.items : DEFAULT_IMPACT_VALUES
  const items = rawItems.map((item, idx) => {
    const fallback = DEFAULT_IMPACT_VALUES[idx] || DEFAULT_IMPACT_VALUES[0]
    const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {}
    const letter = String(obj.letter || fallback.letter || "").toUpperCase()
    return {
      letter,
      title: String(obj.title || fallback.title || ""),
      desc: String(obj.desc || fallback.desc || ""),
      icon: IMPACT_ICONS[letter] || Lightbulb,
    }
  })

  return (
    <section className="border-b border-border/60 bg-secondary/30 py-20">
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
          {culture && (
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              <BilingualText text={culture} />
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((val) => {
            const Icon = val.icon
            return (
              <div
                key={val.letter}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-2xl font-black text-primary/40 group-hover:text-primary transition-colors">
                      {val.letter}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    <BilingualText text={val.title} />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <BilingualText text={val.desc} />
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
