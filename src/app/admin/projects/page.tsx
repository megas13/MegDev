"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  Plus,
  X,
  Send,
  Copy,
  Check,
  Phone,
  Mail,
  Calendar,
  User,
  ExternalLink,
  Search,
  Filter,
  Settings,
  Hammer,
  MessageCircle,
  Trash2,
  Save,
  AlertCircle,
  PlusCircle,
  CheckSquare,
  Link as LinkIcon,
  HeartPulse,
  Kanban as KanbanIcon,
  Info
} from "lucide-react"

const STATUS_FLOW = [
  { key: "beklemede", label: "Beklemede", icon: "○" },
  { key: "inceleniyor", label: "İnceleniyor", icon: "◎" },
  { key: "çalışılıyor", label: "Çalışılıyor", icon: "●" },
  { key: "tamamlandı", label: "Tamamlandı", icon: "✓" },
  { key: "iptal", label: "İptal", icon: "✕" },
]

const STATUS_COLORS: Record<string, string> = {
  beklemede: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  inceleniyor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  çalışılıyor: "text-[#39d0c2] border-[#39d0c2]/30 bg-[#39d0c2]/10",
  tamamlandı: "text-[#d7ff43] border-[#d7ff43]/30 bg-[#d7ff43]/10",
  iptal: "text-[#ff6b35] border-[#ff6b35]/30 bg-[#ff6b35]/10",
}

const STATUS_BORDER: Record<string, string> = {
  beklemede: "border-l-yellow-400",
  inceleniyor: "border-l-blue-400",
  çalışılıyor: "border-l-[#39d0c2]",
  tamamlandı: "border-l-[#d7ff43]",
  iptal: "border-l-[#ff6b35]",
}

interface Project {
  id: string
  title: string
  description?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  status: string
  token: string
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  sender: string
  message: string
  created_at: string
}

// Deserialization helper for description
const parseDescription = (desc: string) => {
  let summary = desc || ""
  let target_date = ""
  let health = "good"
  let preview_url = ""
  let tech_stack: string[] = []
  let roadmap: any[] = []
  let tasks: any[] = []

  try {
    if (desc && desc.trim().startsWith("{")) {
      const parsed = JSON.parse(desc)
      summary = parsed.summary || ""
      target_date = parsed.target_date || ""
      health = parsed.health || "good"
      preview_url = parsed.preview_url || ""
      tech_stack = parsed.tech_stack || []
      roadmap = parsed.roadmap || []
      tasks = parsed.tasks || []
    }
  } catch (e) {
    // Treat as plain text description
  }

  return { summary, target_date, health, preview_url, tech_stack, roadmap, tasks }
}

