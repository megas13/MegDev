"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react"

function extractToken(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split("/").filter(Boolean)
    return parts.at(-1) || ""
  } catch {
    return trimmed.split("/").filter(Boolean).at(-1) || ""
  }
}

export function ContractAccessForm() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const token = extractToken(value)
    if (!token || token.length < 8) {
      setError("Geçerli müşteri kodunu veya size gönderilen bağlantıyı girin.")
      return
    }
    router.push(`/gizlilik-sozlesmesi/${encodeURIComponent(token)}`)
  }

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#10100d] px-4 py-16 text-[#f7f3ea]">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-9">
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d7ff43]/30 bg-[#d7ff43]/10">
            <ShieldCheck className="h-6 w-6 text-[#d7ff43]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39d0c2]">Meg Dev · Güvenli sözleşme</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Gizlilik Sözleşmesi</h1>
          </div>
        </div>

        <p className="text-sm leading-7 text-[#b8afa1]">
          Her sözleşme müşteri ve proje bilgilerine özel hazırlanır. Devam etmek için size iletilen müşteri kodunu veya sözleşme bağlantısının tamamını aşağıya girin.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#817b70]">
              <KeyRound className="h-4 w-4" /> Müşteri kodu veya bağlantı
            </span>
            <input
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                setError(null)
              }}
              placeholder="Müşteri kodunuzu veya bağlantıyı yapıştırın"
              autoComplete="off"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-[#817b70] focus:border-[#39d0c2]"
            />
          </label>

          {error && <p role="alert" className="text-sm text-[#ff6b35]">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] px-5 py-3.5 font-bold text-[#10100d] transition-transform active:scale-[0.98]"
          >
            Sözleşmeye Devam Et
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-7 border-t border-white/10 pt-5 text-center text-xs leading-5 text-[#817b70]">
          <p>Bağlantınız yoksa Meg Dev yetkilisinden size özel sözleşme bağlantısını isteyin.</p>
          <Link href="/contact" className="mt-2 inline-block font-semibold text-[#39d0c2] hover:underline">
            Bizimle iletişime geçin
          </Link>
        </div>
      </section>
    </main>
  )
}
