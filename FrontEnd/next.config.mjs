import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Allow next/image to load absolute URLs that point at our own site (e.g. an
// editor pastes "https://v2.multidayamitra.co.id/uploads/..."). Relative paths
// are always fine; this covers the absolute case without hard-coding a domain.
const siteImagePattern = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL
  if (!raw) return null
  try {
    const { protocol, hostname } = new URL(raw)
    return { protocol: protocol.replace(':', ''), hostname }
  } catch {
    return null
  }
})()
const adminSecurityHeaders = [
  { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: adminSecurityHeaders,
      },
      {
        source: '/api/admin/:path*',
        headers: adminSecurityHeaders,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/public/:path*',
        destination: `${process.env.CMS_API_BASE_URL || 'http://api:8080/api/v1/public'}/:path*`,
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'minio',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      ...(siteImagePattern ? [siteImagePattern] : []),
    ],
  },
}

export default nextConfig
