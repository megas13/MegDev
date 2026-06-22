"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/components/admin/auth-provider"
import { cn } from "@/lib/utils"
import { FileText, FolderKanban, Inbox, LogOut, LayoutDashboard, Menu, X, Kanban } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projeler", icon: Kanban },
  { href: "/admin/blogs", label: "Bloglar", icon: FileText },
  { href: "/admin/portfolio", label: "Portföy", icon: FolderKanban },
  { href: "/admin/messages", label: "Mesajlar", icon: Inbox },
]

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth()
  const pathname = usePathname()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10100d]">
        <div className="animate-spin h-8 w-8 border-2 border-[#d7ff43] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10100d] p-4 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d7ff43]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#39d0c2]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] bg-clip-text text-transparent">Meg Dev</span>
            </h1>
            <p className="text-sm text-[#b8afa1] mt-2">Admin Paneli</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setLoggingIn(true)
                setError(null)
                const err = await signIn(password)
                if (err) {
                  setError(err)
                  setLoggingIn(false)
                }
              }}
              className="space-y-4"
            >
              <input
                type="password"
                placeholder="Admin Şifresi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] bg-white/[0.03] transition-all"
              />
              {error && <p className="text-sm text-[#ff6b35]">{error}</p>}
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] font-bold py-3.5 transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.3)] disabled:opacity-50"
              >
                {loggingIn ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#10100d]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white/[0.03] border-r border-white/10 transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-3 pt-2">
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] bg-clip-text text-transparent">Meg Dev</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#817b70]">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-[#b8afa1] hover:text-[#f7f3ea]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group",
                    isActive
                      ? "bg-[#d7ff43]/10 text-[#d7ff43]"
                      : "text-[#817b70] hover:text-[#f7f3ea] hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#d7ff43] rounded-full shadow-[0_0_10px_rgba(215,255,67,0.5)]" />
                  )}
                  <Icon className={cn("w-4 h-4", isActive && "text-[#d7ff43]")} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all mt-auto"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/[0.03] border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#b8afa1] hover:text-[#f7f3ea]">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-[#f7f3ea]">
                  {navItems.find((i) => i.href === pathname)?.label || "Admin"}
                </h2>
                <p className="text-xs text-[#817b70]">
                  {pathname === "/admin" ? "Genel bakış" : `${navItems.find((i) => i.href === pathname)?.label || ""} yönetimi`}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d7ff43] to-[#39d0c2] flex items-center justify-center text-[10px] font-black text-[#10100d]">M</div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  )
}
