import type { Metadata } from "next"

export type ContentLanguage = "id" | "en"

export type ContentBlock = {
  type?: string
  text?: string
  items?: string[]
  html?: string
  data?: {
    text?: string
    items?: string[]
    level?: number
  }
}

export type BilingualEnvelope = {
  bilingual: boolean
  id?: { blocks?: ContentBlock[] } | string | Record<string, unknown>
  en?: { blocks?: ContentBlock[] } | string | Record<string, unknown>
  blocks?: ContentBlock[]
}

export function isBilingualEnvelope(value: unknown): value is BilingualEnvelope {
  return Boolean(
    value &&
      typeof value === "object" &&
      ("id" in value || "en" in value) &&
      !("type" in value)
  )
}

export const DICTIONARY_EN_TO_ID: Record<string, string> = {
  // Navigation & Menus
  home: "Beranda",
  "about us": "Tentang Kami",
  about: "Tentang Kami",
  services: "Layanan",
  service: "Layanan",
  products: "Produk",
  product: "Produk",
  news: "Berita",
  careers: "Karir",
  career: "Karir",
  "contact us": "Hubungi Kami",
  contact: "Hubungi Kami",
  industries: "Industri",
  industry: "Industri",
  navigation: "Navigasi",

  // Categories & Tags
  "product & technology": "Produk & Teknologi",
  "products & technology": "Produk & Teknologi",
  "company news": "Berita Perusahaan",
  insight: "Wawasan & Edukasi",
  "industry insights": "Wawasan Industri",
  "projects & commissioning": "Proyek & Commissioning",
  "press release": "Siaran Pers",
  "csr & sustainability": "CSR & Keberlanjutan",
  "events & exhibitions": "Event & Pameran",
  "awards & achievements": "Penghargaan & Prestasi",
  general: "Umum",

  // News Titles (Live Database)
  "mv & lv electrical cabling for reliable industrial power distribution":
    "Kabel Listrik MV & LV untuk Distribusi Daya Industri yang Andal",
  "pt multi daya mitra: official rittal authorized distributor in indonesia":
    "PT Multi Daya Mitra: Distributor Resmi Rittal di Indonesia",
  "protecting industrial equipment with the right enclosure & climate control":
    "Melindungi Peralatan Industri dengan Enclosure & Kontrol Iklim yang Tepat",
  "automation & control solutions for industrial applications":
    "Solusi Otomasi & Kontrol untuk Aplikasi Industri",
  "building reliable power distribution with substation & mv switchgear":
    "Membangun Distribusi Daya Andal dengan Gardu Induk & Switchgear Tegangan Menengah",
  "mechanical services & general supplies | mdm":
    "Layanan Mekanikal & Suplai Umum | MDM",
  "scada systems, hmi, centralized telemetry, industrial monitoring, system integration":
    "Sistem SCADA, HMI, Telemetri Terpusat, Monitoring Industri & Integrasi Sistem",
  "centralized fire alarm monitoring systems for multi-building facilities":
    "Sistem Monitoring Fire Alarm Terpusat untuk Fasilitas Multi-Gedung",
  "transformer testing and maintenance":
    "Pengujian dan Pemeliharaan Transformator",
  "partial discharge analyzer":
    "Alat Analisis Partial Discharge (PD Scan)",

  // News Excerpts (Live Database)
  "reliable mv & lv cable installation, termination, jointing, testing, and commissioning services to support safe and efficient power distribution in industrial facilities.":
    "Layanan instalasi, terminasi, jointing, pengujian, dan commissioning kabel MV & LV yang andal untuk mendukung distribusi daya yang aman dan efisien di fasilitas industri.",
  "multidaya mitra is the official rittal authorized distributor in indonesia, offering industrial enclosures, climate control & cooling, and power distribution systems.":
    "Multidaya Mitra adalah Distributor Resmi Rittal di Indonesia, menyediakan enclosure industri, kontrol iklim & pendingin, serta sistem distribusi daya.",
  "electrical and automation equipment in industrial settings faces constant exposure to dust, heat, and humidity. discover how industrial enclosures and climate control systems help protect your equipment and maintain operational reliability in demanding manufacturing environments.":
    "Peralatan elektrikal dan otomasi di lingkungan industri terus terpapar debu, panas, dan kelembapan. Temukan bagaimana enclosure industri dan sistem kontrol iklim melindungi peralatan Anda serta menjaga keandalan operasional di fasilitas manufaktur.",
  "pt multi daya mitra menyediakan solusi industrial automation & control meliputi plc, scada/hmi, process visualization, dan motor drives untuk mendukung proses industri yang lebih efisien, terintegrasi, dan reliable.":
    "PT Multi Daya Mitra menyediakan solusi Otomasi & Kontrol Industri meliputi PLC, SCADA/HMI, visualisasi proses, dan motor drive untuk mendukung operasional industri yang efisien, terintegrasi, dan andal.",
  "substation and mv switchgear systems play a critical role in delivering safe, reliable, and efficient power distribution for industrial and infrastructure applications.":
    "Sistem gardu induk dan switchgear tegangan menengah (MV) memegang peran krusial dalam menyalurkan distribusi daya yang aman, andal, dan efisien untuk aplikasi industri dan infrastruktur.",
  "solusi kebutuhan mekanikal industri, mulai dari maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, hingga servicing motor dan generator untuk mendukung operasional yang andal dan efisien.":
    "Solusi kebutuhan mekanikal industri, mulai dari pemeliharaan, sistem konveyor, magnetic separator, pintu berkecepatan tinggi, vacuum lifter, hingga servis motor dan generator untuk mendukung operasional yang andal dan efisien.",
  "scada, hmi, dan centralized telemetry membantu industri melakukan monitoring equipment secara real-time, mengelola data terpusat, serta meningkatkan efisiensi dan keandalan operasional.":
    "SCADA, HMI, dan telemetri terpusat membantu industri melakukan monitoring peralatan secara real-time, mengelola data terpusat, serta meningkatkan efisiensi dan keandalan operasional.",
  "centralized fire alarm monitoring integrates multiple fire detection panels into a single command center for faster response, regulatory compliance, and operational efficiency.":
    "Monitoring fire alarm terpusat mengintegrasikan banyak panel deteksi kebakaran ke dalam satu pusat komando untuk respons lebih cepat, kepatuhan regulasi, dan efisiensi operasional.",
  "transformer health assessments including winding-resistance testing and routine field diagnostics.":
    "Penilaian kesehatan transformator termasuk pengujian resistansi belitan dan diagnostik lapangan rutin.",
  "pd scan for predictive maintenance of mv switchgear, transformers, and medium-voltage cable.":
    "PD Scan untuk pemeliharaan prediktif switchgear MV, transformator, dan kabel tegangan menengah.",

  // Services (Live Database)
  "electrical construction & installation": "Konstruksi & Instalasi Elektrikal",
  "electrical maintenance & servicing": "Pemeliharaan & Servis Elektrikal",
  "automation solutions & services": "Solusi & Layanan Otomasi Industri",
  "inspection, testing & commissioning": "Inspeksi, Pengujian & Commissioning",
  "mechanical services & general supplies": "Layanan Mekanikal & Suplai Umum",
  "mechanical services & supplies": "Layanan Mekanikal & Suplai Umum",
  "substation & mv switchgear installation": "Instalasi Gardu Induk & Switchgear MV",
  "lv panels assembly (mdp, sdp, ats & sync)": "Perakitan Panel LV (MDP, SDP, ATS & Sinkronisasi)",
  "mv & lv cable installation & termination": "Instalasi & Terminasi Kabel MV & LV",
  "transformer oil treatment & dga testing": "Treatment Oli Trafo & Pengujian DGA",
  "mv cubicle & acb maintenance": "Pemeliharaan Cubicle MV & ACB",
  "partial discharge & ultrasound testing": "Pengujian Partial Discharge & Ultrasound",
  "thermography & infrared inspection": "Inspeksi Termografi & Infrared",
  "electrical turnaround & shutdown services": "Layanan Turnaround & Shutdown Listrik Pabrik",
  "fire alarm system installation": "Instalasi Sistem Fire Alarm",

  // Products (Live Database)
  "rittal authorized distributor": "Distributor Resmi Rittal",
  "schneider electric system integrator": "System Integrator Schneider Electric",
  "schneider electric integrator": "System Integrator Schneider Electric",
  "electrical distribution": "Distribusi Elektrikal",
  "automation & control": "Otomasi & Kontrol",
  "enclosure & climate control": "Enclosure & Kontrol Iklim",
  "power quality": "Kualitas Daya Listrik",
  "power quality systems": "Sistem Kualitas Daya",
  "fire alarm products": "Produk Sistem Fire Alarm",
}

