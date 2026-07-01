"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function StickySlide({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-out will-change-transform ${
        show ? "translate-y-0 opacity-100" : "translate-y-[50vh] opacity-0"
      }`}
    >
      {children}
    </div>
  )
}
