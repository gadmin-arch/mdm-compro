import Image from "next/image"
import {
  Activity,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  Factory,
  FileCheck2,
  Flame,
  Fuel,
  HardHat,
  HeartHandshake,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Pill,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Utensils,
  Wrench,
  Zap,
} from "lucide-react"
import type { PageContent } from "@/lib/cms"
import { container } from "@/lib/layout"
import { BrandLogo } from "@/components/brand-logos"

const impactValues = [
  {
    letter: "I",
    title: "Integrity & Innovation",
    desc: "Building trust through honesty and responsibility while advancing with modern, up-to-date technologies.",
    icon: Lightbulb,
  },
  {
    letter: "M",
    title: "Mastery & Intelligent Problem-Solving",
    desc: "Deep technical mastery in electrical and automation systems with structured precision engineering — not assumptions.",
    icon: Target,
  },
  {
    letter: "P",
    title: "Professional & Trusted Partnership",
    desc: "Discipline, consistency, and high execution standards that position us as a strategic long-term partner.",
    icon: HeartHandshake,
  },
  {
    letter: "A",
    title: "Agile & Adaptable Execution",
    desc: "Swift, resilient response to evolving site dynamics, operational challenges, and technological demands.",
    icon: Sparkles,
  },
  {
    letter: "C",
    title: "Commitment to Safety & Customer First",
    desc: "Safety is non-negotiable. Prioritizing operational continuity, asset reliability, and zero-accident culture.",
    icon: ShieldCheck,
  },
  {
    letter: "T",
    title: "Total Engineering Solutions",
    desc: "End-to-end coverage from design, assembly, and installation to testing, commissioning, and lifecycle maintenance.",
    icon: Wrench,
  },
]

const milestones = [
  { year: "2012", title: "Establishment", desc: "Founded PT Multi Daya Mitra in Surabaya, building a strong foundation in electrical engineering services." },
  { year: "2013", title: "Early Market Trust", desc: "Successfully delivered diverse low & medium voltage projects, building market reputation." },
  { year: "2014", title: "Automation & ISO 50001", desc: "Expanded into automation solutions and delivered our first energy management system (ISO 50001) project." },
  { year: "2016", title: "Security & BAS Systems", desc: "Diversified into Industrial Security Systems and Building Automation Systems (BAS)." },
  { year: "2017", title: "Panel Assembly & Construction", desc: "Enhanced capabilities with custom panel assembly and executed major turnkey construction projects." },
  { year: "2018", title: "International Expansion", desc: "Expanded into international markets and launched dedicated electrical product lines." },
  { year: "2019", title: "Testing Fleet & Partnerships", desc: "Formed strategic drive partnerships and expanded capabilities in testing, commissioning, and assessment." },
  { year: "2020", title: "Nationwide Maintenance", desc: "Achieved nationwide maintenance contract coverage, serving industrial clients across Indonesia." },
  { year: "2021", title: "Business Digitalization", desc: "Digitalized operational workflows to improve project turnaround time and engineering quality." },
  { year: "2022", title: "ISO Operational Excellence", desc: "Achieved integrated ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certifications." },
  { year: "2024", title: "Global Principal Alliances", desc: "Solidified authorized partnerships with global electrical and enclosure leaders (Rittal & Schneider)." },
  { year: "2026", title: "High Voltage Portfolio", desc: "Entered the high voltage supply and services sector, expanding our technical capabilities." },
]

const targetIndustries = [
  { name: "Petrochemical & Refineries", icon: Fuel },
  { name: "Oil & Gas, Mining & Energy", icon: Flame },
  { name: "Power Plants & Utility Substations", icon: Zap },
  { name: "Food & Beverage (F&B) & FMCG", icon: Utensils },
  { name: "Pulp & Paper, Cement & Heavy Industry", icon: Factory },
  { name: "Pharmaceuticals & Healthcare", icon: Pill },
  { name: "Manufacturing & Industrial Assembly", icon: Wrench },
  { name: "Commercial High-Rise & Infrastructure", icon: Building2 },
]

const hsePillars = [
  {
    title: "PROTECT Every Person",
    subtitle: "Safety begins with individual awareness",
    desc: "Comprehensive safety briefings, mandatory PPE compliance, and risk assessments before any field task begins.",
    icon: HardHat,
  },
  {
    title: "CARE For Each Other",
    subtitle: "Caring today, protecting the future",
    desc: "Proactive mutual oversight among team members on high-voltage and critical manufacturing sites.",
    icon: Shield,
  },
  {
    title: "COMMIT To Excellence",
    subtitle: "Safe execution defines professionalism",
    desc: "Adherence to national and international safety regulations without compromising quality or timeline.",
    icon: Award,
  },
  {
    title: "SUSTAIN For The Future",
    subtitle: "Safety is an investment in sustainability",
    desc: "Continuous safety training, incident prevention reporting, and sustainable environmental practices.",
    icon: Scale,
  },
]

