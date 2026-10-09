import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AdminThemeProvider } from "@/components/admin/admin-theme"
import { AdminToaster } from "@/components/admin/admin-toaster"
import { ContentLanguageProvider } from "@/components/cms/content-language"
import { fontVariables } from "@/lib/fonts"
import { siteIcons } from "@/lib/seo-metadata"
import "../globals.css"

// The admin is its own root layout: the public site's root lives under
// app/[lang] so it can set <html lang> per language.
export const metadata: Metadata = {
  title: { default: "MDM Admin", template: "%s | MDM Admin" },
  robots: { index: false, follow: false },
  icons: siteIcons,
}

// Applies the stored admin theme before paint so dark mode never flashes.
// This lives here — not the public layout — so public pages stay light-only.
const themeInitScript = `try{if(localStorage.getItem("mdm-admin-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the theme script may add the `dark` class to
    // <html> before hydration; attribute-level only, scoped to this element.
    <html lang="id" className={`${fontVariables} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AdminThemeProvider>
          <ContentLanguageProvider mode="admin">
            {children}
            <AdminToaster />
          </ContentLanguageProvider>
        </AdminThemeProvider>
      </body>
    </html>
  )
}
