// hooks/useSwitchUserMode.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../../../context/StateContext";
import { switchMode, toggleLoginModal } from "../../../context/StateReducer";
import { toast } from "react-toastify";
import api from "../../../utils/apiClient";
import { SWITCH_ROLE_URL } from "../../../utils/constants";

const useSwitchUserMode = () => {
  const navigate = useNavigate();
  const [{ userInfo, currentRole }, dispatch] = useStateProvider();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const switchModeFn = useCallback(async () => {
    if (!userInfo?.is_seller) {
      navigate("/become-a-seller");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await api.post(SWITCH_ROLE_URL, {
        role: currentRole == "buyer" ? "seller" : "buyer",
      });
      dispatch(switchMode());
      navigate(currentRole === "buyer" ? "/seller" : "/buyer");
    } catch (err) {
      console.error("Mode switch failed:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to switch modes. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        dispatch(toggleLoginModal(true));
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    navigate,
    userInfo?.is_seller,
    userInfo?.current_role,
  ]);

  return { switchMode: switchModeFn, loading, error };
};

export default useSwitchUserMode;
