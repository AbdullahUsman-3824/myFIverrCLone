import ProtectedRoute from "./ProtectedRoute";
import SellerDetails from "../features/seller/pages/SellerDetails";
import SellerGigs from "../features/seller/pages/SellerGigs";
import SellerMessages from "../features/seller/pages/SellerMessages";
import SellerOrders from "../features/seller/pages/SellerOrders";
import GigFormPage from "../features/gigs/pages/GigFormPage";

const sellerRoutes = {
  element: <ProtectedRoute />,
  children: [
    { path: "/seller/profile", element: <SellerDetails /> },
    { path: "/seller/orders", element: <SellerOrders /> },
    { path: "/seller/messages", element: <SellerMessages /> },
    { path: "/seller/gigs", element: <SellerGigs /> },
    { path: "/seller/gigs/create", element: <GigFormPage /> },
    { path: "/seller/gigs/:gigId/edit", element: <GigFormPage /> },
  ],
};

export default sellerRoutes;
