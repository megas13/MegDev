"use client"

import { T } from "@/components/i18n/text"
import { motion } from "framer-motion"
import Link from "@/components/i18n/link"
import { ArrowUpRight } from "lucide-react"
import styles from "./public-experience.module.css"

export function CTASection() {
  return (
    <section className={styles.section}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${styles.container} ${styles.cta}`}>
        <div>
          <p className={styles.eyebrow}><T>{"Bir sonraki projeniz / MegDev"}</T></p>
          <h2><T>{"Bir fikriniz var."}</T><br /><T>{"Birlikte gerçekleştirelim."}</T></h2>
          <p><T>{"Kısa bir keşif görüşmesiyle kapsamı, öncelikleri ve en doğru teslim planını netleştirelim."}</T></p>
        </div>
        <div className={styles.ctaActions}>
          <Link href="/contact" className={`${styles.pill} ${styles.primary}`}><T>{"Hemen Teklif Alın"}</T><ArrowUpRight /></Link>
          <Link href="/services" className={styles.pill}><T>{"Hizmetleri İnceleyin"}</T><ArrowUpRight /></Link>
        </div>
      </motion.div>
    </section>
  )
}
