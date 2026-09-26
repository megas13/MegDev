"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, ArrowUpRight, Code2,
  ShieldCheck,
  Sparkles, Star, ChevronDown, Heart, Search
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CalculatorSection } from "@/components/sections/calculator-section"
import { CinematicHero } from "@/components/sections/cinematic-hero"
import { ServicesShowcase } from "@/components/sections/services-showcase"
import { portfolioItems, processes, testimonials, faqs } from "@/constants"

const processIconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5" />,
  Palette: <Sparkles className="w-5 h-5" />,
  Code: <Code2 className="w-5 h-5" />,
  BugPlay: <ShieldCheck className="w-5 h-5" />,
  Rocket: <ArrowUpRight className="w-5 h-5" />,
  Headset: <Heart className="w-5 h-5" />,
}

export default function Home() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-screen bg-[#10100d] text-[#f7f3ea] overflow-x-clip font-sans">
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute -top-[25%] -right-[10%] w-[60rem] h-[60rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary,rgba(215,255,67,0.15))_35%,transparent),transparent_70%)] blur-[80px] animate-pulse-glow" />
        <div className="absolute top-[30%] -left-[20%] w-[50rem] h-[50rem] rounded-full bg-[radial-gradient(circle,rgba(57,208,194,0.12),transparent_70%)] blur-[90px]" />
        <div className="absolute -bottom-[20%] right-[10%] w-[55rem] h-[55rem] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.08),transparent_70%)] blur-[100px]" />
      </div>

      <CinematicHero />
      <div id="home-content" className="scroll-mt-20" />

      <ServicesShowcase />

      {/* Featured Portfolio Section */}
      <section id="portfolio" className="relative py-28 lg:py-36 border-t border-foreground/10 bg-[#12120f]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] font-bold">PORTFÖYÜMÜZ</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">Neler Ürettik?</h2>
            <p className="text-lg text-muted-foreground">Farklı sektörlerde iş hedefleri net, kullanıcı arayüzü güçlü ve hızlı dijital ürünler.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.slice(0, 3).map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#181713]/60 border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary" className="font-bold text-[10px] tracking-wider uppercase">{item.category}</Badge>
                    <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/5 rounded text-muted-foreground animate-none">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="hover:bg-white/5 font-bold">
                Tüm Projeleri İnceleyin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Project Configurator */}
      <CalculatorSection />

      {/* Development Process Timeline */}
      <section id="processes" className="relative py-28 lg:py-36 border-t border-foreground/10 bg-[#12120f]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] font-bold">ÇALIŞMA SÜRECİMİZ</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">Nasıl Geliştiriyoruz?</h2>
            <p className="text-lg text-muted-foreground">Fikir aşamasından yayın sonrasına kadar tüm süreci şeffaf ve ölçülebilir adımlarla yönetiyoruz.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processes.map((process, index) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative bg-[#181713]/60 border border-white/10 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-3xl font-black text-white/5 group-hover:text-primary/10 transition-colors">
                      {String(process.id).padStart(2, "0")}
                    </span>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${process.color} flex items-center justify-center text-background shadow-lg`}>
                      {processIconMap[process.icon]}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{process.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{process.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="relative py-28 lg:py-36 border-t border-foreground/10 bg-[#10100d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] font-bold">MÜŞTERİ REFERANSLARI</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">Hakkımızda Ne Dediler?</h2>
            <p className="text-lg text-muted-foreground">Birlikte iş ortaklığı kurup dijital ürünler geliştirdiğimiz ekiplerin yorumları.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <Card className="h-full relative overflow-hidden bg-[#181713]/60 border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary shrink-0" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic mb-8">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-3.5 pt-6 border-t border-white/5">
                    <div className="flex h-11 w-11 items-center justify-center bg-primary text-sm font-black text-background rounded-full shadow-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-28 lg:py-36 border-t border-foreground/10 bg-[#12120f]/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] font-bold">SSS</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Merak Edilenler</h2>
            <p className="text-base text-muted-foreground">Projeler, ödeme planları ve geliştirme süreci hakkında en çok sorulan sorular.</p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Soruları arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#181713]/60 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                layout
                className="overflow-hidden border border-white/10 bg-[#181713]/40 rounded-xl"
              >
                <button
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="font-bold text-sm sm:text-base pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaqId === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaqId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 lg:py-36 overflow-hidden border-t border-foreground/10">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-morphism rounded-3xl border border-white/10 p-8 sm:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-block text-primary font-mono text-xs uppercase tracking-[0.25em] font-bold mb-4">
              PROJEYE BAŞLAYIN
            </span>
            <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-6">
              Aklınızdaki Fikri Gerçeğe Dönüştürelim.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              15 dakikalık ücretsiz bir keşif görüşmesiyle kapsamı, yol haritasını ve yaklaşık bütçeyi birlikte netleştirelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto text-base font-bold shadow-lg shadow-primary/20">
                  Hemen Teklif Alın
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link href="#services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-bold hover:bg-white/5">
                  Hizmetlerimizi Keşfedin
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
