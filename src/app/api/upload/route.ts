import { NextResponse } from "next/server"

const NHOST_STORAGE_URL =
  "https://qoiiuebjfveqekkrpcrm.storage.eu-central-1.nhost.run/v1"
const NHOST_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET!

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Sadece görsel dosyaları yüklenebilir" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'ı geçemez" },
        { status: 400 }
      )
    }

    const uploadForm = new FormData()
    uploadForm.append("file[]", file, file.name)
    uploadForm.append("metadata[]", JSON.stringify({ name: file.name }))

    const res = await fetch(`${NHOST_STORAGE_URL}/files`, {
      method: "POST",
      headers: {
        "x-hasura-admin-secret": NHOST_ADMIN_SECRET,
      },
      body: uploadForm,
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json(
        { error: `Yükleme hatası: ${errText}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    // Nhost returns processedFiles array
    const fileId =
      data?.processedFiles?.[0]?.id ?? data?.[0]?.id ?? data?.id

    if (!fileId) {
      return NextResponse.json(
        { error: "Dosya ID alınamadı" },
        { status: 500 }
      )
    }

    const publicUrl = `${NHOST_STORAGE_URL}/files/${fileId}`
    return NextResponse.json({ url: publicUrl, id: fileId })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
