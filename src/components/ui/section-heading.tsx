"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  align?: "left" | "center"
}

export function SectionHeading({ title, subtitle, className, align = "center" }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "max-w-3xl mb-14",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <div className={cn("mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="h-px w-10 bg-primary" />
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Meg Dev</span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
        <span>{title}</span>
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