export const DICTIONARY_ID_TO_EN: Record<string, string> = Object.entries(DICTIONARY_EN_TO_ID).reduce(
  (acc, [en, id]) => {
    acc[id.toLowerCase()] = en
    return acc
  },
  {} as Record<string, string>
)

// Add reverse mappings for typical Indonesian terms
DICTIONARY_ID_TO_EN["beranda"] = "Home"
DICTIONARY_ID_TO_EN["tentang kami"] = "About Us"
DICTIONARY_ID_TO_EN["layanan"] = "Services"
DICTIONARY_ID_TO_EN["produk"] = "Products"
DICTIONARY_ID_TO_EN["berita"] = "News"
DICTIONARY_ID_TO_EN["karir"] = "Careers"
DICTIONARY_ID_TO_EN["hubungi kami"] = "Contact Us"
DICTIONARY_ID_TO_EN["industri"] = "Industries"
DICTIONARY_ID_TO_EN["navigasi"] = "Navigation"

function lookupDictionary(text: string, lang: ContentLanguage): string | null {
  const normalizedKey = text.toLowerCase().trim().replace(/\s+/g, " ")
  const strippedKey = normalizedKey.replace(/[.,:;!?]+$/, "").trim()

  if (lang === "id") {
    if (DICTIONARY_EN_TO_ID[normalizedKey]) return DICTIONARY_EN_TO_ID[normalizedKey]
    if (DICTIONARY_EN_TO_ID[strippedKey]) return DICTIONARY_EN_TO_ID[strippedKey]
  } else {
    if (DICTIONARY_ID_TO_EN[normalizedKey]) return DICTIONARY_ID_TO_EN[normalizedKey]
    if (DICTIONARY_ID_TO_EN[strippedKey]) return DICTIONARY_ID_TO_EN[strippedKey]
  }
  return null
}

