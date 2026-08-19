import { ContractApproval } from "@/components/contracts/contract-approval"

export default async function ReferralTerminationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <ContractApproval token={token} purpose="termination" />
}
