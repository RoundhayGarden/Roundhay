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
  const response = await seriesApi.get(`/tv/${category}`, { params: { page } })
  return response.data
}

export const getTrendingTv     = async (timeWindow = "day", page = 1) => {
  const response = await seriesApi.get(`/trending/tv/${timeWindow}`, { params: { page } })
  return response.data
}
export const getAiringTodayTv  = (page = 1) => getTvByCategory("airing_today", page)
export const getOnTheAirTv     = (page = 1) => getTvByCategory("on_the_air", page)
export const getPopularTv      = (page = 1) => getTvByCategory("popular", page)
export const getTopRatedTv     = (page = 1) => getTvByCategory("top_rated", page)

export const searchTv = async (query, page = 1) => {
  const response = await seriesApi.get("/search/tv", {
    params: { query, page, include_adult: false },
  })
  return response.data
}
export const getTvImages  = async (tvId) => (await seriesApi.get(`/tv/${tvId}/images`)).data
export const getTvDetails = async (tvId) => (await seriesApi.get(`/tv/${tvId}`)).data
export const getSimilarTv = async (tvId, page = 1) => (await seriesApi.get(`/tv/${tvId}/similar`, { params: { page } })).data
export const getTvVideos  = async (tvId) => (await seriesApi.get(`/tv/${tvId}/videos`)).data


export const usersApi = axios.create({
  baseURL: "https://retoolapi.dev/AN4irD/users",
  headers: { "Content-Type": "application/json" },
})

export const wishlistApi = axios.create({
  baseURL: "https://retoolapi.dev/Dfj6Qv/wishlist",
  headers: { "Content-Type": "application/json" },
})


export const signUpUser = async ({ userName, email, password }) => {
  const { data: users } = await usersApi.get("/")

  const exists = users.find((u) => u.email === email)
  if (exists) throw new Error("Email is already registered.")

  const { data: newUser } = await usersApi.post("/", {
    username: userName,
    email,
    password,
  })

  return newUser
}

export const signInUser = async ({ email, password }) => {
  const { data: users } = await usersApi.get("/")

  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error("Invalid email or password.")

  return { id: user.id, username: user.username, email: user.email }
}


export const getUserWishlist = async (userId) => {
  const { data: wishlistRows } = await wishlistApi.get("/", {
    params: { user_id: userId },
  })

  const enriched = await Promise.all(
    wishlistRows.map(async (row) => {
      try {
        const details = await getTvDetails(row.tmdb_movie_id)
        return {
          wishlistId:  row.id,
          tmdbId:      row.tmdb_movie_id,
          name:        details.name,
          overview:    details.overview,
          poster_path: details.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${details.poster_path}`
            : null,
          vote_average: details.vote_average,
          first_air_date: details.first_air_date,
        }
      } catch {
        return null
      }
    })
  )

  return enriched.filter(Boolean)
}

export const addToWishlist = async (userId, tmdbMovieId) => {
  const { data } = await wishlistApi.post("/", {
    user_id: userId,
    tmdb_movie_id: tmdbMovieId,
  })
  return data
}

export const removeFromWishlist = async (wishlistId) => {
  await wishlistApi.delete(`/${wishlistId}`)
}

export const isInWishlist = async (userId, tmdbMovieId) => {
  const { data: rows } = await wishlistApi.get("/", {
    params: { user_id: userId, tmdb_movie_id: tmdbMovieId },
  })
  return rows.length > 0 ? rows[0] : null
}

export default seriesApi
