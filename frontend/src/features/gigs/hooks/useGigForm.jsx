import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/apiClient";
import { GIG_ROUTE } from "../../../utils/constants";
import useFetchCategories from "./useFetchCategories";
import { validateGigData } from "../../../utils/gigValidation";
import { toast } from "react-toastify";

const getDefaultFormState = () => ({
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
  faqs: [],
});

const useGigForm = ({ mode = "create", gigData = null, gigId = null }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(gigData || getDefaultFormState());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchSubCategories, subcategories } = useFetchCategories();

  useEffect(() => {
    gigData && setData(gigData);
    console.log(gigData)
  }, [gigData]);

  // Handle form changes
  const handleChange = ({ target: { name, value } }) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
    // Special handling for delivery_time (gig-level)
    if (name === "delivery_time") {
      setData((prev) => ({ ...prev, delivery_time: value }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = useCallback(
    ({ target: { value } }) => {
      setData((prev) => ({
        ...prev,
        category_id: value,
      }));
      fetchSubCategories(value);
    },
    [fetchSubCategories]
  );

  const handlePackageChange = useCallback((field, value) => {
    setData((prev) => ({
      ...prev,
      packages: [{ ...prev.packages[0], [field]: value }],
    }));
  }, []);

  const handleThumbnailChange = useCallback((file) => {
    setData((prev) => ({ ...prev, thumbnail_image: file }));
  }, []);

  const handleGalleryAdd = useCallback((files) => {
    setData((prev) => ({ ...prev, gallery: [...prev.gallery, ...files] }));
  }, []);

  const handleGalleryRemove = useCallback((index) => {
    setData((prev) => {
      const updatedGallery = prev.gallery.filter((_, i) => i !== index);
      return { ...prev, gallery: updatedGallery };
    });
  }, []);

  const createFormData = () => {
    const formData = new FormData();
    const defaults = getDefaultFormState();

    const mergedData = {
      ...defaults,
      ...data,
      packages: data.packages ?? defaults.packages,
      faqs: data.faqs ?? defaults.faqs,
      gallery: data.gallery ?? defaults.gallery,
    };

    Object.entries(mergedData).forEach(([key, value]) => {
      if (key === "gallery" && Array.isArray(value)) {
        const galleryMeta = value
          .filter((item) => item.media_file instanceof File)
          .map((item) => {
            formData.append("gallery_files", item.media_file);
            return { media_type: item.media_type };
          });

        if (galleryMeta.length > 0) {
          formData.append("gallery_meta", JSON.stringify(galleryMeta));
        }
      } else if (key === "thumbnail_image") {
        if (value instanceof File) {
          formData.append("thumbnail_image", value);
        } else if (typeof value === "string" && value.startsWith("http")) {
          formData.append("thumbnail_image", value);
        }
      } else if (["packages", "faqs"].includes(key)) {
        formData.append(key, JSON.stringify(value));
      } else if (key === "delivery_time") {
        formData.append(
          "delivery_time",
          mergedData.packages?.[0]?.delivery_days ?? 1
        );
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateGigData(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formData = createFormData();

    try {
      if (mode === "create") {
        await api.post(GIG_ROUTE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Gig added successfully");
      } else if (mode === "edit" && gigId) {
        await api.put(`${GIG_ROUTE}${gigId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Gig updated successfully");
      }
      navigate("/seller/gigs");
    } catch (err) {
      const apiErrors = err.response?.data || "An unexpected error occurred";
      console.error(err);
      setErrors(apiErrors);
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
    setData,
  };
};

export default useGigForm;
