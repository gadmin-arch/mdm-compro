import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AnalyticsSettingsForm, type AnalyticsSettingsValue } from "@/components/admin/analytics-settings-form"
import { SecuritySettingsForm, type SecuritySettingsValue } from "@/components/admin/security-settings-form"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"
import { AdminApiError, adminFetch, type AdminSetting } from "@/lib/admin-api"
import { fallbackSiteSettings, type SiteSettings } from "@/lib/cms"
import { saveAnalyticsSettingsAction, saveSecuritySettingsAction, saveSiteSettingsAction } from "./actions"

const defaultAnalytics: AnalyticsSettingsValue = {
  enabled: true,
  ignoreAdmins: true,
  respectDnt: true,
  trackVitals: true,
  trackEvents: true,
  retentionDays: 90,
}

const defaultSecurity: SecuritySettingsValue = {
  twoFactorEnabled: true,
  otpLength: 6,
  otpExpiryMinutes: 5,
  trustDays: 30,
  resendCooldownSec: 60,
  maxOtpAttempts: 5,
  maxResends: 3,
  otpSubject: "",
  otpBody: "",
  newDeviceSubject: "",
  newDeviceBody: "",
}

export default async function AdminSiteSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const query = await searchParams

  let setting: AdminSetting | null = null
  let analyticsSetting: AdminSetting | null = null
  let securitySetting: AdminSetting | null = null
  let apiError = false
  try {
    ;[setting, analyticsSetting, securitySetting] = await Promise.all([
      adminFetch<AdminSetting>("/settings/site", {}, "/admin/site-settings"),
      adminFetch<AdminSetting>("/settings/analytics", {}, "/admin/site-settings"),
      adminFetch<AdminSetting>("/settings/security", {}, "/admin/site-settings"),
    ])
  } catch (error) {
    if (error instanceof AdminApiError) {
      apiError = true
    } else {
      throw error
    }
  }

  const stored = (setting?.value ?? {}) as Partial<SiteSettings>
  const initial: SiteSettings = {
    tagline: stored.tagline ?? fallbackSiteSettings.tagline,
    footerDescription: stored.footerDescription ?? fallbackSiteSettings.footerDescription,
    email: stored.email ?? fallbackSiteSettings.email,
    phone: stored.phone ?? fallbackSiteSettings.phone,
    fax: stored.fax ?? fallbackSiteSettings.fax,
    address: stored.address ?? fallbackSiteSettings.address,
    salesEmail: stored.salesEmail ?? fallbackSiteSettings.salesEmail,
    salesPhone: stored.salesPhone ?? fallbackSiteSettings.salesPhone,
    whatsappPhone: stored.whatsappPhone ?? stored.salesPhone ?? fallbackSiteSettings.whatsappPhone,
    hotlinePhone: stored.hotlinePhone ?? fallbackSiteSettings.hotlinePhone,
    socials: Array.isArray(stored.socials) ? stored.socials : fallbackSiteSettings.socials,
  }

  const storedAnalytics = (analyticsSetting?.value ?? {}) as Partial<AnalyticsSettingsValue>
  const analyticsInitial: AnalyticsSettingsValue = { ...defaultAnalytics, ...storedAnalytics }
  const storedSecurity = (securitySetting?.value ?? {}) as Partial<SecuritySettingsValue>
  const securityInitial: SecuritySettingsValue = { ...defaultSecurity, ...storedSecurity }

  return (
    <>
      <AdminPageHeader eyebrow="Site Configuration" title="Site Settings"
      />
      {query.saved && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          {query.saved === "analytics"
            ? "Analytics settings saved. The public site is updated."
            : query.saved === "security"
              ? "Security settings saved. They apply to the next sign-in."
              : "Site settings saved. The public site is updated."}
        </p>
      )}

      {apiError || !setting ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Site settings could not be loaded from the admin API.
        </p>
      ) : (
        <>
          <SiteSettingsForm
            action={saveSiteSettingsAction}
            initial={initial}
            version={setting.version}
          />
          <AnalyticsSettingsForm
            action={saveAnalyticsSettingsAction}
            initial={analyticsInitial}
            version={analyticsSetting?.version ?? 0}
          />
          <SecuritySettingsForm
            action={saveSecuritySettingsAction}
            initial={securityInitial}
            version={securitySetting?.version ?? 0}
          />
        </>
      )}
    </>
  )
}
