import React, { useEffect, useRef, useState } from "react";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface BookPhotosProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

const BookPhotos: React.FC<BookPhotosProps> = ({
  images,
  onImagesChange,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    []
  );

  const [error, setError] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /*
   * Create preview URLs whenever uploaded images change
   */
  useEffect(() => {
    const urls = images.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [images]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    setError("");

    const remainingSlots =
      MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(
        "You can upload a maximum of 5 images."
      );
      return;
    }

    const filesToAdd = selectedFiles.slice(
      0,
      remainingSlots
    );

    const invalidFile = filesToAdd.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setError(
        "Please upload JPG/PNG images smaller than 5 MB."
      );
      return;
    }

    onImagesChange([
      ...images,
      ...filesToAdd,
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter(
      (_, imageIndex) => imageIndex !== index
    );

    onImagesChange(updatedImages);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[#6841D8]">
          ▧
        </span>

        <h3 className="text-sm font-semibold text-[#1B1530]">
          Book Photos
        </h3>
      </div>

      <div className="flex items-center gap-5">

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Upload */}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex h-20 w-44 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-[#8B5CF6] bg-purple-50/30 transition hover:bg-purple-50"
          >
            <span className="text-xl text-[#6841D8]">
              ⇧
            </span>

            <p className="mt-1 text-[10px] font-medium">
              Upload Photos
            </p>

            <p className="text-[8px] text-gray-500">
              Drag & drop images or click to browse
            </p>

            <p className="text-[8px] text-gray-400">
              (Max 5 images, JPG/PNG, up to 5MB each)
            </p>
          </button>
        )}

        {/* Uploaded Images */}
        {previewUrls.map((url, index) => (
          <div
            key={url}
            className="relative h-20 w-14 flex-shrink-0"
          >
            <img
              src={url}
              alt={`Book ${index + 1}`}
              className="h-full w-full rounded border border-gray-200 object-cover"
            />

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-xs text-gray-500 shadow-sm hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add More */}
        {images.length > 0 &&
          images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex h-20 w-14 flex-shrink-0 flex-col items-center justify-center rounded border border-dashed border-[#8B5CF6] text-gray-500 hover:bg-purple-50"
            >
              <span className="text-lg">
                +
              </span>

              <span className="text-[9px]">
                Add More
              </span>
            </button>
          )}

      </div>

      {error && (
        <p className="mt-3 text-xs text-red-500">
          {error}
        </p>
      )}

      <p className="mt-3 text-[10px] text-gray-400">
        {images.length}/{MAX_IMAGES} images uploaded
      </p>
    </div>
  );
};

export default BookPhotos;