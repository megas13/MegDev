import { adminRequest } from "@/lib/nhost"
import { GET_ADMIN_NDA_OVERVIEW } from "@/lib/nhost-graphql"

type Project = {
  id: string
  title: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  token: string
  created_at: string
}

type Acceptance = {
  id: string
  project_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  contract_version: string
  contract_hash: string
  contract_text: string
  accepted_at: string
  accepted_ip: string | null
  user_agent: string | null
  email_verified: boolean
}

export async function GET() {
  try {
    const data = await adminRequest(GET_ADMIN_NDA_OVERVIEW)
    const acceptances = new Map<string, Acceptance>(
      (data?.nda_acceptances ?? []).map((acceptance: Acceptance) => [acceptance.project_id, acceptance]),
    )
    const contracts = (data?.projects ?? []).map((project: Project) => ({
      ...project,
      acceptance: acceptances.get(project.id) ?? null,
    }))

    return Response.json(contracts, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("Admin NDA overview error", error)
    return Response.json({ error: "Sözleşme kayıtları yüklenemedi" }, { status: 500 })
  }
}
