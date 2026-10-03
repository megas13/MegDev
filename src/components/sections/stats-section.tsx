"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { motion } from "framer-motion"
import { stats } from "@/constants"
import styles from "./marketing-sections.module.css"

export function StatsSection() {
  return <LocalizedElement as="section" className={styles.section} aria-label="MegDev sayılarla">
    <div className={styles.shell}><div className={styles.stats}>
      {stats.map((stat, index) => <motion.div key={stat.id} className={styles.stat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: index * .07 }}>
        <div className={styles.statValue}><T>{stat.value}</T></div><div className={styles.statLabel}><T>{stat.label}</T></div>
      </motion.div>)}
    </div></div>
  </LocalizedElement>
}
