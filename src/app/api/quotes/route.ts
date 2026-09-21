import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { CREATE_QUOTE, GET_QUOTES } from "@/lib/nhost-graphql"
import { calculateQuote, normalizeItems, quoteNumber, quoteToken } from "@/lib/quotes"

export async function GET() {
  if (!(await isAdminRequest())) return Response.json({ error: "Yetkisiz" }, { status: 401 })
  try { const data=await adminRequest(GET_QUOTES); return Response.json(data?.quotes ?? []) } catch(error){return Response.json({error:String(error)},{status:500})}
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return Response.json({ error: "Yetkisiz" }, { status: 401 })
  try {
    const body=await request.json(); const items=normalizeItems(body.items); if(!items.length) return Response.json({error:"En az bir hizmet ekleyin."},{status:400})
    const discountType=body.discount_type === "fixed" ? "fixed" : "percentage"; const totals=calculateQuote(items,discountType,body.discount_value,body.tax_rate)
    const object={token:quoteToken(),quote_number:quoteNumber(),customer_name:String(body.customer_name||"").trim(),customer_email:String(body.customer_email||"").trim().toLowerCase(),customer_company:String(body.customer_company||"").trim()||null,customer_phone:String(body.customer_phone||"").trim()||null,status:"draft",currency:String(body.currency||"TRY"),items,discount_type:discountType,discount_value:Number(body.discount_value)||0,tax_rate:Number(body.tax_rate)||0,notes:String(body.notes||"").trim()||null,valid_until:body.valid_until,...{subtotal:totals.subtotal,discount_total:totals.discountTotal,tax_total:totals.taxTotal,total:totals.total}}
    if(!object.customer_name||!object.customer_email||!object.valid_until) return Response.json({error:"Müşteri, e-posta ve geçerlilik tarihi zorunludur."},{status:400})
    const data=await adminRequest(CREATE_QUOTE,{object}); return Response.json(data?.insert_quotes_one,{status:201})
  } catch(error){return Response.json({error:String(error)},{status:500})}
}
