import { useState, useEffect, useCallback, useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GET_USER_INFO, TOKEN_REFRESH } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../../../context/StateContext";
import { toggleLoginModal} from "../../../context/StateReducer";

// Constants
const MAX_REFRESH_ATTEMPTS = 5;
const isDevelopment = process.env.NODE_ENV === "development";

// Axios instance
const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useFetchUser = (shouldFetch = false) => {
  // State and hooks
  const [state, dispatch] = useStateProvider();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "jwt-refresh"]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshAttempts = useRef(0);

  // Cookie handling
  const clearAuthCookies = useCallback(() => {
    const cookieOptions = {
      path: "/",
      secure: !isDevelopment,
      sameSite: isDevelopment ? "lax" : "strict",
    };

    removeCookie("jwt", cookieOptions);
    removeCookie("jwt-refresh", cookieOptions);

    // Redundant cookie clearing
    const expires = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `jwt=; expires=${expires}; path=/; ${
      !isDevelopment ? "secure;" : ""
    } samesite=${cookieOptions.sameSite}`;
    document.cookie = `jwt-refresh=; expires=${expires}; path=/; ${
      !isDevelopment ? "secure;" : ""
    } samesite=${cookieOptions.sameSite}`;
  }, [removeCookie]);

  // Token refresh
  const refreshAccessToken = useCallback(async () => {
    if (refreshAttempts.current >= MAX_REFRESH_ATTEMPTS) {
      console.warn("Max refresh attempts reached");
      clearAuthCookies();
      dispatch(toggleLoginModal(true));
      navigate("/", { state: { sessionExpired: true } });
      return null;
    }

    try {
      refreshAttempts.current += 1;
      const response = await axios.post(
        TOKEN_REFRESH,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.access) {
        refreshAttempts.current = 0;
        setCookie("jwt", response.data.access, {
          path: "/",
          secure: !isDevelopment,
          sameSite: isDevelopment ? "lax" : "strict",
        });
        return response.data.access;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthCookies();
      dispatch(toggleLoginModal(true));
      navigate("/", { state: { sessionExpired: true } });
      return null;
    }
  }, [setCookie, clearAuthCookies, dispatch, navigate]);

  // User data fetching
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
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const retryResponse = await api.get(GET_USER_INFO);
            setUser(retryResponse.data);
            return true;
          } catch (retryError) {
            console.error("Retry failed:", retryError);
            setError(retryError.response?.data || retryError.message);
          }
        }
      } else {
        setError(err.response?.data || err.message || "Failed to fetch user");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshAccessToken]);

  // Effects
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
    clearAuthCookies,
  };
};

export default useFetchUser;
