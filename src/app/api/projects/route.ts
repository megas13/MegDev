import { NextResponse } from "next/server"
import { adminRequest } from "@/lib/nhost"
import { GET_PROJECTS, CREATE_PROJECT } from "@/lib/nhost-graphql"
import crypto from "node:crypto"

export async function GET() {
  try {
    const data = await adminRequest(GET_PROJECTS)
    return NextResponse.json(data?.projects ?? [])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const token = crypto.randomUUID().split("-").slice(0, 2).join("") + Date.now().toString(36)
    
    // Set a default 60-day target timeline
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 60)
    
    const defaultDescription = JSON.stringify({
      summary: body.description || "",
      target_date: targetDate.toISOString().split("T")[0],
      health: "good",
      preview_url: "",
      tech_stack: ["Next.js", "TailwindCSS", "PostgreSQL"],
      roadmap: [
        { name: "Planlama & UI/UX Tasarım", progress: "100%", status: "done" },
        { name: "Veritabanı Mimari & Backend API", progress: "0%", status: "pending" },
        { name: "Frontend Geliştirme & Entegrasyonlar", progress: "0%", status: "pending" },
        { name: "Kapsamlı Test & Canlıya Alım", progress: "0%", status: "pending" }
      ],
      tasks: [
        { title: "Veritabanı Şeması Tasarımı ve PostgreSQL Migration", category: "Backend", status: "todo", assignee: "Can Y.", priority: "Yüksek" },
        { title: "Kullanıcı Arayüzü UI/UX Figma Taslaklarının Kodlanması", category: "Tasarım", status: "todo", assignee: "Elif Ö.", priority: "Orta" }
      ]
    })

    const data = await adminRequest(CREATE_PROJECT, {
      title: body.title,
      description: defaultDescription,
      customerName: body.customer_name,
      customerEmail: body.customer_email,
      customerPhone: body.customer_phone || null,
      status: body.status || "beklemede",
      token,
    })
    return NextResponse.json(data?.insert_projects_one, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
