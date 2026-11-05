import type { MetadataRoute } from "next"
import { services } from "@/constants"
import { locales, localizedHref, type Locale } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/seo"

function pageUrl(path: string, locale: Locale) {
  const href = localizedHref(path, locale)
  return href === "/" ? SITE_URL : `${SITE_URL}${href}`
}

const lastModified = new Date()

const pages: Array<{
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  ...services.map((service) => ({
    path: `/services/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  })),
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.8 },
  { path: "/processes", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/downloads", changeFrequency: "monthly", priority: 0.5 },
  { path: "/subtrack", changeFrequency: "monthly", priority: 0.5 },
  { path: "/kvkk", changeFrequency: "yearly", priority: 0.3 },
  { path: "/kosullar", changeFrequency: "yearly", priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const languages = Object.fromEntries([
      ...locales.map((locale) => [locale, pageUrl(page.path, locale)]),
      ["x-default", pageUrl(page.path, "tr")],
    ])

    return locales.map((locale) => ({
      url: pageUrl(page.path, locale),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages },
    }))
  })
}
