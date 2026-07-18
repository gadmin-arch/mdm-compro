"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Loader2, MailCheck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { deviceFingerprint } from "@/lib/device-fingerprint"

type Challenge = {
  challengeId: string
  maskedEmail: string
  codeLength: number
  expiresAt?: string
  resendCooldownSec: number
  trustDays: number
}

type Banner = { tone: "error" | "info"; text: string } | null

const ERROR_TEXT: Record<string, string> = {
  invalid: "Invalid email or password.",
  rate_limited: "Too many attempts. Please wait a few minutes before trying again.",
  verification_required: "Your account still needs email verification. Use the invitation code sent to your email.",
  unavailable: "The admin API is unavailable. Try again shortly.",
  invalid_code: "That code is incorrect or has expired.",
  locked: "Too many wrong codes. Start over and sign in again.",
  cooldown: "Please wait before requesting another code.",
  forbidden: "The request was blocked. Reload the page and try again.",
}

function useCountdown(target: number | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (target == null) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [target])
  if (target == null) return 0
  return Math.max(0, Math.ceil((target - now) / 1000))
}

export function LoginForm({ nextPath, initialBanner }: { nextPath: string; initialBanner?: Banner }) {
  const [step, setStep] = useState<"credentials" | "otp">("credentials")
  const [banner, setBanner] = useState<Banner>(initialBanner ?? null)
  const [pending, setPending] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [digits, setDigits] = useState<string[]>([])
  const [trustDevice, setTrustDevice] = useState(false)
  const [resendAt, setResendAt] = useState<number | null>(null)
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const resendIn = useCountdown(resendAt)
  const expiresIn = useCountdown(expiresAtMs)

  function fail(code: string) {
    setBanner({ tone: "error", text: ERROR_TEXT[code] ?? ERROR_TEXT.unavailable })
  }

  function beginChallenge(data: Challenge) {
    setChallenge(data)
    setDigits(Array.from({ length: data.codeLength }, () => ""))
    setResendAt(Date.now() + data.resendCooldownSec * 1000)
    setExpiresAtMs(data.expiresAt ? new Date(data.expiresAt).getTime() : null)
    setStep("otp")
    setBanner(null)
    setTimeout(() => inputsRef.current[0]?.focus(), 50)
  }

  async function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setBanner(null)
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next: nextPath, fingerprint: await deviceFingerprint() }),
      })
      const payload = (await response.json().catch(() => null)) as
        | ({ status: string; code?: string; next?: string } & Partial<Challenge>)
        | null
      if (!payload) return fail("unavailable")
      if (payload.status === "ok") {
        window.location.assign(payload.next || nextPath)
        return
      }
      if (payload.status === "otp_required" && payload.challengeId) {
        beginChallenge({
          challengeId: payload.challengeId,
          maskedEmail: payload.maskedEmail ?? email,
          codeLength: payload.codeLength ?? 6,
          expiresAt: payload.expiresAt,
          resendCooldownSec: payload.resendCooldownSec ?? 60,
          trustDays: payload.trustDays ?? 30,
        })
        return
      }
      fail(payload.code ?? "unavailable")
    } catch {
      fail("unavailable")
    } finally {
      setPending(false)
    }
  }

  async function submitCode(code: string) {
    if (!challenge || pending) return
    setPending(true)
    setBanner(null)
    try {
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          code,
          trustDevice,
          next: nextPath,
          fingerprint: await deviceFingerprint(),
        }),
      })
      const payload = (await response.json().catch(() => null)) as
        | { status: string; code?: string; next?: string }
        | null
      if (payload?.status === "ok") {
        window.location.assign(payload.next || nextPath)
        return
      }
      fail(payload?.code ?? "unavailable")
      setDigits(Array.from({ length: challenge.codeLength }, () => ""))
      inputsRef.current[0]?.focus()
    } catch {
      fail("unavailable")
    } finally {
      setPending(false)
    }
  }

  async function resend() {
    if (!challenge || resendIn > 0 || pending) return
    setBanner(null)
    try {
      const response = await fetch("/api/admin/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.challengeId }),
      })
      const payload = (await response.json().catch(() => null)) as
        | { status: string; code?: string; expiresAt?: string; resendCooldownSec?: number; retryAfter?: number }
        | null
      if (payload?.status === "otp_required") {
        setResendAt(Date.now() + (payload.resendCooldownSec ?? 60) * 1000)
        if (payload.expiresAt) setExpiresAtMs(new Date(payload.expiresAt).getTime())
        setDigits(Array.from({ length: challenge.codeLength }, () => ""))
        setBanner({ tone: "info", text: "A new code is on its way to your inbox." })
        inputsRef.current[0]?.focus()
        return
      }
      if (payload?.code === "cooldown" && payload.retryAfter) {
        setResendAt(Date.now() + payload.retryAfter * 1000)
      }
      fail(payload?.code ?? "unavailable")
    } catch {
      fail("unavailable")
    }
  }

  function setDigit(index: number, raw: string) {
    const value = raw.replace(/\D/g, "")
    if (!challenge) return
    const next = [...digits]

    if (value.length > 1) {
      // Paste: distribute the digits from this box onward.
      for (let i = 0; i < value.length && index + i < next.length; i++) {
        next[index + i] = value[i]
      }
      setDigits(next)
      const last = Math.min(index + value.length, next.length - 1)
      inputsRef.current[last]?.focus()
      if (next.every((d) => d !== "")) void submitCode(next.join(""))
      return
    }

    next[index] = value
    setDigits(next)
    if (value && index < next.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
    if (next.every((d) => d !== "")) void submitCode(next.join(""))
  }

  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const expiryLabel =
    expiresAtMs == null
      ? null
      : expiresIn <= 0
        ? "Code expired — resend a new one."
        : `Code expires in ${Math.floor(expiresIn / 60)}:${String(expiresIn % 60).padStart(2, "0")}`

  return (
    <>
      {banner && (
        <p
          className={
            banner.tone === "error"
              ? "mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              : "mt-5 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
          }
        >
          {banner.text}
        </p>
      )}

      {step === "credentials" ? (
        <form onSubmit={submitCredentials} className="mt-6 space-y-4" autoComplete="on">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              required
              spellCheck={false}
              className="mt-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      ) : (
        <div className="mt-6">
          <div className="flex items-start gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2.5">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              We sent a verification code to{" "}
              <span className="font-medium text-foreground">{challenge?.maskedEmail}</span>.
            </p>
          </div>

          <div className="mt-5 flex justify-center gap-2" role="group" aria-label="Verification code">
            {digits.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                className="h-12 w-10 px-0 text-center font-display text-lg font-semibold sm:w-11"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={challenge?.codeLength ?? 6}
                value={digit}
                disabled={pending}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={(event) => onKeyDown(index, event)}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {expiryLabel && (
            <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
              {expiryLabel}
            </p>
          )}

          <label className="mt-5 flex items-start gap-3 rounded-md border border-border px-3 py-2.5 text-sm">
            <Checkbox
              className="mt-0.5"
              checked={trustDevice}
              onCheckedChange={(checked) => setTrustDevice(checked === true)}
            />
            <span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Trust this device for {challenge?.trustDays ?? 30} days
              </span>
              <span className="block text-xs text-muted-foreground">
                Skip email verification on this browser. Only use on devices you own.
              </span>
            </span>
          </label>

          <Button
            type="button"
            className="mt-4 w-full"
            disabled={pending || digits.some((d) => d === "")}
            onClick={() => void submitCode(digits.join(""))}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {pending ? "Verifying..." : "Verify & Sign In"}
          </Button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setStep("credentials")
                setChallenge(null)
                setBanner(null)
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              disabled={resendIn > 0}
              onClick={() => void resend()}
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
