import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useStateProvider } from "../../../context/StateContext";
import { setUser } from "../../../context/StateReducer";
import api from "../../../utils/apiClient";
import { USER_PROFILE_ROUTE } from "../../../utils/constants";
import ProfileForm from "../components/ProfileForm";

function ProfileSetupPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useStateProvider();

  const initialFormData = {
    first_name: state.userInfo?.first_name || "",
    last_name: state.userInfo?.last_name || "",
    email: state.userInfo?.email || "",
    username: state.userInfo?.username || "",
    profile_picture: state.userInfo?.profile_picture || null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewImage, setPreviewImage] = useState(
    initialFormData.profile_picture
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profile_picture: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const originalUsername = state.userInfo?.username;
      const formDataToSend = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (
          value !== null &&
          value !== undefined &&
          !(key === "username" && value === originalUsername)
        ) {
          formDataToSend.append(key, value);
        }
      }

      const { data } = await api.patch(USER_PROFILE_ROUTE, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setUser(data.user));
      navigate("/");
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data || error.message
      );
      handleErrors(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (backendErrors) => {
    const newErrors = {};

    if (backendErrors) {
      for (const field of Object.keys(formData)) {
        if (backendErrors[field]) {
          newErrors[field] = Array.isArray(backendErrors[field])
            ? backendErrors[field].join(" ")
            : backendErrors[field];
        }
      }

      if (backendErrors.username?.includes("already exists")) {
        newErrors.username = "This username is already taken";
      }

      if (backendErrors.non_field_errors) {
        newErrors.non_field_errors = Array.isArray(
          backendErrors.non_field_errors
        )
          ? backendErrors.non_field_errors.join(" ")
          : backendErrors.non_field_errors;
      }
    } else {
      newErrors.non_field_errors = "Network error. Please try again.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-black transition"
        >
          <FiArrowLeft className="mr-2 text-lg" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Page Header */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Set Up Your Profile
        </h1>
        <p className="text-gray-600 mb-8">
          Help us know you better and build your identity on the platform.
        </p>

        {/* Profile Form */}
        <ProfileForm
          formData={formData}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          previewImage={previewImage}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default ProfileSetupPage;
