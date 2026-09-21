import { money, type QuoteItem } from "@/lib/quotes"

export function buildQuoteEmail(quote: Record<string, unknown>, url: string) {
  const items = quote.items as QuoteItem[]
  const currency = String(quote.currency)
  const rows = items.map(item => `<tr><td style="padding:10px;border-bottom:1px solid #303028">${item.description}</td><td style="padding:10px;text-align:center;border-bottom:1px solid #303028">${item.quantity}</td><td style="padding:10px;text-align:right;border-bottom:1px solid #303028">${money(item.quantity * item.unit_price, currency)}</td></tr>`).join("")
  return {
    subject: `Meg Dev teklifiniz | ${quote.quote_number}`,
    text: `Merhaba ${quote.customer_name}, teklifiniz hazır: ${url}`,
    html: `<!doctype html><html><body style="margin:0;background:#10100d;color:#f7f3ea;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:40px 18px"><div style="border:1px solid #303028;background:#181814;border-radius:24px;padding:32px"><b style="color:#d7ff43;letter-spacing:.15em">MEG DEV · TEKLİF</b><h1 style="margin:18px 0 8px">Merhaba ${quote.customer_name}</h1><p style="color:#b8afa1;line-height:1.6">Size özel ${quote.quote_number} numaralı teklif hazırlandı.</p><table style="width:100%;border-collapse:collapse;margin:24px 0;color:#f7f3ea">${rows}</table><p style="font-size:24px;font-weight:900;text-align:right">Toplam: ${money(Number(quote.total), currency)}</p><a href="${url}" style="display:block;margin-top:24px;padding:15px;border-radius:12px;background:#d7ff43;color:#10100d;text-align:center;text-decoration:none;font-weight:900">Teklifi görüntüle</a></div></div></body></html>`,
  }
}
