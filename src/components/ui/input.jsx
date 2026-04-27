import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "flex w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none",
        "transition-all duration-300 placeholder:text-muted-foreground/50",
        // Border + bg
        "border-[var(--glass-border)] bg-[var(--movie-accent)]",
        // Focus
        "focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-[var(--glass)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
