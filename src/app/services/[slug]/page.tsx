import { T } from "@/components/i18n/text"
import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import Link from "@/components/i18n/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Check, CircleDot } from "lucide-react"
import { PageIntro } from "@/components/ui/page-intro"
import styles from "./service-detail.module.css"
import { services } from "@/constants"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((item) => item.slug === slug)
  return service ? localizeMetadata({ title: service.title, description: service.description }) : {}
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = services.find((item) => item.slug === slug)
  if (!service) notFound()
  const currentIndex = services.findIndex((item) => item.slug === slug)
  const nextService = services[(currentIndex + 1) % services.length]

  return <div>
    <PageIntro index={String(currentIndex + 1).padStart(2, "0")} eyebrow="YETKİNLİK" title={service.title} description={service.description}>
      <Link href="/services" className={styles.back}><ArrowLeft size={15} /> <T>{" Tüm hizmetler"}</T></Link>
    </PageIntro>
    <section className={styles.section}>
      <div className={styles.shell}><div className={styles.split}>
        <div><p className={styles.label}><T>{"SONUÇ ODAKLI YAKLAŞIM"}</T></p><h2 className={styles.title}><T>{"Fikriniz için,"}</T><br /><T>{"çalışan bir çözüm."}</T></h2><p className={styles.description}><T>{service.outcome}</T></p></div>
        <div className={styles.features}>{service.features.map((feature, index) => <article key={feature} className={styles.feature}>
          <div className={styles.featureTop}><span><T>{String(index + 1).padStart(2, "0")}</T></span><Check size={18} /></div><h3><T>{feature}</T></h3><p><T>{"Bu yetenek proje kapsamına, hedeflere ve mevcut altyapınıza göre ölçülendirilir."}</T></p>
        </article>)}</div>
      </div></div>
    </section>
    <section className={styles.section}>
      <div className={styles.shell}><div className={styles.split}>
        <div><p className={styles.label}><T>{"FİKİRDEN YAYINA"}</T></p><h2 className={styles.title}><T>{"Nasıl ilerliyoruz?"}</T></h2><p className={styles.description}><T>{"Belirsizliği azaltan, her adımda görünür çıktı üreten çalışma akışı."}</T></p></div>
        <ol className={styles.steps}>{service.process.map((step, index) => <li key={step} className={styles.step}>
          <span className={styles.stepNumber}><T>{String(index + 1).padStart(2, "0")}</T></span><div><h3><T>{step}</T></h3><p><T>{"Kontrollü teslimat · açık iletişim · ölçülebilir çıktı"}</T></p></div>
        </li>)}</ol>
      </div></div>
    </section>
    <section className={styles.section}>
      <div className={styles.shell}>
        <p className={styles.label}><T>{"TEKNOLOJİ SETİ"}</T></p><div className={styles.technologies}>{service.technologies.map(technology => <span key={technology} className={styles.technology}><CircleDot size={12} /><T>{technology}</T></span>)}</div>
        <div className={styles.cta}>
          <div><p className={styles.label}><T>{"BİR SONRAKİ ADIM"}</T></p><h2 className={styles.title}><T>{"Bu çözümü projenize uyarlayalım."}</T></h2><p className={styles.description}><T>{"İhtiyacınızı konuşalım, kapsamı ve en doğru başlangıç yolunu birlikte netleştirelim."}</T></p></div>
          <Link href="/contact" className={styles.button}><T>{"Projeyi konuşalım "}</T><ArrowUpRight size={17} /></Link>
        </div>
        <Link href={"/services/" + nextService.slug} className={styles.next}><span><small><T>{"Sıradaki hizmet"}</T></small><strong><T>{nextService.title}</T></strong></span><ArrowUpRight size={22} /></Link>
      </div>
    </section>
  </div>
}
