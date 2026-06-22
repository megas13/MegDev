import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_BLOG, UPDATE_BLOG, DELETE_BLOG } from "@/lib/nhost-graphql"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await adminRequest(GET_BLOG, { id })
    if (!data?.blog_posts_by_pk) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(data.blog_posts_by_pk)
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const data = await adminRequest(UPDATE_BLOG, { id, ...body })
    return NextResponse.json(data?.update_blog_posts_by_pk)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await adminRequest(DELETE_BLOG, { id })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
