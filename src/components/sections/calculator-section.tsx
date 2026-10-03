"use client"


import { useLanguage } from "@/components/i18n/provider"
import { T, LocalizedElement } from "@/components/i18n/text"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { siteConfig } from "@/constants"
import emailjs from "@emailjs/browser"
import styles from "./public-experience.module.css"
import { 
  Calculator, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Send,
  MessageSquare,
  Sparkles,
  Loader2,
  Globe,
  ShoppingBag,
  Layers,
  Cpu,
  Cloud
} from "lucide-react"

interface ProjectType {
  id: string
  name: string
  baseCost: number
  baseWeeks: number
  description: string
  icon: LucideIcon
  features: string[]
  techStack: string[]
}

interface ExtraModule {
  id: string
  name: string
  cost: number
  weeks: number
  description: string
  category: "core" | "advanced" | "infra"
}

interface DesignLevel {
  id: string
  name: string
  cost: number
  weeks: number
  description: string
  features: string[]
}

interface DeliverySpeed {
  id: string
  name: string
  costFactor: number
  weeksFactor: number
  description: string
  badge: string
}

export function CalculatorSection() {
  const { intlLocale, t } = useLanguage()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Selection States
  const [projectType, setProjectType] = useState<string>("web")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [designLevel, setDesignLevel] = useState<string>("standard")
  const [deliverySpeed, setDeliverySpeed] = useState<string>("normal")
  
  // Contact & Details States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [infrastructure, setInfrastructure] = useState("megdev-recommends")
  const [notes, setNotes] = useState("")

  const projectTypes: ProjectType[] = [
    { 
      id: "web", 
      name: "Kurumsal Web Sitesi", 
      baseCost: 15000, 
      baseWeeks: 4, 
      description: "Markanızı yansıtan, hızlı ve SEO uyumlu tanıtım siteleri.",
      icon: Globe,
      features: ["Responsive (Mobil Uyumlu) Tasarım", "SEO Dostu Sayfa Yapısı", "CMS / Admin Paneli Entegrasyonu", "İletişim Formları & Google Harita"],
      techStack: ["Next.js", "React", "Tailwind CSS", "Vercel"]
    },
    { 
      id: "ecommerce", 
      name: "E-Ticaret Platformu", 
      baseCost: 35000, 
      baseWeeks: 8, 
      description: "Güçlü altyapılı, ödeme entegrasyonlu satış siteleri.",
      icon: ShoppingBag,
      features: ["Gelişmiş Ürün Kataloğu", "Alışveriş Sepeti & Ödeme Adımları", "Stok / Sipariş Takip Paneli", "E-Posta & SMS Bildirimleri"],
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe / Iyzico"]
    },
    { 
      id: "crm", 
      name: "CRM & Yönetim Panelleri", 
      baseCost: 45000, 
      baseWeeks: 10, 
      description: "Operasyon ve müşteri yönetim süreçlerinize özel ERP/CRM.",
      icon: Layers,
      features: ["Kullanıcı Yetkilendirme & Rolleri", "Dinamik Tablolar & PDF/Excel Rapor", "Detaylı Aktivite Günlüğü (Log)", "Müşteri & Süreç Yönetimi"],
      techStack: ["React", "FastAPI", "MongoDB", "Docker"]
    },
    { 
      id: "ai", 
      name: "Yapay Zeka (AI) Çözümü", 
      baseCost: 60000, 
      baseWeeks: 12, 
      description: "Akıllı öneri modelleri, veri işleme ve chatbot servisleri.",
      icon: Cpu,
      features: ["OpenAI / Claude API Entegrasyonu", "Vektör Veritabanı Kurulumu", "Veri Analizi & Görselleştirme", "Özelleştirilmiş Prompt Yapıları"],
      techStack: ["Python", "LangChain", "FastAPI", "Pinecone"]
    },
    { 
      id: "saas", 
      name: "Özel SaaS & Yazılım", 
      baseCost: 75000, 
      baseWeeks: 16, 
      description: "Sıfırdan ölçeklenebilir bulut uygulamaları ve özel kodlama.",
      icon: Cloud,
      features: ["Çoklu Kiracılı (Multi-tenant) Yapı", "Abonelik ve Stripe Entegrasyonu", "API Ağ Geçidi & Dokümantasyonu", "Gelişmiş Veri Güvenliği ve CDN"],
      techStack: ["Next.js", "Node.js", "Redis", "AWS / Supabase"]
    },
  ]

  const extraModules: ExtraModule[] = [
    // Core Functions
    { id: "auth", name: "Üyelik & Yetkilendirme (OTP)", cost: 5000, weeks: 1, description: "SMS/E-posta doğrulama ile güvenli üye girişi.", category: "core" },
    { id: "payment", name: "Ödeme Geçidi Entegrasyonu", cost: 7500, weeks: 1, description: "Iyzico, Stripe veya banka POS entegrasyonları.", category: "core" },
    { id: "multilang", name: "Çoklu Dil Desteği (i18n)", cost: 4000, weeks: 1, description: "Birden fazla dilde içerik yönetimi altyapısı.", category: "core" },
    
    // Advanced Services
    { id: "mobile-pwa", name: "Mobil Uygulama Eşi (PWA)", cost: 10000, weeks: 2, description: "Cihaza kurulabilen, mobil uyumlu PWA yapısı.", category: "advanced" },
    { id: "chatbot", name: "Yapay Zeka Destekli Chatbot", cost: 15000, weeks: 2, description: "Soruları yanıtlayan ve veri toplayan akıllı asistan.", category: "advanced" },
    { id: "analytics", name: "Gelişmiş Raporlama & Grafik", cost: 8500, weeks: 1.5, description: "Yönetici için pdf/excel raporları ve veri grafikleri.", category: "advanced" },
    
    // Infra & Security
    { id: "seo", name: "Gelişmiş SEO & Pazarlama Paketi", cost: 3500, weeks: 1, description: "Dinamik sitemap, meta etiket yönetimi ve Google Analytics/Pixel.", category: "infra" },
    { id: "backup", name: "Bulut Altyapı & Otomatik Yedekleme", cost: 6000, weeks: 1, description: "AWS/Vercel otomatik yedekleme, SSL ve CDN yapılandırması.", category: "infra" },
    { id: "kvkk", name: "KVKK & GDPR Uyumluluk Paketi", cost: 3000, weeks: 0.5, description: "Çerez onay mekanizmaları, aydınlatma metinleri ve veri silme talepleri.", category: "infra" },
  ]

  const designLevels: DesignLevel[] = [
    { 
      id: "standard", 
      name: "Özelleştirilmiş Standart Tasarım", 
      cost: 0, 
      weeks: 0, 
      description: "Modern, temiz ve şablon tabanlı özelleştirilmiş tasarım.",
      features: ["Hazır bileşen kütüphaneleri", "Kurumsal renklerinizin uyarlanması", "Responsive standart düzen", "Temel animasyonlar"]
    },
    { 
      id: "custom", 
      name: "Özel UI/UX Arayüz Tasarımı", 
      cost: 15000, 
      weeks: 2, 
      description: "Projeniz için sıfırdan Figma üzerinde çizilen özgün ekranlar.",
      features: ["Sıfırdan Figma UI/UX tasarımı", "2 Revizyon / Değişiklik hakkı", "Kullanıcı deneyimi analizi", "Özel tasarım sistemi"]
    },
    { 
      id: "premium", 
      name: "Premium Tasarım & Marka Kimliği", 
      cost: 25000, 
      weeks: 3, 
      description: "Logo, renk paleti ve marka çizgisi dahil tam UI/UX tasarımı.",
      features: ["Figma üzerinde limitsiz revizyon", "Kurumsal kimlik & Logo tasarımı", "Özel mikro geçişler & animasyonlar", "İnteraktif prototip sunumu"]
    },
  ]

  const deliverySpeeds: DeliverySpeed[] = [
    { id: "eco", name: "Ekonomik & Esnek", costFactor: 0.85, weeksFactor: 1.25, description: "%15 indirim, ancak teslimat süresi %25 uzayabilir.", badge: "-%15 Bütçe" },
    { id: "normal", name: "Standart Süreç", costFactor: 1.0, weeksFactor: 1.0, description: "Planlanan sürede ve standart kalitede teslim.", badge: "Önerilen" },
    { id: "express", name: "Ekspres & Hızlı", costFactor: 1.3, weeksFactor: 0.7, description: "%30 ek bütçe ile projeniz %30 daha erken tamamlanır.", badge: "-%30 Teslim Süresi" },
  ]

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  // Calculate Estimation values
  const getCalculation = () => {
    const selectedTypeObj = projectTypes.find((t) => t.id === projectType) || projectTypes[0]
    const selectedDesignObj = designLevels.find((d) => d.id === designLevel) || designLevels[0]
    const selectedSpeedObj = deliverySpeeds.find((s) => s.id === deliverySpeed) || deliverySpeeds[0]
    
    let baseCostSum = selectedTypeObj.baseCost
    let baseWeeksSum = selectedTypeObj.baseWeeks

    selectedModules.forEach((modId) => {
      const modObj = extraModules.find((m) => m.id === modId)
      if (modObj) {
        baseCostSum += modObj.cost
        baseWeeksSum += modObj.weeks
      }
    })

    baseCostSum += selectedDesignObj.cost
    baseWeeksSum += selectedDesignObj.weeks

    const finalCost = Math.round(baseCostSum * selectedSpeedObj.costFactor)
    const finalWeeks = Math.round(baseWeeksSum * selectedSpeedObj.weeksFactor)

    // Calculate a 10% range around the final cost for a realistic estimate
    const minCost = Math.round((finalCost * 0.9) / 500) * 500
    const maxCost = Math.round((finalCost * 1.1) / 500) * 500

    return { 
      minCost, 
      maxCost, 
      finalCost, 
      finalWeeks, 
      selectedTypeObj, 
      selectedDesignObj, 
      selectedSpeedObj 
    }
  }

  const { 
    minCost, 
    maxCost, 
    finalCost, 
    finalWeeks, 
    selectedTypeObj, 
    selectedDesignObj, 
    selectedSpeedObj 
  } = getCalculation()

  const getRoadmapPhases = (totalWeeks: number) => {
    const design = Math.max(1, Math.round(totalWeeks * 0.25 * 2) / 2)
    const frontend = Math.max(1.5, Math.round(totalWeeks * 0.35 * 2) / 2)
    const backend = Math.max(1, Math.round(totalWeeks * 0.3 * 2) / 2)
    const qa = Math.max(0.5, Number((totalWeeks - design - frontend - backend).toFixed(1)))

    return [
      { name: "Planlama & UI/UX Tasarım", weeks: design, desc: "Figma ekranları, akışlar ve stil rehberi." },
      { name: "Frontend Geliştirme", weeks: frontend, desc: "Arayüz, responsive yapı ve animasyonlar." },
      { name: "Backend & Entegrasyonlar", weeks: backend, desc: "Seçili servisler ve veritabanı kurulumu." },
      { name: "Test & Canlıya Geçiş", weeks: qa, desc: "Test, optimizasyon ve yayın süreci." },
    ]
  }

  // Generate Lead Submission texts
  const generateSummaryText = () => {
    const modulesNames = selectedModules.map(mId => t(extraModules.find(m => m.id === mId)?.name || "")).join(", ")
    
    const infraLabel = {
      "megdev-recommends": "Meg Dev Önerisi (AWS / Vercel)",
      "aws": "AWS (Amazon Web Services)",
      "vercel": "Vercel / Netlify (Serverless)",
      "custom-server": "Kendi Sunucumuz (On-Premise)"
    }[infrastructure] || infrastructure

    return [
      t("Merhaba Meg Dev, proje hesaplayıcı teklif özeti:"),
      `${t("İsim")}: ${name}`, `${t("Telefon")}: ${phone}`, `${t("E-posta")}: ${email || t("Girilmedi")}`,
      `${t("Proje Tipi")}: ${t(selectedTypeObj.name)}`, `${t("Ek Modüller")}: ${modulesNames || t("Yok")}`,
      `${t("Tasarım Seviyesi")}: ${t(selectedDesignObj.name)}`, `${t("Süreç Hızı")}: ${t(selectedSpeedObj.name)}`,
      `${t("Altyapı Tercihi")}: ${t(infraLabel)}`,
      `${t("Tahmini Bütçe")}: ${minCost.toLocaleString(intlLocale)} – ${maxCost.toLocaleString(intlLocale)} ${t("TL")}`,
      `${t("Tahmini Süre")}: ${finalWeeks} ${t("Hafta")}`, `${t("Özel Notlar")}: ${notes || t("Yok")}`,
    ].join("\n")
  }

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    setLoading(true)

    // Optional background email backup notification via EmailJS
    try {
      const summary = generateSummaryText()
      await emailjs.send(
        "service_ckoiehh",
        "template_rvpnugu",
        {
          name: name,
          email: email || "Girilmedi",
          phone: phone,
          subject: "Proje Hesaplayıcı Teklif Talebi (WhatsApp)",
          message: summary
        },
        "D6k1lT8mhR4rjyNoD"
      )
    } catch (err) {
      console.error("EmailJS background error:", err)
    }

    const message = encodeURIComponent(generateSummaryText())
    const url = `https://api.whatsapp.com/send?phone=${siteConfig.whatsapp.replace("+", "")}&text=${message}`
    window.open(url, "_blank")
    setLoading(false)
    setSubmitted(true)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) return
    setLoading(true)

    try {
      const summary = generateSummaryText()
      
      // Send both admin notification and client auto-reply
      await emailjs.send(
        "service_ckoiehh",
        "template_rvpnugu",
        {
          name: name,
          email: email,
          phone: phone,
          subject: "Proje Hesaplayıcı Teklif Talebi",
          message: summary
        },
        "D6k1lT8mhR4rjyNoD"
      )
      
      await emailjs.send(
        "service_ckoiehh",
        "template_hlabb18",
        {
          name: name,
          email: email,
          phone: phone,
          subject: "Proje Hesaplayıcı Teklif Talebi",
          message: summary
        },
        "D6k1lT8mhR4rjyNoD"
      )
      
      setSubmitted(true)
    } catch (err) {
      console.error("EmailJS error:", err)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="calculator" className={`${styles.calculator} relative overflow-hidden border-t border-white/10 py-28 lg:py-36`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.24em] text-primary"><T>{"Proje planı / Bütçe ve takvim"}</T></span>
            <h2 className="mt-6 text-4xl font-black uppercase leading-[.92] tracking-tight sm:text-6xl lg:text-7xl"><T>{"Fikrinize bir plan."}</T><br/><span className="text-primary"><T>{"Bütçenize bir çerçeve."}</T></span></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground"><T>{"Beş seçim yap; proje kapsamını, yaklaşık bütçeyi ve üretim takvimini canlı olarak birlikte kuralım."}</T></p>
          </motion.div>
        </div>

        <div>
          {/* Left Side: Wizard Steps */}
          <div className="relative flex h-[min(680px,calc(100vh-80px))] min-h-[560px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-card/45 shadow-[0_30px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Step indicator */}
              <div className="shrink-0 border-b border-white/10 bg-background/35 px-4 py-4 sm:px-6">
                <div className="mb-3 flex items-center justify-between"><span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary"><Calculator className="h-4 w-4" /> <T>{" Proje hesaplayıcı"}</T></span><span className="font-mono text-xs text-muted-foreground"><T>{"0"}</T><T>{step}</T> <T>{" / 05"}</T></span></div>
                <div className="grid grid-cols-5 gap-1.5">
                  {["Proje", "Modüller", "Tasarım", "Teslimat", "İletişim"].map((label, index) => { const item = index + 1; return <button key={label} onClick={() => item <= step && setStep(item)} className={`relative flex min-w-0 items-center justify-center gap-2 rounded-xl border px-2 py-2.5 transition-all ${item === step ? "border-primary/40 bg-primary/10 text-primary" : item < step ? "border-primary/20 bg-primary/[.04] text-primary" : "border-white/5 bg-white/[.02] text-muted-foreground"}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[9px] ${item === step ? "bg-primary text-background" : "border border-current/25"}`}><T>{item < step ? <Check className="h-3 w-3" /> : item}</T></span><span className="hidden truncate text-[11px] font-bold sm:block"><T>{label}</T></span></button> })}
                </div>
              </div>
              
              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [scrollbar-color:rgba(255,255,255,.3)_transparent] sm:px-7"
                >
                  {/* STEP 1: PROJECT TYPES */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4 font-medium"><T>{"Geliştirmek istediğiniz ana proje yapısını seçin:"}</T></p>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {projectTypes.map((type) => {
                          const isSelected = projectType === type.id
                          const IconComponent = type.icon
                          return (
                            <button
                              key={type.id}
                              onClick={() => setProjectType(type.id)}
                              className={`p-4 border text-left cursor-pointer transition-all duration-300 rounded-2xl flex flex-col justify-between h-full min-h-[160px] relative overflow-hidden group hover:-translate-y-1 ${
                                isSelected
                                  ? "border-primary/60 bg-primary/[.07] shadow-[0_16px_45px_rgba(255,255,255,0.08)]"
                                  : "border-white/10 bg-white/[.025] hover:border-white/25 hover:bg-white/[.045]"
                              }`}
                            >
                              {isSelected && <motion.div layoutId="calculator-project-glow" className="absolute inset-x-6 top-0 h-px bg-primary shadow-[0_0_18px_rgba(255,255,255,.9)]" />}
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <div className={`p-2.5 rounded-xl border ${isSelected ? "border-primary/30 bg-primary/10 text-primary" : "border-foreground/10 bg-background/50 text-muted-foreground"}`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>
                                  {isSelected && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-background">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </span>
                                  )}
                                </div>
                                <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors block"><T>{type.name}</T></span>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed"><T>{type.description}</T></p>
                                
                              </div>

                              <div className="mt-3 flex items-center justify-between border-t border-foreground/5 pt-3 font-mono text-[10px]">
                                <span className="text-muted-foreground"><T>{"Başlangıç"}</T></span>
                                <span className="font-bold text-primary"><T>{type.baseCost.toLocaleString(intlLocale)}</T> <T>{" TL · "}</T><T>{type.baseWeeks}</T> <T>{" hf."}</T></span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: EXTRA MODULES */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground font-medium"><T>{"Projenize dahil edilmesini istediğiniz ek modülleri seçin (İsteğe bağlı):"}</T></p>
                      
                      {/* Categorized Modules */}
                      {(["core", "advanced", "infra"] as const).map((cat) => {
                        const catTitle = {
                          core: "Temel Entegrasyonlar",
                          advanced: "Gelişmiş Servisler",
                          infra: "Altyapı & Güvenlik"
                        }[cat]
                        
                        const catModules = extraModules.filter(m => m.category === cat)
                        
                        return (
                          <div key={cat} className="space-y-3">
                            <h5 className="text-xs uppercase tracking-widest text-primary font-bold border-b border-foreground/5 pb-1"><T>{catTitle}</T></h5>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {catModules.map((mod) => {
                                const isSelected = selectedModules.includes(mod.id)
                                return (
                                  <button
                                    key={mod.id}
                                    onClick={() => toggleModule(mod.id)}
                                    className={`p-4 border text-left cursor-pointer transition-all rounded-2xl flex flex-col justify-between h-full group ${
                                      isSelected
                                        ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(255,255,255,0.04)]"
                                        : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                                    }`}
                                  >
                                    <div>
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors"><T>{mod.name}</T></span>
                                        <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${isSelected ? "bg-primary border-primary text-background" : "border-foreground/30 text-transparent"}`}>
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed"><T>{mod.description}</T></p>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-foreground/5 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                                      <span><T>{"+"}</T><T>{mod.cost.toLocaleString(intlLocale)}</T> <T>{" TL"}</T></span>
                                      <span className="text-primary font-semibold"><T>{"+"}</T><T>{mod.weeks}</T> <T>{" Hafta"}</T></span>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* STEP 3: DESIGN LEVELS */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4 font-medium"><T>{"Projenizin UI/UX arayüz tasarım seviyesini belirleyin:"}</T></p>
                      <div className="space-y-4">
                        {designLevels.map((lvl) => {
                          const isSelected = designLevel === lvl.id
                          return (
                            <button
                              key={lvl.id}
                              onClick={() => setDesignLevel(lvl.id)}
                              className={`w-full p-5 border text-left cursor-pointer transition-all rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(255,255,255,0.04)]"
                                  : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                              }`}
                            >
                              <div className="space-y-2 max-w-xl">
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-background">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </span>
                                  )}
                                  <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors"><T>{lvl.name}</T></span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed"><T>{lvl.description}</T></p>
                                
                                {/* Bullet points */}
                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2">
                                  {lvl.features.map((feat, fidx) => (
                                    <span key={fidx} className="text-[11px] text-foreground/80 flex items-center gap-1">
                                      <span className="w-1 h-1 bg-primary rounded-full" />
                                      <T>{feat}</T>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right md:border-l md:border-foreground/10 md:pl-6 min-w-[120px] self-stretch flex flex-row md:flex-col justify-between md:justify-center items-center">
                                <div className="text-xs font-mono text-muted-foreground">
                                  <T>{lvl.cost > 0 ? `+${lvl.cost.toLocaleString(intlLocale)} TL` : "Ek Ücret Yok"}</T>
                                </div>
                                <div className="text-xs font-mono text-primary font-bold mt-0.5">
                                  <T>{lvl.weeks > 0 ? `+${lvl.weeks} Hafta` : "Süre Artışı Yok"}</T>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: SPEEDS */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4 font-medium"><T>{"Geliştirme süreci ve teslimat hızı tercihini belirleyin:"}</T></p>
                      <div className="space-y-4">
                        {deliverySpeeds.map((spd) => {
                          const isSelected = deliverySpeed === spd.id
                          return (
                            <button
                              key={spd.id}
                              onClick={() => setDeliverySpeed(spd.id)}
                              className={`w-full p-5 border text-left cursor-pointer transition-all rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(255,255,255,0.04)]"
                                  : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                              }`}
                            >
                              <div className="space-y-2 max-w-xl">
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-background">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </span>
                                  )}
                                  <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors"><T>{spd.name}</T></span>
                                  <span className="text-[10px] font-mono px-2.5 py-0.5 border border-primary/20 bg-primary/10 text-primary rounded-full font-bold">
                                    <T>{spd.badge}</T>
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed"><T>{spd.description}</T></p>
                              </div>
                              
                              {/* Visual comparison bar representing time & cost factors */}
                              <div className="w-full md:w-32 space-y-1">
                                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                                  <span><T>{"Bütçe:"}</T></span>
                                  <span className={spd.costFactor > 1 ? "text-rose-400 font-bold" : spd.costFactor < 1 ? "text-emerald-400 font-bold" : ""}>
                                    <T>{spd.costFactor === 1.0 ? "Standart" : `${spd.costFactor * 100}%`}</T>
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${spd.costFactor > 1 ? "bg-rose-400" : spd.costFactor < 1 ? "bg-emerald-400" : "bg-primary"}`} 
                                    style={{ width: `${spd.costFactor * 50}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1">
                                  <span><T>{"Teslimat:"}</T></span>
                                  <span className={spd.weeksFactor < 1 ? "text-emerald-400 font-bold" : spd.weeksFactor > 1 ? "text-amber-400 font-bold" : ""}>
                                    <T>{spd.weeksFactor === 1.0 ? "Normal" : `${spd.weeksFactor * 100}%`}</T>
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${spd.weeksFactor < 1 ? "bg-emerald-400" : spd.weeksFactor > 1 ? "bg-amber-400" : "bg-primary"}`} 
                                    style={{ width: `${spd.weeksFactor * 50}%` }}
                                  />
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: CONTACT & SUBMIT */}
                  {step === 5 && (
                    <div className="space-y-4">
                      {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-background">
                            <Send className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-black mb-2 text-foreground"><T>{"Teklif Talebiniz Alındı!"}</T></h3>
                          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            <T>{"Proje hesaplama detaylarınız başarıyla e-posta kutumuza ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçecektir."}</T></p>
                        </motion.div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground mb-4 font-medium"><T>{"Teklifi size veya ekibinize iletebilmemiz için iletişim bilgilerinizi girin:"}</T></p>
                          <div className="grid gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5"><T>{"Adınız Soyadınız *"}</T></label>
                                <LocalizedElement as="input"
                                  type="text"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Örn. Mehmet Yılmaz"
                                  className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5"><T>{"Telefon Numaranız *"}</T></label>
                                <LocalizedElement as="input"
                                  type="tel"
                                  required
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="Örn. 0530 123 45 67"
                                  className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-xl"
                                />
                              </div>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5"><T>{"E-posta Adresiniz *"}</T></label>
                                <LocalizedElement as="input"
                                  type="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Örn. mehmet@sirketiniz.com"
                                  className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5"><T>{"Tercih Edilen Altyapı / Sunucu"}</T></label>
                                <select
                                  value={infrastructure}
                                  onChange={(e) => setInfrastructure(e.target.value)}
                                  className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-xl"
                                >
                                  <option value="megdev-recommends"><T>{"Meg Dev Önerisi (AWS / Vercel)"}</T></option>
                                  <option value="aws"><T>{"AWS (Amazon Web Services)"}</T></option>
                                  <option value="vercel"><T>{"Vercel / Netlify (Serverless)"}</T></option>
                                  <option value="custom-server"><T>{"Kendi Sunucumuz (On-Premise)"}</T></option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5"><T>{"Proje Detayları & Özel İstekleriniz (Opsiyonel)"}</T></label>
                              <LocalizedElement as="textarea"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Projenizle ilgili eklemek istediğiniz detaylar, özel entegrasyonlar veya hedeflerinizi yazabilirsiniz."
                                rows={3}
                                className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-xl resize-none"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 mt-6">
                            <button
                              onClick={handleWhatsAppSubmit}
                              disabled={loading || !name || !phone}
                              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-4 py-3.5 transition-all cursor-pointer rounded-xl"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MessageSquare className="w-4 h-4" />
                              )}
                              <T>{"WhatsApp ile Gönder"}</T></button>
                            <button
                              onClick={handleEmailSubmit}
                              disabled={loading || !name || !email || !phone}
                              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-background font-bold text-sm px-4 py-3.5 transition-all cursor-pointer rounded-xl"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              <T>{"E-posta ile Gönder"}</T></button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Back & Next navigation controls */}
            <div className="z-30 flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-background/95 px-4 py-3 shadow-[0_-12px_40px_rgba(0,0,0,.28)] backdrop-blur-xl sm:px-6">
              <button
                disabled={step === 1 || loading || submitted}
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-bold text-muted-foreground transition hover:border-white/25 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" />
                <T>{"Geri"}</T></button>

              <div className="hidden min-w-0 items-center gap-5 sm:flex">
                <div className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-widest text-muted-foreground"><T>{"Bütçe"}</T></span><motion.strong key={`${minCost}-${maxCost}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap text-sm text-primary"><T>{minCost.toLocaleString(intlLocale)}</T><T>{"—"}</T><T>{maxCost.toLocaleString(intlLocale)}</T> <T>{" TL"}</T></motion.strong></div>
                <div><span className="block font-mono text-[9px] uppercase tracking-widest text-muted-foreground"><T>{"Takvim"}</T></span><strong className="whitespace-nowrap text-sm"><T>{finalWeeks}</T> <T>{" hafta"}</T></strong></div>
                <div><span className="block font-mono text-[9px] uppercase tracking-widest text-muted-foreground"><T>{"Modül"}</T></span><strong className="text-sm"><T>{selectedModules.length}</T></strong></div>
              </div>

              {step < 5 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-black text-[#151515] shadow-[0_10px_30px_rgba(255,255,255,.16)] transition hover:-translate-y-0.5"
                >
                  <T>{"Sonraki Adım"}</T><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">
                  <T>{submitted ? "// TALEBİNİZ ALINDI" : "// FORMU DOLDURUN"}</T>
                </span>
              )}
            </div>
          </div>

          {/* Full-width analysis board */}
          <div className="hidden">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[45px] border-white/[.02]" />
            <div className="relative flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
              <div><span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary"><Sparkles className="h-3.5 w-3.5 animate-pulse" /> <T>{" Canlı proje analizi"}</T></span><h4 className="mt-2 text-2xl font-black"><T>{"Seçimlerinin teknik özeti"}</T></h4></div>
              <span className="w-fit rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] text-muted-foreground"><T>{"Her seçimde otomatik güncellenir"}</T></span>
            </div>

            <div className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 [&>div]:rounded-2xl [&>div]:border [&>div]:border-white/10 [&>div]:bg-white/[.025] [&>div]:p-5">
              <div className="md:col-span-2 xl:col-span-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground"><T>{"TAHMİNİ BÜTÇE ARALIĞI"}</T></p>
                <motion.p key={`${minCost}-${maxCost}`} initial={{ opacity: 0, y: 15, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} className="mt-2 text-3xl font-black text-primary">
                  <T>{minCost.toLocaleString(intlLocale)}</T> <span className="text-xl"><T>{"-"}</T></span> <T>{maxCost.toLocaleString(intlLocale)}</T> <span className="text-lg font-normal"><T>{"TL"}</T></span>
                </motion.p>
                <p className="mt-1 text-[10px] leading-snug text-muted-foreground"><T>{"Vergiler hariç, tahmini geliştirici bütçesidir."}</T></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold"><T>{"TESLİMAT SÜRESİ"}</T></p>
                  <p className="text-2xl font-black mt-2 text-foreground">
                    <T>{finalWeeks}</T> <span className="text-sm font-normal text-muted-foreground font-medium"><T>{"Hafta"}</T></span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold"><T>{"AKTİF EKLENTİ"}</T></p>
                  <p className="text-2xl font-black mt-2 text-foreground">
                    <T>{selectedModules.length}</T> <span className="text-sm font-normal text-muted-foreground font-medium"><T>{"Adet"}</T></span>
                  </p>
                </div>
              </div>

              {/* Detailed Invoice Breakdown */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold"><T>{"FİYAT KIRILIMI"}</T></p>
                <div className="space-y-2 text-xs">
                  {/* Base Cost */}
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground"><T>{"Taban Fiyat ("}</T><T>{selectedTypeObj.name}</T><T>{"):"}</T></span>
                    <span className="font-bold text-foreground"><T>{selectedTypeObj.baseCost.toLocaleString(intlLocale)}</T> <T>{" TL"}</T></span>
                  </div>
                  
                  {/* Design Level Cost */}
                  {selectedDesignObj.cost > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground"><T>{"Tasarım ("}</T><T>{selectedDesignObj.name}</T><T>{"):"}</T></span>
                      <span className="font-bold text-foreground"><T>{"+"}</T><T>{selectedDesignObj.cost.toLocaleString(intlLocale)}</T> <T>{" TL"}</T></span>
                    </div>
                  )}

                  {/* Modules Cost */}
                  {selectedModules.length > 0 && (
                    <div className="space-y-1 pl-2 border-l border-primary/20">
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold"><T>{"Seçili Modüller:"}</T></div>
                      {selectedModules.map((mId) => {
                        const mod = extraModules.find((m) => m.id === mId)
                        if (!mod) return null
                        return (
                          <div key={mId} className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground truncate max-w-[210px]"><T>{mod.name}</T><T>{":"}</T></span>
                            <span className="font-medium text-foreground"><T>{"+"}</T><T>{mod.cost.toLocaleString(intlLocale)}</T> <T>{" TL"}</T></span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Speed Factor */}
                  {selectedSpeedObj.id !== "normal" && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground font-medium"><T>{"Hız Katsayısı ("}</T><T>{selectedSpeedObj.name}</T><T>{"):"}</T></span>
                      <span className={`font-bold ${selectedSpeedObj.costFactor > 1 ? "text-rose-400" : "text-emerald-400"}`}>
                        <T>{selectedSpeedObj.costFactor > 1 ? "+" : ""}</T>
                        <T>{Math.round((selectedSpeedObj.costFactor - 1) * 100)}</T><T>{"%"}</T></span>
                    </div>
                  )}
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-start pt-2 border-t border-foreground/10 font-bold text-foreground">
                    <span><T>{"Yaklaşık Toplam:"}</T></span>
                    <span className="text-primary"><T>{finalCost.toLocaleString(intlLocale)}</T> <T>{" TL"}</T></span>
                  </div>
                </div>
              </div>

              {/* Dynamic Project Roadmap */}
              <div className="space-y-3 md:col-span-2 xl:col-span-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold"><T>{"PROJE YOL HARİTASI"}</T></p>
                <div className="relative pl-4 border-l border-primary/20 space-y-4 py-1 text-xs">
                  {getRoadmapPhases(finalWeeks).map((phase, idx) => (
                    <div key={idx} className="relative">
                      {/* Bullet point icon */}
                      <span className="absolute -left-[21px] top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-4 ring-card" />
                      <div className="font-bold flex justify-between text-foreground">
                        <span><T>{phase.name}</T></span>
                        <span className="text-primary font-mono"><T>{phase.weeks}</T> <T>{" Hafta"}</T></span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-snug"><T>{phase.desc}</T></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic parameters list summary */}
              <div className="space-y-2 font-mono text-[10px] text-muted-foreground">
                <div className="flex justify-between gap-2">
                  <span><T>{"Proje Tipi:"}</T></span>
                  <span className="text-foreground text-right"><T>{selectedTypeObj.name}</T></span>
                </div>
                <div className="flex justify-between gap-2">
                  <span><T>{"Arayüz Seviyesi:"}</T></span>
                  <span className="text-foreground text-right"><T>{selectedDesignObj.name}</T></span>
                </div>
                <div className="flex justify-between gap-2">
                  <span><T>{"Geliştirme Hızı:"}</T></span>
                  <span className="text-foreground text-right"><T>{selectedSpeedObj.name}</T></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
