"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { SectionHeading } from "@/components/ui/section-heading"
import styles from "./marketing-sections.module.css"
type PortfolioItem = {
  id: string
  title: string
  description: string
  category: string | null
  technologies: string[]
  project_url: string | null
  image_url: string | null
}

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio", {
          cache: "no-store",
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Portföy yüklenemedi")
        const data = await response.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setLoadError(true)
          console.error(error)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadPortfolio()
    return () => controller.abort()
  }, [])

  const categories = [
    "Tümü",
    ...Array.from(
      new Set(items.map((item) => item.category).filter((category): category is string => Boolean(category)))
    ),
  ]

  const filtered =
    activeCategory === "Tümü"
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <section id="portfolio" className={styles.section}>
      <div className={styles.shell}>
        <SectionHeading align="left" title="Fikirler, yaşayan ürünlere dönüşür." subtitle="Farklı sektörlerde iş hedefi net, teknik altyapısı sağlam ve kullanımı kolay dijital ürünler." />
        <LocalizedElement as="div" className={styles.filters} aria-label="Proje kategorileri">
          {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={styles.filter} aria-pressed={activeCategory === category}><T>{category}</T></button>)}
        </LocalizedElement>
        {loading && <p className={styles.empty} role="status"><T>{"Portföy yükleniyor…"}</T></p>}
        {!loading && loadError && <p className={styles.empty} role="status"><T>{"Projeler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin."}</T></p>}
        {!loading && !loadError && filtered.length === 0 && <p className={styles.empty}><T>{"Henüz portföy projesi eklenmemiş."}</T></p>}
        <motion.div layout className={styles.projects}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.article key={item.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: .3, delay: index * .035 }} className={styles.project}>
                {item.image_url && <div className={styles.projectImage}><Image src={item.image_url} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" unoptimized /></div>}
                <div className={styles.projectTop}>
                  <div>{item.category && <span className={styles.label}><T>{item.category}</T></span>}<h3><T>{item.title}</T></h3></div>
                  {item.project_url ? <LocalizedElement as="a" href={item.project_url} target="_blank" rel="noopener noreferrer" aria-label={item.title + " projesini aç"} className={styles.circleLink}><ArrowUpRight size={19} /></LocalizedElement> : <span className={styles.number}><T>{String(index + 1).padStart(2, "0")}</T></span>}
                </div>
                <p><T>{item.description}</T></p>
                <div className={styles.tags}>{(item.technologies || []).map(tech => <span key={tech} className={styles.tag}><T>{tech}</T></span>)}</div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
