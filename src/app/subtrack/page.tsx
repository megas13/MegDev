import type { Metadata } from "next"
import Link from "next/link"
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

export const metadata: Metadata = {
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
              <span>SUBTRACK</span>
              <span className={styles.liveDot} />
            </div>

            <h1>
              Aboneliklerin
              <span> kontrol altında.</span>
            </h1>
            <p className={styles.lead}>
              Yenileme tarihlerini unutma, harcamalarını anında gör ve tüm
              aboneliklerini tek bir akıllı uygulamada yönet.
            </p>

            <div className={styles.actions}>
              <a
                href="https://github.com/megas13/MegDev/raw/refs/heads/main/public/downloads/SubTrack-release.apk"
                className={styles.primaryButton}
                download="SubTrack-release.apk"
              >
                <Download size={20} />
                Android için indir
                <ArrowRight size={18} />
              </a>
              <a href="#ozellikler" className={styles.secondaryButton}>
                Özellikleri keşfet
              </a>
            </div>

            <div className={styles.trustRow}>
              {["Ücretsiz başla", "Kart bilgisi gerekmez", "Verilerin senin kontrolünde"].map(
                (item) => (
                  <span key={item}>
                    <Check size={15} />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className={styles.visual} aria-label="SubTrack uygulama önizlemesi">
            <div className={styles.phoneGlow} />
            <div className={styles.phone}>
              <div className={styles.phoneTop}>
                <span>09:41</span>
                <span className={styles.camera} />
                <span>● ◒</span>
              </div>
              <div className={styles.phoneBody}>
                <div className={styles.appHeader}>
                  <div>
                    <small>Merhaba 👋</small>
                    <strong>Aboneliklerim</strong>
                  </div>
                  <span className={styles.avatar}>M</span>
                </div>

                <div className={styles.totalCard}>
                  <div className={styles.totalCardTop}>
                    <span>Aylık toplam</span>
                    <WalletCards size={20} />
                  </div>
                  <strong>1.284,90 ₺</strong>
                  <div className={styles.miniChart}>
                    {[34, 48, 42, 65, 55, 78, 92].map((height, index) => (
                      <i key={height + index} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>

                <div className={styles.listHeader}>
                  <strong>Yaklaşan ödemeler</strong>
                  <span>Tümünü gör</span>
                </div>

                <div className={styles.subscriptionList}>
                  {subscriptions.map((subscription) => (
                    <div className={styles.subscription} key={subscription.name}>
                      <span
                        className={styles.serviceIcon}
                        style={{ backgroundColor: subscription.color }}
                      >
                        {subscription.name.charAt(0)}
                      </span>
                      <span className={styles.serviceName}>
                        <strong>{subscription.name}</strong>
                        <small>{subscription.date}</small>
                      </span>
                      <strong>{subscription.price}</strong>
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
                <strong>Ödeme yaklaşıyor</strong>
                <small>Netflix · 2 gün kaldı</small>
              </div>
            </div>
            <div className={`${styles.floatingCard} ${styles.savingCard}`}>
              <span><Sparkles size={18} /></span>
              <div>
                <strong>Bu ay %12 daha az</strong>
                <small>Harcamaların iyi görünüyor</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.metrics} aria-label="SubTrack avantajları">
        <div>
          <strong>Tek ekran</strong>
          <span>Tüm aboneliklerin</span>
        </div>
        <div>
          <strong>Akıllı</strong>
          <span>Ödeme hatırlatmaları</span>
        </div>
        <div>
          <strong>Çoklu para</strong>
          <span>Güncel kur desteği</span>
        </div>
        <div>
          <strong>Güvenli</strong>
          <span>Hesap senkronizasyonu</span>
        </div>
      </section>

      <section className={styles.features} id="ozellikler">
        <div className={styles.sectionHeading}>
          <span>DAHA AZ KARMAŞA, DAHA FAZLA KONTROL</span>
          <h2>Abonelik yönetiminin akıllı yolu</h2>
          <p>
            Günlük takibi kolaylaştıran güçlü araçlar, sade ve hızlı bir
            deneyimde bir araya geliyor.
          </p>
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
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} aria-hidden="true" />
        <div className={styles.ctaIcon}><Sparkles size={28} /></div>
        <h2>Aboneliklerini bugün sadeleştir.</h2>
        <p>SubTrack’i indir, yenileme tarihlerini ve harcamalarını tek yerde gör.</p>
        <a
          href="https://github.com/megas13/MegDev/raw/refs/heads/main/public/downloads/SubTrack-release.apk"
          className={styles.primaryButton}
          download="SubTrack-release.apk"
        >
          <Download size={20} />
          SubTrack’i indir
        </a>
        <div className={styles.legalLinks}>
          <Link href="/subtrack-gizlilik-sozlesmesi">Gizlilik Politikası</Link>
          <span>•</span>
          <Link href="/subtrack-hesap-silme">Hesap ve veri silme</Link>
          <span>•</span>
          <a href="mailto:destek@megdev.info">Destek</a>
        </div>
      </section>
    </div>
  )
}
