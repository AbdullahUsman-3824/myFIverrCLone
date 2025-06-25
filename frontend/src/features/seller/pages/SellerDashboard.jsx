import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/apiClient";
import { SELLER_DASHBOARD_URL } from "../../../utils/constants";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FiUser,
  FiShoppingBag,
  FiDollarSign,
  FiMessageSquare,
  FiTrendingUp,
  FiArrowLeft,
} from "react-icons/fi";
import { useStateProvider } from "../../../context/StateContext";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [{ userInfo }] = useStateProvider();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await api.get(SELLER_DASHBOARD_URL);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Please login to view this page
        </div>
      </div>
    );
  }
  if (loading || !dashboardData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-8 md:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white hover:text-black transition"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userInfo.username}!
              </h1>
              <p className="text-green-100">
                Here's what's happening with your business today.
              </p>
            </div>
            <button
              onClick={() => navigate("/seller/profile")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors duration-300"
            >
              <FiUser className="w-5 h-5" />
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 md:px-32 -mt-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => navigate("/seller/gigs")}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Gigs
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {dashboardData.gigs}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiShoppingBag className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/seller/orders")}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Active Orders
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {dashboardData.orders}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiMessageSquare className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/seller/messages")}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Unread Messages
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {dashboardData.unreadMessages}
                  </h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiMessageSquare className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Earnings Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Today's Earnings
                  </h3>
                  <FiDollarSign className="text-green-600 text-xl" />
                </div>
                <p className="text-3xl font-bold text-green-600">
                  ${dashboardData.dailyRevenue}
                </p>
                <p className="text-sm text-gray-500 mt-2">Updated just now</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Monthly Earnings
                  </h3>
                  <FiTrendingUp className="text-blue-600 text-xl" />
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  ${dashboardData.monthlyRevenue}
                </p>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Total Revenue
                  </h3>
                  <FiDollarSign className="text-purple-600 text-xl" />
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  ${dashboardData.revenue}
                </p>
                <p className="text-sm text-gray-500 mt-2">All time</p>
              </div>
            </div>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/seller/gigs/create")}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Create New Gig
                </button>
                <button
                  onClick={() => navigate("/seller/orders")}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  <FiMessageSquare className="w-5 h-5" />
                  View Orders
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiMessageSquare className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      New order received
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiDollarSign className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Payment received
                    </p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
