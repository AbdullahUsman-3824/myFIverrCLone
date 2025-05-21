import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import SellerDashboard from "../features/seller/SellerDashboard";
import SellerOrders from "../features/seller/SellerOrders";
import SellerMessages from "../features/seller/SellerMessages";
import SellerOnboarding from "../features/seller/SellerOnboarding";
import SellerGigs from "../features/seller/SellerGigs";
import CreateGig from "../features/seller/CreateGig";

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
      {
        path: "/seller/gigs/create",
        element: <CreateGig />,
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
