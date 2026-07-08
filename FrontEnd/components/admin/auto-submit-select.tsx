"use client"

import type { ChangeEvent } from "react"

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
    <select
      className={className}
      defaultValue={defaultValue}
      id={id}
      name={name}
      onChange={submitForm}
    >
      {options.map((option) => (
        <option key={option.value || "all"} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
