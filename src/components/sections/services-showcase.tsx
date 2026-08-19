"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Brain, Check, Code2, Globe2, Layers3, MoveRight, ShoppingBag, Smartphone, Sparkles } from "lucide-react"
import { services } from "@/constants"

const icons = { Globe: Globe2, ShoppingCart: ShoppingBag, Users: Layers3, Smartphone, Brain, Code: Code2 }

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const service = services[activeIndex]
  const ActiveIcon = icons[service.icon as keyof typeof icons]

  return <section id="services" className="relative overflow-hidden border-t border-white/10 py-28 lg:py-36">
    <div className="pointer-events-none absolute inset-0">
      <motion.div animate={{ x: ["-10%", "10%", "-10%"], y: ["0%", "15%", "0%"] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} className="absolute left-1/4 top-0 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end">
        <div><span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[.25em] text-primary"><Sparkles className="h-4 w-4" /> Yetkinlik evreni</span><h2 className="mt-5 text-4xl font-black uppercase leading-[.95] tracking-tight md:text-6xl">Hangi alanlarda<br/><span className="text-primary">çözüm üretiyoruz?</span></h2></div>
        <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">Bir kart kataloğu değil, birlikte çalışan ürün yetenekleri. Bir alan seçin; yaklaşımımızı, çıktıları ve detaylı çalışma modelini keşfedin.</p>
      </motion.div>

      <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#151510]/80 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl lg:grid-cols-[320px_1fr]">
        <nav aria-label="Hizmet seçimi" className="flex gap-2 overflow-x-auto border-b border-white/10 p-3 lg:block lg:space-y-2 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-5">
          {services.map((item, index) => { const Icon = icons[item.icon as keyof typeof icons]; const selected = index === activeIndex; return <button key={item.slug} onClick={() => setActiveIndex(index)} className={`relative min-w-[210px] overflow-hidden rounded-2xl p-4 text-left transition-colors lg:min-w-0 lg:w-full ${selected ? "text-[#10100d]" : "text-[#b8afa1] hover:bg-white/5 hover:text-white"}`}>
            {selected && <motion.div layoutId="service-active" className="absolute inset-0 bg-primary" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
            <span className="relative flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? "bg-black/10" : "bg-white/5"}`}><Icon className="h-5 w-5" /></span><span><span className="block font-mono text-[10px] opacity-60">0{index + 1}</span><span className="block text-sm font-black">{item.title}</span></span></span>
          </button> })}
        </nav>

        <div className="relative min-h-[570px] overflow-hidden p-6 sm:p-10 lg:p-14">
          <div className={`absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br ${service.gradient} opacity-15 blur-[75px]`} />
          <AnimatePresence mode="wait">
            <motion.article key={service.slug} initial={{ opacity: 0, x: 35, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -25, filter: "blur(8px)" }} transition={{ duration: .38 }} className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4"><div className={`grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${service.gradient} text-[#10100d] shadow-2xl`}><ActiveIcon className="h-9 w-9" /></div><span className="font-mono text-6xl font-black text-white/[.035] sm:text-8xl">0{activeIndex + 1}</span></div>
              <div className="mt-10 max-w-3xl"><p className="font-mono text-xs uppercase tracking-[.22em] text-primary">Seçili yetkinlik</p><h3 className="mt-3 text-3xl font-black sm:text-5xl">{service.title}</h3><p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{service.description}</p></div>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">{service.features.map((feature, index) => <motion.div key={feature} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 + index * .06 }} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] p-4 text-sm"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10"><Check className="h-3.5 w-3.5 text-primary" /></span>{feature}</motion.div>)}</div>
              <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-md text-sm leading-6 text-muted-foreground"><strong className="text-white">Beklenen çıktı:</strong> {service.outcome}</p><Link href={`/services/${service.slug}`} className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#10100d] transition hover:bg-primary">Detayları incele <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
      <Link href="/services" className="mx-auto mt-8 flex w-fit items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary">Tüm hizmetleri tek sayfada gör <MoveRight className="h-4 w-4" /></Link>
    </div>
  </section>
}
