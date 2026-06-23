"use client"

import { forwardRef } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
          variant === "primary" && "bg-primary text-background hover:bg-primary-dark shadow-[0_16px_40px_rgba(215,255,67,0.18)]",
          variant === "secondary" && "bg-secondary text-white hover:brightness-110 shadow-[0_16px_40px_rgba(255,107,53,0.18)]",
          variant === "outline" && "border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 text-foreground",
          variant === "ghost" && "bg-transparent hover:bg-foreground/10 text-foreground",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-sm",
          size === "lg" && "h-14 px-8 text-base",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
