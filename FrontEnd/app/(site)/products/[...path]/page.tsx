import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/cms/product-detail"
import { findNodeInTree, flattenContent, getProduct, getProducts } from "@/lib/cms"
import { buildBilingualMetadata } from "@/lib/bilingual"

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
  return buildBilingualMetadata({
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.summary,
    canonicalPath: `/products/${product.fullPath || path}`,
    image: product.imageUrl,
    noIndex: product.seo?.noIndex,
  })
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

