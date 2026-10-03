import { localizeMetadata } from "@/lib/i18n/server"
import { T } from "@/components/i18n/text"
import { PageIntro } from "@/components/ui/page-intro"
import type { Metadata } from "next"
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Ban,
  RefreshCw,
  Gavel,
  Mail,
  BookOpen,
  UserCheck,
  Shield,
  ChevronRight,
} from "lucide-react"
import Link from "@/components/i18n/link"

const sourceMetadata: Metadata = {
  title: "Kullanım Koşulları",
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
          <T>{"Meg Dev web sitesini (\"Site\") ziyaret ederek veya hizmetlerimizi kullanarak aşağıda belirtilen kullanım koşullarını (\"Koşullar\") okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz."}</T></p>
        <p className="text-muted-foreground">
          <T>{"Bu koşulları kabul etmiyorsanız, siteyi kullanmamalı ve hizmetlerimizden yararlanmamalısınız."}</T></p>
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
          <T>{"Meg Dev olarak aşağıdaki hizmetleri sunmaktayız:"}</T></p>
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
              <span className="text-muted-foreground"><T>{item}</T></span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          <T>{"Her bir hizmetin kapsamı, teslimat süresi ve ücretlendirmesi, taraflar arasında imzalanan ayrı bir sözleşme ile belirlenir."}</T></p>
      </div>
    ),
  },
  {
    id: "kullanici",
    title: "3. Kullanıcı Sorumlulukları",
    icon: UserCheck,
    content: (
      <div className="space-y-3">
        <p><T>{"Siteyi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:"}</T></p>
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
              <span className="text-muted-foreground"><T>{item}</T></span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          <T>{"Kurallara aykırı kullanım tespit edilmesi halinde, erişiminizin kısıtlanması veya engellenmesi dahil gerekli önlemler alınacaktır."}</T></p>
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
          <T>{"Site üzerinde bulunan tüm içerik, tasarım, logo, yazılım ve materyaller Meg Dev'e aittir ve fikri mülkiyet kanunları ile korunmaktadır."}</T></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "İzin Verilenler", desc: "Siteyi kişisel amaçla görüntüleme, sayfa yazdırma", color: "text-emerald-400" },
            { name: "Yasak Olanlar", desc: "İçeriği kopyalama, dağıtma, satma, türev eser oluşturma", color: "text-secondary" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4">
              <p className={`font-semibold text-sm ${item.color}`}><T>{item.name}</T></p>
              <p className="text-xs text-muted-foreground mt-1"><T>{item.desc}</T></p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          <T>{"Müşterilerimiz için geliştirilen projelerin tüm hakları, sözleşme şartları çerçevesinde müşteriye devredilir."}</T></p>
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
          <T>{"Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için"}</T><Link href="/kvkk" className="text-primary hover:underline mx-1">
            <T>{"KVKK & Gizlilik Politikası"}</T></Link>
          <T>{"sayfamızı ziyaret edebilirsiniz."}</T></p>
        <p className="text-muted-foreground">
          <T>{"Proje kapsamında paylaştığınız gizli bilgiler, sözleşme süresince ve sonrasında üçüncü taraflarla paylaşılmayacaktır."}</T></p>
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
          <T>{"Hizmetlerimiz \"olduğu gibi\" sunulmaktadır. Meg Dev, aşağıdaki konularda herhangi bir garanti vermez:"}</T></p>
        <ul className="space-y-2">
          {[
            "Hizmetin kesintisiz veya hatasız çalışacağı",
            "Üçüncü taraf hizmet sağlayıcıların (Nhost, Vercel vb.) performansı",
            "Site içeriğinin güncelliği veya doğruluğu",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
              <span className="text-muted-foreground"><T>{item}</T></span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          <T>{"Meg Dev, sözleşme kapsamında sunulan hizmet bedelini aşan dolaylı veya arızi zararlardan sorumlu tutulamaz."}</T></p>
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
          <T>{"Taraflar, sözleşme şartlarında belirtilen bildirim sürelerine uyarak sözleşmeyi feshedebilir."}</T></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "Müşteri Tarafından", desc: "Sözleşmede belirtilen süre öncesinden yazılı bildirim" },
            { name: "Meg Dev Tarafından", desc: "Kullanım koşullarının ihlali halinde anında fesih hakkı" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4">
              <p className="font-semibold text-sm text-foreground"><T>{item.name}</T></p>
              <p className="text-xs text-muted-foreground mt-1"><T>{item.desc}</T></p>
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
          <T>{"Meg Dev, bu kullanım koşullarını önceden bildirim yapmaksızın değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı anda yürürlüğe girer."}</T></p>
        <p className="text-muted-foreground">
          <T>{"Sitenin düzenli kullanımına devam edilmesi, güncellenmiş koşulların kabulü anlamına gelir."}</T></p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-4 text-sm">
          <p><strong className="text-foreground"><T>{"Son güncelleme:"}</T></strong> <T>{" Haziran 2026"}</T></p>
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
          <T>{"İşbu kullanım koşulları Türkiye Cumhuriyeti kanunlarına tabidir. Taraflar arasında doğabilecek uyuşmazlıklarda öncelikle arabuluculuğa başvurulacak, anlaşma sağlanamaması halinde"}</T><strong className="text-foreground"> <T>{" Kayseri Mahkemeleri ve İcra Daireleri"}</T></strong>
          <T>{" "}</T><T>{"yetkili olacaktır."}</T></p>
        <p className="text-sm text-muted-foreground">
          <T>{"Tüketici hakem heyetlerine başvuru hakkı saklıdır."}</T></p>
      </div>
    ),
  },
  {
    id: "iletisim",
    title: "10. İletişim",
    icon: Mail,
    content: (
      <div className="space-y-3">
        <p><T>{"Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz:"}</T></p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-5 space-y-2 text-sm">
          <p><strong className="text-foreground"><T>{"E-posta:"}</T></strong> <T>{" destek@megdev.info"}</T></p>
          <p><strong className="text-foreground"><T>{"Adres:"}</T></strong> <T>{" Demokrasi Mah 2233. Sk Melikgazi/KAYSERİ"}</T></p>
          <p><strong className="text-foreground"><T>{"Telefon:"}</T></strong> <T>{" +90 537 983 04 14"}</T></p>
        </div>
      </div>
    ),
  },
]

export default function KosullarPage() {
  return (
    <div data-document>
      <PageIntro eyebrow="KULLANIM KOŞULLARI" title="Birlikte çalışmanın koşulları." description="Meg Dev web sitesini kullanırken uymanız gereken koşullar. Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız." />

      <section className="relative py-16 lg:py-24 bg-background/85 border-t border-foreground/10">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.id} id={section.id} className="document-panel scroll-mt-28">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold"><T>{section.title}</T></h2>
                  </div>
                  <T>{section.content}</T>
                </div>
              )
            })}
          </div>

          <div className="mt-12 noise-panel border border-foreground/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3"><T>{"Sorularınız mı var?"}</T></h2>
            <p className="text-muted-foreground mb-6">
              <T>{"Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz."}</T></p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:destek@megdev.info"
                className="inline-flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                <Mail className="w-4 h-4" />
                <T>{"destek@megdev.info"}</T></a>
              <Link href="/contact">
                <span className="inline-flex items-center gap-2 border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 text-foreground px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer">
                  <T>{"İletişim Formu"}</T></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
