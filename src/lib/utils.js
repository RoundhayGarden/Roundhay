import { clsx } from "clsx"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function mergeUniqueById(previousItems, incomingItems) {
  return [
    ...previousItems,
    ...incomingItems.filter((item) => !previousItems.some((prev) => prev.id === item.id)),
  ]
}

export async function attachPosters(items, getItemImages) {
  return Promise.all(
    items.map(async (item) => {
      try {
        const images = await getItemImages(item.id)
        const posterPath = images?.posters?.[0]?.file_path ?? null
        return { ...item, posterPath }
      } catch {
        return { ...item, posterPath: null }
      }
    })
  )
}

export function useInfiniteScrollObserver({
  targetRef,
  isLoading,
  hasMore,
  onLoadMore,
  rootMargin = "900px",
}) {
  useEffect(() => {
    const node = targetRef?.current
    if (!node || isLoading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [targetRef, isLoading, hasMore, onLoadMore, rootMargin])
}

export function getRateColor(percent) {
  if (percent >= 70) return "#22c55e"
  if (percent >= 50) return "#eab308"
  return "#ef4444"
}

export function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}
