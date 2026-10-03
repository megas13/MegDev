import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { PageIntro } from "@/components/ui/page-intro"
import { AboutSection } from "@/components/sections/about-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { StatsSection } from "@/components/sections/stats-section"

const sourceMetadata: Metadata = {
  title: "Hakkımızda",
  description: "Meg Dev'in hikayesi, misyonu, vizyonu ve neden bizi tercih etmelisiniz?",
}

export default function AboutPage() {
  return (
    <div>
      <PageIntro index="01" eyebrow="BİZ KİMİZ?" title="Hakkımızda" description="Teknolojiye tutkuyla bağlı ekibimizle tanışın." />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
