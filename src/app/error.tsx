"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert, RefreshCw, House } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative text-center px-4 max-w-lg">
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
          <TriangleAlert className="w-10 h-10 text-secondary" />
        </div>

        <p className="text-[140px] sm:text-[180px] font-black leading-none text-gradient mb-4">
          500
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Bir Hata Oluştu
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Beklenmedik bir sorunla karşılaştık. Lütfen tekrar deneyin veya
          bizimle iletişime geçin. Sorunu en kısa sürede çözeceğiz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset}>
            <Button size="lg" className="text-base w-full sm:w-auto">
              <RefreshCw className="w-4 h-4" />
              Tekrar Dene
            </Button>
          </button>
          <Link href="/">
            <Button variant="outline" size="lg" className="text-base w-full sm:w-auto">
              <House className="w-4 h-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
