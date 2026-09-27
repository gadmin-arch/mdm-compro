import type { MetadataRoute } from 'next'
import { getServices, getProducts, getNews, getCareers, getPages, type ContentNode } from '@/lib/cms'

export const revalidate = 3600

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multidayamitra.co.id'
const baseUrl = (rawUrl.includes('localhost') ? rawUrl : 'https://multidayamitra.co.id').replace(/\/$/, '')

function sitemapEntry(
  url: string,
  lastModified: Date,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
  priority: number,
): MetadataRoute.Sitemap[number] {
  const enUrl = url === baseUrl ? `${baseUrl}/en` : `${baseUrl}/en${url.replace(baseUrl, '')}`
  return {
    url,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        id: url,
        en: enUrl,
        'x-default': url,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    sitemapEntry(`${baseUrl}`, new Date(), 'daily', 1.0),
    sitemapEntry(`${baseUrl}/about`, new Date(), 'weekly', 0.9),
    sitemapEntry(`${baseUrl}/services`, new Date(), 'daily', 0.9),
    sitemapEntry(`${baseUrl}/products`, new Date(), 'daily', 0.9),
    sitemapEntry(`${baseUrl}/news`, new Date(), 'daily', 0.8),
    sitemapEntry(`${baseUrl}/career`, new Date(), 'weekly', 0.8),
    sitemapEntry(`${baseUrl}/contact`, new Date(), 'monthly', 0.8),
    sitemapEntry(`${baseUrl}/industries`, new Date(), 'monthly', 0.7),
  ]

  const [services, products, newsList, careersList, pagesList] = await Promise.all([
    getServices().catch(() => []),
    getProducts().catch(() => []),
    getNews({ limit: 100 }).catch(() => ({ data: [] })),
    getCareers({ limit: 100 }).catch(() => ({ data: [] })),
    getPages({ limit: 100 }).catch(() => ({ data: [] })),
  ])

  const flattenPaths = (nodes: ContentNode[], prefix: string): MetadataRoute.Sitemap => {
    let urls: MetadataRoute.Sitemap = []
    for (const node of nodes) {
      if (node.fullPath) {
        urls.push(
          sitemapEntry(`${baseUrl}/${prefix}/${node.fullPath}`, new Date(), 'weekly', 0.8),
        )
      }
      if (Array.isArray(node.children) && node.children.length > 0) {
        urls = urls.concat(flattenPaths(node.children, prefix))
      }
    }
    return urls
  }

  const serviceRoutes = flattenPaths(Array.isArray(services) ? services : [], 'services')
  const productRoutes = flattenPaths(Array.isArray(products) ? products : [], 'products')

  const newsRoutes: MetadataRoute.Sitemap = (newsList.data || []).map((item) =>
    sitemapEntry(
      `${baseUrl}/news/${item.slug}`,
      item.publishedAt ? new Date(item.publishedAt) : new Date(),
      'weekly',
      0.7,
    ),
  )

  const careerRoutes: MetadataRoute.Sitemap = (careersList.data || []).map((item) =>
    sitemapEntry(
      `${baseUrl}/career/${item.slug}`,
      item.publishedAt ? new Date(item.publishedAt) : new Date(),
      'weekly',
      0.7,
    ),
  )

  const systemKeys = new Set(['home', 'cpanel', 'webmail', 'about', 'services', 'products', 'news', 'career', 'contact', 'industries'])
  const customPageRoutes: MetadataRoute.Sitemap = (pagesList.data || [])
    .filter((page) => page.status === 'published' && !systemKeys.has(page.key))
    .map((page) =>
      sitemapEntry(
        `${baseUrl}/${page.key}`,
        page.publishedAt ? new Date(page.publishedAt) : new Date(),
        'monthly',
        0.8,
      ),
    )

  return [...staticRoutes, ...customPageRoutes, ...serviceRoutes, ...productRoutes, ...newsRoutes, ...careerRoutes]
}
