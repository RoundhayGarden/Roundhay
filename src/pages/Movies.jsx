import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Heart } from "lucide-react"
import { NavLink, useParams } from "react-router-dom"

import {
  getMovieImages,
  getNowPlayingMovies,
  getPopularMovies,
  searchMovies,
  TMDB_IMAGE_BASE_URL,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from "../../services/moviesApi"
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
  { key: "popular", label: "Popular", fetcher: getPopularMovies },
  { key: "trending", label: "Trending", fetcher: getTrendingMovies },
  { key: "top_rated", label: "Top Rated", fetcher: getTopRatedMovies },
  { key: "now_playing", label: "Now Playing", fetcher: getNowPlayingMovies },
  { key: "upcoming", label: "Upcoming", fetcher: getUpcomingMovies },
]

const Movies = () => {
  const { tab = "popular" } = useParams()
  const [movies, setMovies] = useState([])
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
    setMovies([])
  }, [activeTab.key, debouncedSearchTerm])

  useEffect(() => {
    let isMounted = true

    const loadMovies = async () => {
      setIsLoading(true)
      setError("")
      try {
        const data = isSearchActive
          ? await searchMovies(debouncedSearchTerm.trim(), page)
          : await activeTab.fetcher(page)
        const baseMovies = data?.results ?? []
        const moviesWithPosters = await attachPosters(baseMovies, getMovieImages)

        if (isMounted) {
          setMovies((prev) =>
            page === 1
              ? moviesWithPosters
              : mergeUniqueById(prev, moviesWithPosters)
          )
          setTotalPages(data?.total_pages ?? 1)
        }
      } catch {
        if (isMounted) {
          setError(
            isSearchActive
              ? "Failed to load search results."
              : "Failed to load movies for this category."
          )
          setMovies([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMovies()

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
      <h1 className="text-2xl font-semibold text-foreground">Movies</h1>

      <div className="flex flex-wrap gap-2">
        {TAB_CONFIG.map((item) => (
          <NavLink
            key={item.key}
            to={`/movies/${item.key}`}
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
        placeholder="Search movies..."
      />

      {isLoading && movies.length === 0 && (
        <Spinner
          label={
            isSearchActive
              ? `Searching for "${debouncedSearchTerm}"...`
              : `Loading ${activeTab.label} movies...`
          }
          center
        />
      )}
      {error && movies.length === 0 && <p className="text-sm text-destructive">{error}</p>}

      {movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {movies.map((movie) => {
              return (
                <article
                  key={movie.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card"
                >
                <div className="relative aspect-2/3 w-full bg-muted">
                  {movie.posterPath ? (
                    <img
                      src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
                      alt={movie.title}
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
                    <VoteProgress voteAverage={movie.vote_average} />
                  </div>
                </div>
                <div className="p-3">
                  <h2 className="font-medium text-card-foreground">{movie.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{movie.release_date || "N/A"}</p>
                </div>
                </article>
              )
            })}
          </div>

          {page < totalPages && (
            <div ref={loadMoreRef} className="h-1" />
          )}
          {isLoading && page > 1 && (
            <Spinner label="Loading more movies..." center />
          )}
        </>
      )}
    </section>
  )
}

export default Movies
