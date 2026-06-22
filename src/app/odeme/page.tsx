import type { Metadata } from "next"
import { CreditCard, ShieldCheck, Truck, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IBANSection } from "@/components/sections/iban-section"

export const metadata: Metadata = {
  title: "Ödeme | Meg Dev",
  description: "Meg Dev hizmetleri için kullanabileceğiniz ödeme yöntemleri. Kredi kartı, banka havalesi ve daha fazlası.",
}

const features = [
  {
    title: "Güvenli Ödeme",
    description: "Tüm ödemeler 3D Secure ile korunur. Kart bilgileriniz kaydedilmez.",
    icon: ShieldCheck,
  },
  {
    title: "Taksit Seçenekleri",
    description: "Kredi kartına taksit imkanı ile bütçenize uygun ödeme planı.",
    icon: CreditCard,
  },
  {
    title: "Hızlı Aktivasyon",
    description: "Ödeme onaylandıktan sonra projeniz hemen başlatılır.",
    icon: Truck,
  },
  {
    title: "7/24 Destek",
    description: "Ödeme ile ilgili her konuda WhatsApp üzerinden destek alabilirsiniz.",
    icon: CheckCircle,
  },
]

const steps = [
  { number: "01", title: "Proje Seçimi", description: "Size uygun hizmet paketini belirleyin." },
  { number: "02", title: "Ödeme Yöntemi", description: "Tercih ettiğiniz ödeme yöntemini seçin." },
  { number: "03", title: "Güvenli Ödeme", description: "3D Secure ile ödemenizi tamamlayın." },
  { number: "04", title: "Hemen Başlayın", description: "Projeniz için çalışmalar başlasın." },
]

export default function OdemePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Ödeme Yöntemleri</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Size en uygun ödeme yöntemiyle projenizi başlatın. Tüm ödemeler güvenli altyapı ile korunur.
          </p>
        </div>
      </div>

      {/* Ödeme Yöntemi Seçici */}
      <IBANSection />

      {/* Nasıl Çalışır */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent mb-4">Süreç</p>
            <h2 className="text-3xl md:text-5xl font-black">Ödeme nasıl işler?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-black text-primary">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Güvenli Ödeme */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary mb-4">Güvenlik</p>
            <h2 className="text-3xl md:text-5xl font-black">Ödemeniz güvende</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="noise-panel border border-foreground/10 rounded-2xl p-8 text-center hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="noise-panel border-y border-foreground/10 py-14 text-center">
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              Projeniz için ödeme yapmak mı istiyorsunuz?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Size en uygun ödeme yöntemini birlikte belirleyelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-base">
                  İletişime Geçin
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="text-base">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
