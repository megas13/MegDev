"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/ui/section-heading"
import { portfolioItems } from "@/constants"

const categories = ["Tümü", ...Array.from(new Set(portfolioItems.map((item) => item.category)))]

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü")

  const filtered =
    activeCategory === "Tümü"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Portföyümüz"
          subtitle="Farklı sektörlerde iş hedefi net, teknik altyapısı sağlam ve kullanımı kolay dijital ürünler."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary text-background"
                  : "border border-foreground/10 bg-foreground/[0.04] text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-px border border-foreground/10 bg-foreground/10 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group bg-card p-6 sm:p-8"
              >
                <div className="mb-10 flex items-start justify-between gap-6">
                  <div>
                    <Badge variant="primary">{item.category}</Badge>
                    <h3 className="mt-4 text-2xl font-black transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 transition-colors group-hover:border-primary group-hover:text-primary">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="default">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
