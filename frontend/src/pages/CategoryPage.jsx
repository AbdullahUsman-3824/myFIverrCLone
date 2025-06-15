import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaSort, FaThumbsUp, FaClock, FaUser } from 'react-icons/fa';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Category-specific gigs data
  const categoryGigs = {
    'logo-design-1': [
      {
        id: 1,
        title: "Professional Logo Design",
        description: "I will create a unique and professional logo design for your brand",
        price: 100,
        rating: 4.9,
        reviews: 128,
        deliveryTime: "3 days",
        image: "/service2.jpeg",
        seller: {
          name: "John Doe",
          level: "Level 2 Seller"
        }
      },
      {
        id: 2,
        title: "Modern Minimalist Logo",
        description: "Clean and modern logo design with minimalist approach",
        price: 150,
        rating: 4.8,
        reviews: 95,
        deliveryTime: "2 days",
        image: "/service3.jpeg",
        seller: {
          name: "Sarah Smith",
          level: "Top Rated Seller"
        }
      },
      {
        id: 3,
        title: "Creative Logo Design",
        description: "Unique and creative logo design that stands out",
        price: 200,
        rating: 4.7,
        reviews: 156,
        deliveryTime: "4 days",
        image: "/service4.jpeg",
        seller: {
          name: "Mike Johnson",
          level: "Level 1 Seller"
        }
      }
    ],
    'ai-artists-1': [
      {
        id: 1,
        title: "AI Portrait Generation",
        description: "Create stunning AI-generated portraits in any style",
        price: 50,
        rating: 4.9,
        reviews: 215,
        deliveryTime: "1 day",
        image: "/service1.png",
        seller: {
          name: "AI Master",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "AI Art Style Transfer",
        description: "Transform your photos into famous art styles using AI",
        price: 75,
        rating: 4.8,
        reviews: 178,
        deliveryTime: "2 days",
        image: "/service2.jpeg",
        seller: {
          name: "Digital Artist",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "AI Character Design",
        description: "Create unique characters using advanced AI technology",
        price: 100,
        rating: 4.7,
        reviews: 142,
        deliveryTime: "3 days",
        image: "/service3.jpeg",
        seller: {
          name: "Creative AI",
          level: "Level 1 Seller"
        }
      }
    ],
    'wordpress-1': [
      {
        id: 1,
        title: "WordPress Website Development",
        description: "Create a professional WordPress website with custom design",
        price: 300,
        rating: 4.9,
        reviews: 245,
        deliveryTime: "5 days",
        image: "/service3.jpeg",
        seller: {
          name: "WP Expert",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "WordPress Theme Customization",
        description: "Customize your existing WordPress theme to match your brand",
        price: 150,
        rating: 4.8,
        reviews: 189,
        deliveryTime: "3 days",
        image: "/service4.jpeg",
        seller: {
          name: "Theme Master",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "WordPress Plugin Development",
        description: "Create custom WordPress plugins for your specific needs",
        price: 250,
        rating: 4.7,
        reviews: 156,
        deliveryTime: "4 days",
        image: "/service5.jpeg",
        seller: {
          name: "Plugin Pro",
          level: "Level 1 Seller"
        }
      }
    ],
    'voice-over-1': [
      {
        id: 1,
        title: "Professional Voice Over",
        description: "High-quality voice over for your videos and presentations",
        price: 100,
        rating: 4.9,
        reviews: 328,
        deliveryTime: "2 days",
        image: "/service4.jpeg",
        seller: {
          name: "Voice Pro",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "Character Voice Acting",
        description: "Engaging character voices for animations and games",
        price: 150,
        rating: 4.8,
        reviews: 245,
        deliveryTime: "3 days",
        image: "/service5.jpeg",
        seller: {
          name: "Voice Actor",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "Commercial Voice Over",
        description: "Professional voice over for commercials and ads",
        price: 200,
        rating: 4.7,
        reviews: 189,
        deliveryTime: "2 days",
        image: "/service6.jpeg",
        seller: {
          name: "Commercial Pro",
          level: "Level 1 Seller"
        }
      }
    ],
    'social-media-1': [
      {
        id: 1,
        title: "Social Media Management",
        description: "Complete social media management for your business",
        price: 200,
        rating: 4.9,
        reviews: 278,
        deliveryTime: "Ongoing",
        image: "/service5.jpeg",
        seller: {
          name: "Social Pro",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "Social Media Content Creation",
        description: "Engaging content for all your social media platforms",
        price: 150,
        rating: 4.8,
        reviews: 198,
        deliveryTime: "3 days",
        image: "/service6.jpeg",
        seller: {
          name: "Content Creator",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "Social Media Strategy",
        description: "Comprehensive social media strategy development",
        price: 300,
        rating: 4.7,
        reviews: 156,
        deliveryTime: "5 days",
        image: "/service7.jpeg",
        seller: {
          name: "Strategy Expert",
          level: "Level 1 Seller"
        }
      }
    ],
    'seo-1': [
      {
        id: 1,
        title: "SEO Optimization",
        description: "Complete SEO optimization for your website",
        price: 250,
        rating: 4.9,
        reviews: 298,
        deliveryTime: "7 days",
        image: "/service6.jpeg",
        seller: {
          name: "SEO Master",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "Keyword Research",
        description: "Comprehensive keyword research and analysis",
        price: 150,
        rating: 4.8,
        reviews: 245,
        deliveryTime: "3 days",
        image: "/service7.jpeg",
        seller: {
          name: "Keyword Expert",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "Technical SEO Audit",
        description: "Detailed technical SEO audit and recommendations",
        price: 200,
        rating: 4.7,
        reviews: 189,
        deliveryTime: "4 days",
        image: "/service8.jpeg",
        seller: {
          name: "Tech SEO Pro",
          level: "Level 1 Seller"
        }
      }
    ],
    'illustration-1': [
      {
        id: 1,
        title: "Custom Illustration",
        description: "Unique custom illustrations for your projects",
        price: 150,
        rating: 4.9,
        reviews: 278,
        deliveryTime: "4 days",
        image: "/service7.jpeg",
        seller: {
          name: "Illustration Pro",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "Digital Art",
        description: "High-quality digital art in any style",
        price: 200,
        rating: 4.8,
        reviews: 198,
        deliveryTime: "5 days",
        image: "/service8.jpeg",
        seller: {
          name: "Digital Artist",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "Character Illustration",
        description: "Custom character illustrations for games and books",
        price: 250,
        rating: 4.7,
        reviews: 156,
        deliveryTime: "6 days",
        image: "/service1.png",
        seller: {
          name: "Character Artist",
          level: "Level 1 Seller"
        }
      }
    ],
    'translation-1': [
      {
        id: 1,
        title: "Document Translation",
        description: "Professional translation of your documents",
        price: 100,
        rating: 4.9,
        reviews: 298,
        deliveryTime: "2 days",
        image: "/service8.jpeg",
        seller: {
          name: "Translation Pro",
          level: "Top Rated Seller"
        }
      },
      {
        id: 2,
        title: "Website Translation",
        description: "Complete website translation in multiple languages",
        price: 200,
        rating: 4.8,
        reviews: 245,
        deliveryTime: "4 days",
        image: "/service1.png",
        seller: {
          name: "Web Translator",
          level: "Level 2 Seller"
        }
      },
      {
        id: 3,
        title: "Technical Translation",
        description: "Accurate technical document translation",
        price: 150,
        rating: 4.7,
        reviews: 189,
        deliveryTime: "3 days",
        image: "/service2.jpeg",
        seller: {
          name: "Tech Translator",
          level: "Level 1 Seller"
        }
      }
    ]
  };

  // Get category name from ID
  const getCategoryName = (id) => {
    const categories = {
      'logo-design-1': 'Logo Design',
      'ai-artists-1': 'AI Artists',
      'wordpress-1': 'WordPress',
      'voice-over-1': 'Voice Over',
      'social-media-1': 'Social Media',
      'seo-1': 'SEO',
      'illustration-1': 'Illustration',
      'translation-1': 'Translation'
    };
    return categories[id] || 'Category';
  };

  // Get gigs for the current category
  const gigs = categoryGigs[categoryId] || [];

  const handleGigClick = (gigId) => {
    navigate(`/category/${categoryId}/gig/${gigId}`);
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {getCategoryName(categoryId)} Services
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{gigs.length} services available</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleGigClick(gig.id)}
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
      </div>
    </div>
  );
};

export default CategoryPage; 