"use client"


import { useLanguage } from "@/components/i18n/provider"
import { T } from "@/components/i18n/text"
import { useEffect, useState } from "react"
import Link from "@/components/i18n/link"
import { CheckCircle, Loader, ShieldAlert } from "lucide-react"
import { NdaAcceptance, type NdaStatus } from "@/components/nda/nda-acceptance"

export function NdaPageClient({ token }: { token: string }) {
  const { intlLocale } = useLanguage()

  const [status, setStatus] = useState<NdaStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/track/${token}/nda`, { signal: controller.signal })
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.error || "Gizlilik sözleşmesi yüklenemedi")
        setStatus(data)
      })
      .catch((requestError) => {
        if (requestError instanceof Error && requestError.name === "AbortError") return
        setError(requestError instanceof Error ? requestError.message : "Gizlilik sözleşmesi yüklenemedi")
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [token])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Loader className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground"><T>{"Gizlilik sözleşmesi hazırlanıyor..."}</T></p>
        </div>
      </main>
    )
  }

  if (error || !status) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="max-w-md rounded-2xl border border-[#ff6b35]/30 bg-[#ff6b35]/5 p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-[#ff6b35]" />
          <h1 className="text-xl font-bold"><T>{"Sözleşme açılamadı"}</T></h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground"><T>{error}</T></p>
        </div>
      </main>
    )
  }

  if (status.accepted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-lg rounded-2xl border border-primary/25 bg-white/[0.03] p-8 text-center shadow-2xl">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="text-2xl font-black"><T>{"Sözleşme kabul edildi"}</T></h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            <T>{status.project_title}</T> <T>{"projesine ait gizlilik sözleşmesi başarıyla kaydedildi."}</T></p>
          {status.accepted_at && (
            <p className="mt-2 text-xs text-muted-foreground">
              <T>{"Kabul tarihi:"}</T><T>{new Date(status.accepted_at).toLocaleString(intlLocale)}</T>
            </p>
          )}
          <Link
            href={`/track/${token}`}
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-background"
          >
            <T>{"Proje Paneline Devam Et"}</T></Link>
        </div>
      </main>
    )
  }

  return (
    <NdaAcceptance
      token={token}
      status={status}
      onAccepted={() => setStatus({ ...status, accepted: true, accepted_at: new Date().toISOString() })}
    />
  )
}
