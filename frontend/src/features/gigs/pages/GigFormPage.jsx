import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import useGigForm from "../hooks/useGigForm";
import useFetchCategories from "../hooks/useFetchCategories";
import useFetchGig from "../hooks/useFetchGig";
import InputField from "../../../components/common/InputField";
import ImageUploader from "../components/ImageUploader";
import TagsInput from "../components/TagsInput";
import Spinner from "../../../components/common/Spinner";

const getActiveCategories = (categoryData) => {
  return (
    categoryData?.results
      ?.filter((category) => category.is_active)
      .map(({ id, name }) => ({ id, name })) || []
  );
};

const GigFormPage = () => {
  const navigate = useNavigate();
  const { gigId } = useParams();
  const isEdit = Boolean(gigId);
  const mode = isEdit ? "edit" : "create";

  const { categories: categoryData, fetchCategories } = useFetchCategories();
  const { gig, fetchGig } = useFetchGig();

  const gigData = isEdit ? gig : null;

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchGig(gigId);
  }, [fetchCategories, fetchGig, gigId, isEdit]);

  const {
    data,
    errors,
    isSubmitting,
    subcategories: subCategoryData,
    handleChange,
    handleCategoryChange,
    handlePackageChange,
    handleSubmit,
    handleThumbnailChange,
    handleGalleryAdd,
    handleGalleryRemove,
  } = useGigForm({ mode, gigData, gigId });

  const allSubCategories = useMemo(
    () => subCategoryData?.results || [],
    [subCategoryData]
  );
  const categories = useMemo(
    () => getActiveCategories(categoryData),
    [categoryData]
  );

  useEffect(() => {
    if (data?.category_id) {
      handleCategoryChange({
        target: { name: "category_id", value: data.category_id },
      });
    }
  }, [data?.category_id, handleCategoryChange]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:underline hover:text-blue-800 font-medium flex items-center gap-1"
          >
            ← Go Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? "Edit Your Gig" : "Create a New Gig"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update your gig details below."
                : "Fill in the details to create your professional gig listing."}
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <FiAlertCircle />
                <span>{errors.submit}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Title */}
            <InputField
              label="Gig Title"
              error={errors.title}
              required
              htmlFor="title"
            >
              <input
                id="title"
                type="text"
                name="title"
                value={data?.title}
                onChange={handleChange}
                maxLength={80}
                className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="I will create something amazing for you..."
              />
              <div className="text-xs text-gray-500 mt-1">
                {data?.title.length}/80 characters
              </div>
            </InputField>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Category"
                error={errors.category_id}
                required
                htmlFor="category_id"
              >
                <select
                  id="category_id"
                  name="category_id"
                  value={data?.category_id}
                  onChange={handleCategoryChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.category_id ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </InputField>

              <InputField
                label="Sub Category"
                error={errors.subcategory_id}
                required
                htmlFor="subcategory_id"
              >
                <select
                  id="subcategory_id"
                  name="subcategory_id"
                  value={data?.subcategory_id}
                  onChange={handleChange}
                  disabled={!data?.category_id}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.subcategory_id ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a sub category</option>
                  {allSubCategories.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </InputField>
            </div>

            {/* Description */}
            <InputField
              label="Description"
              error={errors.description}
              required
              htmlFor="description"
            >
              <textarea
                id="description"
                name="description"
                value={data?.description}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
              />
              <div className="text-xs text-gray-500 mt-1">
                {data?.description.length}/1000 characters
              </div>
            </InputField>

            {/* Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Delivery Days"
                error={errors.delivery_days}
                required
                htmlFor="package_delivery_days"
              >
                <input
                  type="number"
                  name="package_delivery_days"
                  value={data?.packages[0]?.delivery_days || ""}
                  onChange={(e) =>
                    handlePackageChange("delivery_days", e.target.value)
                  }
                  min={1}
                  max={365}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </InputField>

              <InputField label="Price (USD)" error={errors.price} required>
                <input
                  type="number"
                  name="price"
                  value={data?.packages[0]?.price || ""}
                  onChange={(e) => handlePackageChange("price", e.target.value)}
                  min={5}
                  max={10000}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </InputField>

              <InputField
                label="Revisions"
                error={errors.number_of_revisions}
                required
              >
                <input
                  type="number"
                  name="number_of_revisions"
                  value={data?.packages[0]?.number_of_revisions || ""}
                  onChange={(e) =>
                    handlePackageChange("number_of_revisions", e.target.value)
                  }
                  min={0}
                  max={50}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </InputField>
            </div>

            {/* Tags */}
            <InputField label="Tags" error={errors.tags} required>
              <TagsInput
                value={data?.tags}
                name="tags"
                onChange={handleChange}
                error={errors.tags}
              />
            </InputField>

            {/* Media Upload */}
            <InputField label="Gig Media" required>
              <ImageUploader
                thumbnail={data?.thumbnail_image}
                gallery={data?.gallery}
                onThumbnailChange={handleThumbnailChange}
                onGalleryAdd={handleGalleryAdd}
                onGalleryRemove={handleGalleryRemove}
                error={errors.files}
              />
            </InputField>

            {/* Submit */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center gap-2 text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {isEdit ? <FiCheckCircle /> : <FiPlus />}
                    {isEdit ? "Update Gig" : "Create Gig"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigFormPage;
