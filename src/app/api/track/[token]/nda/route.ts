import { createHash, randomInt, timingSafeEqual } from "node:crypto"
import { headers } from "next/headers"
import nodemailer from "nodemailer"
import { adminRequest } from "@/lib/nhost"
import {
  ACCEPT_NDA,
  DELETE_NDA_VERIFICATION,
  GET_NDA_ACCEPTANCE,
  GET_NDA_VERIFICATION,
  GET_PROJECT_BY_TOKEN,
  INCREMENT_NDA_ATTEMPTS,
  UPSERT_NDA_VERIFICATION,
} from "@/lib/nhost-graphql"
import { buildNdaText, maskEmail, NDA_VERSION } from "@/lib/nda"
import { buildNdaVerificationEmail } from "@/lib/nda-email"

const CODE_TTL_MINUTES = 10
const RESEND_WAIT_SECONDS = 60
const MAX_ATTEMPTS = 5

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

type Project = {
  id: string
  title: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
}

async function getProject(token: string): Promise<Project | null> {
  const data = await adminRequest(GET_PROJECT_BY_TOKEN, { token })
  return data?.projects?.[0] ?? null
}

function codeHash(projectId: string, code: string) {
  const secret = process.env.NDA_CODE_SECRET || process.env.NHOST_ADMIN_SECRET || ""
  return createHash("sha256").update(`${projectId}:${code}:${secret}`).digest("hex")
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function contractHash(text: string) {
  return createHash("sha256").update(text, "utf8").digest("hex")
}

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const project = await getProject(token)
    if (!project) return Response.json({ error: "Proje bulunamadı" }, { status: 404 })

    const acceptanceData = await adminRequest(GET_NDA_ACCEPTANCE, { projectId: project.id })
    const acceptance = acceptanceData?.nda_acceptances?.[0] ?? null
    const contract = buildNdaText(project.customer_name, project.title)

    return Response.json({
      accepted: Boolean(acceptance),
      accepted_at: acceptance?.accepted_at ?? null,
      contract,
      contract_version: NDA_VERSION,
      contract_hash: contractHash(contract),
      customer_name: project.customer_name,
      customer_email: maskEmail(project.customer_email),
      project_title: project.title,
    })
  } catch (error) {
    console.error("NDA status error", error)
    return Response.json({ error: "Gizlilik sözleşmesi yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const project = await getProject(token)
    if (!project) return Response.json({ error: "Proje bulunamadı" }, { status: 404 })

    const acceptanceData = await adminRequest(GET_NDA_ACCEPTANCE, { projectId: project.id })
    if (acceptanceData?.nda_acceptances?.length) {
      return Response.json({ accepted: true, message: "Sözleşme daha önce kabul edilmiş" })
    }

    const body = await request.json()
    if (body.action === "send_code") {
      const existingData = await adminRequest(GET_NDA_VERIFICATION, { projectId: project.id })
      const existing = existingData?.nda_verification_codes_by_pk
      if (existing?.last_sent_at) {
        const elapsed = Date.now() - new Date(existing.last_sent_at).getTime()
        if (elapsed < RESEND_WAIT_SECONDS * 1000) {
          return Response.json(
            { error: `Yeni kod için ${Math.ceil((RESEND_WAIT_SECONDS * 1000 - elapsed) / 1000)} saniye bekleyin` },
            { status: 429 },
          )
        }
      }

      const code = randomInt(100000, 1000000).toString()
      const now = new Date()
      const expiresAt = new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000)
      await adminRequest(UPSERT_NDA_VERIFICATION, {
        projectId: project.id,
        codeHash: codeHash(project.id, code),
        expiresAt: expiresAt.toISOString(),
        lastSentAt: now.toISOString(),
      })
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, "")
      const verificationEmail = buildNdaVerificationEmail({
        customerName: project.customer_name,
        projectTitle: project.title,
        code,
        contractUrl: `${appUrl}/gizlilik-sozlesmesi/${encodeURIComponent(token)}`,
        expiresInMinutes: CODE_TTL_MINUTES,
      })
      await transporter.sendMail({
        from: `"Meg Dev" <${process.env.SMTP_FROM}>`,
        to: project.customer_email,
        ...verificationEmail,
      })
      return Response.json({ success: true, email: maskEmail(project.customer_email) })
    }

    if (body.action === "accept") {
      if (body.accepted !== true || !/^\d{6}$/.test(String(body.code ?? ""))) {
        return Response.json({ error: "Onay kutusunu işaretleyin ve 6 haneli kodu girin" }, { status: 400 })
      }
      const verificationData = await adminRequest(GET_NDA_VERIFICATION, { projectId: project.id })
      const verification = verificationData?.nda_verification_codes_by_pk
      if (!verification || new Date(verification.expires_at).getTime() < Date.now()) {
        return Response.json({ error: "Doğrulama kodunun süresi dolmuş" }, { status: 400 })
      }
      if (verification.attempts >= MAX_ATTEMPTS) {
        return Response.json({ error: "Çok fazla hatalı deneme. Yeni kod isteyin" }, { status: 429 })
      }
      const submittedHash = codeHash(project.id, String(body.code))
      if (!safeEqual(submittedHash, verification.code_hash)) {
        await adminRequest(INCREMENT_NDA_ATTEMPTS, { projectId: project.id })
        return Response.json({ error: "Doğrulama kodu hatalı" }, { status: 400 })
      }

      const contract = buildNdaText(project.customer_name, project.title)
      const requestHeaders = await headers()
      const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
      const ipAddress = forwardedFor || requestHeaders.get("x-real-ip") || null
      const result = await adminRequest(ACCEPT_NDA, {
        object: {
          project_id: project.id,
          customer_name: project.customer_name,
          customer_email: project.customer_email,
          customer_phone: project.customer_phone ?? null,
          contract_version: NDA_VERSION,
          contract_hash: contractHash(contract),
          contract_text: contract,
          accepted_ip: ipAddress,
          user_agent: requestHeaders.get("user-agent"),
          email_verified: true,
        },
      })
      await adminRequest(DELETE_NDA_VERIFICATION, { projectId: project.id })
      try {
        await transporter.sendMail({
          from: `"Meg Dev" <${process.env.SMTP_FROM}>`,
          to: project.customer_email,
          subject: "Gizlilik sözleşmesi kabul kaydınız",
          text: `Gizlilik sözleşmesi elektronik olarak kabul edilmiştir.\n\nProje: ${project.title}\nSözleşme sürümü: ${NDA_VERSION}\nSözleşme özeti (SHA-256): ${contractHash(contract)}\nKabul tarihi: ${result?.insert_nda_acceptances_one?.accepted_at}\n\n${contract}`,
        })
      } catch (emailError) {
        console.error("NDA receipt email error", emailError)
      }
      return Response.json({ accepted: true, acceptance: result?.insert_nda_acceptances_one })
    }

    return Response.json({ error: "Geçersiz işlem" }, { status: 400 })
  } catch (error) {
    console.error("NDA action error", error)
    return Response.json({ error: "İşlem tamamlanamadı" }, { status: 500 })
  }
}
