export const MAX_HTML_BYTES = 4_000_000
export const MAX_ASSET_BYTES = 4_000_000
export const MAX_TOTAL_ASSET_BYTES = 30_000_000
export const MAX_ASSET_COUNT = 500
export const MAX_ZIP_BYTES = 60_000_000
export const MAX_MANIFEST_BYTES = 400_000
export const MAX_SITE_DOCUMENT_BYTES = 4_200_000
export const MAX_DEMO_PATH_LENGTH = 320
export const MAX_DEMO_PATH_SEGMENTS = 16
export const MAX_DEMO_SEGMENT_LENGTH = 120

export const RESERVED_DEMO_SUBDOMAINS = new Set(["www", "admin", "api", "mail", "ftp", "app"])

export type DemoAssetRef = {
  path: string
  storageId: string
  size: number
}

export type DemoManifest = {
  version: 1
  index: string
  files: DemoAssetRef[]
}

export type DemoFileInfo = {
  original_filename: string
  kind: "html" | "site"
  file_count: number
  site_size: number | null
}

const CONTENT_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  map: "application/json; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  webmanifest: "application/manifest+json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  ico: "image/x-icon",
  bmp: "image/bmp",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  pdf: "application/pdf",
  wasm: "application/wasm",
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  hdr: "image/vnd.radiance",
}

const ALLOWED_EXTENSIONS = new Set(Object.keys(CONTENT_TYPES))

const IGNORED_DIRECTORIES = new Set(["__macosx", ".git", ".svn", "node_modules"])
const IGNORED_FILES = new Set([
  ".ds_store",
  "thumbs.db",
  "desktop.ini",
  ".gitignore",
  ".htaccess",
  "cname",
  "license",
  "license.txt",
  "readme.md",
  "readme.txt",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
])

