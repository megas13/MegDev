"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="noise-panel border-y border-foreground/10 py-14 text-center"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Başlangıç noktası
          </p>
          <h2 className="mx-auto max-w-4xl text-3xl md:text-5xl font-black leading-tight mb-6">
            Projenizi konuşalım, ilk ürün yol haritasını birlikte çıkaralım.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Kısa bir keşif görüşmesiyle kapsamı, öncelikleri ve en doğru teslim planını netleştirelim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-base">
                Hemen Teklif Alın
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="text-base">
                Hizmetleri İnceleyin
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
