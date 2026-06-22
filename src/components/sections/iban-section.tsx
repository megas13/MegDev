"use client"

import { useState } from "react"
import { Copy, Check, Building2, CreditCard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const IBAN = "TR39 0001 5001 5800 7317 6191 97"
const bankName = "VakıfBank"

type Tab = "card" | "transfer"

export function IBANSection() {
  const [tab, setTab] = useState<Tab>("card")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(IBAN)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = IBAN
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-4">Ödeme Seçenekleri</p>
          <h2 className="text-3xl md:text-5xl font-black">Ödeme yönteminizi seçin</h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-foreground/10 bg-foreground/[0.04] p-1">
            <button
              onClick={() => setTab("card")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                tab === "card"
                  ? "bg-primary text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Kart ile Ödeme
            </button>
            <button
              onClick={() => setTab("transfer")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                tab === "transfer"
                  ? "bg-primary text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Havale / EFT
            </button>
          </div>
        </div>

        {/* Kart ile Ödeme */}
        {tab === "card" && (
          <div className="max-w-lg mx-auto">
            <div className="sharp-panel rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-lime-300 to-teal-300 p-3 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kredi Kartı ile Ödeme</h3>
              <p className="text-muted-foreground mb-6">
                Tüm kredi kartlarına taksit imkanı. 3D Secure ile güvenli ödeme.
              </p>
              <Link href="/contact">
                <Button size="lg" className="text-base w-full">
                  Ödeme Bağlantısı Alın
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Havale / EFT */}
        {tab === "transfer" && (
          <div className="max-w-lg mx-auto">
            <div className="sharp-panel rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-500 p-3 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-background" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Banka</p>
              <p className="text-xl font-bold mb-6">{bankName}</p>
              <p className="text-sm text-muted-foreground mb-2">IBAN</p>
              <div className="flex items-center gap-3 bg-background/50 border border-foreground/10 rounded-xl p-4 mb-4">
                <code className="flex-1 text-sm md:text-base font-mono text-primary text-center tracking-wider select-all">
                  {IBAN}
                </code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 flex items-center justify-center transition-colors"
                  title="Kopyala"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Havale sonrası bildirim için WhatsApp üzerinden iletişime geçin.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
