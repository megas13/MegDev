import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { StatsSection } from "@/components/sections/stats-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProcessesSection } from "@/components/sections/processes-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { FAQSection } from "@/components/sections/faq-section"
import { BlogSection } from "@/components/sections/blog-section"
import { CTASection } from "@/components/sections/cta-section"
import { ContactSection } from "@/components/sections/contact-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <PortfolioSection />
      <AboutSection />
      <ProcessesSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
      <ContactSection />
    </>
  )
}
