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
import CreateGigPage from "../features/gigs/pages/CreateGigPage";
import BuyerHome from "../pages/buyer/Home";
import BuyerOrders from "../pages/buyer/Orders";
import BuyerOrderMessages from "../pages/buyer/OrderMessages";
import BuyerMessages from "../pages/buyer/Messages";
import SellerRoute from "./SellerRoute";
import SellerDetails from "../features/seller/pages/SellerDetails";
import BuyerInfo from "../features/buyer/BuyerInfo";
import CategoryPage from "../pages/CategoryPage";
import GigDetail from "../pages/GigDetail";
import SearchResults from "../pages/SearchResults";
import EditGigPage from "../features/gigs/pages/EditGigPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/category/:categoryId", element: <CategoryPage /> },
      { path: "/category/:categoryId/gig/:gigId", element: <GigDetail /> },
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
          { path: "/seller/gigs/create", element: <CreateGigPage /> },  
          { path: "/seller/profile", element: <SellerDetails /> },
          { path: "/seller/gigs/:gigId/edit", element: <EditGigPage /> },
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
  {
    path: "/search",
    element: <SearchResults />,
  },
]);

export default router;
