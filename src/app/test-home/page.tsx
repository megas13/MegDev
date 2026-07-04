"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight, Asterisk, Brain, Braces, Check, ChevronDown, Circle,
  Code2, Globe2, Layers3, MessageCircle, MoveRight, Palette,
  Rocket, ShieldCheck, ShoppingBag, Smartphone, Star,
} from "lucide-react"
import styles from "./test-home.module.css"
import { TestCalculator } from "./test-calculator"

const ticker = ["Web deneyimleri", "Mobil ürünler", "Yapay zekâ", "E-ticaret", "Özel yazılım"]

const services = [
  { number: "01", title: "Kurumsal web", text: "Markanızı hızlı, erişilebilir ve yönetilebilir bir dijital deneyime dönüştürüyoruz.", tags: ["Next.js", "SEO", "CMS"], icon: Globe2 },
  { number: "02", title: "E-ticaret", text: "Ödeme, kampanya ve stok akışlarını tek bir güçlü satış altyapısında birleştiriyoruz.", tags: ["Ödeme", "Stok", "Analitik"], icon: ShoppingBag },
  { number: "03", title: "Mobil ürünler", text: "iOS ve Android için alışkanlıklara uyumlu, hızlı ve sade ürünler geliştiriyoruz.", tags: ["iOS", "Android", "UI/UX"], icon: Smartphone },
  { number: "04", title: "Yapay zekâ", text: "Veri, otomasyon ve akıllı öneri sistemleriyle operasyonlarınızı hızlandırıyoruz.", tags: ["LLM", "Otomasyon", "Veri"], icon: Brain },
  { number: "05", title: "Özel yazılım", text: "Hazır araçların yetmediği yerde iş akışınıza göre ölçeklenen sistemler kuruyoruz.", tags: ["SaaS", "API", "Cloud"], icon: Code2 },
  { number: "06", title: "Ürün tasarımı", text: "Karmaşık fikirleri test edilebilir, anlaşılır ve güçlü arayüzlere dönüştürüyoruz.", tags: ["Strateji", "UX", "Prototip"], icon: Palette },
]

const work = [
  { id: "FIN / 01", category: "Finans", title: "FinTech bankacılık platformu", text: "Gerçek zamanlı işlem takibi ve yapay zekâ destekli harcama analizi.", tech: "NEXT.JS · NODE.JS · POSTGRESQL", color: "lime" },
  { id: "ECM / 02", category: "E-ticaret", title: "Yeni nesil alışveriş deneyimi", text: "Kişiselleştirilmiş öneriler ve sürtünmesiz ödeme akışı.", tech: "REACT · PYTHON · REDIS", color: "orange" },
  { id: "HLT / 03", category: "Sağlık", title: "Klinik yönetim sistemi", text: "Randevu, hasta takibi ve operasyonu tek panelde buluşturan ürün.", tech: "VUE · DJANGO · DOCKER", color: "cyan" },
  { id: "LOG / 04", category: "Lojistik", title: "Akıllı filo operasyonu", text: "Rota optimizasyonu, canlı takip ve karar destek panelleri.", tech: "NEXT.JS · GO · AI", color: "violet" },
]

const steps = [
  ["01", "Keşif", "Hedefi, kullanıcıyı ve başarı ölçütlerini birlikte netleştiririz."],
  ["02", "Strateji", "Kapsamı sadeleştirir, doğru teknoloji ve teslim planını kurarız."],
  ["03", "Tasarım", "Akışları prototipe çevirir, gerçek senaryolarla erkenden test ederiz."],
  ["04", "Geliştirme", "Ürünü görünür sprintlerle, modül modül çalışan yapıya dönüştürürüz."],
  ["05", "Lansman", "Test, performans ve yayın operasyonunu kontrollü biçimde tamamlarız."],
  ["06", "Büyüme", "Veriyi izler, yeni özelliklerle ürünü yaşamaya devam ettiririz."],
]

const testimonials = [
  ["Ahmet Yılmaz", "CEO · TechCorp", "Karmaşık bir fikri anlaşılır bir ürüne dönüştürdüler. Süreç boyunca ne durumda olduğumuzu hep biliyorduk."],
  ["Ayşe Demir", "CTO · DigitalAge", "Yapay zekâ entegrasyonunda teknik kaliteyi iş hedefiyle çok iyi dengelediler."],
  ["Mehmet Kaya", "Kurucu · StartUpX", "MVP sürecimiz kontrollü ilerledi; ürünü planladığımız tarihte gerçek kullanıcılarla buluşturduk."],
]

