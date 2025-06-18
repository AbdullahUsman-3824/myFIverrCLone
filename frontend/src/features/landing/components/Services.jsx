import { categories } from "../../../utils/categories";
import { useNavigate } from "react-router-dom";

function Services() {
  const navigate = useNavigate();

  return (
    <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-8 sm:my-12 md:my-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 md:mb-10 text-[#404145] font-bold px-4 sm:px-0">
        You need it, we&apos;ve got it
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {categories.map(({ name, logo }) => {
          return (
            <li
              key={name}
              className="flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl hover:border-[#1DBF73] border-2 border-transparent p-3 sm:p-4 md:p-5 transition-all duration-500 rounded-lg"
              onClick={() => navigate(`/search?category=${name}`)}
            >
              <img src={logo} alt="category" className="h-8 w-8 sm:h-10 sm:w-10 md:h-[50px] md:w-[50px] mb-2 sm:mb-3" />
              <span className="text-xs sm:text-sm md:text-base text-center">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Services;