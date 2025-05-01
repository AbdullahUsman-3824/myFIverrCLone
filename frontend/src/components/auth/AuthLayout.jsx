import React from "react";
import { Outlet } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; // Example icon (install react-icons)

const AuthLayout = ({
  title = "MyFiverr", // Default title
  subtitle = "Welcome to the site!", // Default subtitle
  showBackButton = false, // Back button for navigation
  onBackClick = () => {}, // Custom back handler
  logo = null, // Custom logo/JSX
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Header with back button, logo, and text */}
        <div className="text-center mb-6 relative">
          {/* Back button (conditionally rendered) */}
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 
                        p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-gray-600" />
            </button>
          )}

          {/* Custom logo or default text */}
          {logo ? (
            <div className="mb-4">{logo}</div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <p className="text-gray-500 mt-1">{subtitle}</p>
            </>
          )}
        </div>

        {/* Auth form container */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
