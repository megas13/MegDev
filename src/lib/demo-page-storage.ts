import { isDemoStorageId } from "./demo-page-files"

const NHOST_STORAGE_URL =
  "https://vkzrwkdgjqrsfhxwlxdy.storage.eu-central-1.nhost.run/v1"

function storageSecret() {
  const secret = process.env.NHOST_ADMIN_SECRET
  if (!secret) throw new Error("Depolama yapılandırması eksik.")
  return secret
}

export async function uploadDemoFile(file: File) {
  const form = new FormData()
  form.append("file[]", file, file.name)
  form.append("metadata[]", JSON.stringify({ name: file.name }))

  const response = await fetch(`${NHOST_STORAGE_URL}/files`, {
    method: "POST",
    headers: { "x-hasura-admin-secret": storageSecret() },
    body: form,
    cache: "no-store",
  })

  if (!response.ok) {
    const detail = (await response.text()).replace(/\s+/g, " ").slice(0, 200)
    throw new Error(`Dosya yüklenemedi (${response.status})${detail ? `: ${detail}` : "."}`)
  }

  const data = (await response.json()) as {
    processedFiles?: Array<{ id?: string; size?: number }>
    id?: string
    [key: string]: unknown
  }
  const uploaded = data?.processedFiles?.[0]
  const id = uploaded?.id ?? (Array.isArray(data) ? (data[0] as { id?: string } | undefined)?.id : undefined) ?? data?.id
  if (!id || !isDemoStorageId(id)) throw new Error("Yüklenen dosyanın kimliği alınamadı.")

  return {
    id,
    size: typeof uploaded?.size === "number" ? uploaded.size : file.size,
  }
}

export async function deleteDemoFiles(ids: string[]) {
  const secret = process.env.NHOST_ADMIN_SECRET
  if (!secret) return

  const unique = [...new Set(ids)].filter(isDemoStorageId)
  for (let index = 0; index < unique.length; index += 8) {
    const batch = unique.slice(index, index + 8)
    await Promise.allSettled(
      batch.map((id) =>
        fetch(`${NHOST_STORAGE_URL}/files/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { "x-hasura-admin-secret": secret },
          cache: "no-store",
        }),
      ),
    )
  }
}

export async function fetchDemoFile(id: string, range: string | null) {
  if (!isDemoStorageId(id)) return null

  const headers: Record<string, string> = {
    "x-hasura-admin-secret": storageSecret(),
    "Accept-Encoding": "identity",
  }
  if (range) headers.Range = range

  return fetch(`${NHOST_STORAGE_URL}/files/${encodeURIComponent(id)}`, {
    headers,
    cache: "no-store",
  })
}
