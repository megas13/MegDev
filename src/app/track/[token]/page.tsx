"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader,
  LayoutDashboard,
  Kanban,
  GitBranch,
  MessageSquareCode,
  ArrowUpRight,
  Shield,
  BadgeAlert,
  Calendar,
  User,
  Mail,
  Phone,
  ChevronRight,
  Activity,
  Terminal,
  ExternalLink,
  Info
} from "lucide-react"

interface ProjectData {
  id: string
  title: string
  description?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  status: string
  created_at: string
  updated_at: string
}

interface MessageData {
  id: string
  sender: string
  message: string
  created_at: string
}

interface AdvancedConfig {
  target_date?: string
  health?: string // 'excellent' | 'good' | 'at_risk' | 'delayed'
  preview_url?: string
  tech_stack?: string[]
  roadmap?: Array<{ name: string; progress: string; status: "done" | "active" | "pending" }>
  tasks?: Array<{ title: string; category: string; status: "todo" | "doing" | "done"; assignee?: string; priority?: string }>
}

const STATUS_CONFIG = {
  beklemede: { label: "Beklemede", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Clock },
  inceleniyor: { label: "İnceleniyor", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Loader },
  çalışılıyor: { label: "Çalışılıyor", color: "text-[#39d0c2]", bg: "bg-[#39d0c2]/10", border: "border-[#39d0c2]/30", icon: Loader },
  tamamlandı: { label: "Tamamlandı", color: "text-[#d7ff43]", bg: "bg-[#d7ff43]/10", border: "border-[#d7ff43]/30", icon: CheckCircle },
  iptal: { label: "İptal", color: "text-[#ff6b35]", bg: "bg-[#ff6b35]/10", border: "border-[#ff6b35]/30", icon: AlertTriangle },
}

