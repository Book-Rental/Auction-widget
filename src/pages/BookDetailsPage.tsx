import React, { useState } from "react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import AuctionPreview from "../components/AuctionPreview";
import AuctionStepper from "../components/AuctionStepper";
import AuctionSummary from "../components/AuctionSummary";
import BookCondition from "../components/BookCondition";
import BookInformation from "../components/BookInformation";
import BookPhotos from "../components/BookPhotos";


export interface BookFormData {
  title: string;
  author: string;
  category: string;
  edition: string;
  isbn: string;
  condition: string;
  conditionDescription: string;
  photos: File[];
}

const BookDetailsPage: React.FC = () => {
  const [bookData, setBookData] = useState<BookFormData>({
    title: "",
    author: "",
    category: "",
    edition: "",
    isbn: "",
    condition: "good",
    conditionDescription: "",
    photos: [],
  });

  const handleBookInformationChange = (
    field: keyof BookFormData,
    value: string
  ) => {
    setBookData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConditionChange = (value: string) => {
    setBookData((prev) => ({
      ...prev,
      condition: value,
    }));
  };

  const handleConditionDescriptionChange = (
    value: string
  ) => {
    setBookData((prev) => ({
      ...prev,
      conditionDescription: value,
    }));
  };

  const handlePhotosChange = (photos: File[]) => {
    setBookData((prev) => ({
      ...prev,
      photos,
    }));
  };

  const handleNext = () => {
    window.history.pushState(
      {},
      "",
      "/create-auction?step=auction"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] px-6 py-6">
      <div className="mx-auto max-w-7xl">

        {/* Stepper */}
        <AuctionStepper currentStep={1} />

        <div className="grid grid-cols-12 gap-4">

          {/* LEFT SIDE */}
          <div className="col-span-8 space-y-4">

            <BookInformation
              bookData={bookData}
              onChange={handleBookInformationChange}
            />

            <BookCondition
              condition={bookData.condition}
              description={bookData.conditionDescription}
              onConditionChange={handleConditionChange}
              onDescriptionChange={
                handleConditionDescriptionChange
              }
            />

            <BookPhotos
              images={bookData.photos}
              onImagesChange={handlePhotosChange}
            />

          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-4 space-y-4">

            <AuctionPreview
              title={bookData.title}
              author={bookData.author}
              category={bookData.category}
              condition={bookData.condition}
              photos={bookData.photos}
            />

            <AuctionSummary />

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-end gap-3">

          <Rb_Button variant="secondary">
            Save as Draft
          </Rb_Button>

          <Rb_Button onClick={handleNext}>
            Next: Auction Details →
          </Rb_Button>

        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;