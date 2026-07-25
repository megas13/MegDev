"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ImageIcon,
  Star,
  ExternalLink,
  Tag,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Image from "next/image"

interface Portfolio {
  id: string
  title: string
  slug: string
  description: string
  category: string
  technologies: string[]
  project_url: string
  image_url: string
  featured: boolean
  created_at: string
}

type FormState = {
  title: string
  slug: string
  description: string
  image_url: string
  category: string
  technologies: string
  project_url: string
  featured: boolean
}

const INITIAL_FORM: FormState = {
  title: "",
  slug: "",
  description: "",
  image_url: "",
  category: "",
  technologies: "",
  project_url: "",
  featured: false,
}

const CATEGORIES = ["Web", "Mobil", "E-Ticaret", "SaaS", "API", "Tasarım", "Diğer"]

// ─── Drag & Drop Image Uploader ──────────────────────────────────────────────
function ImageDropZone({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setError(null)
      setSuccess(false)
      setUploading(true)
      try {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Yükleme başarısız")
        onChange(data.url)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Yükleme başarısız")
      } finally {
        setUploading(false)
      }
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) upload(file)
    },
    [upload]
  )

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) upload(file)
    },
    [upload]
  )

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-[#817b70] uppercase tracking-wider">
        Proje Görseli
      </label>

      {/* Preview or Drop Zone */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
          <div className="relative w-full h-52">
            <Image
              src={value}
              alt="Proje görseli"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-xl hover:bg-white/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all"
            >
              <X className="w-4 h-4" />
              Kaldır
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 py-10",
            isDragging
              ? "border-[#d7ff43] bg-[#d7ff43]/5 scale-[1.01]"
              : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
          )}
        >
          {uploading ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#d7ff43]/10 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#d7ff43] animate-spin" />
              </div>
              <p className="text-sm text-[#b8afa1]">Yükleniyor...</p>
            </>
          ) : (
            <>
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                  isDragging ? "bg-[#d7ff43]/20" : "bg-white/5"
                )}
              >
                <ImageIcon
                  className={cn(
                    "w-7 h-7 transition-all",
                    isDragging ? "text-[#d7ff43]" : "text-[#817b70]"
                  )}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#f7f3ea]">
                  {isDragging ? "Bırak!" : "Görsel sürükle ya da tıkla"}
                </p>
                <p className="text-xs text-[#817b70] mt-1">
                  PNG, JPG, WEBP — max 10MB
                </p>
              </div>
            </>
          )}

          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-[#d7ff43]/5 border-2 border-[#d7ff43] pointer-events-none" />
          )}
        </div>
      )}

      {/* URL fallback */}
      <input
        type="url"
        placeholder="ya da görsel URL yapıştır…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f7f3ea] placeholder:text-[#4a4540] focus:outline-none focus:border-[#d7ff43]/50 transition-all"
      />

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Status messages */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Görsel başarıyla yüklendi!
        </div>
      )}
    </div>
  )
}

