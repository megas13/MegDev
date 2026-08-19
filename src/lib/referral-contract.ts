import { createHash } from "node:crypto"

export const REFERRAL_CONTRACT_VERSION = "MB-2026.1"
export const TERMINATION_VERSION = "MB-FESIH-2026.1"

export type ReferralContractInput = {
  providerName: string
  providerAddress: string
  providerTaxNo?: string
  representativeName: string
  representativeEmail: string
  representativePhone?: string
  scope: string
  commissionType: "percentage" | "fixed"
  commissionValue: number
  currency: string
  startDate: string
  endDate?: string
  paymentTerms: string
  specialTerms?: string
}

const clean = (value?: string) => value?.trim() || "Belirtilmemiştir"

export function buildReferralContract(input: ReferralContractInput) {
  const commission = input.commissionType === "percentage"
    ? `%${input.commissionValue}`
    : `${input.commissionValue.toLocaleString("tr-TR")} ${input.currency}`

  return `MÜŞTERİ BULMA VE ARACILIK SÖZLEŞMESİ

Sözleşme Sürümü: ${REFERRAL_CONTRACT_VERSION}

1. TARAFLAR
Hizmet Alan: ${clean(input.providerName)}
Adres: ${clean(input.providerAddress)}
Vergi/kimlik bilgisi: ${clean(input.providerTaxNo)}

Aracı/Temsilci: ${clean(input.representativeName)}
E-posta: ${clean(input.representativeEmail)}
Telefon: ${clean(input.representativePhone)}

2. KONU VE KAPSAM
Aracı, aşağıda belirtilen kapsamda potansiyel müşterileri Hizmet Alan ile buluşturur. Bu sözleşme, aksi ayrıca yazılı kararlaştırılmadıkça işçi-işveren, ortaklık veya acentelik ilişkisi kurmaz.

Kapsam: ${clean(input.scope)}

3. ÜCRET VE HAK EDİŞ
Aracılık bedeli: ${commission}
Ödeme koşulları: ${clean(input.paymentTerms)}
Aracılık bedeli, Aracı tarafından yönlendirildiği kayıtlarla doğrulanabilen müşteriden Hizmet Alan'ın tahsilat yapması üzerine hak edilir. İade, iptal ve kısmi tahsilatların etkisi taraflarca ödeme koşullarında belirtilir.

4. SÜRE
Başlangıç tarihi: ${clean(input.startDate)}
Bitiş tarihi: ${clean(input.endDate)}
Bitiş tarihi belirtilmemişse sözleşme feshedilinceye kadar devam eder.

5. TARAFLARIN YÜKÜMLÜLÜKLERİ
Aracı; yanıltıcı beyanda bulunmamayı, Hizmet Alan adına yetkisiz taahhüt vermemeyi ve müşteri bilgilerini yalnızca bu sözleşmenin amacı için kullanmayı kabul eder. Hizmet Alan, yönlendirilen müşteri ve gerçekleşen tahsilat kayıtlarını doğru tutar ve hak edilen bedeli kararlaştırılan sürede öder.

6. GİZLİLİK VE KİŞİSEL VERİLER
Taraflar, süreçte öğrendikleri ticari ve kişisel verileri yürürlükteki mevzuata uygun, sınırlı ve güvenli biçimde işler; yetkisiz üçüncü kişilerle paylaşmaz.

7. FESİH
Taraflar sözleşmeyi yazılı veya elektronik kayıtla feshedebilir. Fesih, fesih formunda belirtilen tarihte hüküm doğurur. Fesih tarihine kadar doğmuş ücret, iade ve diğer borçlar sona ermez. Fesih sonrasındaki müşteri hak edişlerinin durumu fesih formunda ayrıca gösterilir.

8. DELİL VE ELEKTRONİK KABUL
Taraf; kendisine gönderilen doğrulama kodunu girip açık onay kutusunu işaretleyerek bu metni okuduğunu ve kabul ettiğini beyan eder. Sistem; kabul zamanını, doğrulanmış e-posta adresini, IP ve tarayıcı bilgisini, sözleşme sürümünü ve metin özetini kayıt altına alır.

9. ÖZEL ŞARTLAR
${clean(input.specialTerms)}

10. UYUŞMAZLIKLAR
Taraflar öncelikle uzlaşmayı dener. Emredici yetki kuralları saklı kalmak üzere, uygulanacak hukuk ve yetkili merci somut taraf bilgilerine göre hukuk danışmanı tarafından kesinleştirilmelidir.

Bu metin bir sözleşme taslağıdır. Kullanılmadan önce tarafların gerçek bilgileri ve çalışma modeli bakımından bir hukuk uzmanına inceletilmelidir.`
}

export function buildTerminationText(contract: {
  provider_name: string
  representative_name: string
  contract_version: string
  contract_hash: string
  start_date: string
}, effectiveDate: string, reason: string, settlement: string) {
  return `MÜŞTERİ BULMA VE ARACILIK SÖZLEŞMESİ FESİH / AYRILIK FORMU

Belge Sürümü: ${TERMINATION_VERSION}
Asıl Sözleşme Sürümü: ${contract.contract_version}
Asıl Sözleşme Özeti: ${contract.contract_hash}

Hizmet Alan: ${contract.provider_name}
Aracı/Temsilci: ${contract.representative_name}
Asıl sözleşme başlangıcı: ${contract.start_date}
Feshin hüküm doğuracağı tarih: ${effectiveDate}

Fesih nedeni:
${clean(reason)}

Mali kapanış ve devam eden hak edişler:
${clean(settlement)}

Taraflar, asıl sözleşmenin yukarıdaki tarihte sona ereceğini; ancak bu tarihe kadar doğmuş ücret, ödeme, iade, gizlilik ve kişisel verilerin korunmasına ilişkin yükümlülüklerin niteliği gereği devam edebileceğini kabul eder.

Bu form, asıl sözleşme ve gerçekleşmiş mali hareketleri kendiliğinden silmez. Elektronik onayın zamanı, doğrulanmış e-posta adresi, IP ve tarayıcı bilgisi ile bu metnin özeti kayıt altına alınır.`
}

export function sha256(text: string) {
  return createHash("sha256").update(text, "utf8").digest("hex")
}

export function maskContractEmail(email: string) {
  const [name, domain] = email.split("@")
  if (!name || !domain) return email
  return `${name.slice(0, 2)}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`
}
