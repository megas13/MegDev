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
        url: "/og-image.png",
        width: 1200,
        height: 630,
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
        <meta name="google-site-verification" content="21Co6j1h-UaDjB7Jrj-Y2509q5285ToFPx7VkHAe8H4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Meg Dev",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://meg.dev",
              logo: "/megdevicon.png",
              email: "destek@megdev.info",
              telephone: "+905379830414",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Demokrasi Mah 2233. Sk",
                addressLocality: "Melikgazi",
                addressRegion: "Kayseri",
                addressCountry: "TR",
              },
              sameAs: [
                "https://facebook.com/megdev",
                "https://twitter.com/megdev",
                "https://linkedin.com/company/megdev",
                "https://instagram.com/megdev",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Meg Dev",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://meg.dev",
              description: "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz.",
              inLanguage: "tr",
            }),
          }}
        />
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
