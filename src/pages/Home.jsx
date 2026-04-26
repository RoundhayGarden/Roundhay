import { useEffect, useState } from 'react';
import HeroBanner from '../components/discovery/HeroBanner';
import SectionSlider from '../components/discovery/SectionSlider';
import { fetchTrending, fetchMoviesByGenre, fetchNowPlaying } from '../services/tmdb';
import { getImageUrl } from '../services/tmdb';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import 'swiper/css';

const MOVIE_GENRES = [
    { id: 28, name: 'Action' }, { id: 18, name: 'Drama' },
    { id: 12, name: 'Adventure' }, { id: 10749, name: 'Romance' },
    { id: 14, name: 'Fantasy' }, { id: 35, name: 'Comedy' },
    { id: 16, name: 'Animation' }, { id: 53, name: 'Thriller' },
    { id: 9648, name: 'Mystery' }, { id: 878, name: 'Sci-Fi' },
];

const COLLECTIONS = [
    { id: 10770, name: 'Musicals',  genre: 10402 },
    { id: 28,    name: 'Marvel',    genre: 878 },
    { id: 27,    name: 'DC',        genre: 27 },
    { id: 28,    name: 'Action',    genre: 28 },
    { id: 12,    name: 'Adventure', genre: 12 },
    { id: 10751, name: 'Family',    genre: 10751 },
];

const STUDIOS = [
    { name: 'HBO',       logo: 'HBO' },
    { name: 'Warner',    logo: 'WB' },
    { name: 'Disney+',   logo: 'Disney+' },
    { name: 'Marvel',    logo: 'MARVEL' },
    { name: 'DC',        logo: 'DC' },
    { name: 'AMC',       logo: 'amc' },
    { name: 'Netflix',   logo: 'NETFLIX' },
    { name: 'Paramount', logo: 'Paramount' },
    { name: 'Sony',      logo: 'SONY' },
    { name: 'Apple TV+', logo: '✦ tv+' },
];

export default function Home() {
    const [trending, setTrending]               = useState([]);
    const [nowPlaying, setNowPlaying]           = useState([]);
    const [genreMovies, setGenreMovies]         = useState({});
    const [seriesGenreMovies, setSeriesGenreMovies] = useState({});
    const [animationMovies, setAnimationMovies] = useState([]);
    const [collectionPosters, setCollectionPosters] = useState({});
    const [activeMovieGenre, setActiveMovieGenre]   = useState(null);
    const [activeSeriesGenre, setActiveSeriesGenre] = useState(null);
    const [activeCharTab, setActiveCharTab]     = useState('actors');
    const [isLoaded, setIsLoaded]               = useState(false);

    useEffect(() => {
        Promise.all([
            fetchTrending().then(r => setTrending(r.data.results)),
            fetchNowPlaying().then(r => setNowPlaying(r.data.results)),
            fetchMoviesByGenre(16).then(r => setAnimationMovies(r.data.results)),
            ...MOVIE_GENRES.slice(0, 5).map(g =>
                fetchMoviesByGenre(g.id).then(r => {
                    setGenreMovies(prev => ({ ...prev, [g.id]: r.data.results }));
                })
            ),
            ...COLLECTIONS.map(c =>
                fetchMoviesByGenre(c.genre).then(r => {
                    setCollectionPosters(prev => ({
                        ...prev,
                        [c.name]: r.data.results[0]?.backdrop_path || r.data.results[0]?.poster_path,
                    }));
                })
            ),
        ]).then(() => setTimeout(() => setIsLoaded(true), 200));
    }, []);

    const handleMovieGenreChange = (genreId) => {
        setActiveMovieGenre(genreId);
        if (genreId && !genreMovies[genreId]) {
            fetchMoviesByGenre(genreId).then(r =>
                setGenreMovies(prev => ({ ...prev, [genreId]: r.data.results }))
            );
        }
    };

    const handleSeriesGenreChange = (genreId) => {
        setActiveSeriesGenre(genreId);
        if (genreId && !seriesGenreMovies[genreId]) {
            fetchMoviesByGenre(genreId).then(r =>
                setSeriesGenreMovies(prev => ({ ...prev, [genreId]: r.data.results }))
            );
        }
    };

    const displayMovieGenre = activeMovieGenre && genreMovies[activeMovieGenre]
        ? genreMovies[activeMovieGenre]
        : genreMovies[MOVIE_GENRES[0].id] || nowPlaying;

    const displaySeriesGenre = activeSeriesGenre && seriesGenreMovies[activeSeriesGenre]
        ? seriesGenreMovies[activeSeriesGenre]
        : trending;

    return (
        <div className="min-h-screen pb-20 overflow-x-hidden" style={{ background: 'var(--background)' }}>
            {/* Hero */}
            <HeroBanner />

            {/* Main Content */}
            <div className="mx-auto mt-10 w-full max-w-[1800px] space-y-2 px-4 sm:px-6 md:px-14">

                {/* Trending */}
                <AnimatedSection delay={0} isLoaded={isLoaded}>
                    {trending.length > 0 && (
                        <SectionSlider title="Trending" movies={trending} showSeeMore sliderId="trends" />
                    )}
                </AnimatedSection>

                {/* Movies + Genre filter */}
                <AnimatedSection delay={100} isLoaded={isLoaded}>
                    {nowPlaying.length > 0 && (
                        <SectionSlider
                            title="Movies"
                            movies={displayMovieGenre}
                            showSeeMore
                            showGenreTabs
                            allGenreMovies={genreMovies}
                            onGenreChange={handleMovieGenreChange}
                            sliderId="movies"
                        />
                    )}
                </AnimatedSection>

                {/* Series + Genre filter */}
                <AnimatedSection delay={200} isLoaded={isLoaded}>
                    {trending.length > 0 && (
                        <SectionSlider
                            title="Series"
                            movies={displaySeriesGenre}
                            showSeeMore
                            seeMorePath="/series/airing_today"
                            showGenreTabs
                            allGenreMovies={seriesGenreMovies}
                            onGenreChange={handleSeriesGenreChange}
                            sliderId="series"
                        />
                    )}
                </AnimatedSection>

                {/* Collection */}
                <AnimatedSection delay={300} isLoaded={isLoaded}>
                    <CollectionSection collectionPosters={collectionPosters} />
                </AnimatedSection>

                {/* Characters */}
                <AnimatedSection delay={400} isLoaded={isLoaded}>
                    <CharactersSection
                        movies={trending}
                        activeTab={activeCharTab}
                        onTabChange={setActiveCharTab}
                    />
                </AnimatedSection>

                {/* For Kids */}
                <AnimatedSection delay={500} isLoaded={isLoaded}>
                    {animationMovies.length > 0 && <ChildrenSection movies={animationMovies} />}
                </AnimatedSection>

                {/* Studios */}
                <AnimatedSection delay={600} isLoaded={isLoaded}>
                    <StudiosSection />
                </AnimatedSection>

            </div>
        </div>
    );
}