const SITE_META_MARKER = "#megdev-site="

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function normalizeDemoSubdomain(value: string) {
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

export function isUsableDemoSubdomain(value: string) {
  const subdomain = normalizeDemoSubdomain(value)
  return Boolean(subdomain) && subdomain.length <= 63 && !RESERVED_DEMO_SUBDOMAINS.has(subdomain)
}

export function utf8ByteLength(value: string) {
  return new TextEncoder().encode(value).byteLength
}

export function looksLikeHtml(value: string) {
  return /<html[\s>]|<!doctype\s+html/i.test(value)
}

export function normalizeDemoPath(raw: string): string | null {
  if (!raw || raw.length > MAX_DEMO_PATH_LENGTH) return null

  let value = raw.replace(/\\/g, "/")
  while (value.startsWith("./")) value = value.slice(2)
  value = value.replace(/^\/+/, "")
  if (!value) return null
  if (value.includes("?") || value.includes("#") || value.includes("%")) return null
  if (/[\u0000-\u001f\u007f]/.test(value)) return null

  const segments = value.split("/")
  if (segments.length > MAX_DEMO_PATH_SEGMENTS) return null

  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") return null
    if (segment.length > MAX_DEMO_SEGMENT_LENGTH) return null
    if (/[<>:"|*\\]/.test(segment)) return null
    if (segment !== segment.trim()) return null
    if (segment.endsWith(".")) return null
  }

  return segments.join("/")
}

export function isIgnoredDemoPath(raw: string) {
  const segments = raw.replace(/\\/g, "/").split("/").filter(Boolean)
  if (!segments.length) return true
  const fileName = segments[segments.length - 1].toLowerCase()
  if (IGNORED_FILES.has(fileName) || fileName.startsWith("._")) return true
  return segments.some((segment) => IGNORED_DIRECTORIES.has(segment.toLowerCase()))
}

export function demoFileExtension(path: string) {
  const fileName = path.slice(path.lastIndexOf("/") + 1)
  const dot = fileName.lastIndexOf(".")
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : ""
}

export function demoContentType(path: string) {
  const extension = demoFileExtension(path)
  return Object.prototype.hasOwnProperty.call(CONTENT_TYPES, extension)
    ? CONTENT_TYPES[extension]
    : "application/octet-stream"
}

export function isAllowedDemoPath(path: string) {
  return ALLOWED_EXTENSIONS.has(demoFileExtension(path))
}

export function isDemoHtmlPath(path: string) {
  const extension = demoFileExtension(path)
  return extension === "html" || extension === "htm"
}

export function isDemoStorageId(value: string) {
  return UUID_PATTERN.test(value)
}

export function basenameDemoPath(path: string) {
  return path.slice(path.lastIndexOf("/") + 1)
}

export function stripSingleTopFolder(paths: string[]) {
  if (!paths.length) return { paths, prefix: "" }
  const first = paths[0].split("/")[0]
  const wrapped = paths.every((path) => path.includes("/") && path.split("/")[0] === first)
  if (!wrapped) return { paths, prefix: "" }
  return {
    paths: paths.map((path) => path.slice(first.length + 1)),
    prefix: `${first}/`,
  }
}

export function findDemoIndex(paths: string[]) {
  const rootFiles = paths.filter((path) => !path.includes("/"))
  const htmlFiles = rootFiles.filter(isDemoHtmlPath)
  return (
    htmlFiles.find((path) => path.toLowerCase() === "index.html") ??
    htmlFiles.find((path) => path.toLowerCase() === "index.htm") ??
    (htmlFiles.length === 1 ? htmlFiles[0] : null)
  )
}

export function validateDemoManifest(input: unknown): DemoManifest {
  if (!input || typeof input !== "object") {
    throw new Error("Site dosya listesi geçersiz.")
  }

  const record = input as Record<string, unknown>
  if (record.version !== 1) {
    throw new Error("Desteklenmeyen site sürümü.")
  }

  const index = typeof record.index === "string" ? normalizeDemoPath(record.index) : null
  if (!index || !isDemoHtmlPath(index)) {
    throw new Error("Site giriş dosyası geçersiz.")
  }
  if (index.includes("/")) {
    throw new Error("Site giriş dosyası kök dizinde olmalıdır.")
  }

  if (!Array.isArray(record.files)) {
    throw new Error("Site dosya listesi geçersiz.")
  }
  if (record.files.length > MAX_ASSET_COUNT) {
    throw new Error(`Bir sitede en fazla ${MAX_ASSET_COUNT} dosya olabilir.`)
  }

  const files: DemoAssetRef[] = []
  const seen = new Set<string>()
  let totalSize = 0

  for (const entry of record.files) {
    if (!entry || typeof entry !== "object") {
      throw new Error("Site dosya listesi geçersiz.")
    }

    const item = entry as Record<string, unknown>
    const path = typeof item.path === "string" ? normalizeDemoPath(item.path) : null
    if (!path) throw new Error("Site içinde geçersiz bir dosya yolu var.")
    if (isIgnoredDemoPath(path)) throw new Error(`Yayınlanamayan dosya: ${path}`)
    if (!isAllowedDemoPath(path)) throw new Error(`Desteklenmeyen dosya türü: ${path}`)
    if (path.toLowerCase() === index.toLowerCase()) {
      throw new Error("Giriş dosyası ayrıca yüklenemez.")
    }

    const storageId = typeof item.storageId === "string" ? item.storageId.trim() : ""
    if (!isDemoStorageId(storageId)) {
      throw new Error(`Dosya kimliği geçersiz: ${path}`)
    }

    const size = typeof item.size === "number" ? item.size : Number.NaN
    if (!Number.isInteger(size) || size < 1 || size > MAX_ASSET_BYTES) {
      throw new Error(`Dosya boyutu geçersiz: ${path}`)
    }

    const key = path.toLowerCase()
    if (seen.has(key)) throw new Error(`Aynı dosya iki kez eklenmiş: ${path}`)
    seen.add(key)
    totalSize += size
    files.push({ path, storageId, size })
  }

  if (totalSize > MAX_TOTAL_ASSET_BYTES) {
    throw new Error("Site dosyalarının toplam boyutu çok büyük.")
  }

  return { version: 1, index, files }
}

export function demoManifestTotals(manifest: DemoManifest) {
  return {
    fileCount: manifest.files.length + 1,
    siteSize: manifest.files.reduce((total, file) => total + file.size, 0),
  }
}

export type DemoFileMatch = { kind: "index" } | { kind: "asset"; file: DemoAssetRef } | null

export function matchDemoRequestPath(manifest: DemoManifest, rawPath: string): DemoFileMatch {
  let value: string
  try {
    value = decodeURIComponent(rawPath)
  } catch {
    return null
  }

  value = value.replace(/\\/g, "/").replace(/^\/+/, "")
  if (!value) return { kind: "index" }
  if (value.toLowerCase() === manifest.index.toLowerCase()) return { kind: "index" }

  const byPath = new Map(manifest.files.map((file) => [file.path.toLowerCase(), file]))
  const candidates = [value, `${value}/index.html`, `${value}/index.htm`, `${value}.html`, `${value}.htm`]

  for (const candidate of candidates) {
    const normalized = normalizeDemoPath(candidate)
    if (!normalized) continue
    const file = byPath.get(normalized.toLowerCase())
    if (file) return { kind: "asset", file }
  }

  return null
}

export function encodeDemoFilename(filename: string, info: { fileCount: number; siteSize: number }) {
  const clean = filename.trim().slice(0, 180) || "site.zip"
  return `${clean}${SITE_META_MARKER}${JSON.stringify({ files: info.fileCount, size: info.siteSize })}`
}

export function decodeDemoFilename(value: string): DemoFileInfo {
  const at = value.lastIndexOf(SITE_META_MARKER)
  if (at < 0) {
    return { original_filename: value, kind: "html", file_count: 1, site_size: null }
  }

  const original_filename = value.slice(0, at) || "site.zip"
  try {
    const parsed = JSON.parse(value.slice(at + SITE_META_MARKER.length)) as {
      files?: unknown
      size?: unknown
    }
    const files = typeof parsed.files === "number" && parsed.files > 0 ? Math.floor(parsed.files) : 1
    const size = typeof parsed.size === "number" && parsed.size > 0 ? Math.floor(parsed.size) : null
    return { original_filename, kind: "site", file_count: files, site_size: size }
  } catch {
    return { original_filename, kind: "site", file_count: 1, site_size: null }
  }
}
