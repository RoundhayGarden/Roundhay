import { useEffect, useMemo, useState } from "react"
import { useLocation, useParams } from "react-router-dom"

import SectionSlider from "../components/discovery/SectionSlider"
import Spinner from "../components/Spinner"
import { TMDB_IMAGE_BASE_URL, getSimilarTv, getTvDetails, getTvVideos } from "../../services/seriesApi"

const formatRuntime = (runtimeList) => {
  const minutes = Array.isArray(runtimeList) ? runtimeList[0] : runtimeList
  if (!minutes || Number.isNaN(minutes)) return "N/A"
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}m`
}

const SeriesDetails = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const previewSeries = state?.series
  const [seriesData, setSeriesData] = useState(null)
  const [similarSeries, setSimilarSeries] = useState([])
  const [trailerUrl, setTrailerUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadSeriesDetails = async () => {
      setIsLoading(true)
      setError("")

      try {
        const [details, videos, similar] = await Promise.all([
          getTvDetails(id),
          getTvVideos(id),
          getSimilarTv(id),
        ])
        const trailer = videos?.results?.find(
          (video) =>
            video.site?.toLowerCase() === "youtube" &&
            video.type?.toLowerCase() === "trailer" &&
            video.key
        )

        if (isMounted) {
          setSeriesData(details)
          setTrailerUrl(trailer ? `https://www.youtube.com/embed/${trailer.key}` : "")
          setSimilarSeries((similar?.results || []).filter((item) => String(item.id) !== String(id)))
        }
      } catch {
        if (isMounted) {
          setError("Failed to load series details.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSeriesDetails()
    return () => {
      isMounted = false
    }
  }, [id])

  const details = useMemo(() => {
    const source = seriesData || previewSeries
    const posterPath = source?.poster_path || source?.posterPath || null
    const backdropPath = source?.backdrop_path || source?.backdropPath || posterPath
    const genres = source?.genres?.map((genre) => genre.name).filter(Boolean) || []
    const seasons = source?.number_of_seasons ?? "N/A"
    const episodes = source?.number_of_episodes ?? "N/A"

    return {
      title: source?.name || source?.title || "Untitled Series",
      rating: Number(source?.vote_average || 0).toFixed(1),
      genres,
      overview: source?.overview || "No overview available.",
      tagline: source?.tagline || "Binge-worthy story starts here.",
      status: source?.status || "Unknown",
      firstAirDate: source?.first_air_date || "Unknown",
      runtime: formatRuntime(source?.episode_run_time),
      language: source?.original_language?.toUpperCase() || "N/A",
      seasons,
      episodes,
      companies: source?.production_companies?.slice(0, 6) || [],
      posterSrc: posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null,
      backdropSrc: backdropPath ? `${TMDB_IMAGE_BASE_URL}${backdropPath}` : null,
      trailerUrl,
    }
  }, [previewSeries, seriesData, trailerUrl])

  useEffect(() => {
    document.title = `${details.title} | Roundhay`
    return () => {
      document.title = "Roundhay — Discover Movies & Series"
    }
  }, [details.title])

  return (
    <section className="w-full pt-18 text-foreground sm:pt-20 ">
      <div className="relative min-h-[680px] overflow-hidden lg:min-h-[760px]">
        {details.backdropSrc && (
          <img
            src={details.backdropSrc}
            alt={details.title}
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black via-black/85 to-transparent" />

        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-start gap-5 px-5 py-8 text-left lg:py-12">
          <div className="w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/25 bg-card/70 shadow-2xl">
            {details.posterSrc ? (
              <img src={details.posterSrc} alt={details.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-2/3 items-center justify-center text-sm text-muted-foreground">
                No Poster
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300 text-xs font-semibold text-cyan-200">
                {details.rating}
              </span>
              <h1 className="text-3xl font-semibold md:text-4xl">{details.title}</h1>
            </div>

            <p className="max-w-3xl text-sm italic text-cyan-100/90">{details.tagline}</p>

            {isLoading && (
              <div className="rounded-lg border border-white/15 bg-black/40 p-3">
                <Spinner label="Loading full series details..." />
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
                <p className="mt-1 text-sm font-medium">{details.status}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">First Air Date</p>
                <p className="mt-1 text-sm font-medium">{details.firstAirDate}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Episode Runtime</p>
                <p className="mt-1 text-sm font-medium">{details.runtime}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Language</p>
                <p className="mt-1 text-sm font-medium">{details.language}</p>
              </div>
            </div>

            <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Seasons</p>
                <p className="mt-1 text-sm font-medium text-emerald-300">{details.seasons}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Episodes</p>
                <p className="mt-1 text-sm font-medium text-emerald-300">{details.episodes}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {details.genres.map((genre) => (
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
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/90">{details.overview}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-7">
        <h2 className="mb-4 text-3xl font-semibold">Trailer</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-black shadow-xl">
          {details.trailerUrl ? (
            <div className="aspect-video">
              <iframe
                title={`${details.title} trailer`}
                src={details.trailerUrl}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
              Trailer is not available for this series.
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-2xl font-semibold">Production Companies</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.companies.length > 0 ? (
              details.companies.map((company) => (
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

        {similarSeries.length > 0 && (
          <div className="mt-8">
            <SectionSlider
              title="Similar Series"
              movies={similarSeries}
              showSeeMore={false}
              sliderId={`similar-series-${id}`}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default SeriesDetails
