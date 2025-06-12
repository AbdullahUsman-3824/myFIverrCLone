import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GET_USER_INFO } from "../../../utils/constants";
import { useStateProvider } from "../../../context/StateContext";
import { toggleLoginModal } from "../../../context/StateReducer";
import api from "../../../utils/apiClient";

const useFetchUser = (shouldFetch = false) => {
  const [state, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshAttempts = useRef(0);

  const handleUnauthorized = useCallback(() => {
    dispatch(toggleLoginModal(true));
    navigate("/", { state: { sessionExpired: true } });
  }, [dispatch, navigate]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(GET_USER_INFO);
      const userData = response.data;

      if (!userData) {
        throw new Error("No user data received");
      }

      setUser(userData);
      return true;
    } catch (err) {
      console.error("Fetch user error:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError(err.response?.data || err.message || "Failed to fetch user");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    refreshAttempts.current = 0;
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchUserData();
    }
  }, [shouldFetch, fetchUserData]);

  return {
    user,
    loading,
    error,
    refreshUserData: fetchUserData,
    handleSessionExpiration: handleUnauthorized,
  };
};

export default useFetchUser;
