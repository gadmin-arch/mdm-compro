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
  iconOnly?: boolean
}

export function AdminSignOutDialog({ className, compact = false, iconOnly = false }: AdminSignOutDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? "icon" : "default"}
          className={cn(
            iconOnly
              ? "h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              : compact
                ? "px-3"
                : "w-full justify-start gap-2",
            className,
          )}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          {!iconOnly && <span>Sign Out</span>}
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
