import { createHashRouter, Navigate, Outlet } from "react-router-dom";
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

const RequireAuth = () => {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/signin" replace />;
  return <Outlet />;
};

const router = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      // ── Public ──
      { path: "movies",              element: <Navigate to="popular" replace /> },
      { path: "movies/:tab",         element: <Movies /> },
      { path: "movie/:id",           element: <MovieDetails /> },

      { path: "series",              element: <Navigate to="airing_today" replace /> },
      { path: "series/:tab",         element: <Series /> },
      { path: "series/details/:id",  element: <SeriesDetails /> },

      { path: "search",              element: <SearchResults /> },

      // ── Protected (must be signed in) ──
      {
        element: <RequireAuth />,
        children: [
          { path: "collection", element: <Collection /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/signin", element: <SignIntoUp /> },
  { path: "/signup", element: <SignIntoUp /> },
]);

export default router;