"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  AdminApiError,
  adminFetch,
  adminUpload,
  type CareerPayload,
  type ContentItemPayload,
  type NewsPayload,
} from "@/lib/admin-api"
import type { Career, ContentNode, NewsItem } from "@/lib/cms"
import type { SaveResult } from "@/lib/save-result"
import { blocksFromHtml, blocksFromText, slugify, specsFromText, toIsoDateTime } from "@/lib/admin-content"
import {
  careerSchema,
  contentItemSchema,
  FieldValidationError,
  newsSchema,
  zodFields,
} from "@/lib/admin-schemas"
import { combineBilingualText } from "@/lib/bilingual"

type Resource = "services" | "products" | "news" | "careers"

const resourceConfig: Record<Resource, { adminPath: string; publicPath: string }> = {
  services: { adminPath: "/admin/services", publicPath: "/services" },
  products: { adminPath: "/admin/products", publicPath: "/products" },
  news: { adminPath: "/admin/news", publicPath: "/news" },
  careers: { adminPath: "/admin/careers", publicPath: "/career" },
}

export async function createContentItemAction(formData: FormData): Promise<SaveResult | void> {
  const resource = resourceFromForm(formData)
  const path = resourceConfig[resource].adminPath
  let payload: ContentItemPayload
  try {
    payload = await contentPayload(formData, `${path}/new`)
  } catch (error) {
    return payloadError(error)
  }

  const result = await adminFetch<ContentNode>(
    `/${resource}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    `${path}/new`,
  )
    .then((item) => ({ ok: true as const, item }))
    .catch(toActionError)

  if (!result.ok) return createError(result.error)
  revalidateResource(resource, result.item.fullPath || result.item.slug)
  redirect(`${path}/${result.item.id}?created=1`)
}

export async function updateContentItemAction(formData: FormData): Promise<SaveResult | void> {
  const resource = resourceFromForm(formData)
  const path = resourceConfig[resource].adminPath
  const id = String(formData.get("id") ?? "")
  const oldPath = String(formData.get("oldPath") ?? "")
  const version = Number(formData.get("version") ?? 0)
  if (!id) return { error: "save_failed" }

  let payload: ContentItemPayload
  try {
    payload = {
      ...(await contentPayload(formData, `${path}/${id}`)),
      version,
    }
  } catch (error) {
    return payloadError(error)
  }

  const result = await adminFetch<ContentNode>(
    `/${resource}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    `${path}/${id}`,
  )
    .then((item) => ({ ok: true as const, item }))
    .catch(toActionError)

  if (!result.ok) {
    return updateError(result.error, version, () =>
      adminFetch<ContentNode>(`/${resource}/${id}`, {}, `${path}/${id}`),
    )
  }
  revalidateResource(resource, oldPath, result.item.fullPath || result.item.slug)
  redirect(`${path}/${id}?saved=1`)
}

export async function deleteContentItemAction(formData: FormData) {
  const resource = resourceFromForm(formData)
  const path = resourceConfig[resource].adminPath
  const id = String(formData.get("id") ?? "")
  const version = Number(formData.get("version") ?? 0)
  const oldPath = String(formData.get("oldPath") ?? "")
  if (!id || version < 1) redirect(`${path}?error=missing_id`)

  const result = await adminFetch<null>(
    `/${resource}/${id}?version=${version}`,
    { method: "DELETE" },
    path,
  )
    .then(() => ({ ok: true as const }))
    .catch(toActionError)

  if (!result.ok) redirect(`${path}?error=${errorCode(result.error)}`)
  revalidateResource(resource, oldPath)
  redirect(`${path}?deleted=1`)
}

export async function createNewsAction(formData: FormData): Promise<SaveResult | void> {
  let payload: NewsPayload
  try {
    payload = await newsPayload(formData, "/admin/news/new")
  } catch (error) {
    return payloadError(error)
  }
  const result = await adminFetch<NewsItem>(
    "/news",
    { method: "POST", body: JSON.stringify(payload) },
    "/admin/news/new",
  )
    .then((item) => ({ ok: true as const, item }))
    .catch(toActionError)

  if (!result.ok) return createError(result.error)
  revalidateResource("news", result.item.slug)
  redirect(`/admin/news/${result.item.id}?created=1`)
}

