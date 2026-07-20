import type { ReactNode } from "react"
import { AdminThemeProvider } from "@/components/admin/admin-theme"
import { AdminToaster } from "@/components/admin/admin-toaster"

// Applies the stored admin theme before paint so dark mode never flashes.
// This lives here — not the root layout — so public pages stay light-only.
const themeInitScript = `try{if(localStorage.getItem("mdm-admin-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminThemeProvider>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {children}
      <AdminToaster />
    </AdminThemeProvider>
  )
}
