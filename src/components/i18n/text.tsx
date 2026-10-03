"use client"

import { Children, createElement, type ReactNode, type JSX } from "react"
import { useLanguage } from "./provider"

/** Translate known product strings during React rendering, including dynamic UI
 * labels. Unknown customer content is preserved verbatim. No DOM mutation. */
export function T({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  return Children.map(children, child => typeof child === "string" ? t(child) : child)
}

type Tag = keyof JSX.IntrinsicElements
export function LocalizedElement<TagName extends Tag>({ as, ...props }: { as: TagName } & JSX.IntrinsicElements[TagName]) {
  const { t } = useLanguage()
  const attributes: Record<string, unknown> = { ...props }
  for (const name of ["placeholder", "title", "alt", "aria-label", "aria-description"]) {
    if (typeof attributes[name] === "string") attributes[name] = t(attributes[name])
  }
  return createElement(as, attributes)
}
