"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Pencil, Trash2, X } from "lucide-react"

interface Blog {
  id: string; title: string; slug: string; excerpt: string; published: boolean; created_at: string
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", image_url: "", published: true })

  const load = async () => {
    const res = await fetch("/api/blog")
    const data = await res.json()
    setBlogs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    const url = editing ? `/api/blog/${editing.id}` : "/api/blog"
    const method = editing ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", published: true }); load() }
  }

  const remove = async (id: string) => {
    if (!confirm("Emin misin?")) return
    await fetch(`/api/blog/${id}`, { method: "DELETE" })
    load()
  }

  const edit = (blog: Blog) => {
    setEditing(blog)
    setForm({ title: blog.title, slug: blog.slug, excerpt: blog.excerpt || "", content: "", image_url: "", published: blog.published })
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-[#f7f3ea]">Bloglar</h1>
        <button onClick={() => { setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", published: true }); setShowForm(true) }} className="flex items-center gap-2 bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)]">
          <Plus className="w-4 h-4" />Yeni Blog
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-[#181713] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#f7f3ea]">{editing ? "Düzenle" : "Yeni Blog"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-[#b8afa1]" /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <input placeholder="Slug (boş bırakılırsa otomatik)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <input placeholder="Kısa açıklama" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <textarea placeholder="İçerik (HTML)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all resize-none" />
              <input placeholder="Görsel URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
              <label className="flex items-center gap-3 text-sm text-[#b8afa1] cursor-pointer group">
                <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all", form.published ? "bg-[#d7ff43] border-[#d7ff43]" : "border-white/20 group-hover:border-white/40")}>
                  {form.published && <svg className="w-3 h-3 text-[#10100d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="hidden" />
                Yayında
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
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <p className="text-[#817b70]">Henüz blog yazısı yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 transition-all hover:bg-white/[0.05] hover:border-white/20 group">
              <div>
                <p className="text-sm font-semibold text-[#f7f3ea]">{blog.title}</p>
                <p className="text-xs text-[#817b70] mt-0.5">{new Date(blog.created_at).toLocaleDateString("tr-TR")} {blog.slug && `/ ${blog.slug}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg", blog.published ? "bg-[#d7ff43]/10 text-[#d7ff43]" : "bg-[#ff6b35]/10 text-[#ff6b35]")}>{blog.published ? "Yayında" : "Taslak"}</span>
                <button onClick={() => edit(blog)} className="p-2 rounded-lg text-[#817b70] hover:text-[#39d0c2] hover:bg-white/5 transition-all"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(blog.id)} className="p-2 rounded-lg text-[#817b70] hover:text-[#ff6b35] hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
