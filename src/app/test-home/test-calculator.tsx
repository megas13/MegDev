"use client"


import { useLanguage } from "@/components/i18n/provider"
import { T } from "@/components/i18n/text"
import { useMemo, useRef, useState } from "react"
import Link from "@/components/i18n/link"
import { motion, useScroll, useSpring } from "framer-motion"
import { Brain, Check, Code2, Gauge, Globe2, Layers3, ShoppingBag, Smartphone, Sparkles } from "lucide-react"
import styles from "./test-home.module.css"

const types = [
  { id: "web", name: "Kurumsal web", price: 15000, weeks: 4, icon: Globe2 },
  { id: "commerce", name: "E-ticaret", price: 35000, weeks: 8, icon: ShoppingBag },
  { id: "mobile", name: "Mobil uygulama", price: 50000, weeks: 10, icon: Smartphone },
  { id: "crm", name: "CRM / Panel", price: 45000, weeks: 9, icon: Layers3 },
  { id: "ai", name: "Yapay zekâ", price: 60000, weeks: 12, icon: Brain },
  { id: "custom", name: "Özel yazılım", price: 75000, weeks: 16, icon: Code2 },
]

const modules = [
  { id: "auth", name: "Üyelik sistemi", price: 5000, weeks: 1 },
  { id: "payment", name: "Ödeme entegrasyonu", price: 7500, weeks: 1 },
  { id: "multilang", name: "Çoklu dil", price: 4000, weeks: 1 },
  { id: "analytics", name: "Gelişmiş raporlama", price: 8500, weeks: 2 },
  { id: "chatbot", name: "AI asistan", price: 15000, weeks: 2 },
  { id: "pwa", name: "PWA / Mobil deneyim", price: 10000, weeks: 2 },
]

const designs = [
  { id: "standard", name: "Standart", detail: "Temiz ve işlevsel", price: 0, weeks: 0 },
  { id: "custom", name: "Özgün UI/UX", detail: "Sıfırdan tasarım", price: 15000, weeks: 2 },
  { id: "premium", name: "Premium", detail: "Marka + animasyon", price: 25000, weeks: 3 },
]

