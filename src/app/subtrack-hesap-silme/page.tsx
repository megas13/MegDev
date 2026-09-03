import type { Metadata } from "next"
import { AlertTriangle, Check, FileX2, Mail, ShieldCheck } from "lucide-react"
import { DeletionForm } from "./deletion-form"

export const metadata: Metadata = {
  title: "SubTrack Hesap ve Veri Silme | Meg Dev",
  description:
    "SubTrack hesabınızın ve hesabınızla ilişkili kullanıcı verilerinin silinmesini talep edin.",
  robots: {
    index: false,
    follow: false,
  },
}

const deletedData = [
  "Hesap ve profil bilgileri",
  "Abonelik kayıtları",
  "Ödeme geçmişi",
  "Uygulama tercihleri",
  "Arkadaş daveti bilgileri",
  "Hesapla ilişkili diğer kullanıcı verileri",
]

export default function SubTrackHesapSilmePage() {
  return (
    <div className="pt-20">
      <div className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-primary/20">
            <FileX2 className="h-8 w-8 text-red-400" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            SubTrack
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            <span className="text-gradient">Hesap ve Veri Silme</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Bu sayfa üzerinden SubTrack hesabınızın ve hesabınızla ilişkili
            verilerin silinmesini talep edebilirsiniz.
          </p>
        </div>
      </div>

      <section className="relative overflow-hidden pb-20 lg:pb-28">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <DeletionForm />

          <div className="space-y-6">
            <article className="sharp-panel rounded-2xl p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Silinen veriler</h2>
              </div>
              <ul className="space-y-3">
                {deletedData.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
                <h2 className="text-xl font-bold">Saklanabilecek kayıtlar</h2>
              </div>
              <p className="leading-7 text-muted-foreground">
                Yasal yükümlülükler, güvenlik ve dolandırıcılığın önlenmesi
                amacıyla saklanması zorunlu sınırlı kayıtlar gerekli süre
                boyunca tutulabilir. Google Play üzerinden yapılan işlemlerin
                kayıtları Google’ın kendi saklama politikalarına tabidir.
              </p>
            </article>

            <article className="noise-panel rounded-2xl border border-foreground/10 p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="font-bold">Destek</h2>
              </div>
              <p className="text-muted-foreground">
                İşlemle ilgili yardıma ihtiyacınız varsa{" "}
                <a
                  href="mailto:destek@megdev.info"
                  className="font-semibold text-primary hover:underline"
                >
                  destek@megdev.info
                </a>{" "}
                adresinden bize ulaşabilirsiniz.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
