import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PORTFOLIOS, CREATE_PORTFOLIO } from "@/lib/nhost-graphql"

export async function GET() {
  try {
    const data = await adminRequest(GET_PORTFOLIOS)
    return NextResponse.json(data?.portfolio_projects ?? [])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await adminRequest(CREATE_PORTFOLIO, {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: body.description,
      imageUrl: body.image_url || null,
      category: body.category || null,
      technologies: body.technologies || null,
      projectUrl: body.project_url || null,
      featured: body.featured ?? false,
    })
    return NextResponse.json(data?.insert_portfolio_projects_one, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