/**
 * Filters plain text strings that may have bilingual patterns:
 * e.g. "EN: Title in English ID: Judul Bahasa Indonesia"
 * or "Title in English / Judul Bahasa Indonesia"
 * Also applies automatic dictionary translation for known database items when single-language.
 */
export function filterBilingualText(text: string | undefined | null, lang: ContentLanguage): string {
  if (!text || typeof text !== "string") return ""

  // Normalize literal escaped newlines and CRLF
  const normalized = text.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").trim()
  if (!normalized) return ""

  // 1. Explicit markers: EN: ... ID: ... or [EN] ... [ID] ...
  const enMatch = normalized.match(/(?:^|[\r\n\s|/;,])(?:EN\s*:|\[EN\]|English\s*:)\s*([\s\S]*?)(?=(?:[\r\n\s|/;,](?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)|$))/i)
  const idMatch = normalized.match(/(?:^|[\r\n\s|/;,])(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*([\s\S]*?)(?=(?:[\r\n\s|/;,](?:EN\s*:|\[EN\]|English\s*:)|$))/i)

  if (enMatch && idMatch) {
    return (lang === "id" ? idMatch[1] : enMatch[1]).trim()
  }
  if (enMatch && !idMatch) {
    const enText = enMatch[1].trim()
    if (lang === "id") {
      const translated = lookupDictionary(enText, "id")
      if (translated) return translated
    }
    return enText
  }
  if (idMatch && !enMatch) {
    const idText = idMatch[1].trim()
    if (lang === "en") {
      const translated = lookupDictionary(idText, "en")
      if (translated) return translated
    }
    return idText
  }

  // 2. Dual titles separated by " / " or " | "
  const slashParts = normalized.split(/\s+[\/|]\s+/)
  if (slashParts.length === 2 && slashParts[0].length > 3 && slashParts[1].length > 3) {
    const part0IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(slashParts[0])
    const part1IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(slashParts[1])
    if (part0IsId && !part1IsId) {
      return (lang === "id" ? slashParts[0] : slashParts[1]).trim()
    }
    // English first, Indonesian second by standard convention
    return (lang === "id" ? slashParts[1] : slashParts[0]).trim()
  }

  // 3. Dual lines separated by newline (\r?\n)
  const lines = normalized
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 2 && lines[0].length > 3 && lines[1].length > 3) {
    const line0IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(lines[0])
    const line1IsId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(lines[1])
    if (line0IsId && !line1IsId) {
      return (lang === "id" ? lines[0] : lines[1]).trim()
    }
    // English first, Indonesian second by standard convention
    return (lang === "id" ? lines[1] : lines[0]).trim()
  }

  // 4. Check dictionary lookup for single-language text without markers
  const dictionaryMatch = lookupDictionary(normalized, lang)
  if (dictionaryMatch) {
    return dictionaryMatch
  }

  return normalized
}

// Fast bounded LRU-like memoization cache for O(1) repeat text extractions
const BILINGUAL_CACHE_MAX_SIZE = 1500
const bilingualExtractCache = new Map<string, { id: string; en: string }>()

/**
 * Extracts distinct Indonesian and English strings from a single text field:
 * - Explicit markers: EN: ... \nID: ...
 * - Dual lines / slashes
 * - Language heuristic fallback if unmarked
 * Cached with O(1) amortized lookup to avoid repeated regex parsing.
 */
