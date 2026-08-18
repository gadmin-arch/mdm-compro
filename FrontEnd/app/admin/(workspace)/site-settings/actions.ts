"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { AdminApiError, adminFetch, type AdminSetting } from "@/lib/admin-api"
import type { SaveResult } from "@/lib/save-result"

export async function saveSiteSettingsAction(formData: FormData): Promise<SaveResult | void> {
  const version = Number(formData.get("version") ?? 0)

  let socials: { label: string; url: string }[] = []
  try {
    const parsed = JSON.parse(String(formData.get("socials") ?? "[]")) as unknown
    if (Array.isArray(parsed)) {
      socials = parsed
        .filter(
          (item): item is { label: string; url: string } =>
            Boolean(item) && typeof item === "object" &&
            typeof (item as { label?: unknown }).label === "string" &&
            typeof (item as { url?: unknown }).url === "string",
        )
        .map((item) => ({ label: item.label.trim(), url: item.url.trim() }))
        .filter((item) => item.label && item.url)
    }
  } catch {
    return { error: "validation" }
  }

  const salesPhone = String(formData.get("salesPhone") ?? "").trim()
  const salesEmail = String(formData.get("salesEmail") ?? "").trim()

  const value = {
    tagline: String(formData.get("tagline") ?? "").trim(),
    footerDescription: String(formData.get("footerDescription") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    fax: String(formData.get("fax") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    salesPhone,
    whatsappPhone: salesPhone,
    hotlinePhone: salesPhone,
    salesEmail,
    socials,
  }

  const result = await adminFetch(
    "/settings/site",
    {
      method: "PUT",
      body: JSON.stringify({ value, version }),
    },
    "/admin/site-settings",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    if (result.error.code === "version_conflict") {
      const current = await adminFetch<AdminSetting>("/settings/site", {}, "/admin/site-settings")
        .catch(() => null)
      return { error: "conflict", serverVersion: current?.version }
    }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  // The footer renders on every public page, so purge everything.
  updateTag("cms")
  revalidatePath("/", "layout")
  revalidatePath("/admin/site-settings")
  redirect("/admin/site-settings?saved=1")
}

export async function saveAnalyticsSettingsAction(formData: FormData): Promise<SaveResult | void> {
  const version = Number(formData.get("version") ?? 0)
  const retention = Math.min(730, Math.max(7, Number(formData.get("retentionDays")) || 90))
  const value = {
    enabled: formData.get("enabled") === "on",
    ignoreAdmins: formData.get("ignoreAdmins") === "on",
    respectDnt: formData.get("respectDnt") === "on",
    trackVitals: formData.get("trackVitals") === "on",
    trackEvents: formData.get("trackEvents") === "on",
    retentionDays: retention,
  }

  const result = await adminFetch(
    "/settings/analytics",
    {
      method: "PUT",
      body: JSON.stringify({ value, version }),
    },
    "/admin/site-settings",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    if (result.error.code === "version_conflict") {
      const current = await adminFetch<AdminSetting>("/settings/analytics", {}, "/admin/site-settings")
        .catch(() => null)
      return { error: "conflict", serverVersion: current?.version }
    }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  // The tracker mounts from the public layout, which reads this flag.
  updateTag("cms")
  revalidatePath("/", "layout")
  revalidatePath("/admin/site-settings")
  redirect("/admin/site-settings?saved=analytics")
}

export async function saveSecuritySettingsAction(formData: FormData): Promise<SaveResult | void> {
  const version = Number(formData.get("version") ?? 0)
  const clamp = (name: string, min: number, max: number, fallback: number) => {
    const value = Number(formData.get(name))
    if (!Number.isFinite(value) || value === 0) return fallback
    return Math.min(max, Math.max(min, Math.round(value)))
  }
  const value = {
    twoFactorEnabled: formData.get("twoFactorEnabled") === "on",
    otpLength: clamp("otpLength", 4, 8, 6),
    otpExpiryMinutes: clamp("otpExpiryMinutes", 1, 15, 5),
    trustDays: clamp("trustDays", 1, 90, 30),
    resendCooldownSec: clamp("resendCooldownSec", 15, 600, 60),
    maxOtpAttempts: clamp("maxOtpAttempts", 3, 10, 5),
    maxResends: clamp("maxResends", 1, 10, 3),
    otpSubject: String(formData.get("otpSubject") ?? "").trim(),
    otpBody: String(formData.get("otpBody") ?? "").trim(),
    newDeviceSubject: String(formData.get("newDeviceSubject") ?? "").trim(),
    newDeviceBody: String(formData.get("newDeviceBody") ?? "").trim(),
  }

  const result = await adminFetch(
    "/settings/security",
    {
      method: "PUT",
      body: JSON.stringify({ value, version }),
    },
    "/admin/site-settings",
  )
    .then(() => ({ ok: true as const }))
    .catch((error) => {
      if (error instanceof AdminApiError) {
        return { ok: false as const, error }
      }
      throw error
    })

  if (!result.ok) {
    if (result.error.code === "version_conflict") {
      const current = await adminFetch<AdminSetting>("/settings/security", {}, "/admin/site-settings")
        .catch(() => null)
      return { error: "conflict", serverVersion: current?.version }
    }
    if (result.error.code === "validation_error") return { error: "validation" }
    return { error: "save_failed" }
  }

  revalidatePath("/admin/site-settings")
  redirect("/admin/site-settings?saved=security")
}
