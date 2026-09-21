import nodemailer from "nodemailer"
import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { CREATE_PROJECT, DELETE_QUOTE, GET_QUOTE, UPDATE_QUOTE } from "@/lib/nhost-graphql"
import { buildQuoteEmail } from "@/lib/quote-email"
import { calculateQuote, normalizeItems, quoteToken } from "@/lib/quotes"

type Context={params:Promise<{id:string}>}
export async function PATCH(request:Request,{params}:Context){
  if(!(await isAdminRequest())) return Response.json({error:"Yetkisiz"},{status:401})
  try{const {id}=await params; const body=await request.json(); const current=(await adminRequest(GET_QUOTE,{id}))?.quotes_by_pk; if(!current) return Response.json({error:"Teklif bulunamadı"},{status:404})
    if(body.action==="send"){
      const url=`${process.env.NEXT_PUBLIC_APP_URL||"https://megdev.com.tr"}/teklif/${current.token}`; const email=buildQuoteEmail(current,url); const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}); await transport.sendMail({from:`"Meg Dev" <${process.env.SMTP_FROM}>`,to:current.customer_email,...email}); const data=await adminRequest(UPDATE_QUOTE,{id,changes:{status:"sent",sent_at:new Date().toISOString(),updated_at:new Date().toISOString()}}); return Response.json(data?.update_quotes_by_pk)
    }
    if(body.action==="convert"){
      if(current.project_id) return Response.json({error:"Bu teklif zaten projeye dönüştürüldü."},{status:409}); const token=quoteToken().slice(0,20); const description=JSON.stringify({summary:`${current.quote_number} numaralı kabul edilmiş teklif`,quote_id:id,quote_total:current.total,currency:current.currency,items:current.items}); const project=(await adminRequest(CREATE_PROJECT,{title:`${current.customer_company||current.customer_name} - ${current.quote_number}`,description,customerName:current.customer_name,customerEmail:current.customer_email,customerPhone:current.customer_phone,status:"beklemede",token}))?.insert_projects_one; const data=await adminRequest(UPDATE_QUOTE,{id,changes:{status:"converted",project_id:project.id,updated_at:new Date().toISOString()}}); return Response.json(data?.update_quotes_by_pk)
    }
    const items=normalizeItems(body.items); const discountType=body.discount_type==="fixed"?"fixed":"percentage"; const totals=calculateQuote(items,discountType,body.discount_value,body.tax_rate); const changes={customer_name:String(body.customer_name||"").trim(),customer_email:String(body.customer_email||"").trim().toLowerCase(),customer_company:String(body.customer_company||"").trim()||null,customer_phone:String(body.customer_phone||"").trim()||null,currency:String(body.currency||"TRY"),items,discount_type:discountType,discount_value:Number(body.discount_value)||0,tax_rate:Number(body.tax_rate)||0,notes:String(body.notes||"").trim()||null,valid_until:body.valid_until,subtotal:totals.subtotal,discount_total:totals.discountTotal,tax_total:totals.taxTotal,total:totals.total,updated_at:new Date().toISOString()}; const data=await adminRequest(UPDATE_QUOTE,{id,changes}); return Response.json(data?.update_quotes_by_pk)
  }catch(error){return Response.json({error:String(error)},{status:500})}
}
export async function DELETE(_request:Request,{params}:Context){if(!(await isAdminRequest()))return Response.json({error:"Yetkisiz"},{status:401});try{const{id}=await params;const data=await adminRequest(DELETE_QUOTE,{id});return Response.json(data?.delete_quotes_by_pk)}catch(error){return Response.json({error:String(error)},{status:500})}}
