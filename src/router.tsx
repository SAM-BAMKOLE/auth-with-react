import { createBrowserRouter } from "react-router";
import HomePage from "./pages/home";
import SigninPage from "./pages/signin";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import { authenticationPagesLoader, dashboardLoader } from "./utils/loaders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/signin",
    Component: SigninPage,
    loader: authenticationPagesLoader,
  },
  {
    path: "/signup",
    Component: SignupPage,
    loader: authenticationPagesLoader,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
    loader: dashboardLoader,
  },
]);
