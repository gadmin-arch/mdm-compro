import { cn } from "@/lib/utils"

const brandFileMap: Record<string, { src: string; alt: string; maxH?: string; maxW?: string }> = {
  rittal: { src: "/brands/rittal.svg", alt: "Rittal", maxH: "max-h-8 sm:max-h-9", maxW: "max-w-[140px]" },
  schneider: { src: "/brands/schneider.svg", alt: "Schneider Electric", maxH: "max-h-8 sm:max-h-9", maxW: "max-w-[150px]" },
  schneiderelectric: { src: "/brands/schneider.svg", alt: "Schneider Electric", maxH: "max-h-8 sm:max-h-9", maxW: "max-w-[150px]" },
  xarrow: { src: "/brands/xarrow.svg", alt: "xArrow SCADA", maxH: "max-h-8 sm:max-h-9", maxW: "max-w-[140px]" },
  bosch: { src: "/brands/bosch.svg", alt: "Bosch", maxH: "max-h-8 sm:max-h-9", maxW: "max-w-[140px]" },
  abb: { src: "/brands/abb.svg", alt: "ABB", maxH: "max-h-7 sm:max-h-8", maxW: "max-w-[110px]" },
  siemens: { src: "/brands/siemens.svg", alt: "Siemens", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[130px]" },
  fluke: { src: "/brands/fluke.svg", alt: "Fluke", maxH: "max-h-7 sm:max-h-8", maxW: "max-w-[120px]" },
  megger: { src: "/brands/megger.svg", alt: "Megger", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[120px]" },
  flir: { src: "/brands/flir.svg", alt: "FLIR", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[110px]" },
  danfoss: { src: "/brands/danfoss.svg", alt: "Danfoss", maxH: "max-h-7 sm:max-h-8", maxW: "max-w-[120px]" },
  omron: { src: "/brands/omron.svg", alt: "Omron", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[125px]" },
  yokogawa: { src: "/brands/yokogawa.svg", alt: "Yokogawa", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[135px]" },
  honeywell: { src: "/brands/honeywell.svg", alt: "Honeywell", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[135px]" },
  notifier: { src: "/brands/honeywell.svg", alt: "Notifier / Honeywell", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[135px]" },
  notifierhoneywell: { src: "/brands/honeywell.svg", alt: "Notifier / Honeywell", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[135px]" },
  raychem: { src: "/brands/te_raychem.svg", alt: "Raychem / TE Connectivity", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[125px]" },
  teconnectivity: { src: "/brands/te_raychem.svg", alt: "TE Connectivity", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[125px]" },
  teraychem: { src: "/brands/te_raychem.svg", alt: "Raychem / TE Connectivity", maxH: "max-h-6 sm:max-h-7", maxW: "max-w-[125px]" },
  "3m": { src: "/brands/3m.svg", alt: "3M", maxH: "max-h-7 sm:max-h-8", maxW: "max-w-[80px]" },
  threem: { src: "/brands/3m.svg", alt: "3M", maxH: "max-h-7 sm:max-h-8", maxW: "max-w-[80px]" },
  eaton: { src: "/brands/eaton.svg", alt: "Eaton", maxH: "max-h-7 sm:max-h-8", maxW: "max-w-[120px]" },
}

interface BrandLogoProps {
  brand: string
  className?: string
  priority?: boolean
}

export function BrandLogo({ brand, className }: BrandLogoProps) {
  const key = brand.toLowerCase().replace(/[^a-z0-9]/g, "")
  const info = brandFileMap[key]

  if (!info) {
    return (
      <span className={cn("font-display text-sm font-bold text-foreground tracking-wide", className)}>
        {brand}
      </span>
    )
  }

  return (
    <div className={cn("relative flex items-center justify-center w-full h-full", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={info.src}
        alt={info.alt}
        className={cn(
          "w-auto h-auto max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none",
          info.maxH,
          info.maxW
        )}
        loading="lazy"
      />
    </div>
  )
}
