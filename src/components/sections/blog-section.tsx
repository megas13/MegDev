"use client"

import { T } from "@/components/i18n/text"
import { motion } from "framer-motion"
import Link from "@/components/i18n/link"
import { ArrowUpRight, Calendar } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { blogPosts } from "@/constants"
import styles from "./marketing-sections.module.css"

export function BlogSection() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <SectionHeading align="left" title="Düşünüyoruz. Paylaşıyoruz." subtitle="Yazılım, ürün geliştirme ve dijital dönüşüm hakkında kısa, uygulanabilir notlar." />
        <div className={styles.articles}>
          {blogPosts.map((post, index) => (
            <motion.article key={post.id} className={styles.article} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: index * .08 }}>
              <div className={styles.articleTop}><span><T>{String(index + 1).padStart(2, "0")}</T></span><ArrowUpRight size={20} /></div>
              <div className={styles.articleMeta}><span><T>{post.category}</T></span><time><Calendar size={11} /><T>{post.date}</T></time></div>
              <h3><T>{post.title}</T></h3><p><T>{post.excerpt}</T></p><div className={styles.articleAuthor}><T>{post.author}</T></div>
            </motion.article>
          ))}
        </div>
        <Link href="/blog" className={styles.pillLink}><T>{"Tüm yazıları gör "}</T><ArrowUpRight size={16} /></Link>
      </div>
    </section>
  )
}