export function TestCalculator() {
  const { intlLocale } = useLanguage()

  const sectionRef = useRef<HTMLElement>(null)
  const [type, setType] = useState("web")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [design, setDesign] = useState("standard")
  const [speed, setSpeed] = useState<"flex" | "normal" | "fast">("normal")
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const scrollScale = useSpring(scrollYProgress, { stiffness: 110, damping: 26 })

  const result = useMemo(() => {
    const project = types.find(item => item.id === type) ?? types[0]
    const designItem = designs.find(item => item.id === design) ?? designs[0]
    const extras = modules.filter(item => selectedModules.includes(item.id))
    const subtotal = project.price + designItem.price + extras.reduce((sum, item) => sum + item.price, 0)
    const baseWeeks = project.weeks + designItem.weeks + extras.reduce((sum, item) => sum + item.weeks, 0)
    const priceFactor = speed === "flex" ? .85 : speed === "fast" ? 1.3 : 1
    const weekFactor = speed === "flex" ? 1.2 : speed === "fast" ? .72 : 1
    const total = Math.round(subtotal * priceFactor / 500) * 500
    return { project, total, min: Math.round(total * .9 / 500) * 500, max: Math.round(total * 1.1 / 500) * 500, weeks: Math.max(2, Math.round(baseWeeks * weekFactor)) }
  }, [type, selectedModules, design, speed])

  const toggleModule = (id: string) => setSelectedModules(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])

  return (
    <section className={styles.calculatorSection} id="calculator" ref={sectionRef}>
      <motion.div className={styles.calculatorScrollLine} style={{ scaleX: scrollScale }} />
      <div className={styles.calculatorGridDecor} aria-hidden="true" />
      <motion.div className={styles.calculatorIntro} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}>
        <span><T>{"07 / PROJE KONFİGÜRATÖRÜ"}</T></span>
        <h2><T>{"Fikrinin"}</T><br /><em><T>{"ölçeğini gör."}</T></em></h2>
        <p><T>{"İhtiyaçlarını seç; yaklaşık bütçe ve teslim süresi anında önünde oluşsun."}</T></p>
        <div className={styles.calculatorNote}><Sparkles /><span><T>{"Bu çalışma ilk planlama içindir. Net teklif, kısa keşif görüşmesinden sonra hazırlanır."}</T></span></div>
      </motion.div>

      <div className={styles.configurator}>
        <div className={styles.configOptions}>
          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span><T>{"01"}</T></span><h3><T>{"Ne üretiyoruz?"}</T></h3></header>
            <div className={styles.typeGrid}>{types.map(item => { const Icon = item.icon; const active = type === item.id; return <button key={item.id} className={active ? styles.optionActive : ""} onClick={() => setType(item.id)}><Icon /><span><T>{item.name}</T></span>{active && <Check />}</button> })}</div>
          </motion.div>

          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span><T>{"02"}</T></span><h3><T>{"Hangi modüller gerekli?"}</T></h3><small><T>{"Birden fazla seçebilirsin"}</T></small></header>
            <div className={styles.moduleGrid}>{modules.map(item => { const active = selectedModules.includes(item.id); return <button key={item.id} className={active ? styles.moduleActive : ""} onClick={() => toggleModule(item.id)}><i>{active && <Check />}</i><span><T>{item.name}</T></span><small><T>{"+"}</T><T>{item.price.toLocaleString(intlLocale)}</T> <T>{" ₺"}</T></small></button> })}</div>
          </motion.div>

          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span><T>{"03"}</T></span><h3><T>{"Tasarım seviyesi"}</T></h3></header>
            <div className={styles.designGrid}>{designs.map(item => <button key={item.id} className={design === item.id ? styles.designActive : ""} onClick={() => setDesign(item.id)}><strong><T>{item.name}</T></strong><span><T>{item.detail}</T></span><small><T>{item.price ? `+${item.price.toLocaleString(intlLocale)} ₺` : "Dahil"}</T></small></button>)}</div>
          </motion.div>

          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span><T>{"04"}</T></span><h3><T>{"Teslimat temposu"}</T></h3></header>
            <div className={styles.speedSwitch}>{[["flex", "Esnek", "−%15 bütçe"], ["normal", "Standart", "Önerilen"], ["fast", "Ekspres", "−%28 süre"]].map(([id, label, note]) => <button key={id} className={speed === id ? styles.speedActive : ""} onClick={() => setSpeed(id as typeof speed)}><strong><T>{label}</T></strong><small><T>{note}</T></small></button>)}</div>
          </motion.div>
        </div>

        <motion.aside className={styles.liveEstimate} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7 }}>
          <div className={styles.estimateStatus}><i /> <T>{" CANLI TAHMİN"}</T></div>
          <div className={styles.estimateGauge}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}><i /><i /><i /><i /></motion.div>
            <span><Gauge /><small><T>{"PROJE"}</T><br /><T>{"ÖLÇEĞİ"}</T></small></span>
          </div>
          <span><T>{"Yaklaşık bütçe aralığı"}</T></span>
          <strong><T>{result.min.toLocaleString(intlLocale)}</T><i><T>{"—"}</T></i><T>{result.max.toLocaleString(intlLocale)}</T> <small><T>{"₺"}</T></small></strong>
          <p><T>{"KDV hariç tahmini proje bütçesidir."}</T></p>
          <div className={styles.estimateMetrics}><div><span><T>{"Teslimat"}</T></span><b><T>{result.weeks}</T><small> <T>{" hafta"}</T></small></b></div><div><span><T>{"Ek modül"}</T></span><b><T>{selectedModules.length}</T><small> <T>{" adet"}</T></small></b></div></div>
          <div className={styles.estimateBreakdown}><span><T>{"Seçilen yapı"}</T></span><div><b><T>{result.project.name}</T></b><small><T>{result.project.price.toLocaleString(intlLocale)}</T> <T>{" ₺ taban"}</T></small></div><div><b><T>{designs.find(item => item.id === design)?.name}</T></b><small><T>{"Tasarım seviyesi"}</T></small></div><div><b><T>{speed === "flex" ? "Esnek" : speed === "fast" ? "Ekspres" : "Standart"}</T></b><small><T>{"Proje temposu"}</T></small></div></div>
          <div className={styles.scopeMeter}>
            <header><span><T>{"Kapsam yoğunluğu"}</T></span><small><T>{Math.min(100, 28 + selectedModules.length * 10 + (design === "premium" ? 18 : design === "custom" ? 10 : 0))}</T><T>{"%"}</T></small></header>
            <div><motion.i animate={{ width: `${Math.min(100, 28 + selectedModules.length * 10 + (design === "premium" ? 18 : design === "custom" ? 10 : 0))}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} /></div>
          </div>
          <div className={styles.miniRoadmap}><span><T>{"Öngörülen akış"}</T></span><div>{["Keşif", "Tasarım", "Üretim", "Lansman"].map((item, index) => <i key={item}><b><T>{index + 1}</T></b><small><T>{item}</T></small></i>)}</div></div>
          <Link href={`/contact?project=${type}&budget=${result.total}`}><T>{"Detaylı teklif iste "}</T><span><T>{"↗"}</T></span></Link>
          <small className={styles.estimateFoot}><T>{"Seçimlerin iletişim sayfasına aktarılır."}</T></small>
        </motion.aside>
      </div>
    </section>
  )
}
