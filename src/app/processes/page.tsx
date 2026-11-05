import { getLanguage, localizeMetadata } from "@/lib/i18n/server"
import { faqs } from "@/constants"
import { faqJsonLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import type { Metadata } from "next"
import { PageIntro } from "@/components/ui/page-intro"
import { ProcessesSection } from "@/components/sections/processes-section"
import { FAQSection } from "@/components/sections/faq-section"

const sourceMetadata: Metadata = {
  title: "Çalışma Süreçlerimiz",
  description: "Projelerimizi 6 aşamalı süreçle titizlikle yönetiyoruz: Analiz, Tasarım, Geliştirme, Test, Yayınlama, Destek.",
}

export default async function ProcessesPage() {
  const { locale, t } = await getLanguage()
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...faqJsonLd(
            faqs.map((faq) => ({ question: t(faq.question), answer: t(faq.answer) })),
            locale,
            "/processes",
          ),
        }}
      />
      <PageIntro index="04" eyebrow="BİRLİKTE ÜRETİYORUZ" title="Süreçlerimiz" description="Projenizi fikir aşamasından lansmana kadar titizlikle yönettiğimiz 6 aşamalı süreç." />
      <ProcessesSection />
      <FAQSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
