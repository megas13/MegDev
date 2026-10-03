"use client"

import { T } from "@/components/i18n/text"
import Link from "@/components/i18n/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { GlassCube } from "./glass-cube"
import styles from "./megdev-landing.module.css"

export function MegdevLanding() {
  return (
    <section className={styles.hero} id="home" aria-labelledby="landing-title">
      <div className={styles.shell}>
        <div className={styles.heroGrid}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}><span className={styles.dot} /><T>{"DİJİTAL ÜRÜN STÜDYOSU"}</T></p>
            <h1 id="landing-title"><T>{"Fikirleriniz için"}</T><br /><span><T>{"yazılım geliştiriyoruz."}</T></span></h1>
            <p className={styles.description}><T>{"Tasarım, yazılım mühendisliği ve yapay zekâyı bir araya getirerek işinize uyum sağlayan dijital ürünler üretiyoruz."}</T></p>
            <div className={styles.actions}><Link href="/contact" className={styles.primary}><T>{"Projenizi konuşalım"}</T><ArrowUpRight size={18} /></Link><Link href="#services" className={styles.secondary}><T>{"Hizmetleri keşfedin"}</T><ArrowDown size={16} /></Link></div>
          </div>
          <div className={styles.visual}>
            <div className={styles.visualTop} aria-hidden="true"><span>MEGDEV / CREATIVE ENGINEERING</span><span>01</span></div>
            <div className={styles.glassStage}><GlassCube /></div>
            <div className={styles.visualBottom}><span><T>{"Fikirden ürüne."}</T></span><span><T>{"Döndürmek için sürükleyin"}</T><ArrowUpRight size={13} /></span></div>
          </div>
        </div>
        <div className={styles.strip}><span className={styles.stripLabel}><T>{"STRATEJİDEN YAYINA"}</T></span><div><span><T>{"Web & Platform"}</T></span><span><T>{"Mobil Uygulama"}</T></span><span><T>{"Yapay Zekâ"}</T></span><span><T>{"Özel Yazılım"}</T></span></div><ArrowDown size={16} aria-hidden="true" /></div>
      </div>
    </section>
  )
}
