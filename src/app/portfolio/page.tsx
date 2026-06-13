import type { Metadata } from "next"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { CTASection } from "@/components/sections/cta-section"

export const metadata: Metadata = {
  title: "Portföy | Meg Dev",
  description: "Tamamladığımız projeler ve müşterilerimiz için geliştirdiğimiz yazılım çözümleri.",
}

export default function PortfolioPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Portföyümüz</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sektörün önde gelen markaları için geliştirdiğimiz yenilikçi projeler.
          </p>
        </div>
      </div>
      <PortfolioSection />
      <CTASection />
    </div>
  )
}
