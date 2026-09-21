import { readFile } from "node:fs/promises"
import path from "node:path"
import fontkit from "@pdf-lib/fontkit"
import { PDFDocument, PDFName, PDFString, rgb, type PDFFont, type RGB } from "pdf-lib"
import type { QuoteItem } from "@/lib/quotes"

const W = 595.28
const H = 841.89
const M = 42
const RIGHT = W - M
const WIDTH = W - 2 * M
const BOTTOM = 752
const C = {
  background: rgb(16 / 255, 16 / 255, 13 / 255),
  panel: rgb(25 / 255, 26 / 255, 22 / 255),
  line: rgb(49 / 255, 51 / 255, 42 / 255),
  lime: rgb(215 / 255, 255 / 255, 67 / 255),
  teal: rgb(57 / 255, 208 / 255, 194 / 255),
  white: rgb(247 / 255, 243 / 255, 234 / 255),
  muted: rgb(184 / 255, 175 / 255, 161 / 255),
}

const statusLabels: Record<string, string> = {
  draft: "Taslak", sent: "Gönderildi", viewed: "Görüntülendi",
  accepted: "Kabul edildi", rejected: "Reddedildi", expired: "Süresi doldu", converted: "Projeye dönüştürüldü",
}

function number(value: unknown) {
  const result = Number(value)
  return Number.isFinite(result) ? result : 0
}

function date(value: unknown) {
  if (!value) return "Belirtilmedi"
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? "Belirtilmedi" : new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Istanbul",
  }).format(parsed)
}

