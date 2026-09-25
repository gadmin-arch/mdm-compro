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
import { BrandMarquee } from "@/components/brand-marquee"
import { BilingualText } from "@/components/cms/content-language"

const impactValues = [
  {
    letter: "I",
    title: "EN: Integrity & Innovation\nID: Integritas & Inovasi",
    desc: "EN: Building trust through honesty and responsibility while advancing with modern, up-to-date technologies.\nID: Membangun kepercayaan melalui kejujuran dan tanggung jawab seraya terus berinovasi dengan teknologi termutakhir.",
    icon: Lightbulb,
  },
  {
    letter: "M",
    title: "EN: Mastery & Intelligent Problem-Solving\nID: Keahlian Teknis & Solusi Cerdas",
    desc: "EN: Deep technical mastery in electrical and automation systems with structured precision engineering — not assumptions.\nID: Penguasaan teknis mendalam di bidang sistem kelistrikan dan otomasi melalui rekayasa presisi yang terstruktur — bukan asumsi.",
    icon: Target,
  },
  {
    letter: "P",
    title: "EN: Professional & Trusted Partnership\nID: Kemitraan Profesional & Terpercaya",
    desc: "EN: Discipline, consistency, and high execution standards that position us as a strategic long-term partner.\nID: Disiplin, konsistensi, dan standar eksekusi tinggi yang menempatkan kami sebagai mitra strategis jangka panjang.",
    icon: HeartHandshake,
  },
  {
    letter: "A",
    title: "EN: Agile & Adaptable Execution\nID: Eksekusi Tangkas & Adaptif",
    desc: "EN: Swift, resilient response to evolving site dynamics, operational challenges, and technological demands.\nID: Tanggap dan tangguh dalam merespons dinamika lapangan yang berkembang, tantangan operasional, dan tuntutan teknologi.",
    icon: Sparkles,
  },
  {
    letter: "C",
    title: "EN: Commitment to Safety & Customer First\nID: Komitmen Keselamatan (K3) & Utamakan Pelanggan",
    desc: "EN: Safety is non-negotiable. Prioritizing operational continuity, asset reliability, and zero-accident culture.\nID: Keselamatan tidak dapat ditawar. Memprioritaskan kontinuitas operasional, keandalan aset, dan budaya nihil kecelakaan kerja.",
    icon: ShieldCheck,
  },
  {
    letter: "T",
    title: "EN: Total Engineering Solutions\nID: Solusi Rekayasa Teknik Menyeluruh",
    desc: "EN: End-to-end coverage from design, assembly, and installation to testing, commissioning, and lifecycle maintenance.\nID: Cakupan menyeluruh dari perancangan, perakitan, dan instalasi hingga pengujian, commissioning, serta pemeliharaan siklus hidup aset.",
    icon: Wrench,
  },
]

