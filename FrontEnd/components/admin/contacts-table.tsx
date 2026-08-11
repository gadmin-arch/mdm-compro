"use client"

import { useMemo, useState, useTransition } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Building2, Check, Inbox, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { AdminCard, AdminDataView } from "@/components/admin/data-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AdminContactInquiry } from "@/lib/admin-api"
import { contactStatusLabels, contactStatuses } from "@/lib/contacts"
import { updateContactStatusAction } from "@/app/admin/(workspace)/contacts/actions"

function statusVariant(status: string) {
  if (status === "new") return "default" as const
  if (status === "resolved") return "secondary" as const
  return "outline" as const
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

// Buttons for every status the inquiry is not already in. Defined at module
// scope so it stays the same component type across renders.
function StatusActions({
  contact,
  pending,
  onSelect,
  full,
}: {
  contact: AdminContactInquiry
  pending: boolean
  onSelect: (contact: AdminContactInquiry, status: string) => void
  full?: boolean
}) {
  return (
    <div className={full ? "flex flex-wrap gap-2" : "flex justify-end gap-1"}>
      {contactStatuses
        .filter((status) => status !== contact.status)
        .map((status) => (
          <Button
            key={status}
            size="sm"
            variant={status === "resolved" ? "default" : "outline"}
            disabled={pending}
            className={full ? "min-h-11 flex-1" : undefined}
            onClick={() => onSelect(contact, status)}
          >
            {contactStatusLabels[status]}
          </Button>
        ))}
    </div>
  )
}

export function ContactsTable({ contacts }: { contacts: AdminContactInquiry[] }) {
  const [open, setOpen] = useState<AdminContactInquiry | null>(null)
  const [pending, startUpdate] = useTransition()

  function setStatus(contact: AdminContactInquiry, status: string) {
    const formData = new FormData()
    formData.set("id", contact.id)
    formData.set("status", status)
    formData.set("version", String(contact.version))
    startUpdate(async () => {
      const result = await updateContactStatusAction(formData)
      if (result?.error === "conflict") {
        toast.error("This inquiry changed elsewhere. Reload and try again.")
      } else if (result?.error === "forbidden") {
        toast.error("Your account has read-only access.")
      } else if (result?.error) {
        toast.error("The status could not be updated.")
      } else {
        toast.success(`Marked as ${contactStatusLabels[status] ?? status}.`)
        setOpen(null)
      }
    })
  }

  const columns = useMemo<ColumnDef<AdminContactInquiry>[]>(
    () => [
      {
        id: "from",
        size: 220,
        accessorFn: (row) => row.name,
        header: ({ column }) => <DataTableColumnHeader column={column} title="From" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium">{row.original.name}</p>
            <p className="break-all text-sm text-muted-foreground">{row.original.email}</p>
            {row.original.company && (
              <p className="text-xs text-muted-foreground">{row.original.company}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "subject",
        size: 260,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
        cell: ({ row }) => (
          <button
            type="button"
            className="text-left hover:underline"
            onClick={() => setOpen(row.original)}
          >
            <span className="font-medium">{row.original.subject}</span>
            <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
              {row.original.message}
            </span>
          </button>
        ),
      },
      {
        accessorKey: "status",
        size: 130,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>
            {contactStatusLabels[row.original.status] ?? row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        size: 150,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Received" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>
        ),
      },
      {
        id: "actions",
        size: 340,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <StatusActions contact={row.original} pending={pending} onSelect={setStatus} />
        ),
      },
    ],
    // Columns only need to re-render while an update is in flight.
    [pending],
  )

  return (
    <>
      <AdminDataView
        columns={columns}
        data={contacts}
        empty={{
          title: "No inquiries yet.",
          description: "Messages sent through the public contact form land here.",
          icon: <Inbox className="h-5 w-5" aria-hidden="true" />,
        }}
        renderCard={(contact) => (
          <AdminCard
            key={contact.id}
            title={contact.subject}
            subtitle={`${contact.name} · ${contact.email}`}
            badges={
              <>
                <Badge variant={statusVariant(contact.status)}>
                  {contactStatusLabels[contact.status] ?? contact.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(contact.createdAt)}
                </span>
              </>
            }
            meta={
              <button type="button" className="line-clamp-2 text-left" onClick={() => setOpen(contact)}>
                {contact.message}
              </button>
            }
            actions={<StatusActions contact={contact} pending={pending} onSelect={setStatus} full />}
          />
        )}
      />

      <Dialog open={open !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{open?.subject}</DialogTitle>
            <DialogDescription>
              {open ? `${open.name} · ${formatDateTime(open.createdAt)}` : ""}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <div className="space-y-4">
              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <a className="break-all hover:underline" href={`mailto:${open.email}`}>
                    {open.email}
                  </a>
                </p>
                {open.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <a className="hover:underline" href={`tel:${open.phone}`}>
                      {open.phone}
                    </a>
                  </p>
                )}
                {open.company && (
                  <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {open.company}
                  </p>
                )}
              </div>

              <p className="whitespace-pre-wrap rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                {open.message}
              </p>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Current status:{" "}
                  <Badge variant={statusVariant(open.status)}>
                    {contactStatusLabels[open.status] ?? open.status}
                  </Badge>
                </p>
                <StatusActions contact={open} pending={pending} onSelect={setStatus} full />
                <Button asChild variant="secondary" className="mt-1 min-h-11">
                  <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Reply by email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
