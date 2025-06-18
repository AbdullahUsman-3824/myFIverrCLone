import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import FiverrLogo from "../../../components/shared/FiverrLogo";

function FiverrBusiness() {
  return (
    <div className="bg-[#0d084d] px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10">
      <div className="text-white flex flex-col gap-4 sm:gap-6 justify-center items-start order-2 lg:order-1">
        <div className="flex gap-2 items-center">
          <FiverrLogo fillColor={"#ffffff"} />
          <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Business</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">A solution built for business</h2>
        <h4 className="text-sm sm:text-base md:text-lg lg:text-xl">
          Upgrade to a curated experience to access vetted talent and exclusive
          tools
        </h4>
        <ul className="flex flex-col gap-3 sm:gap-4">
          <li className="flex gap-2 items-center">
            <BsCheckCircle className="text-[#62646a] text-lg sm:text-xl md:text-2xl flex-shrink-0" />
            <span className="text-sm sm:text-base">Talent matching</span>
          </li>
          <li className="flex gap-2 items-center">
            <BsCheckCircle className="text-[#62646a] text-lg sm:text-xl md:text-2xl flex-shrink-0" />
            <span className="text-sm sm:text-base">Dedicated account management</span>
          </li>
          <li className="flex gap-2 items-center">
            <BsCheckCircle className="text-[#62646a] text-lg sm:text-xl md:text-2xl flex-shrink-0" />
            <span className="text-sm sm:text-base">Team collaboration tools</span>
          </li>
          <li className="flex gap-2 items-center">
            <BsCheckCircle className="text-[#62646a] text-lg sm:text-xl md:text-2xl flex-shrink-0" />
            <span className="text-sm sm:text-base">Business payment solutions</span>
          </li>
        </ul>
        <button
          className="border text-sm sm:text-base font-medium px-4 sm:px-5 py-2 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md hover:bg-[#19a866] transition-colors duration-300"
          type="button"
        >
          Explore Fiverr Business
        </button>
      </div>
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[512px] w-full lg:w-2/3 order-1 lg:order-2">
        <img 
          src="/business.webp" 
          alt="business" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}

export default FiverrBusiness;