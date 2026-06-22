import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from "@/lib/nhost-graphql"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await adminRequest(GET_PROJECT, { id })
    if (!data?.projects_by_pk) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(data.projects_by_pk)
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    
    // Fetch the current project to avoid wiping out fields that are omitted in the request
    const currentRes = await adminRequest(GET_PROJECT, { id })
    const current = currentRes?.projects_by_pk
    
    if (!current) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const data = await adminRequest(UPDATE_PROJECT, {
      id,
      title: body.title !== undefined ? body.title : current.title,
      description: body.description !== undefined ? body.description : current.description,
      status: body.status !== undefined ? body.status : current.status,
      customerName: body.customer_name !== undefined ? body.customer_name : current.customer_name,
      customerEmail: body.customer_email !== undefined ? body.customer_email : current.customer_email,
      customerPhone: body.customer_phone !== undefined ? body.customer_phone : current.customer_phone,
    })
    return NextResponse.json(data?.update_projects_by_pk)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await adminRequest(DELETE_PROJECT, { id })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
