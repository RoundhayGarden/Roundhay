import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    const seeMorePath =
        normalizedTitle === 'movies'
            ? '/movies/popular'
            : normalizedTitle === 'trending'
              ? '/movies/trending'
              : `/search?query=${encodeURIComponent(title ?? '')}`;

    return (
        <div className="py-8" style={{ fontFamily: "'Outfit', 'Inter Variable', sans-serif" }}>

            {/* ── Section header ── */}
            {title && (
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="section-title">{title}</h3>
                    {showSeeMore && (
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 group">
                            <Link to={seeMorePath}>
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
                <div className="relative">
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
                        className="overflow-visible!"
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
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group"
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
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
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
    );
}

// ── Movie Card ─────────────────────────────────────────
function MovieCard({ movie }) {
    const toggleWishlist = useAppStore((s) => s.toggleWishlist);
    const title = movie.title || movie.name || 'Untitled';
    const releaseDate = movie.release_date || movie.first_air_date || 'N/A';
    const posterPath = movie.posterPath || movie.poster_path;

    return (
        <article className="group overflow-hidden rounded-lg border border-border bg-card">
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