import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { CREATE_DEMO_PAGE, GET_DEMO_PAGES } from "@/lib/nhost-graphql"

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

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const data = await adminRequest(GET_DEMO_PAGES)
    return NextResponse.json(data?.demo_pages ?? [])
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const name = String(formData.get("name") ?? "").trim()
    const subdomain = normalizeSubdomain(String(formData.get("subdomain") ?? ""))
    const published = String(formData.get("published") ?? "true") === "true"
    const file = formData.get("file")

    if (!name) {
      return NextResponse.json({ error: "Sayfa adı zorunludur." }, { status: 400 })
    }
    if (!subdomain || subdomain.length > 63 || RESERVED_SUBDOMAINS.has(subdomain)) {
      return NextResponse.json({ error: "Geçerli ve kullanılabilir bir alt alan adı girin." }, { status: 400 })
    }
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

    const data = await adminRequest(CREATE_DEMO_PAGE, {
      object: {
        name,
        subdomain,
        html_content: htmlContent,
        original_filename: file.name,
        html_size: file.size,
        published,
        updated_at: new Date().toISOString(),
      },
    })

    return NextResponse.json(data?.insert_demo_pages_one, { status: 201 })
  } catch (error) {
    const message = errorMessage(error)
    const duplicate = message.toLowerCase().includes("uniqueness") || message.toLowerCase().includes("unique")
    return NextResponse.json(
      { error: duplicate ? "Bu alt alan adı daha önce kullanılmış." : message },
      { status: duplicate ? 409 : 500 },
    )
  }
}
