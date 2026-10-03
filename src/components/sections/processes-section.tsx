"use client"

import { T } from "@/components/i18n/text"
import { motion } from "framer-motion"
import { BugPlay, Code, Headset, Palette, Rocket, Search } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { processes } from "@/constants"
import styles from "./marketing-sections.module.css"

const processIcons: Record<string, React.ReactNode> = {
  Search: <Search size={21} />, Palette: <Palette size={21} />, Code: <Code size={21} />,
  BugPlay: <BugPlay size={21} />, Rocket: <Rocket size={21} />, Headset: <Headset size={21} />,
}

export function ProcessesSection() {
  return (
    <section id="processes" className={styles.section}>
      <div className={styles.shell}>
        <SectionHeading align="left" title="Birlikte, adım adım." subtitle="Fikir, prototip, geliştirme ve yayın adımlarını görünür teslimatlar halinde yönetiyoruz." />
        <div className={styles.rows}>
          {processes.map((process, index) => (
            <motion.article key={process.id} className={styles.processRow} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: .5, delay: index * .04 }}>
              <span className={styles.processNumber}><T>{String(process.id).padStart(2, "0")}</T></span>
              <h3><T>{process.title}</T></h3><p><T>{process.description}</T></p>
              <span className={styles.icon}><T>{processIcons[process.icon]}</T></span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
