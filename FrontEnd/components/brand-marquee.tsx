"use client"

import { BrandLogo } from "@/components/brand-logos"

interface BrandMarqueeProps {
  brands: string[]
  className?: string
}

export function BrandMarquee({ brands, className = "" }: BrandMarqueeProps) {
  // Split brands into 2 rows evenly
  const half = Math.ceil(brands.length / 2)
  const row1 = brands.slice(0, half)
  const row2 = brands.slice(half)

  // Duplicate items for infinite seamless scroll loop
  const row1Items = [...row1, ...row1, ...row1]
  const row2Items = [...row2, ...row2, ...row2]

  return (
    <div className={`relative w-full overflow-hidden mask-fade-x py-1 ${className}`}>
      {/* Row 1 - Slides Left */}
      <div className="flex gap-3 animate-marquee-left mb-3">
        {row1Items.map((brand, idx) => (
          <div
            key={`r1-${brand}-${idx}`}
            className="group flex flex-shrink-0 items-center justify-center rounded-xl border border-border/80 bg-secondary/20 px-4 py-2 text-center transition-all hover:border-primary/50 hover:bg-card hover:shadow-xs min-w-[130px] max-w-[170px] h-[64px]"
            title={brand}
          >
            <div className="flex items-center justify-center h-8 w-full">
              <BrandLogo
                brand={brand}
                className="w-auto max-w-[110px] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 - Slides Right */}
      <div className="flex gap-3 animate-marquee-right">
        {row2Items.map((brand, idx) => (
          <div
            key={`r2-${brand}-${idx}`}
            className="group flex flex-shrink-0 items-center justify-center rounded-xl border border-border/80 bg-secondary/20 px-4 py-2 text-center transition-all hover:border-primary/50 hover:bg-card hover:shadow-xs min-w-[130px] max-w-[170px] h-[64px]"
            title={brand}
          >
            <div className="flex items-center justify-center h-8 w-full">
              <BrandLogo
                brand={brand}
                className="w-auto max-w-[110px] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
