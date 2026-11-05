import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

const disallow = [
  "/admin/",
  "/api/",
  "/track/",
  "/teklif/",
  "/gizlilik-sozlesmesi/",
  "/musteri-bulma-sozlesmesi/",
  "/subtrack-hesap-silme",
  "/odeme",
  "/test-home",
]

const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
