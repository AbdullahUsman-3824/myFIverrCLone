import React, { useState, useEffect, use } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaSort,
  FaThumbsUp,
  FaClock,
} from "react-icons/fa";
import api from "../utils/apiClient";
import { GIG_ROUTE } from "../utils/constants";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await api.get(GIG_ROUTE, {
          params: { q: query, sort: sortBy },
        });
        console.log(response);
        setSearchResults(response.data.results);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, sortBy]);

  const handleGigClick = (gigId) => {
    navigate(`/gig/${gigId}`);
  };

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Search Results for "{query}"
            </h1>
            <span className="text-gray-500">
              {searchResults.length} services found
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search services..."
                value={query}
                onChange={(e) => navigate(`/search?q=${e.target.value}`)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative flex-1 md:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((gig) => (
              <div
                key={gig.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleGigClick(gig.id, gig.category)}
              >
                <img
                  src={gig.thumbnail_image || "/default-gig.jpg"}
                  alt={gig.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={
                        gig.seller?.user?.profile_picture || "/default-user.png"
                      }
                      alt={gig.seller?.user?.username || "Seller"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {gig.seller?.user?.first_name}{" "}
                        {gig.seller?.user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{gig.seller?.user?.username}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {gig.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Starting at</span>
                    <span className="text-xl font-bold text-gray-800">
                      ${gig.packages[0]?.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No results found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
