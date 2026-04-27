import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full font-semibold text-sm select-none cursor-pointer",
    "transition-all duration-300 outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      variant: {
        // Primary – accent gradient
        default:
          "bg-accent text-accent-foreground hover:brightness-110 hover:scale-[1.04] hover:-translate-y-0.5 shadow-md shadow-[var(--movie-accent)]",
        // Gradient from accent → primary
        gradient:
          "bg-gradient-to-r from-accent to-primary text-accent-foreground hover:brightness-110 hover:scale-[1.04] hover:-translate-y-0.5 shadow-md shadow-[var(--movie-accent)]",
        // Outline / ghost
        outline:
          "border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur text-foreground hover:border-accent hover:bg-[var(--movie-accent)] hover:scale-[1.03]",
        // Fully ghost
        ghost:
          "bg-transparent text-muted-foreground hover:bg-[var(--movie-accent)] hover:text-accent hover:scale-[1.03]",
        // Destructive
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25 hover:scale-[1.03]",
        // Icon-only (no padding override needed — set size="icon")
        icon:
          "bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur text-foreground hover:bg-[var(--movie-accent)] hover:text-accent hover:scale-110 hover:border-accent",
      },
      size: {
        sm:   "h-8 px-4 text-xs",
        default: "h-11 px-6 text-sm",
        lg:   "h-13 px-8 text-base",
        icon: "h-10 w-10 rounded-xl [&_svg:not([class*='size-'])]:size-[18px]",
        "icon-sm": "h-8 w-8 rounded-lg [&_svg:not([class*='size-'])]:size-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
