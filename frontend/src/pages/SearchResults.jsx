import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaSort, FaThumbsUp, FaClock } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const query = searchParams.get('q') || '';

  // Dummy data - In a real app, this would come from an API
  const allGigs = [
    {
      id: 1,
      title: "Professional Logo Design",
      description: "I will create a unique and professional logo design for your brand",
      price: 100,
      rating: 4.9,
      reviews: 128,
      deliveryTime: "3 days",
      image: "/service2.jpeg",
      category: "logo-design-1",
      seller: {
        name: "John Doe",
        level: "Level 2 Seller"
      }
    },
    {
      id: 2,
      title: "AI Portrait Generation",
      description: "Create stunning AI-generated portraits in any style",
      price: 50,
      rating: 4.9,
      reviews: 215,
      deliveryTime: "1 day",
      image: "/service1.png",
      category: "ai-artists-1",
      seller: {
        name: "AI Master",
        level: "Top Rated Seller"
      }
    },
    {
      id: 3,
      title: "WordPress Website Development",
      description: "Create a professional WordPress website with custom design",
      price: 300,
      rating: 4.9,
      reviews: 245,
      deliveryTime: "5 days",
      image: "/service3.jpeg",
      category: "wordpress-1",
      seller: {
        name: "WP Expert",
        level: "Top Rated Seller"
      }
    },
    // Add more dummy gigs here
  ];

  useEffect(() => {
    // Filter gigs based on search query
    const filteredGigs = allGigs.filter(gig => 
      gig.title.toLowerCase().includes(query.toLowerCase()) ||
      gig.description.toLowerCase().includes(query.toLowerCase()) ||
      gig.seller.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredGigs);
  }, [query]);

  const handleGigClick = (gigId, categoryId) => {
    navigate(`/category/${categoryId}/gig/${gigId}`);
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Search Results for "{query}"
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{searchResults.length} services found</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search services..."
                value={query}
                onChange={(e) => navigate(`/search?q=${e.target.value}`)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Delivery Time</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Any</option>
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                  </select>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Seller Level</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Any</option>
                    <option value="top">Top Rated</option>
                    <option value="level2">Level 2</option>
                    <option value="level1">Level 1</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((gig) => (
              <div
                key={gig.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleGigClick(gig.id, gig.category)}
              >
                <div className="relative">
                  <img
                    src={gig.image}
                    alt={gig.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <FaThumbsUp className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${gig.seller.name}&background=random`}
                      alt={gig.seller.name}
                      className="w-8 h-8 rounded-full ring-2 ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">{gig.seller.name}</span>
                      <span className="text-xs text-gray-500 block">({gig.seller.level})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {gig.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <FaStar className="text-yellow-400" />
                      <span className="font-semibold ml-1">{gig.rating}</span>
                      <span className="text-gray-500 ml-1">({gig.reviews})</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaClock className="mr-1" />
                      <span className="text-sm">{gig.deliveryTime}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gig.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      Starting at
                    </span>
                    <span className="text-xl font-bold text-gray-800">
                      ${gig.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No results found</h2>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 