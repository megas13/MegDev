export const NDA_VERSION = "2026-08-11-v1"

export function buildNdaText(customerName: string, projectTitle: string) {
  return `GİZLİLİK SÖZLEŞMESİ

Taraflar
Bu sözleşme, hizmet sağlayıcı Meg Dev ile ${customerName} (Müşteri) arasında, ${projectTitle} projesine ilişkin görüşmeler kapsamında kurulmuştur.

1. Amaç ve kapsam
Tarafların proje görüşmeleri, teklif, tasarım, yazılım, iş modeli, fiyatlandırma, erişim bilgileri, müşteri verileri, teknik dokümanlar ve benzeri yollarla birbirlerine açıkladıkları kamuya açık olmayan bilgiler gizli bilgi kabul edilir.

2. Kullanım amacı
Gizli bilgiler yalnızca projenin değerlendirilmesi, planlanması, geliştirilmesi ve yürütülmesi amacıyla kullanılabilir. Karşı tarafın yazılı izni olmadan üçüncü kişilerle paylaşılamaz.

3. Koruma yükümlülüğü
Taraflar gizli bilgileri makul teknik ve idari önlemlerle korur. Bilgilere yalnızca proje için bilmesi gereken çalışanların ve hizmet sağlayıcıların erişmesine izin verir ve bu kişilerin de gizlilik yükümlülüğüne uymasını sağlar.

4. Kapsam dışı bilgiler
Kamuya açık olan, alıcı tarafın kusuru olmadan sonradan kamuya açılan, açıklanmadan önce hukuka uygun şekilde bilinen veya üçüncü bir kişiden hukuka uygun şekilde elde edilen bilgiler gizli bilgi sayılmaz. Kanuni bir zorunluluk nedeniyle açıklama yapılması gerekiyorsa, hukuken mümkün olduğu ölçüde diğer tarafa önceden bilgi verilir.

5. Fikri mülkiyet
Gizli bilginin açıklanması; marka, tasarım, yazılım, kaynak kod, fikir veya diğer fikri mülkiyet haklarının devredildiği anlamına gelmez.

6. Süre ve iade
Gizlilik yükümlülüğü kabul tarihinden itibaren üç yıl devam eder. Ticari sır niteliğindeki bilgiler bakımından yükümlülük, bilgi ticari sır niteliğini koruduğu sürece geçerlidir. Talep halinde gizli bilgi içeren kayıtlar, kanuni saklama yükümlülükleri hariç olmak üzere silinir veya iade edilir.

7. Elektronik kabul ve kayıtlar
Müşteri, doğrulanmış e-posta adresine gönderilen kodu kullanarak bu metni elektronik ortamda kabul eder. Kabul tarihi, sözleşme sürümü, sözleşme özeti, proje ve müşteri bilgileri ile güvenlik ve işlem kayıtları ispat ve güvenlik amacıyla saklanır.

8. Kişisel veriler
Kişisel veriler yalnızca sözleşmenin kurulması, ifası, güvenliğinin sağlanması ve bir hakkın tesisi, kullanılması veya korunması amaçlarıyla ilgili mevzuata uygun olarak işlenir. Ticari ileti izni bu kabulün kapsamında değildir.

9. Uyuşmazlıklar
Taraflar uyuşmazlıkları öncelikle iyi niyetle ve görüşme yoluyla çözmeye çalışır. Emredici yetki kuralları saklıdır.

Müşteri, sözleşmenin tamamını okuduğunu, anladığını ve hükümlerini kabul ettiğini beyan eder.`
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@")
  if (!name || !domain) return email
  return `${name.slice(0, 2)}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`
}
