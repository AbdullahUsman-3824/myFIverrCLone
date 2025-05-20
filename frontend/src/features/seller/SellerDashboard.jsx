import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // You can keep this if you plan to use API later

const SellerDashboard = () => {
  const user = {
    email: "test@example.com",
    username: "testuser",
    fullName: "Test User",
    profileImage: null,
    description: "Test seller description",
  };

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    gigs: 0,
    orders: 0,
    unreadMessages: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Set hardcoded dummy values
    setDashboardData({
      gigs: 3,
      orders: 3,
      unreadMessages: 2,
      dailyRevenue: 120,
      monthlyRevenue: 2400,
      revenue: 18000,
    });
  }, []);

  if (!user) {
    return <div>Please login to view this page</div>;
  }

  return (
    <div className="flex min-h-[80vh] pt-24 px-8 md:px-32 gap-5">
      {/* Profile Section */}
      <div className="shadow-md h-max p-10 flex flex-col gap-5 min-w-96 w-96">
        <div className="flex gap-5 justify-center items-center">
          <div>
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full">
                <span className="text-5xl text-white">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#62646a] text-lg font-medium">
              {user.username}
            </span>
            <span className="font-bold text-md">{user.fullName}</span>
          </div>
        </div>
        <div className="border-t py-5">
          <p>{user.description || "No description available"}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <div
            className="shadow-md p-6 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/seller/gigs")}
          >
            <h2 className="text-xl">Total Gigs</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              {dashboardData.gigs}
            </h3>
          </div>

          <div
            className="shadow-md p-6 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/seller/orders")}
          >
            <h2 className="text-xl">Total Orders</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              {dashboardData.orders}
            </h3>
          </div>

          <div
            className="shadow-md p-6 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/seller/messages")}
          >
            <h2 className="text-xl">Unread Messages</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              {dashboardData.unreadMessages}
            </h3>
          </div>

          <div className="shadow-md p-6 flex flex-col gap-2">
            <h2 className="text-xl">Earnings Today</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              ${dashboardData.dailyRevenue}
            </h3>
          </div>

          <div className="shadow-md p-6 flex flex-col gap-2">
            <h2 className="text-xl">Earnings Monthly</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              ${dashboardData.monthlyRevenue}
            </h3>
          </div>

          <div className="shadow-md p-6 flex flex-col gap-2">
            <h2 className="text-xl">Earnings Yearly</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              ${dashboardData.revenue}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
