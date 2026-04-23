import { useEffect, useState } from 'react';
import SectionSlider from '../components/discovery/SectionSlider';
import { fetchTrending, fetchMoviesByGenre } from '../services/tmdb';
import { Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieCardSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


const SERIES_GENRES = [
    { id: 18, name: 'Drama' }, { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' }, { id: 10749, name: 'Romance' },
    { id: 14, name: 'Fantasy' }, { id: 35, name: 'Comedy' },
    { id: 16, name: 'Animation' }, { id: 53, name: 'Thriller' },
    { id: 9648, name: 'Mystery' },
];

export default function Series() {
    const [trending, setTrending] = useState([]);
    const [genreData, setGenreData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeGenre, setActiveGenre] = useState(null);

    useEffect(() => {
        Promise.all([
            fetchTrending().then(r => setTrending(r.data.results)),
            ...SERIES_GENRES.slice(0, 4).map(g =>
                fetchMoviesByGenre(g.id).then(r =>
                    setGenreData(prev => ({ ...prev, [g.id]: r.data.results }))
                )
            ),
        ]).then(() => setTimeout(() => setIsLoaded(true), 200));
    }, []);

    const handleGenreTab = (id) => {
        setActiveGenre(id);
        if (id && !genreData[id]) {
            fetchMoviesByGenre(id).then(r =>
                setGenreData(prev => ({ ...prev, [id]: r.data.results }))
            );
        }
    };

    const displaySeries = activeGenre && genreData[activeGenre]
        ? genreData[activeGenre]
        : trending;

    return (
        <div
            className="min-h-screen pb-20 overflow-x-hidden"
            style={{ background: 'var(--background)' }}
        >
            {/* ── Hero header ── */}
            <div
                className="relative pt-40 pb-20 px-6 md:px-14 text-center overflow-hidden"
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'all 0.8s ease',
                }}
            >
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full"
                        style={{
                            background: 'radial-gradient(ellipse, var(--movie-accent) 0%, transparent 70%)',
                            filter: 'blur(50px)',
                            opacity: 0.6
                        }}
                    />
                </div>

                <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse"
                        style={{
                            background: 'var(--movie-accent)',
                            border: '1.5px solid var(--accent)',
                            boxShadow: '0 8px 30px var(--movie-accent)',
                        }}
                    >
                        <Tv className="text-accent" size={32} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground drop-shadow-xl">
                            TV Series
                        </h1>
                        <Badge variant="accent" className="px-4 py-1 text-xs uppercase tracking-[0.2em] font-bold">
                            Epic Storytelling
                        </Badge>
                    </div>
                </div>
                
                <p className="text-lg md:text-xl max-w-2xl mx-auto mt-8 text-muted-foreground leading-relaxed">
                    Binge-worthy dramas, side-splitting comedies, and heart-pounding thrillers. 
                    Immerse yourself in stories that stay with you.
                </p>

                <div className="flex justify-center gap-4 mt-10">
                    <Button variant="gradient" size="lg" className="rounded-full px-10 h-13">
                        Watch Trending
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-10 h-13 border-accent/20">
                        New Releases
                    </Button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-12 px-6 md:px-14">
                {!isLoaded ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <MovieCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    [
                        { title: 'Trending Series', movies: displaySeries, showGenreTabs: true, delay: 0 },
                        ...SERIES_GENRES.slice(0, 4).map((g, i) => ({
                            title: `${g.name} Series`, movies: genreData[g.id] || [], delay: 150 + i * 100,
                        })),
                    ].map(({ title, movies, showGenreTabs, delay }, i) => (
                        movies.length > 0 && (
                            <div
                                key={title}
                                style={{
                                    opacity: isLoaded ? 1 : 0,
                                    transform: isLoaded ? 'translateY(0)' : 'translateY(32px)',
                                    transition: `all 0.8s ease ${delay}ms`,
                                }}
                            >
                                <SectionSlider
                                    title={title}
                                    movies={movies}
                                    showGenreTabs={showGenreTabs}
                                    allGenreMovies={genreData}
                                    onGenreChange={showGenreTabs ? handleGenreTab : undefined}
                                    sliderId={`series-${i}`}
                                />
                            </div>
                        )
                    ))
                )}
            </div>
        </div>
    );
}