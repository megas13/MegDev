import { localizeMetadata } from "@/lib/i18n/server"
import { T } from "@/components/i18n/text"
import { PageIntro } from "@/components/ui/page-intro"
import type { Metadata } from "next"
import {
  Bell,
  Bot,
  Database,
  Lock,
  Mail,
  Megaphone,
  Shield,
  Trash2,
  Users,
} from "lucide-react"

const sourceMetadata: Metadata = {
  title: "SubTrack Gizlilik Sözleşmesi",
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
          <T>{"Hesap oluşturduğunuzda ad, e-posta adresi ve kimlik doğrulama bilgilerini işleriz. Uygulamayı kullandığınızda eklediğiniz abonelikler, fiyatlar, para birimleri, ödeme ve yenileme tarihleri, kategoriler, hatırlatma tercihleri, davet bilgileri ve uygulama ayarları işlenebilir."}</T></p>
        <p>
          <T>{"Uygulama kararlılığı, bildirimler, reklam gösterimi ve güvenlik amacıyla cihaz tanımlayıcıları, uygulama sürümü, işletim sistemi, hata ve temel kullanım verileri de işlenebilir. SubTrack banka hesabınıza bağlanmaz ve kart bilgilerinizi saklamaz."}</T></p>
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
        <T>{"SubTrack; kimlik doğrulama ve veri saklama için Supabase, bildirim ve uygulama altyapısı için Firebase, reklamlar için Google AdMob, Android satın almaları için Google Play, yapay zekâ yanıtları için Groq ve döviz kuru bilgileri için Frankfurter hizmetlerini kullanabilir. Bu sağlayıcılara yalnızca ilgili özelliğin çalışması için gereken veriler aktarılır ve sağlayıcıların kendi gizlilik politikaları uygulanır."}</T></p>
    ),
  },
  {
    id: "satinalmalar-reklamlar",
    title: "4. Satın almalar ve reklamlar",
    icon: Megaphone,
    content: (
      <p>
        <T>{"Google Play üzerinden yapılan ödemeler Google tarafından işlenir. SubTrack tam ödeme kartı bilgilerine erişmez. Ücretsiz kullanıcılar Google AdMob tarafından sunulan reklamları görebilir; yürürlükteki izin ve tercih ayarlarına bağlı olarak reklam tanımlayıcıları kullanılabilir."}</T></p>
    ),
  },
  {
    id: "saklama-guvenlik",
    title: "5. Saklama ve güvenlik",
    icon: Lock,
    content: (
      <p>
        <T>{"Veriler, hizmetin sağlanması ve yasal yükümlülüklerin yerine getirilmesi için gerekli olduğu sürece saklanır. Erişim kontrolleri, kullanıcı bazlı güvenlik politikaları ve şifreli iletişim gibi makul teknik ve organizasyonel önlemler uygulanır. Hiçbir internet hizmeti tamamen risksiz değildir."}</T></p>
    ),
  },
  {
    id: "haklar-veri-silme",
    title: "6. Haklarınız ve veri silme",
    icon: Trash2,
    content: (
      <p>
        <T>{"Uygulama içerisinden verilerinize erişebilir, bilgilerinizi düzeltebilir ve verilerinizi dışa aktarabilirsiniz."}</T><strong className="text-foreground"><T>{"Ayarlar → Hesap → Hesabı sil"}</T></strong> <T>{"yolunu kullanarak hesabınızın ve ilişkili kullanıcı verilerinin silinmesini isteyebilirsiniz. Yasal, güvenlik veya dolandırıcılığı önleme amacıyla tutulması zorunlu sınırlı kayıtlar gerekli süre boyunca saklanabilir."}</T></p>
    ),
  },
  {
    id: "cocuklarin-gizliligi",
    title: "7. Çocukların gizliliği",
    icon: Shield,
    content: (
      <p>
        <T>{"SubTrack özellikle çocuklara yönelik değildir. Geçerli yaş sınırının altındaki çocuklardan bilerek kişisel veri toplamayı amaçlamayız."}</T></p>
    ),
  },
  {
    id: "politika-degisiklikleri",
    title: "8. Politika değişiklikleri",
    icon: Bell,
    content: (
      <p>
        <T>{"Bu politika uygulamadaki veya yasal gerekliliklerdeki değişikliklere göre güncellenebilir. Güncel sürüm bu sayfada ve son güncelleme tarihiyle yayımlanır."}</T></p>
    ),
  },
  {
    id: "iletisim",
    title: "9. İletişim",
    icon: Mail,
    content: (
      <p>
        <T>{"Gizlilik ve veri talepleri için"}</T><T>{" "}</T>
        <a
          href="mailto:destek@megdev.info"
          className="font-semibold text-primary hover:underline"
        >
          <T>{"destek@megdev.info"}</T></a><T>{" "}</T>
        <T>{"adresinden iletişime geçebilirsiniz."}</T></p>
    ),
  },
]

export default function SubTrackGizlilikSozlesmesiPage() {
  return (
    <div data-document>
      <PageIntro eyebrow="SUBTRACK / GİZLİLİK" title="Verileriniz, güvende." description="SubTrack mobil uygulamasında kişisel verilerin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklar." index="02.09.2026" />

      <section className="relative py-16 lg:py-24 bg-background/85 border-t border-foreground/10">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="document-panel scroll-mt-28"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold"><T>{section.title}</T></h2>
                  </div>

                  <div className="leading-7 text-muted-foreground">
                    <T>{section.content}</T>
                    {section.items && (
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span><T>{item}</T></span>
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

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
