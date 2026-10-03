"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useEffect, useState } from "react"
import Link from "@/components/i18n/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { navigation } from "@/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import styles from "./header.module.css"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { basePath } from "@/lib/i18n/config"

export function Header() {
  const pathname = basePath(usePathname())
  return pathname === "/admin" || pathname.startsWith("/admin/") ? <LegacyHeader /> : <PublicHeader key={pathname} pathname={pathname} />
}

function PublicHeader({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <LocalizedElement as="nav" className={styles.nav} aria-label="Ana menü">
        <Link href="/" className={styles.brand} aria-label="MegDev ana sayfa">
          <span className={styles.wordmark}><T>{"Meg Dev"}</T></span>
        </Link>
        <div className={styles.links}>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link} aria-current={isActive(item.href) ? "page" : undefined}><T>{item.name}</T></Link>
          ))}
        </div>
        <Link href="/contact" className={styles.contact}><T>{"Birlikte üretelim "}</T><ArrowUpRight size={15} /></Link>
        <LanguageSwitcher />
        <LocalizedElement as="button" type="button" onClick={() => setIsOpen(!isOpen)} className={styles.menuToggle} aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={isOpen} aria-controls="public-mobile-menu">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </LocalizedElement>
      </LocalizedElement>
      <AnimatePresence>
        {isOpen && (
          <motion.div id="public-mobile-menu" className={styles.mobileMenu} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
            <div className={styles.mobileInner}>
              <span className={styles.menuLabel}><T>{"MEGDEV / KEŞFEDİN"}</T></span>
              {navigation.map((item, index) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} aria-current={isActive(item.href) ? "page" : undefined} className={styles.mobileLink}>
                  <span className={styles.menuIndex}><T>{String(index + 1).padStart(2, "0")}</T></span><T>{item.name}</T><ArrowUpRight size={20} />
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsOpen(false)} className={styles.mobileContact}><T>{"Projenizi konuşalım "}</T><ArrowUpRight size={17} /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function LegacyHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = basePath(usePathname())
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-nav/95 backdrop-blur-xl border-b border-foreground/10" : "bg-transparent")}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group" aria-label="MegDev ana sayfa"><span className="text-xl font-black tracking-tight text-gradient"><T>{"MegDev"}</T></span></Link>
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2 py-2 backdrop-blur-xl">
            {navigation.map((item) => <Link key={item.href} href={item.href} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative group", pathname === item.href ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground")}><T>{item.name}</T></Link>)}
          </div>
          <div className="hidden lg:flex items-center gap-3"><Link href="/contact"><Button size="sm"><T>{"Teklif Al"}</T><ArrowUpRight className="h-4 w-4" /></Button></Link></div>
          <LanguageSwitcher />
          <LocalizedElement as="button" onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-full border border-foreground/10 bg-foreground/5 hover:bg-card-hover transition-colors" aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}>{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</LocalizedElement>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-foreground/10 bg-background/95 backdrop-blur-xl overflow-hidden">
          <div className="px-4 py-4 space-y-1">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={cn("block px-4 py-3 rounded-[8px] text-sm font-medium transition-colors", pathname === item.href ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground hover:bg-card-hover")}><T>{item.name}</T></Link>)}<div className="pt-2"><Link href="/contact"><Button className="w-full"><T>{"Teklif Al"}</T></Button></Link></div></div>
        </motion.div>}
      </AnimatePresence>
    </header>
  )
}
