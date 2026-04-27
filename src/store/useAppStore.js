import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} from "../services/seriesApi";

// ─── App-wide Zustand Store ───────────────────────────
// Handles: theme, wishlist (synced to Retool), search history, active genre per section

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Theme ──────────────────────────────────────
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.remove("dark", "light");
        root.classList.add(theme);
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },

      // ── Wishlist ───────────────────────────────────
      // Shape: [{ id, title, poster_path, vote_average, release_date, wishlistId? }]
      // wishlistId is the Retool row id — needed to delete from Retool later
      wishlist: [],

      // Called once after sign in to pull the user's wishlist from Retool + TMDB
      syncWishlistFromRetool: async () => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) return;
        try {
          const enriched = await getUserWishlist(user.id);
          // Map enriched TMDB+Retool rows into the same shape used locally
          const mapped = enriched.map((item) => ({
            id: item.tmdbId,
            wishlistId: item.wishlistId, // Retool row id
            title: item.name,
            poster_path: item.poster_path, // already full URL from seriesApi
            vote_average: item.vote_average,
            release_date: item.first_air_date,
          }));
          set({ wishlist: mapped });
        } catch {
          // Silently keep whatever is cached locally if sync fails
        }
      },

      addToWishlist: async (movie) => {
        const already = get().wishlist.some((m) => m.id === movie.id);
        if (already) return;

        const user = JSON.parse(localStorage.getItem("user") || "null");

        // Optimistic local update first
        const localItem = {
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          wishlistId: null, // will be set after Retool responds
        };
        set((state) => ({ wishlist: [localItem, ...state.wishlist] }));

        // Persist to Retool if signed in
        if (user) {
          try {
            const row = await addToWishlist(user.id, movie.id);
            // Attach the Retool row id so we can delete it later
            set((state) => ({
              wishlist: state.wishlist.map((m) =>
                m.id === movie.id ? { ...m, wishlistId: row.id } : m,
              ),
            }));
          } catch {
            // Retool call failed — item stays locally, will re-sync on next login
          }
        }
      },

      removeFromWishlist: async (movieId) => {
        const item = get().wishlist.find((m) => m.id === movieId);

        // Optimistic local removal
        set((state) => ({
          wishlist: state.wishlist.filter((m) => m.id !== movieId),
        }));

        // Delete from Retool if we have the row id
        if (item?.wishlistId) {
          try {
            await removeFromWishlist(item.wishlistId);
          } catch {
            // Silently fail — local state is already updated
          }
        }
      },

      // Returns true/false — used by heart button to show filled/empty state
      isInWishlist: (movieId) => get().wishlist.some((m) => m.id === movieId),

      // toggleWishlist now requires the user to be signed in.
      // If not signed in, returns false so the caller can redirect to /signin.
      toggleWishlist: (movie) => {
        const user = localStorage.getItem("user");
        if (!user) return false; // caller handles redirect

        const inList = get().wishlist.some((m) => m.id === movie.id);
        inList
          ? get().removeFromWishlist(movie.id)
          : get().addToWishlist(movie);

        return true; // success
      },

      // ── Search History ─────────────────────────────
      searchHistory: [],

      addToHistory: (query) => {
        if (!query.trim()) return;
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query),
          ].slice(0, 10),
        }));
      },

      clearHistory: () => set({ searchHistory: [] }),
      removeFromHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        })),

      // ── Active Genres (per section) ────────────────
      activeGenres: {},

      setActiveGenre: (sectionKey, genreId) =>
        set((state) => ({
          activeGenres: { ...state.activeGenres, [sectionKey]: genreId },
        })),

      getActiveGenre: (sectionKey) => get().activeGenres[sectionKey] ?? null,
    }),

    {
      name: "playx-store",
      partialize: (state) => ({
        theme: state.theme,
        wishlist: state.wishlist,
        searchHistory: state.searchHistory,
      }),
    },
  ),
);
