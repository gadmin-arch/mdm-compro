"use client"

import { useSearchParams, usePathname } from "next/navigation"
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationProps = {
  page: number
  totalPages: number
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (pageNumber > 1) {
      params.set("page", pageNumber.toString())
    } else {
      params.delete("page")
    }
    return `${pathname}?${params.toString()}`
  }

  // Generate page numbers to display
  const pages: (number | string)[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (page > 3) {
      pages.push("ellipsis-1")
    }
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) {
      pages.push("ellipsis-2")
    }
    pages.push(totalPages)
  }

  return (
    <UIPagination className="mt-10">
      <PaginationContent>
        {page > 1 ? (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(page - 1)} />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationPrevious href="#" className="pointer-events-none opacity-40" />
          </PaginationItem>
        )}

        {pages.map((p, index) => {
          if (typeof p === "string") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={p}>
              <PaginationLink href={createPageUrl(p)} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {page < totalPages ? (
          <PaginationItem>
            <PaginationNext href={createPageUrl(page + 1)} />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationNext href="#" className="pointer-events-none opacity-40" />
          </PaginationItem>
        )}
      </PaginationContent>
    </UIPagination>
  )
}
