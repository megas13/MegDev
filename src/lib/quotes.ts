import crypto from "node:crypto"

export type QuoteItem = { description: string; quantity: number; unit_price: number }

export function normalizeItems(value: unknown): QuoteItem[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => {
    const row = item as Partial<QuoteItem>
    return {
      description: String(row.description || "").trim(),
      quantity: Math.max(0, Number(row.quantity) || 0),
      unit_price: Math.max(0, Number(row.unit_price) || 0),
    }
  }).filter((item) => item.description && item.quantity > 0)
}

export function calculateQuote(items: QuoteItem[], discountType: string, discountValue: number, taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const safeDiscount = Math.max(0, Number(discountValue) || 0)
  const discountTotal = discountType === "fixed" ? Math.min(safeDiscount, subtotal) : subtotal * Math.min(safeDiscount, 100) / 100
  const taxable = Math.max(0, subtotal - discountTotal)
  const taxTotal = taxable * Math.max(0, Number(taxRate) || 0) / 100
  return { subtotal, discountTotal, taxTotal, total: taxable + taxTotal }
}

export function quoteToken() {
  return crypto.randomBytes(24).toString("hex")
}

export function quoteNumber() {
  const date = new Date()
  return `TKL-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`
}

export function money(value: number, currency: string) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format(value)
}
