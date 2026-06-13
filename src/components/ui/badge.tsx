import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary"
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
          variant === "default" && "border border-foreground/10 bg-foreground/[0.04] text-muted-foreground",
          variant === "primary" && "bg-primary text-background",
          variant === "secondary" && "bg-secondary text-white",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
