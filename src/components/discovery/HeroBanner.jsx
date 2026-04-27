import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Info,
  Star,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import {
  fetchNowPlaying,
  getImageUrl,
  getMovieVideos,
} from "../../services/tmdb";
import { getTvVideos } from "../../services/seriesApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const intervalRef = useRef(null);

  // ── Zustand (subscribe to membership boolean — `isInWishlist` fn ref never changes, so no re-renders)
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const activeMovieId = movies[activeIndex]?.id ?? null;
  const wishlisted = useAppStore(
    (s) =>
      activeMovieId != null &&
      s.wishlist.some((m) => m.id === activeMovieId),
  );

  useEffect(() => {
    fetchNowPlaying()
      .then((res) => setMovies(res.data.results.slice(0, 8)))
      .catch((err) => console.error("Hero fetch error:", err));
  }, []);

  const goTo = (newIndex, dir) => {
    if (animating || !movies.length) return;
    setAnimating(true);
    setDirection(dir);
    setPrevIndex(activeIndex);
    setActiveIndex(newIndex);
    setTimeout(() => {
      setAnimating(false);
      setPrevIndex(null);
    }, 900);
  };

  const goNext = () => goTo((activeIndex + 1) % movies.length, "next");
  const goPrev = () =>
    goTo((activeIndex - 1 + movies.length) % movies.length, "prev");

  useEffect(() => {
    if (!movies.length) return;
    intervalRef.current = setInterval(goNext, 6500);
    return () => clearInterval(intervalRef.current);
  }, [movies.length, activeIndex, animating]);

  // ── Loading skeleton ──────────────────────────────
  if (!movies.length) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-bounce"
              style={{
                background: "var(--accent)",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const current = movies[activeIndex];
  const prev = prevIndex !== null ? movies[prevIndex] : null;

  const getPreferredVideo = (videos = []) => {
    const youtubeVideos = videos.filter(
      (video) => video.site === "YouTube" && video.key,
    );
    if (!youtubeVideos.length) return null;

    const trailer = youtubeVideos.find(
      (video) => video.type === "Trailer" && video.official,
    );
    if (trailer) return trailer;

    const anyTrailer = youtubeVideos.find((video) => video.type === "Trailer");
    if (anyTrailer) return anyTrailer;

    const teaser = youtubeVideos.find((video) => video.type === "Teaser");
    if (teaser) return teaser;

    return youtubeVideos[0];
  };

  const handleWatchNow = async () => {
    if (!current?.id) return;

    setIsTrailerOpen(true);
    setIsTrailerLoading(true);
    setTrailerError("");
    setActiveVideo(null);

    try {
      const mediaType =
        current.media_type === "tv" || current.name ? "tv" : "movie";
      const data =
        mediaType === "tv"
          ? await getTvVideos(current.id)
          : await getMovieVideos(current.id);

      const selectedVideo = getPreferredVideo(data?.results || []);
      if (!selectedVideo) {
        setTrailerError("No playable trailer was found for this title.");
        return;
      }

      setActiveVideo(selectedVideo);
    } catch {
      setTrailerError("Failed to load trailer. Please try again.");
    } finally {
      setIsTrailerLoading(false);
    }
  };

  const handleMoreInfo = () => {
    if (!current?.id) return;
    const isMovie = current.media_type
      ? current.media_type === "movie"
      : !!current.title;
    if (isMovie) {
      navigate(`/movie/${current.id}`, {
        state: {
          movie: {
            id: current.id,
            title: current.title,
            poster_path: current.poster_path,
            backdrop_path: current.backdrop_path,
            vote_average: current.vote_average,
            overview: current.overview,
            release_date: current.release_date,
          },
        },
      });
      return;
    }

    navigate(`/series/details/${current.id}`, {
      state: {
        series: {
          id: current.id,
          name: current.name,
          poster_path: current.poster_path,
          backdrop_path: current.backdrop_path,
          vote_average: current.vote_average,
          overview: current.overview,
          first_air_date: current.first_air_date,
        },
      },
    });
  };

  return (
    <div
      className="relative h-screen w-screen max-w-none overflow-hidden"
      style={{
        background: "var(--background)",
        fontFamily: "'Outfit','Inter Variable',sans-serif",
      }}
    >
      {/* ── Background prev (fade-out) ── */}
      {prev && (
        <div
          className="absolute inset-0 z-0"
          style={{ animation: "bgFadeOut 0.9s ease forwards" }}
        >
          <img
            src={getImageUrl(prev.backdrop_path, "original")}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.3) saturate(0.7)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--hero-overlay-start), rgba(44,51,51,.7) 55%, transparent)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--background) 0%, transparent 40%)",
            }}
          />
        </div>
      )}

      {/* ── Background current (fade-in) ── */}
      <div
        key={`bg-${activeIndex}`}
        className="absolute inset-0 z-1"
        style={{ animation: "bgFadeIn 1.2s ease forwards" }}
      >
        <img
          src={getImageUrl(current.backdrop_path, "original")}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.28) saturate(0.7)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--hero-overlay-start) 0%, color-mix(in srgb,var(--hero-overlay-start) 75%,transparent) 55%, transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #2c3333 0%, transparent 95%)",
          }}
        />
        <div
          className="absolute inset-0 md:hidden bg-black/60 z-[5]"
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
            zIndex: 6
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb,var(--background) 50%,transparent) 0%, transparent 20%)",
          }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 z-2 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: "var(--accent)",
              left: `${8 + i * 9}%`,
              top: `${15 + (i % 4) * 18}%`,
              opacity: 0.12 + (i % 4) * 0.04,
              animation: `floatParticle ${4 + i * 0.6}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* ── Poster (right/center on mobile) ── */}
      <div className="absolute inset-0 md:inset-auto md:right-0 md:top-0 h-full w-full md:w-1/2 z-10 flex items-center justify-center md:justify-end pointer-events-none">
        {/* Glow */}
        <div
          key={`glow-${activeIndex}`}
          className="absolute opacity-60 md:opacity-100"
          style={{
            right: "auto",
            width: "300px",
            height: "450px",
            background:
              "radial-gradient(ellipse, var(--movie-accent) 0%, transparent 70%)",
            animation: "glowPulseBig 3s ease-in-out infinite",
            filter: "blur(30px)",
            transform: "scale(1.6)",
          }}
        />

        {/* Previous poster exits */}
        {prev && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              animation:
                direction === "next"
                  ? "posterExitLeft 0.7s cubic-bezier(0.4,0,0.2,1) forwards"
                  : "posterExitRight 0.7s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          >
            <div className="w-[260px] sm:w-[300px] md:w-[340px] h-[390px] sm:h-[450px] md:h-[510px] rounded-3xl overflow-hidden shadow-2xl opacity-40">
              <img
                src={getImageUrl(prev.poster_path, "w500")}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Current poster enters */}
        <div
          key={`poster-${activeIndex}`}
          className="absolute md:right-32 flex items-center justify-center"
          style={{
            animation:
              direction === "next"
                ? "posterEnterRight 0.9s cubic-bezier(0.16,1,0.3,1) forwards"
                : "posterEnterLeft 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          <div className="relative">
            {/* Stacked cards behind */}
            <div
              className="absolute -left-5 -top-3 w-[260px] sm:w-[300px] md:w-[340px] h-[390px] sm:h-[450px] md:h-[510px] rounded-3xl overflow-hidden opacity-25 rotate-[-5deg] hidden sm:block"
              style={{ filter: "blur(2px)" }}
            >
              {movies[(activeIndex + 1) % movies.length]?.poster_path && (
                <img
                  src={getImageUrl(
                    movies[(activeIndex + 1) % movies.length].poster_path,
                    "w500",
                  )}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div
              className="absolute -right-4 -top-2 w-[260px] sm:w-[300px] md:w-[340px] h-[390px] sm:h-[450px] md:h-[510px] rounded-3xl overflow-hidden opacity-15 rotate-[4deg] hidden sm:block"
              style={{ filter: "blur(3px)" }}
            >
              {movies[(activeIndex + 2) % movies.length]?.poster_path && (
                <img
                  src={getImageUrl(
                    movies[(activeIndex + 2) % movies.length].poster_path,
                    "w500",
                  )}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Main poster */}
            <div
              className="relative w-[260px] sm:w-[300px] md:w-[340px] h-[390px] sm:h-[450px] md:h-[510px] rounded-3xl overflow-hidden mt-[-100px] md:mt-0"
              style={{
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.6), 0 0 50px var(--movie-accent)",
                border: "2px solid var(--glass-border)",
              }}
            >
              <img
                src={getImageUrl(current.poster_path, "w500")}
                alt={current.title}
                className="w-full h-full object-cover hero-poster-img"
                style={{
                  animation: "subtleZoom 8s ease-in-out infinite alternate",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Left content (Centered on mobile) ── */}
      <div className="relative z-20 h-full flex flex-col justify-end md:justify-center px-6 pb-60 md:pb-0 md:pl-20 md:pr-4 w-full md:max-w-[56%] items-center md:items-start text-center md:text-left">
        {/* Now Playing badge */}
        <div
          key={`badge-${activeIndex}`}
          style={{ animation: "slideUpFade 0.7s 0.05s ease both" }}
        >
          <Badge
            variant="accent"
            className="mb-4 md:mb-5 uppercase tracking-widest text-[9px] md:text-[10px] px-3 md:px-4 py-1 md:py-1.5 shadow-lg bg-black/40 backdrop-blur-md border-white/10 text-white"
          >
            <span
              className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full animate-pulse mr-2"
              style={{ background: "var(--accent)" }}
            />
            Now Playing
          </Badge>
        </div>

        {/* Title */}
        <div
          key={`title-${activeIndex}`}
          style={{ animation: "slideUpFade 0.8s 0.15s ease both" }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] md:leading-[1.0] mb-3 md:mb-4 tracking-tight"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            {current.title}
          </h1>
        </div>

        {/* Meta */}
        <div
          key={`meta-${activeIndex}`}
          className="flex items-center justify-center md:justify-start gap-3 md:gap-4 mb-4"
          style={{ animation: "slideUpFade 0.8s 0.25s ease both" }}
        >
          <div className="flex items-center gap-1.5">
            <Star size={13} fill="#F5C518" color="#F5C518" />
            <span
              className="font-bold text-sm"
              style={{
                color: "#ffffff",
                textShadow: "0 1px 4px rgba(0,0,0,1)"
              }}
            >
              {current.vote_average?.toFixed(1)}
            </span>
          </div>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--muted-foreground)" }}
          />
          <span
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {current.release_date
              ? new Date(current.release_date).getFullYear()
              : ""}
          </span>
          <Badge variant="outline" className="text-[10px]">
            HD
          </Badge>
        </div>

        {/* Overview */}
        <div
          key={`desc-${activeIndex}`}
          style={{ animation: "slideUpFade 0.8s 0.35s ease both" }}
        >
          <p
            className="text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 md:mb-8 max-w-[500px]"
            style={{
              color: "#ffffff",
              opacity: 0.95,
              fontWeight: 500,
              textShadow: "0 1px 8px rgba(0,0,0,1)"
            }}
          >
            {current.overview}
          </p>
        </div>

        {/* CTA Buttons — Shadcn */}
        <div
          key={`btns-${activeIndex}`}
          className="flex items-center justify-center md:justify-start gap-2 md:gap-3"
          style={{ animation: "slideUpFade 0.8s 0.45s ease both" }}
        >
          <Button
            variant="gradient"
            size="lg"
            className="group px-6 h-11 md:h-12 text-sm md:text-base"
            onClick={handleWatchNow}
          >
            <Play
              size={16}
              md:size={17}
              fill="currentColor"
              className="group-hover:scale-110 transition-transform"
            />
            Watch Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-6 h-11 md:h-12 text-sm md:text-base"
            onClick={handleMoreInfo}
          >
            <Info size={16} md:size={17} />
            More Info
          </Button>
          <Button
            variant="icon"
            size="icon"
            onClick={() => toggleWishlist(current)}
            className={cn(
              wishlisted &&
              "!bg-accent !text-accent-foreground !border-transparent animate-glow-pulse",
            )}
            title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            {wishlisted ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </Button>
        </div>

        {/* Dot nav */}
        <div
          className="hidden md:flex items-center gap-2 mt-10"
          style={{ animation: "slideUpFade 0.8s 0.55s ease both" }}
        >
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIndex ? "next" : "prev")}
              className="transition-all duration-500 rounded-full"
              style={{
                width: i === activeIndex ? "28px" : "6px",
                height: "6px",
                background:
                  i === activeIndex ? "var(--accent)" : "var(--glass-border)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Arrow nav — Shadcn Button ── */}
      <Button
        variant="icon"
        size="icon"
        onClick={goPrev}
        className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-30 scale-75 md:scale-100 opacity-50 hover:opacity-100 hidden md:flex"
      >
        <ChevronLeft size={20} />
      </Button>
      <Button
        variant="icon"
        size="icon"
        onClick={goNext}
        className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-30 scale-75 md:scale-100 opacity-50 hover:opacity-100 hidden md:flex"
      >
        <ChevronRight size={20} />
      </Button>

      {/* ── Thumbnail strip (Bottom center on mobile) ── */}
      <div className="absolute bottom-6 left-0 right-0 md:left-auto md:right-8 z-30 flex items-center justify-center md:justify-end gap-2 md:gap-3 px-4">
        {movies.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => goTo(i, i > activeIndex ? "next" : "prev")}
            className="relative overflow-hidden group/thumb transition-all duration-400"
            style={{
              width: i === activeIndex ? "var(--thumb-active-w)" : "var(--thumb-w)",
              height: i === activeIndex ? "var(--thumb-active-h)" : "var(--thumb-h)",
              borderRadius: "12px",
              opacity: i === activeIndex ? 1 : 0.4,
              border:
                i === activeIndex
                  ? "2px solid var(--accent)"
                  : "1px solid var(--glass-border)",
              boxShadow:
                i === activeIndex ? "0 0 20px var(--movie-accent)" : "none",
            }}
          >
            <img
              src={getImageUrl(m.poster_path, "w200")}
              alt={m.title}
              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {/* ── Keyframes ── */}
      <Dialog
        open={isTrailerOpen}
        onOpenChange={(open) => {
          setIsTrailerOpen(open);
          if (!open) {
            setActiveVideo(null);
            setTrailerError("");
          }
        }}
      >
        <DialogContent className="overflow-hidden">
          <DialogHeader>
            {/* <DialogTitle>{current.title || current.name}</DialogTitle> */}
            {/* <DialogDescription>
              {activeVideo?.name || "Official trailer and videos"}
            </DialogDescription> */}
          </DialogHeader>

          <div className="aspect-video w-full bg-black">
            {isTrailerLoading && (
              <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Loading trailer...
              </div>
            )}

            {!isTrailerLoading && trailerError && (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-destructive">
                {trailerError}
              </div>
            )}

            {!isTrailerLoading && !trailerError && activeVideo && (
              <iframe
                title={activeVideo.name}
                src={`https://www.youtube.com/embed/${activeVideo.key}?autoplay=1&rel=0`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
                :root {
                  --thumb-w: 48px;
                  --thumb-h: 72px;
                  --thumb-active-w: 64px;
                  --thumb-active-h: 96px;
                  --hero-overlay-mobile: rgba(0,0,0,0.4);
                }
                .light {
                  --hero-overlay-mobile: rgba(255,255,255,0.2);
                }

                @media (max-width: 768px) {
                  :root {
                    --thumb-w: 38px;
                    --thumb-h: 56px;
                    --thumb-active-w: 52px;
                    --thumb-active-h: 78px;
                  }
                  .hero-poster-img {
                    opacity: 0.4 !important;
                    filter: brightness(0.6) contrast(1.1);
                  }
                }

                .light .hero-poster-img {
                    opacity: 0.4 !important;
                    filter: brightness(0.6) contrast(1.1);
                }

                @keyframes bgFadeIn  { from{opacity:0} to{opacity:1} }
                @keyframes bgFadeOut { from{opacity:1} to{opacity:0} }
                @keyframes posterEnterRight { from{opacity:0;transform:translateX(80px) scale(.92) rotateY(-8deg)} to{opacity:1;transform:translateX(0) scale(1) rotateY(0)} }
                @keyframes posterEnterLeft  { from{opacity:0;transform:translateX(-80px) scale(.92) rotateY(8deg)}  to{opacity:1;transform:translateX(0) scale(1) rotateY(0)} }
                @keyframes posterExitLeft   { from{opacity:1;transform:translateX(0) scale(1)}   to{opacity:0;transform:translateX(-60px) scale(.9)} }
                @keyframes posterExitRight  { from{opacity:1;transform:translateX(0) scale(1)}   to{opacity:0;transform:translateX(60px) scale(.9)} }
                @keyframes slideUpFade      { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                @keyframes floatParticle    { from{transform:translateY(0) translateX(0)} to{transform:translateY(-20px) translateX(10px)} }
                @keyframes glowPulseBig     { 0%,100%{opacity:.5;transform:scale(1.4)} 50%{opacity:.9;transform:scale(1.6)} }
                @keyframes subtleZoom       { from{transform:scale(1)} to{transform:scale(1.05)} }
            `}</style>
    </div>
  );
}
