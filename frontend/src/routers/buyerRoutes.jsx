import ProtectedRoute from "./ProtectedRoute";
import BuyerOrders from "../pages/buyer/Orders";
import BuyerMessages from "../pages/buyer/Messages";
import BuyerInfo from "../features/buyer/BuyerInfo";
import BuyerOrderMessages from "../pages/buyer/OrderMessages";

const buyerRoutes = {
  element: <ProtectedRoute />,
  children: [
    { path: "/buyer/orders", element: <BuyerOrders /> },
    { path: "/buyer/profile", element: <BuyerInfo /> },
    { path: "/buyer/messages", element: <BuyerMessages /> },
    {
      path: "/buyer/orders/:orderId/messages",
      element: <BuyerOrderMessages />,
    },
  ],
};

export default buyerRoutes;
