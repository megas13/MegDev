"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, X } from "lucide-react"

interface Portfolio {
  id: string; title: string; slug: string; description: string; category: string; technologies: string[]; project_url: string; featured: boolean; created_at: string
}

export default function AdminPortfolio() {
  const [items, setItems] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Portfolio | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", slug: "", description: "", image_url: "", category: "", technologies: "", project_url: "", featured: false })

  const load = async () => {
    const res = await fetch("/api/portfolio")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    const body = { ...form, technologies: form.technologies ? form.technologies.split(",").map((t) => t.trim()) : [] }
    const url = editing ? `/api/portfolio/${editing.id}` : "/api/portfolio"
    const method = editing ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ title: "", slug: "", description: "", image_url: "", category: "", technologies: "", project_url: "", featured: false }); load() }
  }

  const remove = async (id: string) => {
    if (!confirm("Emin misin?")) return
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
    load()
  }

  const edit = (item: Portfolio) => {
    setEditing(item)
    setForm({ title: item.title, slug: item.slug, description: item.description, image_url: "", category: item.category || "", technologies: (item.technologies || []).join(", "), project_url: item.project_url || "", featured: item.featured })
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-[#f7f3ea]">Portföy</h1>
        <button onClick={() => { setEditing(null); setForm({ title: "", slug: "", description: "", image_url: "", category: "", technologies: "", project_url: "", featured: false }); setShowForm(true) }} className="flex items-center gap-2 bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)]">
          <Plus className="w-4 h-4" />Yeni Proje
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-[#181713] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#f7f3ea]">{editing ? "Düzenle" : "Yeni Proje"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-[#b8afa1]" /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="Proje Adı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all resize-none" />
              <input placeholder="Kategori (ör: Web, Mobil)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <input placeholder="Teknolojiler (virgülle ayır: React, Node.js)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <input placeholder="Görsel URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <input placeholder="Proje URL" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <label className="flex items-center gap-3 text-sm text-[#b8afa1] cursor-pointer group">
                <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all", form.featured ? "bg-[#d7ff43] border-[#d7ff43]" : "border-white/20 group-hover:border-white/40")}>
                  {form.featured && <svg className="w-3 h-3 text-[#10100d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="hidden" />
                Öne çıkan
              </label>
              <button onClick={save} className="w-full rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] font-bold py-3.5 transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)]">{editing ? "Güncelle" : "Oluştur"}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#d7ff43] border-t-transparent rounded-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <p className="text-[#817b70]">Henüz proje yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 transition-all hover:bg-white/[0.05] hover:border-white/20 group">
              <div>
                <p className="text-sm font-semibold text-[#f7f3ea]">{item.title}</p>
                <p className="text-xs text-[#817b70] mt-0.5">{item.category && `${item.category} · `}{new Date(item.created_at).toLocaleDateString("tr-TR")}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.featured && <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-[#d7ff43]/10 text-[#d7ff43]">Öne Çıkan</span>}
                <button onClick={() => edit(item)} className="p-2 rounded-lg text-[#817b70] hover:text-[#39d0c2] hover:bg-white/5 transition-all"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-[#817b70] hover:text-[#ff6b35] hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