export function extractBilingualText(raw: string | undefined | null): { id: string; en: string } {
  if (!raw || typeof raw !== "string") return { id: "", en: "" }
  const trimmed = raw.trim()
  if (!trimmed) return { id: "", en: "" }

  const cached = bilingualExtractCache.get(trimmed)
  if (cached) return cached

  const normalized = trimmed.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").trim()
  const enMatch = normalized.match(/(?:^|[\r\n\s|/;,])(?:EN\s*:|\[EN\]|English\s*:)\s*([\s\S]*?)(?=(?:[\r\n\s|/;,](?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)|$))/i)
  const idMatch = normalized.match(/(?:^|[\r\n\s|/;,])(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*([\s\S]*?)(?=(?:[\r\n\s|/;,](?:EN\s*:|\[EN\]|English\s*:)|$))/i)

  let result: { id: string; en: string }

  if (enMatch || idMatch) {
    result = {
      id: idMatch ? idMatch[1].trim() : "",
      en: enMatch ? enMatch[1].trim() : "",
    }
  } else {
    const idText = filterBilingualText(trimmed, "id")
    const enText = filterBilingualText(trimmed, "en")

    if (idText !== enText) {
      result = { id: idText, en: enText }
    } else {
      const isId = /\b(dan|yang|untuk|dengan|pada|oleh|atau|ke|dari|tentang|dalam|adalah|sebagai|layanan|produk|berita|karir|perakitan|pengujian|keandalan|fasilitas|distribusi|pabrik|sistem)\b/i.test(trimmed)
      const isEn = /\b(and|the|for|with|in|on|at|by|to|from|about|of|as|services?|products?|news|careers?|assembly|testing|reliable|facilities|distribution|plant|systems?)\b/i.test(trimmed)

      if (isId && !isEn) {
        result = { id: trimmed, en: "" }
      } else if (isEn && !isId) {
        result = { id: "", en: trimmed }
      } else {
        result = { id: trimmed, en: trimmed }
      }
    }
  }

  if (bilingualExtractCache.size >= BILINGUAL_CACHE_MAX_SIZE) {
    bilingualExtractCache.clear()
  }
  bilingualExtractCache.set(trimmed, result)
  return result
}

/**
 * Returns either the Indonesian or English string from a bilingual text string.
 */
export function getBilingualText(raw: string | undefined | null, lang: "id" | "en" = "id"): string {
  if (!raw) return ""
  const extracted = extractBilingualText(raw)
  return extracted[lang] || extracted.id || extracted.en || raw
}

/**
 * Combines distinct English and Indonesian strings into a single text representation
 * that backward-compatibly preserves both languages in a single column:
 * "EN: <English>\nID: <Indonesian>"
 */
export function combineBilingualText(values: { en?: string | null; id?: string | null }): string {
  const en = (values.en ?? "").trim()
  const id = (values.id ?? "").trim()

  if (en && id) {
    if (en === id) return en
    return `EN: ${en}\nID: ${id}`
  }
  return id || en || ""
}

/**
 * Synchronizes hyperlinks present in English content into corresponding Indonesian anchor text
 * if the Indonesian content is missing the hyperlink.
 */
export function syncBilingualLinks(idText: string | undefined | null, enText: string | undefined | null): string {
  if (!idText || typeof idText !== "string") return ""
  if (!enText || typeof enText !== "string") return idText

  // Normalize markdown links in enText: [text](url) -> <a href="url">text</a>
  const normalizedEn = enText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  let result = idText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, anchor, href) => {
    const cleanHref = href.replace(/^https?:\/\/(?:www\.)?multidayamitra\.co\.id/i, "")
    return `<a href="${cleanHref}">${anchor}</a>`
  })

  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(normalizedEn)) !== null) {
    const href = match[1].replace(/^https?:\/\/(?:www\.)?multidayamitra\.co\.id/i, "")
    if (!href) continue

    // If idText already has a link to this href, skip
    if (result.includes(href)) continue

    // Matching Indonesian patterns based on service/product href
    if (href.includes("mv-lv-cable-installation-termination")) {
      const idPattern = /(instalasi\s+(?:dan|&)\s+terminasi\s+kabel\s+MV\s*(?:&|dan)\s*LV)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("substation-mv-switchgear-installation")) {
      const idPattern = /(gardu\s+induk(?:\s+(?:dan|&)\s+mv\s+switchgear)?)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("lv-distribution-panels-assembly")) {
      const idPattern = /(perakitan\s+panel\s+LV|panel\s+distribusi\s+LV)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("fire-alarm-system-installation")) {
      const idPattern = /(sistem\s+fire\s+alarm|instalasi\s+fire\s+alarm)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("transformer-oil-treatment-dga")) {
      const idPattern = /(treatment\s+oli\s+trafo|purifikasi\s+oli\s+trafo|uji\s+DGA)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("mv-cubicle-acb-maintenance")) {
      const idPattern = /(maintenance\s+cubicle\s+MV|pemeliharaan\s+cubicle\s+MV|maintenance\s+ACB)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("partial-discharge-ultrasound-testing")) {
      const idPattern = /(pengujian\s+partial\s+discharge|partial\s+discharge|ultrasound\s+testing)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("thermography-infrared-inspection")) {
      const idPattern = /(inspeksi\s+termografi|termografi\s+infrared|thermal\s+imaging)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
    if (href.includes("electrical-turnaround-shutdown-services")) {
      const idPattern = /(turnaround|shutdown\s+listrik\s+pabrik)/i
      if (idPattern.test(result)) {
        result = result.replace(idPattern, `<a href="${href}">$1</a>`)
        continue
      }
    }
  }

  return result
}

