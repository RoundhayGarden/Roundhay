import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCardSkeleton } from '@/components/ui/skeleton';
import VoteProgress from '../VoteProgress';
import { getImageUrl } from '../../services/tmdb';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/navigation';

const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 35: 'Comedy', 18: 'Drama',
    14: 'Fantasy', 27: 'Horror', 10749: 'Romance', 878: 'Sci-Fi',
    53: 'Thriller', 9648: 'Mystery', 16: 'Animation',
};

export default function SectionSlider({
    title,
    movies = [],
    showSeeMore = true,
    seeMorePath,
    showGenreTabs = false,
    allGenreMovies = {},
    onGenreChange = null,
    sliderId = 'slider',
    loading = false,
}) {
    const [activeGenre, setActiveGenre] = useState(null);
    const [genreTabPage, setGenreTabPage] = useState(0);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const TABS_PER_PAGE = 7;

    const genreList = Object.entries(GENRE_MAP);
    const totalPages = Math.ceil(genreList.length / TABS_PER_PAGE);
    const visibleGenres = genreList.slice(
        genreTabPage * TABS_PER_PAGE,
        genreTabPage * TABS_PER_PAGE + TABS_PER_PAGE
    );

    const displayMovies =
        showGenreTabs && activeGenre && allGenreMovies[activeGenre]
            ? allGenreMovies[activeGenre]
            : movies;

    const handleGenreClick = (genreId) => {
        const newGenre = activeGenre === genreId ? null : genreId;
        setActiveGenre(newGenre);
        if (onGenreChange) onGenreChange(newGenre);
    };

    const normalizedTitle = title?.trim().toLowerCase();
    const resolvedSeeMorePath = seeMorePath
        ? seeMorePath
        : normalizedTitle === 'movies'
          ? '/movies/popular'
          : normalizedTitle === 'trending'
            ? '/movies/trending'
            : normalizedTitle === 'series'
              ? '/series/airing_today'
              : `/search?query=${encodeURIComponent(title ?? '')}`;

    return (
        <section
            className="w-full max-w-full overflow-x-hidden py-8"
            style={{ fontFamily: "'Outfit', 'Inter Variable', sans-serif" }}
        >
            <div className="w-full px-6 md:px-12">

            {/* ── Section header ── */}
            {title && (
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="section-title">{title}</h3>
                    {showSeeMore && (
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 group">
                            <Link to={resolvedSeeMorePath}>
                                See More
                                <ArrowRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </Button>
                    )}
                </div>
            )}

            {/* ── Genre pills ── */}
            {showGenreTabs && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {/* All pill */}
                    <button
                        onClick={() => handleGenreClick(null)}
                        className={cn(
                            "genre-pill",
                            activeGenre === null && "active"
                        )}
                    >
                        All
                    </button>

                    {visibleGenres.map(([id, name]) => {
                        const gid = parseInt(id);
                        return (
                            <button
                                key={id}
                                onClick={() => handleGenreClick(gid)}
                                className={cn("genre-pill", activeGenre === gid && "active")}
                            >
                                {name}
                            </button>
                        );
                    })}

                    {/* Pagination */}
                    <div className="flex items-center gap-1 ml-auto">
                        <Button
                            variant="icon"
                            size="icon-sm"
                            onClick={() => setGenreTabPage(p => Math.max(0, p - 1))}
                            disabled={genreTabPage === 0}
                        >
                            <ChevronLeft size={14} />
                        </Button>
                        <Button
                            variant="icon"
                            size="icon-sm"
                            onClick={() => setGenreTabPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={genreTabPage >= totalPages - 1}
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Loading skeletons ── */}
            {loading && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* ── Slider ── */}
            {!loading && (
                <div className="relative overflow-hidden">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        slidesPerView={2.2}
                        spaceBetween={14}
                        breakpoints={{
                            480:  { slidesPerView: 2.8, spaceBetween: 14 },
                            640:  { slidesPerView: 3.3, spaceBetween: 16 },
                            900:  { slidesPerView: 4.3, spaceBetween: 18 },
                            1024: { slidesPerView: 5.3, spaceBetween: 18 },
                            1280: { slidesPerView: 6.3, spaceBetween: 20 },
                            1600: { slidesPerView: 7.3, spaceBetween: 20 },
                        }}
                        className="w-full overflow-hidden"
                    >
                        {displayMovies.map((movie, idx) => (
                            <SwiperSlide key={`${movie.id}-${idx}`} className="cursor-pointer">
                                <MovieCard movie={movie} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom nav buttons */}
                    <button
                        ref={prevRef}
                        type="button"
                        className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                        style={{
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--foreground)',
                            backdropFilter: 'blur(12px)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--accent)';
                            e.currentTarget.style.color = 'var(--accent-foreground)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--glass)';
                            e.currentTarget.style.color = 'var(--foreground)';
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        ref={nextRef}
                        type="button"
                        className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        style={{
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--foreground)',
                            backdropFilter: 'blur(12px)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--accent)';
                            e.currentTarget.style.color = 'var(--accent-foreground)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--glass)';
                            e.currentTarget.style.color = 'var(--foreground)';
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
            </div>
        </section>
    );
}

// ── Movie Card ─────────────────────────────────────────
function MovieCard({ movie }) {
    const navigate = useNavigate();
    const toggleWishlist = useAppStore((s) => s.toggleWishlist);
    const title = movie.title || movie.name || 'Untitled';
    const releaseDate = movie.release_date || movie.first_air_date || 'N/A';
    const posterPath = movie.posterPath || movie.poster_path;
    const isMovie = movie.media_type ? movie.media_type === 'movie' : !!movie.title;

    return (
        <article
            className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card"
            onClick={() => {
                if (!movie?.id || !isMovie) return;
                navigate(`/movie/${movie.id}`, {
                    state: {
                        movie: {
                            id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                            backdrop_path: movie.backdrop_path,
                            vote_average: movie.vote_average,
                            overview: movie.overview,
                            release_date: movie.release_date,
                        },
                    },
                });
            }}
            onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && movie?.id && isMovie) {
                    event.preventDefault();
                    navigate(`/movie/${movie.id}`, {
                        state: {
                            movie: {
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                                backdrop_path: movie.backdrop_path,
                                vote_average: movie.vote_average,
                                overview: movie.overview,
                                release_date: movie.release_date,
                            },
                        },
                    });
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className="relative aspect-2/3 w-full bg-muted">
                {posterPath ? (
                    <img
                        src={getImageUrl(posterPath, 'w500')}
                        alt={title}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(movie);
                    }}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow transition duration-300 group-hover:opacity-100"
                >
                    <Heart size={16} />
                </button>

                <div className="pointer-events-none absolute bottom-2 left-2 opacity-0 transition duration-300 group-hover:opacity-100">
                    <VoteProgress voteAverage={movie.vote_average} />
                </div>
            </div>
            <div className="p-3">
                <h2 className="font-medium text-card-foreground">{title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{releaseDate}</p>
            </div>
        </article>
    );
}