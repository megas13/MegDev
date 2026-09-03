"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2, Mail, ShieldCheck, Trash2 } from "lucide-react"

type Step = "email" | "code" | "success"
type Notice = { type: "error" | "info"; message: string } | null

export function DeletionForm() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [website, setWebsite] = useState("")
  const [step, setStep] = useState<Step>("email")
  const [notice, setNotice] = useState<Notice>(null)
  const [loading, setLoading] = useState(false)

  async function submit(action: "send-code" | "verify-and-delete") {
    setLoading(true)
    setNotice(null)

    try {
      const response = await fetch("/api/subtrack/account-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email, code, website }),
      })
      const result = (await response.json()) as { message?: string }
      const message = result.message || "İşlem tamamlanamadı."

      if (!response.ok) {
        setNotice({ type: "error", message })
        return
      }

      if (action === "send-code") {
        setStep("code")
        setNotice({ type: "info", message })
      } else {
        setStep("success")
        setNotice(null)
      }
    } catch {
      setNotice({
        type: "error",
        message: "Bağlantı kurulamadı. Lütfen tekrar deneyin.",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit("send-code")
  }

  function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit("verify-and-delete")
  }

  if (step === "success") {
    return (
      <div
        className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-8 text-center"
        role="status"
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h2 className="mb-2 text-2xl font-bold">Silme işlemi tamamlandı</h2>
        <p className="text-muted-foreground">
          SubTrack hesabınız ve hesabınızla ilişkili kullanıcı verileri kalıcı
          olarak silindi.
        </p>
      </div>
    )
  }

  return (
    <div className="sharp-panel rounded-2xl p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          {step === "email" ? (
            <Mail className="h-6 w-6 text-primary" />
          ) : (
            <ShieldCheck className="h-6 w-6 text-primary" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">
            Adım {step === "email" ? "1" : "2"} / 2
          </p>
          <h2 className="text-xl font-bold">
            {step === "email" ? "E-posta doğrulaması" : "Kodu doğrulayın"}
          </h2>
        </div>
      </div>

      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <label htmlFor="subtrack-email" className="mb-2 block font-medium">
              SubTrack hesabınızdaki e-posta adresi
            </label>
            <input
              id="subtrack-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ornek@eposta.com"
              className="w-full rounded-xl border border-foreground/15 bg-background/70 px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Web sitesi</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
            Doğrulama kodu gönder
          </button>
        </form>
      ) : (
        <form onSubmit={handleDeleteSubmit} className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Kod <strong className="text-foreground">{email}</strong> adresine
            gönderildi. E-postadaki doğrulama kodunu aşağıya girin.
          </p>

          <div>
            <label htmlFor="subtrack-code" className="mb-2 block font-medium">
              Doğrulama kodu
            </label>
            <input
              id="subtrack-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              minLength={6}
              maxLength={8}
              pattern="[0-9]{6,8}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full rounded-xl border border-foreground/15 bg-background/70 px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-muted-foreground">
            Bu işlem geri alınamaz. Doğrulama tamamlandığında hesabınız ve
            ilişkili kullanıcı verileriniz kalıcı olarak silinir.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            Hesabımı ve verilerimi kalıcı olarak sil
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading}
              onClick={() => void submit("send-code")}
              className="flex-1 rounded-xl border border-foreground/15 px-4 py-3 font-medium transition hover:bg-foreground/5 disabled:opacity-60"
            >
              Kodu yeniden gönder
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep("email")
                setCode("")
                setNotice(null)
              }}
              className="flex-1 rounded-xl border border-foreground/15 px-4 py-3 font-medium transition hover:bg-foreground/5 disabled:opacity-60"
            >
              E-postayı değiştir
            </button>
          </div>
        </form>
      )}

      {notice && (
        <p
          className={`mt-5 rounded-xl border p-4 text-sm ${
            notice.type === "error"
              ? "border-red-400/30 bg-red-400/10 text-red-300"
              : "border-primary/30 bg-primary/10 text-muted-foreground"
          }`}
          role={notice.type === "error" ? "alert" : "status"}
        >
          {notice.message}
        </p>
      )}
    </div>
  )
}
