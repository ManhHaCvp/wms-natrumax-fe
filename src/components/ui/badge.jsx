import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/components/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border rounded px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#16a34a] text-primary-foreground hover:bg-[#16a34a]/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        tertiary:
          "border-transparent bg-yellow-400 text-primary-foreground hover:bg-yellow-400/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
