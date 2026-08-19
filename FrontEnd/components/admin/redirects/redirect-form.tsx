"use client"

import { useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Copy, Download, Link2, QrCode, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import type { AdminRedirect } from "@/lib/admin-api"
import { slugify, toDateTimeLocal } from "@/lib/admin-content"
import type { SaveAction } from "@/lib/save-result"
import { cn } from "@/lib/utils"

const QR_SIZES = [256, 512, 1024, 2048, 4096]

const selectClass =
  "h-9 w-full appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 px-3 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"

export function RedirectForm({
  action,
  redirect,
  mode,
}: {
  action: SaveAction
  redirect?: AdminRedirect
  mode: "create" | "edit"
}) {
  const [name, setName] = useState(redirect?.name ?? "")
  const [slug, setSlug] = useState(redirect?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(mode === "edit")
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { pending, result: saveResult, submit } = useSaveAction(action)

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const shortUrl = `${origin}/${slug || "…"}`

  function updateName(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function copyShortUrl() {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.prompt("Copy the short link:", shortUrl)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <input type="hidden" name="id" value={redirect?.id ?? ""} />
      <input type="hidden" name="version" value={redirect?.version ?? 0} />

      {saveResult && (
        <div className="xl:col-span-2">
          <SaveErrorBanner
            result={saveResult}
            entity="short link"
            onOverwrite={
              saveResult.serverVersion
                ? () => submit(formRef.current, { version: String(saveResult.serverVersion) })
                : undefined
            }
          />
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                Name
              </label>
              <Input
                className="mt-2"
                id="name"
                name="name"
                required
                value={name}
                onChange={(event) => updateName(event.target.value)}
                placeholder="Promo Brochure 2026"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="slug">
                Slug
              </label>
              <Input
                className="mt-2 font-mono"
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  setSlug(slugify(event.target.value))
                }}
                placeholder="promo"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 px-3 py-2">
            <Link2 className="h-4 w-4 shrink-0 text-primary" />
            <code className="min-w-0 flex-1 truncate text-sm text-foreground">{shortUrl}</code>
            <Button type="button" size="sm" variant="ghost" onClick={copyShortUrl}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-foreground" htmlFor="destination">
              Destination URL
            </label>
            <Input
              className="mt-2"
              id="destination"
              name="destination"
              type="url"
              required
              defaultValue={redirect?.destination ?? ""}
              placeholder="https://example.com/landing-page"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-foreground" htmlFor="description">
              Description
            </label>
            <Textarea
              className="mt-2"
              id="description"
              name="description"
              rows={2}
              defaultValue={redirect?.description ?? ""}
              placeholder="Where is this link used? (flyer, banner, catalog...)"
            />
          </div>
        </section>

        {mode === "edit" && redirect && <QrPanel redirect={redirect} />}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-lg border border-border bg-background p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Publish</h2>

          <label className="mt-4 flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm">
            <Switch name="isActive" defaultChecked={redirect ? redirect.isActive : true} />
            <span className="font-medium text-foreground">Active</span>
          </label>

          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">Redirect type</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[301, 302].map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="redirectType"
                    value={type}
                    defaultChecked={(redirect?.redirectType ?? 302) === type}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-semibold text-foreground">{type}</span>
                    <span className="block text-xs text-muted-foreground">
                      {type === 301 ? "Permanent (cached by browsers)" : "Temporary (safe to change later)"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-foreground" htmlFor="expiresAt">
              Expiration date <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <Input
              className="mt-2"
              id="expiresAt"
              name="expiresAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(redirect?.expiresAt ?? undefined)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">After this moment the link stops redirecting.</p>
          </div>

          <Button className="mt-5 w-full" disabled={pending} type="submit">
            <Save className="h-4 w-4" />
            {pending ? "Saving..." : mode === "create" ? "Create Short Link" : "Save Changes"}
          </Button>
          {mode === "create" && (
            <p className="mt-2 text-xs text-muted-foreground">The QR code appears after the link is created.</p>
          )}
        </section>
      </aside>
    </form>
  )
}

function QrPanel({ redirect }: { redirect: AdminRedirect }) {
  const [size, setSize] = useState(1024)
  const [bg, setBg] = useState<"white" | "transparent">("white")
  const [logo, setLogo] = useState(true)

  const query = useMemo(
    () => `size=${size}&bg=${bg}&logo=${logo ? 1 : 0}`,
    [size, bg, logo],
  )
  const base = `/api/admin/redirects/${redirect.id}/qr`
  const previewSrc = `${base}?format=png&size=512&bg=${bg}&logo=${logo ? 1 : 0}`

  return (
    <section id="qr" className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">QR Code</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Highest error correction (level H) — the centered logo never breaks scanning.
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-[200px_minmax(0,1fr)]">
        <div
          className={cn(
            "flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-lg border border-border",
            bg === "transparent" &&
              "bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%,transparent_75%,#e5e5e5_75%),linear-gradient(45deg,#e5e5e5_25%,transparent_25%,transparent_75%,#e5e5e5_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={previewSrc} src={previewSrc} alt={`QR code for /${redirect.slug}`} className="h-full w-full object-contain" />
        </div>

        <div className="space-y-3">
          <label className="grid gap-1 text-xs font-medium text-muted-foreground">
            Size (pixels)
            <div className="relative flex items-center">
              <select className={selectClass} value={size} onChange={(event) => setSize(Number(event.target.value))}>
                {QR_SIZES.map((option) => (
                  <option key={option} value={option} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
                    {option} × {option}
                    {option >= 2048 ? " (print)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </label>
          <label className="grid gap-1 text-xs font-medium text-muted-foreground">
            Background
            <div className="relative flex items-center">
              <select className={selectClass} value={bg} onChange={(event) => setBg(event.target.value as "white" | "transparent")}>
                <option value="white" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">White</option>
                <option value="transparent" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Transparent (PNG/SVG)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </label>
          <label className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-sm">
            <Switch checked={logo} onCheckedChange={setLogo} />
            Company logo in the center
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            {(["png", "svg", "pdf"] as const).map((format) => (
              <Button key={format} asChild size="sm" variant="outline">
                <a href={`${base}?format=${format}&${query}&download=1`} download>
                  <Download className="h-4 w-4" />
                  {format.toUpperCase()}
                </a>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            SVG scales to any size; PDF is a 100×100&nbsp;mm print-ready page (always white).
          </p>
        </div>
      </div>
    </section>
  )
}
