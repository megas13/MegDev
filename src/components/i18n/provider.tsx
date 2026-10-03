"use client"

import { createContext, useContext, type ReactNode } from "react"
import { type Locale, intlLocales } from "@/lib/i18n/config"
import { translate, type Dictionary } from "@/lib/i18n/translate"

const LanguageContext = createContext<{ locale: Locale; dictionary: Dictionary }>({ locale: "tr", dictionary: {} })
export function LanguageProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  return <LanguageContext.Provider value={{ locale, dictionary }}>{children}</LanguageContext.Provider>
}
export function useLanguage() {
  const { locale, dictionary } = useContext(LanguageContext)
  return { locale, intlLocale: intlLocales[locale], t: (value: string) => translate(value, dictionary) }
}
