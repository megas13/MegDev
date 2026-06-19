"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { siteConfig } from "@/constants"
import emailjs from "@emailjs/browser"
import { 
  Calculator, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Send,
  MessageSquare,
  Sparkles,
  Loader2
} from "lucide-react"

interface ProjectType {
  id: string
  name: string
  baseCost: number
  baseWeeks: number
  description: string
}

interface ExtraModule {
  id: string
  name: string
  cost: number
  weeks: number
  description: string
}

interface DesignLevel {
  id: string
  name: string
  cost: number
  weeks: number
  description: string
}

interface DeliverySpeed {
  id: string
  name: string
  costFactor: number
  weeksFactor: number
  description: string
}

export function CalculatorSection() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Selection States
  const [projectType, setProjectType] = useState<string>("web")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [designLevel, setDesignLevel] = useState<string>("standard")
  const [deliverySpeed, setDeliverySpeed] = useState<string>("normal")
  
  // Contact States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const projectTypes: ProjectType[] = [
    { id: "web", name: "Kurumsal Web Sitesi", baseCost: 20000, baseWeeks: 4, description: "Markanızı yansıtan, hızlı ve SEO uyumlu tanıtım siteleri." },
    { id: "ecommerce", name: "E-Ticaret Platformu", baseCost: 45000, baseWeeks: 8, description: "Güçlü altyapılı, ödeme entegrasyonlu satış siteleri." },
    { id: "crm", name: "CRM & Yönetim Panelleri", baseCost: 55000, baseWeeks: 10, description: "Operasyon ve müşteri yönetim süreçlerinize özel ERP/CRM." },
    { id: "ai", name: "Yapay Zeka (AI) Çözümü", baseCost: 75000, baseWeeks: 12, description: "Akıllı öneri modelleri, veri işleme ve chatbot servisleri." },
    { id: "saas", name: "Özel SaaS & Yazılım", baseCost: 90000, baseWeeks: 16, description: "Sıfırdan ölçeklenebilir bulut uygulamaları ve özel kodlama." },
  ]

  const extraModules: ExtraModule[] = [
    { id: "auth", name: "Üyelik & Yetkilendirme (OTP)", cost: 7500, weeks: 1, description: "SMS/E-posta doğrulama ile güvenli üye girişi." },
    { id: "payment", name: "Ödeme Geçidi Entegrasyonu", cost: 10000, weeks: 1, description: "Iyzico, Stripe veya banka POS entegrasyonları." },
    { id: "multilang", name: "Çoklu Dil Desteği (i18n)", cost: 6000, weeks: 1, description: "Birden fazla dilde içerik yönetimi altyapısı." },
    { id: "mobile-pwa", name: "Mobil Uygulama Eşi (PWA)", cost: 15000, weeks: 2, description: "Cihaza kurulabilen, mobil uyumlu PWA yapısı." },
    { id: "chatbot", name: "Yapay Zeka Destekli Chatbot", cost: 20000, weeks: 2, description: "Soruları yanıtlayan ve veri toplayan akıllı asistan." },
    { id: "analytics", name: "Gelişmiş Raporlama & Grafik", cost: 12000, weeks: 1.5, description: "Yönetici için pdf/excel raporları ve veri grafikleri." },
  ]

  const designLevels: DesignLevel[] = [
    { id: "standard", name: "Özelleştirilmiş Standart Tasarım", cost: 0, weeks: 0, description: "Modern, temiz ve şablon tabanlı özelleştirilmiş tasarım." },
    { id: "custom", name: "Özel UI/UX Arayüz Tasarımı", cost: 20000, weeks: 2, description: "Projeniz için sıfırdan Figma üzerinde çizilen özgün ekranlar." },
    { id: "premium", name: "Premium Tasarım & Marka Kimliği", cost: 35000, weeks: 3, description: "Logo, renk paleti ve marka çizgisi dahil tam UI/UX tasarımı." },
  ]

  const deliverySpeeds: DeliverySpeed[] = [
    { id: "eco", name: "Ekonomik & Esnek", costFactor: 0.85, weeksFactor: 1.25, description: "%15 indirim, ancak teslimat süresi %25 uzayabilir." },
    { id: "normal", name: "Standart Süreç", costFactor: 1.0, weeksFactor: 1.0, description: "Planlanan sürede ve standart kalitede teslim." },
    { id: "express", name: "Ekspres & Hızlı", costFactor: 1.3, weeksFactor: 0.7, description: "%30 ek bütçe ile projeniz %30 daha erken tamamlanır." },
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

    return { minCost, maxCost, finalWeeks }
  }

  const { minCost, maxCost, finalWeeks } = getCalculation()

  // Generate Lead Submission texts
  const generateSummaryText = () => {
    const selectedTypeObj = projectTypes.find((t) => t.id === projectType)
    const selectedDesignObj = designLevels.find((d) => d.id === designLevel)
    const selectedSpeedObj = deliverySpeeds.find((s) => s.id === deliverySpeed)
    const modulesNames = selectedModules.map(mId => extraModules.find(m => m.id === mId)?.name).join(", ")

    return `Merhaba Meg Dev, proje hesaplayıcı teklif özeti:
- İsim: ${name}
- Proje Tipi: ${selectedTypeObj?.name}
- Ek Modüller: ${modulesNames || "Yok"}
- Tasarım Seviyesi: ${selectedDesignObj?.name}
- Süreç Hızı: ${selectedSpeedObj?.name}
- Tahmini Bütçe: ${minCost.toLocaleString("tr-TR")} TL - ${maxCost.toLocaleString("tr-TR")} TL
- Tahmini Süre: ${finalWeeks} Hafta`
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
      
      // Send both admin notification and client auto-reply using existing EmailJS service / template credentials
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
    <section id="calculator" className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/5 bg-card/25">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Bütçe & Süreç Hesaplayıcı"
          subtitle="Proje gereksinimlerinizi seçerek tahmini geliştirme bütçesini ve süresini anında hesaplayın, detaylı teklif talebini tek tıkla iletin."
        />

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 mt-12 items-start">
          {/* Left Side: Wizard Steps */}
          <div className="sharp-panel noise-panel p-6 sm:p-8 rounded-[8px] bg-background/55 min-h-[460px] flex flex-col justify-between">
            <div>
              {/* Step indicator */}
              <div className="flex justify-between items-center border-b border-foreground/10 pb-4 mb-6">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 animate-pulse" />
                  Aşama {step} / 5
                </span>
                <span className="text-xs text-muted-foreground">
                  {step === 1 && "Proje Türü Seçimi"}
                  {step === 2 && "Eklenti & Özellik Seçimi"}
                  {step === 3 && "Tasarım Seviyesi Seçimi"}
                  {step === 4 && "Teslimat Hızı Seçimi"}
                  {step === 5 && "Teklif Talebini Gönder"}
                </span>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* STEP 1: PROJECT TYPES */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">Geliştirmek istediğiniz ana proje yapısını seçin:</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {projectTypes.map((type) => {
                          const isSelected = projectType === type.id
                          return (
                            <button
                              key={type.id}
                              onClick={() => setProjectType(type.id)}
                              className={`p-4 border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm sm:text-base">{type.name}</span>
                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{type.description}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: EXTRA MODULES */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">Projenize dahil edilmesini istediğiniz ek modülleri seçin (İsteğe bağlı):</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {extraModules.map((mod) => {
                          const isSelected = selectedModules.includes(mod.id)
                          return (
                            <button
                              key={mod.id}
                              onClick={() => toggleModule(mod.id)}
                              className={`p-4 border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm sm:text-base">{mod.name}</span>
                                <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${isSelected ? "bg-primary border-primary" : "border-foreground/30"}`}>
                                  {isSelected && <Check className="w-3 h-3 text-background" />}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{mod.description}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DESIGN LEVELS */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">Projenizin UI/UX arayüz tasarım seviyesini belirleyin:</p>
                      <div className="space-y-3">
                        {designLevels.map((lvl) => {
                          const isSelected = designLevel === lvl.id
                          return (
                            <button
                              key={lvl.id}
                              onClick={() => setDesignLevel(lvl.id)}
                              className={`w-full p-4 border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm sm:text-base">{lvl.name}</span>
                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{lvl.description}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: SPEEDS */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">Geliştirme süreci ve teslimat hızı tercihini belirleyin:</p>
                      <div className="space-y-3">
                        {deliverySpeeds.map((spd) => {
                          const isSelected = deliverySpeed === spd.id
                          return (
                            <button
                              key={spd.id}
                              onClick={() => setDeliverySpeed(spd.id)}
                              className={`w-full p-4 border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-foreground/10 bg-card/45 hover:border-foreground/20"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm sm:text-base">{spd.name}</span>
                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{spd.description}</p>
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
                          <h3 className="text-xl font-black mb-2">Teklif Talebiniz Alındı!</h3>
                          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            Proje hesaplama detaylarınız başarıyla e-posta kutumuza ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                          </p>
                        </motion.div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">Teklifi size veya ekibinize iletebilmemiz için iletişim bilgilerinizi girin:</p>
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5">Adınız Soyadınız *</label>
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Örn. Mehmet Yılmaz"
                                className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-[4px]"
                              />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5">E-posta Adresiniz</label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Örn. mehmet@sirketiniz.com"
                                  className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-[4px]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1.5">Telefon Numaranız *</label>
                                <input
                                  type="tel"
                                  required
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="Örn. 0530 123 45 67"
                                  className="w-full bg-card border border-foreground/10 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground rounded-[4px]"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 mt-6">
                            <button
                              onClick={handleWhatsAppSubmit}
                              disabled={loading || !name || !phone}
                              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-4 py-3.5 transition-all cursor-pointer"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MessageSquare className="w-4 h-4" />
                              )}
                              WhatsApp ile Gönder
                            </button>
                            <button
                              onClick={handleEmailSubmit}
                              disabled={loading || !name || !email || !phone}
                              className="flex items-center justify-center gap-2 bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-background font-bold text-sm px-4 py-3.5 transition-all cursor-pointer"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              E-posta ile Gönder
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Back & Next navigation controls */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-foreground/10 justify-between items-center">
              <button
                disabled={step === 1 || loading || submitted}
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed select-none cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri Git
              </button>

              {step < 5 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-dark select-none cursor-pointer"
                >
                  Sonraki Adım
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">
                  {submitted ? "// TALEBİNİZ ALINDI" : "// FORMU DOLDURUN"}
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Sticky Estimation Panel */}
          <div className="sharp-panel noise-panel p-6 rounded-[8px] bg-card border border-primary/20 sticky top-24 shadow-[0_12px_40px_rgba(215,255,67,0.04)]">
            <div className="border-b border-foreground/10 pb-4 mb-4">
              <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                CANLI TAHMİN PANELİ
              </span>
              <h4 className="text-lg font-black text-foreground mt-1">Teklif İnceleme Özeti</h4>
            </div>

            <div className="space-y-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">TAHMİNİ BÜTÇE ARALIĞI</p>
                <p className="text-3xl font-black text-primary mt-2">
                  {minCost.toLocaleString("tr-TR")} <span className="text-xl">-</span> {maxCost.toLocaleString("tr-TR")} <span className="text-lg font-normal">TL</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">Vergiler hariç, tahmini geliştirici bütçesidir.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">TESLİMAT SÜRESİ</p>
                  <p className="text-2xl font-black mt-2 text-foreground">
                    {finalWeeks} <span className="text-sm font-normal text-muted-foreground">Hafta</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">AKTİF EKLENTİ</p>
                  <p className="text-2xl font-black mt-2 text-foreground">
                    {selectedModules.length} <span className="text-sm font-normal text-muted-foreground">Adet</span>
                  </p>
                </div>
              </div>

              {/* Dynamic parameters list summary */}
              <div className="border-t border-foreground/10 pt-4 space-y-2 font-mono text-[10px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Proje Tipi:</span>
                  <span className="text-foreground text-right">{projectTypes.find((t) => t.id === projectType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arayüz Seviyesi:</span>
                  <span className="text-foreground text-right">{designLevels.find((d) => d.id === designLevel)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Geliştirme Hızı:</span>
                  <span className="text-foreground text-right">{deliverySpeeds.find((s) => s.id === deliverySpeed)?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
