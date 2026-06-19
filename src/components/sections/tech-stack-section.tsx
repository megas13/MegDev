"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"

interface TechItem {
  name: string
  logo: React.ReactNode
  description: string
}

interface TechCategory {
  title: string
  items: TechItem[]
}

export function TechStackSection() {
  const categories: TechCategory[] = [
    {
      title: "Frontend & Mobil",
      items: [
        {
          name: "Next.js",
          description: "Server-side rendering & Statik üretim",
          logo: (
            <svg viewBox="0 0 180 180" className="w-10 h-10 fill-current text-foreground">
              <path d="M90 0C40.29 0 0 40.29 0 90s40.29 90 90 90 90-40.29 90-90S139.71 0 90 0zM141.38 138.83l-45.72-59.27V123H84.18V57h11.48l45.72 59.27V57h11.48v81.83z" />
            </svg>
          ),
        },
        {
          name: "React",
          description: "Dinamik kullanıcı arayüzleri & Bileşenler",
          logo: (
            <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-10 h-10 stroke-current text-accent" fill="none">
              <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
              <g strokeWidth="1">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </g>
            </svg>
          ),
        },
        {
          name: "Tailwind CSS",
          description: "Modern, hızlı ve responsive tasarım altyapısı",
          logo: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current text-cyan-400">
              <path d="M12 6.018c1.38-2.508 4.272-4.018 8-4.018 2.208 0 4 1.792 4 4 0 3.728-1.51 6.62-4.018 8-2.508 1.38-4.272 4.272-4.272 8 0 2.208-1.792 4-4 4-3.728 0-6.62-1.51-8-4.018-1.38-2.508-4.272-4.272-8-4.272-2.208 0-4-1.792-4-4 0-3.728 1.51-6.62 4.018-8 2.508-1.38 4.272-4.272 4.272-8 0-2.208 1.792-4 4-4 3.728 0 6.62 1.51 8 4.018z" className="opacity-0" />
              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
            </svg>
          ),
        },
        {
          name: "React Native",
          description: "iOS ve Android için native cross-platform uygulamalar",
          logo: (
            <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-10 h-10 stroke-current text-indigo-400" fill="none">
              <circle cx="0" cy="0" r="1.8" fill="currentColor" stroke="none" />
              <g strokeWidth="0.8">
                <ellipse rx="11" ry="3.5" />
                <ellipse rx="11" ry="3.5" transform="rotate(60)" />
                <ellipse rx="11" ry="3.5" transform="rotate(120)" />
              </g>
            </svg>
          ),
        },
      ],
    },
    {
      title: "Backend & Logic",
      items: [
        {
          name: "Node.js",
          description: "Hızlı, ölçeklenebilir asenkron sunucu mimarisi",
          logo: (
            <svg viewBox="0 0 256 284" className="w-10 h-10 fill-current text-emerald-500">
              <path d="M141.7 5.2l97.9 56.5c9.6 5.5 16.4 15.5 16.4 26.6v113c0 11.1-6.8 21.1-16.4 26.6l-97.9 56.5c-9.6 5.5-22.1 5.5-31.7 0l-97.9-56.5c-9.6-5.5-16.4-15.5-16.4-26.6v-113c0-11.1 6.8-21.1 16.4-26.6l97.9-56.5c9.7-5.6 22.1-5.6 31.7 0zM128 39.8v199.1l86.1-49.7v-99.7L128 39.8z" />
            </svg>
          ),
        },
        {
          name: "Python & AI",
          description: "Veri bilimi, API servisleri ve makine öğrenimi",
          logo: (
            <svg viewBox="0 0 110 110" className="w-10 h-10 fill-current text-sky-500">
              <path d="M55 2.5C26.005 2.5 5 23.505 5 52.5s21.005 50 50 50 50-21.005 50-50S83.995 2.5 55 2.5zm0 15c10.77 0 19.5 8.73 19.5 19.5s-8.73 19.5-19.5 19.5-19.5-8.73-19.5-19.5 8.73-19.5 19.5-19.5zm0 54c-12.7 0-23.77-7.23-29.27-17.79 3.86-5.64 12.35-9.71 29.27-9.71s25.41 4.07 29.27 9.71C78.77 64.27 67.7 71.5 55 71.5z" className="opacity-0" />
              <path d="M52.09 9.03c-14.81.7-26.23 8.35-26.23 23.23v10.59h26.96v3.83H25.07C16.92 46.68 11 52.28 11 62.43c0 10.74 8.24 18.54 18.54 18.54h11.08V70.38c0-8.91 7.23-16.14 16.14-16.14h25.43V27.28c0-10.77-8.24-18.25-18.25-18.25H52.09zm2.91 6.72c2.12 0 3.83 1.71 3.83 3.83 0 2.12-1.71 3.83-3.83 3.83s-3.83-1.71-3.83-3.83c0-2.12 1.71-3.83 3.83-3.83zm.59 29.87c-8.91 0-16.14 7.23-16.14 16.14v26.96h10.59V55.07c0-8.15 5.6-14.07 15.75-14.07h18.54c10.74 0 18.54-8.24 18.54-18.54V11.38c-8.91 0-16.14 7.23-16.14 16.14v18.07H55.59zm14.41 29.88c2.12 0 3.83 1.71 3.83 3.83 0 2.12-1.71 3.83-3.83 3.83s-3.83-1.71-3.83-3.83c0-2.12 1.71-3.83 3.83-3.83z" />
            </svg>
          ),
        },
        {
          name: "Golang",
          description: "Yüksek eşzamanlılık (concurrency) gerektiren servisler",
          logo: (
            <svg viewBox="0 0 256 96" className="w-12 h-10 fill-current text-sky-400">
              <path d="M84.2 48c0 14.8-11.8 26.6-26.6 26.6S31 62.8 31 48s11.8-26.6 26.6-26.6S84.2 33.2 84.2 48zm33.1-23.7v45c0 11.2-8.3 19.3-19.3 19.3-9.2 0-16.2-5.4-18.5-12.7l7.5-3.1c1.5 3.8 5.4 6.7 11 6.7 5.4 0 10-3.3 10-9.8v-4.1h-.2c-3.1 3.8-7.9 6.5-13.8 6.5C89.5 75 77 63.6 77 48.7s12.5-26.2 26.6-26.2c6 0 10.7 2.7 13.8 6.5h.2v-4.7h19.7zm59 23.7c0 14.8-11.8 26.6-26.6 26.6S123 62.8 123 48s11.8-26.6 26.6-26.6S176.3 33.2 176.3 48zm67.1 24.3l-10-15.6c-4.4 3.3-10 5.4-16.2 5.4-10.4 0-18.1-5.8-20-14.1h48.3v-2.3c0-13.5-9.6-23.9-25.2-23.9-15.4 0-27.1 11.7-27.1 26.2s11.6 26.6 27.1 26.6c10.4 0 18.5-4.4 22.9-12.3zm-104.7-22c0-9.8-7.9-17.7-17.7-17.7s-17.7 7.9-17.7 17.7 7.9 17.7 17.7 17.7 17.7-7.9 17.7-17.7zm92-4.1h-28.5c1.7-6.5 7.1-10.8 13.8-10.8 6.9 0 12.3 4.4 14.7 10.8z" />
            </svg>
          ),
        },
        {
          name: "Fastify / Express",
          description: "Düşük gecikmeli REST ve GraphQL API altyapıları",
          logo: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current text-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-5h2v5zm0-6.5h-2V8h2v2z" className="opacity-0" />
              <path d="M19 10h-6V4l-7 10h6v6z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Veritabanı & Cache",
      items: [
        {
          name: "PostgreSQL",
          description: "İlişkisel veri modelleri ve güvenli veri saklama",
          logo: (
            <svg viewBox="0 0 256 256" className="w-10 h-10 fill-current text-sky-600">
              <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm68.3 162.7c-5.8 14.8-16 26.6-29.2 34.6-5 3.1-11.4 3.7-17 1.5l-23-9c-12-4.7-25.1.7-30.8 12.5l-6 12.5c-4.4 9.2-15.5 12.9-24.7 8.5s-12.9-15.5-8.5-24.7l6-12.5c11.4-23.7 37.6-34.6 61.6-25.1l23 9c2 .8 4 .6 5.8-.6 6.8-4.1 12-10.2 15-17.7 5.8-14.8 2.6-31.7-7.7-43.1l-14.3-15.8c-7.9-8.7-21.7-8.7-29.6 0l-14.3 15.8c-10.3 11.4-13.5 28.3-7.7 43.1l6 15.5c3.5 9.1-.9 19.3-10 22.8s-19.3-.9-22.8-10l-6-15.5c-11.4-29.6-5-63.5 15.5-86.3l14.3-15.8c18.5-20.5 50.8-20.5 69.3 0l14.3 15.8c20.5 22.8 26.9 56.7 15.5 86.3z" />
            </svg>
          ),
        },
        {
          name: "MongoDB",
          description: "Yarı-yapılandırılmış, esnek NoSQL döküman yönetimi",
          logo: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current text-emerald-500">
              <path d="M17.15 10.66c-.36-1.57-1.12-3.15-2.22-4.48-.3-.37-.62-.72-.93-1.05-.2-.21-.4-.41-.6-.61-.31-.32-.63-.64-.95-.97-.24-.25-.45-.48-.65-.72-.25.24-.46.47-.7.72-.32.33-.64.65-.95.97-.2.2-.4.4-.6.61-.31.33-.63.68-.93 1.05-1.1 1.33-1.86 2.91-2.22 4.48-.82 3.56.24 6.87 2.7 8.78.2.16.4.3.62.43.34.21.7.38 1.08.53v2.68c0 .55.45 1 1 1s1-.45 1-1v-2.68c.38-.15.74-.32 1.08-.53.22-.13.42-.27.62-.43 2.46-1.91 3.52-5.22 2.7-8.78zm-5.15-4.83c1.78 1.95 2.5 4.54 2.14 7.02-.13.9-.45 1.77-.94 2.51V5.83z" />
            </svg>
          ),
        },
        {
          name: "Redis",
          description: "Yüksek performanslı önbellekleme ve pub/sub yapısı",
          logo: (
            <svg viewBox="0 0 256 224" className="w-10 h-10 fill-current text-rose-600">
              <path d="M128 0L24.8 44.8 0 55.6v53.2l24.8 10.8L128 74.8l103.2 44.8 24.8-10.8V55.6L231.2 44.8 128 0zm0 149.2L24.8 194 0 204.8v19.2h256v-19.2l-24.8-10.8-103.2-44.8zm0-74.4L24.8 119.6 0 130.4v18.8l24.8 10.8L128 115.2l103.2 44.8 24.8-10.8v-18.8l-24.8-10.8-103.2-44.8z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "DevOps & Bulut",
      items: [
        {
          name: "Docker",
          description: "İzole, taşınabilir ve güvenli konteyner mimarisi",
          logo: (
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current text-sky-500">
              <path d="M13.983 8.871h-2.111c-.086 0-.153.072-.153.159v2.111c0 .088.067.158.153.158h2.111c.088 0 .158-.07.158-.158V9.03c-.001-.087-.071-.159-.158-.159zm2.793-2.794h-2.111c-.088 0-.158.071-.158.158v2.111c0 .088.07.159.158.159h2.111c.088 0 .159-.071.159-.159V6.236c0-.087-.071-.159-.159-.159zm-2.793 0h-2.111c-.086 0-.153.071-.153.158v2.111c0 .088.067.159.153.159h2.111c.088 0 .158-.071.158-.159V6.236c-.001-.087-.071-.159-.158-.159zm-2.794 2.794H9.078c-.087 0-.158.072-.158.159v2.111c0 .088.071.158.158.158h2.111c.087 0 .158-.07.158-.158V9.03c0-.087-.071-.159-.158-.159zm0-2.794H9.078c-.087 0-.158.071-.158.158v2.111c0 .088.071.159.158.159h2.111c.087 0 .158-.071.158-.159V6.236c0-.087-.071-.159-.158-.159zm-2.793 2.794H6.284c-.087 0-.158.072-.158.159v2.111c0 .088.071.158.158.158h2.111c.087 0 .159-.07.159-.158V9.03c0-.087-.072-.159-.159-.159zm0-2.794H6.284c-.087 0-.158.071-.158.158v2.111c0 .088.071.159.158.159h2.111c.087 0 .159-.071.159-.159V6.236c0-.087-.072-.159-.159-.159zM23.99 12.43c-.096-.17-.506-.827-1.42-1.24-.265-.12-.862-.232-1.393-.207-.113-.77-.442-1.742-1.163-2.483l-.048-.046-.048.048c-.687.683-.935 1.554-.99 2.296-.549-.009-1.233.109-1.545.241-.954.407-1.398 1.09-1.494 1.258a.17.17 0 00-.012.164c.026.059.083.096.148.096h6.786c.071 0 .135-.044.159-.111a.17.17 0 00-.01-.116zm-7.794-6.353H14.08c-.087 0-.158.071-.158.158v2.111c0 .088.071.159.158.159h2.116c.087 0 .158-.071.158-.159V6.236c0-.087-.071-.159-.158-.159zm-10.51 9.07c.071 0 .135-.043.159-.11a.17.17 0 00-.01-.116c-.096-.17-.506-.827-1.42-1.24-.265-.12-.861-.233-1.393-.207-.113-.77-.442-1.742-1.163-2.483l-.048-.046-.048.048c-.687.683-.935 1.554-.99 2.296-.549-.009-1.233.109-1.545.241-.954.407-1.398 1.09-1.494 1.258a.17.17 0 00-.012.164c.026.059.083.096.148.096h6.786z" />
            </svg>
          ),
        },
        {
          name: "Vercel",
          description: "Hızlı, ölçeklenebilir ve kenar (edge) ağı entegrasyonu",
          logo: (
            <svg viewBox="0 0 115 100" className="w-10 h-8 fill-current text-white">
              <path d="M57.5 0L115 100H0L57.5 0z" />
            </svg>
          ),
        },
        {
          name: "AWS",
          description: "Küresel ölçekte esnek, güvenli bulut sunucu altyapısı",
          logo: (
            <svg viewBox="0 0 256 154" className="w-12 h-10 fill-current text-orange-400">
              <path d="M129.4 69.3c0-11-2.2-19.8-6.6-26.6-4.4-6.8-11.4-10.2-21-10.2-5.4 0-10.4 1.2-14.8 3.7-4.4 2.5-7.9 6-10.4 10.7V34.5H57.2v72.3h18.2V99c2.7 4.8 6.2 8.3 10.7 10.7 4.4 2.4 9.4 3.7 14.8 3.7 9.6 0 16.6-3.4 21-10.2 4.4-6.8 6.6-15.6 6.6-26.6-1-.2-1-.7-1-7.3zm-18.7 12.8c0 7.4-1 13-3 16.8-2 3.8-5.6 5.7-10.8 5.7-4 0-7.4-1.3-10.2-3.8-2.8-2.5-4.2-6.1-4.2-10.9v-7.3c0-4.8 1.4-8.4 4.2-10.9 2.8-2.5 6.2-3.8 10.2-3.8 5.2 0 8.8 1.9 10.8 5.7 2 3.8 3 9.4 3 16.8v1.7zm59 24.7c-5.8 0-11-1.1-15.7-3.4s-8.3-5.5-11-9.6l10-10c3.7 4.9 8.2 7.4 13.5 7.4 2.7 0 4.8-.5 6.3-1.6 1.5-1.1 2.2-2.5 2.2-4.3 0-1.6-.7-2.9-2-3.8-1.3-.9-3.9-1.9-7.8-2.8-5.8-1.5-10.1-3.6-13-6.4s-4.3-6.5-4.3-11.2c0-5.8 2.2-10.5 6.6-14.1 4.4-3.6 10.4-5.4 18-5.4 5.3 0 10 1 14.1 3 4.1 2 7.3 4.7 9.6 8.3l-9.8 10c-3.1-3.7-6.9-5.6-11.4-5.6-2.5 0-4.4.5-5.8 1.5-1.4 1-2.1 2.3-2.1 3.9 0 1.5.7 2.7 2 3.6s3.8 1.8 7.5 2.7c6 1.5 10.4 3.7 13.2 6.5 2.8 2.8 4.2 6.6 4.2 11.4 0 6.2-2.2 11.2-6.6 14.8-4.5 3.7-10.7 5.6-18.6 5.6z" />
              <path d="M46.7 135.2c-22-14.8-37.9-28-44.5-35-.8-.8-.8-2 .1-2.7 4.1-3.3 12.3-1.6 17 2.1 7.2 5.7 27.5 22.8 53.6 22.8 18.2 0 35-7.8 35-24 0-18.7-18.7-22-38.3-25.2C41.8 68.3 19.3 62 19.3 39.8c0-18 19-32.3 48.7-32.3 22 0 37.9 7.8 44.5 14.8.8.8.8 2-.1 2.7-4.1 3.3-12.3 1.6-17-2.1-7.2-5.7-22-12.8-48.1-12.8-18.2 0-30 7.8-30 20.8 0 17 18.7 20.3 38.3 23.5 27.8 4.7 50.3 11 50.3 33.2-.1 21.9-22 35.1-50.6 35.1-23.4.1-49-14.8-59.2-25.2zm204.6-24.1c-2.3 2.7-5.5 4.3-9 4.3H19.3c-3.5 0-6.7-1.6-9-4.3-.8-1-2.3-.7-2.7.5L.2 135c-.4 1.2.5 2.4 1.7 2.4h252.2c1.2 0 2.1-1.2 1.7-2.4l-7.4-23.4c-.4-1.2-1.9-1.5-2.7-.5z" />
            </svg>
          ),
        },
      ],
    },
  ]

  return (
    <section id="tech-stack" className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/5 bg-background">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Teknoloji Yığınımız"
          subtitle="Projelerimizi bugünün gereksinimlerine göre optimize edilmiş, yarının ölçeğine göre hazırlanan dünya standartlarındaki teknolojilerle kodluyoruz."
        />

        <div className="mt-16 space-y-16">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary border-l-4 border-primary pl-4">
                {category.title}
              </h3>
              
              <div className="grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map((tech, itemIdx) => (
                  <motion.div
                    key={itemIdx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: itemIdx * 0.05 }}
                    className="group bg-card p-6 flex flex-col justify-between min-h-[170px] hover:bg-card-hover border border-transparent transition-all duration-300 hover:border-primary hover:shadow-[0_0_24px_rgba(215,255,67,0.06)] hover:shadow-primary/5 hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {tech.logo}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        // SECURE
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold group-hover:text-primary transition-colors duration-300">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
