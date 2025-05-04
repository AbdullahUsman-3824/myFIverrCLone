import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["Graphics & Design", "Programming", "Writing", "Music"];

function DummyImageUpload({ files, setFile }) {
  return (
    <input
      type="file"
      multiple
      onChange={(e) => setFile([...e.target.files])}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
    />
  );
}

function CreateGigs() {
  const navigate = useNavigate();
  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50";
  const labelClassName = "mb-2 text-lg font-medium text-gray-900";
  const [files, setFile] = useState([]);
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

  const addFeature = () => {
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const createGig = () => {
    alert("Gig created (dummy)!");
    navigate("/seller/gigs");
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">Create a New Gig</h1>
      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClassName}>Gig Title</label>
            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              type="text"
              className={inputClassName}
              placeholder="e.g. I will design your logo"
            />
          </div>
          <div>
            <label className={labelClassName}>Category</label>
            <select
              name="category"
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="">Choose a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClassName}>Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className={inputClassName}
            rows={4}
            placeholder="Describe your gig..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClassName}>Delivery Time (days)</label>
            <input
              type="number"
              name="time"
              value={data.time}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Revisions</label>
            <input
              type="number"
              name="revisions"
              value={data.revisions}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className={labelClassName}>Features</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              name="feature"
              value={data.feature}
              onChange={handleChange}
              className={inputClassName}
              placeholder="e.g. Fast delivery"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1"
              >
                {feature}
                <button
                  onClick={() => removeFeature(idx)}
                  className="text-red-500"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className={labelClassName}>Upload Images</label>
          <DummyImageUpload files={files} setFile={setFile} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClassName}>Short Description</label>
            <input
              type="text"
              name="shortDesc"
              value={data.shortDesc}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Price ($)</label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={createGig}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Create (Dummy)
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGigs;
