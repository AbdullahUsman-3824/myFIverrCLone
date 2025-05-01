import React from "react";
import { LoginForm } from "../../components/auth";
import { Link } from "react-router-dom"; // Changed from <a> to <Link>

const LoginPage = () => {
  return (
    <>
      {/* LoginForm Component */}
      <LoginForm />

      {/* Optional Signup Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-500 hover:underline transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>

      {/* Forgot Password Link */}
      <div className="mt-2 text-center">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-blue-500 hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
