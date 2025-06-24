export const validateGigData = (data) => {
  const newErrors = {};
  const filesErrors = {};

  // Title
  if (!data.title?.trim()) {
    newErrors.title = "Title is required";
  } else if (data.title.length < 10) {
    newErrors.title = "Title must be at least 10 characters";
  } else if (data.title.length > 80) {
    newErrors.title = "Title must be less than 80 characters";
  }

  // Category & Subcategory
  if (!data.category_id) {
    newErrors.category_id = "Category is required";
  }
  if (!data.subcategory_id) {
    newErrors.subcategory_id = "Sub Category is required";
  }

  // Description
  if (!data.description?.trim()) {
    newErrors.description = "Description is required";
  } else if (data.description.length < 50) {
    newErrors.description = "Description must be at least 50 characters";
  }

  // Delivery Time
  const delivery_days = Number(data.packages?.[0]?.delivery_days);
  if (!delivery_days) {
    newErrors.delivery_time = "Delivery time is required";
  } else if (delivery_days < 1) {
    newErrors.delivery_days = "Delivery time must be at least 1 day";
  } else if (delivery_days > 365) {
    newErrors.delivery_days = "Delivery time must be less than 365 days";
  }

  // Price
  const price = Number(data.packages?.[0]?.price);
  if (!price) {
    newErrors.price = "Price is required";
  } else if (price < 5) {
    newErrors.price = "Price must be at least $5";
  } else if (price > 10000) {
    newErrors.price = "Price must be less than $10,000";
  }

  // Revisions
  const number_of_revisions = Number(data.packages?.[0]?.number_of_revisions);
  if (isNaN(number_of_revisions)) {
    newErrors.number_of_revisions = "Revisions must be a number";
  } else if (number_of_revisions < 0) {
    newErrors.number_of_revisions = "Revisions cannot be negative";
  } else if (number_of_revisions > 20) {
    newErrors.number_of_revisions =
      "Revisions must be less than or equal to 20";
  }

  // Tags
  if (!data.tags?.trim()) {
    newErrors.tags = "Tags are required";
  }

  // Thumbnail Image
  if (!data.thumbnail_image) {
    filesErrors.thumbnail_image = "Thumbnail image is required";
  } else if (
    data.thumbnail_image instanceof File &&
    !data.thumbnail_image.type.startsWith("image/")
  ) {
    filesErrors.thumbnail_image = "Thumbnail must be a valid image file";
  }

  // Gallery
  if (!Array.isArray(data.gallery) || data.gallery.length === 0) {
    filesErrors.gallery = "At least one gallery image or video is required";
  } else {
    data.gallery.forEach((item, index) => {
      const isExistingUrl = typeof item.media_file === "string";

      if (!item.media_type || !["image", "video"].includes(item.media_type)) {
        filesErrors.gallery = `Invalid media type at item ${index + 1}`;
      }

      if (!isExistingUrl && !(item.media_file instanceof File)) {
        filesErrors.gallery = `Missing or invalid file at item ${index + 1}`;
      }
    });
  }

  // Only add .files key if any file-related errors exist
  if (Object.keys(filesErrors).length > 0) {
    newErrors.files = filesErrors;
  }

  return newErrors;
};
