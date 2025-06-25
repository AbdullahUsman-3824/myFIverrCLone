import ProtectedRoute from "./ProtectedRoute";
import BuyerOrders from "../features/buyer/BuyerOrders";
import BuyerMessages from "../features/buyer/BuyerMessages";
import BuyerInfo from "../features/buyer/BuyerInfo";
import BuyerOrderMessages from "../features/buyer/OrderMessages";

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
