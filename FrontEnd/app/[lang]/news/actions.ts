"use server"

import { getNews } from "@/lib/cms"

export async function fetchNewsAction(params: {
  search?: string
  category?: string
  sort?: string
  page?: number
  featured?: boolean
  publishedDate?: string
}) {
  return await getNews({ ...params, limit: 9 })
}
