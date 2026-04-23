import { createBrowserRouter, Navigate } from "react-router-dom"
import MainLayout from "./MainLayout"
import Movies from "../pages/Movies"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/movies/popular" replace />,
    },
    {
      path: "/movies",
      element: <Navigate to="/movies/popular" replace />,
    },
    {
      path: "/movies/:tab",
      element: (
        <MainLayout>
          <Movies />
        </MainLayout>
      ),
    },
  ],
  {
    basename: "/Roundhay",
  }
)

export default router
