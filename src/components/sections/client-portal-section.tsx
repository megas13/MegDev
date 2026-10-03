"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Kanban, 
  GitBranch, 
  MessageSquareCode, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Terminal, 
  Send,
  ShieldAlert
} from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Badge } from "@/components/ui/badge"
import styles from "./public-experience.module.css"

type TabType = "overview" | "tasks" | "preview" | "chat"

export function ClientPortalSection() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const tabs = [
    { id: "overview", label: "Genel Durum", icon: LayoutDashboard },
    { id: "tasks", label: "Sprint Görevleri", icon: Kanban },
    { id: "preview", label: "Canlı Önizleme & Git", icon: GitBranch },
    { id: "chat", label: "Proje İletişimi", icon: MessageSquareCode },
  ] as const

  return (
    <section id="portal-demo" className={`${styles.portal} relative py-24 lg:py-32 overflow-hidden`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Şeffaf Proje Takibi"
          subtitle="Bizimle çalışırken karanlıkta kalmazsınız. Müşteri portalımız üzerinden projenizin tüm aşamalarını, atılan kodları ve testleri anlık izleyebilirsiniz."
        />

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 mt-12 items-start">
          {/* Left Navigation Buttons */}
          <div className={`${styles.portalNav} flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none lg:border-b-0`}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? "bg-white text-[#151515] border border-white"
                      : "border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span><T>{tab.label}</T></span>
                </button>
              )
            })}
          </div>

          {/* Right Demo Screen Container */}
          <div className={styles.portalScreen}>
            <div className={styles.portalHeader}><code><T>{"portal.megdev.com.tr/project/meg-saas"}</T></code><span><T>{"MEGDEV / MÜŞTERİ PANELİ"}</T></span></div>

            {/* Dashboard Workspace */}
            <div className="bg-card/75 p-6 min-h-[460px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1"
                >
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="grid gap-6 md:grid-cols-12">
                      <div className="md:col-span-8 space-y-6">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-black text-foreground"><T>{"Meg-SaaS E-Ticaret Platformu"}</T></h4>
                            <Badge variant="default" className="text-accent border-accent/20 bg-accent/5"><T>{"Sprint 3: Aktif"}</T></Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1"><T>{"Geliştirme Aşaması: Canlı Test ve Ödeme Akışları"}</T></p>
                        </div>

                        {/* Progress Tracker */}
                        <div className="border border-foreground/10 bg-background/40 p-5 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground"><T>{"Genel İlerleme Durumu"}</T></span>
                            <span className="text-lg font-black text-primary"><T>{"68%"}</T></span>
                          </div>
                          <div className="h-3 w-full bg-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "68%" }} />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-foreground/10 pt-4">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted-foreground"><T>{"Başlangıç"}</T></p>
                              <p className="text-sm font-bold mt-1"><T>{"15 Mayıs 2026"}</T></p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted-foreground"><T>{"Hedef Teslim"}</T></p>
                              <p className="text-sm font-bold mt-1"><T>{"14 Temmuz 2026"}</T></p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted-foreground"><T>{"Sağlık Durumu"}</T></p>
                              <p className="text-sm font-bold text-emerald-400 mt-1"><T>{"Harika"}</T></p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-muted-foreground"><T>{"Kalan Gün"}</T></p>
                              <p className="text-sm font-bold text-accent mt-1"><T>{"25 Gün"}</T></p>
                            </div>
                          </div>
                        </div>

                        {/* Sprint Roadmap Preview */}
                        <div className="space-y-3">
                          <h5 className="text-xs uppercase tracking-widest text-muted-foreground font-bold"><T>{"Yol Haritası Aşamaları"}</T></h5>
                          {[
                            { name: "Sprint 1: Kapsam & UI/UX Tasarım", progress: "100%", status: "done" },
                            { name: "Sprint 2: Veritabanı Mimari & Backend API", progress: "100%", status: "done" },
                            { name: "Sprint 3: Ödeme Entegrasyonu & Sepet Akışı", progress: "68%", status: "active" },
                            { name: "Sprint 4: Son Entegrasyon, Test & Yayına Alım", progress: "0%", status: "pending" },
                          ].map((sprint, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-foreground/5 bg-foreground/[0.01]">
                              <div className="flex items-center gap-3">
                                {sprint.status === "done" && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                                {sprint.status === "active" && <Clock className="w-5 h-5 text-accent shrink-0 animate-pulse" />}
                                {sprint.status === "pending" && <span className="w-5 h-5 rounded-full border-2 border-foreground/20 shrink-0" />}
                                <span className={`text-sm font-bold ${sprint.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}><T>{sprint.name}</T></span>
                              </div>
                              <span className={`text-xs font-mono ${sprint.status === "active" ? "text-accent font-bold" : "text-muted-foreground"}`}><T>{sprint.progress}</T></span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Detail Cards */}
                      <div className="md:col-span-4 space-y-4">
                        <div className="border border-foreground/10 bg-background/30 p-4">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold"><T>{"Müşteri Temsilcisi"}</T></p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                              <T>{"ME"}</T></div>
                            <div>
                              <p className="text-sm font-bold"><T>{"Mehmet Emin"}</T></p>
                              <p className="text-xs text-muted-foreground"><T>{"Ürün Yöneticisi"}</T></p>
                            </div>
                          </div>
                        </div>

                        <div className="border border-foreground/10 bg-background/30 p-4">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold"><T>{"Teknoloji Yığını"}</T></p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {["Next.js", "Node.js", "PostgreSQL", "TailwindCSS", "Framer Motion"].map((tech) => (
                              <Badge key={tech} className="text-[10px] tracking-wide font-mono px-2 py-0.5"><T>{tech}</T></Badge>
                            ))}
                          </div>
                        </div>

                        <div className="border border-primary/20 bg-primary/5 p-4 text-center">
                          <p className="text-xs font-bold text-primary uppercase tracking-widest"><T>{"Sıradaki Milestone"}</T></p>
                          <p className="text-sm font-black mt-2"><T>{"Kart Saklama & Ödeme Testleri"}</T></p>
                          <p className="text-xs text-muted-foreground mt-1"><T>{"Tahmini: 2 Gün İçinde"}</T></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KANBAN TASKS TAB */}
                  {activeTab === "tasks" && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-lg font-bold"><T>{"Sprint 3 Görev Panosu"}</T></h4>
                          <p className="text-xs text-muted-foreground"><T>{"Aktif Sprint Görevlerinin Durum Dağılımı"}</T></p>
                        </div>
                        <Badge variant="primary" className="text-xs font-mono"><T>{"%68 Tamamlandı"}</T></Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Column 1: Yapılacaklar */}
                        <div className="border border-foreground/10 bg-background/20 p-4">
                          <div className="flex items-center justify-between border-b border-foreground/10 pb-2 mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground"><T>{"Yapılacaklar (2)"}</T></span>
                            <span className="h-4 w-4 bg-foreground/10 rounded-full text-[10px] flex items-center justify-center"><T>{"2"}</T></span>
                          </div>
                          <div className="space-y-3">
                            <div className="border border-foreground/10 bg-card p-3 rounded-xl hover:border-foreground/20 transition-all">
                              <p className="text-xs text-secondary font-mono tracking-wider font-bold mb-1"><T>{"SEO & META"}</T></p>
                              <p className="text-sm font-bold leading-snug"><T>{"SEO Başlık Yapılandırması ve Schema İşaretlemeleri"}</T></p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-foreground/5 text-[10px] text-muted-foreground">
                                <span><T>{"Can Y."}</T></span>
                                <span><T>{"Öncelik: Düşük"}</T></span>
                              </div>
                            </div>
                            <div className="border border-foreground/10 bg-card p-3 rounded-xl hover:border-foreground/20 transition-all">
                              <p className="text-xs text-primary font-mono tracking-wider font-bold mb-1"><T>{"PERFORMANS"}</T></p>
                              <p className="text-sm font-bold leading-snug"><T>{"Mobil Hız ve Görsel Sıkıştırma Optimizasyonları"}</T></p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-foreground/5 text-[10px] text-muted-foreground">
                                <span><T>{"Can Y."}</T></span>
                                <span><T>{"Öncelik: Orta"}</T></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Yapılıyor */}
                        <div className="border border-foreground/10 bg-background/20 p-4">
                          <div className="flex items-center justify-between border-b border-foreground/10 pb-2 mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-accent"><T>{"Yapılıyor (2)"}</T></span>
                            <span className="h-4 w-4 bg-accent/20 text-accent rounded-full text-[10px] flex items-center justify-center font-bold"><T>{"2"}</T></span>
                          </div>
                          <div className="space-y-3">
                            <div className="border border-accent/30 bg-card p-3 rounded-xl relative shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                              <div className="absolute top-3 right-3 shrink-0">
                                <Clock className="w-3.5 h-3.5 text-accent " />
                              </div>
                              <p className="text-xs text-accent font-mono tracking-wider font-bold mb-1"><T>{"ENTEGRASYON"}</T></p>
                              <p className="text-sm font-bold leading-snug pr-4"><T>{"Iyzico 3D Secure Ödeme Akışının Bağlanması"}</T></p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-foreground/5 text-[10px] text-muted-foreground">
                                <span><T>{"Zeynep K."}</T></span>
                                <Badge variant="default" className="text-[9px] px-1.5 py-0 border-accent/20 bg-accent/5 text-accent font-bold"><T>{"Kritik"}</T></Badge>
                              </div>
                            </div>
                            <div className="border border-foreground/10 bg-card p-3 rounded-xl hover:border-foreground/20 transition-all">
                              <p className="text-xs text-primary font-mono tracking-wider font-bold mb-1"><T>{"ARAYÜZ"}</T></p>
                              <p className="text-sm font-bold leading-snug"><T>{"Sepet Açılır Panel Detay Animasyonları"}</T></p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-foreground/5 text-[10px] text-muted-foreground">
                                <span><T>{"Elif Ö."}</T></span>
                                <span><T>{"Öncelik: Orta"}</T></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Tamamlananlar */}
                        <div className="border border-foreground/10 bg-background/20 p-4">
                          <div className="flex items-center justify-between border-b border-foreground/10 pb-2 mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary"><T>{"Tamamlananlar (3)"}</T></span>
                            <span className="h-4 w-4 bg-primary/20 text-primary rounded-full text-[10px] flex items-center justify-center font-bold"><T>{"3"}</T></span>
                          </div>
                          <div className="opacity-60 space-y-3">
                            <div className="border border-primary/20 bg-card p-3 rounded-xl">
                              <p className="text-xs text-primary font-mono tracking-wider font-bold mb-1"><T>{"GÜVENLİK"}</T></p>
                              <p className="text-sm font-bold leading-snug line-through text-muted-foreground"><T>{"SMS OTP Doğrulama ve Giriş Modülü"}</T></p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-foreground/5 text-[10px] text-muted-foreground">
                                <span><T>{"Zeynep K."}</T></span>
                                <span className="text-primary font-bold"><T>{"Bitti"}</T></span>
                              </div>
                            </div>
                            <div className="border border-primary/20 bg-card p-3 rounded-xl">
                              <p className="text-xs text-primary font-mono tracking-wider font-bold mb-1"><T>{"VERİTABANI"}</T></p>
                              <p className="text-sm font-bold leading-snug line-through text-muted-foreground"><T>{"PostgreSQL Sipariş & Ürün Şemalarının Kurulumu"}</T></p>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-foreground/5 text-[10px] text-muted-foreground">
                                <span><T>{"Can Y."}</T></span>
                                <span className="text-primary font-bold"><T>{"Bitti"}</T></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LIVE PREVIEW & COMMITS TAB */}
                  {activeTab === "preview" && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Live Server Mockup */}
                        <div className="border border-accent/20 bg-background/30 p-5 flex flex-col justify-between rounded-xl">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold font-mono text-accent uppercase tracking-wider"><T>{"TEST SUNUCUSU DURUMU"}</T></span>
                              <Badge variant="default" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5"><T>{"AKTİF (ONLINE)"}</T></Badge>
                            </div>
                            <h4 className="text-lg font-bold"><T>{"Meg-SaaS Test Ortamı"}</T></h4>
                            <p className="text-xs text-muted-foreground mt-1"><T>{"Her kod commit edildiğinde test sunucusu otomatik güncellenir."}</T></p>
                          </div>
                          
                          <div className="mt-8">
                            <a
                              href="https://test-saas.megdev.com.tr"
                              onClick={(e) => e.preventDefault()}
                              className="inline-flex w-full items-center justify-center gap-2 bg-accent text-background px-4 py-3 text-sm font-black transition-all hover:bg-accent/90"
                            >
                              <T>{"Canlı Test Linkine Git"}</T><ArrowUpRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>

                        {/* Git Commits Feed */}
                        <div className="border border-foreground/10 bg-background/30 p-5 rounded-xl">
                          <div className="flex items-center gap-2 border-b border-foreground/10 pb-3 mb-4">
                            <Terminal className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground"><T>{"Son Git Commitleri (Aktivite)"}</T></span>
                          </div>

                          <div className="space-y-4 font-mono text-xs">
                            {[
                              { hash: "7c12f0d", msg: "feat: sms otp verification backend controller integrated", time: "1 saat önce", author: "zeynep" },
                              { hash: "9a23d4f", msg: "style: custom transitions added to checkout shopping cart panel", time: "3 saat önce", author: "elif" },
                              { hash: "b545d12", msg: "fix: client checkout routing issue under nested layout redirection", time: "5 saat önce", author: "can" },
                              { hash: "a09df99", msg: "feat: database order schema model migration and trigger query updates", time: "1 gün önce", author: "can" },
                            ].map((commit, i) => (
                              <div key={i} className="flex items-start gap-3 border-b border-foreground/5 pb-2 last:border-0 last:pb-0">
                                <span className="text-primary font-bold shrink-0"><T>{commit.hash}</T></span>
                                <div className="flex-1 min-w-0">
                                  <LocalizedElement as="p" className="text-foreground truncate text-[11px]" title={commit.msg}><T>{commit.msg}</T></LocalizedElement>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    <T>{commit.time}</T> <T>{" · "}</T><span className="text-accent"><T>{"@"}</T><T>{commit.author}</T></span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHAT TAB */}
                  {activeTab === "chat" && (
                    <div className="flex flex-col h-[400px]">
                      <div className="flex items-center justify-between border-b border-foreground/10 pb-3 mb-4">
                        <div>
                          <h4 className="text-sm font-bold"><T>{"Proje İletişim Kanalı (#meg-saas)"}</T></h4>
                          <p className="text-[10px] text-muted-foreground"><T>{"Meg Dev Ekibi & Siz"}</T></p>
                        </div>
                        <Badge variant="primary" className="text-[10px] tracking-wider py-0.5"><T>{"SLACK ENTEGRASYONU"}</T></Badge>
                      </div>

                      {/* Messages Scroll Area */}
                      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/10">
                        {/* Message 1 */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                            <T>{"🤖"}</T></div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-black text-accent"><T>{"MegDev-Bot"}</T></span>
                              <span className="text-[9px] text-muted-foreground"><T>{"Dün 10:00"}</T></span>
                            </div>
                            <p className="text-xs bg-foreground/[0.03] border border-foreground/5 p-2 mt-1 max-w-[450px] leading-relaxed text-muted-foreground">
                              <T>{"⚙️ **[DEPLOYMENT OK]** `dev-branch` test sunucusuna başarıyla yüklendi. Veritabanı şeması güncellendi."}</T></p>
                          </div>
                        </div>

                        {/* Message 2 */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                            <T>{"ZK"}</T></div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-black text-foreground"><T>{"Zeynep Kaya (CTO)"}</T></span>
                              <span className="text-[9px] text-muted-foreground"><T>{"Bugün 11:20"}</T></span>
                            </div>
                            <p className="text-xs bg-foreground/[0.03] border border-foreground/5 p-2 mt-1 max-w-[450px] leading-relaxed">
                              <T>{"Merhaba! Sepet sayfasındaki mobil yüklenme hızlarını 0.4 saniye seviyesine çektik. Görsel sıkıştırma işlemlerini tamamladık. Test sunucusundan inceleyebilirsiniz."}</T></p>
                          </div>
                        </div>

                        {/* Message 3 */}
                        <div className="flex gap-3 justify-end">
                          <div className="text-right">
                            <div className="flex items-baseline gap-2 justify-end">
                              <span className="text-[9px] text-muted-foreground"><T>{"Bugün 12:15"}</T></span>
                              <span className="text-xs font-black text-primary"><T>{"Siz (Müşteri)"}</T></span>
                            </div>
                            <p className="text-xs bg-primary/10 border border-primary/20 text-foreground p-2 mt-1 max-w-[450px] text-left leading-relaxed">
                              <T>{"Harika bir çalışma olmuş, ellerinize sağlık. Peki mobil ödeme adımında kredi kartı girişi yaparken kart numarası aralarına otomatik boşluk bırakılıyor mu? Mobil kullanım kolaylığı için kritik."}</T></p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center shrink-0 font-bold text-xs">
                            <T>{"Siz"}</T></div>
                        </div>

                        {/* Message 4 */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-xs">
                            <T>{"CY"}</T></div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-black text-foreground"><T>{"Can Yıldız (Lead Dev)"}</T></span>
                              <span className="text-[9px] text-muted-foreground"><T>{"Bugün 12:30"}</T></span>
                            </div>
                            <p className="text-xs bg-foreground/[0.03] border border-foreground/5 p-2 mt-1 max-w-[450px] leading-relaxed">
                              <T>{"Evet, kart numarası alanına otomatik formatlayıcı ekledik. Kullanıcı yazarken her 4 hanede bir otomatik boşluk atılıyor. Az önce test sunucusuna gönderdim, hemen deneyebilirsiniz!"}</T></p>
                          </div>
                        </div>
                      </div>

                      {/* Mock Chat Input */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-foreground/10">
                        <LocalizedElement as="input"
                          type="text"
                          placeholder="Mesaj gönder... (Bu bir demodur)"
                          disabled
                          className="flex-1 bg-background/50 border border-foreground/10 px-4 py-2 text-xs focus:outline-none placeholder:text-muted-foreground/60"
                        />
                        <button disabled className="bg-primary/20 text-muted-foreground px-4 py-2 shrink-0">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Footer Notice */}
              <div className="mt-6 flex items-center gap-2 border-t border-foreground/10 pt-4 text-[10px] text-muted-foreground">
                <ShieldAlert className="w-3.5 h-3.5 text-primary shrink-0" />
                <span><T>{"Bu ekran, projeniz geliştirilirken kullanacağınız Meg Dev Müşteri Paneli'nin birebir canlı simülasyonudur."}</T></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
