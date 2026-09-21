import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailView } from "@/components/cms/service-detail"
import { findNodeInTree, flattenContent, getService, getServices } from "@/lib/cms"

type Props = {
  params: Promise<{ path: string[] }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const services = await getServices()
  return flattenContent(services).map((item) => ({ path: item.fullPath.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).path.join("/")
  const service = await getService(path)
  if (!service) return {}
  return {
    title: service.seo?.title ?? `${service.title} — PT Multi Daya Mitra`,
    description: service.seo?.description ?? service.summary,
  }
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

