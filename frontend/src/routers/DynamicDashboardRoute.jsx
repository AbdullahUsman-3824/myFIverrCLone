// src/routes/DynamicDashboardRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStateProvider } from "../context/StateContext";
import SellerDashboard from "../features/seller/pages/SellerDashboard";
import BuyerDashboard from "../features/buyer/BuyerDashboard";
import CircularProgress from "@mui/material/CircularProgress";

const DynamicDashboardRoute = () => {
  const [{ userInfo, currentRole }] = useStateProvider();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (currentRole) {
      setRole(currentRole);
    }
  }, [currentRole]);

  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  if (!role) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (role === "seller") return <SellerDashboard />;
  return <BuyerDashboard />;
};

export default DynamicDashboardRoute;
