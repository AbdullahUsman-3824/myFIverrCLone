import React from "react";
import { BsCheckCircle } from "react-icons/bs";

function Everything() {
  const everythingData = [
    {
      title: "Stick to your budget",
      subtitle:
        "Find the right service for every price point. No hourly rates, just project-based pricing.",
    },
    {
      title: "Get quality work done quickly",
      subtitle:
        "Hand your project over to a talented freelancer in minutes, get long-lasting results.",
    },
    {
      title: "Pay when you're happy",
      subtitle:
        "Upfront quotes mean no surprises. Payments only get released when you approve.",
    },
    {
      title: "Count on 24/7 support",
      subtitle:
        "Our round-the-clock support team is available to help anytime, anywhere.",
    },
  ];
  return (
    <div className="bg-[#f1fdf7] flex flex-col lg:flex-row py-8 sm:py-12 md:py-16 lg:py-20 justify-between px-4 sm:px-8 md:px-12 lg:px-24 gap-6 sm:gap-8 md:gap-10">
      <div className="order-2 lg:order-1">
        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 text-[#404145] font-bold">
          The best part? Everything.
        </h2>
        <ul className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          {everythingData.map(({ title, subtitle }) => {
            return (
              <li key={title}>
                <div className="flex gap-2 items-start text-base sm:text-lg md:text-xl">
                  <BsCheckCircle className="text-[#62646a] text-lg sm:text-xl md:text-2xl flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold">{title}</h4>
                </div>
                <p className="text-[#62646a] text-sm sm:text-base mt-1 sm:mt-2 ml-6 sm:ml-8">{subtitle}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full lg:w-2/4 order-1 lg:order-2">
        <img 
          src="/everything.webp" 
          alt="everything" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}

export default Everything;