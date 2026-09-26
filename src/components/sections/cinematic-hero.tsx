"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react"
import styles from "./cinematic-hero.module.css"

export function CinematicHero() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const section = root.current!
    const media = video.current!
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const scenes = Array.from(section.querySelectorAll<HTMLElement>("[data-scene]"))
    let frame = 0
    let target = 0
    let displayed = 0
    let lastTick = 0
    let start = 0
    let distance = 1
    let still = false
    let failed = false
    let disposed = false
    let previousScene = -1

    const seek = () => {
      if (disposed || media.seeking || !Number.isFinite(media.duration) || media.readyState < 2) return
      // Every encoded frame is independently decodable. Quantize to actual
      // source frames and never queue overlapping decoder requests.
      const time = Math.min(Math.round(displayed * (media.duration - 0.06) * 24) / 24, media.duration - 0.06)
      if (Math.abs(media.currentTime - time) > 0.02) media.currentTime = time
    }
    const update = (now: number) => {
      frame = 0
      if (disposed || document.hidden) return
      target = still ? 0 : Math.min(1, Math.max(0, (window.scrollY - start) / distance))
      const dt = lastTick ? Math.min(64, now - lastTick) : 16
      lastTick = now
      // Frame-rate independent easing absorbs wheel steps, without hijacking
      // native scrolling. Stop the loop as soon as the picture catches up.
      displayed += (target - displayed) * (1 - Math.exp(-dt / 130))
      if (Math.abs(target - displayed) < 0.001) displayed = target
      section.style.setProperty("--journey", String(displayed))
      const active = displayed < 0.32 ? 0 : displayed < 0.7 ? 1 : 2
      if (active !== previousScene) {
        scenes.forEach((scene, index) => {
          scene.dataset.active = String(index === active)
          scene.inert = index !== active
          scene.setAttribute("aria-hidden", String(index !== active))
        })
        previousScene = active
      }
      if (!still) seek()
      if (displayed !== target) frame = requestAnimationFrame(update)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const configure = () => {
      still = paused || preference.matches || !!connection?.saveData || failed
      section.dataset.still = String(still)
      start = section.getBoundingClientRect().top + window.scrollY
      distance = Math.max(1, section.offsetHeight - window.innerHeight)
      if (still) displayed = 0
      if (!still && !media.getAttribute("src")) {
        media.preload = "auto"
        media.src = "/media/digital-core-scrub.mp4"
        media.load()
      }
      schedule()
    }
    const onError = () => { failed = true; configure() }
    media.addEventListener("loadeddata", schedule)
    media.addEventListener("seeked", schedule)
    media.addEventListener("error", onError)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", configure)
    document.addEventListener("visibilitychange", schedule)
    preference.addEventListener("change", configure)
    configure()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      media.removeEventListener("loadeddata", schedule)
      media.removeEventListener("seeked", schedule)
      media.removeEventListener("error", onError)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", configure)
      document.removeEventListener("visibilitychange", schedule)
      preference.removeEventListener("change", configure)
    }
  }, [paused])

  return (
    <section ref={root} className={styles.journey} aria-label="Meg Dev dijital deneyimi">
      <div className={styles.stage}>
        <div className={styles.backdrop} aria-hidden="true">
          <video ref={video} muted playsInline preload="none" poster="/media/digital-core-poster.jpg" className={styles.video} tabIndex={-1} />
        </div>
        <div className={styles.shade} />
        <div className={styles.topline}>
          <span><i /> BAĞIMSIZ DİJİTAL STÜDYO</span>
          <span className={styles.coordinates}>TASARIM × TEKNOLOJİ</span>
        </div>
        <div className={styles.scenes}>
          <div data-scene data-active="true" className={styles.scene}>
            <p className={styles.eyebrow}>01 / HER ŞEY BİR FİKİRLE BAŞLAR</p>
            <h1>Fikirlerin<br /><span>dijital çekirdeği.</span></h1>
            <p className={styles.description}>Tasarımı teknolojiyle buluşturuyor,<br />fikrinize hayat veren dijital deneyimler üretiyoruz.</p>
            <Link href="/contact" className={styles.cta}>Birlikte üretelim <ArrowUpRight size={19} /></Link>
          </div>
          <div data-scene data-active="false" aria-hidden="true" inert className={styles.scene}>
            <p className={styles.eyebrow}>02 / GÖRÜNENDEN FAZLASI</p>
            <h2>İyi tasarım.<br /><span>Güçlü teknoloji.</span></h2>
            <p className={styles.description}>Web, mobil ve yapay zekâ.<br />Birbirine bağlanan fikirler. Birlikte çalışan sistemler.</p>
            <div className={styles.tags}><span>WEB</span><span>MOBİL</span><span>YAPAY ZEKÂ</span></div>
          </div>
          <div data-scene data-active="false" aria-hidden="true" inert className={styles.scene}>
            <p className={styles.eyebrow}>03 / FİKİRDEN GERÇEĞE</p>
            <h2>Sıradaki hikâye<br /><span>sizin olsun.</span></h2>
            <p className={styles.description}>İşinizi anlayan bir ekip.<br />Size özel tasarlanan, birlikte büyüyen çözümler.</p>
            <Link href="#portfolio" className={styles.cta}>Projeleri keşfet <ArrowUpRight size={19} /></Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <a href="#home-content" className={styles.skip}><ArrowDown size={16} /><span>KEŞFETMEK İÇİN KAYDIR</span></a>
          <div className={styles.timeline} aria-hidden="true"><span>FİKİR</span><div><i /></div><span>GERÇEK</span></div>
          <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Kaydırma animasyonunu aç" : "Kaydırma animasyonunu kapat"} className={styles.toggle}>
            {paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? "HAREKETİ AÇ" : "HAREKETİ KAPAT"}</span>
          </button>
        </div>
        <a href="#home-content" className={styles.accessSkip}>Animasyonu atla, içeriğe geç</a>
      </div>
    </section>
  )
}
