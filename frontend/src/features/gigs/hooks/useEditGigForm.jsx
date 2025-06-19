import { useState, useEffect } from "react";
import api from "../../../utils/apiClient";
import { GIG_ROUTES } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import useFetchCategories from "./useFetchCategories";
import { validateGigData } from "../../../utils/gigValidation";
import { toast } from "react-toastify";

const useEditGigForm = (gigId) => {
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
  const [initialized, setInitialized] = useState(false);

  // Fetch gig data on mount
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await api.get(`${GIG_ROUTES}/${gigId}/`);
        const gig = response.data;
        setData({
          ...gig,
          packages: gig.packages || [{
            package_name: "Basic",
            description: "non for now",
            price: 0,
            number_of_revisions: 0,
            delivery_days: 0,
          }],
          gallery: gig.gallery || [],
        });
        if (gig.category_id) {
          await fetchSubCategories(gig.category_id);
        }
        setInitialized(true);
      } catch (error) {
        toast.error("Failed to load gig data");
        setInitialized(true);
      }
    };
    fetchGig();
    // eslint-disable-next-line
  }, [gigId]);

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
    const errors = validateGigData(data);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("category_id", data.category_id);
      formData.append("subcategory_id", data.subcategory_id);
      formData.append("description", data.description.trim());
      formData.append("delivery_time", data.packages[0].delivery_days);
      formData.append("tags", data.tags.trim());
      if (data.thumbnail_image instanceof File) {
        formData.append("thumbnail_image", data.thumbnail_image);
      }
      formData.append("packages", JSON.stringify(data.packages));
      const galleryMeta = [];
      if (Array.isArray(data.gallery)) {
        data.gallery.forEach((item) => {
          const { media_type, media_file } = item;
          if (
            media_file instanceof File &&
            (media_type === "image" || media_type === "video")
          ) {
            galleryMeta.push({ media_type });
            formData.append("gallery_files", media_file);
          }
        });
      }
      formData.append("gallery_meta", JSON.stringify(galleryMeta));
      // API call (PUT or PATCH)
      const response = await api.put(`${GIG_ROUTES}/${gigId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toast.success("Gig updated successfully");
        navigate("/seller/gigs");
      }
    } catch (error) {
      console.error("Error updating gig:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update gig. Please try again.";
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
    initialized,
  };
};

export default useEditGigForm; 