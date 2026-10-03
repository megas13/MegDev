import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { PageIntro } from "@/components/ui/page-intro"
import { ServicesSection } from "@/components/sections/services-section"

const sourceMetadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Kurumsal web sitesi, e-ticaret, CRM, mobil uygulama, yapay zeka ve özel yazılım geliştirme hizmetlerimiz.",
}

export default function ServicesPage() {
  return (
    <div>
      <PageIntro index="02" eyebrow="YETKİNLİKLERİMİZ" title="Hizmetlerimiz" description="İşletmenizin ihtiyaçlarına özel, modern teknolojilerle geliştirilmiş kapsamlı yazılım çözümleri." />
      <ServicesSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
