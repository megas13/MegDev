import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { GET_DEMO_PAGE_BY_SUBDOMAIN } from "@/lib/nhost-graphql"
import {
  demoContentType,
  demoFileExtension,
  isDemoHtmlPath,
  matchDemoRequestPath,
} from "@/lib/demo-page-files"
import { injectBaseHref, readDemoPage } from "@/lib/demo-page-manifest"
import { fetchDemoFile } from "@/lib/demo-page-storage"

type Context = { params: Promise<{ subdomain: string; path?: string[] }> }

const ROOT_DOMAIN = (process.env.DEMO_ROOT_DOMAIN || "megdev.com.tr").toLowerCase()
const FRAME_ANCESTORS = `'self' https://${ROOT_DOMAIN} https://www.${ROOT_DOMAIN}`

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  })
}

function htmlHeaders(preview: boolean) {
  return {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": preview ? "no-store" : "public, s-maxage=60, stale-while-revalidate=300",
    "Content-Security-Policy": `frame-ancestors ${FRAME_ANCESTORS}; object-src 'none'; base-uri 'self'`,
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  }
}

export async function GET(request: Request, { params }: Context) {
  const { subdomain, path = [] } = await params

  try {
    const data = await adminRequest(GET_DEMO_PAGE_BY_SUBDOMAIN, {
      subdomain: subdomain.toLowerCase(),
    })
    const page = data?.demo_pages?.[0]

    const publicHost = request.headers.get("x-megdev-demo-host")
    const previewQuery = new URL(request.url).searchParams.get("preview") === "1"
    const preview = !publicHost || previewQuery

    const allowed = page && (page.published || (preview && (await isAdminRequest())))
    if (!allowed) {
      return textResponse("Demo sayfası bulunamadı veya yayında değil.", 404)
    }

    const { manifest, html } = readDemoPage(page.html_content)
    const requestPath = path.join("/")

    if (!manifest) {
      if (requestPath) return textResponse("Dosya bulunamadı.", 404)
      return new Response(html, { status: 200, headers: htmlHeaders(preview) })
    }

    const match = matchDemoRequestPath(manifest, requestPath)
    if (!match) return textResponse("Dosya bulunamadı.", 404)

    if (match.kind === "index") {
      const body = preview && !publicHost
        ? injectBaseHref(html, `/api/demo-pages/render/${encodeURIComponent(subdomain)}/`)
        : html
      return new Response(body, { status: 200, headers: htmlHeaders(preview) })
    }

    const upstream = await fetchDemoFile(
      match.file.storageId,
      request.headers.get("range"),
    )
    if (!upstream?.ok || !upstream.body) return textResponse("Dosya bulunamadı.", 404)

    const headers = new Headers({
      "Content-Type": demoContentType(match.file.path),
      "Cache-Control": page.published
        ? "public, max-age=300, s-maxage=300"
        : "private, no-store",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Accept-Ranges": upstream.headers.get("accept-ranges") ?? "bytes",
    })

    if (upstream.status === 206) {
      const length = upstream.headers.get("content-length")
      if (length) headers.set("Content-Length", length)
      const contentRange = upstream.headers.get("content-range")
      if (contentRange) headers.set("Content-Range", contentRange)
    }

    if (demoFileExtension(match.file.path) === "svg") {
      headers.set("Content-Security-Policy", `sandbox; frame-ancestors ${FRAME_ANCESTORS}`)
    } else if (isDemoHtmlPath(match.file.path)) {
      headers.set("Content-Security-Policy", `frame-ancestors ${FRAME_ANCESTORS}`)
    }

    return new Response(upstream.body, { status: upstream.status, headers })
  } catch {
    return textResponse("Demo sayfası şu anda görüntülenemiyor.", 503)
  }
}
