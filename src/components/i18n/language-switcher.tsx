"use client"

import { usePathname } from "next/navigation"
import { languageCookie, locales, localeNames, localizedHref } from "@/lib/i18n/config"
import { useLanguage } from "./provider"
import styles from "./language-switcher.module.css"

export function LanguageSwitcher() {
  const pathname = usePathname()
  const { locale, t } = useLanguage()
  return <nav className={styles.switcher} aria-label={t("Dil seçimi")}>
    {locales.map(language => <a key={language} href={localizedHref(pathname, language)} hrefLang={language} lang={language} aria-label={localeNames[language]} aria-current={locale === language ? "true" : undefined}
      onClick={event => {
        document.cookie = `${languageCookie}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`
        const link = event.currentTarget
        link.href = localizedHref(pathname, language) + window.location.search + window.location.hash
      }}>{language.toUpperCase()}</a>)}
  </nav>
}
