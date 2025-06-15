import { useState, useCallback, useEffect } from "react";
import api from "../../../utils/apiClient";
import { ADD_GIG_ROUTE } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import useFetchCategories from "./useFetchCategories";
import { validateGigData } from "../../../utils/gigValidation";
import { toast } from "react-toastify";

const useCreateGigForm = () => {
  const navigate = useNavigate();
  const { fetchSubCategories, subcategories } = useFetchCategories();

  const [data, setData] = useState({
    title: "",
    category_id: "",
    subcategory_id: "",
    description: "",
    delivery_time: "",
    tags: "",
    thumbnail_image: "",
    status: "draft",
    is_featured: false,
    packages: [
      {
        package_name: "Basic",
        description: "non for now",
        price: 0,
        number_of_revisions: 0,
        delivery_days: 0,
      },
    ],
    gallery: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCategoryChange = async (e) => {
    const categoryID = e.target.value;
    handleChange(e);
    if (categoryID) {
      await fetchSubCategories(categoryID);
    }
  };

  // Handle package changes
  const handlePackageChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      packages: [{ ...prev.packages[0], [field]: value }],
    }));
  };

  // Image Handler
  const handleThumbnailChange = (file) => {
    setData((prev) => ({ ...prev, thumbnail_image: file }));
  };

  const handleGalleryAdd = (files) => {
    setData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...files],
    }));
  };

  const handleGalleryRemove = (index) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate data before creating FormData
    const errors = validateGigData(data);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", data.title.trim());
      formData.append("category_id", data.category_id);
      formData.append("subcategory_id", data.subcategory_id);
      formData.append("description", data.description.trim());
      formData.append("delivery_time", data.packages[0].delivery_days);
      formData.append("tags", data.tags.trim());

      // Thumbnail (optional)
      if (data.thumbnail_image instanceof File) {
        formData.append("thumbnail_image", data.thumbnail_image);
      }

      // Packages (JSON string)
      formData.append("packages", JSON.stringify(data.packages));

      // Gallery files + metadata
      const galleryMeta = [];

      if (Array.isArray(data.gallery)) {
        data.gallery.forEach((item) => {
          const { media_type, media_file } = item;
          if (
            media_file instanceof File &&
            (media_type === "image" || media_type === "video")
          ) {
            galleryMeta.push({ media_type }); // Only type goes in metadata
            formData.append("gallery_files", media_file); // Files appended in order
          }
        });
      }

      // Append metadata as JSON string
      formData.append("gallery_meta", JSON.stringify(galleryMeta));

      // API call
      const response = await api.post(ADD_GIG_ROUTE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Gig added successfully");
        navigate("/seller/gigs");
      }
    } catch (error) {
      console.error("Error creating gig:", error);
      // Provide more specific error feedback if available
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create gig. Please try again.";
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    errors,
    isSubmitting,
    subcategories,
    handleChange,
    handleCategoryChange,
    handlePackageChange,
    handleSubmit,
    handleThumbnailChange,
    handleGalleryAdd,
    handleGalleryRemove,
  };
};

export default useCreateGigForm;
