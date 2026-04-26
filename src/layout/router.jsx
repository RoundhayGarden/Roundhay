import { createHashRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import NotFound from "../pages/NotFound";
import SignIntoUp from "../pages/SignIntoUp";

const router = createHashRouter([
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
]);
export default router;
