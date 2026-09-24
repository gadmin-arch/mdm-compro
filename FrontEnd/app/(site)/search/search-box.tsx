"use client"

import { SearchIcon } from "lucide-react"
import { useContentLanguage } from "@/components/cms/content-language"

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const { isIndonesian } = useContentLanguage()

  return (
    <form action="/search" method="GET" className="max-w-2xl mx-auto mb-12">
      <div className="relative flex items-center">
        <SearchIcon className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder={isIndonesian ? "Cari produk, layanan, berita..." : "Search products, services, news..."}
          className="w-full h-12 pl-12 pr-24 rounded-full border border-border bg-card/50 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 px-5 h-8 bg-primary text-primary-foreground font-medium rounded-full text-sm hover:bg-primary/95 transition-colors cursor-pointer"
        >
          {isIndonesian ? "Cari" : "Search"}
        </button>
      </div>
    </form>
  )
}