const legalCertifications = [
  { title: "ISO 9001:2015", desc: "Quality Management System (KAN Accredited)", badge: "Quality" },
  { title: "ISO 14001:2015", desc: "Environmental Management System", badge: "Environment" },
  { title: "ISO 45001:2018", desc: "Occupational Health & Safety (KAN Accredited)", badge: "Safety" },
  { title: "Ecovadis Silver", desc: "Top 15% Global Sustainability Rating (Nov 2024)", badge: "ESG" },
  { title: "Avetta Member", desc: "Global Contractor Safety & Compliance Network", badge: "Compliance" },
  { title: "SBUJTL & IUJPTL ESDM", desc: "Official Electrical Power Support Services License (ESDM)", badge: "License" },
  { title: "Kompetensi Level 6 ESDM", desc: "Certified Medium-Voltage Technical Competency (ESDM)", badge: "Technical" },
  { title: "SMK3 Kemenaker", desc: "National Occupational Safety & Health Management System", badge: "HSE" },
  { title: "NFPA Member", desc: "National Fire Protection Association Member", badge: "Fire System" },
  { title: "D&B Rating", desc: "Dun & Bradstreet Verified Corporate Credential", badge: "Corporate" },
]

const licensedExperts = [
  "Certified Electrical Safety Specialist (K3 Listrik - Ministry of Manpower)",
  "Certified General Occupational Safety Specialist (K3 Umum)",
  "Certified Fire Protection Specialist (Class A, B, C, D)",
  "ESDM Level 6 Certified Medium-Voltage Engineering Specialist",
  "Certified SCADA & Automation Engineers (Siemens / Schneider / Rockwell)",
  "Licensed High-Voltage & Medium-Voltage Termination Specialists",
]

const testingToolsFleet = [
  {
    name: "Partial Discharge Analyzer & Scanner",
    category: "Predictive Diagnosis",
    desc: "Non-invasive insulation breakdown detection for MV/HV switchgear & cables.",
  },
  {
    name: "Omicron Secondary Injection & Relay Tester",
    category: "Protection Testing",
    desc: "High-precision automated protection relay calibration and CT/VT analysis.",
  },
  {
    name: "Megger & Fluke Insulation / Earth Resistance",
    category: "Electrical Safety",
    desc: "Up to 10kV digital insulation resistance, ground grid integrity & loop impedance testing.",
  },
  {
    name: "Fluke 3-Phase Power Quality Analyzer",
    category: "Power Analysis",
    desc: "Harmonics, voltage dips/swells, transient analysis and energy audit profiling.",
  },
  {
    name: "Transformer Oil BDV & DGA Treatment Unit",
    category: "Substation Maintenance",
    desc: "Breakdown voltage testing, dissolved gas analysis, filtering, and purification.",
  },
  {
    name: "Circuit Breaker Dynamic Timing Analyzer",
    category: "Switchgear Testing",
    desc: "Contact resistance (micro-ohm), opening/closing velocity, and stroke measurement.",
  },
]

const authorizedPartners = [
  { name: "Schneider Electric", role: "Certified System Integrator", country: "France / Global" },
  { name: "Rittal", role: "Authorized Distributor", country: "Germany" },
  { name: "xArrow", role: "Authorized Solutions Partner", country: "Global" },
  { name: "Bosch", role: "Fire Alarm & Security Systems Partner", country: "Germany / Global" },
]

