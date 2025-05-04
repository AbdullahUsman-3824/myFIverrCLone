import { categories } from "../../utils/categories";
import React from "react";
import { useNavigate } from "react-router-dom";

function Services() {
  const navigate = useNavigate();

  return (
    <div className="mx-20 my-16 ">
      <h2 className="text-4xl mb-10 text-[#404145] font-bold ">
        You need it, we&apos;ve got it
      </h2>
      <ul className="grid grid-cols-5 gap-10">
        {categories.map(({ name, logo }) => {
          return (
            <li
              key={name}
              className="flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl hover:border-[#1DBF73]  border-2 border-transparent p-5 transition-all duration-500"
              onClick={() => navigate(`/search?category=${name}`)}
            >
              <img src={logo} alt="category" className="h-[50px] w-[50px]" />
              <span>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Services;