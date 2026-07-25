"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, ArrowUpRight, Brain, Code2, Globe2,
  Layers3, Play, ShieldCheck, ShoppingBag, Smartphone,
  Sparkles, Star, ChevronDown, Check, Terminal, Cpu, Heart, Search
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CalculatorSection } from "@/components/sections/calculator-section"
import { services, portfolioItems, processes, testimonials, faqs } from "@/constants"

// Icons mapping for services and processes
const serviceIconMap: Record<string, React.ReactNode> = {
  Globe: <Globe2 className="w-6 h-6" />,
  ShoppingCart: <ShoppingBag className="w-6 h-6" />,
  Users: <Layers3 className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Code: <Code2 className="w-6 h-6" />,
}

const processIconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5" />,
  Palette: <Sparkles className="w-5 h-5" />,
  Code: <Code2 className="w-5 h-5" />,
  BugPlay: <ShieldCheck className="w-5 h-5" />,
  Rocket: <ArrowUpRight className="w-5 h-5" />,
  Headset: <Heart className="w-5 h-5" />,
}

export default function Home() {
  const [heroTab, setHeroTab] = useState<"app" | "metrics" | "code">("app")
  const [openFaqId, setOpenFaqId] = useState<number | null>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [typedCode, setTypedCode] = useState("")

  const codeSnippet = `import { MegDev } from "agency";

export default function Project() {
  return (
    <MegDev
      speed="ekspres"
      design="premium"
      quality="excellence"
      status="running"
    />
  );
}`

  useEffect(() => {
    let index = 0
    setTypedCode("")
    const interval = setInterval(() => {
      if (index < codeSnippet.length) {
        setTypedCode((prev) => prev + codeSnippet.charAt(index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [heroTab])

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-screen bg-[#10100d] text-[#f7f3ea] overflow-hidden font-sans">
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute -top-[25%] -right-[10%] w-[60rem] h-[60rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary,rgba(215,255,67,0.15))_35%,transparent),transparent_70%)] blur-[80px] animate-pulse-glow" />
        <div className="absolute top-[30%] -left-[20%] w-[50rem] h-[50rem] rounded-full bg-[radial-gradient(circle,rgba(57,208,194,0.12),transparent_70%)] blur-[90px]" />
        <div className="absolute -bottom-[20%] right-[10%] w-[55rem] h-[55rem] rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.08),transparent_70%)] blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center pt-28 pb-16 lg:pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-4 w-4" />
                Fikirden Çalışan Dijital Ürüne
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight">
                Fikirlerinizi <span className="text-gradient">Kusursuz</span> Dijital Ürünlere Dönüştürüyoruz.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Strateji, tasarım ve teknolojiyi tek bir çatı altında birleştiren bağımsız yazılım stüdyosu. İşletmenizi geleceğe taşıyan modern çözümler inşa ediyoruz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto text-base font-bold shadow-lg shadow-primary/20">
                    Proje Başlat
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="#portfolio">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-bold hover:bg-white/5 transition-all">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    İşlerimizi İnceleyin
                  </Button>
                </Link>
              </div>

              {/* Stats Band */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-foreground/10 max-w-lg">
                <div>
                  <p className="text-3xl font-black text-primary">150+</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Başarılı Teslim</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary">50+</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Mutlu Müşteri</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary">%98</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Memnuniyet</p>
                </div>
              </div>
            </motion.div>

            {/* Right Widget - Interactive Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative w-full lg:max-w-md mx-auto"
            >
              <div className="glass-morphism rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* Dashboard Header */}
                <div className="bg-[#181713]/80 border-b border-white/10 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">system_monitor.sh</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                  </span>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex border-b border-white/5 bg-[#14130f]">
                  {(["app", "metrics", "code"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setHeroTab(tab)}
                      className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b ${
                        heroTab === tab
                          ? "border-primary text-primary bg-[#181713]"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-[#181713]/40"
                      }`}
                    >
                      {tab === "app" ? "Uygulama" : tab === "metrics" ? "Metrikler" : "Kaynak Kod"}
                    </button>
                  ))}
                </div>

                {/* Dashboard Body */}
                <div className="p-6 min-h-[300px] flex flex-col justify-between bg-[#12120e]/60">
                  <AnimatePresence mode="wait">
                    {heroTab === "app" && (
                      <motion.div
                        key="app"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                      >
                        <div className="flex justify-between items-center bg-white/[0.03] p-3 rounded-lg border border-white/5">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Son Tamamlanan Modül</p>
                            <p className="text-sm font-black mt-0.5">Stripe Ödeme Altyapısı</p>
                          </div>
                          <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded">100% OK</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono text-muted-foreground">
                            <span>Kapsam Tamamlanma Hızı</span>
                            <span className="text-primary font-bold">4.8x</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "82%" }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-primary to-accent"
                            />
                          </div>
                        </div>

                        {/* Miniature Chart */}
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-3">Haftalık Teslimat Grafiği</p>
                          <div className="h-16 flex items-end gap-2.5">
                            {[35, 60, 48, 85, 70, 95, 80].map((height, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                                className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {heroTab === "metrics" && (
                      <motion.div
                        key="metrics"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 font-mono text-sm"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-lg text-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Performans</span>
                            <strong className="block text-2xl text-green-400 mt-1">100%</strong>
                          </div>
                          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-lg text-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">SEO Skoru</span>
                            <strong className="block text-2xl text-green-400 mt-1">100%</strong>
                          </div>
                          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-lg text-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Yüklenme Süresi</span>
                            <strong className="block text-2xl text-primary mt-1">0.6s</strong>
                          </div>
                          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-lg text-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Çalışma Süresi (Uptime)</span>
                            <strong className="block text-2xl text-accent mt-1">99.98%</strong>
                          </div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-primary shrink-0" />
                          <span>Google Lighthouse standartlarında en yüksek verimlilik oranıyla kodlama yapıyoruz.</span>
                        </div>
                      </motion.div>
                    )}

                    {heroTab === "code" && (
                      <motion.div
                        key="code"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-xs text-left"
                      >
                        <pre className="whitespace-pre-wrap text-primary/90 bg-[#0c0c09] p-4 rounded-lg border border-white/5 overflow-x-auto min-h-[220px]">
                          <code>
                            {typedCode}
                            <span className="animate-pulse">|</span>
                          </code>
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> status: online
                    </span>
                    <span>v0.12.0</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-28 lg:py-36 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.25em] font-bold">YETENEKLERİMİZ</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">Hangi Alanlarda Çözüm Üretiyoruz?</h2>
            <p className="text-lg text-muted-foreground">Gelişmiş teknolojilerle donatılmış, işlevsel ve kullanıcı dostu yazılım altyapıları.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border border-white/10 bg-white/10 rounded-xl overflow-hidden shadow-2xl">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="group relative h-full bg-[#181713]/70 backdrop-blur-sm p-8 hover:bg-[#1f1e19]/90 transition-all duration-300 flex flex-col justify-between">
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.gradient}`} />
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-xs text-muted-foreground/60 font-bold">
                        {String(index + 1).padStart(2, "0")} / HİZMET
                      </span>
                      <div className={`flex h-12 w-12 items-center justify-center bg-gradient-to-br ${service.gradient} text-background rounded-lg shadow-lg`}>
                        {serviceIconMap[service.icon]}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <ul className="space-y-2.5 pt-6 border-t border-white/5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground/90">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
