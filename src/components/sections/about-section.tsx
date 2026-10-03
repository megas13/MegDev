"use client"

import { T } from "@/components/i18n/text"
import { motion } from "framer-motion"
import { Clock, Heart, Users, Zap } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { whyUs } from "@/constants"
import styles from "./marketing-sections.module.css"

const whyUsIcons: Record<string, React.ReactNode> = {
  Users: <Users size={21} />, Zap: <Zap size={21} />, Heart: <Heart size={21} />, Clock: <Clock size={21} />,
}

export function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.shell}>
        <SectionHeading align="left" title="Neden MegDev?" subtitle="Fikri, mimariyi, kullanıcı deneyimini ve yayın sürecini birlikte yönetiyoruz." />
        <div className={styles.storyGrid}>
          <motion.div className={styles.story} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
            <p className={styles.label}><T>{"HİKAYEMİZ / ORTAK BİR VİZYON"}</T></p>
            <h3><T>{"Küçük ekip hızını,"}</T><br /><T>{"kurumsal ürün disipliniyle birleştiriyoruz."}</T></h3>
            <p><T>{"Meg Dev, işletmelerin dijital ürünlerini daha hızlı ve daha kontrollü geliştirmesi için kuruldu. Her projede önce problemi sadeleştiriyor, sonra doğru teknoloji ve tasarım kararlarıyla ürünü yayına taşıyoruz."}</T></p>
            <p><T>{"Bugün farklı sektörlerde web, mobil, CRM, e-ticaret ve yapay zeka projeleri geliştiriyoruz. Odağımız; gösterişli ama kırılgan işler değil, gerçek kullanıcı akışlarında çalışan ürünler."}</T></p>
            <div className={styles.mission}>
              <div><h4><T>{"Misyon"}</T></h4><p><T>{"İşletmelere sürdürülebilir ve ölçülebilir yazılım çözümleri sunmak."}</T></p></div>
              <div><h4><T>{"Vizyon"}</T></h4><p><T>{"Türkiye kaynaklı güçlü dijital ürünlerin teknoloji ortağı olmak."}</T></p></div>
            </div>
          </motion.div>
          <div className={styles.values}>
            {whyUs.map((item, index) => (
              <motion.article key={item.id} className={styles.value} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: index * .08 }}>
                <span className={styles.icon}><T>{whyUsIcons[item.icon]}</T></span>
                <h4><T>{item.title}</T></h4><p><T>{item.description}</T></p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
