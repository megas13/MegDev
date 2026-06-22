import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { MARK_MESSAGE_READ, DELETE_MESSAGE } from "@/lib/nhost-graphql"

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await adminRequest(MARK_MESSAGE_READ, { id })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await adminRequest(DELETE_MESSAGE, { id })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
