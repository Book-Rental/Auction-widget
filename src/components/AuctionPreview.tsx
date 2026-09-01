import React, { useEffect, useState } from "react";

interface AuctionPreviewProps {
  title: string;
  author: string;
  category: string;
  condition: string;
  photos: File[];
}

const getConditionLabel = (
  condition: string
) => {
  const labels: Record<string, string> = {
    new: "New",
    "like-new": "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  };

  return labels[condition] || "Good";
};

const AuctionPreview: React.FC<
  AuctionPreviewProps
> = ({
  title,
  author,
  category,
  condition,
  photos,
}) => {
  const [imageUrl, setImageUrl] =
    useState<string>("");

  useEffect(() => {
    if (!photos.length) {
      setImageUrl("");
      return;
    }

    const url = URL.createObjectURL(
      photos[0]
    );

    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photos]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[#6841D8]">
          ◉
        </span>

        <h3 className="text-sm font-semibold text-[#1B1530]">
          Auction Preview
        </h3>
      </div>

      <div className="flex gap-4">

        {/* Book Image */}
        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || "Book"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[9px] text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="min-w-0 flex-1">

          <h3 className="truncate text-sm font-semibold text-[#1B1530]">
            {title || "Book Title"}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            by {author || "Author Name"}
          </p>

          <span className="mt-3 inline-block rounded bg-yellow-100 px-2 py-1 text-[10px] text-yellow-700">
            {getConditionLabel(condition)}
          </span>

          <div className="mt-3 flex gap-8">

            {/* Category */}
            <div>
              <p className="text-[10px] text-gray-500">
                Category
              </p>

              <p className="mt-1 text-xs text-[#1B1530]">
                {category || "Not selected"}
              </p>
            </div>

            {/* Condition */}
            <div>
              <p className="text-[10px] text-gray-500">
                Condition
              </p>

              <p className="mt-1 text-xs text-[#1B1530]">
                {getConditionLabel(condition)}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPreview;