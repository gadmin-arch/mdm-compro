"use client"

import { useRef } from "react"
import { Save, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import type { SaveAction } from "@/lib/save-result"

export type SecuritySettingsValue = {
  twoFactorEnabled: boolean
  otpLength: number
  otpExpiryMinutes: number
  trustDays: number
  resendCooldownSec: number
  maxOtpAttempts: number
  maxResends: number
  otpSubject: string
  otpBody: string
  newDeviceSubject: string
  newDeviceBody: string
}

const NUMBERS: { name: keyof SecuritySettingsValue; label: string; min: number; max: number; hint: string }[] = [
  { name: "otpLength", label: "Code length (digits)", min: 4, max: 8, hint: "4–8" },
  { name: "otpExpiryMinutes", label: "Code expiry (minutes)", min: 1, max: 15, hint: "1–15" },
  { name: "trustDays", label: "Trust duration (days)", min: 1, max: 90, hint: "1–90" },
  { name: "resendCooldownSec", label: "Resend cooldown (seconds)", min: 15, max: 600, hint: "15–600" },
  { name: "maxOtpAttempts", label: "Max wrong codes", min: 3, max: 10, hint: "3–10" },
  { name: "maxResends", label: "Max resends per sign-in", min: 1, max: 10, hint: "1–10" },
]

export function SecuritySettingsForm({
  action,
  initial,
  version,
}: {
  action: SaveAction
  initial: SecuritySettingsValue
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
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">Login Security</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Two-step verification by email code, with trusted devices. Changes apply to the next sign-in.
      </p>

      {saveResult && (
        <div className="mt-4">
          <SaveErrorBanner
            result={saveResult}
            entity="security settings"
            onOverwrite={
              saveResult.serverVersion
                ? () => submit(formRef.current, { version: String(saveResult.serverVersion) })
                : undefined
            }
          />
        </div>
      )}

      <label className="mt-4 flex items-start gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-sm">
        <Switch name="twoFactorEnabled" defaultChecked={initial.twoFactorEnabled} className="mt-0.5" />
        <span>
          <span className="font-medium text-foreground">Require email verification codes (2FA)</span>
          <span className="block text-xs text-muted-foreground">
            Off = password only. Attempt limits and lockouts stay active either way.
          </span>
        </span>
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NUMBERS.map((field) => (
          <label key={field.name} className="grid gap-1.5 text-sm">
            <span className="font-medium text-foreground">{field.label}</span>
            <Input
              type="number"
              name={field.name}
              min={field.min}
              max={field.max}
              defaultValue={Number(initial[field.name])}
            />
            <span className="text-xs text-muted-foreground">Allowed: {field.hint}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-foreground">Email templates</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Leave empty to use the built-in wording. Placeholders:{" "}
          <code className="rounded bg-secondary px-1">{"{{name}}"}</code>{" "}
          <code className="rounded bg-secondary px-1">{"{{code}}"}</code>{" "}
          <code className="rounded bg-secondary px-1">{"{{minutes}}"}</code>{" "}
          <code className="rounded bg-secondary px-1">{"{{device}}"}</code>{" "}
          <code className="rounded bg-secondary px-1">{"{{ip}}"}</code>{" "}
          <code className="rounded bg-secondary px-1">{"{{time}}"}</code>{" "}
          <code className="rounded bg-secondary px-1">{"{{site}}"}</code>
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">Verification code — subject</span>
              <Input name="otpSubject" defaultValue={initial.otpSubject} placeholder="Your {{site}} sign-in code" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">Verification code — body</span>
              <Textarea name="otpBody" rows={5} defaultValue={initial.otpBody} placeholder="Hello {{name}}, your code is {{code}} (expires in {{minutes}} minutes)." />
            </label>
          </div>
          <div className="space-y-2">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">New device alert — subject</span>
              <Input name="newDeviceSubject" defaultValue={initial.newDeviceSubject} placeholder="New sign-in to {{site}}" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">New device alert — body</span>
              <Textarea name="newDeviceBody" rows={5} defaultValue={initial.newDeviceBody} placeholder="Hello {{name}}, your account was signed in from {{device}} ({{ip}}) at {{time}}." />
            </label>
          </div>
        </div>
      </div>

      <Button className="mt-4" disabled={pending} type="submit">
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : "Save Security Settings"}
      </Button>
    </form>
  )
}