const milestones = [
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

const targetIndustries = [
  { name: "EN: Petrochemical & Refineries\nID: Petrokimia & Kilang Minyak", icon: Fuel },
  { name: "EN: Oil & Gas, Mining & Energy\nID: Minyak & Gas, Pertambangan & Energi", icon: Flame },
  { name: "EN: Power Plants & Utility Substations\nID: Pembangkit Listrik & Gardu Induk", icon: Zap },
  { name: "EN: Food & Beverage (F&B) & FMCG\nID: Makanan & Minuman (F&B) serta FMCG", icon: Utensils },
  { name: "EN: Pulp & Paper, Cement & Heavy Industry\nID: Pulp & Kertas, Semen & Industri Berat", icon: Factory },
  { name: "EN: Pharmaceuticals & Healthcare\nID: Farmasi & Fasilitas Kesehatan", icon: Pill },
  { name: "EN: Manufacturing & Industrial Assembly\nID: Manufaktur & Perakitan Industri", icon: Wrench },
  { name: "EN: Commercial High-Rise & Infrastructure\nID: Gedung Komersial & Infrastruktur Publik", icon: Building2 },
]

const hsePillars = [
  {
    title: "EN: PROTECT Every Person\nID: LINDUNGI Setiap Insan",
    subtitle: "EN: Safety begins with individual awareness\nID: Keselamatan berawal dari kesadaran individu",
    desc: "EN: Comprehensive safety briefings, mandatory PPE compliance, and risk assessments before any field task begins.\nID: Briefing keselamatan komprehensif, kepatuhan APD wajib, dan asesmen risiko sebelum pekerjaan lapangan dimulai.",
    icon: HardHat,
  },
  {
    title: "EN: CARE For Each Other\nID: PEDULI Terhadap Sesama",
    subtitle: "EN: Caring today, protecting the future\nID: Peduli hari ini, menjaga masa depan",
    desc: "EN: Proactive mutual oversight among team members on high-voltage and critical manufacturing sites.\nID: Pengawasan aktif antar anggota tim di lokasi proyek tegangan tinggi dan lingkungan manufaktur kritis.",
    icon: Shield,
  },
  {
    title: "EN: COMMIT To Excellence\nID: KOMITMEN Menuju Keunggulan",
    subtitle: "EN: Safe execution defines professionalism\nID: Eksekusi aman adalah cerminan profesionalisme",
    desc: "EN: Adherence to national and international safety regulations without compromising quality or timeline.\nID: Kepatuhan penuh terhadap regulasi keselamatan nasional dan internasional tanpa mengurangi mutu atau jadwal kerja.",
    icon: Award,
  },
  {
    title: "EN: SUSTAIN For The Future\nID: KEBERLANJUTAN untuk Masa Depan",
    subtitle: "EN: Safety is an investment in sustainability\nID: Keselamatan adalah investasi masa depan",
    desc: "EN: Continuous safety training, incident prevention reporting, and sustainable environmental practices.\nID: Pelatihan K3 berkelanjutan, pelaporan pencegahan insiden, dan penerapan tata kelola lingkungan yang ramah alam.",
    icon: Scale,
  },
]

const legalCertifications = [
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

const licensedExperts = [
  "AK3 Listrik (Ahli K3 Listrik Kemnaker)",
  "AK3 Umum (Ahli K3 Umum)",
  "AK3 Kebakaran (Kelas A, B, C, D)",
  "Teknisi Kompetensi Tegangan Menengah ESDM",
  "Licensed Mechanical & Termination Specialists",
]

const testingToolsFleet = [
  {
    name: "Partial Discharge Analyzer & Scanner",
    category: "EN: Predictive Diagnosis\nID: Diagnosis Prediktif",
    desc: "EN: Non-invasive insulation breakdown detection for MV/HV switchgear & cables.\nID: Deteksi degradasi isolasi non-invasif untuk switchgear & kabel tegangan menengah/tinggi.",
  },
  {
    name: "Omicron Secondary Injection & Relay Tester",
    category: "EN: Protection Testing\nID: Pengujian Proteksi",
    desc: "EN: High-precision automated protection relay calibration and CT/VT analysis.\nID: Kalibrasi otomatis presisi tinggi relay proteksi serta analisis karakteristik CT/VT.",
  },
  {
    name: "Megger & Fluke Insulation / Earth Resistance",
    category: "EN: Electrical Safety\nID: Keselamatan Elektrikal",
    desc: "EN: Up to 10kV digital insulation resistance, ground grid integrity & loop impedance testing.\nID: Pengujian resistansi isolasi digital hingga 10kV, integritas grid pentanahan & impedansi loop.",
  },
  {
    name: "Fluke 3-Phase Power Quality Analyzer",
    category: "EN: Power Analysis\nID: Analisis Kualitas Daya",
    desc: "EN: Harmonics, voltage dips/swells, transient analysis and energy audit profiling.\nID: Analisis harmonisa (THDi/THDv), fluktuasi tegangan, transien dan audit efisiensi energi.",
  },
  {
    name: "Transformer Oil BDV & DGA Treatment Unit",
    category: "EN: Substation Maintenance\nID: Pemeliharaan Gardu",
    desc: "EN: Breakdown voltage testing, dissolved gas analysis, filtering, and purification.\nID: Uji tegangan tembus oli (BDV), uji gas terlarut (DGA), filtrasi, dan pemurnian oli trafo.",
  },
  {
    name: "Circuit Breaker Dynamic Timing Analyzer",
    category: "EN: Switchgear Testing\nID: Pengujian Switchgear",
    desc: "EN: Contact resistance (micro-ohm), opening/closing velocity, and stroke measurement.\nID: Pengukuran resistansi kontak (micro-ohm), kecepatan buka/tutup kontak, dan panjang langkah breaker.",
  },
]

const authorizedPartners = [
  { name: "Rittal", role: "EN: Authorized Distributor\nID: Distributor Resmi", country: "Germany" },
  { name: "Schneider Electric", role: "EN: Certified System Integrator\nID: Certified System Integrator", country: "France / Global" },
  { name: "xArrow", role: "EN: Authorized Solutions Partner\nID: Mitra Solusi Resmi", country: "Global" },
  { name: "Mundung", role: "EN: Authorized Partner\nID: Mitra Resmi", country: "Global" },
]

const experiencedBrands = [
  "ABB",
  "Siemens",
  "Hitachi",
  "TRAFINDO",
  "B&D Transformer",
  "Raychem",
  "3M",
  "Legrand",
  "Socomec",
  "Autonics",
  "Omron",
  "CHINT",
  "MSA",
  "Honeywell",
  "Bosch",
  "Asenware",
  "Hooseki",
  "Simplex",
  "Hikvision",
  "Advantech",
  "Pepperl+Fuchs",
  "Moxa",
  "Phoenix Contact",
  "Weidmüller",
  "Supreme",
  "KMI Wire and Cable",
  "GE",
  "Danfoss",
  "GAE",
  "LS Electric",
  "Megger",
  "Fluke",
  "FLIR",
  "Huazheng",
]

const IMPACT_ICONS: Record<string, typeof Lightbulb> = {
  I: Lightbulb,
  M: Target,
  P: HeartHandshake,
  A: Sparkles,
  C: ShieldCheck,
  T: Wrench,
}

export function About({ page }: { page?: PageContent | null }) {
  const content = page?.content ?? {}
  const overview = String(
    content.overview ??
      "EN: Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.\nID: Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.",
  )
  const vision = String(
    content.vision ??
      "EN: Global Electrical, Automation and Fire Alarm Services Company.\nID: Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.",
  )
  const mission = String(
    content.mission ??
      "EN: Mutual Partnership and Professionalism in delivering every engineering engagement.\nID: Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.",
  )

  const tagline = content.tagline
    ? String(content.tagline)
    : "EN: Always Make an IMPACT — Powering Solution, Creating Impact\nID: Always Make an IMPACT — Solusi Kelistrikan Andal, Menciptakan Dampak Nyata"

  const culture = content.culture
    ? String(content.culture)
    : "EN: Our culture of disciplined engineering, safety commitment, and innovation is built around six foundational principles.\nID: Budaya disiplin rekayasa teknik, komitmen keselamatan, dan inovasi kami dibangun di atas enam prinsip dasar."

  const established = content.established
    ? (String(content.established).includes("EN:")
        ? String(content.established)
        : `EN: Established ${content.established}\nID: Berdiri Sejak ${content.established}`)
    : "EN: Established 2012\nID: Berdiri Sejak 2012"

  const experienceYears = content.experienceYears
    ? (String(content.experienceYears).includes("Years") || String(content.experienceYears).includes("Tahun")
        ? String(content.experienceYears)
        : `${content.experienceYears} Years`)
    : "14+ Years"

  const clientCount = content.clientCount ? String(content.clientCount) : "400+"
  const teamCount = content.teamCount ? String(content.teamCount) : "200+"
  const foundedYear = content.established ? String(content.established) : "2012"

  const resolvedImpactValues = Array.isArray(content.impactValues) && content.impactValues.length > 0
    ? (content.impactValues as Array<Record<string, unknown>>).map((item, idx) => {
        const fallback = impactValues[idx] || impactValues[0]
        const letter = String(item.letter || fallback.letter || "").toUpperCase()
        return {
          letter,
          title: String(item.title || fallback.title || ""),
          desc: String(item.desc || fallback.desc || ""),
          icon: IMPACT_ICONS[letter] || fallback.icon || Lightbulb,
        }
      })
    : impactValues

  const rawLicensedExperts = Array.isArray(content.licensedExperts)
    ? content.licensedExperts
    : typeof content.licensedExperts === "string"
      ? content.licensedExperts.split("\n").map((s) => s.trim()).filter(Boolean)
      : null

  const resolvedLicensedExperts: string[] =
    rawLicensedExperts && rawLicensedExperts.length > 0
      ? rawLicensedExperts.map((item) => String(item))
      : licensedExperts

  const rawCertifications = Array.isArray(content.certifications)
    ? content.certifications
    : typeof content.certifications === "string"
      ? content.certifications.split("\n").map((s) => s.trim()).filter(Boolean)
      : null

  const resolvedCertifications =
    rawCertifications && rawCertifications.length > 0
      ? rawCertifications.map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            const obj = item as Record<string, unknown>
            return {
              title: String(obj.title || ""),
              desc: String(obj.desc || ""),
              badge: String(obj.badge || "Certified"),
            }
          }
          const strItem = String(item)
          const matched = legalCertifications.find(
            (c) =>
              c.title.toLowerCase() === strItem.toLowerCase() ||
              strItem.toLowerCase().includes(c.title.toLowerCase())
          )
          if (matched) {
            return {
              ...matched,
              title: strItem.includes("(") ? strItem.split("(")[0].trim() : matched.title,
            }
          }
          const fallback = legalCertifications[idx % legalCertifications.length]
          return {
            title: strItem,
            desc: fallback?.desc || strItem,
            badge: fallback?.badge || "Certified",
          }
        })
      : legalCertifications

  const rawTestingTools = Array.isArray(content.testingTools)
    ? content.testingTools
    : typeof content.testingTools === "string"
      ? content.testingTools.split("\n").map((s) => s.trim()).filter(Boolean)
      : null

  const resolvedTestingTools =
    rawTestingTools && rawTestingTools.length > 0
      ? rawTestingTools.map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            const obj = item as Record<string, unknown>
            return {
              name: String(obj.name || ""),
              category: String(obj.category || ""),
              desc: String(obj.desc || ""),
            }
          }
          const strItem = String(item)
          const matched = testingToolsFleet.find(
            (t) => t.name.toLowerCase() === strItem.toLowerCase()
          )
          if (matched) return matched
          const fallback = testingToolsFleet[idx % testingToolsFleet.length]
          return {
            name: strItem,
            category: fallback?.category || "EN: Diagnostic Tool\nID: Peralatan Diagnostik",
            desc: fallback?.desc || strItem,
          }
        })
      : testingToolsFleet

  const rawPartnerships = Array.isArray(content.partnerships)
    ? content.partnerships
    : typeof content.partnerships === "string"
      ? content.partnerships.split("\n").map((s) => s.trim()).filter(Boolean)
      : null

  const resolvedAuthorizedPartners =
    Array.isArray(content.authorizedPartners) && content.authorizedPartners.length > 0
      ? (content.authorizedPartners as typeof authorizedPartners)
      : authorizedPartners

  const resolvedExperiencedBrands =
    rawPartnerships && rawPartnerships.length > 0
      ? rawPartnerships.map((p) => String(p).replace(/\(.*\)/, "").trim()).filter(Boolean)
      : experiencedBrands

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
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    <BilingualText text={established} />
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold leading-snug">
                    <BilingualText text={tagline} />
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">
                  <BilingualText text="EN: About PT Multi Daya Mitra\nID: Tentang PT Multi Daya Mitra" />
                </span>
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                <BilingualText text="EN: Integrated electrical, automation & safety solutions for heavy industry.\nID: Solusi terintegrasi elektrikal, otomasi & keselamatan untuk industri berat." />
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p><BilingualText text={overview} /></p>
                <p>
                  <BilingualText text="EN: From our headquarters in East Java and branch network across Indonesia, we serve heavy industries including power generation, oil & gas, petrochemicals, manufacturing, food & beverage, cement, pharmaceuticals, and critical infrastructure.\nID: Berpusat di Jawa Timur dengan jangkauan proyek di seluruh Indonesia, kami melayani industri berat termasuk pembangkit listrik, migas, petrokimia, manufaktur, makanan & minuman, semen, farmasi, dan infrastruktur strategis." />
                </p>
              </div>

              {/* 4 Key Numerical Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-y border-border/70 py-6">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{experienceYears}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <BilingualText text="EN: Business Experience\nID: Pengalaman Industri" />
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{clientCount}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <BilingualText text="EN: Corporate Clients\nID: Klien Korporasi" />
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{teamCount}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <BilingualText text="EN: Staff & Engineers\nID: Tim Ahli & Insinyur" />
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{foundedYear}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <BilingualText text="EN: Founded in Surabaya\nID: Berdiri di Surabaya" />
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Compass className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      <BilingualText text="EN: Our Vision\nID: Visi Kami" />
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    <BilingualText text={vision} />
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/30 text-foreground">
                      <Target className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      <BilingualText text="EN: Our Mission\nID: Misi Kami" />
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    <BilingualText text={mission} />
                  </p>
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
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Core Values\nID: Nilai Utama" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: The IMPACT Values Driving Every Project\nID: Nilai-Nilai IMPACT yang Menjadi Landasan Setiap Proyek" />
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              <BilingualText text={culture} />
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resolvedImpactValues.map((val) => {
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

      {/* 3. Company Growth & Milestones Timeline (2012–2026) */}
      <section className="border-b border-border/60 bg-background py-20">
        <div className={container()}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Journey & Evolution\nID: Perjalanan & Perkembangan" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: 14 Years of Continuous Growth (2012 – 2026)\nID: 14 Tahun Pertumbuhan Berkelanjutan (2012 – 2026)" />
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              <BilingualText text="EN: Step-by-step development of technical mastery, international accreditations, and nationwide execution excellence.\nID: Perkembangan bertahap dalam keahlian teknis, akreditasi internasional, dan keunggulan eksekusi berskala nasional." />
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

      {/* 4. Target Industries Served */}
      <section className="border-b border-border/60 bg-secondary/25 py-20">
        <div className={container()}>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Market Segments\nID: Segmen Pasar" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: Industries We Serve\nID: Sektor Industri yang Kami Layani" />
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <BilingualText text="EN: Tailored electrical, automation, and lifecycle maintenance support across critical manufacturing and infrastructure sectors.\nID: Dukungan elektrikal, otomasi, dan pemeliharaan siklus hidup yang disesuaikan untuk sektor manufaktur dan infrastruktur penting." />
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
                  <span className="font-display text-xs font-semibold text-foreground leading-snug">
                    <BilingualText text={ind.name} />
                  </span>
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
                  <BilingualText text="EN: HSE & Safety Commitment\nID: Komitmen K3 & Keselamatan Kerja" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                  <BilingualText text="EN: &ldquo;I Choose Safety&rdquo;\nID: &ldquo;Saya Pilih Selamat&rdquo;" />
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <BilingualText text="EN: Safe & Healthy at All Times · Think Safe, Work Safe, Go Home Safe\nID: Selamat & Sehat Setiap Saat · Pikirkan Selamat, Bekerja Selamat, Pulang Selamat" />
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <BilingualText text="EN: Safety is non-negotiable. At PT Multi Daya Mitra, every engineer, technician, and subcontractor is empowered with stop-work authority whenever safety conditions are compromised.\nID: Keselamatan tidak dapat ditawar. Di PT Multi Daya Mitra, setiap insinyur, teknisi, dan subkontraktor memiliki otoritas untuk menghentikan pekerjaan (stop-work authority) jika kondisi keselamatan kerja terkompromi." />
                </p>

                <div className="mt-6 space-y-2.5 border-t border-border/60 pt-5">
                  <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      <BilingualText text="EN: Zero Accident Policy across all site engagements\nID: Kebijakan Nihil Kecelakaan (Zero Accident) di setiap lokasi proyek" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      <BilingualText text="EN: SMK3 Kemenaker & ISO 45001:2018 Certified\nID: Bersertifikasi SMK3 Kemenaker & ISO 45001:2018" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      <BilingualText text="EN: Avetta Contractor Safety Network Verified\nID: Terverifikasi dalam Jaringan Keselamatan Kontraktor Avetta" />
                    </span>
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
                          <h4 className="font-display text-sm font-semibold text-foreground">
                            <BilingualText text={p.title} />
                          </h4>
                          <p className="text-xs text-muted-foreground italic">
                            <BilingualText text={p.subtitle} />
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        <BilingualText text={p.desc} />
                      </p>
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
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Trust & Credentials\nID: Legalitas & Kredensial" />
              </span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <BilingualText text="EN: Legal Compliance, ISO Certifications & Official Credentials\nID: Kepatuhan Hukum, Sertifikasi ISO & Kredensial Resmi" />
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <BilingualText text="EN: Documented compliance, safety accreditations, and official licensing supporting industrial vendor qualification and tender audits.\nID: Kepatuhan terdokumentasi, akreditasi keselamatan, dan perizinan resmi untuk kualifikasi vendor industri serta audit tender." />
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {resolvedCertifications.map((cert, idx) => (
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

          {/* Licensed Experts Box */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      <BilingualText text="EN: Certified Engineering Team\nID: Tim Insinyur Bersertifikasi" />
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      <BilingualText text="EN: Competent & Licensed Workforce\nID: Tenaga Kerja Kompeten & Berlisensi" />
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  <BilingualText text="EN: All field operations and site assessments are led by licensed engineering specialists certified by the Ministry of Manpower, Ministry of Energy and Mineral Resources (ESDM), and global automation principals.\nID: Seluruh operasional lapangan dan asesmen teknis dipimpin oleh tenaga ahli bersertifikasi dari Kementerian Ketenagakerjaan, Kementerian ESDM, dan prinsipal otomasi global." />
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {resolvedLicensedExperts.map((expert, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-border/80 bg-secondary/40 px-3.5 py-2.5 text-xs font-medium text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <BilingualText text={expert} />
                      </span>
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
                <span className="rounded-md bg-primary/10 px-2.5 py-1">
                  <BilingualText text="EN: Equipment Fleet\nID: Armada Peralatan" />
                </span>
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                <BilingualText text="EN: Advanced Testing Fleet & Calibrated Instrumentation\nID: Armada Pengujian Mutakhir & Instrumentasi Terkalibrasi" />
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                <BilingualText text="EN: We invest in calibrated, international-grade diagnostic equipment to ensure accurate measurements, rigorous commissioning, and maximum operational safety.\nID: Kami berinvestasi pada peralatan diagnostik terkalibrasi berstandar internasional demi memastikan keakuratan pengukuran, commissioning ketat, dan keselamatan operasi optimal." />
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resolvedTestingTools.map((tool, idx) => (
              <div key={`${tool.name}-${idx}`} className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                      <Activity className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <BilingualText text={tool.category} />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    <BilingualText text={tool.desc} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Authorized Partnerships */}
          <div className="mt-12 rounded-2xl border border-primary/25 bg-card p-6 lg:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <BilingualText text="EN: Authorized Partnership\nID: Kemitraan Resmi Principal" />
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {resolvedAuthorizedPartners.map((p) => (
                <div
                  key={p.name}
                  className="group rounded-xl border border-border bg-secondary/20 p-4 text-center transition-all hover:border-primary/40 hover:bg-card hover:shadow-xs"
                >
                  <div className="flex items-center justify-center h-12 w-full">
                    <BrandLogo
                      brand={p.name}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs font-semibold text-primary mt-2">
                    <BilingualText text={p.role} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Experienced Work With Brand */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
              <BilingualText text="EN: Experienced Work With Brand\nID: Pengalaman Proyek Berbagai Brand" />
            </h3>
            <BrandMarquee brands={resolvedExperiencedBrands} />
          </div>
        </div>
      </section>

      {/* 8. Our Offices & Workshop Locations Section */}
      <section className="border-t border-border/60 bg-secondary/15 py-16">
        <div className={container()}>
          <div className="text-center md:text-left">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              <BilingualText text="EN: Our Offices & Workshop\nID: Kantor & Fasilitas Workshop Kami" />
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <BilingualText text="EN: Contact our headquarters or engineering workshop for project coordination, site assessments, and emergency support.\nID: Hubungi kantor pusat atau workshop rekayasa kami untuk koordinasi proyek, asesmen teknis, dan dukungan darurat." />
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <BilingualText text="EN: Head Office (Surabaya)\nID: Kantor Pusat (Surabaya)" />
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
                <BilingualText text="EN: Engineering Office & Workshop\nID: Kantor Rekayasa & Workshop" />
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">
                Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia
              </p>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-medium text-foreground">
                      <BilingualText text="EN: WhatsApp Direct:\nID: WhatsApp Langsung:" />
                    </span>
                  </p>
                  <p className="pl-5 text-muted-foreground leading-relaxed">
                    +62 811-8303-250 (Technical) &middot; +62 821-4007-4122 (Sales)
                  </p>
                </div>
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
