import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register: authRegister,
    isLoading,
    error: apiError,
    resetError,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    resetError(); // Clear previous API errors

    // Handle password mismatch before API call
    if (data.password !== data.confirmPassword) {
      setFormError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await authRegister({
        username: data.username,
        email: data.email,
        password1: data.password,
        password2: data.confirmPassword,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      // If registration is successful but needs verification
      // navigate("/auth/verify-email");
    } catch (error) {
      // Errors are already handled by useAuth hook
    }
  };

  // Display API errors for specific fields
  const getApiError = (fieldName) => {
    if (!apiError) return null;

    // Map dj-rest-auth field names to our form names
    const fieldMap = {
      username: "username",
      email: "email",
      password1: "password",
      password2: "confirmPassword",
      first_name: "firstName",
      last_name: "lastName",
    };

    // Find the matching error
    for (const [apiField, formField] of Object.entries(fieldMap)) {
      if (apiField === fieldName && apiError[apiField]) {
        return apiError[apiField][0];
      }
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* General Error Display */}
      {apiError?.detail && (
        <div className="p-4 mb-4 bg-red-50 rounded-md flex items-start">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              {apiError.detail}
            </h3>
          </div>
        </div>
      )}

      {/* Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="form-group">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser
                className={`h-5 w-5 ${
                  errors.firstName || getApiError("firstName")
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              />
            </div>
            <input
              id="firstName"
              type="text"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.firstName || getApiError("firstName")
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              } rounded-md shadow-sm focus:outline-none focus:ring-1`}
              placeholder="John"
              {...register("firstName", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
              })}
            />
            {!errors.firstName &&
              !getApiError("firstName") &&
              watch("firstName")?.length > 1 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <FiCheck className="h-5 w-5 text-green-500" />
                </div>
              )}
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.firstName.message}
            </p>
          )}
          {getApiError("firstName") && !errors.firstName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {getApiError("firstName")}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser
                className={`h-5 w-5 ${
                  errors.lastName || getApiError("lastName")
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              />
            </div>
            <input
              id="lastName"
              type="text"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.lastName || getApiError("lastName")
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              } rounded-md shadow-sm focus:outline-none focus:ring-1`}
              placeholder="Doe"
              {...register("lastName", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
              })}
            />
            {!errors.lastName &&
              !getApiError("lastName") &&
              watch("lastName")?.length > 1 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <FiCheck className="h-5 w-5 text-green-500" />
                </div>
              )}
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {errors.lastName.message}
            </p>
          )}
          {getApiError("lastName") && !errors.lastName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="mr-1" /> {getApiError("lastName")}
            </p>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="form-group">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser
              className={`h-5 w-5 ${
                errors.username || getApiError("username")
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="username"
            type="text"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.username || getApiError("username")
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            placeholder="johndoe123"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Must be at least 3 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Only letters, numbers and underscores allowed",
              },
            })}
          />
          {!errors.username &&
            !getApiError("username") &&
            watch("username")?.length > 2 && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <FiCheck className="h-5 w-5 text-green-500" />
              </div>
            )}
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.username.message}
          </p>
        )}
        {getApiError("username") && !errors.username && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {getApiError("username")}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail
              className={`h-5 w-5 ${
                errors.email || getApiError("email")
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="email"
            type="email"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.email || getApiError("email")
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            placeholder="john@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {!errors.email && !getApiError("email") && watch("email") && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <FiCheck className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.email.message}
          </p>
        )}
        {getApiError("email") && !errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {getApiError("email")}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock
              className={`h-5 w-5 ${
                errors.password || getApiError("password1")
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`w-full pl-10 pr-10 py-2 border ${
              errors.password || getApiError("password1")
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: {
                hasNumber: (value) =>
                  /[0-9]/.test(value) || "Needs at least one number",
                hasSpecial: (value) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                  "Needs at least one special character",
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
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.password.message}
          </p>
        )}
        {getApiError("password1") && !errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {getApiError("password1")}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock
              className={`h-5 w-5 ${
                errors.confirmPassword || getApiError("password2")
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full pl-10 pr-10 py-2 border ${
              errors.confirmPassword || getApiError("password2")
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {errors.confirmPassword.message}
          </p>
        )}
        {getApiError("password2") && !errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="mr-1" /> {getApiError("password2")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
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
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
