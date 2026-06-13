"use client"

import { motion } from "framer-motion"
import { Clock, Heart, Users, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { whyUs } from "@/constants"

const whyUsIcons: Record<string, React.ReactNode> = {
  Users: <Users className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
}

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Neden Meg Dev?"
          subtitle="Sadece ekran tasarlamıyoruz; fikri, mimariyi, kullanıcı deneyimini ve yayın sürecini birlikte yönetiyoruz."
        />

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sharp-panel noise-panel p-7 sm:p-8"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-primary">Hikayemiz</p>
            <h3 className="text-3xl font-black mb-5">Küçük ekip hızını, kurumsal ürün disipliniyle birleştiriyoruz.</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Meg Dev, işletmelerin dijital ürünlerini daha hızlı ve daha kontrollü geliştirmesi için kuruldu. Her projede önce problemi sadeleştiriyor, sonra doğru teknoloji ve tasarım kararlarıyla ürünü yayına taşıyoruz.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Bugün farklı sektörlerde web, mobil, CRM, e-ticaret ve yapay zeka projeleri geliştiriyoruz. Odağımız; gösterişli ama kırılgan işler değil, gerçek kullanıcı akışlarında çalışan ürünler.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
              <div className="bg-background/70 p-4">
                <div className="text-xl font-black text-primary">Misyon</div>
                <p className="text-xs text-muted-foreground mt-2">İşletmelere sürdürülebilir ve ölçülebilir yazılım çözümleri sunmak.</p>
              </div>
              <div className="bg-background/70 p-4">
                <div className="text-xl font-black text-primary">Vizyon</div>
                <p className="text-xs text-muted-foreground mt-2">Türkiye kaynaklı güçlü dijital ürünlerin teknoloji ortağı olmak.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid sm:grid-cols-2 gap-px border border-foreground/10 bg-foreground/10"
          >
            {whyUs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full rounded-none border-0 bg-card p-7">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center text-background mb-6">
                    {whyUsIcons[item.icon]}
                  </div>
                  <h4 className="font-black text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
