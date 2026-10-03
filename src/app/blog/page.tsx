import { localizeMetadata } from "@/lib/i18n/server"
import type { Metadata } from "next"
import { PageIntro } from "@/components/ui/page-intro"
import { BlogSection } from "@/components/sections/blog-section"

const sourceMetadata: Metadata = {
  title: "Blog",
  description: "Yazılım dünyasındaki son gelişmeler, ipuçları ve sektör trendleri.",
}

export default function BlogPage() {
  return (
    <div>
      <PageIntro index="05" eyebrow="NOTLAR" title="Blog" description="Yazılım dünyasındaki son gelişmeler, ipuçları ve sektör trendleri." />
      <BlogSection />
    </div>
  )
}

export async function generateMetadata() { return localizeMetadata(sourceMetadata) }
