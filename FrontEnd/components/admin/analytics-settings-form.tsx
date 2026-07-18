"use client"

import { useRef } from "react"
import { BarChart3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import type { SaveAction } from "@/lib/save-result"

export type AnalyticsSettingsValue = {
  enabled: boolean
  ignoreAdmins: boolean
  respectDnt: boolean
  trackVitals: boolean
  trackEvents: boolean
  retentionDays: number
}

const TOGGLES: { name: keyof AnalyticsSettingsValue; label: string; hint: string }[] = [
  { name: "enabled", label: "Enable analytics", hint: "Master switch — off means no tracker script is served at all." },
  { name: "ignoreAdmins", label: "Ignore admin visits", hint: "Logged-in CMS users are excluded from every report." },
  { name: "respectDnt", label: "Respect Do Not Track", hint: "Browsers sending DNT or Global Privacy Control are never tracked." },
  { name: "trackVitals", label: "Collect Core Web Vitals", hint: "LCP, INP, CLS, FCP, TTFB, and page load time." },
  { name: "trackEvents", label: "Track events", hint: "CTA clicks, downloads, external links, form submits, QR visits." },
]

export function AnalyticsSettingsForm({
  action,
  initial,
  version,
}: {
  action: SaveAction
  initial: AnalyticsSettingsValue
  version: number
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const { pending, result: saveResult, submit } = useSaveAction(action)

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-6 rounded-lg border border-border bg-background p-5"
    >
      <input name="version" type="hidden" value={version} />

      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">Analytics</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        First-party, privacy-friendly measurement. Changes apply to the public site within a minute.
      </p>

      {saveResult && (
        <div className="mt-4">
          <SaveErrorBanner
            result={saveResult}
            entity="analytics settings"
            onOverwrite={
              saveResult.serverVersion
                ? () => submit(formRef.current, { version: String(saveResult.serverVersion) })
                : undefined
            }
          />
        </div>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {TOGGLES.map((toggle) => (
          <label
            key={toggle.name}
            className="flex items-start gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-sm"
          >
            <Switch name={toggle.name} defaultChecked={Boolean(initial[toggle.name])} className="mt-0.5" />
            <span>
              <span className="font-medium text-foreground">{toggle.label}</span>
              <span className="block text-xs text-muted-foreground">{toggle.hint}</span>
            </span>
          </label>
        ))}
        <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-sm">
          <span>
            <span className="font-medium text-foreground">Raw event retention (days)</span>
            <span className="block text-xs text-muted-foreground">
              Aggregated reports are kept forever; raw events are pruned after this window.
            </span>
          </span>
          <Input
            className="w-24"
            type="number"
            name="retentionDays"
            min={7}
            max={730}
            defaultValue={initial.retentionDays}
          />
        </label>
      </div>

      <Button className="mt-4" disabled={pending} type="submit">
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : "Save Analytics Settings"}
      </Button>
    </form>
  )
}
