import React from "react"
import { cn } from "@/lib/utils"

export type BrandKey =
  | "rittal"
  | "schneider"
  | "xarrow"
  | "bosch"
  | "abb"
  | "siemens"
  | "fluke"
  | "megger"
  | "flir"
  | "danfoss"
  | "omron"
  | "yokogawa"
  | "honeywell"
  | "notifier"
  | "raychem"
  | "3m"
  | "eaton"

interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  brand: string
  className?: string
}

export function BrandLogo({ brand, className, ...props }: BrandLogoProps) {
  const normalized = brand.toLowerCase().replace(/[^a-z0-9]/g, "")

  switch (normalized) {
    case "rittal":
      return (
        <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-7 w-auto", className)} {...props}>
          {/* Rittal Red Emblem with Grid */}
          <rect x="0" y="4" width="32" height="32" rx="4" fill="#E3001B" />
          <line x1="8" y1="4" x2="8" y2="36" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="16" y1="4" x2="16" y2="36" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="24" y1="4" x2="24" y2="36" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="0" y1="12" x2="32" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="0" y1="20" x2="32" y2="20" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="0" y1="28" x2="32" y2="28" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          {/* RITTAL Bold Typo */}
          <text x="40" y="27" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.06em">
            RITTAL
          </text>
        </svg>
      )

    case "schneider":
    case "schneiderelectric":
      return (
        <svg viewBox="0 0 190 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-7 w-auto", className)} {...props}>
          {/* Schneider Electric Green Flash */}
          <path
            d="M20.5 4C14.7 4 8.5 7.8 4 13.5C2.8 15 1.8 16.5 1 18.2H5.6L12.7 4.5C15 4.2 17.8 4 20.5 4Z"
            fill="#3DCD58"
          />
          <path
            d="M3.5 22C4.8 28.5 11.2 34 18.5 34C24.3 34 30.5 30.2 35 24.5C36.2 23 37.2 21.5 38 19.8H33.4L26.3 33.5C24 33.8 21.2 34 18.5 34C13.2 34 7.5 30.5 3.5 22Z"
            fill="#3DCD58"
          />
          <path
            d="M13.5 10L6.5 24H16.5L13.5 32L28.5 18H18.5L22.5 10H13.5Z"
            fill="#3DCD58"
          />
          <text x="44" y="22" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="800" fontSize="14" letterSpacing="-0.02em">
            Schneider
          </text>
          <text x="44" y="33" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="500" fontSize="10" letterSpacing="0.08em" opacity="0.85">
            Electric
          </text>
        </svg>
      )

    case "bosch":
      return (
        <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-7 w-auto", className)} {...props}>
          {/* Bosch Armature Circle */}
          <circle cx="18" cy="20" r="16" stroke="#EA1B24" strokeWidth="2.5" />
          <rect x="13" y="8" width="10" height="24" rx="2" stroke="#EA1B24" strokeWidth="2" fill="none" />
          <line x1="8" y1="20" x2="28" y2="20" stroke="#EA1B24" strokeWidth="2.5" />
          {/* BOSCH Bold Red Typo */}
          <text x="44" y="27" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="0.05em">
            BOSCH
          </text>
        </svg>
      )

    case "xarrow":
      return (
        <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-7 w-auto", className)} {...props}>
          {/* xArrow SCADA dynamic arrows */}
          <path d="M4 8L16 20L4 32L10 32L22 20L10 8H4Z" fill="#0284C7" />
          <path d="M14 8L26 20L14 32L20 32L32 20L20 8H14Z" fill="#0EA5E9" opacity="0.75" />
          <text x="38" y="26" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="800" fontSize="18" letterSpacing="-0.02em">
            xArrow
          </text>
          <text x="108" y="26" fill="#0284C7" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="600" fontSize="10" letterSpacing="0.05em">
            SCADA
          </text>
        </svg>
      )

    case "abb":
      return (
        <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          {/* ABB Red Block Letters */}
          <path
            d="M6 30L17 4H26L37 30H27.5L25 23H17.5L15 30H6ZM19.5 16.5H23L21.2 10.5L19.5 16.5Z"
            fill="#FF000F"
          />
          <path
            d="M40 4H56C62 4 66 6.8 66 11.5C66 14.5 64 16.8 60.5 17.6C65 18.5 67.5 21.2 67.5 25C67.5 30 63 30 57 30H40V4ZM49 14H55C57.5 14 58.5 13.2 58.5 11.5C58.5 9.8 57.5 9 55 9H49V14ZM49 25H56C58.5 25 60 24 60 22C60 20 58.5 19 56 19H49V25Z"
            fill="#FF000F"
          />
          <path
            d="M71 4H87C93 4 97 6.8 97 11.5C97 14.5 95 16.8 91.5 17.6C96 18.5 98.5 21.2 98.5 25C98.5 30 94 30 88 30H71V4ZM80 14H86C88.5 14 89.5 13.2 89.5 11.5C89.5 9.8 88.5 9 86 9H80V14ZM80 25H87C89.5 25 91 24 91 22C91 20 89.5 19 87 19H80V25Z"
            fill="#FF000F"
          />
        </svg>
      )

    case "siemens":
      return (
        <svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <text x="2" y="26" fill="#00646E" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="0.08em">
            SIEMENS
          </text>
        </svg>
      )

    case "fluke":
      return (
        <svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          {/* Fluke Yellow Box */}
          <rect x="2" y="2" width="116" height="32" rx="4" fill="#FFC20E" />
          <text x="14" y="25" fill="#000000" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontStyle="italic" fontSize="20" letterSpacing="0.06em">
            FLUKE
          </text>
        </svg>
      )

    case "megger":
      return (
        <svg viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <circle cx="12" cy="18" r="8" fill="#E30613" />
          <text x="26" y="25" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="0.06em">
            Megger
          </text>
        </svg>
      )

    case "flir":
      return (
        <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <rect x="2" y="4" width="3" height="28" fill="#005A9C" />
          <text x="12" y="26" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.08em">
            FLIR
          </text>
        </svg>
      )

    case "danfoss":
      return (
        <svg viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <text x="4" y="25" fill="#E2001A" fontFamily="var(--font-sans), Georgia, serif" fontWeight="900" fontStyle="italic" fontSize="22" letterSpacing="0.02em">
            Danfoss
          </text>
        </svg>
      )

    case "omron":
      return (
        <svg viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <text x="4" y="25" fill="#005BAC" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.1em">
            OMRON
          </text>
        </svg>
      )

    case "yokogawa":
      return (
        <svg viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <polygon points="12,6 20,6 26,18 20,30 12,30 6,18" fill="#003D79" />
          <text x="32" y="24" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="800" fontSize="17" letterSpacing="0.04em">
            YOKOGAWA
          </text>
        </svg>
      )

    case "honeywell":
    case "notifier":
    case "notifierhoneywell":
      return (
        <svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <text x="2" y="25" fill="#EE3124" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.01em">
            Honeywell
          </text>
        </svg>
      )

    case "raychem":
    case "teconnectivity":
    case "teraychem":
      return (
        <svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <rect x="2" y="6" width="22" height="24" rx="3" fill="#E86C00" />
          <text x="7" y="23" fill="#FFFFFF" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="13">
            TE
          </text>
          <text x="30" y="24" fill="currentColor" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="800" fontSize="16" letterSpacing="0.02em">
            Raychem
          </text>
        </svg>
      )

    case "3m":
    case "threem":
      return (
        <svg viewBox="0 0 90 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <text x="4" y="27" fill="#FF0000" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="26" letterSpacing="-0.02em">
            3M
          </text>
        </svg>
      )

    case "eaton":
      return (
        <svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-6 w-auto", className)} {...props}>
          <text x="2" y="26" fill="#005EB8" fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="0.04em">
            EATON
          </text>
        </svg>
      )

    default:
      return (
        <span className={cn("font-display text-xs font-bold text-foreground tracking-wide", className)}>
          {brand}
        </span>
      )
  }
}
