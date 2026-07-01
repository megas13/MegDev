import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { TechStackSection } from "@/components/sections/tech-stack-section"
import { StatsSection } from "@/components/sections/stats-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProcessesSection } from "@/components/sections/processes-section"
import { ToolStackSection } from "@/components/sections/tool-stack-section"
import { ClientPortalSection } from "@/components/sections/client-portal-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { FAQSection } from "@/components/sections/faq-section"
import { BlogSection } from "@/components/sections/blog-section"
import { CTASection } from "@/components/sections/cta-section"
import { CalculatorSection } from "@/components/sections/calculator-section"
import { ContactSection } from "@/components/sections/contact-section"
import { StickySlide } from "@/components/sticky-slide"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TechStackSection />
      <StickySlide>
        <StatsSection />
      </StickySlide>
      <PortfolioSection />
      <AboutSection />
      <ProcessesSection />
      <ToolStackSection />
      <ClientPortalSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
      <CalculatorSection />
      <ContactSection />
    </>
  )
}
