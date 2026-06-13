"use client"

import { motion } from "framer-motion"
import { stats } from "@/constants"

export function StatsSection() {
  return (
    <section className="relative border-y border-foreground/10 py-16 lg:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-background p-6 sm:p-8"
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-[0.18em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
