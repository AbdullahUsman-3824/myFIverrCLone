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
    <div className="h-[680px] relative bg-cover">
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
      <div className="z-10 relative w-[650px] flex justify-center flex-col h-full gap-5 ml-20">
        <h1 className="text-white text-5xl leading-snug">
          Find the perfect&nbsp;
          <i>freelance</i>
          <br />
          services for your business
        </h1>
        <div className="flex align-middle">
          <div className="relative">
            <IoSearchOutline className="absolute text-gray-500 text-2xl flex align-middle h-full left-2" />
            <input
              type="text"
              className="h-14 w-[450px] pl-10 rounded-md rounded-r-none"
              placeholder={`Try "building mobile app"`}
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <button
            className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md"
            onClick={() => navigate(`/search?q=${searchData}`)}
          >
            Search
          </button>
        </div>
        <div className="text-white flex flex-col gap-2">
  <span className="font-semibold">Popular:</span>
  <ul className="flex flex-wrap gap-3">
    {[
      { label: "Website Design", query: "website design" },
      { label: "WordPress", query: "wordpress" },
      { label: "Logo Design", query: "logo design" },
      { label: "AI Services", query: "ai services" },
    ].map(({ label, query }) => (
      <li
        key={label}
        className="text-sm py-1.5 px-4 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
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