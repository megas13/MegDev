import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { ThemeCustomizer } from "@/components/layout/theme-customizer"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://meg.dev"),
  title: {
    default: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    template: "%s | Meg Dev",
  },
  description:
    "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz. İşletmenizi geleceğe taşıyan yenilikçi yazılım çözümleri.",
  keywords: [
    "yazılım şirketi",
    "web geliştirme",
    "web sitesi",
    "mobil uygulama",
    "yapay zeka",
    "e-ticaret",
    "crm yazılımı",
    "özel yazılım",
    "kurumsal yazılım",
    "seo uyumlu web sitesi"
  ],
  authors: [{ name: "Meg Dev" }],
  creator: "Meg Dev",
  publisher: "Meg Dev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/megdevicon.png",
    apple: "/megdevicon.png",
  },
  openGraph: {
    title: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    description:
      "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz. İşletmenizi geleceğe taşıyan yenilikçi yazılım çözümleri.",
    url: "https://meg.dev",
    siteName: "Meg Dev",
    images: [
      {
        url: "/megdevicon.png", // Daha iyi bir OG image eklenebilir (örn: 1200x630)
        width: 800,
        height: 600,
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    description: "Web siteleri, mobil uygulamalar ve özel yazılım projeleri.",
    images: ["/megdevicon.png"],
    creator: "@megdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
