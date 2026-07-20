"use client"

import { useState, useTransition } from "react"
import { AlertTriangle, RefreshCw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SaveAction, SaveResult } from "@/lib/save-result"

// Submits admin forms programmatically (instead of via <form action>) so a
// failed save RETURNS here and the user's edits survive — React 19 resets
// uncontrolled form fields after a form action completes, which would throw
// away everything typed since the page loaded.
export function useSaveAction(action: SaveAction) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<SaveResult | null>(null)

  function submit(form: HTMLFormElement | null, overrides?: Record<string, string>) {
    if (!form || pending) return
    const formData = new FormData(form)
    for (const [key, value] of Object.entries(overrides ?? {})) {
      formData.set(key, value)
    }
    startTransition(async () => {
      // On success the action redirects and never returns.
      const response = await action(formData)
      setResult(response ?? null)
    })
  }

  return { pending, result, submit }
}

export function SaveErrorBanner({
  result,
  entity,
  onOverwrite,
}: {
  result: SaveResult | null
  // Lowercase noun used in the messages, e.g. "page", "service", "menu".
  entity: string
  // Resubmit with the server's current version; omit to hide the option.
  onOverwrite?: () => void
}) {
  if (!result) return null

  if (result.error === "conflict") {
    return (
      <div role="alert" className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
        <p className="flex items-start gap-2 font-medium text-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          This {entity} was changed by someone else while you were editing
          {result.serverVersion ? ` (the server is now at version ${result.serverVersion})` : ""}.
        </p>
        <p className="mt-1.5 pl-6 text-muted-foreground">
          Your edits are still here. You can overwrite their version with what you see now, or
          discard your edits and load theirs.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 pl-6">
          {onOverwrite && (
            <Button type="button" size="sm" onClick={onOverwrite}>
              <Save className="h-4 w-4" />
              Overwrite with my edits
            </Button>
          )}
          <Button type="button" size="sm" variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Discard my edits
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {errorMessage(result.error, entity)}
    </div>
  )
}

function errorMessage(code: SaveResult["error"], entity: string) {
  switch (code) {
    case "duplicate":
      return `A ${entity} with this slug already exists. Choose a different slug and save again.`
    case "validation":
      return "Please check the highlighted fields below."
    case "upload_failed":
      return "Upload failed. Use JPG, PNG, WebP, GIF, or PDF under 25MB."
    case "forbidden":
      return "Your account has read-only access — ask an owner or admin to make this change."
    default:
      return `The ${entity} could not be saved. Please try again.`
  }
}
