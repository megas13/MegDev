"use client"

import { useState } from "react"
import { ArrowUpRight, Brain, Code2, Globe2, Plus, Smartphone, Minus } from "lucide-react"
import { T } from "@/components/i18n/text"
import Link from "@/components/i18n/link"
import { MegdevLanding } from "@/components/sections/megdev-landing"
import { CalculatorSection } from "@/components/sections/calculator-section"
import { services, processes } from "@/constants"
import styles from "./home.module.css"

const featuredServices = [
  { service: services[0], icon: Globe2 },
  { service: services[3], icon: Smartphone },
  { service: services[4], icon: Brain },
  { service: services[5], icon: Code2 },
]

export default function Home() {
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  return (
    <div className={styles.home}>
      <MegdevLanding />
      <section id="services" className={styles.section} aria-labelledby="home-services-title">
        <div className={styles.shell}>
          <div className={styles.sectionTop}>
            <div><p className={styles.label}><T>{"01 / UZMANLIK"}</T></p><h2 id="home-services-title"><T>{"İşinize uygun."}</T><br /><span><T>{"Geleceğe hazır."}</T></span></h2></div>
            <div className={styles.sectionSummary}><p><T>{"İyi bir dijital ürün, doğru sorularla başlar. İhtiyacınızı anlayıp tasarımdan yayına kadar yanınızda çalışıyoruz."}</T></p><Link href="/services" className={styles.textLink}><T>{"Tüm hizmetler"}</T><ArrowUpRight size={18} /></Link></div>
          </div>
          <div className={styles.serviceGrid}>
            {featuredServices.map(({ service, icon: Icon }, index) => (
              <Link href={"/services/" + service.slug} key={service.id} className={styles.serviceCard}>
                <div className={styles.cardTop}><Icon size={25} strokeWidth={1.5} /><span>0{index + 1}</span></div>
                <h3><T>{service.title}</T></h3><p><T>{service.description}</T></p>
                <span className={styles.cardLink}><T>{"Hizmeti incele"}</T><ArrowUpRight size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="home-work-title">
        <div className={styles.shell}>
          <div className={styles.workPanel}>
            <div className={styles.workVisual} aria-hidden="true"><div className={styles.orbit} /><span className={styles.workWord}>meg<br /><span>dev.</span></span><span className={styles.visualCaption}>DESIGN · DEVELOP · DELIVER</span></div>
            <div className={styles.workCopy}><p className={styles.label}><T>{"02 / ÜRETTİKLERİMİZ"}</T></p><h2 id="home-work-title"><T>{"Fikirler, yaşayan ürünlere dönüşür."}</T></h2><p><T>{"Farklı sektörlerde iş hedefi net, teknik altyapısı sağlam ve kullanımı kolay dijital ürünler."}</T></p><Link href="/portfolio" className={styles.primary}><T>{"Projeleri keşfedin"}</T><ArrowUpRight size={18} /></Link></div>
          </div>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="home-process-title">
        <div className={styles.shell}>
          <div className={styles.sectionTop}><div><p className={styles.label}><T>{"03 / BİRLİKTE ÇALIŞMAK"}</T></p><h2 id="home-process-title"><T>{"Net bir süreç."}</T><br /><span><T>{"Güçlü bir sonuç."}</T></span></h2></div><Link href="/processes" className={styles.textLink}><T>{"Süreci keşfedin"}</T><ArrowUpRight size={18} /></Link></div>
          <div className={styles.processGrid}>
            {processes.map((step, index) => <article key={step.id} className={styles.processCard}><span className={styles.stepNumber}>0{index + 1}</span><h3><T>{step.title}</T></h3><p><T>{step.description}</T></p></article>)}
          </div>
          <div className={styles.estimate}>
            <div><p className={styles.label}><T>{"PROJENİZİ PLANLAYIN"}</T></p><h3><T>{"Bir fikriniz var. Nereden başlamalı?"}</T></h3><p><T>{"Kapsamınızı seçin, tahmini bütçe ve teslim süresini birlikte netleştirelim."}</T></p></div>
            <button type="button" className={styles.secondary} onClick={() => setCalculatorOpen(!calculatorOpen)} aria-expanded={calculatorOpen} aria-controls="home-project-calculator"><T>{calculatorOpen ? "Hesaplayıcıyı kapat" : "Proje bütçesini hesapla"}</T>{calculatorOpen ? <Minus size={18} /> : <Plus size={18} />}</button>
          </div>
        </div>
        <div id="home-project-calculator" hidden={!calculatorOpen}>{calculatorOpen && <CalculatorSection />}</div>
      </section>
    </div>
  )
}
