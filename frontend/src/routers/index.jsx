import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProfileSetupPage from "../features/profiles/pages/ProfileSetupPage";
import {
  CredentialWrapper,
  EmailVerification,
  ResetPassword,
  ForgotPassword,
} from "../features/auth";
import SellerOnboarding from "../features/sellerOnboarding/pages/SellerOnboarding";

import SellerDashboard from "../features/seller/SellerDashboard";
import SellerOrders from "../features/seller/SellerOrders";
import SellerMessages from "../features/seller/SellerMessages";
import SellerGigs from "../features/seller/SellerGigs";
import CreateGig from "../features/seller/CreateGig";
import BuyerHome from "../pages/buyer/Home";
import BuyerOrders from "../pages/buyer/Orders";
import BuyerOrderMessages from "../pages/buyer/OrderMessages";
import BuyerMessages from "../pages/buyer/Messages";
import SellerRoute from "./SellerRoute";
import SellerInfo from "../features/seller/SellerInfo";
import BuyerInfo from "../features/buyer/BuyerInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/buyer", element: <BuyerHome /> },
      { path: "/buyer/orders", element: <BuyerOrders /> },
      { path: "/buyer/profile", element: <BuyerInfo /> },
      { path: "/buyer/messages", element: <BuyerMessages /> },
      {
        path: "/buyer/orders/:orderId/messages",
        element: <BuyerOrderMessages />,
      },

      {
        element: <SellerRoute />,
        children: [
          { path: "/seller", element: <SellerDashboard /> },
          { path: "/seller/orders", element: <SellerOrders /> },
          { path: "/seller/messages", element: <SellerMessages /> },
          { path: "/seller/gigs", element: <SellerGigs /> },
          { path: "/seller/gigs/create", element: <CreateGig /> },
          { path: "/seller/profile", element: <SellerInfo /> },
        ],
      },
      { path: "/become-a-seller", element: <SellerOnboarding /> },
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
