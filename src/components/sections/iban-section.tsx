"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useState } from "react"
import { Copy, Check, Building2, CreditCard, ArrowUpRight, Zap, Lock } from "lucide-react"
import Link from "@/components/i18n/link"
import Image from "next/image"
import { motion } from "motion/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import styles from "./public-experience.module.css"

const IBAN = "TR39 0001 5001 5800 7317 6191 97"
const bankName = "VakıfBank"

export function IBANSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(IBAN)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = IBAN
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}><T>{"Ödeme seçenekleri"}</T></p>
          <h2><T>{"Size uygun yöntem."}</T></h2>
          <p><T>{"Size en uygun yöntemi seçerek işlemlerinizi hızlıca tamamlayabilirsiniz."}</T></p>
        </div>
        <Tabs defaultValue="card" className={styles.paymentTabs}>
          <TabsList className={styles.paymentTabList}>
            <TabsTrigger value="card" className={styles.paymentTab}><CreditCard className="w-4 h-4" /><T>{"Kart ile Ödeme"}</T></TabsTrigger>
            <TabsTrigger value="transfer" className={styles.paymentTab}><Building2 className="w-4 h-4" /><T>{"Havale / EFT"}</T></TabsTrigger>
          </TabsList>
          <TabsContent value="card">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={styles.paymentCard}>
              <CreditCard className={styles.paymentIcon} />
              <h3><T>{"Kredi Kartı ile Ödeme"}</T></h3>
              <p className={styles.paymentDescription}><T>{"Tüm banka ve kredi kartlarına 12 aya varan taksit seçenekleri. 3D Secure ve SSL şifreleme ile %100 güvenli altyapı."}</T></p>
              <div className={styles.assurances}><span><Lock /><T>{"3D Secure"}</T></span><span><Zap /><T>{"Hızlı İşlem"}</T></span></div>
              <Link href="/contact" className={`${styles.pill} ${styles.primary}`}><T>{"Ödeme Bağlantısı Alın"}</T><ArrowUpRight /></Link>
              <div className={styles.paymentLogos}>
                <Image src="/images/visa.svg" alt="Visa" width={74} height={24} />
                <Image src="/images/mastercard.svg" alt="Mastercard" width={50} height={24} />
                <Image src="/images/paypal.svg" alt="PayPal" width={84} height={24} />
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="transfer">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={styles.paymentCard}>
              <Building2 className={styles.paymentIcon} />
              <p className={styles.eyebrow}><T>{"Banka Transfer Bilgileri"}</T></p>
              <h3><T>{bankName}</T></h3>
              <p className={styles.paymentDescription}><T>{"Meg Yazılım ve Teknoloji Ltd. Şti."}</T></p>
              <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground"><span><T>{"IBAN Numarası"}</T></span><span aria-live="polite"><T>{copied ? "Kopyalandı!" : ""}</T></span></div>
              <div className={styles.iban}><code><T>{IBAN}</T></code><LocalizedElement as="button" onClick={handleCopy} title="Kopyala" aria-label="IBAN numarasını kopyala">{copied ? <Check /> : <Copy />}</LocalizedElement></div>
              <p className={styles.paymentNote}><T>{"Lütfen ödeme açıklama kısmına "}</T><strong className="text-foreground"><T>{"Proje Adınızı"}</T></strong> <T>{" belirtmeyi unutmayın."}</T></p>
              <p className={styles.paymentNote}><T>{"Dekont iletildiğinde işlemler anında başlatılır."}</T></p>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
