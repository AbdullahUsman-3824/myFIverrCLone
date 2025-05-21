import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaComments, FaUserCircle, FaChartLine, FaBell, FaCog } from 'react-icons/fa';

const BuyerHome = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-xl text-blue-100">Manage your orders, messages, and profile all in one place</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Orders</p>
                <h3 className="text-2xl font-bold text-gray-800">3</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaShoppingBag className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Unread Messages</p>
                <h3 className="text-2xl font-bold text-gray-800">5</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaComments className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <h3 className="text-2xl font-bold text-gray-800">$1,250</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Orders Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaShoppingBag className="text-blue-600 text-xl" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">Track and manage your active orders</p>
              <Link 
                to="/buyer/orders" 
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Messages Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaComments className="text-green-600 text-xl" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">Communicate with sellers about your orders</p>
              <Link 
                to="/buyer/messages" 
                className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                View Messages
              </Link>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FaUserCircle className="text-purple-600 text-xl" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">Manage your account settings and preferences</p>
              <Link 
                to="/profile" 
                className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <FaBell className="text-blue-600" />
              <span>Notifications</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <FaCog className="text-gray-600" />
              <span>Settings</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <FaChartLine className="text-green-600" />
              <span>Analytics</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
              <FaShoppingBag className="text-purple-600" />
              <span>Browse Gigs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
