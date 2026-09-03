import type { Metadata } from "next"
import {
  Bell,
  Bot,
  Database,
  FileText,
  Lock,
  Mail,
  Megaphone,
  Shield,
  Trash2,
  Users,
} from "lucide-react"

export const metadata: Metadata = {
  title: "SubTrack Gizlilik Sözleşmesi | Meg Dev",
  description:
    "SubTrack mobil uygulamasında kişisel verilerin toplanması, kullanılması, saklanması ve korunmasına ilişkin gizlilik politikası.",
}

const sections = [
  {
    id: "toplanan-bilgiler",
    title: "1. Topladığımız bilgiler",
    icon: Database,
    content: (
      <div className="space-y-4">
        <p>
          Hesap oluşturduğunuzda ad, e-posta adresi ve kimlik doğrulama
          bilgilerini işleriz. Uygulamayı kullandığınızda eklediğiniz
          abonelikler, fiyatlar, para birimleri, ödeme ve yenileme tarihleri,
          kategoriler, hatırlatma tercihleri, davet bilgileri ve uygulama
          ayarları işlenebilir.
        </p>
        <p>
          Uygulama kararlılığı, bildirimler, reklam gösterimi ve güvenlik
          amacıyla cihaz tanımlayıcıları, uygulama sürümü, işletim sistemi,
          hata ve temel kullanım verileri de işlenebilir. SubTrack banka
          hesabınıza bağlanmaz ve kart bilgilerinizi saklamaz.
        </p>
      </div>
    ),
  },
  {
    id: "kullanim-amaclari",
    title: "2. Verileri kullanma amaçlarımız",
    icon: Bot,
    items: [
      "Hesabınızı oluşturmak ve güvenli oturum açmayı sağlamak",
      "Aboneliklerinizi eşitlemek, analiz etmek ve ödeme hatırlatmaları göndermek",
      "Premium satın alma durumunu doğrulamak ve davet ödüllerini yönetmek",
      "Yapay zekâ destekli, kullanıcı tarafından talep edilen analizleri üretmek",
      "Dolandırıcılığı önlemek, hataları gidermek ve uygulamayı geliştirmek",
    ],
  },
  {
    id: "hizmet-saglayicilar",
    title: "3. Hizmet sağlayıcılar",
    icon: Users,
    content: (
      <p>
        SubTrack; kimlik doğrulama ve veri saklama için Supabase, bildirim ve
        uygulama altyapısı için Firebase, reklamlar için Google AdMob, Android
        satın almaları için Google Play, yapay zekâ yanıtları için Groq ve
        döviz kuru bilgileri için Frankfurter hizmetlerini kullanabilir. Bu
        sağlayıcılara yalnızca ilgili özelliğin çalışması için gereken veriler
        aktarılır ve sağlayıcıların kendi gizlilik politikaları uygulanır.
      </p>
    ),
  },
  {
    id: "satinalmalar-reklamlar",
    title: "4. Satın almalar ve reklamlar",
    icon: Megaphone,
    content: (
      <p>
        Google Play üzerinden yapılan ödemeler Google tarafından işlenir.
        SubTrack tam ödeme kartı bilgilerine erişmez. Ücretsiz kullanıcılar
        Google AdMob tarafından sunulan reklamları görebilir; yürürlükteki
        izin ve tercih ayarlarına bağlı olarak reklam tanımlayıcıları
        kullanılabilir.
      </p>
    ),
  },
  {
    id: "saklama-guvenlik",
    title: "5. Saklama ve güvenlik",
    icon: Lock,
    content: (
      <p>
        Veriler, hizmetin sağlanması ve yasal yükümlülüklerin yerine
        getirilmesi için gerekli olduğu sürece saklanır. Erişim kontrolleri,
        kullanıcı bazlı güvenlik politikaları ve şifreli iletişim gibi makul
        teknik ve organizasyonel önlemler uygulanır. Hiçbir internet hizmeti
        tamamen risksiz değildir.
      </p>
    ),
  },
  {
    id: "haklar-veri-silme",
    title: "6. Haklarınız ve veri silme",
    icon: Trash2,
    content: (
      <p>
        Uygulama içerisinden verilerinize erişebilir, bilgilerinizi
        düzeltebilir ve verilerinizi dışa aktarabilirsiniz. <strong className="text-foreground">Ayarlar → Hesap → Hesabı sil</strong> yolunu
        kullanarak hesabınızın ve ilişkili kullanıcı verilerinin silinmesini
        isteyebilirsiniz. Yasal, güvenlik veya dolandırıcılığı önleme amacıyla
        tutulması zorunlu sınırlı kayıtlar gerekli süre boyunca saklanabilir.
      </p>
    ),
  },
  {
    id: "cocuklarin-gizliligi",
    title: "7. Çocukların gizliliği",
    icon: Shield,
    content: (
      <p>
        SubTrack özellikle çocuklara yönelik değildir. Geçerli yaş sınırının
        altındaki çocuklardan bilerek kişisel veri toplamayı amaçlamayız.
      </p>
    ),
  },
  {
    id: "politika-degisiklikleri",
    title: "8. Politika değişiklikleri",
    icon: Bell,
    content: (
      <p>
        Bu politika uygulamadaki veya yasal gerekliliklerdeki değişikliklere
        göre güncellenebilir. Güncel sürüm bu sayfada ve son güncelleme
        tarihiyle yayımlanır.
      </p>
    ),
  },
  {
    id: "iletisim",
    title: "9. İletişim",
    icon: Mail,
    content: (
      <p>
        Gizlilik ve veri talepleri için{" "}
        <a
          href="mailto:destek@megdev.info"
          className="font-semibold text-primary hover:underline"
        >
          destek@megdev.info
        </a>{" "}
        adresinden iletişime geçebilirsiniz.
      </p>
    ),
  },
]

export default function SubTrackGizlilikSozlesmesiPage() {
  return (
    <div className="pt-20">
      <div className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            SubTrack
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            <span className="text-gradient">Gizlilik Sözleşmesi</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            SubTrack mobil uygulamasında kişisel verilerin nasıl toplandığını,
            kullanıldığını, saklandığını ve korunduğunu açıklar.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            Son güncelleme: 2 Eylül 2026
          </p>
        </div>
      </div>

      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="sharp-panel rounded-2xl p-6 sm:p-8"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>

                  <div className="leading-7 text-muted-foreground">
                    {section.content}
                    {section.items && (
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
