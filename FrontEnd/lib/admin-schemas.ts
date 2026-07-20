import { z } from "zod"

// Zod schemas for admin server actions. They validate the NORMALIZED values
// (after slugify/trim) so they mirror what the backend validator will see —
// failures return per-field messages rendered inline by the forms.

const statusEnum = z.enum(["draft", "published", "scheduled", "archived"], {
  message: "Choose a valid status.",
})

const slug = z
  .string()
  .min(1, "Slug is required.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")

export const contentItemSchema = z.object({
  title: z.string().trim().min(1, "Name is required."),
  slug,
  status: statusEnum,
  sortOrder: z.coerce.number({ message: "Sort order must be a number." }),
})

export const newsSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug,
  status: statusEnum,
})

export const careerSchema = z.object({
  title: z.string().trim().min(1, "Role title is required."),
  slug,
  department: z.string().trim().min(1, "Department is required."),
  location: z.string().trim().min(1, "Location is required."),
  employmentType: z.enum(["full_time", "contract", "internship", "part_time"], {
    message: "Choose a valid employment type.",
  }),
  applyUrl: z
    .string()
    .trim()
    .url("Enter a valid URL (https://...).")
    .or(z.literal("")),
  status: statusEnum,
})

// First message per field, keyed by input name so forms can render inline.
export function zodFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form"
    if (!fields[key]) {
      fields[key] = issue.message
    }
  }
  return fields
}

// Thrown by payload builders on schema failure; actions convert it into a
// SaveResult with inline field messages.
export class FieldValidationError extends Error {
  constructor(readonly fields: Record<string, string>) {
    super("Validation failed")
  }
}
