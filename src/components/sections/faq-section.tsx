"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { faqs } from "@/constants"

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Sık Sorulan Sorular"
          subtitle="Projeler ve çalışma sürecimiz hakkında en çok merak edilen başlıklar."
        />

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Sorularınızı arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[8px] border border-foreground/10 bg-card py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-primary/70"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((faq) => (
            <motion.div
              key={faq.id}
              layout
              className="overflow-hidden border border-foreground/10 bg-card"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-card-hover"
              >
                <span className="font-bold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
