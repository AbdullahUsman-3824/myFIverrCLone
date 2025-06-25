import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProfileSetupPage from "../features/profiles/pages/ProfileSetupPage";
import PaymentPage from "../features/gigs/pages/PaymentPage";
import authRoutes from "./authRoutes";
import sellerRoutes from "./sellerRoutes";
import buyerRoutes from "./buyerRoutes";
import publicRoutes from "./publicRoutes";
import DynamicDashboardRoute from "./DynamicDashboardRoute";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      buyerRoutes,
      sellerRoutes,
      { path: "/profile", element: <ProfileSetupPage /> },
      { path: "/dashboard", element: <DynamicDashboardRoute /> },
      { path: "/payment", element: <PaymentPage /> },
    ],
  },
  authRoutes,
]);

export default router;
