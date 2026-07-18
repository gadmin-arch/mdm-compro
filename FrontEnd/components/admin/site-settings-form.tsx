"use client"

import { useMemo, useRef, useState } from "react"
import { Globe2, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import type { SiteSettings } from "@/lib/cms"
import type { SaveAction } from "@/lib/save-result"

type SocialRow = { id: string; label: string; url: string }

function makeRowId() {
  return `social-${Math.random().toString(36).slice(2, 10)}`
}

export function SiteSettingsForm({
  action,
  initial,
  version,
}: {
  action: SaveAction
  initial: SiteSettings
  version: number
}) {
  const [socials, setSocials] = useState<SocialRow[]>(() =>
    initial.socials.map((social) => ({ id: makeRowId(), ...social })),
  )
  const formRef = useRef<HTMLFormElement>(null)
  const { pending, result: saveResult, submit } = useSaveAction(action)

  const socialsJson = useMemo(
    () => JSON.stringify(socials.map(({ label, url }) => ({ label, url }))),
    [socials],
  )

  function updateSocial(id: string, patch: Partial<SocialRow>) {
    setSocials((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <input name="version" type="hidden" value={version} />
      <input name="socials" type="hidden" value={socialsJson} />

      {saveResult && (
        <div className="xl:col-span-2">
          <SaveErrorBanner
            result={saveResult}
            entity="site settings"
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
          <h2 className="font-display text-lg font-semibold text-foreground">Brand</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="tagline">
                Tagline
              </label>
              <Input
                className="mt-2"
                id="tagline"
                name="tagline"
                defaultValue={initial.tagline}
                placeholder="Electrical · Automation · Fire System"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">Shown in the footer bottom bar.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="footerDescription">
                Footer description
              </label>
              <Textarea
                className="mt-2"
                id="footerDescription"
                name="footerDescription"
                rows={3}
                defaultValue={initial.footerDescription}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Contact Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <Input className="mt-2" id="email" name="email" type="email" defaultValue={initial.email} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="phone">
                Phone
              </label>
              <Input className="mt-2" id="phone" name="phone" defaultValue={initial.phone} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="fax">
                Fax
              </label>
              <Input className="mt-2" id="fax" name="fax" defaultValue={initial.fax} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="address">
                Address
              </label>
              <Textarea className="mt-2" id="address" name="address" rows={2} defaultValue={initial.address} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Social Links</h2>
              <p className="mt-1 text-sm text-muted-foreground">Shown in the footer under the company details.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSocials((current) => [...current, { id: makeRowId(), label: "", url: "" }])}
            >
              <Plus className="h-4 w-4" />
              Add link
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {socials.length === 0 && (
              <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
                No social links yet.
              </p>
            )}
            {socials.map((social) => (
              <div key={social.id} className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)_auto]">
                <Input
                  aria-label="Social link label"
                  placeholder="LinkedIn"
                  value={social.label}
                  onChange={(event) => updateSocial(social.id, { label: event.target.value })}
                />
                <Input
                  aria-label="Social link URL"
                  placeholder="https://www.linkedin.com/company/..."
                  value={social.url}
                  onChange={(event) => updateSocial(social.id, { url: event.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  aria-label="Remove social link"
                  onClick={() => setSocials((current) => current.filter((row) => row.id !== social.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-lg border border-border bg-background p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Globe2 className="h-4 w-4 text-primary" />
            Publish
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Saving updates the footer and shared site details immediately.
          </p>
          <div className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm text-muted-foreground">
            <p>Version: {version}</p>
          </div>
          <Button className="mt-4 w-full" disabled={pending} type="submit">
            <Save className="h-4 w-4" />
            {pending ? "Saving..." : "Save Settings"}
          </Button>
        </section>
      </aside>
    </form>
  )
}
