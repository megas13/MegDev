import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PROJECT_BY_TOKEN } from "@/lib/nhost-graphql"

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const data = await adminRequest(GET_PROJECT_BY_TOKEN, { token })
    const projects = data?.projects ?? []
    if (projects.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(projects[0])
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
