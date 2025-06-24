import { FiUpload, FiX } from "react-icons/fi";
import { useRef, useState, useCallback } from "react";
import ErrorMessage from "../../../components/common/ErrorMessage";

const ImageUploader = ({
  thumbnail,
  gallery,
  onThumbnailChange,
  onGalleryAdd,
  onGalleryRemove,
  error,
}) => {
  const galleryInputRef = useRef();
  const thumbnailInputRef = useRef();
  const [isThumbnailDragOver, setIsThumbnailDragOver] = useState(false);
  const [isGalleryDragOver, setIsGalleryDragOver] = useState(false);

  const handleFiles = useCallback((files, addFilesCallback) => {
    const validFiles = Array.from(files)
      .map((file) => {
        const type = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : null;
        return type ? { media_type: type, media_file: file } : null;
      })
      .filter(Boolean);

    if (validFiles.length > 0) {
      addFilesCallback(validFiles);
    }
  }, []);

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    setIsThumbnailDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFile = Array.from(e.dataTransfer.files).find((file) =>
        file.type.startsWith("image")
      );
      if (imageFile) {
        onThumbnailChange(imageFile);
      }
      e.dataTransfer.clearData();
    }
  };

  const handleGalleryDrop = (e) => {
    e.preventDefault();
    setIsGalleryDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files, onGalleryAdd);
      e.dataTransfer.clearData();
    }
  };

  const handleGallerySelect = (e) => {
    handleFiles(e.target.files, onGalleryAdd);
    galleryInputRef.current.value = null;
  };

  const handleThumbnailSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onThumbnailChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail Upload Dropzone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image
        </label>

        <div
          className={`relative flex items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 h-48 w-full ${
            isThumbnailDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          } cursor-pointer hover:border-blue-400`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsThumbnailDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsThumbnailDragOver(false);
          }}
          onDrop={handleThumbnailDrop}
          onClick={() => thumbnailInputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              thumbnailInputRef.current.click();
            }
          }}
          aria-label="Upload thumbnail image by drop or click"
        >
          {thumbnail ? (
            <div className="relative h-full flex items-center justify-center">
              <img
                src={
                  thumbnail instanceof File
                    ? URL.createObjectURL(thumbnail)
                    : thumbnail
                }
                alt="Thumbnail Preview"
                className="max-h-[10rem] max-w-full rounded-lg border border-gray-300 shadow object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onThumbnailChange(null);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
                aria-label="Remove thumbnail"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 select-none text-center">
              <FiUpload size={48} className="mb-2" />
              <p className="text-sm">
                Drag & drop a thumbnail image here, or click to select
              </p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailSelect}
          ref={thumbnailInputRef}
          className="hidden"
        />
      </div>
      {error && (
        <ErrorMessage error={error.thumbnail_image} name="thumbnail_image" />
      )}

      {/* Gallery Upload Dropzone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gallery (Images/Videos)
        </label>

        <div
          className={`relative flex flex-wrap gap-4 p-6 border-2 border-dashed rounded-xl transition-all duration-200 min-h-[8rem] w-full ${
            isGalleryDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          } cursor-pointer hover:border-blue-400`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsGalleryDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsGalleryDragOver(false);
          }}
          onDrop={handleGalleryDrop}
          onClick={() => galleryInputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              galleryInputRef.current.click();
            }
          }}
          aria-label="Upload gallery images or videos by drop or click"
        >
          {gallery?.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full text-gray-400 text-sm select-none">
              <FiUpload size={28} className="mb-1" />
              Drag & drop images or videos here, or click to select
            </div>
          )}
          {gallery?.map((item, index) => (
            <div
              key={index}
              className="relative w-28 h-28 bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden group transition-transform hover:scale-[1.02]"
            >
              {item.media_type === "image" ? (
                <img
                  src={
                    item.media_file instanceof File
                      ? URL.createObjectURL(item.media_file)
                      : item.media_file
                  }
                  alt="Gallery item"
                  className="object-cover w-full h-full"
                />
              ) : (
                <video
                  src={
                    item.media_file instanceof File
                      ? URL.createObjectURL(item.media_file)
                      : item.media_file
                  }
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onGalleryRemove(index);
                }}
                className="absolute top-1 right-1 bg-white/90 group-hover:bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
                aria-label={`Remove gallery item ${index + 1}`}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleGallerySelect}
          ref={galleryInputRef}
          className="hidden"
        />
        {error && <ErrorMessage error={error.gallery} name="gallery" />}
      </div>
    </div>
  );
};

export default ImageUploader;
