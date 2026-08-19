import type { MetadataRoute } from 'next'
import { getServices, getProducts, getNews, getCareers, type ContentNode } from '@/lib/cms'

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multidayamitra.co.id'
const baseUrl = (rawUrl.includes('localhost') ? rawUrl : 'https://multidayamitra.co.id').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const [services, products, newsList, careersList] = await Promise.all([
    getServices().catch(() => []),
    getProducts().catch(() => []),
    getNews({ limit: 100 }).catch(() => ({ data: [] })),
    getCareers({ limit: 100 }).catch(() => ({ data: [] })),
  ])

  const flattenPaths = (nodes: ContentNode[], prefix: string): MetadataRoute.Sitemap => {
    let urls: MetadataRoute.Sitemap = []
    for (const node of nodes) {
      if (node.fullPath) {
        urls.push({
          url: `${baseUrl}/${prefix}/${node.fullPath}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
      if (Array.isArray(node.children) && node.children.length > 0) {
        urls = urls.concat(flattenPaths(node.children, prefix))
      }
    }
    return urls
  }

  const serviceRoutes = flattenPaths(Array.isArray(services) ? services : [], 'services')
  const productRoutes = flattenPaths(Array.isArray(products) ? products : [], 'products')

  const newsRoutes: MetadataRoute.Sitemap = (newsList.data || []).map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const careerRoutes: MetadataRoute.Sitemap = (careersList.data || []).map((item) => ({
    url: `${baseUrl}/career/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...serviceRoutes, ...productRoutes, ...newsRoutes, ...careerRoutes]
}
