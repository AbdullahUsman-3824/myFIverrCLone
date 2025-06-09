import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useStateProvider } from "../../../context/StateContext";
import { setUser } from "../../../context/StateReducer";
import * as authService from "../authService";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "jwt-refresh"]);
  const [{ userInfo }, dispatch] = useStateProvider();

  const handleAuthSuccess = (response, redirectPath = "/") => {
    if (response.data.access) {
      setCookie("jwt", response.data.access, {
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 3600,
      });
    }
    if (response.data.refresh) {
      setCookie("jwt-refresh", response.data.refresh, {
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 2592000,
      });
    }

    if (response.data.user) {
      dispatch(setUser(response.data.user));
    }

    setError(null);
    navigate(redirectPath);
  };

  const handleAuthError = (error, defaultMessage) => {
    const errorData = error.response?.data || error.data || {};
    const message =
      errorData.non_field_errors?.[0] ||
      errorData.detail ||
      errorData.message ||
      (typeof errorData === "string" ? errorData : error.message) ||
      defaultMessage;

    const formattedError = {
      status: error.status || error.response?.status,
      message,
      data: errorData,
    };

    console.error("Auth error:", formattedError);
    return message;
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.googleLogin(
        credentialResponse.credential
      );
      handleAuthSuccess(response);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = handleAuthError(err, "Google login failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(formData);
      handleAuthSuccess(response);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = handleAuthError(err, "Login failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(formData);
      return {
        success: true,
        error: null,
        data: response.data,
        email: formData.email,
      };
    } catch (err) {
      const errorMessage = handleAuthError(err, "Registration failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (key) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyEmail(key);
      return {
        success: true,
        error: null,
        data: response.data,
      };
    } catch (err) {
      const errorMessage = handleAuthError(err, "Email verification failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.resendVerificationEmail(email);
      return {
        success: true,
        error: null,
        data: response.data,
      };
    } catch (err) {
      const errorMessage = handleAuthError(
        err,
        "Failed to resend verification email"
      );
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      return { success: true, error: null };
    } catch (err) {
      // Even if logout fails, clear client-side auth
      console.error("Logout error:", err);
      const errorMessage = handleAuthError(err, "Logout failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      removeCookie("jwt", { path: "/" });
      removeCookie("jwt-refresh", { path: "/" });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(setUser(null));
      navigate("/");
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.requestPasswordReset(email);
      return {
        success: true,
        error: null,
        data: response.data,
      };
    } catch (err) {
      const errorMessage = handleAuthError(err, "Failed to send reset email");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(resetData);
      return {
        success: true,
        error: null,
        data: response.data,
      };
    } catch (err) {
      const errorMessage = handleAuthError(err, "Failed to reset password");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    isLoading,
    error,
    resetError: () => setError(null),
    handleGoogleLogin,
  };
};

export default useAuth;
