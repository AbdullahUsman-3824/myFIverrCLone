import React from "react";
import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/auth";

const RegisterPage = () => {
  return (
    <>
      {/* Registration Form */}
      <RegisterForm />

      {/* Login Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-500 hover:underline transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Optional Terms and Conditions */}
      <div className="mt-4 text-center text-xs text-gray-500">
        By registering, you agree to our{" "}
        <Link to="/terms" className="text-blue-500 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-blue-500 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </>
  );
};

export default RegisterPage;
