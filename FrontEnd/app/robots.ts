import type { MetadataRoute } from 'next'

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multidayamitra.co.id'
const baseUrl = (rawUrl.includes('localhost') ? rawUrl : 'https://multidayamitra.co.id').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
