"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FileText, FolderKanban, Inbox, ArrowUpRight } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ blogs: 0, portfolios: 0, messages: 0, unread: 0 })

  useEffect(() => {
    Promise.all([
      fetch("/api/blog").then((r) => r.json()),
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
    ]).then(([blogs, portfolios, messages]) => {
      const b = Array.isArray(blogs) ? blogs : []
      const p = Array.isArray(portfolios) ? portfolios : []
      const m = Array.isArray(messages) ? messages : []
      setStats({ blogs: b.length, portfolios: p.length, messages: m.length, unread: m.filter((x: any) => !x.read).length })
    })
  }, [])

  const cards = [
    { label: "Bloglar", value: stats.blogs, icon: FileText, href: "/admin/blogs", gradient: "from-[#d7ff43] to-[#a0e600]", glow: "rgba(215,255,67,0.15)" },
    { label: "Portföy", value: stats.portfolios, icon: FolderKanban, href: "/admin/portfolio", gradient: "from-[#39d0c2] to-[#1a9e8f]", glow: "rgba(57,208,194,0.15)" },
    { label: "Mesajlar", value: stats.messages, icon: Inbox, href: "/admin/messages", gradient: "from-[#ff6b35] to-[#e04400]", glow: "rgba(255,107,53,0.15)", sub: `${stats.unread} okunmamış` },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#f7f3ea]">Dashboard</h1>
        <p className="text-sm text-[#817b70] mt-1">Meg Dev admin paneline hoş geldiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] overflow-hidden"
            >
              <div className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" style={{ background: card.glow }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", card.gradient)}>
                    <Icon className="w-6 h-6 text-[#10100d]" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#817b70] group-hover:text-[#f7f3ea] transition-colors" />
                </div>
                <p className="text-4xl font-black text-[#f7f3ea]">{card.value}</p>
                <p className="text-sm text-[#b8afa1] mt-1">{card.label}</p>
                {card.sub && <p className="text-xs mt-2 text-[#ff6b35]">{card.sub}</p>}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
        <p className="text-sm text-[#817b70] text-center">Tüm veriler Nhost üzerinde güvenle saklanmaktadır</p>
      </div>
    </div>
  )
}
