"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import styles from "./page-intro.module.css"

interface PageIntroProps {
  eyebrow: string
  title: string
  description?: string
  index?: string
  children?: ReactNode
}

export function PageIntro({ eyebrow, title, description, index = "MEGDEV", children }: PageIntroProps) {
  const reducedMotion = useReducedMotion()
  return (
    <LocalizedElement as="section" className={styles.intro} aria-label={eyebrow}>
      <motion.div className={styles.inner} initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}>
        <div className={styles.meta}><span><i aria-hidden="true" /> <T>{" MEGDEV / "}</T><T>{eyebrow}</T></span><span><T>{index}</T></span></div>
        <h1><T>{title}</T></h1>
        <div className={styles.summary}>{description && <p><T>{description}</T></p>}<T>{children}</T></div>
        <div className={styles.line} aria-hidden="true"><span /> <span><T>{"FİKİRDEN DİJİTAL DENEYİME"}</T></span></div>
      </motion.div>
    </LocalizedElement>
  )
}
