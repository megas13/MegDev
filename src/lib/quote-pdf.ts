import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { money, type QuoteItem } from "@/lib/quotes"

function ascii(value: unknown) {
  return String(value ?? "").replace(/ğ/g, "g").replace(/Ğ/g, "G").replace(/ş/g, "s").replace(/Ş/g, "S").replace(/ı/g, "i").replace(/İ/g, "I").replace(/ç/g, "c").replace(/Ç/g, "C").replace(/ö/g, "o").replace(/Ö/g, "O").replace(/ü/g, "u").replace(/Ü/g, "U").replace(/₺/g, "TRY").replace(/€/g, "EUR").replace(/[–—]/g, "-").replace(/[^\x20-\x7E]/g, "")
}

function wrap(text: string, width = 72) {
  const words = ascii(text).split(/\s+/); const lines: string[] = []; let line = ""
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > width) { if (line) lines.push(line); line = word } else line = next }
  if (line) lines.push(line); return lines
}

export async function createQuotePdf(quote: Record<string, unknown>) {
  const pdf = await PDFDocument.create(); let page = pdf.addPage([595, 842]); const regular = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(.04,.06,.12), blue = rgb(.08,.45,.95), pale = rgb(.94,.97,1), gray = rgb(.36,.42,.52); let y = 780
  page.drawRectangle({ x:0,y:0,width:595,height:842,color:pale }); page.drawRectangle({ x:0,y:712,width:595,height:130,color:navy })
  page.drawText("MEG DEV",{x:42,y:786,size:25,font:bold,color:rgb(.2,.75,1)}); page.drawText("DIJITAL COZUMLER",{x:42,y:766,size:9,font:bold,color:rgb(.7,.76,.85)})
  page.drawText("TEKLIF",{x:430,y:786,size:22,font:bold,color:rgb(1,1,1)}); page.drawText(ascii(quote.quote_number),{x:430,y:766,size:10,font:regular,color:rgb(.7,.76,.85)})
  y=675; page.drawText("MUSTERI",{x:42,y,size:10,font:bold,color:blue}); y-=24; page.drawText(ascii(quote.customer_name),{x:42,y,size:17,font:bold,color:navy}); y-=18; page.drawText(ascii(quote.customer_company || quote.customer_email),{x:42,y,size:10,font:regular,color:gray})
  page.drawText(`Gecerlilik: ${ascii(quote.valid_until)}`,{x:400,y:y+18,size:10,font:bold,color:navy}); y-=42
  page.drawRectangle({x:38,y:y-4,width:519,height:28,color:navy}); page.drawText("HIZMET",{x:48,y:y+5,size:9,font:bold,color:rgb(1,1,1)}); page.drawText("ADET",{x:360,y:y+5,size:9,font:bold,color:rgb(1,1,1)}); page.drawText("TUTAR",{x:465,y:y+5,size:9,font:bold,color:rgb(1,1,1)}); y-=34
  const items = quote.items as QuoteItem[]; const currency=String(quote.currency)
  for (const item of items) { if(y<190){page=pdf.addPage([595,842]); page.drawRectangle({x:0,y:0,width:595,height:842,color:pale}); y=790} page.drawText(ascii(item.description).slice(0,48),{x:48,y,size:10,font:regular,color:navy}); page.drawText(String(item.quantity),{x:370,y,size:10,font:regular,color:navy}); page.drawText(ascii(money(item.quantity*item.unit_price,currency)),{x:455,y,size:10,font:regular,color:navy}); page.drawLine({start:{x:42,y:y-10},end:{x:553,y:y-10},thickness:.5,color:rgb(.8,.84,.9)}); y-=30 }
  y-=12; const totals=[['Ara toplam',quote.subtotal],['Indirim',-Number(quote.discount_total)],['KDV',quote.tax_total],['GENEL TOPLAM',quote.total]] as const
  for(const [label,value] of totals){page.drawText(label,{x:350,y,size:label==='GENEL TOPLAM'?11:9,font:label==='GENEL TOPLAM'?bold:regular,color:navy}); page.drawText(ascii(money(Number(value),currency)),{x:455,y,size:label==='GENEL TOPLAM'?11:9,font:label==='GENEL TOPLAM'?bold:regular,color:label==='GENEL TOPLAM'?blue:navy}); y-=22}
  if(quote.notes){y-=12; page.drawText("NOTLAR",{x:42,y,size:10,font:bold,color:blue}); y-=18; for(const line of wrap(String(quote.notes))){page.drawText(line,{x:42,y,size:9,font:regular,color:gray}); y-=13}}
  page.drawText("Meg Dev · megdev.com.tr · destek@megdev.info",{x:42,y:35,size:8,font:regular,color:gray}); return pdf.save()
}
