import React from "react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import AuctionStepper from "../components/AuctionStepper";
import AuctionPreview from "../components/AuctionPreview";
import AuctionSummary from "../components/AuctionSummary";


const ReviewAuctionPage: React.FC = () => {
  const handleBack = () => {
    window.history.pushState(
      {},
      "",
      "/create-auction?step=auction"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  const handlePublish = () => {
    window.history.pushState(
      {},
      "",
      "/create-auction?step=publish"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <AuctionStepper currentStep={3} />

        <h2 className="mb-5 text-xl font-semibold">
          Review Your Auction
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <AuctionPreview title={""} author={""} category={""} condition={""} photos={[]} />

          <AuctionSummary />
        </div>

        <div className="mt-5 rounded-lg border bg-white p-5">
          <h3 className="font-semibold">
            Book Information
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-5 text-sm">
            <div>
              <span className="text-gray-500">
                Title
              </span>

              <p className="font-medium">
                Atomic Habits
              </p>
            </div>

            <div>
              <span className="text-gray-500">
                Author
              </span>

              <p className="font-medium">
                James Clear
              </p>
            </div>

            <div>
              <span className="text-gray-500">
                Category
              </span>

              <p className="font-medium">
                Self Help
              </p>
            </div>

            <div>
              <span className="text-gray-500">
                Condition
              </span>

              <p className="font-medium">
                Good
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Rb_Button
            variant="secondary"
            onClick={handleBack}
          >
            ← Back
          </Rb_Button>

          <Rb_Button onClick={handlePublish}>
            Publish Auction →
          </Rb_Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAuctionPage;