import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/quotes/public/*/pdf": ["./public/fonts/NotoSans-*.ttf"],
    "/opengraph-image": ["./public/fonts/NotoSans-*.ttf"],
    "/twitter-image": ["./public/fonts/NotoSans-*.ttf"],
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
