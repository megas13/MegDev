import type { Metadata } from "next"
import { Smartphone, ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "İndirmeler | Meg Dev",
  description: "SubTrack mobil uygulamasını indirin.",
}

export default function DownloadsPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">İndirmeler</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SubTrack uygulamasının en son sürümünü buradan indirebilirsiniz.
          </p>
        </div>
      </div>

      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/downloads/app-release.apk"
            className="sharp-panel rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">SubTrack</h2>
            <p className="text-muted-foreground mb-6">
              Android APK — En son sürüm
            </p>
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-semibold group-hover:bg-primary/90 transition-colors">
              <ExternalLink className="w-5 h-5" />
              İndir
            </div>
          </a>

          <div className="mt-12 noise-panel border border-foreground/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3">İstediğiniz dosyayı bulamadınız mı?</h2>
            <p className="text-muted-foreground mb-6">
              İhtiyacınız olan dosya veya kaynak için bizimle iletişime geçin.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-base">
                İletişime Geçin
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
