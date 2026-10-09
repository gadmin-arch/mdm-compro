import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailView } from "@/components/cms/service-detail"
import { findNodeInTree, flattenContent, getService, getServices } from "@/lib/cms"
import { toLocale } from "@/lib/i18n"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string; path: string[] }>
}

export async function generateStaticParams() {
  const services = await getServices()
  return flattenContent(services).map((item) => ({ path: item.fullPath.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, path: segments } = await params
  const path = segments.join("/")
  const service = await getService(path)
  if (!service) return {}
  return buildLocalizedMetadata({
    lang: toLocale(lang),
    path: `/services/${service.fullPath || path}`,
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.summary,
    canonical: service.seo?.canonical,
    image: service.imageUrl,
    noIndex: service.seo?.noIndex,
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const path = (await params).path.join("/")
  const allServices = await getServices()
  const treeNode = findNodeInTree(allServices, path)
  const service = treeNode ?? (await getService(path))
  if (!service) notFound()

  const subServices = treeNode?.children ?? service.children ?? []

  return <ServiceDetailView service={service} subServices={subServices} />
}
