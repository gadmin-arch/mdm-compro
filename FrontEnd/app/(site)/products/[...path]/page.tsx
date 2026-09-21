import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/cms/product-detail"
import { findNodeInTree, flattenContent, getProduct, getProducts } from "@/lib/cms"

type Props = {
  params: Promise<{ path: string[] }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return flattenContent(products).map((item) => ({ path: item.fullPath.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).path.join("/")
  const product = await getProduct(path)
  if (!product) return {}
  return {
    title: product.seo?.title ?? `${product.title} — PT Multi Daya Mitra`,
    description: product.seo?.description ?? product.summary,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const path = (await params).path.join("/")
  const allProducts = await getProducts()
  const treeNode = findNodeInTree(allProducts, path)
  const product = treeNode ?? (await getProduct(path))
  if (!product) notFound()

  const subProducts = treeNode?.children ?? product.children ?? []

  return <ProductDetailView product={product} subProducts={subProducts} />
}

