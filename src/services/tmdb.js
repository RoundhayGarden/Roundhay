import axios from 'axios';

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export const fetchNowPlaying = () => tmdb.get('/movie/now_playing');
export const fetchTrending = () => tmdb.get('/trending/movie/day');
export const fetchPopularMovies = () => tmdb.get('/movie/popular');
export const fetchMoviesByGenre = (genreId) => tmdb.get('/discover/movie', { params: { with_genres: genreId } });
export const fetchSearch = (query) => tmdb.get('/search/multi', { params: { query, include_adult: false } });
export const fetchTVTrending = () => tmdb.get('/trending/tv/day');
export const fetchTVByGenre = (genreId) => tmdb.get('/discover/tv', { params: { with_genres: genreId } });

export const getImageUrl = (path, size = 'w500') => `https://image.tmdb.org/t/p/${size}${path}`;