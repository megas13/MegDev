"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileCheck2,
  MailCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react"

type Acceptance = {
  id: string
  project_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  contract_version: string
  contract_hash: string
  contract_text: string
  accepted_at: string
  accepted_ip: string | null
  user_agent: string | null
  email_verified: boolean
}

type ContractRecord = {
  id: string
  title: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  token: string
  created_at: string
  acceptance: Acceptance | null
}

type Filter = "all" | "accepted" | "pending"

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<ContractRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<ContractRecord | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/nda", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Sözleşmeler yüklenemedi")
      setContracts(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Sözleşmeler yüklenemedi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/nda", { cache: "no-store", signal: controller.signal })
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.error || "Sözleşmeler yüklenemedi")
        setContracts(Array.isArray(data) ? data : [])
      })
      .catch((loadError) => {
        if (loadError instanceof Error && loadError.name === "AbortError") return
        setError(loadError instanceof Error ? loadError.message : "Sözleşmeler yüklenemedi")
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const acceptedCount = contracts.filter((contract) => contract.acceptance).length
  const pendingCount = contracts.length - acceptedCount
  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("tr-TR")
    return contracts.filter((contract) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "accepted" && Boolean(contract.acceptance)) ||
        (filter === "pending" && !contract.acceptance)
      const matchesSearch =
        !needle ||
        contract.title.toLocaleLowerCase("tr-TR").includes(needle) ||
        contract.customer_name.toLocaleLowerCase("tr-TR").includes(needle) ||
        contract.customer_email.toLocaleLowerCase("tr-TR").includes(needle)
      return matchesFilter && matchesSearch
    })
  }, [contracts, filter, search])

  async function copyContractLink(contract: ContractRecord) {
    const link = `${window.location.origin}/gizlilik-sozlesmesi/${contract.token}`
    await navigator.clipboard.writeText(link)
    setCopiedId(contract.id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39d0c2]">Kabul kayıtları</p>
          <h1 className="mt-1 text-3xl font-black text-[#f7f3ea]">Sözleşmeler</h1>
          <p className="mt-2 text-sm text-[#817b70]">Müşterilerin gizlilik sözleşmesini kabul edip etmediğini takip edin.</p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-[#b8afa1] transition-colors hover:text-[#f7f3ea] disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Yenile
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Toplam", value: contracts.length, icon: FileCheck2, color: "text-[#39d0c2]" },
          { label: "Kabul edildi", value: acceptedCount, icon: CheckCircle2, color: "text-[#d7ff43]" },
          { label: "Bekliyor", value: pendingCount, icon: Clock3, color: "text-[#ffb84d]" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]">{item.label}</span>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className={`mt-3 text-3xl font-black ${item.color}`}>{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ["all", `Tümü (${contracts.length})`],
            ["accepted", `Kabul edildi (${acceptedCount})`],
            ["pending", `Bekliyor (${pendingCount})`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                filter === value ? "bg-[#d7ff43] text-[#10100d]" : "bg-white/5 text-[#817b70] hover:text-[#f7f3ea]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 lg:w-80">
          <Search className="h-4 w-4 shrink-0 text-[#817b70]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Proje, müşteri veya e-posta ara"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#f7f3ea] outline-none placeholder:text-[#817b70]"
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-[#ff6b35]/25 bg-[#ff6b35]/5 p-8 text-center text-sm text-[#ff6b35]">{error}</div>
      ) : loading ? (
        <div className="flex justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-[#d7ff43]" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-sm text-[#817b70]">Bu filtreye uygun sözleşme bulunamadı.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="hidden grid-cols-[1.4fr_1fr_160px_150px] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#817b70] lg:grid">
            <span>Proje ve müşteri</span><span>İletişim</span><span>Durum</span><span className="text-right">İşlem</span>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((contract) => (
              <div key={contract.id} className="grid gap-4 px-5 py-5 transition-colors hover:bg-white/[0.025] lg:grid-cols-[1.4fr_1fr_160px_150px] lg:items-center">
                <div>
                  <p className="font-bold text-[#f7f3ea]">{contract.title}</p>
                  <p className="mt-1 text-xs text-[#817b70]">{contract.customer_name}</p>
                </div>
                <div className="text-xs text-[#b8afa1]">
                  <p>{contract.customer_email}</p>
                  {contract.customer_phone && <p className="mt-1 text-[#817b70]">{contract.customer_phone}</p>}
                </div>
                <div>
                  {contract.acceptance ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7ff43]/25 bg-[#d7ff43]/10 px-3 py-1.5 text-xs font-bold text-[#d7ff43]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Kabul edildi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb84d]/25 bg-[#ffb84d]/10 px-3 py-1.5 text-xs font-bold text-[#ffb84d]">
                      <Clock3 className="h-3.5 w-3.5" /> Bekliyor
                    </span>
                  )}
                  {contract.acceptance && <p className="mt-1.5 text-[10px] text-[#817b70]">{new Date(contract.acceptance.accepted_at).toLocaleString("tr-TR")}</p>}
                </div>
                <div className="flex gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => copyContractLink(contract)}
                    title="Sözleşme bağlantısını kopyala"
                    className="rounded-lg border border-white/10 p-2.5 text-[#817b70] transition-colors hover:text-[#39d0c2]"
                  >
                    {copiedId === contract.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(contract)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-[#b8afa1] transition-colors hover:text-[#f7f3ea]"
                  >
                    Detay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#181713] p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#39d0c2]">Sözleşme detayı</p>
                <h2 className="mt-1 text-2xl font-black text-[#f7f3ea]">{selected.title}</h2>
                <p className="mt-1 text-sm text-[#817b70]">{selected.customer_name} · {selected.customer_email}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg p-2 text-[#817b70] hover:bg-white/5 hover:text-[#f7f3ea]"><X className="h-5 w-5" /></button>
            </div>

            {selected.acceptance ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Kabul tarihi" value={new Date(selected.acceptance.accepted_at).toLocaleString("tr-TR")} />
                  <Info label="Sözleşme sürümü" value={selected.acceptance.contract_version} />
                  <Info label="E-posta doğrulaması" value={selected.acceptance.email_verified ? "Doğrulandı" : "Doğrulanmadı"} icon={MailCheck} />
                  <Info label="IP adresi" value={selected.acceptance.accepted_ip || "Kaydedilmedi"} />
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#817b70]">SHA-256 sözleşme özeti</p>
                  <p className="mt-2 break-all font-mono text-xs text-[#39d0c2]">{selected.acceptance.contract_hash}</p>
                </div>
                <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-5 text-xs leading-6 text-[#b8afa1]">
                  {selected.acceptance.contract_text}
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#d7ff43]/20 bg-[#d7ff43]/5 p-4 text-xs text-[#d7ff43]">
                  <ShieldCheck className="h-5 w-5 shrink-0" /> Kabul kaydı, sözleşme metni ve teknik kanıtlarla birlikte saklanıyor.
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-[#ffb84d]/20 bg-[#ffb84d]/5 p-8 text-center">
                <Clock3 className="mx-auto h-9 w-9 text-[#ffb84d]" />
                <h3 className="mt-3 font-bold text-[#f7f3ea]">Henüz kabul edilmedi</h3>
                <p className="mt-2 text-sm text-[#817b70]">Müşteriye sözleşme bağlantısını göndererek kabul sürecini başlatabilirsiniz.</p>
                <button type="button" onClick={() => copyContractLink(selected)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#d7ff43] px-5 py-3 text-sm font-bold text-[#10100d]">
                  <Copy className="h-4 w-4" /> Bağlantıyı Kopyala
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof MailCheck }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#817b70]">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[#f7f3ea]">{value}</p>
    </div>
  )
}
