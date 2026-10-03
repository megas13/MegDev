"use client"

import { T } from "@/components/i18n/text"
import { motion } from "framer-motion"
import Link from "@/components/i18n/link"
import Image from "next/image"
import { ArrowRight, Cpu, Layers3, Play, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/constants"

const sprintItems = [
  ["Analiz", "Ürün hedefleri ve kapsam netleşti", "100%"],
  ["Tasarım", "Arayüz prototipi test edildi", "86%"],
  ["Geliştirme", "MVP modülleri yayına hazırlanıyor", "64%"],
]

const capabilities = [
  { label: "AI", icon: Cpu },
  { label: "SaaS", icon: Layers3 },
  { label: "Güvenli", icon: ShieldCheck },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-40">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 xl:gap-16 items-end">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <T>{"Fikirden çalışan ürüne"}</T></motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.93] mb-7"
            >
              <T>{"Meg Dev ile dijital ürününüzü daha keskin tasarlayın."}</T></motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              <T>{siteConfig.description}</T>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto text-base">
                  <T>{"Teklif Al"}</T><ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  <Play className="w-5 h-5" />
                  <T>{"İşleri İncele"}</T></Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 grid max-w-2xl grid-cols-3 border-y border-foreground/10"
            >
              <div className="py-5 pr-4">
                <p className="text-2xl font-black text-primary"><T>{"150+"}</T></p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground"><T>{"teslim"}</T></p>
              </div>
              <div className="border-x border-foreground/10 px-4 py-5">
                <p className="text-2xl font-black text-primary"><T>{"50+"}</T></p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground"><T>{"müşteri"}</T></p>
              </div>
              <div className="py-5 pl-4">
                <p className="text-2xl font-black text-primary"><T>{"%98"}</T></p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground"><T>{"memnuniyet"}</T></p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="sharp-panel noise-panel relative overflow-hidden rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground"><T>{"launch board"}</T></p>
                  <p className="mt-1 text-lg font-bold"><T>{"Meg Dev sprint görünümü"}</T></p>
                </div>
                <Image src="/megdevicon.png" alt="Meg Dev" width={56} height={56} className="h-14 w-14 object-contain rounded-full" />
              </div>

              <div className="grid gap-4 py-5">
                {sprintItems.map(([title, text, value]) => (
                  <div key={title} className="border border-foreground/10 bg-background/55 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold"><T>{title}</T></p>
                        <p className="mt-1 text-sm text-muted-foreground"><T>{text}</T></p>
                      </div>
                      <span className="text-sm font-black text-primary"><T>{value}</T></span>
                    </div>
                    <div className="mt-4 h-2 bg-foreground/10">
                      <div className="h-full bg-primary" style={{ width: value }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {capabilities.map(({ icon: Icon, label }) => (
                  <div key={label} className="border border-foreground/10 bg-foreground/[0.04] p-4 text-center">
                    <Icon className="mx-auto mb-3 h-5 w-5 text-accent" />
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground"><T>{label}</T></p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between bg-primary p-4 text-background">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em]"><T>{"sonraki adım"}</T></p>
                  <p className="font-black"><T>{"15 dakikalık keşif görüşmesi"}</T></p>
                </div>
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