/**
 * Filters rich text HTML containing bilingual markers (EN: / ID:) or
 * consecutive paired headings (e.g. <h2>English</h2><h2>Indonesian</h2>).
 * Returns clean HTML corresponding to the requested language.
 */
export function filterBilingualHtml(html: string | undefined | null, lang: ContentLanguage): string {
  if (!html || typeof html !== "string") return ""

  // Normalize escaped newlines and markdown links: [text](url) -> <a href="url">text</a>
  let processedHtml = html
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, anchor, href) => {
      const cleanHref = href.replace(/^https?:\/\/(?:www\.)?multidayamitra\.co\.id/i, "")
      return `<a href="${cleanHref}">${anchor}</a>`
    })

  // 0. If plain text without HTML tags is passed, split paragraphs into <p> tags
  if (!/<(?:p|h[1-6]|div|ul|ol|blockquote|li|br)[^>]*>/i.test(processedHtml)) {
    processedHtml = processedHtml
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("\n")
  }

  // 1. Process inline <p> that contains both EN and ID or dual language lines
  processedHtml = processedHtml.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match: string, attrs: string, content: string) => {
    const parts = content.split(/<br\s*\/?>|\r?\n/i).map((p: string) => p.trim()).filter(Boolean)
    if (parts.length <= 1) return match

    const enMarkerRegex = /^(?:EN\s*:|\[EN\]|English\s*:)/i
    const idMarkerRegex = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i

    // Tag each line with its detected language
    type TaggedLine = { raw: string; part: string; cleaned: string; lineLang: ContentLanguage | null }
    const tagged: TaggedLine[] = parts.map((part: string) => {
      const raw = part.replace(/<[^>]+>/g, "").trim()
      let lineLang: ContentLanguage | null = null
      let cleaned = part

      if (enMarkerRegex.test(raw)) {
        lineLang = "en"
        cleaned = part.replace(
          /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:EN\s*:|\[EN\]|English\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
          ""
        )
      } else if (idMarkerRegex.test(raw)) {
        lineLang = "id"
        cleaned = part.replace(
          /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
          ""
        )
      }

      return { raw, part, cleaned, lineLang }
    })

    // Detect pairs among unmarked lines (e.g. English title followed by Indonesian title)
    for (let i = 0; i < tagged.length - 1; i++) {
      if (tagged[i].lineLang === null && tagged[i + 1].lineLang === null) {
        tagged[i].lineLang = "en"
        tagged[i + 1].lineLang = "id"
        i++
      }
    }

    // Sync links between EN and ID lines if present
    for (let i = 0; i < tagged.length - 1; i++) {
      if (tagged[i].lineLang === "en" && tagged[i + 1].lineLang === "id") {
        tagged[i + 1].cleaned = syncBilingualLinks(tagged[i + 1].cleaned, tagged[i].cleaned)
      } else if (tagged[i].lineLang === "id" && tagged[i + 1].lineLang === "en") {
        tagged[i].cleaned = syncBilingualLinks(tagged[i].cleaned, tagged[i + 1].cleaned)
      }
    }

    const hasAnyLang = tagged.some((t: TaggedLine) => t.lineLang !== null)
    if (!hasAnyLang) return match

    const kept = tagged
      .filter((t: TaggedLine) => t.lineLang === null || t.lineLang === lang)
      .map((t: TaggedLine) => t.cleaned)

    if (kept.length === 0) return ""

    // If kept has a title line (< 120 chars) and body line, separate cleanly into <h2> and <p>
    if (kept.length === 2 && kept[0].length < 120 && !kept[0].endsWith(".")) {
      return `<h2>${kept[0]}</h2><p${attrs}>${kept[1]}</p>`
    }

    return `<p${attrs}>${kept.join("<br>")}</p>`
  })

  // 2. Process list items with language markers (<li>EN: ...</li><li>ID: ...</li>)
  processedHtml = processedHtml.replace(/<li([^>]*)>([\s\S]*?)<\/li>/gi, (match, attrs, content) => {
    const raw = content.replace(/<[^>]+>/g, "").trim()
    const isEn = /^(?:EN\s*:|\[EN\]|English\s*:)/i.test(raw)
    const isId = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i.test(raw)

    if (isEn || isId) {
      if ((lang === "en" && isEn) || (lang === "id" && isId)) {
        const cleaned = content.replace(
          /^\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:(?:EN|ID)\s*:|\[(?:EN|ID)\]|(?:English|Indonesian|Bahasa)\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
          ""
        )
        return `<li${attrs}>${cleaned}</li>`
      }
      return "" // Drop opposite language
    }
    return match
  })

  // Clean empty <ul> and <ol> if any
  processedHtml = processedHtml.replace(/<(ul|ol)[^>]*>\s*<\/\1>/gi, "")

  // 3. Extract top-level elements: h1-h6, p, blockquote, ul, ol, div, etc.
  const blockRegex = /(<(h[1-6]|p|blockquote|ul|ol|div|table|figure)[^>]*>[\s\S]*?<\/\2>)/gi
  type ParsedBlock = { tag: string; html: string; rawText: string; blockLang: ContentLanguage | null; cleanedHtml: string }
  const blocks: ParsedBlock[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = blockRegex.exec(processedHtml)) !== null) {
    if (match.index > lastIndex) {
      const interstitial = processedHtml.slice(lastIndex, match.index).trim()
      if (interstitial) {
        blocks.push({ tag: "raw", html: interstitial, rawText: interstitial, blockLang: null, cleanedHtml: interstitial })
      }
    }
    const fullTag = match[1]
    const tag = match[2].toLowerCase()
    const rawText = fullTag.replace(/<[^>]+>/g, "").trim()
    blocks.push({ tag, html: fullTag, rawText, blockLang: null, cleanedHtml: fullTag })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < processedHtml.length) {
    const trailing = processedHtml.slice(lastIndex).trim()
    if (trailing) {
      blocks.push({ tag: "raw", html: trailing, rawText: trailing, blockLang: null, cleanedHtml: trailing })
    }
  }

  const enMarkerRegex = /^(?:EN\s*:|\[EN\]|English\s*:)/i
  const idMarkerRegex = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i

  for (const b of blocks) {
    if (enMarkerRegex.test(b.rawText)) {
      b.blockLang = "en"
      b.cleanedHtml = b.cleanedHtml.replace(
        /(<(?:p|h[1-6]|blockquote)[^>]*>)\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:EN\s*:|\[EN\]|English\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
        "$1"
      )
    } else if (idMarkerRegex.test(b.rawText)) {
      b.blockLang = "id"
      b.cleanedHtml = b.cleanedHtml.replace(
        /(<(?:p|h[1-6]|blockquote)[^>]*>)\s*(?:<(?:strong|b|span)[^>]*>)?\s*(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)\s*(?:<\/(?:strong|b|span)>)?\s*/i,
        "$1"
      )
    }
  }

  // 4. Detect paired consecutive headings (e.g. <h2>English</h2><h2>Indonesian</h2>)
  // or paired short title paragraphs (e.g. <p>English Title</p><p>Judul Indonesia</p>)
  for (let i = 0; i < blocks.length - 1; i++) {
    const cur = blocks[i]
    const next = blocks[i + 1]

    const isHeading = cur.tag.startsWith("h") && cur.tag === next.tag
    const isShortParagraphPair =
      cur.tag === "p" &&
      next.tag === "p" &&
      cur.rawText.length > 3 &&
      cur.rawText.length < 120 &&
      next.rawText.length > 3 &&
      next.rawText.length < 120 &&
      !cur.rawText.endsWith(".") &&
      !next.rawText.endsWith(".")

    if ((isHeading || isShortParagraphPair) && !cur.blockLang && !next.blockLang) {
      cur.blockLang = "en"
      next.blockLang = "id"
      i++ // Skip next
    }
  }

  const hasAnyLangBlocks = blocks.some((b) => b.blockLang !== null)
  if (!hasAnyLangBlocks) {
    return processedHtml
  }

  return blocks
    .filter((b) => b.blockLang === null || b.blockLang === lang)
    .map((b) => b.cleanedHtml)
    .join("\n")
}

