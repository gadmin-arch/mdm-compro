"use client"

import Link, { type LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import { useContentLanguage, type ContentLanguage } from "@/components/cms/content-language"
import { localizePath } from "@/lib/i18n"

/**
 * Transforms any internal route to include or exclude the /en prefix
 * based on the active language.
 */
export function localizeHref(
  href: LinkProps["href"],
  lang: ContentLanguage
): LinkProps["href"] {
  if (!href) return "/"
  if (typeof href === "string") return localizePath(href, lang)
  if (typeof href === "object" && typeof href.pathname === "string") {
    return { ...href, pathname: localizePath(href.pathname, lang) }
  }
  return href
}

/**
 * React hook to get a localized version of an href string.
 */
export function useLocalizedHref(href: LinkProps["href"]): LinkProps["href"] {
  const { lang } = useContentLanguage()
  return localizeHref(href, lang)
}

/**
 * The pathname the visitor sees. A rewrite in next.config.mjs serves
 * Indonesian pages from the internal /id/* routes, and usePathname() reports that internal path for
 * them — "/id/services" becomes "/services" here. /en paths are unchanged. Filtered listings
 * render from an internal <listing>/~list route (lib/listing-query.ts); that suffix is dropped too.
 */
export function usePublicPathname(): string {
  const pathname = (usePathname() ?? "/").replace(/\/~list$/, "")
  if (pathname === "/id") return "/"
  if (pathname.startsWith("/id/")) return pathname.slice(3)
  return pathname
}

export interface LocalizedLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children?: React.ReactNode
}

/**
 * Drop-in replacement for next/link that automatically prefixes /en
 * when English mode is active, and removes /en when Indonesian mode is active.
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  function LocalizedLink({ href, ...rest }, ref) {
    const localized = useLocalizedHref(href)
    return <Link ref={ref} href={localized} {...rest} />
  }
)
