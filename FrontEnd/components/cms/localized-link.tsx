"use client"

import Link, { type LinkProps } from "next/link"
import React, { forwardRef } from "react"
import { useContentLanguage, type ContentLanguage } from "@/components/cms/content-language"

/**
 * Transforms any internal route to include or exclude the /en prefix
 * based on the active language.
 */
export function localizeHref(
  href: LinkProps["href"],
  lang: ContentLanguage
): LinkProps["href"] {
  if (!href) return "/"
  if (typeof href !== "string") {
    if (typeof href === "object" && typeof href.pathname === "string") {
      return {
        ...href,
        pathname: localizeHref(href.pathname, lang) as string,
      }
    }
    return href
  }

  // Skip external, protocol-relative, anchors, mailto, tel, javascript
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("javascript:")
  ) {
    return href
  }

  // Skip admin, api, uploads, and next internal routes
  if (
    href.startsWith("/admin") ||
    href.startsWith("/api") ||
    href.startsWith("/_next") ||
    href.startsWith("/uploads")
  ) {
    return href
  }

  const cleanHref = href.startsWith("/") ? href : `/${href}`

  if (lang === "en") {
    if (cleanHref === "/") return "/en"
    if (cleanHref === "/en" || cleanHref.startsWith("/en/")) return cleanHref
    return `/en${cleanHref}`
  } else {
    // Indonesian: default root without /en
    if (cleanHref === "/en") return "/"
    if (cleanHref.startsWith("/en/")) {
      const stripped = cleanHref.slice(3)
      return stripped.startsWith("/") ? stripped : `/${stripped}`
    }
    return cleanHref
  }
}

/**
 * React hook to get a localized version of an href string.
 */
export function useLocalizedHref(href: LinkProps["href"]): LinkProps["href"] {
  const { lang } = useContentLanguage()
  return localizeHref(href, lang)
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
