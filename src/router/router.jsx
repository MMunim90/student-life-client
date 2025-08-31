import { createBrowserRouter } from "react-router";
import Login from "../page/Authentication/Login/Login";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../page/Authentication/Register/Register";
import ResetPass from "../page/Authentication/ResetPass/ResetPass";
import RootLayout from "../layouts/RootLayout";
import Home from "../page/Home/Home";
import PrivateRoute from "../routes/PrivateRoute";
import ErrorPage from "../page/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/reset",
        Component: ResetPass,
      },
      {
        path: "/*",
        Component: ErrorPage,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <RootLayout></RootLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "home",
        Component: Home,
      },
    ],
  },
]);
