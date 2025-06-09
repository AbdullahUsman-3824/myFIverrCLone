// src/components/routes/SellerRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateProvider } from "../context/StateContext";

const SellerRoute = () => {
  const [{ userInfo }] = useStateProvider();

  if (!userInfo.is_seller) {
    return <Navigate to="/become-a-seller" replace />;
  }

  if (!userInfo.is_seller) {
    return <Navigate to="/buyer" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
