import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";

const EmailVerification = () => {
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [{ userInfo }, dispatch] = useStateProvider();
  const email = userInfo?.email || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const key = searchParams.get("key");
    if (key) {
      handleVerification(key);
    }
  }, [searchParams]);

  const handleVerification = async (key) => {
    setLoading(true);
    setError(null);
    try {
      await verifyEmail(key);
      setVerificationSuccess(true);
      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 3000);
    } catch (err) {
      if (err.response) {
        // Server responded with a status code outside the range of 2xx
        setError(err.response.data.detail || "Failed to verify email");
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await resendVerificationEmail(email);
      setResendSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to resend verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    dispatch({
      type: reducerCases.SET_USER,
      userInfo: null,
    });
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
    navigate("/");
  };

  if (verificationSuccess) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-600">
            Your email has been verified. Redirecting to your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Verify Your Email
      </h2>

      {email ? (
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">
            We've sent a verification email to:
          </p>
          <p className="font-medium text-blue-600">{email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your inbox and click the verification link to continue.
          </p>
        </div>
      ) : (
        <div className="text-center mb-6 text-sm text-gray-600">
          If you came here from a verification link, your email will be verified
          automatically.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded text-sm">
          Verification email resent successfully!
        </div>
      )}

      <div className="space-y-4">
        {email && (
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        )}

        <button
          onClick={handleBackToLogin}
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
        >
          Back to Login
        </button>
      </div>

      {email && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="text-blue-500 hover:underline"
            >
              click here to resend
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
