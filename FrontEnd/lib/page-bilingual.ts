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

/**
 * Normalizes and enriches a PageContent object so that its title
 * and SEO metadata always contain complete bilingual Indonesian and English strings.
 */
export function enrichPageWithBilingual<T extends { key?: string; title?: string; seo?: SEO }>(
  page: T,
  fallbackKey?: string,
): T {
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

  return {
    ...page,
    title: enrichedTitle,
    seo: enrichedSeo,
  }
}
