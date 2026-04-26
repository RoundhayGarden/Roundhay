import { useEffect, useMemo, useState } from "react"
import { useLocation, useParams } from "react-router-dom"

import SectionSlider from "../components/discovery/SectionSlider"
import Spinner from "../components/Spinner"
import {
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
  TMDB_IMAGE_BASE_URL,
} from "../services/tmdb"

const formatRuntime = (minutes) => {
  if (!minutes || Number.isNaN(minutes)) return
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}m`
}

const formatMoney = (value) => {
  if (!value) return "N/A"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

const MovieDetails = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const previewMovie = state?.movie
  const [movieData, setMovieData] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])
  const [trailerUrl, setTrailerUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadMovieDetails = async () => {
      setIsLoading(true)
      setError("")

      try {
        const [details, videos, similar] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getSimilarMovies(id),
        ])

        const trailer = videos?.results?.find(
          (video) =>
            video.site?.toLowerCase() === "youtube" &&
            video.type?.toLowerCase() === "trailer" &&
            video.key
        )

        if (isMounted) {
          setMovieData(details)
          setSimilarMovies((similar?.results || []).filter((item) => String(item.id) !== String(id)))
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`)
          }
        }
      } catch {
        if (isMounted) {
          setError("Failed to load movie details.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMovieDetails()

    return () => {
      isMounted = false
    }
  }, [id])

  const movieDetails = useMemo(() => {
    const source = movieData || previewMovie
    const posterPath = source?.poster_path || source?.posterPath || null
    const backdropPath = source?.backdrop_path || source?.backdropPath || posterPath

    return {
      id,
      title: source?.title || "Untitled Movie",
      rating: Number(source?.vote_average || 0).toFixed(1),
      genres:
        source?.genres?.map((genre) => genre.name).filter(Boolean) || [],
      overview: source?.overview || "No overview available.",
      status: source?.status || "Unknown",
      tagline: source?.tagline || "Experience the story on the big screen.",
      releaseDate: source?.release_date || "Unknown",
      runtime: formatRuntime(source?.runtime),
      language: source?.original_language?.toUpperCase() || "N/A",
      budget: formatMoney(source?.budget),
      revenue: formatMoney(source?.revenue),
      companies: source?.production_companies?.slice(0, 6) || [],
      posterSrc: posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null,
      backdropSrc: backdropPath ? `${TMDB_IMAGE_BASE_URL}${backdropPath}` : null,
      trailerUrl: trailerUrl || "",
    }
  }, [id, movieData, previewMovie, trailerUrl])

  useEffect(() => {
    document.title = `${movieDetails.title} | Roundhay`
    return () => {
      document.title = "Roundhay — Discover Movies & Series"
    }
  }, [movieDetails.title])

  return (
    <section className="w-full pt-20 text-foreground sm:pt-24">
      <div className="relative min-h-[760px] overflow-hidden lg:min-h-[860px]">
        {movieDetails.backdropSrc && (
          <img
            src={movieDetails.backdropSrc}
            alt={movieDetails.title}
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black via-black/85 to-transparent" />

        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-start gap-7 px-6 py-12 text-left lg:py-20">
          <div className="w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/25 bg-card/70 shadow-2xl">
            {movieDetails.posterSrc ? (
              <img
                src={movieDetails.posterSrc}
                alt={movieDetails.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-2/3 items-center justify-center text-sm text-muted-foreground">
                No Poster
              </div>
            )}
          </div>

          <div className="w-full space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300 text-xs font-semibold text-cyan-200">
                {movieDetails.rating}
              </span>
              <h1 className="text-3xl font-semibold md:text-4xl">{movieDetails.title}</h1>
            </div>

            <p className="max-w-3xl text-sm italic text-cyan-100/90">{movieDetails.tagline}</p>

            {isLoading && (
              <div className="rounded-lg border border-white/15 bg-black/40 p-3">
                <Spinner label="Loading full movie details..." />
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Status</p>
                <p className="mt-1 text-sm font-medium">{movieDetails.status}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Release Date</p>
                <p className="mt-1 text-sm font-medium">{movieDetails.releaseDate}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Runtime</p>
                <p className="mt-1 text-sm font-medium">{movieDetails.runtime}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Language</p>
                <p className="mt-1 text-sm font-medium">{movieDetails.language}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movieDetails.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-cyan-300/40 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-medium">Overview</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/90">{movieDetails.overview}</p>
            </div>

            <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Budget</p>
                <p className="mt-1 text-sm font-medium text-emerald-300">{movieDetails.budget}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Revenue</p>
                <p className="mt-1 text-sm font-medium text-emerald-300">{movieDetails.revenue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <h2 className="mb-4 text-3xl font-semibold">Trailer</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-black shadow-xl">
          {movieDetails.trailerUrl ? (
            <div className="aspect-video">
              <iframe
                title={`${movieDetails.title} trailer`}
                src={movieDetails.trailerUrl}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
              Trailer is not available for this movie.
            </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-2xl font-semibold">Production Companies</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {movieDetails.companies.length > 0 ? (
              movieDetails.companies.map((company) => (
                <article
                  key={company.id}
                  className="rounded-lg border border-border bg-card/70 p-4 backdrop-blur"
                >
                  <p className="font-medium text-card-foreground">{company.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {company.origin_country || "Unknown country"}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No production companies available.</p>
            )}
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div className="mt-8">
            <SectionSlider
              title="Similar Movies"
              movies={similarMovies}
              showSeeMore={false}
              sliderId={`similar-movies-${id}`}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default MovieDetails
