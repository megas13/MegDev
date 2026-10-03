import { localizeMetadata } from "@/lib/i18n/server"
import { T } from "@/components/i18n/text"
import { PageIntro } from "@/components/ui/page-intro"
import type { Metadata } from "next"
import { AlertTriangle, Check, Mail, ShieldCheck } from "lucide-react"
import { DeletionForm } from "./deletion-form"

const sourceMetadata: Metadata = {
  title: "SubTrack Hesap ve Veri Silme",
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
    <div data-document>
      <PageIntro eyebrow="SUBTRACK / HESAP" title="Hesap ve veri silme." description="Bu sayfa üzerinden SubTrack hesabınızın ve hesabınızla ilişkili verilerin silinmesini talep edebilirsiniz." />

      <section className="relative overflow-hidden pb-20 lg:pb-28">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <DeletionForm />

          <div className="space-y-6">
            <article className="document-panel scroll-mt-28">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold"><T>{"Silinen veriler"}</T></h2>
              </div>
              <ul className="space-y-3">
                {deletedData.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span><T>{item}</T></span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
                <h2 className="text-xl font-bold"><T>{"Saklanabilecek kayıtlar"}</T></h2>
              </div>
              <p className="leading-7 text-muted-foreground">
                <T>{"Yasal yükümlülükler, güvenlik ve dolandırıcılığın önlenmesi amacıyla saklanması zorunlu sınırlı kayıtlar gerekli süre boyunca tutulabilir. Google Play üzerinden yapılan işlemlerin kayıtları Google’ın kendi saklama politikalarına tabidir."}</T></p>
            </article>

            <article className="noise-panel rounded-2xl border border-foreground/10 p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="font-bold"><T>{"Destek"}</T></h2>
              </div>
              <p className="text-muted-foreground">
                <T>{"İşlemle ilgili yardıma ihtiyacınız varsa"}</T><T>{" "}</T>
                <a
                  href="mailto:destek@megdev.info"
                  className="font-semibold text-primary hover:underline"
                >
                  <T>{"destek@megdev.info"}</T></a><T>{" "}</T>
                <T>{"adresinden bize ulaşabilirsiniz."}</T></p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
