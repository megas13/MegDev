import { randomBytes } from "node:crypto"
import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { CREATE_REFERRAL_CONTRACT, GET_REFERRAL_CONTRACTS } from "@/lib/nhost-graphql"
import { buildReferralContract, REFERRAL_CONTRACT_VERSION, sha256, type ReferralContractInput } from "@/lib/referral-contract"

export async function GET() {
  if (!(await isAdminRequest())) return Response.json({ error: "Yetkisiz işlem" }, { status: 401 })
  try {
    const data = await adminRequest(GET_REFERRAL_CONTRACTS)
    return Response.json({ contracts: data?.referral_contracts ?? [] })
  } catch (error) {
    console.error("Referral contract list error", error)
    return Response.json({ error: "Sözleşmeler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return Response.json({ error: "Yetkisiz işlem" }, { status: 401 })
  try {
    const body = await request.json() as ReferralContractInput
    const required = [body.providerName, body.providerAddress, body.representativeName, body.representativeEmail, body.scope, body.startDate, body.paymentTerms]
    if (required.some((value) => !String(value || "").trim()) || !/^\S+@\S+\.\S+$/.test(body.representativeEmail)) {
      return Response.json({ error: "Zorunlu alanları ve e-posta adresini kontrol edin" }, { status: 400 })
    }
    if (!Number.isFinite(Number(body.commissionValue)) || Number(body.commissionValue) < 0) {
      return Response.json({ error: "Geçerli bir komisyon değeri girin" }, { status: 400 })
    }
    const normalized: ReferralContractInput = {
      ...body,
      commissionValue: Number(body.commissionValue),
      commissionType: body.commissionType === "fixed" ? "fixed" : "percentage",
      currency: String(body.currency || "TRY").toUpperCase(),
    }
    const contractText = buildReferralContract(normalized)
    const token = randomBytes(24).toString("base64url")
    const result = await adminRequest(CREATE_REFERRAL_CONTRACT, {
      object: {
        token,
        status: "sent",
        provider_name: normalized.providerName.trim(),
        provider_address: normalized.providerAddress.trim(),
        provider_tax_no: normalized.providerTaxNo?.trim() || null,
        representative_name: normalized.representativeName.trim(),
        representative_email: normalized.representativeEmail.trim().toLowerCase(),
        representative_phone: normalized.representativePhone?.trim() || null,
        scope: normalized.scope.trim(),
        commission_type: normalized.commissionType,
        commission_value: normalized.commissionValue,
        currency: normalized.currency,
        start_date: normalized.startDate,
        end_date: normalized.endDate || null,
        payment_terms: normalized.paymentTerms.trim(),
        special_terms: normalized.specialTerms?.trim() || null,
        contract_version: REFERRAL_CONTRACT_VERSION,
        contract_hash: sha256(contractText),
        contract_text: contractText,
      },
    })
    return Response.json({ contract: result?.insert_referral_contracts_one }, { status: 201 })
  } catch (error) {
    console.error("Referral contract create error", error)
    return Response.json({ error: "Sözleşme oluşturulamadı" }, { status: 500 })
  }
}