/**
 * Filters an array of CMS blocks (e.g. EditorJS / TipTap JSON blocks)
 */
export function filterBilingualBlocks(
  blocks: ContentBlock[] | undefined | null,
  lang: ContentLanguage
): ContentBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) return []

  const enMarkerRegex = /^(?:EN\s*:|\[EN\]|English\s*:)/i
  const idMarkerRegex = /^(?:ID\s*:|\[ID\]|Indonesian\s*:|Bahasa\s*:)/i

  const tagged = blocks.map((block) => {
    const text = block.text ?? block.data?.text ?? ""
    let blockLang: ContentLanguage | null = null
    let cleanedText = text

    // A. Check if the block has multiline text that contains dual language lines
    if (text.includes("\n")) {
      const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      if (rawLines.length > 1) {
        type TaggedLine = { raw: string; cleaned: string; lineLang: ContentLanguage | null }
        const taggedLines: TaggedLine[] = rawLines.map((l) => {
          let lineLang: ContentLanguage | null = null
          let cleaned = l
          if (enMarkerRegex.test(l)) {
            lineLang = "en"
            cleaned = l.replace(enMarkerRegex, "").trim()
          } else if (idMarkerRegex.test(l)) {
            lineLang = "id"
            cleaned = l.replace(idMarkerRegex, "").trim()
          }
          return { raw: l, cleaned, lineLang }
        })

        for (let i = 0; i < taggedLines.length - 1; i++) {
          if (taggedLines[i].lineLang === null && taggedLines[i + 1].lineLang === null) {
            taggedLines[i].lineLang = "en"
            taggedLines[i + 1].lineLang = "id"
            i++
          }
        }

        // Sync links between EN and ID lines if present
        for (let i = 0; i < taggedLines.length - 1; i++) {
          if (taggedLines[i].lineLang === "en" && taggedLines[i + 1].lineLang === "id") {
            taggedLines[i + 1].cleaned = syncBilingualLinks(taggedLines[i + 1].cleaned, taggedLines[i].cleaned)
          } else if (taggedLines[i].lineLang === "id" && taggedLines[i + 1].lineLang === "en") {
            taggedLines[i].cleaned = syncBilingualLinks(taggedLines[i].cleaned, taggedLines[i + 1].cleaned)
          }
        }

        const hasLangLines = taggedLines.some((t) => t.lineLang !== null)
        if (hasLangLines) {
          const kept = taggedLines
            .filter((t) => t.lineLang === null || t.lineLang === lang)
            .map((t) => t.cleaned)
          cleanedText = kept.join("\n")
        }
      }
    } else {
      if (enMarkerRegex.test(text)) {
        blockLang = "en"
        cleanedText = text.replace(enMarkerRegex, "").trim()
      } else if (idMarkerRegex.test(text)) {
        blockLang = "id"
        cleanedText = text.replace(idMarkerRegex, "").trim()
      }
    }

    let cleanedItems = block.items ?? block.data?.items
    if (Array.isArray(cleanedItems)) {
      cleanedItems = cleanedItems
        .filter((item) => {
          const isEn = enMarkerRegex.test(item)
          const isId = idMarkerRegex.test(item)
          if (!isEn && !isId) return true
          return (lang === "en" && isEn) || (lang === "id" && isId)
        })
        .map((item) => item.replace(enMarkerRegex, "").replace(idMarkerRegex, "").trim())
    }

    const cleanedHtml = block.html ? filterBilingualHtml(block.html, lang) : undefined

    return {
      original: block,
      blockLang,
      cleanedBlock: {
        ...block,
        text: cleanedText,
        html: cleanedHtml,
        items: cleanedItems,
        ...(block.data ? { data: { ...block.data, text: cleanedText, items: cleanedItems } } : {}),
      },
    }
  })

  // Detect consecutive paired headings or paired short paragraph titles
  for (let i = 0; i < tagged.length - 1; i++) {
    const cur = tagged[i]
    const next = tagged[i + 1]
    const curType = cur.original.type ?? "paragraph"
    const nextType = next.original.type ?? "paragraph"

    const isHeading = (curType === "heading" || curType === "header") && curType === nextType
    const curText = cur.cleanedBlock.text ?? ""
    const nextText = next.cleanedBlock.text ?? ""
    const isShortParagraphPair =
      (curType === "paragraph" || !curType) &&
      (nextType === "paragraph" || !nextType) &&
      curText.length > 3 &&
      curText.length < 120 &&
      nextText.length > 3 &&
      nextText.length < 120 &&
      !curText.endsWith(".") &&
      !nextText.endsWith(".")

    if ((isHeading || isShortParagraphPair) && !cur.blockLang && !next.blockLang) {
      cur.blockLang = "en"
      next.blockLang = "id"
      i++
      continue
    }

    // Sync links between adjacent EN and ID blocks
    if (cur.blockLang === "en" && next.blockLang === "id") {
      const curContent = cur.cleanedBlock.html || cur.cleanedBlock.text || ""
      const nextContent = next.cleanedBlock.html || next.cleanedBlock.text || ""
      const synced = syncBilingualLinks(nextContent, curContent)
      if (synced !== nextContent) {
        if (next.cleanedBlock.html) {
          next.cleanedBlock.html = synced
        } else {
          next.cleanedBlock.text = synced
          if (next.cleanedBlock.data) next.cleanedBlock.data.text = synced
        }
      }
    }
  }

  const hasAnyLang = tagged.some((b) => b.blockLang !== null)
  if (!hasAnyLang) {
    return tagged.map((t) => t.cleanedBlock)
  }

  return tagged.filter((b) => b.blockLang === null || b.blockLang === lang).map((b) => b.cleanedBlock)
}

