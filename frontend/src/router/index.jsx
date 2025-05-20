import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfliePage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerMessages from "../pages/seller/SellerMessages";
import SellerOnboarding from "../pages/seller/SellerOnboarding";
import SellerGigs from "../pages/seller/SellerGigs";
import CreateGig from "../pages/seller/CreateGig";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/seller",
        element: <SellerDashboard />,
      },
      {
        path: "/seller/orders",
        element: <SellerOrders />,
      },
      {
        path: "/seller/messages",
        element: <SellerMessages />,
      },
      {
        path: "/seller/onboarding",
        element: <SellerOnboarding />,
      },
      {
        path: "/seller/gigs",
        element: <SellerGigs />,
      },
    ],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  
]);

export default router;
