import { adminRequest } from "@/lib/nhost"
import { GET_QUOTE_BY_TOKEN } from "@/lib/nhost-graphql"
import { createQuotePdf } from "@/lib/quote-pdf"
type Context={params:Promise<{token:string}>}
export async function GET(_request:Request,{params}:Context){try{const{token}=await params;const quote=(await adminRequest(GET_QUOTE_BY_TOKEN,{token}))?.quotes?.[0];if(!quote)return new Response("Teklif bulunamadı",{status:404});const pdf=await createQuotePdf(quote);return new Response(Buffer.from(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`inline; filename="${quote.quote_number}.pdf"`,"Cache-Control":"no-store"}})}catch{return new Response("PDF oluşturulamadı",{status:500})}}
