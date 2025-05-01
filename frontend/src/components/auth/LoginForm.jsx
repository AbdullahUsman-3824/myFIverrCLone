import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error: apiError, resetError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const onSubmit = async (data) => {
    resetError(); // Clear previous API errors
    await login({
      email: data.email,
      password: data.password,
    });
  };

  // Display API errors for specific fields
  const getApiError = (fieldName) => {
    if (!apiError) return null;

    // Handle non_field_errors (common in Django)
    if (apiError.non_field_errors) {
      return fieldName === "password" ? apiError.non_field_errors[0] : null;
    }

    return apiError[fieldName]?.[0] || null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Combined Error Display (for general errors) */}
      {(apiError?.detail || apiError?.non_field_errors) && (
        <div className="p-4 mb-4 bg-red-50 rounded-md flex items-start">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              {apiError.detail || "Login Error"}
            </h3>
            {apiError.non_field_errors && (
              <p className="mt-1 text-sm text-red-700">
                {apiError.non_field_errors.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Email Field */}
      <div className="form-group">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            className={`w-full px-3 py-2 border ${
              errors.email || getApiError("email")
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            placeholder="Enter email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {(errors.email || getApiError("email")) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        {getApiError("email") && !errors.email && (
          <p className="mt-1 text-sm text-red-600">{getApiError("email")}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`w-full px-3 py-2 border ${
              errors.password || getApiError("password")
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-md shadow-sm focus:outline-none focus:ring-1 pr-10`}
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
          {(errors.password || getApiError("password")) && (
            <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        {getApiError("password") && !errors.password && (
          <p className="mt-1 text-sm text-red-600">{getApiError("password")}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
