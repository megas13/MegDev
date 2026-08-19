"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, FileCheck2, Loader2, Mail, ShieldCheck } from "lucide-react"

type ContractData = {
  status: string
  provider_name: string
  representative_name: string
  representative_email: string
  contract_text?: string | null
  contract_version?: string | null
  contract_hash?: string | null
  accepted_at?: string | null
  termination_text?: string | null
  termination_version?: string | null
  termination_hash?: string | null
  termination_accepted_at?: string | null
}

export function ContractApproval({ token, purpose }: { token: string; purpose: "acceptance" | "termination" }) {
  const [contract, setContract] = useState<ContractData | null>(null)
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [accepted, setAccepted] = useState(false)
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  const isTermination = purpose === "termination"
  const documentText = isTermination ? contract?.termination_text : contract?.contract_text
  const completed = isTermination ? contract?.status === "terminated" : ["active", "termination_pending", "terminated"].includes(contract?.status || "")

  useEffect(() => {
    fetch(`/api/referral-contracts/public/${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setContract(data.contract)
      })
      .catch((reason) => setError(reason.message || "Belge yüklenemedi"))
  }, [token])

  async function action(actionName: "send_code" | "accept") {
    setBusy(true)
    setError("")
    try {
      const response = await fetch(`/api/referral-contracts/public/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionName, purpose, accepted, code: digits.join("") }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      if (actionName === "send_code") {
        setSent(true)
        setTimeout(() => inputs.current[0]?.focus(), 100)
      } else {
        setContract((current) => current ? { ...current, status: isTermination ? "terminated" : "active", [isTermination ? "termination_accepted_at" : "accepted_at"]: data.accepted_at } : current)
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "İşlem tamamlanamadı")
    } finally {
      setBusy(false)
    }
  }

  function updateDigit(index: number, value: string) {
    const number = value.replace(/\D/g, "").slice(-1)
    setDigits((current) => current.map((digit, position) => position === index ? number : digit))
    if (number && index < 5) inputs.current[index + 1]?.focus()
  }

  if (!contract && !error) return <main className="min-h-screen bg-[#10100d] grid place-items-center"><Loader2 className="h-9 w-9 animate-spin text-[#d7ff43]" /></main>

  return (
    <main className="min-h-screen bg-[#10100d] text-[#f7f3ea] px-4 py-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d7ff43]/20 bg-[#d7ff43]/10 px-4 py-2 text-xs font-bold tracking-widest text-[#d7ff43]"><ShieldCheck className="h-4 w-4" /> GÜVENLİ ELEKTRONİK KAYIT</div>
          <h1 className="max-w-3xl text-3xl font-black md:text-5xl">{isTermination ? "Sözleşme fesih ve ayrılık formu" : "Müşteri bulma ve aracılık sözleşmesi"}</h1>
          {contract && <p className="mt-3 text-[#b8afa1]">{contract.provider_name} · {contract.representative_name}</p>}
        </motion.header>

        {error && !contract ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-200">{error}</div> : contract && (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5"><div><p className="text-xs uppercase tracking-widest text-[#817b70]">Belge sürümü</p><p className="font-bold">{isTermination ? contract.termination_version : contract.contract_version}</p></div><FileCheck2 className="h-7 w-7 text-[#39d0c2]" /></div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[#d7d1c6]">{documentText || "Bu sözleşme için henüz fesih formu oluşturulmamış."}</pre>
              <p className="mt-8 break-all border-t border-white/10 pt-5 font-mono text-[10px] text-[#817b70]">SHA-256: {isTermination ? contract.termination_hash : contract.contract_hash}</p>
            </motion.section>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border border-white/10 bg-[#181814] p-6 shadow-2xl">
                {completed ? <div className="py-6 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-[#d7ff43]" /><h2 className="mt-4 text-xl font-black">{isTermination ? "Fesih onaylandı" : "Sözleşme kabul edildi"}</h2><p className="mt-2 text-sm text-[#b8afa1]">Kayıt başarıyla tamamlandı ve değişmez belge özeti saklandı.</p></div> : <>
                  <Mail className="h-8 w-8 text-[#39d0c2]" /><h2 className="mt-4 text-xl font-black">E-posta ile doğrula</h2><p className="mt-2 text-sm leading-6 text-[#b8afa1]">Kod <strong className="text-[#f7f3ea]">{contract.representative_email}</strong> adresine gönderilecek.</p>
                  {!sent ? <button disabled={busy || !documentText} onClick={() => action("send_code")} className="mt-6 w-full rounded-xl bg-[#d7ff43] px-4 py-3.5 font-black text-[#10100d] disabled:opacity-50">{busy ? "Gönderiliyor..." : "Doğrulama kodu gönder"}</button> : <>
                    <div className="mt-6 flex gap-2">{digits.map((digit, index) => <motion.input key={index} ref={(element) => { inputs.current[index] = element }} value={digit} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) inputs.current[index - 1]?.focus() }} inputMode="numeric" maxLength={1} animate={digit ? { scale: [1, 1.08, 1], borderColor: "#d7ff43" } : {}} className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 text-center text-xl font-black outline-none focus:border-[#39d0c2]" />)}</div>
                    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-3 text-sm leading-5 text-[#b8afa1]"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 accent-[#d7ff43]" /><span>Belgenin tamamını okudum; elektronik kayıt oluşturulmasını ve {isTermination ? "fesih şartlarını" : "sözleşme şartlarını"} açıkça kabul ediyorum.</span></label>
                    <button disabled={busy || !accepted || digits.some((digit) => !digit)} onClick={() => action("accept")} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] px-4 py-3.5 font-black text-[#10100d] disabled:opacity-40">{busy ? "Kaydediliyor..." : isTermination ? "Feshi onayla" : "Sözleşmeyi kabul et"}</button>
                    <button disabled={busy} onClick={() => action("send_code")} className="mt-3 w-full text-xs text-[#817b70] hover:text-[#f7f3ea]">Kodu yeniden gönder</button>
                  </>}
                  {error && <p className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
                </>}
              </motion.div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
