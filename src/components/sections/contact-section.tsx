"use client"

import { useState, type FormEvent, useRef } from "react"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import { Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { siteConfig } from "@/constants"

const inputClass =
  "w-full rounded-[8px] border border-foreground/10 bg-background/70 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/70 transition-colors"

export function ContactSection() {
  const form = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.current) return
    setLoading(true)
    try {
      await emailjs.sendForm(
        "service_ckoiehh",
        "template_rvpnugu",
        form.current,
        "D6k1lT8mhR4rjyNoD"
      )
      setSubmitted(true)
    } catch (err) {
      console.error("EmailJS error:", err)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, label: "Telefon", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
    { icon: <Mail className="w-5 h-5" />, label: "E-posta", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: <MapPin className="w-5 h-5" />, label: "Adres", value: siteConfig.address },
    { icon: <Clock className="w-5 h-5" />, label: "Çalışma Saatleri", value: siteConfig.workingHours },
  ]

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="İletişime Geçin"
          subtitle="Projenizi anlatın; teknik kapsam, süre ve bütçe için size net bir dönüş yapalım."
        />

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, index) => {
              const content = (
                <>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-primary text-background">
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.label}</div>
                    <div className="font-semibold">{info.value}</div>
                  </div>
                </>
              )

              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {info.href ? (
                    <a href={info.href} className="flex items-start gap-4 border border-foreground/10 bg-card/80 p-4 transition-colors hover:border-primary/50">
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 border border-foreground/10 bg-card/80 p-4">
                      {content}
                    </div>
                  )}
                </motion.div>
              )
            })}

            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 p-4 font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp&apos;tan Yazın
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="p-6 sm:p-8">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-background">
                    <Send className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Mesajınız alındı.</h3>
                  <p className="text-muted-foreground">En kısa sürede size dönüş yapacağız.</p>
                </motion.div>
              ) : (
                <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Adınız Soyadınız *</label>
                      <input type="text" name="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Adınız Soyadınız" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">E-posta Adresiniz *</label>
                      <input type="email" name="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="ornek@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Telefon</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="0555 555 55 55" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Konu *</label>
                      <input type="text" name="subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass} placeholder="Proje başlığı" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mesajınız *</label>
                    <textarea required name="message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputClass} resize-none`} placeholder="Projeniz hakkında kısa bilgi verin..." />
                  </div>
                  <Button type="submit" loading={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        Mesajı Gönder
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
