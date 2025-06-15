import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaBell } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Fiverr
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className={`relative flex items-center border rounded-full transition-all duration-200 ${
              isSearchFocused ? 'border-blue-500 shadow-md' : 'border-gray-300'
            }`}>
              <input
                type="text"
                placeholder="Find Services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-4 pr-10 py-2 rounded-full focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Join
            </Link>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <FaUser />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <FaShoppingCart />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <FaBell />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 