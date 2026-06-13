"use client"

import { motion } from "framer-motion"
import { Brain, Code, Globe, ShoppingCart, Smartphone, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { services } from "@/constants"

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-7 h-7" />,
  ShoppingCart: <ShoppingCart className="w-7 h-7" />,
  Users: <Users className="w-7 h-7" />,
  Smartphone: <Smartphone className="w-7 h-7" />,
  Brain: <Brain className="w-7 h-7" />,
  Code: <Code className="w-7 h-7" />,
}

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Hizmetlerimiz"
          subtitle="İhtiyaca göre tasarlanan, ölçülebilir ve sürdürülebilir yazılım çözümleri."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="group relative h-full overflow-hidden rounded-none border-0 bg-card p-7">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.gradient}`} />
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={`flex h-12 w-12 items-center justify-center bg-gradient-to-br ${service.gradient} text-background transition-transform duration-300 group-hover:scale-105`}>
                    {iconMap[service.icon]}
                  </div>
                </div>
                <h3 className="text-xl font-black mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
