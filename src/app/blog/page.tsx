import type { Metadata } from "next"
import { BlogSection } from "@/components/sections/blog-section"

export const metadata: Metadata = {
  title: "Blog | Meg Dev",
  description: "Yazılım dünyasındaki son gelişmeler, ipuçları ve sektör trendleri.",
}

export default function BlogPage() {
  return (
    <div className="pt-20">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Yazılım dünyasındaki son gelişmeler, ipuçları ve sektör trendleri.
          </p>
        </div>
      </div>
      <BlogSection />
    </div>
  )
}
