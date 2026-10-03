"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useLanguage } from "@/components/i18n/provider"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"
import { faqs } from "@/constants"
import styles from "./public-experience.module.css"

export function FAQSection() {
  const { t, intlLocale } = useLanguage()
  const [openId, setOpenId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const query = searchQuery.toLocaleLowerCase(intlLocale)
  const filtered = faqs.filter((faq) => t(faq.question).toLocaleLowerCase(intlLocale).includes(query) || t(faq.answer).toLocaleLowerCase(intlLocale).includes(query))

  return (
    <section className={styles.section}>
      <div className={`${styles.container} ${styles.faqGrid}`}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.heading}>
          <p className={styles.eyebrow}><T>{"Merak edilenler / SSS"}</T></p>
          <h2><T>{"Aklınızdaki sorular."}</T></h2>
          <p><T>{"Projeler ve çalışma sürecimiz hakkında en çok merak edilen başlıklar."}</T></p>
        </motion.div>
        <div>
          <div className={styles.search}><Search aria-hidden="true" /><LocalizedElement as="input" aria-label="Sık sorulan sorularda ara" type="search" placeholder="Sorularınızı arayın..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.input} /></div>
          <div>
            {filtered.map((faq) => (
              <motion.div key={faq.id} layout className={styles.faqItem}>
                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className={styles.faqQuestion} aria-expanded={openId === faq.id} aria-controls={`faq-answer-${faq.id}`}><span><T>{faq.question}</T></span><ChevronDown className={`transition-transform ${openId === faq.id ? "rotate-180" : ""}`} aria-hidden="true" /></button>
                <div id={`faq-answer-${faq.id}`}><AnimatePresence>{openId === faq.id && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} className="overflow-hidden"><p className={styles.faqAnswer}><T>{faq.answer}</T></p></motion.div>}</AnimatePresence></div>
              </motion.div>
            ))}
            {filtered.length === 0 && <p className={styles.empty}><T>{"Bu arama için bir sonuç bulunamadı."}</T></p>}
          </div>
        </div>
      </div>
    </section>
  )
}
