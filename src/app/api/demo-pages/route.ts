import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { CREATE_DEMO_PAGE, GET_DEMO_PAGES } from "@/lib/nhost-graphql"
import {
  MAX_HTML_BYTES,
  MAX_SITE_DOCUMENT_BYTES,
  decodeDemoFilename,
  demoManifestTotals,
  encodeDemoFilename,
  isUsableDemoSubdomain,
  looksLikeHtml,
  normalizeDemoSubdomain,
  utf8ByteLength,
} from "@/lib/demo-page-files"
import { embedDemoManifest, readDemoPage } from "@/lib/demo-page-manifest"

type DemoPageRow = {
  id: string
  name: string
  subdomain: string
  original_filename: string
  html_size: number
  published: boolean
  created_at: string
  updated_at: string
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function withFileInfo(page: DemoPageRow) {
  const info = decodeDemoFilename(page.original_filename ?? "")
  return { ...page, ...info }
}

function insertPage(object: Record<string, unknown>) {
  return adminRequest(CREATE_DEMO_PAGE, { object })
}

function duplicateResponse(error: unknown) {
  const message = errorMessage(error)
  const duplicate = message.toLowerCase().includes("uniqueness") || message.toLowerCase().includes("unique")
  return NextResponse.json(
    { error: duplicate ? "Bu alt alan adı daha önce kullanılmış." : message },
    { status: duplicate ? 409 : 500 },
  )
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const data = await adminRequest(GET_DEMO_PAGES)
    const pages = (data?.demo_pages ?? []) as DemoPageRow[]
    return NextResponse.json(pages.map(withFileInfo))
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}

async function createSitePage(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0)
  if (length > MAX_SITE_DOCUMENT_BYTES + 100_000) {
    return NextResponse.json({ error: "Site giriş dosyası izin verilen boyutu aşıyor." }, { status: 413 })
  }

  const body = (await request.json()) as {
    mode?: unknown
    name?: unknown
    subdomain?: unknown
    published?: unknown
    html_content?: unknown
    original_filename?: unknown
  }

  if (body.mode !== "site") {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const rawSubdomain = typeof body.subdomain === "string" ? body.subdomain : ""
  const subdomain = normalizeDemoSubdomain(rawSubdomain)
  const published = typeof body.published === "boolean" ? body.published : true

  if (!name) {
    return NextResponse.json({ error: "Sayfa adı zorunludur." }, { status: 400 })
  }
  if (!isUsableDemoSubdomain(rawSubdomain)) {
    return NextResponse.json({ error: "Geçerli ve kullanılabilir bir alt alan adı girin." }, { status: 400 })
  }

  const htmlContent = typeof body.html_content === "string" ? body.html_content : ""
  if (!htmlContent || !looksLikeHtml(htmlContent)) {
    return NextResponse.json({ error: "Site giriş dosyası geçerli bir HTML belgesi değil." }, { status: 400 })
  }

  const { manifest, html } = readDemoPage(htmlContent)
  if (!manifest) {
    return NextResponse.json({ error: "Site dosya listesi bulunamadı veya geçersiz." }, { status: 400 })
  }
  if (!html.trim()) {
    return NextResponse.json({ error: "Site giriş dosyası boş." }, { status: 400 })
  }

  const indexSize = utf8ByteLength(html)
  if (indexSize > MAX_HTML_BYTES) {
    return NextResponse.json({ error: "Site giriş dosyası en fazla 4 MB olabilir." }, { status: 400 })
  }

  const storedHtml = embedDemoManifest(html, manifest)
  if (utf8ByteLength(storedHtml) > MAX_SITE_DOCUMENT_BYTES) {
    return NextResponse.json({ error: "Site giriş dosyası ve dosya listesi çok büyük." }, { status: 413 })
  }

  const totals = demoManifestTotals(manifest)
  const originalFilename = encodeDemoFilename(
    typeof body.original_filename === "string" ? body.original_filename : "site.zip",
    { fileCount: totals.fileCount, siteSize: totals.siteSize + indexSize },
  )

  const data = await insertPage({
    name,
    subdomain,
    html_content: storedHtml,
    original_filename: originalFilename,
    html_size: indexSize,
    published,
    updated_at: new Date().toISOString(),
  })

  const inserted = data?.insert_demo_pages_one as DemoPageRow | null
  return NextResponse.json(inserted ? withFileInfo(inserted) : inserted, { status: 201 })
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const contentType = request.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      return await createSitePage(request)
    }

    const formData = await request.formData()
    const name = String(formData.get("name") ?? "").trim()
    const rawSubdomain = String(formData.get("subdomain") ?? "")
    const subdomain = normalizeDemoSubdomain(rawSubdomain)
    const published = String(formData.get("published") ?? "true") === "true"
    const file = formData.get("file")

    if (!name) {
      return NextResponse.json({ error: "Sayfa adı zorunludur." }, { status: 400 })
    }
    if (!isUsableDemoSubdomain(rawSubdomain)) {
      return NextResponse.json({ error: "Geçerli ve kullanılabilir bir alt alan adı girin." }, { status: 400 })
    }
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".html")) {
      return NextResponse.json({ error: "Yalnızca .html dosyası yükleyebilirsiniz." }, { status: 400 })
    }
    if (file.size < 1 || file.size > MAX_HTML_BYTES) {
      return NextResponse.json({ error: "HTML dosyası en fazla 4 MB olabilir." }, { status: 400 })
    }

    const htmlContent = await file.text()
    if (!looksLikeHtml(htmlContent)) {
      return NextResponse.json({ error: "Dosya geçerli bir HTML belgesi gibi görünmüyor." }, { status: 400 })
    }

    const data = await insertPage({
      name,
      subdomain,
      html_content: htmlContent,
      original_filename: file.name,
      html_size: file.size,
      published,
      updated_at: new Date().toISOString(),
    })

    const inserted = data?.insert_demo_pages_one as DemoPageRow | null
    return NextResponse.json(inserted ? withFileInfo(inserted) : inserted, { status: 201 })
  } catch (error) {
    return duplicateResponse(error)
  }
}