// ─── ANIMATED WRAPPER ────────────────────────────────
function AnimatedSection({ children, delay, isLoaded }) {
    return (
        <div
            style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// ─── COLLECTION SECTION ──────────────────────────────
function CollectionSection({ collectionPosters }) {
    const [activeTab, setActiveTab] = useState('movies');

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="section-title">Collection</h3>
                <div className="flex gap-1 p-1 rounded-full bg-[var(--movie-accent)] border border-[var(--glass-border)]">
                    {['Series', 'Movies'].map(tab => {
                        const isCurrent = activeTab === tab.toLowerCase();
                        return (
                            <Button
                                key={tab}
                                variant={isCurrent ? "gradient" : "ghost"}
                                size="sm"
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={cn(
                                    "rounded-full px-5 transition-all duration-300",
                                    !isCurrent && "text-muted-foreground"
                                )}
                            >
                                {tab}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <Swiper
                slidesPerView={2.3}
                spaceBetween={16}
                breakpoints={{
                    640:  { slidesPerView: 3.3 },
                    1024: { slidesPerView: 4.3 },
                    1280: { slidesPerView: 5.3 },
                }}
            >
                {COLLECTIONS.map(col => (
                    <SwiperSlide key={col.name}>
                        <CollectionCard name={col.name} posterPath={collectionPosters[col.name]} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function CollectionCard({ name, posterPath }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="group relative overflow-hidden cursor-pointer"
            style={{
                height: '280px',
                borderRadius: '20px',
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
                transform: hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1)',
                boxShadow: hovered
                    ? '0 24px 55px var(--shadow-color)'
                    : '0 6px 20px var(--shadow-color)',
                border: hovered ? '1px solid var(--glass-border)' : '1px solid transparent',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {posterPath ? (
                <img
                    src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: 'brightness(0.6)' }}
                />
            ) : (
                <div className="w-full h-full bg-primary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end p-5">
                <h4 className="text-2xl font-black tracking-tight text-white drop-shadow-lg">
                    {name}
                </h4>
            </div>
            <div
                className="absolute right-0 top-0 bottom-0 w-1.5 transition-all duration-300"
                style={{
                    background: 'linear-gradient(to bottom, var(--accent), var(--primary))',
                    opacity: hovered ? 1 : 0.4,
                    borderRadius: '0 20px 20px 0',
                }}
            />
        </div>
    );
}

// ─── CHARACTERS SECTION ──────────────────────────────
function CharactersSection({ movies, activeTab, onTabChange }) {
    const chars = movies.slice(0, 10);

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="section-title">Characters</h3>
                <div className="flex gap-1 p-1 rounded-full bg-[var(--movie-accent)] border border-[var(--glass-border)]">
                    {['Directors', 'Actors'].map(tab => {
                        const isCurrent = activeTab === tab.toLowerCase();
                        return (
                            <Button
                                key={tab}
                                variant={isCurrent ? "gradient" : "ghost"}
                                size="sm"
                                onClick={() => onTabChange(tab.toLowerCase())}
                                className={cn(
                                    "rounded-full px-5 transition-all duration-300",
                                    !isCurrent && "text-muted-foreground"
                                )}
                            >
                                {tab}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <Swiper
                slidesPerView={3.5}
                spaceBetween={20}
                breakpoints={{
                    640:  { slidesPerView: 5.5 },
                    1024: { slidesPerView: 8.5 },
                }}
            >
                {chars.map((movie, i) => (
                    <SwiperSlide key={movie.id}>
                        <CharacterCircle movie={movie} index={i} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function CharacterCircle({ movie, index }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="flex flex-col items-center gap-3 cursor-pointer group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ animation: `scaleIn 0.5s ${index * 55}ms ease both` }}
        >
            <div
                className="relative rounded-full overflow-hidden transition-all duration-500 ring-2 ring-offset-2 ring-offset-background"
                style={{
                    width: '92px',
                    height: '92px',
                    ringColor: hovered ? 'var(--accent)' : 'var(--glass-border)',
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: hovered ? '0 8px 25px var(--movie-accent)' : 'none',
                }}
            >
                {movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-primary text-accent">
                        {movie.title?.[0]}
                    </div>
                )}
            </div>
            <p
                className={cn(
                    "text-xs font-medium text-center truncate w-full px-1 transition-all duration-300",
                    hovered ? "text-foreground opacity-100" : "text-muted-foreground opacity-60"
                )}
            >
                {movie.title}
            </p>
        </div>
    );
}

// ─── CHILDREN SECTION ────────────────────────────────
function ChildrenSection({ movies }) {
    const top3 = movies.slice(0, 3);
    return (
        <div className="py-8">
            <div
                className="relative rounded-[32px] overflow-hidden p-10"
                style={{
                    background: 'linear-gradient(135deg, #1a7abf 0%, #23a6e0 40%, #1e90cc 100%)',
                    boxShadow: '0 20px 60px rgba(30,144,204,0.3)',
                }}
            >
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${60 + i * 30}px`,
                            height: `${60 + i * 30}px`,
                            background: 'rgba(255,255,255,0.06)',
                            left: `${5 + i * 16}%`,
                            top: `${10 + (i % 3) * 30}%`,
                            animation: `floatBubble ${3 + i * 0.5}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.4}s`,
                        }}
                    />
                ))}

                <h3 className="text-4xl font-black text-white mb-2 relative z-10 drop-shadow-md">For Kids</h3>
                <p className="text-white/80 mb-8 relative z-10 text-lg">Your child's favorites — sorted by age</p>

                <div className="flex justify-center items-end gap-6 relative z-10">
                    {top3.map((movie, i) => (
                        <div
                            key={movie.id}
                            className="overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                            style={{
                                width: i === 1 ? '180px' : '140px',
                                height: i === 1 ? '270px' : '210px',
                                animation: `floatKids ${2.5 + i * 0.3}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.5}s`,
                                boxShadow: i === 1 ? '0 25px 60px rgba(0,0,0,0.5)' : '0 15px 40px rgba(0,0,0,0.3)',
                                border: '3px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>


                <div className="flex justify-center mt-10 relative z-10">
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full bg-white/15 border-white/30 text-white hover:bg-white hover:text-[#1a7abf] transition-all duration-300 font-bold px-10 h-13 shadow-xl"
                    >
                        Watch children's section
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── STUDIOS SECTION ─────────────────────────────────
function StudiosSection() {
    return (
        <div className="py-8 mb-12">
            <h3 className="section-title mb-10 text-center">Studios</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {STUDIOS.map((studio, i) => (
                    <StudioCard key={studio.name} studio={studio} index={i} />
                ))}
            </div>
        </div>
    );
}

function StudioCard({ studio, index }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 group"
            style={{
                height: '92px',
                background: hovered ? 'var(--surface-raised)' : 'var(--surface)',
                border: hovered ? '1.5px solid var(--accent)' : '1px solid var(--glass-border)',
                transform: hovered ? 'scale(1.07) translateY(-6px)' : 'scale(1)',
                boxShadow: hovered ? '0 20px 40px var(--shadow-color)' : '0 4px 12px var(--shadow-color)',
                animation: `fadeInUp 0.5s ${index * 55}ms ease both`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span
                className={cn(
                    "font-black text-center px-4 transition-all duration-300",
                    hovered ? "text-accent scale-110" : "text-foreground opacity-80",
                    studio.logo === 'NETFLIX' && "tracking-widest"
                )}
                style={{ fontSize: studio.logo.length > 7 ? '14px' : '20px' }}
            >
                {studio.logo}
            </span>
        </div>
    );
}