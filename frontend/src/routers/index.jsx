import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProfileSetupPage from "../features/profiles/pages/ProfileSetupPage";
import CredentialWrapper from "../features/auth/pages/CredentialWrapper";
import EmailVerification from "../features/auth/components/EmailVerification";
import ForgotPassword from "../features/auth/components/ForgotPassword";
import ResetPassword from "../features/auth/components/ResetPassword";
import SellerDashboard from "../features/seller/SellerDashboard";
import SellerOrders from "../features/seller/SellerOrders";
import SellerMessages from "../features/seller/SellerMessages";
import SellerOnboarding from "../features/seller/SellerOnboarding";
import SellerGigs from "../features/seller/SellerGigs";
import CreateGig from "../features/seller/CreateGig";
import BuyerHome from "../pages/buyer/Home";
import BuyerOrders from "../pages/buyer/Orders";
import BuyerOrderMessages from "../pages/buyer/OrderMessages";
import SellerRoute from "./SellerRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/buyer", element: <BuyerHome /> },
      { path: "/buyer/orders", element: <BuyerOrders /> },
      {
        path: "/buyer/orders/:orderId/messages",
        element: <BuyerOrderMessages />,
      },
      { path: "/buyer/messages", element: <BuyerOrders /> },

      {
        element: <SellerRoute />,
        children: [
          { path: "/seller", element: <SellerDashboard /> },
          { path: "/seller/orders", element: <SellerOrders /> },
          { path: "/seller/messages", element: <SellerMessages /> },

          { path: "/seller/gigs", element: <SellerGigs /> },
          { path: "/seller/gigs/create", element: <CreateGig /> },
        ],
      },
      { path: "/sellerOnboarding", element: <SellerOnboarding /> },
    ],
  },
  { path: "/profile", element: <ProfileSetupPage /> },
  {
    element: <CredentialWrapper />,
    children: [
      { path: "/verify-email", element: <EmailVerification /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:uid/:token", element: <ResetPassword /> },
    ],
  },
]);

export default router;
