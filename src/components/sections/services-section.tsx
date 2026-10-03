"use client"

import { T } from "@/components/i18n/text"
import { motion } from "framer-motion"
import Link from "@/components/i18n/link"
import { ArrowUpRight, Brain, Code, Globe, ShoppingCart, Smartphone, Users } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { services } from "@/constants"
import styles from "./marketing-sections.module.css"

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe size={24} />, ShoppingCart: <ShoppingCart size={24} />,
  Users: <Users size={24} />, Smartphone: <Smartphone size={24} />,
  Brain: <Brain size={24} />, Code: <Code size={24} />,
}

export function ServicesSection() {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.shell}>
        <SectionHeading align="left" title="Doğru fikir. Doğru çözüm." subtitle="İhtiyaca göre tasarlanan, ölçülebilir ve sürdürülebilir yazılım çözümleri." />
        <div className={styles.rows}>
          {services.map((service, index) => (
            <motion.article key={service.id} className={styles.serviceRow}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }} transition={{ duration: .5, delay: index * .035 }}>
              <span className={styles.number}><T>{String(index + 1).padStart(2, "0")}</T></span>
              <div className={styles.serviceTitle}>
                <span className={styles.icon}><T>{iconMap[service.icon]}</T></span>
                <h3><T>{service.title}</T></h3>
              </div>
              <div className={styles.serviceBody}>
                <p><T>{service.description}</T></p>
                <ul className={styles.features}>{service.features.map(feature => <li key={feature}><T>{feature}</T></li>)}</ul>
              </div>
              <Link href={"/services/" + service.slug} className={styles.circleLink} aria-label={service.title + " hizmetini incele"}><ArrowUpRight size={19} /></Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
