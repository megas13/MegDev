"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { testimonials } from "@/constants"

export function TestimonialsSection() {
  return (
    <section className="relative border-y border-foreground/10 py-24 lg:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Müşteri Yorumları"
          subtitle="Birlikte ürün geliştirdiğimiz ekiplerden kısa geri bildirimler."
        />

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <Card className="h-full relative overflow-hidden">
                <Quote className="absolute top-4 right-4 w-9 h-9 text-primary/20" />
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-foreground/10 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center bg-primary text-sm font-black text-background">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
