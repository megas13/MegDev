"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useState, type FormEvent, useRef } from "react"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import { Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "./public-experience.module.css"
import { siteConfig } from "@/constants"

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
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.current) return
    setLoading(true)
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "destek@megdev.info",
          subject: `Yeni İletişim: ${formData.subject}`,
          html: `<h2>Yeni İletişim Mesajı</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Ad</td><td style="padding:8px 12px">${formData.name}</td></tr>
<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">E-posta</td><td style="padding:8px 12px">${formData.email}</td></tr>
<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Telefon</td><td style="padding:8px 12px">${formData.phone || "-"}</td></tr>
<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Konu</td><td style="padding:8px 12px">${formData.subject}</td></tr>
<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Mesaj</td><td style="padding:8px 12px">${formData.message}</td></tr>
</table>`,
        }),
      })
      await emailjs.sendForm(
        "service_ckoiehh",
        "template_hlabb18",
        form.current,
        "D6k1lT8mhR4rjyNoD"
      )
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setSubmitted(true)
    } catch (err) {
      console.error("Gönderme hatası:", err)
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
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contactGrid}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.contactAside}>
            <p className={styles.eyebrow}><T>{"Bir sonraki adım / İletişim"}</T></p>
            <h3><T>{"İyi bir proje, iyi bir konuşmayla başlar."}</T></h3>
            <p><T>{"Projenizi anlatın; teknik kapsam, süre ve bütçe için size net bir dönüş yapalım."}</T></p>
            <div>
              {contactInfo.map((info) => {
                const content = <><T>{info.icon}</T><div><span><T>{info.label}</T></span><strong><T>{info.value}</T></strong></div></>
                return (
                  <div key={info.label} className={`${styles.contactRow} ${info.label === "E-posta" ? styles.emailRow : ""}`}>
                    {info.href ? <a href={info.href} target="_blank" rel="noopener noreferrer" className={styles.contactItem}><T>{content}</T></a> : <div className={styles.contactItem}><T>{content}</T></div>}
                    {info.label === "E-posta" && (
                      <LocalizedElement as="button" type="button" className={styles.copy} aria-label="E-posta adresini kopyala" onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(siteConfig.email)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        } catch {}
                      }}><T>{copied ? "Kopyalandı" : "Kopyala"}</T></LocalizedElement>
                    )}
                  </div>
                )
              })}
            </div>
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`${styles.pill} ${styles.whatsapp}`}><MessageCircle /><T>{"WhatsApp'tan Yazın"}</T><ArrowUpRight /></a>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .12 }} className={styles.formPanel}>
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.success}>
                <Send /><h3><T>{"Mesajınız alındı."}</T></h3><p><T>{"En kısa sürede size dönüş yapacağız."}</T></p>
              </motion.div>
            ) : (
              <><h3><T>{"Projenizden bahsedin."}</T></h3><p><T>{"Birkaç detay paylaşın, birlikte ilk adımı atalım."}</T></p>
              <form ref={form} onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}><label htmlFor="contact-name"><T>{"Adınız Soyadınız *"}</T></label><LocalizedElement as="input" id="contact-name" type="text" name="name" required autoComplete="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.input} placeholder="Adınız Soyadınız" /></div>
                  <div className={styles.field}><label htmlFor="contact-email"><T>{"E-posta Adresiniz *"}</T></label><LocalizedElement as="input" id="contact-email" type="email" name="email" required autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={styles.input} placeholder="ornek@email.com" /></div>
                </div>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}><label htmlFor="contact-phone"><T>{"Telefon"}</T></label><LocalizedElement as="input" id="contact-phone" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={styles.input} placeholder="0537 983 04 14" /></div>
                  <div className={styles.field}><label htmlFor="contact-subject"><T>{"Konu *"}</T></label><LocalizedElement as="input" id="contact-subject" type="text" name="subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={styles.input} placeholder="Proje başlığı" /></div>
                </div>
                <div className={styles.field}><label htmlFor="contact-message"><T>{"Mesajınız *"}</T></label><LocalizedElement as="textarea" id="contact-message" name="message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={styles.input} placeholder="Projeniz hakkında kısa bilgi verin..." /></div>
                <Button type="submit" loading={loading} className={styles.submit}>{loading ? <><Loader2 className="w-4 h-4 animate-spin" /><T>{"Gönderiliyor..."}</T></> : <><T>{"Mesajı Gönder"}</T><ArrowUpRight className="w-4 h-4" /></>}</Button>
              </form></>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
