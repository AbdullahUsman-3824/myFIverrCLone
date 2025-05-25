import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useStateProvider } from "../../../context/StateContext";
import axios from "axios";
import { USER_PROFILE_ROUTE } from "../../../utils/constants";
import ProfileForm from "../components/ProfileForm";

function ProfileSetupPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useStateProvider();
  const [cookies] = useCookies(["jwt"]);

  const initialFormData = {
    first_name: state.userInfo?.first_name || "",
    last_name: state.userInfo?.last_name || "",
    email: state.userInfo?.email || "",
    username: state.userInfo?.username || "",
    profile_picture: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
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

      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          !(key === "username" && value === originalUsername)
        ) {
          formDataToSend.append(key, value);
        }
      });

      const { data } = await axios.patch(USER_PROFILE_ROUTE, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cookies["jwt"]}`,
        },
        withCredentials: true,
      });

      dispatch({ type: "SET_USER", userInfo: data.user });
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
      Object.keys(formData).forEach((field) => {
        if (backendErrors[field]) {
          newErrors[field] = Array.isArray(backendErrors[field])
            ? backendErrors[field].join(" ")
            : backendErrors[field];
        }
      });

      // Handle non-field errors
      newErrors.non_field_errors = backendErrors.non_field_errors
        ? Array.isArray(backendErrors.non_field_errors)
          ? backendErrors.non_field_errors.join(" ")
          : backendErrors.non_field_errors
        : "";

      // Special handling for username uniqueness
      if (backendErrors.username?.includes("already exists")) {
        newErrors.username = "This username is already taken";
      }
    } else {
      newErrors.non_field_errors =
        "Network error. Please check your connection and try again.";
    }

    // Ensure required validation for username is not overridden
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    setErrors(newErrors);
  };

  return (
    <ProfileForm
      formData={formData}
      onChange={handleChange}
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      previewImage={previewImage}
      errors={errors}
    />
  );
}

export default ProfileSetupPage;
