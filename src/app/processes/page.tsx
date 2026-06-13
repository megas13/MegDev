import type { Metadata } from "next"
import { ProcessesSection } from "@/components/sections/processes-section"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/sections/cta-section"

export const metadata: Metadata = {
  title: "Çalışma Süreçlerimiz | Meg Dev",
  description: "Projelerimizi 6 aşamalı süreçle titizlikle yönetiyoruz: Analiz, Tasarım, Geliştirme, Test, Yayınlama, Destek.",
}

export default function ProcessesPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Süreçlerimiz</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Projenizi fikir aşamasından lansmana kadar titizlikle yönettiğimiz 6 aşamalı süreç.
          </p>
        </div>
      </div>
      <ProcessesSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
