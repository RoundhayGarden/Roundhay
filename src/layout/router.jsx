import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import NotFound from "../pages/NotFound";
import SignIntoUp from "../pages/SignIntoUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
],{
    basename: "/Roundhay",
  },
);
export default router;