const serializeDescription = (
  summary: string,
  target_date: string,
  health: string,
  preview_url: string,
  tech_stack: string[],
  roadmap: any[],
  tasks: any[]
) => {
  return JSON.stringify({
    summary,
    target_date,
    health,
    preview_url,
    tech_stack,
    roadmap,
    tasks
  })
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [msgInput, setMsgInput] = useState("")
  const [newProjectForm, setNewProjectForm] = useState({
    title: "",
    description: "",
    customer_name: "",
    customer_email: "",
    customer_phone: ""
  })
  
  // Search & Filtering states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Selected Detail Sub-tabs
  const [detailTab, setDetailTab] = useState<"chat" | "edit" | "builder" | "delete">("chat")

  // Edit fields forms
  const [editForm, setEditForm] = useState({
    title: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    summary: ""
  })

  // Dashboard configuration builder form
  const [builderForm, setBuilderForm] = useState<{
    target_date: string
    health: string
    preview_url: string
    tech_stack_str: string
    roadmap: Array<{ name: string; progress: string; status: "done" | "active" | "pending" }>
    tasks: Array<{ title: string; category: string; status: "todo" | "doing" | "done"; assignee: string; priority: string }>
  }>({
    target_date: "",
    health: "good",
    preview_url: "",
    tech_stack_str: "",
    roadmap: [],
    tasks: []
  })

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const loadMessages = useCallback(async (id: string) => {
    const res = await fetch(`/api/projects/${id}/messages`)
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId)
      // Auto-poll messages for selected project
      const timer = setInterval(() => loadMessages(selectedId), 5000)
      return () => clearInterval(timer)
    }
  }, [selectedId, loadMessages])

  useEffect(() => {
    if (detailTab === "chat" && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, detailTab])

  const selected = projects.find((p) => p.id === selectedId)

  // Side-effect to populate edit and builder forms when project changes
  useEffect(() => {
    if (selected) {
      const parsed = parseDescription(selected.description || "")
      setEditForm({
        title: selected.title,
        customer_name: selected.customer_name,
        customer_email: selected.customer_email,
        customer_phone: selected.customer_phone || "",
        summary: parsed.summary
      })
      const defaultRoadmap = parsed.roadmap && parsed.roadmap.length > 0 ? parsed.roadmap : [
        { name: "Planlama & UI/UX Tasarım", progress: "100%", status: "done" },
        { name: "Veritabanı Mimari & Backend API", progress: "0%", status: "pending" },
        { name: "Frontend Geliştirme & Entegrasyonlar", progress: "0%", status: "pending" },
        { name: "Kapsamlı Test & Canlıya Alım", progress: "0%", status: "pending" }
      ]
      const defaultTasks = parsed.tasks && parsed.tasks.length > 0 ? parsed.tasks : [
        { title: "Veritabanı Şeması Tasarımı ve PostgreSQL Migration", category: "Backend", status: "todo", assignee: "Can Y.", priority: "Yüksek" },
        { title: "Kullanıcı Arayüzü UI/UX Figma Taslaklarının Kodlanması", category: "Tasarım", status: "todo", assignee: "Elif Ö.", priority: "Orta" }
      ]

      setBuilderForm({
        target_date: parsed.target_date || "",
        health: parsed.health || "good",
        preview_url: parsed.preview_url || "",
        tech_stack_str: parsed.tech_stack.join(", "),
        roadmap: defaultRoadmap,
        tasks: defaultTasks
      })
    }
  }, [selectedId, projects])

  const create = async () => {
    if (!newProjectForm.title || !newProjectForm.customer_name || !newProjectForm.customer_email) {
      alert("Lütfen başlık, müşteri adı ve e-posta alanlarını doldurun.")
      return
    }
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjectForm),
    })
    if (res.ok) {
      setShowForm(false)
      setNewProjectForm({ title: "", description: "", customer_name: "", customer_email: "", customer_phone: "" })
      load()
    } else {
      const err = await res.json()
      alert("Hata: " + (err.error || "Bilinmeyen hata"))
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  const sendMessage = async () => {
    if (!msgInput.trim() || !selectedId) return
    const res = await fetch(`/api/projects/${selectedId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msgInput }),
    })
    if (res.ok) {
      setMsgInput("")
      loadMessages(selectedId)
    }
  }

  const copyLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/track/${token}`)
      setCopiedId(token)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* fallback */
    }
  }

  // Update text metadata details API handler
  const handleSaveInfo = async () => {
    if (!selected) return
    const parsed = parseDescription(selected.description || "")
    const newDescription = serializeDescription(
      editForm.summary,
      builderForm.target_date,
      builderForm.health,
      builderForm.preview_url,
      parsed.tech_stack,
      parsed.roadmap,
      parsed.tasks
    )

    const res = await fetch(`/api/projects/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editForm.title,
        customer_name: editForm.customer_name,
        customer_email: editForm.customer_email,
        customer_phone: editForm.customer_phone,
        description: newDescription
      })
    })

    if (res.ok) {
      alert("Müşteri ve proje bilgileri güncellendi!")
      load()
    } else {
      alert("Ayarlar kaydedilemedi.")
    }
  }

  // Update dynamic tracking dashboard parameters JSON handler
  const handleSaveBuilder = async () => {
    if (!selected) return
    const tech_stack = builderForm.tech_stack_str
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "")

    const newDescription = serializeDescription(
      editForm.summary,
      builderForm.target_date,
      builderForm.health,
      builderForm.preview_url,
      tech_stack,
      builderForm.roadmap,
      builderForm.tasks
    )

    const res = await fetch(`/api/projects/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: newDescription
      })
    })

    if (res.ok) {
      alert("Müşteri takip paneli verileri başarıyla senkronize edildi!")
      load()
    } else {
      alert("Veriler senkronize edilemedi.")
    }
  }

  const handleDeleteProject = async () => {
    if (!selected) return
    if (!confirm(`"${selected.title}" projesini tamamen silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) return
    
    const res = await fetch(`/api/projects/${selected.id}`, {
      method: "DELETE"
    })
    
    if (res.ok) {
      setSelectedId(null)
      load()
    } else {
      alert("Silme işlemi sırasında bir hata oluştu.")
    }
  }

  // Roadmap editing array helpers
  const addMilestone = () => {
    setBuilderForm((prev) => ({
      ...prev,
      roadmap: [...prev.roadmap, { name: "Yeni Aşama", progress: "0%", status: "pending" }]
    }))
  }

  const removeMilestone = (idx: number) => {
    setBuilderForm((prev) => ({
      ...prev,
      roadmap: prev.roadmap.filter((_, i) => i !== idx)
    }))
  }

  const updateMilestone = (idx: number, fields: Partial<(typeof builderForm.roadmap)[0]>) => {
    setBuilderForm((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((item, i) => (i === idx ? { ...item, ...fields } : item))
    }))
  }

  // Sprint task list helpers
  const addTask = () => {
    setBuilderForm((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { title: "Yeni Görev Tanımı", category: "Geliştirme", status: "todo", assignee: "Can Y.", priority: "Orta" }]
    }))
  }

  const removeTask = (idx: number) => {
    setBuilderForm((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== idx)
    }))
  }

  const updateTask = (idx: number, fields: Partial<(typeof builderForm.tasks)[0]>) => {
    setBuilderForm((prev) => ({
      ...prev,
      tasks: prev.tasks.map((item, i) => (i === idx ? { ...item, ...fields } : item))
    }))
  }

  // Client-side filtering logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusIndex = selected ? STATUS_FLOW.findIndex((s) => s.key === selected.status) : -1

  return (
    <div className="space-y-6">
      {/* Upper header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f7f3ea] tracking-tight">Projeler</h1>
          <p className="text-sm text-[#817b70] mt-1">Sistemde kayıtlı toplam {projects.length} proje bulunuyor</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] px-5 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Yeni Proje Oluştur</span>
        </button>
      </div>

      {/* Modal Dialog for New Project */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-[#181713] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
              <h2 className="text-lg font-bold text-[#f7f3ea]">Yeni Proje Başlat</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-[#b8afa1]" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#817b70] uppercase block mb-1.5">Proje Başlığı *</label>
                <input
                  placeholder="e.g. Meg-SaaS E-Ticaret Arayüzü"
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#817b70] uppercase block mb-1.5">Genel Açıklama</label>
                <textarea
                  placeholder="Proje hedefleri ve genel kapsam..."
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#817b70] uppercase block mb-1.5">Müşteri Ad Soyad *</label>
                  <input
                    placeholder="e.g. Ahmet Yılmaz"
                    value={newProjectForm.customer_name}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, customer_name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#817b70] uppercase block mb-1.5">Müşteri E-posta *</label>
                  <input
                    placeholder="e.g. ahmet@mail.com"
                    type="email"
                    value={newProjectForm.customer_email}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, customer_email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#817b70] uppercase block mb-1.5">Müşteri Telefon</label>
                <input
                  placeholder="e.g. +90 555 123 45 67"
                  value={newProjectForm.customer_phone}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, customer_phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={create}
                  className="w-full rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] font-bold py-3.5 transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.3)] active:scale-[0.98]"
                >
                  Projeyi Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main split work space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Filter and project lists */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sharp-panel noise-panel p-4 rounded-xl border border-white/10 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#817b70]" />
              <input
                type="text"
                placeholder="Proje veya müşteri ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/5 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all"
              />
            </div>

            {/* Status Select dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#817b70] shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#181713] border border-white/5 rounded-lg px-2 py-1.5 text-xs text-[#b8afa1] focus:outline-none focus:border-[#d7ff43]"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="beklemede">Beklemede</option>
                <option value="inceleniyor">İnceleniyor</option>
                <option value="çalışılıyor">Çalışılıyor</option>
                <option value="tamamlandı">Tamamlandı</option>
                <option value="iptal">İptal</option>
              </select>
            </div>
          </div>

          {/* Listing Projects */}
          <div className="space-y-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin h-6 w-6 border-2 border-[#d7ff43] border-t-transparent rounded-full" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <p className="text-xs text-[#817b70]">Kriterlere uygun proje bulunamadı</p>
              </div>
            ) : (
              filteredProjects.map((proj) => {
                const isSelected = selectedId === proj.id
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedId(proj.id)
                      setDetailTab("chat")
                    }}
                    className={cn(
                      "w-full text-left bg-white/[0.02] border rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-white/[0.05] border-l-4 border-y-transparent border-r-transparent",
                      isSelected
                        ? "bg-white/[0.05] border-l-[#d7ff43] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                        : STATUS_BORDER[proj.status] + " border-white/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-xs font-bold text-[#f7f3ea] truncate">{proj.title}</p>
                      <span
                        className={cn(
                          "text-[9px] uppercase font-bold px-2 py-0.5 rounded border shrink-0",
                          STATUS_COLORS[proj.status]
                        )}
                      >
                        {STATUS_FLOW.find((s) => s.key === proj.status)?.label || proj.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#817b70] mt-2">
                      <span className="truncate flex items-center gap-1">
                        <User className="w-3 h-3 text-[#39d0c2]" /> {proj.customer_name}
                      </span>
                      <span className="shrink-0 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(proj.created_at).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Work area settings */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="sharp-panel noise-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col min-h-[580px]">
              {/* Selected header banner */}
              <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#39d0c2] bg-[#39d0c2]/10 border border-[#39d0c2]/20 px-2.5 py-0.5 rounded">
                      Seçili Proje
                    </span>
                    <h2 className="text-xl font-bold text-[#f7f3ea] tracking-tight mt-2.5">{selected.title}</h2>
                    <p className="text-xs text-[#817b70] mt-1">Müşteri: {selected.customer_name}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      onClick={() => copyLink(selected.token)}
                      className="flex items-center gap-1.5 text-xs text-[#39d0c2] hover:bg-[#39d0c2]/20 transition-all bg-[#39d0c2]/10 border border-[#39d0c2]/30 px-3 py-1.5 rounded-lg"
                    >
                      {copiedId === selected.token ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Takip Linki</span>
                    </button>
                    <a
                      href={`/track/${selected.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#d7ff43] hover:bg-[#d7ff43]/20 transition-all bg-[#d7ff43]/10 border border-[#d7ff43]/30 px-3 py-1.5 rounded-lg font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Portalı Aç</span>
                    </a>
                  </div>
                </div>

                {/* Status Timeline Transition buttons */}
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {STATUS_FLOW.map((s, i) => {
                    const isCurrent = selected.status === s.key
                    const isPast = statusIndex >= i && selected.status !== "iptal"
                    const isRejected = selected.status === "iptal"
                    return (
                      <button
                        key={s.key}
                        onClick={() => updateStatus(selected.id, s.key)}
                        disabled={s.key === "iptal" && isCurrent}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
                          isCurrent
                            ? STATUS_COLORS[s.key] + " ring-1 ring-white/10 scale-102 font-black"
                            : isPast && !isRejected
                            ? "text-[#817b70]/40 border border-transparent cursor-not-allowed"
                            : "text-[#817b70] hover:text-[#f7f3ea] hover:bg-white/5 border border-white/5"
                        )}
                      >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sub-tabs buttons */}
              <div className="flex border-b border-white/10 px-4 bg-white/[0.01]">
                {[
                  { id: "chat", label: "İletişim & Chat", icon: MessageCircle },
                  { id: "edit", label: "Bilgileri Düzenle", icon: Settings },
                  { id: "builder", label: "Takip Paneli Oluşturucu", icon: Hammer },
                  { id: "delete", label: "Sil", icon: Trash2, danger: true },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = detailTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all relative select-none",
                        isActive
                          ? tab.danger
                            ? "text-red-400 border-b-2 border-red-500 bg-red-500/5"
                            : "text-[#d7ff43] border-b-2 border-[#d7ff43] bg-white/[0.02]"
                          : "text-[#817b70] hover:text-[#f7f3ea]"
                      )}
                    >
                      <Icon className={cn("w-3.5 h-3.5", isActive && !tab.danger && "text-[#d7ff43]", tab.danger && isActive && "text-red-400")} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Panel Details Screens */}
              <div className="flex-1 p-6 flex flex-col">
                {/* SUB TAB 1: CHAT SCREEN */}
                {detailTab === "chat" && (
                  <div className="flex flex-col flex-1 h-[420px]">
                    {/* Customer detail ribbon */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#817b70] mb-4 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#39d0c2]" /> {selected.customer_name}</span>
                      <a href={`mailto:${selected.customer_email}`} className="flex items-center gap-1 text-[#39d0c2] hover:underline"><Mail className="w-3.5 h-3.5" /> {selected.customer_email}</a>
                      {selected.customer_phone && (
                        <a href={`tel:${selected.customer_phone}`} className="flex items-center gap-1 hover:text-[#f7f3ea]"><Phone className="w-3.5 h-3.5" /> {selected.customer_phone}</a>
                      )}
                    </div>

                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-track-transparent" style={{ minHeight: 200 }}>
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <MessageCircle className="w-8 h-8 text-[#817b70] mb-3 opacity-55" />
                          <p className="text-xs text-[#817b70]">Henüz karşılıklı mesajlaşma bulunmuyor</p>
                        </div>
                      ) : (
                        messages.map((msg, idx) => {
                          const isAdmin = msg.sender === "admin"
                          const showAvatar = idx === 0 || messages[idx - 1]?.sender !== msg.sender
                          return (
                            <div key={msg.id} className={cn("flex items-end gap-2", isAdmin ? "justify-end" : "justify-start")}>
                              {/* Client initials */}
                              {!isAdmin && showAvatar && (
                                <div className="w-7 h-7 rounded-lg bg-[#39d0c2]/20 border border-[#39d0c2]/30 flex items-center justify-center text-[10px] font-bold text-[#39d0c2] shrink-0">
                                  {selected.customer_name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {/* Admin initials */}
                              {isAdmin && showAvatar && (
                                <div className="w-7 h-7 rounded-lg bg-[#d7ff43]/20 border border-[#d7ff43]/30 flex items-center justify-center text-[10px] font-bold text-[#d7ff43] shrink-0">
                                  M
                                </div>
                              )}
                              {!showAvatar && <div className="w-7 shrink-0" />}

                              <div className={cn(
                                "max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm",
                                isAdmin
                                  ? "bg-[#d7ff43] text-[#10100d] rounded-br-none"
                                  : "bg-white/5 border border-white/10 text-[#f7f3ea] rounded-bl-none"
                              )}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                <p className={cn("text-[9px] mt-1.5 font-mono text-right", isAdmin ? "text-[#10100d]/50" : "text-[#817b70]")}>
                                  {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      )}
                      {/* Scroll Anchor */}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                      <input
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        placeholder="Müşteriye doğrudan mesaj gönderin..."
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!msgInput.trim()}
                        className="p-3 rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] transition-all hover:shadow-[0_0_20px_rgba(215,255,67,0.2)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB TAB 2: EDIT PROFILE SCREEN */}
                {detailTab === "edit" && (
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#d7ff43] bg-[#d7ff43]/5 border border-[#d7ff43]/10 p-3 rounded-lg mb-2">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Bu form projenin genel bilgilerini ve müşteri kartını günceller.</span>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Proje Başlığı</label>
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43] transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Müşteri İsmi</label>
                          <input
                            value={editForm.customer_name}
                            onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43] transition-all"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Müşteri E-posta</label>
                          <input
                            value={editForm.customer_email}
                            onChange={(e) => setEditForm({ ...editForm, customer_email: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43] transition-all"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Müşteri Telefon</label>
                          <input
                            value={editForm.customer_phone}
                            onChange={(e) => setEditForm({ ...editForm, customer_phone: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Proje Açıklaması / Kapsamı</label>
                        <textarea
                          value={editForm.summary}
                          onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                          rows={6}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43] transition-all resize-none"
                        />
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-end">
                        <button
                          onClick={handleSaveInfo}
                          className="flex items-center gap-1.5 bg-[#d7ff43] text-[#10100d] px-5 py-2.5 rounded-lg text-xs font-bold hover:shadow-[0_0_15px_rgba(215,255,67,0.2)] transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Bilgileri Güncelle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 3: CONFIG BUILDER SCREEN */}
                {detailTab === "builder" && (
                  <div className="space-y-6 flex-1 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                    <div className="flex items-center gap-2 text-xs text-[#39d0c2] bg-[#39d0c2]/5 border border-[#39d0c2]/10 p-3 rounded-lg">
                      <Settings className="w-4 h-4 shrink-0" />
                      <span>Burada tanımladığınız roadmap ve sprint görevleri `/track` portalındaki müşteri dashboardunda görsel olarak sunulur.</span>
                    </div>

                    {/* Basic Meta Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Hedef Teslim Tarihi</label>
                        <input
                          type="date"
                          value={builderForm.target_date}
                          onChange={(e) => setBuilderForm({ ...builderForm, target_date: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Proje Sağlık Durumu</label>
                        <select
                          value={builderForm.health}
                          onChange={(e) => setBuilderForm({ ...builderForm, health: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43]"
                        >
                          <option value="excellent">Harika (Excellent)</option>
                          <option value="good">İyi (Good)</option>
                          <option value="at_risk">Risk Altında (At Risk)</option>
                          <option value="delayed">Gecikme (Delayed)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Önizleme Sunucu Adresi</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={builderForm.preview_url}
                          onChange={(e) => setBuilderForm({ ...builderForm, preview_url: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43]"
                        />
                      </div>
                    </div>

                    {/* Tech Badges input */}
                    <div>
                      <label className="text-[10px] font-bold text-[#817b70] uppercase block mb-1">Kullanılan Teknolojiler (Virgülle Ayırın)</label>
                      <input
                        placeholder="React, Next.js, Postgres, Node, GraphQL"
                        value={builderForm.tech_stack_str}
                        onChange={(e) => setBuilderForm({ ...builderForm, tech_stack_str: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43]"
                      />
                    </div>

                    {/* ROADMAP TIMELINE BUILDER */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#f7f3ea] uppercase tracking-wider flex items-center gap-1.5">
                          <HeartPulse className="w-3.5 h-3.5 text-[#d7ff43]" />
                          Yol Haritası Aşamaları
                        </h4>
                        <button
                          onClick={addMilestone}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#d7ff43] hover:underline"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Ekle
                        </button>
                      </div>

                      <div className="space-y-2">
                        {builderForm.roadmap.map((step, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-white/5 p-3 rounded-lg items-center">
                            <input
                              value={step.name}
                              placeholder="Aşama Adı (e.g. Kapsam Analizi)"
                              onChange={(e) => updateMilestone(idx, { name: e.target.value })}
                              className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43] w-full"
                            />
                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between">
                              <select
                                value={step.progress}
                                onChange={(e) => updateMilestone(idx, { progress: e.target.value })}
                                className="bg-[#181713] border border-white/10 rounded px-1.5 py-1 text-xs text-[#b8afa1] focus:outline-none focus:border-[#d7ff43]"
                              >
                                {["0%", "10%", "25%", "50%", "75%", "90%", "100%"].map((pct) => (
                                  <option key={pct} value={pct}>{pct}</option>
                                ))}
                              </select>
                              <select
                                value={step.status}
                                onChange={(e) => updateMilestone(idx, { status: e.target.value as any })}
                                className="bg-[#181713] border border-white/10 rounded px-1.5 py-1 text-xs text-[#b8afa1] focus:outline-none focus:border-[#d7ff43]"
                              >
                                <option value="pending">Beklemede (Pending)</option>
                                <option value="active">Çalışılıyor (Active)</option>
                                <option value="done">Tamamlandı (Done)</option>
                              </select>
                              <button
                                onClick={() => removeMilestone(idx)}
                                className="p-1.5 text-[#ff6b35] hover:bg-[#ff6b35]/10 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {builderForm.roadmap.length === 0 && (
                          <p className="text-[10px] text-[#817b70] text-center py-3">Yol haritası eklenmemiş. Otomatik mock değerler atanacaktır.</p>
                        )}
                      </div>
                    </div>

                    {/* SPRINT TASKS KANBAN BUILDER */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#f7f3ea] uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-[#39d0c2]" />
                          Sprint Görev Panosu
                        </h4>
                        <button
                          onClick={addTask}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#39d0c2] hover:underline"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Ekle
                        </button>
                      </div>

                      <div className="space-y-3">
                        {builderForm.tasks.map((task, idx) => (
                          <div key={idx} className="bg-white/5 p-3.5 rounded-lg border border-white/5 space-y-2.5">
                            <div className="flex gap-2">
                              <input
                                value={task.title}
                                placeholder="Görev Tanımı"
                                onChange={(e) => updateTask(idx, { title: e.target.value })}
                                className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#f7f3ea] focus:outline-none focus:border-[#d7ff43]"
                              />
                              <button
                                onClick={() => removeTask(idx)}
                                className="p-1.5 text-[#ff6b35] hover:bg-[#ff6b35]/10 rounded self-center"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div>
                                <label className="text-[8px] font-bold text-[#817b70] uppercase block mb-0.5">Kategori</label>
                                <input
                                  value={task.category}
                                  placeholder="e.g. Frontend"
                                  onChange={(e) => updateTask(idx, { category: e.target.value })}
                                  className="w-full rounded border border-white/10 bg-[#181713] px-2 py-0.5 text-xs text-[#f7f3ea]"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-bold text-[#817b70] uppercase block mb-0.5">Atanan</label>
                                <input
                                  value={task.assignee}
                                  placeholder="e.g. Can Y."
                                  onChange={(e) => updateTask(idx, { assignee: e.target.value })}
                                  className="w-full rounded border border-white/10 bg-[#181713] px-2 py-0.5 text-xs text-[#f7f3ea]"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-bold text-[#817b70] uppercase block mb-0.5">Öncelik</label>
                                <select
                                  value={task.priority}
                                  onChange={(e) => updateTask(idx, { priority: e.target.value })}
                                  className="w-full rounded border border-white/10 bg-[#181713] px-2 py-0.5 text-xs text-[#b8afa1] focus:outline-none focus:border-[#d7ff43]"
                                >
                                  <option value="Düşük">Düşük</option>
                                  <option value="Orta">Orta</option>
                                  <option value="Yüksek">Yüksek</option>
                                  <option value="Kritik">Kritik</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[8px] font-bold text-[#817b70] uppercase block mb-0.5">Durum</label>
                                <select
                                  value={task.status}
                                  onChange={(e) => updateTask(idx, { status: e.target.value as any })}
                                  className="w-full rounded border border-white/10 bg-[#181713] px-2 py-0.5 text-xs text-[#b8afa1] focus:outline-none focus:border-[#d7ff43]"
                                >
                                  <option value="todo">Yapılacak (Todo)</option>
                                  <option value="doing">Yapılıyor (Doing)</option>
                                  <option value="done">Tamamlandı (Done)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                        {builderForm.tasks.length === 0 && (
                          <p className="text-[10px] text-[#817b70] text-center py-3">Sprint görevi tanımlanmamış. Otomatik mock değerler atanacaktır.</p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Save Action */}
                    <div className="pt-4 border-t border-white/5 flex justify-end">
                      <button
                        onClick={handleSaveBuilder}
                        className="flex items-center gap-1.5 bg-[#39d0c2] text-[#10100d] px-5 py-2.5 rounded-lg text-xs font-bold hover:shadow-[0_0_15px_rgba(57,208,194,0.2)] transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Senkronize Et ve Kaydet</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB TAB 4: DELETE PROJECT SCREEN */}
                {detailTab === "delete" && (
                  <div className="space-y-4 flex-1">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex gap-3 text-xs leading-relaxed text-red-200">
                      <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                      <div>
                        <span className="font-bold text-[#f7f3ea] block mb-1">PROJEYİ TAMAMEN SİLME İŞLEMİ</span>
                        Bu işlem bu projeyi veritabanından, müşteri portalını ve projeye dair tüm mesaj geçmişini geri döndürülemeyecek şekilde silecektir. 
                        Müşteri bu adımdan sonra artık portal sayfasına erişemeyecektir.
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-center">
                      <button
                        onClick={handleDeleteProject}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-[#f7f3ea] px-6 py-3.5 rounded-xl text-xs font-bold shadow-[0_4px_20px_rgba(220,38,38,0.15)] transition-all active:scale-[0.98]"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        <span>Projeyi Kalıcı Olarak Yok Et</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="sharp-panel noise-panel rounded-2xl border border-white/10 h-full min-h-[580px] flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <KanbanIcon className="w-6 h-6 text-[#817b70]" />
              </div>
              <h3 className="text-sm font-bold text-[#f7f3ea]">Proje Seçilmedi</h3>
              <p className="text-xs text-[#817b70] mt-1.5 max-w-xs leading-relaxed">
                Proje detaylarını incelemek, müşteri portalı ayarlarını yapılandırmak veya mesaj göndermek için sol taraftaki listeden bir proje seçin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
