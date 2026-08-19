"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Clipboard, FileSignature, Link2, Loader2, Plus, Power, X } from "lucide-react"

type Contract = {
  id: string
  token: string
  status: "sent" | "active" | "termination_pending" | "terminated"
  provider_name: string
  representative_name: string
  representative_email: string
  commission_type: string
  commission_value: number
  currency: string
  start_date: string
  accepted_at?: string | null
  termination_effective_date?: string | null
  termination_reason?: string | null
  created_at: string
}

const initialForm = {
  providerName: "Meg Dev", providerAddress: "", providerTaxNo: "",
  representativeName: "", representativeEmail: "", representativePhone: "",
  scope: "Meg Dev hizmetleri için potansiyel müşteri bulunması ve tarafların tanıştırılması.",
  commissionType: "percentage", commissionValue: 10, currency: "TRY",
  startDate: new Date().toISOString().slice(0, 10), endDate: "",
  paymentTerms: "Müşteriden tahsilat yapıldıktan sonra 7 gün içinde ödeme yapılır.", specialTerms: "",
}

const statusMap = {
  sent: ["Onay bekliyor", "bg-amber-400/10 text-amber-300"],
  active: ["Aktif", "bg-[#d7ff43]/10 text-[#d7ff43]"],
  termination_pending: ["Fesih onayı bekliyor", "bg-orange-400/10 text-orange-300"],
  terminated: ["Sona erdi", "bg-white/10 text-[#b8afa1]"],
} as const

