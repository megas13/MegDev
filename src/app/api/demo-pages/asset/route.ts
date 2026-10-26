import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import {
  MAX_ASSET_BYTES,
  MAX_ASSET_COUNT,
  basenameDemoPath,
  demoContentType,
  isAllowedDemoPath,
  isDemoStorageId,
  isIgnoredDemoPath,
  normalizeDemoPath,
} from "@/lib/demo-page-files"
import { deleteDemoFiles, uploadDemoFile } from "@/lib/demo-page-storage"

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const length = Number(request.headers.get("content-length") ?? 0)
    if (length > MAX_ASSET_BYTES + 500_000) {
      return NextResponse.json({ error: "Dosya en fazla 4 MB olabilir." }, { status: 413 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const path = normalizeDemoPath(String(formData.get("path") ?? ""))

    if (!(file instanceof File) || file.size < 1) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 })
    }
    if (file.size > MAX_ASSET_BYTES) {
      return NextResponse.json({ error: `${path || file.name} dosyası en fazla 4 MB olabilir.` }, { status: 413 })
    }
    if (!path || !isAllowedDemoPath(path) || isIgnoredDemoPath(path)) {
      return NextResponse.json({ error: "Dosya yolu veya türü desteklenmiyor." }, { status: 400 })
    }

    const upload = new File([file], basenameDemoPath(path), { type: demoContentType(path) })
    const stored = await uploadDemoFile(upload)

    return NextResponse.json({
      path,
      storageId: stored.id,
      size: stored.size,
      contentType: demoContentType(path),
    })
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { ids?: unknown }
    const ids = Array.isArray(body.ids)
      ? body.ids.filter((id): id is string => typeof id === "string" && isDemoStorageId(id))
      : []

    if (ids.length > MAX_ASSET_COUNT) {
      return NextResponse.json({ error: "Tek seferde en fazla 500 dosya silinebilir." }, { status: 400 })
    }

    await deleteDemoFiles(ids)
    return NextResponse.json({ deleted: ids.length })
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 })
  }
}
