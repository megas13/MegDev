import type { Metadata } from "next"
import { ServicesSection } from "@/components/sections/services-section"
import { CTASection } from "@/components/sections/cta-section"

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Meg Dev",
  description:
    "Kurumsal web sitesi, e-ticaret, CRM, mobil uygulama, yapay zeka ve özel yazılım geliştirme hizmetlerimiz.",
}

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Hizmetlerimiz</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            İşletmenizin ihtiyaçlarına özel, modern teknolojilerle geliştirilmiş kapsamlı yazılım çözümleri.
          </p>
        </div>
      </div>
      <ServicesSection />
      <CTASection />
    </div>
  )
}
