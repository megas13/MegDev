"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
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
        <span>07 / PROJE KONFİGÜRATÖRÜ</span>
        <h2>Fikrinin<br /><em>ölçeğini gör.</em></h2>
        <p>İhtiyaçlarını seç; yaklaşık bütçe ve teslim süresi anında önünde oluşsun.</p>
        <div className={styles.calculatorNote}><Sparkles /><span>Bu çalışma ilk planlama içindir. Net teklif, kısa keşif görüşmesinden sonra hazırlanır.</span></div>
      </motion.div>

      <div className={styles.configurator}>
        <div className={styles.configOptions}>
          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span>01</span><h3>Ne üretiyoruz?</h3></header>
            <div className={styles.typeGrid}>{types.map(item => { const Icon = item.icon; const active = type === item.id; return <button key={item.id} className={active ? styles.optionActive : ""} onClick={() => setType(item.id)}><Icon /><span>{item.name}</span>{active && <Check />}</button> })}</div>
          </motion.div>

          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span>02</span><h3>Hangi modüller gerekli?</h3><small>Birden fazla seçebilirsin</small></header>
            <div className={styles.moduleGrid}>{modules.map(item => { const active = selectedModules.includes(item.id); return <button key={item.id} className={active ? styles.moduleActive : ""} onClick={() => toggleModule(item.id)}><i>{active && <Check />}</i><span>{item.name}</span><small>+{item.price.toLocaleString("tr-TR")} ₺</small></button> })}</div>
          </motion.div>

          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span>03</span><h3>Tasarım seviyesi</h3></header>
            <div className={styles.designGrid}>{designs.map(item => <button key={item.id} className={design === item.id ? styles.designActive : ""} onClick={() => setDesign(item.id)}><strong>{item.name}</strong><span>{item.detail}</span><small>{item.price ? `+${item.price.toLocaleString("tr-TR")} ₺` : "Dahil"}</small></button>)}</div>
          </motion.div>

          <motion.div className={styles.configBlock} initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6 }}>
            <header><span>04</span><h3>Teslimat temposu</h3></header>
            <div className={styles.speedSwitch}>{[["flex", "Esnek", "−%15 bütçe"], ["normal", "Standart", "Önerilen"], ["fast", "Ekspres", "−%28 süre"]].map(([id, label, note]) => <button key={id} className={speed === id ? styles.speedActive : ""} onClick={() => setSpeed(id as typeof speed)}><strong>{label}</strong><small>{note}</small></button>)}</div>
          </motion.div>
        </div>

        <motion.aside className={styles.liveEstimate} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7 }}>
          <div className={styles.estimateStatus}><i /> CANLI TAHMİN</div>
          <div className={styles.estimateGauge}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}><i /><i /><i /><i /></motion.div>
            <span><Gauge /><small>PROJE<br />ÖLÇEĞİ</small></span>
          </div>
          <span>Yaklaşık bütçe aralığı</span>
          <strong>{result.min.toLocaleString("tr-TR")}<i>—</i>{result.max.toLocaleString("tr-TR")} <small>₺</small></strong>
          <p>KDV hariç tahmini proje bütçesidir.</p>
          <div className={styles.estimateMetrics}><div><span>Teslimat</span><b>{result.weeks}<small> hafta</small></b></div><div><span>Ek modül</span><b>{selectedModules.length}<small> adet</small></b></div></div>
          <div className={styles.estimateBreakdown}><span>Seçilen yapı</span><div><b>{result.project.name}</b><small>{result.project.price.toLocaleString("tr-TR")} ₺ taban</small></div><div><b>{designs.find(item => item.id === design)?.name}</b><small>Tasarım seviyesi</small></div><div><b>{speed === "flex" ? "Esnek" : speed === "fast" ? "Ekspres" : "Standart"}</b><small>Proje temposu</small></div></div>
          <div className={styles.scopeMeter}>
            <header><span>Kapsam yoğunluğu</span><small>{Math.min(100, 28 + selectedModules.length * 10 + (design === "premium" ? 18 : design === "custom" ? 10 : 0))}%</small></header>
            <div><motion.i animate={{ width: `${Math.min(100, 28 + selectedModules.length * 10 + (design === "premium" ? 18 : design === "custom" ? 10 : 0))}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} /></div>
          </div>
          <div className={styles.miniRoadmap}><span>Öngörülen akış</span><div>{["Keşif", "Tasarım", "Üretim", "Lansman"].map((item, index) => <i key={item}><b>{index + 1}</b><small>{item}</small></i>)}</div></div>
          <Link href={`/contact?project=${type}&budget=${result.total}`}>Detaylı teklif iste <span>↗</span></Link>
          <small className={styles.estimateFoot}>Seçimlerin iletişim sayfasına aktarılır.</small>
        </motion.aside>
      </div>
    </section>
  )
}
