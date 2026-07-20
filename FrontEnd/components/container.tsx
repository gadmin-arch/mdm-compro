import type { ReactNode } from "react"
import { container } from "@/lib/layout"

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={container(className)}>{children}</div>
}
