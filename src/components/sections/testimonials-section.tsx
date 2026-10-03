"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { testimonials } from "@/constants"
import styles from "./marketing-sections.module.css"

export function TestimonialsSection() {
  return <section className={styles.section}>
    <div className={styles.shell}>
      <SectionHeading align="left" title="Birlikte ürettiğimiz ekipler." subtitle="Birlikte ürün geliştirdiğimiz ekiplerden kısa geri bildirimler." />
      <div className={styles.quotes}>
        {testimonials.map((testimonial, index) => <motion.article key={testimonial.id} className={styles.quote} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: index * .08 }}>
          <div className={styles.quoteTop}><LocalizedElement as="div" className={styles.stars} aria-label={testimonial.rating + " yıldız"}>{Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</LocalizedElement><Quote size={22} /></div>
          <blockquote><T>{"“"}</T><T>{testimonial.content}</T><T>{"”"}</T></blockquote>
          <div className={styles.quotePerson}><span className={styles.avatar}><T>{testimonial.name.charAt(0)}</T></span><div><strong><T>{testimonial.name}</T></strong><small><T>{testimonial.role}</T></small></div></div>
        </motion.article>)}
      </div>
    </div>
  </section>
}
