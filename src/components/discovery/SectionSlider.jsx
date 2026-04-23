import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieCardSkeleton } from '@/components/ui/skeleton';
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

    return (
        <div className="py-8" style={{ fontFamily: "'Outfit', 'Inter Variable', sans-serif" }}>

            {/* ── Section header ── */}
            {title && (
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="section-title">{title}</h3>
                    {showSeeMore && (
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 group">
                            <Link to={`/search?query=${encodeURIComponent(title)}`}>
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
                        className="!overflow-visible"
                    >
                        {displayMovies.map((movie, idx) => (
                            <SwiperSlide key={`${movie.id}-${idx}`} className="cursor-pointer">
                                <MovieCard movie={movie} index={idx} />
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
function MovieCard({ movie, index }) {
    const [hovered, setHovered] = useState(false);

    // Zustand
    const toggleWishlist = useAppStore(s => s.toggleWishlist);
    const isInWishlist   = useAppStore(s => s.isInWishlist);
    const wishlisted     = isInWishlist(movie.id);

    return (
        <div
            className="relative overflow-hidden rounded-2xl aspect-[2/3]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'var(--muted)',
                border: '1px solid var(--glass-border)',
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
                transform: hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)',
                boxShadow: hovered
                    ? '0 24px 50px var(--shadow-color), 0 0 20px var(--movie-accent)'
                    : '0 4px 16px var(--shadow-color)',
                animation: `cardReveal 0.5s ${Math.min(index * 40, 500)}ms ease both`,
            }}
        >
            {/* Wishlist toggle – Shadcn Button */}
            <Button
                variant="icon"
                size="icon-sm"
                className={cn(
                    "absolute top-2 left-2 z-20 transition-all duration-300",
                    wishlisted
                        ? "!bg-accent !text-accent-foreground !border-transparent opacity-100 scale-100"
                        : "opacity-0 scale-75",
                    hovered && !wishlisted && "opacity-100 scale-100"
                )}
                onClick={(e) => { e.stopPropagation(); toggleWishlist(movie); }}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {wishlisted
                    ? <BookmarkCheck size={15} />
                    : <Bookmark size={15} />
                }
            </Button>

            {/* Rating badge */}
            {movie.vote_average > 0 && (
                <Badge
                    variant="outline"
                    className={cn(
                        "absolute top-2 right-2 z-20 transition-all duration-300",
                        "!bg-black/70 !border-white/10 !text-white backdrop-blur-sm",
                        hovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <Star size={9} fill="#F5C518" color="#F5C518" />
                    {movie.vote_average.toFixed(1)}
                </Badge>
            )}

            {/* Poster */}
            {movie.poster_path ? (
                <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                    style={{
                        transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                    loading="lazy"
                />
            ) : (
                <div
                    className="w-full h-full flex items-center justify-center p-4 text-center"
                    style={{ background: 'var(--primary)', color: 'var(--accent)' }}
                >
                    <span className="text-xs font-semibold">{movie.title || movie.name}</span>
                </div>
            )}

            {/* Bottom overlay */}
            <div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'all 0.35s ease',
                }}
            >
                <p className="font-semibold text-sm truncate text-white">
                    {movie.title || movie.name}
                </p>
                <p className="text-xs mt-0.5 text-white/60">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                </p>
            </div>
        </div>
    );
}