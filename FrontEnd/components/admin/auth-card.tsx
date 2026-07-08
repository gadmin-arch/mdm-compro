import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"

export function AuthCard({
  title,
  description,
  message,
  destructive = false,
  children,
}: {
  title: string
  description: string
  message?: string
  destructive?: boolean
  children: ReactNode
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo PT MDM.png"
            alt="PT Multi Daya Mitra Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {message && (
          <p className={`mt-5 rounded-md border px-3 py-2 text-sm ${destructive ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-secondary/50 text-foreground"}`}>
            {message}
          </p>
        )}
        {children}
        <Link className="mt-5 inline-flex text-sm text-muted-foreground hover:text-foreground" href="/admin/login">
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
