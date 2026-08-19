"use client"

import { useState, useSyncExternalStore } from "react"
import { X } from "lucide-react"
import { SocialIcon } from "@/components/social-icons"

type FloatingWhatsAppProps = {
  phoneNumber?: string
  defaultMessage?: string
}

const emptySubscribe = () => () => {}

export function FloatingWhatsApp({
  phoneNumber = "+62 821-4007-4122",
  defaultMessage = "Halo PT Multi Daya Mitra, saya ingin konsultasi mengenai layanan / produk.",
}: FloatingWhatsAppProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [showBadge, setShowBadge] = useState(true)

  if (!mounted) return null

  // Format phone number for wa.me URL (remove leading +, spaces, dashes)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "")
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 print:hidden select-none">
      {showBadge && (
        <div className="group relative flex items-center gap-2 rounded-full border border-border/80 bg-background/95 px-3.5 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-foreground hover:text-emerald-600 transition-colors"
          >
            Chat Sales MDM <span className="text-muted-foreground font-normal">Online</span>
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setShowBadge(false)
            }}
            className="ml-1 text-muted-foreground hover:text-foreground rounded-full p-0.5"
            aria-label="Tutup notifikasi chat"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Sales PT Multi Daya Mitra via WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-950/20 transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-1 -z-10 rounded-full bg-emerald-500/30 opacity-70 blur-xs transition-opacity group-hover:opacity-100 animate-pulse"
        />
        <SocialIcon
          platform="whatsapp"
          className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
        />
      </a>
    </div>
  )
}
