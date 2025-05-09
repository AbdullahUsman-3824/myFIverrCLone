import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GET_USER_INFO, TOKEN_REFRESH } from "../utils/constants";
import { useNavigate } from "react-router-dom";

// Configure axios instance with interceptors
const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("JWT="))
    ?.split("=")[1];
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useFetchUser = (shouldFetch = false) => {
  const [cookies, setCookie, removeCookie] = useCookies(["JWT"]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Clears all auth-related cookies
   */
  const clearAuthCookies = useCallback(() => {
    removeCookie("JWT", { path: "/" });
    removeCookie("jwt-refresh", { path: "/" });
    document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "jwt-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, [removeCookie]);

  /**
   * Refreshes the access token using the refresh token
   */
  const refreshAccessToken = useCallback(async () => {
    try {
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
        setCookie("JWT", response.data.access, { path: "/" });
        return response.data.access;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthCookies();
      navigate("/login", { state: { sessionExpired: true } });
      return null;
    }
  }, [setCookie, clearAuthCookies, navigate]);

  /**
   * Fetches user data from the API
   */
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(GET_USER_INFO);
      const userData = response.data;

      if (!userData) {
        throw new Error("No user data received from server");
      }

      setUser(userData);
      return true;
    } catch (err) {
      console.error("Error fetching user:", err);
      
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const retryResponse = await api.get(GET_USER_INFO);
            setUser(retryResponse.data);
            return true;
          } catch (retryError) {
            console.error("Error after token refresh:", retryError);
          }
        }
      }

      setError(err.response?.data || err.message || "Failed to fetch user");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    if (shouldFetch) {
      fetchUserData();
    }
  }, [shouldFetch, fetchUserData]);

  /**
   * Manual refresh of user data
   */
  const refreshUserData = useCallback(async () => {
    return await fetchUserData();
  }, [fetchUserData]);

  return { 
    user, 
    loading, 
    error, 
    refreshUserData,
    clearAuthCookies
  };
};

export default useFetchUser;