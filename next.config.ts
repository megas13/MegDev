import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/quotes/public/*/pdf": ["./public/fonts/NotoSans-*.ttf"],
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
