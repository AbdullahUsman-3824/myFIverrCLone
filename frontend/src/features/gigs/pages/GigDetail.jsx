import { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchSeller from "../../seller/hooks/useFetchSeller";
import CircularProgress from "@mui/material/CircularProgress";
import useFetchGig from "../hooks/useFetchGig";
import GigGallery from "../components/GigGallery";
import {
  FaStar,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaHeart,
  FaShare,
  FaEllipsisH,
  FaArrowLeft,
  FaBriefcase,
} from "react-icons/fa";
import { useStateProvider } from "../../../context/StateContext";

const GigDetail = () => {
  const { gigId } = useParams();
  const { gig: gigData, fetchGig } = useFetchGig();
  const { sellerInfo, fetchSeller } = useFetchSeller();
  const [{ userInfo }] = useStateProvider();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch gig data
  useEffect(() => {
    if (gigId) {
      fetchGig(gigId);
    }
  }, [fetchGig, gigId]);

  // Fetch seller info after gig data is loaded
  useEffect(() => {
    if (gigData?.seller_id) {
      fetchSeller(gigData.seller_id);
    }
  }, [gigData?.seller_id, fetchSeller]);

  // Set loading to false once both gigData and sellerInfo are available
  useEffect(() => {
    if (gigData && sellerInfo) {
      setLoading(false);
    }
  }, [gigData, sellerInfo]);

  // Optional: Log sellerInfo once available
  useEffect(() => {
    if (sellerInfo) {
      console.log("Fetched sellerInfo:", sellerInfo);
    }
    if (gigData) {
      console.log("fetched gig:", gigData);
    }
  }, [sellerInfo, gigData]);

  const handleContact = () => {
    alert("Contact functionality coming soon!");
  };

  const isOwner = sellerInfo?.user?.id === userInfo?.pk;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
        >
          <FaArrowLeft />
          Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 space-y-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-800 leading-snug">
                {gigData.title}
              </h1>

              {/* Seller Info and Actions */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Seller Image + Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      sellerInfo?.user.profile_picture || "/default-user.png"
                    }
                    alt="Seller"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {sellerInfo?.user.first_name +
                        " " +
                        sellerInfo?.user.last_name || "Seller Name"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      @{sellerInfo?.user.username || "username"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {!isOwner && (
                    <button
                      onClick={handleContact}
                      aria-label="Contact Seller"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <FaEnvelope className="w-4 h-4" />
                      Contact Seller
                    </button>
                  )}

                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition ${
                      isFavorite
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>

                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition">
                    <FaShare className="w-5 h-5" />
                  </button>

                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition">
                    <FaEllipsisH className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold ml-1">4.5</span>
                  <span className="text-gray-500 ml-1">(23 reviews)</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <FaClock className="mr-1" />
                  <span>Delivery in {gigData.delivery_time} days</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-300 my-3" />
            <GigGallery gigData={gigData} />
            <div className="p-6 mb-6 ">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                About This Gig
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {gigData.description}
              </p>
            </div>
            {gigData.faq && (
              <div className="p-6">
                <div className="w-full h-px bg-gray-300 my-3" />
                <h2 className="text-xl font-bold text-gray-800 mb-4">FAQ</h2>
                <div className="space-y-4">
                  {gigData.faq.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Packages</h2>
              <div className="space-y-4">
                {Object.entries(gigData.packages).map(([key, pkg]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === key
                        ? "border-blue-500 bg-blue-50 scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:scale-102"
                    }`}
                    onClick={() => setSelectedPackage(key)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {pkg.package_name}
                      </h3>
                      <span className="text-xl font-bold text-gray-800">
                        ${pkg.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Delivery in {pkg.delivery_days} days
                    </p>
                    {pkg.features && (
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                {}
                Continue (${gigData.packages[selectedPackage]?.price})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
