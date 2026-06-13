"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { siteConfig } from "@/constants"

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=Merhaba%20Meg%20Dev%2C%20projeleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </motion.a>
  )
}
