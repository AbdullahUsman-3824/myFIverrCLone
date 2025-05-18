import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfliePage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
    ],
  },
]);

export default router;
