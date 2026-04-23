import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Star, X, Flame, Clock, Trash2, BookmarkCheck, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MovieCardSkeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import useDebounce from '../hooks/useDebounce';
import { fetchSearch, getImageUrl } from '../services/tmdb';
import { cn } from '@/lib/utils';

const TRENDING_TAGS = ['Avengers', 'Inception', 'Interstellar', 'Dune', 'Oppenheimer', 'Parasite'];

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const debouncedQuery = useDebounce(query, 420);

    const [results, setResults]         = useState([]);
    const [loading, setLoading]         = useState(false);
    const [isFocused, setIsFocused]     = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showHistory, setShowHistory] = useState(false);

    const inputRef = useRef(null);

    // ── Zustand ──────────────────────────────────────
    const searchHistory    = useAppStore(s => s.searchHistory);
    const addToHistory     = useAppStore(s => s.addToHistory);
    const removeFromHistory = useAppStore(s => s.removeFromHistory);
    const clearHistory     = useAppStore(s => s.clearHistory);

    // ── Fetch ─────────────────────────────────────────
    useEffect(() => {
        if (debouncedQuery) {
            setLoading(true);
            addToHistory(debouncedQuery);
            fetchSearch(debouncedQuery)
                .then(res => { setResults(res.data.results); setLoading(false); })
                .catch(() => { setResults([]); setLoading(false); });
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    const filters = [
        { id: 'all',   label: 'All' },
        { id: 'movie', label: 'Movies' },
        { id: 'tv',    label: 'Series' },
    ];

    const filteredResults = results.filter(m => {
        if (!m.poster_path) return false;
        if (activeFilter === 'all') return true;
        return m.media_type === activeFilter;
    });

    const setQuery = (q) => setSearchParams(q ? { query: q } : {});

    return (
        <div className="min-h-screen pt-28 pb-20" style={{ background: 'var(--background)' }}>

            {/* ── Search bar ── */}
            <div className="px-6 md:px-14 mb-10">
                <div className="max-w-3xl mx-auto relative">

                    {/* Input row */}
                    <div
                        className="relative flex items-center rounded-2xl transition-all duration-300"
                        style={{
                            background: isFocused ? 'var(--glass)' : 'var(--movie-accent)',
                            border: `1.5px solid ${isFocused ? 'var(--accent)' : 'var(--glass-border)'}`,
                            boxShadow: isFocused
                                ? '0 0 0 4px var(--movie-accent), 0 8px 30px var(--shadow-color)'
                                : 'none',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <Search
                            className="absolute left-5 transition-colors duration-300"
                            size={20}
                            style={{ color: isFocused ? 'var(--accent)' : 'var(--muted-foreground)' }}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onFocus={() => { setIsFocused(true); setShowHistory(true); }}
                            onBlur={() => { setIsFocused(false); setTimeout(() => setShowHistory(false), 150); }}
                            placeholder="Search movies, series, actors…"
                            className="w-full bg-transparent outline-none pl-14 pr-12 py-5 text-lg"
                            style={{ color: 'var(--foreground)', caretColor: 'var(--accent)' }}
                            autoFocus
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="absolute right-3"
                                onClick={() => setQuery('')}
                            >
                                <X size={16} />
                            </Button>
                        )}
                    </div>

                    {/* Search history dropdown */}
                    {showHistory && !query && searchHistory.length > 0 && (
                        <div
                            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                            style={{
                                background: 'var(--nav-bg)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid var(--glass-border)',
                                boxShadow: '0 16px 40px var(--shadow-color)',
                            }}
                        >
                            <div className="flex items-center justify-between px-4 pt-3 pb-2">
                                <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
                                    <Clock size={12} /> Recent searches
                                </span>
                                <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs gap-1 h-6 px-2">
                                    <Trash2 size={11} /> Clear
                                </Button>
                            </div>
                            {searchHistory.map(q => (
                                <div
                                    key={q}
                                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors duration-200 group"
                                    style={{ borderTop: '1px solid var(--glass-border)' }}
                                    onMouseDown={() => setQuery(q)}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--movie-accent)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div className="flex items-center gap-3">
                                        <Clock size={13} style={{ color: 'var(--muted-foreground)' }} />
                                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{q}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="opacity-0 group-hover:opacity-100 h-5 w-5"
                                        onMouseDown={e => { e.stopPropagation(); removeFromHistory(q); }}
                                    >
                                        <X size={11} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Results count + filter pills */}
                    <div className="flex items-center justify-between mt-4 pl-1 flex-wrap gap-3">
                        {query && !loading && (
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                {filteredResults.length > 0
                                    ? <><span className="font-bold" style={{ color: 'var(--foreground)' }}>{filteredResults.length}</span> results for "<span style={{ color: 'var(--accent)' }}>{query}</span>"</>
                                    : <>No results for "<span style={{ color: 'var(--accent)' }}>{query}</span>"</>
                                }
                            </p>
                        )}
                        {results.length > 0 && (
                            <div className="flex items-center gap-2 ml-auto">
                                {filters.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={cn("genre-pill", activeFilter === f.id && "active")}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Loading skeletons ── */}
            {loading && (
                <div className="px-6 md:px-14">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <MovieCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Results grid ── */}
            {!loading && filteredResults.length > 0 && (
                <div className="px-6 md:px-14">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {filteredResults.map((movie, i) => (
                            <SearchCard key={movie.id} movie={movie} index={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty / start state ── */}
            {!loading && !query && (
                <div className="flex flex-col items-center justify-center py-24 gap-6 text-center px-4">
                    <div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center"
                        style={{
                            background: 'var(--movie-accent)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 8px 25px var(--movie-accent)',
                        }}
                    >
                        <Search size={36} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
                            Start Your Search
                        </h2>
                        <p className="max-w-xs" style={{ color: 'var(--muted-foreground)' }}>
                            Type a movie title, series name, or actor to discover amazing content
                        </p>
                    </div>

                    {/* Trending quick tags */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                            <Flame size={13} style={{ color: 'var(--accent)' }} /> Trending:
                        </span>
                        {TRENDING_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="genre-pill"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── No results ── */}
            {!loading && query && filteredResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
                    <div className="text-6xl mb-2">🎬</div>
                    <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>Nothing found</h2>
                    <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                        Try different keywords or check the spelling
                    </p>
                    <Button variant="outline" onClick={() => setQuery('')}>
                        <X size={16} /> Clear search
                    </Button>
                </div>
            )}
        </div>
    );
}

// ── Search Card ───────────────────────────────────────
function SearchCard({ movie, index }) {
    const [hovered, setHovered] = useState(false);

    const toggleWishlist = useAppStore(s => s.toggleWishlist);
    const isInWishlist   = useAppStore(s => s.isInWishlist);
    const wishlisted     = isInWishlist(movie.id);

    return (
        <div
            className="relative overflow-hidden rounded-2xl cursor-pointer aspect-[2/3]"
            style={{
                background: 'var(--muted)',
                border: '1px solid var(--glass-border)',
                opacity: 0,
                animation: `cardReveal 0.5s ${Math.min(index * 35, 500)}ms ease forwards`,
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                transform: hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)',
                boxShadow: hovered
                    ? '0 20px 45px var(--shadow-color), 0 0 20px var(--movie-accent)'
                    : '0 4px 16px var(--shadow-color)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Poster image */}
            <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover"
                style={{
                    transition: 'transform 0.5s ease',
                    transform: hovered ? 'scale(1.08)' : 'scale(1)',
                }}
                loading="lazy"
            />

            {/* Wishlist — Shadcn Button */}
            <Button
                variant="icon"
                size="icon-sm"
                onClick={(e) => { e.stopPropagation(); toggleWishlist(movie); }}
                className={cn(
                    "absolute top-2 left-2 z-20 transition-all duration-300",
                    wishlisted
                        ? "!bg-accent !text-accent-foreground !border-transparent opacity-100 scale-100"
                        : "opacity-0 scale-75",
                    hovered && !wishlisted && "opacity-100 scale-100"
                )}
            >
                {wishlisted ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </Button>

            {/* Rating — Shadcn Badge */}
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

            {/* Info overlay */}
            <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 55%)',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.3s',
                }}
            >
                <h3 className="font-bold text-sm leading-tight truncate text-white">
                    {movie.title || movie.name}
                </h3>
                <p className="text-xs mt-0.5 text-white/60">
                    {(movie.release_date || movie.first_air_date)
                        ? new Date(movie.release_date || movie.first_air_date).getFullYear()
                        : ''}
                </p>
            </div>
        </div>
    );
}