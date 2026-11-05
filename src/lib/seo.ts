import { services, siteConfig } from "@/constants"
import { intlLocales, localizedHref, type Locale } from "@/lib/i18n/config"

const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || "https://megdev.com.tr"
export const SITE_URL = configuredUrl.replace(/\/+$/, "")
export const SITE_NAME = "Meg Dev"
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

type Translate = (text: string) => string

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const areaServed = [{ "@type": "Country", name: "Türkiye" }, "Worldwide"]

export function organizationJsonLd(locale: Locale, t: Translate) {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "MegDev",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/megdevicon.png"),
      width: 1254,
      height: 1254,
    },
    image: absoluteUrl("/megdevicon.png"),
    description: t(siteConfig.description),
    email: siteConfig.email,
    telephone: "+905379830414",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Demokrasi Mah 2233. Sk",
      addressLocality: "Melikgazi",
      addressRegion: "Kayseri",
      addressCountry: "TR",
    },
    areaServed,
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+905379830414",
        contactType: "customer service",
        email: siteConfig.email,
        availableLanguage: ["Turkish", "English", "German"],
      },
    ],
    sameAs: [siteConfig.facebook, siteConfig.twitter, siteConfig.linkedin, siteConfig.instagram],
    knowsAbout: services.map((service) => t(service.title)),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("Hizmetlerimiz"),
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: t(service.title),
          description: t(service.description),
          url: absoluteUrl(`/services/${service.slug}`),
        },
      })),
    },
    inLanguage: intlLocales[locale],
  }
}

export function websiteJsonLd(locale: Locale, t: Translate) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: t(siteConfig.description),
    inLanguage: intlLocales[locale],
    publisher: { "@id": ORGANIZATION_ID },
  }
}

export function serviceJsonLd(service: (typeof services)[number], locale: Locale, t: Translate) {
  const url = absoluteUrl(`/services/${service.slug}`)
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: t(service.title),
    description: t(service.description),
    serviceType: t(service.title),
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed,
    inLanguage: intlLocales[locale],
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>, locale: Locale) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedHref(item.path, locale)),
    })),
  }
}

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
  locale: Locale,
  pagePath = "/",
) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(localizedHref(pagePath, locale))}#faq`,
    inLanguage: intlLocales[locale],
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}
