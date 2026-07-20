"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

type AdminTheme = "light" | "dark"

const STORAGE_KEY = "mdm-admin-theme"

const AdminThemeContext = createContext<{
  theme: AdminTheme
  setTheme: (theme: AdminTheme) => void
}>({ theme: "light", setTheme: () => {} })

// Admin-only theming. The dark class must live on <html> (not a wrapper div)
// because Radix dialogs and sonner toasts portal into document.body — a
// scoped wrapper would leave them light on a dark page. Public pages stay
// light: this provider only ships on /admin routes, admin→site links open a
// new tab, and the unmount cleanup removes the class as a final guard.
export function AdminThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in app/admin/layout.tsx applies the class pre-paint;
  // read the resulting DOM state after mount so hydration stays consistent.
  const [theme, setThemeState] = useState<AdminTheme>("light")

  useEffect(() => {
    // One-time post-hydration sync with the class the inline script applied;
    // runs before paint, so no cascading-render cost in practice.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light")
    return () => document.documentElement.classList.remove("dark")
  }, [])

  const setTheme = useCallback((next: AdminTheme) => {
    setThemeState(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private mode); the choice just won't persist.
    }
  }, [])

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme }}>{children}</AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}
