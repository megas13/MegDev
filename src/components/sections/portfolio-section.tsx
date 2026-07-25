"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/ui/section-heading"
type PortfolioItem = {
  id: string
  title: string
  description: string
  category: string | null
  technologies: string[]
  project_url: string | null
  image_url: string | null
}

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio", {
          cache: "no-store",
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Portföy yüklenemedi")
        const data = await response.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadPortfolio()
    return () => controller.abort()
  }, [])

  const categories = [
    "Tümü",
    ...Array.from(
      new Set(items.map((item) => item.category).filter((category): category is string => Boolean(category)))
    ),
  ]

  const filtered =
    activeCategory === "Tümü"
      ? items
      : items.filter((item) => item.category === activeCategory)

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

        {loading && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Portföy yükleniyor…
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Henüz portföy projesi eklenmemiş.
          </p>
        )}

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
                {item.image_url && (
                  <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl bg-foreground/[0.04]">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                )}
                <div className="mb-10 flex items-start justify-between gap-6">
                  <div>
                    {item.category && <Badge variant="primary">{item.category}</Badge>}
                    <h3 className="mt-4 text-2xl font-black transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                  </div>
                  {item.project_url ? (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.title} projesini aç`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 transition-colors hover:border-primary hover:text-primary"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 transition-colors group-hover:border-primary group-hover:text-primary">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(item.technologies || []).map((tech) => (
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
