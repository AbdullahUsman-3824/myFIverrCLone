import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "../../../components/common/Spinner";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [validationError, setValidationError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const { uid, token } = useParams();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validatePasswords = () => {
    if (!passwords.new_password1 || !passwords.new_password2) {
      setValidationError("Both passwords are required");
      return false;
    }

    if (passwords.new_password1 !== passwords.new_password2) {
      setValidationError("Passwords do not match");
      return false;
    }

    if (passwords.new_password1.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    if (!uid || !token) {
      setValidationError("Invalid or expired reset link");
      return;
    }

    setValidationError(null);

    const result = await resetPassword({
      uid,
      token,
      new_password1: passwords.new_password1,
      new_password2: passwords.new_password2,
    });

    if (result.success) {
      setSuccess(true);
    }
    // Errors are handled by authError state from the hook
  };

  // Combine validation errors and auth errors for display
  const displayError = validationError || authError;

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Reset Your Password
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <input
              type="password"
              name="new_password1"
              value={passwords.new_password1}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              disabled={isLoading}
              aria-label="New password"
              aria-invalid={!!displayError}
            />
          </div>

          <div>
            <input
              type="password"
              name="new_password2"
              value={passwords.new_password2}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              disabled={isLoading}
              aria-label="Confirm new password"
              aria-invalid={!!displayError}
            />
          </div>

          {displayError && (
            <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
              {displayError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
