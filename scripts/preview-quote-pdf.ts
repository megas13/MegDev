import assert from "node:assert/strict"
import { mkdir, writeFile } from "node:fs/promises"
import { PDFDocument } from "pdf-lib"
import { createQuotePdf } from "../src/lib/quote-pdf"
import { buildQuoteEmail } from "../src/lib/quote-email"

// Synthetic quotes only. Never send test emails or create production database rows.
const sample = {
  quote_number: "TKL-202609-MEGDEV",
  customer_name: "Ayşe Gül Şahin",
  customer_company: "FK Güzellik & Bakım Stüdyosu",
  customer_email: "ayse@example.com",
  customer_phone: "+90 555 000 00 00",
  token: "ornek-teklif-yalnizca-tasarim-onizlemesi",
  status: "sent", currency: "TRY", created_at: "2026-09-22T09:00:00Z", valid_until: "2026-10-06",
  items: [
    { description: "Kurumsal web sitesi tasarımı ve geliştirme\nMarka kimliğine uygun, mobil uyumlu arayüz; hizmet sayfaları, galeri ve iletişim alanları.", quantity: 1, unit_price: 25000 },
    { description: "İçerik girişi ve sayfa düzenleme\nMevcut metin ve görsellerin beş hizmet sayfasına yerleştirilmesi.", quantity: 5, unit_price: 1500 },
    { description: "SEO başlangıç yapılandırması\nSayfa başlıkları, meta açıklamaları ve site haritasının hazırlanması.", quantity: 1, unit_price: 5000 },
  ],
  subtotal: 37500, discount_type: "percentage", discount_value: 10, discount_total: 3750,
  tax_rate: 20, tax_total: 6750, total: 40500,
  notes: "ÇALIŞMA KAPSAMI\nBu örnek teklif; kurumsal tanıtım sitesi, içerik girişi ve SEO başlangıç yapılandırmasını kapsar.\n\nTESLİM VE ÖDEME\nTakvim ve ödeme planı, kapsamın müşteri tarafından onaylanmasının ardından taraflarca netleştirilecektir.\n\nMÜŞTERİDEN BEKLENENLER\nLogo, kullanılacak metinler ve görseller müşteri tarafından sağlanacaktır. Kapsam dışı talepler ayrıca değerlendirilir.",
}

async function main() {
  await mkdir("tmp/pdfs", { recursive: true })
  const email = buildQuoteEmail(sample, `https://megdev.com.tr/teklif/${sample.token}`)
  assert.ok(email.html.includes("BİRİM FİYAT"))
  assert.ok(email.text.includes("KDV matrahı"))
  assert.ok(email.html.includes(`/api/quotes/public/${sample.token}/pdf`))
  const escaped = buildQuoteEmail({ ...sample, customer_name: '<script>alert("x")</script>', notes: '<img src=x onerror=alert(1)>', items: [{ description: '<a href="javascript:alert(1)">test</a>', quantity: 1, unit_price: 10 }] }, `https://megdev.com.tr/teklif/${sample.token}`)
  assert.ok(!escaped.html.includes("<script>"))
  assert.ok(!escaped.html.includes("<img src=x"))
  assert.ok(escaped.html.includes("&lt;script&gt;"))
  assert.throws(() => buildQuoteEmail(sample, "javascript:alert(1)"), /Geçersiz/)
  await writeFile("tmp/pdfs/megdev-teklif-email.html", email.html)
  await writeFile("tmp/pdfs/megdev-teklif-email.txt", email.text)
  const variants = {
    "megdev-teklif": sample,
    "megdev-teklif-uzun": { ...sample, items: Array.from({ length: 28 }, (_, i) => ({ ...sample.items[i % 3], description: `Kalem ${i + 1}: ${sample.items[i % 3].description}` })), notes: `${sample.notes}\n\n${"Uzun not: ödeme, kapsam, müşteri görüşleri ve Türkçe karakterler: İ ı Ş ş Ğ ğ Ç ç Ö ö Ü ü. ".repeat(130)}\nNOTLARIN SONU`, subtotal: 360000, discount_total: 36000, tax_total: 64800, total: 388800 },
    "megdev-teklif-kenar": { ...sample, customer_name: "Çok uzun şirket ve yetkili adı ".repeat(14), items: [{ description: `${"KesilmeyenAçıklama".repeat(80)}\n${"Çok uzun hizmet açıklaması. ".repeat(190)} AÇIKLAMANIN SONU`, quantity: .5, unit_price: 1987654321.98 }], notes: "", discount_type: "fixed", discount_value: 0, discount_total: 0, tax_rate: 0, tax_total: 0, subtotal: 993827160.99, total: 993827160.99 },
  }
  for (const [name, quote] of Object.entries(variants)) {
    const bytes = await createQuotePdf(quote)
    const doc = await PDFDocument.load(bytes)
    assert.equal(doc.getAuthor(), "Meg Dev")
    assert.ok(doc.getPageCount() >= 2)
    await writeFile(`tmp/pdfs/${name}.pdf`, bytes)
    console.log(`${name}: ${doc.getPageCount()} pages, ${bytes.length} bytes`)
  }
}
void main()
