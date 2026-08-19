import { isAdminRequest } from "@/lib/admin-auth"
import { adminRequest } from "@/lib/nhost"
import { GET_REFERRAL_CONTRACTS, UPDATE_REFERRAL_CONTRACT } from "@/lib/nhost-graphql"
import { buildTerminationText, sha256, TERMINATION_VERSION } from "@/lib/referral-contract"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return Response.json({ error: "Yetkisiz işlem" }, { status: 401 })
  const { id } = await params
  try {
    const body = await request.json()
    if (body.action !== "request_termination") return Response.json({ error: "Geçersiz işlem" }, { status: 400 })
    const data = await adminRequest(GET_REFERRAL_CONTRACTS)
    const contract = data?.referral_contracts?.find((item: { id: string }) => item.id === id)
    if (!contract) return Response.json({ error: "Sözleşme bulunamadı" }, { status: 404 })
    if (contract.status !== "active") return Response.json({ error: "Yalnızca aktif sözleşmeler feshedilebilir" }, { status: 409 })
    const effectiveDate = String(body.effectiveDate || "").trim()
    const reason = String(body.reason || "").trim()
    const settlement = String(body.settlement || "").trim()
    if (!effectiveDate || !reason || !settlement) return Response.json({ error: "Fesih tarihi, nedeni ve mali kapanış bilgisi zorunludur" }, { status: 400 })
    const text = buildTerminationText(contract, effectiveDate, reason, settlement)
    const result = await adminRequest(UPDATE_REFERRAL_CONTRACT, {
      id,
      changes: {
        status: "termination_pending",
        termination_effective_date: effectiveDate,
        termination_reason: reason,
        termination_settlement: settlement,
        termination_version: TERMINATION_VERSION,
        termination_hash: sha256(text),
        termination_text: text,
        termination_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
    return Response.json({ contract: result?.update_referral_contracts_by_pk })
  } catch (error) {
    console.error("Referral termination request error", error)
    return Response.json({ error: "Fesih formu oluşturulamadı" }, { status: 500 })
  }
}
