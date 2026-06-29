import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, House, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı | Meg Dev",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative text-center px-4 max-w-lg">
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Search className="w-10 h-10 text-primary" />
        </div>

        <p className="text-[140px] sm:text-[180px] font-black leading-none text-gradient mb-4">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak
          kullanılamıyor olabilir. Ana sayfaya dönerek gezinmeye devam edebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="text-base w-full sm:w-auto">
              <House className="w-4 h-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="text-base w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              İletişime Geç
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
