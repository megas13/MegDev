import { localizeMetadata } from "@/lib/i18n/server"
import { T } from "@/components/i18n/text"
import type { Metadata } from "next"
import { ArrowRight, ExternalLink, Smartphone } from "lucide-react"
import Link from "@/components/i18n/link"
import { Button } from "@/components/ui/button"
import { PageIntro } from "@/components/ui/page-intro"

const downloads = [
  {
    name: "SubTrack",
    description: "Android APK — En son sürüm · 68 MB · 29 Ağustos 2026",
    href: "https://github.com/megas13/MegDev/raw/refs/heads/main/public/downloads/SubTrack-release.apk",
    fileName: "SubTrack-release.apk",
  },
  {
    name: "NexCounter",
    description: "Android APK — v1.0.0 · 5,8 MB · 15 Temmuz 2026",
    href: "/downloads/nexcounter.apk",
    fileName: "NexCounter.apk",
  },
]

const sourceMetadata: Metadata = {
  title: "İndirmeler",
  description: "Meg Dev mobil uygulamalarını indirin.",
}

export default function DownloadsPage() {
  return (
    <div>
      <PageIntro eyebrow="UYGULAMALAR" title="Deneyimi yanınıza alın." description="Yayındaki mobil uygulamaların en güncel APK dosyalarını buradan indirebilirsiniz." index="İNDİRMELER" />

      <section className="relative py-16 lg:py-24 bg-background/85 border-t border-foreground/10">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {downloads.map((download) => (
              <a
                key={download.name}
                href={download.href}
                download={download.fileName}
                className="rounded-3xl border border-foreground/15 bg-card/65 p-8 sm:p-10 flex flex-col items-start hover:border-foreground/40 transition-colors duration-300 group"
              >
                <div className="w-14 h-14 rounded-full border border-foreground/20 flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform duration-300">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-medium mb-3"><T>{download.name}</T></h2>
                <p className="text-muted-foreground mb-6">
                  <T>{download.description}</T>
                </p>
                <div className="mt-auto flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-background text-sm font-semibold group-hover:bg-primary/90 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                  <T>{"İndir"}</T></div>
              </a>
            ))}
          </div>

          <div className="mt-12 noise-panel border border-foreground/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3">
              <T>{"İstediğiniz dosyayı bulamadınız mı?"}</T></h2>
            <p className="text-muted-foreground mb-6">
              <T>{"İhtiyacınız olan dosya veya kaynak için bizimle iletişime geçin."}</T></p>
            <Link href="/contact">
              <Button size="lg" className="text-base">
                <T>{"İletişime Geçin"}</T><ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
