"use client"

import NextLink from "next/link"
import type { ComponentProps } from "react"
import { useLanguage } from "./provider"
import { localizedHref } from "@/lib/i18n/config"

export default function Link({ href, children, ...props }: ComponentProps<typeof NextLink>) {
  const { locale, t } = useLanguage()
  const target = typeof href === "string" ? localizedHref(href, locale) : { ...href, pathname: href.pathname ? localizedHref(href.pathname, locale) : href.pathname }
  return <NextLink {...props} href={target} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} title={props.title ? t(props.title) : undefined}>{children}</NextLink>
}
