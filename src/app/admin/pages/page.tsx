"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Clipboard,
  ExternalLink,
  FileCode2,
  Globe2,
  Loader2,
  Power,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react"

type DemoPage = {
  id: string
  name: string
  subdomain: string
  original_filename: string
  html_size: number
  published: boolean
  created_at: string
  updated_at: string
}

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_DEMO_ROOT_DOMAIN || "megdev.com.tr"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function normalizeSubdomain(value: string) {
  return value
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

export default function DemoPagesAdmin() {
  const [pages, setPages] = useState<DemoPage[]>([])
  const [name, setName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

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
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => setLoading(false))
  }, [])

  const createPage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) return setError("Bir HTML dosyası seçin.")

    setSaving(true)
    setError(null)
    setSuccess(null)
    const data = new FormData()
    data.set("name", name)
    data.set("subdomain", subdomain)
    data.set("file", file)
    data.set("published", "true")

    try {
      const response = await fetch("/api/demo-pages", { method: "POST", body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Sayfa oluşturulamadı.")
      setName("")
      setSubdomain("")
      setFile(null)
      setSuccess(`${result.subdomain}.${ROOT_DOMAIN} yayına hazır.`)
      await fetchPages()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setSaving(false)
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
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Sayfa güncellenemedi.")
      await fetchPages()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setBusyId(null)
    }
  }

  const replaceHtml = async (page: DemoPage, replacement: File | null) => {
    if (!replacement) return
    setBusyId(page.id)
    setError(null)
    try {
      const data = new FormData()
      data.set("file", replacement)
      const response = await fetch(`/api/demo-pages/${page.id}`, { method: "PATCH", body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "HTML değiştirilemedi.")
      setSuccess(`${page.name} için HTML dosyası güncellendi.`)
      await fetchPages()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setBusyId(null)
    }
  }

  const deletePage = async (page: DemoPage) => {
    if (!window.confirm(`${page.name} ve yayınlanan HTML kalıcı olarak silinsin mi?`)) return
    setBusyId(page.id)
    setError(null)
    try {
      const response = await fetch(`/api/demo-pages/${page.id}`, { method: "DELETE" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Sayfa silinemedi.")
      await fetchPages()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#39d0c2]/20 bg-[#39d0c2]/10 px-3 py-1 text-xs font-bold text-[#39d0c2]">
            <Globe2 className="h-3.5 w-3.5" /> Demo yayın merkezi
          </div>
          <h1 className="text-3xl font-black text-[#f7f3ea]">Demo Sayfalar</h1>
          <p className="mt-1 text-sm text-[#817b70]">Tek dosyalık HTML demolarını özel alt alan adlarında yayınlayın.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-[#b8afa1]">
          Alan adı: <span className="font-bold text-[#d7ff43]">*.{ROOT_DOMAIN}</span>
        </div>
      </div>

      <form onSubmit={createPage} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#39d0c2]/10 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_1fr_1.1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]">Sayfa adı</span>
            <input
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (!subdomain) setSubdomain(normalizeSubdomain(event.target.value))
              }}
              placeholder="FK Güzellik Demo"
              className="w-full rounded-xl border border-white/10 bg-[#10100d]/70 px-4 py-3 text-sm text-[#f7f3ea] outline-none transition focus:border-[#39d0c2]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]">Alt alan adı</span>
            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-[#10100d]/70 focus-within:border-[#39d0c2]">
              <input
                required
                value={subdomain}
                onChange={(event) => setSubdomain(normalizeSubdomain(event.target.value))}
                placeholder="fkguzellik"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#f7f3ea] outline-none"
              />
              <span className="flex items-center border-l border-white/10 px-3 text-xs text-[#817b70]">.{ROOT_DOMAIN}</span>
            </div>
          </label>

          <label className="group cursor-pointer space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]">HTML dosyası</span>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#10100d]/50 px-4 py-3 transition group-hover:border-[#d7ff43]/50">
              <UploadCloud className="h-5 w-5 shrink-0 text-[#d7ff43]" />
              <span className="truncate text-sm text-[#b8afa1]">{file?.name || ".html seç — en fazla 4 MB"}</span>
            </div>
            <input className="hidden" type="file" accept=".html,text/html" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] px-5 text-sm font-black text-[#10100d] transition hover:shadow-[0_0_30px_rgba(57,208,194,.25)] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Yayınla
          </button>
        </div>
      </form>

      {error && <div className="rounded-xl border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-4 py-3 text-sm text-[#ff9a76]">{error}</div>}
      {success && <div className="rounded-xl border border-[#d7ff43]/25 bg-[#d7ff43]/10 px-4 py-3 text-sm text-[#d7ff43]">{success}</div>}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#f7f3ea]">Yayınlar <span className="ml-1 text-sm font-normal text-[#817b70]">({pages.length})</span></h2>
          <button onClick={() => fetchPages().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : String(reason)))} className="rounded-lg p-2 text-[#817b70] transition hover:bg-white/5 hover:text-[#f7f3ea]" title="Yenile">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#39d0c2]" /></div>
        ) : pages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <FileCode2 className="mx-auto h-10 w-10 text-[#817b70]" />
            <p className="mt-3 font-bold text-[#b8afa1]">Henüz demo sayfası yok</p>
            <p className="mt-1 text-sm text-[#817b70]">İlk HTML dosyanızı yukarıdan yükleyin.</p>
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
                        <FileCode2 className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-bold text-[#f7f3ea]">{page.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${page.published ? "bg-[#d7ff43]/10 text-[#d7ff43]" : "bg-white/5 text-[#817b70]"}`}>
                            {page.published ? "Yayında" : "Kapalı"}
                          </span>
                        </div>
                        <a href={url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-[#39d0c2] hover:underline">{page.subdomain}.{ROOT_DOMAIN}</a>
                        <p className="mt-2 text-xs text-[#817b70]">{page.original_filename} · {formatBytes(page.html_size)} · {new Date(page.updated_at).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => copyDomain(page)} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition hover:bg-white/5 hover:text-[#f7f3ea]">
                        {copied === page.id ? <Check className="h-3.5 w-3.5 text-[#d7ff43]" /> : <Clipboard className="h-3.5 w-3.5" />} Kopyala
                      </button>
                      <a href={`/api/demo-pages/render/${page.subdomain}?preview=1`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition hover:bg-white/5 hover:text-[#f7f3ea]">
                        <ExternalLink className="h-3.5 w-3.5" /> Ön izle
                      </a>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition hover:bg-white/5 hover:text-[#f7f3ea]">
                        <RefreshCw className="h-3.5 w-3.5" /> HTML değiştir
                        <input type="file" accept=".html,text/html" className="hidden" disabled={busy} onChange={(event) => void replaceHtml(page, event.target.files?.[0] || null)} />
                      </label>
                      <button disabled={busy} onClick={() => void updatePage(page.id, { published: !page.published })} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${page.published ? "border-[#ff6b35]/20 text-[#ff9a76] hover:bg-[#ff6b35]/10" : "border-[#d7ff43]/20 text-[#d7ff43] hover:bg-[#d7ff43]/10"}`}>
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />} {page.published ? "Yayından kaldır" : "Yayınla"}
                      </button>
                      <button disabled={busy} onClick={() => void deletePage(page)} className="rounded-lg border border-[#ff6b35]/20 p-2 text-[#ff6b35] transition hover:bg-[#ff6b35]/10 disabled:opacity-50" title="Sil">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-[#817b70]">
        Yüklenen dosya tek bir HTML belgesi olmalıdır. Görsel, stil ve scriptleri dosyanın içine gömmeniz veya HTTPS adreslerinden çağırmanız gerekir. Demo sayfaları arama motorlarına kapalıdır.
      </div>
    </div>
  )
}
