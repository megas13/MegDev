import "server-only"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { isLocale, localizedHref, type Locale } from "./config"
import { translate, type Dictionary } from "./translate"

export async function getLanguage() {
  const request = await headers()
  const selected = request.get("x-megdev-locale")
  const locale: Locale = isLocale(selected) ? selected : "tr"
  const dictionary: Dictionary = locale === "tr" ? {} : locale === "de" ? (await import("./de.json")).default : (await import("./en.json")).default
  return { locale, dictionary, path: request.get("x-megdev-path") || "/", t: (text: string) => translate(text, dictionary) }
}
export async function localizeMetadata(metadata: Metadata): Promise<Metadata> {
  const { locale, path, t } = await getLanguage()
  const title = typeof metadata.title === "string" ? t(metadata.title) : metadata.title && "default" in metadata.title ? { ...metadata.title, default: t(metadata.title.default) } : metadata.title
  return {
    ...metadata, title, description: metadata.description ? t(metadata.description) : metadata.description,
    keywords: typeof metadata.keywords === "string" ? t(metadata.keywords) : metadata.keywords?.map(t),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://megdev.com.tr"),
    alternates: { ...metadata.alternates, canonical: localizedHref(path, locale), languages: { tr: localizedHref(path,"tr"), en: localizedHref(path,"en"), de: localizedHref(path,"de"), "x-default": localizedHref(path,"tr") } },
    openGraph: { ...metadata.openGraph, url: localizedHref(path, locale), title: typeof title === "string" ? title : title && "default" in title ? title.default : "MegDev", description: metadata.description ? t(metadata.description) : undefined, locale: locale === "de" ? "de_DE" : locale === "en" ? "en_GB" : "tr_TR" },
    ...(metadata.twitter ? { twitter: { ...metadata.twitter, title: typeof metadata.twitter.title === "string" ? t(metadata.twitter.title) : metadata.twitter.title, description: metadata.twitter.description ? t(metadata.twitter.description) : undefined } } : {}),
  }
}
