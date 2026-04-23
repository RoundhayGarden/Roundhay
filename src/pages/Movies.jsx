import { useEffect, useState } from 'react';
import SectionSlider from '../components/discovery/SectionSlider';
import { fetchMoviesByGenre, fetchNowPlaying, fetchPopularMovies } from '../services/tmdb';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieCardSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const GENRES = [
    { id: 28, name: 'Action' }, { id: 18, name: 'Drama' },
    { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' },
    { id: 27, name: 'Horror' }, { id: 878, name: 'Sci-Fi' },
    { id: 10749, name: 'Romance' }, { id: 53, name: 'Thriller' },
];

export default function Movies() {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popular, setPopular] = useState([]);
    const [genreData, setGenreData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeGenre, setActiveGenre] = useState(null);

    useEffect(() => {
        Promise.all([
            fetchNowPlaying().then(r => setNowPlaying(r.data.results)),
            fetchPopularMovies().then(r => setPopular(r.data.results)),
            ...GENRES.slice(0, 4).map(g =>
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

    const displayMovies = activeGenre && genreData[activeGenre]
        ? genreData[activeGenre]
        : nowPlaying;

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
                        <Film className="text-accent" size={32} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground drop-shadow-xl">
                            Movies
                        </h1>
                        <Badge variant="accent" className="px-4 py-1 text-xs uppercase tracking-[0.2em] font-bold">
                            Premium Cinema Experience
                        </Badge>
                    </div>
                </div>
                
                <p className="text-lg md:text-xl max-w-2xl mx-auto mt-8 text-muted-foreground leading-relaxed">
                    Explore our vast library of blockbusters, indie gems, and timeless classics. 
                    Your next favorite movie is just a click away.
                </p>

                <div className="flex justify-center gap-4 mt-10">
                    <Button variant="gradient" size="lg" className="rounded-full px-10 h-13">
                        Popular Now
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-10 h-13 border-accent/20">
                        Browse All
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
                        { title: 'Now Playing', movies: displayMovies, showGenreTabs: true, delay: 0 },
                        { title: 'Popular Movies', movies: popular, delay: 150 },
                        ...GENRES.slice(0, 4).map((g, i) => ({
                            title: g.name, movies: genreData[g.id] || [], delay: 300 + i * 100,
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
                                    sliderId={`movies-${i}`}
                                />
                            </div>
                        )
                    ))
                )}
            </div>
        </div>
    );
}