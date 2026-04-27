import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-xl",
        className
      )}
      style={{
        background: `linear-gradient(90deg,
          var(--muted) 25%,
          var(--surface-raised, #3d4f50) 50%,
          var(--muted) 75%
        )`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }}
      {...props}
    />
  );
}

// Card skeleton preset
function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
    </div>
  );
}

export { Skeleton, MovieCardSkeleton };
