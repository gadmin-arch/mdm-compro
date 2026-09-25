import { combineBilingualText, extractBilingualText } from "@/lib/bilingual"
import type { SEO } from "@/lib/cms"

export type BilingualPageEntry = {
  key: string
  title: {
    en: string
    id: string
  }
  seo?: {
    title: { en: string; id: string }
    description: { en: string; id: string }
  }
}

export const BILINGUAL_PAGE_CATALOG: Record<string, BilingualPageEntry> = {
  about: {
    key: "about",
    title: {
      en: "About PT Multi Daya Mitra",
      id: "Tentang PT Multi Daya Mitra",
    },
    seo: {
      title: {
        en: "About PT Multi Daya Mitra",
        id: "Tentang PT Multi Daya Mitra",
      },
      description: {
        en: "Profile of PT Multi Daya Mitra — Established in 2012 by experienced engineers, trusted electrical, industrial automation (PLC/SCADA), and fire alarm engineering contractor across Indonesia.",
        id: "Profil PT Multi Daya Mitra — Didirikan tahun 2012 oleh insinyur berpengalaman, kontraktor rekayasa elektrik, otomasi industri (PLC/SCADA), dan sistem fire alarm terpercaya di Indonesia.",
      },
    },
  },
  contact: {
    key: "contact",
    title: {
      en: "Contact PT Multi Daya Mitra",
      id: "Hubungi PT Multi Daya Mitra",
    },
    seo: {
      title: {
        en: "Contact PT Multi Daya Mitra",
        id: "Hubungi PT Multi Daya Mitra",
      },
      description: {
        en: "Get in touch with PT Multi Daya Mitra for turnkey electrical engineering, industrial automation, and fire protection solutions across Indonesia.",
        id: "Hubungi PT Multi Daya Mitra untuk konsultasi rekayasa elektrik, otomasi industri, dan pengadaan sistem kelistrikan di seluruh Indonesia.",
      },
    },
  },
  home: {
    key: "home",
    title: {
      en: "Home",
      id: "Beranda",
    },
    seo: {
      title: {
        en: "Home — PT Multi Daya Mitra",
        id: "Beranda — PT Multi Daya Mitra",
      },
      description: {
        en: "PT Multi Daya Mitra — Delivering reliable electrical engineering, industrial automation (PLC/SCADA), and fire alarm solutions across Indonesia.",
        id: "PT Multi Daya Mitra — Menghadirkan solusi rekayasa elektrik, otomasi industri (PLC/SCADA), dan proteksi kebakaran terpercaya di Indonesia.",
      },
    },
  },
  services: {
    key: "services",
    title: {
      en: "Services",
      id: "Layanan",
    },
    seo: {
      title: {
        en: "Engineering Services — PT Multi Daya Mitra",
        id: "Layanan Rekayasa Teknik — PT Multi Daya Mitra",
      },
      description: {
        en: "Comprehensive electrical engineering, PLC/SCADA automation integration, predictive maintenance, and testing & commissioning services.",
        id: "Layanan lengkap rekayasa elektrikal, integrasi otomasi PLC/SCADA, pemeliharaan prediktif, serta pengujian dan commissioning industri.",
      },
    },
  },
  products: {
    key: "products",
    title: {
      en: "Products",
      id: "Produk",
    },
    seo: {
      title: {
        en: "Industrial Products & Strategic Partners — PT Multi Daya Mitra",
        id: "Produk & Solusi Industri — PT Multi Daya Mitra",
      },
      description: {
        en: "Authorized Rittal Distributor, Schneider Electric Certified Integrator, and full lines for power distribution, climate control, and industrial automation.",
        id: "Distributor Resmi Rittal, Integrator Schneider Electric, serta lini produk lengkap untuk distribusi daya, kontrol iklim, dan otomasi industri.",
      },
    },
  },
  news: {
    key: "news",
    title: {
      en: "News & Insights",
      id: "Berita & Wawasan",
    },
    seo: {
      title: {
        en: "News & Engineering Insights — PT Multi Daya Mitra",
        id: "Berita & Wawasan Industri — PT Multi Daya Mitra",
      },
      description: {
        en: "Latest project milestones, corporate updates, and field-tested engineering insights from PT Multi Daya Mitra.",
        id: "Pembaruan proyek terkini, kabar perusahaan, dan wawasan teknis kelistrikan dari tim insinyur PT Multi Daya Mitra.",
      },
    },
  },
  career: {
    key: "career",
    title: {
      en: "Careers",
      id: "Karir",
    },
    seo: {
      title: {
        en: "Careers — PT Multi Daya Mitra",
        id: "Karir & Peluang Kerja — PT Multi Daya Mitra",
      },
      description: {
        en: "Join our engineering team delivering high-impact electrical and industrial automation projects across Indonesia.",
        id: "Bergabunglah bersama tim insinyur dan profesional PT Multi Daya Mitra dalam menangani proyek rekayasa industri berskala besar.",
      },
    },
  },
}
 
