"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/ui/section-heading"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/constants"

export function BlogSection() {
  return (
    <section className="relative border-y border-foreground/10 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Blog & Makaleler"
          subtitle="Yazılım, ürün geliştirme ve dijital dönüşüm hakkında kısa, uygulanabilir notlar."
        />

        <div className="grid md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10 mb-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card p-6"
            >
              <div className="mb-10 flex h-28 items-end justify-between border-b border-foreground/10 pb-5">
                <span className="text-5xl font-black text-primary/25">{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="primary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
              </div>
              <h3 className="font-black text-lg mb-3 transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {post.excerpt}
              </p>
              <div className="text-xs text-muted-foreground">{post.author}</div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline">
              Tüm Yazıları Gör
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
