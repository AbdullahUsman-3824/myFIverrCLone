import React from "react";

function SellerDashboard() {
  const dummyUserInfo = {
    username: "workerr_dev",
    fullName: "Muhammad Abdullah Usman",
    email: "abdullah@example.com",
    description: "I'm a full-stack developer specializing in the MERN stack.",
    imageName: "", // leave blank to show initials
  };

  const dummyDashboardData = {
    gigs: 8,
    orders: 12,
    unreadMessages: 5,
    dailyRevenue: 120,
    monthlyRevenue: 2450,
    revenue: 32200,
  };

  return (
    <div className="flex min-h-[80vh] my-10 mt-0 px-32 gap-5">
      {/* Left Card */}
      <div className="shadow-md h-max p-10 flex flex-col gap-5 min-w-96 w-96">
        <div className="flex gap-5 justify-center items-center">
          <div>
            {dummyUserInfo?.imageName ? (
              <img
                src={dummyUserInfo.imageName}
                alt="Profile"
                width={140}
                height={140}
                className="rounded-full"
              />
            ) : (
              <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full">
                <span className="text-5xl text-white">
                  {dummyUserInfo.email[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#62646a] text-lg font-medium">
              {dummyUserInfo.username}
            </span>
            <span className="font-bold text-md">
              {dummyUserInfo.fullName}
            </span>
          </div>
        </div>
        <div className="border-t py-5">
          <p>{dummyUserInfo.description}</p>
        </div>
      </div>

      {/* Right Cards */}
      <div className="grid grid-cols-3 gap-10 w-full">
        {[
          { label: "Total Gigs", value: dummyDashboardData.gigs },
          { label: "Total Orders", value: dummyDashboardData.orders },
          { label: "Unread Messages", value: dummyDashboardData.unreadMessages },
          { label: "Earnings Today", value: `$${dummyDashboardData.dailyRevenue}` },
          { label: "Earnings Monthly", value: `$${dummyDashboardData.monthlyRevenue}` },
          { label: "Earnings Yearly", value: `$${dummyDashboardData.revenue}` },
        ].map((item, index) => (
          <div
            key={index}
            className="shadow-md h-max p-10 flex flex-col gap-2 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-xl">{item.label}</h2>
            <h3 className="text-[#1DBF73] text-3xl font-extrabold">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerDashboard;
