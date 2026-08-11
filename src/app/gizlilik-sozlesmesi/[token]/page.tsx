import type { Metadata } from "next"
import { NdaPageClient } from "./nda-page-client"

export const metadata: Metadata = {
  title: "Gizlilik Sözleşmesi | Meg Dev",
  description: "Meg Dev proje gizlilik sözleşmesi güvenli kabul sayfası.",
  robots: { index: false, follow: false },
}

export default async function NdaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <NdaPageClient token={token} />
}
