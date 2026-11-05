import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { ThemeCustomizer } from "@/components/layout/theme-customizer"
import { SiteFrame } from "@/components/layout/site-frame"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { LanguageProvider } from "@/components/i18n/provider"
import { JsonLd } from "@/components/seo/json-ld"
import { getLanguage, localizeMetadata } from "@/lib/i18n/server"
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo"

const sourceMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://megdev.com.tr"),
  title: {
    default: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    template: "%s | Meg Dev",
  },
  description:
    "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz. İşletmenizi geleceğe taşıyan yenilikçi yazılım çözümleri.",
  applicationName: "Meg Dev",
  category: "technology",
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
    "seo uyumlu web sitesi",
    "Kayseri yazılım şirketi",
    "Kayseri web tasarım",
    "mobil uygulama geliştirme",
    "yapay zeka danışmanlığı"
  ],
  authors: [{ name: "Meg Dev", url: "https://megdev.com.tr" }],
  creator: "Meg Dev",
  publisher: "Meg Dev",
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/megdevicon.png",
  },
  openGraph: {
    title: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    description:
      "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz. İşletmenizi geleceğe taşıyan yenilikçi yazılım çözümleri.",
    url: "https://megdev.com.tr",
    siteName: "Meg Dev",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meg Dev | Yazılım Geliştirme ve Dijital Çözümler",
    description: "Web siteleri, mobil uygulamalar ve özel yazılım projeleri.",
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

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale, dictionary, t } = await getLanguage()
  return (
    <html lang={locale} className="h-full antialiased dark">
      <head>
        <meta name="theme-color" content="#10130e" />
        <meta name="google-site-verification" content="21Co6j1h-UaDjB7Jrj-Y2509q5285ToFPx7VkHAe8H4" />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [organizationJsonLd(locale, t), websiteJsonLd(locale, t)],
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1613898910331703');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1613898910331703&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LanguageProvider locale={locale} dictionary={dictionary}><SiteFrame>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <ThemeCustomizer />
        </SiteFrame></LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