export function About({ page }: { page?: PageContent | null }) {
  const content = page?.content ?? {}
  const overview = String(
    content.overview ??
      "Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.",
  )
  const vision = String(content.vision ?? "Global Electrical, Automation and Fire Alarm Services Company.")
  const mission = String(content.mission ?? "Mutual Partnership and Professionalism in delivering every engineering engagement.")

  return (
    <>
      {/* 1. Overview & Key Stats Section */}
      <section className="border-b border-border/60 bg-background">
        <div className={container("py-20")}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary shadow-md">
                <Image
                  src="/uploads/automation-project.jpg"
                  alt="PT Multi Daya Mitra industrial automation and electrical team"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">Established 2012</p>
                  <p className="mt-1 font-display text-lg font-semibold leading-snug">
                    Always Make an IMPACT — Powering Solution, Creating Impact
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">About PT Multi Daya Mitra</span>
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                Integrated electrical, automation & safety solutions for heavy industry.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>{overview}</p>
                <p>
                  From our headquarters in East Java and branch network across Indonesia, we serve heavy industries including
                  power generation, oil & gas, petrochemicals, manufacturing, food & beverage, cement, pharmaceuticals, and
                  critical infrastructure.
                </p>
              </div>

              {/* 4 Key Numerical Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-y border-border/70 py-6">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">14+ Years</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Business Experience</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">400+</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Corporate Clients</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">200+</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Staff & Engineers</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">2012</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Founded in Surabaya</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Compass className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Our Vision
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{vision}</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/30 text-foreground">
                      <Target className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Our Mission
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mission}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Values: IMPACT */}
      <section className="border-b border-border/60 bg-secondary/30 py-20">
        <div className={container()}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Core Values</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The <span className="text-primary font-bold">IMPACT</span> Values Driving Every Project
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Our culture of disciplined engineering, safety commitment, and innovation is built around six foundational
              principles.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impactValues.map((val) => {
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
                    <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{val.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{val.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Company Growth & Milestones Timeline (2012–2026) */}
      <section className="border-b border-border/60 bg-background py-20">
        <div className={container()}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Journey & Evolution</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              14 Years of Continuous Growth (2012 – 2026)
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Step-by-step development of technical mastery, international accreditations, and nationwide execution excellence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="relative rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 font-display text-xs font-bold text-primary">
                    {m.year}
                  </span>
                  <h4 className="mt-3 font-display text-base font-semibold text-foreground">{m.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Target Industries Served */}
      <section className="border-b border-border/60 bg-secondary/25 py-20">
        <div className={container()}>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Market Segments</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Industries We Serve
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Tailored electrical, automation, and lifecycle maintenance support across critical manufacturing and infrastructure sectors.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {targetIndustries.map((ind) => {
              const Icon = ind.icon
              return (
                <div
                  key={ind.name}
                  className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-xs font-semibold text-foreground leading-snug">{ind.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Safety & HSE Culture: "Saya Pilih Selamat" */}
      <section className="border-b border-border/60 bg-background py-20">
        <div className={container()}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20 p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  HSE & Safety Commitment
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                  &ldquo;I Choose Safety&rdquo;
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Safe & Healthy at All Times · Think Safe, Work Safe, Go Home Safe
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Safety is non-negotiable. At PT Multi Daya Mitra, every engineer, technician, and subcontractor is empowered
                  with stop-work authority whenever safety conditions are compromised.
                </p>

                <div className="mt-6 space-y-2.5 border-t border-border/60 pt-5">
                  <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Zero Accident Policy across all site engagements</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>SMK3 Kemenaker & ISO 45001:2018 Certified</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Avetta Contractor Safety Network Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-5 sm:grid-cols-2">
                {hsePillars.map((p) => {
                  const Icon = p.icon
                  return (
                    <div key={p.title} className="rounded-xl border border-border bg-card p-5 shadow-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-semibold text-foreground">{p.title}</h4>
                          <p className="text-xs text-muted-foreground italic">{p.subtitle}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust, Legalitas, ISO & Compliance Center */}
      <section className="border-b border-border/60 bg-secondary/20 py-20">
        <div className={container()}>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">Trust & Credentials</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Legal Compliance, ISO Certifications & Official Credentials
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Documented compliance, safety accreditations, and official licensing supporting industrial vendor qualification and tender audits.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {legalCertifications.map((cert) => (
              <div
                key={cert.title}
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
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Licensed Experts Box */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">Certified Engineering Team</h3>
                    <p className="text-xs text-muted-foreground">Competent & Licensed Workforce</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  All field operations and site assessments are led by licensed engineering specialists certified by the Ministry of Manpower, Ministry of Energy and Mineral Resources (ESDM), and global automation principals.
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {licensedExperts.map((expert, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-border/80 bg-secondary/40 px-3.5 py-2.5 text-xs font-medium text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{expert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Calibrated Testing Equipment & Tools Fleet */}
      <section className="border-b border-border/60 bg-background py-20">
        <div className={container()}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1">Equipment Fleet</span>
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Advanced Testing Fleet & Calibrated Instrumentation
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                We invest in calibrated, international-grade diagnostic equipment to ensure accurate measurements, rigorous commissioning, and maximum operational safety.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testingToolsFleet.map((tool) => (
              <div key={tool.name} className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                      <Activity className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Authorized Partnerships */}
          <div className="mt-12 rounded-xl border border-border/80 bg-secondary/30 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Official Authorized Partnerships & Principal Ecosystem
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {authorizedPartners.map((p) => (
                <div
                  key={p.name}
                  className="group rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  <div className="flex items-center justify-center h-10 w-full">
                    <BrandLogo
                      brand={p.name}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs font-semibold text-primary mt-2">{p.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Our Offices & Workshop Locations Section */}
      <section className="border-t border-border/60 bg-secondary/15 py-16">
        <div className={container()}>
          <div className="text-center md:text-left">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Our Offices & Workshop
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact our headquarters or engineering workshop for project coordination, site assessments, and emergency support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Head Office (Surabaya)
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">
                Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia
              </p>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Phone: +62 31 592 1256
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="rotate-90 h-3.5 w-3.5 text-primary" />
                  Fax: +62 31 591 7845
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  Email: info@multidayamitra.co.id
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Engineering Office & Workshop
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">
                Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia
              </p>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Hotline / WhatsApp Sales: +62 811-8303-250
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  Email: sales@multidayamitra.co.id
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
