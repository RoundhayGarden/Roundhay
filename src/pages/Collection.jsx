import { useEffect, useState } from 'react';
import SectionSlider from '../components/discovery/SectionSlider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getImageUrl, fetchTrending, fetchMoviesByGenre } from '../services/tmdb';
import { useAppStore } from '@/store/useAppStore';
import { Heart, Bookmark, Clock, Trophy, BookmarkCheck, Trash2, Star, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Collection() {
    const [sections, setSections] = useState({ recent: [], topRated: [] });
    const [isLoaded, setIsLoaded] = useState(false);

    // ── Zustand wishlist ──────────────────────────────
    const wishlist         = useAppStore(s => s.wishlist);
    const removeFromWishlist = useAppStore(s => s.removeFromWishlist);
    const toggleWishlist   = useAppStore(s => s.toggleWishlist);

    useEffect(() => {
        Promise.all([
            fetchTrending(),
            fetchMoviesByGenre(18),
        ]).then(([trending, drama]) => {
            setSections({
                recent:   trending.data.results.slice(0, 10),
                topRated: drama.data.results.slice(0, 10),
            });
            setTimeout(() => setIsLoaded(true), 200);
        });
    }, []);

    const stats = [
        { icon: Heart,    label: 'Wishlist',    count: wishlist.length,         color: '#ef4444' },
        { icon: Clock,    label: 'Trending',    count: sections.recent.length,  color: '#34d399' },
        { icon: Trophy,   label: 'Top Rated',   count: sections.topRated.length, color: '#fbbf24' },
        { icon: Film,     label: 'Discovered',  count: wishlist.length * 3 || 0, color: '#60a5fa' },
    ];

    return (
        <div className="min-h-screen pb-20 overflow-x-hidden" style={{ background: 'var(--background)' }}>

            {/* ── Hero ── */}
            <div
                className="relative pt-36 pb-10 px-6 md:px-14 text-center overflow-hidden"
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'all 0.8s ease',
                }}
            >
                {/* BG glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full"
                        style={{ background: 'radial-gradient(ellipse, var(--movie-accent) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                </div>

                <div className="flex items-center justify-center gap-4 mb-4 relative z-10">
                    <Heart className="animate-pulse" size={40} style={{ color: 'var(--accent)' }} />
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
                        My Collection
                    </h1>
                </div>
                <p className="text-lg mb-10 relative z-10" style={{ color: 'var(--muted-foreground)' }}>
                    Your personal movie sanctuary
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto relative z-10">
                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            className="rounded-2xl p-5 flex flex-col items-center gap-2 cursor-default"
                            style={{
                                background: 'var(--glass)',
                                border: '1px solid var(--glass-border)',
                                backdropFilter: 'blur(12px)',
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(10px)',
                                transition: `all 0.6s ease ${i * 80}ms`,
                            }}
                        >
                            <s.icon size={26} color={s.color} />
                            <span className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>{s.count}</span>
                            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 px-6 md:px-14">

                {/* ── Wishlist section (real Zustand data) ── */}
                <div
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transform: isLoaded ? 'translateY(0)' : 'translateY(32px)',
                        transition: 'all 0.8s ease 0ms',
                    }}
                >
                    <div className="flex items-center justify-between mb-3 py-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: '#ef444422', border: '1px solid #ef444444' }}>
                                <Heart size={16} color="#ef4444" />
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>My Wishlist</h2>
                            {wishlist.length > 0 && (
                                <Badge variant="default">{wishlist.length}</Badge>
                            )}
                        </div>
                        {wishlist.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive gap-1.5"
                                onClick={() => wishlist.forEach(m => removeFromWishlist(m.id))}
                            >
                                <Trash2 size={13} /> Clear all
                            </Button>
                        )}
                    </div>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {wishlist.map((movie, i) => (
                                <WishlistCard
                                    key={movie.id}
                                    movie={movie}
                                    index={i}
                                    onRemove={() => removeFromWishlist(movie.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="rounded-2xl p-12 text-center"
                            style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
                        >
                            <Bookmark size={40} className="mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                            <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Your wishlist is empty</p>
                            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                                Browse movies and click the bookmark icon to save them here
                            </p>
                            <Button variant="gradient" asChild>
                                <a href="/movies">Browse Movies</a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* ── Trending now ── */}
                {sections.recent.length > 0 && (
                    <div
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transform: isLoaded ? 'translateY(0)' : 'translateY(32px)',
                            transition: 'all 0.8s ease 150ms',
                        }}
                    >
                        <SectionSlider
                            title="Trending Now"
                            movies={sections.recent}
                            showSeeMore
                            sliderId="coll-trending"
                        />
                    </div>
                )}

                {/* ── Top Rated ── */}
                {sections.topRated.length > 0 && (
                    <div
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            transform: isLoaded ? 'translateY(0)' : 'translateY(32px)',
                            transition: 'all 0.8s ease 300ms',
                        }}
                    >
                        <SectionSlider
                            title="Top Rated"
                            movies={sections.topRated}
                            showSeeMore
                            sliderId="coll-toprated"
                        />
                    </div>
                )}
            </div>

            {/* ── CTA Banner ── */}
            <div
                className="mx-6 md:mx-14 mt-16 rounded-3xl p-12 text-center relative overflow-hidden"
                style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(20px)',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 1s ease 0.8s',
                }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full"
                        style={{ background: 'radial-gradient(circle, var(--movie-accent) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                </div>
                <h2 className="text-3xl font-black mb-3 relative z-10" style={{ color: 'var(--foreground)' }}>
                    Build Your Perfect Collection
                </h2>
                <p className="mb-8 relative z-10 max-w-lg mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                    Discover new movies, create custom lists, and never lose track of what you want to watch
                </p>
                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                    <Button variant="gradient" size="lg">Browse Movies</Button>
                    <Button variant="outline" size="lg">View Stats</Button>
                </div>
            </div>
        </div>
    );
}