/**
 * Extracts distinct Indonesian and English HTML from any raw content format:
 * - Dedicated envelope: { id, en }
 * - Legacy HTML with EN: and ID: tags
 * - Legacy plain text / blocks
 */
export function extractBilingualHtml(raw: unknown): { id: string; en: string } {
  if (!raw) return { id: "", en: "" }

  // 1. If raw is already an envelope with id and en
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>
    if ("id" in obj || "en" in obj) {
      const idPart = obj.id
      const enPart = obj.en
      const idHtml = typeof idPart === "string" ? idPart : htmlFromBlocksHelper(idPart)
      const enHtml = typeof enPart === "string" ? enPart : htmlFromBlocksHelper(enPart)
      return { id: syncBilingualLinks(idHtml, enHtml), en: enHtml }
    }
  }

  // 2. If raw is legacy string or blocks
  let html = typeof raw === "string" ? raw : htmlFromBlocksHelper(raw)
  if (!html) return { id: "", en: "" }

  // Convert markdown links if any exist: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  const idHtml = filterBilingualHtml(html, "id")
  const enHtml = filterBilingualHtml(html, "en")

  if (idHtml === enHtml) {
    // If not bilingual, prefill Indonesian editor with original
    return { id: html, en: "" }
  }

  return { id: syncBilingualLinks(idHtml, enHtml), en: enHtml }
}

