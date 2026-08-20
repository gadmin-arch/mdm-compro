import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  brand: string
  className?: string
}

const BRAND_ASSETS: Record<string, { src: string; width: number; height: number; alt: string }> = {
  // Authorized Partners
  rittal: { src: "/brands/rittal.png", width: 189, height: 72, alt: "Rittal" },
  schneider: { src: "/brands/schneider.png", width: 243, height: 72, alt: "Schneider Electric" },
  schneiderelectric: { src: "/brands/schneider.png", width: 243, height: 72, alt: "Schneider Electric" },
  xarrow: { src: "/brands/xarrow.png", width: 195, height: 72, alt: "xArrow SCADA" },
  xarrowscada: { src: "/brands/xarrow.png", width: 195, height: 72, alt: "xArrow SCADA" },
  mundung: { src: "/brands/mundung.png", width: 480, height: 140, alt: "Mundung Connecting Futures" },
  mundungconnectingfutures: { src: "/brands/mundung.png", width: 480, height: 140, alt: "Mundung Connecting Futures" },

  // Experienced Work With Brands
  abb: { src: "/brands/abb.png", width: 188, height: 72, alt: "ABB" },
  siemens: { src: "/brands/siemens.png", width: 453, height: 72, alt: "Siemens" },
  hitachi: { src: "/brands/hitachi.png", width: 130, height: 30, alt: "Hitachi" },
  trafindo: { src: "/brands/trafindo.png", width: 144, height: 46, alt: "TRAFINDO" },
  trafoindo: { src: "/brands/trafindo.png", width: 144, height: 46, alt: "TRAFINDO" },
  bdtransformer: { src: "/brands/bdtransformer.png", width: 99, height: 50, alt: "B&D Transformer" },
  bd: { src: "/brands/bdtransformer.png", width: 99, height: 50, alt: "B&D Transformer" },
  raychem: { src: "/brands/raychem.png", width: 191, height: 72, alt: "Raychem" },
  teconnectivity: { src: "/brands/raychem.png", width: 191, height: 72, alt: "Raychem" },
  teraychem: { src: "/brands/raychem.png", width: 191, height: 72, alt: "Raychem" },
  "3m": { src: "/brands/3m.png", width: 137, height: 72, alt: "3M" },
  threem: { src: "/brands/3m.png", width: 137, height: 72, alt: "3M" },
  legrand: { src: "/brands/legrand.png", width: 153, height: 46, alt: "Legrand" },
  socomec: { src: "/brands/socomec.png", width: 178, height: 37, alt: "Socomec" },
  autonics: { src: "/brands/autonics.png", width: 149, height: 40, alt: "Autonics" },
  omron: { src: "/brands/omron.png", width: 356, height: 72, alt: "Omron" },
  chint: { src: "/brands/chint.png", width: 94, height: 40, alt: "CHINT" },
  chnt: { src: "/brands/chint.png", width: 94, height: 40, alt: "CHINT" },
  msa: { src: "/brands/msa.png", width: 100, height: 52, alt: "MSA The Safety Company" },
  msathesafetycompany: { src: "/brands/msa.png", width: 100, height: 52, alt: "MSA The Safety Company" },
  honeywell: { src: "/brands/honeywell.png", width: 405, height: 72, alt: "Honeywell" },
  notifier: { src: "/brands/honeywell.png", width: 405, height: 72, alt: "Honeywell Notifier" },
  notifierhoneywell: { src: "/brands/honeywell.png", width: 405, height: 72, alt: "Honeywell Notifier" },
  bosch: { src: "/brands/bosch.png", width: 323, height: 72, alt: "Bosch" },
  asenware: { src: "/brands/asenware.png", width: 148, height: 35, alt: "ASENWARE" },
  awasenware: { src: "/brands/asenware.png", width: 148, height: 35, alt: "ASENWARE" },
  hooseki: { src: "/brands/hooseki.png", width: 84, height: 52, alt: "HOOSEKI" },
  simplex: { src: "/brands/simplex.png", width: 130, height: 36, alt: "Simplex" },
  hikvision: { src: "/brands/hikvision.png", width: 170, height: 29, alt: "HIKVISION" },
  advantech: { src: "/brands/advantech.png", width: 155, height: 39, alt: "ADVANTECH" },
  pepperlfuchs: { src: "/brands/pepperlfuchs.png", width: 204, height: 32, alt: "Pepperl+Fuchs" },
  moxa: { src: "/brands/moxa.png", width: 119, height: 26, alt: "MOXA" },
  phoenixcontact: { src: "/brands/phoenixcontact.png", width: 111, height: 35, alt: "Phoenix Contact" },
  weidmuller: { src: "/brands/weidmuller.png", width: 201, height: 35, alt: "Weidmüller" },
  weidmueller: { src: "/brands/weidmuller.png", width: 201, height: 35, alt: "Weidmüller" },
  supreme: { src: "/brands/supreme.png", width: 64, height: 55, alt: "Supreme Cable" },
  supremecable: { src: "/brands/supreme.png", width: 64, height: 55, alt: "Supreme Cable" },
  kmi: { src: "/brands/kmi.png", width: 71, height: 41, alt: "KMI Wire and Cable" },
  kmiwireandcable: { src: "/brands/kmi.png", width: 71, height: 41, alt: "KMI Wire and Cable" },
  kabelmetal: { src: "/brands/kabelmetal.png", width: 87, height: 42, alt: "Kabelmetal Indonesia" },
  kabelmetalindonesia: { src: "/brands/kabelmetal.png", width: 87, height: 42, alt: "Kabelmetal Indonesia" },
  ge: { src: "/brands/ge.png", width: 66, height: 55, alt: "General Electric" },
  generalelectric: { src: "/brands/ge.png", width: 66, height: 55, alt: "General Electric" },
  danfoss: { src: "/brands/danfoss.png", width: 185, height: 72, alt: "Danfoss" },
  gae: { src: "/brands/gae.png", width: 98, height: 44, alt: "GAE" },
  lselectric: { src: "/brands/lselectric.png", width: 166, height: 35, alt: "LS Electric" },
  ls: { src: "/brands/lselectric.png", width: 166, height: 35, alt: "LS Electric" },
  megger: { src: "/brands/megger.png", width: 337, height: 72, alt: "Megger" },
  fluke: { src: "/brands/fluke.png", width: 492, height: 72, alt: "Fluke" },
  flir: { src: "/brands/flir.png", width: 209, height: 72, alt: "FLIR" },
  teledyneflir: { src: "/brands/flir.png", width: 209, height: 72, alt: "FLIR" },
  huazheng: { src: "/brands/huazheng.png", width: 163, height: 36, alt: "Huazheng" },
  yokogawa: { src: "/brands/yokogawa.png", width: 487, height: 72, alt: "Yokogawa" },
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
