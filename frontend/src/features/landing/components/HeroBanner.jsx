import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

function HomeBanner() {
  const navigate = useNavigate();
  const [image, setImage] = useState(1);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    const interval = setInterval(
      () => setImage(image >= 6 ? 1 : image + 1),
      10000
    );
    return () => clearInterval(interval);
  }, [image]);

  return (
    <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[680px] relative bg-cover">
      <div className="absolute top-0 right-0 w-[110vw] h-full transition-opacity z-0">
        <img
          alt="hero"
          src="/bg-hero1.webp"
          className={`absolute w-full h-full object-cover ${
            image === 1 ? "opacity-100" : "opacity-0"
          } transition-all duration-1000`}
        />
        <img
          alt="hero"
          src="/bg-hero2.webp"
          className={`absolute w-full h-full object-cover ${
            image === 2 ? "opacity-100" : "opacity-0"
          } transition-all duration-1000`}
        />
        <img
          alt="hero"
          src="/bg-hero3.webp"
          className={`absolute w-full h-full object-cover ${
            image === 3 ? "opacity-100" : "opacity-0"
          } transition-all duration-1000`}
        />
        <img
          alt="hero"
          src="/bg-hero4.webp"
          className={`absolute w-full h-full object-cover ${
            image === 4 ? "opacity-100" : "opacity-0"
          } transition-all duration-1000`}
        />
        <img
          alt="hero"
          src="/bg-hero5.webp"
          className={`absolute w-full h-full object-cover ${
            image === 5 ? "opacity-100" : "opacity-0"
          } transition-all duration-1000`}
        />
        <img
          alt="hero"
          src="/bg-hero6.webp"
          className={`absolute w-full h-full object-cover ${
            image === 6 ? "opacity-100" : "opacity-0"
          } transition-all duration-1000`}
        />
      </div>
      <div className="z-10 relative w-full px-4 sm:px-6 md:px-8 lg:px-20 flex justify-center flex-col h-full gap-3 sm:gap-4 md:gap-5">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-snug font-bold">
          Find the perfect&nbsp;
          <i>freelance</i>
          <br />
          services for your business
        </h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (searchData.trim()) {
            navigate(`/search?q=${searchData.trim()}`);
          }
        }} className="flex flex-col sm:flex-row align-middle gap-2 sm:gap-0 max-w-2xl">
          <div className="relative flex-1">
            <IoSearchOutline className="absolute text-gray-500 text-lg sm:text-xl md:text-2xl flex align-middle h-full left-2 sm:left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              className="h-12 sm:h-14 w-full pl-8 sm:pl-10 pr-4 rounded-md sm:rounded-r-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
              placeholder={`Try "building mobile app"`}
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#1DBF73] text-white px-6 sm:px-8 md:px-12 h-12 sm:h-14 text-sm sm:text-base md:text-lg font-semibold rounded-md sm:rounded-l-none hover:bg-[#19a866] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:ring-offset-2"
          >
            Search
          </button>
        </form>
        <div className="text-white flex flex-col gap-2">
          <span className="font-semibold text-sm sm:text-base">Popular:</span>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { label: "Website Design", query: "website design" },
              { label: "WordPress", query: "wordpress" },
              { label: "Logo Design", query: "logo design" },
              { label: "AI Services", query: "ai services" },
            ].map(({ label, query }) => (
              <li
                key={label}
                className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-4 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/search?q=${query}`)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;