import { createHash, randomInt, timingSafeEqual } from "node:crypto"
import { headers } from "next/headers"
import nodemailer from "nodemailer"
import { adminRequest } from "@/lib/nhost"
import {
  DELETE_REFERRAL_VERIFICATION,
  GET_REFERRAL_CONTRACT_BY_TOKEN,
  GET_REFERRAL_VERIFICATION,
  INCREMENT_REFERRAL_ATTEMPTS,
  UPDATE_REFERRAL_CONTRACT,
  UPSERT_REFERRAL_VERIFICATION,
} from "@/lib/nhost-graphql"
import { buildReferralVerificationEmail } from "@/lib/referral-email"
import { maskContractEmail } from "@/lib/referral-contract"

const CODE_TTL_MINUTES = 10
const RESEND_WAIT_SECONDS = 60
const MAX_ATTEMPTS = 5

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

async function getContract(token: string) {
  const data = await adminRequest(GET_REFERRAL_CONTRACT_BY_TOKEN, { token })
  return data?.referral_contracts?.[0] ?? null
}

function verificationHash(contractId: string, purpose: string, code: string) {
  const secret = process.env.REFERRAL_CODE_SECRET || process.env.NDA_CODE_SECRET || process.env.NHOST_ADMIN_SECRET || ""
  return createHash("sha256").update(`${contractId}:${purpose}:${code}:${secret}`).digest("hex")
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function publicContract(contract: Record<string, unknown>) {
  return {
    token: contract.token,
    status: contract.status,
    provider_name: contract.provider_name,
    representative_name: contract.representative_name,
    representative_email: maskContractEmail(String(contract.representative_email)),
    contract_text: contract.contract_text,
    contract_version: contract.contract_version,
    contract_hash: contract.contract_hash,
    accepted_at: contract.accepted_at,
    termination_text: contract.termination_text,
    termination_version: contract.termination_version,
    termination_hash: contract.termination_hash,
    termination_requested_at: contract.termination_requested_at,
    termination_accepted_at: contract.termination_accepted_at,
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const contract = await getContract(token)
    if (!contract) return Response.json({ error: "Sözleşme bulunamadı" }, { status: 404 })
    return Response.json({ contract: publicContract(contract) })
  } catch (error) {
    console.error("Public referral contract error", error)
    return Response.json({ error: "Sözleşme yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const contract = await getContract(token)
    if (!contract) return Response.json({ error: "Sözleşme bulunamadı" }, { status: 404 })
    const body = await request.json()
    const purpose = body.purpose === "termination" ? "termination" : "acceptance"
    const allowed = purpose === "acceptance"
      ? contract.status === "sent"
      : contract.status === "termination_pending"
    if (!allowed) return Response.json({ error: "Bu belge şu anda onaya açık değil" }, { status: 409 })

    if (body.action === "send_code") {
      const existingData = await adminRequest(GET_REFERRAL_VERIFICATION, { contractId: contract.id })
      const existing = existingData?.referral_verification_codes_by_pk
      if (existing?.last_sent_at) {
        const elapsed = Date.now() - new Date(existing.last_sent_at).getTime()
        if (elapsed < RESEND_WAIT_SECONDS * 1000) {
          return Response.json({ error: `Yeni kod için ${Math.ceil((RESEND_WAIT_SECONDS * 1000 - elapsed) / 1000)} saniye bekleyin` }, { status: 429 })
        }
      }
      const code = randomInt(100000, 1000000).toString()
      const now = new Date()
      await adminRequest(UPSERT_REFERRAL_VERIFICATION, {
        object: {
          contract_id: contract.id,
          purpose,
          code_hash: verificationHash(contract.id, purpose, code),
          expires_at: new Date(now.getTime() + CODE_TTL_MINUTES * 60_000).toISOString(),
          attempts: 0,
          last_sent_at: now.toISOString(),
        },
      })
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, "")
      const url = purpose === "termination"
        ? `${appUrl}/musteri-bulma-sozlesmesi/${encodeURIComponent(token)}/fesih`
        : `${appUrl}/musteri-bulma-sozlesmesi/${encodeURIComponent(token)}`
      const email = buildReferralVerificationEmail({ name: contract.representative_name, code, purpose, url, expiresInMinutes: CODE_TTL_MINUTES })
      try {
        await transporter.sendMail({ from: `"Meg Dev" <${process.env.SMTP_FROM}>`, to: contract.representative_email, ...email })
      } catch (emailError) {
        await adminRequest(DELETE_REFERRAL_VERIFICATION, { contractId: contract.id }).catch(() => null)
        console.error("Referral verification email error", emailError)
        return Response.json({ error: "E-posta gönderilemedi. Lütfen kısa süre sonra tekrar deneyin." }, { status: 502 })
      }
      return Response.json({ success: true, email: maskContractEmail(contract.representative_email) })
    }

    if (body.action === "accept") {
      if (body.accepted !== true || !/^\d{6}$/.test(String(body.code || ""))) {
        return Response.json({ error: "Onay kutusunu işaretleyin ve 6 haneli kodu girin" }, { status: 400 })
      }
      const verificationData = await adminRequest(GET_REFERRAL_VERIFICATION, { contractId: contract.id })
      const verification = verificationData?.referral_verification_codes_by_pk
      if (!verification || verification.purpose !== purpose || new Date(verification.expires_at).getTime() < Date.now()) {
        return Response.json({ error: "Doğrulama kodu geçersiz veya süresi dolmuş" }, { status: 400 })
      }
      if (verification.attempts >= MAX_ATTEMPTS) return Response.json({ error: "Çok fazla hatalı deneme. Yeni kod isteyin" }, { status: 429 })
      if (!safeEqual(verificationHash(contract.id, purpose, String(body.code)), verification.code_hash)) {
        await adminRequest(INCREMENT_REFERRAL_ATTEMPTS, { contractId: contract.id })
        return Response.json({ error: "Doğrulama kodu hatalı" }, { status: 400 })
      }
      const requestHeaders = await headers()
      const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || null
      const now = new Date().toISOString()
      const changes = purpose === "acceptance"
        ? { status: "active", accepted_at: now, accepted_ip: ip, accepted_user_agent: requestHeaders.get("user-agent"), email_verified: true, updated_at: now }
        : { status: "terminated", termination_accepted_at: now, termination_ip: ip, termination_user_agent: requestHeaders.get("user-agent"), updated_at: now }
      await adminRequest(UPDATE_REFERRAL_CONTRACT, { id: contract.id, changes })
      await adminRequest(DELETE_REFERRAL_VERIFICATION, { contractId: contract.id })
      return Response.json({ accepted: true, purpose, accepted_at: now })
    }
    return Response.json({ error: "Geçersiz işlem" }, { status: 400 })
  } catch (error) {
    console.error("Referral contract action error", error)
    return Response.json({ error: "İşlem tamamlanamadı" }, { status: 500 })
  }
}
