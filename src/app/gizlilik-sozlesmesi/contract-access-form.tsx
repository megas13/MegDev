"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useLanguage } from "@/components/i18n/provider"
import { localizedHref } from "@/lib/i18n/config"
import { FormEvent, useState } from "react"
import Link from "@/components/i18n/link"
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
  const { locale } = useLanguage()
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
    router.push(localizedHref(`/gizlilik-sozlesmesi/${encodeURIComponent(token)}`, locale))
  }

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-4 pt-36 pb-24 text-foreground">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-9">
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent"><T>{"Meg Dev · Güvenli sözleşme"}</T></p>
            <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-4xl"><T>{"Gizlilik Sözleşmesi"}</T></h1>
          </div>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          <T>{"Her sözleşme müşteri ve proje bilgilerine özel hazırlanır. Devam etmek için size iletilen müşteri kodunu veya sözleşme bağlantısının tamamını aşağıya girin."}</T></p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <KeyRound className="h-4 w-4" /> <T>{"Müşteri kodu veya bağlantı"}</T></span>
            <LocalizedElement as="input"
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                setError(null)
              }}
              placeholder="Müşteri kodunuzu veya bağlantıyı yapıştırın"
              autoComplete="off"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
            />
          </label>

          {error && <p role="alert" className="text-sm text-[#ff6b35]"><T>{error}</T></p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-bold text-background transition-transform active:scale-[0.98]"
          >
            <T>{"Sözleşmeye Devam Et"}</T><ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-7 border-t border-white/10 pt-5 text-center text-xs leading-5 text-muted-foreground">
          <p><T>{"Bağlantınız yoksa Meg Dev yetkilisinden size özel sözleşme bağlantısını isteyin."}</T></p>
          <Link href="/contact" className="mt-2 inline-block font-semibold text-accent hover:underline">
            <T>{"Bizimle iletişime geçin"}</T></Link>
        </div>
      </section>
    </main>
  )
}
