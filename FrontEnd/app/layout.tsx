import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { JsonLdSchema } from '@/components/seo/json-ld'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://multidayamitra.co.id'),
  title: {
    default: 'PT Multi Daya Mitra | Kontraktor Listrik, Otomasi Industri & Fire System',
    template: '%s | PT Multi Daya Mitra',
  },
  description:
    'PT Multi Daya Mitra adalah kontraktor rekayasa elektrik terintegrasi, otomasi industri (PLC & SCADA), panel maker MV/LV, testing & commissioning, serta distributor resmi Rittal di Indonesia sejak 2012.',
  keywords: [
    'kontraktor listrik surabaya',
    'kontraktor listrik indonesia',
    'otomasi industri plc scada',
    'panel maker surabaya',
    'distributor rittal indonesia',
    'jasa testing dan commissioning listrik',
    'fire alarm system indonesia',
    'distributor xarrow scada indonesia',
    'jasa instalasi kubikel 20kv',
    'PT Multi Daya Mitra'
  ],
  authors: [{ name: 'PT Multi Daya Mitra' }],
  creator: 'PT Multi Daya Mitra',
  publisher: 'PT Multi Daya Mitra',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://multidayamitra.co.id',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://multidayamitra.co.id',
    siteName: 'PT Multi Daya Mitra',
    title: 'PT Multi Daya Mitra | Kontraktor Listrik, Otomasi Industri & Fire System',
    description:
      'Solusi rekayasa elektrik, otomasi industri (PLC/SCADA), panel maker MV/LV, testing & commissioning, dan fire protection terpercaya di Indonesia.',
    images: [
      {
        url: '/uploads/hero-project.jpg',
        width: 1200,
        height: 630,
        alt: 'PT Multi Daya Mitra — Engineering, Electrical, Automation & Fire System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT Multi Daya Mitra | Kontraktor Listrik & Otomasi Industri',
    description:
      'Solusi rekayasa elektrik, otomasi industri (PLC/SCADA), panel maker MV/LV, testing & commissioning di Indonesia.',
    images: ['/uploads/hero-project.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning: the admin theme script may add the `dark`
    // class to <html> pre-hydration; attribute-level only, scoped to this element.
    <html
      lang="id"
      className={`${inter.variable} ${jakarta.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <JsonLdSchema />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
