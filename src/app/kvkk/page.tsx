import type { Metadata } from "next"
import { Shield, Database, Eye, Users, Cookie, Scale, Mail, Lock, Trash2, FileText, ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "KVKK & Gizlilik Politikası | Meg Dev",
  description:
    "Meg Dev olarak kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı KVKK kapsamında veri işleme politikamız.",
}

const sections = [
  {
    id: "veri-sorumlusu",
    title: "1. Veri Sorumlusu",
    icon: Shield,
    content: (
      <div className="space-y-3">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca,
          kişisel verileriniz; veri sorumlusu sıfatıyla Meg Dev ("Şirket")
          tarafından aşağıda açıklanan kapsamda işlenebilecektir.
        </p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-5 space-y-2 text-sm">
          <p><strong className="text-foreground">Şirket:</strong> Meg Dev</p>
          <p><strong className="text-foreground">Adres:</strong> Demokrasi Mah 2233. Sk Melikgazi/KAYSERİ</p>
          <p><strong className="text-foreground">E-posta:</strong> destek@megdev.info</p>
          <p><strong className="text-foreground">Telefon:</strong> +90 537 983 04 14</p>
        </div>
      </div>
    ),
  },
  {
    id: "toplanan-veriler",
    title: "2. İşlenen Kişisel Veriler",
    icon: Database,
    content: (
      <div className="space-y-3">
        <p>
          Hizmetlerimizden yararlanmanız sırasında aşağıdaki kişisel verileriniz
          toplanabilmektedir:
        </p>
        <ul className="space-y-2">
          {[
            ["Kimlik Bilgileri", "Ad, soyad"],
            ["İletişim Bilgileri", "E-posta adresi, telefon numarası, adres"],
            ["Müşteri Bilgileri", "Firma adı, vergi bilgileri, proje detayları"],
            ["İşlem Bilgileri", "IP adresi, ziyaret tarih/saat bilgileri, tarayıcı türü, işletim sistemi"],
            ["İletişim Kayıtları", "İletişim formu mesajları, e-posta yazışmaları, çağrı kayıtları"],
          ].map(([title, desc]) => (
            <li key={title} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground">{title}:</strong>{" "}
                <span className="text-muted-foreground">{desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "amaci",
    title: "3. Veri İşleme Amaçları ve Hukuki Sebepler",
    icon: Eye,
    content: (
      <div className="space-y-3">
        <p>Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen hukuki sebepler kapsamında şu amaçlarla işlenmektedir:</p>
        <ul className="space-y-2">
          {[
            "Hizmetlerimizin sunulması, yürütülmesi ve geliştirilmesi (sözleşmenin ifası)",
            "Müşteri iletişimi ve destek hizmetlerinin sağlanması (sözleşmenin ifası)",
            "Proje takip ve yönetim süreçlerinin yürütülmesi (sözleşmenin ifası)",
            "İletişim taleplerinin yanıtlanması (ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaati)",
            "Yasal yükümlülüklerin yerine getirilmesi (hukuki yükümlülük)",
            "İş süreçlerinin planlanması ve raporlanması (meşru menfaat)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "aktarma",
    title: "4. Kişisel Verilerin Aktarılması",
    icon: Users,
    content: (
      <div className="space-y-3">
        <p>
          Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar
          çerçevesinde aşağıdaki alıcı gruplarına aktarılabilir:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "Nhost (Almanya)", desc: "Bulut veritabanı altyapısı" },
            { name: "Vercel (ABD)", desc: "Web sitesi barındırma hizmeti" },
            { name: "Maileroo", desc: "E-posta gönderim hizmeti" },
            { name: "Yetkili Kamu Kurumları", desc: "Hukuki yükümlülükler gereği" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4">
              <p className="font-semibold text-sm text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Yurt dışına aktarımda, verilerin aktarıldığı ülkelerde yeterli korumanın
          bulunmaması halinde KVKK'nın öngördüğü güvenceler sağlanmaktadır.
        </p>
      </div>
    ),
  },
  {
    id: "cerezler",
    title: "5. Çerez Politikası",
    icon: Cookie,
    content: (
      <div className="space-y-3">
        <p>
          Web sitemizde yalnızca zorunlu teknik çerezler kullanılmaktadır.
          Üçüncü taraf reklam veya izleme çerezleri kullanılmamaktadır.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "Oturum Çerezleri", desc: "Site içi gezinmeyi sağlar, oturum sonunda silinir" },
            { name: "Performans Çerezleri", desc: "Site hızı ve kullanım istatistikleri (Vercel Analytics)" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4">
              <p className="font-semibold text-sm text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Tarayıcı ayarlarından çerez tercihlerinizi yönetebilir, çerezleri
          silebilir veya engelleyebilirsiniz.
        </p>
      </div>
    ),
  },
  {
    id: "haklar",
    title: "6. KVKK Kapsamındaki Haklarınız",
    icon: Scale,
    content: (
      <div className="space-y-3">
        <p>
          KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
        </p>
        <ul className="space-y-2">
          {[
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
            "İşlenmişse buna ilişkin bilgi talep etme",
            "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
            "Yurt içi veya yurt dışında aktarıldığı üçüncü kişileri bilme",
            "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
            "KVKK şartları çerçevesinde silinmesini veya yok edilmesini isteme",
            "Aktarıldığı üçüncü kişilere bildirilmesini isteme",
            "Münhasıran otomatik sistemlerle analiz edilmesine itiraz etme",
            "Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "basvuru",
    title: "7. Başvuru ve İletişim",
    icon: Mail,
    content: (
      <div className="space-y-3">
        <p>
          Yukarıda belirtilen haklarınızı kullanmak için başvurunuzu
          aşağıdaki kanallardan iletebilirsiniz:
        </p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-5 space-y-2 text-sm">
          <p><strong className="text-foreground">E-posta:</strong> destek@megdev.info</p>
          <p><strong className="text-foreground">Adres:</strong> Demokrasi Mah 2233. Sk Melikgazi/KAYSERİ</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Başvurunuz, talebin niteliğine göre en geç 30 gün içinde ücretsiz
          olarak sonuçlandırılacaktır. Kimliğinizi doğrulamak amacıyla ek bilgi
          talep edilebilir.
        </p>
      </div>
    ),
  },
  {
    id: "guvenlik",
    title: "8. Veri Güvenliği",
    icon: Lock,
    content: (
      <div className="space-y-3">
        <p>Kişisel verilerinizin güvenliği için aşağıdaki önlemler alınmaktadır:</p>
        <ul className="space-y-2">
          {[
            "SSL/TLS şifreleme ile güvenli veri iletimi",
            "Güvenli bulut altyapısı (Nhost) ile veri depolama",
            "Düzenli güvenlik yedeklemeleri ve felaket senaryosu planı",
            "Güvenlik duvarı ve yetkisiz erişime karşı erişim kontrolleri",
            "Çalışanlar için periyodik veri gizliliği ve güvenlik eğitimleri",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "saklama",
    title: "9. Veri Saklama ve İmha",
    icon: Trash2,
    content: (
      <div className="space-y-3">
        <p>
          Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve
          yasal yükümlülükler çerçevesinde saklanır:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: "İletişim Formu Mesajları", desc: "1 yıl" },
            { name: "Proje Verileri", desc: "Proje tesliminden itibaren 3 yıl" },
            { name: "E-posta Yazışmaları", desc: "2 yıl" },
            { name: "Log Kayıtları", desc: "1 yıl" },
          ].map((item) => (
            <div key={item.name} className="bg-background/50 border border-foreground/10 rounded-xl p-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-semibold text-primary">{item.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Süre sonunda verileriniz güvenli bir şekilde silinir, yok edilir veya
          anonim hale getirilir.
        </p>
      </div>
    ),
  },
  {
    id: "guncelleme",
    title: "10. Politika Güncellemeleri",
    icon: FileText,
    content: (
      <div className="space-y-3">
        <p>
          Bu gizlilik politikası gerektiğinde güncellenebilir. Güncellemeler
          web sitemizde yayınlandığı tarihte yürürlüğe girer. Önemli
          değişikliklerde e-posta yoluyla bilgilendirme yapılabilir.
        </p>
        <div className="bg-background/50 border border-foreground/10 rounded-xl p-4 text-sm">
          <p><strong className="text-foreground">Son güncelleme:</strong> Haziran 2026</p>
        </div>
      </div>
    ),
  },
]

export default function KVVKPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">KVKK & Gizlilik Politikası</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel
            verilerinizin işlenmesine ilişkin politikamız.
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
              KVKK ve kişisel verilerinizin işlenmesi hakkında sorularınız için
              bizimle iletişime geçebilirsiniz.
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
