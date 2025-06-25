import React from "react";
import { Link } from "react-router-dom";
import { FaComments, FaArrowRight } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BuyerMessages = () => {
  const navigate = useNavigate();
  const messages = [
    {
      id: 1,
      orderId: "ORD001",
      sellerName: "John Smith",
      lastMessage: "I'll start working on your logo design today",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      orderId: "ORD002",
      sellerName: "Sarah Johnson",
      lastMessage: "The SEO report is ready for review",
      timestamp: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      orderId: "ORD003",
      sellerName: "Mike Brown",
      lastMessage: "I've completed the website development",
      timestamp: "3 days ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen pt-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm font-medium text-[#1dbf73] hover:text-green-600 hover:underline transition"
            >
              <FiArrowLeft className="text-base" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <div className="space-y-4">
            {messages.map((message) => (
              <Link
                key={message.id}
                to={`/buyer/orders/${message.orderId}/messages`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <div className="flex items-center justify-between gap-6">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div className="bg-[#e6f5ea] p-3 rounded-full">
                      <FaComments className="text-[#1dbf73] text-xl" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {message.sellerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order #{message.orderId}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p
                        className={`text-sm ${
                          message.unread
                            ? "text-gray-900 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {message.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400">
                        {message.timestamp}
                      </p>
                    </div>
                    <FaArrowRight className="text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerMessages;
