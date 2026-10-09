/**
 * Mirrors the content of the live site (multidayamitra.co.id) into a
 * database, with every text stored in both languages.
 *
 * The live site renders its production rows — ids, dates, images, links,
 * SEO — with copy from the built-in catalogs in lib/*-bilingual.ts. This
 * script writes that same combination into the database as EN/ID pairs, so
 * the site no longer needs the catalogs to show it:
 *
 *   - products and services: the catalog trees (titles, summaries, content,
 *     specs) on the production ids, production images first;
 *   - news and careers: the production rows with their catalog translations;
 *   - pages, SEO metadata, site settings and the menu: production values with
 *     their translations (canonical overrides that point anywhere but the
 *     page itself are cleared);
 *   - media library files referenced by that content are downloaded.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/sync-production-content.ts \
 *     --media-dir ../Backend/data/media > /tmp/sync.sql
 *   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /tmp/sync.sql
 *
 * The frontend caches API responses for 24 hours under the "cms" tag, and a
 * direct import does not purge it: afterwards save a page, a content item,
 * the menu or the site settings in the admin (those saves revalidate "cms").
 * Locally, delete .next/dev/cache/fetch-cache
 * (next dev) or .next/cache/fetch-cache (next build) and restart instead.
 *
 * Rows the live site no longer shows (old seed careers, retired products) are
 * soft-deleted. The SQL runs in one transaction; texts that have no
 * translation yet are reported on stderr and stored as they are.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, posix } from "node:path"
import { enrichCareerWithBilingual } from "@/lib/career-bilingual"
import {
  defaultMenuItems,
  fallbackProducts,
  fallbackServices,
  flattenContent,
  isRetiredProductPath,
  type ContentNode,
} from "@/lib/cms"
import { parseMarkedText, serializeLocalizedText } from "@/lib/i18n"
import { enrichNewsWithBilingual } from "@/lib/news-bilingual"
import { BILINGUAL_PAGE_CATALOG, pairSeededPageContent } from "@/lib/page-bilingual"

const SITE = (process.env.SYNC_SOURCE ?? "https://multidayamitra.co.id").replace(/\/$/, "")
const API = `${SITE}/api/v1/public`
const MEDIA_PREFIX = "/api/v1/public/media/"
const mediaDirArg = process.argv.indexOf("--media-dir")
const MEDIA_DIR = mediaDirArg > 0 ? process.argv[mediaDirArg + 1] : null

// Rows are the public API's JSON, read field by field below.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

// --- translations the catalogs do not carry ---

// SEO titles and descriptions as production stores them, with the missing
// language. Matched on either side, so copy written in Indonesian works too;
// `seeds` are production texts that are stored corrected (the company was
// founded in 2012, two seeds said 2013).
type Translation = { en: string; id: string; seeds?: string[] }

const SEO_TRANSLATIONS: Translation[] = [
  // System pages
  {
    en: "PT Multi Daya Mitra | Electrical · Automation · Fire System",
    id: "PT Multi Daya Mitra | Kelistrikan · Otomasi · Sistem Fire Alarm",
  },
  {
    en: "Indonesian electrical, industrial automation, and fire alarm services company delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.",
    id: "Perusahaan jasa kelistrikan, otomasi industri, dan fire alarm di Indonesia yang menghadirkan rekayasa andal untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur sejak 2012.",
    seeds: [
      "Indonesian electrical, industrial automation, and fire alarm services company delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013.",
    ],
  },
  {
    en: "About PT Multi Daya Mitra | Electrical, Automation & Fire Alarm Services",
    id: "Tentang PT Multi Daya Mitra | Layanan Kelistrikan, Otomasi & Fire Alarm",
  },
  {
    en: "PT Multi Daya Mitra is an Indonesian engineering company established in 2012, specializing in electrical systems, industrial automation, and fire alarm solutions for power, oil & gas, manufacturing, and infrastructure sectors.",
    id: "PT Multi Daya Mitra adalah perusahaan rekayasa teknik Indonesia yang berdiri sejak 2012, berspesialisasi dalam sistem kelistrikan, otomasi industri, dan solusi fire alarm untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur.",
    seeds: [
      "PT Multi Daya Mitra is an Indonesian engineering company established in 2013, specializing in electrical systems, industrial automation, and fire alarm solutions for power, oil & gas, manufacturing, and infrastructure sectors.",
    ],
  },
  {
    en: "Careers at PT Multi Daya Mitra | Join Our Engineering Team",
    id: "Karir di PT Multi Daya Mitra | Bergabung dengan Tim Engineering Kami",
  },
  {
    en: "Explore career opportunities at PT Multi Daya Mitra. We are hiring electrical engineers, automation engineers, technicians, and project managers across East Java.",
    id: "Temukan peluang karir di PT Multi Daya Mitra. Kami membuka lowongan untuk electrical engineer, automation engineer, teknisi, dan manajer proyek di seluruh Jawa Timur.",
  },
  {
    en: "Contact PT Multi Daya Mitra | Offices in Surabaya & Sidoarjo",
    id: "Hubungi PT Multi Daya Mitra | Kantor di Surabaya & Sidoarjo",
  },
  {
    en: "Contact PT Multi Daya Mitra for electrical engineering, automation, and fire alarm services. Head office in Surabaya, project office and workshop in Sidoarjo, East Java.",
    id: "Hubungi PT Multi Daya Mitra untuk layanan rekayasa kelistrikan, otomasi, dan fire alarm. Kantor pusat di Surabaya, kantor proyek dan workshop di Sidoarjo, Jawa Timur.",
  },
  { en: "News & Insights | PT Multi Daya Mitra", id: "Berita & Wawasan | PT Multi Daya Mitra" },
  {
    en: "Industry insights, project updates, and technical articles from PT Multi Daya Mitra on electrical engineering, automation, and fire protection.",
    id: "Wawasan industri, kabar proyek, dan artikel teknis dari PT Multi Daya Mitra seputar rekayasa kelistrikan, otomasi, dan proteksi kebakaran.",
  },
  { en: "Our Products | PT Multi Daya Mitra", id: "Produk Kami | PT Multi Daya Mitra" },
  {
    en: "Testing equipment, protection relays, instrumentation, SCADA systems, electrical panels, fire alarm systems, and Rittal enclosures from PT Multi Daya Mitra.",
    id: "Peralatan pengujian, relai proteksi, instrumentasi, sistem SCADA, panel listrik, sistem fire alarm, dan enclosure Rittal dari PT Multi Daya Mitra.",
  },
  { en: "Our Services | PT Multi Daya Mitra", id: "Layanan Kami | PT Multi Daya Mitra" },
  {
    en: "Electrical engineering, industrial automation, fire alarm, testing & measurement, and maintenance services for industrial and infrastructure projects across Indonesia.",
    id: "Layanan rekayasa kelistrikan, otomasi industri, fire alarm, pengujian & pengukuran, serta pemeliharaan untuk proyek industri dan infrastruktur di seluruh Indonesia.",
  },
  // News
  {
    en: "Substation Testing & Commissioning | PT Multi Daya Mitra",
    id: "Pengujian & Commissioning Gardu Induk | PT Multi Daya Mitra",
  },
  {
    en: "Preventive maintenance of MV switchgear ensures reliability, safety, and asset longevity through systematic testing, inspection, and protection coordination.",
    id: "Pemeliharaan preventif switchgear tegangan menengah menjamin keandalan, keselamatan, dan umur panjang aset melalui pengujian, inspeksi, dan koordinasi proteksi yang sistematis.",
  },
  {
    en: "Centralized Fire Alarm Monitoring Systems | PT Multi Daya Mitra",
    id: "Sistem Pemantauan Fire Alarm Terpusat | PT Multi Daya Mitra",
  },
  {
    en: "How centralized fire alarm monitoring integrates multiple detection zones for faster response, regulatory compliance, and operational efficiency.",
    id: "Bagaimana pemantauan fire alarm terpusat mengintegrasikan banyak zona deteksi untuk respons lebih cepat, kepatuhan regulasi, dan efisiensi operasional.",
  },
  {
    en: "Effects of Harmonic Distortion on Electrical Systems | PT Multi Daya Mitra",
    id: "Dampak Distorsi Harmonisa pada Sistem Kelistrikan | PT Multi Daya Mitra",
  },
  {
    en: "Understanding how harmonic distortion from non-linear loads affects transformers, cables, and power quality — and practical mitigation solutions.",
    id: "Memahami bagaimana distorsi harmonisa dari beban non-linear memengaruhi transformator, kabel, dan kualitas daya — beserta solusi mitigasi yang praktis.",
  },
  {
    en: "Energy Monitoring System for ESG Reporting | PT Multi Daya Mitra",
    id: "Sistem Pemantauan Energi untuk Pelaporan ESG | PT Multi Daya Mitra",
  },
  {
    en: "Smart energy monitoring systems that help manufacturing facilities track real-time consumption, reduce costs, and produce ESG-grade sustainability reports.",
    id: "Sistem pemantauan energi cerdas yang membantu fasilitas manufaktur memantau konsumsi secara real-time, menekan biaya, dan menyusun laporan keberlanjutan berstandar ESG.",
  },
  {
    en: "Partial Discharge Analysis for MV/HV Equipment | PT Multi Daya Mitra",
    id: "Analisis Partial Discharge untuk Peralatan TM/TT | PT Multi Daya Mitra",
  },
  {
    en: "Online partial discharge analysis enables early insulation fault detection in medium and high voltage switchgear, transformers, and cable systems.",
    id: "Analisis partial discharge secara online memungkinkan deteksi dini kerusakan isolasi pada switchgear, transformator, dan sistem kabel tegangan menengah dan tinggi.",
  },
  {
    en: "Transformer Testing & Maintenance Guide | PT Multi Daya Mitra",
    id: "Panduan Pengujian & Pemeliharaan Transformator | PT Multi Daya Mitra",
  },
  {
    en: "Comprehensive guide to power transformer health assessments including insulation testing, dissolved gas analysis, and frequency response diagnostics.",
    id: "Panduan lengkap asesmen kondisi transformator daya, meliputi pengujian isolasi, analisis gas terlarut (DGA), dan diagnostik respons frekuensi.",
  },
  {
    en: "MV & LV Cable Installation & Termination | PT Multi Daya Mitra",
    id: "Instalasi & Terminasi Kabel TM & TR | PT Multi Daya Mitra",
  },
  {
    en: "Reliable MV & LV cable installation, termination, jointing, testing, and commissioning services for industrial electrical systems by PT Multi Daya Mitra.",
    id: "Layanan instalasi, terminasi, penyambungan, pengujian, dan commissioning kabel TM & TR yang andal untuk sistem kelistrikan industri oleh PT Multi Daya Mitra.",
  },
  {
    en: "Rittal Authorized Distributor Indonesia | Multidaya Mitra",
    id: "Distributor Resmi Rittal Indonesia | Multidaya Mitra",
  },
  {
    en: "PT Multi Daya Mitra, Official Rittal Authorized Distributor in Indonesia for industrial enclosures, climate control & cooling, and power distribution.",
    id: "PT Multi Daya Mitra, Distributor Resmi Rittal di Indonesia untuk enclosure industri, climate control & pendingin, serta distribusi daya.",
  },
  {
    en: "Industrial Enclosure & Climate Control Solutions | MDM",
    id: "Solusi Enclosure Industri & Climate Control | MDM",
  },
  {
    en: "Protect your electrical panels and automation systems from dust, heat, and humidity with industrial enclosure and climate control solutions from PT. Multi Daya Mitra.",
    id: "Lindungi panel listrik dan sistem otomasi Anda dari debu, panas, dan kelembapan dengan solusi enclosure industri dan climate control dari PT. Multi Daya Mitra.",
  },
  {
    en: "Industrial Automation & Control Solutions | PT Multi Daya Mitra",
    id: "Solusi Otomasi & Kontrol Industri | PT Multi Daya Mitra",
  },
  {
    en: "Industrial automation & control solutions from PT Multi Daya Mitra, covering PLC, SCADA/HMI, process visualization, and motor drives to support industrial efficiency and reliability.",
    id: "Solusi Industrial Automation & Control dari PT Multi Daya Mitra meliputi PLC, SCADA/HMI, process visualization, dan motor drives untuk mendukung efisiensi dan keandalan industri.",
  },
  {
    en: "Building Reliable Power Distribution with Substation & MV Switchgear",
    id: "Membangun Distribusi Daya Andal dengan Gardu Induk & Switchgear TM",
  },
  {
    en: "Learn how substation and MV switchgear systems up to 36 kV support safe, reliable, and efficient power distribution for industrial facilities.",
    id: "Pelajari bagaimana sistem gardu induk dan switchgear tegangan menengah hingga 36 kV mendukung distribusi daya yang aman, andal, dan efisien untuk fasilitas industri.",
  },
  {
    en: "Mechanical Services & General Supplies for Industry | MDM",
    id: "Mechanical Services & General Supplies untuk Industri | MDM",
  },
  {
    en: "Mechanical services and general supplies for industry, from mechanical maintenance, conveyor systems, and magnetic separators to motor and generator servicing.",
    id: "Solusi Mechanical Services & General Supplies untuk industri, mulai dari mechanical maintenance, conveyor systems, magnetic separators, hingga motor dan generator servicing.",
  },
  {
    en: "SCADA Systems, HMI & Centralized Telemetry | MDM",
    id: "Sistem SCADA, HMI & Telemetri Terpusat | MDM",
  },
  {
    en: "An introduction to SCADA, HMI, and centralized telemetry as integrated, real-time industrial monitoring solutions that support operational efficiency.",
    id: "Mengenal SCADA, HMI, dan Centralized Telemetry sebagai solusi monitoring industri yang terintegrasi, real-time, dan mendukung efisiensi operasional.",
  },
]

// Site settings copy.
const SETTINGS_TRANSLATIONS: Translation[] = [
  { en: "Electrical · Automation · Fire System", id: "Elektrikal · Otomasi · Sistem Fire Alarm" },
  {
    en: "Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.",
    id: "Perusahaan layanan rekayasa elektrikal, otomasi industri, dan sistem fire alarm terkemuka di Indonesia — menghadirkan solusi andal untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur sejak 2012.",
  },
  {
    en: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
    id: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, Jawa Timur, Indonesia",
  },
]

// News categories by their English name, so existing rows keep their slugs.
const CATEGORY_SLUGS: Record<string, string> = {
  "Company News": "company",
  Insight: "insight",
  "Engineering Insights": "engineering-insights",
  "Industrial Projects": "project",
  "Product & Technology": "product-technology",
  Service: "service",
}

// --- helpers ---

const untranslated = new Set<string>()
const normalize = (text: string) => text.replace(/\s+/g, " ").trim()

function translate(value: unknown, table: Translation[]): unknown {
  if (typeof value !== "string" || !value.trim()) return value
  const parsed = parseMarkedText(value)
  if (parsed?.en !== undefined && parsed.id !== undefined) return value
  const text = normalize(value)
  const match = table.find((entry) =>
    [entry.en, entry.id, ...(entry.seeds ?? [])].some((candidate) => normalize(candidate) === text),
  )
  if (!match) {
    untranslated.add(text)
    return value
  }
  return serializeLocalizedText({ en: match.en, id: match.id })
}

function englishOf(marked: string): string {
  return parseMarkedText(marked)?.en ?? marked
}

function slugify(text: string) {
  return text.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}/${path}`, { headers: { "User-Agent": "mdm-content-sync" } })
  if (!response.ok) throw new Error(`GET ${path}: HTTP ${response.status}`)
  const body = await response.json()
  const wrapped =
    body && typeof body === "object" && "data" in body && Object.keys(body).every((key) => ["data", "pagination", "meta"].includes(key))
  return (wrapped ? body.data : body) as T
}

const out: string[] = []
const q = (value: unknown) => (value == null || value === "" ? "NULL" : `'${String(value).replace(/'/g, "''")}'`)
const text = (value: unknown) => `'${String(value ?? "").replace(/'/g, "''")}'`
const json = (value: unknown) => `${text(JSON.stringify(value ?? null))}::jsonb`
const time = (value: unknown) => (value ? `${text(value)}::timestamptz` : "now()")
const ids = (list: string[]) => `ARRAY[${list.map(text).join(", ")}]::uuid[]`

// --- products and services ---

async function syncTree(kind: "products" | "services", catalog: ContentNode[]) {
  const table = kind
  const live = new Map<string, Row>()
  for (const node of flattenContent(await get<ContentNode[]>(kind))) {
    live.set(node.fullPath, await get<Row>(`${kind}/${node.fullPath}`))
  }
  const retired = [...live.keys()].filter((path) => kind === "products" && isRetiredProductPath(path))
  const idByPath = new Map<string, string>()
  const kept: string[] = []

  out.push(`-- ${kind}: ${flattenContent(catalog).length} from the catalog`)
  const write = (node: Row, parentPath: string | null, depth: number, sortOrder: number, fromCatalog: boolean) => {
    const row = live.get(node.fullPath)
    const id = row?.id ?? node.id
    idByPath.set(node.fullPath, id)
    kept.push(id)
    const parentId = parentPath ? idByPath.get(parentPath) : null
    const columns: Record<string, string> = {
      id: text(id),
      parent_id: parentId ? text(parentId) : "NULL",
      slug: text(node.slug),
      full_path: text(node.fullPath),
      title: text(node.title),
      summary: q(node.summary),
      content: json(node.content ?? {}),
      image_url: q(row?.imageUrl || node.imageUrl),
      gallery: json(row?.gallery ?? node.gallery ?? []),
      status: "'published'",
      published_at: time(row?.publishedAt ?? node.publishedAt),
      sort_order: String(sortOrder),
      depth: String(depth),
    }
    if (kind === "products") {
      columns.specs = json((fromCatalog ? node.specs : null) ?? row?.specs ?? {})
      columns.datasheet_url = q(row?.datasheetUrl ?? node.datasheetUrl)
    }
    const names = Object.keys(columns)
    const updates = names.filter((name) => name !== "id").map((name) => `${name} = EXCLUDED.${name}`)
    // An id may only be taken over from the same path, a deleted row, or a
    // retired path (migration 043 gave new products the ids of the two they
    // replace); anything else is left alone and reported by the checks below.
    const guard = [`t.full_path = EXCLUDED.full_path`, `t.deleted_at IS NOT NULL`]
    if (retired.length) guard.push(`t.full_path = ANY(ARRAY[${retired.map(text).join(", ")}])`)
    out.push(
      `INSERT INTO ${table} AS t (${names.join(", ")})\nVALUES (${names.map((name) => columns[name]).join(", ")})\n` +
        `ON CONFLICT (id) DO UPDATE SET ${updates.join(", ")}, deleted_at = NULL, updated_at = now(), version = t.version + 1\n` +
        `WHERE ${guard.join(" OR ")};`,
    )
  }

  const visit = (nodes: ContentNode[], parentPath: string | null, depth: number) => {
    nodes.forEach((node, index) => {
      write(node, parentPath, depth, index + 1, true)
      visit(node.children ?? [], node.fullPath, depth + 1)
    })
  }
  visit(catalog, null, 0)

  // Rows an admin added on production that the catalog does not know.
  const catalogPaths = new Set(flattenContent(catalog).map((node) => node.fullPath))
  for (const [path, row] of live) {
    if (catalogPaths.has(path) || retired.includes(path)) continue
    const parentPath = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : null
    console.error(`${kind}: ${path} is not in the catalog; copied untranslated`)
    write(row, parentPath, row.depth ?? 0, row.sortOrder ?? 0, false)
  }

  out.push(
    `UPDATE ${table} SET deleted_at = now(), updated_at = now() WHERE deleted_at IS NULL AND id <> ALL(${ids(kept)});`,
  )
}

// --- news ---

async function syncNews() {
  const list = await get<Row[]>("news?limit=100")
  const kept: string[] = []
  const categories = new Map<string, string>()
  const rows: { item: Row; catalog: Row | null }[] = []
  for (const entry of list) {
    const item = await get<Row>(`news/${entry.slug}`)
    const catalog = enrichNewsWithBilingual(null, item.slug) as Row | null
    rows.push({ item, catalog })
    const category = catalog?.category || item.category
    if (category) {
      const english = englishOf(category)
      categories.set(category, CATEGORY_SLUGS[english] ?? slugify(english))
    }
  }

  out.push(`-- news categories: ${categories.size}`)
  for (const [name, slug] of categories) {
    out.push(
      `INSERT INTO news_categories AS t (name, slug) VALUES (${text(name)}, ${text(slug)})\n` +
        `ON CONFLICT (slug) WHERE deleted_at IS NULL DO UPDATE SET name = EXCLUDED.name, updated_at = now();`,
    )
  }

  out.push(`-- news: ${rows.length}`)
  for (const { item, catalog } of rows) {
    kept.push(item.id)
    const category = catalog?.category || item.category
    const columns: Record<string, string> = {
      id: text(item.id),
      category_id: category
        ? `(SELECT id FROM news_categories WHERE slug = ${text(categories.get(category))} AND deleted_at IS NULL)`
        : "NULL",
      slug: text(item.slug),
      title: text(catalog?.title || item.title),
      excerpt: q(catalog?.excerpt || item.excerpt),
      body: json(catalog?.body ?? item.body ?? {}),
      featured_image_url: q(item.featuredImageUrl || catalog?.featuredImageUrl),
      featured: item.featured ? "true" : "false",
      status: "'published'",
      published_at: time(item.publishedAt),
    }
    if (!catalog) console.error(`news: ${item.slug} has no catalog entry; copied untranslated`)
    upsert("news", columns)
    seo("news", item, `/news/${item.slug}`)
  }
  out.push(`UPDATE news SET deleted_at = now(), updated_at = now() WHERE deleted_at IS NULL AND id <> ALL(${ids(kept)});`)
}

// --- careers ---

async function syncCareers() {
  const list = await get<Row[]>("careers?limit=100")
  const kept: string[] = []
  out.push(`-- careers: ${list.length}`)
  for (const entry of list) {
    const item = await get<Row>(`careers/${entry.slug}`)
    const catalog = enrichCareerWithBilingual(null, item.slug) as Row | null
    if (!catalog) console.error(`careers: ${item.slug} has no catalog entry; copied untranslated`)
    kept.push(item.id)
    upsert("careers", {
      id: text(item.id),
      slug: text(item.slug),
      title: text(catalog?.title || item.title),
      summary: q(catalog?.summary || item.summary),
      description: json(catalog?.description ?? item.description ?? {}),
      department: text(catalog?.department || item.department),
      location: text(catalog?.location || item.location),
      employment_type: text(item.employmentType || catalog?.employmentType || "full_time"),
      apply_url: q(item.applyUrl || catalog?.applyUrl),
      deadline: item.deadline ? time(item.deadline) : "NULL",
      status: "'published'",
      published_at: time(item.publishedAt),
    })
    seo("career", item, `/career/${item.slug}`)
  }
  out.push(`UPDATE careers SET deleted_at = now(), updated_at = now() WHERE deleted_at IS NULL AND id <> ALL(${ids(kept)});`)
}

// --- pages ---

async function syncPages() {
  const list = await get<Row[]>("pages?limit=100")
  out.push(`-- pages: ${list.length}`)
  for (const entry of list) {
    const page = await get<Row>(`pages/${encodeURIComponent(entry.key)}`)
    const catalog = BILINGUAL_PAGE_CATALOG[page.key]
    let title = page.title
    if (catalog && !parseMarkedText(page.title)?.en) {
      if (normalize(page.title) !== normalize(catalog.title.en) && normalize(page.title) !== normalize(catalog.title.id)) {
        console.error(`pages: ${page.key} title "${page.title}" differs from the catalog; paired with its Indonesian title`)
      }
      title = serializeLocalizedText({ en: catalog.title.en, id: catalog.title.id })
    }
    upsert("pages", {
      id: text(page.id),
      page_key: text(page.key),
      title: text(title),
      content: json(pairSeededPageContent(page.key, page.content ?? {})),
      status: text(page.status || "published"),
      published_at: time(page.publishedAt),
    })
    seo("page", page, page.key === "home" ? "/" : `/${page.key}`)
  }
}

// --- settings and menu ---

async function syncSettings() {
  const settings = await get<Row>("settings")
  const site = settings?.site
  if (site) {
    out.push("-- settings: site")
    const value = {
      ...site,
      tagline: translate(site.tagline, SETTINGS_TRANSLATIONS),
      footerDescription: translate(site.footerDescription, SETTINGS_TRANSLATIONS),
      address: translate(site.address, SETTINGS_TRANSLATIONS),
    }
    setting("site", value)
  }
  const navigation = await get<Row>("navigation")
  if (Array.isArray(navigation?.menu) && navigation.menu.length) {
    out.push("-- settings: navigation (menu labels in both languages)")
    const labels = new Map(defaultMenuItems.map((item) => [item.id, item.label]))
    const items = navigation.menu.map((item: Row) => ({ ...item, label: labels.get(item.id) ?? item.label }))
    setting("navigation", { items })
  }
}

function setting(key: string, value: unknown) {
  out.push(
    `INSERT INTO settings AS t (key, value) VALUES (${text(key)}, ${json(value)})\n` +
      `ON CONFLICT (key) WHERE deleted_at IS NULL DO UPDATE SET value = EXCLUDED.value, updated_at = now(), version = t.version + 1;`,
  )
}

// --- shared ---

function upsert(table: string, columns: Record<string, string>) {
  const names = Object.keys(columns)
  const updates = names.filter((name) => name !== "id").map((name) => `${name} = EXCLUDED.${name}`)
  out.push(
    `INSERT INTO ${table} AS t (${names.join(", ")})\nVALUES (${names.map((name) => columns[name]).join(", ")})\n` +
      `ON CONFLICT (id) DO UPDATE SET ${updates.join(", ")}, deleted_at = NULL, updated_at = now(), version = t.version + 1;`,
  )
}

// A canonical override is kept only when it names the entity's own address on
// this site. Production had several pointing at other pages, paths that do
// not exist, or another domain — which tells search engines to drop the page.
// Without one, every page canonicalises to itself.
function ownCanonical(canonical: unknown, ownPath: string): string | null {
  if (typeof canonical !== "string" || !canonical.trim()) return null
  try {
    const url = new URL(canonical, SITE)
    const host = (hostname: string) => hostname.replace(/^www\./, "")
    const path = url.pathname.replace(/\/+$/, "") || "/"
    if (host(url.hostname) === host(new URL(SITE).hostname) && path === ownPath) return canonical
  } catch {
    // Not a URL; cleared below.
  }
  console.error(`seo: ${ownPath}: canonical ${canonical} points elsewhere; cleared`)
  return null
}

function seo(entityType: string, item: Row, ownPath: string) {
  const meta = item.seo ?? {}
  if (!meta.title && !meta.description && !meta.canonical && !meta.ogImage && !meta.noIndex) return
  out.push(
    `INSERT INTO seo_meta AS t (entity_type, entity_id, title, description, canonical_url, og_image_url, no_index)\n` +
      `VALUES (${text(entityType)}, ${text(item.id)}, ${q(translate(meta.title, SEO_TRANSLATIONS))}, ` +
      `${q(translate(meta.description, SEO_TRANSLATIONS))}, ${q(ownCanonical(meta.canonical, ownPath))}, ` +
      `${q(meta.ogImage)}, ${meta.noIndex ? "true" : "false"})\n` +
      `ON CONFLICT (entity_type, entity_id) WHERE deleted_at IS NULL DO UPDATE SET title = EXCLUDED.title, ` +
      `description = EXCLUDED.description, canonical_url = EXCLUDED.canonical_url, og_image_url = EXCLUDED.og_image_url, ` +
      `no_index = EXCLUDED.no_index, updated_at = now(), version = t.version + 1;`,
  )
}

// Media library files the synced content links to, downloaded into the
// backend's local media directory and registered in the media table.
async function syncMedia(sql: string) {
  const keys = new Set<string>()
  for (const match of sql.matchAll(/\/api\/v1\/public\/media\/([^"'\s)\\]+)/g)) keys.add(decodeURIComponent(match[1]))
  if (!keys.size) return
  out.push(`-- media: ${keys.size}`)
  for (const key of keys) {
    const response = await fetch(`${SITE}${MEDIA_PREFIX}${key}`)
    if (!response.ok) {
      console.error(`media: ${key}: HTTP ${response.status}`)
      continue
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    if (MEDIA_DIR) {
      const target = join(MEDIA_DIR, ...key.split("/"))
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, bytes)
    }
    out.push(
      `INSERT INTO media (file_name, object_key, url, mime_type, size_bytes, status, metadata)\n` +
        `VALUES (${text(posix.basename(key))}, ${text(key)}, ${text(MEDIA_PREFIX + key)}, ` +
        `${text(response.headers.get("content-type")?.split(";")[0] ?? "application/octet-stream")}, ${bytes.length}, 'ready', ` +
        `${json({ source: SITE, synced: true })})\nON CONFLICT (object_key) WHERE deleted_at IS NULL DO NOTHING;`,
    )
  }
  if (!MEDIA_DIR) console.error("media: --media-dir not given; files were not saved")
}

async function main() {
  out.push(`-- Content of ${SITE}, ${new Date().toISOString()}`, "BEGIN;")
  await syncTree("products", fallbackProducts)
  await syncTree("services", fallbackServices)
  await syncNews()
  await syncCareers()
  await syncPages()
  await syncSettings()
  await syncMedia(out.join("\n"))
  out.push("COMMIT;")
  process.stdout.write(`${out.join("\n\n")}\n`)
  if (untranslated.size) {
    console.error(`${untranslated.size} text(s) without a translation:`)
    for (const value of untranslated) console.error(`  - ${value}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
