import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Briefcase, FileText, Layout, SearchIcon, Wrench } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { globalSearch } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Search Results — PT Multi Daya Mitra",
  description: "Search products, services, careers, news, and pages on PT Multi Daya Mitra.",
}

type Props = {
  searchParams: Promise<{ q?: string; search?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const query = await searchParams
  const q = query.q || query.search || ""

  const results = q ? await globalSearch(q) : { products: [], services: [], careers: [], news: [], pages: [] }

  const totalResults =
    results.products.length +
    results.services.length +
    results.careers.length +
    results.news.length +
    results.pages.length

  return (
    <>
      <PageHero
        eyebrow="Global Search"
        title={q ? `Search results for "${q}"` : "Search our website"}
        description="Search across products, services, careers, news, and pages."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <section className="border-b border-border/60 bg-background min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Search Box on Search Page */}
          <form action="/search" method="GET" className="max-w-2xl mx-auto mb-12">
            <div className="relative flex items-center">
              <SearchIcon className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products, services, news..."
                className="w-full h-12 pl-12 pr-24 rounded-full border border-border bg-card/50 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 h-8 bg-primary text-primary-foreground font-medium rounded-full text-sm hover:bg-primary/95 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {!q ? (
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Find what you need</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Type in keywords above to search all documentation, products, services, and career opportunities.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">No matching results found</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                We couldn&apos;t find anything matching &quot;{q}&quot;. Try adjusting your keywords or checking spelling.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <div className="mb-6 flex justify-between items-center border-b pb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Found {totalResults} match{totalResults !== 1 && "es"}
                </h2>
              </div>

              <Tabs defaultValue={results.products.length > 0 ? "products" : results.services.length > 0 ? "services" : results.news.length > 0 ? "news" : results.careers.length > 0 ? "careers" : "pages"} className="w-full">
                <TabsList className="flex flex-wrap h-auto bg-muted p-1 rounded-xl mb-8 max-w-3xl">
                  <TabsTrigger value="products" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <Wrench className="h-4 w-4" />
                    Products ({results.products.length})
                  </TabsTrigger>
                  <TabsTrigger value="services" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <Briefcase className="h-4 w-4" />
                    Services ({results.services.length})
                  </TabsTrigger>
                  <TabsTrigger value="news" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <BookOpen className="h-4 w-4" />
                    News ({results.news.length})
                  </TabsTrigger>
                  <TabsTrigger value="careers" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <FileText className="h-4 w-4" />
                    Careers ({results.careers.length})
                  </TabsTrigger>
                  <TabsTrigger value="pages" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <Layout className="h-4 w-4" />
                    Pages ({results.pages.length})
                  </TabsTrigger>
                </TabsList>

                {/* Products Tab Content */}
                <TabsContent value="products" className="mt-0">
                  {results.products.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">No products matched your search.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.products.map((item) => (
                        <Link key={item.id} href={`/products/${item.fullPath}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline">Product</Badge>
                                {item.specs?.category && <span className="text-xs text-muted-foreground font-medium">{item.specs.category}</span>}
                              </div>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                {item.title}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">{item.summary}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Services Tab Content */}
                <TabsContent value="services" className="mt-0">
                  {results.services.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">No services matched your search.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.services.map((item) => (
                        <Link key={item.id} href={`/services/${item.fullPath}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <Badge variant="outline" className="w-fit mb-2">Service</Badge>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                {item.title}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">{item.summary}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* News Tab Content */}
                <TabsContent value="news" className="mt-0">
                  {results.news.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">No articles matched your search.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.news.map((item) => (
                        <Link key={item.id} href={`/news/${item.slug}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline">News</Badge>
                                <span className="text-xs text-muted-foreground">{item.category}</span>
                              </div>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                {item.title}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">{item.excerpt}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Careers Tab Content */}
                <TabsContent value="careers" className="mt-0">
                  {results.careers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">No career openings matched your search.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.careers.map((item) => (
                        <Link key={item.id} href={`/career/${item.slug}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline">Career</Badge>
                                <span className="text-xs text-muted-foreground">{item.location}</span>
                              </div>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                {item.title}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">{item.summary}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Pages Tab Content */}
                <TabsContent value="pages" className="mt-0">
                  {results.pages.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">No site pages matched your search.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.pages.map((item) => (
                        <Link key={item.id} href={`/${item.key}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <Badge variant="outline" className="w-fit mb-2">Page</Badge>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                {item.title}
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">
                                Explore content on the {item.title} page of PT Multi Daya Mitra.
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
