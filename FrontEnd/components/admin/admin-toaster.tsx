"use client"

import { useAdminTheme } from "@/components/admin/admin-theme"
import { Toaster } from "@/components/ui/sonner"

export function AdminToaster() {
  const { theme } = useAdminTheme()
  return <Toaster theme={theme} richColors closeButton />
}
