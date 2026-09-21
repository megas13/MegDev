import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { DELETE_DEMO_PAGE, UPDATE_DEMO_PAGE } from "@/lib/nhost-graphql"

const MAX_HTML_SIZE = 4_000_000
const RESERVED_SUBDOMAINS = new Set(["www", "admin", "api", "mail", "ftp", "app"])

function normalizeSubdomain(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const { id } = await params
    const contentType = request.headers.get("content-type") ?? ""
    const changes: Record<string, unknown> = { updated_at: new Date().toISOString() }

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file")
      if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".html")) {
        return NextResponse.json({ error: "Yalnızca .html dosyası yükleyebilirsiniz." }, { status: 400 })
      }
      if (file.size < 1 || file.size > MAX_HTML_SIZE) {
        return NextResponse.json({ error: "HTML dosyası en fazla 4 MB olabilir." }, { status: 400 })
      }
      const htmlContent = await file.text()
      if (!/<html[\s>]|<!doctype\s+html/i.test(htmlContent)) {
        return NextResponse.json({ error: "Dosya geçerli bir HTML belgesi gibi görünmüyor." }, { status: 400 })
      }
      changes.html_content = htmlContent
      changes.original_filename = file.name
      changes.html_size = file.size
    } else {
      const body = (await request.json()) as { name?: string; subdomain?: string; published?: boolean }
      if (typeof body.name === "string") changes.name = body.name.trim()
      if (typeof body.published === "boolean") changes.published = body.published
      if (typeof body.subdomain === "string") {
        const subdomain = normalizeSubdomain(body.subdomain)
        if (!subdomain || subdomain.length > 63 || RESERVED_SUBDOMAINS.has(subdomain)) {
          return NextResponse.json({ error: "Geçerli ve kullanılabilir bir alt alan adı girin." }, { status: 400 })
        }
        changes.subdomain = subdomain
      }
    }

    const data = await adminRequest(UPDATE_DEMO_PAGE, { id, changes })
    return NextResponse.json(data?.update_demo_pages_by_pk)
  } catch (error) {
    const message = errorMessage(error)
    const duplicate = message.toLowerCase().includes("uniqueness") || message.toLowerCase().includes("unique")
    return NextResponse.json(
      { error: duplicate ? "Bu alt alan adı daha önce kullanılmış." : message },
      { status: duplicate ? 409 : 500 },
    )
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await adminRequest(DELETE_DEMO_PAGE, { id })
    return NextResponse.json(data?.delete_demo_pages_by_pk)
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}
