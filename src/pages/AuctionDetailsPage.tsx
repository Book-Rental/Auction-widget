import React from "react";
import { Rb_Button, Rb_Input } from "@rentbook/rentbook-ui-lib";
import AuctionStepper from "../components/AuctionStepper";

const AuctionDetailsPage: React.FC = () => {
  const handleBack = () => {
    window.history.pushState(
      {},
      "",
      "/create-auction?step=book"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  const handleNext = () => {
    window.history.pushState(
      {},
      "",
      "/create-auction?step=review"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <AuctionStepper currentStep={2} />

        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold">
            Auction Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Set the details for your book auction.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Starting Bid *
              </label>

              <Rb_Input
                placeholder="Enter starting bid"
                type="number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Buy Now Price
              </label>

              <Rb_Input
                placeholder="Optional"
                type="number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Auction Duration *
              </label>

              <select className="h-10 w-full rounded-md border px-3 text-sm">
                <option>Select duration</option>
                <option>1 Day</option>
                <option>3 Days</option>
                <option>5 Days</option>
                <option>7 Days</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date *
              </label>

              <Rb_Input type="date" />
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

          <Rb_Button onClick={handleNext}>
            Next: Review →
          </Rb_Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsPage;