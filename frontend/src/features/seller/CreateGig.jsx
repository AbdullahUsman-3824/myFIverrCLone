import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ADD_GIG_ROUTE } from "../../utils/constants";
import { FiPlus } from "react-icons/fi";

const categories = [
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Video & Animation",
  "Writing & Translation",
  "Music & Audio",
  "Business",
  "Data",
  "Photography",
  "AI Services",
];

const CreateGig = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: "",
    category: "",
    description: "",
    time: 0,
    revisions: 0,
    feature: "",
    price: 0,
    shortDesc: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const addFeature = () => {
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, description, price, revisions, time, title, shortDesc } = data;

    if (
      category &&
      description &&
      title &&
      features.length &&
      files.length &&
      price > 0 &&
      shortDesc.length &&
      revisions > 0 &&
      time > 0
    ) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("features", JSON.stringify(features));
      formData.append("price", price);
      formData.append("revisions", revisions);
      formData.append("time", time);
      formData.append("shortDesc", shortDesc);

      try {
        const response = await axios.post(ADD_GIG_ROUTE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          navigate("/seller/gigs");
        }
      } catch (error) {
        console.error("Error creating gig:", error);
      }
    }
  };

  return (
    <div className="min-h-[80vh] pt-28 px-8 md:px-32">
      <h1 className="text-4xl font-bold text-gray-900 mb-5">Create a New Gig</h1>
      <h3 className="text-xl text-gray-600 mb-8">
        Enter the details to create your gig
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Gig Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. I will do something I'm really good at"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={data.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your gig in detail"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Time (days)
            </label>
            <input
              type="number"
              id="time"
              name="time"
              value={data.time}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="revisions" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Revisions
            </label>
            <input
              type="number"
              id="revisions"
              name="revisions"
              value={data.revisions}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="features"
              name="feature"
              value={data.feature}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              id="shortDesc"
              name="shortDesc"
              value={data.shortDesc}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of your gig"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={handleChange}
              min="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Gig Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            accept="image/*"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload up to 3 images to showcase your work
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus />
            Create Gig
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGig; 