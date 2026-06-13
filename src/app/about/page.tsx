import type { Metadata } from "next"
import { AboutSection } from "@/components/sections/about-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { StatsSection } from "@/components/sections/stats-section"
import { CTASection } from "@/components/sections/cta-section"

export const metadata: Metadata = {
  title: "Hakkımızda | Meg Dev",
  description: "Meg Dev'in hikayesi, misyonu, vizyonu ve neden bizi tercih etmelisiniz?",
}

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Hakkımızda</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Teknolojiye tutkuyla bağlı ekibimizle tanışın.
          </p>
        </div>
      </div>
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