// ── Wishlist Card ─────────────────────────────────────
function WishlistCard({ movie, index, onRemove }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative overflow-hidden rounded-2xl aspect-[2/3] cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'var(--muted)',
                border: '1px solid var(--glass-border)',
                animation: `cardReveal 0.5s ${Math.min(index * 40, 500)}ms ease both`,
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
                transform: hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)',
                boxShadow: hovered
                    ? '0 20px 45px var(--shadow-color), 0 0 18px var(--movie-accent)'
                    : '0 4px 16px var(--shadow-color)',
            }}
        >
            {movie.poster_path ? (
                <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    style={{ transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                    <span className="text-xs font-semibold text-center px-2" style={{ color: 'var(--accent)' }}>{movie.title}</span>
                </div>
            )}

            {/* Remove button */}
            <Button
                variant="icon"
                size="icon-sm"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className={cn(
                    "absolute top-2 left-2 z-20 transition-all duration-300",
                    "!bg-accent !text-accent-foreground !border-transparent",
                    hovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                )}
            >
                <BookmarkCheck size={15} />
            </Button>

            {/* Rating */}
            {movie.vote_average > 0 && (
                <Badge
                    variant="outline"
                    className={cn(
                        "absolute top-2 right-2 z-20 transition-all duration-300",
                        "!bg-black/75 !border-white/10 !text-white backdrop-blur-sm",
                        hovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <Star size={9} fill="#F5C518" color="#F5C518" />
                    {movie.vote_average?.toFixed(1)}
                </Badge>
            )}

            {/* Title overlay */}
            <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
                    opacity: hovered ? 1 : 0,
                    transition: 'all 0.3s ease',
                }}
            >
                <p className="font-semibold text-xs truncate text-white">{movie.title}</p>
                <p className="text-[10px] mt-0.5 text-white/60">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                </p>
            </div>
        </div>
    );
}