import ProtectedRoute from "./ProtectedRoute";
import SellerOrders from "../features/seller/SellerOrders";
import SellerMessages from "../features/seller/SellerMessages";
import SellerGigs from "../features/seller/pages/SellerGigs";
import GigFormPage from "../features/gigs/pages/GigFormPage";
import SellerDetails from "../features/seller/pages/SellerDetails";

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
