import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import {
  DELETE_DEMO_PAGE,
  GET_DEMO_PAGE_BY_ID,
  UPDATE_DEMO_PAGE,
} from "@/lib/nhost-graphql"
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
import { deleteDemoFiles } from "@/lib/demo-page-storage"

type Context = { params: Promise<{ id: string }> }

type DemoPageRecord = {
  id: string
  subdomain: string
  html_content: string
  original_filename: string | null
}

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
  return { ...page, ...decodeDemoFilename(page.original_filename ?? "") }
}

function duplicateResponse(error: unknown) {
  const message = errorMessage(error)
  const duplicate = message.toLowerCase().includes("uniqueness") || message.toLowerCase().includes("unique")
  return NextResponse.json(
    { error: duplicate ? "Bu alt alan adı daha önce kullanılmış." : message },
    { status: duplicate ? 409 : 500 },
  )
}

async function getExisting(id: string) {
  const data = await adminRequest(GET_DEMO_PAGE_BY_ID, { id })
  return (data?.demo_pages_by_pk ?? null) as DemoPageRecord | null
}

function storedAssetIds(htmlContent: string) {
  const { manifest } = readDemoPage(htmlContent)
  return manifest?.files.map((file) => file.storageId) ?? []
}

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const { id } = await params
    const contentType = request.headers.get("content-type") ?? ""
    const changes: Record<string, unknown> = { updated_at: new Date().toISOString() }
    let replacedAssets: string[] = []

    if (contentType.includes("multipart/form-data")) {
      const existing = await getExisting(id)
      if (!existing) {
        return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 })
      }

      const formData = await request.formData()
      const file = formData.get("file")
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
      changes.html_content = htmlContent
      changes.original_filename = file.name
      changes.html_size = file.size
      replacedAssets = storedAssetIds(existing.html_content)
    } else {
      const body = (await request.json()) as { name?: string; subdomain?: string; published?: boolean }
      if (typeof body.name === "string") {
        const name = body.name.trim()
        if (!name) return NextResponse.json({ error: "Sayfa adı zorunludur." }, { status: 400 })
        changes.name = name
      }
      if (typeof body.published === "boolean") changes.published = body.published
      if (typeof body.subdomain === "string") {
        if (!isUsableDemoSubdomain(body.subdomain)) {
          return NextResponse.json({ error: "Geçerli ve kullanılabilir bir alt alan adı girin." }, { status: 400 })
        }
        changes.subdomain = normalizeDemoSubdomain(body.subdomain)
      }
    }

    const data = await adminRequest(UPDATE_DEMO_PAGE, { id, changes })
    const updated = data?.update_demo_pages_by_pk as DemoPageRow | null
    if (!updated) {
      return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 })
    }

    if (replacedAssets.length) await deleteDemoFiles(replacedAssets)
    return NextResponse.json(withFileInfo(updated))
  } catch (error) {
    return duplicateResponse(error)
  }
}

export async function PUT(request: Request, { params }: Context) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const { id } = await params
    const length = Number(request.headers.get("content-length") ?? 0)
    if (length > MAX_SITE_DOCUMENT_BYTES + 100_000) {
      return NextResponse.json({ error: "Site giriş dosyası izin verilen boyutu aşıyor." }, { status: 413 })
    }

    const existing = await getExisting(id)
    if (!existing) {
      return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 })
    }

    const body = (await request.json()) as {
      html_content?: unknown
      original_filename?: unknown
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
    const fallbackName = decodeDemoFilename(existing.original_filename ?? "").original_filename
    const originalFilename = encodeDemoFilename(
      typeof body.original_filename === "string" && body.original_filename.trim()
        ? body.original_filename
        : fallbackName,
      { fileCount: totals.fileCount, siteSize: totals.siteSize + indexSize },
    )

    const data = await adminRequest(UPDATE_DEMO_PAGE, {
      id,
      changes: {
        html_content: storedHtml,
        original_filename: originalFilename,
        html_size: indexSize,
        updated_at: new Date().toISOString(),
      },
    })
    const updated = data?.update_demo_pages_by_pk as DemoPageRow | null
    if (!updated) {
      return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 })
    }

    const kept = new Set(manifest.files.map((file) => file.storageId))
    const removed = storedAssetIds(existing.html_content).filter((assetId) => !kept.has(assetId))
    if (removed.length) await deleteDemoFiles(removed)

    return NextResponse.json(withFileInfo(updated))
  } catch (error) {
    return duplicateResponse(error)
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const { id } = await params
    const existing = await getExisting(id)
    const data = await adminRequest(DELETE_DEMO_PAGE, { id })
    const deleted = data?.delete_demo_pages_by_pk

    if (existing) {
      const assetIds = storedAssetIds(existing.html_content)
      if (assetIds.length) await deleteDemoFiles(assetIds)
    }

    return NextResponse.json(deleted)
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}
