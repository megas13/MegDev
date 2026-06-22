import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PROJECT_BY_TOKEN, GET_PROJECT_MESSAGES, CREATE_PROJECT_MESSAGE } from "@/lib/nhost-graphql"

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const project = await adminRequest(GET_PROJECT_BY_TOKEN, { token })
    const projects = project?.projects ?? []
    if (projects.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const data = await adminRequest(GET_PROJECT_MESSAGES, { projectId: projects[0].id })
    return NextResponse.json(data?.project_messages ?? [])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const project = await adminRequest(GET_PROJECT_BY_TOKEN, { token })
    const projects = project?.projects ?? []
    if (projects.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await req.json()
    const data = await adminRequest(CREATE_PROJECT_MESSAGE, {
      projectId: projects[0].id,
      sender: "customer",
      message: body.message,
    })
    return NextResponse.json(data?.insert_project_messages_one, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
