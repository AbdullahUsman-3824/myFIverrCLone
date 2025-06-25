import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchGig from '../hooks/useFetchGig';
import { FaStar, FaCheck, FaClock, FaSync, FaShieldAlt, FaUser, FaGlobe, FaLanguage, FaGraduationCap, FaBriefcase, FaHeart, FaShare, FaEllipsisH, FaEnvelope } from 'react-icons/fa';

const GigDetail = () => {
  const { gigId, categoryId } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleContact = () => {
    // TODO: Implement contact functionality
    alert('Contact functionality coming soon!');
  };

  // Dummy data - In a real app, this would come from an API
  const gigData = {
    id: gigId,
    title: "Professional Logo Design",
    description: "I will create a unique and professional logo design for your brand that perfectly represents your business identity. With over 5 years of experience in logo design, I ensure high-quality, scalable, and versatile logos that work across all platforms.",
    price: 100,
    rating: 4.9,
    reviews: 128,
    deliveryTime: "3 days",
    image: "/service2.jpeg",
    seller: {
      name: "John Doe",
      level: "Level 2 Seller",
      responseTime: "1 hour",
      languages: ["English", "Spanish"],
      education: "Bachelor's in Graphic Design",
      experience: "5+ years in logo design"
    },
    packages: {
      basic: {
        name: "Basic",
        price: 100,
        deliveryTime: "3 days",
        revisions: 2,
        features: [
          "1 Logo Design",
          "2 Revisions",
          "Source Files",
          "High Resolution",
          "Vector Files"
        ]
      },
      standard: {
        name: "Standard",
        price: 200,
        deliveryTime: "5 days",
        revisions: 4,
        features: [
          "2 Logo Designs",
          "4 Revisions",
          "Source Files",
          "High Resolution",
          "Vector Files",
          "Social Media Kit",
          "Stationery Design"
        ]
      },
      premium: {
        name: "Premium",
        price: 300,
        deliveryTime: "7 days",
        revisions: 6,
        features: [
          "3 Logo Designs",
          "6 Revisions",
          "Source Files",
          "High Resolution",
          "Vector Files",
          "Social Media Kit",
          "Stationery Design",
          "Brand Guidelines",
          "Animated Logo"
        ]
      }
    },
    gallery: [
      "/service2.jpeg",
      "/service3.jpeg",
      "/service4.jpeg",
      "/service5.jpeg"
    ],
    aboutThisGig: [
      "Professional logo design with unlimited revisions",
      "High-quality vector files included",
      "Fast delivery and quick response time",
      "100% satisfaction guaranteed",
      "Source files included"
    ],
    faq: [
      {
        question: "What file formats will I receive?",
        answer: "You will receive all source files including AI, EPS, PDF, PNG, and JPG formats."
      },
      {
        question: "How many revisions are included?",
        answer: "The number of revisions depends on the package you choose. Basic package includes 2 revisions, Standard includes 4, and Premium includes 6 revisions."
      },
      {
        question: "Do you provide source files?",
        answer: "Yes, all packages include source files that you can use for future modifications."
      }
    ]
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/category/${categoryId}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Category
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Rating */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{gigData.title}</h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleContact}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEnvelope className="w-4 h-4" />
                    Contact Seller
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                    <FaShare className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                    <FaEllipsisH className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold ml-1">{gigData.rating}</span>
                  <span className="text-gray-500 ml-1">({gigData.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <FaClock className="mr-1" />
                  <span>Delivery in {gigData.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={gigData.gallery[selectedImage]}
                  alt={`Gallery ${selectedImage + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {gigData.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        selectedImage === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {gigData.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg transition-transform hover:scale-105 ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* About This Gig */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About This Gig</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{gigData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gigData.aboutThisGig.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">FAQ</h2>
              <div className="space-y-4">
                {gigData.faq.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Packages and Seller Info */}
          <div className="space-y-6">
            {/* Packages */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Packages</h2>
              <div className="space-y-4">
                {Object.entries(gigData.packages).map(([key, pkg]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === key
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:scale-102'
                    }`}
                    onClick={() => setSelectedPackage(key)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
                      <span className="text-xl font-bold text-gray-800">${pkg.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Delivery in {pkg.deliveryTime}
                    </p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Continue (${gigData.packages[selectedPackage].price})
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${gigData.seller.name}&background=random`}
                  alt={gigData.seller.name}
                  className="w-16 h-16 rounded-full ring-2 ring-blue-500"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{gigData.seller.name}</h3>
                  <p className="text-gray-600">{gigData.seller.level}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FaClock className="mr-2 text-blue-500" />
                  <span className="text-gray-600">Response Time: {gigData.seller.responseTime}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FaLanguage className="mr-2 text-blue-500" />
                  <span className="text-gray-600">Languages: {gigData.seller.languages.join(", ")}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FaGraduationCap className="mr-2 text-blue-500" />
                  <span className="text-gray-600">{gigData.seller.education}</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FaBriefcase className="mr-2 text-blue-500" />
                  <span className="text-gray-600">{gigData.seller.experience}</span>
                </div>
              </div>
              <button 
                onClick={handleContact}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <FaEnvelope className="w-5 h-5" />
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;