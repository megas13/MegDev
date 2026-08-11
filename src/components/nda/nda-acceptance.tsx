"use client"

import { useState } from "react"
import { CheckCircle, Loader, LockKeyhole, Mail, ShieldCheck } from "lucide-react"

export type NdaStatus = {
  accepted: boolean
  accepted_at: string | null
  contract: string
  contract_version: string
  contract_hash: string
  customer_name: string
  customer_email: string
  project_title: string
}

export function NdaAcceptance({
  token,
  status,
  onAccepted,
}: {
  token: string
  status: NdaStatus
  onAccepted: () => void
}) {
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState("")
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function submit(action: "send_code" | "accept") {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/track/${token}/nda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, code, accepted: checked }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "İşlem tamamlanamadı")
      if (action === "send_code") {
        setCodeSent(true)
        setMessage(`6 haneli kod ${data.email} adresine gönderildi.`)
      } else {
        onAccepted()
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İşlem tamamlanamadı")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#10100d] px-4 py-10 text-[#f7f3ea] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d7ff43]/30 bg-[#d7ff43]/10">
            <ShieldCheck className="h-6 w-6 text-[#d7ff43]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39d0c2]">Meg Dev · Güvenli kabul</p>
            <h1 className="text-2xl font-black sm:text-3xl">Gizlilik Sözleşmesi</h1>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-8">
          <div className="mb-5 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm sm:grid-cols-2">
            <p><span className="text-[#817b70]">Müşteri:</span> {status.customer_name}</p>
            <p><span className="text-[#817b70]">Proje:</span> {status.project_title}</p>
            <p><span className="text-[#817b70]">Doğrulama:</span> {status.customer_email}</p>
            <p><span className="text-[#817b70]">Sürüm:</span> {status.contract_version}</p>
          </div>

          <div className="max-h-[48vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#0b0b09] p-5 text-sm leading-7 text-[#c9c1b5] sm:p-6">
            {status.contract}
          </div>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#d7ff43]"
              />
              <span className="text-sm leading-6">
                Gizlilik Sözleşmesi’nin tamamını okudum, anladım ve hükümlerini kabul ediyorum. Kabul işlemimin tarih, hesap ve teknik işlem kayıtlarıyla saklanacağını biliyorum.
              </span>
            </label>

            {!codeSent ? (
              <button
                type="button"
                disabled={!checked || loading}
                onClick={() => submit("send_code")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d7ff43] px-5 py-3.5 font-bold text-[#10100d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                E-posta Doğrulama Kodu Gönder
              </button>
            ) : (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="6 haneli doğrulama kodu"
                  aria-label="Doğrulama kodu"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-center font-mono text-lg tracking-[0.35em] outline-none focus:border-[#39d0c2]"
                />
                <button
                  type="button"
                  disabled={!checked || code.length !== 6 || loading}
                  onClick={() => submit("accept")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] px-6 py-3.5 font-bold text-[#10100d] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                  Kabul Ediyorum
                </button>
              </div>
            )}

            {message && <p role="status" className="text-center text-sm text-[#39d0c2]">{message}</p>}

            <div className="space-y-1 text-center text-[11px] leading-5 text-[#817b70]">
              <p className="flex items-center justify-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> Doğrulama kodu 10 dakika geçerlidir.</p>
              <p>Sözleşmenin bir kopyası ve kabul özeti e-posta adresinize gönderilecektir.</p>
              <p>Ticari elektronik ileti izni bu kabulün kapsamında değildir.</p>
              <p className="font-mono">SHA-256: {status.contract_hash}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
