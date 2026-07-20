import { ArrowUpRight, BellRing, Cpu, Zap } from "lucide-react"
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

const serviceDetails = {
  "electrical-services": {
    icon: Zap,
    items: [
      "Build & assembly",
      "Installation & construction",
      "Testing & commissioning",
      "Predictive & preventive maintenance",
      "Operation & maintenance",
      "Electrical study, design & engineering",
    ],
  },
  "industrial-automation": {
    icon: Cpu,
    items: [
      "HMI, SCADA & remote monitoring",
      "PLC programming & integration",
      "Design & engineering of control systems",
      "Implementation & application",
      "Reporting & data analytics",
      "Process improvement & optimization",
    ],
  },
  "fire-alarm": {
    icon: BellRing,
    items: [
      "Installation",
      "Maintenance",
      "Centralizing",
    ],
  },
}

const primaryServiceSlugs = ["electrical-services", "fire-alarm", "industrial-automation"]

type ServicesProps = {
  services?: ContentNode[]
  props?: Record<string, unknown>
}

const headingDefaults = {
  eyebrow: "What we do",
  title: "Three core services. One trusted partner.",
  description:
    "From greenfield installation to long-term operation and maintenance, our certified engineers deliver high-quality solutions tailored to each plant and facility.",
}

export function Services({ services = fallbackServices, props = {} }: ServicesProps) {
  const merged = { ...headingDefaults, ...props }
  const eyebrow = typeof merged.eyebrow === "string" ? merged.eyebrow : ""
  const title = typeof merged.title === "string" ? merged.title : ""
  const description = typeof merged.description === "string" ? merged.description : ""
  const sourceServices = primaryServiceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is ContentNode => Boolean(service))
  const displayServices = sourceServices.length === primaryServiceSlugs.length ? sourceServices : services.slice(0, 3)

  return (
    <section className="border-b border-border/60 bg-secondary/40">
      <div className={container("py-20")}>
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service) => {
            const detail = serviceDetails[service.slug as keyof typeof serviceDetails] ?? serviceDetails["electrical-services"]
            const Icon = detail.icon
            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden border-border/70 bg-card transition-shadow hover:shadow-md"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-accent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <CardHeader>
                  <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="font-display text-xl">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 border-t border-border/70 pt-5">
                    {detail.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-snug text-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.fullPath}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Read more
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
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
