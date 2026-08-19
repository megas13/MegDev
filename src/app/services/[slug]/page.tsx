import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, CircleDot, Layers3, Sparkles } from "lucide-react"
import { services } from "@/constants"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((item) => item.slug === slug)
  return service ? { title: `${service.title} | Meg Dev`, description: service.description } : {}
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = services.find((item) => item.slug === slug)
  if (!service) notFound()
  const currentIndex = services.findIndex((item) => item.slug === slug)
  const nextService = services[(currentIndex + 1) % services.length]

  return <main className="min-h-screen overflow-hidden bg-[#10100d] pt-20 text-[#f7f3ea]">
    <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className={`absolute right-[-10%] top-[-25%] h-[36rem] w-[36rem] rounded-full bg-gradient-to-br ${service.gradient} opacity-15 blur-[120px]`} />
      <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative mx-auto max-w-7xl">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-[#817b70] transition hover:text-primary"><ArrowLeft className="h-4 w-4" /> Tüm hizmetler</Link>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><span className="font-mono text-xs font-bold uppercase tracking-[.25em] text-primary">0{currentIndex + 1} / Yetkinlik</span><h1 className="mt-5 text-5xl font-black leading-[.92] tracking-tight sm:text-7xl lg:text-8xl">{service.title}</h1></div>
          <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6 backdrop-blur-xl"><Sparkles className="h-6 w-6 text-primary" /><p className="mt-5 text-lg leading-8 text-[#d7d1c6]">{service.description}</p></div>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-28">
      <div><p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-primary">Sonuç odaklı yaklaşım</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">Sadece üretmiyor,<br/>işe yarayanı kuruyoruz.</h2><p className="mt-6 text-base leading-7 text-[#b8afa1]">{service.outcome}</p></div>
      <div className="grid gap-4 sm:grid-cols-2">{service.features.map((feature, index) => <article key={feature} className="group rounded-3xl border border-white/10 bg-[#181814] p-6 transition hover:-translate-y-1 hover:border-primary/40"><span className="font-mono text-xs text-[#817b70]">0{index + 1}</span><Check className="mt-8 h-6 w-6 text-primary" /><h3 className="mt-4 text-xl font-black">{feature}</h3><p className="mt-2 text-sm leading-6 text-[#817b70]">Bu yetenek proje kapsamına, hedeflere ve mevcut altyapınıza göre ölçülendirilir.</p></article>)}</div>
    </section>

    <section className="border-y border-white/10 bg-[#151510] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[.65fr_1fr]"><div><Layers3 className="h-8 w-8 text-primary"/><h2 className="mt-5 text-3xl font-black sm:text-5xl">Nasıl ilerliyoruz?</h2><p className="mt-4 text-[#817b70]">Belirsizliği azaltan, her adımda görünür çıktı üreten çalışma akışı.</p></div><ol className="space-y-3">{service.process.map((step, index) => <li key={step} className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[.025] p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-black text-[#10100d]">{index + 1}</span><div><p className="font-black">{step}</p><p className="mt-1 text-xs text-[#817b70]">Kontrollü teslimat · açık iletişim · ölçülebilir çıktı</p></div></li>)}</ol></div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-primary">Teknoloji seti</p><div className="mt-6 flex flex-wrap gap-3">{service.technologies.map((technology) => <span key={technology} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-5 py-3 text-sm font-bold"><CircleDot className="h-3.5 w-3.5 text-primary" />{technology}</span>)}</div>
      <div className="mt-20 grid gap-5 rounded-[2rem] border border-primary/20 bg-primary/[.06] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-bold text-primary">Bir sonraki adım</p><h2 className="mt-2 text-3xl font-black">Bu çözümü projenize uyarlayalım.</h2><p className="mt-3 text-[#b8afa1]">İhtiyacınızı konuşalım, kapsamı ve en doğru başlangıç yolunu birlikte netleştirelim.</p></div><Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-black text-[#10100d]">Projeyi konuşalım <ArrowRight className="h-4 w-4" /></Link></div>
      <Link href={`/services/${nextService.slug}`} className="group mt-8 flex items-center justify-between rounded-2xl border border-white/10 p-5 transition hover:border-primary/30"><span><span className="block text-xs text-[#817b70]">Sıradaki hizmet</span><span className="mt-1 block font-black">{nextService.title}</span></span><ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></Link>
    </section>
  </main>
}
