import { Activity, ArrowUpRight, Cpu, Settings, Wrench, Zap } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ContentNode } from "@/lib/cms"
import { fallbackServices } from "@/lib/cms"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"

const serviceDetails: Record<string, { icon: React.ElementType; items: string[] }> = {
  "electrical-construction-installation": {
    icon: Zap,
    items: [
      "EN: Substation & MV switchgear up to 36kV\nID: Gardu induk & switchgear tegangan menengah hingga 36kV",
      "EN: LV Panels assembly (MDP, SDP, ATS & Sync)\nID: Perakitan panel LV (MDP, SDP, ATS & Sinkron)",
      "EN: MV & LV cable installation & termination\nID: Instalasi & terminasi kabel MV & LV",
      "EN: Star Delta, DOL & VSD control panels\nID: Panel kontrol Star Delta, DOL & VSD",
      "EN: Fire alarm system engineering & erection\nID: Rekayasa & pemasangan sistem alarm kebakaran",
    ],
  },
  "electrical-maintenance-service": {
    icon: Wrench,
    items: [
      "EN: Transformer oil treatment, BDV & DGA\nID: Pemurnian oli transformator, uji BDV & DGA",
      "EN: MV cubicle & ACB secondary injection test\nID: Uji injeksi sekunder kubikel MV & ACB",
      "EN: FLIR infrared thermography predictive audits\nID: Audit prediktif termografi inframerah FLIR",
      "EN: Capacitor bank & VSD maintenance\nID: Pemeliharaan bank kapasitor & VSD",
      "EN: Annual Maintenance Contracts (AMC) with 24/7 SLA\nID: Kontrak Pemeliharaan Tahunan (AMC) dengan SLA 24/7",
    ],
  },
  "automation-solutions-services": {
    icon: Cpu,
    items: [
      "EN: SCADA systems & centralized telemetry (xArrow)\nID: Sistem SCADA & telemetri terpusat (xArrow)",
      "EN: Energy management systems (PME & ISO 50001)\nID: Sistem manajemen energi (PME & ISO 50001)",
      "EN: PLC programming (Schneider, Siemens, Rockwell)\nID: Pemrograman PLC (Schneider, Siemens, Rockwell)",
      "EN: Variable speed drive (VSD) system tuning\nID: Penyetelan sistem inverter Variable Speed Drive (VSD)",
      "EN: Building Automation Systems (BAS)\nID: Sistem Otomasi Gedung (BAS)",
    ],
  },
  "inspection-testing-commissioning": {
    icon: Activity,
    items: [
      "EN: Power quality analysis (Fluke 435-II Class A)\nID: Analisis kualitas daya listrik (Fluke 435-II Kelas A)",
      "EN: Partial discharge (PD scan) & ultrasonic inspection\nID: Pemindaian Partial Discharge (PD) & inspeksi ultrasonik",
      "EN: Protection relay secondary injection (Omicron)\nID: Uji injeksi sekunder relai proteksi (Omicron)",
      "EN: Power system study, arc flash & relay coordination\nID: Studi sistem tenaga, arc flash & koordinasi relai",
      "EN: Earthing & grounding system audits\nID: Audit sistem pentanahan & pembumian",
    ],
  },
  "mechanical-services-supplies": {
    icon: Settings,
    items: [
      "EN: Conveyor systems & magnetic metal separators\nID: Sistem konveyor & pemisah logam magnetik",
      "EN: Sectional & high-speed industrial doors\nID: Pintu industri sectional & kecepatan tinggi (high-speed)",
      "EN: Motor & generator winding insulation recoating\nID: Pelapisan ulang insulasi kumparan motor & generator",
      "EN: Dynamic rotor balancing & vibration analysis\nID: Balancing rotor dinamis & analisis getaran",
      "EN: Boiler HTO maintenance & pneumatic supplies\nID: Pemeliharaan boiler HTO & pasokan pneumatik",
    ],
  },
}

type ServicesProps = {
  services?: ContentNode[]
  props?: Record<string, unknown>
}

const headingDefaults = {
  eyebrow: "EN: Our Business Units\nID: Unit Bisnis Kami",
  title: "EN: Integrated Electrical, Automation & Mechanical Solutions\nID: Solusi Terintegrasi Elektrikal, Otomasi & Mekanikal",
  description:
    "EN: Delivering end-to-end engineering, testing, commissioning, maintenance, and lifecycle support for critical industrial assets across Indonesia.\nID: Menghadirkan solusi menyeluruh untuk rekayasa teknik, pengujian, komisioning, pemeliharaan, dan dukungan siklus hidup aset industri vital di seluruh Indonesia.",
}

export function Services({ services = fallbackServices, props = {} }: ServicesProps) {
  const merged = { ...headingDefaults, ...props }
  const eyebrow = typeof merged.eyebrow === "string" ? merged.eyebrow : ""
  const title = typeof merged.title === "string" ? merged.title : ""
  const description = typeof merged.description === "string" ? merged.description : ""

  const displayServices = services && services.length > 0 ? services : fallbackServices

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
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              <BilingualText text={title} />
            </h2>
          )}
          {description && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              <BilingualText text={description} />
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service) => {
            const detail =
              serviceDetails[service.slug] ??
              serviceDetails["electrical-construction-installation"]
            const Icon = detail.icon
            return (
              <Card
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100"
                />
                <CardHeader>
                  <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="font-display text-xl leading-snug">
                    <BilingualText text={service.title} />
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-2">
                    <BilingualText text={service.summary} />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-1">
                  <ul className="space-y-2 border-t border-border/70 pt-4">
                    {detail.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs leading-relaxed text-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span>
                          <BilingualText text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.fullPath}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline"
                  >
                    <BilingualText text="EN: Explore Service Details\nID: Lihat Detail Layanan" />
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
