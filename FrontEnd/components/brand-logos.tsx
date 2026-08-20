import Image from "next/image"
import { cn } from "@/lib/utils"

const brandFileMap: Record<string, { src: string; alt: string; heightClass?: string }> = {
  rittal: { src: "/brands/rittal.svg", alt: "Rittal", heightClass: "h-8 sm:h-9" },
  schneider: { src: "/brands/schneider.svg", alt: "Schneider Electric", heightClass: "h-8 sm:h-9" },
  schneiderelectric: { src: "/brands/schneider.svg", alt: "Schneider Electric", heightClass: "h-8 sm:h-9" },
  xarrow: { src: "/brands/xarrow.svg", alt: "xArrow SCADA", heightClass: "h-7 sm:h-8" },
  bosch: { src: "/brands/bosch.svg", alt: "Bosch", heightClass: "h-8 sm:h-9" },
  abb: { src: "/brands/abb.svg", alt: "ABB", heightClass: "h-7 sm:h-8" },
  siemens: { src: "/brands/siemens.svg", alt: "Siemens", heightClass: "h-6 sm:h-7" },
  fluke: { src: "/brands/fluke.svg", alt: "Fluke", heightClass: "h-7 sm:h-8" },
  megger: { src: "/brands/megger.svg", alt: "Megger", heightClass: "h-7 sm:h-8" },
  flir: { src: "/brands/flir.svg", alt: "FLIR", heightClass: "h-7 sm:h-8" },
  danfoss: { src: "/brands/danfoss.svg", alt: "Danfoss", heightClass: "h-7 sm:h-8" },
  omron: { src: "/brands/omron.svg", alt: "Omron", heightClass: "h-6 sm:h-7" },
  yokogawa: { src: "/brands/yokogawa.svg", alt: "Yokogawa", heightClass: "h-6 sm:h-7" },
  honeywell: { src: "/brands/honeywell.svg", alt: "Honeywell", heightClass: "h-6 sm:h-7" },
  notifier: { src: "/brands/honeywell.svg", alt: "Notifier / Honeywell", heightClass: "h-6 sm:h-7" },
  notifierhoneywell: { src: "/brands/honeywell.svg", alt: "Notifier / Honeywell", heightClass: "h-6 sm:h-7" },
  raychem: { src: "/brands/te_raychem.svg", alt: "Raychem / TE Connectivity", heightClass: "h-7 sm:h-8" },
  teconnectivity: { src: "/brands/te_raychem.svg", alt: "TE Connectivity", heightClass: "h-7 sm:h-8" },
  teraychem: { src: "/brands/te_raychem.svg", alt: "Raychem / TE Connectivity", heightClass: "h-7 sm:h-8" },
  "3m": { src: "/brands/3m.svg", alt: "3M", heightClass: "h-7 sm:h-8" },
  threem: { src: "/brands/3m.svg", alt: "3M", heightClass: "h-7 sm:h-8" },
  eaton: { src: "/brands/eaton.svg", alt: "Eaton", heightClass: "h-7 sm:h-8" },
}

interface BrandLogoProps {
  brand: string
  className?: string
  priority?: boolean
}

export function BrandLogo({ brand, className, priority }: BrandLogoProps) {
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
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src={info.src}
        alt={info.alt}
        width={180}
        height={54}
        className={cn(
          "w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105",
          info.heightClass ?? "h-7 sm:h-8"
        )}
        priority={priority}
      />
    </div>
  )
}
