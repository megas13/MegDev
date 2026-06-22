import type { Metadata } from "next"
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Ban,
  RefreshCw,
  Gavel,
  Mail,
  BookOpen,
  UserCheck,
  Shield,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Meg Dev",
  description:
    "Meg Dev web sitesini kullanırken uymanız gereken koşullar. Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız.",
}

const sections = [
  {
    id: "kabul",
    title: "1. Koşulların Kabulü",
    icon: CheckCircle2,
    content: (
      <div className="space-y-3">
        <p>
          Meg Dev web sitesini ("Site") ziyaret ederek veya hizmetlerimizi
          kullanarak aşağıda belirtilen kullanım koşullarını ("Koşullar")
          okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.
        </p>
        <p className="text-muted-foreground">
          Bu koşulları kabul etmiyorsanız, siteyi kullanmamalı ve
          hizmetlerimizden yararlanmamalısınız.
        </p>
      </div>
    ),
  },
  {
    id: "hizmet",
    title: "2. Hizmet Kapsamı",
    icon: BookOpen,
    content: (
      <div className="space-y-3">
        <p>
          Meg Dev olarak aşağıdaki hizmetleri sunmaktayız:
        </p>
        <ul className="space-y-2">
          {[
            "Kurumsal web sitesi geliştirme",
            "E-ticaret sistemi kurulumu",
            "CRM ve özel yazılım geliştirme",
            "Mobil uygulama geliştirme",
            "Yapay zeka çözümleri",
            "Danışmanlık ve teknik destek",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Her bir hizmetin kapsamı, teslimat süresi ve ücretlendirmesi,
          taraflar arasında imzalanan ayrı bir sözleşme ile belirlenir.
        </p>
      </div>
    ),
  },
  {
    id: "kullanici",
    title: "3. Kullanıcı Sorumlulukları",
    icon: UserCheck,
    content: (
      <div className="space-y-3">
        <p>Siteyi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
        <ul className="space-y-2">
          {[
            "Siteyi yalnızca yasal amaçlarla kullanmak",
            "Başka kullanıcıların haklarına saygı göstermek",
            "Site üzerinden yanıltıcı veya hukuka aykırı bilgi paylaşmamak",
            "Site altyapısına zarar verecek girişimlerde bulunmamak",
            "Virüs veya zararlı yazılım yaymamak",
            "Site içeriğini izinsiz kopyalamamak veya dağıtmamak",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Kurallara aykırı kullanım tespit edilmesi halinde, erişiminizin
          kısıtlanması veya engellenmesi dahil gerekli önlemler alınacaktır.
        </p>
      </div>
    ),
  },
  {
    id: "fikri-mulkiyet",
    title: "4. Fikri Mülkiyet Hakları",
    icon: Shield,
    content: (
      <div className="space-y-3">
        <p>
          Site üzerinde bulunan tüm içerik, tasarım, logo, yazılım ve
          materyaller Meg Dev'e aittir ve fikri mülkiyet kanunları ile
          korunmaktadır.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "İzin Verilenler", desc: "Siteyi kişisel amaçla görüntüleme, sayfa yazdırma", color: "text-emerald-400" },
            { name: "Yasak Olanlar", desc: "İçeriği kopyalama, dağıtma, satma, türev eser oluşturma", color: "text-secondary" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4">
              <p className={`font-semibold text-sm ${item.color}`}>{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Müşterilerimiz için geliştirilen projelerin tüm hakları, sözleşme
          şartları çerçevesinde müşteriye devredilir.
        </p>
      </div>
    ),
  },
  {
    id: "gizlilik",
    title: "5. Gizlilik",
    icon: FileText,
    content: (
      <div className="space-y-3">
        <p>
          Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için
          <Link href="/kvkk" className="text-primary hover:underline mx-1">
            KVKK & Gizlilik Politikası
          </Link>
          sayfamızı ziyaret edebilirsiniz.
        </p>
        <p className="text-muted-foreground">
          Proje kapsamında paylaştığınız gizli bilgiler, sözleşme süresince ve
          sonrasında üçüncü taraflarla paylaşılmayacaktır.
        </p>
      </div>
    ),
  },
  {
    id: "garanti",
    title: "6. Garanti ve Sorumluluk Sınırlamaları",
    icon: AlertTriangle,
    content: (
      <div className="space-y-3">
        <p>
          Hizmetlerimiz "olduğu gibi" sunulmaktadır. Meg Dev, aşağıdaki
          konularda herhangi bir garanti vermez:
        </p>
        <ul className="space-y-2">
          {[
            "Hizmetin kesintisiz veya hatasız çalışacağı",
            "Üçüncü taraf hizmet sağlayıcıların (Nhost, Vercel vb.) performansı",
            "Site içeriğinin güncelliği veya doğruluğu",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Meg Dev, sözleşme kapsamında sunulan hizmet bedelini aşan dolaylı
          veya arızi zararlardan sorumlu tutulamaz.
        </p>
      </div>
    ),
  },
  {
    id: "fesih",
    title: "7. Fesih ve İptal",
    icon: Ban,
    content: (
      <div className="space-y-3">
        <p>
          Taraflar, sözleşme şartlarında belirtilen bildirim sürelerine uyarak
          sözleşmeyi feshedebilir.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "Müşteri Tarafından", desc: "Sözleşmede belirtilen süre öncesinden yazılı bildirim" },
            { name: "Meg Dev Tarafından", desc: "Kullanım koşullarının ihlali halinde anında fesih hakkı" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4">
              <p className="font-semibold text-sm text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "degisiklik",
    title: "8. Koşullarda Değişiklik",
    icon: RefreshCw,
    content: (
      <div className="space-y-3">
        <p>
          Meg Dev, bu kullanım koşullarını önceden bildirim yapmaksızın
          değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı
          anda yürürlüğe girer.
        </p>
        <p className="text-muted-foreground">
          Sitenin düzenli kullanımına devam edilmesi, güncellenmiş koşulların
          kabulü anlamına gelir.
        </p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-4 text-sm">
          <p><strong className="text-foreground">Son güncelleme:</strong> Haziran 2026</p>
        </div>
      </div>
    ),
  },
  {
    id: "uyusmazlik",
    title: "9. Uyuşmazlık Çözümü",
    icon: Gavel,
    content: (
      <div className="space-y-3">
        <p>
          İşbu kullanım koşulları Türkiye Cumhuriyeti kanunlarına tabidir.
          Taraflar arasında doğabilecek uyuşmazlıklarda öncelikle arabuluculuğa
          başvurulacak, anlaşma sağlanamaması halinde
          <strong className="text-foreground"> Kayseri Mahkemeleri ve İcra Daireleri</strong>
          {" "}yetkili olacaktır.
        </p>
        <p className="text-sm text-muted-foreground">
          Tüketici hakem heyetlerine başvuru hakkı saklıdır.
        </p>
      </div>
    ),
  },
  {
    id: "iletisim",
    title: "10. İletişim",
    icon: Mail,
    content: (
      <div className="space-y-3">
        <p>Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz:</p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-5 space-y-2 text-sm">
          <p><strong className="text-foreground">E-posta:</strong> destek@megdev.info</p>
          <p><strong className="text-foreground">Adres:</strong> Demokrasi Mah 2233. Sk Melikgazi/KAYSERİ</p>
          <p><strong className="text-foreground">Telefon:</strong> +90 537 983 04 14</p>
        </div>
      </div>
    ),
  },
]

export default function KosullarPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Kullanım Koşulları</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meg Dev web sitesini kullanırken uymanız gereken koşullar. Siteyi
            kullanarak bu koşulları kabul etmiş sayılırsınız.
          </p>
        </div>
      </div>

      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.id} id={section.id} className="sharp-panel rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  {section.content}
                </div>
              )
            })}
          </div>

          <div className="mt-12 noise-panel border border-foreground/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Sorularınız mı var?</h2>
            <p className="text-muted-foreground mb-6">
              Kullanım koşulları hakkında sorularınız için bizimle iletişime
              geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:destek@megdev.info"
                className="inline-flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                <Mail className="w-4 h-4" />
                destek@megdev.info
              </a>
              <Link href="/contact">
                <span className="inline-flex items-center gap-2 border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 text-foreground px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer">
                  İletişim Formu
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
