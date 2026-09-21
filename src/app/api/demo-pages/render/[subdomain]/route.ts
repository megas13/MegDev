import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { GET_DEMO_PAGE_BY_SUBDOMAIN } from "@/lib/nhost-graphql"

type Context = { params: Promise<{ subdomain: string }> }

export async function GET(request: Request, { params }: Context) {
  const { subdomain } = await params

  try {
    const data = await adminRequest(GET_DEMO_PAGE_BY_SUBDOMAIN, { subdomain: subdomain.toLowerCase() })
    const page = data?.demo_pages?.[0]
    const preview = new URL(request.url).searchParams.get("preview") === "1"

    if (!page || (!page.published && !(preview && (await isAdminRequest())))) {
      return new Response("Demo sayfası bulunamadı veya yayında değil.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
      })
    }

    return new Response(page.html_content, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": preview ? "no-store" : "public, s-maxage=60, stale-while-revalidate=300",
        "Content-Security-Policy": "frame-ancestors 'self' https://megdev.tr https://www.megdev.tr; object-src 'none'; base-uri 'self'",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    })
  } catch {
    return new Response("Demo sayfası şu anda görüntülenemiyor.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    })
  }
}
