import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { ContractAccessForm } from "./contract-access-form"

const sourceMetadata: Metadata = {
  title: "Gizlilik Sözleşmesi | Meg Dev",
  description: "Meg Dev gizlilik sözleşmesi güvenli erişim sayfası.",
  robots: { index: false, follow: false },
}

export default function NdaAccessPage() {
  return <ContractAccessForm />
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
