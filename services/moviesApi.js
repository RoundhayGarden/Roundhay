import axios from "axios"

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3"
const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN

const moviesApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
  },
})

const getMoviesByCategory = async (category, page = 1) => {
  const response = await moviesApi.get(`/movie/${category}`, {
    params: { page },
  })
  return response.data
}

export const getNowPlayingMovies = (page = 1) => getMoviesByCategory("now_playing", page)
export const getPopularMovies = (page = 1) => getMoviesByCategory("popular", page)
export const getTopRatedMovies = (page = 1) => getMoviesByCategory("top_rated", page)
export const getUpcomingMovies = (page = 1) => getMoviesByCategory("upcoming", page)

export default moviesApi
