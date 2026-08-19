"use client"

import { useState, useSyncExternalStore } from "react"
import { Cookie, ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const CONSENT_STORAGE_KEY = "mdm_cookie_consent"

function getConsentSnapshot(): string | null {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch {
    return null
  }
}

const emptySubscribe = () => () => {}

export function CookieConsent() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [consentGiven, setConsentGiven] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const storedConsent = isClient ? (consentGiven ?? getConsentSnapshot()) : "pending"

  // If already consented or SSR, don't render
  if (!isClient || (storedConsent !== null && storedConsent !== "pending")) {
    return null
  }

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, "all")
      window.dispatchEvent(new CustomEvent("mdm:consent-updated", { detail: { consent: "all" } }))
    } catch {
      // Ignore storage errors
    }
    setConsentGiven("all")
  }

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, "essential")
      window.dispatchEvent(new CustomEvent("mdm:consent-updated", { detail: { consent: "essential" } }))
    } catch {
      // Ignore storage errors
    }
    setConsentGiven("essential")
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie & Privacy Consent"
      className="fixed bottom-4 left-4 z-50 max-w-md print:hidden animate-in fade-in slide-in-from-bottom-4 duration-300 sm:bottom-6 sm:left-6"
    >
      <div className="rounded-2xl border border-border/90 bg-background/95 p-5 shadow-2xl backdrop-blur-md dark:bg-card/95">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-foreground">
                Cookie & Privacy Consent
              </h3>
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors cursor-pointer"
                aria-label="Dismiss cookie notice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              We use essential cookies and anonymous analytics to ensure site reliability, measure
              performance, and improve your engineering browsing experience.
            </p>

            {showDetails && (
              <div className="mt-3 space-y-2 rounded-lg border border-border/70 bg-secondary/50 p-3 text-[11px] text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Essential Cookies:</span>{" "}
                    Required for core security, CSRF protection, and session integrity. Always active.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Performance & Analytics:</span>{" "}
                    First-party, anonymous metrics to optimize page load speeds and visitor flow.
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
              <Button size="sm" onClick={handleAcceptAll} className="cursor-pointer text-xs font-semibold">
                Accept All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEssentialOnly}
                className="cursor-pointer text-xs font-medium"
              >
                Essential Only
              </Button>
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer ml-auto"
              >
                {showDetails ? "Hide details" : "Cookie details"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
