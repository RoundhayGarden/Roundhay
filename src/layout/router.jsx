import { createHashRouter, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Series from "../pages/Series";
import Collection from "../pages/Collection";
import SearchResults from "../pages/SearchResults";
import MovieDetails from "../pages/MovieDetails";
import SeriesDetails from "../pages/SeriesDetails";
import NotFound from "../pages/NotFound";
import SignIntoUp from "../pages/SignIntoUp";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "movies", element: <Navigate to="/movies/popular" replace /> },
        { path: "movies/:tab", element: <Movies /> },
        { path: "movie/:id", element: <MovieDetails /> },
        {
          path: "series",
          element: <Navigate to="/series/airing_today" replace />,
        },
        { path: "series/:tab", element: <Series /> },
        { path: "series/details/:id", element: <SeriesDetails /> },
        { path: "collection", element: <Collection /> },
        { path: "search", element: <SearchResults /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
    {
      path: "/signin",
      element: <SignIntoUp />,
    },
    {
      path: "/signup",
      element: <SignIntoUp />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
);
export default router;
