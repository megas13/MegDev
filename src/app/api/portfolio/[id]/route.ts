import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PORTFOLIO, UPDATE_PORTFOLIO, DELETE_PORTFOLIO } from "@/lib/nhost-graphql"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await adminRequest(GET_PORTFOLIO, { id })
    if (!data?.portfolio_projects_by_pk) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(data.portfolio_projects_by_pk)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const data = await adminRequest(UPDATE_PORTFOLIO, { id, ...body })
    return NextResponse.json(data?.update_portfolio_projects_by_pk)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await adminRequest(DELETE_PORTFOLIO, { id })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
