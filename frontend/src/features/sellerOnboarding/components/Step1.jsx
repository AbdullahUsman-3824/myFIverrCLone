const Step1 = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Tell us about yourself
      </h3>

      {/* Profile Title */}
      <div>
        <label
          htmlFor="profile_title"
          className="block text-sm font-medium text-gray-700"
        >
          Professional Title
        </label>
        <input
          type="text"
          name="profile_title"
          id="profile_title"
          value={formData.profile_title}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Professional Web Developer"
          required
        />
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          About Yourself
        </label>
        <textarea
          name="bio"
          id="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your experience and expertise..."
          required
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., New York, USA"
        />
      </div>

      {/* Porfolio URL */}
      <div>
        <label
          htmlFor="portfolio_link"
          className="block text-sm font-medium text-gray-700"
        >
          Portfolio Link
        </label>
        <input
          type="url"
          name="portfolio_link"
          id="portfolio_link"
          value={formData.portfolio_link}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://yourportfolio.com"
        />
      </div>
    </div>
  );
};

export default Step1;
