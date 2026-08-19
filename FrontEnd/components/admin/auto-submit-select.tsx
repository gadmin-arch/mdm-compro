"use client"

import type { ChangeEvent } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type AutoSubmitSelectProps = {
  className?: string
  defaultValue: string
  id: string
  name: string
  options: Array<{ value: string; label: string }>
}

export function AutoSubmitSelect({ className, defaultValue, id, name, options }: AutoSubmitSelectProps) {
  function submitForm(event: ChangeEvent<HTMLSelectElement>) {
    event.currentTarget.form?.requestSubmit()
  }

  return (
    <div className="relative flex items-center">
      <select
        className={cn(
          "h-9 w-full appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 px-3 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer",
          className,
        )}
        defaultValue={defaultValue}
        id={id}
        name={name}
        onChange={submitForm}
      >
        {options.map((option) => (
          <option
            key={option.value || "all"}
            value={option.value}
            className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  )
}
