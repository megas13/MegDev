"use client"

import { T } from "@/components/i18n/text"
import { CreditCard, ShieldCheck, Truck, CheckCircle, ArrowUpRight, Zap, Lock, MousePointerClick, Rocket } from "lucide-react"
import Link from "@/components/i18n/link"
import { IBANSection } from "@/components/sections/iban-section"
import { PageIntro } from "@/components/ui/page-intro"
import { motion } from "motion/react"
import styles from "@/components/sections/public-experience.module.css"

const features = [
  {
    title: "Güvenli Ödeme",
    description: "Tüm ödemeler 3D Secure ile korunur. Kart bilgileriniz kaydedilmez.",
    icon: ShieldCheck,
    color: "text-primary"
  },
  {
    title: "Taksit Seçenekleri",
    description: "Kredi kartına taksit imkanı ile bütçenize uygun ödeme planı.",
    icon: CreditCard,
    color: "text-accent"
  },
  {
    title: "Hızlı Aktivasyon",
    description: "Ödeme onaylandıktan sonra projeniz hemen başlatılır.",
    icon: Truck,
    color: "text-secondary"
  },
  {
    title: "7/24 Destek",
    description: "Ödeme ile ilgili her konuda WhatsApp üzerinden destek alabilirsiniz.",
    icon: CheckCircle,
    color: "text-emerald-400"
  },
]

const steps = [
  { 
    number: "01", 
    title: "Proje Seçimi", 
    description: "Size uygun hizmet paketini birlikte belirleyelim.",
    icon: MousePointerClick
  },
  { 
    number: "02", 
    title: "Ödeme Yöntemi", 
    description: "Tercih ettiğiniz ödeme yöntemini seçin.",
    icon: CreditCard
  },
  { 
    number: "03", 
    title: "Güvenli Ödeme", 
    description: "3D Secure ile ödemenizi saniyeler içinde tamamlayın.",
    icon: Lock
  },
  { 
    number: "04", 
    title: "Hemen Başlayın", 
    description: "Ödeme onayından sonra projeniz için çalışmalar başlasın.",
    icon: Rocket
  },
]

export default function OdemePage() {
  return (
    <div>
      <PageIntro eyebrow="Ödeme" title="Bir adım daha yakın." description="Size uygun ödeme yöntemiyle projenizi başlatın. Sadelik, hız ve güvenlik bir arada." index="07" />
      <IBANSection />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.heading}><p className={styles.eyebrow}><T>{"Dört adımda / Projenize doğru"}</T></p><h2><T>{"Kesintisiz bir akış."}</T></h2><p><T>{"Basit, şeffaf ve %100 dijital ödeme süreciyle hemen tanışın."}</T></p></div>
          <div className={styles.paymentSteps}>
            {steps.map((step, index) => <motion.div key={step.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className={styles.paymentStep}><span><T>{step.number}</T></span><h3><T>{step.title}</T></h3><p><T>{step.description}</T></p></motion.div>)}
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.paymentSecurity}`}>
          <div className={styles.heading}><p className={styles.eyebrow}><T>{"Güvenlik standartları"}</T></p><h2><T>{"Her adımda"}</T><br /><T>{"güvenle."}</T></h2><p><T>{"Ödeme sürecinizin her aşamasında yanınızdayız."}</T></p></div>
          <div className={styles.paymentFeatures}>
            {features.map((feature) => { const Icon = feature.icon; return <div key={feature.title} className={styles.paymentFeature}><Icon /><h3><T>{feature.title}</T></h3><p><T>{feature.description}</T></p></div> })}
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.cta}`}>
          <div><p className={styles.eyebrow}><T>{"Bir sonraki adım"}</T></p><h2><T>{"Hayaliniz için"}</T><br /><T>{"başlayalım."}</T></h2><p><T>{"Ödemenizi tamamlayın, dijital dönüşüm yolculuğunuzu bugün başlatalım. Siz hayal edin, biz gerçekleştirelim."}</T></p></div>
          <div className={styles.ctaActions}><Link href="/contact" className={`${styles.pill} ${styles.primary}`}><T>{"İletişime Geçin"}</T><ArrowUpRight /></Link><Link href="/" className={styles.pill}><T>{"Ana Sayfaya Dön"}</T><ArrowUpRight /></Link></div>
        </div>
      </section>
      <div className={`${styles.container} ${styles.trustLine}`}>
        <span><Lock /><T>{"256-bit SSL şifreleme"}</T></span><span><ShieldCheck /><T>{"3D Secure Doğrulama"}</T></span><span><CheckCircle /><T>{"PCI-DSS Uyumlu"}</T></span><span><Zap /><T>{"Anında Onay"}</T></span>
      </div>
    </div>
  )
}
