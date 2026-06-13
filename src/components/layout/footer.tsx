import Link from "next/link"
import { siteConfig, navigation, services } from "@/constants"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10 bg-card/80">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="text-xl font-black tracking-tight text-gradient">
                Meg Dev
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {siteConfig.description}
            </p>
            <div className="flex gap-2">
              {[siteConfig.linkedin, siteConfig.twitter, siteConfig.instagram, siteConfig.facebook].map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-foreground/10 bg-foreground/[0.04] text-xs font-bold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {["in", "X", "IG", "FB"][i]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Hızlı Linkler</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                    {item.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Hizmetler</h3>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">İletişim</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{siteConfig.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{siteConfig.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foreground/10 pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
