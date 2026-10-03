"use client"

import { T } from "@/components/i18n/text"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { MotionConfig } from "framer-motion"
import { basePath } from "@/lib/i18n/config"

function SiteBackdrop() {
  return <div className="site-backdrop" aria-hidden="true" />
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = basePath(usePathname())
  const admin = pathname === "/admin" || pathname.startsWith("/admin/")
  if (admin) return <div className="admin-site"><T>{children}</T></div>
  return <MotionConfig reducedMotion="user"><div className="public-site"><SiteBackdrop /><T>{children}</T></div></MotionConfig>
}
