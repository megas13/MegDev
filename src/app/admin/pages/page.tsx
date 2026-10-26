"use client"

import { useLanguage } from "@/components/i18n/provider"
import { T, LocalizedElement } from "@/components/i18n/text"
import { useEffect, useRef, useState } from "react"
import {
  Check,
  Clipboard,
  ExternalLink,
  FileArchive,
  FileCode2,
  Globe2,
  Loader2,
  Power,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react"
import {
  MAX_HTML_BYTES,
  MAX_SITE_DOCUMENT_BYTES,
  basenameDemoPath,
  demoContentType,
  normalizeDemoSubdomain,
  utf8ByteLength,
  type DemoAssetRef,
  type DemoManifest,
} from "@/lib/demo-page-files"
import { embedDemoManifest } from "@/lib/demo-page-manifest"
import { prepareSite, type SiteAsset, type SiteProgress } from "@/lib/demo-page-site"

type DemoPage = {
  id: string
  name: string
  subdomain: string
  original_filename: string
  html_size: number
  published: boolean
  created_at: string
  updated_at: string
  kind: "html" | "site"
  file_count: number
  site_size: number | null
}

type UploadProgress = SiteProgress

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_DEMO_ROOT_DOMAIN || "megdev.com.tr"
const UPLOAD_CONCURRENCY = 3

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function isZipFile(file: File) {
  return file.name.toLowerCase().endsWith(".zip")
}

function errorFrom(reason: unknown) {
  return reason instanceof Error ? reason.message : String(reason)
}

async function responseError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: unknown }
    if (typeof data.error === "string" && data.error) return new Error(data.error)
  } catch {
    // The server did not return JSON; use the generic message below.
  }
  return new Error(fallback)
}

