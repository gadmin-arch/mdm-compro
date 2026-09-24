import { GraduationCap, HeartHandshake, Layers, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"

const benefits = [
  {
    icon: TrendingUp,
    title: "EN: Career growth\nID: Jenjang Karir Jelas",
    body: "EN: Clear paths from engineer to senior, lead, and project director roles — supported by mentorship and certifications.\nID: Jalur karir terstruktur dari insinyur hingga posisi senior, lead, dan project director — didukung bimbingan serta sertifikasi.",
  },
  {
    icon: GraduationCap,
    title: "EN: Continuous learning\nID: Pembelajaran Berkelanjutan",
    body: "EN: Funded technical training, vendor certifications, and on-the-job exposure to the latest industrial systems.\nID: Pelatihan teknis bersubsidi, sertifikasi prinsipal vendor, dan pengalaman langsung menangani sistem industri modern.",
  },
  {
    icon: ShieldCheck,
    title: "EN: Safety first\nID: Keselamatan Kerja Utama",
    body: "EN: An HSE-led culture with rigorous standards, PPE, and safety briefings on every site we operate.\nID: Budaya K3 (HSE) yang kuat dengan standar ketat, APD lengkap, dan safety briefing harian di setiap lokasi proyek.",
  },
  {
    icon: Layers,
    title: "EN: Diverse projects\nID: Ragam Proyek Nyata",
    body: "EN: Work across power plants, oil & gas, manufacturing, and infrastructure — no two months look the same.\nID: Terlibat dalam proyek pembangkit listrik, migas, manufaktur, dan infrastruktur strategis di seluruh penjuru Indonesia.",
  },
  {
    icon: HeartHandshake,
    title: "EN: Team that cares\nID: Tim yang Saling Mendukung",
    body: "EN: A professional, supportive culture where engineers help each other succeed on every assignment.\nID: Budaya kerja profesional dan suportif di mana seluruh tim saling mendukung untuk meraih kesuksesan bersama.",
  },
  {
    icon: Sparkles,
    title: "EN: Meaningful work\nID: Pekerjaan yang Berdampak",
    body: "EN: Your work keeps critical facilities safe, reliable, and ready for the next decade of operation.\nID: Kontribusi nyata Anda memastikan fasilitas industri vital tetap beroperasi andal, aman, dan berdaya saing tinggi.",
  },
]

export function CareerBenefits() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <BilingualText text="EN: Why work with us\nID: Mengapa Bergabung Bersama Kami" />
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            <BilingualText text="EN: Engineering careers built on real projects.\nID: Karir rekayasa teknik yang dibangun melalui proyek nyata." />
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            <BilingualText text="EN: We believe great engineers grow fastest when they tackle real problems alongside experienced mentors — and we structure our company to make that happen.\nID: Kami percaya insinyur hebat berkembang paling pesat ketika memecahkan tantangan riil bersama mentor berpengalaman — dan organisasi kami dirancang untuk itu." />
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <li
                key={benefit.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/30 text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug text-foreground">
                  <BilingualText text={benefit.title} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <BilingualText text={benefit.body} />
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
