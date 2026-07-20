"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

// One-shot flash params set by server-action redirects (?saved=1&created=1...).
const FLASH_PARAMS = ["saved", "created", "deleted", "error"] as const

// Reads flash query params, shows a toast, then strips ONLY the flash params
// from the URL — filters like q/status/page must survive.
export function FlashToast({ resource }: { resource: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const saved = searchParams.get("saved")
  const created = searchParams.get("created")
  const deleted = searchParams.get("deleted")
  const error = searchParams.get("error")

  useEffect(() => {
    if (!saved && !created && !deleted && !error) return

    if (created) toast.success(`The ${resource} was created.`)
    else if (saved) toast.success(`The ${resource} was saved.`)
    else if (deleted) toast.success(`The ${resource} was archived. You can restore it from Archive.`)
    if (error) toast.error(flashErrorMessage(error, resource))

    const next = new URLSearchParams(searchParams)
    for (const param of FLASH_PARAMS) {
      next.delete(param)
    }
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [saved, created, deleted, error, pathname, resource, router, searchParams])

  return null
}

function flashErrorMessage(code: string, resource: string) {
  switch (code) {
    case "conflict":
      return `The ${resource} changed while you were working. Reload and try again.`
    case "validation":
      return "Please check the required fields."
    case "missing_id":
      return "The request was incomplete. Reload the page and try again."
    case "forbidden":
      return "Your account has read-only access."
    default:
      return `The ${resource} could not be updated. Please try again.`
  }
}
