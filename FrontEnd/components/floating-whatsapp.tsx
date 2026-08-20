"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import { MessageSquare, PhoneCall, ChevronRight, X } from "lucide-react"
import { SocialIcon } from "@/components/social-icons"

interface ContactOption {
  title: string
  subtitle: string
  phone: string
  cleanPhone: string
  message: string
  badge?: string
}

const contacts: ContactOption[] = [
  {
    title: "Technical Expert",
    subtitle: "Engineering consultation & technical specifications",
    phone: "+62 811-8303-250",
    cleanPhone: "628118303250",
    message: "Hello PT Multi Daya Mitra, I would like to consult with a Technical Expert regarding engineering solutions.",
    badge: "Engineering",
  },
  {
    title: "Sales & Procurement",
    subtitle: "Quotation, product pricing & hardware availability",
    phone: "+62 821-4007-4122",
    cleanPhone: "6282140074122",
    message: "Hello PT Multi Daya Mitra, I would like to inquire about product pricing and availability.",
    badge: "Sales",
  },
]

const emptySubscribe = () => () => {}

export function FloatingWhatsApp() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [isOpen, setIsOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(true)
  const popupRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) return null

  return (
    <div
      ref={popupRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden select-none"
    >
      {/* 1. Floating Contacts Popup Modal */}
      {isOpen && (
        <div className="w-[320px] sm:w-[350px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
                  <SocialIcon platform="whatsapp" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-white">
                    PT Multi Daya Mitra
                  </h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online &bull; Choose a specialist
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                aria-label="Close WhatsApp options"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="p-3.5 space-y-2.5 bg-card">
            {contacts.map((c) => {
              const waUrl = `https://wa.me/${c.cleanPhone}?text=${encodeURIComponent(c.message)}`
              return (
                <a
                  key={c.cleanPhone}
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-start gap-3 rounded-xl border border-border/80 bg-secondary/30 p-3 text-left transition-all hover:border-emerald-500/60 hover:bg-emerald-500/5 hover:shadow-xs cursor-pointer"
                >
                  <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
                    <SocialIcon platform="whatsapp" className="h-5 w-5" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-emerald-600 transition-colors truncate">
                        {c.title}
                      </span>
                      {c.badge && (
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                          {c.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {c.subtitle}
                    </p>
                    <p className="text-xs font-mono font-medium text-foreground/80 mt-1 flex items-center gap-1">
                      <PhoneCall className="h-3 w-3 text-emerald-500" />
                      {c.phone}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground self-center transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                </a>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="border-t border-border/60 bg-muted/30 px-3.5 py-2 text-center text-[10px] text-muted-foreground">
            Direct WhatsApp Consultation &bull; Instant Response
          </div>
        </div>
      )}

      {/* 2. Teaser Notification Badge (when closed) */}
      {!isOpen && showTeaser && (
        <div className="group relative flex items-center gap-2 rounded-full border border-border/80 bg-background/95 px-3.5 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-xs font-semibold text-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
            Chat with Experts <span className="text-muted-foreground font-normal">(2 Online)</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowTeaser(false)
            }}
            className="ml-1 text-muted-foreground hover:text-foreground rounded-full p-0.5 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 3. Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp direct contacts"
        aria-expanded={isOpen}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 cursor-pointer ${
          isOpen
            ? "bg-muted-foreground/80 hover:bg-muted-foreground rotate-90"
            : "bg-[#25D366] shadow-emerald-950/20 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl"
        }`}
      >
        {!isOpen && (
          <span
            aria-hidden="true"
            className="absolute -inset-1 -z-10 rounded-full bg-emerald-500/30 opacity-70 blur-xs transition-opacity group-hover:opacity-100 animate-pulse"
          />
        )}
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <SocialIcon
            platform="whatsapp"
            className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </button>
    </div>
  )
}
