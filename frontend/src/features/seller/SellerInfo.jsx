import { useEffect } from "react";
import { useStateProvider } from "../../context/StateContext";
import {
  FiMapPin,
  FiLink,
  FiAward,
  FiBook,
  FiGlobe,
  FiMail,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import useFetchSeller from "./hooks/useFetchSeller";

const SellerInfo = () => {
  const [{ userInfo, sellerInfo }] = useStateProvider();
  const { fetchSeller } = useFetchSeller();
  useEffect(() => {
    fetchSeller();
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-[80vh] pt-24 px-8 md:px-32">
        <div className="text-center py-10">
          <p className="text-gray-500">Please login to view this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] pt-24 px-8 md:px-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile picture */}
            <div className="flex-shrink-0">
              {userInfo.profile_picture ? (
                <img
                  src={userInfo.profile_picture}
                  alt="Profile"
                  className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-5xl text-white font-bold">
                    {userInfo.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              {/* profile title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {sellerInfo.profile_title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                {/* location */}
                {sellerInfo.location && (
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                    <FiMapPin className="text-green-500" />
                    <span>{sellerInfo.location}</span>
                  </div>
                )}
                {/* email */}
                {userInfo.email && (
                  <a
                    href={`mailto:${userInfo.email}`}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiMail className="text-blue-500" />
                    <span>Email</span>
                  </a>
                )}
                {/* github */}
                {sellerInfo.github && (
                  <a
                    href={`https://${sellerInfo.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiGithub className="text-gray-700" />
                    <span>GitHub</span>
                  </a>
                )}
                {/* linkedin */}
                {sellerInfo.linkedin && (
                  <a
                    href={`https://${sellerInfo.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiLinkedin className="text-blue-600" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
              {/* profile bio */}
              <p className="text-gray-700 text-lg leading-relaxed">
                {sellerInfo.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {sellerInfo.skills?.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiAward className="text-green-500 w-6 h-6" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {sellerInfo.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <span className="font-bold text-green-600">{skill.name}</span>
                  <span className="text-gray-500 ml-2">• {skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {sellerInfo.languages?.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiGlobe className="text-green-500 w-6 h-6" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Languages
              </span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {sellerInfo.languages.map((language, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <span className="font-bold text-blue-600">
                    {language.name}
                  </span>
                  <span className="text-gray-500 ml-2">• {language.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {sellerInfo.educations?.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiBook className="text-green-500 w-6 h-6" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Education
              </span>
            </h2>
            <div className="space-y-6">
              {sellerInfo.educations.map((education, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-6 py-4 hover:bg-gray-50 rounded-r-xl transition-colors duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-900">
                    {education.institution_name}
                  </h3>
                  {education.degree_title && (
                    <p className="text-gray-600 text-lg mt-1">
                      {education.degree_title}
                    </p>
                  )}
                  <p className="text-gray-500 mt-2">
                    {education.start_year} - {education.end_year || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInfo;
