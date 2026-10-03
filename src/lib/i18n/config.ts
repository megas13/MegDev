export const locales = ["tr", "en", "de"] as const
export type Locale = typeof locales[number]
export const localeNames: Record<Locale, string> = { tr: "Türkçe", en: "English", de: "Deutsch" }
export const intlLocales: Record<Locale, string> = { tr: "tr-TR", en: "en-GB", de: "de-DE" }
export const languageCookie = "megdev-language"
export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale)
}
export function preferredLocale(acceptLanguage: string | null, savedLanguage?: string): Locale {
  if (isLocale(savedLanguage)) return savedLanguage
  const preferences = (acceptLanguage || "").split(",").map((entry, index) => {
    const [tag, ...parameters] = entry.trim().toLowerCase().split(";")
    const quality = parameters.find(parameter => parameter.trim().startsWith("q="))
    const weight = quality ? Number(quality.trim().slice(2)) : 1
    return { language: tag.split("-")[0], weight, index }
  }).filter(({ language, weight }) => isLocale(language) && Number.isFinite(weight) && weight > 0 && weight <= 1)
    .sort((a, b) => b.weight - a.weight || a.index - b.index)
  return preferences[0]?.language as Locale || "tr"
}
export function basePath(path: string) {
  const stripped = path.replace(/^\/(tr|en|de)(?=[/?#]|$)/, "")
  return !stripped ? "/" : /^[?#]/.test(stripped) ? `/${stripped}` : stripped
}
export function localizedHref(href: string, locale: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href
  const path = basePath(href)
  if (/^\/(api|_next|media|fonts)([/?#]|$)/.test(path) || /^\/downloads\//.test(path) || /\.[a-z0-9]+(?:[?#]|$)/i.test(path)) return path
  return locale === "tr" ? path : `/${locale}${path === "/" ? "" : /^\/[?#]/.test(path) ? path.slice(1) : path}`
}
