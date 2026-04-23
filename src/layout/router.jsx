import { createBrowserRouter, Navigate } from "react-router-dom"
import MainLayout from "./MainLayout"
import Series from "../pages/Series"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/series/airing_today" replace />,
    },
    {
      path: "/series",
      element: <Navigate to="/series/airing_today" replace />,
    },
    {
      path: "/series/:tab",
      element: (
        <MainLayout>
          <Series />
        </MainLayout>
      ),
    },
    // {
    //   path: "*",
    //   element: <Navigate to="/series/popular" replace />,
    // },
  ],
  {
    basename: "/Roundhay",
  }
)

export default router
