import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { ThemeCustomizer } from "@/components/layout/theme-customizer"

export const metadata: Metadata = {
  title: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
  description:
    "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz. İşletmenizi geleceğe taşıyan yazılım çözümleri.",
  keywords: [
    "yazılım şirketi",
    "web sitesi",
    "mobil uygulama",
    "yapay zeka",
    "e-ticaret",
    "crm",
    "özel yazılım",
  ],
  icons: {
    icon: "/megdevicon.png",
  },
  openGraph: {
    title: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    description:
      "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz.",
    type: "website",
    locale: "tr_TR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="h-full antialiased dark">
      <head>
        <meta name="theme-color" content="#10100d" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ThemeCustomizer />
      </body>
    </html>
  )
}