export async function createQuotePdf(quote: Record<string, unknown>) {
  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  // Bundle fonts with the function: PDF downloads do not depend on an external font service.
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf")),
    readFile(path.join(process.cwd(), "public/fonts/NotoSans-Bold.ttf")),
  ])
  const regular = await pdf.embedFont(regularBytes, { subset: true })
  const bold = await pdf.embedFont(boldBytes, { subset: true })
  const supported = new Set(regular.getCharacterSet())
  const clean = (value: unknown) => Array.from(String(value ?? "").normalize("NFC").replace(/\r\n?/g, "\n"))
    .map(char => char === "\n" ? char : char === "\t" ? "    " : supported.has(char.codePointAt(0)!) ? char : "?").join("")
  const currency = String(quote.currency || "TRY").toUpperCase()
  const decimal = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const amount = (value: unknown) => `${decimal.format(number(value))} ${currency}`
  const quantity = (value: unknown) => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 4 }).format(number(value))
  const items = (Array.isArray(quote.items) ? quote.items : []) as QuoteItem[]
  const reference = clean(quote.quote_number || "Teklif")
  const status = statusLabels[String(quote.status)] || "Teklif"
  pdf.setTitle(`${reference} | Meg Dev Hizmet Teklifi`)
  pdf.setAuthor("Meg Dev")
  pdf.setSubject("Hizmet kapsamı, fiyatlandırma ve teklif koşulları")
  pdf.setLanguage("tr-TR")
  pdf.setCreator("Meg Dev Teklifler")

  let page = pdf.addPage([W, H])
  let cursor = 0
  function box(x: number, top: number, width: number, height: number, color: RGB) {
    page.drawRectangle({ x, y: H - top - height, width, height, color })
  }
  function text(value: unknown, x: number, top: number, size = 10, font = regular, color = C.white) {
    page.drawText(clean(value).replace(/\n/g, " "), { x, y: H - top - size, size, font, color })
  }
  function fit(value: unknown, x: number, top: number, width: number, size = 10, font = regular, color = C.white, right = false) {
    const str = clean(value).replace(/\n/g, " ")
    const actual = Math.min(size, width / Math.max(font.widthOfTextAtSize(str, 1), 1))
    text(str, right ? x + width - font.widthOfTextAtSize(str, actual) : x, top, actual, font, color)
  }
  function rule(top: number, x = M, width = WIDTH) {
    box(x, top, width, .65, C.line)
  }
  function lines(value: unknown, width: number, size: number, font: PDFFont = regular) {
    const result: string[] = []
    for (const paragraph of clean(value).split(/\r?\n/)) {
      let current = ""
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = current ? `${current} ${word}` : word
        if (font.widthOfTextAtSize(candidate, size) <= width) { current = candidate; continue }
        if (current) { result.push(current); current = "" }
        // URLs and long words are broken by measured glyph width, never truncated.
        for (const char of word) {
          if (font.widthOfTextAtSize(current + char, size) > width && current) { result.push(current); current = "" }
          current += char
        }
      }
      result.push(current)
    }
    return result
  }
  function frame(section: string, first = false) {
    box(0, 0, W, H, C.background)
    box(M, 0, 112, 4, C.lime)
    box(M + 112, 0, 60, 4, C.teal)
    text("Meg", M, 31, 25, bold, C.lime)
    text("Dev", M + 58, 31, 25, bold, C.teal)
    text("YAZILIM & DİJİTAL ÇÖZÜMLER", M, 67, 7, bold, C.muted)
    fit(reference, 325, 38, RIGHT - 325, 10, bold, C.white, true)
    fit(section, 325, 59, RIGHT - 325, 8, regular, C.muted, true)
    rule(94)
    cursor = first ? 120 : 116
  }
  function next(section: string) {
    page = pdf.addPage([W, H])
    frame(section)
  }
  function ensure(height: number, section: string) {
    if (cursor + height > BOTTOM) next(section)
  }
  function paragraph(value: unknown, section: string, options: { x?: number; width?: number; size?: number; font?: PDFFont; color?: RGB } = {}) {
    const { x = M, width = WIDTH, size = 10, font = regular, color = C.muted } = options
    for (const line of lines(value, width, size, font)) {
      ensure(size * 1.6, section)
      text(line, x, cursor, size, font, color)
      cursor += size * 1.6
    }
  }
  function heading(kicker: string, title: string, section: string) {
    ensure(65, section)
    text(kicker, M, cursor, 8, bold, C.teal)
    cursor += 17
    text(title, M, cursor, 20, bold)
    cursor += 37
  }
  function field(label: string, value: unknown) {
    const rows = lines(value || "Belirtilmedi", WIDTH - 144, 10)
    ensure(30, "Teklif özeti / müşteri bilgileri")
    text(label, M, cursor, 9, regular, C.muted)
    for (const row of rows) {
      ensure(16, "Teklif özeti / müşteri bilgileri")
      text(row, M + 144, cursor, 10, regular)
      cursor += 16
    }
    cursor += 8
  }

  frame("01 / TEKLİF ÖZETİ", true)
  text("FİKRİNİZDEN DİJİTAL DENEYİME", M, cursor, 9, bold, C.teal)
  cursor += 22
  text("Birlikte", M, cursor, 43, bold)
  text("üretelim.", M + bold.widthOfTextAtSize("Birlikte ", 43), cursor, 43, bold, C.lime)
  cursor += 70
  paragraph("İhtiyaçlarınıza özel hizmet kapsamı, kalem bazında fiyatlandırma ve teklif notlarını bu belgede bir araya getirdik.", "Teklif özeti", { width: 440, size: 11 })
  cursor += 26
  rule(cursor)
  cursor += 23
  field("HAZIRLANAN KİŞİ", quote.customer_name)
  if (quote.customer_company) field("ŞİRKET", quote.customer_company)
  field("E-POSTA", quote.customer_email)
  if (quote.customer_phone) field("TELEFON", quote.customer_phone)
  cursor += 12

  ensure(93, "Teklif özeti / belge bilgileri")
  const tileWidth = (WIDTH - 20) / 3
  const tiles = [["TEKLİF TARİHİ", date(quote.created_at)], ["SON GEÇERLİLİK", date(quote.valid_until)], ["BELGE DURUMU", status]]
  for (let i = 0; i < tiles.length; i++) {
    const x = M + i * (tileWidth + 10)
    box(x, cursor, tileWidth, 74, C.panel)
    text(tiles[i][0], x + 13, cursor + 13, 7, bold, C.muted)
    fit(tiles[i][1], x + 13, cursor + 37, tileWidth - 26, 10, bold)
  }
  cursor += 96
  ensure(136, "Teklif özeti / toplam bedel")
  box(M, cursor, WIDTH, 128, C.lime)
  text("TEKLİF TOPLAMI", M + 21, cursor + 17, 9, bold, C.background)
  fit(amount(quote.total), M + 20, cursor + 37, WIDTH - 40, 37, bold, C.background)
  text(`${items.length} hizmet kalemi  /  ${currency}  /  İndirim ve KDV sonrası toplam`, M + 21, cursor + 101, 9, regular, C.background)
  cursor += 145
  paragraph("Ayrıntılı fiyat dökümü ve teklif notları devam eden sayfalardadır.", "Teklif özeti", { size: 9 })

  next("02 / KAPSAM & FİYATLANDIRMA")
  heading("01  /  HİZMET DÖKÜMÜ", "Her kalemiyle şeffaf.", "Kapsam & fiyatlandırma")
  paragraph("Kalem tutarları, adet ile birim fiyatın çarpımıdır. Teklif genelindeki indirim ve KDV hesapları aşağıdaki özette gösterilir.", "Kapsam & fiyatlandırma", { size: 9 })
  cursor += 17
  function tableHeader() {
    box(M, cursor, WIDTH, 31, C.lime)
    text("HİZMET / AÇIKLAMA", M + 12, cursor + 10, 8, bold, C.background)
    fit("ADET", 306, cursor + 10, 42, 8, bold, C.background, true)
    fit("BİRİM FİYAT", 355, cursor + 10, 84, 8, bold, C.background, true)
    fit("TUTAR", 450, cursor + 10, 91, 8, bold, C.background, true)
    cursor += 31
  }
  tableHeader()
  items.forEach((item, index) => {
    const description = lines(item.description, 222, 9.5)
    let offset = 0
    do {
      if (cursor + 64 > BOTTOM) { next("02 / HİZMET DÖKÜMÜ - DEVAM"); tableHeader() }
      const remainingLines = Math.max(1, Math.floor((BOTTOM - cursor - 38) / 15))
      const segment = description.slice(offset, offset + remainingLines)
      const height = Math.max(64, 37 + segment.length * 15)
      box(M, cursor, WIDTH, height, index % 2 ? C.background : C.panel)
      text(`${String(index + 1).padStart(2, "0")}${offset ? " / devam" : ""}`, M + 12, cursor + 10, 7, bold, C.teal)
      segment.forEach((line, j) => text(line, M + 12, cursor + 25 + j * 15, 9.5))
      if (!offset) {
        fit(quantity(item.quantity), 306, cursor + 25, 42, 9, regular, C.white, true)
        fit(amount(item.unit_price), 355, cursor + 25, 84, 9, regular, C.white, true)
        fit(amount(number(item.quantity) * number(item.unit_price)), 450, cursor + 25, 91, 9, bold, C.white, true)
      }
      cursor += height
      rule(cursor)
      offset += segment.length
    } while (offset < description.length)
  })
  cursor += 24
  ensure(240, "03 / MALİ ÖZET")
  heading("02  /  MALİ ÖZET", "Teklifin toplam değeri", "Mali özet")
  const discountLabel = quote.discount_type === "percentage"
    ? `İndirim (%${quantity(quote.discount_value)})` : "İndirim (sabit tutar)"
  const totals: [string, string][] = [
    ["Hizmetler toplamı", amount(quote.subtotal)],
    [discountLabel, `-${amount(quote.discount_total)}`],
    ["KDV matrahı (indirim sonrası)", amount(number(quote.subtotal) - number(quote.discount_total))],
    [`KDV (%${quantity(quote.tax_rate)})`, amount(quote.tax_total)],
  ]
  for (const [label, value] of totals) {
    text(label, M + 12, cursor, 10, regular, C.muted)
    fit(value, 370, cursor, RIGHT - 382, 10, regular, C.white, true)
    cursor += 23
  }
  box(M, cursor + 3, WIDTH, 54, C.panel)
  box(M, cursor + 3, 3, 54, C.teal)
  text("GENEL TOPLAM", M + 14, cursor + 21, 10, bold, C.teal)
  fit(amount(quote.total), 295, cursor + 16, RIGHT - 309, 21, bold, C.lime, true)
  cursor += 82

  heading("03  /  TEKLİF NOTLARI", "Kapsam ve koşullar", "Teklif notları & sonraki adım")
  paragraph(quote.notes || "Bu teklif için ek not belirtilmemiştir.", "Teklif notları - devam", { color: C.white, size: 10 })
  cursor += 24
  // Only describe recorded terms; do not invent deposits, delivery dates or guarantees.
  ensure(70, "Geçerlilik & iletişim")
  text("GEÇERLİLİK", M, cursor, 8, bold, C.teal)
  cursor += 18
  paragraph(`Son geçerlilik tarihi: ${date(quote.valid_until)}. Fiyat ve kapsamla ilgili değişiklik taleplerinizi teklif numaranızla birlikte Meg Dev'e iletebilirsiniz.`, "Geçerlilik & iletişim", { size: 9 })
  cursor += 20

  const token = String(quote.token || "")
  if (/^[a-zA-Z0-9_-]{16,128}$/.test(token)) {
    ensure(94, "Teklifi çevrimiçi görüntüleyin")
    const top = cursor
    box(M, top, WIDTH, 85, C.teal)
    text("Teklifinizi çevrimiçi görüntüleyin", M + 18, top + 15, 15, bold, C.background)
    text("Teklif detaylarını açmak için bu alana tıklayın.", M + 18, top + 42, 10, regular, C.background)
    text("megdev.com.tr", M + 18, top + 60, 8, bold, C.background)
    const link = pdf.context.obj({
      Type: "Annot", Subtype: "Link", Rect: [M, H - top - 85, RIGHT, H - top], Border: [0, 0, 0],
      A: { Type: "Action", S: "URI", URI: PDFString.of(`https://megdev.com.tr/teklif/${encodeURIComponent(token)}`) },
    })
    page.node.set(PDFName.of("Annots"), pdf.context.obj([pdf.context.register(link)]))
    cursor += 103
  }
  ensure(42, "İletişim")
  text("BİRLİKTE BİR SONRAKİ ADIMA", M, cursor, 8, bold, C.lime)
  cursor += 18
  text("Meg Dev  /  destek@megdev.info  /  megdev.com.tr", M, cursor, 9, regular, C.white)

  // Repeat document identity and pagination on every page, including overflow pages.
  const pages = pdf.getPages()
  pages.forEach((current, index) => {
    page = current
    rule(783)
    text("Meg Dev", M, 797, 9, bold, C.lime)
    text("megdev.com.tr", M + 63, 798, 8, regular, C.muted)
    fit(`${reference}  ·  ${index + 1} / ${pages.length}`, 290, 798, RIGHT - 290, 8, regular, C.muted, true)
  })
  return pdf.save()
}
