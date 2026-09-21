import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase()
  const rootDomain = (process.env.DEMO_ROOT_DOMAIN || "megdev.tr").toLowerCase()
  const suffix = `.${rootDomain}`

  if (host.endsWith(suffix) && !req.nextUrl.pathname.startsWith("/api/demo-pages/render/")) {
    const subdomain = host.slice(0, -suffix.length)
    if (subdomain && !subdomain.includes(".") && subdomain !== "www") {
      const url = req.nextUrl.clone()
      url.pathname = `/api/demo-pages/render/${encodeURIComponent(subdomain)}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}
