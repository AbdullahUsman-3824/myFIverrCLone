import React from "react";
import { useStateProvider } from "../../context/StateContext";
import { FiMapPin, FiMail, FiShoppingBag, FiStar, FiDollarSign, FiClock, FiHeart } from "react-icons/fi";

const BuyerInfo = () => {
  const [{ userInfo }] = useStateProvider();

  // Dummy buyer profile data
  const dummyBuyerProfile = {
    profile_title: "Digital Marketing Specialist",
    location: "San Francisco, USA",
    email: "contact@example.com",
    bio: "Passionate about digital marketing and content creation. Looking for talented freelancers to help bring creative projects to life. Always seeking innovative solutions and quality work.",
    stats: {
      total_orders: 15,
      completed_orders: 12,
      active_orders: 3,
      total_spent: 2500
    },
    favorite_categories: [
      "Digital Marketing",
      "Content Writing",
      "Social Media",
      "SEO",
      "Graphic Design"
    ],
    recent_orders: [
      {
        title: "Social Media Campaign",
        status: "In Progress",
        date: "2024-03-15",
        amount: 500
      },
      {
        title: "Website Content Writing",
        status: "Completed",
        date: "2024-03-01",
        amount: 300
      },
      {
        title: "SEO Optimization",
        status: "Completed",
        date: "2024-02-20",
        amount: 400
      }
    ],
    saved_sellers: [
      {
        name: "John Smith",
        specialty: "Content Writing",
        rating: 4.9
      },
      {
        name: "Sarah Johnson",
        specialty: "Social Media Marketing",
        rating: 4.8
      },
      {
        name: "Mike Brown",
        specialty: "SEO Expert",
        rating: 4.7
      }
    ]
  };

  if (!userInfo) {
    return (
      <div className="min-h-[80vh] pt-24 px-8 md:px-32">
        <div className="text-center py-10">
          <p className="text-gray-500">Please login to view this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] pt-24 px-8 md:px-32 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-xl rounded-3xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              {userInfo.profile_picture ? (
                <img
                  src={userInfo.profile_picture}
                  alt="Profile"
                  className="w-40 h-40 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-5xl text-white font-bold">
                    {userInfo.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {dummyBuyerProfile.profile_title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                {dummyBuyerProfile.location && (
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                    <FiMapPin className="text-purple-500" />
                    <span>{dummyBuyerProfile.location}</span>
                  </div>
                )}
                {dummyBuyerProfile.email && (
                  <a
                    href={`mailto:${dummyBuyerProfile.email}`}
                    className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <FiMail className="text-blue-500" />
                    <span>Email</span>
                  </a>
                )}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {dummyBuyerProfile.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <FiShoppingBag className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{dummyBuyerProfile.stats.total_orders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FiStar className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{dummyBuyerProfile.stats.completed_orders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FiClock className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">{dummyBuyerProfile.stats.active_orders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FiDollarSign className="text-yellow-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${dummyBuyerProfile.stats.total_spent}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Favorite Categories */}
          <div className="bg-white shadow-xl rounded-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Favorite Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {dummyBuyerProfile.favorite_categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow-xl rounded-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Recent Orders
            </h2>
            <div className="space-y-4">
              {dummyBuyerProfile.recent_orders.map((order, index) => (
                <div
                  key={index}
                  className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-gray-50 rounded-r-xl transition-colors duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.title}</h3>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.amount}</p>
                      <span className={`text-sm ${
                        order.status === "Completed" ? "text-green-600" : "text-blue-600"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Sellers */}
          <div className="bg-white shadow-xl rounded-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300 md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Saved Sellers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dummyBuyerProfile.saved_sellers.map((seller, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FiHeart className="text-red-500 w-5 h-5" />
                    <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-2">{seller.specialty}</p>
                  <div className="flex items-center gap-1">
                    <FiStar className="text-yellow-400 w-4 h-4" />
                    <span className="text-gray-700 font-medium">{seller.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerInfo; 