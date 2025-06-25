import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useFetchCategories from "../../gigs/hooks/useFetchCategories";

function Services() {
  const navigate = useNavigate();
  const { categories, loading, fetchCategories, error } = useFetchCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return (
    <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-8 sm:my-12 md:my-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 md:mb-10 text-[#404145] font-bold px-4 sm:px-0">
        You need it, we&apos;ve got it
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load categories.</p>
      ) : Array.isArray(categories) && categories.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {categories.map(({ id, name, image }) => (
            <li
              key={id}
              className="flex flex-col justify-center items-center cursor-pointer hover:shadow-xl hover:border-[#1DBF73] border-2 border-transparent p-4 sm:p-5 transition-all duration-300 rounded-lg bg-white"
              onClick={() => navigate(`/category/${id}`)}
            >
              <img
                src={image}
                alt={name}
                className="h-10 w-10 md:h-[50px] md:w-[50px] mb-3"
              />
              <span className="text-sm sm:text-base text-center font-medium text-gray-700">
                {name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No categories found.</p>
      )}
    </div>
  );
}

export default Services;
