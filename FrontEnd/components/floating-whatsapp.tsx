"use client"

import { useState, useSyncExternalStore } from "react"
import { X } from "lucide-react"

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
        {/* WhatsApp Official Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="currentColor"
          className="transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.476-.15-.677.15-.201.301-.778.98-.953 1.18-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.501.1-.201.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.235-.245-.589-.494-.509-.677-.518-.175-.009-.376-.009-.577-.009-.201 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.229 3.109.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.251-.702.251-1.304.175-1.43-.075-.126-.276-.201-.577-.351zM12.042 21.879h-.008c-1.776 0-3.518-.478-5.044-1.385l-.362-.215-3.751.984 1.001-3.657-.236-.375c-.997-1.587-1.523-3.424-1.523-5.312 0-5.5 4.475-9.975 9.979-9.975 2.664 0 5.168 1.038 7.05 2.92 1.882 1.883 2.918 4.388 2.918 7.053 0 5.5-4.475 9.972-9.984 9.972zm0-18.384c-4.639 0-8.414 3.774-8.414 8.411 0 1.482.388 2.932 1.125 4.211l.247.43-.655 2.395 2.451-.643.418.248c1.238.736 2.659 1.125 4.12 1.125h.007c4.638 0 8.413-3.774 8.413-8.412 0-2.247-.875-4.36-2.464-5.95-1.59-1.59-3.704-2.464-5.953-2.464z" />
        </svg>
      </a>
    </div>
  )
}
