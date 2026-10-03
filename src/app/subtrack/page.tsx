import { localizeMetadata } from "@/lib/i18n/server"
import { T, LocalizedElement } from "@/components/i18n/text"
import type { Metadata } from "next"
import Link from "@/components/i18n/link"
import {
  ArrowRight,
  BellRing,
  Bot,
  CalendarDays,
  Check,
  CreditCard,
  Download,
  PieChart,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react"
import styles from "./subtrack.module.css"

const sourceMetadata: Metadata = {
  title: "SubTrack | Aboneliklerini Tek Yerde Yönet",
  description:
    "Aboneliklerini takip et, yaklaşan ödemeleri önceden gör ve harcamalarını SubTrack ile kontrol altında tut.",
}

const features = [
  {
    icon: CalendarDays,
    title: "Akıllı abonelik takibi",
    description:
      "Tüm aboneliklerini, yenileme tarihlerini ve ödeme dönemlerini tek ekranda yönet.",
  },
  {
    icon: BellRing,
    title: "Zamanında hatırlatmalar",
    description:
      "Yaklaşan ödemelerden önce bildirim al, beklenmedik ücretlerle karşılaşma.",
  },
  {
    icon: PieChart,
    title: "Net harcama görünümü",
    description:
      "Aylık ve yıllık maliyetlerini kategori ve para birimi bazında kolayca analiz et.",
  },
  {
    icon: Bot,
    title: "Yapay zekâ içgörüleri",
    description:
      "Talep ettiğinde abonelik alışkanlıklarını yorumlayan anlaşılır öneriler al.",
  },
  {
    icon: RefreshCw,
    title: "Güvenli senkronizasyon",
    description:
      "Bilgilerine farklı cihazlardan eriş; değişikliklerin hesabınla birlikte güncel kalsın.",
  },
  {
    icon: ShieldCheck,
    title: "Kontrol sende",
    description:
      "Verilerini dışa aktarabilir, kayıtlarını veya hesabını istediğin zaman silebilirsin.",
  },
]

const subscriptions = [
  { name: "Netflix", date: "8 Eyl", price: "229,99 ₺", color: "#ef4444" },
  { name: "Spotify", date: "14 Eyl", price: "59,99 ₺", color: "#22c55e" },
  { name: "iCloud+", date: "21 Eyl", price: "39,99 ₺", color: "#38bdf8" },
]

export default function SubTrackPage() {
  return (
    <div className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.orbThree} />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.copy}>
            <div className={styles.brandPill}>
              <span className={styles.brandMark}>
                <TrendingUp size={17} />
              </span>
              <span><T>{"SUBTRACK"}</T></span>
              <span className={styles.liveDot} />
            </div>

            <h1>
              <T>{"Aboneliklerin"}</T><span> <T>{" kontrol altında."}</T></span>
            </h1>
            <p className={styles.lead}>
              <T>{"Yenileme tarihlerini unutma, harcamalarını anında gör ve tüm aboneliklerini tek bir akıllı uygulamada yönet."}</T></p>

            <div className={styles.actions}>
              <a
                href="https://github.com/megas13/MegDev/raw/refs/heads/main/public/downloads/SubTrack-release.apk"
                className={styles.primaryButton}
                download="SubTrack-release.apk"
              >
                <Download size={20} />
                <T>{"Android için indir"}</T><ArrowRight size={18} />
              </a>
              <a href="#ozellikler" className={styles.secondaryButton}>
                <T>{"Özellikleri keşfet"}</T></a>
            </div>

            <div className={styles.trustRow}>
              {["Ücretsiz başla", "Kart bilgisi gerekmez", "Verilerin senin kontrolünde"].map(
                (item) => (
                  <span key={item}>
                    <Check size={15} />
                    <T>{item}</T>
                  </span>
                ),
              )}
            </div>
          </div>

          <LocalizedElement as="div" className={styles.visual} aria-label="SubTrack uygulama önizlemesi">
            <div className={styles.phoneGlow} />
            <div className={styles.phone}>
              <div className={styles.phoneTop}>
                <span><T>{"09:41"}</T></span>
                <span className={styles.camera} />
                <span><T>{"● ◒"}</T></span>
              </div>
              <div className={styles.phoneBody}>
                <div className={styles.appHeader}>
                  <div>
                    <small><T>{"Merhaba 👋"}</T></small>
                    <strong><T>{"Aboneliklerim"}</T></strong>
                  </div>
                  <span className={styles.avatar}><T>{"M"}</T></span>
                </div>

                <div className={styles.totalCard}>
                  <div className={styles.totalCardTop}>
                    <span><T>{"Aylık toplam"}</T></span>
                    <WalletCards size={20} />
                  </div>
                  <strong><T>{"1.284,90 ₺"}</T></strong>
                  <div className={styles.miniChart}>
                    {[34, 48, 42, 65, 55, 78, 92].map((height, index) => (
                      <i key={height + index} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>

                <div className={styles.listHeader}>
                  <strong><T>{"Yaklaşan ödemeler"}</T></strong>
                  <span><T>{"Tümünü gör"}</T></span>
                </div>

                <div className={styles.subscriptionList}>
                  {subscriptions.map((subscription) => (
                    <div className={styles.subscription} key={subscription.name}>
                      <span
                        className={styles.serviceIcon}
                        style={{ backgroundColor: subscription.color }}
                      >
                        <T>{subscription.name.charAt(0)}</T>
                      </span>
                      <span className={styles.serviceName}>
                        <strong><T>{subscription.name}</T></strong>
                        <small><T>{subscription.date}</T></small>
                      </span>
                      <strong><T>{subscription.price}</T></strong>
                    </div>
                  ))}
                </div>

                <div className={styles.phoneNav}>
                  <span className={styles.activeNav}><PieChart size={18} /></span>
                  <span><CreditCard size={18} /></span>
                  <span><BellRing size={18} /></span>
                </div>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.reminderCard}`}>
              <span><BellRing size={18} /></span>
              <div>
                <strong><T>{"Ödeme yaklaşıyor"}</T></strong>
                <small><T>{"Netflix · 2 gün kaldı"}</T></small>
              </div>
            </div>
            <div className={`${styles.floatingCard} ${styles.savingCard}`}>
              <span><Sparkles size={18} /></span>
              <div>
                <strong><T>{"Bu ay %12 daha az"}</T></strong>
                <small><T>{"Harcamaların iyi görünüyor"}</T></small>
              </div>
            </div>
          </LocalizedElement>
        </div>
      </section>

      <LocalizedElement as="section" className={styles.metrics} aria-label="SubTrack avantajları">
        <div>
          <strong><T>{"Tek ekran"}</T></strong>
          <span><T>{"Tüm aboneliklerin"}</T></span>
        </div>
        <div>
          <strong><T>{"Akıllı"}</T></strong>
          <span><T>{"Ödeme hatırlatmaları"}</T></span>
        </div>
        <div>
          <strong><T>{"Çoklu para"}</T></strong>
          <span><T>{"Güncel kur desteği"}</T></span>
        </div>
        <div>
          <strong><T>{"Güvenli"}</T></strong>
          <span><T>{"Hesap senkronizasyonu"}</T></span>
        </div>
      </LocalizedElement>

      <section className={styles.features} id="ozellikler">
        <div className={styles.sectionHeading}>
          <span><T>{"DAHA AZ KARMAŞA, DAHA FAZLA KONTROL"}</T></span>
          <h2><T>{"Abonelik yönetiminin akıllı yolu"}</T></h2>
          <p>
            <T>{"Günlük takibi kolaylaştıran güçlü araçlar, sade ve hızlı bir deneyimde bir araya geliyor."}</T></p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <article
                className={styles.featureCard}
                style={{ animationDelay: `${index * 90}ms` }}
                key={feature.title}
              >
                <span className={styles.featureIcon}><Icon size={24} /></span>
                <h3><T>{feature.title}</T></h3>
                <p><T>{feature.description}</T></p>
              </article>
            )
          })}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} aria-hidden="true" />
        <div className={styles.ctaIcon}><Sparkles size={28} /></div>
        <h2><T>{"Aboneliklerini bugün sadeleştir."}</T></h2>
        <p><T>{"SubTrack’i indir, yenileme tarihlerini ve harcamalarını tek yerde gör."}</T></p>
        <a
          href="https://github.com/megas13/MegDev/raw/refs/heads/main/public/downloads/SubTrack-release.apk"
          className={styles.primaryButton}
          download="SubTrack-release.apk"
        >
          <Download size={20} />
          <T>{"SubTrack’i indir"}</T></a>
        <div className={styles.legalLinks}>
          <Link href="/subtrack-gizlilik-sozlesmesi"><T>{"Gizlilik Politikası"}</T></Link>
          <span><T>{"•"}</T></span>
          <Link href="/subtrack-hesap-silme"><T>{"Hesap ve veri silme"}</T></Link>
          <span><T>{"•"}</T></span>
          <a href="mailto:destek@megdev.info"><T>{"Destek"}</T></a>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
