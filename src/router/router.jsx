import { createBrowserRouter } from "react-router";
import Login from "../page/Authentication/Login/Login";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../page/Authentication/Register/Register";
import ResetPass from "../page/Authentication/ResetPass/ResetPass";
import RootLayout from "../layouts/RootLayout";
import Home from "../page/Home/Home";
import PrivateRoute from "../routes/PrivateRoute";
import ErrorPage from "../page/ErrorPage/ErrorPage";
import About from "../page/Home/About";
import ClassSchedule from "../page/Home/ClassSchedule";
import BudgetTracker from "../page/Home/BudgetTracker";
import ExamQA from "../page/Home/ExamQA";
import StudyPlanner from "../page/Home/StudyPlanner";
import Profile from "../page/Home/Profile";
import MyPosts from "../components/MyPosts";
import Saved from "../components/Saved";
import SkillProgressTracker from "../page/Home/SkillProgressTracker";

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
      {
        path: "about",
        Component: About,
      },
      {
        path: "class",
        Component: ClassSchedule,
      },
      {
        path: "budget",
        Component: BudgetTracker,
      },
      {
        path: "exam",
        Component:ExamQA,
      },
      {
        path: "study",
        Component: StudyPlanner,
      },
      {
        path: "skill",
        Component: SkillProgressTracker,
      },
      {
        path: "profile",
        Component: Profile,
        children: [
          {
            path: "myPosts",
            Component: MyPosts,
          },
          {
            path: "saved",
            Component: Saved,
          }
        ]
      },
    ],
  },
]);
