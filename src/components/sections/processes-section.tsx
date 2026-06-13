"use client"

import { motion } from "framer-motion"
import { BugPlay, Code, Headset, Palette, Rocket, Search } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { processes } from "@/constants"

const processIcons: Record<string, React.ReactNode> = {
  Search: <Search className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  BugPlay: <BugPlay className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  Headset: <Headset className="w-6 h-6" />,
}

export function ProcessesSection() {
  return (
    <section id="processes" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Çalışma Sürecimiz"
          subtitle="Fikir, prototip, geliştirme ve yayın adımlarını görünür teslimatlar halinde yönetiyoruz."
        />

        <div className="grid gap-px border border-foreground/10 bg-foreground/10 md:grid-cols-2 lg:grid-cols-3">
          {processes.map((process, index) => (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group bg-card p-7"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-4xl font-black text-foreground/10">
                  {String(process.id).padStart(2, "0")}
                </span>
                <div className={`flex h-12 w-12 items-center justify-center bg-gradient-to-br ${process.color} text-background`}>
                  {processIcons[process.icon]}
                </div>
              </div>
              <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">
                {process.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {process.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
