// src/routes/DynamicDashboardRoute.jsx
import { Navigate } from "react-router-dom";
import { useStateProvider } from "../context/StateContext";
import SellerDashboard from "../features/seller/pages/SellerDashboard";
import BuyerHome from "../pages/buyer/Home";

const DynamicDashboardRoute = () => {
  const [{ userInfo }] = useStateProvider();

  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  switch (userInfo.current_role) {
    case "seller":
      return <SellerDashboard />;
    case "buyer":
    default:
      return <BuyerHome />;
  }
};

export default DynamicDashboardRoute;