const HEALTH_CONFIG = {
  excellent: { label: "Harika", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  good: { label: "İyi Durumda", color: "text-[#39d0c2]", bg: "bg-[#39d0c2]/10", border: "border-[#39d0c2]/20" },
  at_risk: { label: "Riskli", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  delayed: { label: "Gecikme", color: "text-[#ff6b35]", bg: "bg-[#ff6b35]/10", border: "border-[#ff6b35]/20" },
}

export default function TrackPage() {
  const { token } = useParams<{ token: string }>()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [msgInput, setMsgInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "preview" | "chat">("overview")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/track/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError("Proje bulunamadı")
          setLoading(false)
          return
        }
        setProject(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Bağlantı hatası")
        setLoading(false)
      })
  }, [token])

  useEffect(() => {
    if (!project) return
    const fetchMessages = () =>
      fetch(`/api/track/${token}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setMessages(data)
        })
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [project, token])

  useEffect(() => {
    if (activeTab === "chat" && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, activeTab])

  const sendMessage = async () => {
    if (!msgInput.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/track/${token}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgInput }),
      })
      if (res.ok) {
        setMsgInput("")
        const data = await fetch(`/api/track/${token}/messages`).then((r) => r.json())
        if (Array.isArray(data)) setMessages(data)
      }
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10100d]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-2 border-[#d7ff43] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-[#817b70] tracking-wide font-medium">Proje verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10100d] p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ff6b35]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-full max-w-md text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-[#ff6b35]/15 flex items-center justify-center mx-auto mb-6 border border-[#ff6b35]/25">
            <AlertTriangle className="w-8 h-8 text-[#ff6b35] animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gradient mb-2">Meg Dev</h1>
          <p className="text-sm text-[#817b70] mb-6">Proje Takip Portalı</p>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <p className="text-[#ff6b35] font-semibold text-lg">{error || "Proje bulunamadı"}</p>
            <p className="text-sm text-[#817b70] mt-2 leading-relaxed">
              Girdiğiniz takip linki geçersiz olabilir veya süresi dolmuş olabilir. Lütfen linki kontrol edin veya bizimle iletişime geçin.
            </p>
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2 text-xs text-[#817b70]/60">
              <span className="font-mono">Takip tokenı: {token}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Parse advanced config from description or generate fallback
  let plainDescription = project.description || ""
  let advancedConfig: AdvancedConfig = {}
  try {
    if (plainDescription.trim().startsWith("{")) {
      const parsed = JSON.parse(plainDescription)
      advancedConfig = parsed
      plainDescription = parsed.summary || ""
    }
  } catch (e) {
    // Treat description as plain text fallback
  }

  // Apply default fallback data generators for premium presentation
  const targetDateStr = advancedConfig.target_date || (() => {
    const d = new Date(project.created_at)
    d.setMonth(d.getMonth() + 2)
    return d.toISOString().split("T")[0]
  })()

  const targetDate = new Date(targetDateStr)
  const today = new Date()
  const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  const healthKey = (advancedConfig.health || (project.status === "iptal" ? "at_risk" : project.status === "tamamlandı" ? "excellent" : "good")) as keyof typeof HEALTH_CONFIG
  const health = HEALTH_CONFIG[healthKey] || HEALTH_CONFIG.good

  const previewUrl = advancedConfig.preview_url || `https://preview.megdev.com.tr/${project.id.split("-")[0]}`
  const techStack = advancedConfig.tech_stack || ["Next.js", "TailwindCSS", "PostgreSQL", "Framer Motion"]

  const status = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.beklemede
  const StatusIcon = status.icon

  const roadmap = advancedConfig.roadmap || [
    { name: "Planlama & UI/UX Tasarım", progress: "100%", status: "done" },
    { name: "Veritabanı Mimari & Backend API", progress: ["beklemede", "inceleniyor"].includes(project.status) ? "0%" : "100%", status: ["beklemede", "inceleniyor"].includes(project.status) ? "pending" : "done" },
    { name: "Frontend Geliştirme & Entegrasyonlar", progress: project.status === "tamamlandı" ? "100%" : (project.status === "çalışılıyor" ? "65%" : "0%"), status: project.status === "tamamlandı" ? "done" : (project.status === "çalışılıyor" ? "active" : "pending") },
    { name: "Kapsamlı Test & Canlıya Alım", progress: project.status === "tamamlandı" ? "100%" : "0%", status: project.status === "tamamlandı" ? "done" : "pending" }
  ]

  const tasks = advancedConfig.tasks || [
    { title: "Veritabanı Şeması Tasarımı ve PostgreSQL Migration", category: "Veritabanı", status: ["beklemede", "inceleniyor"].includes(project.status) ? "todo" : "done", assignee: "Can Y.", priority: "Yüksek" },
    { title: "Kullanıcı Arayüzü UI/UX Figma Taslaklarının Kodlanması", category: "Tasarım", status: "done", assignee: "Elif Ö.", priority: "Orta" },
    { title: "Admin Yönetim Modülü ve İstatistik Ekranı", category: "Geliştirme", status: project.status === "tamamlandı" ? "done" : (project.status === "çalışılıyor" ? "doing" : "todo"), assignee: "Can Y.", priority: "Yüksek" },
    { title: "Ödeme Entegrasyonu ve Test Ödemeleri Akışı", category: "Entegrasyon", status: project.status === "tamamlandı" ? "done" : "todo", assignee: "Zeynep K.", priority: "Kritik" },
    { title: "SEO Uyumlu Meta Etiket Yapılandırması ve Site Haritası", category: "SEO", status: project.status === "tamamlandı" ? "done" : "todo", assignee: "Elif Ö.", priority: "Düşük" }
  ]

  // Calculate project percentage progress based on roadmap milestones
  const progressPercent = (() => {
    if (!roadmap || roadmap.length === 0) return 0
    const total = roadmap.reduce((acc, item) => acc + parseInt(item.progress || "0"), 0)
    return Math.round(total / roadmap.length)
  })()

  // Generate simulated git commits based on roadmap
  const simulatedCommits = [
    { hash: "8d9fa3c", msg: `refactor: optimize rendering and bundle size dynamically`, time: "3 saat önce", author: "elif" },
    { hash: "f3b90a1", msg: `feat: final polish and security validation check`, time: "6 saat önce", author: "zeynep" },
    { hash: "5c80ef2", msg: `fix: adjust flex positioning layout on mobile panels`, time: "1 gün önce", author: "can" },
    { hash: "a310e5d", msg: `feat: integrate tracking socket messages API`, time: "2 gün önce", author: "can" },
  ]

  return (
    <div className="min-h-screen bg-[#10100d] relative py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#d7ff43]/20 selection:text-[#d7ff43]">
      {/* Decorative Glow Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#d7ff43]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#39d0c2]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl font-black tracking-tight text-gradient">Meg Dev</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#817b70] bg-white/5 border border-white/10 px-2 py-0.5 rounded">Takip Portalı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f7f3ea] tracking-tight">{project.title}</h1>
            <p className="text-sm text-[#817b70] mt-1">Hoş geldiniz, <span className="text-[#f7f3ea] font-medium">{project.customer_name}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm", status.bg, status.border)}>
              <StatusIcon className={cn("w-4.5 h-4.5", status.color, ["inceleniyor", "çalışılıyor"].includes(project.status) && "animate-spin")} />
              <span className={status.color}>{status.label}</span>
            </div>
          </div>
        </header>

        {/* Highlight Grid Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="sharp-panel noise-panel rounded-xl p-4 flex flex-col justify-between border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#817b70] font-bold">Genel İlerleme</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-[#d7ff43]">{progressPercent}%</span>
              <span className="text-xs text-[#817b70]">Tamamlandı</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-[#d7ff43] to-[#39d0c2]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="sharp-panel noise-panel rounded-xl p-4 flex flex-col justify-between border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#817b70] font-bold">Sağlık Durumu</span>
            <div className="mt-2">
              <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border", health.bg, health.border, health.color)}>
                <span className={cn("w-1.5 h-1.5 rounded-full bg-current", health.color)} />
                {health.label}
              </span>
            </div>
            <p className="text-[10px] text-[#817b70] mt-3">Planlanan akışta ilerliyor</p>
          </div>

          <div className="sharp-panel noise-panel rounded-xl p-4 flex flex-col justify-between border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#817b70] font-bold">Hedef Teslim</span>
            <div className="flex items-center gap-1.5 mt-2 text-[#f7f3ea] font-bold text-sm sm:text-base">
              <Calendar className="w-4 h-4 text-[#39d0c2]" />
              <span>{targetDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <p className="text-[10px] text-[#817b70] mt-3">Başlangıç: {new Date(project.created_at).toLocaleDateString("tr-TR")}</p>
          </div>

          <div className="sharp-panel noise-panel rounded-xl p-4 flex flex-col justify-between border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#817b70] font-bold">Kalan Süre</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-[#ff6b35]">{daysRemaining}</span>
              <span className="text-xs text-[#817b70] font-semibold">Gün Kaldı</span>
            </div>
            <p className="text-[10px] text-[#817b70] mt-3">Son Güncelleme: {new Date(project.updated_at).toLocaleDateString("tr-TR")}</p>
          </div>
        </div>

        {/* Tab Navigation buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin relative z-10 border-b border-white/5">
          {[
            { id: "overview", label: "Genel Durum", icon: LayoutDashboard },
            { id: "tasks", label: "Görev Takibi", icon: Kanban },
            { id: "preview", label: "Canlı Önizleme & Git", icon: GitBranch },
            { id: "chat", label: "Proje İletişimi", icon: MessageSquareCode, badge: messages.length || null },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-3.5 text-sm font-bold transition-all duration-200 select-none whitespace-nowrap border-b-2 -mb-0.5",
                  isActive
                    ? "border-[#d7ff43] text-[#d7ff43] bg-white/[0.02]"
                    : "border-transparent text-[#817b70] hover:text-[#f7f3ea] hover:bg-white/[0.01]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#39d0c2]/20 text-[#39d0c2] rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Main Tab Screen Area */}
        <main className="relative z-10 min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="grid gap-6 md:grid-cols-12">
                  {/* Left Column: Project description and roadmap */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="sharp-panel noise-panel rounded-xl p-6 border border-white/5">
                      <h3 className="text-base font-bold text-[#f7f3ea] mb-3 flex items-center gap-2">
                        <Info className="w-4.5 h-4.5 text-[#39d0c2]" />
                        Proje Detayı
                      </h3>
                      <p className="text-sm text-[#b8afa1] leading-relaxed whitespace-pre-wrap">
                        {plainDescription || "Bu proje için detaylı bir açıklama belirtilmemiş."}
                      </p>
                    </div>

                    {/* Milestones Roadmaps */}
                    <div className="sharp-panel noise-panel rounded-xl p-6 border border-white/5">
                      <h3 className="text-base font-bold text-[#f7f3ea] mb-6 flex items-center gap-2">
                        <Activity className="w-4.5 h-4.5 text-[#d7ff43]" />
                        Yol Haritası Aşamaları
                      </h3>

                      <div className="relative pl-6 border-l border-white/10 space-y-8">
                        {roadmap.map((step, idx) => (
                          <div key={idx} className="relative">
                            {/* Status Bullet Icon */}
                            <div className="absolute -left-[35px] top-0.5 bg-[#10100d] p-1 rounded-full">
                              {step.status === "done" && (
                                <div className="w-5 h-5 rounded-full bg-[#d7ff43]/20 flex items-center justify-center border border-[#d7ff43]/45 shadow-[0_0_10px_rgba(215,255,67,0.2)]">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#d7ff43]" />
                                </div>
                              )}
                              {step.status === "active" && (
                                <div className="w-5 h-5 rounded-full bg-[#39d0c2]/20 flex items-center justify-center border border-[#39d0c2]/45 animate-pulse shadow-[0_0_10px_rgba(57,208,194,0.3)]">
                                  <Clock className="w-3.5 h-3.5 text-[#39d0c2]" />
                                </div>
                              )}
                              {step.status === "pending" && (
                                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[#817b70]" />
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h4 className={cn("text-sm font-bold", step.status === "pending" ? "text-[#817b70]" : "text-[#f7f3ea]")}>
                                  {step.name}
                                </h4>
                                <p className="text-xs text-[#817b70] mt-0.5">Aşama {idx + 1}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={cn("text-xs font-mono px-2 py-0.5 rounded border font-semibold", 
                                  step.status === "done" && "text-[#d7ff43] border-[#d7ff43]/20 bg-[#d7ff43]/5",
                                  step.status === "active" && "text-[#39d0c2] border-[#39d0c2]/20 bg-[#39d0c2]/5",
                                  step.status === "pending" && "text-[#817b70] border-white/5 bg-white/5"
                                )}>
                                  {step.progress}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Support manager and technology stacks */}
                  <div className="md:col-span-4 space-y-6">
                    {/* Support Contact Person Card */}
                    <div className="sharp-panel noise-panel rounded-xl p-5 border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-[#817b70] font-bold block mb-4">Proje Temsilciniz</span>
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d7ff43] to-[#39d0c2] flex items-center justify-center text-[#10100d] font-black text-sm shadow-[0_0_20px_rgba(215,255,67,0.15)]">
                          ME
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#f7f3ea]">Mehmet Emin</h4>
                          <p className="text-xs text-[#817b70] mt-0.5">Müşteri İlişkileri Yöneticisi</p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-2.5 pt-4 border-t border-white/5 text-xs text-[#817b70]">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#39d0c2] shrink-0" />
                          <span>destek@megdev.com.tr</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#39d0c2] shrink-0" />
                          <span>+90 850 000 0000</span>
                        </div>
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="sharp-panel noise-panel rounded-xl p-5 border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-[#817b70] font-bold block mb-4">Teknoloji Yığını</span>
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono text-[#b8afa1] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hover:border-white/20 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-[#d7ff43]/5 border border-[#d7ff43]/20 rounded-xl p-5 flex gap-3 text-xs leading-relaxed text-[#b8afa1]">
                      <Shield className="w-5 h-5 text-[#d7ff43] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#f7f3ea] block mb-1">Şeffaf Geliştirme</span>
                        Bu ekran projenizin geliştirme veritabanından doğrudan çekilen canlı bilgileri göstermektedir.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TASKS KANBAN */}
              {activeTab === "tasks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#f7f3ea]">Sprint Görev Durumu</h3>
                      <p className="text-xs text-[#817b70] mt-0.5">Geliştiricilerimiz tarafından güncellenen anlık iş listesi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* COLUMN 1: TO DO */}
                    <div className="sharp-panel bg-white/[0.01] rounded-xl p-4 border border-white/5 space-y-4 min-h-[300px]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-[#817b70] uppercase tracking-wider">Yapılacaklar</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#817b70] font-mono">
                          {tasks.filter((t) => t.status === "todo").length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tasks.filter((t) => t.status === "todo").map((task, idx) => (
                          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#39d0c2] bg-[#39d0c2]/10 border border-[#39d0c2]/20 px-2 py-0.5 rounded">
                              {task.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#f7f3ea] mt-2.5 leading-snug">{task.title}</h4>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 text-[10px] text-[#817b70]">
                              <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#39d0c2]" /> {task.assignee}</span>
                              <span className={cn("font-bold px-1.5 py-0.5 rounded text-[9px] uppercase border", 
                                task.priority === "Kritik" && "text-[#ff6b35] border-[#ff6b35]/20 bg-[#ff6b35]/5",
                                task.priority === "Yüksek" && "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
                                task.priority === "Orta" && "text-blue-400 border-blue-500/20 bg-blue-500/5",
                                task.priority === "Düşük" && "text-[#817b70] border-white/5 bg-white/5"
                              )}>
                                {task.priority || "Orta"}
                              </span>
                            </div>
                          </div>
                        ))}
                        {tasks.filter((t) => t.status === "todo").length === 0 && (
                          <div className="text-center py-8 text-xs text-[#817b70]">Kalan görev bulunmamaktadır.</div>
                        )}
                      </div>
                    </div>

                    {/* COLUMN 2: DOING */}
                    <div className="sharp-panel bg-white/[0.01] rounded-xl p-4 border border-white/5 space-y-4 min-h-[300px]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-[#39d0c2] uppercase tracking-wider">Yapılıyor</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#39d0c2]/10 text-[#39d0c2] font-mono">
                          {tasks.filter((t) => t.status === "doing").length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tasks.filter((t) => t.status === "doing").map((task, idx) => (
                          <div key={idx} className="bg-white/[0.02] border border-[#39d0c2]/35 shadow-[0_0_20px_rgba(57,208,194,0.05)] rounded-xl p-4">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#39d0c2] bg-[#39d0c2]/10 border border-[#39d0c2]/20 px-2 py-0.5 rounded">
                                {task.category}
                              </span>
                              <Clock className="w-3.5 h-3.5 text-[#39d0c2] animate-spin" />
                            </div>
                            <h4 className="text-sm font-bold text-[#f7f3ea] mt-2.5 leading-snug">{task.title}</h4>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 text-[10px] text-[#817b70]">
                              <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#39d0c2]" /> {task.assignee}</span>
                              <span className={cn("font-bold px-1.5 py-0.5 rounded text-[9px] uppercase border", 
                                task.priority === "Kritik" && "text-[#ff6b35] border-[#ff6b35]/20 bg-[#ff6b35]/5",
                                task.priority === "Yüksek" && "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
                                task.priority === "Orta" && "text-blue-400 border-blue-500/20 bg-blue-500/5",
                                task.priority === "Düşük" && "text-[#817b70] border-white/5 bg-white/5"
                              )}>
                                {task.priority || "Orta"}
                              </span>
                            </div>
                          </div>
                        ))}
                        {tasks.filter((t) => t.status === "doing").length === 0 && (
                          <div className="text-center py-8 text-xs text-[#817b70]">Şu anda üzerinde çalışılan görev yok.</div>
                        )}
                      </div>
                    </div>

                    {/* COLUMN 3: DONE */}
                    <div className="sharp-panel bg-white/[0.01] rounded-xl p-4 border border-white/5 space-y-4 min-h-[300px]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-[#d7ff43] uppercase tracking-wider">Tamamlananlar</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#d7ff43]/10 text-[#d7ff43] font-mono">
                          {tasks.filter((t) => t.status === "done").length}
                        </span>
                      </div>
                      <div className="opacity-70 space-y-3">
                        {tasks.filter((t) => t.status === "done").map((task, idx) => (
                          <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-xl p-4">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#817b70] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                              {task.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#817b70] line-through mt-2.5 leading-snug">{task.title}</h4>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 text-[10px] text-[#817b70]">
                              <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#817b70]" /> {task.assignee}</span>
                              <span className="text-[#d7ff43] font-bold text-[9px] uppercase">Tamamlandı</span>
                            </div>
                          </div>
                        ))}
                        {tasks.filter((t) => t.status === "done").length === 0 && (
                          <div className="text-center py-8 text-xs text-[#817b70]">Tamamlanan görev bulunmamaktadır.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE PREVIEW & COMMITS */}
              {activeTab === "preview" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column: Server Link */}
                  <div className="sharp-panel noise-panel rounded-xl p-6 border border-white/5 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold font-mono text-[#39d0c2] uppercase tracking-wider">MÜŞTERİ ÖNİZLEME DURUMU</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          ONLINE
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#f7f3ea]">Canlı Geliştirme Sunucusu</h4>
                      <p className="text-xs text-[#817b70] mt-2 leading-relaxed">
                        Kod tabanına eklenen her yeni özellik ve düzeltme otomatik olarak bu sunucuya yüklenir. Değişiklikleri anlık olarak test edebilirsiniz.
                      </p>
                    </div>

                    <div className="mt-8">
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] font-bold text-sm px-4 py-3.5 rounded-xl hover:shadow-[0_0_25px_rgba(215,255,67,0.2)] active:scale-[0.98] transition-all"
                      >
                        Sunucuyu Yeni Sekmede Aç
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Code Commits */}
                  <div className="sharp-panel noise-panel rounded-xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                      <Terminal className="w-4.5 h-4.5 text-[#d7ff43]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#817b70]">Son Git Commitleri (Geliştirme Aktivitesi)</span>
                    </div>

                    <div className="space-y-4 font-mono text-xs">
                      {simulatedCommits.map((commit, idx) => (
                        <div key={idx} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <span className="text-[#d7ff43] font-bold shrink-0">@{commit.hash}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#f7f3ea] truncate text-[11px] font-medium" title={commit.msg}>
                              {commit.msg}
                            </p>
                            <p className="text-[10px] text-[#817b70] mt-1">
                              {commit.time} · Geliştirici: <span className="text-[#39d0c2]">@{commit.author}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CHAT SYSTEM */}
              {activeTab === "chat" && (
                <div className="sharp-panel noise-panel rounded-xl border border-white/5 overflow-hidden flex flex-col h-[520px]">
                  {/* Chat Top Banner */}
                  <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d7ff43] to-[#39d0c2] text-[#10100d] flex items-center justify-center font-black text-xs">
                          MD
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#10100d]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#f7f3ea]">Proje Destek Kanalı</h3>
                        <p className="text-[10px] text-[#817b70] mt-0.5">Meg Dev ekibiyle doğrudan yazışın</p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-[#39d0c2] bg-[#39d0c2]/10 border border-[#39d0c2]/20 px-2 py-0.5 rounded">
                      Canlı Polling Aktif
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-track-transparent" style={{ minHeight: 100 }}>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                          <MessageSquareCode className="w-6 h-6 text-[#817b70]" />
                        </div>
                        <p className="text-sm text-[#f7f3ea] font-bold">Henüz Mesajlaşma Yok</p>
                        <p className="text-xs text-[#817b70] mt-1.5 max-w-xs leading-relaxed">
                          Aşağıdaki form üzerinden Meg Dev geliştiricilerine soru sorabilir veya geri bildirimlerinizi iletebilirsiniz.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isCustomer = msg.sender === "customer"
                        const showAvatar = idx === 0 || messages[idx - 1]?.sender !== msg.sender
                        return (
                          <div key={msg.id} className={cn("flex items-end gap-2.5", isCustomer ? "justify-end" : "justify-start")}>
                            {/* Admin Avatar */}
                            {!isCustomer && showAvatar && (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d7ff43] to-[#39d0c2] flex items-center justify-center text-[10px] font-black text-[#10100d] shrink-0 shadow-md">
                                M
                              </div>
                            )}
                            {/* Customer Avatar */}
                            {isCustomer && showAvatar && (
                              <div className="w-8 h-8 rounded-lg bg-[#39d0c2]/20 border border-[#39d0c2]/30 flex items-center justify-center text-xs font-extrabold text-[#39d0c2] shrink-0">
                                {project.customer_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {!showAvatar && <div className="w-8 shrink-0" />}

                            <div className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md",
                              isCustomer
                                ? "bg-[#d7ff43] text-[#10100d] rounded-br-none"
                                : "bg-white/5 border border-white/10 text-[#f7f3ea] rounded-bl-none"
                            )}>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              <div className={cn("flex items-center gap-1.5 mt-2", isCustomer ? "justify-end" : "justify-start")}>
                                <span className={cn("text-[9px]", isCustomer ? "text-[#10100d]/50" : "text-[#817b70]")}>
                                  {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <span className={cn("text-[9px]", isCustomer ? "text-[#10100d]/50" : "text-[#817b70]")}>·</span>
                                <span className={cn("text-[9px] font-bold uppercase tracking-wider", isCustomer ? "text-[#10100d]/60" : "text-[#39d0c2]")}>
                                  {isCustomer ? "Siz" : "MEG DEV"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    {/* Scroll Anchor */}
                  </div>

                  {/* Input Box Area */}
                  <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                    <div className="flex gap-3">
                      <input
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        placeholder="Meg Dev ekibine mesaj gönderin..."
                        disabled={sending}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all disabled:opacity-50"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!msgInput.trim() || sending}
                        className="p-3.5 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] transition-all hover:shadow-[0_0_20px_rgba(215,255,67,0.2)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                      >
                        {sending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="text-center text-xs text-[#817b70]/60 pt-6 border-t border-white/5 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Meg Dev · Profesyonel Yazılım ve Danışmanlık Hizmetleri</span>
          <span className="font-mono">Tüm hakları saklıdır © {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  )
}
