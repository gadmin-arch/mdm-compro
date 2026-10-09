"use client"

import { createContext } from "react"
import type { ListingQuery } from "@/lib/listing-query"

// Provided by ListingView: the URL's current listing query — it changes the
// moment a filter is picked, ahead of the results — and whether the results
// for it are still loading.
export const ListingContext = createContext<{ query: ListingQuery; pending: boolean } | null>(null)
