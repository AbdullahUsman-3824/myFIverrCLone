import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { HOST } from "../../utils/constants";
import { FiUpload, FiCheck } from "react-icons/fi";
import { useStateProvider } from "../../context/StateContext";

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useStateProvider();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    hourlyRate: "",
    portfolio: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      portfolio: [...prev.portfolio, ...files],
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "portfolio") {
          formData.portfolio.forEach((file) => {
            formDataToSend.append("portfolio", file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // For testing purposes, let's simulate a successful response
      // In production, you would use the actual API call
      // const { data } = await axios.post(
      //   `${HOST}/api/seller/onboarding`,
      //   formDataToSend,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //     withCredentials: true,
      //   }
      // );

      // Simulate successful response
      const mockResponse = {
        user: {
          ...state.userInfo,
          isSeller: true,
          sellerProfile: {
            title: formData.title,
            description: formData.description,
            skills: formData.skills.split(',').map(skill => skill.trim()),
            hourlyRate: formData.hourlyRate,
          }
        }
      };

      // Update user info in context
      dispatch({
        type: "SET_USER",
        userInfo: mockResponse.user,
      });

      // Navigate to seller dashboard
      navigate("/seller");
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Tell us about yourself
            </h3>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Professional Web Developer"
                
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                About Yourself
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your experience and expertise..."
                
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Your Skills and Rate
            </h3>
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                id="skills"
                value={formData.skills}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Web Development, UI/UX Design, SEO"
                
              />
            </div>
            <div>
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium text-gray-700"
              >
                Hourly Rate ($)
              </label>
              <input
                type="number"
                name="hourlyRate"
                id="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 25"
                
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Upload Your Portfolio
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portfolio Items
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="portfolio-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="portfolio-upload"
                        name="portfolio"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handlePortfolioUpload}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
              {formData.portfolio.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {formData.portfolio.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <FiCheck className="mr-2 text-green-500" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] pt-28 px-8 md:px-32">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-gray-600">
            Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Skills & Rate" : "Portfolio"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`ml-auto px-4 py-2 rounded-md text-white ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  "Processing..."
                ) : step === 3 ? (
                  "Complete Setup"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding; 