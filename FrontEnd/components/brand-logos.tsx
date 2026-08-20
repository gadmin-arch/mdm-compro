import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  brand: string
  className?: string
}

const BRAND_ASSETS: Record<string, { src: string; width: number; height: number; alt: string }> = {
  rittal: { src: "/brands/rittal.png", width: 189, height: 72, alt: "Rittal" },
  schneider: { src: "/brands/schneider.png", width: 243, height: 72, alt: "Schneider Electric" },
  schneiderelectric: { src: "/brands/schneider.png", width: 243, height: 72, alt: "Schneider Electric" },
  xarrow: { src: "/brands/xarrow.png", width: 195, height: 72, alt: "xArrow SCADA" },
  bosch: { src: "/brands/bosch.png", width: 323, height: 72, alt: "Bosch" },
  abb: { src: "/brands/abb.png", width: 188, height: 72, alt: "ABB" },
  siemens: { src: "/brands/siemens.png", width: 453, height: 72, alt: "Siemens" },
  fluke: { src: "/brands/fluke.png", width: 492, height: 72, alt: "Fluke" },
  megger: { src: "/brands/megger.png", width: 337, height: 72, alt: "Megger" },
  flir: { src: "/brands/flir.png", width: 209, height: 72, alt: "Teledyne FLIR" },
  danfoss: { src: "/brands/danfoss.png", width: 185, height: 72, alt: "Danfoss" },
  omron: { src: "/brands/omron.png", width: 356, height: 72, alt: "Omron" },
  yokogawa: { src: "/brands/yokogawa.png", width: 487, height: 72, alt: "Yokogawa" },
  honeywell: { src: "/brands/honeywell.png", width: 405, height: 72, alt: "Honeywell" },
  notifier: { src: "/brands/honeywell.png", width: 405, height: 72, alt: "Honeywell Notifier" },
  notifierhoneywell: { src: "/brands/honeywell.png", width: 405, height: 72, alt: "Honeywell Notifier" },
  raychem: { src: "/brands/raychem.png", width: 191, height: 72, alt: "TE Connectivity / Raychem" },
  teconnectivity: { src: "/brands/raychem.png", width: 191, height: 72, alt: "TE Connectivity" },
  teraychem: { src: "/brands/raychem.png", width: 191, height: 72, alt: "TE Connectivity / Raychem" },
  "3m": { src: "/brands/3m.png", width: 137, height: 72, alt: "3M" },
  threem: { src: "/brands/3m.png", width: 137, height: 72, alt: "3M" },
  eaton: { src: "/brands/eaton.png", width: 268, height: 72, alt: "Eaton" },
}

export function BrandLogo({ brand, className }: BrandLogoProps) {
  const key = brand.toLowerCase().replace(/[^a-z0-9]/g, "")
  const asset = BRAND_ASSETS[key]

  if (asset) {
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        className={cn(
          "h-7 sm:h-8 w-auto max-w-[130px] object-contain shrink-0 select-none transition-transform duration-300 group-hover:scale-105 pointer-events-none",
          className
        )}
        priority
        unoptimized
      />
    )
  }

  return (
    <span className={cn("font-display text-sm font-bold text-foreground tracking-wide", className)}>
      {brand}
    </span>
  )
}
