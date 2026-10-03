import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { PageIntro } from "@/components/ui/page-intro"
import { PortfolioSection } from "@/components/sections/portfolio-section"

const sourceMetadata: Metadata = {
  title: "Portföy",
  description: "Tamamladığımız projeler ve müşterilerimiz için geliştirdiğimiz yazılım çözümleri.",
}

export default function PortfolioPage() {
  return (
    <div>
      <PageIntro index="03" eyebrow="FİKİRDEN GERÇEĞE" title="Portföyümüz" description="Sektörün önde gelen markaları için geliştirdiğimiz yenilikçi projeler." />
      <PortfolioSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
