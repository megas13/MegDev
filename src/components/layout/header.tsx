"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigation } from "@/constants"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-nav/95 backdrop-blur-xl border-b border-foreground/10" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-xl font-black tracking-tight text-gradient">
              Meg Dev
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2 py-2 backdrop-blur-xl">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative group",
                  pathname === item.href
                    ? "bg-primary text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact">
              <Button size="sm">
                Teklif Al
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full border border-foreground/10 bg-foreground/5 hover:bg-card-hover transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-foreground/10 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-[8px] text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Link href="/contact">
                  <Button className="w-full">Teklif Al</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
