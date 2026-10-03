"use client"

import { T, LocalizedElement } from "@/components/i18n/text"
import { useState } from "react"
import Link from "@/components/i18n/link"
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
          <span className={styles.liveDot} /> <T>{"Kayseri'den dünyaya dijital ürünler"}</T></motion.div>
        <div className={styles.heroGrid}>
          <motion.div initial="hidden" animate="show" variants={reveal} custom={0.15}>
            <h1 className={styles.title}><T>{"Fikirleri"}</T><span className={styles.titleLine}><span className={styles.spark}><Asterisk strokeWidth={1.4} /></span><T>{"harekete"}</T></span><T>{"geçiriyoruz."}</T></h1>
          </motion.div>
          <motion.aside className={styles.heroAside} initial="hidden" animate="show" variants={reveal} custom={0.35}>
            <Braces className={styles.braces} strokeWidth={1.2} />
            <p><T>{"Strateji, tasarım ve teknolojiyi tek bir akışta buluşturan bağımsız yazılım stüdyosu."}</T></p>
            <Link href="/contact" className={styles.primaryButton}><T>{"Birlikte üretelim "}</T><ArrowUpRight size={19} /></Link>
            <div className={styles.heroProof}><span><T>{"150+"}</T><small><T>{"teslim"}</T></small></span><span><T>{"50+"}</T><small><T>{"müşteri"}</T></small></span><span><T>{"%98"}</T><small><T>{"memnuniyet"}</T></small></span></div>
          </motion.aside>
        </div>

        <motion.div className={styles.dashboard} initial={{ opacity: 0, scale: 0.96, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.dashboardTop}><span><T>{"MEG / DIGITAL LAB"}</T></span><span className={styles.status}><i /> <T>{" SYSTEM ONLINE"}</T></span></div>
          <div className={styles.dashboardBody}>
            <div className={styles.codePanel}><span className={styles.codeIndex}><T>{"001—024"}</T></span><div className={styles.codeOrb}><Circle className={styles.orbitOne} strokeWidth={0.7} /><Circle className={styles.orbitTwo} strokeWidth={0.7} /><span><T>{"MEG"}</T></span></div></div>
            <div className={styles.metricPanel}><span><T>{"ÜRETİM HIZI"}</T></span><strong><T>{"4.8×"}</T></strong><LocalizedElement as="div" className={styles.bars} aria-label="Üretim hızı grafiği">{[38, 58, 47, 78, 62, 94, 82, 100].map((height, index) => <motion.i key={height + index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.65, delay: 0.9 + index * 0.07 }} />)}</LocalizedElement></div>
          </div>
        </motion.div>
      </section>

      <LocalizedElement as="div" className={styles.marquee} aria-label="Hizmetlerimiz"><motion.div className={styles.marqueeTrack} animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 24, ease: "linear" }}>{[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}><Asterisk /> <T>{item}</T></span>)}</motion.div></LocalizedElement>

      <section className={styles.services}>
        <SectionIntro index="02" label="YETENEKLER" title={<><T>{"Güzel görünen değil,"}</T><br /><em><T>{"iyi çalışan"}</T></em> <T>{" işler."}</T></>} text="Her projeyi gerçek bir probleme verilen açık, ölçülebilir ve özgün bir cevap olarak ele alıyoruz." />
        <div className={styles.cards}>{services.map((service, index) => { const Icon = service.icon; return <motion.article className={styles.card} key={service.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: (index % 3) * 0.08 }} whileHover={{ y: -8 }}><div className={styles.cardTop}><span><T>{service.number}</T></span><Icon /></div><h3><T>{service.title}</T></h3><p><T>{service.text}</T></p><div className={styles.tags}>{service.tags.map(tag => <span key={tag}><T>{tag}</T></span>)}</div><MoveRight className={styles.cardArrow} /></motion.article> })}</div>
      </section>

      <section className={styles.workSection}>
        <SectionIntro index="03" label="SEÇİLİ İŞLER" title={<><T>{"Farklı sektörler."}</T><br /><em><T>{"Tek standart."}</T></em></>} text="İş hedefi net, teknik altyapısı sağlam ve kullanımı kolay dijital ürünler." />
        <div className={styles.workGrid}>{work.map((item, index) => <motion.article key={item.id} className={`${styles.workCard} ${styles[item.color]}`} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}><div className={styles.workMeta}><span><T>{item.id}</T></span><span><T>{item.category}</T></span></div><div className={styles.workVisual}><div className={styles.mockWindow}><i /><i /><i /><div className={styles.mockChart}>{[42, 72, 55, 90, 68, 100].map((h, idx) => <b key={idx} style={{ height: `${h}%` }} />)}</div></div></div><h3><T>{item.title}</T></h3><p><T>{item.text}</T></p><footer><span><T>{item.tech}</T></span><ArrowUpRight /></footer></motion.article>)}</div>
        <div className={styles.statsBand}>{[["150+", "Tamamlanan proje"], ["50+", "Mutlu müşteri"], ["5+", "Yıllık deneyim"], ["%98", "Memnuniyet"]].map(([value, label]) => <div key={label}><strong><T>{value}</T></strong><span><T>{label}</T></span></div>)}</div>
      </section>

      <section className={styles.processSection}>
        <SectionIntro index="04" label="SÜREÇ" title={<><T>{"Karmaşayı alır,"}</T><br /><em><T>{"netliğe çeviririz."}</T></em></>} text="Her aşamada görünür çıktı, net karar ve ölçülebilir ilerleme." />
        <div className={styles.timeline}>{steps.map(([number, title, text], index) => <motion.div className={styles.step} key={number} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }}><span><T>{number}</T></span><h3><T>{title}</T></h3><p><T>{text}</T></p><i /></motion.div>)}</div>
      </section>

      <section className={styles.stackSection}>
        <div className={styles.stackCopy}><span><T>{"05 / TEKNOLOJİ"}</T></span><h2><T>{"Doğru araç."}</T><br /><em><T>{"Doğru yerde."}</T></em></h2><p><T>{"Teknolojiyi moda olduğu için değil, ürünün hızına, güvenliğine ve geleceğine hizmet ettiği için seçiyoruz."}</T></p><div className={styles.stackChecks}><span><Check /> <T>{" Ölçeklenebilir mimari"}</T></span><span><ShieldCheck /> <T>{" Güvenli varsayılanlar"}</T></span><span><Rocket /> <T>{" Hızlı yayın döngüsü"}</T></span></div></div>
        <div className={styles.stackOrbit}><motion.div className={styles.stackCore} animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}><span><T>{"NEXT"}</T></span><span><T>{"REACT"}</T></span><span><T>{"NODE"}</T></span><span><T>{"PYTHON"}</T></span><span><T>{"POSTGRES"}</T></span><span><T>{"DOCKER"}</T></span></motion.div><div className={styles.stackCenter}><Layers3 /><strong><T>{"MEG"}</T></strong><small><T>{"STACK / 26"}</T></small></div></div>
      </section>

      <section className={styles.quotesSection}>
        <SectionIntro index="06" label="REFERANSLAR" title={<><T>{"Birlikte üretenler"}</T><br /><em><T>{"ne diyor?"}</T></em></>} text="İyi işin en açık göstergesi, tekrar birlikte çalışmak isteyen ekiplerdir." />
        <div className={styles.quotes}>{testimonials.map(([name, role, quote], index) => <motion.blockquote key={name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }}><div>{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div><p><T>{"“"}</T><T>{quote}</T><T>{"”"}</T></p><footer><span><T>{name.charAt(0)}</T></span><div><strong><T>{name}</T></strong><small><T>{role}</T></small></div></footer></motion.blockquote>)}</div>
      </section>

      <TestCalculator />

      <section className={styles.faqSection}>
        <div className={styles.faqHeading}><span><T>{"08 / MERAK EDİLENLER"}</T></span><h2><T>{"Sorular."}</T><br /><em><T>{"Net cevaplar."}</T></em></h2><p><T>{"Aradığınız cevap burada değilse bir mesaj uzağınızdayız."}</T></p><a href="https://wa.me/905379830414" target="_blank" rel="noreferrer"><MessageCircle /> <T>{" WhatsApp'tan yazın"}</T></a></div>
        <div className={styles.faqList}>{faqs.map(([question, answer], index) => <div className={styles.faqItem} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span><T>{String(index + 1).padStart(2, "0")}</T></span><T>{question}</T><ChevronDown className={openFaq === index ? styles.chevronOpen : ""} /></button><AnimatePresence>{openFaq === index && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><T>{answer}</T></motion.p>}</AnimatePresence></div>)}</div>
      </section>

      <section className={styles.closing}><motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}><span><T>{"Yeni bir şey mi var aklında?"}</T></span><h2><T>{"Onu gerçeğe"}</T><br /><T>{"dönüştürelim."}</T></h2><p><T>{"15 dakikalık bir görüşme, fikriniz için doğru ilk adımı bulmaya yeter."}</T></p><Link href="/contact"><T>{"Projeyi anlat "}</T><ArrowUpRight /></Link></motion.div><div className={styles.closingMark}><T>{"M"}</T><span><T>{"•"}</T></span></div></section>
    </div>
  )
}

function SectionIntro({ index, label, title, text }: { index: string; label: string; title: React.ReactNode; text: string }) {
  return <div className={styles.sectionIntro}><span><T>{index}</T> <T>{" / "}</T><T>{label}</T></span><h2><T>{title}</T></h2><p><T>{text}</T></p></div>
}
