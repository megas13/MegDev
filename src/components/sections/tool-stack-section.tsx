"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { ArrowUpRight } from "lucide-react"
import styles from "./marketing-sections.module.css"

interface ToolNode {
  id: string
  name: string
  role: string
  description: string
  icon: React.ReactNode
  color: string
}

export function ToolStackSection() {
  const [selectedTool, setSelectedTool] = useState<string>("figma")

  const tools: ToolNode[] = [
    {
      id: "figma",
      name: "Figma",
      role: "Tasarım & Prototipleme",
      description: "Projenizin tüm ekran arayüzlerini ve kullanıcı akışlarını Figma'da tasarlıyoruz. Siz her butona, renge ve yerleşime canlı olarak göz atıp onay verdikten sonra kodlama aşamasına geçiyoruz.",
      color: "from-pink-500 to-purple-500 hover:shadow-pink-500/20",
      icon: (
        <svg viewBox="0 0 120 180" className="w-6 h-9 fill-current text-white">
          <path d="M30 45C30 20.1 50.1 0 75 0c24.9 0 45 20.1 45 45 0 18.2-10.8 33.8-26.2 40.8C109.2 92.8 120 108.4 120 126.6c0 24.9-20.1 45-45 45-24.9 0-45-20.1-45-45 0-11 4-21.1 10.6-28.9C34 90 30 79.9 30 68.9V45z" className="opacity-0" />
          <path d="M30 45a30 30 0 0 1 30-30h30a30 30 0 0 1 0 60H60A30 30 0 0 1 30 45z" fill="#F24E1E" />
          <path d="M30 105a30 30 0 0 1 30-30h30a30 30 0 0 1 30 30 30 30 0 0 1-30 30H60a30 30 0 0 1-30-30z" fill="#A259FF" />
          <path d="M30 165a30 30 0 0 1 30-30h30a30 30 0 0 1 0 60H60a30 30 0 0 1-30-30z" fill="#0ACF83" />
          <path d="M90 45a30 30 0 1 1 60 0 30 30 0 0 1-60 0z" fill="#FF7262" />
          <path d="M90 105a30 30 0 1 1 60 0 30 30 0 0 1-60 0z" fill="#1ABC9C" />
        </svg>
      ),
    },
    {
      id: "linear",
      name: "Linear",
      role: "Proje & Görev Yönetimi",
      description: "Haftalık hedeflerimizi ve görev listelerimizi Linear üzerinde planlıyoruz. Müşteri portalınızdaki Kanban panosunda da görebileceğiniz üzere, hangi görev üzerinde kimin çalıştığını canlı olarak izleyebilirsiniz.",
      color: "from-indigo-600 to-violet-600 hover:shadow-indigo-500/20",
      icon: (
        <svg viewBox="0 0 20 20" className="w-7 h-7 fill-current text-white">
          <path d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm4.27 12.923a1.077 1.077 0 01-1.523 0l-3.342-3.341a1.077 1.077 0 010-1.523l3.342-3.342a1.077 1.077 0 011.523 1.523L11.71 8.814l2.56 2.56a1.09 1.09 0 010 1.549zM5.73 7.077a1.077 1.077 0 011.523 0l3.342 3.341a1.077 1.077 0 010 1.523l-3.342 3.342a1.077 1.077 0 01-1.523-1.523l2.56-2.56-2.56-2.56a1.09 1.09 0 010-1.549z" />
        </svg>
      ),
    },
    {
      id: "slack",
      name: "Slack",
      role: "Anlık İletişim & Raporlar",
      description: "Projeniz başladığı an size özel bir Slack kanalı açıyoruz. Ekibimizle doğrudan yazışabileceğiniz gibi, test sunucumuza gönderilen her güncelleme raporu da bota bağlı olarak bu kanala otomatik düşer.",
      color: "from-amber-500 to-rose-500 hover:shadow-amber-500/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-white">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1-2.52-2.52 2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 10.136a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-5.043-10.136a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.522h-2.52v-2.522zm0-1.262a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.52H15.18a2.528 2.528 0 0 1-2.522-2.52v-5.043z" />
        </svg>
      ),
    },
    {
      id: "github",
      name: "GitHub",
      role: "Kod Deposu & Versiyon Kontrolü",
      description: "Yazılan tüm kod satırları sürüm kontrollü olarak GitHub depolarımızda toplanır. Her geliştirme, her hata düzeltmesi kod geçmişinde şeffaf ve güvenli bir şekilde saklanır.",
      color: "from-zinc-800 to-zinc-950 hover:shadow-white/5",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-white">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: "vercel",
      name: "Vercel / Docker",
      role: "Otomatik Yayına Alma & Test",
      description: "GitHub'a gönderilen her kod satırı, akıllı entegrasyon altyapımız (CI/CD) sayesinde otomatik olarak derlenir ve test sunucunuza yüklenir. Böylece, projenin canlı halini her an test edebilirsiniz.",
      color: "from-sky-500 to-indigo-500 hover:shadow-sky-500/20",
      icon: (
        <svg viewBox="0 0 115 100" className="w-8 h-7 fill-current text-white">
          <path d="M57.5 0L115 100H0L57.5 0z" />
        </svg>
      ),
    },
  ]

  const activeToolObj = tools.find((t) => t.id === selectedTool) || tools[0]

  return (
    <section id="tool-stack" className={styles.section}>
      <div className={styles.shell}>
        <SectionHeading align="left" title="Her adımda bağlantıda." subtitle="Yazılım geliştirme aşamalarımızı şeffaf, hızlı ve hatasız kılmak için sektör standardı iş araçlarını birbirine bağlıyoruz." />
        <div className={styles.toolLayout}>
          <LocalizedElement as="div" className={styles.toolList} aria-label="Entegrasyon araçları">
            {tools.map(tool => <button key={tool.id} onClick={() => setSelectedTool(tool.id)} className={styles.tool} aria-pressed={selectedTool === tool.id} aria-controls="tool-details">
              <span className={styles.toolIcon}><T>{tool.icon}</T></span><span className={styles.toolName}><T>{tool.name}</T></span><ArrowUpRight size={16} />
            </button>)}
          </LocalizedElement>
          <div id="tool-details" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article key={selectedTool} className={styles.toolDetails} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: .25 }}>
                <span className={styles.label}><T>{"MEGDEV / ENTEGRASYON"}</T></span><h4><T>{activeToolObj.name}</T></h4><p className={styles.toolRole}><T>{activeToolObj.role}</T></p><p className={styles.toolDescription}><T>{activeToolObj.description}</T></p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