export const BILINGUAL_PAGE_FIELDS: Record<string, Record<string, { en: string; id: string }>> = {
  about: {
    overview: {
      en: "Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.",
      id: "Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.",
    },
    vision: {
      en: "Global Electrical, Automation and Fire Alarm Services Company.",
      id: "Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.",
    },
    mission: {
      en: "Mutual Partnership and Professionalism in delivering every engineering engagement.",
      id: "Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.",
    },
    tagline: {
      en: "Always Make an IMPACT - Powering Solution, Creating Impact",
      id: "Always Make an IMPACT - Solusi Kelistrikan Andal, Menciptakan Dampak Nyata",
    },
    culture: {
      en: "The company culture in a professional manner brings the company to move fast in achieving every step of its vision.",
      id: "Budaya perusahaan yang menjunjung tinggi profesionalisme mendorong gerak cepat perusahaan dalam mewujudkan setiap langkah visinya.",
    },
  },
}

/**
 * Normalizes and enriches a PageContent object so that its title,
 * SEO metadata, and custom page content fields (overview, vision, mission, etc.)
 * always contain complete bilingual Indonesian and English strings.
 */
export function enrichPageWithBilingual<
  T extends {
    key?: string
    title?: string
    seo?: SEO
    content?: Record<string, unknown>
  }
>(page: T, fallbackKey?: string): T {
  if (!page) return page
  const pageKey = (page.key || fallbackKey || "").toLowerCase().trim()
  const catalogEntry = BILINGUAL_PAGE_CATALOG[pageKey]

  const rawTitle = page.title ?? ""
  const extracted = extractBilingualText(rawTitle)

  let idTitle = extracted.id
  let enTitle = extracted.en

  if (catalogEntry) {
    if (!idTitle) {
      idTitle = catalogEntry.title.id
    }
    if (!enTitle) {
      enTitle = catalogEntry.title.en
    }
  } else {
    // If not in catalog, fallback if one language is missing
    if (!idTitle && enTitle) {
      idTitle = enTitle
    } else if (!enTitle && idTitle) {
      enTitle = idTitle
    }
  }

  const enrichedTitle = combineBilingualText({ id: idTitle, en: enTitle }) || rawTitle

  let enrichedSeo: SEO | undefined = page.seo
  if (catalogEntry?.seo) {
    const currentSeoTitle = page.seo?.title
    const currentSeoDesc = page.seo?.description

    const extractedSeoTitle = extractBilingualText(currentSeoTitle)
    const seoTitleId = extractedSeoTitle.id || catalogEntry.seo.title.id
    const seoTitleEn = extractedSeoTitle.en || catalogEntry.seo.title.en
    const combinedSeoTitle = combineBilingualText({ id: seoTitleId, en: seoTitleEn })

    const extractedSeoDesc = extractBilingualText(currentSeoDesc)
    const seoDescId = extractedSeoDesc.id || catalogEntry.seo.description.id
    const seoDescEn = extractedSeoDesc.en || catalogEntry.seo.description.en
    const combinedSeoDesc = combineBilingualText({ id: seoDescId, en: seoDescEn })

    enrichedSeo = {
      ...page.seo,
      title: combinedSeoTitle || currentSeoTitle,
      description: combinedSeoDesc || currentSeoDesc,
    }
  }

  let enrichedContent: Record<string, unknown> | undefined = page.content
  const knownFields = BILINGUAL_PAGE_FIELDS[pageKey]

  if (enrichedContent && typeof enrichedContent === "object") {
    enrichedContent = { ...enrichedContent }

    // 1. Enrich existing string fields in content
    for (const [key, val] of Object.entries(enrichedContent)) {
      if (typeof val === "string" && val.trim()) {
        const { id: extId, en: extEn } = extractBilingualText(val)
        let resolvedId = extId
        let resolvedEn = extEn

        const known = knownFields?.[key]
        if (known) {
          if (!resolvedId || resolvedId === resolvedEn) resolvedId = known.id
          if (!resolvedEn) resolvedEn = known.en
        }

        if (resolvedId && resolvedEn) {
          enrichedContent[key] = combineBilingualText({ id: resolvedId, en: resolvedEn })
        }
      }
    }

    // 2. Add any missing known fields from catalog
    if (knownFields) {
      for (const [key, pair] of Object.entries(knownFields)) {
        if (!enrichedContent[key] || enrichedContent[key] === "") {
          enrichedContent[key] = combineBilingualText({ id: pair.id, en: pair.en })
        }
      }
    }
  } else if (knownFields) {
    // If content is empty/undefined, initialize with known fields
    enrichedContent = {}
    for (const [key, pair] of Object.entries(knownFields)) {
      enrichedContent[key] = combineBilingualText({ id: pair.id, en: pair.en })
    }
  }

  return {
    ...page,
    title: enrichedTitle,
    seo: enrichedSeo,
    content: enrichedContent,
  }
}
