import axios from "axios"

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3"
const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

const seriesApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
  },
})

const getTvByCategory = async (category, page = 1) => {
  const response = await seriesApi.get(`/tv/${category}`, {
    params: { page },
  })
  return response.data
}

export const getTrendingTv = async (timeWindow = "day", page = 1) => {
  const response = await seriesApi.get(`/trending/tv/${timeWindow}`, {
    params: { page },
  })
  return response.data
}

export const getAiringTodayTv = (page = 1) => getTvByCategory("airing_today", page)
export const getOnTheAirTv = (page = 1) => getTvByCategory("on_the_air", page)
export const getPopularTv = (page = 1) => getTvByCategory("popular", page)
export const getTopRatedTv = (page = 1) => getTvByCategory("top_rated", page)

export const searchTv = async (query, page = 1) => {
  const response = await seriesApi.get("/search/tv", {
    params: {
      query,
      page,
      include_adult: false,
    },
  })
  return response.data
}

export const getTvImages = async (tvId) => {
  const response = await seriesApi.get(`/tv/${tvId}/images`)
  return response.data
}

export const getTvVideos = async (tvId) => {
  const response = await seriesApi.get(`/tv/${tvId}/videos`)
  return response.data
}

export default seriesApi
