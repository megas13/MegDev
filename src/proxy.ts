import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isLocale, basePath, languageCookie, localizedHref, preferredLocale } from "@/lib/i18n/config"

export async function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase()
  const rootDomain = (process.env.DEMO_ROOT_DOMAIN || "megdev.com.tr").toLowerCase()
  const suffix = `.${rootDomain}`

  if (host.endsWith(suffix) && !req.nextUrl.pathname.startsWith("/api/demo-pages/render/")) {
    const subdomain = host.slice(0, -suffix.length)
    if (subdomain && !subdomain.includes(".") && subdomain !== "www") {
      const url = req.nextUrl.clone()
      url.pathname = `/api/demo-pages/render/${encodeURIComponent(subdomain)}`
      return NextResponse.rewrite(url)
    }
  }

  const pathname = req.nextUrl.pathname
  if (/^\/(api|_next)(\/|$)/.test(pathname) || /\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next()
  const prefix = pathname.split("/")[1]
  // An explicit URL wins, then a user's saved choice, then their browser preferences.
  const locale = isLocale(prefix) ? prefix : preferredLocale(req.headers.get("accept-language"), req.cookies.get(languageCookie)?.value)
  if (!isLocale(prefix) && locale !== "tr" && (req.method === "GET" || req.method === "HEAD")) {
    const target = localizedHref(pathname, locale)
    if (target !== pathname) {
      const url = req.nextUrl.clone()
      url.pathname = target
      const response = NextResponse.redirect(url)
      response.headers.set("Vary", "Accept-Language, Cookie")
      response.headers.set("Cache-Control", "private, no-store")
      return response
    }
  }
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-megdev-locale", locale)
  requestHeaders.set("x-megdev-path", basePath(pathname))
  if (isLocale(prefix)) {
    const url = req.nextUrl.clone()
    url.pathname = basePath(pathname)
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }
  return NextResponse.next({ request: { headers: requestHeaders } })
}