export async function updateNewsAction(formData: FormData): Promise<SaveResult | void> {
  const id = String(formData.get("id") ?? "")
  const oldSlug = String(formData.get("oldSlug") ?? "")
  const version = Number(formData.get("version") ?? 0)
  if (!id) return { error: "save_failed" }

  let payload: NewsPayload
  try {
    payload = {
      ...(await newsPayload(formData, `/admin/news/${id}`)),
      version,
    }
  } catch (error) {
    return payloadError(error)
  }
  const result = await adminFetch<NewsItem>(
    `/news/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
    `/admin/news/${id}`,
  )
    .then((item) => ({ ok: true as const, item }))
    .catch(toActionError)

  if (!result.ok) {
    return updateError(result.error, version, () =>
      adminFetch<NewsItem>(`/news/${id}`, {}, `/admin/news/${id}`),
    )
  }
  revalidateResource("news", oldSlug, result.item.slug)
  redirect(`/admin/news/${id}?saved=1`)
}

export async function deleteNewsAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const version = Number(formData.get("version") ?? 0)
  const oldSlug = String(formData.get("oldSlug") ?? "")
  if (!id || version < 1) redirect("/admin/news?error=missing_id")

  const result = await adminFetch<null>(
    `/news/${id}?version=${version}`,
    { method: "DELETE" },
    "/admin/news",
  )
    .then(() => ({ ok: true as const }))
    .catch(toActionError)

  if (!result.ok) redirect(`/admin/news?error=${errorCode(result.error)}`)
  revalidateResource("news", oldSlug)
  redirect("/admin/news?deleted=1")
}

export async function createCareerAction(formData: FormData): Promise<SaveResult | void> {
  let payload: CareerPayload
  try {
    payload = careerPayload(formData)
  } catch (error) {
    return payloadError(error)
  }
  const result = await adminFetch<Career>(
    "/careers",
    { method: "POST", body: JSON.stringify(payload) },
    "/admin/careers/new",
  )
    .then((item) => ({ ok: true as const, item }))
    .catch(toActionError)

  if (!result.ok) return createError(result.error)
  revalidateResource("careers", result.item.slug)
  redirect(`/admin/careers/${result.item.id}?created=1`)
}

export async function updateCareerAction(formData: FormData): Promise<SaveResult | void> {
  const id = String(formData.get("id") ?? "")
  const oldSlug = String(formData.get("oldSlug") ?? "")
  const version = Number(formData.get("version") ?? 0)
  if (!id) return { error: "save_failed" }

  let payload: CareerPayload
  try {
    payload = {
      ...careerPayload(formData),
      version,
    }
  } catch (error) {
    return payloadError(error)
  }
  const result = await adminFetch<Career>(
    `/careers/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
    `/admin/careers/${id}`,
  )
    .then((item) => ({ ok: true as const, item }))
    .catch(toActionError)

  if (!result.ok) {
    return updateError(result.error, version, () =>
      adminFetch<Career>(`/careers/${id}`, {}, `/admin/careers/${id}`),
    )
  }
  revalidateResource("careers", oldSlug, result.item.slug)
  redirect(`/admin/careers/${id}?saved=1`)
}

export async function deleteCareerAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const version = Number(formData.get("version") ?? 0)
  const oldSlug = String(formData.get("oldSlug") ?? "")
  if (!id || version < 1) redirect("/admin/careers?error=missing_id")

  const result = await adminFetch<null>(
    `/careers/${id}?version=${version}`,
    { method: "DELETE" },
    "/admin/careers",
  )
    .then(() => ({ ok: true as const }))
    .catch(toActionError)

  if (!result.ok) redirect(`/admin/careers?error=${errorCode(result.error)}`)
  revalidateResource("careers", oldSlug)
  redirect("/admin/careers?deleted=1")
}

