import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { ContactSection } from "@/components/sections/contact-section"
import { FAQSection } from "@/components/sections/faq-section"
import { PageIntro } from "@/components/ui/page-intro"

const sourceMetadata: Metadata = {
  title: "İletişim",
  description: "Meg Dev ile iletişime geçin. Projeleriniz için teklif alın ve size özel çözümler keşfedin.",
}

export default function ContactPage() {
  return (
    <div>
      <PageIntro eyebrow="İletişim" title="Birlikte başlayalım." description="Projeniz hakkında konuşmak için bize ulaşın. Size en kısa sürede dönüş yapalım." index="06" />
      <ContactSection />
      <FAQSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