async function cleanupAssets(ids: string[]) {
  if (!ids.length) return
  try {
    await fetch("/api/demo-pages/asset", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
  } catch {
    // Orphaned storage files are harmless; the page itself was not created.
  }
}

async function uploadSiteAssets(
  files: SiteAsset[],
  onProgress: (current: number, total: number) => void,
) {
  const results: DemoAssetRef[] = new Array(files.length)
  const uploadedIds: string[] = []
  let next = 0
  let completed = 0
  let failure: unknown = null

  const worker = async () => {
    while (!failure) {
      const index = next
      next += 1
      if (index >= files.length) return

      const asset = files[index]
      try {
        const payload = new Uint8Array(asset.data.byteLength)
        payload.set(asset.data)

        const form = new FormData()
        form.set("path", asset.path)
        form.set(
          "file",
          new File([payload], basenameDemoPath(asset.path), { type: demoContentType(asset.path) }),
        )

        const response = await fetch("/api/demo-pages/asset", { method: "POST", body: form })
        if (!response.ok) throw await responseError(response, `${asset.path} yüklenemedi.`)

        const stored = (await response.json()) as { storageId?: unknown; size?: unknown }
        if (typeof stored.storageId !== "string" || !stored.storageId) {
          throw new Error(`${asset.path} için dosya kimliği alınamadı.`)
        }

        results[index] = {
          path: asset.path,
          storageId: stored.storageId,
          size: typeof stored.size === "number" ? stored.size : asset.size,
        }
        uploadedIds.push(stored.storageId)
        completed += 1
        onProgress(completed, files.length)
      } catch (error) {
        failure = error
        return
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(UPLOAD_CONCURRENCY, Math.max(files.length, 1)) },
    () => worker(),
  )
  await Promise.all(workers)

  if (failure) {
    await cleanupAssets(uploadedIds)
    throw failure
  }

  return results
}

export default function DemoPagesAdmin() {
  const { intlLocale, t } = useLanguage()

  const [pages, setPages] = useState<DemoPage[]>([])
  const [name, setName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const createFileInput = useRef<HTMLInputElement>(null)

  const fetchPages = async () => {
    const response = await fetch("/api/demo-pages", { cache: "no-store" })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Sayfalar alınamadı.")
    setPages(Array.isArray(result) ? result : [])
  }

  useEffect(() => {
    fetch("/api/demo-pages", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Sayfalar alınamadı.")
        return Array.isArray(result) ? result : []
      })
      .then(setPages)
      .catch((reason: unknown) => setError(errorFrom(reason)))
      .finally(() => setLoading(false))
  }, [])

  const resetCreateForm = () => {
    setName("")
    setSubdomain("")
    setFile(null)
    if (createFileInput.current) createFileInput.current.value = ""
  }

  const createPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return setError("Bir HTML veya ZIP dosyası seçin.")

    const normalizedSubdomain = normalizeDemoSubdomain(subdomain)
    if (!name.trim()) return setError("Sayfa adı zorunludur.")
    if (!normalizedSubdomain) return setError("Geçerli ve kullanılabilir bir alt alan adı girin.")

    setSaving(true)
    setError(null)
    setSuccess(null)
    setProgress(null)

    try {
      if (isZipFile(file)) {
        const prepared = await prepareSite(file, setProgress)
        setProgress({ label: "Dosyalar yükleniyor", current: 0, total: prepared.files.length })
        const assets = await uploadSiteAssets(prepared.files, (current, total) =>
          setProgress({ label: "Dosyalar yükleniyor", current, total }),
        )

        let requestStarted = false
        try {
          setProgress({ label: "Yayınlanıyor", current: prepared.files.length, total: prepared.files.length })
          const manifest: DemoManifest = { version: 1, index: prepared.index, files: assets }
          const htmlContent = embedDemoManifest(prepared.html, manifest)
          if (utf8ByteLength(htmlContent) > MAX_SITE_DOCUMENT_BYTES) {
            throw new Error("Site giriş dosyası ve dosya listesi çok büyük.")
          }

          requestStarted = true
          const response = await fetch("/api/demo-pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "site",
              name: name.trim(),
              subdomain: normalizedSubdomain,
              published: true,
              html_content: htmlContent,
              original_filename: prepared.filename,
            }),
          })
          if (!response.ok) {
            const failure = await responseError(response, "Sayfa oluşturulamadı.")
            await cleanupAssets(assets.map((asset) => asset.storageId))
            throw failure
          }

          setSuccess(`${normalizedSubdomain}.${ROOT_DOMAIN} yayına hazır.`)
        } catch (reason) {
          if (!requestStarted) await cleanupAssets(assets.map((asset) => asset.storageId))
          throw reason
        }
      } else {
        if (!file.name.toLowerCase().endsWith(".html")) {
          throw new Error("Yalnızca .html veya .zip dosyası yükleyebilirsiniz.")
        }
        if (file.size < 1 || file.size > MAX_HTML_BYTES) {
          throw new Error("HTML dosyası en fazla 4 MB olabilir.")
        }

        const data = new FormData()
        data.set("name", name.trim())
        data.set("subdomain", normalizedSubdomain)
        data.set("file", file)
        data.set("published", "true")

        const response = await fetch("/api/demo-pages", { method: "POST", body: data })
        if (!response.ok) throw await responseError(response, "Sayfa oluşturulamadı.")
        setSuccess(`${normalizedSubdomain}.${ROOT_DOMAIN} yayına hazır.`)
      }

      resetCreateForm()
      await fetchPages()
    } catch (reason) {
      setError(errorFrom(reason))
    } finally {
      setSaving(false)
      setProgress(null)
    }
  }

  const updatePage = async (id: string, changes: Partial<Pick<DemoPage, "published">>) => {
    setBusyId(id)
    setError(null)
    try {
      const response = await fetch(`/api/demo-pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      })
      if (!response.ok) throw await responseError(response, "Sayfa güncellenemedi.")
      await fetchPages()
    } catch (reason) {
      setError(errorFrom(reason))
    } finally {
      setBusyId(null)
    }
  }

  const replacePage = async (page: DemoPage, replacement: File | null) => {
    if (!replacement) return

    setBusyId(page.id)
    setError(null)
    setSuccess(null)
    setProgress(null)

    try {
      if (isZipFile(replacement)) {
        const prepared = await prepareSite(replacement, setProgress)
        setProgress({ label: "Dosyalar yükleniyor", current: 0, total: prepared.files.length })
        const assets = await uploadSiteAssets(prepared.files, (current, total) =>
          setProgress({ label: "Dosyalar yükleniyor", current, total }),
        )

        let requestStarted = false
        try {
          setProgress({ label: "Yayınlanıyor", current: prepared.files.length, total: prepared.files.length })
          const manifest: DemoManifest = { version: 1, index: prepared.index, files: assets }
          const htmlContent = embedDemoManifest(prepared.html, manifest)
          if (utf8ByteLength(htmlContent) > MAX_SITE_DOCUMENT_BYTES) {
            throw new Error("Site giriş dosyası ve dosya listesi çok büyük.")
          }

          requestStarted = true
          const response = await fetch(`/api/demo-pages/${page.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              html_content: htmlContent,
              original_filename: prepared.filename,
            }),
          })
          if (!response.ok) {
            const failure = await responseError(response, "Site güncellenemedi.")
            await cleanupAssets(assets.map((asset) => asset.storageId))
            throw failure
          }
        } catch (reason) {
          if (!requestStarted) await cleanupAssets(assets.map((asset) => asset.storageId))
          throw reason
        }

        setSuccess(`${page.name} için site dosyaları güncellendi.`)
      } else {
        if (!replacement.name.toLowerCase().endsWith(".html")) {
          throw new Error("Yalnızca .html veya .zip dosyası yükleyebilirsiniz.")
        }
        if (replacement.size < 1 || replacement.size > MAX_HTML_BYTES) {
          throw new Error("HTML dosyası en fazla 4 MB olabilir.")
        }

        const data = new FormData()
        data.set("file", replacement)
        const response = await fetch(`/api/demo-pages/${page.id}`, { method: "PATCH", body: data })
        if (!response.ok) throw await responseError(response, "HTML değiştirilemedi.")
        setSuccess(`${page.name} için HTML dosyası güncellendi.`)
      }

      await fetchPages()
    } catch (reason) {
      setError(errorFrom(reason))
    } finally {
      setBusyId(null)
      setProgress(null)
    }
  }

  const deletePage = async (page: DemoPage) => {
    if (!window.confirm(t(`${page.name} ve yayınlanan tüm dosyalar kalıcı olarak silinsin mi?`))) return
    setBusyId(page.id)
    setError(null)
    try {
      const response = await fetch(`/api/demo-pages/${page.id}`, { method: "DELETE" })
      if (!response.ok) throw await responseError(response, "Sayfa silinemedi.")
      await fetchPages()
    } catch (reason) {
      setError(errorFrom(reason))
    } finally {
      setBusyId(null)
    }
  }

  const copyDomain = async (page: DemoPage) => {
    const url = `https://${page.subdomain}.${ROOT_DOMAIN}`
    await navigator.clipboard.writeText(url)
    setCopied(page.id)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const progressWidth = progress
    ? progress.total > 0
      ? Math.min(100, (progress.current / progress.total) * 100)
      : 12
    : 0

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#39d0c2]/20 bg-[#39d0c2]/10 px-3 py-1 text-xs font-bold text-[#39d0c2]">
            <Globe2 className="h-3.5 w-3.5" /> <T>{"Demo yayın merkezi"}</T></div>
          <h1 className="text-3xl font-black text-[#f7f3ea]"><T>{"Demo Sayfalar"}</T></h1>
          <p className="mt-1 text-sm text-[#817b70]"><T>{"Tek HTML dosyasını veya ZIP içindeki tüm siteyi özel alt alan adlarında yayınlayın."}</T></p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#b8afa1]">
          <T>{"Alan adı:"}</T><span className="font-bold text-[#d7ff43]"><T>{"*."}</T><T>{ROOT_DOMAIN}</T></span>
        </div>
      </div>

      <form onSubmit={createPage} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#39d0c2]/10 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_1fr_1.1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]"><T>{"Sayfa adı"}</T></span>
            <LocalizedElement as="input"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (!subdomain) setSubdomain(normalizeDemoSubdomain(event.target.value))
              }}
              placeholder="FK Güzellik Demo"
              className="w-full rounded-xl border border-white/10 bg-[#10100d]/70 px-4 py-3 text-sm text-[#f7f3ea] outline-none transition focus:border-[#39d0c2]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]"><T>{"Alt alan adı"}</T></span>
            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-[#10100d]/70 focus-within:border-[#39d0c2]">
              <LocalizedElement as="input"
                required
                value={subdomain}
                onChange={(event) => setSubdomain(normalizeDemoSubdomain(event.target.value))}
                placeholder="fkguzellik"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#f7f3ea] outline-none"
              />
              <span className="flex items-center border-l border-white/10 px-3 text-xs text-[#817b70]"><T>{"."}</T><T>{ROOT_DOMAIN}</T></span>
            </div>
          </label>

          <label className="group cursor-pointer space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]"><T>{"HTML veya ZIP"}</T></span>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#10100d]/50 px-4 py-3 transition group-hover:border-[#d7ff43]/50">
              {file && isZipFile(file) ? (
                <FileArchive className="h-5 w-5 shrink-0 text-[#39d0c2]" />
              ) : (
                <UploadCloud className="h-5 w-5 shrink-0 text-[#d7ff43]" />
              )}
              <span className="truncate text-sm text-[#b8afa1]"><T>{file?.name || ".html veya .zip seç — ZIP en fazla 60 MB"}</T></span>
            </div>
            <input ref={createFileInput} className="hidden" type="file" accept=".html,.zip" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            {file && isZipFile(file) ? (
              <p className="text-[11px] text-[#817b70]"><T>{"ZIP içindeki index.html ve tüm statik dosyalar otomatik yayınlanır."}</T></p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] px-5 text-sm font-black text-[#10100d] transition hover:shadow-[0_0_30px_rgba(57,208,194,.25)] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            <T>{"Yayınla"}</T></button>
        </div>
      </form>

      {progress ? (
        <div className="rounded-xl border border-[#39d0c2]/20 bg-[#39d0c2]/5 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-4 text-xs text-[#b8afa1]">
            <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin text-[#39d0c2]" /><T>{progress.label}</T></span>
            <span className="font-mono text-[#817b70]">{progress.total > 0 ? `${progress.current} / ${progress.total}` : "…"}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] transition-all duration-300" style={{ width: `${progressWidth}%` }} />
          </div>
        </div>
      ) : null}

      {error && <div className="rounded-xl border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-4 py-3 text-sm text-[#ff9a76]"><T>{error}</T></div>}
      {success && <div className="rounded-xl border border-[#d7ff43]/25 bg-[#d7ff43]/10 px-4 py-3 text-sm text-[#d7ff43]"><T>{success}</T></div>}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#f7f3ea]"><T>{"Yayınlar "}</T><span className="ml-1 text-sm font-normal text-[#817b70]"><T>{"("}</T><T>{pages.length}</T><T>{")"}</T></span></h2>
          <LocalizedElement as="button" onClick={() => fetchPages().catch((reason: unknown) => setError(errorFrom(reason)))} className="rounded-lg p-2 text-[#817b70] transition hover:bg-white/5 hover:text-[#f7f3ea]" title="Yenile">
            <RefreshCw className="h-4 w-4" />
          </LocalizedElement>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#39d0c2]" /></div>
        ) : pages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <FileCode2 className="mx-auto h-10 w-10 text-[#817b70]" />
            <p className="mt-3 font-bold text-[#b8afa1]"><T>{"Henüz demo sayfası yok"}</T></p>
            <p className="mt-1 text-sm text-[#817b70]"><T>{"İlk HTML veya ZIP dosyanızı yukarıdan yükleyin."}</T></p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => {
              const url = `https://${page.subdomain}.${ROOT_DOMAIN}`
              const busy = busyId === page.id
              return (
                <article key={page.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#39d0c2]/20 to-[#d7ff43]/10 text-[#39d0c2]">
                        {page.kind === "site" ? <FileArchive className="h-6 w-6" /> : <FileCode2 className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-bold text-[#f7f3ea]"><T>{page.name}</T></h3>
                          <span className="rounded-full bg-[#39d0c2]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#39d0c2]">
                            <T>{page.kind === "site" ? "Site" : "HTML"}</T>
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${page.published ? "bg-[#d7ff43]/10 text-[#d7ff43]" : "bg-white/5 text-[#817b70]"}`}>
                            <T>{page.published ? "Yayında" : "Kapalı"}</T>
                          </span>
                        </div>
                        <a href={url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-[#39d0c2] hover:underline"><T>{page.subdomain}</T><T>{"."}</T><T>{ROOT_DOMAIN}</T></a>
                        <p className="mt-2 text-xs text-[#817b70]">
                          <T>{page.original_filename}</T>
                          <T>{" · "}</T>
                          {page.kind === "site" ? (
                            <>
                              <T>{`${page.file_count} dosya`}</T><T>{" · "}</T>
                              <T>{formatBytes(page.site_size ?? page.html_size)}</T><T>{" · "}</T>
                            </>
                          ) : (
                            <><T>{formatBytes(page.html_size)}</T><T>{" · "}</T></>
                          )}
                          <T>{new Date(page.updated_at).toLocaleDateString(intlLocale)}</T>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => copyDomain(page)} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition hover:bg-white/5 hover:text-[#f7f3ea]">
                        {copied === page.id ? <Check className="h-3.5 w-3.5 text-[#d7ff43]" /> : <Clipboard className="h-3.5 w-3.5" />} <T>{"Kopyala"}</T></button>
                      <a href={`/api/demo-pages/render/${page.subdomain}?preview=1`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition hover:bg-white/5 hover:text-[#f7f3ea]">
                        <ExternalLink className="h-3.5 w-3.5" /> <T>{"Ön izle"}</T></a>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition hover:bg-white/5 hover:text-[#f7f3ea]">
                        <RefreshCw className="h-3.5 w-3.5" /> <T>{"Dosya değiştir"}</T>
                        <input type="file" accept=".html,.zip" className="hidden" disabled={busy} onChange={(event) => { const chosen = event.target.files?.[0] || null; event.target.value = ""; void replacePage(page, chosen) }} />
                      </label>
                      <button disabled={busy} onClick={() => void updatePage(page.id, { published: !page.published })} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${page.published ? "border-[#ff6b35]/20 text-[#ff9a76] hover:bg-[#ff6b35]/10" : "border-[#d7ff43]/20 text-[#d7ff43] hover:bg-[#d7ff43]/10"}`}>
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />} <T>{page.published ? "Yayından kaldır" : "Yayınla"}</T>
                      </button>
                      <LocalizedElement as="button" disabled={busy} onClick={() => void deletePage(page)} className="rounded-lg border border-[#ff6b35]/20 p-2 text-[#ff6b35] transition hover:bg-[#ff6b35]/10 disabled:opacity-50" title="Sil">
                        <Trash2 className="h-4 w-4" />
                      </LocalizedElement>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-[#817b70]">
        <T>{"Tek HTML dosyası yükleyebilir veya ZIP içindeki statik siteyi yayınlayabilirsiniz. ZIP içinde index.html kök dizinde olmalıdır; görsel, CSS, JS ve font dosyaları otomatik olarak yüklenir. Tek dosya en fazla 4 MB, toplam site dosyaları en fazla 30 MB ve en fazla 500 dosya olabilir. PHP, Node.js gibi sunucu tarafı kodlar çalışmaz. Demo sayfaları arama motorlarına kapalıdır."}</T></div>
    </div>
  )
}
