import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── App-wide Zustand Store ───────────────────────────
// Handles: theme, wishlist, search history, active genre per section

export const useAppStore = create(
    persist(
        (set, get) => ({

            // ── Theme ──────────────────────────────────────
            theme: 'dark',
            setTheme: (theme) => {
                set({ theme });
                const root = document.documentElement;
                root.classList.remove('dark', 'light');
                root.classList.add(theme);
            },
            toggleTheme: () => {
                const next = get().theme === 'dark' ? 'light' : 'dark';
                get().setTheme(next);
            },

            // ── Wishlist ───────────────────────────────────
            wishlist: [],          // [{ id, title, poster_path, vote_average, release_date }]

            addToWishlist: (movie) => {
                const already = get().wishlist.some(m => m.id === movie.id);
                if (already) return;
                set(state => ({
                    wishlist: [
                        {
                            id: movie.id,
                            title: movie.title || movie.name,
                            poster_path: movie.poster_path,
                            vote_average: movie.vote_average,
                            release_date: movie.release_date || movie.first_air_date,
                        },
                        ...state.wishlist,
                    ],
                }));
            },

            removeFromWishlist: (movieId) =>
                set(state => ({ wishlist: state.wishlist.filter(m => m.id !== movieId) })),

            toggleWishlist: (movie) => {
                const inList = get().wishlist.some(m => m.id === movie.id);
                inList ? get().removeFromWishlist(movie.id) : get().addToWishlist(movie);
            },

            isInWishlist: (movieId) => get().wishlist.some(m => m.id === movieId),

            // ── Search History ─────────────────────────────
            searchHistory: [],     // [string]  max 10 items

            addToHistory: (query) => {
                if (!query.trim()) return;
                set(state => ({
                    searchHistory: [
                        query,
                        ...state.searchHistory.filter(q => q !== query),
                    ].slice(0, 10),
                }));
            },

            clearHistory: () => set({ searchHistory: [] }),
            removeFromHistory: (query) =>
                set(state => ({ searchHistory: state.searchHistory.filter(q => q !== query) })),

            // ── Active Genres (per section) ────────────────
            activeGenres: {},      // { sectionKey: genreId | null }

            setActiveGenre: (sectionKey, genreId) =>
                set(state => ({
                    activeGenres: { ...state.activeGenres, [sectionKey]: genreId },
                })),

            getActiveGenre: (sectionKey) => get().activeGenres[sectionKey] ?? null,
        }),

        {
            name: 'playx-store',          // localStorage key
            partialize: (state) => ({     // only persist these fields
                theme: state.theme,
                wishlist: state.wishlist,
                searchHistory: state.searchHistory,
            }),
        }
    )
);