export default function ReferralContractsAdminPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"create" | "terminate" | null>(null)
  const [selected, setSelected] = useState<Contract | null>(null)
  const [form, setForm] = useState(initialForm)
  const [termination, setTermination] = useState({ effectiveDate: new Date().toISOString().slice(0, 10), reason: "", settlement: "Fesih tarihine kadar doğmuş hak edişler hesaplanıp taraflara ödenecektir." })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/referral-contracts", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setContracts(data.contracts)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Sözleşmeler yüklenemedi") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function createContract(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("")
    try {
      const response = await fetch("/api/referral-contracts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error)
      setModal(null); setForm(initialForm); await load()
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Sözleşme oluşturulamadı") }
    finally { setBusy(false) }
  }

  async function requestTermination(event: React.FormEvent) {
    event.preventDefault(); if (!selected) return; setBusy(true); setError("")
    try {
      const response = await fetch(`/api/referral-contracts/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "request_termination", ...termination }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error)
      setModal(null); setSelected(null); await load()
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Fesih formu oluşturulamadı") }
    finally { setBusy(false) }
  }

  async function copyLink(contract: Contract, terminationLink = false) {
    const suffix = terminationLink ? "/fesih" : ""
    const url = `${window.location.origin}/musteri-bulma-sozlesmesi/${contract.token}${suffix}`
    await navigator.clipboard.writeText(url); setCopied(`${contract.id}:${suffix}`); setTimeout(() => setCopied(""), 1800)
  }

  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#39d0c2]">Sözleşme yaşam döngüsü</p><h1 className="mt-2 text-3xl font-black text-[#f7f3ea]">Müşteri bulma sözleşmeleri</h1><p className="mt-2 max-w-2xl text-sm text-[#817b70]">Sözleşmeyi oluşturun, kişiye özel bağlantıyı paylaşın; başlangıç ve ayrılık onaylarını tek ekrandan izleyin.</p></div><button onClick={() => { setError(""); setModal("create") }} className="flex items-center justify-center gap-2 rounded-xl bg-[#d7ff43] px-5 py-3 font-black text-[#10100d]"><Plus className="h-4 w-4" /> Yeni sözleşme</button></div>

    <div className="grid gap-3 sm:grid-cols-4">{([['Toplam', contracts.length], ['Onay bekleyen', contracts.filter(c => c.status === 'sent').length], ['Aktif', contracts.filter(c => c.status === 'active').length], ['Sona eren', contracts.filter(c => c.status === 'terminated').length]] as const).map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="text-xs text-[#817b70]">{label}</p><p className="mt-2 text-3xl font-black text-[#f7f3ea]">{value}</p></div>)}</div>

    {error && !modal && <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
    {loading ? <div className="grid min-h-56 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-[#d7ff43]" /></div> : contracts.length === 0 ? <div className="rounded-3xl border border-dashed border-white/15 py-16 text-center"><FileSignature className="mx-auto h-10 w-10 text-[#817b70]" /><p className="mt-4 font-bold text-[#f7f3ea]">Henüz sözleşme yok</p><p className="mt-1 text-sm text-[#817b70]">İlk müşteri bulma sözleşmesini oluşturun.</p></div> : <div className="space-y-3">{contracts.map(contract => { const status = statusMap[contract.status]; return <motion.article layout key={contract.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-[#f7f3ea]">{contract.representative_name}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status[1]}`}>{status[0]}</span></div><p className="mt-1 text-sm text-[#b8afa1]">{contract.representative_email}</p><p className="mt-2 text-xs text-[#817b70]">{contract.provider_name} · {contract.commission_type === 'percentage' ? `%${contract.commission_value}` : `${contract.commission_value} ${contract.currency}`} · Başlangıç {new Date(contract.start_date).toLocaleDateString('tr-TR')}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => copyLink(contract)} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-[#d7d1c6] hover:bg-white/5">{copied === `${contract.id}:` ? <Check className="h-4 w-4 text-[#d7ff43]" /> : <Link2 className="h-4 w-4" />} Sözleşme linki</button>{contract.status === 'active' && <button onClick={() => { setSelected(contract); setError(""); setModal('terminate') }} className="flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-bold text-orange-300"><Power className="h-4 w-4" /> Fesih başlat</button>}{contract.status === 'termination_pending' && <button onClick={() => copyLink(contract, true)} className="flex items-center gap-2 rounded-xl border border-[#39d0c2]/20 bg-[#39d0c2]/10 px-3 py-2 text-xs font-bold text-[#39d0c2]">{copied === `${contract.id}:/fesih` ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />} Fesih linki</button>}</div></div></motion.article>})}</div>}

    <AnimatePresence>{modal && <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4"><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="my-8 w-full max-w-3xl rounded-3xl border border-white/10 bg-[#181814] p-6 shadow-2xl md:p-8"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#39d0c2]">{modal === 'create' ? 'Yeni kayıt' : 'Ayrılık süreci'}</p><h2 className="mt-2 text-2xl font-black text-[#f7f3ea]">{modal === 'create' ? 'Sözleşme oluştur' : 'Fesih formu oluştur'}</h2></div><button onClick={() => setModal(null)} className="rounded-lg p-2 text-[#817b70] hover:bg-white/5"><X /></button></div>{error && <p className="mb-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}{modal === 'create' ? <CreateForm form={form} setForm={setForm} busy={busy} onSubmit={createContract} /> : <form onSubmit={requestTermination} className="space-y-4"><p className="rounded-xl bg-orange-400/10 p-4 text-sm text-orange-200"><strong>{selected?.representative_name}</strong> için fesih belgesi hazırlanacak. Asıl sözleşme silinmeyecek.</p><Field label="Fesih tarihi" type="date" required value={termination.effectiveDate} onChange={value => setTermination({...termination, effectiveDate: value})} /><Area label="Fesih nedeni" required value={termination.reason} onChange={value => setTermination({...termination, reason: value})} /><Area label="Mali kapanış / devam eden hak edişler" required value={termination.settlement} onChange={value => setTermination({...termination, settlement: value})} /><Submit busy={busy} label="Fesih formunu oluştur" /></form>}</motion.div></div>}</AnimatePresence>
  </div>
}

function CreateForm({ form, setForm, busy, onSubmit }: { form: typeof initialForm; setForm: (form: typeof initialForm) => void; busy: boolean; onSubmit: (event: React.FormEvent) => void }) {
  const set = (key: keyof typeof form, value: string | number) => setForm({ ...form, [key]: value })
  return <form onSubmit={onSubmit} className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Hizmet alan / şirket" required value={form.providerName} onChange={v => set('providerName', v)} /><Field label="Vergi veya kimlik no" value={form.providerTaxNo} onChange={v => set('providerTaxNo', v)} /><div className="md:col-span-2"><Area label="Hizmet alan adresi" required value={form.providerAddress} onChange={v => set('providerAddress', v)} /></div><Field label="Aracı / temsilci adı" required value={form.representativeName} onChange={v => set('representativeName', v)} /><Field label="E-posta" type="email" required value={form.representativeEmail} onChange={v => set('representativeEmail', v)} /><Field label="Telefon" value={form.representativePhone} onChange={v => set('representativePhone', v)} /><Field label="Başlangıç" type="date" required value={form.startDate} onChange={v => set('startDate', v)} /><Field label="Bitiş (isteğe bağlı)" type="date" value={form.endDate} onChange={v => set('endDate', v)} /><label className="space-y-2 text-sm text-[#b8afa1]">Komisyon tipi<select value={form.commissionType} onChange={e => set('commissionType', e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#10100d] px-4 py-3 text-[#f7f3ea]"><option value="percentage">Yüzde</option><option value="fixed">Sabit tutar</option></select></label><Field label="Komisyon değeri" type="number" required value={String(form.commissionValue)} onChange={v => set('commissionValue', Number(v))} /><Field label="Para birimi" required value={form.currency} onChange={v => set('currency', v)} /><div className="md:col-span-2"><Area label="Çalışmanın kapsamı" required value={form.scope} onChange={v => set('scope', v)} /></div><div className="md:col-span-2"><Area label="Ödeme ve hak ediş koşulları" required value={form.paymentTerms} onChange={v => set('paymentTerms', v)} /></div><div className="md:col-span-2"><Area label="Özel şartlar" value={form.specialTerms} onChange={v => set('specialTerms', v)} /></div></div><p className="rounded-xl border border-[#d7ff43]/15 bg-[#d7ff43]/5 p-3 text-xs leading-5 text-[#b8afa1]">Oluşturulan metin taslaktır. Gerçek kullanım öncesinde çalışma modeliniz ve taraf bilgileriniz için hukuk uzmanına inceletin.</p><Submit busy={busy} label="Sözleşmeyi oluştur" /></form>
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="space-y-2 text-sm text-[#b8afa1]">{label}<input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#10100d] px-4 py-3 text-[#f7f3ea] outline-none focus:border-[#d7ff43]" /></label> }
function Area({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) { return <label className="block space-y-2 text-sm text-[#b8afa1]">{label}<textarea required={required} value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full resize-y rounded-xl border border-white/10 bg-[#10100d] px-4 py-3 text-[#f7f3ea] outline-none focus:border-[#d7ff43]" /></label> }
function Submit({ busy, label }: { busy: boolean; label: string }) { return <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] px-5 py-3.5 font-black text-[#10100d] disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{label}</button> }
