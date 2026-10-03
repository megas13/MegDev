"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useLanguage } from "@/components/i18n/provider"
import { KeyboardEvent, ClipboardEvent, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, KeyRound, Loader, LockKeyhole, Mail, RotateCw, ShieldCheck } from "lucide-react"

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
  const { t } = useLanguage()
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState("")
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [shakeKey, setShakeKey] = useState(0)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

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
        setCode("")
        setMessageType("success")
        setMessage(`6 haneli kod ${data.email} adresine gönderildi.`)
        window.setTimeout(() => inputRefs.current[0]?.focus(), 150)
      } else {
        onAccepted()
      }
    } catch (error) {
      setMessageType("error")
      setShakeKey((current) => current + 1)
      setMessage(error instanceof Error ? error.message : "İşlem tamamlanamadı")
    } finally {
      setLoading(false)
    }
  }

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1)
    const digits = Array.from({ length: 6 }, (_, digitIndex) => code[digitIndex] ?? "")
    digits[index] = digit
    setCode(digits.join(""))
    setMessage(null)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (event.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus()
    if (event.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus()
    if (event.key === "Enter" && code.length === 6 && checked && !loading) submit("accept")
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pastedCode) return
    event.preventDefault()
    setCode(pastedCode)
    setMessage(null)
    inputRefs.current[Math.min(pastedCode.length, 6) - 1]?.focus()
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent"><T>{"Meg Dev · Güvenli kabul"}</T></p>
            <h1 className="text-2xl font-black sm:text-3xl"><T>{"Gizlilik Sözleşmesi"}</T></h1>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-8">
          <div className="mb-5 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground"><T>{"Müşteri:"}</T></span> <T>{status.customer_name}</T></p>
            <p><span className="text-muted-foreground"><T>{"Proje:"}</T></span> <T>{status.project_title}</T></p>
            <p><span className="text-muted-foreground"><T>{"Doğrulama:"}</T></span> <T>{status.customer_email}</T></p>
            <p><span className="text-muted-foreground"><T>{"Sürüm:"}</T></span> <T>{status.contract_version}</T></p>
          </div>

          <div className="max-h-[48vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#0b0b09] p-5 text-sm leading-7 text-[#c9c1b5] sm:p-6">
            <T>{status.contract}</T>
          </div>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span className="text-sm leading-6">
                <T>{"Gizlilik Sözleşmesi’nin tamamını okudum, anladım ve hükümlerini kabul ediyorum. Kabul işlemimin tarih, hesap ve teknik işlem kayıtlarıyla saklanacağını biliyorum."}</T></span>
            </label>

            {!codeSent ? (
              <button
                type="button"
                disabled={!checked || loading}
                onClick={() => submit("send_code")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                <T>{"E-posta Doğrulama Kodu Gönder"}</T></button>
            ) : (
              <motion.div
                key={shakeKey}
                initial={{ opacity: 0, y: 14 }}
                animate={messageType === "error" && message ? { opacity: 1, y: 0, x: [0, -7, 7, -5, 5, 0] } : { opacity: 1, y: 0, x: 0 }}
                transition={{ duration: messageType === "error" && message ? 0.42 : 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white/[0.025] to-primary/5 p-5 sm:p-6"
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative text-center">
                  <motion.div
                    initial={{ scale: 0.7, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-[0_0_28px_rgba(57,208,194,0.12)]"
                  >
                    <KeyRound className="h-5 w-5 text-accent" />
                  </motion.div>
                  <h2 className="mt-3 text-lg font-black text-foreground"><T>{"E-postanızı kontrol edin"}</T></h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    <T>{status.customer_email}</T> <T>{"adresine gönderilen 6 haneli kodu girin."}</T></p>
                </div>

                <LocalizedElement as="div"
                  onPaste={handlePaste}
                  className="relative mx-auto mt-5 flex max-w-md justify-center gap-2 sm:gap-3"
                  aria-label="6 haneli doğrulama kodu"
                >
                  <T>{Array.from({ length: 6 }, (_, index) => {
                    const digit = code[index] ?? ""
                    return (
                      <motion.input
                        key={index}
                        ref={(element) => { inputRefs.current[index] = element }}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit}
                        onChange={(event) => updateDigit(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onFocus={(event) => event.currentTarget.select()}
                        aria-label={`${t("Doğrulama kodu")} ${index + 1}`}
                        animate={digit ? { scale: [1, 1.08, 1], borderColor: "rgba(215,255,67,0.65)" } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="h-13 min-w-0 w-11 rounded-xl border border-white/15 bg-background/80 text-center font-mono text-xl font-black text-primary caret-accent outline-none transition-[border-color,box-shadow,transform] focus:-translate-y-1 focus:border-accent focus:shadow-[0_8px_24px_rgba(57,208,194,0.13)] sm:h-15 sm:w-14 sm:text-2xl"
                      />
                    )
                  })}</T>
                </LocalizedElement>

                <div className="relative mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <button
                    type="button"
                    disabled={!checked || code.length !== 6 || loading}
                    onClick={() => submit("accept")}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-background shadow-[0_10px_30px_rgba(215,255,67,0.10)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(215,255,67,0.18)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {loading ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5 transition-transform group-hover:scale-110" />}
                    <T>{"Kodu Doğrula ve Kabul Et"}</T></button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => submit("send_code")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-muted-foreground transition-colors hover:border-accent/30 hover:text-accent disabled:opacity-40"
                  >
                    <RotateCw className="h-3.5 w-3.5" /> <T>{"Kodu Yeniden Gönder"}</T></button>
                </div>

                <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-primary"
                    animate={{ width: `${(code.length / 6) * 100}%` }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  />
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {message && (
                <motion.p
                  key={`${messageType}-${message}`}
                  role="status"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-center text-sm ${messageType === "error" ? "text-[#ff6b35]" : "text-accent"}`}
                >
                  <T>{message}</T>
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-1 text-center text-[11px] leading-5 text-muted-foreground">
              <p className="flex items-center justify-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> <T>{" Doğrulama kodu 10 dakika geçerlidir."}</T></p>
              <p><T>{"Sözleşmenin bir kopyası ve kabul özeti e-posta adresinize gönderilecektir."}</T></p>
              <p><T>{"Ticari elektronik ileti izni bu kabulün kapsamında değildir."}</T></p>
              <p className="font-mono"><T>{"SHA-256: "}</T><T>{status.contract_hash}</T></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
