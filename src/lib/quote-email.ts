import { money, type QuoteItem } from "@/lib/quotes"

function escape(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
}

function date(value: unknown) {
  if (!value) return "Belirtilmedi"
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? "Belirtilmedi" : new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Istanbul",
  }).format(parsed)
}

export function buildQuoteEmail(quote: Record<string, unknown>, url: string) {
  const link = new URL(url)
  if (!["https:", "http:"].includes(link.protocol)) throw new Error("Geçersiz teklif bağlantısı")
  const items = (Array.isArray(quote.items) ? quote.items : []) as QuoteItem[]
  const currency = String(quote.currency || "TRY")
  const amount = (value: unknown) => money(Number(value) || 0, currency)
  const quantity = (value: unknown) => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 4 }).format(Number(value) || 0)
  const htmlLines = (value: unknown) => escape(value).replace(/\r?\n/g, "<br>")
  const pdfUrl = new URL(`/api/quotes/public/${encodeURIComponent(String(quote.token || link.pathname.split("/").pop() || ""))}/pdf`, link.origin).href
  const discountLabel = quote.discount_type === "percentage" ? `İndirim (%${quantity(quote.discount_value)})` : "İndirim (sabit tutar)"
  const totals: [string, string][] = [
    ["Hizmetler toplamı", amount(quote.subtotal)],
    [discountLabel, `-${amount(quote.discount_total)}`],
    ["KDV matrahı (indirim sonrası)", amount(Number(quote.subtotal) - Number(quote.discount_total))],
    [`KDV (%${quantity(quote.tax_rate)})`, amount(quote.tax_total)],
  ]
  const rows = items.map((item, index) => `<tr>
    <td class="item-cell" style="padding:18px 12px;border-bottom:1px solid #33352b;color:#f7f3ea;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;font-size:13px;line-height:21px;">
      <span style="display:block;font-size:10px;line-height:20px;font-weight:bold;color:#39d0c2;">${String(index + 1).padStart(2, "0")}</span>${htmlLines(item.description)}
    </td>
    <td class="item-cell number-cell" style="padding:38px 6px 18px;border-bottom:1px solid #33352b;color:#b8afa1;vertical-align:top;text-align:right;overflow-wrap:anywhere;font-size:12px;">${escape(quantity(item.quantity))}</td>
    <td class="item-cell number-cell" style="padding:38px 6px 18px;border-bottom:1px solid #33352b;color:#b8afa1;vertical-align:top;text-align:right;overflow-wrap:anywhere;font-size:12px;">${escape(amount(item.unit_price))}</td>
    <td class="item-cell number-cell" style="padding:38px 12px 18px 6px;border-bottom:1px solid #33352b;color:#f7f3ea;vertical-align:top;text-align:right;overflow-wrap:anywhere;font-size:12px;font-weight:bold;">${escape(amount(item.quantity * item.unit_price))}</td>
  </tr>`).join("")
  const metadata = [
    ["MÜŞTERİ", quote.customer_name],
    ...(quote.customer_company ? [["ŞİRKET", quote.customer_company]] : []),
    ["E-POSTA", quote.customer_email],
    ...(quote.customer_phone ? [["TELEFON", quote.customer_phone]] : []),
  ].map(([label, value]) => `<tr><td class="info-label" style="width:115px;padding:6px 12px 6px 0;vertical-align:top;color:#b8afa1;font-size:10px;font-weight:bold;">${escape(label)}</td><td style="padding:6px 0;color:#f7f3ea;font-size:13px;line-height:20px;overflow-wrap:anywhere;word-break:break-word;">${escape(value)}</td></tr>`).join("")

  const text = [
    `MEG DEV | ${quote.quote_number}`, `Merhaba ${quote.customer_name},`,
    "Size özel hizmet teklifimizi aşağıda inceleyebilirsiniz.",
    quote.customer_company ? `Şirket: ${quote.customer_company}` : "",
    `Müşteri e-postası: ${quote.customer_email}`,
    `Teklif tarihi: ${date(quote.created_at)}`, `Son geçerlilik: ${date(quote.valid_until)}`,
    "HİZMET DÖKÜMÜ",
    ...items.map((item, index) => `${index + 1}. ${item.description}\nAdet: ${quantity(item.quantity)} | Birim fiyat: ${amount(item.unit_price)} | Tutar: ${amount(item.quantity * item.unit_price)}`),
    "MALİ ÖZET", ...totals.map(([label, value]) => `${label}: ${value}`), `GENEL TOPLAM: ${amount(quote.total)}`,
    "TEKLİF NOTLARI", String(quote.notes || "Bu teklif için ek not belirtilmemiştir."),
    `Teklifi görüntüle: ${link.href}`, `PDF indir: ${pdfUrl}`,
    "Sorularınız ve değişiklik talepleriniz için teklif numaranızla bize ulaşabilirsiniz.",
    "Meg Dev | destek@megdev.info | megdev.com.tr",
  ].filter(Boolean).join("\n\n")

  return {
    subject: `Meg Dev teklifiniz | ${String(quote.quote_number).replace(/[\r\n]/g, " ")}`,
    text,
    html: `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>Meg Dev - ${escape(quote.quote_number)}</title>
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%} table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt} a{color:#39d0c2} body{margin:0;padding:0;width:100%!important}
  @media only screen and (max-width:600px){.outer{padding:12px 0!important}.pad{padding-left:18px!important;padding-right:18px!important}.headline{font-size:32px!important;line-height:39px!important}.total{font-size:29px!important}.item-cell{padding-left:5px!important;padding-right:5px!important;font-size:11px!important;line-height:17px!important}.number-cell{font-size:10px!important}.info-label{width:82px!important}.button-cell{display:block!important;width:100%!important;padding:0 0 10px!important}.date-card{font-size:11px!important}.fine{font-size:10px!important}}
</style></head>
<body style="margin:0;background-color:#10100d;color:#f7f3ea;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;font-size:1px;line-height:1px;color:#10100d;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escape(quote.customer_name)}, ${escape(quote.quote_number)} numaralı teklifiniz: ${escape(amount(quote.total))}. Son geçerlilik: ${escape(date(quote.valid_until))}.</div>
<table role="presentation" width="100%" bgcolor="#10100d"><tr><td class="outer" align="center" style="padding:32px 12px;">
<!--[if mso]><table role="presentation" width="680"><tr><td><![endif]-->
<table role="presentation" width="100%" style="max-width:680px;background-color:#191a16;border:1px solid #33352b;">
  <tr><td height="5" bgcolor="#d7ff43" style="height:5px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
  <tr><td class="pad" style="padding:32px 36px 24px;">
    <table role="presentation" width="100%"><tr><td style="font-size:28px;line-height:32px;font-weight:900;"><span style="color:#d7ff43;">Meg</span> <span style="color:#39d0c2;">Dev</span></td><td align="right" style="font-size:11px;font-weight:bold;color:#f7f3ea;overflow-wrap:anywhere;">${escape(quote.quote_number)}</td></tr><tr><td colspan="2" style="padding-top:9px;color:#b8afa1;font-size:9px;letter-spacing:1.5px;">YAZILIM &amp; DİJİTAL ÇÖZÜMLER</td></tr></table>
  </td></tr>
  <tr><td class="pad" style="padding:28px 36px 32px;background-color:#10100d;">
    <p style="margin:0 0 14px;color:#39d0c2;font-size:11px;letter-spacing:1.8px;font-weight:bold;">SİZE ÖZEL HİZMET TEKLİFİ</p>
    <h1 class="headline" style="margin:0;color:#f7f3ea;font-size:43px;line-height:51px;font-weight:900;">Birlikte <span style="color:#d7ff43;">üretelim.</span></h1>
    <p style="margin:20px 0 0;color:#f7f3ea;font-size:16px;line-height:25px;overflow-wrap:anywhere;">Merhaba ${escape(quote.customer_name)},</p>
    <p style="margin:9px 0 0;color:#b8afa1;font-size:14px;line-height:24px;">İhtiyaçlarınıza özel hizmet kapsamını ve fiyatlandırmayı hazırladık. Ayrıntıları aşağıda inceleyebilir, teklif sayfanızdan yanıtınızı iletebilirsiniz.</p>
  </td></tr>
  <tr><td class="pad" style="padding:26px 36px;">
    <table role="presentation" width="100%" style="table-layout:fixed;">${metadata}</table>
    <table role="presentation" width="100%" style="margin-top:20px;table-layout:fixed;"><tr><td style="width:50%;padding:14px;background:#24261e;border-right:6px solid #191a16;"><span style="color:#b8afa1;font-size:9px;font-weight:bold;">TEKLİF TARİHİ</span><p class="date-card" style="margin:9px 0 0;font-size:13px;color:#f7f3ea;font-weight:bold;">${escape(date(quote.created_at))}</p></td><td style="width:50%;padding:14px;background:#24261e;"><span style="color:#b8afa1;font-size:9px;font-weight:bold;">SON GEÇERLİLİK</span><p class="date-card" style="margin:9px 0 0;font-size:13px;color:#d7ff43;font-weight:bold;">${escape(date(quote.valid_until))}</p></td></tr></table>
  </td></tr>
  <tr><td class="pad" style="padding:4px 36px 28px;">
    <table role="presentation" width="100%" bgcolor="#d7ff43"><tr><td style="padding:23px;color:#10100d;"><p style="margin:0;font-size:11px;letter-spacing:1px;font-weight:bold;">TEKLİF TOPLAMI</p><p class="total" style="margin:10px 0 12px;font-size:39px;line-height:1.2;font-weight:900;overflow-wrap:anywhere;">${escape(amount(quote.total))}</p><p class="fine" style="margin:0;font-size:12px;line-height:19px;">${items.length} hizmet kalemi &nbsp;/&nbsp; ${escape(currency)} &nbsp;/&nbsp; İndirim ve KDV sonrası toplam</p></td></tr></table>
  </td></tr>
  <tr><td class="pad" style="padding:0 36px 28px;">
    <p style="margin:0 0 8px;color:#39d0c2;font-size:10px;font-weight:bold;letter-spacing:1.5px;">01 / HİZMET DÖKÜMÜ</p><h2 style="margin:0 0 20px;color:#f7f3ea;font-size:23px;line-height:30px;">Her kalemiyle şeffaf.</h2>
    <table width="100%" aria-label="Teklif hizmetleri" style="table-layout:fixed;border:1px solid #33352b;"><thead><tr bgcolor="#24261e"><th class="item-cell" scope="col" align="left" style="width:46%;padding:12px;color:#d7ff43;font-size:10px;">HİZMET</th><th class="item-cell" scope="col" align="right" style="width:10%;padding:12px 6px;color:#d7ff43;font-size:10px;">ADET</th><th class="item-cell" scope="col" align="right" style="width:21%;padding:12px 6px;color:#d7ff43;font-size:10px;">BİRİM FİYAT</th><th class="item-cell" scope="col" align="right" style="width:23%;padding:12px;color:#d7ff43;font-size:10px;">TUTAR</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="margin:12px 0 0;color:#b8afa1;font-size:11px;line-height:18px;">Kalem tutarları adet × birim fiyat olarak hesaplanır. İndirim ve KDV teklif geneline uygulanır.</p>
  </td></tr>
  <tr><td class="pad" style="padding:0 36px 28px;">
    <p style="margin:0 0 14px;color:#39d0c2;font-size:10px;font-weight:bold;letter-spacing:1.5px;">02 / MALİ ÖZET</p>
    <table role="presentation" width="100%">${totals.map(([label, value]) => `<tr><td style="padding:9px 10px 9px 0;color:#b8afa1;font-size:13px;">${escape(label)}</td><td align="right" style="padding:9px 0;color:#f7f3ea;font-size:13px;">${escape(value)}</td></tr>`).join("")}
      <tr bgcolor="#24261e"><td style="padding:17px 12px;border-left:3px solid #39d0c2;color:#39d0c2;font-size:12px;font-weight:bold;">GENEL TOPLAM</td><td align="right" style="padding:17px 12px;color:#d7ff43;font-size:20px;font-weight:900;">${escape(amount(quote.total))}</td></tr>
    </table>
  </td></tr>
  <tr><td class="pad" style="padding:0 36px 28px;">
    <p style="margin:0 0 9px;color:#39d0c2;font-size:10px;font-weight:bold;letter-spacing:1.5px;">03 / TEKLİF NOTLARI</p><h2 style="margin:0 0 15px;color:#f7f3ea;font-size:23px;">Kapsam ve koşullar</h2>
    <div style="padding:18px;border:1px solid #33352b;color:#f7f3ea;font-size:13px;line-height:23px;overflow-wrap:anywhere;word-break:break-word;">${htmlLines(quote.notes || "Bu teklif için ek not belirtilmemiştir.")}</div>
    <p style="margin:16px 0 0;color:#b8afa1;font-size:12px;line-height:21px;">Son geçerlilik tarihi: <strong style="color:#f7f3ea;">${escape(date(quote.valid_until))}</strong>. Fiyat ve kapsamla ilgili değişiklik taleplerinizi teklif numaranızla bize iletebilirsiniz.</p>
  </td></tr>
  <tr><td class="pad" style="padding:0 36px 30px;">
    <table role="presentation" width="100%"><tr><td class="button-cell" style="width:60%;padding-right:12px;"><table role="presentation" width="100%"><tr><td align="center" bgcolor="#d7ff43" style="border:1px solid #d7ff43;border-radius:8px;"><a href="${escape(link.href)}" style="display:block;padding:17px 12px;color:#10100d;text-decoration:none;font-size:14px;font-weight:bold;">Teklifi görüntüle ve yanıtla &rarr;</a></td></tr></table></td><td class="button-cell" style="width:40%;"><table role="presentation" width="100%"><tr><td align="center" style="border:1px solid #39d0c2;border-radius:8px;"><a href="${escape(pdfUrl)}" style="display:block;padding:17px 12px;color:#39d0c2;text-decoration:none;font-size:14px;font-weight:bold;">PDF teklifini indir</a></td></tr></table></td></tr></table>
    <p style="margin:16px 0 0;color:#b8afa1;font-size:11px;line-height:18px;">Bağlantı size özel teklif sayfasını açar. Kabul veya ret işlemi sayfa üzerinden gerçekleştirilir.</p>
  </td></tr>
  <tr><td class="pad" style="padding:26px 36px;background:#10100d;border-top:1px solid #33352b;"><p style="margin:0 0 10px;font-size:16px;font-weight:bold;color:#d7ff43;">Bir sonraki adımı birlikte atalım.</p><p style="margin:0 0 16px;color:#b8afa1;font-size:12px;line-height:21px;">Teklifinizle ilgili sorularınız için bize ulaşabilirsiniz.</p><a href="mailto:destek@megdev.info" style="color:#39d0c2;font-size:12px;text-decoration:none;">destek@megdev.info</a><span style="color:#b8afa1;"> &nbsp;·&nbsp; </span><a href="https://megdev.com.tr" style="color:#b8afa1;font-size:12px;text-decoration:none;">megdev.com.tr</a><p style="margin:18px 0 0;font-size:10px;color:#b8afa1;">Meg Dev &nbsp;/&nbsp; ${escape(quote.quote_number)}</p></td></tr>
</table><!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`,
  }
}
