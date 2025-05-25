import { FiUser, FiCamera } from "react-icons/fi";

function ProfileForm({
  formData,
  onChange,
  onImageChange,
  onSubmit,
  isLoading,
  previewImage,
  errors,
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Complete Your Profile
          </h2>

          {errors.non_field_errors && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {errors.non_field_errors}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
                >
                  <FiCamera className="w-5 h-5 text-gray-600" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                />
              </div>
              {errors.profile_picture && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.profile_picture}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {["first_name", "last_name"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={onChange}
                    className={`mt-1 block w-full border ${
                      errors[field] ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors[field] && (
                    <p className="mt-2 text-sm text-red-600">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Email and Username Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-0"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={onChange}
                  className={`mt-1 block w-full border ${
                    errors.username ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;
