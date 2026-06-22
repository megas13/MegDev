import { NextResponse } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(req: Request) {
  const { password } = await req.json()
  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
