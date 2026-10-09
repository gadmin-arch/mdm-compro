import type { LocalizedText } from "@/lib/i18n"

// Default copy and prop helpers read by the client section components
// (hero, contact, offices). They live apart from lib/sections.ts — the
// builder's section catalog, presets and translation checks — because
// whatever a client component imports ships to every visitor's browser.
// lib/sections.ts builds its section defaults from these same values.

export const OFFICE_COPY: { name: Required<LocalizedText>; address: Required<LocalizedText> }[] = [
  {
    name: { id: "Kantor Pusat (Surabaya)", en: "Head Office (Surabaya)" },
    address: {
      id: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, Jawa Timur, Indonesia",
      en: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
    },
  },
  {
    name: { id: "Kantor Rekayasa & Workshop", en: "Engineering Office & Workshop" },
    address: {
      id: "Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, Jawa Timur, Indonesia",
      en: "Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia",
    },
  },
]

const HEAD_OFFICE_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.574636906236!2d112.7747579!3d-7.2854787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbc8a9c411c1%3A0x3f527ebff4e81cdd!2sMulti%20Daya%20Mitra%20PT.!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
const WORKSHOP_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1978.1062972986427!2d112.7157486!3d-7.4685927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e74726f32b8d%3A0xf8229e5934963dc6!2sPT.%20Multi%20Daya%20Mitra%20(Workshop)!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"

// Older office data pointed at Google Maps places that were later replaced;
// those two place IDs are swapped for the current embeds when rendering.
export const STALE_MAP_EMBEDS: Record<string, string> = {
  "0xe54df63b8274305c": HEAD_OFFICE_MAP,
  "0xc3fec86c4293f0b4": WORKSHOP_MAP,
}

export const DEFAULT_OFFICES: Record<string, unknown>[] = [
  {
    ...OFFICE_COPY[0],
    phone: "+62 31 592 1256",
    fax: "+62 31 591 7845",
    email: "info@multidayamitra.co.id",
    mapEmbedUrl: HEAD_OFFICE_MAP,
  },
  {
    ...OFFICE_COPY[1],
    phone: "+62 811-8303-250 · +62 821-4007-4122",
    fax: "",
    email: "sales@multidayamitra.co.id",
    mapEmbedUrl: WORKSHOP_MAP,
  },
]

// Names that read the same in both languages.
export const sameInBoth = (text: string): Required<LocalizedText> => ({ id: text, en: text })

export const CONTACT_DEFAULTS: Record<string, unknown> = {
  eyebrow: { id: "Mari Berdiskusi", en: "Let's talk" },
  title: {
    id: "Rencanakan proyek kelistrikan atau otomasi Anda bersama kami.",
    en: "Plan your next electrical or automation project with us.",
  },
  description: {
    id: "Ceritakan fasilitas dan sasaran operasional Anda — tim engineer kami akan segera menindaklanjuti dengan ruang lingkup teknis, metode pelaksanaan, dan penawaran yang terstruktur.",
    en: "Tell us about your facility and the outcomes you're after — our engineers will get back with a tailored scope, approach, and quote.",
  },
  email: "info@multidayamitra.co.id",
  phone: "+62 31 592 1256",
  technicalPhone: "+62 811-8303-250",
  salesPhone: "+62 821-4007-4122",
  officesTitle: { id: "Lokasi Kantor Kami", en: "Our Locations" },
  officesDescription: {
    id: "Kunjungi atau hubungi kantor kami untuk mendapatkan bantuan dan konsultasi langsung.",
    en: "Visit or contact any of our local offices for direct assistance.",
  },
  offices: DEFAULT_OFFICES,
  formTitle: { id: "Kirim Pesan kepada Kami", en: "Send us a Message" },
  formDescription: {
    id: "Isi formulir di bawah ini dan tim kami akan segera menindaklanjuti dalam waktu 24 jam.",
    en: "Fill out the form below and our team will follow up within 24 hours.",
  },
}

// Homepage hero copy, also the hero section's builder defaults.
export const HERO_DEFAULTS: Record<string, unknown> = {
  eyebrow: "EN: Trusted partner since 2012\nID: Mitra Terpercaya Sejak 2012",
  title: "EN: Powering industry with reliable electrical & automation services.\nID: Menggerakkan industri dengan layanan kelistrikan & otomasi yang andal.",
  highlight: "EN: reliable\nID: andal",
  description:
    "EN: PT Multi Daya Mitra delivers end-to-end electrical, industrial automation, and fire alarm solutions with 14+ years of engineering experience across Indonesia and beyond.\nID: PT Multi Daya Mitra menghadirkan solusi menyeluruh untuk kelistrikan, otomasi industri, dan proteksi kebakaran dengan lebih dari 14 tahun pengalaman rekayasa di Indonesia dan mancanegara.",
  primaryLabel: "EN: Start a Project\nID: Mulai Proyek",
  primaryHref: "/contact",
  secondaryLabel: "EN: Explore Services\nID: Jelajahi Layanan",
  secondaryHref: "/services",
  imageUrl: "/uploads/hero-project.jpg",
  imageAlt: {
    id: "Teknisi memeriksa switchgear gardu induk tegangan menengah",
    en: "Engineer inspecting medium voltage substation switchgear",
  },
  stats: [
    { label: "EN: Established\nID: Didirikan", value: "2012" },
    { label: "EN: Corporate Clients\nID: Klien Korporat", value: "400+" },
    { label: "EN: Certified Team\nID: Tim Tersertifikasi", value: "ISO & ESDM" },
  ],
  cardEyebrow: "EN: Now offering\nID: Layanan Terbaru",
  cardTitle: "EN: Energy Monitoring System for Sustainability & ESG Reporting\nID: Sistem Monitoring Energi untuk Keberlanjutan & Pelaporan ESG",
}

// --- prop coercion helpers used by section components ---

// The stored value when the admin set the key — even to an empty value —
// otherwise the code default. Localized values are returned untouched;
// resolve them with resolveText()/resolveTextList() for the page language.
export function prop(props: Record<string, unknown>, name: string, fallback?: unknown): unknown {
  return Object.prototype.hasOwnProperty.call(props, name) ? props[name] : fallback
}

// Items of a `list` field with their localized values intact. A list the
// admin emptied stays empty; the fallback only applies when the key is absent.
export function items(
  props: Record<string, unknown>,
  name: string,
  fallback: Record<string, unknown>[] = [],
): Record<string, unknown>[] {
  const value = prop(props, name, fallback)
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item),
  )
}

export function str(props: Record<string, unknown>, name: string, fallback = ""): string {
  const value = props[name]
  return typeof value === "string" ? value : fallback
}

export function num(props: Record<string, unknown>, name: string, fallback: number): number {
  const value = Number(props[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

export function lines(props: Record<string, unknown>, name: string): string[] {
  const value = props[name]
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function records(props: Record<string, unknown>, name: string): Record<string, string>[] {
  const value = props[name]
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) =>
      Object.fromEntries(
        Object.entries(item).map(([key, entryValue]) => [key, entryValue == null ? "" : String(entryValue)]),
      ),
    )
}
