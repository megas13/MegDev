"use client"

import { CreditCard, ShieldCheck, Truck, CheckCircle, ArrowRight, Zap, Lock, MousePointerClick, Rocket, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IBANSection } from "@/components/sections/iban-section"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Güvenli Ödeme",
    description: "Tüm ödemeler 3D Secure ile korunur. Kart bilgileriniz kaydedilmez.",
    icon: ShieldCheck,
    color: "text-primary"
  },
  {
    title: "Taksit Seçenekleri",
    description: "Kredi kartına taksit imkanı ile bütçenize uygun ödeme planı.",
    icon: CreditCard,
    color: "text-accent"
  },
  {
    title: "Hızlı Aktivasyon",
    description: "Ödeme onaylandıktan sonra projeniz hemen başlatılır.",
    icon: Truck,
    color: "text-secondary"
  },
  {
    title: "7/24 Destek",
    description: "Ödeme ile ilgili her konuda WhatsApp üzerinden destek alabilirsiniz.",
    icon: CheckCircle,
    color: "text-emerald-400"
  },
]

const steps = [
  { 
    number: "01", 
    title: "Proje Seçimi", 
    description: "Size uygun hizmet paketini birlikte belirleyelim.",
    icon: MousePointerClick
  },
  { 
    number: "02", 
    title: "Ödeme Yöntemi", 
    description: "Tercih ettiğiniz ödeme yöntemini seçin.",
    icon: CreditCard
  },
  { 
    number: "03", 
    title: "Güvenli Ödeme", 
    description: "3D Secure ile ödemenizi saniyeler içinde tamamlayın.",
    icon: Lock
  },
  { 
    number: "04", 
    title: "Hemen Başlayın", 
    description: "Ödeme onayından sonra projeniz için çalışmalar başlasın.",
    icon: Rocket
  },
]

export default function OdemePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 animate-mesh opacity-40 blur-[100px]" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.span 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.25em] mb-8"
            >
              <Shield className="w-3 h-3" />
              Güvenli Ödeme Portalı
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tighter">
              <span className="text-gradient block">Geleceği</span>
              <span className="text-white text-glow-primary">Bugünden Ödeyin</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Enterprise-grade ödeme altyapımızla projelerinizi saniyeler içinde başlatın. 
              Sadelik, hız ve mutlak güvenlik bir arada.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Light Beams */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Ödeme Yöntemi Seçici */}
      <IBANSection />

      {/* Süreç Timeline */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-black mb-6 tracking-tight"
            >
              Kesintisiz <span className="text-gradient">Akış</span>
            </motion.h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">Basit, şeffaf ve %100 dijital ödeme süreciyle hemen tanışın.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden lg:block" />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div 
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, ease: "easeOut" }}
                    className="relative group"
                  >
                    <div className="relative z-10 glass-morphism rounded-[2rem] p-8 md:p-10 text-center border-white/5 hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-500 shadow-2xl">
                      <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(215,255,67,0.15)]">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center font-black text-primary text-xs shadow-xl">
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors tracking-tight">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed font-medium">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative py-28 lg:py-40 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-5" />
        {/* Large Decorative Orb */}
        <div className="absolute -right-1/4 top-0 w-full h-full bg-accent/5 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-6">Güvenlik Standartları</p>
              <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight tracking-tighter">
                Güven <span className="text-accent text-glow-accent italic font-serif">Mutlak</span> Olmalı.
              </h2>
              <div className="grid sm:grid-cols-2 gap-10">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.title} className="group">
                      <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20", feature.color)}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-foreground transition-colors tracking-tight">{feature.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
              <img 
                src="/images/secure-payment.svg" 
                alt="Secure Payment" 
                className="relative z-10 w-full h-full drop-shadow-[0_40px_80px_rgba(57,208,194,0.4)] animate-float" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-morphism rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_40px_150px_rgba(0,0,0,0.5)] border-white/5"
          >
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" />
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black leading-[1] mb-10 tracking-tighter">
                Hemen <span className="text-gradient">Hayal Edin.</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
                Ödemenizi tamamlayın, dijital dönüşüm yolculuğunuzu bugün başlatalım. 
                Siz hayal edin, biz gerçekleştirelim.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-xl h-20 px-12 rounded-[2rem] shadow-primary/30 shadow-[0_20px_60px_-10px_rgba(215,255,67,0.4)] hover:shadow-primary/50 transition-all">
                    İletişime Geçin
                    <ArrowRight className="w-8 h-8 ml-3" />
                  </Button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-xl h-20 px-12 rounded-[2rem] bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                    Ana Sayfaya Dön
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Trust Footer */}
      <footer className="relative py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:opacity-60 transition-opacity">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">256-bit SSL şifreleme</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">3D Secure Doğrulama</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Uyumlu</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Anında Onay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
