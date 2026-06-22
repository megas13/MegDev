"use client"

import { useEffect, useState } from "react"
import { Trash2, Mail, Phone, ExternalLink, ArrowRight, Copy, Check, X } from "lucide-react"

interface Message {
  id: string; name: string; email: string; phone: string; subject: string; message: string; read: boolean; created_at: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  const load = async () => {
    const res = await fetch("/api/messages")
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "PATCH" })
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  const remove = async (id: string) => {
    if (!confirm("Emin misin?")) return
    await fetch(`/api/messages/${id}`, { method: "DELETE" })
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const [convertForm, setConvertForm] = useState(false)
  const [convertData, setConvertData] = useState({ title: "", description: "" })
  const [convertedToken, setConvertedToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const openMessage = (msg: Message) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  const convertToProject = async () => {
    if (!selected) return
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: convertData.title || selected.subject,
        description: convertData.description,
        customer_name: selected.name,
        customer_email: selected.email,
        customer_phone: selected.phone,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setConvertedToken(data.token)
    }
  }

  const copyLink = () => {
    if (!convertedToken) return
    navigator.clipboard.writeText(`${window.location.origin}/track/${convertedToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-[#f7f3ea] mb-8">Mesajlar</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#d7ff43] border-t-transparent rounded-full" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <p className="text-[#817b70]">Henüz mesaj yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left bg-white/[0.03] border rounded-xl px-5 py-4 transition-all hover:bg-white/[0.05] ${selected?.id === msg.id ? "border-[#d7ff43] bg-[#d7ff43]/5" : "border-white/10 hover:border-white/20"} ${!msg.read ? "border-l-2 border-l-[#d7ff43]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#f7f3ea] truncate">{msg.name}</p>
                  <span className="text-[10px] text-[#817b70] shrink-0">{new Date(msg.created_at).toLocaleDateString("tr-TR")}</span>
                </div>
                <p className="text-xs text-[#817b70] truncate mt-0.5">{msg.subject}</p>
                <p className="text-xs text-[#b8afa1] truncate mt-0.5">{msg.message}</p>
              </button>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
            {selected ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#f7f3ea]">{selected.subject}</h2>
                  <button onClick={() => remove(selected.id)} className="p-2 rounded-lg text-[#817b70] hover:text-[#ff6b35] hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-[#817b70]" />
                    <a href={`mailto:${selected.email}`} className="text-[#39d0c2] hover:underline">{selected.email}</a>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-[#817b70]" />
                      <a href={`tel:${selected.phone}`} className="text-[#b8afa1] hover:text-[#f7f3ea]">{selected.phone}</a>
                    </div>
                  )}
                  <p className="text-xs text-[#817b70]">{new Date(selected.created_at).toLocaleString("tr-TR")}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-[#b8afa1] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setConvertForm(true); setConvertData({ title: selected.subject, description: "" }); setConvertedToken(null) }} className="flex items-center gap-2 bg-white/10 text-[#f7f3ea] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-all"><ArrowRight className="w-4 h-4" />Projeye Çevir</button>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="flex items-center gap-2 bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)]"><ExternalLink className="w-4 h-4" />Yanıtla</a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#817b70] text-sm py-20">
                Soldan bir mesaj seçin
              </div>
            )}
          </div>
        </div>
      )}

      {convertForm && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setConvertForm(false)}>
          <div className="bg-[#181713] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)]" onClick={(e) => e.stopPropagation()}>
            {convertedToken ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#d7ff43]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#d7ff43]" />
                </div>
                <h3 className="text-lg font-bold text-[#f7f3ea] mb-2">Proje Oluşturuldu!</h3>
                <p className="text-sm text-[#817b70] mb-4">Müşteriye göndermek için takip linkini kopyalayın:</p>
                <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm text-[#b8afa1] break-all">{[window.location.origin]}/track/{convertedToken}</div>
                <div className="flex gap-3">
                  <button onClick={copyLink} className="flex-1 flex items-center justify-center gap-2 bg-[#d7ff43] text-[#10100d] py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? "Kopyalandı" : "Linki Kopyala"}
                  </button>
                  <button onClick={() => setConvertForm(false)} className="px-6 py-3 rounded-xl border border-white/10 text-[#b8afa1] text-sm font-bold hover:bg-white/5 transition-all">Kapat</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#f7f3ea]">Projeye Çevir</h2>
                  <button onClick={() => setConvertForm(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-[#b8afa1]" /></button>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-3 text-sm">
                    <p className="text-[#817b70] text-xs mb-1">Müşteri</p>
                    <p className="text-[#f7f3ea]">{selected.name} · {selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>
                  </div>
                  <input value={convertData.title} onChange={(e) => setConvertData({ ...convertData, title: e.target.value })} placeholder="Proje Başlığı" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all" />
                  <textarea value={convertData.description} onChange={(e) => setConvertData({ ...convertData, description: e.target.value })} placeholder="Açıklama (opsiyonel)" rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-[#f7f3ea] placeholder:text-[#817b70] focus:outline-none focus:border-[#d7ff43] transition-all resize-none" />
                  <button onClick={convertToProject} className="w-full rounded-xl bg-gradient-to-r from-[#d7ff43] to-[#39d0c2] text-[#10100d] font-bold py-3.5 transition-all hover:shadow-[0_0_30px_rgba(215,255,67,0.2)]">Oluştur</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
