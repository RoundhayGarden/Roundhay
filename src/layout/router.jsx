import { createBrowserRouter, Navigate } from "react-router-dom"
import MainLayout from "./MainLayout"
import Home from "../pages/Home"
import Movies from "../pages/Movies"
import Series from "../pages/Series"
import Collection from "../pages/Collection"
import SearchResults from "../pages/SearchResults"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "movies", element: <Navigate to="/movies/popular" replace /> },
        { path: "movies/:tab", element: <Movies /> },
        { path: "series", element: <Navigate to="/series/airing_today" replace /> },
        { path: "series/:tab", element: <Series /> },
        { path: "collection", element: <Collection /> },
        { path: "search", element: <SearchResults /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    basename: "/Roundhay",
  }
)

export default router
