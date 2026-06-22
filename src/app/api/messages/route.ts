import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_MESSAGES, INSERT_MESSAGE } from "@/lib/nhost-graphql"

export async function GET() {
  try {
    const data = await adminRequest(GET_MESSAGES)
    return NextResponse.json(data?.contact_messages ?? [])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await adminRequest(INSERT_MESSAGE, {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      subject: body.subject,
      message: body.message,
    })
    return NextResponse.json(data?.insert_contact_messages_one, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
