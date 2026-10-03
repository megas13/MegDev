"use client"

import { T } from "@/components/i18n/text"
import { useLanguage } from "@/components/i18n/provider"
import { basePath } from "@/lib/i18n/config"
import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { siteConfig } from "@/constants"
import styles from "./whatsapp-button.module.css"

export function WhatsAppButton() {
  const pathname = basePath(usePathname())
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/")
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(t("Merhaba Meg Dev, projeleriniz hakkında bilgi almak istiyorum."))}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={reduceMotion ? undefined : { scale: isAdmin ? 1.1 : 1.04 }}
      className={isAdmin ? "fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow" : styles.widget}
      aria-label={t("WhatsApp üzerinden bize yazın")}
    >
      <MessageCircle className={isAdmin ? "w-7 h-7 text-white" : styles.icon} strokeWidth={1.7} />
      {!isAdmin && <span className={styles.tooltip}><T>{"Bir merhaba yeter."}</T></span>}
    </motion.a>
  )
}
