import { NextResponse } from "next/server"

const NHOST_STORAGE_URL =
  "https://qoiiuebjfveqekkrpcrm.storage.eu-central-1.nhost.run/v1"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const adminSecret = process.env.NHOST_ADMIN_SECRET

  if (!adminSecret) {
    return NextResponse.json(
      { error: "Depolama yapılandırması eksik" },
      { status: 500 }
    )
  }

  const response = await fetch(`${NHOST_STORAGE_URL}/files/${encodeURIComponent(id)}`, {
    headers: { "x-hasura-admin-secret": adminSecret },
    cache: "force-cache",
  })

  if (!response.ok || !response.body) {
    return NextResponse.json(
      { error: "Görsel bulunamadı" },
      { status: response.status }
    )
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
