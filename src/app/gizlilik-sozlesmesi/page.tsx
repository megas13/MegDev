import type { Metadata } from "next"
import { ContractAccessForm } from "./contract-access-form"

export const metadata: Metadata = {
  title: "Gizlilik Sözleşmesi | Meg Dev",
  description: "Meg Dev gizlilik sözleşmesi güvenli erişim sayfası.",
  robots: { index: false, follow: false },
}

export default function NdaAccessPage() {
  return <ContractAccessForm />
}
