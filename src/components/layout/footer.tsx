"use client"

import { basePath } from "@/lib/i18n/config"


import { T, LocalizedElement } from "@/components/i18n/text"
import { usePathname } from "next/navigation"
import styles from "./footer.module.css"
import Link from "@/components/i18n/link"
import { siteConfig, navigation, services } from "@/constants"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"

function LegacyFooter() {
  const socialLinks = [
    {
      url: siteConfig.linkedin,
      name: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    {
      url: siteConfig.twitter,
      name: "X (Twitter)",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      url: siteConfig.instagram,
      name: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      url: siteConfig.facebook,
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    }
  ]

  return (
    <footer className="relative border-t border-foreground/10 bg-card/80">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="text-xl font-black tracking-tight text-gradient">
                <T>{"Meg Dev"}</T></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              <T>{siteConfig.description}</T>
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <LocalizedElement as="a"
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className="group relative flex h-10 w-10 items-center justify-center border border-foreground/10 bg-foreground/[0.02] text-muted-foreground transition-all duration-300 hover:border-primary hover:text-background hover:scale-105 overflow-hidden"
                >
                  {/* Slide Up Background */}
                  <span className="absolute inset-0 bg-primary translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                  
                  {/* Spinning Icon */}
                  <span className="relative z-10 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <T>{social.icon}</T>
                  </span>
                </LocalizedElement>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"><T>{"Hızlı Linkler"}</T></h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                    <T>{item.name}</T>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"><T>{"Hizmetler"}</T></h3>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    <T>{service.title}</T>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"><T>{"İletişim"}</T></h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><T>{siteConfig.phone}</T></span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><T>{siteConfig.email}</T></span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span><T>{siteConfig.address}</T></span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span><T>{siteConfig.workingHours}</T></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foreground/10 pt-8">
          <p className="text-sm text-muted-foreground">
            <T>{"©"}</T><T>{new Date().getFullYear()}</T> <T>{siteConfig.name}</T><T>{". Tüm hakları saklıdır."}</T></p>
          <div className="flex gap-6">
            <Link href="/kvkk" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              <T>{"Gizlilik Politikası"}</T></Link>
            <Link href="/kosullar" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              <T>{"Kullanım Koşulları"}</T></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Footer() {
  const pathname = basePath(usePathname())
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <LegacyFooter />
  const socials = [
    { name: "LinkedIn", href: siteConfig.linkedin },
    { name: "Instagram", href: siteConfig.instagram },
    { name: "X", href: siteConfig.twitter },
    { name: "Facebook", href: siteConfig.facebook },
  ]
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.invitation}>
          <div className={styles.eyebrow}><span className={styles.statusDot} /> <T>{" MEGDEV / BİR SONRAKİ ADIM"}</T></div>
          <Link href="/contact" className={styles.projectLink}>
            <h2><T>{"Bir fikriniz mi var?"}</T><br /><span><T>{"Birlikte üretelim."}</T></span></h2>
            <span className={styles.projectArrow}><ArrowUpRight strokeWidth={1} /></span>
          </Link>
          <div className={styles.invitationBottom}><p><T>{"İyi bir yazılım, iyi bir konuşmayla başlar."}</T></p><a href={`mailto:${siteConfig.email}`}><T>{siteConfig.email}</T><ArrowUpRight size={15} /></a></div>
        </div>
        <div className={styles.columns}>
          <div className={styles.intro}>
            <Link href="/" className={styles.wordmark} aria-label="MegDev ana sayfa"><T>{"MegDev"}</T><span><T>{"."}</T></span></Link>
            <p><T>{siteConfig.description}</T></p>
            <LocalizedElement as="div" className={styles.socials} aria-label="Sosyal medya bağlantıları">
              {socials.map((social) => <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"><T>{social.name}</T><ArrowUpRight size={12} /></a>)}
            </LocalizedElement>
          </div>
          <div className={styles.column}>
            <h3><T>{"KEŞFEDİN"}</T></h3>
            <ul>{navigation.map((item) => <li key={item.href}><Link href={item.href}><T>{item.name}</T></Link></li>)}</ul>
          </div>
          <div className={styles.column}>
            <h3><T>{"UZMANLIK"}</T></h3>
            <ul>{services.slice(0, 5).map((service) => <li key={service.id}><Link href={`/services/${service.slug}`}><T>{service.title}</T></Link></li>)}</ul>
          </div>
          <div className={styles.column}>
            <h3><T>{"BİZE ULAŞIN"}</T></h3>
            <ul className={styles.contactList}>
              <li><a href={`tel:${siteConfig.phone}`}><Phone size={14} /><T>{siteConfig.phone}</T></a></li>
              <li><a href={`mailto:${siteConfig.email}`}><Mail size={14} /><T>{siteConfig.email}</T></a></li>
              <li><span><MapPin size={14} /><T>{siteConfig.address}</T></span></li>
              <li><span><Clock size={14} /><T>{siteConfig.workingHours}</T></span></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p><T>{"© "}</T><T>{new Date().getFullYear()}</T> <T>{siteConfig.name}</T><T>{". Tüm hakları saklıdır."}</T></p>
          <div><Link href="/kvkk"><T>{"Gizlilik Politikası"}</T></Link><Link href="/kosullar"><T>{"Kullanım Koşulları"}</T></Link></div>
          <span className={styles.signature}><T>{"FİKİRDEN ÜRÜNE."}</T></span>
        </div>
      </div>
    </footer>
  )
}
