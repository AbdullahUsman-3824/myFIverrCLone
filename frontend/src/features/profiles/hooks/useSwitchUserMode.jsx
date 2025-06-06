// hooks/useSwitchUserMode.js
import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useStateProvider } from "../../../context/StateContext";
import { switchMode, toggleLoginModal } from "../../../context/StateReducer";
import { HOST } from "../../../utils/constants";

const useSwitchUserMode = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["jwt"]);
  const [{ userInfo }, dispatch] = useStateProvider();

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
      await axios.post(
        `${HOST}/api/accounts/switch-role/`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      );
      dispatch(switchMode());
      navigate(userInfo?.current_role === "seller" ? "/buyer" : "/seller");
    } catch (err) {
      console.error("Mode switch failed:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to switch modes. Please try again.";

      setError(errorMessage);

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
    cookies.jwt,
    userInfo?.is_seller,
    userInfo?.current_role,
  ]);

  return { switchMode: switchModeFn, loading, error };
};

export default useSwitchUserMode;