async function contentPayload(formData: FormData, nextPath: string): Promise<ContentItemPayload> {
  const rawTitleId = String(formData.get("title_id") ?? "").trim()
  const rawTitleEn = String(formData.get("title_en") ?? "").trim()
  const rawTitle = String(formData.get("title") ?? "").trim()
  const resolvedTitle = (rawTitleId || rawTitleEn)
    ? combineBilingualText({ en: rawTitleEn, id: rawTitleId })
    : rawTitle

  const rawSummaryId = String(formData.get("summary_id") ?? "").trim()
  const rawSummaryEn = String(formData.get("summary_en") ?? "").trim()
  const rawSummary = String(formData.get("summary") ?? "").trim()
  const resolvedSummary = (rawSummaryId || rawSummaryEn)
    ? combineBilingualText({ en: rawSummaryEn, id: rawSummaryId })
    : rawSummary

  const baseSlugInput = String(formData.get("slug") || rawTitleEn || rawTitleId || rawTitle)

  // Validate before uploading files so an invalid form never uploads media.
  const check = contentItemSchema.safeParse({
    title: resolvedTitle,
    slug: slugify(baseSlugInput),
    status: String(formData.get("status") ?? "draft"),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
  })
  if (!check.success) {
    throw new FieldValidationError(zodFields(check.error))
  }
  const uploadedImageUrl = await uploadFileURL(formData, "imageUpload", nextPath)
  const uploadedDatasheetUrl = await uploadFileURL(formData, "datasheetUpload", nextPath)
  const parentID = String(formData.get("parentId") ?? "")

  const contentHtmlId = String(formData.get("contentHtml_id") ?? "")
  const contentHtmlEn = String(formData.get("contentHtml_en") ?? "")
  let contentValue: unknown

  if (formData.has("contentHtml_id") || formData.has("contentHtml_en")) {
    const idBlocks = blocksFromHtml(contentHtmlId).blocks
    const enBlocks = blocksFromHtml(contentHtmlEn).blocks
    contentValue = {
      bilingual: true,
      id: { blocks: idBlocks },
      en: { blocks: enBlocks },
      blocks: idBlocks.length > 0 ? idBlocks : enBlocks,
    }
  } else {
    contentValue = blocksFromText(String(formData.get("contentText") ?? ""))
  }

  return {
    parentId: parentID || null,
    slug: slugify(baseSlugInput),
    title: resolvedTitle,
    summary: resolvedSummary,
    content: contentValue,
    imageUrl: uploadedImageUrl || String(formData.get("imageUrl") ?? ""),
    specs: specsFromText(String(formData.get("specsText") ?? "")),
    datasheetUrl: uploadedDatasheetUrl || String(formData.get("datasheetUrl") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    publishedAt: toIsoDateTime(formData.get("publishedAt")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    seo: seoPayload(formData),
  }
}

async function newsPayload(formData: FormData, nextPath: string): Promise<NewsPayload> {
  const rawTitleId = String(formData.get("title_id") ?? "").trim()
  const rawTitleEn = String(formData.get("title_en") ?? "").trim()
  const rawTitle = String(formData.get("title") ?? "").trim()
  const resolvedTitle = (rawTitleId || rawTitleEn)
    ? combineBilingualText({ en: rawTitleEn, id: rawTitleId })
    : rawTitle

  const rawExcerptId = String(formData.get("excerpt_id") ?? "").trim()
  const rawExcerptEn = String(formData.get("excerpt_en") ?? "").trim()
  const rawExcerpt = String(formData.get("excerpt") ?? "").trim()
  const resolvedExcerpt = (rawExcerptId || rawExcerptEn)
    ? combineBilingualText({ en: rawExcerptEn, id: rawExcerptId })
    : rawExcerpt

  const baseSlugInput = String(formData.get("slug") || rawTitleEn || rawTitleId || rawTitle)

  const check = newsSchema.safeParse({
    title: resolvedTitle,
    slug: slugify(baseSlugInput),
    status: String(formData.get("status") ?? "draft"),
  })
  if (!check.success) {
    throw new FieldValidationError(zodFields(check.error))
  }
  const uploadedImageUrl = await uploadFileURL(formData, "featuredImageUpload", nextPath)

  const bodyHtmlId = String(formData.get("bodyHtml_id") ?? "")
  const bodyHtmlEn = String(formData.get("bodyHtml_en") ?? "")
  let bodyValue: unknown

  if (formData.has("bodyHtml_id") || formData.has("bodyHtml_en")) {
    const idBlocks = blocksFromHtml(bodyHtmlId).blocks
    const enBlocks = blocksFromHtml(bodyHtmlEn).blocks
    bodyValue = {
      bilingual: true,
      id: { blocks: idBlocks },
      en: { blocks: enBlocks },
      blocks: idBlocks.length > 0 ? idBlocks : enBlocks,
    }
  } else {
    bodyValue = blocksFromHtml(String(formData.get("bodyHtml") ?? ""))
  }

  return {
    slug: slugify(baseSlugInput),
    title: resolvedTitle,
    excerpt: resolvedExcerpt,
    body: bodyValue,
    category: String(formData.get("category") ?? ""),
    featuredImageUrl: uploadedImageUrl || String(formData.get("featuredImageUrl") ?? ""),
    featured: formData.get("featured") === "on",
    status: String(formData.get("status") ?? "draft"),
    publishedAt: toIsoDateTime(formData.get("publishedAt")),
    seo: seoPayload(formData),
  }
}

function careerPayload(formData: FormData): CareerPayload {
  const rawTitleId = String(formData.get("title_id") ?? "").trim()
  const rawTitleEn = String(formData.get("title_en") ?? "").trim()
  const rawTitle = String(formData.get("title") ?? "").trim()
  const resolvedTitle = (rawTitleId || rawTitleEn)
    ? combineBilingualText({ en: rawTitleEn, id: rawTitleId })
    : rawTitle

  const rawSummaryId = String(formData.get("summary_id") ?? "").trim()
  const rawSummaryEn = String(formData.get("summary_en") ?? "").trim()
  const rawSummary = String(formData.get("summary") ?? "").trim()
  const resolvedSummary = (rawSummaryId || rawSummaryEn)
    ? combineBilingualText({ en: rawSummaryEn, id: rawSummaryId })
    : rawSummary

  const baseSlugInput = String(formData.get("slug") || rawTitleEn || rawTitleId || rawTitle)

  const check = careerSchema.safeParse({
    title: resolvedTitle,
    slug: slugify(baseSlugInput),
    department: String(formData.get("department") ?? ""),
    location: String(formData.get("location") ?? ""),
    employmentType: String(formData.get("employmentType") ?? "full_time"),
    applyUrl: String(formData.get("applyUrl") ?? ""),
    status: String(formData.get("status") ?? "draft"),
  })
  if (!check.success) {
    throw new FieldValidationError(zodFields(check.error))
  }

  const descHtmlId = String(formData.get("descriptionHtml_id") ?? "")
  const descHtmlEn = String(formData.get("descriptionHtml_en") ?? "")
  let descValue: unknown

  if (formData.has("descriptionHtml_id") || formData.has("descriptionHtml_en")) {
    const idBlocks = blocksFromHtml(descHtmlId).blocks
    const enBlocks = blocksFromHtml(descHtmlEn).blocks
    descValue = {
      bilingual: true,
      id: { blocks: idBlocks },
      en: { blocks: enBlocks },
      blocks: idBlocks.length > 0 ? idBlocks : enBlocks,
    }
  } else {
    descValue = blocksFromHtml(String(formData.get("descriptionHtml") ?? ""))
  }

  return {
    slug: slugify(baseSlugInput),
    title: resolvedTitle,
    summary: resolvedSummary,
    description: descValue,
    department: String(formData.get("department") ?? ""),
    location: String(formData.get("location") ?? ""),
    employmentType: String(formData.get("employmentType") ?? "full_time"),
    applyUrl: String(formData.get("applyUrl") ?? ""),
    deadline: toIsoDateTime(formData.get("deadline")),
    status: String(formData.get("status") ?? "draft"),
    publishedAt: toIsoDateTime(formData.get("publishedAt")),
  }
}

async function uploadFileURL(formData: FormData, field: string, nextPath: string) {
  const file = formData.get(field)
  if (!(file instanceof File) || file.size === 0) {
    return ""
  }

  const uploadForm = new FormData()
  uploadForm.set("file", file)
  const media = await adminUpload(uploadForm, nextPath)
  return media.url
}

function seoPayload(formData: FormData) {
  const titleId = String(formData.get("seoTitle_id") ?? "").trim()
  const titleEn = String(formData.get("seoTitle_en") ?? "").trim()
  const rawTitle = String(formData.get("seoTitle") ?? "")
  const title = (titleId || titleEn) ? combineBilingualText({ id: titleId, en: titleEn }) : rawTitle

  const descId = String(formData.get("seoDescription_id") ?? "").trim()
  const descEn = String(formData.get("seoDescription_en") ?? "").trim()
  const rawDesc = String(formData.get("seoDescription") ?? "")
  const description = (descId || descEn) ? combineBilingualText({ id: descId, en: descEn }) : rawDesc

  return {
    title,
    description,
    canonical: String(formData.get("seoCanonical") ?? ""),
    noIndex: formData.get("seoNoIndex") === "on",
  }
}

function resourceFromForm(formData: FormData): "services" | "products" {
  return formData.get("resource") === "products" ? "products" : "services"
}

function revalidateResource(resource: Resource, ...slugs: string[]) {
  const { adminPath, publicPath } = resourceConfig[resource]
  // Content feeds navigation dropdowns and section grids everywhere.
  updateTag("cms")
  revalidatePath("/")
  revalidatePath(adminPath)
  revalidatePath(publicPath)
  for (const slug of slugs) {
    if (slug) {
      revalidatePath(`${publicPath}/${slug}`)
    }
  }
}

function toActionError(error: unknown) {
  if (error instanceof AdminApiError) {
    return { ok: false as const, error }
  }
  return {
    ok: false as const,
    error: new AdminApiError(
      503,
      error instanceof Error ? error.message : "The admin API is temporarily unreachable. Please try again in a few moments.",
      "network_error",
    ),
  }
}

function errorCode(error: AdminApiError) {
  if (error.code === "version_conflict") return "conflict"
  if (error.code === "validation_error") return "validation"
  if (error.code === "invalid_upload" || error.code === "invalid_file" || error.code === "missing_file") {
    return "upload_failed"
  }
  return "save_failed"
}

// Failures while building the payload: schema violations surface inline,
// upload errors (image/datasheet fields) as a banner.
function payloadError(error: unknown): SaveResult {
  if (error instanceof FieldValidationError) return { error: "validation", fields: error.fields }
  if (error instanceof AdminApiError) return { error: "upload_failed" }
  return { error: "save_failed" }
}

const duplicateSlugFields = { slug: "This slug is already in use." }

// On create, a version_conflict can only mean the slug is already taken.
function createError(error: AdminApiError): SaveResult {
  if (error.code === "version_conflict") return { error: "duplicate", fields: duplicateSlugFields }
  if (error.code === "validation_error") return { error: "validation", fields: error.fields }
  if (error.status === 403) return { error: "forbidden" }
  return { error: "save_failed" }
}

// On update, stale version and duplicate slug both surface as
// version_conflict — compare against the stored version to tell them apart.
async function updateError(
  error: AdminApiError,
  sentVersion: number,
  fetchCurrent: () => Promise<{ version?: number }>,
): Promise<SaveResult> {
  if (error.code === "version_conflict") {
    const current = await fetchCurrent().catch(() => null)
    if (current?.version && current.version !== sentVersion) {
      return { error: "conflict", serverVersion: current.version }
    }
    return { error: "duplicate", fields: duplicateSlugFields }
  }
  if (error.code === "validation_error") return { error: "validation", fields: error.fields }
  if (error.status === 403) return { error: "forbidden" }
  return { error: "save_failed" }
}
