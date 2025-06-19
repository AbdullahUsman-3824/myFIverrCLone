import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FiEdit, FiAlertCircle } from "react-icons/fi";
import useEditGigForm from "../hooks/useEditGigForm";
import useFetchCategories from "../hooks/useFetchCategories";
import InputField from "../../../components/common/InputField";
import ImageUploader from "../components/ImageUploader";
import TagsInput from "../components/TagsInput";

const getActiveCategories = (categoryData) => {
  return (
    categoryData?.results
      ?.filter((category) => category.is_active)
      .map((category) => ({ id: category.id, name: category.name })) || []
  );
};

const EditGigPage = () => {
  const { gigId } = useParams();
  const {
    loading,
    categories: categoryData,
    fetchCategories,
  } = useFetchCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
    initialized,
  } = useEditGigForm(gigId);

  const allSubCategories = useMemo(() => {
    return subCategoryData?.results || [];
  }, [subCategoryData]);

  const categories = getActiveCategories(categoryData);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading gig data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FiEdit /> Edit Gig
            </h1>
            <p className="text-gray-600">
              Update your gig details below and save your changes.
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800" role="alert">
                <FiAlertCircle aria-hidden="true" />
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
                value={data.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.title ? "border-red-300" : "border-gray-300"}`}
                placeholder="I will create something amazing for you..."
                maxLength={80}
                aria-describedby="title-helper"
              />
              <div id="title-helper" className="text-xs text-gray-500 mt-1">
                {data.title.length}/80 characters
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
                  value={data.category_id}
                  onChange={handleCategoryChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.category_id ? "border-red-300" : "border-gray-300"}`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
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
                  value={data.subcategory_id}
                  onChange={handleChange}
                  disabled={!data.category_id}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.subcategory_id ? "border-red-300" : "border-gray-300"}`}
                >
                  <option value="">Select a sub category</option>
                  {allSubCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
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
                value={data.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${errors.description ? "border-red-300" : "border-gray-300"}`}
                placeholder="Provide a detailed description of your service..."
                maxLength={1000}
                aria-describedby="description-helper"
              />
              <div id="description-helper" className="text-xs text-gray-500 mt-1">
                {data.description.length}/1000 characters (minimum 50)
              </div>
            </InputField>

            {/* Delivery Time, Price, and Revisions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Delivery Time (days)"
                error={errors.delivery_days}
                required
                htmlFor="delivery_time"
              >
                <input
                  id="delivery_time"
                  type="number"
                  name="delivery_time"
                  value={data.packages[0].delivery_days}
                  onChange={(e) => handlePackageChange("delivery_days", e.target.value)}
                  min={1}
                  max={365}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.delivery_days ? "border-red-300" : "border-gray-300"}`}
                />
              </InputField>

              <InputField
                label="Price (USD)"
                error={errors.price}
                required
                htmlFor="price"
              >
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={data.packages[0].price}
                  onChange={(e) => handlePackageChange("price", e.target.value)}
                  min={5}
                  max={10000}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.price ? "border-red-300" : "border-gray-300"}`}
                />
              </InputField>

              <InputField
                label="No. of Revisions"
                error={errors.number_of_revisions}
                required
                htmlFor="number_of_revisions"
              >
                <input
                  id="number_of_revisions"
                  type="number"
                  name="number_of_revisions"
                  value={data.packages[0].number_of_revisions}
                  onChange={(e) => handlePackageChange("number_of_revisions", e.target.value)}
                  min={1}
                  max={100}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.number_of_revisions ? "border-red-300" : "border-gray-300"}`}
                />
              </InputField>
            </div>

            {/* Tags */}
            <InputField
              label="Tags"
              error={errors.tags}
              required
              htmlFor="tags"
            >
              <TagsInput value={data.tags} onChange={handleChange} name="tags" />
            </InputField>

            {/* Thumbnail and Gallery */}
            <ImageUploader
              thumbnail={data.thumbnail_image}
              gallery={data.gallery}
              onThumbnailChange={handleThumbnailChange}
              onGalleryAdd={handleGalleryAdd}
              onGalleryRemove={handleGalleryRemove}
              error={errors.thumbnail_image}
            />

            {/* Submit */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" aria-hidden="true"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FiEdit size={20} aria-hidden="true" />
                    Save Changes
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

export default EditGigPage; 