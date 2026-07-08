"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"

export type FilterOption = {
  label: string
  value: string
}

type FilterControlsProps = {
  moduleType: "products" | "services" | "news" | "careers"
  categories?: FilterOption[]
  locations?: FilterOption[]
  departments?: FilterOption[]
  employmentTypes?: FilterOption[]
  years?: FilterOption[]
}

const sortOptionsMap = {
  products: [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "A-Z", value: "alpha_asc" },
    { label: "Z-A", value: "alpha_desc" },
  ],
  services: [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "A-Z", value: "alpha_asc" },
    { label: "Z-A", value: "alpha_desc" },
  ],
  news: [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "A-Z", value: "alpha_asc" },
    { label: "Z-A", value: "alpha_desc" },
    { label: "Featured First", value: "featured" },
  ],
  careers: [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "A-Z", value: "alpha_asc" },
    { label: "Z-A", value: "alpha_desc" },
  ],
}

export function FilterControls({
  moduleType,
  categories = [],
  locations = [],
  departments = [],
  employmentTypes = [],
  years = [],
}: FilterControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local Search Input State with Debounce
  const currentSearch = searchParams.get("search") || ""
  const [searchState, setSearchState] = useState({ param: currentSearch, value: currentSearch })
  const searchInput = searchState.param === currentSearch ? searchState.value : currentSearch

  const updateQueryParam = useCallback((name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    // Reset page on filter/search change
    if (name !== "page") {
      params.delete("page")
    }
    const queryString = params.toString()
    const href = queryString ? `${pathname}?${queryString}` : pathname
    startTransition(() => {
      router.replace(href, { scroll: false })
    })
  }, [pathname, router, searchParams])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateQueryParam("search", searchInput)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchInput, currentSearch, updateQueryParam])

  const clearAllFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
    setSearchState({ param: "", value: "" })
  }

  const sortOptions = sortOptionsMap[moduleType]
  const currentSort = searchParams.get("sort") || "newest"
  const currentCategory = searchParams.get("category") || ""
  const currentFeatured = searchParams.get("featured") === "true"

  // Career Specific
  const currentLocation = searchParams.get("location") || ""
  const currentDepartment = searchParams.get("department") || ""
  const currentType = searchParams.get("type") || ""

  // News Specific
  const currentYear = searchParams.get("publishedDate") || ""

  // Compute active filters list for badge display
  const activeFilters: { label: string; name: string }[] = []
  if (currentCategory && categories.length > 0) {
    const label = categories.find((c) => c.value === currentCategory)?.label || currentCategory
    activeFilters.push({ label: `Category: ${label}`, name: "category" })
  }
  if (moduleType === "news" && currentFeatured) {
    activeFilters.push({ label: "Featured Only", name: "featured" })
  }
  if (currentLocation && locations.length > 0) {
    const label = locations.find((l) => l.value === currentLocation)?.label || currentLocation
    activeFilters.push({ label: `Location: ${label}`, name: "location" })
  }
  if (currentDepartment && departments.length > 0) {
    const label = departments.find((d) => d.value === currentDepartment)?.label || currentDepartment
    activeFilters.push({ label: `Department: ${label}`, name: "department" })
  }
  if (currentType && employmentTypes.length > 0) {
    const label = employmentTypes.find((t) => t.value === currentType)?.label || currentType
    activeFilters.push({ label: `Type: ${label}`, name: "type" })
  }
  if (currentYear && years.length > 0) {
    const label = years.find((y) => y.value === currentYear)?.label || currentYear
    activeFilters.push({ label: `Year: ${label}`, name: "publishedDate" })
  }

  const renderFilters = (isMobile = false) => {
    const selectSize = isMobile ? "default" : "sm"
    return (
      <div className={isMobile ? "flex flex-col gap-5 py-4" : "flex flex-wrap items-center gap-4"}>
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            {isMobile && <Label className="text-xs font-semibold text-muted-foreground">Category</Label>}
            <Select
              value={currentCategory}
              onValueChange={(val) => updateQueryParam("category", val === "ALL" ? null : val)}
            >
              <SelectTrigger size={selectSize} className="min-w-[160px] dark:bg-card">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Career Filters */}
        {moduleType === "careers" && (
          <>
            {locations.length > 0 && (
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                {isMobile && <Label className="text-xs font-semibold text-muted-foreground">Location</Label>}
                <Select
                  value={currentLocation}
                  onValueChange={(val) => updateQueryParam("location", val === "ALL" ? null : val)}
                >
                  <SelectTrigger size={selectSize} className="min-w-[150px] dark:bg-card">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Locations</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {departments.length > 0 && (
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                {isMobile && <Label className="text-xs font-semibold text-muted-foreground">Department</Label>}
                <Select
                  value={currentDepartment}
                  onValueChange={(val) => updateQueryParam("department", val === "ALL" ? null : val)}
                >
                  <SelectTrigger size={selectSize} className="min-w-[150px] dark:bg-card">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {employmentTypes.length > 0 && (
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                {isMobile && <Label className="text-xs font-semibold text-muted-foreground">Employment Type</Label>}
                <Select
                  value={currentType}
                  onValueChange={(val) => updateQueryParam("type", val === "ALL" ? null : val)}
                >
                  <SelectTrigger size={selectSize} className="min-w-[150px] dark:bg-card">
                    <SelectValue placeholder="Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {employmentTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {/* News Specific Filters */}
        {moduleType === "news" && years.length > 0 && (
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            {isMobile && <Label className="text-xs font-semibold text-muted-foreground">Year</Label>}
            <Select
              value={currentYear}
              onValueChange={(val) => updateQueryParam("publishedDate", val === "ALL" ? null : val)}
            >
              <SelectTrigger size={selectSize} className="min-w-[130px] dark:bg-card">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y.value} value={y.value}>
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Featured Filter (Checkbox) */}
        {moduleType === "news" && (
          <div className="flex items-center gap-2 py-2">
            <Checkbox
              id={isMobile ? "featured-mobile" : "featured-desktop"}
              checked={currentFeatured}
              onCheckedChange={(checked) => updateQueryParam("featured", checked === true ? "true" : null)}
            />
            <Label
              htmlFor={isMobile ? "featured-mobile" : "featured-desktop"}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Featured Only
            </Label>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur shadow-xs">
        {/* Keyword Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Search keywords..."
            value={searchInput}
            onChange={(e) => setSearchState({ param: currentSearch, value: e.target.value })}
            className="pl-10 pr-8 dark:bg-input/20 h-9"
          />
          {searchInput && (
            <button
              onClick={() => setSearchState({ param: currentSearch, value: "" })}
              className="absolute right-2.5 top-2.5 text-muted-foreground/60 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Desktop Filter Panel Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {renderFilters(false)}

          <div className="h-4 w-[1px] bg-border/80" />

          {/* Sort Control */}
          <Select
            value={currentSort}
            onValueChange={(val) => updateQueryParam("sort", val)}
          >
            <SelectTrigger size="sm" className="min-w-[140px] dark:bg-card">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort By" />
              </span>
            </SelectTrigger>
            <SelectContent align="end">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isPending && <Spinner className="size-4 text-primary" />}
        </div>

        {/* Mobile Filter Control Button */}
        <div className="flex items-center justify-between lg:hidden gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2 h-9">
                <SlidersHorizontal className="h-4 w-4" />
                Filters & Sorting
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl overflow-y-auto px-6 pb-8">
              <SheetHeader className="text-left border-b pb-3 mb-4">
                <SheetTitle className="font-display text-lg">Filter & Sort</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-6">
                {/* Sort Control Mobile */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Sort By</Label>
                  <Select
                    value={currentSort}
                    onValueChange={(val) => updateQueryParam("sort", val)}
                  >
                    <SelectTrigger className="w-full dark:bg-card">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {renderFilters(true)}
              </div>
            </SheetContent>
          </Sheet>

          {isPending && <Spinner className="size-4 text-primary shrink-0" />}
        </div>
      </div>

      {/* Active Badges Panel */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className="text-xs font-medium text-muted-foreground mr-1">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.name}
              variant="secondary"
              className="inline-flex items-center gap-1 bg-secondary/80 hover:bg-secondary border border-border/80 px-2.5 py-0.5 rounded-full"
            >
              <span className="text-xs text-foreground/80">{filter.label}</span>
              <button
                onClick={() => updateQueryParam(filter.name, null)}
                className="text-muted-foreground/80 hover:text-foreground rounded-full p-0.5"
                aria-label={`Remove filter ${filter.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary/80 h-auto p-1 font-medium ml-1.5"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
