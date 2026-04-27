import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all select-none",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-primary-foreground",
        secondary:   "border-transparent bg-secondary text-secondary-foreground",
        accent:      "border-transparent bg-[var(--movie-accent)] text-accent",
        outline:     "border-[var(--glass-border)] text-muted-foreground bg-transparent",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        success:     "border-transparent bg-emerald-500/15 text-emerald-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
