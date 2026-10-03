"use client"

import { basePath } from "@/lib/i18n/config"


import { T, LocalizedElement } from "@/components/i18n/text"
import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { Palette, X } from "lucide-react"

interface ThemeColor {
  id: string
  name: string
  primary: string
  primaryDark: string
  colorClass: string // For background color preview
}

const THEMES: ThemeColor[] = [
  { id: "lime", name: "Limon", primary: "#d7ff43", primaryDark: "#b8df24", colorClass: "bg-[#d7ff43]" },
  { id: "cyan", name: "Siber Mavi", primary: "#39d0c2", primaryDark: "#1ab2a4", colorClass: "bg-[#39d0c2]" },
  { id: "pink", name: "Kozmik Pembe", primary: "#ff3bb0", primaryDark: "#d9208f", colorClass: "bg-[#ff3bb0]" },
  { id: "orange", name: "Güneş Turuncusu", primary: "#ff6b35", primaryDark: "#d94f1b", colorClass: "bg-[#ff6b35]" },
  { id: "purple", name: "Neon Mor", primary: "#a855f7", primaryDark: "#8b3cc7", colorClass: "bg-[#a855f7]" },
]

function LegacyThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false)
  const activeTheme = useSyncExternalStore(subscribeTheme, readLegacyTheme, () => "lime")

  useEffect(() => {
    const theme = THEMES.find((item) => item.id === activeTheme) || THEMES[0]
    document.documentElement.style.setProperty("--primary", theme.primary)
    document.documentElement.style.setProperty("--primary-dark", theme.primaryDark)
    document.documentElement.style.setProperty("--megdev-home-primary", theme.primary)
    document.documentElement.style.setProperty("--megdev-home-primary-dark", theme.primaryDark)
  }, [activeTheme])

  const applyTheme = (theme: ThemeColor) => {
    localStorage.setItem("megdev-theme", theme.id)
    window.dispatchEvent(new Event(THEME_EVENT))
  }
  return (
    <div className="fixed bottom-28 right-6 z-50 flex flex-col items-end gap-2">
      {/* Expanded Palette Selection Panel */}
      {isOpen && (
        <div className="sharp-panel noise-panel p-4 flex flex-col gap-3 rounded-[8px] bg-card/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-foreground/10 animate-in fade-in slide-in-from-bottom-5 duration-200 w-44">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground"><T>{"TEMA RENGİ"}</T></span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme)}
                className={`flex items-center gap-3 w-full p-2 text-left text-xs font-bold transition-all ${
                  activeTheme === theme.id
                    ? "bg-foreground/5 border border-primary/40 text-primary"
                    : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${theme.colorClass} shrink-0`} />
                <span><T>{theme.name}</T></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <LocalizedElement as="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tema Değiştir"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-[#10100d]/90 text-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:scale-105 shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative group overflow-hidden"
      >
        <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Palette className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:rotate-45" />
      </LocalizedElement>
    </div>
  )
}

const THEME_EVENT = "megdev-studio-theme-change"

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(THEME_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

function readLegacyTheme() {
  try {
    const saved = localStorage.getItem("megdev-theme")
    return THEMES.some((theme) => theme.id === saved) ? saved! : "lime"
  } catch {
    return "lime"
  }
}

export function ThemeCustomizer() {
  const pathname = basePath(usePathname())
  // The public website has one fixed brand palette; admin preferences remain separate.
  return pathname === "/admin" || pathname.startsWith("/admin/") ? <LegacyThemeCustomizer /> : null
}
