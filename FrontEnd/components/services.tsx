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

const serviceDetails: Record<string, { icon: React.ElementType; items: string[] }> = {
  "electrical-construction-installation": {
    icon: Zap,
    items: [
      "Substation & MV switchgear up to 36kV",
      "LV Panels assembly (MDP, SDP, ATS & Sync)",
      "MV & LV cable installation & termination",
      "Star Delta, DOL & VSD control panels",
      "Fire alarm system engineering & erection",
    ],
  },
  "electrical-maintenance-service": {
    icon: Wrench,
    items: [
      "Transformer oil treatment, BDV & DGA",
      "MV cubicle & ACB secondary injection test",
      "FLIR infrared thermography predictive audits",
      "Capacitor bank & VSD maintenance",
      "Annual Maintenance Contracts (AMC) with 24/7 SLA",
    ],
  },
  "automation-solutions-services": {
    icon: Cpu,
    items: [
      "SCADA systems & centralized telemetry (xArrow)",
      "Energy management systems (PME & ISO 50001)",
      "PLC programming (Schneider, Siemens, Rockwell)",
      "Variable speed drive (VSD) system tuning",
      "Building Automation Systems (BAS)",
    ],
  },
  "inspection-testing-commissioning": {
    icon: Activity,
    items: [
      "Power quality analysis (Fluke 435-II Class A)",
      "Partial discharge (PD scan) & ultrasonic inspection",
      "Protection relay secondary injection (Omicron)",
      "Power system study, arc flash & relay coordination",
      "Earthing & grounding system audits",
    ],
  },
  "mechanical-services-supplies": {
    icon: Settings,
    items: [
      "Conveyor systems & magnetic metal separators",
      "Sectional & high-speed industrial doors",
      "Motor & generator winding insulation recoating",
      "Dynamic rotor balancing & vibration analysis",
      "Boiler HTO maintenance & pneumatic supplies",
    ],
  },
}

type ServicesProps = {
  services?: ContentNode[]
  props?: Record<string, unknown>
}

const headingDefaults = {
  eyebrow: "Our Business Units",
  title: "Integrated Electrical, Automation & Mechanical Solutions",
  description:
    "Delivering end-to-end engineering, testing, commissioning, maintenance, and lifecycle support for critical industrial assets across Indonesia.",
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
              <span className="rounded-md bg-primary/10 px-2.5 py-1">{eyebrow}</span>
            </p>
          )}
          {title && (
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
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
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-2">
                    {service.summary}
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
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.fullPath}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline"
                  >
                    Explore Service Details
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
