import { ContractApproval } from "@/components/contracts/contract-approval"

export default async function ReferralContractPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <ContractApproval token={token} purpose="acceptance" />
}
