import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_BLOGS, CREATE_BLOG } from "@/lib/nhost-graphql"

export async function GET() {
  try {
    const data = await adminRequest(GET_BLOGS)
    return NextResponse.json(data?.blog_posts ?? [])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await adminRequest(CREATE_BLOG, {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      content: body.content,
      excerpt: body.excerpt || null,
      imageUrl: body.image_url || null,
      author: body.author || "Meg Dev",
      published: body.published ?? true,
    })
    return NextResponse.json(data?.insert_blog_posts_one, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
