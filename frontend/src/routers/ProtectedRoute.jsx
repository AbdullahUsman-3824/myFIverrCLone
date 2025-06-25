import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";
import { useStateProvider } from "../context/StateContext";
import { toggleLoginModal } from "../context/StateReducer";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [, dispatch] = useStateProvider();

  if (!isAuthenticated) {
    dispatch(toggleLoginModal(true));
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Redirect non-sellers trying to access seller routes
  if (location.pathname.startsWith("/seller") && !userInfo?.is_seller) {
    return <Navigate to="/become-a-seller" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
