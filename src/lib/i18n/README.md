# MegDev languages

Turkish is the source language and keeps the original URLs. English lives under
`/en`, German under `/de`. The proxy rewrites language-prefixed URLs to the same
Next pages and passes the language to the server layout. Existing demo subdomain
routing and API/download URLs remain independent of language.

Unprefixed page visits use the browser's `Accept-Language` header (including
regional codes and preference weights). Supported languages are TR/EN/DE, with
Turkish as the fallback. Explicit locale URLs take priority; otherwise the
`megdev-language` cookie set by the language switcher overrides automatic
detection. Language redirects are temporary, private and uncached; they preserve
query parameters and never redirect API calls, assets or non-GET/HEAD requests.
No detected-language cookie is saved automatically, so subsequent browser
preference changes are respected until the visitor explicitly chooses a language.

`en.json` and `de.json` contain product text, not customer data. Add the same source
key to both dictionaries when adding UI text. Use `<T>` for strings in React
children, `useLanguage().t()` for imperative UI text, and `LocalizedElement` for
native translatable attributes. Use the local `i18n/link` instead of `next/link`
for page navigation. Use `localizedHref` for imperative navigation and
`intlLocale` for number/date formatting. Keep stored enum values unchanged.

Unknown text remains unchanged. Contract documents, uploaded HTML demos and
customer-authored content are not automatically translated. The website does not
introduce a remote translation service or alter the backend schema.

Page metadata uses `localizeMetadata`. The sitemap lists all three language
variants with alternate-language links.

Validation:

```
node scripts/test-i18n.mjs
node scripts/test-language-detection.mjs
```

Set `I18N_TEST_ORIGIN` to a running local Next server URL to also check the rendered
pages. `scripts/audit-i18n.mjs` lists untranslated literal candidates for review;
brand names, technical terms, customer names and punctuation may intentionally
remain unchanged.
