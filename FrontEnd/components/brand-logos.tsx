import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  brand: string
  className?: string
}

const BRAND_ASSETS: Record<string, { src: string; width: number; height: number; alt: string }> = {
  // Authorized Partners
  rittal: { src: "/brands/rittal.png", width: 380, height: 526, alt: "Rittal" },
  schneider: { src: "/brands/schneider.png", width: 664, height: 206, alt: "Schneider Electric" },
  schneiderelectric: { src: "/brands/schneider.png", width: 664, height: 206, alt: "Schneider Electric" },
  xarrow: { src: "/brands/xarrow.png", width: 1438, height: 438, alt: "xArrow SCADA" },
  xarrowscada: { src: "/brands/xarrow.png", width: 1438, height: 438, alt: "xArrow SCADA" },
  mundung: { src: "/brands/mundung.png", width: 518, height: 164, alt: "Mundung Connecting Futures" },
  mundungconnectingfutures: { src: "/brands/mundung.png", width: 518, height: 164, alt: "Mundung Connecting Futures" },

  // Experienced Work With Brands
  abb: { src: "/brands/abb.png", width: 1056, height: 406, alt: "ABB" },
  siemens: { src: "/brands/siemens.png", width: 1041, height: 178, alt: "Siemens" },
  hitachi: { src: "/brands/hitachi.png", width: 1080, height: 186, alt: "Hitachi" },
  trafindo: { src: "/brands/trafindo.png", width: 1797, height: 450, alt: "TRAFINDO" },
  trafoindo: { src: "/brands/trafindo.png", width: 1797, height: 450, alt: "TRAFINDO" },
  bdtransformer: { src: "/brands/bdtransformer.png", width: 126, height: 66, alt: "B&D Transformer" },
  bd: { src: "/brands/bdtransformer.png", width: 126, height: 66, alt: "B&D Transformer" },
  raychem: { src: "/brands/raychem.png", width: 215, height: 96, alt: "Raychem" },
  teconnectivity: { src: "/brands/raychem.png", width: 215, height: 96, alt: "Raychem" },
  teraychem: { src: "/brands/raychem.png", width: 215, height: 96, alt: "Raychem" },
  "3m": { src: "/brands/3m.png", width: 1072, height: 560, alt: "3M" },
  threem: { src: "/brands/3m.png", width: 1072, height: 560, alt: "3M" },
  legrand: { src: "/brands/legrand.png", width: 807, height: 206, alt: "Legrand" },
  socomec: { src: "/brands/socomec.png", width: 1171, height: 212, alt: "Socomec" },
  autonics: { src: "/brands/autonics.png", width: 604, height: 144, alt: "Autonics" },
  omron: { src: "/brands/omron.png", width: 1384, height: 284, alt: "Omron" },
  chint: { src: "/brands/chint.png", width: 122, height: 56, alt: "CHINT" },
  chnt: { src: "/brands/chint.png", width: 122, height: 56, alt: "CHINT" },
  msa: { src: "/brands/msa.png", width: 124, height: 68, alt: "MSA The Safety Company" },
  msathesafetycompany: { src: "/brands/msa.png", width: 124, height: 68, alt: "MSA The Safety Company" },
  honeywell: { src: "/brands/honeywell.png", width: 1080, height: 201, alt: "Honeywell" },
  notifier: { src: "/brands/honeywell.png", width: 1080, height: 201, alt: "Honeywell Notifier" },
  notifierhoneywell: { src: "/brands/honeywell.png", width: 1080, height: 201, alt: "Honeywell Notifier" },
  bosch: { src: "/brands/bosch.png", width: 1080, height: 247, alt: "Bosch" },
  asenware: { src: "/brands/asenware.png", width: 1103, height: 255, alt: "ASENWARE" },
  awasenware: { src: "/brands/asenware.png", width: 1103, height: 255, alt: "ASENWARE" },
  hooseki: { src: "/brands/hooseki.png", width: 776, height: 418, alt: "HOOSEKI" },
  simplex: { src: "/brands/simplex.png", width: 1252, height: 281, alt: "Simplex" },
  hikvision: { src: "/brands/hikvision.png", width: 1424, height: 192, alt: "HIKVISION" },
  advantech: { src: "/brands/advantech.png", width: 518, height: 122, alt: "ADVANTECH" },
  pepperlfuchs: { src: "/brands/pepperlfuchs.png", width: 477, height: 78, alt: "Pepperl+Fuchs" },
  moxa: { src: "/brands/moxa.png", width: 607, height: 107, alt: "MOXA" },
  phoenixcontact: { src: "/brands/phoenixcontact.png", width: 1053, height: 226, alt: "Phoenix Contact" },
  weidmuller: { src: "/brands/weidmuller.png", width: 229, height: 51, alt: "Weidmüller" },
  weidmueller: { src: "/brands/weidmuller.png", width: 229, height: 51, alt: "Weidmüller" },
  supreme: { src: "/brands/supreme.png", width: 562, height: 567, alt: "Supreme Cable" },
  supremecable: { src: "/brands/supreme.png", width: 562, height: 567, alt: "Supreme Cable" },
  kmi: { src: "/brands/kmi.png", width: 344, height: 101, alt: "KMI Wire and Cable" },
  kmiwireandcable: { src: "/brands/kmi.png", width: 344, height: 101, alt: "KMI Wire and Cable" },
  kabelmetal: { src: "/brands/kabelmetal.png", width: 344, height: 101, alt: "Kabelmetal Indonesia" },
  kabelmetalindonesia: { src: "/brands/kabelmetal.png", width: 344, height: 101, alt: "Kabelmetal Indonesia" },
  ge: { src: "/brands/ge.png", width: 1058, height: 1058, alt: "General Electric" },
  generalelectric: { src: "/brands/ge.png", width: 1058, height: 1058, alt: "General Electric" },
  danfoss: { src: "/brands/danfoss.png", width: 1042, height: 412, alt: "Danfoss" },
  gae: { src: "/brands/gae.png", width: 886, height: 351, alt: "GAE" },
  lselectric: { src: "/brands/lselectric.png", width: 829, height: 282, alt: "LS Electric" },
  ls: { src: "/brands/lselectric.png", width: 829, height: 282, alt: "LS Electric" },
  megger: { src: "/brands/megger.png", width: 1080, height: 232, alt: "Megger" },
  fluke: { src: "/brands/fluke.png", width: 1080, height: 352, alt: "Fluke" },
  flir: { src: "/brands/flir.png", width: 530, height: 191, alt: "FLIR" },
  teledyneflir: { src: "/brands/flir.png", width: 530, height: 191, alt: "FLIR" },
  huazheng: { src: "/brands/huazheng.png", width: 1504, height: 278, alt: "Huazheng" },
  yokogawa: { src: "/brands/yokogawa.png", width: 1080, height: 1080, alt: "Yokogawa" },
  eaton: { src: "/brands/eaton.png", width: 1077, height: 297, alt: "Eaton" },
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
