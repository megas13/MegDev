import { strFromU8, unzipSync } from "fflate"
import {
  MAX_ASSET_BYTES,
  MAX_ASSET_COUNT,
  MAX_HTML_BYTES,
  MAX_TOTAL_ASSET_BYTES,
  MAX_ZIP_BYTES,
  findDemoIndex,
  isAllowedDemoPath,
  isIgnoredDemoPath,
  looksLikeHtml,
  normalizeDemoPath,
  stripSingleTopFolder,
} from "./demo-page-files"

export type SiteAsset = {
  path: string
  data: Uint8Array
  size: number
}

export type PreparedSite = {
  html: string
  index: string
  filename: string
  files: SiteAsset[]
  fileCount: number
  siteSize: number
}

export type SiteProgress = {
  label: string
  current: number
  total: number
}

const MAX_DECOMPRESSED_BYTES = MAX_TOTAL_ASSET_BYTES + MAX_HTML_BYTES

export async function prepareSite(
  file: File,
  onProgress: (progress: SiteProgress) => void,
): Promise<PreparedSite> {
  if (file.size > MAX_ZIP_BYTES) {
    throw new Error("ZIP dosyası en fazla 60 MB olabilir.")
  }

  onProgress({ label: "ZIP açılıyor", current: 0, total: 1 })

  const buffer = new Uint8Array(await file.arrayBuffer())
  let accepted = 0
  let totalSize = 0
  const rejected: string[] = []

  const unzipped = unzipSync(buffer, {
    filter: (entry) => {
      if (entry.name.endsWith("/") || isIgnoredDemoPath(entry.name)) return false
      if (entry.originalSize < 1) return false
      if (entry.originalSize > MAX_ASSET_BYTES) {
        rejected.push(`${entry.name} (4 MB üstü)`)
        return false
      }
      accepted += 1
      if (accepted > MAX_ASSET_COUNT + 1) {
        rejected.push("ZIP içinde çok fazla dosya var (en fazla 500).")
        return false
      }
      totalSize += entry.originalSize
      if (totalSize > MAX_DECOMPRESSED_BYTES) {
        rejected.push("ZIP açıldığında toplam boyut çok büyük.")
        return false
      }
      return true
    },
  })

  if (rejected.length) throw new Error(rejected[0])

  const rawEntries = Object.entries(unzipped)
    .filter(([name]) => !isIgnoredDemoPath(name))
    .map(([name, data]) => ({ path: name.replace(/\\/g, "/"), data }))
    .filter((entry) => entry.data.length > 0)

  const normalized: Array<{ path: string; data: Uint8Array }> = []
  const seen = new Set<string>()

  for (const entry of rawEntries) {
    const path = normalizeDemoPath(entry.path)
    if (!path) throw new Error(`Geçersiz dosya yolu: ${entry.path}`)
    if (isIgnoredDemoPath(path)) continue
    if (!isAllowedDemoPath(path)) throw new Error(`Desteklenmeyen dosya türü: ${path}`)

    const key = path.toLowerCase()
    if (seen.has(key)) throw new Error(`ZIP içinde aynı dosya iki kez var: ${path}`)
    seen.add(key)
    normalized.push({ path, data: entry.data })
  }

  const stripped = stripSingleTopFolder(normalized.map((entry) => entry.path))
  const entries = normalized.map((entry, index) => ({ ...entry, path: stripped.paths[index] }))

  const index = findDemoIndex(entries.map((entry) => entry.path))
  if (!index) throw new Error("ZIP içinde kök dizinde index.html (veya index.htm) bulunamadı.")

  const indexEntry = entries.find((entry) => entry.path === index)
  if (!indexEntry) throw new Error("Site giriş dosyası bulunamadı.")

  const html = strFromU8(indexEntry.data)
  if (!looksLikeHtml(html)) throw new Error("Giriş dosyası geçerli bir HTML belgesi değil.")

  const indexSize = new TextEncoder().encode(html).byteLength
  if (indexSize > MAX_HTML_BYTES) throw new Error("Giriş HTML dosyası en fazla 4 MB olabilir.")

  const files = entries
    .filter((entry) => entry !== indexEntry)
    .map((entry) => ({ path: entry.path, data: entry.data, size: entry.data.length }))

  if (files.length > MAX_ASSET_COUNT) {
    throw new Error(`Bir sitede en fazla ${MAX_ASSET_COUNT} dosya olabilir.`)
  }

  const assetSize = files.reduce((total, entry) => total + entry.size, 0)
  if (assetSize > MAX_TOTAL_ASSET_BYTES) {
    throw new Error("Site dosyalarının toplam boyutu en fazla 30 MB olabilir.")
  }

  return {
    html,
    index,
    filename: file.name,
    files,
    fileCount: files.length + 1,
    siteSize: assetSize + indexSize,
  }
}
