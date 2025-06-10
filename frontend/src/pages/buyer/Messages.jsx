import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaArrowRight } from 'react-icons/fa';

const BuyerMessages = () => {
  // Dummy messages data
  const messages = [
    {
      id: 1,
      orderId: "ORD001",
      sellerName: "John Smith",
      lastMessage: "I'll start working on your logo design today",
      timestamp: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      orderId: "ORD002",
      sellerName: "Sarah Johnson",
      lastMessage: "The SEO report is ready for review",
      timestamp: "1 day ago",
      unread: false
    },
    {
      id: 3,
      orderId: "ORD003",
      sellerName: "Mike Brown",
      lastMessage: "I've completed the website development",
      timestamp: "3 days ago",
      unread: false
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>
          <div className="space-y-4">
            {messages.map((message) => (
              <Link
                key={message.id}
                to={`/buyer/orders/${message.orderId}/messages`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaComments className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{message.sellerName}</h3>
                      <p className="text-gray-600 text-sm">Order #{message.orderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-sm ${message.unread ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                        {message.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500">{message.timestamp}</p>
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