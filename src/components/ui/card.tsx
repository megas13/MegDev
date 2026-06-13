import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, glow, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[8px] border border-foreground/10 bg-card/90 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card-hover",
        glow && "glow-blue",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Card.displayName = "Card"

export { Card }
