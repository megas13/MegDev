"use client"

import { useState } from "react"
import { Copy, Check, Building2, CreditCard, ArrowRight, ShieldCheck, Sparkles, Zap, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const IBAN = "TR39 0001 5001 5800 7317 6191 97"
const bankName = "VakıfBank"

export function IBANSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(IBAN)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = IBAN
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-4"
          >
            Ödeme Seçenekleri
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Ödeme yönteminizi <span className="text-gradient">seçin</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            Size en uygun yöntemi seçerek işlemlerinizi hızlıca tamamlayabilirsiniz.
          </motion.p>
        </div>

        <Tabs defaultValue="card" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList className="h-14 p-1.5 rounded-2xl">
              <TabsTrigger value="card" className="gap-3 px-8 rounded-xl transition-all duration-300">
                <CreditCard className="w-5 h-5" />
                Kart ile Ödeme
              </TabsTrigger>
              <TabsTrigger value="transfer" className="gap-3 px-8 rounded-xl transition-all duration-300">
                <Building2 className="w-5 h-5" />
                Havale / EFT
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <TabsContent value="card" key="card" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="glass-morphism relative overflow-hidden rounded-[2.5rem] p-8 md:p-14 text-center group shadow-[0_32px_120px_rgba(0,0,0,0.4)]">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale invert" 
                         style={{ backgroundImage: `url('/images/circuitry.svg')`, backgroundSize: '300px' }} />

                    <div className="relative z-10">
                      <motion.div 
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-gradient-to-br from-lime-300 to-teal-400 p-5 flex items-center justify-center shadow-2xl rotate-6 transition-all duration-500"
                      >
                        <CreditCard className="w-12 h-12 text-background" />
                      </motion.div>
                      
                      <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Kredi Kartı ile Ödeme</h3>
                      <p className="text-muted-foreground mb-12 text-lg leading-relaxed max-w-md mx-auto">
                        Tüm banka ve kredi kartlarına 12 aya varan taksit seçenekleri. 
                        3D Secure ve SSL şifreleme ile %100 güvenli altyapı.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <div className="flex items-center gap-3 justify-center py-4 px-6 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
                          <Lock className="w-5 h-5 text-primary" />
                          <span className="text-sm font-bold tracking-wide">3D Secure</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center py-4 px-6 rounded-2xl bg-white/5 border border-white/10 group-hover:border-accent/30 transition-colors">
                          <Zap className="w-5 h-5 text-accent" />
                          <span className="text-sm font-bold tracking-wide">Hızlı İşlem</span>
                        </div>
                      </div>

                      <Link href="/contact" className="block w-full">
                        <Button size="lg" className="w-full text-xl h-16 rounded-2xl gradient-border shadow-primary/20 shadow-2xl hover:shadow-primary/40 transition-shadow">
                          Ödeme Bağlantısı Alın
                          <ArrowRight className="w-7 h-7 ml-3" />
                        </Button>
                      </Link>
                      
                      <div className="mt-8 flex items-center justify-center gap-6">
                        <img src="/images/visa.svg" alt="Visa" className="h-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help" />
                        <img src="/images/mastercard.svg" alt="Mastercard" className="h-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help" />
                        <img src="/images/paypal.svg" alt="PayPal" className="h-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="transfer" key="transfer" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="glass-morphism relative overflow-hidden rounded-[2.5rem] p-8 md:p-14 group shadow-[0_32px_120px_rgba(0,0,0,0.4)] text-center">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale invert" 
                         style={{ backgroundImage: `url('/images/gear-stick.svg')`, backgroundSize: '400px' }} />

                    <div className="relative z-10">
                      <motion.div 
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-gradient-to-br from-cyan-400 to-primary p-5 flex items-center justify-center shadow-2xl -rotate-6 transition-all duration-500"
                      >
                        <Building2 className="w-12 h-12 text-background" />
                      </motion.div>

                      <div className="mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Banka Transfer Bilgileri</p>
                        <h3 className="text-4xl font-black mb-2 tracking-tight">{bankName}</h3>
                        <p className="text-muted-foreground text-lg">Meg Yazılım ve Teknoloji Ltd. Şti.</p>
                      </div>

                      <div className="mb-10 text-left">
                        <div className="flex items-center justify-between mb-3 px-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">IBAN Numarası</p>
                          {copied && (
                            <motion.span 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest"
                            >
                              Kopyalandı!
                            </motion.span>
                          )}
                        </div>
                        <div className={cn(
                          "relative flex items-center gap-4 bg-background/40 backdrop-blur-md border rounded-[1.25rem] p-5 md:p-7 transition-all duration-500",
                          copied ? "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]" : "border-white/10"
                        )}>
                          <code className="flex-1 text-base md:text-2xl font-mono text-foreground text-center tracking-tight sm:tracking-normal select-all">
                            {IBAN}
                          </code>
                          <button
                            onClick={handleCopy}
                            className={cn(
                              "shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                              copied ? "bg-emerald-500 text-white" : "bg-primary text-background hover:brightness-110"
                            )}
                            title="Kopyala"
                          >
                            {copied ? (
                              <Check className="w-8 h-8" />
                            ) : (
                              <Copy className="w-7 h-7" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="noise-panel rounded-2xl p-8 border border-white/5 bg-white/[0.02]">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "Lütfen ödeme açıklama kısmına <span className="text-foreground font-bold text-base underline decoration-primary/50 underline-offset-4">Proje Adınızı</span> belirtmeyi unutmayın."
                        </p>
                      </div>

                      <p className="mt-10 text-sm text-muted-foreground flex items-center justify-center gap-3">
                        <Zap className="w-4 h-4 text-accent animate-pulse" />
                        Dekont iletildiğinde işlemler anında başlatılır.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