function htmlFromBlocksHelper(value: unknown): string {
  if (!value || typeof value !== "object") return ""
  if ("blocks" in value && Array.isArray((value as { blocks?: unknown }).blocks)) {
    const blocks = (value as { blocks: ContentBlock[] }).blocks
    return blocks
      .map((block) => {
        if (block.type === "html") return block.html ?? ""
        if (block.type === "heading" || block.type === "header") return `<h2>${block.text ?? block.data?.text ?? ""}</h2>`
        if (block.type === "quote") return `<blockquote><p>${block.text ?? block.data?.text ?? ""}</p></blockquote>`
        if (block.type === "list") {
          const items = (block.items ?? block.data?.items ?? []).map((i) => `<li>${i}</li>`).join("")
          return items ? `<ul>${items}</ul>` : ""
        }
        const text = block.text ?? block.data?.text ?? ""
        return text ? `<p>${text}</p>` : ""
      })
      .filter(Boolean)
      .join("")
  }
  return ""
}

export type BilingualMetadataOptions = {
  title?: string | null
  description?: string | null
  canonicalPath?: string
  image?: string | null
  type?: "website" | "article"
  noIndex?: boolean
  keywords?: string[]
}

/**
 * Builds clean bilingual SEO metadata (title, description, hreflang alternates, OpenGraph, Twitter)
 * for search engines (Google, Bing) and social media crawlers.
 * Combines Indonesian and English without exposing raw "EN: ... ID: ..." tags.
 */
export function buildBilingualMetadata(options: BilingualMetadataOptions): Metadata {
  const { title, description, canonicalPath = "", image, type = "website", noIndex, keywords = [] } = options
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://multidayamitra.co.id").replace(/\/$/, "")
  const cleanPath = canonicalPath.startsWith("/") ? canonicalPath : canonicalPath ? `/${canonicalPath}` : ""
  const fullUrl = canonicalPath.startsWith("http") ? canonicalPath : `${siteUrl}${cleanPath}`

  // Clean Title
  const { id: idTitle, en: enTitle } = extractBilingualText(title)
  let cleanTitle = ""
  if (idTitle && enTitle && idTitle.toLowerCase() !== enTitle.toLowerCase()) {
    cleanTitle = `${idTitle} | ${enTitle} — PT Multi Daya Mitra`
  } else {
    cleanTitle = `${idTitle || enTitle || "PT Multi Daya Mitra"} — PT Multi Daya Mitra`
  }

  // Clean Description
  const { id: idDesc, en: enDesc } = extractBilingualText(description)
  let cleanDesc = ""
  if (idDesc && enDesc && idDesc.toLowerCase() !== enDesc.toLowerCase()) {
    cleanDesc = `${idDesc} | ${enDesc}`
  } else {
    cleanDesc = idDesc || enDesc || "PT Multi Daya Mitra — Solusi rekayasa elektrik, otomasi industri (PLC/SCADA), dan fire alarm terpercaya di Indonesia."
  }

  // Combine keywords for high search visibility
  const defaultKeywords = [
    "PT Multi Daya Mitra",
    "kontraktor listrik",
    "electrical contractor indonesia",
    "otomasi industri plc scada",
    "industrial automation",
    "panel maker surabaya",
    "distributor rittal indonesia",
  ]
  const combinedKeywords = Array.from(
    new Set([
      ...keywords,
      idTitle,
      enTitle,
      ...defaultKeywords,
    ].filter((k): k is string => Boolean(k && typeof k === "string" && k.length > 2)))
  )

  const metaImage = image || "/uploads/hero-project.jpg"

  return {
    title: cleanTitle,
    description: cleanDesc,
    keywords: combinedKeywords,
    alternates: {
      canonical: fullUrl,
      languages: {
        "id-ID": `${fullUrl}?lang=id`,
        "en-US": `${fullUrl}?lang=en`,
        "x-default": fullUrl,
      },
    },
    openGraph: {
      title: cleanTitle,
      description: cleanDesc,
      url: fullUrl,
      siteName: "PT Multi Daya Mitra",
      locale: "id_ID",
      alternateLocale: ["en_US"],
      type,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: idTitle || enTitle || "PT Multi Daya Mitra",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDesc,
      images: [metaImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
