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
      });
      dispatch(setUser(response.data.user));
      setError(null);
      navigate(redirectPath);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(
        credentialResponse.credential
      );
      handleAuthSuccess(response);
    } catch (err) {
      console.error("Google login failed:", err);
      setError(err.response?.data || { detail: "Google login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      handleAuthSuccess(response);
    } catch (err) {
      setError(err.response?.data || { detail: "Login failed" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      navigate("/verify-email", {
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
      const response = await authService.verifyEmail(key);
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
      const response = await authService.resendVerificationEmail(email);
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
      await authService.logout();
    } finally {
      removeCookie("jwt", { path: "/" });
      removeCookie("jwt-refresh", { path: "/" });
      dispatch(setUser(null));
      navigate("/");
    }
  };

  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    try {
      const response = await authService.requestPasswordReset(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data || { detail: "Failed to send reset email" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(resetData);
      return response.data;
    } catch (err) {
      setError(err.response?.data || { detail: "Failed to reset password" });
      throw err;
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
    handleAuthSuccess,
  };
};

export default useAuth;
