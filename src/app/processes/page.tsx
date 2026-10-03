import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { PageIntro } from "@/components/ui/page-intro"
import { ProcessesSection } from "@/components/sections/processes-section"
import { FAQSection } from "@/components/sections/faq-section"

const sourceMetadata: Metadata = {
  title: "Çalışma Süreçlerimiz",
  description: "Projelerimizi 6 aşamalı süreçle titizlikle yönetiyoruz: Analiz, Tasarım, Geliştirme, Test, Yayınlama, Destek.",
}

export default function ProcessesPage() {
  return (
    <div>
      <PageIntro index="04" eyebrow="BİRLİKTE ÜRETİYORUZ" title="Süreçlerimiz" description="Projenizi fikir aşamasından lansmana kadar titizlikle yönettiğimiz 6 aşamalı süreç." />
      <ProcessesSection />
      <FAQSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
