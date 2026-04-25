import axios from 'axios';

const ACCESS_TOKEN =
  import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_TMDB_BEARER_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

/** Poster base (w500) — use with `getImageUrl` or paths from `/images` */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// ── Legacy: axios response (callers use `.data`) ───────────────────────────
export const fetchNowPlaying = () => tmdb.get('/movie/now_playing');
export const fetchTrending = () => tmdb.get('/trending/movie/day');
export const fetchPopularMovies = () => tmdb.get('/movie/popular');
export const fetchMoviesByGenre = (genreId) =>
  tmdb.get('/discover/movie', { params: { with_genres: genreId } });
export const fetchSearch = (query) =>
  tmdb.get('/search/multi', { params: { query, include_adult: false } });
export const fetchTVTrending = () => tmdb.get('/trending/tv/day');
export const fetchTVByGenre = (genreId) =>
  tmdb.get('/discover/tv', { params: { with_genres: genreId } });

export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

// ── Movies page: return plain API body `{ results, total_pages, ... }` ─────
/** https://api.themoviedb.org/3/movie/popular */
export const getPopularMovies = async (page = 1) => {
  const { data } = await tmdb.get('/movie/popular', { params: { page } });
  return data;
};

/** https://api.themoviedb.org/3/movie/top_rated */
export const getTopRatedMovies = async (page = 1) => {
  const { data } = await tmdb.get('/movie/top_rated', { params: { page } });
  return data;
};

/** https://api.themoviedb.org/3/movie/upcoming */
export const getUpcomingMovies = async (page = 1) => {
  const { data } = await tmdb.get('/movie/upcoming', { params: { page } });
  return data;
};

/** https://api.themoviedb.org/3/movie/now_playing */
export const getNowPlayingMovies = async (page = 1) => {
  const { data } = await tmdb.get('/movie/now_playing', { params: { page } });
  return data;
};


export const getTrendingMovies = async (page = 1, timeWindow = 'day') => {
  const { data } = await tmdb.get(`/trending/movie/${timeWindow}`, {
    params: { page },
  });
  return data;
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await tmdb.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
};

export const getMovieImages = async (movieId) => {
  const { data } = await tmdb.get(`/movie/${movieId}/images`);
  return data;
};