const faqs = [
  ["Bir proje ne kadar sürer?", "Kurumsal web projeleri genellikle 4–8 hafta, özel yazılım ve e-ticaret projeleri kapsamına göre 8–16 hafta arasında tamamlanır."],
  ["Teklif süreci nasıl ilerliyor?", "Kısa bir keşif görüşmesinden sonra kapsam, teslim planı, teknoloji yaklaşımı ve bütçeyi içeren net bir teklif paylaşırız."],
  ["Proje sonrası destek veriyor musunuz?", "Evet. İzleme, bakım, güvenlik güncellemeleri ve yeni özellikler için aylık veya yıllık destek planları sunuyoruz."],
  ["Hangi teknolojilerle çalışıyorsunuz?", "Next.js, React, Node.js, Python, PostgreSQL, Docker ve modern yapay zekâ araçlarını ihtiyaca göre kullanıyoruz."],
]

const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const } }),
}

export default function TestHomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className={styles.page}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />

      <section className={styles.hero}>
        <motion.div className={styles.eyebrow} initial="hidden" animate="show" variants={reveal} custom={0.05}>
          <span className={styles.liveDot} /> Kayseri&apos;den dünyaya dijital ürünler
        </motion.div>
        <div className={styles.heroGrid}>
          <motion.div initial="hidden" animate="show" variants={reveal} custom={0.15}>
            <h1 className={styles.title}>Fikirleri<span className={styles.titleLine}><span className={styles.spark}><Asterisk strokeWidth={1.4} /></span>harekete</span>geçiriyoruz.</h1>
          </motion.div>
          <motion.aside className={styles.heroAside} initial="hidden" animate="show" variants={reveal} custom={0.35}>
            <Braces className={styles.braces} strokeWidth={1.2} />
            <p>Strateji, tasarım ve teknolojiyi tek bir akışta buluşturan bağımsız yazılım stüdyosu.</p>
            <Link href="/contact" className={styles.primaryButton}>Birlikte üretelim <ArrowUpRight size={19} /></Link>
            <div className={styles.heroProof}><span>150+<small>teslim</small></span><span>50+<small>müşteri</small></span><span>%98<small>memnuniyet</small></span></div>
          </motion.aside>
        </div>

        <motion.div className={styles.dashboard} initial={{ opacity: 0, scale: 0.96, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.dashboardTop}><span>MEG / DIGITAL LAB</span><span className={styles.status}><i /> SYSTEM ONLINE</span></div>
          <div className={styles.dashboardBody}>
            <div className={styles.codePanel}><span className={styles.codeIndex}>001—024</span><div className={styles.codeOrb}><Circle className={styles.orbitOne} strokeWidth={0.7} /><Circle className={styles.orbitTwo} strokeWidth={0.7} /><span>MEG</span></div></div>
            <div className={styles.metricPanel}><span>ÜRETİM HIZI</span><strong>4.8×</strong><div className={styles.bars} aria-label="Üretim hızı grafiği">{[38, 58, 47, 78, 62, 94, 82, 100].map((height, index) => <motion.i key={height + index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.65, delay: 0.9 + index * 0.07 }} />)}</div></div>
          </div>
        </motion.div>
      </section>

      <div className={styles.marquee} aria-label="Hizmetlerimiz"><motion.div className={styles.marqueeTrack} animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 24, ease: "linear" }}>{[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}><Asterisk /> {item}</span>)}</motion.div></div>

      <section className={styles.services}>
        <SectionIntro index="02" label="YETENEKLER" title={<>Güzel görünen değil,<br /><em>iyi çalışan</em> işler.</>} text="Her projeyi gerçek bir probleme verilen açık, ölçülebilir ve özgün bir cevap olarak ele alıyoruz." />
        <div className={styles.cards}>{services.map((service, index) => { const Icon = service.icon; return <motion.article className={styles.card} key={service.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: (index % 3) * 0.08 }} whileHover={{ y: -8 }}><div className={styles.cardTop}><span>{service.number}</span><Icon /></div><h3>{service.title}</h3><p>{service.text}</p><div className={styles.tags}>{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div><MoveRight className={styles.cardArrow} /></motion.article> })}</div>
      </section>

      <section className={styles.workSection}>
        <SectionIntro index="03" label="SEÇİLİ İŞLER" title={<>Farklı sektörler.<br /><em>Tek standart.</em></>} text="İş hedefi net, teknik altyapısı sağlam ve kullanımı kolay dijital ürünler." />
        <div className={styles.workGrid}>{work.map((item, index) => <motion.article key={item.id} className={`${styles.workCard} ${styles[item.color]}`} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}><div className={styles.workMeta}><span>{item.id}</span><span>{item.category}</span></div><div className={styles.workVisual}><div className={styles.mockWindow}><i /><i /><i /><div className={styles.mockChart}>{[42, 72, 55, 90, 68, 100].map((h, idx) => <b key={idx} style={{ height: `${h}%` }} />)}</div></div></div><h3>{item.title}</h3><p>{item.text}</p><footer><span>{item.tech}</span><ArrowUpRight /></footer></motion.article>)}</div>
        <div className={styles.statsBand}>{[["150+", "Tamamlanan proje"], ["50+", "Mutlu müşteri"], ["5+", "Yıllık deneyim"], ["%98", "Memnuniyet"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className={styles.processSection}>
        <SectionIntro index="04" label="SÜREÇ" title={<>Karmaşayı alır,<br /><em>netliğe çeviririz.</em></>} text="Her aşamada görünür çıktı, net karar ve ölçülebilir ilerleme." />
        <div className={styles.timeline}>{steps.map(([number, title, text], index) => <motion.div className={styles.step} key={number} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }}><span>{number}</span><h3>{title}</h3><p>{text}</p><i /></motion.div>)}</div>
      </section>

      <section className={styles.stackSection}>
        <div className={styles.stackCopy}><span>05 / TEKNOLOJİ</span><h2>Doğru araç.<br /><em>Doğru yerde.</em></h2><p>Teknolojiyi moda olduğu için değil, ürünün hızına, güvenliğine ve geleceğine hizmet ettiği için seçiyoruz.</p><div className={styles.stackChecks}><span><Check /> Ölçeklenebilir mimari</span><span><ShieldCheck /> Güvenli varsayılanlar</span><span><Rocket /> Hızlı yayın döngüsü</span></div></div>
        <div className={styles.stackOrbit}><motion.div className={styles.stackCore} animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}><span>NEXT</span><span>REACT</span><span>NODE</span><span>PYTHON</span><span>POSTGRES</span><span>DOCKER</span></motion.div><div className={styles.stackCenter}><Layers3 /><strong>MEG</strong><small>STACK / 26</small></div></div>
      </section>

      <section className={styles.quotesSection}>
        <SectionIntro index="06" label="REFERANSLAR" title={<>Birlikte üretenler<br /><em>ne diyor?</em></>} text="İyi işin en açık göstergesi, tekrar birlikte çalışmak isteyen ekiplerdir." />
        <div className={styles.quotes}>{testimonials.map(([name, role, quote], index) => <motion.blockquote key={name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }}><div>{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div><p>“{quote}”</p><footer><span>{name.charAt(0)}</span><div><strong>{name}</strong><small>{role}</small></div></footer></motion.blockquote>)}</div>
      </section>

      <TestCalculator />

      <section className={styles.faqSection}>
        <div className={styles.faqHeading}><span>08 / MERAK EDİLENLER</span><h2>Sorular.<br /><em>Net cevaplar.</em></h2><p>Aradığınız cevap burada değilse bir mesaj uzağınızdayız.</p><a href="https://wa.me/905379830414" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp&apos;tan yazın</a></div>
        <div className={styles.faqList}>{faqs.map(([question, answer], index) => <div className={styles.faqItem} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{String(index + 1).padStart(2, "0")}</span>{question}<ChevronDown className={openFaq === index ? styles.chevronOpen : ""} /></button><AnimatePresence>{openFaq === index && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{answer}</motion.p>}</AnimatePresence></div>)}</div>
      </section>

      <section className={styles.closing}><motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}><span>Yeni bir şey mi var aklında?</span><h2>Onu gerçeğe<br />dönüştürelim.</h2><p>15 dakikalık bir görüşme, fikriniz için doğru ilk adımı bulmaya yeter.</p><Link href="/contact">Projeyi anlat <ArrowUpRight /></Link></motion.div><div className={styles.closingMark}>M<span>•</span></div></section>
    </div>
  )
}

function SectionIntro({ index, label, title, text }: { index: string; label: string; title: React.ReactNode; text: string }) {
  return <div className={styles.sectionIntro}><span>{index} / {label}</span><h2>{title}</h2><p>{text}</p></div>
}
