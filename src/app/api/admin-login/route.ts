import { NextResponse } from "next/server"
import { ADMIN_COOKIE, adminSessionValue } from "@/lib/admin-auth"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(req: Request) {
  const { password } = await req.json()
  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE, adminSessionValue(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    })
    return response
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
