import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const GigGallery = ({ gigData }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Combine thumbnail and gallery into one normalized list
  useEffect(() => {
    if (gigData) {
      const combined = [
        { url: gigData.thumbnail_image, type: "image" },
        ...gigData.gallery.map((item) => ({
          url: item.media_file,
          type: item.media_type,
        })),
      ];
      setMediaItems(combined);
    }
  }, [gigData]);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [mediaItems]);

  if (mediaItems.length === 0) return null;

  return (
    <div className="p-6 mb-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 relative">
          {mediaItems[selectedIndex].type === "video" ? (
            <video
              src={mediaItems[selectedIndex].url}
              controls
              className="w-full h-96 object-cover rounded-lg transition duration-300"
            />
          ) : (
            <img
              src={mediaItems[selectedIndex].url}
              alt={`Media ${selectedIndex + 1}`}
              className="w-full h-96 object-cover rounded-lg transition duration-300"
            />
          )}
          {/* Navigation Arrows */}
          <button
            onClick={() =>
              goToIndex(
                (selectedIndex - 1 + mediaItems.length) % mediaItems.length
              )
            }
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 shadow transition"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={() => goToIndex((selectedIndex + 1) % mediaItems.length)}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 shadow transition"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Preview row */}
        <div className="flex gap-3 col-span-4 overflow-x-auto">
          {mediaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                selectedIndex === index
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <div
                className={`absolute inset-0 ${
                  selectedIndex === index ? "" : "bg-white bg-opacity-50 blur"
                }`}
              ></div>
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="w-24 h-16 object-cover"
                  muted
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-16 object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GigGallery;
