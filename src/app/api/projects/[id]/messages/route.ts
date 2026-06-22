import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PROJECT_MESSAGES, CREATE_PROJECT_MESSAGE } from "@/lib/nhost-graphql"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await adminRequest(GET_PROJECT_MESSAGES, { projectId: id })
    return NextResponse.json(data?.project_messages ?? [])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const data = await adminRequest(CREATE_PROJECT_MESSAGE, {
      projectId: id,
      sender: "admin",
      message: body.message,
    })
    return NextResponse.json(data?.insert_project_messages_one, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
