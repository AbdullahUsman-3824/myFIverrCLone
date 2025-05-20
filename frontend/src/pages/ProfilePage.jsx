import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../context/StateContext";
import { FiUser, FiMail, FiCamera, FiBriefcase } from "react-icons/fi";
import axios from "axios";
import { HOST } from "../utils/constants";

function ProfilePage() {
  const navigate = useNavigate();
  const [state, dispatch] = useStateProvider();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingToSeller, setIsSwitchingToSeller] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const { data } = await axios.post(
        `${HOST}/api/users/profile`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      dispatch({
        type: "SET_USER",
        userInfo: data.user,
      });

      navigate("/");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSeller = async () => {
    setIsSwitchingToSeller(true);
    try {
      const { data } = await axios.post(
        `${HOST}/api/users/switch-to-seller`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "SET_USER",
        userInfo: data.user,
      });

      navigate("/seller");
    } catch (error) {
      console.error("Failed to switch to seller:", error);
    } finally {
      setIsSwitchingToSeller(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
                >
                  <FiCamera className="w-5 h-5 text-gray-600" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
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
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>

          {/* Switch to Seller Section */}
          {!state.userInfo?.isSeller && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Become a Seller
              </h3>
              <p className="text-gray-600 mb-4">
                Start selling your services and earn money by becoming a seller on our platform.
              </p>
              <button
                onClick={handleSwitchToSeller}
                disabled={isSwitchingToSeller}
                className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isSwitchingToSeller ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FiBriefcase className="mr-2" />
                {isSwitchingToSeller ? "Switching..." : "Switch to Seller"}
              </button>
            </div>
          )}

          {/* Seller Dashboard Link */}
          {state.userInfo?.isSeller && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seller Dashboard
              </h3>
              <p className="text-gray-600 mb-4">
                Access your seller dashboard to manage your gigs, orders, and earnings.
              </p>
              <button
                onClick={() => navigate("/seller")}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiBriefcase className="mr-2" />
                Go to Seller Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
