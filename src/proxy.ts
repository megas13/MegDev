import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MEG_WAF_URL = process.env.MEG_WAF_URL || "http://localhost:8082/v1/inspect"
const MEG_API_KEY = process.env.MEG_API_KEY || ""

const excluded = [
  "/_next/",
  "/favicon",
  "/images/",
  "/fonts/",
  "/api/send-email",
]

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (excluded.some((p) => path.startsWith(p)) || !MEG_API_KEY) return NextResponse.next()

  const res = NextResponse.next()
  try {
    const result = await fetch(MEG_WAF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEG_API_KEY}`,
      },
      body: JSON.stringify({ method: req.method, path }),
    })
    const data = await result.json()
    res.headers.set("x-meg-waf", "active")
    if (data.blocked) {
      return new NextResponse(
        JSON.stringify({ error: "blocked", reason: data.reason }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      )
    }
  } catch {
    res.headers.set("x-meg-waf", "unreachable")
  }
  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
