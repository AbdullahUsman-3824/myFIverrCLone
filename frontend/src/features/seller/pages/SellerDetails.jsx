import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../../../context/StateContext";
import {
  FiMapPin,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiHeart,
  FiArrowLeft,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import useFetchSeller from "../hooks/useFetchSeller";
import CircularProgress from "@mui/material/CircularProgress";

const SellerInfo = () => {
  const [{ userInfo }] = useStateProvider();
  const { fetchSeller, sellerInfo } = useFetchSeller();
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  if (!userInfo) {
    return (
      <div className="min-h-[80vh] pt-24 px-8 md:px-32 text-center text-gray-500">
        Please login to view this page
      </div>
    );
  }

  if (!sellerInfo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="min-h-screen pt-28 px-4 md:px-32 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left Main Section */}
        <div className="flex-1">
          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>

          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={userInfo.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
              }}
            />
            <div className="w-full">
              <div className="flex items-start justify-between w-full">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userInfo.first_name + " " + userInfo.last_name}
                  </h1>
                  <p className="text-gray-500">@{userInfo.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">
                      {sellerInfo.rating || "4.8"}
                    </span>
                    <span className="text-gray-400">
                      ({sellerInfo.reviews || "8.6k"})
                    </span>
                    <span className="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded">
                      Top Rated
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {sellerInfo.profile_title || "We Think Design!"}
                  </p>
                  {sellerInfo.location && (
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                      <FiMapPin /> {sellerInfo.location} •{" "}
                      {sellerInfo.languages?.map((l) => l.name).join(", ")}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setIsFavorited((prev) => !prev)}
                  className="text-red-500 hover:text-red-600 transition"
                  title={isFavorited ? "Unfavorite" : "Add to favorites"}
                >
                  {isFavorited ? (
                    <FaHeart className="text-2xl" />
                  ) : (
                    <FiHeart className="text-2xl" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2">About Me</h2>
            <p className="text-gray-700">{sellerInfo.bio}</p>
          </div>

          {/* Skills */}
          {sellerInfo.skills?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {sellerInfo.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="text-gray-500 text-xs">
                        ({skill.level})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {sellerInfo.languages?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Languages
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {sellerInfo.languages.map((lang, idx) => (
                  <li key={idx}>
                    {lang.name}
                    {lang.level && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        – {lang.level}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {sellerInfo.educations?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Education
              </h2>
              <ul className="space-y-3">
                {sellerInfo.educations.map((edu, idx) => (
                  <li key={idx} className="text-gray-700">
                    <p className="font-medium">{edu.degree_title}</p>
                    <p className="text-sm">
                      {edu.institution_name} • {edu.start_year || "N/A"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex flex-col items-center">
            <img
              src={userInfo.profile_picture}
              alt="Seller"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <h3 className="font-semibold text-lg">{userInfo.full_name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Offline • 10:11 AM local time
            </p>
            <button className="bg-[#404145] text-white px-4 py-2 mt-4 rounded hover:bg-[#2c2c2d] transition">
              Contact me
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Avg response time: 2 hours
            </p>

            <div className="flex gap-3 mt-4">
              {userInfo.email && (
                <a
                  href={`mailto:${userInfo.email}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiMail className="text-xl text-gray-600 hover:text-black" />
                </a>
              )}
              {sellerInfo.github && (
                <a
                  href={formatUrl(sellerInfo.github)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiGithub className="text-xl text-gray-600 hover:text-black" />
                </a>
              )}
              {sellerInfo.linkedin && (
                <a
                  href={formatUrl(sellerInfo.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiLinkedin className="text-xl text-blue-600 hover:text-blue-800" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
