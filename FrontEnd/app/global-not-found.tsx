import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fontVariables } from "@/lib/fonts"
import "./globals.css"

// URLs that match no route at all. The app has two root layouts (app/[lang]
// and app/admin), so this page renders its own <html> instead of composing
// one from a layout. In-page notFound() calls use app/[lang]/not-found.tsx.
export const metadata: Metadata = {
  title: "404 — Halaman tidak ditemukan | Page not found",
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="id" className={`${fontVariables} bg-background`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
          <p className="font-display text-7xl font-semibold tracking-tight text-primary/20 sm:text-8xl">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            The page you are looking for doesn&apos;t exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">Kembali ke beranda</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/en">Back to home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
