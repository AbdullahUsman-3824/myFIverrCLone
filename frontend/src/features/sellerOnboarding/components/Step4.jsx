import React, { useState } from "react";

const Step4 = ({ formData, setFormData }) => {
  const [currentItem, setCurrentItem] = useState({
    title: "",
    description: "",
    url_link: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!currentItem.description.trim()) {
      setError("Please enter a description");
      return;
    }
    // Optional: simple url validation
    if (currentItem.url_link && !/^https?:\/\/.+/.test(currentItem.url_link)) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    const updatedItems = [...(formData.portfolio_items || []), currentItem];
    setFormData((prev) => ({
      ...prev,
      portfolio_items: updatedItems,
    }));
    setCurrentItem({
      title: "",
      description: "",
      url_link: "",
    });
    setError(null);
  };

  const handleRemoveItem = (index) => {
    const filteredItems = (formData.portfolio_items || []).filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      portfolio_items: filteredItems,
    }));
  };

  const portfolioItems = formData.portfolio_items || [];

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium text-gray-900">Your Portfolio</h3>

      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="text-md font-medium text-gray-800 mb-4">
          Add Portfolio Item
        </h4>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={currentItem.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              name="description"
              id="description"
              value={currentItem.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="url_link"
              className="block text-sm font-medium text-gray-700"
            >
              URL Link
            </label>
            <input
              type="url"
              name="url_link"
              id="url_link"
              value={currentItem.url_link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + Add Portfolio Item
        </button>
        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded mt-3">
            {error}
          </div>
        )}
      </div>

      {portfolioItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolioItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    {item.url_link ? (
                      <a
                        href={item.url_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.url_link}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                      aria-label="Remove portfolio item"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No portfolio items added yet. Add your first item above.
        </div>
      )}
    </div>
  );
};

export default Step4;