// ─── Field Component ─────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[#817b70] uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f7f3ea] placeholder:text-[#4a4540] focus:outline-none focus:border-[#d7ff43]/60 focus:bg-white/[0.07] transition-all"

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPortfolio() {
  const [items, setItems] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Portfolio | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch("/api/portfolio")
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: f.slug === autoSlug(f.title) || f.slug === "" ? autoSlug(title) : f.slug,
    }))
  }

  const openNew = () => {
    setEditing(null)
    setForm(INITIAL_FORM)
    setShowForm(true)
  }

  const openEdit = (item: Portfolio) => {
    setEditing(item)
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      image_url: item.image_url || "",
      category: item.category || "",
      technologies: (item.technologies || []).join(", "),
      project_url: item.project_url || "",
      featured: item.featured,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const save = async () => {
    if (!form.title || !form.description) return
    setSaving(true)
    const body = {
      ...form,
      technologies: form.technologies
        ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    }
    const url = editing ? `/api/portfolio/${editing.id}` : "/api/portfolio"
    const method = editing ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      closeForm()
      load()
    }
  }

  const remove = async (id: string) => {
    setDeleteId(id)
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
    setDeleteId(null)
    load()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#f7f3ea]">Portföy</h1>
          <p className="text-sm text-[#817b70] mt-0.5">
            {items.length} proje
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.25)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Yeni Proje
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={closeForm}
        >
          <div
            className="bg-[#141310] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)] scrollbar-thin scrollbar-thumb-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-7 py-5 border-b border-white/8 bg-[#141310]/95 backdrop-blur-sm rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d7ff43]/20 to-[#39d0c2]/20 flex items-center justify-center border border-white/10">
                  <Layers className="w-4 h-4 text-[#d7ff43]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#f7f3ea]">
                    {editing ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
                  </h2>
                  <p className="text-xs text-[#817b70]">
                    {editing ? `#${editing.id.slice(0, 8)}` : "Portföyüne yeni bir proje ekle"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeForm}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-[#817b70]" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-7 space-y-6">
              {/* Image Upload */}
              <ImageDropZone
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              />

              <div className="h-px bg-white/8" />

              {/* Title & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Proje Adı *">
                  <input
                    placeholder="Örn: E-ticaret Platformu"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Slug">
                  <input
                    placeholder="e-ticaret-platformu"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Description */}
              <Field label="Açıklama *">
                <textarea
                  placeholder="Proje hakkında detaylı açıklama yazın…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className={cn(inputCls, "resize-none")}
                />
              </Field>

              {/* Category */}
              <Field label="Kategori">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, category: f.category === cat ? "" : cat }))
                      }
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                        form.category === cat
                          ? "bg-[#d7ff43]/10 border-[#d7ff43]/40 text-[#d7ff43]"
                          : "bg-white/5 border-white/10 text-[#817b70] hover:border-white/25 hover:text-[#f7f3ea]"
                      )}
                    >
                      <Tag className="w-3 h-3" />
                      {cat}
                    </button>
                  ))}
                </div>
                {/* Custom category */}
                <input
                  placeholder="ya da özel kategori yaz…"
                  value={CATEGORIES.includes(form.category) ? "" : form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={cn(inputCls, "mt-2")}
                />
              </Field>

              {/* Technologies */}
              <Field label="Teknolojiler">
                <input
                  placeholder="React, Node.js, PostgreSQL (virgülle ayır)"
                  value={form.technologies}
                  onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
                  className={inputCls}
                />
                {form.technologies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.technologies
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#39d0c2]/10 border border-[#39d0c2]/25 text-[#39d0c2] text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                )}
              </Field>

              {/* Project URL */}
              <Field label="Proje URL'si">
                <div className="relative">
                  <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4540]" />
                  <input
                    type="url"
                    placeholder="https://proje.com"
                    value={form.project_url}
                    onChange={(e) => setForm((f) => ({ ...f, project_url: e.target.value }))}
                    className={cn(inputCls, "pl-10")}
                  />
                </div>
              </Field>

              {/* Featured Toggle */}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all",
                  form.featured
                    ? "bg-[#d7ff43]/8 border-[#d7ff43]/30"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <Star
                    className={cn(
                      "w-4 h-4 transition-all",
                      form.featured ? "text-[#d7ff43] fill-[#d7ff43]" : "text-[#817b70]"
                    )}
                  />
                  <div className="text-left">
                    <p className={cn("text-sm font-semibold", form.featured ? "text-[#d7ff43]" : "text-[#f7f3ea]")}>
                      Öne Çıkan Proje
                    </p>
                    <p className="text-xs text-[#817b70]">Ana sayfada göster</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-11 h-6 rounded-full relative transition-all duration-300",
                    form.featured ? "bg-[#d7ff43]" : "bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full transition-all duration-300",
                      form.featured ? "left-6 bg-[#10100d]" : "left-1 bg-white/50"
                    )}
                  />
                </div>
              </button>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeForm}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 text-[#b8afa1] text-sm font-semibold py-3.5 hover:bg-white/8 hover:border-white/20 transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={save}
                  disabled={saving || !form.title || !form.description}
                  className="flex-[2] rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] font-bold py-3.5 text-sm transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Kaydediliyor…
                    </>
                  ) : (
                    editing ? "Güncelle" : "Projeyi Ekle"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 border-[#d7ff43] text-[#d7ff43] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div
          onClick={openNew}
          className="cursor-pointer text-center py-24 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03] transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-white/8 flex items-center justify-center mx-auto mb-4 transition-all">
            <Layers className="w-8 h-8 text-[#817b70]" />
          </div>
          <p className="text-[#b8afa1] font-medium">Henüz proje yok</p>
          <p className="text-sm text-[#817b70] mt-1">
            Tıkla veya + Yeni Proje butonuna bas
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              {/* Image */}
              <div className="relative w-full h-44 bg-white/[0.03] overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-[#3a3730]" />
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    disabled={deleteId === item.id}
                    className="flex items-center gap-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {deleteId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Sil
                  </button>
                </div>
                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#d7ff43]/90 text-[#10100d] text-[10px] font-black px-2 py-0.5 rounded-lg">
                    <Star className="w-2.5 h-2.5 fill-[#10100d]" />
                    ÖNE ÇIKAN
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-bold text-[#f7f3ea] leading-tight line-clamp-1">
                    {item.title}
                  </p>
                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1 rounded-lg text-[#817b70] hover:text-[#39d0c2] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-[#817b70] line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#39d0c2]/10 text-[#39d0c2] border border-[#39d0c2]/20">
                      {item.category}
                    </span>
                  )}
                  <span className="text-[10px] text-[#4a4540] ml-auto">
                    {new Date(item.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                {item.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {item.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[#817b70]"
                      >
                        {tech}
                      </span>
                    ))}
                    {item.technologies.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[#4a4540]">
                        +{item.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
