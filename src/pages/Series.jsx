import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Heart } from "lucide-react"
import { NavLink, useParams } from "react-router-dom"

import {
  getAiringTodayTv,
  getOnTheAirTv,
  getPopularTv,
  getTopRatedTv,
  getTvImages,
  searchTv,
  TMDB_IMAGE_BASE_URL,
} from "../../services/seriesApi"
import SearchInput from "../components/SearchInput"
import Spinner from "../components/Spinner"
import VoteProgress from "../components/VoteProgress"
import {
  attachPosters,
  mergeUniqueById,
  useDebouncedValue,
  useInfiniteScrollObserver,
} from "../lib/utils"

const TAB_CONFIG = [
  { key: "airing_today", label: "Airing Today", fetcher: getAiringTodayTv },
  { key: "on_the_air", label: "On The Air", fetcher: getOnTheAirTv },
  { key: "popular", label: "Popular", fetcher: getPopularTv },
  { key: "top_rated", label: "Top Rated", fetcher: getTopRatedTv },
]

const Series = () => {
  const { tab = "popular" } = useParams()
  const [shows, setShows] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const loadMoreRef = useRef(null)
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500)

  const activeTab = useMemo(
    () => TAB_CONFIG.find((item) => item.key === tab) ?? TAB_CONFIG[0],
    [tab]
  )
  const isSearchActive = debouncedSearchTerm.trim().length > 0

  useEffect(() => {
    setPage(1)
    setTotalPages(1)
    setShows([])
  }, [activeTab.key, debouncedSearchTerm])

  useEffect(() => {
    let isMounted = true

    const loadSeries = async () => {
      setIsLoading(true)
      setError("")
      try {
        const data = isSearchActive
          ? await searchTv(debouncedSearchTerm.trim(), page)
          : await activeTab.fetcher(page)
        const baseResults = data?.results ?? []
        const withPosters = await attachPosters(baseResults, getTvImages)

        if (isMounted) {
          setShows((prev) =>
            page === 1 ? withPosters : mergeUniqueById(prev, withPosters)
          )
          setTotalPages(data?.total_pages ?? 1)
        }
      } catch {
        if (isMounted) {
          setError(
            isSearchActive
              ? "Failed to load search results."
              : "Failed to load TV shows for this category."
          )
          setShows([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSeries()

    return () => {
      isMounted = false
    }
  }, [activeTab, debouncedSearchTerm, isSearchActive, page])

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  useInfiniteScrollObserver({
    targetRef: loadMoreRef,
    isLoading,
    hasMore: page < totalPages,
    onLoadMore: handleLoadMore,
    rootMargin: "900px",
  })

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">TV Series</h1>

      <div className="flex flex-wrap gap-2">
        {TAB_CONFIG.map((item) => (
          <NavLink
            key={item.key}
            to={`/series/${item.key}`}
            className={({ isActive }) =>
              `rounded-full border px-4 py-1.5 text-sm transition ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:border-primary/60"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <SearchInput
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search TV shows..."
      />

      {isLoading && shows.length === 0 && (
        <Spinner
          label={
            isSearchActive
              ? `Searching for "${debouncedSearchTerm}"...`
              : `Loading ${activeTab.label}...`
          }
          center
        />
      )}
      {error && shows.length === 0 && <p className="text-sm text-destructive">{error}</p>}

      {shows.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {shows.map((show) => (
              <article
                key={show.id}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative aspect-2/3 w-full bg-muted">
                  {show.posterPath ? (
                    <img
                      src={`${TMDB_IMAGE_BASE_URL}${show.posterPath}`}
                      alt={show.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:brightness-50"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No Poster
                    </div>
                  )}

                  <button
                    type="button"
                    aria-label="Add to wishlist"
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow transition duration-300 group-hover:opacity-100"
                  >
                    <Heart size={16} />
                  </button>

                  <div className="pointer-events-none absolute bottom-2 left-2 opacity-0 transition duration-300 group-hover:opacity-100">
                    <VoteProgress voteAverage={show.vote_average} />
                  </div>
                </div>
                <div className="p-3">
                  <h2 className="font-medium text-card-foreground">{show.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{show.first_air_date || "N/A"}</p>
                </div>
              </article>
            ))}
          </div>

          {page < totalPages && <div ref={loadMoreRef} className="h-1" />}
          {isLoading && page > 1 && <Spinner label="Loading more shows..." center />}
        </>
      )}
    </section>
  )
}

export default Series
