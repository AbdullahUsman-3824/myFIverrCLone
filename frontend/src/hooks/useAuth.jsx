// src/hooks/useAuth.js
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For session/cookie auth
});

// Add JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/token/refresh/"
    ) {
      try {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
          const { data } = await api.post("/token/refresh/", { refresh });
          localStorage.setItem("accessToken", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuthSuccess = (response, redirectPath = "/") => {
    if (response.data.access_token) {
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token || "");
    }
    setError(null);
    navigate(redirectPath);
  };

  const login = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/login/", {
        email: formData.email,
        password: formData.password,
      });
      handleAuthSuccess(response, "/");
    } catch (err) {
      setError(err.response?.data || { detail: "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/registration/", {
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
      });

      // After successful registration, redirect to email verification
      navigate("/auth/verify-email", {
        state: { email: formData.email },
        replace: true,
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data || { detail: "Registration failed" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (key) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/registration/verify-email/`, { key });
      return response.data;
    } catch (err) {
      setError(err.response?.data || { detail: "Email verification failed" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email) => {
    setIsLoading(true);
    try {
      const response = await api.post("/registration/resend-email/", {
        email,
      });
      return response.data;
    } catch (err) {
      setError(
        err.response?.data || { detail: "Failed to resend verification email" }
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout/");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/auth/login");
    }
  };

  return {
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    isLoading,
    error,
    resetError: () => setError(null),
  };
};

export default useAuth;
