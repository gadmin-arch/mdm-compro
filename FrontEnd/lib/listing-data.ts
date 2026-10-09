import type { FilterOption } from "@/components/filter-controls"
import {
  employmentTypeLabel,
  getCareers,
  getNews,
  getProducts,
  getServices,
  type Career,
  type ContentNode,
  type ListResponse,
  type NewsItem,
} from "@/lib/cms"
import type { Listing, ListingQuery } from "@/lib/listing-query"

// What a listing page shows for a query: its filter options and one page of
// results. Loaded on the server for the page itself, and by
// app/api/listing/[listing]/route.ts when the query changes in the browser —
// so the items keep only what the listing components read (no bodies, no SEO).

export type ContentCard = Pick<ContentNode, "id" | "slug" | "fullPath" | "title" | "summary" | "imageUrl">
export type PageInfo = { page: number; totalPages: number }

export type ContentListingData = { categories: FilterOption[]; items: ContentCard[]; pagination: PageInfo }
export type NewsListingData = { categories: FilterOption[]; years: FilterOption[]; news: ListResponse<NewsItem> }
export type CareerListingData = {
  departments: FilterOption[]
  locations: FilterOption[]
  employmentTypes: FilterOption[]
  jobs: Career[]
  pagination: PageInfo
}
export type ListingData = ContentListingData | NewsListingData | CareerListingData

function pageOf(query: ListingQuery) {
  return parseInt(query.page || "1", 10)
}

function contentCard({ id, slug, fullPath, title, summary, imageUrl }: ContentNode): ContentCard {
  return { id, slug, fullPath, title, summary, imageUrl }
}

function pageInfo({ pagination }: ListResponse<unknown>): PageInfo {
  return { page: pagination.page, totalPages: pagination.totalPages }
}

export async function loadProductsListing(query: ListingQuery): Promise<ContentListingData> {
  const tree = await getProducts()
  const response = await getProducts({
    search: query.search || "",
    category: query.category || "",
    sort: query.sort || "",
    page: pageOf(query),
    limit: 9,
  })
  return {
    categories: tree.map((item) => ({ label: item.title, value: item.slug })),
    items: response.data.map(contentCard),
    pagination: pageInfo(response),
  }
}

export async function loadServicesListing(query: ListingQuery): Promise<ContentListingData> {
  // Category chips come from the service tree roots.
  const tree = await getServices()
  const response = await getServices({
    search: query.search || "",
    category: query.category || "",
    sort: query.sort || "",
    page: pageOf(query),
    limit: 9,
  })
  return {
    categories: tree.map((item) => ({ label: item.title, value: item.slug })),
    items: response.data.map(contentCard),
    pagination: pageInfo(response),
  }
}

export async function loadNewsListing(query: ListingQuery): Promise<NewsListingData> {
  const allNews = await getNews({ page: 1, limit: 100 })
  const categories = Array.from(
    new Map(
      allNews.data
        .filter((item) => item.category?.trim())
        .map((item) => {
          const label = item.category!.trim()
          const value = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
          return [value, { label, value }]
        }),
    ).values(),
  )
  const years = Array.from(
    new Set(allNews.data.map((item) => item.publishedAt?.slice(0, 4)).filter((year): year is string => Boolean(year))),
  )
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({ label: year, value: year }))

  const news = await getNews({
    search: query.search || "",
    category: query.category || "",
    sort: query.sort || "",
    page: pageOf(query),
    limit: 9,
    featured: query.featured === "true" ? true : undefined,
    publishedDate: query.publishedDate || "",
  })
  return {
    categories,
    years,
    news: {
      ...news,
      data: news.data.map(({ id, slug, title, excerpt, category, tags, featuredImageUrl, featured, status, publishedAt }) => ({
        id, slug, title, excerpt, category, tags, featuredImageUrl, featured, status, publishedAt,
      })),
    },
  }
}

export async function loadCareerListing(query: ListingQuery): Promise<CareerListingData> {
  // Every opening, for the filter dropdowns.
  const allCareers = await getCareers({ limit: 100 })
  const distinct = (values: string[]) => Array.from(new Set(values)).filter(Boolean)

  const response = await getCareers({
    search: query.search || "",
    location: query.location || "",
    department: query.department || "",
    type: query.type || "",
    sort: query.sort || "",
    page: pageOf(query),
    limit: 10,
  })
  return {
    departments: distinct(allCareers.data.map((job) => job.department)).map((value) => ({ label: value, value })),
    locations: distinct(allCareers.data.map((job) => job.location)).map((value) => ({ label: value, value })),
    employmentTypes: distinct(allCareers.data.map((job) => job.employmentType)).map((value) => ({
      label: employmentTypeLabel(value),
      value,
    })),
    jobs: response.data.map(
      ({ id, slug, title, summary, department, location, employmentType, applyUrl, deadline, status, publishedAt }) => ({
        id, slug, title, summary, department, location, employmentType, applyUrl, deadline, status, publishedAt,
      }),
    ),
    pagination: pageInfo(response),
  }
}

export function loadListing(listing: Listing, query: ListingQuery): Promise<ListingData> {
  switch (listing) {
    case "products":
      return loadProductsListing(query)
    case "services":
      return loadServicesListing(query)
    case "news":
      return loadNewsListing(query)
    case "career":
      return loadCareerListing(query)
  }
}
