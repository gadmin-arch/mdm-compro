"use client"

import { LogOut } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminSignOutDialogProps = {
  className?: string
  compact?: boolean
}

export function AdminSignOutDialog({ className, compact = false }: AdminSignOutDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={cn(compact ? "px-3" : "w-full", className)}>
          <LogOut className="h-4 w-4" />
          <span>{compact ? "Sign Out" : "Sign Out"}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of CMS?</AlertDialogTitle>
          <AlertDialogDescription>
            Your admin session will be closed and you will need to sign in again before editing content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action="/api/admin/logout" method="post">
            <AlertDialogAction asChild>
              <button type="submit" className="w-full sm:w-auto">
                Sign Out
              </button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
